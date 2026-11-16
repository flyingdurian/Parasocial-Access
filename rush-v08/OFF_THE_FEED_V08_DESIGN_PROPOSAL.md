# Feedfall: Off the Feed — v0.8 Redesign Proposal

Status: **Design proposal for owner review; not implemented in v0.7.1.**

## Diagnosis of the v0.7 playtest

v0.7 visually simulates guests but keeps the player's actual task in a text panel below the scene. The decision is detached from the person, location, and visible consequence. In a fast-paced game this collapses into Open Feed with a decorative background. It also carries over the Live Arena's least-used mechanic: manually retargeting messages under time pressure. The current three recolored guest silhouettes and concert-hall setting do not communicate an identifiable convention world.

This is a **mechanics problem first** and an art-quality problem second. Replacing sprites without changing the input loop will not make the event feel alive.

## New design principle: the venue is the interface

The player is a floor coordinator at a fictional convention meet-and-greet with Destiny. The player sees a high-angle pixel-art venue with attendees walking, clustering, browsing booths, cheering, approaching staff, joining and leaving the signing area, and occasionally creating problems. Situation bubbles attach to **people in the room**. Player decisions cause **staff and visitors to move and react in the same room**.

One player focus exists at a time, automatically and stably chosen by the Attention Director. The user can optionally tap another person, but high-pressure play must never require a manual selection.

### Screen composition

- Approx. 75–85% of the playable viewport: illustrated convention floor. On phones, preserve the scene's useful scale and prioritize visual readability over showing the whole building.
- Scene anchors: destination/exit, entry doors, merch booth, community booth, panel stage with video screens and microphone, meet-and-greet table, approachable staff positions.
- World-space interactive speech bubbles with short lines (one sentence, 5–12 words) appear above a limited number of attendees. Long detail can expand **beside that attendee**, within the scene; no separate bottom text card.
- One compact, persistent action strip is anchored to the viewport edge; it contains **commands only**, not the case content.
- Tiny in-scene consequence labels (`CHECK COMPLETE`, `FAN PHOTO`, `STAFF ASSIST`, `FALSE ALARM`) appear where the decision resolves. The crowd, staff, and event HUD visibly change.

### Attention Director (solution to six simultaneous bubbles)

1. Crowd activity can involve dozens of simulated people; **at most one full readable actionable bubble** is displayed at a time.
2. Up to two pending bubbles appear as small speech marks (`…`), with distinctive position markers; no requirement to read or select them.
3. All other attendees are ambient. Their gestures and movement add life without stealing attention.
4. The primary bubble has a visible focus ring, a remaining-time arc, and a non-flashing arrow pointing to the person.
5. **Focus cannot swap mid-read.** Only player action or an explicitly displayed expiry changes primary focus. The game pauses the focus countdown very briefly during transition animation to avoid a double-penalty.
6. Queued pending events have a reserve time budget; they do not instantly expire off-screen. If pressure mounts, spawn spacing and safe auto-resolutions protect the player from impossible simultaneous decisions.
7. Optional tapping on another attendee is deliberate advanced control, not assumed core gameplay.

The director's queue is stable and deterministic per level seed. Its scheduling uses event criticality and age, with an anti-starvation rule; it does not jump to a newer “more exciting” guest while the player is reading.

### Four floor-coordinator commands

| Command | What the player sees | What happens in the venue |
|---|---|---|
| **Welcome** | Friendly guest, regular fan, excited first-time attendee, merch autograph request | Greeter escorts or waves guest through; crowd mood improves; fan gets a small celebratory response |
| **Verify** | Conflicting badges, unclear booking, ambiguous context | Check-in staff walks to the guest; pass is checked visibly; the decision resolves with concise feedback |
| **Redirect** | Line-jumper, misplaced VIP, loud but nonthreatening heckler, attendee needing assistance | Steward leads guest to a new station or boundary; surrounding crowd returns to normal |
| **Security** | Credible, behavior-based immediate safety danger such as an actionable threat or physical boundary breach | Security staff moves to protect people and separate the person; the event may be safely paused or ended depending on severity |

Political disagreement, snark, a negative shirt, or an unpopular opinion is **never** sufficient grounds for the Security action. Distinguish heckling/disruption from imminent danger. Security is a protective venue-management mechanic, not a punishment for an ideology or a guess from a person's appearance.

### Event architecture: Airplane Chefs-inspired, not random chaos

**Authored, seeded event decks** per level with fixed numbers of actionable beats (e.g., 18, 24, 30, 36), a defined safe/hard ratio, and replayable variations. A separate ambient crowd system continues running even when no actionable beat is active.

- Phase 1 — Doors open: arrivals, fans, check-in errors, merch traffic; unhurried teaching.
- Phase 2 — Peak crowd: concurrent ambient motion, two pending previews, debate challenges, mild disruptions, multi-staff traffic.
- Phase 3 — Live Q&A/closing: more tightly spaced situations, periodic crowd surges and rare safety events.

The levels choose **where** the event occurs and **who** plays its role (e.g., merch table, photo station, stage aisle). The same underlying task should produce a different spatial consequence by location. Seed changes guest identity, route, wording, booth, and prior state. Cards are not only synonyms of “unverified” and “remove.”

### A 60-second play example

| Time | Visible situation | Player input / consequence |
|---|---|---|
| 00:00 | Doors open; Destiny waves from panel stage; attendees trickle toward booths | No input; scene teaches itself |
| 00:06 | Guest beside check-in gains primary bubble: “First time here—where's the photo table?” | **Redirect**; steward visibly walks them to meet-and-greet |
| 00:13 | Smiling fan by merch booth: “Got the signed poster!” | **Welcome**; quick photo/cheer and crowd-vibe pulse |
| 00:20 | Guest displays a pass with a mismatched name | **Verify**; nearby staff takes the pass, scans, and gives feedback in-scene |
| 00:29 | Two pending bubbles (`…`) appear, while only one opens: “I paid for the front; let me cut.” | **Redirect**; guest returns to correct lane, angry crowd eases |
| 00:40 | An attendee heckles the stage; no dangerous behavior occurs | **Redirect**, not Security; staff moves them away from stage mic |
| 00:50 | Guest behaves in a visibly dangerous way, ignoring staff separation request | **Security**; protective response, then recovery animation and clear score feedback |

### Scoring and forgiveness

Reward accurate call *plus* visible physical resolution: safety, crowd trust, schedule/throughput, and clean staff coordination. Give immediate command acknowledgment (a crisp success/error cue), then an animated staff response. Do not make correct input feel ignored because a character is still walking.

- A normal error lowers crowd trust and score; it does not necessarily trigger rapid cascading failure.
- Two misses in succession produce a short **Recovery Window**: reduced event arrival rate, visible UI signal, one chance to regain control.
- Only an unresolved credible high-severity safety incident can cancel the event immediately, with clear advance warning and a fair response interval.
- Do not rely on players remembering power-ups while under pressure. If a recovery ability exists, offer it automatically at crisis thresholds or make it a highly visible contextual single-tap prompt.
- Each world has a skill ceiling through better resource allocation and quick recognition, not simply ever-shorter unreadable text deadlines.

### Sprite and venue production guide

- Pixel-art tiles/sprites only. Pixel-perfect sprite sheets, shared palette, consistent perspective and pixel grid. No vector stand-ins and no generated-video diffusion.
- High-angle convention hall with entry doors, partition walls, signage, booths, vending/merch, panel stage, event screens/truss, queues around specific tables, mic stand, information desk, exits, staff posts, and lighting changes as phases progress.
- Destiny: dedicated recognizable silhouette, hair/face/garment sprites, gestures for talking, reading, pointing, laughing, meeting fans; **not** the generic guest body recolored.
- 10–12 guest **body archetypes** with different silhouettes, hair, height, posture, outfits and mobility, plus palette variants; identities connect to speech/behavior roles without stereotypes. At least 4 useful states each: idle, walk, express, react.
- Separate identifiable staff: security, floor manager, greeter, badge verifier, merch operator. Their paths and tasks must be apparent at 384×216 logical render and mobile presentation.
- Use a constrained sprite production milestone before complex simulation code, validating actual in-game scale and readability against a screenshot benchmark.

### Implementation sequence / acceptance gates

1. **Vertical slice:** one convention room, 8–10 visible people, three actionable events, one auto-focused bubble, four buttons, actual movement to resolve choices. No external card list.
2. **Usability gate:** user can complete a three-minute run *without ever looking away from the scene*; no unexplained target swaps; every action produces immediate and animated feedback.
3. **Life pass:** ambient attendees, moving clusters, queues, merch activity, stage gestures, non-action chatter, independent staff behavior.
4. **Content and progression:** 3-phase event decks; 5–7 levels; Destiny/DGG flavor pack; rewards and recoverability; seeded variety.
5. **Art polish and phone QA:** sprite identities, convention structures, high-legibility scene bubbles, touch targets and performance. Only then label the full world as complete.

**Deferred:** close-up interactive meet-and-greet queue mode. It can reuse the same scenario library later, for Destiny or another creator, but does not belong in the initial living-world vertical slice.

**Non-goal:** violence simulation or tactical profiling based on fan/critic identity. Players coordinate protective responses to fictional event behavior; the game does not claim real-world people have ever posed such threats.
