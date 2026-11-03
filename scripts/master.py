"""Step 8: the master. Renders the episode (automatically using memory-safe 3000-frame chunks for long episodes > 3600 frames
with chunk resume and automatic retry on transient browser launch timeouts), then brings the mix to -14 LUFS with true peaks
under -1 dBTP (two-pass loudnorm, video copied untouched), measures the result and writes the report.

python <skill>/scripts/master.py <slug> [--skip-render] [--concurrency 4] [--scale 0.5]
Writes out/<slug>/<slug>-raw.mp4, out/<slug>/<slug>-final.mp4 and out/<slug>/report.json
"""
import json, subprocess, sys, time

from wi import FFMPEG, FFPROBE, STUDIO, ep_dir, load_episode, load_json, loudness, out_dir, save_json

slug = sys.argv[1]
args = sys.argv[2:]
conc = args[args.index('--concurrency') + 1] if '--concurrency' in args else '4'
scale = args[args.index('--scale') + 1] if '--scale' in args else None
force = '--force-render' in args
ep = load_episode(slug)
od = out_dir(slug)
raw = od / f'{slug}-raw.mp4'
final = od / f'{slug}-final.mp4'
npx = 'npx.cmd' if sys.platform == 'win32' else 'npx'
tl = load_json(ep_dir(slug) / 'timeline.json')
total_frames = int(tl['total'])
fps = int(tl.get('fps', 24))


def chunk_is_valid(path, expected_frames):
    if not path.exists() or path.stat().st_size < 4096:
        return False
    try:
        out = subprocess.run(
            [FFPROBE, '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        dur = float(out)
        expected_dur = expected_frames / fps
        return abs(dur - expected_dur) <= 0.25
    except Exception:
        return False


if '--skip-render' not in args:
    t0 = time.time()
    chunk_size = 3000
    if total_frames > 3600:
        chunks_dir = od / 'chunks'
        chunks_dir.mkdir(parents=True, exist_ok=True)
        ranges = []
        start = 0
        while start < total_frames:
            end = min(total_frames - 1, start + chunk_size - 1)
            ranges.append((start, end))
            start = end + 1
        chunk_files = []
        for idx, (f0, f1) in enumerate(ranges, 1):
            cfile = chunks_dir / f'chunk_{idx:02d}_{f0}_{f1}.mp4'
            chunk_files.append(cfile)
            expected_frames = f1 - f0 + 1
            if not force and chunk_is_valid(cfile, expected_frames):
                print(f'[master] Reusing verified chunk {idx}/{len(ranges)} (frames {f0}..{f1})')
                continue
            cmd = [
                npx, 'remotion', 'render', 'src/index.ts', ep['id'], str(cfile),
                '--frames', f'{f0}-{f1}', '--log', 'error', '--timeout', '120000',
                '--concurrency', conc,
            ]
            if scale:
                cmd += ['--scale', scale]
            for attempt in range(1, 4):
                tc = time.time()
                print(f'[master] Rendering chunk {idx}/{len(ranges)} (frames {f0}..{f1}, attempt {attempt}/3)...')
                res = subprocess.run(cmd, cwd=STUDIO)
                if res.returncode == 0 and chunk_is_valid(cfile, expected_frames):
                    print(f'[master] Chunk {idx}/{len(ranges)} done in {time.time() - tc:.0f}s')
                    break
                print(f'[master] Chunk {idx}/{len(ranges)} attempt {attempt} failed (code {res.returncode}); retrying in 3s...')
                time.sleep(3)
            else:
                raise RuntimeError(f'Failed to render chunk {idx}/{len(ranges)} (frames {f0}..{f1}) after 3 attempts')
        concat_list = chunks_dir / 'concat.txt'
        concat_list.write_text(
            '\n'.join(f"file '{cf.resolve().as_posix()}'" for cf in chunk_files) + '\n',
            encoding='utf-8',
        )
        subprocess.run(
            [FFMPEG, '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(concat_list), '-c', 'copy', str(raw)],
            check=True,
        )
        print(f'rendered {len(ranges)} chunks ({total_frames} frames) in {time.time() - t0:.0f} s')
    else:
        cmd = [npx, 'remotion', 'render', 'src/index.ts', ep['id'], str(raw), '--log', 'error', '--timeout', '90000']
        if conc:
            cmd += ['--concurrency', conc]
        if scale:
            cmd += ['--scale', scale]
        print(' '.join(cmd))
        subprocess.run(cmd, cwd=STUDIO, check=True)
        print(f'rendered in {time.time() - t0:.0f} s')

I, TP, LRA = -14.0, -1.5, 11
first = subprocess.run([FFMPEG, '-hide_banner', '-nostats', '-i', str(raw), '-af', f'loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
m = json.loads(first[first.rfind('{'):first.rfind('}') + 1])
filt = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run([FFMPEG, '-y', '-v', 'error', '-i', str(raw), '-c:v', 'copy', '-af', filt, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', str(final)], check=True)
lufs, peak = loudness(final)
tp = subprocess.run([FFMPEG, '-hide_banner', '-nostats', '-i', str(final), '-af', f'loudnorm=I={I}:TP={TP}:print_format=json', '-f', 'null', '-'],
                    capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
true_peak = float(json.loads(tp[tp.rfind('{'):tp.rfind('}') + 1])['input_tp'])
dur = float(subprocess.run([FFPROBE, '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(final)], capture_output=True, text=True).stdout.strip())
costs = load_json(od / 'costs.json', [])
report = {
    'episode': ep['id'], 'file': str(final), 'seconds': round(dur, 2), 'lufs': lufs, 'true_peak_dbtp': true_peak,
    'segments': len(tl['segments']), 'cuts_per_min': round((len(tl['segments']) - 1) / (tl['total'] / tl['fps']) * 60, 1),
    'elevenlabs_credits': sum(c['credits'] for c in costs), 'cost_lines': costs,
}
save_json(od / 'report.json', report)
print(json.dumps({k: v for k, v in report.items() if k != 'cost_lines'}, indent=1))
ok = abs(lufs + 14) <= 0.5 and true_peak <= -1.0
print('loudness OK' if ok else '! loudness off target: check the report')
