# FeedFall: Rush Hour

Browser game with an isolated Destiny convention sandbox and an experimental v0.8.9 Rival Invasions arena.

**For every new development session: read [HANDOFF.md](HANDOFF.md) first.** Read [AGENTS.md](AGENTS.md) for the repository's strict context/token budget. The active v0.8.9 feature specification is [RIVAL_INVASIONS_V089.md](RIVAL_INVASIONS_V089.md).

## Entry points
- `/index.html`: full game.
- `/irl-sandbox.html` (Vercel route `/irl-sandbox`): v0.8.8 venue testing.
- `/rival-lab.html`: isolated v0.8.9 battle prototype; NOT integrated with hall.

## Run locally
```sh
python3 -m http.server 8080
# open http://localhost:8080/rival-lab.html or /irl-sandbox.html
node --test tests/rival_invasions_v089.test.mjs tests/venue_v088v.test.mjs
```

## Branch/release policy
Accepted v0.8.8v source: `feature/v088v-sprite-tv-polish`. Experimental `feature/v089-rival-invasion-lab` is separate and unmerged. `chore/context-hygiene-v089` is a non-deployed cleanup candidate. Do not assume the default branch is the current accepted release.

Historic handoffs and changelogs are retained in pre-hygiene Git commits; they are deliberately not present as active root documentation on this branch. Keep sources, artwork, and regression tests.
