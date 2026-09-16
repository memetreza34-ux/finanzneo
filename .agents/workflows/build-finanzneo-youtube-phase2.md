# FinanzNeo YouTube — Phase 2 Fast Path

Use this workflow only when the user wants to prepare or open Phase 2 for an existing YouTube Longform project.

## Goal

Phase 2 is a lightweight asset handoff. Do **not** analyze or rebuild the Phase-1 motion tree and do **not** perform external stock/icon sourcing here.

For a project at `youtube/<Woche>/<Thema>` read only:

1. `youtube/<Woche>/<Thema>/PHASE-2-START-HERE.md`
2. `youtube/<Woche>/<Thema>/02-bilder/alle-bildprompts.txt`
3. `youtube/<Woche>/<Thema>/02-bilder/00-ALLE-BILDER-HIER-REIN/README.md`
4. `youtube/<Woche>/<Thema>/01-script/README.md`
5. `youtube/<Woche>/<Thema>/01-script/word-timings.json` only when timings already exist or must be updated from final audio

## Hard scope limit during Phase 2

Unless the user explicitly asks to inspect or change Phase 1, do **not** recursively read, index, summarize or edit:

- `youtube/<Woche>/<Thema>/04-projekt/VISUALS/`
- any `animation.tsx`
- any `remotion.md`
- `04-projekt/visual-plan.md`
- `04-projekt/remotion-plan.md`
- `04-projekt/external-assets-plan.md`
- `04-projekt/external-assets-manifest.json`
- `04-projekt/external-assets/`
- source code under `src/`
- reel projects

External support assets are planned in Phase 1 and sourced/integrated in Phase 3. Keeping them out of Phase 2 prevents unnecessary indexing, downloads and license work during the user media handoff.

## Phase 2 actions

- Show/open the image inbox: `youtube/<Woche>/<Thema>/02-bilder/00-ALLE-BILDER-HIER-REIN/`
- Use only `02-bilder/alle-bildprompts.txt` for Google Flow image generation.
- Generate images strictly one at a time, using the exact requested file names.
- Put final images in the common image inbox only.
- Put exactly one final voiceover in `youtube/<Woche>/<Thema>/01-script/`.
- Generate/update `01-script/word-timings.json` only from that final voiceover.

## Forbidden in Phase 2

- Do not regenerate Motion code.
- Do not touch or reseal Phase-1 animations.
- Do not source/download B-roll, icon libraries or Lottie packs.
- Do not touch the external-assets ledger.
- Do not run full-repository analysis just to open the Phase-2 folders.
- Do not run `npm install`, `npm run validate`, Remotion bundle, render, or smoke tests merely to enter Phase 2.
- Do not create placeholder images or replacement voiceovers.

## When Phase 2 is complete

Only then hand off to Phase 3 with:

```bash
npm run youtube:ready -- youtube/<Woche>/<Thema>
```

If readiness fails, report the exact missing Phase-2 assets. Do not inspect or rewrite the complete motion tree unless the blocker explicitly points there.
