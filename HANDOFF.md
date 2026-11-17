# FeedFall: Rush Hour — Active Engineering Handoff

**Current candidate:** v0.8.8p owner playtest corrections, arcade debate show and relaxed mode; o is the previous preview.
**Working branch:** `feature/v088p-stage-bloodsports-relaxed` (forked from `feature/v088o-mobile-stage-interactions`).
**Production release:** Unchanged; owner visual approval required before promotion.  
**Verification:** v0.8.8p targeted/current regression sweep: 50/50 Node assertions passing before the final gate-timing adjustment. Full historic suite is **not** certified green (superseded v082–v087 stage/queue assumptions). Preview visual acceptance remains outstanding.

## v0.8.8p — current candidate, awaiting owner visual acceptance

- **Actual pit formation:** Spectator placement now consumes consecutive 0-based crowd slots rather than sparse NPC IDs (13+, 1000+); the earlier bug skipped front-row targets. 33 walkable half-ellipse positions are concentrated around the stage apron (first 19 y82–112), with smaller spectator-separation impulses, rear-view walking/poses facing the actual stage, and return to preserved previous activities afterward.
- **Speaker-owned chatter:** Ambient speech never slices the source sentence into `I brought a sig…`; wrapped text renders in its entirety. Debate/ambient bubbles search only speaker-adjacent collision-free slots; if none fit, defer the bubble rather than teleport it to another side of the arena. Stage dialogue boxes have more width/lines for complete exchanges.
- **Fan grounding:** Signing duet moved to x243/264,y38 and joint photo to x270/293,y36 (on the stage floorboards, closer to the tripod). Shadows use foot-contact geometry, two-layer softness and animated directional offset that responds to stage lighting vs ambient hall illumination.
- **Live audience television:** The stage LCD's audience cutaway copies the active rendered world-space crowd near stage from the same frame, instead of presenting disconnected portrait sprites.
- **Arcade bloodsports:** Contestants lunge and recoil on exchange beats, with miss/normal/critical impact variations, stage/effect flashes, rotating concentrated spotlights and dramatic full-sized `DEBATE WON` / `DEBATE LOST` KO overlays. Original synthesized SFX respect mute.
- **Closed entrance:** Gate leaf animation is idle-closed; admissions get a short timed open window refreshed while an authorized person physically crosses, and security exits hold only while the escorted person remains in the lane. Decorative permanent infill rails cover dead gaps between fixed scanners, planters and front desk.
- **Live difficulty & HUD:** Expert remains default with no correct-answer cue. Relaxed mode exposes a clear case-type cue and emphasizes only the matching action, without changing decision duration, pace or score. A compact in-venue arcade telemetry strip shows score, vibe, time and guest count; guard counters are removed. All five decisions form one cluster, including Debate at #4 and Security #5, responsive on phones; number keys match the visual order.
- **Code / QA:** Targeted coverage in `tests/venue_v088p.test.mjs`, plus current v088o/n/m/l/k/modular tests. Claw machine mechanics intentionally untouched in p per owner. Preserve browser-launchable `/irl-sandbox`; preview branch only until owner signs off.

## v0.8.8o — mobile-owner QA corrections, pending device acceptance

- **Mobile decision legibility:** On narrow iPhones, the selected visitor has a bright *in-world* head marker, while the full decision text and cue appear in a dedicated readable card immediately below the uncropped venue canvas and above the action buttons. Both `/irl-sandbox` and the full game use this split; prompts no longer cover the entrance/gates. Existing desktop world-space card behavior is unchanged. The isolated sandbox's graphics and chat-mute toggles now sit in the normal layout instead of floating across the score HUD.
- **Stage speech ownership:** Removed the 140–210 hard-clamped horizontal speech lane. Debater and Destiny each get their own card centered just above their actual head, with correct pointers; TV bezel avoidance moves the card upward (not sideways). Speaker placement is pre-reserved before ambient/debate shouts to prevent collisions. If a spectator shout has no valid nearby position it is omitted rather than painted over a reserved prompt.
- **Actual stage crowd:** 31 concert-style targets sit directly at the real stage apron and wings. The first nineteen occupy tight front and second rows (roughly y83–124), not the entrance floor y150–172. Movement, enthusiastic poses, return-to-prior-activities and 15–20-second debates persist.
- **Fan events:** Autograph (5.1 s) moves Destiny to `autographHost=[221,29]` next to `autographGuest=[244,29]`, with a drawn signed print and moving pen; joint photo (5.4 s) places them at `[259,27]` and `[283,27]`, behind the baked stage tripod, with posing and a delayed camera flash. Both begin approaching one another while the fan is still climbing the stairs. Stage TV receipts remain at completion.
- **Claw chute:** The single collectible's *center*, release gripper, and gravity fall now share the artwork's center dispenser x≈179, from glass down to slot. No second toy copy remains in the cabinet.
- **QA:** `tests/venue_v088o.test.mjs` covers audience geometry, head ownership and TV overlap, stage-duration/duo positions, plush centerline and responsive cards. 5/5 passing. Historic venue test sweep: 70/78 pass, 8 pre-existing outdated assertions (v082–v087 old plate, queue, timing), not suitable as release gate. Targeted v088b, k, l, m, n regressions still 37/37. Browser on-device visual verification not yet accepted.
- **Gate:** Do not promote production before owner inspects iPhone stage dialogue, entrance review placement, crowd congregation, duo signing/photos and physical claw-slot fall.

## v0.8.8n — implemented, awaiting visual acceptance

- **Navigation correctness:** `moveVenue` cannot report arrival on a blocked route. The grid router now handles walkable targets whose coarsened 8px cell center falls inside the gate/floor collision boundary; previous false arrivals and stranded stage visitors were caused by this mismatch.
- **Grounded movement:** Character artwork scales by physical floor depth while contact shadows remain at actual foot positions, even on hopping/cheering frames. No renderer-only photo booth translations.
- **Photo engagement:** A guest walks to the doorway, physically enters x344/y57, poses, then triggers a delayed shutter and exits to the precise doorway position. A photo is not counted, animated or flashed until the guest is actually inside. Merch, food and claw trigger only on exact reached interaction positions, not within a broad 24px radius.
- **Crowd debates:** Every free spectator rushes to the clear stage semicircle during challenger prelude/exchange, with distinct point, cheer and argument poses. Their original world position and intended activity are saved; on completion they walk back before resuming their routine. Grid-boundary routing regression fixed for all 19 starting spectators in simulation.
- **15–20-second bloodsports:** Opponent faces Destiny to stage left throughout exchange. Existing split TV camera direction, original synthesized impact audio, rapid lore/meme chat, Destiny blue/gold aura (~25% duty) and challenger crimson/purple (~10%) preserved.
- **Gates and staff:** Giant gridded shutter planes replaced with waist-height retracting scanner arms; physical admission remains ticket-controlled. Gate monitor patrol cycles left gate, desk, right gate and desk; the one-monitor clerk remains visible as stationary desk service.
- **Claw:** The single real dggL plush travels from floor through gripping/lift/transport then falls into the cabinet chute. It no longer respawns in the glass after release.
- **New cast:** `assets/irl-cast new sheet 1.png`, `2.png`, `3.png` are 1536×1024 RGBA six-column/four-row transparent sheets. Their rear walk, lateral walk and front reaction poses are loaded in both main world and isolated harness. All six IDs 30–35 appear in the crowd immediately. Remaining art work: dedicated front walking and stronger separate argument frames; do not claim these are authored yet.
- **Harness parity and versioning:** Both `src/ui.js` and `src/irl-sandbox-v085.js` use real positions, grounded shadows and the new cast. HTML headers display v0.8.8n. `/irl-sandbox` is the direct playtest entry; 2× is the intended production speed cap (the isolated harness still offers higher developer fast-forward modes).
- **Acceptance gate:** Test on iPhone and desktop: 31-guest high-pressure scene, first 6 new actors distinct in every orientation, photo doorway in/out, stage crowd front-of-stage ring and return, 15–20s opponent-facing battle, both gate scanner animations, ticket monitor patrol, dggL claw chute, and no floating sprite feet. Production stays untouched until owner approves.

## v0.8.8m — visual-correction pass after owner's annotated screenshot

- **Quiet stage queue until countdown:** Ambient roam selection excludes the stage waiting corridor (x160–312, y92–162) and normal crowds stop choosing the signing/mic/queue targets. Once a challenger approaches or climbs the stairs, non-ticketed spectators sprint toward a stage semicircle (63 px/s initially) and animate cheers, jumps, arguments, and actual world-space DGG lore shouts every ~0.68s. They disperse again after the round.
- **Stage duel:** Destiny's home performance moves to x198–206, y32, well onto stage left. Challenger climbs to x285, y32 on stage right, faces left toward Destiny; removed an extra 5px downward draw offset that previously left them visually on the steps.
- **TV:** A visible "DEBATE IS ABOUT TO BEGIN..." broadcast slate plays during challenger approach, then a camera director changes every ~1.55s between dramatic *solo zooms* of Destiny/challenger, two-shot and a close audience cam. Lore/meme text stays on the actual spectators, never on LCD.
- **Live attractions:** Photo guests walk to booth threshold and visibly move inside (display pose at x344,y57) before a delayed shutter flash; no empty-room photo flashes. Claw uses the **actual transparent dggL sprite** (the same already uploaded PNG) as the collectible plush: grapple descends, grips, lifts, carries and deposits the illustrated toy in the cabinet's prize chute. Merch/food guests continue to approach and face their physical counters.
- **Entry cohesion:** Sliding slotted gates now mount flush to scanner edges with permanent crossrails aligned y183–210. Authorized gate clearance remains 39/43px. Check-in clerk has subtle four-keyframe nod/scan motions; idle support staff use existing directional walk animation while pacing nearby.
- **QA:** 34/34 focused Node assertions passing across v088, v088b, v088k, v088l, v088m; current preview `/irl-sandbox` READY; image assets both 200. Legacy six-suite run exceeded the temporary runner time budget, outcome unknown.\n- **Approval:** Do not promote to production until owner confirms visible performer separation, crowd prelude/quiet normal queue, occupied photo booth, real plush pickup, gate alignment, and mobile performance.

## v0.8.8l — prior accepted preview

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
