# The script: the seven-beat What If formula

Decoded on 21 Oct 2026 from five scripts across four channels that broke out with this format in October 2026
(Ifverse, FunNotSoFun, IFinity, Could've Been Tales). The full episodes run 3 to 10 minutes and hit all seven beats;
a 15 to 25 second episode is the cold open of one (beats 1 to 4 in full, 5 to 7 folded into the last line), while a
3 to 5 minute episode develops all seven beats in full with a duration-scaled shot budget.

## The seven beats

1. **Cold open in the middle of the action.** A flash-forward to the climax, or three or four quick demos of the
   power.
2. **The premise and its rules.** What changed overnight, and the rules it comes with.
3. **The fun part.** Escalating wins in everyday life.
4. **The not-so-fun part.** The cost, with real science and real numbers woven into the story ("That's real.").
5. **Someone powerful notices.** A man in a suit, robbers, a government.
6. **A moral choice with family at stake,** usually a little sister.
7. **Cliffhanger.** "Part 1 of 2", a question for the comments, sometimes an "is any of this real?" section and
   sourced science notes in the description.

Recurring cast: you (second person), a best friend, a little sister, mum. In our cast: Pip is "you", Mo is the best
friend, and `sis`, `mom` and `suit` are on the rig for beats 5 and 6.

## The 15 to 25 second shape

| Beat | Seconds | What it does | Example (rewind) |
|---|---|---|---|
| 1. Cold open | 0 to 11 | Three quick demos: a small everyday problem, the power, the win. The power's word is said every time. | "You knock your coffee off the desk. Rewind. You catch it." x3 |
| 2. Premise | 11 to 15 | The title card says it: "What if you could ...?", plus one rule. | "What if you could rewind ten seconds, any time you want?" |
| 3. Fun | 1 to 2 s | One line, or one more escalation. | "Sounds amazing." |
| 4 to 7. The turn | last 2 to 6 s | The cost, ideally one real fact with a number and "That's real.", then a line that leaves a question open. | "It's about to ruin your life." |

A longer cut (40 to 60 s) adds beat 4 properly (the fact, then its consequence on screen), the suit noticing (5)
and the sister in danger (6), and ends on "Part 1".

## Duration-Scaled Shot Budget & 7-Beat Full Episode Shape (3 to 5 Minutes)

When making a full 3 to 5 minute (`180–300 s`) episode instead of a 20-second cold open, **you must scale your unique shot count proportionally so the second half never repeats early shots**:

| Target Duration | Words | Total Cuts (`>=27/min`) | Minimum Unique Shots / Visual States | Anti-Repetition Rule |
|---|---|---|---|---|
| **15–25 s** (Cold Open) | 45–65 | 10–15 | **10–15 unique shots** | 1 shot per beat; only `reverse: true` rewind reuses a shot |
| **60–90 s** (Short Episode) | 160–240 | 32–45 | **28–42 unique shots** | Every beat in Acts 4–7 gets dedicated new shots |
| **3–5 min** (`180–300 s`) | 550–800 | 90–155 | **60–110+ unique shots** OR **30–40 parent scenes × 3 progressive `subBeat` states (`90–120` distinct visual states)** | Zero `A -> B -> A -> B` ping-pong loops; max 2 forward uses per shot ID unless each cut changes `subBeat` (`1 -> 2 -> 3`) or `variant` |

### 3-to-5-Minute 7-Beat Allocation (No Mid/Late-Act Starvation)
- **Beat 1 — Cold Open (`0:00–0:35`, `14–18` cuts)**: Either a single high-tension flash-forward scene OR 2–3 rapid everyday demos. **Crucial 1-to-1 Scene Continuity Rule (`TRAP_CROSS_SCENE_BLEED`)**: Keep all cuts of Demo 1 (`Sh1–Sh2`) contiguous before moving to Demo 2 (`Sh3–Sh4`), and all cuts of Demo 2 contiguous before Demo 3 (`Sh5–Sh6`). Never interleave shots from different demos (`Sh1 -> Sh3 -> Sh1 -> Sh4`) or reuse Beat 1 shots in Beats 4–7.
- **Beat 2 — Premise & Rules (`0:35–1:05`, `12–16` cuts)**: Title card + organic rule discovery. **Ban mechanical numbered lectures (`TRAP_MOTIF_CLONING`)**: Do not recite `"Quy luật thứ nhất... Quy luật thứ hai... Quy luật thứ ba..."` in every episode. Show the rule boundaries through an active test or visual experiment.
- **Beat 3 — The Fun Escalation (`1:05–2:00`, `22–28` cuts)**: 3 distinct multi-shot setpieces tailored to the chosen Narrative Archetype. Each setpiece gets its own dedicated shots and bespoke room/set (`<ArenaRing>`, `<Kitchen>`, `<Study>`, `<StreetRain>`, etc.).
- **Beat 4 — The Real Science Turn (`2:00–3:05`, `24–30` cuts)**: Biological/physical cost (`ATP`, neural warmth, relativity, entropy, or organ zoom via `ZOO.withAnatomyZoom` + `ZOO.drawOrganInset`). Every scientific step gets its own schematic or anatomical insert shot — never loop back to Beat 3 shots while explaining science.
- **Beat 5 — External / Systemic Consequence (`3:05–3:55`, `18–24` cuts)**: Escalate according to the episode's chosen Narrative Archetype (not every episode should use `"Suit in black SUVs + thermal drones"`!).
- **Beat 6 — Climax & Dilemma (`3:55–4:35`, `16–20` cuts)**: Dedicated climax setpiece matched to the power's unique physics (not every episode should repeat `"saving Sis and Mo at a rainy intersection"`!).
- **Beat 7 — Cliffhanger (`4:35–5:00`, `10–14` cuts)**: A twist ending specific to the topic's physical law + an open question for the comments.

## 5 Narrative Archetypes (Anti-Motif-Cloning Rule — `TRAP_MOTIF_CLONING`)

Audience fatigue happens when two episodes follow the exact same plot tropes (`3 fail-then-trigger-word gags -> 3 numbered rules -> sports/stocks win -> Suit in black vans + thermal drones -> save Sis & Mo at rainy intersection -> trapped in frozen time`). **Before writing `episode.json`, pick ONE of these 5 distinct Narrative Archetypes — never use the same archetype or climax trope twice in a row:**

1. **Archetype A — The Escalating Self-Experiment (*Thí Nghiệm Tự Thân Vượt Tầm Kiểm Soát*)**:
   - *Opening*: Starts in a single continuous laboratory/bedroom test pushing the ability from `1%` to `100%`.
   - *Escalation & Turn*: The hero measures their own body changing (bone density, neural voltage, gravity, metabolism) until the biology hits a runaway feedback threshold.
   - *Climax*: A solo race against the body's own physiological shutdown inside a sealed room or hospital scan — no secret agents or car crashes needed.
2. **Archetype B — The Contagion / Domino Chain (*Hiệu Ứng Domino Toàn Cầu*)**:
   - *Opening*: A tiny personal use of the power creates an invisible physical byproduct (mass-energy deficit, atmospheric heat, duplicated matter, time debt).
   - *Escalation & Turn*: Each use multiplies exponentially across the neighborhood -> city power grid -> planetary biosphere.
   - *Climax*: The hero must undo the chain reaction before the city's infrastructure collapses under the conservation-of-energy debt.
3. **Archetype C — The Cat-and-Mouse Investigation (*Cuộc Đấu Trí / Điều Tra Ngầm*)**:
   - *Opening*: Flash-forward to an interrogation room or anomaly scene where the impossible has already happened, then rewind to how it started.
   - *Escalation & Turn*: An investigator, doctor, or rival student notices the forensic/physical fingerprints left by the power (thermodynamic traces, Doppler shifts, missing milliseconds).
   - *Climax*: A tense mind-game trap where the hero must outsmart the investigator's scientific test without exposing the ability.
4. **Archetype D — The Survival Countdown (*Đếm Ngược Sinh Tồn*)**:
   - *Opening*: The ability activates involuntarily and cannot be turned off; a biological or physical countdown clock begins immediately.
   - *Escalation & Turn*: What starts as a superpower quickly becomes a sensory or physical prison (hearing every sound within 5 km, seeing 600 frames per second, zero friction).
   - *Climax*: A high-stakes rescue or escape where using the power one last time pushes the countdown to its final second.
5. **Archetype E — The Paradox / Double-Edged Bargain (*Nghịch Lý Nhân Quả*)**:
   - *Opening*: Three contrasting everyday vignettes showing how the power solves a problem in one second — but quietly steals something equivalent from somewhere else.
   - *Escalation & Turn*: The hero discovers the hidden conservation law (every healed wound ages a cell, every skipped hour erases a memory, every copied object drains ambient heat).
   - *Climax*: A moral choice between keeping the power's gifts or paying the accumulated paradox debt to restore someone close.

## Writing rules

- **Second person, present tense, short sentences.** Three to eight words. "Copy a cookie. Paste." beats "Imagine if
  you were able to duplicate a cookie."
- **Every line is a picture.** Each demo has to read in one shot with no text on screen: a mug, a stair, a quiz, a
  cookie, a friend. If a line needs a caption to be understood, rewrite the line.
- **The power has a word, a sound and a look.** "Rewind" plus tape whirr plus a stopwatch counting back; "Copy...
  Paste" plus a selection box plus a pop. Say the word in every demo, so the viewer learns the grammar by the third.
- **Escalate the demos.** Small and selfish, then useful, then a little uncanny (a cookie, the homework, your best
  friend). The third demo should make the viewer slightly uneasy: it sets up the turn.
- **One real fact in the turn, with a number, checked.** Work the arithmetic, write it in the episode's `science`
  field with its source, and only then put it in the script. "That's real." goes straight after it. Never invent a
  number, never round one into a different claim.
- **End on a question or a threat,** never a resolution: "So where are yours coming from?", "It's about to ruin
  your life."
- **Length:** 45 to 65 words lands at 15 to 25 seconds after voice.py tightens the pauses (about 2.7 words a
  second); 550 to 800 words lands at 3 to 5 minutes.
- **The title card** is the premise, in capitals: line 1 `WHAT IF YOU COULD`, line 2 the power in four words or
  fewer with a question mark. One word of line 2 can pulse as the accent (`10`, `ANYTHING`).

## Choosing a topic

- An everyday power with clear rules and a hidden cost works best: time (rewind, pause, skip), copies, senses (hear
  thoughts, see an hour ahead), body (never sleep, 10x reaction), money, luck.
- The cost should come from real science (energy, biology, physics, economics), so beat 4 can teach something true.
- Don't remake a channel's episode: search YouTube for the premise first, and if a What If channel already has that
  exact title, pick a different power or a different rule. Most everyday powers have been done somewhere (copy-paste
  turned up a comedy short and a "Copy Powers" episode); the story, the rule and the turn are what make it ours.
  The formula is shared; the stories are ours.
- No real people, no brands, no famous characters, nothing that resembles one.

## episode.json: the script part

The copy-paste example (`studio/src/episodes/copy-paste/episode.json`), 61 words, 23 s:

```json
"topic": "What if you could copy and paste anything?",
"title": ["WHAT IF YOU COULD", "COPY AND PASTE ANYTHING?"],
"script": [
  {"beat": "1 cold open, demo 1 (small and selfish)", "text": "Copy a cookie. Paste. Free cookies, forever."},
  {"beat": "1 cold open, demo 2 (useful)", "text": "Copy your homework. Paste. Done."},
  {"beat": "1 cold open, demo 3 (a little uncanny)", "text": "Copy your best friend. Paste. Okay, that's weird."},
  {"beat": "2 the premise (title card)", "text": "What if you could copy and paste anything?"},
  {"beat": "4 the turn: the cost, one real fact", "text": "One catch: a copy can't come from nothing. One cookie, made from pure energy, needs every power plant on Earth running for over ten minutes. That's real."},
  {"beat": "5-7 folded into a question", "text": "So where are yours coming from?"}
],
"science": [
  {"claim": "One cookie made from pure energy needs every power plant on Earth running for over ten minutes.",
   "working": "A 30 g cookie: E = mc^2 = 2.70e15 J. World electricity, 29,925 TWh in 2023 = 3.4e12 W on average. 2.70e15 / 3.4e12 = about 13 minutes. Over ten minutes holds above about 24 g; the schematic states the 30 g.",
   "source": "mass-energy equivalence; Ember, Global Electricity Review 2024"}
]
```

`voice.py` joins the beats' text with spaces and sends it as one take, so the read flows; the beats are for you and
for the storyboard.
