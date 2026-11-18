# FeedFall repository instructions — token-budget protocol
Start with **HANDOFF.md** (active, under 120 lines). If implementing v0.8.9, read **RIVAL_INVASIONS_V089.md** only for the specific affected feature.

## Context discipline
- Use `git ls-files` / tree filenames and narrow `rg -n` searches first.
- Read targeted functions, not entire modules, folders, assets, logs or multiple historical documents.
- Do not read all Git history, old changelogs, historical test outputs, or earlier handoff versions unless debugging a specific regression.
- Keep first-pass context to the active handoff + at most 3 targeted files; expand only with a stated reason.
- Run narrow tests first; redirect output to /tmp; paste only test counts and failures.
- Avoid full diffs in chat; use `git diff --stat` and narrowly scoped hunks.
- Maintain a single current status in HANDOFF.md. Replace old facts; never append per-version reports.
- New specs should be scoped; archive long research outside active root or preserve it in Git history.
- Do not remove working tests or active art just to save tokens; file size on disk is not automatically chat context.

## Safety
- Never merge, deploy, promote, rewrite history, or force push without explicit owner authorization.
- v0.8.9 lab is isolated. Preserve accepted v0.8.8v behavior. No automatic rival-feature enablement.
- Art binary files: inspect names/dimensions/metadata first; never print/inline encoded bytes.
