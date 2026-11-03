"""Step 2: the voice. Uses the existing Lemo-Opuscar TTS skill & tools (`F:\\du an python\\lemo-opuscar-thanks\\core\\tts\\`)
with word timestamps, per-beat caching (`voices/<id>.wav` + `dur.json`), and genre-paced pause tightening.

Default TTS Routing (Lemo-Opuscar + Antigravity Global Rule):
- Vietnamese (`vi`), English (`en`), & 600+ non-Japanese languages:
  Routes to `F:\\du an python\\lemo-opuscar-thanks\\core\\tts\\tts_omnivoice.py` via `F:\\du an python\\OmniVoice\\.venv\\Scripts\\python.exe`
  using cached zero-shot VoiceClonePrompt presets (`dratelling` default for `vi`, `bradikinin` default for `en`, `0726` for healing/memoir)
  and `clean_studio_voice` DSP de-hiss/noise-gate post-processing.
- Curated Genre Voices (`--provider ai33` or `--provider edge`, or `voice.id` from `core/tts/VOICE_CATALOG.md`):
  Routes to `F:\\du an python\\lemo-opuscar-thanks\\core\\tts\\tts_ai33.py` (`minimax_*`, `vbee_*`, `edge_vi-VN-NamMinhNeural`,
  `edge_vi-VN-HoaiMyNeural`, `kokoro_af_heart`, etc., with `--offline-edge` fallback).
- Japanese (`ja` / `jp`):
  Mandatory AivisSpeech (`http://127.0.0.1:10101`, non-Normal `style_id`, `pitchScale=0.0` locked, PCM `postPauseSec`).
- ElevenLabs Direct (`--provider elevenlabs`):
  Uses `ELEVENLABS_API_KEY` with `/with-timestamps` and logs credits.

Usage:
    python <skill>/scripts/voice.py <slug> [--provider auto|omnivoice|ai33|edge|aivisspeech|elevenlabs|local_synth] [--preset dratelling|bradikinin|0726] [--force]
"""
import base64, hashlib, json, math, os, pathlib, re, subprocess, sys, time, urllib.request

import numpy as np

from wi import (
    FFMPEG,
    SR,
    api,
    decode,
    ep_dir,
    has_api_key,
    load_episode,
    load_json,
    log_cost,
    out_dir,
    pub_dir,
    save_json,
    spent_since,
    validate_spoken_text_beats,
    write_wav,
)

OMNIVOICE_PYTHON = pathlib.Path(r'F:\du an python\OmniVoice\.venv\Scripts\python.exe')
AIVISSPEECH_ENDPOINT = 'http://127.0.0.1:10101'


def resolve_lemo_opuscar_root() -> pathlib.Path:
    env_lib = os.environ.get('LEMO_OPUSCAR_LIB') or os.environ.get('LIB')
    if env_lib and pathlib.Path(env_lib).is_dir():
        return pathlib.Path(env_lib)
    lib_path_file = pathlib.Path.home() / '.gemini' / 'config' / 'skills' / 'lemo-opuscar' / 'scripts' / '.lib-path'
    if lib_path_file.is_file():
        candidate = pathlib.Path(lib_path_file.read_text(encoding='utf-8').strip())
        if candidate.is_dir():
            return candidate
    default_root = pathlib.Path(r'F:\du an python\lemo-opuscar-thanks')
    return default_root


LEMO_ROOT = resolve_lemo_opuscar_root()
LEMO_TTS_OMNIVOICE = LEMO_ROOT / 'core' / 'tts' / 'tts_omnivoice.py'
LEMO_TTS_AI33 = LEMO_ROOT / 'core' / 'tts' / 'tts_ai33.py'
LEMO_PYTHON = LEMO_ROOT / '.venv' / 'Scripts' / 'python.exe'
if not LEMO_PYTHON.exists():
    LEMO_PYTHON = pathlib.Path(sys.executable)

slug = sys.argv[1]
force = '--force' in sys.argv
prov_arg = sys.argv[sys.argv.index('--provider') + 1] if '--provider' in sys.argv else 'auto'
preset_arg = sys.argv[sys.argv.index('--preset') + 1] if '--preset' in sys.argv else None

ep = load_episode(slug)
validate_spoken_text_beats(ep.get('script', []), strict=True)

lang = str(ep.get('language') or ep.get('voice', {}).get('language') or 'vi').lower()
is_ja = lang.startswith('ja') or lang in ('jp', 'japanese')
is_vi = lang.startswith('vi') or lang == 'vietnamese'

V = {
    'provider': prov_arg,
    'language': lang,
    'preset': preset_arg or ('dratelling' if is_vi else 'bradikinin'),
    'id': 'TX3LPaxmHKxFdv7VOQHJ',
    'category': 'documentary_scientific_investigative',
    'speed': 1.0,
    'num_step': 32,
    'model': 'eleven_multilingual_v2',
    'settings': {'stability': 0.4, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True},
    # AivisSpeech AudioQuery defaults
    'style_id': 888753761,
    'intonationScale': 1.2,
    'tempoDynamicsScale': 1.15,
    'speedScale': 1.0,
    'volumeScale': 1.0,
    'pitchScale': 0.0,
    'postPauseSec': 0.18,
}
V.update(ep.get('voice', {}))
if prov_arg != 'auto':
    V['provider'] = prov_arg
if preset_arg:
    V['preset'] = preset_arg

voice_id_str = str(V.get('id') or V.get('voice_id') or '')
is_catalog_voice = voice_id_str.startswith(('minimax_', 'vbee_', 'edge_', 'kokoro_', 'fishaudio_', 'clone_'))

if V['provider'] == 'auto':
    if is_ja:
        V['provider'] = 'aivisspeech'
    elif is_catalog_voice and LEMO_TTS_AI33.exists():
        V['provider'] = 'ai33'
    elif OMNIVOICE_PYTHON.exists() and LEMO_TTS_OMNIVOICE.exists():
        V['provider'] = 'omnivoice'
    elif OMNIVOICE_PYTHON.exists():
        V['provider'] = 'omnivoice'
    elif LEMO_TTS_AI33.exists():
        V['provider'] = 'edge'
    elif has_api_key():
        V['provider'] = 'elevenlabs'
    else:
        V['provider'] = 'local_synth'

provider = V['provider']
display_text = ' '.join(b['text'].strip() for b in ep['script'])
spoken_full = ' '.join((b.get('spoken_text') or b.get('tts_text') or b.get('say') or b['text']).strip() for b in ep['script'])
sig = hashlib.sha1(json.dumps([display_text, spoken_full, V, ep.get('target_duration_sec')], sort_keys=True).encode()).hexdigest()[:12]

raw_mp3 = pub_dir(slug) / 'voice_raw.mp3'
raw_words = out_dir(slug) / 'words_raw.json'
meta = load_json(out_dir(slug) / 'voice_meta.json', {})


def extract_words_from_text_and_duration(text_str, start_sec, duration_sec):
    """Distributes word timings proportionally by character weight across [start_sec, start_sec + duration_sec]."""
    tokens = re.findall(r"[\w'’]+|[^\w\s'’]+", text_str)
    word_items = []
    for tok in tokens:
        if re.match(r"[\w'’]+", tok):
            word_items.append({'w': tok, 'p': ''})
        elif word_items:
            word_items[-1]['p'] += tok
    if not word_items:
        return []
    weights = [max(2, len(w['w'])) + (1.5 if w['p'] else 0.3) for w in word_items]
    total_w = sum(weights)
    cur_t = start_sec
    out_w = []
    for item, wt in zip(word_items, weights):
        slot = duration_sec * (wt / total_w)
        pause = min(slot * 0.25, 0.14 if item['p'] else 0.04)
        w_dur = max(0.06, slot - pause)
        out_w.append({
            'w': item['w'],
            's': round(cur_t, 3),
            'e': round(cur_t + w_dur, 3),
            'p': item['p'],
        })
        cur_t += slot
    return out_w


def build_lemo_lines_payload():
    """Converts episode.json script beats into Lemo-Opuscar lines.json format."""
    lines = []
    for idx, beat in enumerate(ep['script']):
        lid = beat.get('id') or f'b{idx + 1:02d}'
        disp = beat['text'].strip()
        spok = (beat.get('spoken_text') or beat.get('tts_text') or beat.get('say') or disp).strip()
        item = {
            'id': lid,
            'sceneId': lid,
            'text': disp,
            'sub': disp,
            'say': spok,
            'pad_after': float(beat.get('postPauseSec', V.get('postPauseSec', 0.18))),
        }
        if beat.get('voice') or beat.get('voice_id'):
            item['voice'] = beat.get('voice') or beat.get('voice_id')
        lines.append(item)
    return lines


def synthesize_beats_via_lemo_tts(mode):
    voices_dir = out_dir(slug) / 'voices'
    voices_dir.mkdir(parents=True, exist_ok=True)
    lines_payload = build_lemo_lines_payload()
    lines_path = out_dir(slug) / 'lines.json'
    cues_path = out_dir(slug) / 'cues.json'
    save_json(lines_path, lines_payload)

    all_cached = (not force) and all(
        (voices_dir / f"{item['id']}.wav").exists() and (voices_dir / f"{item['id']}.wav").stat().st_size > 1000
        for item in lines_payload
    )
    if all_cached:
        print(f'[Lemo-Opuscar TTS] Reusing {len(lines_payload)} cached WAV files in {voices_dir}')
    elif mode == 'omnivoice' and LEMO_TTS_OMNIVOICE.exists():
        preset = str(V.get('preset') or ('dratelling' if is_vi else 'bradikinin'))
        if preset not in ('dratelling', 'bradikinin', '0726'):
            preset = 'dratelling' if is_vi else 'bradikinin'
        lang_arg = 'Vietnamese' if is_vi else ('English' if lang.startswith('en') else 'auto')
        cmd = [
            str(OMNIVOICE_PYTHON),
            str(LEMO_TTS_OMNIVOICE),
            str(lines_path),
            str(voices_dir),
            '--cues', str(cues_path),
            '--preset', preset,
            '--lang', lang_arg,
            '--speed', str(V.get('speed', 1.0)),
            '--num-step', str(int(V.get('num_step', 32))),
        ]
        if not force:
            cmd.append('--skip-existing')
        if V.get('ref_audio'):
            cmd += ['--ref-audio', str(V['ref_audio'])]
        if V.get('ref_text'):
            cmd += ['--ref-text', str(V['ref_text'])]
        if V.get('prompt_cache'):
            cmd += ['--prompt-cache', str(V['prompt_cache'])]
        print(f'[Lemo-Opuscar TTS] Running tts_omnivoice.py (preset={preset}, lang={lang_arg})...')
        proc = subprocess.run(cmd, cwd=str(LEMO_ROOT), capture_output=True, text=True, encoding='utf-8', errors='replace')
        if proc.returncode != 0:
            raise RuntimeError(f"tts_omnivoice.py failed:\n{proc.stderr or proc.stdout}")
        if proc.stdout:
            print(proc.stdout.strip())

    elif mode in ('ai33', 'edge') and LEMO_TTS_AI33.exists():
        voice_choice = voice_id_str if is_catalog_voice else ('edge_vi-VN-NamMinhNeural' if is_vi else 'kokoro_af_heart')
        cmd = [
            str(LEMO_PYTHON),
            str(LEMO_TTS_AI33),
            str(lines_path),
            str(voices_dir),
            '--voice', voice_choice,
            '--category', str(V.get('category', 'documentary_scientific_investigative')),
            '--speed', str(V.get('speed', 1.0)),
        ]
        if mode == 'edge' or V.get('offline_edge'):
            cmd.append('--offline-edge')
        print(f'[Lemo-Opuscar TTS] Running tts_ai33.py (voice={voice_choice})...')
        proc = subprocess.run(cmd, cwd=str(LEMO_ROOT), capture_output=True, text=True, encoding='utf-8', errors='replace')
        if proc.returncode != 0:
            raise RuntimeError(f"tts_ai33.py failed:\n{proc.stderr or proc.stdout}")
        if proc.stdout:
            print(proc.stdout.strip())

    beat_wavs = []
    all_words = []
    cursor = 0.0

    for idx, beat in enumerate(ep['script']):
        lid = beat.get('id') or f'b{idx + 1:02d}'
        b_disp = beat['text'].strip()
        b_spok = (beat.get('spoken_text') or beat.get('tts_text') or beat.get('say') or b_disp).strip()
        beat_wav = voices_dir / f'{lid}.wav'

        if mode == 'aivisspeech':
            if float(V.get('pitchScale', 0.0)) != 0.0:
                raise SystemExit('AivisSpeech rule violation: pitchScale MUST be locked to 0.0.')
            style_id = beat.get('style_id', V['style_id'])
            q_url = f"{AIVISSPEECH_ENDPOINT}/audio_query?text={urllib.parse.quote(b_spok)}&speaker={style_id}"
            req = urllib.request.Request(q_url, method='POST')
            with urllib.request.urlopen(req, timeout=30) as r:
                query = json.loads(r.read().decode('utf-8'))
            query['intonationScale'] = float(beat.get('intonationScale', V['intonationScale']))
            query['tempoDynamicsScale'] = float(beat.get('tempoDynamicsScale', V['tempoDynamicsScale']))
            query['speedScale'] = float(beat.get('speedScale', V['speedScale']))
            query['volumeScale'] = float(beat.get('volumeScale', V['volumeScale']))
            query['pitchScale'] = 0.0
            s_req = urllib.request.Request(
                f"{AIVISSPEECH_ENDPOINT}/synthesis?speaker={style_id}",
                data=json.dumps(query).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST',
            )
            with urllib.request.urlopen(s_req, timeout=60) as r:
                beat_wav.write_bytes(r.read())
            samples = decode(beat_wav)
            speech_dur = len(samples) / SR
            post_pause = float(beat.get('postPauseSec', V.get('postPauseSec', 0.22)))
            if post_pause > 0:
                samples = np.concatenate([samples, np.zeros(int(round(post_pause * SR)))])
        elif mode in ('omnivoice', 'ai33', 'edge') and beat_wav.exists():
            samples = decode(beat_wav)
            speech_dur = len(samples) / SR
            post_pause = float(beat.get('postPauseSec', V.get('postPauseSec', 0.18)))
            target_sec = float(beat.get('target_sec', 0.0))
            if target_sec > speech_dur + post_pause:
                post_pause = target_sec - speech_dur
            if post_pause > 0:
                samples = np.concatenate([samples, np.zeros(int(round(post_pause * SR)))])
        else:
            # Deterministic local vocal-formant synthesis timed to natural 2.7 words/sec cadence
            w_list = re.findall(r"[\w'’]+", b_disp)
            dur = float(beat.get('target_sec') or max(0.8, len(w_list) / 2.75))
            n_samp = int(round(dur * SR))
            t = np.linspace(0, dur, n_samp, endpoint=False)
            f0 = 135.0 + 18.0 * np.sin(2 * math.pi * 2.2 * t)
            syll = 0.55 + 0.45 * np.sin(2 * math.pi * max(1, len(w_list)) * (t / dur) - math.pi / 2)
            carrier = (
                np.sin(2 * math.pi * f0 * t) * 0.55
                + np.sin(2 * math.pi * f0 * 2 * t) * 0.28
                + np.sin(2 * math.pi * f0 * 3 * t) * 0.14
            )
            samples = carrier * np.clip(syll, 0.05, 1.0) * 0.65
            speech_dur = len(samples) / SR
            post_pause = float(beat.get('postPauseSec', V.get('postPauseSec', 0.18)))
            if post_pause > 0:
                samples = np.concatenate([samples, np.zeros(int(round(post_pause * SR)))])

        beat_dur = len(samples) / SR
        all_words.extend(extract_words_from_text_and_duration(b_disp, cursor, max(0.2, speech_dur - 0.04)))
        beat_wavs.append(samples)
        cursor += beat_dur

    full_audio = np.concatenate(beat_wavs) if beat_wavs else np.zeros(SR)
    target_total = float(ep.get('target_duration_sec', 0.0))
    if target_total > 0 and cursor > 0 and abs(cursor - target_total) > 0.25:
        ratio = cursor / target_total
        ratio_clamped = max(0.5, min(2.0, ratio))
        tmp_in = out_dir(slug) / '_voice_unscaled.wav'
        tmp_out = out_dir(slug) / '_voice_scaled.wav'
        write_wav(tmp_in, full_audio, peak=0.92)
        subprocess.run(
            [FFMPEG, '-y', '-v', 'error', '-i', str(tmp_in), '-filter:a', f'atempo={ratio_clamped:.5f}', str(tmp_out)],
            check=True,
        )
        full_audio = decode(tmp_out)
        tmp_in.unlink(missing_ok=True)
        tmp_out.unlink(missing_ok=True)
        scale_t = (len(full_audio) / SR) / cursor
        for w in all_words:
            w['s'] = round(w['s'] * scale_t, 3)
            w['e'] = round(w['e'] * scale_t, 3)
    tmp_wav = out_dir(slug) / '_voice_raw.wav'
    write_wav(tmp_wav, full_audio, peak=0.92)
    subprocess.run([FFMPEG, '-y', '-v', 'error', '-i', str(tmp_wav), '-b:a', '128k', str(raw_mp3)], check=True)
    tmp_wav.unlink(missing_ok=True)
    return all_words


if force or meta.get('sig') != sig or not raw_mp3.exists() or not raw_words.exists():
    if provider == 'elevenlabs':
        print(f'{len(spoken_full)} characters to ElevenLabs (voice {V["id"]})')
        t0 = time.time()
        res = json.loads(
            api(
                f'/v1/text-to-speech/{V["id"]}/with-timestamps?output_format=mp3_44100_128',
                {'text': spoken_full, 'model_id': V['model'], 'voice_settings': V['settings']},
            )
        )
        raw_mp3.write_bytes(base64.b64decode(res['audio_base64']))
        al = res['alignment']
        words, cur = [], None
        for ch, s, e in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
            if re.match(r"[\w'’]", ch):
                if cur is None:
                    cur = {'w': '', 's': s, 'e': e, 'p': ''}
                cur['w'] += ch
                cur['e'] = e
            else:
                if cur is not None:
                    words.append(cur)
                    cur = None
                if words and ch.strip():
                    words[-1]['p'] += ch
        if cur:
            words.append(cur)
        for w in words:
            w['s'], w['e'] = round(w['s'], 3), round(w['e'], 3)
        used, n = spent_since(t0, expect=1)
        log_cost(slug, 'voice', used, f'{len(spoken_full)} characters (ElevenLabs)')
    else:
        print(f'Synthesizing voice via Lemo-Opuscar TTS ({provider}, preset={V.get("preset")}, {len(spoken_full)} chars, lang={lang})...')
        try:
            words = synthesize_beats_via_lemo_tts(provider)
            log_cost(slug, 'voice', 0, f'lemo-opuscar {provider} ({len(spoken_full)} chars)')
        except Exception as exc:
            if provider != 'local_synth':
                print(f'Note: {provider} runtime unavailable ({exc}); falling back to local_synth for timing verification.')
                words = synthesize_beats_via_lemo_tts('local_synth')
                log_cost(slug, 'voice', 0, 'local_synth fallback')
            else:
                raise
    save_json(raw_words, words)
    save_json(out_dir(slug) / 'voice_meta.json', {'sig': sig, 'chars': len(spoken_full), 'provider': provider, 'preset': V.get('preset')})
else:
    print(f'Voice unchanged since the last call ({meta.get("provider", provider)}): reusing it (0 credits).')

# ---------------------------------------------------------------- tighten the pauses
words = load_json(raw_words)
G = {'word': 0.12, 'comma': 0.2, 'sentence': 0.3, 'question': 0.45, 'pairs': {}}
G.update(ep.get('gaps', {}))
x = decode(raw_mp3)
cuts = []


def bare(w):
    return re.sub(r'[^\w]', '', w)


if not G.get('preserve_beat_pauses'):
    for a, b in zip(words, words[1:]):
        gap = b['s'] - a['e']
        key = bare(a['w']) + '|' + bare(b['w'])
        if key in G['pairs']:
            keep = G['pairs'][key]
        elif '?' in a['p'] or '!' in a['p']:
            keep = G['question']
        elif '.' in a['p'] or ':' in a['p'] or ';' in a['p'] or '…' in a['p']:
            keep = G['sentence']
        elif ',' in a['p'] or '—' in a['p'] or '-' in a['p']:
            keep = G['comma']
        else:
            keep = G['word']
        if gap > keep:
            mid = (a['e'] + b['s']) / 2
            rm = gap - keep
            cuts.append((mid - rm / 2, mid + rm / 2))
parts, last = [], 0.0
for s, e in cuts:
    parts.append(x[int(last * SR):int(s * SR)])
    last = e
parts.append(x[int(last * SR):])
fade = int(0.004 * SR)
for i, part in enumerate(parts):
    part = part.copy()
    if i > 0 and len(part) > fade:
        part[:fade] *= np.linspace(0, 1, fade)
    if i < len(parts) - 1 and len(part) > fade:
        part[-fade:] *= np.linspace(1, 0, fade)
    parts[i] = part
y = np.concatenate(parts)
write_wav(pub_dir(slug) / 'voice.wav', y)


def shift(t):
    return t - sum(min(e, t) - s for s, e in cuts if t > s)


out = [{'w': w['w'], 's': round(shift(w['s']), 3), 'e': round(shift(w['e']), 3), 'p': w.get('p', '')} for w in words]
save_json(ep_dir(slug) / 'words.json', out)
print(f'Tightened {len(cuts)} pauses, removed {sum(e - s for s, e in cuts):.2f} s: {len(x) / SR:.2f} s -> {len(y) / SR:.2f} s')
print(' '.join(f"{w['w']}@{w['s']}" for w in out))
