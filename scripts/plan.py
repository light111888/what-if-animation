"""Step 3: the shot list on the voice. Resolves the edit's cues against the word timings, enforces the
Strict 1-Cut-1-Unique-Shot / Anti-Cycle / Visual-Script Alignment / Full-Duration Motion Quality rules,
and writes the timeline.

python <skill>/scripts/plan.py <slug> [--allow-repeats] [--strict]
Reads  src/episodes/<slug>/episode.json (shots, edit, fx), words.json (from voice.py), and optionally shots.tsx
Writes src/episodes/<slug>/timeline.json (the engine reads it) and out/<slug>/shotlist.md, and prints the pace + QA audit.
"""
import re, statistics, sys
from collections import Counter
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from wi import ep_dir, load_episode, load_json, out_dir, resolve, save_json, find_word, stem

slug = sys.argv[1]
allow_repeats = '--allow-repeats' in sys.argv
strict_mode = '--strict' in sys.argv
ep = load_episode(slug)
FPS = ep.get('fps', 30)
LEAD = ep.get('lead', 2)
words = load_json(ep_dir(slug) / 'words.json', [])
if not words and any(not str(e['at']).startswith(('f:', 's:', '+')) for e in ep['edit']):
    raise SystemExit('No words.json yet: run voice.py first (or use f:/s: cues).')
shots = (
    {k: {'id': k, **v} for k, v in ep['shots'].items()}
    if isinstance(ep['shots'], dict)
    else {s['id']: s for s in ep['shots']}
)

# ---------------------------------------------------------------- cut points
starts, wi_prev, prev = [], 0, 0
for k, e in enumerate(ep['edit']):
    if e['shot'] not in shots:
        raise SystemExit(f'Edit entry {k} uses unknown shot {e["shot"]}')
    at = str(e['at'])
    if k == 0 and at in ('0', 'f:0', 's:0'):
        a = 0
    elif at.startswith(('f:', 's:')) or at.isdigit():
        a = int(at) if at.isdigit() else resolve(at, words, FPS)
        t_sec = a / FPS
        while wi_prev < len(words) and words[wi_prev]['s'] < t_sec:
            wi_prev += 1
    elif at.startswith('+'):
        a = prev + int(at[1:])
        t_sec = a / FPS
        while wi_prev < len(words) and words[wi_prev]['s'] < t_sec:
            wi_prev += 1
    else:
        base, _, off = at.partition('+') if '+' in at else (at, '', '0')
        if '#' in base:
            w, n = base.split('#')
            i = find_word(words, w, 0, int(n))
            if i < wi_prev:
                i = find_word(words, w, wi_prev, 1)
        else:
            i = find_word(words, base, wi_prev)
        wi_prev = i + 1
        a = max(0, round(words[i]['s'] * FPS) - LEAD + int(off or 0))
    if k == 0:
        a = 0
    if a <= prev and k > 0:
        raise SystemExit(f'Edit entry {k} ({e["shot"]} at {at}) starts at frame {a}, not after the previous cut ({prev})')
    starts.append(a)
    prev = a
end = resolve(ep['end'], words, FPS) if 'end' in ep else round((words[-1]['e'] + ep.get('tail', 0.9)) * FPS)
if end <= starts[-1]:
    raise SystemExit(f'The last shot starts at {starts[-1]} but the episode ends at {end}')

# ---------------------------------------------------------------- segments and live shot clocks
segments, last_clock, fwd_counts = [], {}, {}
for k, e in enumerate(ep['edit']):
    a, b = starts[k], starts[k + 1] if k + 1 < len(starts) else end
    sid = e['shot']
    if e.get('reverse'):
        t0 = e.get('from', last_clock.get(sid, b - a))
        t1 = e.get('to', 0)
        occ = fwd_counts.get(sid, 1)
    else:
        fwd_counts[sid] = fwd_counts.get(sid, 0) + 1
        occ = fwd_counts[sid]
        if 'from' in e:
            t0 = e['from']
        elif e.get('continueClock'):
            t0 = last_clock.get(sid, 0)
        else:
            t0 = 0
        t1 = t0 + (b - a)
    last_clock[sid] = t1
    line = ' '.join(w['w'] + w.get('p', '').strip() for w in words if a <= round(w['s'] * FPS) + LEAD < b)
    seg = {'shot': sid, 'a': a, 'b': b, 't0': t0, 't1': t1, 'line': line, 'occurrence': occ}
    if e.get('look'):
        seg['look'] = e['look']
    if e.get('subBeat') is not None:
        seg['subBeat'] = e['subBeat']
    elif not e.get('reverse') and occ > 1:
        seg['subBeat'] = occ
    if e.get('variant'):
        seg['variant'] = e['variant']
    segments.append(seg)

ids = list(dict.fromkeys(s['shot'] for s in segments))
for sid in shots:
    if sid not in ids:
        print(f'note: shot {sid} is defined but not in the edit')
info = []
for sid in ids:
    segs = [s for s in segments if s['shot'] == sid]
    fwd = [s for s in segs if s['t1'] >= s['t0']]
    length = max([s['t1'] for s in fwd] + [s['t0'] for s in segs])
    d = shots[sid]
    first = segs[0]
    info.append({
        'id': sid, 'size': d.get('size', ''), 'key': d.get('key', (first['b'] - first['a']) // 2), 'len': length, 'first': first['a'],
        'line': first['line'], 'note': d.get('note') or d.get('subject', ''),
    })

# ---------------------------------------------------------------- fx, audio
fx = []
raw_fx = ep.get('fx', [])
if isinstance(raw_fx, dict):
    for f_cue in raw_fx.get('flashes', []):
        c = f_cue['at'] if isinstance(f_cue, dict) else f_cue
        fx.append({'kind': 'flash', 'f': resolve(c, words, FPS, segments, ids)})
    for s_cue in raw_fx.get('shakes', []):
        item = {k: v for k, v in s_cue.items() if k != 'at'}
        item['kind'] = item.get('kind', 'shake')
        item['f'] = resolve(s_cue['at'], words, FPS, segments, ids)
        fx.append(item)
else:
    for e in raw_fx:
        item = {k: v for k, v in e.items() if k != 'at'}
        item['f'] = resolve(e['at'], words, FPS, segments, ids)
        fx.append(item)
old = load_json(ep_dir(slug) / 'timeline.json', {}) or {}
audio = {k: v for k, v in old.get('audio', {}).items() if k.endswith('Vol')}
for k in ['voice', 'sfx', 'music']:
    f = stem(slug, k)
    if f:
        audio[k] = f'{slug}/{f.name}'
title = ep.get('title', ['', ''])
tl = {'slug': slug, 'title': ' '.join(title) if isinstance(title, list) else title, 'fps': FPS, 'total': end, 'segments': segments, 'shots': info, 'fx': fx, 'audio': audio}
save_json(ep_dir(slug) / 'timeline.json', tl)

# ---------------------------------------------------------------- the pace report, anti-repetition & visual-script QA audit
cuts = [s['a'] for s in segments[1:]]
lens = [(s['b'] - s['a']) / FPS for s in segments]
dur = end / FPS
first10 = len([c for c in cuts if c < 10 * FPS])
per_min = len(cuts) / dur * 60
print(f'{len(segments)} segments, {len(ids)} shots, {dur:.1f} s ({end} frames)')
print(f'pace: {per_min:.0f} cuts/min overall, {first10 / min(10, dur) * 60:.0f} cuts/min in the first 10 s; median shot {statistics.median(lens):.1f} s, longest {max(lens):.1f} s')

variety_warnings = []

# 1. Strict 1-Cut-1-Unique-Shot Policy (TRAP_SHOT_RECYCLING)
if not allow_repeats:
    recycled = [(sid, cnt) for sid, cnt in fwd_counts.items() if cnt > 1]
    if recycled:
        rec_str = ', '.join(f'{sid} (x{cnt})' for sid, cnt in recycled[:12])
        variety_warnings.append(
            f'  ! TRAP_SHOT_RECYCLING: {len(recycled)} shot ID(s) reused in forward mode ({rec_str}). '
            f'Every forward cut MUST use a 100% unique shot ID (count == 1). SubBeat/variant reuse of the same shot ID is forbidden!'
        )

# 2. Raw Shot ID Consecutive, Ping-Pong & N-Gram Cycle Detection (never masked by subBeat/variant)
consec_dups = []
for i in range(len(segments) - 1):
    s0, s1 = segments[i], segments[i + 1]
    if s0['shot'] == s1['shot'] and not (s1['t1'] < s1['t0']):
        consec_dups.append(f"{s0['shot']}->{s1['shot']} (@ {s0['a']/FPS:.1f}s)")
if consec_dups:
    variety_warnings.append(
        f'  ! TRAP_CONSECUTIVE_DUPLICATE: identical shot ID cut back-to-back without reverse: {", ".join(consec_dups[:6])}.'
    )

ping_pongs = []
for i in range(len(segments) - 2):
    a_id, b_id, c_id = segments[i]['shot'], segments[i + 1]['shot'], segments[i + 2]['shot']
    is_rev = (segments[i + 1]['t1'] < segments[i + 1]['t0']) or (segments[i + 2]['t1'] < segments[i + 2]['t0'])
    if a_id == c_id and a_id != b_id and not is_rev:
        ping_pongs.append(f"{a_id}->{b_id}->{c_id} (@ {segments[i]['a']/FPS:.1f}s)")
if ping_pongs:
    variety_warnings.append(
        f'  ! TRAP_PING_PONG_LOOP: detected {len(ping_pongs)} alternating A->B->A shot loop(s) on raw shot IDs: {", ".join(ping_pongs[:6])}.'
    )

bigrams = Counter()
bigram_locs = {}
for i in range(len(segments) - 1):
    if segments[i + 1]['t1'] < segments[i + 1]['t0']:
        continue
    bg = (segments[i]['shot'], segments[i + 1]['shot'])
    bigrams[bg] += 1
    bigram_locs.setdefault(bg, []).append(f"{segments[i]['a']/FPS:.1f}s")
repeated_bigrams = [f"{a}->{b} (x{c} @ {', '.join(bigram_locs[(a,b)])})" for (a, b), c in bigrams.items() if c > 1]
if repeated_bigrams:
    variety_warnings.append(
        f'  ! TRAP_CYCLE_LOOP: repeated shot transition sequence(s) detected: {"; ".join(repeated_bigrams[:6])}.'
    )

# 3. Adjacent Same-Framing Check (TRAP_ADJACENT_SAME_FRAMING)
same_sizes = []
for i in range(len(segments) - 2):
    sz0 = shots[segments[i]['shot']].get('size', '').strip().lower()
    sz1 = shots[segments[i + 1]['shot']].get('size', '').strip().lower()
    sz2 = shots[segments[i + 2]['shot']].get('size', '').strip().lower()
    if sz0 and sz0 == sz1 == sz2:
        same_sizes.append(f"#{i+1}..#{i+3} ({segments[i]['shot']}..{segments[i+2]['shot']} all '{sz0}')")
if same_sizes:
    variety_warnings.append(
        f'  ! TRAP_ADJACENT_SAME_FRAMING: 3+ consecutive cuts use the exact same camera size: {", ".join(same_sizes[:5])}. Alternate shot sizes on every cut!'
    )

# 4. Cross-Scene Bleed & Visual-Script Semantic Mismatch check (TRAP_CROSS_SCENE_BLEED / TRAP_VISUAL_SCRIPT_MISMATCH)
SCENE_DOMAINS = [
    ('noodle_fly', ('ruồi', 'bát mì', 'tô mì', 'đũa', 'noodle', 'chopstick', 'fly buzz')),
    ('chem_lab', ('hóa học', 'cốc thủy tinh', 'beaker', 'axit')),
    ('rooftop_ball', ('bóng chày', 'baseball', 'sân thượng lúc hoàng hôn')),
    ('coffee_mug', ('tách cà phê', 'coffee mug')),
]

def infer_domain(text):
    t_low = text.lower()
    for dom, kws in SCENE_DOMAINS:
        if any(kw in t_low for kw in kws):
            return dom
    return None

completed_scenes = set()
current_scene = None
scene_bleeds = []
semantic_mismatches = []
for idx, s in enumerate(segments):
    d = shots[s['shot']]
    sc = d.get('scene') or infer_domain(d.get('note') or d.get('subject', ''))
    shot_dom = infer_domain((d.get('scene') or '') + ' ' + (d.get('note') or d.get('subject', '')))
    line_dom = infer_domain(s['line'])
    if shot_dom and line_dom and shot_dom != line_dom:
        semantic_mismatches.append(
            f"seg #{idx+1} ({s['shot']} [{shot_dom}] @ {s['a']/FPS:.1f}s used during '{line_dom}' line: \"{s['line']}\")"
        )
    if not sc:
        continue
    if sc != current_scene:
        if sc in completed_scenes:
            scene_bleeds.append(f"seg #{idx+1} ({s['shot']}, scene={sc} @ {s['a']/FPS:.1f}s after {current_scene})")
        if current_scene is not None:
            completed_scenes.add(current_scene)
        current_scene = sc
if scene_bleeds:
    variety_warnings.append(
        f'  ! TRAP_CROSS_SCENE_BLEED: edit cuts back to an earlier scene after leaving it ({", ".join(scene_bleeds[:5])}). '
        f'Keep all cuts of each scene/mini-story contiguous so visuals match the spoken script 1-to-1!'
    )
if semantic_mismatches:
    variety_warnings.append(
        f'  ! TRAP_VISUAL_SCRIPT_MISMATCH: shot visual domain conflicts with spoken narration ({"; ".join(semantic_mismatches[:5])}).'
    )

# 5. Second-half visual freshness for episodes > 45s
if dur > 45:
    mid_frame = end // 2
    first_half_shots = {s['shot'] for s in segments if s['a'] < mid_frame}
    second_half_segs = [s for s in segments if s['a'] >= mid_frame]
    brand_new_late_shots = {s['shot'] for s in second_half_segs if s['shot'] not in first_half_shots}
    if len(brand_new_late_shots) < max(4, len(second_half_segs) // 2):
        variety_warnings.append(
            f'  ! TRAP_LATE_ACT_STARVATION: second half of episode ({dur/2:.0f}s..{dur:.0f}s) has {len(second_half_segs)} cuts '
            f'but only {len(brand_new_late_shots)} new shot IDs.'
        )

# 6. Script Verbal Phrase Repetition Check (TRAP_SCRIPT_PHRASE_REPEAT)
script_beats = ep.get('script', [])
if script_beats:
    all_text = ' '.join((b.get('text') or '') for b in script_beats)
    sentences = [s.strip().lower() for s in re.split(r'[.!?]+', all_text) if len(s.strip().split()) >= 3]
    sent_counts = Counter(sentences)
    repeated_sents = [f'"{s}" (x{c})' for s, c in sent_counts.items() if c > 1]
    if repeated_sents:
        variety_warnings.append(
            f'  ! TRAP_SCRIPT_PHRASE_REPEAT: exact sentence repeated multiple times in script: {", ".join(repeated_sents[:5])}.'
        )

# 7. Static shots.tsx audit for Jitter, Wrong Set Reuse, Shot Aliasing, Structural Cloning & Early Keyframe Freeze
shots_tsx_path = ep_dir(slug) / 'shots.tsx'
if shots_tsx_path.exists():
    tsx_src = shots_tsx_path.read_text(encoding='utf-8')
    # Check direct shot aliasing: export const Sh12 = Sh11
    aliases = re.findall(r'export\s+const\s+(Sh?\d+)\s*=\s*(Sh?\d+)\b', tsx_src)
    if aliases:
        variety_warnings.append(
            f'  ! TRAP_SHOT_ALIAS: direct shot component aliasing detected in shots.tsx: {aliases[:5]}. Every shot must be a genuinely distinct visual composition!'
        )
    fn_blocks = re.split(r'(?=export\s+(?:function|const)\s+Sh?\d+\b)', tsx_src)
    structural_sigs = {}
    early_freezes = []
    for block in fn_blocks:
        m_name = re.match(r'export\s+(?:function|const)\s+(Sh?\d+)\b', block)
        if not m_name:
            continue
        sid = m_name.group(1)
        # Check high-frequency trig jitter: Math.sin(t * freq) * amp
        for m_trig in re.finditer(r'Math\.(?:sin|cos)\(\s*t\s*\*\s*([0-9.]+)\s*\)\s*\*\s*([0-9.]+)', block):
            freq = float(m_trig.group(1))
            amp = float(m_trig.group(2))
            if freq >= 0.45 and amp >= 25 and (freq * amp) >= 20:
                variety_warnings.append(
                    f'  ! TRAP_HIGH_FREQ_JITTER: {sid} in shots.tsx uses `{m_trig.group(0)}` (freq={freq}, amp={amp}px), '
                    f'which causes unnatural frame-to-frame teleporting jitter. Use smooth `kf(t, [...], [...])` trajectories instead!'
                )
        # Check Classroom default chalkboard reuse in non-math scenes
        note_and_lines = (shots.get(sid, {}).get('note', '') + ' ' + ' '.join(s['line'] for s in segments if s['shot'] == sid)).lower()
        if '<Classroom' in block and 'board=' not in block:
            if not any(kw in note_and_lines for kw in ('toán', 'math', '7', 'bảng', 'lớp học', 'class', 'công thức')):
                variety_warnings.append(
                    f'  ! TRAP_WRONG_SET_REUSE: {sid} uses `<Classroom>` without a custom `board=` prop while narration is not about math class (`7 × 8 = ?`).'
                )
        if '<Rooftop' in block:
            if any(kw in note_and_lines for kw in ('ngã tư', 'đèn đường', 'võ đài', 'bóng bàn', 'phòng giám sát', 'cần cẩu', 'vỉa hè')):
                variety_warnings.append(
                    f'  ! TRAP_WRONG_SET_REUSE: {sid} uses `<Rooftop>` (sunset string-lights party roof) for an indoor arena / surveillance / rainy street scene. Use `<StreetRain>`, `<ArenaRing>`, or `<SurveillanceLab>`!'
                )
        # Check structural cloning (normalize whitespace and strip header)
        body_only = re.sub(r'^export\s+(?:function|const)\s+Sh?\d+.*?\n', '', block, count=1)
        body_norm = re.sub(r'id="[^"]*"', 'id=""', body_only)
        body_norm = re.sub(r'\s+', ' ', body_norm).strip()
        if len(body_norm) > 80:
            if body_norm in structural_sigs:
                variety_warnings.append(
                    f'  ! TRAP_VISUAL_CLONE_SHOTS: {sid} in shots.tsx is an exact code clone of {structural_sigs[body_norm]}!'
                )
            else:
                structural_sigs[body_norm] = sid
        # Check keyframe span vs segment duration
        seg_lens = [abs(s['t1'] - s['t0']) for s in segments if s['shot'] == sid]
        if seg_lens and 'poseAt(' in block and 'camZoom(' not in block:
            max_seg_len = max(seg_lens)
            kf_frames = [int(x) for x in re.findall(r'\bf\s*:\s*(\d+)', block)]
            if kf_frames and max(kf_frames) < min(30, int(max_seg_len * 0.45)):
                early_freezes.append(f"{sid} (last poseAt f:{max(kf_frames)} vs seg {max_seg_len}f)")
    if early_freezes:
        variety_warnings.append(
            f'  ! TRAP_EARLY_KEYFRAME_FREEZE: {len(early_freezes)} shot(s) stop primary poseAt keyframes too early: {", ".join(early_freezes[:8])}. '
            f'Extend keyframes across the full cut duration or pair with camZoom / multi-phase action!'
        )

for w in variety_warnings:
    print(w)

if strict_mode and variety_warnings:
    raise SystemExit(f'plan.py strict QA failed with {len(variety_warnings)} warning(s). Fix all TRAP_* issues before rendering.')

rows = ['| # | Shot | Scene | Size | In | Length | Clock | SubBeat/Var | Look | Words |', '|---|---|---|---|---|---|---|---|---|---|']
for k, s in enumerate(segments):
    d = shots[s['shot']]
    clock = f"{s['t0']:.0f}→{s['t1']:.0f}" + (' (back)' if s['t1'] < s['t0'] else '')
    sv = str(s.get('variant') or s.get('subBeat') or f"#{s.get('occurrence', 1)}")
    sc = d.get('scene', '-')
    rows.append(f"| {k + 1} | {s['shot']} | {sc} | {d.get('size', '')} | {s['a'] / FPS:.2f} s | {(s['b'] - s['a']) / FPS:.2f} s | {clock} | {sv} | {s.get('look', '')} | {s['line']} |")
md = f"# {tl['title']}: shot list\n\n{dur:.1f} s, {len(segments)} segments, {per_min:.0f} cuts/min\n\n" + '\n'.join(rows) + '\n'
(out_dir(slug) / 'shotlist.md').write_text(md, encoding='utf-8')
print(md)
