# FeedFall: Rush Hour — v0.8.1 modular source sync

**Checkpoint:** 2026-11-13. This folder is the modular source recovery matching the
user-supplied, base64-stripped v0.8.1 Vercel deployment. The original clean
recovery archive is preserved separately.

## Recovered from the deployed build

- src/irl-v07.js: new convention scenarios, zone-aware arrivals and
  destinations, independently roaming ambient crowds, visible escort paths,
  and FIFO staff/security dispatch orders when workers are busy. Only the
  focused guest's decision timer advances; waiting guests gain priority.
- src/ui.js: rendered roaming crowd and phase atmosphere, live dispatch
  markers, mobile-aware world-space speech placement, danger emphasis, and
  convention-specific music/response audio hooks.
- src/audio.js: convention soundtrack and contextual IRL dispatch cues.
- src/style.css: speech tail/danger states, portrait-phone scene sizing,
  compact mobile header, and sticky touch controls with safe-area padding.
- index.html: restored the absent **modular** HTML entrypoint with the
  v0.8.1 page metadata and external stylesheet/module references.

Existing engine, scenario generators, save migrations and other modules
were unchanged. The recovered deployment comparison is exact for all 12
bundled JavaScript modules and the stylesheet after removing deployment-only
asset placeholders and restoring ES module imports/exports.

## Checks

- All Node regression suites passed, including new v0.8.1 venue/dispatch
  coverage and the existing attention/overflow/save cases.
- A desktop/phone Chromium smoke attempt did not launch in this execution
  environment. **Real-browser visual acceptance remains unverified.**
- No dist/, previews/, embedded base64 media or standalone Play-Now bundle
  is included in this source checkpoint.

## Remaining for v0.8

- Validate on iPhone Safari and desktop browsers, including focus/touch,
  bubble clipping, audio, performance and the Open Feed level-5 lockout.
- Complete directional walk/react animation sheets and venue audiovisual
  polish; current atlas is predominantly single-pose art.
- Expand and balance the IRL event progression, distinct encounters,
  crowd/staff contention, recovery pacing and creator-specific Destiny
  material before a final owner-approved release.

No next-roadmap feature work was started as part of this source sync.
