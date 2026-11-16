# FeedFall: Rush Hour — Active Engineering Handoff

**Current candidate:** v0.8.8g, unified convention plate / navigation recovery.  
**Working branch:** `recovery/v088g-unified-plate`.  
**Baseline:** `release/v0.8.8`, commit `bcbb27de6df8bb8f395cd3bbfe392315be7360b6`.  
**Status:** isolated candidate pending owner visual playtest and release approval; do not silently replace a previously accepted release.

## Purpose

The v0.8.8b–f hall rebuilds introduced prop-scale drift, floating stage pieces, undersized gates, crowded paths, and bulky overlays. v0.8.8g substitutes a **single coherent 384×216 pixel-projected hall plate** for ALL structural art. Runtime layers remain separate and functional. Keep the evening indigo/purple/magenta/amber palette, fictional comet convention branding, and dggL on stage banners. No Twitch or rainbow-striping branding in the plate.

## Scene ownership and key files

| File | Responsibility |
| --- | --- |
| `assets/irl-venue-baked-v088g.webp` | One illustrated backdrop with fixed ground-contact stage, stairs, merchandising/food/vending/photo booths, planters, scanners and waist-high check-in counter. |
| `src/venue-geometry-v088b.js` | Immutable 384×216 collision/interaction geometry and LCD transform aligned to the plate; visually invisible. |
| `src/venue-rig-v088b.js` | Draw one plate, retractable glass leaves ONLY, dynamic LCD broadcast/photo content, booth receipts and foreground occlusion sampled from that same plate. |
| `src/venue-nav.js` | Sprite-feet collision checks, authorized left/right gate passages, station approach points, 18 crowd queue slots, stage approach routes and walkable roam cells. |
| `src/irl-v07.js` | Live meet-and-greet state, crowd cap of 21 simultaneous ambient attendees, crowd separation, entrance authorization, booth visits and stage flow. |
| `src/irl-atmosphere-v083.js` | Smaller queued chatter and focused text boxes; selected guest stays legible. |
| `src/venue-effects-v086.js` | Short speech cards near speaking heads; LCD-safe speech placement; queue indicators. |
| `src/sprite-animation.js` | Perspective scale narrowed to 0.91–1.05 for consistent sprite proportions. |
| `src/ui.js`, `src/irl-sandbox-v085.js` | Main and isolated harness render same venue, actors then foreground occlusion. Legacy broken plate is never displayed while loading. |

## Coordinates and invariants

- Local canvas: `384×216`. Every stage/fixture coordinate, NPC sprite foot position, gate lane and TV transform uses this single space.
- Stage: fixed illustrated footprint approximately `x188..338, y19..95`; stairs at upper-right hall center; no dynamic stage furniture.
- TV LCD: `x233,y32,w70,h32`; the runtime feed is clipped to the screen. A photo moment renders exactly **one Destiny portrait and one guest** plus signature, not two Destinys.
- Front counter: `x149,y180,w88,h36`; human-scale relative to ~30×38 NPC sprites (waist-high, not miniature).
- Left gate lane `x76..130`; right gate `x253..310`, each ≥54 world units wide. The posts and planters are fixed, solid obstacles. Only thin glass shutters retract; no translated posts.
- Every guest entrance requires `gateAccess=true`; unauthorized routes cannot cross the scanner line.
- Merch, snacks, vending and photo have colliders and active standing/interaction stations. They are artwork baked into the image, not static gameplay.
- Crowds may use open floor but cannot walk through stage riser, furniture, scanners or planters. Queue positions must remain distinct, and stage guests alone use the staging path.
- Preserve v0.8.7-style compact decision controls and the five-button Invite to Debate action; do not reintroduce oversized scrollable cards or arbitrary star/music emote tiles.

## Verification and release gate

Focused regression coverage: `tests/venue_modular_v088b.test.mjs` checks one valid WebP, proper solidity and scale, both gate routes, 18 queue spots, on-plate rendering, TV clipping and dual-person photo, and foreground masking. Verify full `node --test` if the repository test harness is available, then browser-test `/irl-sandbox` at mobile dimensions.

Owner must review:

1. Empty-room plate visibly opens up the floor; stage feet/risers share the floor grid.
2. 30×38 sprites pass through both lanes without touching posts or counter.
3. Unauthorized entrants do not go through gates; scanner posts never move.
4. Boothes trigger visit/receipt activity and stay solid.
5. Stage entrance, queue, 1-on-1 signing and debate remain functional.
6. The TV plays photo/debate events cleanly; no doubled Destiny or text collisions.
7. Chatter and decision cards never obstruct the active visitor.
8. No old plate flashes while the new asset is loading.
9. iPhone Safari layout and save/unlock flow remain usable.

**Next step:** deploy this candidate as a Vercel preview; obtain visual approval before promotion. Keep earlier release and source history recoverable.