# FEEDFALL: RUSH HOUR — Development Continuity Handoff

**Handoff edition:** 2026-11-13 (Vancouver/PST)  
**Project:** FeedFall: Rush Hour / *Off the Feed*  
**Owner:** Michael  
**Target milestone:** v0.8 — visual-first living convention simulator  
**State:** **RECOVERED WORK IN PROGRESS**, not an approved or published v0.8 release.  
**Critical instruction:** Do not start v0.8 from scratch. The actual partially developed v0.8 source, art and tests were recovered and preserved as `Feedfall-Rush-Hour-v0.8-WIP-Recovery.zip`. Resume from those files.

---

## 1. Executive handoff — read this before writing code

Rush Hour is an iPhone-friendly browser arcade game about fast Trust & Safety decisions in a fictional internet. After repeated, carefully observed playtests, the owner found the fun in **rapid recognition, short action loops, rich platform personality, immediate audiovisual feedback, useful upgrades, and challenging three-star replays**. Heavy citations, investigative panels, excessive decision complexity and visually similar worlds led to boredom.

The four established arcade worlds and Creator Network are valuable; **do not throw them away**. v0.7 introduced a high-angle pixel-art Destiny meet-and-greet venue, but the owner disliked the gameplay because it still displayed an independent text case card below a decorative venue. v0.8 is a **mechanical and visual redesign**: the **venue itself becomes the primary interface**. People visibly move and form situations, one in-world guest bubble becomes the stable actionable focus, staff are dispatched, and consequences play out visibly at the guest's location. Decisions must be readable and enjoyable on mobile without tracking multiple messages manually.

### Verified recovery findings

- Original v0.7.1 is the latest **saved completed playable baseline**. It includes non-destructive tester unlocks, optional credits, export/import of saves and the existing v0.7 IRL prototype. It is not the redesigned v0.8.
- The previously interrupted v0.8 **source directory survived** in another workspace. A complete copy is in the recovery ZIP, including **two new high-fidelity pixel-art image atlases** and their optimized WebP versions, updated `src/irl-v07.js`, `src/ui.js`, `src/style.css`, an Open Feed focus regression repair in `src/engine.js`, v0.8 tests, and a standalone HTML preview.
- The recovered v0.8 logic already displays **world-space dialogue above a focused person**, a visual focus ring/countdown, ambient crowd sprites, staff/guard movement, and local outcome text. The detached `#irl-guest` review card is removed.
- All **11 node-based `*.test.mjs` suites passed** on the recovered source on 2026-11-13: **7,890 assertions** in total by their reported counts, including 491 v0.8 IRL checks and 185 Open Feed focus/overflow checks. These are test assertions, **not owner acceptance or proof of mobile usability**.
- Rebuilding the copied WIP using `python3 scripts/bundle.py` succeeded, producing a **2,753,461-byte** portable HTML build. The previous bundled HTML had preceded the final `src/ui.js` edits, so the recovery build was regenerated from the last source.
- **Browser smoke still pending.** An attempted local Playwright Chromium run failed before page launch with `socket() failed: Operation not permitted`. No visual/mobile pass may be claimed from that attempt.
- No v0.8 public deploy or owner playtest was verified. **Do not describe this as v0.8 released.**

## 2. Source of truth and files

### First choice: recovered v0.8 project

Open `Feedfall-Rush-Hour-v0.8-WIP-Recovery.zip`, then the `rush-v08/` directory. This is a **source + asset checkpoint** from the interrupted milestone. It is not a Git repository and has no commit SHA. Preserve the original archive before editing; work in a copy.

**Key paths relative to `rush-v08/`:**

| File | Purpose / status |
|---|---|
| `index.html` | Modular web entrypoint. **Some document title and description still say v0.7.1**, despite in-game v0.8 branding. Fix during release polish. |
| `src/irl-v07.js` | IRL simulator logic, now evolved toward v0.8; retains historical filename. `IRLEvent`, 45+ fictional scenario rows, deterministic deck, guest focus, staff/security dispatch, three phases, stars and rewards. |
| `src/ui.js` | Overall UI, Creator Network entry, v0.8 venue canvas/dialogue/rendering, input, sound hooks and developer menu. |
| `src/style.css` | All styling, particularly v0.8 `.irl-*` scene styles and mobile rules. |
| `src/engine.js` | Existing game engine, save/debug access, four arcade worlds; now includes focus self-heal on queue eviction. |
| `src/audio.js` | Existing synthesised game music and feedback, reused for v0.8; no separate finished IRL soundtrack yet. |
| `src/generator.js`, `src/content.js`, `src/scenarios-v03.js`, `src/scenarios-v04.js`, `src/scenarios-v05.js` | Existing authored and combinatorial text case generation. |
| `src/creators-v06.js`, `src/creator-identity-v061.js` | Creator Network roster, signatures, content, XP, creator gear. |
| `src/events-v04.js` | Daily Event Circuit/Focus Pulse-related data. |
| `assets/irl-hall.png` | **Recovered new convention venue master**, 1672×941 RGB, ~2.8 MB. SHA-256 `c1cb7e1a4da363d8f80b5c5f1ec31d91696e439fa1b4ad7936f1560d9272c05f`. |
| `assets/irl-cast.png` | **Recovered new 12-character 4×3 pixel-art cast atlas**, 1448×1086 RGBA, ~1.5 MB. SHA-256 `8f337120d35c1434638099c5981771bf437485bcf2cd5118a9682885788b3af1`. |
| `assets/irl-hall.webp`, `assets/irl-cast.webp` | Optimized runtime versions embedded in standalone HTML. **Keep PNG masters as source artwork**. |
| `assets/irl-people.png` | Legacy v0.7 low-fidelity sprite strip; retained for reference, **not the new primary art**. |
| `assets/hero-art.webp`, `assets/avatars/{0..17}.webp` | Existing front-end and creator/avatar assets. |
| `scripts/bundle.py` | Bundles HTML/CSS/scripts and embeds WebP images into portable `dist/index.html` and `Feedfall-Rush-Hour-v0.8-Play-Now.html`. |
| `tests/irl_v08.test.mjs` | v0.8 attention stability, staff dispatch and no detached text panel. |
| `tests/overflow_focus_v08.test.mjs` | Open Feed level 5 overflow/stale-focus regression and Live Arena stale-ID protection. |
| `tests/browser_irl_v08.mjs` | Intended 390×844 phone and 1280×800 desktop Chromium smoke; **not yet executed successfully** in the available restricted runtime. |
| `tests/*.test.mjs` | Prior engine, creator, save, IRL, event and compatibility regression suite. |
| `OFF_THE_FEED_V08_DESIGN_PROPOSAL.md` | Owner-approved complete gameplay direction; **authoritative for intended design** over accidental limitations in WIP. |
| `DESTINY_DGG_LORE_RESEARCH_V071.md` | DGG/Destiny creative references and 74 editorial seeds; **research only**; not integrated into the game as 74 new scenarios. |
| `README.md`, `PLAYTEST_FEEDBACK.md`, `QA_V07.md`, `QA_V071.md` | Historical explanation and QA; README begins with v0.7.1 and has **not yet been revised to describe completed v0.8 work**. |
| `dist/index.html`, `Feedfall-Rush-Hour-v0.8-Play-Now.html` | Rebuilt matching standalones inside the recovery ZIP; **preview artifacts, not a deployed approved release**. |

**Fallback only if v0.8 recovery ZIP is unavailable:** `Feedfall-Rush-Hour-v0.7.1-Source-Project.zip` is the last saved stable baseline. Do **not** accidentally fall back to v0.6.1 just because its file metadata appeared in earlier chats. Reapply v0.8 changes from the handoff and restore the recovered art if necessary.

### Existing saved reference files

- [v0.7.1 source project](https://chatgpt.com/library?file_id=libfile_240135545eec8191a81bec2ebbff2f59&account_id=personal)
- [v0.7.1 standalone HTML](https://chatgpt.com/library?file_id=libfile_df8f18291f7c8191b1b9e9cab79ae33f&account_id=personal)
- [v0.7.1 QA](https://chatgpt.com/library?file_id=libfile_16b2d424128481918f18ce3bf4d4f506&account_id=personal)
- [approved v0.8 design proposal](https://chatgpt.com/library?file_id=libfile_db57b3c26df48191b53982e64585eda6&account_id=personal)
- [Destiny/DGG research](https://chatgpt.com/library?file_id=libfile_da95c783d4688191af891f90f3a874bc&account_id=personal)

### Previous browser preview

v0.7.1 tester-access preview was reported ready at `https://feedfall-rush-hour-dh5ghkeoo-michaelquach604-8018.vercel.app/`. This **is not a v0.8 preview**. Owner needs a new real browser link for the next v0.8 playtest; simply handing over an offline HTML file is insufficient.

## 3. Vision: what makes this project worth continuing

The owner's favorite modern reference is *Airplane Chefs*, **not** because Rush Hour should imitate cooking, but because it nails readable timed demands, quick intuitive responses, escalating waves, satisfying animation and sound, credible upgrades, and the urge to retry with stronger equipment. The user has past RTS/MOBA experience but explicitly warns against treating those genres as a design requirement.

**Owner-proven outcomes across playtests:**

1. Original citation-heavy CleanSlate OS / FeedFall: investigation and multi-action menus required too much reading and thinking; interest often died in 5–10 minutes. Increasing graphics alone was not enough.
2. A simple Gemini prototype of rapid text-post moderation was fun: one clear item, rapid approve/flag/remove, CRT feedback and a timer. The concern was content repetition.
3. Rush Hour v0.1 generated 10–15 minutes of fun; v0.2 with more varied platforms, arena pacing, upgrades and audio generated ~30–40 minutes; later v0.4–v0.6.1 encouraged even longer sessions, often an hour or more. Three-star replays and utility equipment genuinely mattered.
4. The user enjoys **novel worlds with distinct mechanics**, not the same post feed recolored or relabeled. Open Feed, Live Arena, Market Watch and Thread Frontier have different pressure curves; the v0.6 Creator Network initially did not, so v0.6.1 added creator-specific signatures and personalities.
5. Repetition remains a long-term risk. Curated scenario diversity, physical behaviors, platform identity, situational consequences and structural differences matter more than endlessly swapping single keywords in a template.
6. Difficulty should be skillful and recoverable. Sudden unreadable target swaps, UI churn and cascading overflow that cannot be counterplayed feel unfair. The player rarely remembers to activate optional freeze/power-ups mid-rush.
7. Aesthetics and audio are inseparable from the mechanics. Cheap placeholder vectors or static sprites diminish motivation. The new v0.8 background/cast are visually richer **but still require integration and functional animation QA**, not just a gallery preview.
8. Browser deployment with **touch-first iPhone Safari support** is a deliverable requirement, not a nice-to-have. Past download-and-open-index flows were a pain.

## 4. Game evolution / progression inventory

| Version | Functionality / lessons |
|---|---|
| CleanSlate / original FeedFall | Bureaucratic trust-and-safety ticket review, citations, investigation, additional moderation options, optional CCTV/3D systems; visuals ambitious but gameplay too slow. **Do not rebuild these burdens in Rush Hour**. |
| Rush Hour v0.1 | Fast post feed, three simple actions, star challenge, novelty from recognizable platform formats. |
| v0.2 | Stronger pace, sound/music ambition, Live Arena viewers/spikes, upgrades and world gameplay; frustrating replacement of selected chat and hard three-star runs exposed fairness bugs. |
| v0.2.1 + v0.3 | Fair Play target stability and Auto-Mod excluding selected task; richer scenario-first content, emojis/hashtags and platform voice; Market Watch commerce world and mastery/replay goals. |
| v0.4 | Daily Event Circuit/Focus Pulse and other replay variety, more complex rush pacing; earned sustained repeat interest but exposed concentration fatigue. |
| v0.5 | Thread Frontier, Live Arena Recovery Protocol and more content/progression; ongoing concern about cascades and unused power-ups. |
| v0.6 | Creator Network with three creators: real-life streamer **Destiny / Steven Bonnell II** in an **unofficial fictionalized** setting; original creators Nova Vale and Glitch Arcade. Nine creator chapters, creator XP/gear. Initial personalities too similar. |
| v0.6.1 | Identity upgrade: Destiny Debate Clash/Emote Train; Nova Community Momentum; Glitch Tournament Rush; creator-specific wording, themes, audio and rotations. Owner enjoyed it, but requests far deeper DGG lore over time. |
| v0.7 | First `Off the Feed` elevated-camera IRL Destiny meet-and-greet with moving guests/staff and four commands; **owner rejected gameplay composition**: still reads a separate bottom text prompt, scene felt decorative; sprites generic and concert venue unconvincing. |
| v0.7.1 | **Released tester-access patch**: debug unlocks, no free upgrades, optional credits, local save export/import. Visual IRL loop intentionally unchanged pending approved redesign. |
| **v0.8 WIP** | **Recovered and partially implemented** visual-first IRL convention: new rich hall/cast assets, world dialogue, focus ring, automatic target, moving dispatch, in-world reactions, Open Feed stale-focus repair. Tests green; mobile/browser visual QA and deployment not complete. |

### Existing campaigns, creator systems and persistence

- Four standard campaign worlds with **19 total levels**: Open Feed (5), Live Arena (5), Market Watch (4), Thread Frontier (5).
- Creator Network has **three creators × three chapters = nine creator operations**, with creator XP, creator gear and theme-specific modes.
- Challenge loop: earn stars, credits, mastery/event rewards, buy utility upgrades **per world** and optionally universal operator upgrades, replay for better scores.
- Main traditional moderation: **Approve (1/A), Flag (2/F), Remove (3/D)**, with short explanations and consistent correct/incorrect sound signals.
- v0.7+ Destiny IRL event entry is under **Enter Creator Network → Destiny → Enter IRL Event**, despite `WORLD 05` in its header; do not assume a full fifth main-map progression campaign exists yet.
- v0.7.1 **⚙ TEST MENU**: unlock each world's next level or all 19, unlock all Creator Network chapters, revoke dev access, optional +1,000 credits, export/import JSON. This is for testing without regrinding; **never auto-grant paid upgrades or earned three-star records**.
- Save source: v0.7.1 uses localStorage `feedfall:rush-hour:off-the-feed:v07` (schema 8); developer access is separate key `feedfall:rush-hour:developer-access`. It migrates earlier same-origin saves; old keys remain untouched. Distinct deployment hostnames **do not share localStorage**. Preserve save import/export and validate migrations.

## 5. v0.8 Owner-approved mechanical design — the venue is the interface

**Perspective:** high-angle/bird's-eye pixel-art living convention. The player is the venue floor/security coordinator, **not** a close-up personal assistant or queue screen. The close-up interactive queue idea is deliberately **deferred** for a later world or creator event.

**Composition:** about 75–85% of playable viewport should visually belong to the convention scene. The stage, Destiny, signing desk, merchandise booth, entrance/check-in, mic, staff, fans, hecklers and ambient foot traffic must make it obviously a living venue. An action bar may sit at the edge, but **the case text belongs beside its character in the scene**. No card below the hall that the player must read instead of watching the venue.

**Attention Director:** dozens of ambient people can coexist but **only one readable actionable guest at a time**. Up to two non-distracting `…` indicators may wait. One focus halo, arrow and readable bubble identifies who needs action and how long remains. The primary guest **must never swap while being read** unless the player resolves or it visibly expires. Optional tapping another guest is advanced control, never required for high-speed play. Queued events require fair reserve time and anti-starvation, not off-screen invisible penalties.

**Four contextual commands (different from global moderation actions):**

| Command | Typical in-world event | Visible result |
|---|---|---|
| **Welcome** | Ordinary fan, peaceful critic, merch collector, harmless emote joke | Greeter acknowledges and routes them to greeting/photo/merch; cheerful response. |
| **Verify** | Conflicting credentials, uncertain badge, unexplained access | Staff member checks the pass/manifest; clear verification feedback at character. |
| **Redirect** | Line cutter, disruptive heckler, blocked accessibility aisle, wrong queue | Steward escorts person to correct location, crowd resumes. |
| **Security** | Concrete behavior-based, credible and corroborated immediate safety threat | Trained security protects people/intervenes; appropriate resource/cooldown and escalation. |

**Ethical gameplay rule:** unpopular opinions, disagreement with Destiny, snarking, an anti-fan shirt, criticism or political ideology are **not** proof of danger. Heckling can justify Redirection, not automatic Security. No playable threat is attributed to any real person or actual event. The portrayal is fan-made, fictional and not endorsed by Destiny. Avoid stereotyping by clothing, identity, appearance, or political affiliation.

**Authored event deck rather than procedural chaos:** each level seeds an ordered count of 18/24/30/36 purposeful beats, with controlled safe/ambiguous/disruptive/high-severity mixes, and independently moving ambient crowds. Phases: doors open → peak crowd/signing line → final Q&A/closing. Replay variations should change **spatial resolution, guest intention, location, queue state and response animation**, not just names/adjectives.

**Scoring:** quick response acknowledgement plus visible walking/resolution; crowd trust/vibe, event safety, throughput, score/stars and credits/creator XP. Ordinary mistakes affect stars/trust; avoid unwinnable chain reactions. Two mistakes may trigger a readable recovery window. Truly credible unresolved serious threats can close the event only with fair warning and opportunity to respond. Don't make the player remember a tiny emergency power-up.

**Art target:** high-quality cohesive pixel art, illustrated convention hall, stage screens/truss, multiple booths, check-in, useful routes and identifiable event staff. At least 10–12 genuinely varied human silhouettes with idle/walk/express/react motion eventually. New v0.8 atlas is a **static pose sheet**; don't confuse it with a complete multi-frame animation library. Event must feel alive through motion/state and staff paths as fidelity improves.

## 6. Exactly what was implemented before interruption

This section describes observed recovered code, not promises:

1. `assets/irl-hall.png`: richly decorated purple/cyan convention venue with check-in at bottom, merchandise/food booths left, talk stage with lights and microphones upper-right, barriers and photo backdrop. The actual new art survived; use it.
2. `assets/irl-cast.png`: 12 distinct standing figures in a transparent 4×3 atlas including a dark-haired bearded headset-wearing **host silhouette**, photographer/fan archetypes, staff with badge, professional suited security, reporter and varied visitors. Cast WebP preserves alpha; runtime crops one atlas cell per character.
3. `src/ui.js`: in-scene `#irl-world-speech` contains guest name, one-line quote, cue and countdown; positioned relative to the focused guest's canvas coordinates. The previous separate `#irl-guest` case card is absent. Focus ring/timer, waiting marks, staff/security sprites and animated local verdict flashes are drawn on 384×216 canvas. Non-task ambient attendees move across the floor.
4. `src/irl-v07.js` (historical filename retained): `IRLEvent` maintains guests, one stable `focus`, deterministic 20-beat scenario deck, timed arrival, guest movement, two non-security stewards and three security personnel, worker-to-guest assignments, visible resolution, departures, crowd vibe, three phases, XP/credits/stars and persistent results.
5. `src/engine.js`: Open Feed `spawn()` now repairs focus after a full-buffer eviction. `target()` also repairs a corrupt stale internal focus on action. An explicit stale mouse target is **rejected rather than misapplied to a different post**. This directly addresses the owner's reproducible Open Feed level-5 bug: `message already expired, no penalty` endlessly while the timer runs.
6. `tests/irl_v08.test.mjs`: 80 seeded focus-stability runs, action dispatch and in-world UI checks, **491 assertions passed**.
7. `tests/overflow_focus_v08.test.mjs`: 30 peak Open Feed level-5 overflow seeds and stale-action protections, **185 assertions passed**.
8. Rebuilt portable HTML from current files. The game header shows v0.8 DEV, but **HTML `<title>` and OG/description still claim v0.7.1**; correct before formal preview.

**Important implementation-versus-spec gaps:**

- Current `focus` is a simple first-available guest pointer, **not** the proposed full priority/age anti-starvation Attention Director. Arrival cap is four tracked actionable visitors plus ambient walkers. Pending guests age while off-focus and can leave, so fair queued lifetime reserve still needs design/testing.
- The new atlas holds only **single static poses**. NPCs move as placed sprites with tiny host bobbing; proper direction/walk/react frames, walking destinations and spatial interactions remain future work.
- `IRLEvent` has 20 beats and one event loop, not 5–7 complete progressively differentiated IRL levels, purpose-built IRL upgrades, or authored multi-phase spatial objectives.
- More deliberate logic for staff contention, guard cooldown selection, warnings and support for several pending actions needs edge-case tests. In particular inspect `available`/`guardPositions.task` consistency under rapid Security dispatch.
- The speech overlay may obscure adjacent people on a narrow phone. Test its anchoring, overlap, clipping and touch behavior on actual iPhone Safari, especially while animated guests move.
- Current `sound.setMode('destiny')` reuses creator music; a true ambient convention/peak-rush mix and distinct staff-action audio should be evaluated later.
- No full visual quality gate or measured runtime FPS on mobile has passed yet. No verified v0.8 production deployment.

## 7. Critical bugs and regression policy

### A. Newly reproduced and repaired in v0.8 WIP — Open Feed lockout

**Symptom (owner):** In Open Feed level 5, after queue overflow/stability impact, every action said `message already expired, no penalty`; clock continued; player could not act and inevitably lost, sometimes with shields remaining. Reproduced repeatedly by owner.

**Cause verified in source:** when a full Open Feed buffer discarded the oldest card, engine focus kept the removed ID; `target(focus)` returned null forever. This was separate from mere pace/difficulty.

**Recovered fix:** after eviction, `spawn()` retargets focus only to a surviving card; `target()` self-heals accidentally stale engine focus. `answer(decision,explicitDeadId)` still safely rejects that old card to prevent a snap-to-wrong-post misjudgment. `overflow_focus_v08.test.mjs` exercises this. **Must smoke-test manually in mobile browser before declaring owner-facing fix done.**

### B. Live Arena ongoing concerns

- Earlier v0.2 selected chat unexpectedly swapped before its timer; Fair Play logic and Auto-Mod exclusion were implemented in v0.3.
- Owner later observed an intermittent overflow/loss without reliable reproduction, high cognitive strain, ignored selection controls and unused Freeze/Focus Pulse abilities.
- Existing Live Arena Recovery Protocol and congestion pacing should remain; **do not rip it out**. Re-test if fixing shared queue logic, include real visible pressure and recovery cues. A selected task must stay stable until decision/explicit expiry.
- A nonselected card can expire or automod; do not punish the player for acting on an already-replaced selected task.

### C. Save / access

- New hostname ≠ same localStorage; no silent save recovery across preview URLs.
- Keep portable JSON export/import and separate DEV unlock state.
- WIP `index.html` metadata needs v0.8 update, but do not rename migration keys casually.
- Every version change requires save migration validation and a no-regression run for the four arcade worlds + nine creator chapters.

## 8. Character identity and content — Destiny / DGG and other creators

**Destiny's playable representation** centers on political debate, media criticism, platform culture, streamer drama, DGG in-jokes, fan relationships and public Q&A. Older StarCraft/League/Minecraft/Terraria/Factorio references are **occasional historical flavor**, not the dominant identity. Generic crypto scam posts and unrelated fake moderator scams make his community feel interchangeable; avoid repeating them across all creator channels. Avoid dozens of duplicates of Hot Choccy.

The saved research `DESTINY_DGG_LORE_RESEARCH_V071.md` documents **74 editorial ideas**, based on categories: politics/research, streamer-media ecology, DGG emotes/memes, platform history, convention fan life, and legal/evidence literacy. Source examples: `polecat.me` chat log index, public Destiny interviews/debate transcripts, official channel material, DGG rules, community emote catalogs. The user wants historical snapshots and recognizable lore, **not live API connections**, and requires relevance rather than superficial name swapping. Do not claim that research ideas were all inserted into gameplay.

Useful community tokens include `YEE`, `PEPE`, `dggL`, `OMEGALUL`, `GODSTINY`, `DuckerZ`, `WOOF`, `PepoThink`, `NODDERS`, `monkaS`, `HmmStiny`; the source pack explains provenance and that historical presence does not prove current popularity. The emote train (v0.6.1) is a signature friendly community event where a different message may be routed aside without punitive moderation.

**Nova Vale:** fictional cozy/art/crafts/positive community and Community Momentum celebration; visually and mechanically different from the confrontational debate/social ecology.

**Glitch Arcade:** fictional esports/retro competitive community and timed Tournament Rush rounds/clutch moments; different audience aesthetic and music.

**Factual caution:** politically charged disputes and personal/legal allegations are complex. Separate documented public events from unverified community rumors. Fictionalize player situations; don't use real chat logs verbatim without rights/reuse review. No implication that Destiny personally authored or endorsed fictional dialogue. Avoid equating harassment with merely disliking a person.

## 9. Recommended next actions — do these in order

### Step 0 — recover source intact

1. Download/extract the accompanying `Feedfall-Rush-Hour-v0.8-WIP-Recovery.zip` and read this handoff and `OFF_THE_FEED_V08_DESIGN_PROPOSAL.md` **before editing**.
2. Check the two new PNG masters and WebPs. Confirm the intended visual cast and convention scene. Don't redraw/discard the recovered art just because v0.7 was rough.
3. Check that `src/ui.js` and `src/irl-v07.js` match the recovered v0.8 code, not the old v0.7.1 source.
4. Preserve the original package as a recovery checkpoint; create a new worktree/copy for next modifications.

### Step 1 — verify WIP and fix immediate integration gaps

Run in the extracted `rush-v08/` directory:

```bash
python3 scripts/bundle.py
for test in tests/*.test.mjs; do node "$test" || exit 1; done
```

Next, run `tests/browser_irl_v08.mjs` with Playwright where Chromium is permitted, or a comparable **real browser** on a deployable preview; source script assumes the working directory is the **parent** of `rush-v08/`. Verify both ~390×844 mobile and desktop, including render, active speech bubble, input, worker path, result and console errors. Fix stale HTML metadata. Confirm no letterboxing/overlap/unclickable action buttons on iPhone.

### Step 2 — finish the actual *gameplay* vertical slice

- Make the attention direction feel intentional: one principal bubble, visible gentle wait indicators, prioritized reserve queue and safe focus lock, optional taps, no surprise swaps.
- Guarantee that clicking each of the four commands shows **instant acknowledgement**, then a staff member moves and the character changes behavior; don't make action feel swallowed if workers are busy.
- Add actual venue route points (signing, merch, check-in, stage mic, exit). The same type of event can now have different **spatial** outcomes.
- Stage phases must look different (arrivals, peak crowd, Q&A/closing). Make context legible **in the venue** with short captions, props, colors and character gestures, not through a large external reading panel.
- Tune clocks and staff contention for mobile; avoid punishment cascades. No one should auto-lose because a focused guest vanished without a fair visible expiry.

### Step 3 — fidelity, personality and sustainability

- Upgrade the 12-sprite static pose atlas toward consistent idle/walk/express/react animation variants, preserving character identity and pixel-grid continuity.
- Add independent non-action crowd conversations, simple merch/signing/queue behavior and clear worker response paths.
- Make the Destiny host recognizable **without pretending a generated sprite is approved likeness**. Keep non-affiliation and fictional-incident notices unobtrusive.
- Convert selected 74-seed DGG lore into authored **gameplay-specific** interactions, with more source/research/politics than gaming. Avoid one-word keyword repetition or allegations presented as facts.
- Add venue-specific ambient music/peak event audio and positive/negative SFX that match resolved success, not the choice label.

### Step 4 — deliver tested development build

- Regenerate single-file HTML, complete phone/desktop browser QA, stress gameplay tests and **actual owner iPhone playtest**.
- Provide a **direct HTTPS browser link that opens without download**, alongside standalone HTML and a source ZIP for archival.
- Keep v0.6.1, v0.7 and v0.7.1 releases untouched; deploy v0.8 to its own preview path/version.
- Preserve save migration/export/import and dev menu unlocks without automatic upgrades.
- Document changes, tests, known risks and open playtest questions. Ask owner to judge *scene attention, fun, staff feedback, mobile readability, novelty* rather than assume visual improvement proves gameplay success.

## 10. v0.8 acceptance gates

- [ ] From an iPhone, owner can enter Creator Network → Destiny → IRL event with dev access and **understand what to do without looking at a separate case panel**.
- [ ] One marked guest remains active during the decision; its sentence and cue are readable without moving eyes away from the venue.
- [ ] The player can make repeated Welcome / Verify / Redirect / Security calls while ambient attendees move, with timely staff animation and unambiguous correct/incorrect feedback.
- [ ] Every command has distinct physical consequences; peaceful criticism never triggers mandatory Security.
- [ ] A three-minute run is understandable and enjoyable. Increasing difficulty introduces real venue activity, not tiny unreadable timers.
- [ ] Art feels cohesive on 390px phone screen; no large unreadable overlay, panel clipping, click-through or bad sprite scaling.
- [ ] Open Feed level-5 queue overflow no longer deadlocks input in an actual browser; explicit stale touch IDs cannot score a different post.
- [ ] Four worlds + nine creator chapters, upgrades, stars, XP, audio, export/import and developer unlocks are not regressed.
- [ ] Browser build is independently deployable with HTTPS, genuinely accessible on phone, and the release label/title match.

## 11. Hard boundaries / working agreement

- **Do not abandon the proven Rush Hour core loop or rewrite the whole game** because v0.7 IRL disappointed the owner.
- **Do not revert to citing policy sources, lengthy case investigations or extra judgment menus** as the main loop.
- Do not make Creator Network essentially the same Open Feed repackaged with names changed; mode-level novelty is essential.
- Do not replace the recovered assets with temporary vector silhouettes; use existing PNG masters/WebPs as the v0.8 art baseline.
- Do not overstate completion. v0.8 is WIP; local engine tests passed but owner visual/phone acceptance and successful browser QA remain open.
- Do not erase saves or debug unlocks; never grant all upgrades automatically.
- Do not silently publish a new public version while only asked to prepare a handoff. The next chat may proceed with development after reading this package.

---

## 12. Handoff checklist for the next assistant

Start by confirming: **(a)** the WIP recovery archive is available, **(b)** both PNG art masters survived, **(c)** last source changes are present, **(d)** 11 node suites are green, **(e)** browser test still requires real browser verification. Then execute the next meaningful v0.8 task **from recovered code**, communicate the plan concisely, and produce another playable mobile HTTPS preview when ready. The owner will provide post-playtest direction. **This handoff preserves unfinished work; it does not claim the milestone is finished.**
