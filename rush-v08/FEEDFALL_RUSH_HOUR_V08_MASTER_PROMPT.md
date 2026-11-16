# MASTER PROMPT — Resume FeedFall: Rush Hour v0.8 from Recovered WIP

Copy everything below into a **new ChatGPT development conversation**. Attach these two files to that conversation:

1. `Feedfall-Rush-Hour-v0.8-WIP-Recovery.zip` — **essential recovered source + actual v0.8 artwork**.
2. `FEEDFALL_RUSH_HOUR_V08_HANDOFF.md` — complete project vision, technical architecture, gameplay history, bug reports, test findings and next steps.

If a file attachment is unavailable, ask for it; **do not re-create the v0.8 assets or start from the v0.6.1 archive**.

---

## START OF PROMPT

You are taking over as the lead developer and design collaborator for my ongoing HTML5/browser game **FeedFall: Rush Hour**, currently developing **v0.8: Off the Feed — Living Event Simulator**. My name is Michael. This game has evolved through many tested prototypes; please do not reset its direction, forget proven player preferences or start v0.8 from scratch.

**First task:** Thoroughly read the attached `FEEDFALL_RUSH_HOUR_V08_HANDOFF.md` and inspect the complete attached `Feedfall-Rush-Hour-v0.8-WIP-Recovery.zip`. The ZIP contains the **actual partially finished v0.8 project**, not just older documentation. The previous ChatGPT session hit its context limit halfway through development, but the work was recovered and preserved, including a high-fidelity convention-floor illustration, a 12-character pixel-art atlas, their WebP runtime assets, v0.8 IRL logic/UI styles, an Open Feed overflow-focus bug repair, automated tests, and a regenerated standalone browser HTML. **Do not discard these assets, regress to 0.7.1, or claim the WIP is released.**

### Game and audience

FeedFall: Rush Hour is a fast, visually rewarding, replayable arcade game about fictional Trust & Safety moderation and connected creator ecosystems. The proven loop is *recognize a short situation → take an intuitive action → get immediate, satisfying audiovisual feedback → improve efficiency, earn stars/credits/XP, upgrade and replay*. I primarily test on **iPhone Safari**, so every development build must have a **real HTTPS browser link that launches directly on my phone**, along with downloadable archive/source copies when appropriate.

The history matters: slow investigation, citations, long text panels, excessive policies and many actions were boring. Open Feed and Live Arena became fun because they were fast, legible and challenging. Market Watch, Thread Frontier and Creator Network added meaningful variation. Destiny, Nova Vale and Glitch Arcade have different mechanics, voices, audiovisual identities and XP/upgrade progression. v0.7 added a high-angle IRL meet-and-greet but **failed the gameplay test**: the venue was just decoration while the player read a bottom case card and pressed answers, basically Open Feed again. v0.8 must solve this at the mechanical level, not merely repaint the background.

### Non-negotiable v0.8 direction

**The venue is the interface.** Build a living, high-angle, pixel-art convention center with Destiny on stage, event staff, distinct visitors, booths, merch, meet-and-greet, barriers, microphone, queues, animated crowd life and local consequences. Guest dialogue is displayed **above the specific person in the room**, never in a separate main ticket card. Only one actionable bubble should be fully readable at a time; a glowing ring and countdown identify the stable focus. Two or so quieter waiting markers may appear. The focused person cannot be swapped mid-read. Optional tapping another guest is fine but must never be required at arcade pace.

Four event actions:

- **Welcome** a normal fan/peaceful critic; a greeter visually receives them.
- **Verify** an unclear pass or booking; a staff member walks over and checks it.
- **Redirect** a nonthreatening line-cutter, heckler or misplaced visitor; staff visibly guide them.
- **Security** for a credible, behavior-based immediate threat, handled protectively by professional guards—not merely because somebody dislikes the creator, has an unpopular viewpoint or looks suspicious.

Keep the action strip simple and thumb-friendly. Commands require immediate positive/negative feedback plus the tangible staff/guest resolution **in the scene**. Preserve fair response windows, recoverable mistakes, seeded authored event decks, crowd trust/stars/credits/creator XP, upgrade/replay interest and distinct three-phase crowd pacing. Do not force me to read multiple bubbles or manage hidden queues like the frustrating early Live Arena. Defer the close-up meet-and-greet queue/personal assistant viewpoint to a future mode.

### Creator identity and content quality

Destiny/Steven Bonnell II is a real public streamer appearing only in a clearly **unofficial, fictional game portrayal**. Make his community feel authentic through DGG emote culture, debate/source requests, politics/research, streamer media drama, community lore, platforms, podcasts and fan meet-and-greet behavior. Gaming references are a minor historical thread, not the primary topic. The attached research file `DESTINY_DGG_LORE_RESEARCH_V071.md` includes 74 sourced creative seeds that are **not all in-game yet**. Polecat is a potential historical research source; no live chat API or real-person allegations are needed. Never mistake ordinary disagreement, snarking or criticism for actionable violence. Nova Vale and Glitch Arcade must remain distinctive fictional creators and their existing modes intact.

### Current recovered technical state (important)

- Latest stable published code: **v0.7.1**. It includes a dev Test Menu for unlocking all 19 campaign levels and all nine Creator Network chapters **without automatically buying upgrades**, optional test credits, and save export/import across preview hostnames. Preserve this.
- Partially implemented v0.8 files to inspect: `src/irl-v07.js` (historical filename), `src/ui.js`, `src/style.css`, `src/engine.js`, `assets/irl-hall.png`, `assets/irl-cast.png` and optimized `.webp` versions. The v0.8 venue dialogue/staff movement is already present in code.
- The Open Feed level-5 `message already expired, no penalty` deadlock after overflow was traced to stale focus after evicting a selected card. The repaired engine and regression suite `tests/overflow_focus_v08.test.mjs` are included. Explicitly stale touched targets must be rejected, not applied to a different post.
- `tests/irl_v08.test.mjs` verifies stable attention and physical staff dispatch. **All eleven Node suites passed (7,890 reported assertions)** during recovery; a standalone HTML bundle was regenerated. A local Chromium smoke attempt was **blocked by OS `socket() failed: Operation not permitted`**, so mobile/desktop visual QA is still outstanding.
- **WIP gaps:** HTML metadata still labels v0.7.1; new art atlas has **single static poses**, not animation loops; Attention Director is only partly realized; staff contention/fair queued lifetime need hardening; only one 20-guest IRL event exists; special IRL levels/upgrades, venue-specific soundscape, true crowd interactions and mobile polish are unfinished. The build is *not* an approved v0.8 release.

### Your assignment, in order

1. **Recover and inventory** the attached source and art, preserving the ZIP as a checkpoint. Read the handoff and the included `OFF_THE_FEED_V08_DESIGN_PROPOSAL.md`. Compare intentions with actual code; identify completed, partial and missing items.
2. **Run tests** on an extracted copy: `python3 scripts/bundle.py` and all `tests/*.test.mjs`. Review the browser test script; correct its working-directory expectation if necessary. Perform real mobile and desktop browser smoke tests in an environment that permits Chromium. Do not report tests as passed if the browser could not launch.
3. **Complete the v0.8 vertical slice** with the venue as the dominant interactive surface, one stable in-world focus bubble, intuitive four-action staff dispatch, readable in-scene outcomes and genuine animated crowd/character behavior. Fix responsiveness/overlap and guard/staff pressure. Add replayable spatially different interactions without bringing back the detached text-review panel.
4. Preserve existing four campaign worlds, Creator Network, stars, masteries, upgrades, music/SFX, save migrations and Test Menu. Test Open Feed level 5 overflow repeatedly in browser. Carefully guard against Live Arena selected-message swaps and cascading lockouts.
5. Refine the new art and integrate it thoughtfully. Keep the recovered hall/cast masters as the source of truth. Avoid vector stand-ins and video-diffusion attempts. Add consistent animation frames only if quality and scale hold up.
6. **Package and deploy a separate v0.8 development preview** with an instantly playable HTTPS link for iPhone. Also provide standalone HTML, complete source ZIP, concise QA/release notes and clearly identified known limitations. Do not overwrite older releases or imply real-world endorsement.

### Engineering and collaboration standards

- Lead with substantive work and evidence, not flattery or generic planning. When there is uncertainty, distinguish code-verified behavior from design intent and speculation.
- Preserve all existing user/project files and avoid destructive operations. No unnecessary rewrites.
- Mobile responsiveness, perceptible feedback, pacing and player agency determine whether this iteration succeeds—not just test counts or attractive art.
- Keep game decisions fast, fair and legible; difficulty should invite repeated attempts rather than cause helpless loss.
- Prioritize one polished, playable, owner-testable milestone over a bloated list of systems.
- Explain technical caveats honestly, show exactly what was changed, and deliver launchable artifacts at the end.

**Begin by inspecting the attached recovery package. Then continue the interrupted v0.8 development from its current actual code and art. Please don't ask me to repeat the entire game history unless a genuinely blocking decision remains.**

## END OF PROMPT
