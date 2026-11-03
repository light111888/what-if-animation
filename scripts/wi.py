"""Shared helpers for the Antigravity What If animation scripts: paths, TTS normalization, API keys, credits, cues, audio files, and local procedural SFX fallback.

Every script can run either from inside the studio folder OR from the workspace root (auto-detecting artifacts/what-if-studio or what-if-studio):
    python .agents/skills/what-if-animation/scripts/plan.py copy-paste
Episode files:  src/episodes/<slug>/episode.json (authored manually), words.json + timeline.json (written by scripts)
Audio:          public/<slug>/voice.wav, sfx.wav, music.wav
Renders/review: out/<slug>/
Sound library:  library/sfx/ (generated clips, cached by name + prompt + length, shared by every episode)
"""
import hashlib, json, math, os, pathlib, re, shutil, subprocess, sys, time, urllib.request, wave

import numpy as np

SR = 44100
sys.stdout.reconfigure(encoding='utf-8')
SKILL_DIR = pathlib.Path(__file__).resolve().parent.parent


def resolve_studio_dir():
    if '--studio' in sys.argv:
        idx = sys.argv.index('--studio')
        if idx + 1 < len(sys.argv):
            cand = pathlib.Path(sys.argv[idx + 1]).resolve()
            if (cand / 'src' / 'episodes').exists():
                return cand
    env_studio = os.environ.get('WHAT_IF_STUDIO')
    if env_studio:
        cand = pathlib.Path(env_studio).resolve()
        if (cand / 'src' / 'episodes').exists():
            return cand
    cwd = pathlib.Path.cwd()
    for cand in [
        cwd,
        cwd / 'artifacts' / 'what-if-studio',
        cwd / 'what-if-studio',
        SKILL_DIR / 'studio',
    ]:
        if (cand / 'src' / 'episodes').exists():
            return cand.resolve()
    raise SystemExit('Run this from the studio folder or a workspace containing artifacts/what-if-studio.')


STUDIO = resolve_studio_dir()
LIB = STUDIO / 'library' / 'sfx'


def resolve_ffmpeg():
    found = shutil.which('ffmpeg')
    if found:
        return found
    for parent in [STUDIO, *STUDIO.parents]:
        cand = parent / 'build' / 'video-encoder' / ('ffmpeg.exe' if sys.platform == 'win32' else 'ffmpeg')
        if cand.exists():
            return str(cand)
    return 'ffmpeg'


def resolve_ffprobe():
    found = shutil.which('ffprobe')
    if found:
        return found
    return 'ffprobe'


FFMPEG = resolve_ffmpeg()
FFPROBE = resolve_ffprobe()


# ---------------------------------------------------------------- paths
def ep_dir(slug):
    return STUDIO / 'src' / 'episodes' / slug


def pub_dir(slug):
    d = STUDIO / 'public' / slug
    d.mkdir(parents=True, exist_ok=True)
    return d


def out_dir(slug):
    d = STUDIO / 'out' / slug
    d.mkdir(parents=True, exist_ok=True)
    return d


def stem(slug, name):
    """An audio stem in public/<slug>/: name.wav, or name.mp3 (the shipped examples), or None."""
    for ext in ('wav', 'mp3'):
        q = STUDIO / 'public' / slug / f'{name}.{ext}'
        if q.exists():
            return q
    return None


def load_episode(slug):
    p = ep_dir(slug) / 'episode.json'
    if not p.exists():
        raise SystemExit(f'No episode.json at {p}')
    return json.loads(p.read_text(encoding='utf-8'))


def load_json(p, default=None):
    p = pathlib.Path(p)
    return json.loads(p.read_text(encoding='utf-8')) if p.exists() else default


def save_json(p, data):
    pathlib.Path(p).write_text(json.dumps(data, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')


# ---------------------------------------------------------------- Mandatory TTS Spoken-Text Normalization QA
DECIMAL_UNIT_RE = re.compile(
    r'\d+[.,]\d+\s*(triệu|tỷ|nghìn|mét|giây|phút|giờ|năm|km|kg|g|million|billion|thousand|seconds|minutes|hours|years|meters)',
    re.IGNORECASE,
)


def validate_spoken_text_beats(script_beats, strict=True):
    """Enforces Antigravity Mandatory TTS Spoken-Text Normalization & Anti-Sentence-Break for Decimals."""
    issues = []
    for idx, beat in enumerate(script_beats):
        spoken = beat.get('spoken_text') or beat.get('tts_text') or beat.get('say')
        if spoken is None:
            continue
        loc = f'script[{idx}] ({beat.get("beat", idx)})'
        m = DECIMAL_UNIT_RE.search(spoken)
        if m:
            issues.append(
                f'{loc}: Decimal-unit phrase "{m.group(0)}" in spoken_text risks sentence-break splitting at "." — write unbroken words (e.g. "ba phẩy hai triệu năm" / "three point two million years").'
            )
        if re.search(r'[0-9]', spoken):
            issues.append(
                f'{loc}: Raw digits found in spoken_text ("{spoken}"). Spell all numbers out as full words in spoken_text while keeping digits in text.'
            )
        if re.search(r'[%°/+=]', spoken):
            issues.append(
                f'{loc}: Raw symbols (%, °, /, +, =) found in spoken_text ("{spoken}"). Expand symbols into full words in spoken_text.'
            )
    if issues and strict:
        raise SystemExit('TTS Spoken-Text Normalization QA failed:\n  - ' + '\n  - '.join(issues))
    return issues


# ---------------------------------------------------------------- the key and credits
KEY_NAMES = ['ELEVENLABS_API_KEY']


def read_env(p):
    """A .env as text, however it was saved: UTF-8 with or without a BOM, or UTF-16 (Windows PowerShell's `>`)."""
    raw = p.read_bytes()
    if raw[:2] in (b'\xff\xfe', b'\xfe\xff'):
        return raw.decode('utf-16', errors='ignore')
    return raw.decode('utf-8-sig', errors='ignore')


def has_api_key():
    for n in KEY_NAMES:
        if os.environ.get(n):
            return True
    for d in [STUDIO, *STUDIO.parents]:
        p = d / '.env'
        if p.exists():
            for line in read_env(p).splitlines():
                for n in KEY_NAMES:
                    if line.strip().startswith(n + '=') and line.split('=', 1)[1].strip().strip('"').strip("'"):
                        return True
    return False


def api_key():
    """The ElevenLabs key, by name only: from the environment, or the nearest .env above the studio. Never printed."""
    for n in KEY_NAMES:
        if os.environ.get(n):
            return os.environ[n]
    for d in [STUDIO, *STUDIO.parents]:
        p = d / '.env'
        if p.exists():
            for line in read_env(p).splitlines():
                for n in KEY_NAMES:
                    if line.strip().startswith(n + '='):
                        return line.split('=', 1)[1].strip().strip('"').strip("'")
    raise SystemExit(f'No ElevenLabs key: set one of {KEY_NAMES} in the environment or a .env file, or use default local OmniVoice/AivisSpeech.')


def api(path, body=None, timeout=180):
    req = urllib.request.Request('https://api.elevenlabs.io' + path, headers={'xi-api-key': api_key(), 'Content-Type': 'application/json'})
    if body is not None:
        req.data = json.dumps(body).encode()
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def credits_used():
    """Characters/credits used so far this billing period (ElevenLabs' counter; it can lag by minutes)."""
    s = json.loads(api('/v1/user/subscription'))
    return s['character_count'], s['character_limit']


def spent_since(t0, expect=1, tries=6):
    """Credits spent since unix time t0, read from the account's generation history."""
    items = []
    for i in range(tries):
        h = json.loads(api('/v1/history?page_size=100'))
        items = [it for it in h.get('history', []) if it.get('date_unix', 0) >= int(t0) - 2]
        if len(items) >= expect:
            break
        time.sleep(2 + 2 * i)
    used = sum((it.get('character_count_change_to') or 0) - (it.get('character_count_change_from') or 0) for it in items)
    return used, len(items)


def log_cost(slug, step, used, note=''):
    """Append a cost line to out/<slug>/costs.json and print the running total for the episode."""
    p = out_dir(slug) / 'costs.json'
    rows = load_json(p, [])
    rows.append({'step': step, 'credits': used, 'note': note})
    save_json(p, rows)
    total = sum(r['credits'] for r in rows)
    print(f'Cost tracker: {step} used {used} credits{f" ({note})" if note else ""}; this episode so far: {total}')


# ---------------------------------------------------------------- words and cues
def norm(w):
    return re.sub(r"[^\w']", '', w.lower().replace('’', "'"))


def word_frame(words, fps, i):
    return round(words[i]['s'] * fps)


def find_word(words, target, start=0, nth=1):
    t = norm(target)
    seen = 0
    for i in range(start, len(words)):
        if norm(words[i]['w']) == t:
            seen += 1
            if seen == nth:
                return i
    raise SystemExit(f'Cue word "{target}" (#{nth}) not found after word {start}. Words: ' + ' '.join(w['w'] for w in words))


CUE = re.compile(r'^(?P<base>[^+\-#]+?)(?:#(?P<nth>\d+))?(?P<off>[+-]\d+)?$')


def resolve(cue, words, fps, segments=None, shot_ids=()):
    """A cue to a global frame. Forms:
    f:123      an absolute frame          s:4.2     seconds
    S3+2       2 frames after the start of shot S3's first segment (S3#2+2: its second segment; S3-4 before it)
    word+3     3 frames after the word starts (word#2: its second occurrence)
    """
    cue = str(cue).strip()
    if cue.startswith('f:'):
        return int(round(float(cue[2:])))
    if cue.startswith('s:'):
        return int(round(float(cue[2:]) * fps))
    m = CUE.match(cue)
    if not m:
        raise SystemExit(f'Bad cue "{cue}"')
    base, nth, off = m['base'], int(m['nth'] or 1), int(m['off'] or 0)
    if segments is not None and base in shot_ids:
        segs = [s for s in segments if s['shot'] == base]
        if len(segs) < nth:
            raise SystemExit(f'Cue "{cue}": shot {base} has only {len(segs)} segment(s)')
        return segs[nth - 1]['a'] + off
    return word_frame(words, fps, find_word(words, base, 0, nth)) + off


# ---------------------------------------------------------------- audio
def decode(path):
    """Any audio file to mono float64 at 44.1 kHz."""
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def write_wav(path, x, peak=None):
    if peak is not None:
        x = x / max(1e-9, np.abs(x).max()) * peak
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def loudness(path_or_args):
    """Integrated loudness (LUFS) and true peak (dBTP) of a file, via ffmpeg's ebur128."""
    args = path_or_args if isinstance(path_or_args, list) else ['-i', str(path_or_args)]
    r = subprocess.run([FFMPEG, '-hide_banner', '-nostats', *args, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf-8', errors='ignore')
    txt = r.stderr
    summ = txt[txt.rfind('Summary:'):]
    i = re.search(r'I:\s+(-?[\d.]+|-inf) LUFS', summ)
    p = re.search(r'Peak:\s+(-?[\d.]+|-inf) dBFS', summ)
    f = lambda m: float(m.group(1)) if m and m.group(1) != '-inf' else float('-inf')
    return f(i), f(p)


def clip_path(name, prompt, secs):
    h = hashlib.sha1(f'{prompt}|{secs}'.encode()).hexdigest()[:8]
    LIB.mkdir(parents=True, exist_ok=True)
    exact = LIB / f'{name}-{h}.mp3'
    if exact.exists():
        return exact
    # Check if starter library already has a clip with this exact semantic name prefix
    matches = sorted(LIB.glob(f'{name}-*.mp3')) + sorted(LIB.glob(f'{name}-*.wav'))
    if matches:
        return matches[0]
    return exact


def synthesize_local_sfx_clip(name, prompt, secs, dest_path):
    """Procedural 44.1 kHz synthesizer for missing SFX/ambience/music clips when running offline without ElevenLabs."""
    n = max(1024, int(round(float(secs) * SR)))
    t = np.linspace(0, float(secs), n, endpoint=False)
    rng = np.random.default_rng(abs(hash(f'{name}|{prompt}')) % (2**32))
    noise = rng.uniform(-1.0, 1.0, n)
    low_name = f'{name} {prompt}'.lower()

    if 'music' in low_name or 'pizzicato' in low_name or 'bpm' in low_name:
        # Playful pizzicato + glockenspiel cartoon bed at 110 BPM
        beat = 60.0 / 110.0
        notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66]
        sig = np.zeros(n)
        step = max(1, int(beat * 0.5 * SR))
        for idx, start in enumerate(range(0, n, step)):
            freq = notes[idx % len(notes)]
            ln = min(step, n - start)
            lt = np.arange(ln) / SR
            env = np.exp(-lt * 14.0)
            sig[start:start + ln] += (np.sin(2 * math.pi * freq * lt) * 0.65 + np.sin(2 * math.pi * freq * 2 * lt) * 0.25) * env
    elif 'boom' in low_name or 'drone' in low_name:
        f0 = 110.0 if 'boom' in low_name else 68.0
        freq = f0 * np.exp(-t * 1.4) + 34.0
        env = np.exp(-t * (2.6 if 'boom' in low_name else 0.9))
        sig = (np.sin(2 * math.pi * freq * t) * 0.8 + noise * np.exp(-t * 18.0) * 0.3) * env
    elif 'pop' in low_name or 'click' in low_name or 'crunch' in low_name or 'switch' in low_name:
        freq = np.linspace(260.0, 740.0, n) if 'pop' in low_name else np.linspace(520.0, 180.0, n)
        env = np.exp(-t * 28.0)
        sig = (np.sin(2 * math.pi * freq * t) * 0.75 + noise * np.exp(-t * 50.0) * 0.35) * env
    elif 'sparkle' in low_name or 'chime' in low_name or 'select' in low_name or 'ding' in low_name:
        env = np.exp(-t * 6.5)
        sig = (
            np.sin(2 * math.pi * 1046.5 * t) * 0.45
            + np.sin(2 * math.pi * 1318.5 * t) * 0.35
            + np.sin(2 * math.pi * 1567.98 * t) * 0.25
        ) * env
    elif 'whoosh' in low_name or 'wind' in low_name or 'room_tone' in low_name or 'hum' in low_name:
        win = 64
        smooth_noise = np.convolve(noise, np.ones(win) / win, mode='same')
        if 'whoosh' in low_name:
            env = np.sin(np.pi * np.clip(t / max(0.05, float(secs)), 0, 1))
            sig = smooth_noise * env
        else:
            sig = smooth_noise * 0.35 + np.sin(2 * math.pi * 60.0 * t) * 0.15
    else:
        env = np.exp(-t * 10.0)
        sig = (np.sin(2 * math.pi * 440.0 * t) * 0.6 + noise * 0.3) * env

    wav_tmp = dest_path.with_suffix('.wav')
    write_wav(wav_tmp, sig, peak=0.9)
    if dest_path.suffix.lower() == '.mp3':
        subprocess.run([FFMPEG, '-y', '-v', 'error', '-i', str(wav_tmp), '-b:a', '128k', str(dest_path)], check=True)
        wav_tmp.unlink(missing_ok=True)
    return dest_path
