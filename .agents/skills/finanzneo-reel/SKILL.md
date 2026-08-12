---
name: finanzneo-reel
description: Build, repair and finish FinanzNeo vertical Remotion reels with strict user-media boundaries, 60/40 animation-first visuals, exact final-audio captions and hard final MP4 QA.
---

# FinanzNeo Reel Skill

Read first:

1. `CLAUDE.md`
2. `reels/PRODUKTIONSSTANDARD.md`
3. `docs/REEL-QUALITY-CONTRACT-V2.md`
4. `docs/BEAT-TO-IMAGE-RULES.md`
5. `.agents/rules/finanzneo-reel-safety.md`
6. target Reel `03-szenen/scene-index.json`
7. target Reel `05-projektdateien/szenenplan.md`
8. target Reel `03-szenen/alle-bildprompts.txt`

`CLAUDE.md` remains production/style authority. New V17+ Reels must also satisfy the V2 quality contract.

## Autopilot

If the user says required images and final audio are ready and asks to make/finish the Reel, execute one continuous production run. Never ask `weiter` between normal phases.

Recoverable failures are work to fix:

```text
diagnose → fix → rerun → continue
```

Stop only for a genuine blocker. Production authorization does not include merge/publish/delete/force-push/history rewrite.

## Hard target-Reel media boundary

User media is valid only from:

```text
<TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
<TARGET-REEL>/02-audio/
```

- required image filenames come from target `scene-index.json`
- exactly one final audio file is required
- never substitute another Reel, archive, Desktop/Downloads, web/stock, placeholders, old exports or caches
- missing/wrong/unreadable/ambiguous media → `BLOCKED`
- Antigravity does not generate replacement images

## Visual planning — mandatory 60/40

For normal new Reels:

```text
Target: 60 % native Remotion animation
        40 % Google-Flow images

10 scenes: 6 animation + 4 image
Final duration: 55–65 % animation / 35–45 % images
```

Hard planning rules:

- no two image scenes directly consecutive
- static image normally <= 8 seconds
- no long static tail
- every scene has `visualRole` + real `visualSelectionReason`
- every image scene has a concrete `expectedVisual`

**Animation-first** for comparison, calculation, timeline, growth, Zinseszins, money flow, mechanisms, steps and changing cause/effect.

Use Google-Flow images mainly for hook, concrete situation, strong single metaphor and closing image.

A visual is not chosen merely because it is easier to produce.

## Supplied image QA before Remotion

Inspect every supplied image before integration against the exact spoken beat.

Reject if:

- motif does not match the beat
- image is semantically unclear/misleading
- random/wrong words or disallowed labels appear
- numbers conflict with script/research
- image adds contradictory information
- text is unnecessarily repeated across image + headline + subtitle
- cover headline is wrong/missing/clipped/unreadable
- image-world/background/person rules fail

If regeneration is needed → `BLOCKED`; do not cover the defect with Remotion.

## Image presentation

Use `full-frame-no-crop`:

- full vertical 9:16 source across 1080×1920
- no inset `VisualStage`
- no intentional crop/focal zoom
- scene 01+ headline + caption overlay the same image
- cover keeps its Google-Flow headline; no Remotion replacement
- only soft continuous readability scrim

Use `src/design-system/FullFrameImage.tsx`.

Native animation scenes use one seamless full-canvas background without floor/horizon/studio split.

## Timing — final audio only

Mandatory order:

```text
final audio
→ real word start/end timestamps
→ short caption units
→ resolved scene timing
→ animation timing
→ render
```

Never estimate/evenly distribute timings. Final `word-timings.json` requires `timingStatus: final-audio-aligned`.

Final `timeline.json` must contain real positive durations, chronological/gapless scene starts and no unresolved zero-duration placeholders.

## Captions

At any moment exactly one short caption unit is visible.

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

Long spoken sentences may be split into sequential meaning/pause units without changing audio.

- never two caption units simultaneously
- no horizontal overflow/clipping
- no tiny text workaround
- current word green only during real word timing
- hold unit through short pauses
- switch on next unit's first spoken word
- no opaque caption card

Use `src/design-system/SentenceKaraokeCaptions.tsx`.

## Universal social caption

Exactly one:

```text
<TARGET-REEL>/04-caption/caption.txt
```

Same file unchanged for Instagram Reels, TikTok, Facebook Reels and Snapchat.

- strong truthful first line
- concise value/aha
- natural CTA if useful
- exactly 5 relevant hashtags
- no platform variants
- no random `#fyp`
- no viral guarantee

No YouTube Shorts.

## End-to-end finalization

When media gate passes:

1. inspect every image semantically against the voice beat
2. verify Google-Flow cover headline
3. generate real final-audio word timestamps
4. create short caption units
5. resolve final scene timeline
6. verify 60/40 plan and 55–65 % actual animation duration
7. implement Remotion animation scenes
8. integrate full-frame user images
9. add scene 01+ headlines
10. add safe karaoke captions
11. create universal five-hashtag caption
12. run final validator + TypeScript
13. render preview
14. inspect every scene and contact sheet
15. fix all issues
16. render full MP4
17. inspect the complete MP4 with audio
18. measure loudness/true peak
19. fill `05-projektdateien/final-qa.json` truthfully
20. mark QA `passed` only after real checks pass
21. rerun final validator
22. safety audit
23. commit + draft PR when appropriate

Final QA must confirm image/voice semantic match, generated text correctness, scene/audio sync, subtitle safe-area, subtitle word sync, 55–65 % real animation duration, no long static tail and audio around -16 LUFS with True Peak <= -1 dBTP.

Final validation:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

## Final response

Only:

- `PRODUCTION COMPLETE` when final MP4 and every required check truly passed.
- `BLOCKED` with exact blocker/action when further progress is genuinely impossible.

Never end a normal production phase by asking `Weiter?`.
