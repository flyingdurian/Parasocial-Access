# FeedFall: Rush Hour — v0.8.4 Modular Source

## Core changes

- **Directional locomotion:** Two new 6-character cast sets each have four front/right stride frames and four back/north stride frames. Mirroring supports leftward routes; actual motion segment determines facing instead of the final destination. Step frames follow traveled distance, turn transitions hold a neutral keyframe, and stopped characters no longer slide. Accessible wheelchair propulsion is animated without invented legs. Original cast retains its prior two-frame/base pose pipeline; animation coverage remains a future asset task.
- **Walkability/pathing:** Greedy line-of-sight path smoothing retains sampled collision checks, preserving stage, stair, wall and counter boundaries. Welcomed guests have priority over wandering visitors in the stage corridor; this reroutes nearby pedestrians without a hard-blocking crowd deadlock.
- **Chaos Mode:** Original single ambient chatter bubble and typewriter timing are unchanged, regardless of the Chaos checkbox. The hierarchy now affects *only* queued decision bubbles, tiering opacity and size behind the fully opaque highlighted focus guest.
- **Stage interaction:** Welcomed fans/critics enter a physical stage waiting line. One visitor at a time reaches the stage stair landing, climbs to a visible exchange point beside Destiny, and alternates newly authored talking/cheering/pointing poses while Destiny responds. Two 6×4 transparent atlases cover all twelve original characters. The `PHOTO OP` cue appears only after arrival, never prematurely on dispatch; a rose stage-guest ring and stage-aware decision bubble placement keep the encounter visible. Visitors return to the floor before the next advances. Victory waits for stage visits to finish; the clock stops draining once decisions resolve.
- **Destiny performance:** Removed rapid idle/pose flashing; mic address, wristwatch checks, nods, queue-surge reactions, and discussion gestures hold meaningful action poses while his stage position eases toward the associated mark.
- **Research archive:** All 74 editorial ideas in `DESTINY_DGG_LORE_RESEARCH_V071.md` now exist as uniquely indexed fictional encounter candidates across six categories (14 debate/research, 12 streamer-media, 16 emotes, 12 community history, 12 venue behavior, eight evidence literacy). The encounter pool, station-dependent phase chatter, stage one-liners and Creator Network profile draw on the archive. These are not actual quotations, verified incidents, or evidence of a creator's participation in the depicted convention.

## Validation

- Unit/regression suite, deterministic stage-queue test, lore inventory, movement direction and asset-presence checks.
- Three simulated full-event runs each cleared 20 decisions and completed staged guest exchanges.
- Review the versioned Vercel preview on a real phone for rendering, audio and frame cadence; local headless Chromium may not be accessible in the execution sandbox.

## Next handoff / known limitations

1. Extend four-frame directional walking to the original 12 attendees and staff/guard pose sets; the original cast now has authored single-keyframe talking, cheering and pointing states, but not yet looping multi-frame gesture animation.
2. Replace approximate rectangular obstacle/feet clearance with artist-verified collision polygons and prioritized one-way travel lanes, particularly at the crowded stairs and photo booth; the current soft avoidance does not promise pixel-perfect person-to-person separation.
3. Tune distance-based step cadence, bubble alpha and mobile camera cropping with Michael's hands-on playtest. Expand archival coverage only from dated verifiable sources; keep original dialogue fictional.

Source hygiene: no base64 source images, `dist/`, generated monolithic play-now HTML, or preview dumps are packaged in this modular release.
