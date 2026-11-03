# The look: what the genre does, and the self-check

Measured on 21 Oct 2026, frame by frame, from the leading channel's most-viewed episode (4.2M views, 24 fps) with
ffmpeg scene detection. We learn the technique (timing, camera grammar, light); every character, set and story stays
our own. Nothing confirms how the viral channels make their videos, so never say or imply they're made with Claude
or any other tool.

## Pace

| | The genre | Our target for 15-25 s (and 3-5 min) |
|---|---|---|
| Cuts per minute, opening | about 27 (first 90 s) | 27 or more; the cold open can run 40-70 with reversals |
| Median shot | 2.7 s in the opening | 0.7 to 3 s |
| Long holds | up to about 12 s, always with action inside | nothing static over about 3 s |

- Cuts come from **changing shot size**, not from motion: wide, then a macro insert, then a medium, then a close-up
  of a hand, then a reaction. No two neighbouring shots share a size and angle.
- The opening runs about twice as fast as the rest. Cut on the word: `plan.py` lands each cut 2 frames before its
  cue word.
- **Strict 1-Cut-1-Unique-Shot Policy & Continuous Motion (`TRAP_SHOT_RECYCLING`, `TRAP_CYCLE_LOOP`, `TRAP_EARLY_KEYFRAME_FREEZE`)**:
  - Every forward cut in `edit` MUST have its own unique shot ID (`Sh1..ShN`, `count == 1`). Never reuse a shot ID in forward mode (even with `subBeat` or `variant`), and never repeat any shot transition (`A -> B`) or alternate `ShotA -> ShotB -> ShotA`. Only a `reverse: true` rewind pair may revisit a shot.
  - Alternate camera `size` on every cut (`wide`, `macro insert`, `medium`, `close-up`, `extreme close-up`, `over the shoulder`, `schematic`); never use the same `size` 3 times in a row (`TRAP_ADJACENT_SAME_FRAMING`).
  - Span `poseAt` and `camZoom(t, s0, s1, dur)` across the full duration of each segment so neither the character nor the camera freezes mid-cut (`qa_loop.py` checks both first-half and second-half motion delta).
- **1-to-1 Visual-Script Scene & Set Alignment (`TRAP_CROSS_SCENE_BLEED` & `TRAP_WRONG_SET_REUSE`)**:
  - Every shot in `episode.json` should declare `"scene"` (e.g. `"noodle_fly"`, `"chem_lab"`, `"rooftop_ball"`, `"arena_sport"`, `"street_climax"`). Keep all cuts of a scene contiguous in `edit` — never cut back to a Noodle Bowl shot during a Chemistry Lab or Rooftop Baseball narration!
  - Match the engine set to the script's location:
    - `<Classroom board={<g>...</g>}>`: Always pass a custom `board=` prop unless the scene is literally a math class about `7 × 8 = ?`.
    - `<StreetRain>`: Use for rain-slicked city intersections, crosswalks, streetlights, construction cranes, and black SUV blockades (never use `<Rooftop>` with sunset party string lights for a street scene!).
    - `<ArenaRing>`: Use for indoor boxing rings, table-tennis clubs, or stadium matches.
    - `<SurveillanceLab>`: Use for biometric telemetry / agency control rooms.

## Light does most of the work

- A dusk palette: purple to orange sky, a low sun with soft rays behind the subject.
- **Every light comes from something you can see:** a window with the sun in it, a pendant, a wall light, a desk
  lamp, string lights, a lit doorway, city windows. Pools of light, dark corners.
- Muted, mid-dark walls (`S3` palette), so the practicals read; then `LightVeil` sinks the mid-tones further and
  leaves holes where the light falls.
- A warm rim light on every character edge, on the side facing the light (`rimId="rimR"` or `"rimL"`;
  `"rimRed"` for the turn).
- Haze, dust in the beams (`Dust`), soft bokeh. Depth of field: foreground objects blurred dark (`Foreground`),
  the middle sharp, the background soft on close-ups (`blur16` on a scaled-up set).
- Grain on twos and a soft vignette finish the frame (the engine's `Grade`).

## Shot vocabulary

- **Establishing wide:** the whole lit room, the character small in it.
- **Medium** (waist up, camera zoom about 1.6 to 2) and **close-up** (head; 3 to 4.5 for an extreme close-up).
- **Macro insert:** an object huge in frame, shallow focus (a mug, a cookie, a hand), often a high or top-down angle.
- **Over the shoulder:** a big, dark, blurred foreground figure filling a third of the frame.
- **High angle / top-down** (looking down at a desk, a landing) and **low angle** (looking up at a character against
  the sky: the rooftop's `low` prop).
- **Schematic** for the science beat: a dark grid, line icons, labels in the mono face, numbers counting.
- **Title card:** a wide establishing shot with the title over it, small first line, big second line.

## Characters

- Mostly three-quarter or profile (`yaw`), rarely face-on; the face slides toward the side they face.
- They animate very little: holds are near-still, with small hand changes. Expressions swap instantly through a
  blink (`faceAt`), never morph.
- Life comes from around them: a one-frame flash on an impact, focus rings, a timer, floating labels, dust, steam,
  a swaying lamp, a slow push-in.
- One hero who never changes. Every costume is a `Look` on the one rig, so it can't drift.

## On-screen text

Almost none. The title card, and small UI readouts in the mono face (a timer, a chip naming the power, a short
label). No speech bubbles, no "HA HA", no captions of the voice.

## The storyboard self-check (step 5)

Look at `storyboard.jpg`, then open every still at full size. Fix anything that fails, re-render those shots, look
again. Only a board that passes goes to animation.

1. **One read in a second.** At phone size the subject and the action are clear. If it needs the voice to make
   sense, reframe it.
2. **Sizes change.** No two neighbours share a size and angle; the board has wides, inserts, mediums, close-ups and
   at least one high or low angle.
3. **Light from a source.** Every shot has a visible practical or sunlight, and the subject sits in or against a
   pool of it. Mid-tones are dark; nothing is evenly lit.
4. **The character pops.** The face is the brightest, sharpest thing in its area; the rim light is on the lit side;
   no dark limb on a dark wall.
5. **Depth.** A blurred dark foreground in about a third of the shots; soft backgrounds on close-ups.
6. **The world is full.** Wides show 20 or more designed objects; no empty wall, no floating furniture. Everything
   that stands has legs and a contact shadow.
7. **Perspective holds.** Objects sit on their surfaces, at the right scale for the character, toward the room's
   vanishing point.
8. **Acting matches the line.** The expression and pose say the line without the voice; the hand that moves is the
   near one (with `yaw < 0` the far arm hides behind the body).
9. **Continuity.** Same costume, same set layout, same props in the same places across shots of one place.
10. **Only the title and readouts as text,** spelled right, inside the frame.
11. **Ours.** Nothing resembles a famous character, a channel's hero or a brand.

## The motion check (step 6)

Pull frame grids of every action shot with `motiongrid.py` and read them like a flipbook.

- Anticipation before a big move (a crouch before a step, a wind-up before a grab), a hold of 2 frames on the beat
  where the character realises, overshoot and settle on landings and catches.
- Nothing static for more than about a second: something always moves (dust, steam, a sway, a push-in).
- The action lands on its word, within about 3 frames.
- Reversals read backwards (every move derives from `t`, so it does).
- No pops: a prop never jumps between frames unless it's meant to (a paste, a flash).
- **Smooth Keyframed Trajectories (`kf`) Instead of High-Frequency Trig Jitter (`TRAP_HIGH_FREQ_JITTER`)**:
  - Never animate flying props, hands, or characters with high-frequency sine/cosine waves like `Math.sin(t * 1.9) * 260` or `Math.sin(t * 0.9) * 180` — at 24–30 fps, `t * 1.9` jumps by ~110 radians per second, making the object teleport chaotically across the frame!
  - Always use `kf(t, [0, 12, 24], [x0, xMid, xEnd])` or `lerp(a, b, easeOut(t / dur))` for smooth, readable trajectories, adding at most a subtle low-amplitude secondary hover (`Math.sin(t * 0.25) * 6`).
- **Biomechanical Limbs & Prop Attachment (`TRAP_DISEMBODIED_LIMBS` & `TRAP_FLOATING_PROPS`)**:
  - In close-up/macro inserts where a hand catches, pinches, slides, or types (`size: "macro insert"` or `"close-up"`), never draw a floating circle for a hand or floating sticks for chopsticks. Use `<InsertArm x0={...} y0={...} x1={...} y1={...} sleeveColor={...}>` (from `engine/sets/street.tsx`) so the viewer sees a proper curved sleeve, forearm, wrist cuff, and mitten hand holding the prop.
  - In full/medium character shots, compute hand world coordinates via `const j = joints(pose); const hand = toWorld(pose, j.armR.end);` or orient the arm toward the target with `reachAngle(pose, 'R', targetX, targetY)` so the prop is physically held by the character's hand.
