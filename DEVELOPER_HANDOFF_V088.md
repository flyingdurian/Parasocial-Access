# FeedFall: Rush Hour — v0.8.8 Lead Developer Recovery Handoff

## Current checkpoint: v0.8.8e — November 16, 2026

Release branch is release/v0.8.8 (GitHub repository root; Vercel auto-deployment). This checkpoint supersedes historical visual references below.

- Fresh hall background asset: assets/irl-hall-v088e.webp. Deep-indigo floor, evening windows, amber lighting. Four magenta banners with original fictional gold comet-in-hexagon platform emblem; no Twitch signs, real-world logos or rainbow stripes. Right-rear wall reserved empty for separate stage layer.
- Fresh stage asset: assets/irl-stage-shell-v088e.webp. Empty podium, dggL mascot banner pair, TV masked separately. No chairs or furniture. Stage geometry (200,9) width184 height96 in 384x216 native world. Floor seam maintained.
- Unified entrance sprite: assets/irl-entrance-v088e.webp at (0,120), size384x96. Central counter, flush planters and fixed scanners; both walk-through lanes widened ~30-40%; code animates glass flaps only, with no scanner translation.
- Stage queue ropes moved to true central stair approach. Navigation and collision match the entrance pillars and stage.
- TV snapshot: one Destiny + actual guest atlas crop, translucent screen compositing and one signature; no duplicated host. Transaction feedback small labeled +1 chips; removed ambiguous circle icons.
- Compact v0.8.7-scale speech/decision cards override oversized v0.8.8d CSS; no internal scrolling. dggL token renders inline image from assets/irl-dggl-v088e.webp in DOM and canvas speech/chat.
- Updated modules: src/venue-rig-v088b.js, src/venue-geometry-v088b.js, src/venue-nav.js, src/dgg-emotes-v085.js, src/irl-atmosphere-v083.js, src/venue-effects-v086.js, src/ui.js, src/irl-sandbox-v085.js, plus CSS and tests/venue_modular_v088b.test.mjs.
- Final QA: Vercel /irl-sandbox screenshot and iPhone viewport inspection must check lane passage, stage feet, TV crop, and card readability. Programmatic checks do not prove artistic perspective.

---

**Status:** v0.8.8e release and visual QA in progress; consult current checkpoint above.
**GitHub:** https://github.com/flyingdurian/Parasocial-Access/tree/release/v0.8.8 (active).
**Vercel project:** `feedfall-rush-hour`, project ID `prj_r9lPbfPzX5ycBnSQTVRHXSKc3V8J`.  
**Prior verified preview:** `https://feedfall-rush-hour-4y1ot526m-michaelquach604-8018.vercel.app/irl-sandbox` and the same hostname's `/` route.  
**Version target:** v0.8.8; do not label v0.8.7 features as newly completed work.

## 1. Provenance and recovery caveat

The previous conversation ended during an uncommitted v0.8.8 development pass. The prior developer reported implementing a new open-gate/blank-LED hall asset, another six-person cast with motion and reaction poses, and condition-based debate outcomes, with targeted venue regressions passing. Those **v0.8.8 edits were not present in the surviving source ZIP** and are not independently verifiable. The recovered, intact modular source is the saved `FeedFall-v0.8.7-source.zip` (Library archival ID `libfile_bd8bc296e3648191933e54c9c2beb6ff`); its contents have been imported to `rush-v08/` in this repository. Subsequent work must reconstruct/implement the missing changes and verify them; do not silently invent continuity or call them recovered commits.

The new GitHub repository initially contained only a bootstrap commit (`3891d479`). This handoff plus the imported modular source establishes durable recovery. The prior Vercel URL serves v0.8.7, not proof of v0.8.8.

## 2. Product concept and approved UX decisions

FeedFall: Rush Hour is a browser arcade moderation game with several earlier worlds, upgrades/progression, Creator Network and developer save-transfer/unlocks. Destiny's **Meet & Greet** is a distinct living pixel-art convention simulator, accessed via his Creator Network space. The owner values fast but legible Airplane Chefs-like pressure, visual reward, independent crowd movement and interactive stage moments. The game portrays a fictionalized convention: content must avoid fabricating real-world allegations or treating peaceful disagreement as a threat.

- v0.8.7 approved five event actions: **Welcome** (fan), **Verify** (ticket), **Redirect** (line/staff), **Security** (credible safety issue), **Invite to Debate** (peaceful critic/debater). The fifth button needs a deliberately special Destiny-coded, arcade blood-sports visual treatment in v0.8.8; do not merge debates back into Welcome.
- Production event speed options are **1×, 1.5×, 2×** (never 4×/8×). The **isolated sandbox** alone offers **1×, 2×, 4×, 8×** for developer velocity. Speed setting applies only to Destiny's event.
- Chaos Mode via **G → Graphics** tiers **queued decision prompts only**, primary remains fully opaque and ring-highlighted, #2/#3 display complete legible text with different colors, #4+ compact. Background chatter is independent and must not be affected.
- Physical stage queue begins directly in the center opening between stair railings; each admitted fan or invited critic enters a dedicated single-file line, ascends stairs, interacts visibly with Destiny, exits stage and rejoins the general roaming ecosystem. **Fan:** side-by-side pose, actual flash, 1–2-second snapshot/signature on the existing backdrop TV. **Critic:** face-to-face pointing/talking, alternating topic bubbles, then a fun **DEBATE WON/LOST** result with logic-driven outcome, not an arbitrary coin toss.
- Venue: painted barriers must be removed/replaced by authoritatively rendered collision-compatible modular gates. Guests spawn off-screen, present ticket, cross an open gate; ejected safety threats depart permanently off-screen. Everybody else rejoins. Dense crowd should freely roam all navigable floor while respecting posts, stage, counters, props and front fence.
- Lore must remain isolated to Destiny. `DESTINY_DGG_LORE_RESEARCH_V071.md` is the research basis for scenarios, ambient lines, stage topics and creator profiles. Community emotes animate overhead; avoid overlapping them with active chatter bubbles. Speech audio has a mute toggle.

## 3. Current modular architecture

| Path | Responsibility / important constraints |
| --- | --- |
| `rush-v08/index.html` | Full game entry; loads `src/ui.js` via native ES modules. |
| `rush-v08/irl-sandbox.html` | Lightweight direct harness; loads `src/irl-sandbox-v085.js`, no full-world UI dependency. `vercel.json` maps `/irl-sandbox` route. |
| `src/engine.js` | All-world progress/save/mode; preserve save key `feedfall:rush-hour:off-the-feed:v07` and developer unlock key. |
| `src/ui.js`, `src/style.css` | Main game menus/Creator Network and full-game IRL scene/action controls. |
| `src/irl-v07.js` | Authoritative Destiny event state machine, deck, arrivals, staff orders, fan/debate departures, effects and score. Export `IRLEvent`. Both full game and sandbox import it. |
| `src/venue-nav.js` | 384×216 floor coordinate system, obstacle bounds, closed-fence/authorized-gate traversal, A* route smoothing, stage-only movement and shared queue spots. |
| `src/sprite-animation.js` | Feet-anchored depth scaling and contact shadow, directional walk/reaction atlases, Destiny stage action/route. |
| `src/venue-effects-v086.js` | Rendered gates, real camera flashes, LED screens, phase-two rush lights/fog. Work here to align graphics with new hall screen/gate geometry. |
| `src/irl-atmosphere-v083.js`, `src/irl-lore-v082.js`, `src/dgg-emotes-v085.js` | Ambient/typewriter bubbles, decision tiers, Destiny-specific lore/emotes. |
| `src/graphics-v082.js`, `src/graphics-panel.js` | Graphics G panel: nearest/bilinear, pixel filter, texture/chromatic/dithering, Chaos, CRT and chatter mute. |
| `src/irl-progression-v085.js` | Three standard levels, endless waves and breaks. |
| `assets/*.webp` | Approved environment, cast and pose art; **never** replace with embedded base64. |
| `tests/*.test.mjs` | Node regression tests; `tests/venue_v087.test.mjs` captures immediate v0.8.7 contract. Browser smoke scripts exist separately and can fail in restricted Chromium environments. |

### Shared event model details

`IRLEvent` holds `mode` (`intro`/`playing`/`results`), `session` (`standard`/`endless`), `clock`, `phase`, `wave`, `cards`, `next`, `visitors`, `arrivals`, `departures`, `crowd`, `focus`, `staff`, `guardPositions`, `gateControllers`, `tvEvent`, `cameraFlashes`, `hostX/Y`, and `irlRecords.destinyMeet`. A dispatch action can occupy staff temporarily; `resolve()` records the verdict, queues outgoing stage guests, and advances active focus. `tick(dt)` handles phase pacing, offscreen arrivals, crowd roaming, 7-stage fan/critic visits (`queued`→`approach`→`climbStairs`→`exchange`→`leaveStage`→`leaveStairs`→`rejoin`), guard escorts and result saving. Avoid changing action timing for all worlds via `engine.js`; event clock multipliers belong in IRL UI/harness loops.

**Critical consistency:** the two renders currently duplicate actor drawing/decision overlay logic (`ui.js` and `irl-sandbox-v085.js`). Any new asset binding, stage bubble, queue or TV rendering must be applied to **both**. The sandbox stores results separately under `feedfall-irl-v085-sandbox` and must never replace a production save. New preview URLs are distinct browser origins: export/import progress with Test Menu if needed.

## 4. v0.8.7 behavior present in source

- A twenty-guest shuffled decision deck starts with a mixed distribution: 6 Welcome, 3 Debate, 5 Redirect, 4 Verify, 2 Security. Calm disagreement is the Debate action, not a security flag.
- A center-stair queue, dedicated stage movement phases, fan photo flash, TV photo/debate badge and Destiny locomotion already exist in **partial form**, but the stage line/TV placement requires a visual alignment pass. Current debate result is pseudo-random based on serial/run seed; v0.8.8 should replace this with condition-derived outcomes.
- `irl-hall-open-v087.webp` removes permanently painted gate arms; visible gate spans use `gateControllers`. Fence and scanner posts are collision blockers. Spawns start below the 216px canvas and return through authorized corridors.
- Crowd moves on a connected interior navigation grid, with explicit non-walkable stage/booth regions; background actors use 4-step walk atlases and feet-anchored depth scale.
- Chaos Mode prioritizes decision prompts, full-game speed caps at 2×, local graphics panel supports CRT and chatter mute; existing ambient chatter must remain unchanged by Chaos Mode.
- Standard levels plus endless mode are present. Prior full game Open Feed, Live Arena, creator progression, save transfer and equipment must remain functional.

## 5. v0.8.8 implementation priorities / acceptance criteria

**A. Art-and-collision contract.** Author a new hall backdrop with **clean central LED and visually open gates**; retain 384×216 coordinate semantics, camera framing, stair railings and stage platform. Use independent overlaid gate leaves, scanner lights, screens and fixture effects in `venue-effects-v086.js`; do not paint gate leaves closed in the base art. Ensure gate controller passability and actual animated clearance match on screen. Prefer versioned `irl-hall-open-v088.webp` and preserve prior art for comparison.

**B. Debate interaction.** Special 5th button should stand out without destabilizing mobile controls, correct-on-tap timing or keyboard digit 5. Add a debate-topic catalog using research-derived, fictionalized prompts; stage critic/host bubbles should alternate with visible poses; outcome should be derived from player performance / crowd mood / context, not random; show exaggerated **DEBATE WON/LOST** on the correctly located physical LED.

**C. Fan interaction/roster.** Fan and host pose together, camera flashes and TV displays a posed snapshot or autograph for ~1.8s. Add six more cast designs (24 existing characters → target 30), each with consistent 4-frame directional walk/reaction sheets; account for role index/asset loading in both renderers.

**D. Pathing and chaos QA.** Check physical queue starts between railings and followers occupy visible aligned slots. Test stage exits, permanent ejections, unrelated visitor return, gate check-in and cannot walk through fence or counters. Test first 3 Chaos prompts readable and physically anchored; make sure ambient lines/speech/emotes untouched.

**E. Deployment and regression.** Run targeted `node --test tests/venue_v087.test.mjs ...` then the complete `node --test tests/*.test.mjs` suite with output redirected to a file; print **only pass/fail**. Browser smoke/full-game QA where possible. A preview deployment should serve `/`, `/irl-sandbox`, versioned `/assets/` and `/src/` modules with 200 responses. Give the owner specific URL + playtest steps for each successful deployment. Do not promote to production without a deliberate release decision.

## 6. Developer commands, hygiene and persistence

From repository root, work in `rush-v08/`. Local static server example: `python3 -m http.server 8080 --directory rush-v08` and open `http://localhost:8080/irl-sandbox` (the extensionless route needs Vercel routing; locally use `/irl-sandbox.html`). No bundle command during development. `rush-v08/vercel.json` routes `/irl-sandbox` to `/irl-sandbox.html`. Avoid printing source containing embedded art; **never read/print raw base64**, enumerate `previews/`, inspect monolithic HTML builds or generate single-file bundles. No `dist/` or `*-Play-Now.html` in commits. The source ZIP was a recovery input only and must not be checked in. Use targeted diffs; capture tests to temp logs.

**Artifacts:** publish only modular `rush-v08/src/`, `assets/*.webp`, `tests/`, existing docs, the two thin entry HTML files and `vercel.json`. Updating source with a Vercel preview does **not** automatically synchronize to this repository; always commit and push the source **before** deployment. Keep a changelog and update this file after completing milestones. Avoid creating new save keys that reset progress.

## 7. Remaining caveats (as of recovery checkpoint)

1. The half-finished v0.8.8 session was **not** recovered as files. Confirm features by implementation and tests, not memory.
2. Prior preview `4y1ot526m` is READY and serves the isolated harness as of this checkpoint; a newer project deployment (`6sr2vq1q4`) was READY but its `/irl-sandbox` returned 404, so do **not** use latest-deployment status alone as route acceptance.
3. No source release v0.8.8 or deployment is yet attested by this initial handoff. Update status here with commit SHA, art SHA and verified preview URLs after completion.

## 8. Immediate next steps for successor

Open `CHANGELOG_V087.md`, `tests/venue_v087.test.mjs`, `src/venue-nav.js`, `src/irl-v07.js`, `src/venue-effects-v086.js`, both frontends. Implement and validate Section 5, update `CHANGELOG_V088.md` and this handoff, commit/push, deploy preview and walk through the exact owner playtest protocol. **Do not restart v0.8.8 from zero.**

## Latest checkpoint — 2026-11-16: implemented and validated v0.8.8

**This latest section supersedes earlier statements in this file about unimplemented work.** The prior incomplete session itself was not recovered, but its missing features were independently rebuilt from the v0.8.7 modular baseline in this session. Nothing below should be confused with a successfully published v0.8.8 deployment.

### Implementation and tests

- Modular recovery baseline committed locally as `7fda969`; v0.8.8 implementation locally as `4d179e5`. GitHub's remote `main` accepted the handoff at `1b44e64` and **79 text-source/config/test files** at commit `6551067bc03bd775f834c19b7f96d4923af347d3`. The GitHub connector's text-file import and local Git commits have distinct histories; do not assume the local `main` branch HEAD is identical to remote `main`.
- `rush-v08/src/irl-debates-v088.js`: eight Destiny-specific fictional debate prompts, alternating guest/Destiny dialogue beats, and a nonrandom game-state-based verdict; debate/fan encounter separation maintained.
- `rush-v08/src/irl-v07.js`: adds six additional cast slots, distinct photo/autograph/debate stage flows, brief TV result TTL, camera flash trigger, and `debateHistory`.
- `rush-v08/src/venue-effects-v086.js`: aligns screen graphics to the actual painted LED position (`x=241, y=16, w=84, h=30`); adds fan snapshot/autograph, arcade DEBATE WON/LOST screens, physical queue markers, gate overlays and speech-beat rendering. Both full-game (`src/ui.js`) and isolated sandbox (`src/irl-sandbox-v085.js`) load the new hall and cast art and share the stage effects.
- Fifth **INVITE TO DEBATE** action has distinctive blood-sports arcade treatment in main and sandbox CSS. Event 1×–2× speed option persists. The existing navigation mesh, check-in/open-gate state, center-stairs queue and chaos-mode decision hierarchy are preserved and exercised by tests. An actual on-device visual/interaction playtest remains necessary; no test can certify painted-art collision perfection without that pass.
- Full Node suite `node --test tests/*.test.mjs` **PASS**, output captured in `/tmp/feedfall-v088-all-tests2.log`; v0.8.8 venue regression `tests/venue_v088.test.mjs` included. Local static HTTP routes and five new asset endpoints **PASS**. Legacy Chromium browser smoke blocked by `socket() failed: Operation not permitted (1)` on this executor, a sandbox restriction rather than a detected JavaScript assertion failure.

### Binary artwork and publishing blocker — do not silently skip

The following regenerated WebP assets exist in the **local modular source archive** but could NOT be uploaded through the currently authenticated GitHub/Vercel connectors, which accept binary content only in a base64 text payload. The owner's strict hygiene instruction prohibits generating/reading/printing such payloads. `git push origin main` from the shell also failed with `CONNECT tunnel failed, response 403`, while the text-only GitHub connector succeeded. Therefore **remote GitHub `main` currently lacks these five new files and the recovered v0.8.7 `assets/*.webp` binary inventory**. Remote `main` is a readable source checkpoint, not yet a standalone runnable repo checkout.

| Missing versioned file | SHA-256 in local archive |
| --- | --- |
| `assets/irl-hall-open-v088.webp` | `ca5a72d1170b713c4586c5b96cf77295b3d63cceda49de58fca2b4a12f19117f` |
| `assets/irl-cast-set-c.webp` | `4e6b3353923895e94cac222215cdecd6c7511c3634dcb4d927b38845e91cf81e` |
| `assets/irl-cast-set-c-walk4.webp` | `4f30cabbd6c0cd4665f93c70fdc7bc2b2f7a44a8fb25f1744282d78fc4a72847` |
| `assets/irl-cast-set-c-back4.webp` | `14c0c68f37c3ce54260939e39825bd2408960096464a68c759287367318493b0` |
| `assets/irl-cast-set-c-react4.webp` | `a98f96a065abd3a396879828ae12ba62177688eeef4609718c275a92dd17f98b` |

To prevent another source loss, the **complete modular source archive including all original and regenerated binary artwork** was durably saved as `FeedFall-v0.8.8-Modular-Source.zip` in the owner's Library, ID `libfile_d8d36c9b67508191b8d39be9bf64a0c4` (~22 MB; no dist, previews or single-file bundles). If this local executor disappears, materialize that archive to recover the actual v0.8.8 working tree, NOT the text-only GitHub checkout. Preserve all 5 image SHA checks when uploading by a future permitted binary transport.

### Vercel and next exact handoff

- The supplied previous preview `https://feedfall-rush-hour-4y1ot526m-michaelquach604-8018.vercel.app/` and `/irl-sandbox` were both reachable and still present **v0.8.7** on 2026-11-16. The v0.8.8 hall URL `/assets/irl-hall-open-v088.webp` on that preview remains missing (404). Do not claim this is a v0.8.8 preview or promote an incomplete assets deployment.
- Project: `feedfall-rush-hour`, ID `prj_r9lPbfPzX5ycBnSQTVRHXSKc3V8J`, team `team_BYqArAIsgLmCDtZatWWg7CFY`. An unrelated recent Vercel READY deployment was found with `/irl-sandbox` = 404; READY alone is insufficient.
- **Next:** secure an owner-permitted non-base64 binary Git push/deployment path (authenticated shell Git/CLI or direct file UI) or get an explicit hygiene exception for opaque transport encoding; put **all** `assets/*.webp` into GitHub without adding compiled HTML. Then wire/reuse the correct Vercel project, deploy a fresh preview, verify `/`, `/irl-sandbox`, all 5 new art URLs and stage playtest paths, and hand the owner the new exact URLs and steps. Document observed queue/stairs/gate collision discrepancies from hands-on playtest before declaring v0.8.8 released.


## Latest checkpoint — 2026-11-16: v0.8.8b Sequence 1 UI containment

This checkpoint supersedes older nested-directory notes above. The active GitHub release branch is release/v0.8.8 with index.html, irl-sandbox.html, src/, assets/, tests/, and vercel.json directly at repository root; Vercel builds from Git automatically. Do not move files back under rush-v08/.

**Sequence 1 changes in this commit:**
- src/venue-effects-v086.js repairs secondary-screen canvas save/restore state leakage; stage conversations use explicit left alignment, measured wrapping, clipped text and placement avoiding the LED.
- src/irl-atmosphere-v083.js provides a shared 384×216 bubble placement and overlap reservation utility, measured wrapping and bounded canvas drawing.
- src/ui.js and src/irl-sandbox-v085.js reserve the physical LED and current DOM guest card before placing stage, ambient and queued speech. Higher-priority queued decisions are placed first. Chatter timing, scoring, event state and saves are unchanged.
- src/graphics-v082.js resets canvas alignment/baseline at the start of each frame.
- src/style.css, src/irl-sandbox-v085.css and src/graphics-v082.css harden responsive wrapping and panel bounds.
- tests/venue_v088b.test.mjs tests canvas-state balancing, measured text fit, reserved bubble collisions and cropped-canvas DOM coordinate mapping.

**QA at checkpoint:** modified JavaScript passed isolated syntax parsing; four focused UI regression checks passed using a mocked Canvas 2D context in an in-memory harness. The complete repository Node suite and final browser/mobile visual acceptance have NOT yet run against the committed revision. Vercel preview status must be checked after the Git branch receives this commit; do not call the patch visually verified until the screenshot scenario is replayed.

**Next:** inspect the automatic Vercel preview for release/v0.8.8; replay Endless Wave 2 with simultaneous stage dialogue, an active live guest and Chaos prompts. Verify no text escapes a box or obscures the TV and the main game and /irl-sandbox agree. Run repository tests in an authorized CI/test runner. Sequence 2 (modular entry gates, stage/TV, booths/stalls and art/navigation alignment) remains separate.


## v0.8.8b Sequence 2 — Modular Vibrant Convention (2026-11-16 checkpoint)

**Final owner art direction:** The previous sterile daytime-office visual concept was explicitly rejected before publication. The approved target is the original screenshot's lush anime pixel-art convention mood: deep indigo/slate patterned flooring, twilight city windows, magenta-to-purple vertical creator banners, warm golden under-counter and stage spotlights, crisp turquoise DGG-style screens and polished jewel-tone props. The gameplay HUD, audio system, other worlds and scoring remain unchanged. The original painted hall remains only as a network-failure fallback, never as the new composited room. No neutral-office assets are referenced by this release.

**Six new, actual WebP files used by the game:**
- `assets/irl-hall-vibrant-v088b.webp`: empty twilight architectural plate, with no props painted into it.
- `assets/irl-stage-shell-vibrant-v088b.webp`: separate violet stage with front-facing center staircase and blank physical LCD.
- `assets/irl-stage-furniture-vibrant-v088b.webp`: independent source regions for debate (exactly two primary facing chairs/desks, microphones) and fan signing (one broad table, pen and behind-table chairs).
- `assets/irl-gate-atlas-vibrant-v088b.webp`: real badge-reader glass turnstiles with separate closed/open sprite regions, indigo/magenta event treatment.
- `assets/irl-booth-atlas-vibrant-v088b.webp`: separately mapped merch, food/popcorn, vending and photo props, with warm amber lighting.
- `assets/irl-checkin-vibrant-v088b.webp`: independent lit purple/wood badge-registration counter.

**Engineering:** `src/venue-geometry-v088b.js` is the single authoritative native 384×216 map for stage stations, gate art and badge passages, physical prop rectangles and foot-contact blockers, and LCD affine projected quad. `src/venue-nav.js` imports this map for walkability and stage anchors. `src/venue-rig-v088b.js` loads the six WebPs and draws each interactive prop with an independent source atlas rectangle, physically connected stage front stairs and gate-aligned metal railings; turnstiles display closed/open based on the existing controller's open interval. Current stage participant decides between two-place debate furnishings and modular signing furniture. The screen renders live fan photo/autograph/debate result directly onto the physical backwall LCD, preserving source projection rather than stretching across the stage. Main game `src/ui.js` and `src/irl-sandbox-v085.js` use the identical modular renderer with the old art only as an asset-load fallback. The earlier UI containment bubble solver now reserves the physical LCD's correct bounds. The new environment intentionally skips inherited neon-fog overlays from the obsolete painted stage, as the new art itself carries the intended vibrant light.

**Geometry:** Stage [196,2,188,106], LCD approximately [261,18,75,45], stairs sprite anchor [260,61], queue front [260,72], debate guest [219,40], fan guest [285,55] (in front of the raised signing table). Gate art: left [72,158,50,56] and right [229,158,50,56], preserving ticket-check and crossing lanes. Merch [14,48], food [108,48], vending [21,115], photo [321,109], registration [137,160]. Each prop's solid-footprint is a separate aligned obstacle in navigation.

**QA, not final acceptance:** Artwork was visually composed in an offline 1536×864 preview, and the 384×216 coordinates, gate passage reachability and room stations were inspected. JavaScript syntax and basic Canvas state balance were checked in memory. `tests/venue_modular_v088b.test.mjs` covers WebP inventory, collider/prop alignment, authorized gate lanes, backwall TV mapping, independently rendered open/closed gate frames and stage mode switch. Automated repository CI and live Vercel desktop/mobile playtest are still required; visual signoff belongs to the owner. Owner should inspect both main build and isolated `/irl-sandbox` including Wave 2 simultaneous speech, a photo/signing cycle, debate outcome and each ticket gate.

**Live preview correction:** Vercel first browser screenshot showed signing furniture covering the center stairs and a drawn registration rail crossing the check-in counter. Stage debate/signing sprites were moved higher on the deck, fan approach moved to [285,55], and only short perimeter rail segments are drawn between the physical gates and central counter. Native prop collider footprints and authorized gate checks were not changed.

**Final visual correction:** During live browser QA, moving the signing table above the stair opening caused its top edge to cover the lower TV ticker. Its independent sprite bounds are now [297,57,76,30] on the right-hand deck. Fan path remains center-stairs then [285,55] at the left side of the signing table. Stage LCD and stair clearance no longer share the table's area.

**Loading color:** Until the six modular WebPs complete loading, both entry points use a deep indigo (#211a40) interim canvas rather than the discarded bright office-white flash. Once ready, the shared full venue renderer takes over atomically.


## v0.8.8c corrective release (2026-11-16)

Owner-approved focus: restore the vibrant evening indigo/magenta convention language and the v0.8.7 compact entrance proportions while correcting v0.8.8b spatial assembly. Do not return to neutral office style. Do not add interchangeable stage furniture.

- Branch: `release/v0.8.8`; Vercel automatically builds after a GitHub branch update. `/irl-sandbox?level=0` remains the direct room test.
- New modular WebPs: `assets/irl-stage-queue-ropes-v088c.webp` (transparent perspective-matched six-stanchion velvet aisle), `assets/irl-checkin-v088c.webp` (v0.8.7-inspired original compact booth with planters), `assets/irl-gate-atlas-v088c.webp` (closed/open compact scanner posts), `assets/irl-entrance-planters-v088c.webp` (two independent entrance planters), `assets/irl-stage-shell-v088c.webp` (thin, grounded riser and fixed TV). The vivid room plate and merch/food/photo/vending atlas remain from v0.8.8b.
- `src/venue-geometry-v088b.js`: single source for active prop drawing bounds, collision and LCD projection; vending at left perimeter; booth at entrance center; left and right scanner art coincide with authorized crossing zones; stage-queue rope collision guides. Native canvas 384x216. Historic filenames stay for compatibility until future version consolidation.
- `src/venue-rig-v088b.js`: stage furniture is permanently 1-on-1 debate desks, no signing/debate mode art swap. Render contact shadows and queue ropes, integrated entrance plants and bounded, perspective-mapped TV. Live photo TV now draws Destiny AND guest using `streams.poses[guestKind]` with signature overlay. One permanent table supports both debate and signing interactions.
- `src/venue-effects-v086.js`: stage speech bubbles use short-tail speaker-locked placement at x>=183 rather than ambient bubble collision solver sending them to screen edges. Measured text wrapping retained.
- `src/irl-v07.js`: debates last 3.8 seconds (fans 3.1). Active crowd favors merch, snacks, vending, photos, with visit dwell, receipts, flashes and per-booth transaction counters. `src/venue-nav.js` adds vending station matching the moved prop. `src/ui.js` and `src/irl-sandbox-v085.js`: stage guest sprite normalized to 29x37, bottom anchored relative to Destiny 31x39, and pass all pose atlases to live photo TV.
- Regression tests: `tests/venue_modular_v088b.test.mjs` updated for 8 independent art assets and permanent furnishings; canvas renderer dry-run passed with simulated closed gates, photo event, and depth-neutral save/restore.

### Final visual QA on deployed preview

1. Confirm all 7 modular WebPs load with no 404 or white flash; compare entrance footprint against v0.8.7. Gate authorization must remain state-coupled and unauthorized roaming must not cross the fence.
2. Confirm stage shallow front fascia touches floor, fixed two microphones visible, and speaker bubbles point above the actual host/guest. In a 3.8s debate, opponent sprite should be comparable to Destiny.
3. Confirm two-person PHOTO OP TV with Destiny's signing overlay for fan encounters; debate win/loss TV remains legible.
4. Observe merch, food, relocated wall-side vending, photo booth: crowd must visit, pause, pose and trigger effects, without blocking stage queue or gate lane.
5. Mobile Safari/desktop test for clipping, scenery scale, dialogue, speed controls <=2x and no regression to the primary game loop. If artwork placement needs adjustment, change only the single geometry map before regenerating art.

- Final v0.8.8c preview polish: stronger magenta velvet stage-lane ropes with gold floor stanchions; visible version strings updated in both the main game and isolated sandbox HTML/JS to distinguish browser builds.

- Final v0.8.8c art correction: six-post transparent stage rope prop replaces the too-thin canvas-drawn queue lines; its widening perspective is mirrored by dynamic rope-line collisions in `isVenueWalkable`, preserving an open actor lane.


## v0.8.8d — Live Visual QA Correction (2026-11-16)
- Front entrance: scales check-in and lush planters up against independent scanner-gate plinths; adds a four-segment indigo/gold joinery rail behind the assets while preserving the existing two verified passage lanes. Scanner post geometry is sourced from the same open-atlas crop in every state; only glass flaps retract. Badge controller remains the authoritative permission check.
- Camera: 0.965 centered world zoom is applied consistently in full-game and direct sandbox canvases; click-selection and DOM decision-bubble anchors use corresponding project/unproject coordinates. Hall image overscans to prevent black edges. Stage shell changes from (196,2,188,102) to (201,9,181,96); TV affine and bounds updated to match; image fringe is color-keyed only in the transparent outside-left-rail region and cached by image.
- Stage furniture: remove furniture texture from active load and stage draw entirely; chairs/desks will be designed later. Preserve player/NPC exchange routing and 3.8-second debate state machine.
- Live TV photo: retain both Destiny/guest sprites and signature but eliminate solid pale photo rectangle, composite on translucent broadcast glass.
- Booth reward feedback: preserve booth transaction counters/animations, replace raw MERCH +1/SNACK +1/DRINK +1/PHOTO check labels with short-lived, animated icon particles at each actual venue activity anchor.
- Decision UI: full-game and sandbox speech cards sized for readability; internal scrollbars disabled, mobile overrides updated. Both clicking and selection coordinate maps updated with camera scale.
- Test target: check seven active modular assets, stable gate crop across open/closed frames, stage TV containment, no furniture, navigation verification lanes, no nested decision-scroll regression, desktop/iPhone visual QA.
- Images: imagegen stage-cleanup candidates were rejected because red fringe persisted; keep original v088c shell and use narrowly scoped runtime transparency cleanup to avoid destructive texture replacement.
