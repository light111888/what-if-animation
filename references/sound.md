# Sound & Antigravity TTS Governance

The genre is dense with sound: every visible action has its own effect, ambience fills every gap, a light music bed runs under the cold open and cuts out at the turn.

## Antigravity & Lemo-Opuscar Project TTS Routing (`F:\du an python\lemo-opuscar-thanks\core\tts\`)

1. **Default TTS Engine — Existing Project TTS Skill (`voice.py`)**:
   - `voice.py` automatically discovers and delegates to the existing TTS pipeline in `F:\du an python\lemo-opuscar-thanks\core\tts\`:
     - **Default Vietnamese (`vi`) & English (`en`) — `core/tts/tts_omnivoice.py`**:
       - Runs via `F:\du an python\OmniVoice\.venv\Scripts\python.exe` with pre-cached zero-shot `VoiceClonePrompt` `.pt` voice prompts (`F:\du an python\lemo-opuscar-thanks\core\tts\presets\`):
         - `--preset dratelling` (Default for Vietnamese `vi` — warm, dramatic What-If / documentary narrator)
         - `--preset bradikinin` (Default for English `en` — crisp documentary narrator)
         - `--preset 0726` (Reflective / healing / memoir narrator)
       - Applies `clean_studio_voice()` DSP post-processing automatically (DC offset removal, 3-pass binomial low-pass de-hiss above 8 kHz, soft-knee noise gate between phrases, 15 ms cosine fade-in / 40 ms fade-out) and caches per-line WAVs (`--skip-existing` + `dur.json`).
     - **Curated Genre Voices (`--provider ai33` / `--provider edge`) — `core/tts/tts_ai33.py`**:
       - Uses `F:\du an python\lemo-opuscar-thanks\core\tts\VOICE_CATALOG.md` (`minimax_narrator_warm`, `vbee_n_hn_male_nguyenvan_news_48k-fhg`, `edge_vi-VN-NamMinhNeural`, `edge_vi-VN-HoaiMyNeural`, `kokoro_af_heart`, etc.) with automatic `--offline-edge` fallback when `AI33_API_KEY` is not set.
     - **Japanese (`ja` / `jp` / `Japanese`)**:
       - Mandatory **AivisSpeech (`AivisSpeech-Engine --use_gpu`)** at `http://127.0.0.1:10101` paired with `aivisspeech-emotion-director`. Select a specific non-Normal (`ノーマル`-excluded) emotion `style_id`, shape prosody with `intonationScale` (`0.0~2.0`), `tempoDynamicsScale` (`0.0~2.0`), `speedScale`, and `volumeScale`, **always lock `pitchScale = 0.0`**, and insert dramatic pauses (`間`) via `postPauseSec` PCM silence.
     - **CLI Examples**:
       ```powershell
       # Default Lemo-Opuscar OmniVoice preset (dratelling for vi, bradikinin for en)
       python .agents/skills/what-if-animation/scripts/voice.py <slug> --preset dratelling

       # Curated Lemo-Opuscar VOICE_CATALOG.md voice via tts_ai33.py / offline Edge-TTS
       python .agents/skills/what-if-animation/scripts/voice.py <slug> --provider edge --voice edge_vi-VN-NamMinhNeural
       ```
2. **Mandatory Spoken-Text Normalization & Anti-Sentence-Break Rule**:
   - Every beat in `episode.json` can include `"text"` (concise display/caption text) and `"spoken_text"` (the exact string sent to TTS).
   - In `"spoken_text"`, **ALL** digits (`0-9`), decimals, percentages, units, and math symbols (`%`, `°`, `/`, `+`, `=`) MUST be written out in full words (`4%` -> `bốn phần trăm`, `100 km/h` -> `một trăm ki-lô-mét một giờ`, `DNA` -> `Đê-En-A`).
   - **Decimal + Unit Anti-Sentence-Break**: Phrases like `3.2 triệu năm`, `4.5 tỷ năm`, `1.5 mét` MUST be written seamlessly as `ba phẩy hai triệu năm` (or `three point two million years` in English) without any `.` that a sentence tokenizer could split mid-phrase.
3. **Sound Effects & Starter Library (`sfx.py`)**:
   - 40 starter clips ship in `studio/library/sfx/` and are reused automatically at 0 cost.
   - Missing clips are synthesized locally via deterministic 44.1 kHz procedural synthesis by default (0 credits), or via ElevenLabs Sound Generation when `ELEVENLABS_API_KEY` is configured and `--local` is not passed.

## Writing the events

One event per visible action, cued to the shot it happens in, so retiming the voice never breaks the sync:

```json
"events": [
  ["S2+6", "glass_tink", 0.5],                    cue, clip, gain (0..1, clips are peak-levelled first)
  ["S3+2", "whoosh", 0.4, "peak"],                "peak": the clip's loudest moment lands on the cue (whooshes, booms)
  ["S1", "kitchen_tone", 0.12, "onset", "S6"],    an ambience from S1 cut (with a fade) where S6 starts
  ["paste+2", "pop", 0.5]                         or cue on a word
]
```

- **A hit that illustrates a word lands in the pause after it, never on it.** The copy-paste run first put each paste's pop on the word "Paste" and covered it; moved four to six frames later, into the gap, the word reads and the pop lands as the answer to it. Move the picture with it (the copy appears with its sound).
- **Align by the attack, not the file start:** `onset` (default) finds where the clip actually starts sounding. A hit on the frame of the visible impact; a whoosh with `peak` on the frame of the fastest movement.
- **Layers for each beat:** the action (a step, a catch), the power (its signature sound every time it's used), the reaction (a laugh, a gasp, a sparkle), and the room (an ambience per location, cut at the location change).
- **The power's sound** is the episode's signature: the same clip every time, so the viewer hears the rule.
- **The turn** gets a low hit (drone or boom) on its first frame, the music cut on the same frame, and one detail sound repeated (bulbs dying, lights switching off) through `repeats`.
- **Silence is a tool:** cut the music a beat before the title boom or the turn so the hit lands in a gap.

## Prompts that work

Describe the physical source, the material and the length: "a ceramic coffee mug smashing on a wooden floor, shards scattering and liquid splash" beats "smash sound". Add "cartoon" for exaggerated comedy sounds (a tiptoe, dizzy birds), "short" for one-shots, "no voices" for ambiences. Durations: 0.5 to 1.6 s for hits, 2 to 12 s for ambiences, the episode's length for the music bed ("playful quirky cartoon background music, pizzicato strings, glockenspiel and soft bass, light and curious, 110 bpm, no vocals").

Check the library first (`python <skill>/scripts/sfx.py <slug> --dry` lists what's cached): reuse a clip by giving it the same name, prompt and length.

## Levels

`sfx.py` measures the voice and each stem and sets their volumes in the mix:

- effects stem: `sfx_lu` LU against the voice, integrated. The default, +1.5, is about where the approved proof clip sat (+1.9); the copy-paste run settled at -1.5 after the mix check.
- music bed: `music_lu` (default -9.5) LU against the voice.
- The whole effects stem is levelled to `sfx_lu`, so lowering one event's gain makes the others louder. Lower events to change the balance inside the stem; lower `sfx_lu` to give the voice more room overall.
- The final mix is brought to -14 LUFS with true peaks under -1 dBTP by `master.py`.

Then run `mixcheck.py`: it lists the spoken moments where effects or music come within 3 dB of the voice. Fix the words that matter (the fact, the last line) by moving a hit into the pause after the word or lowering it; a title boom or a drone on the turn can stay.
