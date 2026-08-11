# FinanzNeo — Antigravity Safety Rules

These rules apply only to Google Antigravity in this workspace.

## Authority

Read completely before work:

1. `CLAUDE.md`
2. `reels/PRODUKTIONSSTANDARD.md`
3. `docs/REEL-QUALITY-CONTRACT-V2.md`
4. `docs/BEAT-TO-IMAGE-RULES.md`
5. target Reel files

`CLAUDE.md` is the highest production/style authority. Never weaken validators, tests, design tokens, finance calculations or quality gates just to make a Reel pass.

## Autopilot

When the user says required images and final audio are ready and says `Mach das Reel`, `Erstelle das Reel`, `Mach es fertig` or equivalent:

- run continuously until `PRODUCTION COMPLETE` or a genuine `BLOCKED`
- do not ask `Weiter?` between normal phases
- recoverable validator/TypeScript/layout/timing/render issues must be fixed and rerun automatically

The command does NOT authorize merge, publish, delete, force-push or history rewrite.

## Hard target-Reel user-media boundary

Final user media only from:

```text
<TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
<TARGET-REEL>/02-audio/
```

Never substitute another Reel, archive, Desktop/Downloads, web/stock media, placeholders, previous exports, caches or similarly named outside files.

Before production verify:

- every required image exists with exact expected filename
- exactly one readable final audio exists
- `Bild 00` contains the exact required Google-Flow cover headline

Missing/wrong/unreadable/ambiguous required media →

```text
BLOCKED
Problem: <exact target-Reel path/file/cause>
Action: <exact user action required>
```

Antigravity never generates replacement images.

## V2 visual quality gate

For V17+ Reels:

```text
Target: 60 % native Remotion animation / 40 % Google-Flow images
Final duration: 55–65 % animation / 35–45 % images
```

Rules:

- standard animation count = `round(sceneCount × 0.60)`
- no two image scenes directly consecutive
- static image normally <= 8 seconds
- no long static tail
- dynamic information is animation-first
- every scene needs real `visualRole` + `visualSelectionReason`
- every image scene needs `expectedVisual`

Use Remotion for comparisons, calculations, timelines, growth, money flow, mechanisms, steps and changing cause/effect.

## Mandatory supplied-image QA

Inspect every actual supplied image before integrating it.

Reject if:

- motif does not match the exact spoken beat
- image is unclear/misleading
- random/wrong text appears
- disallowed label appears
- number conflicts with script/research
- contradictory information appears
- image unnecessarily repeats headline + caption information
- cover headline is wrong/missing/clipped/unreadable
- background/person/image-world rules fail

If regeneration is needed → `BLOCKED`. Never hide a bad image with Remotion overlays.

## Canonical Remotion presentation

Image scenes:

- complete vertical 9:16 source spans full 1080×1920
- no inset `VisualStage`
- no intentional crop/focal zoom
- scene 01+ headline + caption overlay the same image
- cover gets no Remotion replacement headline
- only soft continuous readability scrim

Use `src/design-system/FullFrameImage.tsx`.

Native Remotion scenes use one continuous full-canvas background without floor/horizon/studio split.

## Exact audio timing

Only the exact final audio from `02-audio/` may drive timing.

```text
final audio
→ real word start/end timestamps
→ short caption units
→ resolved scene start/end frames
→ animation timing
→ render
```

Never estimate/evenly distribute word timing. Final `word-timings.json` requires `timingStatus: final-audio-aligned`.

Final `timeline.json` must have positive real durations, chronological/gapless starts and no unresolved zero-duration placeholders.

If exact audio alignment cannot be produced → `BLOCKED`.

## Caption safety

At any time show exactly one short caption unit.

For V17+:

```text
max 12 words
max 68 characters
max 2 lines
min 42 px effective font
bottom ≈ 320
left ≈ 72
right ≈ 180
```

A long spoken sentence may be split into sequential meaning/pause units without changing the audio.

Never:

- show two units simultaneously
- let text overflow/clip
- shrink below safe readable size
- fabricate word timing
- use opaque black caption cards

Current spoken word follows exact real start/end timing.

## Non-destructive repository policy

- never work directly on `main`
- never merge unless explicitly instructed
- never force-push or rewrite shared history
- do not delete branches/reels/user assets without explicit authorization
- new topic = new branch + new Reel directory
- existing Reels read-only unless targeted
- do not upgrade dependencies unless requested
- validation failure must be fixed, never bypassed by weakening rules

## Final QA

For V17+ Reels, final completion requires actual full-MP4 QA documented in:

```text
05-projektdateien/final-qa.json
```

It must truthfully confirm:

- full MP4 inspected
- every scene inspected
- image/voice semantic match
- generated text/labels correct
- scene/audio sync correct
- subtitle safe-area passed
- subtitle active-word sync passed
- actual animation duration 55–65 %
- no long static tail
- audio levels passed

Audio target:

```text
Integrated loudness: about -16 LUFS (validator -17 to -15)
True Peak: <= -1 dBTP
```

Never mark QA `passed` without actually doing the checks.

Final validator:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

## Final response

Only:

- `PRODUCTION COMPLETE` when final MP4 and all required checks truly passed.
- `BLOCKED` with exact cause/action when further progress is genuinely impossible.
