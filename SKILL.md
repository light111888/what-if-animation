---
name: what-if-animation
description: >-
  Make a "What If" animated episode from one topic line ("What if you could rewind 10 seconds?"),
  in the dusk-lit stick-figure style of the viral What If channels. Follows the 7-beat What If formula,
  voices via the existing Lemo-Opuscar project TTS skill (F:\du an python\lemo-opuscar-thanks\core\tts\:
  OmniVoice 24kHz zero-shot presets dratelling/bradikinin/0726 with clean_studio_voice DSP, AI33/Edge-TTS
  VOICE_CATALOG.md, or AivisSpeech GPU for Japanese), scales shot count with episode duration (10-15 shots for
  15-25s, 60-110+ unique shots or 3-Beat Progressive Sub-Beats for 3-5m with zero mid/late-act repetition),
  renders a captioned storyboard of stills and self-checks it against an 11-point checklist before animating
  in SVG/Remotion AND exporting a native .styk project for StykAnimate & Backlot, syncs sound effects, and
  masters to -14 LUFS. Use when asked for a What If episode, stick-figure explainer, or the what-if-animation pipeline.
---

# What If Animation (Antigravity + Lemo-Opuscar TTS + StykAnimate Edition)

One topic line in, a finished animated episode out (from a 15–25s cold open up to a full 3–5 minute 7-beat episode) — rendered both as a dusk-lit SVG/Remotion master (`<slug>-final.mp4` + `storyboard.jpg`) and as a 100% editable native **StykAnimate `.styk` project** (`<slug>.styk`) ready for the StykAnimate Editor and Backlot Living Storyboard (`http://127.0.0.1:4750`).

Two complete reference episodes ship in `studio/src/episodes/`:
- `rewind` ("What if you could rewind 10 seconds?": shots played backwards as the power)
- `copy-paste` ("What if you could copy and paste anything?": kitchen & schematic sets, selection marquee, cliffhanger blackout)

| Resource | Purpose |
| :--- | :--- |
| [`references/formula.md`](./references/formula.md) | The 7-beat What If formula, 15–25 s pacing shape, script writing rules, topic selection |
| [`references/look.md`](./references/look.md) | Measured dusk look, 27+ cuts/min pace, shot vocabulary, 11-point storyboard & motion checklists |
| [`references/kit.md`](./references/kit.md) | SVG building blocks: `Hero`, `LOOKS`, `poseAt`, `faceAt`, perspective room kit, `ZOO` anatomical zoom & organ loupe inset |
| [`references/sound.md`](./references/sound.md) | Antigravity TTS routing (`OmniVoice` / `AivisSpeech` / `ElevenLabs`), `spoken_text` normalization, sound events & LUFS levels |
| [`references/traps.md`](./references/traps.md) | Visual, motion, sound, and pipeline traps to avoid before rendering |
| `artifacts/what-if-studio/` | Active workspace Remotion SVG studio (or `<skill>/studio` template) |
| [`scripts/`](./scripts/) | `voice.py`, `plan.py`, `stills.mjs`, `board.py`, `sfx.py`, `mixcheck.py`, `motiongrid.py`, `master.py`, `styk_export.mjs` |

---

## Mandatory Antigravity Engineering Rules

1. **Manual Cognitive Reasoning Only (No Script-Generated Prompts/Stories/Shots)**:
   - You **MUST** manually read, reason, and author every beat of `episode.json` (7-beat script, worked-out `science` math, `shots`, `edit` cues, `fx`, `sound`) and manually write `shots.tsx` and `index.tsx`.
   - **NEVER** use Python or JS scripts to generate, expand, or template story beats, shot descriptions, or SVG choreography. Scripts in `scripts/` are strictly for mechanical TTS synthesis, timeline resolution, rendering, and QA verification after manual authoring.
2. **Mandatory Existing-Project TTS Skill Routing (`F:\du an python\lemo-opuscar-thanks\core\tts\`) & Spoken-Text Normalization**:
   - **Default Vietnamese (`vi`) & English (`en`) — Lemo-Opuscar OmniVoice (`tts_omnivoice.py`)**: Delegates directly to `F:\du an python\lemo-opuscar-thanks\core\tts\tts_omnivoice.py` via `F:\du an python\OmniVoice\.venv\Scripts\python.exe`, using pre-cached zero-shot `VoiceClonePrompt` `.pt` presets (`--preset dratelling` default for `vi`, `--preset bradikinin` default for `en`, `--preset 0726` for reflective/healing) and its `clean_studio_voice` DSP chain (DC removal, binomial low-pass de-hiss, soft-knee breath gate, cosine fades, and `--skip-existing` per-line WAV caching).
   - **Curated Genre Voices (`--provider ai33` / `--provider edge`)**: Delegates to `F:\du an python\lemo-opuscar-thanks\core\tts\tts_ai33.py` using `F:\du an python\lemo-opuscar-thanks\core\tts\VOICE_CATALOG.md` (`minimax_*`, `vbee_*`, `edge_vi-VN-NamMinhNeural`, `edge_vi-VN-HoaiMyNeural`, `kokoro_af_heart`, with `--offline-edge` fallback).
   - **Japanese (`ja` / `jp`)**: Mandatory **AivisSpeech (`AivisSpeech-Engine --use_gpu`)** paired with `aivisspeech-emotion-director` (`style_id` non-Normal emotion, `intonationScale` `0.0~2.0`, `tempoDynamicsScale` `0.0~2.0`, locked `pitchScale = 0.0`, and PCM silence `postPauseSec` for `間`).
   - **Spoken-Text Normalization**: In `episode.json`, provide `"spoken_text"` alongside `"text"` on every beat containing numbers, decimals, percentages, units, or symbols. Write 100% of numbers and symbols as full words in `"spoken_text"` (zero digits `0-9`, zero `%`, `°`, `/`, `+`, `=`). Decimal-unit phrases (`3.2 triệu năm`, `4.5 tỷ năm`, `1.5 mét`) MUST be written as unbroken words (`ba phẩy hai triệu năm`, `three point two million years`) so sentence tokenizers never split at the decimal dot.
3. **Mandatory Narrative Diversity, Visual-Script 1-to-1 Alignment & Anti-Repetition Gates**:
   - **5 Narrative Archetypes (`TRAP_MOTIF_CLONING` Prevention)**: Read [`references/formula.md`](./references/formula.md) and select one of the **5 Narrative Archetypes** (`Escalating Self-Experiment`, `Contagion Domino Chain`, `Cat-and-Mouse Investigation`, `Survival Countdown`, `Paradox Bargain`). Never clone the same plot motif (`"3 fail-then-keyword gags -> Quy luật 1, 2, 3 -> sports/stocks win -> Suit in black vans -> save Sis & Mo at rainy intersection"`) across episodes.
   - **1-to-1 Visual-Script Scene & Set Alignment (`TRAP_CROSS_SCENE_BLEED` & `TRAP_WRONG_SET_REUSE`)**:
     - Declare `"scene"` on every shot in `episode.json` (`"noodle_fly"`, `"chem_lab"`, `"rooftop_ball"`, etc.) and keep all cuts of a scene **100% contiguous** in `edit`. Never interleave shots from different scenes (`plan.py` blocks `TRAP_CROSS_SCENE_BLEED` and `TRAP_VISUAL_SCRIPT_MISMATCH`).
     - Match engine sets to the script: pass a custom `board=` prop to `<Classroom>` for non-math scenes, and use `<StreetRain>`, `<ArenaRing>`, or `<SurveillanceLab>` instead of `<Rooftop>` for street/arena/control-room scenes.
   - **Strict 1-Cut-1-Unique-Shot Policy (`TRAP_SHOT_RECYCLING`, `TRAP_CYCLE_LOOP`, `TRAP_ADJACENT_SAME_FRAMING`)**:
     - **Every forward cut in `edit` MUST map to a 100% unique shot ID (`Sh1..ShN`, `count == 1`)!** Reusing the same shot ID in forward mode—even with `subBeat` or `variant` parameters—is strictly forbidden because 90%+ of the SVG frame remains identical and creates visible `A->B->C->A->B->C` repetition cycles.
     - Only a `reverse: true` rewind cut may ever reference a previously seen shot ID.
     - `15–25s` Cold Open: `10–15` unique shots (`1` unique shot per forward cut).
     - `3–5 min` (`180–300s`) Episode: `90–137+` unique shots (`1` unique shot per forward cut).
     - `8+ min` (`480–540s+`) Long-Form Episode: `120–160+` unique shots (`1` unique shot per forward cut across `10–15` distinct engine sets including `SubwayCar`, `BioMedLab`, `ForestCanopy`, `OceanAbyss`, `ObservatoryDome`, `HospitalICU`, `CityHighway`, `ServerVault`).
     - Never use the same camera `size` on 3 consecutive cuts (`TRAP_ADJACENT_SAME_FRAMING`).
   - **Full-Segment Continuous Motion (`TRAP_EARLY_KEYFRAME_FREEZE`, `TRAP_HIGH_FREQ_JITTER`, `TRAP_DISEMBODIED_LIMBS`)**:
     - `poseAt` in `engine/rig.tsx` automatically applies `applyBioLife` (breathing around the feet pivot, micro head/arm follow-through, natural blinking) so characters never freeze like statues, AND primary `poseAt` / `camZoom` keyframes must span the full cut duration (`plan.py --strict` blocks `TRAP_EARLY_KEYFRAME_FREEZE` and `qa_loop.py` verifies both first-half and second-half pixel motion delta on rendered video).
     - Never use high-frequency trig jitter (`Math.sin(t * 1.9) * 260`) on props or hands; use smooth `kf(t, [...])` trajectories.
     - In close-up/macro hand inserts, use `<InsertArm>` (curved sleeve + forearm + mitten) rather than floating circles, and attach held props via `toWorld(pose, joints(pose).armR.end)`.
4. **Mandatory Animal Illustration & Anatomical Zoom (`ZOO.*`)**:
   - In any episode involving animals, creatures, or paleobiology, draw a recognizable anatomical animal via `ZOO.drawAnimal`. Whenever narration or the script mentions a body part or internal organ (`eye`/`retina`, `brain`/`neuron`, `heart`, `lungs`/`airsac`, `jaw`, `spine`, `fin`, `claw`, `skin`), smoothly zoom the camera into that organ (`ZOO.withAnatomyZoom` + `ZOO.drawAnatomyReticle`) AND display a connected Magnifying Loupe Inset (`ZOO.drawOrganInset` + `ZOO.drawOrgan`).
5. **Original Characters & Sourced Facts**:
   - Use only our original cast (`pip`, `pipHood`, `pipInk`, `mo`, `sis`, `mom`, `suit`). Never copy another channel's hero or a famous cartoon silhouette.
   - Work out and cite every scientific claim in `episode.json`'s `science` array before voicing.
   - **Storyboard before animation**: Never render full video until the stills pass the 11-point self-check (Step 5).

---

## Workspace Setup (Already Installed in `StykAnimate-App-main`)

In this repository (`f:\du an python\StykAnimate-App-main`):
- The workspace skill is installed at `.agents/skills/what-if-animation/` (and globally at `C:\Users\light\.gemini\config\skills\what-if-animation\`).
- The Remotion studio is installed at `artifacts/what-if-studio/` (gitignored to keep the core StykAnimate desktop bundle zero-dependency).
- All scripts in `.agents/skills/what-if-animation/scripts/` automatically detect `artifacts/what-if-studio/` when run from the repository root!
- If initializing a fresh workspace elsewhere:
  ```powershell
  Copy-Item -Recurse -Force "C:\Users\light\.gemini\config\skills\what-if-animation\studio" ".\artifacts\what-if-studio"
  Push-Location ".\artifacts\what-if-studio" ; npm.cmd install ; Pop-Location
  ```

---

## The 8-Step Pipeline

Work through the steps in order. Every script can be run directly from the repository root (`f:\du an python\StykAnimate-App-main`) or from `artifacts/what-if-studio`.

### 1. Script (`episode.json`)
Read [`references/formula.md`](./references/formula.md). Decide the power's keyword, its rule, three escalating demos (selfish -> useful -> uncanny), and the turn (one real scientific fact with worked-out numbers).
Write `artifacts/what-if-studio/src/episodes/<slug>/episode.json` with:
- `id` (PascalCase composition ID), `slug`, `language` (`"vi"`, `"en"`, `"ja"`), `topic`, `title` (two uppercase lines), `accent`
- `script`: array of beats, each with `"beat"`, `"text"` (display), and `"spoken_text"` (100% spelled-out words, zero digits/symbols, unbroken decimals)
- `science`: array of `{ "claim", "working", "source" }`
Target 45 to 65 words (15–25 seconds at ~2.7 words/sec).

### 2. Voice (`voice.wav` + `words.json`) — Existing Lemo-Opuscar TTS Skill
```powershell
# Default: Lemo-Opuscar OmniVoice 24kHz zero-shot preset (dratelling for vi, bradikinin for en)
python .agents/skills/what-if-animation/scripts/voice.py <slug> --preset dratelling

# Or curated Lemo-Opuscar VOICE_CATALOG.md voice via tts_ai33.py / offline Edge-TTS:
python .agents/skills/what-if-animation/scripts/voice.py <slug> --provider edge --voice edge_vi-VN-NamMinhNeural
```
Routes directly through `F:\du an python\lemo-opuscar-thanks\core\tts\tts_omnivoice.py` (with `clean_studio_voice` DSP de-hiss/noise-gate and `--skip-existing` per-line WAV caching) or `tts_ai33.py` (`VOICE_CATALOG.md`), or AivisSpeech GPU (`ja`), tightens pauses via `gaps`, and writes `public/<slug>/voice.wav` and `src/episodes/<slug>/words.json`.

### 3. Shot List (`timeline.json` + `shotlist.md`) — Duration-Scaled & Anti-Repetition Audited
Scale your shot count to the episode length (`10–15` shots for `15–25s`; `28–42` shots for `60–90s`; `60–110+` shots or `30–40` scenes × `3` progressive `subBeats` for `3–5 min` episodes) — varying shot size and angle on every cut (`wide`, `macro insert`, `medium`, `close-up`, `over the shoulder`, `high angle`, `low angle`, `schematic`; see [`references/look.md`](./references/look.md)). Add `shots`, `edit` (including `subBeat` / `variant` if revisiting a scene), and `fx` to `episode.json`, then run:
```powershell
python .agents/skills/what-if-animation/scripts/plan.py <slug>
```
Writes `src/episodes/<slug>/timeline.json` and `out/<slug>/shotlist.md`, and runs the **Anti-Repetition Gate** (`TRAP_SHOT_RECYCLING`, `TRAP_PING_PONG_LOOP`, `TRAP_LATE_ACT_STARVATION`). Aim for **27+ cuts/minute** in the opening and no static shot over ~3 seconds.

### 4. Storyboard (`shots.tsx`, `index.tsx`, `storyboard.jpg`)
Read [`references/kit.md`](./references/kit.md). Author `src/episodes/<slug>/shots.tsx` (one pure component of clock `t` per shot) and `src/episodes/<slug>/index.tsx`, and register the episode in `src/episodes/index.ts`. Then typecheck and render the storyboard contact sheet:
```powershell
Push-Location artifacts/what-if-studio ; npx.cmd tsc --noEmit ; Pop-Location
node .agents/skills/what-if-animation/scripts/stills.mjs <slug>
python .agents/skills/what-if-animation/scripts/board.py <slug>
```
Produces `artifacts/what-if-studio/out/<slug>/storyboard.jpg` and individual stills in `out/<slug>/board/<shot>.png`.

### 5. Self-Check the Stills (11-Point Checklist + Human Gate)
Inspect `out/<slug>/storyboard.jpg` and each still in `out/<slug>/board/` against the 11-point checklist in [`references/look.md`](./references/look.md) and [`references/traps.md`](./references/traps.md). Fix any framing, contrast, LightVeil, or limb overlap issues, re-render affected shots (`node .agents/skills/what-if-animation/scripts/stills.mjs <slug> S3 S7`), and rebuild `board.py` before animating.

### 6. Animate & Export Native `.styk` (`motiongrid.py` + `styk_export.mjs`)
Bring each shot to life from its key pose (`poseAt` with anticipation, holds, and overshoot; `faceAt` blink-swaps; `kf` camera moves; `ZOO.withAnatomyZoom` + `ZOO.drawOrganInset` for animal anatomy).
Export the native editable StykAnimate `.styk` project and inspect motion grids:
```powershell
node .agents/skills/what-if-animation/scripts/styk_export.mjs <slug>
python .agents/skills/what-if-animation/scripts/master.py <slug>
python .agents/skills/what-if-animation/scripts/motiongrid.py <slug> S2 S5
```

### 7. Sound & Voice Clarity Check (`sfx.py` + `mixcheck.py`)
Read [`references/sound.md`](./references/sound.md). Add `sound` (`clips`, `events`, `repeats`, `music`, `levels`) to `episode.json`. Reuse the 40 starter clips in `studio/library/sfx/` or synthesize new clips locally (or via ElevenLabs):
```powershell
python .agents/skills/what-if-animation/scripts/sfx.py <slug> --dry
python .agents/skills/what-if-animation/scripts/sfx.py <slug>
python .agents/skills/what-if-animation/scripts/mixcheck.py <slug>
```
Ensure illustrative sound hits land in the pause *after* their cue word so speech remains clear by >= 3 dB.

### 8. Master to `-14 LUFS` & Sync to StykAnimate Backlot (`master.py`)
```powershell
python .agents/skills/what-if-animation/scripts/master.py <slug>
```
Renders the episode, normalizes loudness to **-14 LUFS** (`true peak <= -1 dBTP`), and writes `out/<slug>/<slug>-final.mp4` and `out/<slug>/report.json`.
You can also bridge any episode directly into a full StykAnimate Backlot production (`artifacts/productions/<project-id>/`) using the `what_if_studio_bridge` tool in `scripts/agent-studio/tools/what-if-tools.mjs`!
