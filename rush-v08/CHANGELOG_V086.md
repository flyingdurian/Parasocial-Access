# FeedFall: Rush Hour v0.8.6 — Living Venue Interaction & Arcade Polish

Scope: Destiny's convention only. The earlier worlds, creator modules and
v0.8.5 isolated harness remain in the modular source tree.

## Guest interactions and navigation

- Recenter the meet-and-greet queue in the opening between the stage railings.
  Welcomed guests take sequential stage turns and return to the roaming floor.
- Ticketed arrivals present their pass before either gate opens. Doors close
  automatically after the authorized passage. A gate overlay animates the
  barrier arms and authorisation LEDs over the hall art.
- Security ejections are escorted to a gate and continue completely off-screen;
  redirects/verifications and other guests rejoin the independent roam system.
- Wander targets span the full connected walkable floor, preserving collision
  boundaries around the scenery. Direction changes reset gait phase, feet remain
  grounded, and former 1.55px bob reduces to a nearly imperceptible 0.14px.

## Living venue visual / audio pass

- The screen behind Destiny displays fan photos with actual cast sprites and a
  signature, or exaggerated fictional arcade debate WON/LOST feedback for 1.8s.
- Add camera flashes that illuminate the venue, multi-fixture stage/booth/entry
  rush lights, drifting fog, and continuously animated venue screens.
- Destiny walks around his stage between interactions and returns to center for
  each debate/photo. The host uses a walking pose while moving.
- Ambient chatter remains a separate single-bubble system; speech lasts long
  enough to type its entire line, and emotes do not overlay speech bubbles.
- Chatter is less frequent and bleep ticks are sparser. Persistent one-tap
  chatter mute is available beside the Graphics (G) button.
- Add optional curved CRT lens rendering (barrel warp, scanlines and vignette).
- The constant "WATCH THE ENTRANCE" sign disappears after the first 10s.

## Verification and playtest

- `tests/venue_v086.test.mjs` tests roaming coverage, ticket authorization,
  gate closure, stage outcomes, crowd reentry, permanent ejection, gait and
  graphics preference persistence.
- The isolated `/irl-sandbox` remains the recommended rapid iteration path.
- All new venue screen outcomes are invented arcade UI, not representations of
  actual events or actual recorded debate results.

## Future playtest focus

- Compare gate panel alignment against the painted metallic fixtures at full
  screen size, especially in mobile aspect ratios.
- Inspect stage guest face-to-face framing and the 1.8-second screen duration.
- Observe very dense endless waves for overdraw, crowd route congestion and
  device-specific performance. No new monolithic HTML source is produced.
