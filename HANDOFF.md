# FeedFall: Rush Hour — Active Engineering Handoff

**Current candidate:** v0.8.8l functional-venue and live-audience polish on the v0.8.8k code baseline.  
**Working branch:** `recovery/v088i-arcade-debates` (continuing the v0.8.8h unified-plate baseline).  
**Baseline:** `release/v0.8.8`, commit `bcbb27de6df8bb8f395cd3bbfe392315be7360b6`.  
**Status:** Exact user-provided hall PNG and transparent dggL mascot are now committed under `assets/`; v0.8.8l integrates those files. Feature tests and browser smoke verification are required before owner visual acceptance. No production promotion approved.

## v0.8.8l — source of truth and visual acceptance

**Asset wiring:** The only hall backdrop is `assets/Neon Convention Hall Claw Machine.png` (1672×941). Walking dggL is a separate alpha sprite `assets/Adorable blue mascot clutching a red heart.png` (1220×1289), independently depth-sorted, reacting with decorative hearts and no player rewards. The clerk continues to use `irl-ticket-clerk-v088h.webp`.

**Physical fixtures:** Merch x18–93, food/drinks x94–165, claw x165–193, booth x338–384, front desk x149–237; all four service points are autonomous NPC destinations with an activity window, visible transaction pixels, receipts, and physical collision. The claw glass grapple and prize drop are clipped within the baked machine's physical glass x167–191; the old x21–50 floating claw and imaginary vending station are removed.

**Gate behavior:** Left scanner gap 39px, right gap 43px; the short slotted metal/glass shutter leaves telescope into the fixed scanners when an authorized ticket is inspected. One permanent scan clerk stands at the single monitor; a separate roaming `gateMonitor` patrols the gate zone while two other worker sprites remain dispatchable.

**Stage:** The plate has one short red velvet rope at x233–287, y98; remove invisible zigzag barriers and route to stairs along a short matching approach. Around active debaters, stage spectators form a crowd ring, alternate point/argue/cheer/jump, and speak meme lines as animated world-space speech bubbles. Do NOT print lore/meme phrases on the stage TV: the screen cuts between close-ups of Destiny/challenger and the actual venue audience. Hide content beneath the upper TV bezel to prevent rough edge bleed.

**Debate effects:** Aggressive sprite poses for both actors; round 6–12s. Destiny blue/gold aura active ~25% of each round and challenger red/purple aura active ~10%, with vibe/camera-flash spikes only when a surge begins. Retro boxer-style syllables are original synthesized SFX played at dialogue beats, never recordings, never every animation frame, respecting mute.

**Acceptance:** Compare v0.8.8l sandbox on iPhone and desktop to prior k: verify non-ghost claw at x165, actual booth visitors and award graphics, dggL independent traversal, shutter motion, gate monitor, stage crowd floating speech, camera cuts and rare glow phases. Do not merge to release without owner visual approval.

## v0.8.8k historical notes — superseded by v0.8.8l

- **Boss FX:** blue/gold final-boss and crimson/purple challenger glow built from three additive halos, stepped flame tongues, jagged electric arcs and capped rising particles. All animation timebase values normalize browser milliseconds to seconds; TV switches Destiny's live close-up between authored combat pose cells.
- **Combat animation:** no neutral talk/nod/idle while a debate runs. Challenger and Destiny alternate authored argue, point and heckle stances every ~0.57s, including during high queue pressure.
- **Chat & audio:** 75+ deterministic fictional community chat lines including the exact owner-requested phrases; ~0.72–0.89s interval, up to three recent chat items. New original synthesized clash intro, beat impacts and win/loss stingers play once per scripted event on both main convention route and /irl-sandbox, honoring the global SFX toggle.
- **Ghost claw containment:** the existing machine animates only when occupied, and grapple/prize pixels are strictly clipped to a glass rectangle computed from the *same* cabinet bounds used by navigation. No independent machine texture is introduced. The glass coordinates **must be visually recalibrated** after the new image is mounted.
- **Gate/check-in:** v0.8.8j's 39–43px traversal width, shutters, clerical operator and roaming greeter are unchanged.
- **Required asset inputs (BLOCKER):** exact `Neon Convention Hall Claw Machine.png` unified plate, and exact `Adorable blue mascot clutching a red heart.png` dggL cutout. Neither filename appears in connected saved assets or the current GitHub branch. The current `assets/irl-venue-baked-v088h.webp` stays active, and no independent walking mascot is yet rendered. Once supplied: inspect dimensions/transparency; convert to optimized WebP; wire scene and independent sprite; realign claw/glass/colliders; add mascot crowd reaction route; visual regression + iPhone QA.
- **Verification:** `tests/venue_v088k.test.mjs` covers cabinet containment, live aura draw calls, frequent banter/aggressive host and challenger poses, and debounce of debate audio. Focused Node suite passed **20/20** on the 1-vCPU remote sandbox; Vercel branch preview served `/irl-sandbox` successfully. Browser visual/phone acceptance pending.
  
## Purpose

The v0.8.8b–f hall rebuilds introduced prop-scale drift, floating stage pieces, undersized gates, crowded paths, and bulky overlays. v0.8.8g replaced detached prop layers with a **single coherent 384×216 pixel-projected plate**. v0.8.8h preserves that architecture, rerenders the same view with brighter woven purple carpet, only two ceiling ambient fixtures, localized booth/photo lights, integrated stage-floor uplights, physical tripod, enlarged asymmetrical plants and a three-row serpentine velvet rope queue. A dedicated stationary ticket clerk and two dynamic glass-panel gates remain interactive overlays. Keep the evening indigo/purple/magenta/amber palette, fictional comet convention branding and dggL banners; no Twitch or rainbow-striping branding.

## v0.8.8j additive implementation

- **Entrance:** independent slotted steel/glass shutter leaves retract horizontally into fixed scanner pillars. All 39–43px collision-safe lanes remain fully open after admission; the exterior check-in position is `y176` (feet before crossing), gate closing is delayed until the admitted sprite clears, and unauthorized actors have no lane bypass.
- **Check-in:** one dedicated operator stays at the one-monitor counter. A distinct mobile greeter (`staff[0]`) patrols both gated approaches and returns to the desk when not dispatched.
- **Booths:** existing merch, snack, vending and photo visit/receipt/flash loops remain; the left-aisle baked claw cabinet now has an interaction station, solid footprint, moving grapple, animated prize, and tracked prize transactions. Art alignment needs a visual check because the scene plate is unchanged.
- **Boss stage:** critic exchanges run deterministically for 6–11.8 seconds according to topic difficulty, guest serial and level. Ambient onlookers move to safe front-flank audience points without stepping through stage ropes. Destiny gets the blue/gold final-boss pixel aura; challengers get pink/purple energy.
- **Stage TV:** still clips to one measured in-plate LCD with an inset bezel clip; during live debates it shows two close-up opponents, health-bar styling, countdown and rotating *fictional* chat banter. Results animate as pixel-arcade K.O. boards with score; photos/autographs use brief white flash/ink reveals.
- **Lore:** fictional chat reactions include `COPIUM`, `ShrimpleAs`, `AngelThump`, `Abathur`, `REFUTE THE TIMELINE.`, `Let him cook!`, `Where's the fact-check?!` and more. They are not real transcripts or claims about historical outcomes.
- **Testing:** `tests/venue_modular_v088b.test.mjs` now includes greeter patrol, claw-prize usage, and long boss exchange/TV regression coverage (**12/12 passed**, Node 22). The current `tests/venue_v088b.test.mjs` also passed. Earlier `venue_v082`–`venue_v088` suites assert pre-unified art/queue geometry and are no longer valid release gates. The 100-seed v0.7 simulation is CPU-heavy in a 1-vCPU sandbox; one complete 20-guest perfect session passed with 3 stars.

## Scene ownership and key files

| File | Responsibility |
| --- | --- |
| `assets/irl-venue-baked-v088h.webp` | Single rerendered fixed 16:9 stage/booths/stairs/floor/planters/scanners/rope/tripod environment. |
| `assets/irl-ticket-clerk-v088h.webp` | Dedicated front-desk employee, transparent sprite, integrated with the counter's occlusion mask. |
| `src/venue-geometry-v088b.js` | Immutable 384×216 collision/interaction geometry and LCD transform aligned to the plate; visually invisible. |
| `src/venue-rig-v088b.js` | Draw one plate, clipped dynamic LCD, booth receipts, retractable stationary gate glass, atmospheric dust motes, reactive debate uplights, permanent clerk and foreground occlusion. |
| `src/venue-nav.js` | Sprite-feet collision and 39–43-unit admission lanes, four separate rope solid segments, S-curve distance-based lineup, distinct ambient crowd stations. |
| `src/venue-tickets-v088h.js` | Issue unique one-use tickets to all arriving scripted/ambient attendees; consume precisely once at inside crossing, count clerk scans. |
| `src/irl-v07.js` | Live meet-and-greet state, fixed admission staff, consumption at crossing, 21 ambient crowd cap, multi-stop switchback guest movement, tripod-based fan photo and TV output. |
| `src/irl-atmosphere-v083.js` | Smaller queued chatter and focused text boxes; selected guest stays legible. |
| `src/venue-effects-v086.js` | Short speech cards near speaking heads; LCD-safe speech placement; queue indicators. |
| `src/sprite-animation.js` | Perspective scale narrowed to 0.91–1.05 for consistent sprite proportions. |
| `src/ui.js`, `src/irl-sandbox-v085.js` | Main and isolated harness render same venue, actors then foreground occlusion. Legacy broken plate is never displayed while loading. |

## Coordinates and invariants

- Local canvas: `384×216`. Every stage/fixture coordinate, NPC sprite foot position, gate lane and TV transform uses this single space.
- Stage: fixed illustrated footprint approximately `x188..338, y19..95`; stairs at upper-right hall center; no dynamic stage furniture. Destiny's animation target is restricted to `x204..212,y44`, always left of the LCD broadcast title.
- TV LCD: `x233,y32,w70,h32`; the runtime feed is clipped to the screen. A photo moment renders exactly **one Destiny portrait and one guest** plus signature, not two Destinys.
- Front counter: `x149,y180,w88,h36`; human-scale relative to ~30×38 NPC sprites (waist-high, not miniature).
- Left gate lane `x85..124` (39 units); right gate `x254..297` (43 units). This is narrower visually than the g plate but still fits the 30px sprites and a margin. The posts and enlarged planters are fixed solid obstacles; only translucent glass shutters retract, not pillars.
- Every incoming guest (including scheduled ambient crowds) gets one distinct numbered ticket. A check-in pauses to verify it, opening the corresponding gate. `processVenueTicket` subtracts precisely one only upon successfully reaching the gate's inside waypoint, never on an animation tick or at the exterior desk. Gate access remains required for the crossing.
- Merch, claw, snacks, vending and photo have colliders and active standing/interaction stations. They are artwork baked into the image, not static gameplay.
- Crowds may use open floor but cannot walk through stage riser, furniture, scanners, planters or ropes. Queue positions are distinct. Stage guests enter a **distance-parameterized 12-waypoint switchback corridor** along the painted velvet rope runs, advancing in order as earlier guests leave.
- The tripod sits at stage-right approximately `x309..325,y59..83`, aimed at `photoHost=[214,44]` and `photoGuest=[247,44]`; stage photo flashes come from this position. Keep one host/one guest on the dynamically clipped LCD.
- Dust motes are at seven light anchors, non-colliding and strictly cosmetic; stage-floor light bloom intensifies only while a debater is exchanging arguments.
- Preserve v0.8.7-style compact decision controls and the five-button Invite to Debate action; do not reintroduce oversized scrollable cards or arbitrary star/music emote tiles.

## Verification and release gate

Focused regression coverage: `tests/venue_modular_v088b.test.mjs` checks both valid WebPs, solid/scaled lane routes, 18 ambient queue positions, S-line advancement with directional changes, TV clipping/two distinct portraits, stage pacing, and ticket issuance/one-time consumption for scripted and ambient guests, plus an end-to-end stage photo through the tripod. **9/9 passing at the earlier v0.8.8h checkpoint; 12/12 current v0.8.8j focused cases passed.** Verify full repository tests and browser-test `/irl-sandbox` at desktop and mobile dimensions.

Owner must review:

1. Empty-room plate visibly opens up the floor; stage feet/risers share the floor grid.
2. 30×38 sprites pass through both 39–43-unit lanes without clipping; shutters retract but posts stay fixed, no lateral bypass.
3. Unauthorized entrants do not go through gates; scanner posts never move.
4. Boothes trigger visit/receipt activity and stay solid.
5. A visible clockwise/counter-clockwise serpentine queue guides stage fans to the stairs without cutting ropes; a stage-right tripod photographs one host and one fan.
6. The TV plays photo/debate events cleanly; no doubled Destiny or text collisions.
7. Chatter and decision cards never obstruct the active visitor.
8. No old plate flashes while the new asset is loading.
9. iPhone Safari layout and save/unlock flow remain usable; the clerk remains permanent and is not assigned general NPC tasks.

**Next step:** run the new Node regression suite and inspect the v0.8.8l `/irl-sandbox` preview; obtain desktop/iPhone visual approval before promotion. Preserve earlier release history.
