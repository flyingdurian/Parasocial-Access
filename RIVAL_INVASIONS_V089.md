# FeedFall v0.8.9 — Rival Invasions / BLOODSPORTS Debate Arena

**Status:** Co-architect lab handoff. **Not merged, not connected to live IRL Hall, not deployed.**

**Baseline:** `feature/v088v-sprite-tv-polish` at `6afc2c2`. Lab branch: `feature/v089-rival-invasion-lab`.

## Owner-approved direction

Destiny-world rivals physically arrive at the convention, approach the existing stage, and challenge Destiny. Crossing the stage threshold triggers a dramatic **Pokémon-like VS screen**, then a **new, dedicated debate-arena camera**: Destiny on one side, rival facing him across the stage, animated audience in the foreground. The player *controls Destiny* in a short skill-based debate fight. It is **not a multiple-choice response picker** or a passive simulated outcome. HP, counters, critical timing, combo meter, special attacks, a finishing argument, audience feedback, and win/lose presentation drive the fight.

The fantasy is arcade debate combat, not physical assault. All quotes, topics and wins/losses must be clearly fictional and not attributed as real statements or outcomes of identifiable public figures.

## Rival roster and relationship boundaries

| Rival | Dynamic in the game | Signature move | Timing / audiovisual identity | Atlas |
| --- | --- | --- | --- | --- |
| Foodshops | **Friend and fierce onstage competitor**; banter has history and limits, never an easy win | **Receipt Avalanche** | Fast source callouts, amber receipt-card cascade | `foodshops.png` |
| Jordan Peterson | Ideological opponent; abstract definitions and chained premises | **Infinite Premise** | Golden branching-premise stacks, slowed counter window | `jordan-peterson.png` |
| Ben Shapiro | Ideological opponent; rapid topic/claim changes | **Premise Blitz** | Blue streaking cue bars and quick call-and-response | `ben-shapiro.png` |
| Dan Saltman | **Friend and pointed onstage competitor**; dry, sarcastic, genuinely tries to win | **Sarcasm Ricochet** | Teal ping-pong crowd swing, feint and counter | `dan-saltman.png` |
| Hasan Piker | **Heated rival; scorched earth.** No warm reconciliation, buddy banter or friendly wrap-up | **Audience Surge** | Red/high-pressure crowd wave, strongest rival HP/damage | `hasan-piker.png` |
| MrMouton | **Friend and combative onstage competitor**; tangents and familiar jokes with limits | **Friendly Tangent** | Purple sudden topic detour; punish drifting off point | `mrmouton.png` |

**Tone rule:** Friendship in the surrounding streaming/social ecosystem does *not* mean a friendly debate. Foodshops, Dan and MrMouton can disagree sharply, interrupt, score hard hits and hold boundaries. Their match-end banter can carry familiar in-jokes *without making the argument soft*. Hasan is categorically different: show a serious heated rival encounter, aggressive momentum and an abrupt ending, but avoid fabricated accusations, threats, harassment, or invented real-life quotes. Jordan and Ben remain competitive ideological antagonists rather than asserted personal enemies.

## Scene and camera sequence

1. **Hall:** At scripted invasion waves **6, 10, 14, 18**, one distinct rival appears with legitimate admission and physically traverses the gate/aisle/queue to the stage. No teleporting, collisions with props, or overlapping other stage interactions. Never preempt a selected attendee's active decision. Cap at one invasion at a time.
2. **Challenge:** Gate the stage when existing fan/critic transaction clears; front-row spectators rush into stable individual stage-front slots. Snapshot *all* venue clocks, visitor paths, attention timers and selected target, then freeze them atomically.
3. **VS reveal (0.7–1.1 s):** Scarlet/indigo split-screen, opponent portrait, bold VS slash, screen shake and sting. Names/portraits do not clip; support reduced-motion mode. Do not use old crowded stage-front broadcast as the gameplay camera.
4. **Arena (new 16:9 layout):** Slightly elevated, frontal 3/4 view from the audience. Destiny left, rival right; both feet grounded and bodies completely visible. Foreground audience heads/raised arms occupy roughly the bottom 15–20%; back rows and venue LED screen stay behind the actors. HUD shows two HP bars and an energy/combo bar; compact three action buttons at bottom on iPhone. No blurry mosaic or heavily zoomed source-canvas crop.
5. **Fight (six 3-second beats, ~18 s):** A telegraphed cue arrives each beat. The player presses **Define Terms**, **Show Receipts**, or **Read the Room**, optionally the earned **Finishing Argument** special. Correct timing/counter deals HP damage and builds combo/energy; mistakes invite a rebuttal. Signature move appears on beat 4. Give hit sparks, crowd reaction, screen shake and scoreboard updates; retain legibility and quiet enough SFX to coexist with existing mute control.
6. **Result:** KO or time-up compares remaining HP fractions, never an RNG or lore-trivia judgment. Huge but short win/loss splash, rival-specific final exchange; stage TV inside the hall can show a brief result on return.
7. **Return:** Dispose arena controls/RAF/audio, restore the exact hall state once, unfreeze timers, let spectators return to prior activities and move the rival out naturally. No double award, double scan, stale selection, or `crowdTick` target corruption.

### Gameplay loop and controls

| Command | Player reads | Counter behavior | Sample input |
| --- | --- | --- | --- |
| **Define Terms** | A premise/definition shifts | Catch ambiguity at a timed beat | Key `1` / touch |
| **Show Receipts** | A quote or source challenge appears | Present the evidence beat before time runs out | Key `2` / touch |
| **Read the Room** | Crowd attention swings | Redirect crowd pressure into your own momentum | Key `3` / touch |
| **Finishing Argument** | Energy at least 60 | Strong one-beat special, costs meter | `Space` / touch |

Modes: **Relaxed** displays the recommended counter and grants a 1500 ms hit window; **Expert** hides the explicit counter and gives 960 ms. Both modes remain real input/timing challenges. Players do not choose written argument content. Avoid QTE overloading: six distinct beats plus optional special and 1–2 seconds for result. Invasion fights must never extend the *real* hall timer while suspended.

### Battle numbers in isolated lab (tuning starting point, not final balance)

- Destiny HP **100**. Rival HP **108–142**, with Hasan highest. Six beats × 3000 ms = **18 seconds**.
- Correct counter within window: base **24 HP**; perfect within 42% of window: +5; combo +0…5. An earned special does 37+ HP and costs 60 meter.
- Wrong/late counter: no damage dealt, substantial rival hit. Successful counter still incurs slight chip pressure. Hasan's per-hit pressure is highest; skillful perfect play can beat all six.
- Each rival telegraphs one unique signature on beat 4. All results are seeded/deterministic from player inputs; no invisible coin toss or fabricated research correctness score.
- Battles are *satirical fictional encounters*. Public figures' images/names are caricatures for game parody, not endorsements.

## Asset delivery

`assets/rivals/v089/` contains **six original PNG RGBA 4×4 sprite sheets** plus one *optional, illustrative* arena-stage concept. No baked base64. Each sprite sheet uses the following layout:

| Row | Cols 1–4 |
| --- | --- |
| 1 | Front / frontal walking cycle |
| 2 | Rear / back walking cycle |
| 3 | Right-side walking cycle (mirror for other side only after visual QA) |
| 4 | Pointing, arguing, celebrating and loss/frustration pose |

Individual dimensions intentionally differ; **do not assume a 256×256 cell or 1536×1024 universal sheet**. Source sizes are in `RIVALS_V089[*].asset`. Crop as `sx=col*(image.width/4)`, `sy=row*(image.height/4)` and isolate each source cell when drawing. Keep the transparent PNG masters; export an optimized WebP derivative only after verifying cropping on mobile at gameplay scale. Some generated edges have antialias halos and must be checked against the purple arena; avoid destructive rectangular head-trimming (known v0.8.8v sprite bug).

`arena-stage-concept.png` is a **background composition reference**, not the finished battle render: the lead developer still needs to add animated audience foreground, actors and HUD in code.

## Implementation shipped on the lab branch

- `src/rival-invasions-v089.js` — pure, deterministic battle rules, full roster/asset manifest, mode windows, invasion scheduling, special meter, state transitions `vs → active → result → returned`. No venue globals or mutation.
- `tests/rival_invasions_v089.test.mjs` — roster, signature, PNG geometry, encounter schedule, positive/negative match, skill timing, result and invalid-input tests.
- `rival-lab.html` + `src/rival-lab-v089.js` + `src/rival-lab-v089.css` — independent visual arcade prototype; explicitly **not** a route or feature of the main event.

**Verification for this handoff:** 99/99 focused Node tests pass (87 existing v0.8.8v tests, 11 initial v0.8.9 tests, plus one new simultaneous-KO regression). Headless Chromium could not start in this execution environment (`socket(): Operation not permitted`), so **actual desktop/iPhone visual playtest is outstanding**. The provided arena artwork is a layout concept; do not mark stage perspective/foreground crowd visually accepted without a browser run.

### Lead developer integration contract (implementation NOT yet done)

| Integration site | Required adapter work | Non-regression guard |
| --- | --- | --- |
| `src/irl-v07.js` stage visitor orchestration | Spawn rival guest, travel to stage, invoke battle only after stage clear | Gate authorization, no teleport, no selected-target swap |
| `src/venue-nav.js` / queue | Give rival valid route through existing collision / ropes | No booth magnetism, no rubber-band returns |
| `src/venue-rig-v088b.js` | Clean handoff into separate arena camera and reliable return to existing hall | Preserve v0.8.8v TV crop, shallow prelude, stage queue and spectator footing |
| `src/irl-sandbox-v085.js` | Feature-flag lab enablement and isolated QA toggles | `/irl-sandbox` starts with v0.8.8v behavior unchanged unless explicitly enabled |
| `src/audio.js` | Optional sting, hit cues, rival intensity | Existing mute and SFX settings respected, no overlapping voice/chat |
| Event storage / result layer | Snapshot+restore hall state; record one rival outcome per encounter | No double rewards; offline save migrates; no broken venue timer |

The engine does **not** own venue freeze/restore, UI navigation or audio. The caller should take one immutable hall snapshot before entering, restore in `finally` on success or exception, and include a crash-safe unwind path. The browser lab simulates only the dedicated fight phase and makes no claim about integration.

### Acceptance gates before merging into active build

1. All six invaders visible and recognizably animated on stage and in the new arena, with cell cropping QA on iPhone Safari and desktop.
2. Real hall test: wave spawn → correct gate admission → walk to stage → crowd formation → VS → 18-second player-driven battle → result → venue resumes; repeat back-to-back.
3. Pure engine tests and current v0.8.8v tests green; manual 100-run stress with varied timing, pause, late arrival, and return-path faults.
4. No clipped heads, background glow leaks, blurred spectator camera, on-screen controls hidden behind Safari bars, or accidental always-welcome bias.
5. Named rival dynamic passes editorial check: friends genuinely competitive, Hasan distinctly antagonistic, fictional-dialogue disclaimer visible.
6. **Do not merge or auto-promote this lab branch.** Lead developer owns review, integration, Vercel preview and subsequent merge decision.
