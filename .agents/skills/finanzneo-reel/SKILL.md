---
name: finanzneo-reel
description: Build, repair and finish FinanzNeo vertical Remotion reels with strict user-media boundaries, animation-first visuals, autonomous Google-Flow image production, exact final-audio captions and hard final MP4 QA.
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

## Google Flow image autopilot — mandatory

Every `03-szenen/alle-bildprompts.txt` for a new Reel must instruct Google Flow to generate the COMPLETE required image set in one uninterrupted autonomous sequence.

Required behavior:

```text
Bild 00
→ wait internally until generation is complete
→ inspect against exact requirements
→ regenerate automatically if wrong
→ assign exact filename
→ immediately continue to next required image
→ repeat until every required image is finished
→ only then give one final summary
```

Hard rules:

- NEVER ask the user `Weiter?`, `continue?`, approval, feedback or confirmation between images.
- NEVER stop after one completed image.
- NEVER announce that the next image will be generated and then wait for user input.
- The prompt must explicitly state that the user will not respond between images.
- A failed image is regenerated automatically before continuing.
- Only after the last required image passes QA may Flow provide one completion summary.
- Sequential generation means one image at a time internally, NOT one user turn per image.

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

## Visual planning — animation first

For normal new Reels:

```text
Target: about 60 % native Remotion animation
        about 40 % Google-Flow images
Allowed animation range: 50–70 % when semantic quality requires it
```

For 10 scenes, 6 animation + 4 image is the normal starting point, not a reason to create meaningless motion.

Hard planning rules:

- no two image scenes directly consecutive
- static image normally <= 8 seconds
- no long static tail
- every scene has `visualRole` + real `visualSelectionReason`
- every image scene has a concrete `expectedVisual`
- every animation must show Start → visible action/mechanism → result
- no animation whose main content is only an icon, emoji, number zoom, static bar or generic card

**Animation-first** for comparison, calculation, timeline, growth, Zinseszins, money flow, mechanisms, steps and changing cause/effect.

Use Google-Flow images mainly for hook, concrete situation, strong single metaphor and closing image.

A visual is not chosen merely because it is easier to produce.

## FinanzNeo Flow image world — tangible, not abstract

Normal Flow imagery should feel like a premium semi-realistic 3D editorial finance world with tangible, understandable financial objects.

Prefer when semantically useful:

- transparent savings jars / premium money containers
- believable euro coins and banknote bundles
- calendar pages and time markers
- financial workspace / desk context
- documents, envelopes, notebook, calculator or household-finance props
- premium glass, paper, brushed metal and matte materials
- real contact shadows and clear foreground/midground/background depth

Avoid as main visual:

- glowing tubes, rails, tracks or roads
- generic wealth towers / anonymous vertical blocks
- futuristic paths or sci-fi corridors
- floating geometric bars
- almost-empty black studio product shots
- dashboard/app UI
- toy-like dioramas, Pixar or clay look

If the result looks like an abstract tech render instead of an understandable finance scene, reject/regenerate it.

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
- normal scene image has wrong aspect ratio
- normal scene image is an abstract pipe/tower/track world when a tangible finance metaphor is expected

If regeneration is needed → `BLOCKED`; do not cover the defect with Remotion.

## Image presentation — current default

For new Reels unless the target scene explicitly justifies another mode:

```text
Cover Bild 00: vertical 9:16
Normal Google-Flow scene images: square 1:1, preferably 1080×1080
Reel canvas: 1080×1920
Square image display: approximately 1000×1000, centered horizontally
```

Rules:

- never stretch a 1:1 image vertically to 9:16
- no tiny centered poster; square visual should use nearly the full Reel width
- no blurred duplicate background required
- scene headline remains a Remotion overlay above/around the visual as designed
- karaoke caption remains separate and readable
- cover keeps its Google-Flow headline; no Remotion replacement
- target `scene-index.json` is authoritative for per-scene aspect ratio

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

Current vertical Reel target:

```text
max 12 words
max 68 characters
max 2 lines
min 42 px effective font
bottom ≈ 430
left ≈ 72
right ≈ 170–180
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
2. verify cover headline and exact typography
3. verify normal scene image aspect ratios
4. generate real final-audio word timestamps
5. create short caption units
6. resolve final scene timeline
7. verify semantic animation/image mix
8. implement Remotion mechanism scenes
9. integrate user images without distortion
10. add scene headlines
11. add safe karaoke captions
12. create universal five-hashtag caption
13. run final validator + TypeScript
14. render preview
15. inspect every scene and contact sheet
16. fix all issues
17. render full MP4
18. inspect the complete MP4 with audio
19. measure loudness/true peak
20. fill `05-projektdateien/final-qa.json` truthfully
21. mark QA `passed` only after real checks pass
22. rerun final validator
23. safety audit
24. commit + draft PR when appropriate

Final QA must confirm image/voice semantic match, generated text correctness, scene/audio sync, subtitle safe-area, subtitle word sync, visually meaningful animations, no long static tail and audio around -16 LUFS with True Peak <= -1 dBTP.

Final validation:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

## Final response

Only:

- `PRODUCTION COMPLETE` when final MP4 and every required check truly passed.
- `BLOCKED` with exact blocker/action when further progress is genuinely impossible.

Never end a normal production phase by asking `Weiter?`.
