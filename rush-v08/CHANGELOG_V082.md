# FeedFall: Rush Hour — v0.8.2 visual and navigation update

This builds on the recovered modular v0.8.1 source; all established arcade
worlds, creator progression, save migrations and tester unlocks remain intact.

## New

- Higher-resolution venue drawing. Bilinear smoothing is the default, with
  reduced pixel intensity; nearest-neighbor remains an optional comparison.
- Graphics debug controls: press **G** or tap **GRAPHICS · G**. Switch
  interpolation, adjust the pixelation slider (0–100%), inspect the collision
  grid and restore recommended defaults. Graphics preferences persist
  independently from progress.
- A real walkability grid and routed movement around the stage, booths,
  barricades, photo backdrop and entrance. Crowd guests use designated queue
  slots, while staff/security escorts follow navigable routes.
- Additive 4×2 pose atlases for the illustrated host, photographer and
  security guard. Character actions include walking, talking, pointing,
  laughter, cheering, arguing/heckling and impatient waiting. Other approved
  characters retain exact original artwork with motion-state fallback until
  additional pose atlases are available.
- Active stage host cycles between mic interaction, debate gestures,
  responses to queue pressure and Q&A behavior.
- Twenty new fictional Destiny/DGG convention scenarios, station-aware
  crowd dialogue, emote references and Creator Network profile lore tags.

## Art and safety

Original high-resolution hall and cast atlas are preserved unchanged.
New PNG pose masters and optimized WebP runtime assets are kept separately.
Content treats disagreement as lawful and avoids associating personal identity
or political opinion with safety threats.

## Known verification limits

- The new collision grid is tuned to the current hall image; minor sprite
  occlusion at stairs and backdrop edges may need an actual phone review.
- Three characters have full additive pose sheets; remaining cast sprites use
  existing poses plus state-based movement/emotes.
- Browser graphics, touch-target sizes, art fidelity and frame rate require
  owner playtesting on the deployed preview.

## Recommended v0.8.2 playtest

1. Open the versioned Vercel preview link provided at deployment.
2. Use **⚙ TEST MENU** to unlock the Destiny creator/event if necessary.
   Existing saves on a different hostname can be imported from JSON there.
3. Select **Creator Network → Destiny → Meet & Greet**.
4. On desktop, press **G**. On iPhone, tap **GRAPHICS · G**.
5. Compare *Bilinear* and *Nearest-neighbor*, move the pixelation slider,
   and briefly enable **Show walkability/collision grid**.
6. Start the event. Watch queues at the entrance, movement around the stage,
   security dispatch, guest dialogue, Destiny gestures, and action feedback.
7. Note any clipped characters, hidden text, slow frame rate or unfair timers;
   share your device and browser when reporting.

**Build hygiene:** No generated monolithic HTML, embedded base64 image
payloads, dist directory or preview screenshot directory belongs in this
source checkpoint.
