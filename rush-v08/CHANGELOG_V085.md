# FeedFall: Rush Hour · v0.8.5 Development Pass

## New isolated venue workflow

- `/irl-sandbox.html` opens just the Destiny Meet & Greet scene. It imports no game engine or global world UI. Its progress is stored under a separate sandbox-only local-storage key.
- Select Level 1, 2, 3 or Endless, change simulation speed (1×, 2×, 4×, 8×), use `G` for the graphics/Chaos controls, `1–4` for decisions, and `Space` to pause.
- The full game remains rooted at `index.html`, with the same saved world/creator progress as earlier releases. Test harness changes can be merged independently.

## Crowd art and navigation

- Two additional six-character four-row reaction atlases supply talk/cheer/point/argue for all 12 expanded sprites. The original 12-character cast also gains four new authored forward/back four-step atlas sheets, completing directional gait coverage across all 24 NPC/host identities.
- Walking animation is tied to accumulated distance via `VENUE_STRIDE`; a 1.55px stride bob is applied only while moving. The feet remain the depth-scaling anchor, and shadows remain fixed at the base contact point.
- Characters now share a Y-sorted scene draw with continuous scale bounds between `0.84` and `1.14`.
- Guests spawn below visible frame, proceed through the left/right gate lanes, pause to present a ticket, then move onto the floor. Additional crowd sets follow the same gate choreography.
- Collision grid retains stand-offs around solid structures and stage barricades. Roaming samples independent reachable points across the main hall. Unreachable path goals resolve safely without triggering repeated searches.

## Game and UI

- Stage guests form an orderly central queue and exchange reactions with Destiny in turn. The exchange completion clears the stairs for the next person.
- The full game's primary speech box always derives from its assigned live guest; stage activity can no longer re-dock it elsewhere.
- Chaos Mode renders all waiting decision boxes over their respective guests, using progressively smaller, lower-alpha tiers. The primary decision remains a full-size DOM box and keeps its bright ring. **Ambient chatter presentation and typewriter audio behavior are independent from Chaos Mode.**
- Three progressively denser standard levels have separate stars/best scores and unlock in order. Endless Mode uses escalating waves, seven-second between-wave breathers, venue-pressure penalties, a two-strike safety limit and a persistent high score.
- The Destiny scene alone imports the DGG emote display and lore. Six original, community-inspired fan-art emote badges are shown above attendees, and DGG emote names can still appear in ambient dialogue. These illustrations are not official community-provided emote files.

## Scope and future iteration

- Standard gameplay and the new harness use the same underlying event controller, navigation and sprite sheets.
- Further art validation is required with the owner for directional body mechanics, generated reactions, gate alignments and physical stage placement. Exact artwork cleanup should follow playtest screenshots or a frame-by-frame walk-cycle review.
- The three-level parameters (20/26/32 guests) are tuning defaults, not locked product decisions.

## Hygiene

- No single-file play bundle, base64 image source, `dist/` or `previews/` is part of this source release.
- Vercel deployment is a separate preview revision, leaving v0.8.4 intact for comparison.
