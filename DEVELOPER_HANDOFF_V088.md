# FeedFall: Rush Hour — v0.8.8 Lead Developer Recovery Handoff

**Status:** Recovery checkpoint, 2026-11-16; authoritative code lives in `rush-v08/`.  
**GitHub:** `https://github.com/flyingdurian/Parasocial-Access` (`main` is the source-of-truth branch).  
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
