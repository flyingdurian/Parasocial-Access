# v0.8.9 — Four battle presentation prototypes (isolated)
Status: playable concept lab, separate and unmerged. Baseline `feature/v088v-sprite-tv-polish` at `6afc2c2`; derived through `feature/v089-rival-invasion-lab` at `8645558`. No hall integration or production promotion.
Entry point: `/battle-showcase.html`.

## Comparative concepts
- **A Broadcast Clash:** large waist-up actors, two live-camera windows, lower-thirds, colored back-view crowd.
- **B Debate Assault:** comic cut-ins and short attack cards with visual hits, not extended prose/trivia.
- **C Stage Spectacle:** wider live stage, dancing lights, audience energy; intentionally less intimate.
- **D Hybrid Director's Cut:** live characters grounded behind debate podiums with broadcast composition and audience animations.

## Fair-play controls
All four concepts share the same six 4-second beats and deterministic cues. Relaxed assistance explicitly highlights the required counter. A correct counter at *any point* within 4s deals 27 damage and costs no HP; wrong or late deals 20 damage to Destiny and explicitly states the expected counter. Finishing Argument costs 60 accumulated energy and deals 43 damage. Changing presentation tabs does not restart or change battle stats; choose a rival, then Start to restart. Keyboard 1/2/3/Space or touch. There are no assertions about factual debates or real quotes.

## Reused original assets
- v0.8.8v cast back view: `assets/irl-cosplay-six-back-v088t.webp` (six columns, four animation rows).
- Existing `assets/irl-host-poses.webp`; all six transparent PNG rival atlases under `assets/rivals/v089/`; existing arena stage concept.
- No replacement cast sprites or base64 image payloads.
- The present arena audience uses the existing *six cosplay cast* back-facing strip as an illustrative repeating foreground; venue-provided full live audience synchronization is a future lead-developer integration.

## QA / constraints
- Static, self-contained `battle-showcase.html` importing the already-isolated rival registry.
- Compare all four on desktop and iPhone; verify 4s responses, timeout, wrong counter explanation, special energy, tab-switch state, and six named rivals.
- Vercel READY is not proof of actual interactive browser QA.
- Do not merge this visual experiment into accepted v0.8.8v or original rival branch without an owner selection.
