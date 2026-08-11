---
description: Build a complete FinanzNeo Reel end-to-end with 60/40 animation-first visuals, exact final-audio timing and hard final MP4 QA.
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

`CLAUDE.md` wins on production/style conflicts. The V2 quality contract applies to new V17+ Reels.

## AUTOPILOT

If the user says images and final audio are ready and asks `Mach das Reel`, `Erstelle das Reel`, `Mach es fertig` or equivalent, run continuously until `PRODUCTION COMPLETE` or genuine `BLOCKED`.

Never ask `Weiter?` between normal phases. Recoverable errors are work to fix:

```text
diagnose → fix → validate → render → inspect → repeat
```

No merge/publish/delete/force-push/history rewrite without separate user authorization.

## HARD USER-MEDIA GATE

Use only:

```text
Images: <TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  <TARGET-REEL>/02-audio/
```

Before production verify every expected image, exactly one readable final audio, no outside media substitution and the exact Google-Flow cover headline.

Missing/wrong/unreadable/ambiguous user media →

```text
BLOCKED
Problem: <exact path/file/cause>
Action: <exact user action needed>
```

Antigravity never generates replacement images.

## QUALITY GATE 1 — Visual plan

For V17+:

```text
Target: 60 % native Remotion animation
        40 % Google-Flow images

10 scenes: 6 animation + 4 image
```

Rules:

- standard animation count = `round(sceneCount × 0.60)`
- no two image scenes directly consecutive
- dynamic information is animation-first
- each scene needs real `visualRole` + `visualSelectionReason`
- each image scene needs concrete `expectedVisual`

Use Remotion for comparison, calculations, timelines, growth, money flow, mechanisms, step sequences and changing cause/effect.

Use Google-Flow images mainly for hook, concrete situation, strong single metaphor and closing image.

## QUALITY GATE 2 — Inspect every supplied image

Before integration inspect every supplied image against its exact spoken beat.

Reject if motif is wrong/unclear, generated text or labels are wrong, numbers conflict with script/research, contradictory information appears, unnecessary text repetition appears, cover headline is wrong, or image-world rules fail.

If user must regenerate → `BLOCKED`. Never hide a bad image with Remotion overlays.

## Canonical presentation

Image scenes:

- full vertical 9:16 source across 1080×1920
- no inset `VisualStage`
- no intentional crop/focal zoom
- scene 01+ headline + caption overlay same image
- cover gets no Remotion replacement headline
- only soft continuous readability scrim

Use `src/design-system/FullFrameImage.tsx`.

Native Remotion scenes use one seamless full-canvas background without floor/horizon/studio split.

## Audio is the only timing source

Mandatory order:

```text
final audio
→ real word start/end timestamps
→ short caption units
→ scene start/end frames
→ animation timing
→ render
```

Never estimate/evenly distribute timings.

Final `word-timings.json` requires `timingStatus: final-audio-aligned`.
Final `timeline.json` requires real positive durations, chronological/gapless scene starts and no unresolved zero-duration placeholders.

## Captions

Exactly one short caption unit is visible at a time.

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

A long spoken sentence may be split into sequential meaning/pause units without changing audio.

Never show two units, overflow/clip text, shrink below safe size, fabricate timing or use opaque caption cards. Current word is green only during its real audio timing.

Use `src/design-system/SentenceKaraokeCaptions.tsx`.

## QUALITY GATE 3 — Actual runtime mix

After real scene durations are derived from audio:

```text
Animation: 55–65 %
Images:    35–45 %
```

Also:

- static image scene <= 8 seconds
- no consecutive image scenes
- no long static ending tail

If ratio fails, restructure suitable dynamic beats. Do not add meaningless motion just for quota.

## Universal social caption

Exactly one `04-caption/caption.txt`, unchanged for Instagram Reels, TikTok, Facebook Reels and Snapchat, with a strong truthful hook and exactly 5 relevant hashtags. No YouTube Shorts.

## Continuous production order

1. pre-flight branch/HEAD/diff
2. hard media gate
3. inspect every supplied image semantically
4. verify Google-Flow cover headline
5. create real final-audio word timestamps
6. create short caption units
7. resolve final scene timeline
8. verify planned and real-duration 60/40 mix
9. implement Remotion scenes
10. integrate full-frame images
11. add scene 01+ headlines
12. add safe karaoke captions
13. create universal five-hashtag caption
14. **PRE-RENDER validation:** `npm run reel:validate -- <TARGET-REEL> --final`
15. TypeScript check
16. render preview
17. inspect every scene + contact sheet; fix issues
18. render full MP4 with audio
19. inspect the complete final MP4
20. measure audio loudness/true peak
21. fill `05-projektdateien/final-qa.json` with actual reviewed/measured results
22. set `status: passed` only when every required QA item truly passed
23. **POST-RENDER validation:** `npm run reel:validate -- <TARGET-REEL> --final --post-render`
24. safety audit
25. commit + draft PR when appropriate
26. report result

The pre-render validator may accept `final-qa.json: pending`; this is intentional because the final MP4 does not exist yet. The post-render validator is the gate that requires `passed`.

## Mandatory final QA

`final-qa.json` must truthfully confirm:

- full MP4 inspected
- every scene inspected
- images semantically match voice beats
- generated text/labels correct
- scene/audio sync correct
- captions stay inside safe area
- active-word timing synced
- real animation duration 55–65 %
- no long static tail
- audio levels passed

Audio target:

```text
Integrated loudness: approximately -16 LUFS (validator -17 to -15)
True Peak: <= -1 dBTP
```

Never mark QA passed without actually checking.

## Stop conditions

Only genuine blockers may stop Autopilot: missing/wrong media, image requiring user regeneration, inability to produce real word alignment, external credential/quota/permission failure, prohibited repository action, or material ambiguity unresolved by target Reel files.

## Completion response

Only return `PRODUCTION COMPLETE` after the **post-render validator** and all required checks truly passed. Otherwise return `BLOCKED` with exact cause/action.
