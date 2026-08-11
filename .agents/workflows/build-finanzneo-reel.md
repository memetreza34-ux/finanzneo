---
description: Build a complete FinanzNeo Reel end-to-end with 60/40 animation-first visuals, exact final-audio timing and hard visual QA.
---

# Build a complete FinanzNeo Reel

Read first:

1. `.agents/rules/finanzneo-reel-safety.md`
2. `CLAUDE.md`
3. `reels/PRODUKTIONSSTANDARD.md`
4. `docs/REEL-QUALITY-CONTRACT-V2.md`
5. `docs/BEAT-TO-IMAGE-RULES.md`
6. target Reel `03-szenen/scene-index.json`
7. target Reel `05-projektdateien/szenenplan.md`
8. target Reel `03-szenen/alle-bildprompts.txt`

`CLAUDE.md` wins on production/style conflicts. The V2 quality contract applies to new `scene-index` V17+ Reels.

## AUTOPILOT — mandatory

If the user says images and final audio are ready and asks **„Mach das Reel“**, **„Erstelle das Reel“**, **„Mach es fertig“** or equivalent, run continuously until `PRODUCTION COMPLETE` or a genuine `BLOCKED` condition.

Never ask `Weiter?` between normal phases. Recoverable errors are work to fix:

```text
diagnose → fix → validate → render → inspect → repeat
```

The production command does not authorize merge, publish, delete, force-push or history rewrite.

## HARD USER-MEDIA GATE

Use only:

```text
Images: <TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  <TARGET-REEL>/02-audio/
```

Required filenames come from the target Reel's `scene-index.json`.

Before coding/timing/rendering verify:

- every required image exists with exact filename
- exactly one readable final audio exists
- no outside user media is substituted
- Cover `Bild 00` contains the exact Google-Flow headline

Missing/wrong/unreadable/ambiguous required media →

```text
BLOCKED
Problem: <exact path/file/cause>
Action: <exact user action needed>
```

Antigravity never generates replacement images.

## QUALITY GATE 1 — Visual plan before build

For V17+ Reels, verify before production:

```text
Target: 60 % native Remotion animation
        40 % Google-Flow images

10 scenes: 6 animation + 4 image
```

Rules:

- standard planned animation count = `round(sceneCount × 0.60)`
- never two image scenes directly after each other
- dynamic information is animation-first
- each scene needs a real `visualRole` and `visualSelectionReason`
- each image scene needs a concrete `expectedVisual`

Use Remotion for comparison, calculations, timelines, growth, money flow, mechanisms, step sequences and changing cause/effect.

Use Google-Flow images mainly for hook, concrete real-life situation, strong single metaphor and closing image.

If the plan violates this, fix the plan before using user assets.

## QUALITY GATE 2 — Inspect every supplied image before Remotion

For every `Bild 00` / image scene, inspect the actual supplied file before integration.

Reject if:

- motif does not match the exact spoken beat
- visual meaning is unclear or misleading
- random/wrong text appears
- label is not allowed by the scene contract
- number/fact conflicts with script/research
- image adds contradictory information
- image duplicates the same information unnecessarily across image label + Remotion headline + caption
- cover headline is wrong/missing/clipped/unreadable
- background/person/image-world rules fail

If user must regenerate the image → `BLOCKED`. Never hide a bad image problem with Remotion overlays.

## Canonical visual presentation

Image scenes:

- complete vertical 9:16 user image across full 1080×1920
- no inset `VisualStage`
- no intentional crop/focal zoom
- scene 01+ headline + caption as overlays over same image
- cover gets no Remotion replacement headline
- only soft continuous readability scrim

Use `src/design-system/FullFrameImage.tsx`.

Native Remotion scenes use one seamless full-canvas background with no floor/horizon/studio split.

## Audio is the only timing source

Use only the exact final voiceover from `02-audio/`.

Order is mandatory:

```text
final audio
→ real word start/end timestamps
→ short caption units
→ scene start/end frames
→ animation timing
→ render
```

Never estimate/evenly distribute word timings. Never final-render with unresolved timeline placeholders.

Final `word-timings.json` requires:

```text
timingStatus: final-audio-aligned
```

Final `timeline.json` requires every scene to have real `startFrame` and `durationFrames > 0`, chronological and effectively gapless.

The final timeline must end within roughly one second of the final spoken content unless a deliberate ending is documented.

## Captions — short, safe and truly synced

At any moment show exactly **one** short caption unit.

For V17+:

```text
max 12 words
max 68 characters
max 2 lines
min effective font 42 px
bottom ≈ 320
left ≈ 72
right ≈ 180
```

A long spoken sentence may be split into sequential meaning/pause units without changing the audio.

Never show two units together. Never let text overflow or clip. Never shrink below readable size just to make it fit.

Current spoken word is green only during its real start/end timing. Hold the current unit during short pauses; switch at the next unit's first spoken word.

Use `src/design-system/SentenceKaraokeCaptions.tsx`.

## QUALITY GATE 3 — Real 60/40 duration after audio timing

After final scene durations are derived from audio, calculate actual duration share.

Final V17 range:

```text
Animation: 55–65 %
Images:    35–45 %
```

Additionally:

- static image scene normally <= 8 seconds
- no consecutive image scenes
- no long static tail at end

If duration ratio is outside range, reassign/restructure suitable beats before final render. Do not fake the ratio with meaningless animation.

## Universal social caption

Create exactly one:

```text
04-caption/caption.txt
```

Same file unchanged for Instagram Reels, TikTok, Facebook Reels and Snapchat.

- truthful strong first line
- concise Reel value
- natural CTA only if useful
- exactly 5 relevant hashtags
- no per-platform variants
- no random `#fyp` spam
- no viral guarantee

No YouTube Shorts.

## Continuous production order

After media + visual-plan gates pass:

1. pre-flight branch/HEAD/diff
2. inspect every supplied image semantically against its Voice beat
3. verify exact Google-Flow cover headline
4. create real final-audio word timestamps
5. create short caption units
6. derive fully resolved scene timeline
7. verify planned + real-duration 60/40 mix
8. implement all native Remotion scenes
9. integrate user images full-frame
10. add scene 01+ headlines only
11. add safe karaoke captions
12. create universal five-hashtag caption
13. run `npm run reel:validate -- <TARGET-REEL> --final` as far as possible before render
14. TypeScript check
15. render preview
16. inspect beginning/middle/end of every scene + contact sheet
17. fix every visual/layout/timing issue
18. render full MP4 with audio
19. watch/inspect the **complete final MP4**, not only sample frames
20. measure/check audio loudness and true peak
21. fill `05-projektdateien/final-qa.json` with actual measured/reviewed results
22. set `status: passed` only if every required QA item really passed
23. rerun final validator
24. safety audit
25. commit + draft PR when appropriate
26. report result

## Mandatory final QA

`final-qa.json` must truthfully confirm:

- full MP4 inspected
- every scene inspected
- images semantically match voice beats
- generated image text/labels correct
- scene changes match audio
- captions remain inside safe area
- active word timing is synced
- real animation duration is 55–65 %
- no long static tail
- audio levels passed

Audio target:

```text
Integrated loudness: approximately -16 LUFS (validator range -17 to -15)
True Peak: <= -1 dBTP
```

Never mark QA as passed without actually doing the check.

## Final validation

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

For V17+ this must block wrong mix, unresolved timing, overlong static images, unsafe captions and missing final QA.

## Stop conditions

Only genuine blockers may stop Autopilot:

- missing/wrong/unreadable/ambiguous required user media
- supplied image/cover must be regenerated by user
- exact final-audio alignment cannot be produced
- unavoidable external credential/quota/permission failure
- next action requires prohibited merge/publish/delete/force-push/history rewrite
- material content ambiguity cannot be resolved from target Reel files

## Completion response

Only return:

```text
PRODUCTION COMPLETE
```

when the final MP4 exists and all required validation, TypeScript, full visual review, subtitle sync/safe-area review, real 60/40 duration check, audio QA, universal five-hashtag caption and safety audit truly passed; otherwise:

```text
BLOCKED
```

with exact blocker and exact required user action.
