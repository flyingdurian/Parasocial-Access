# FeedFall: Rush Hour — current v0.8.8 development source

The current modular game is in `src/` with high-resolution assets in `assets/`;
`index.html` starts the full game and `irl-sandbox.html` starts the isolated
Destiny Meet & Greet harness. Serve this folder over HTTP (for example
`python3 -m http.server 8080`) and visit `/` or `/irl-sandbox.html`. On Vercel,
the sandbox route is `/irl-sandbox`. **Do not bundle or commit** `dist/`,
`previews/`, single-file `*-Play-Now.html`, embedded base64 art, or verbose
generated logs during development.

Read `CHANGELOG_V088.md` and repository-root `DEVELOPER_HANDOFF_V088.md` for
the current recovery state, module map, feature checklist and deployment
status. Run the Node suite with output redirected to a file, for example:
`node --test tests/*.test.mjs > /tmp/feedfall-tests.log 2>&1`.

---

# Feedfall: Rush Hour v0.7.1 DEV — historical Tester Access Patch

## v0.7.1 — Immediate playtest access (no IRL mechanics overhaul)

This is a **separate debug build of v0.7**, not a rewrite of the current IRL event world. The owner rejected v0.7's text-centric interaction loop. The proposed visual-world redesign is documented in `OFF_THE_FEED_V08_DESIGN_PROPOSAL.md` and requires review before implementation. The original v0.7 and stable v0.6.1 remain separately available.

Open **⚙ TEST MENU** in the top navigation (or **DEV UNLOCKS / SAVE TRANSFER** on the world map) to:

- Unlock one additional campaign level in any of the four worlds, including the first level of a still-locked world.
- Unlock all **19 levels** and all **9 Creator Network chapters** in one step, or unlock the Creator chapters on their own.
- Revoke development access, restoring natural level and creator gating without changing earned stars, records, XP, credits or gear.
- Add optional **1,000 test credits** if you want to experiment with individual equipment purchases. **No upgrades are auto-purchased or maxed.**
- **Export/save transfer:** copy a JSON backup from the expandable panel and paste it into any later preview's Test Menu. A valid import retains actual progress, gear, creator records and debug unlocks; your previous local save is preserved under an additional backup key before import.

### Important save limitation

Browser `localStorage` is isolated by **origin**. A new Vercel preview hostname does not have access to the old hostname's save, even when both HTML builds use the same key. v0.7.1 retains the v0.7 save key `feedfall:rush-hour:off-the-feed:v07` for same-origin continuity and adds stable, separate developer access key `feedfall:rush-hour:developer-access`. It cannot automatically read old saves from other domains. Export a backup **before** leaving a build whose progress you care about; import it on the next preview. The old v0.6.1 webpage did not have a built-in export menu.

### Start and verify

Open `dist/index.html` or `Feedfall-Rush-Hour-v0.7.1-Play-Now.html` (standalone offline HTML). For regression tests:

```sh
python3 scripts/bundle.py
for test in tests/*.test.mjs; do case "$test" in *browser_debug*) continue;; esac; node "$test"; done
```

`tests/browser_debug_v071.mjs` is a browser smoke test, but this workspace's local Chromium is blocked by an OS socket restriction. The published preview was exercised separately in a cloud browser. See `QA_V071.md`.

`DESTINY_DGG_LORE_RESEARCH_V071.md` contains a sourced **74-seed research snapshot** for later editorial integration; those seeds are **not** new in-game v0.7.1 cases.

---

## New IRL event world (v0.7)

Version 0.7 adds **Off the Feed → Destiny: Meet & Greet**, accessible from the Destiny tab under **Enter Creator Network**, with no campaign prerequisite. It is a first playable elevated-camera living-event simulation, not a completed large-world expansion. The 20-attendee event runs across Doors Open, Signing Line and Final Q&A. Arrivals and background audience continue moving as the player selects attendees and dispatches a greeter, steward, verifier, or venue security staff member. Staff visibly travel to guests before a decision resolves.

- **Welcome (1):** greet ordinary visitors; **Verify (2):** gather additional context or clear ambiguous passes; **Redirect (3):** handle queue/venue disruptions; **Security (4):** summon trained staff for actionable safety concerns. Security has three temporarily occupied personnel. False security responses cost crowd trust. Explicit threats and verified venue warnings are fabricated and are not attributed to real individuals.
- **Pause (P / Space):** manually pause the new event to reduce cognitive load. Selecting any guest from the scene is optional; an active attendee is automatically highlighted.
- **Results:** score, Crowd Vibe, accuracy and up to three event stars, plus earned credits and Destiny creator XP. The event has its own repeatable local record, and its scenario selection rotates between runs.
- Pixel art is authored as low-resolution PNG scene and 13-character four-frame sprite strip. It is rendered as bitmaps with nearest-neighbor scaling. No AI video diffusion, generated video loops, or vector characters.
- The source includes **45+ original IRL guest scenarios**, most centered on politics, debates, source-checking, community jokes, fan requests and hypothetical streamer drama. Real-world disagreements are not threat markers.
- Updated Destiny's optional channel description and v0.7 fictional chat pack to focus more on politics, debates, community culture and drama; gaming is now occasional heritage content.

The prior v0.6.1 remains unchanged and independently playable. This folder is a **separate derivative** with save key `feedfall:rush-hour:off-the-feed:v07` (schema 8); existing v0.6.1 progress migrates on the same website origin without overwriting the older save key.

### Start

Open `dist/index.html` or `Feedfall-Rush-Hour-v0.7-Play-Now.html` (single-file offline). Enter Creator Network → Destiny → **Enter IRL Event**.

### Verify

```sh
python3 scripts/make_irl_art.py
python3 scripts/bundle.py
node tests/irl_v07.test.mjs
for test in tests/*.test.mjs; do node "$test"; done
```

See `QA_V07.md`, `CHANGELOG_V07.md` and `PLAYTEST_FEEDBACK.md` for current scope and open issues.

---

## Historical v0.6.1 reference (unchanged original systems)

This is a playable, offline-capable arcade game built on v0.6. It retains all four existing campaign worlds, 19 levels, Daily Event Circuit, progression, equipment, Live Arena Recovery Protocol, and Creator Network. Version 0.6.1 focuses on a **distinct gameplay rhythm, writing style, audiovisual identity, and reward loop for each creator**.

## Play

- Open `dist/index.html` or the self-contained `Feedfall-Rush-Hour-v0.6.1-Play-Now.html` in your browser. It includes music, art, and logic without external network requests or an API key.
- On the home screen, enter Creator Network. The first chapter for each of the three creators is unlocked early. Further chapters require creator experience and the relevant world unlocks.
- Three standard moderation controls remain **Approve (1/A), Flag (2/F), Remove (3/D)**. On phones, use the persistent action bar. Q triggers Focus Pulse; Space triggers Freeze in Live Arena.

## Three signatures

**Destiny (unofficial fictional portrayal): Debate Clash and Emote Train**
- Creator-first curated topics: hot choccy/hot chalky, StarCraft and gaming references, source requests, debate reactions, PEPE/YEE textual emote references, snarker debates and hypothetical community disputes.
- Debate Clash pairs two contextual messages; correctly moderating both rewards extra points. Criticism, sarcasm, and ordinary negative opinions are **not violations** on their own. Genuine threats, doxxing and coordinated harassment remain actionable.
- In Destiny's *Debate Night* arena chapter, after several correct moderation calls, an Emote Train minigame starts. Regular moderation and message deadlines freeze during this short challenge. **Merge Match (J / 1)** extends a same-emote combo; **Route Aside (K / 2)** routes a different message away without banning its author. Wrong routing breaks only the train combo. Escalating milestones at ×25, ×50, ×100 award score and original synthesized fanfare. Textual PEPE/YEE references and native emoji are not copies of licensed emote graphics.
- This is a fabricated simulated game universe. It makes **no claims** that a quoted game message came from Destiny or from a real chatter. No endorsement or participation is implied.

**Nova Vale (original fictional character): Community Momentum**
- Warm, creator-specific original chat: art walls, cozy games, crafts, tea, community jokes, real/fake giveaway distinctions, welcoming comments and event announcements.
- Correct moderation increases the Momentum meter (especially approving harmless conversation); wrong decisions reduce it. At 100%, a **Community Celebration** awards bonus score, a little time and a unique melody. The meter is not a popularity meter for aggressive removals.

**Glitch Arcade (original fictional character): Tournament Rush**
- Esports/retro gaming content, round-specific brackets, good-faith banter, fake merchandise and verified-match discussions.
- Three rounds with increasing tempo and short clock-freezing transitions. Accurate decision streaks during the final round activate a **Match Clutch** bonus, audiovisual flourish, and new match-point music.

## Replayability and quality

- Creator-first curated content now replaces ordinary generic shift copy, preserving preassigned policy verdicts and verified market/thread group identifiers.
- Each completed creator shift advances the channel's content edition; subsequent plays rotate through different authored posts while maintaining the same game rules and difficulty structure. This is a finite authored library, not infinite generated chat.
- Creator-specific CRT skins, color schemes, background music, contextual tags, milestone sounds, transitions, result summaries and mobile readability.
- All regular campaign levels remain untouched mechanically. The game is playable offline without Polecat access or third-party APIs. This release **does not ingest or redistribute Polecat chat logs**. An eventual source-based research pipeline remains separate, pending access and reuse review.

## Future concept: Meet & Greet

The pixel-art meet-and-greet idea is **not part of v0.6.1**. Possible future design: fictional attendee line, creator at a panel, safe fan interactions, hecklers, escalation and security responses. Strong criticism/heckling is not automatically a removable violation; genuine violence risks would need distinct rules. We should design it in a later discussion rather than rush it into this release.

## Save migration

v0.6.1 uses a new browser save key `feedfall:rush-hour:creator-identity:v061` with schema version 7. On the same website origin it reads older v0.6, v0.5, v0.4 and previous save keys, preserving credits, campaign stars, upgrades, creator XP, creator event records, and Daily Circuit progress. Older save keys remain unchanged. New content rotations begin with each creator's already-completed run count.

## Build and test

```sh
python3 scripts/bundle.py
node tests/engine_v04_compat_v06.test.mjs
node tests/engine_v05_v06.test.mjs
node tests/event_v04_compat_v06.test.mjs
node tests/engine_v06.test.mjs
node tests/full_creator_v06.test.mjs
node tests/identity_v061.test.mjs
python3 tests/browser_v061.py
```

Chromium UI tests emulate phones but are not equivalent to physical iPhone Safari audio/haptics testing. There is no logging, telemetry, payment system, or external provider integration.
