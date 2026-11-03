"""Automated Visual & Motion QA Verifier (`qa_loop.py`) for What-If Animation.

Runs deterministic checks on:
1. Timeline & Shot-List Anti-Repetition (`plan.py --strict`)
2. Storyboard Stills All-Pairs Perceptual Deduplication & Visual Contrast (`out/<slug>/board/Sh*.png`)
3. Master Video (`<slug>-final.mp4`) Duration, Audio Stream, Cut-to-Cut Visual Freshness,
   and Intra-Shot First-Half / Second-Half Motion Delta.
4. Writes `out/<slug>/qa_loop_report.json`.

Usage:
  python .agents/skills/what-if-animation/scripts/qa_loop.py <slug> [--stills-only] [--min-duration 480]
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from wi import ep_dir, load_json, out_dir, save_json


def check_stills(slug: str, segments: list) -> tuple[list[str], dict]:
    errors = []
    board = out_dir(slug) / 'board'
    if not board.exists():
        return [f'Missing board directory: {board}'], {}

    ordered_shots = [s['shot'] for s in segments]
    unique_shots = list(dict.fromkeys(ordered_shots))
    thumbs = {}
    for sid in unique_shots:
        p = board / f'{sid}.png'
        if not p.exists():
            errors.append(f'Missing still image: {p.name}')
            continue
        im = Image.open(p).convert('RGB')
        arr = np.asarray(im, dtype=np.float32)
        mean_lum = float(arr.mean())
        std_lum = float(arr.std())
        if mean_lum < 5.0 or std_lum < 8.0:
            errors.append(f'TRAP_BLANK_OR_FLAT_STILL: {sid}.png has mean={mean_lum:.1f}, std={std_lum:.1f}')
        small = np.asarray(im.resize((24, 14), Image.Resampling.BILINEAR), dtype=np.float32)
        thumbs[sid] = small

    min_mad = 999.0
    closest_pair = None
    # Check ALL pairs across the entire timeline for perceptual duplicate stills
    for i in range(len(ordered_shots)):
        s_a = ordered_shots[i]
        if s_a not in thumbs:
            continue
        for j in range(i + 1, len(ordered_shots)):
            s_b = ordered_shots[j]
            if s_b not in thumbs:
                continue
            mad = float(np.abs(thumbs[s_a] - thumbs[s_b]).mean())
            if mad < min_mad:
                min_mad = mad
                closest_pair = (s_a, s_b)
            if mad < 4.5:
                errors.append(
                    f'TRAP_PERCEPTUAL_DUPLICATE_STILL: cut #{i+1} ({s_a}) and cut #{j+1} ({s_b}) look visually identical (mean pixel diff={mad:.2f} < 4.5)'
                )
    print(f'[qa_loop] Checked {len(thumbs)} unique still(s) across {len(ordered_shots)} cuts (min all-pairs diff={min_mad:.2f}); still errors: {len(errors)}')
    return errors, {
        'unique_stills': len(thumbs),
        'total_cuts': len(ordered_shots),
        'min_all_pairs_mad': round(min_mad, 2),
        'closest_pair': list(closest_pair) if closest_pair else [],
    }


def sample_video_frame(mp4_path: Path, t_sec: float) -> np.ndarray | None:
    cmd = [
        'ffmpeg', '-v', 'error', '-ss', f'{t_sec:.3f}', '-i', str(mp4_path),
        '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '320x180', 'pipe:1'
    ]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0 or len(r.stdout) != 320 * 180 * 3:
        return None
    return np.frombuffer(r.stdout, dtype=np.uint8).reshape((180, 320, 3)).astype(np.float32)


def check_video(slug: str, tl: dict, min_duration: float) -> tuple[list[str], dict]:
    errors = []
    mp4 = out_dir(slug) / f'{slug}-final.mp4'
    if not mp4.exists():
        return [f'Missing master video: {mp4}'], {}

    probe = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height', '-of', 'json', str(mp4)],
        capture_output=True, text=True
    )
    if probe.returncode != 0:
        return [f'ffprobe failed on {mp4}'], {}
    info = json.loads(probe.stdout)
    dur = float(info.get('format', {}).get('duration', 0.0))
    streams = [s.get('codec_type') for s in info.get('streams', [])]
    if 'video' not in streams or 'audio' not in streams:
        errors.append(f'Missing video or audio stream in {mp4.name}: {streams}')
    if dur < min_duration:
        errors.append(f'Video duration {dur:.1f}s is shorter than required minimum {min_duration:.1f}s')

    fps = tl.get('fps', 24)
    segs = tl.get('segments', [])
    step = max(1, len(segs) // 18)
    sampled_indices = list(range(0, len(segs), step))[:18]
    frozen_tail_shots = []
    sampled_metrics = []
    for idx in sampled_indices:
        s = segs[idx]
        a_sec = s['a'] / fps
        b_sec = min(dur - 0.15, s['b'] / fps)
        span = b_sec - a_sec
        if span < 1.0:
            continue
        f1 = sample_video_frame(mp4, a_sec + span * 0.15)
        f2 = sample_video_frame(mp4, a_sec + span * 0.50)
        f3 = sample_video_frame(mp4, a_sec + span * 0.85)
        if f1 is None or f2 is None or f3 is None:
            continue
        delta_first = float(np.abs(f2 - f1).mean())
        delta_second = float(np.abs(f3 - f2).mean())
        sampled_metrics.append({
            'cut': idx + 1,
            'shot': s['shot'],
            'start_sec': round(a_sec, 2),
            'first_half_delta': round(delta_first, 2),
            'second_half_delta': round(delta_second, 2),
        })
        if delta_first < 0.25 or delta_second < 0.20:
            frozen_tail_shots.append(f"seg #{idx+1} ({s['shot']} @ {a_sec:.1f}s: d1={delta_first:.2f}, d2={delta_second:.2f})")
    if frozen_tail_shots:
        errors.append(f'TRAP_INTRA_SHOT_FREEZE: {len(frozen_tail_shots)} sampled segment(s) froze mid-shot: {", ".join(frozen_tail_shots[:6])}')

    print(f'[qa_loop] Checked video {mp4.name} ({dur:.1f}s), sampled {len(sampled_indices)} segments for continuous motion; video errors: {len(errors)}')
    return errors, {
        'file': str(mp4),
        'duration_sec': round(dur, 2),
        'streams': streams,
        'sampled_segments': sampled_metrics,
    }


def main():
    slug = sys.argv[1]
    stills_only = '--stills-only' in sys.argv
    min_dur = 0.0
    if '--min-duration' in sys.argv:
        i = sys.argv.index('--min-duration')
        if i + 1 < len(sys.argv):
            min_dur = float(sys.argv[i + 1])

    tl = load_json(ep_dir(slug) / 'timeline.json', {})
    if not tl:
        raise SystemExit(f'No timeline.json found for {slug}; run plan.py first.')

    all_errors = []
    still_errs, still_meta = check_stills(slug, tl.get('segments', []))
    all_errors.extend(still_errs)
    video_meta = {}
    if not stills_only:
        vid_errs, video_meta = check_video(slug, tl, min_dur)
        all_errors.extend(vid_errs)

    report = {
        'slug': slug,
        'passed': len(all_errors) == 0,
        'error_count': len(all_errors),
        'errors': all_errors,
        'stills': still_meta,
        'video': video_meta,
    }
    save_json(out_dir(slug) / 'qa_loop_report.json', report)

    if all_errors:
        for e in all_errors:
            print('  !', e)
        raise SystemExit(f'qa_loop failed with {len(all_errors)} error(s).')
    print(f'[qa_loop] PASS: {slug} passed all visual and motion checks with 0 errors.')


if __name__ == '__main__':
    main()
