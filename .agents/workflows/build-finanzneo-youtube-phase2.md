# FinanzNeo YouTube — Phase 2 Fast Path

Use this workflow only when the user wants to prepare or open Phase 2 for an existing YouTube Longform project.

## Goal

Phase 2 is a lightweight asset handoff. Do **not** analyze or rebuild the Phase-1 motion tree.

For a project at `youtube/<Projekt>` read only:

1. `youtube/<Projekt>/PHASE-2-START-HERE.md`
2. `youtube/<Projekt>/04-visuals/alle-bildprompts.txt`
3. `youtube/<Projekt>/04-visuals/00-ALLE-BILDER-HIER-REIN/README.md`
4. `youtube/<Projekt>/03-audio/README.md`
5. `youtube/<Projekt>/03-audio/word-timings.json` only when timings already exist or must be updated from final audio

## Hard scope limit during Phase 2

Unless the user explicitly asks to inspect or change Phase 1, do **not** recursively read, index, summarize or edit:

- `youtube/<Projekt>/04-visuals/EINZELNE-VISUALS/`
- any `animation.tsx`
- any `remotion.md`
- `06-projektdateien/visual-plan.md`
- `06-projektdateien/remotion-plan.md`
- source code under `src/`
- reel projects

Those files belong to Phase 1/3 and are intentionally left untouched during Phase 2.

## Phase 2 actions

- Show/open the image inbox: `youtube/<Projekt>/04-visuals/00-ALLE-BILDER-HIER-REIN/`
- Use only `04-visuals/alle-bildprompts.txt` for Google Flow image generation.
- Generate images strictly one at a time, using the exact requested file names.
- Put final images in the common image inbox only.
- Put exactly one final voiceover in `youtube/<Projekt>/03-audio/`.
- Generate/update `03-audio/word-timings.json` only from that final voiceover.

## Forbidden in Phase 2

- Do not regenerate Motion code.
- Do not touch or reseal Phase-1 animations.
- Do not run full-repository analysis just to open the Phase-2 folders.
- Do not run `npm install`, `npm run validate`, Remotion bundle, render, or smoke tests merely to enter Phase 2.
- Do not create placeholder images or replacement voiceovers.

## When Phase 2 is complete

Only then hand off to Phase 3 with:

```bash
npm run youtube:ready -- youtube/<Projekt>
```

If readiness fails, report the exact missing Phase-2 assets. Do not inspect or rewrite the complete motion tree unless the blocker explicitly points there.
