# FeedFall: Rush Hour v0.8.8 — Bloodsports & Living Convention Visual Pass

## Implemented in this reconstruction pass

- Recovered the intact **v0.8.7 modular baseline** (1×–2× production speed, five different verdict actions, center-stage queue, open-gate collision and Chaos decision tiers). The interrupted prior v0.8.8 session did **not** leave a saved source snapshot, so its reported features were recreated and verified here rather than treated as existing source.
- Introduced a distinctive magenta/gold **BLOODSPORTS CHALLENGE** treatment for the **fifth Invite to Debate** action, independent of Welcome, with keyboard `5`, custom dispatch sound and mobile sticky access. The sandbox has a matching highlighted fifth control.
- Regenerated `irl-hall-open-v088.webp` as a revised hall backdrop: **open entry scanner gaps** and an **unlettered, dark stage LED**. Registered as a versioned image with a v0.8.7 fallback. Independently animated gate arms/scanner lights, phase fixtures, crowd flashes and the LED are rendered by code; none is baked as a static moving object in the background.
- Repositioned the broadcast to the **actual wide illustrated TV** at hall coordinates x241–325/y16–46 instead of drawing an unrelated panel across the stage table. Added DGG LIVE, onstage two-person fan snapshots, a stylized fan autograph/signature card and exaggerated **DEBATE WON/LOST** outcome cards. Each lasts approximately 1.9 seconds.
- Expanded stage moments into **four alternating dialogue beats**, with a camera flash during a fan pose and a topic-specific critic/Destiny exchange. Added eight fictional Destiny/DGG debate themes, contextual topic selection, and reproducible verdicts determined by Crowd Vibe, correct decisions, mistakes, backlog, round and topic difficulty rather than a random hash. Results are recorded in per-run `debateHistory` for QA.
- Added a third **six-person illustrated attendee set** (`irl-cast-set-c`) with original two-row poses, north-facing four-step walking, front-facing four-step walking and four reaction poses. All three sets are wired to both frontends, available in decisions and crowd waves. Standard phase-three now adds the third set; Endless waves rotate across the three.
- Reinforced the **visible stage line** with floor markers and a caption aligned to existing center-stair queue slots, preserving stage-only paths, authorized gate passage and non-ejected guest return to the floor. Expanded Destiny's roaming stage route without changing the center interaction waypoint.
- Preserved previous world saves and Creator Network routing. Chaos Mode still affects **decision overlays only**, not ambient chatter, its typewriter ticks or DGG emotes. Full game has 1×/1.5×/2× speed, developer harness retains 4×/8×.

## Validation and current limitations

- Targeted v0.8.7 and v0.8.8 venue tests pass, including distinct fan/photo/autograph/debate progression, backdrops/cast assets and performance-conditioned debate outcomes. Local HTTP module/asset route checks pass.
- The full cross-world Node suite **passes** after older tests were updated to expect the new six-person group (31 rather than 25 phase-three crowd characters). Test output was kept in `/tmp/feedfall-v088-all-tests2.log`, not printed to the terminal.
- Local Playwright Chromium launch is blocked by the environment's `socket() failed: Operation not permitted`; do not mistake that restriction for an application assertion failure. A visually reviewed Vercel preview remains necessary for final acceptance.
- The new hall is a revised static stage/booth composition with **modular moving gates, scanner lights and screens**, **not** a fully destructured furniture/lighting asset pipeline. Extraction of every booth/mic/fixture into its own moveable sprite and high-density visual collision QA remain future polish if the owner wants all props physically rearrangeable.
- A fresh v0.8.8 Vercel preview has **not** been attested at the time of authoring this changelog. A GitHub file handoff was committed first; binary art upload/deployment must follow only through an authorized transport method that respects the no-base64-string hygiene rule.

## Test access

The modular source can be served from `rush-v08/` with a static HTTP server. Main game entry: `/`. Isolated test harness: `/irl-sandbox.html` locally, `/irl-sandbox` on Vercel (`cleanUrls`). Graphics panel: `G`; Chaos toggle inside Graphics; number keys 1–5 issue staff decisions. Stage events happen when a successfully Welcomed fan or Invited critic advances through the gate/center-stair line.
