# FeedFall: Rush Hour — v0.8.3 Modular Source

## Implemented

- **Global avatar repair:** explicit root-relative `/assets/avatars/{0..17}.webp` map replaces the missing embedded registry; first-failure fallback and CSS placeholder avoid broken image boxes. Cross-world avatar paths are stable in the modular static deployment.
- **Live graphics laboratory (G):** existing bilinear/nearest and pixelation scaling, plus off/dithering-grain/chromatic-edge effects, strength slider, optional Chaos Mode and collision overlay. Defaults favor clear decisions; all settings persist separately from progress.
- **True walking-pose pipeline:** new identity-matched walk atlas for the 12 original cast members; two additional six-character animated cast sets (24 total kinds) with 2-frame source rows. Existing special host/guard/photographer pose atlases retained. Source PNGs and compressed `.webp` outputs are independent assets.
- **Living hall:** dense cast additions in phases 2 and 3 (13 → 19 → 25), real perimeter/floor patrols by security, padded stage and backdrop boundaries, eight queue destinations, soft stage amber pulse and screen-space golden motes.
- **r2 navigation cleanup:** collision checks account for sprites' feet rather than just their top-left image anchors; queue stations rerouted around the check-in desk and new crowds spawn with local separation.
- **r3 traffic-flow fix:** attendees start in a roaming state with dispersed destinations and count a station as visited within its nearby gathering radius. Overly strict pedestrian-to-pedestrian blocking caused a live crowd deadlock; cross-traffic remains visually permissive until a full priority-lane avoidance system is authored. Cached navigation routes remain intact.
- **Event audio:** retro synthesized tick bleeps for visible typed ambient chatter, occasional DGG-style emotes, original per-phase convention music with sparse background murmur and stage PA note, not licensed recordings.
- **Stage and feedback:** event-driven Destiny mic/watch/nod/surge reactions; successful welcomed visitors queue for stage stairs, have an animated fan/critic encounter and depart; guards escort threats to the exit with a visual arcade ejection and bonus; good/bad verdict stamps, flash, supported haptics and a short incident-to-Game-Over fade.
- **Narrative:** added fictional transcript, roundtable, canvassing, emote and venue-conduct situations and creator profile tags; appended source-limits note to `DESTINY_DGG_LORE_RESEARCH_V071.md`.

## Safeguards

- No embedded base64 imagery, `dist/`, monolithic `-Play-Now.html`, or previews are part of this source tree or the web deployment.
- Original game modes, progress/save schema, player decision focus model and previous assets are preserved.
- DGG material is explicitly fan fiction / invented event circumstances; opinion, emote faction and lawful criticism never imply threats.

## Next handoff — starting point for v0.8.4

1. **Visual QA on mobile hardware:** compare bilinear/no filter, grain and chromatic options, including 25-person phase, and tune bubble alpha; verify no source sprites are compromised by downsizing on phone.
2. **Animation expansion:** only locomotion has two true per-character gait frames for the whole cast. Author per-character talking/laughing/heckling/arguing/cheering frames in additional additive atlases (prefer 4-frame or 6-frame cycles), plus dedicated host watch/mic physical poses. Avoid deformation of rigid props.
3. **Spatial polish:** run long playtests for crowd congestion and stage staircase composition; the current navigation grid is approximate artwork mapping, not a pixel-perfect artist-authored obstacle mask. Consider collision polygons, priority lanes, and physical queues with contact separation.
4. **Arcade tuning:** benchmark escort/ejection timing, final-stage wait behavior, missed-threat cinematic and background sound volume with Michael's playtest notes. Retain a clear decision target when Chaos Mode is enabled.
