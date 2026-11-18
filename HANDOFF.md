# FeedFall — ACTIVE HANDOFF (read this first)
Updated: 2026-11-17. Keep this file under 120 lines. Replace outdated status; do not append a changelog.

## Branches and release safety
- Accepted game baseline: `feature/v088v-sprite-tv-polish` at `6afc2c2` (v0.8.8v).
- Isolated rival prototype: `feature/v089-rival-invasion-lab` at `8645558`.
- This documentation-only cleanup candidate: `chore/context-hygiene-v089` (forked from rival lab). **Not merged or deployed**.
- Do not infer that `main` is equivalent to the accepted v0.8.8v baseline. Do not merge/publish without owner approval.

## Current goal
Lead developer integrates the six-rival v0.8.9 invasion/battle prototype **only after visual QA and explicit feature-flag control**. Preserve all v0.8.8v mechanics, venue art, and behavior. The rival lab is NOT connected to the live hall.

## Minimal file map
- `index.html`, `src/`: full game.
- `irl-sandbox.html`, `src/irl-sandbox-v085.js`: isolated hall.
- `rival-lab.html`, `src/rival-lab-v089.js`, `src/rival-lab-v089.css`: isolated rival battle demo.
- `src/rival-invasions-v089.js`: deterministic fight engine + roster.
- `assets/rivals/v089/`: six 4×4 transparent PNG rival atlases and one arena concept.
- `RIVAL_INVASIONS_V089.md`: **single v0.8.9 design / integration spec**.
- `tests/rival_invasions_v089.test.mjs`: lab regression checks.
- `tests/venue_v088v.test.mjs`: latest accepted venue regression checks; keep older tests for regression reference.

## Nonnegotiable design
- Rival physically enters by authorized gate and walks to stage, waits until stage interaction clears.
- Full-screen dramatic VS → dedicated sharp audience-side battle arena → six timed beats (~18s) with player counter buttons and meter special → result → safely restore hall state.
- Friends Foodshops, Dan Saltman and MrMouton argue competitively with boundaries; Hasan encounter is scorched-earth antagonism, no warm reconciliation.
- Fictional satirical exchanges only; do not invent real quotes or assert actual results.
- Keep hall timer/selection/queues immutable during arena; restore once even on errors.
- Preserve sharp sprite cropping, human-scale stage TV, audience movement, sound mute and touch controls.

## Verified at lab commit
- Six sprite PNGs, arena concept, battle engine, standalone demo and spec committed.
- Prior handoff reports **99/99 focused Node tests passing**. This is a historical report, NOT fresh verification on this hygiene branch.
- Browser/iPhone visual QA and hall integration remain **unverified / incomplete**.

## Minimal verification and reporting
1. Inspect `git status --short` and focused diff before any edit.
2. Use scoped tests first: `node --test tests/rival_invasions_v089.test.mjs tests/venue_v088v.test.mjs`.
3. Broader tests only for impacted modules; capture output to a file and report only totals + failures, NOT full passing logs.
4. For UI: browser-check `/rival-lab.html` and `/irl-sandbox.html` at desktop + iPhone sizes before marking visual work accepted.
5. Report only changed files, test summary, blockers, preview URL, commit and branch. Never dump whole files into chat.
6. Update this short status IN PLACE on each milestone; detailed design changes belong in the relevant spec, not here.

## Context hygiene
- Default read budget: `AGENTS.md` + this file + a specifically relevant source/test/spec; inspect filenames/tree metadata before opening content.
- DO NOT recursively read all docs, old changelogs, past chat history, test logs, asset bytes or every test file.
- Historical release notes are available in pre-hygiene Git history / `feature/v089-rival-invasion-lab`; do not restore to active root merely for handoff.
- No base64 art, dist bundles, generated previews or temporary logs in Git.
