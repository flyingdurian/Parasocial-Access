# FeedFall v0.8.7 — Destiny Convention Foundation

## Implemented in this pass

- Split peaceful debate invitations from fan welcomes. Five event decisions now include **Invite to Debate**, with an intentionally mixed twenty-case deck (6 fan welcomes, 3 debates, 5 redirects, 4 ticket checks and 2 security cases); the early cards no longer overwhelmingly teach Welcome.
- Added persistent **1× / 1.5× / 2×** Destiny event speed control to the full game. The independent developer sandbox retains 4× and 8× test acceleration; other FeedFall worlds are unaffected.
- Moved the physical fan/debater line to the center stair opening and introduced ordered stage approach, fan/critic exchange, stage departure and crowd rejoin phases, with dedicated actor paths and distinctive TV event triggers.
- Hardened venue walkability at the painted front fence and scanner posts: only ticket-authorized arrivals and security exits may cross the gates. Crowd roam selection spans the connected interior, and staff stations/starting NPC positions were adjusted to remain accessible.
- Revised Chaos Mode decision display: primary remains prominent; second and third decisions retain full, legible text with separate color treatments; further pending items are compact. Ambient chatter is independent and unchanged.
- Added an open-gate visual asset `assets/irl-hall-open-v087.webp` while retaining the original background. The versioned web preview falls back to the prior hall asset plus a painted-barrier masking/animation layer when the new art is not hosted.

## Known limitations / next handoff

**v0.8.8 starts from this exact v0.8.7 source.** Replace the static hall layer with modular, depth-compatible stage, ticket gates, scanners, booths and props so painted closures never conflict with animated geometry. Publish the revised background with the binary art pipeline; this v0.8.7 preview uses the fallback patch. Then polish *visible* center-stage photo poses, autograph signatures, critic/debate animations and timed TV effects; validate that all six new cast sprites have matching directional walk cycles. Avoid degrading the approved pixel-art style.

**v0.8.9** focuses on live-venue atmosphere and tension: clearer rush surge pacing, DGG-exclusive emote content, shorter/faster ambient chat, stall gameplay that has actual player-facing consequences, CRT option, mobile and high-density collision/animation QA.

Every release must carry a versioned Vercel preview and exact playtest steps. Do not commit `dist/`, generated preview dumps, raw base64 or single-file playable HTML bundles.
