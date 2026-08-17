---
name: finanzneo-reel
description: Build, repair and finish FinanzNeo vertical Remotion reels with a globally locked Google-Flow physical explainer image world, strict user-media boundaries, animation-first visuals, exact final-audio captions and hard final MP4 QA.
---

# FinanzNeo Reel Skill

Read first:

1. `.agents/rules/finanzneo-image-world-lock.md`
2. `config/finanzneo-image-world-lock.json`
3. `config/finanzneo-image-worlds/finanzneo-physical-explainer-editorial-v7.txt`
4. `CLAUDE.md`
5. `reels/PRODUKTIONSSTANDARD.md`
6. `docs/REEL-QUALITY-CONTRACT-V2.md`
7. `docs/BEAT-TO-IMAGE-RULES.md`
8. `.agents/rules/finanzneo-reel-safety.md`
9. target Reel `03-szenen/scene-index.json`
10. target Reel `05-projektdateien/szenenplan.md`
11. target Reel `03-szenen/alle-bildprompts.txt`

`CLAUDE.md` remains the general production/style authority. For **image-world decisions**, the global image-world lock is the hard technical authority and supersedes older historical image-world wording.

## Autopilot

If the user says required images and final audio are ready and asks to make/finish the Reel, execute one continuous production run. Never ask `weiter` between normal phases.

Recoverable failures are work to fix:

```text
diagnose → fix → rerun → continue
```

Stop only for a genuine blocker. Production authorization does not include merge/publish/delete/force-push/history rewrite.

## GLOBAL IMAGE WORLD LOCK — mandatory

Exactly one image world is allowed for every NEW Reel:

```text
finanzneo-physical-explainer-editorial-v7
```

Hard composition:

- ONE large PHYSICAL hero object; it must not read as a tablet, digital screen, app card, microchip or game tile
- 3–6 recognizable, topic-specific physical objects around it
- concrete objects preferred over generic icons: products, euro coins, cash, groceries, envelopes, receipts, contract folders, calendars, price tags, shopping objects etc.
- natural asymmetric placement with overlap and contact shadows
- labels only as physical price tags, paper tags, stickers or attached plaques
- premium stylized adult 3D explainer composition
- normal scene image source: strict 1:1, preferably 1080×1080
- cover Bild 00: 9:16 with exact cover text rendered directly by Google Flow

Forbidden screenshot-failure language:

- central digital device with mini satellite modules
- microchip / circuit-board world
- floating UI cards, tiles, chips, buttons or widgets
- four-corner mini-tile layout
- circular orbit of icon modules
- game-board / board-game composition
- dashboard / HUD / app interface
- generic icon buttons replacing concrete topic objects
- glowing connector loops or line networks
- abstract finance streams, tubes, rails, tracks or roads
- realistic everyday / desk / room scene
- photo-like realism
- repeated contract-paper walls
- wealth towers / monoliths / meaningless blocks
- sterile product advertising
- almost-empty black studio shot
- sci-fi corridor / neon tunnel
- tiny subject in huge empty space

Never invent a Reel-specific replacement world. A world change requires an explicit GLOBAL user request and an intentional update of `config/finanzneo-image-world-lock.json`.

New Reels must be scaffolded via:

```bash
npm run reel:create -- --target <TARGET> --title "..."
```

Never bypass `scripts/scaffold-finanzneo-reel-locked.mjs` for normal production.

## Google Flow image autopilot — mandatory

Every `03-szenen/alle-bildprompts.txt` for a new Reel must instruct Google Flow to generate the COMPLETE required image set in one uninterrupted autonomous sequence.

Required behavior:

```text
Bild 00
→ wait internally until generation is complete
→ inspect exact requirements
→ regenerate automatically if wrong
→ assign exact filename
→ immediately continue to next required image
→ repeat until every required image is finished
→ only then give one final summary
```

Hard rules:

- NEVER ask the user `Weiter?`, `Continue?`, approval, feedback or confirmation between images.
- NEVER stop after one completed image.
- NEVER announce that the next image will be generated and then wait for user input.
- A failed image is regenerated automatically before continuing.
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

Use Google-Flow images mainly for hook, strong single physical explainer metaphor and closing image — always inside the locked physical-explainer world.

A visual is not chosen merely because it is easier to produce.

## Supplied image QA before Remotion

Inspect every supplied image before integration against the exact spoken beat and the global lock.

Reject if:

- motif does not match the beat
- image is semantically unclear/misleading
- random/wrong words or disallowed labels appear
- numbers conflict with script/research
- image adds contradictory information
- text is unnecessarily repeated across image + headline + subtitle
- cover headline is wrong/missing/clipped/unreadable
- normal scene image is not 1:1
- large physical hero object is missing
- recognizable topic objects are replaced by generic icons or UI buttons
- image uses digital central screen / microchip / floating UI tile language
- image uses satellite-module orbit, four-corner tiles or game-board layout
- image becomes realistic everyday/desk/room imagery
- line network / glowing finance stream becomes the main motif
- contract wall, wealth tower, monolith or sterile product-ad drift appears

If regeneration is needed → `BLOCKED`; do not cover the defect with Remotion.

## Image presentation — locked default

For new Reels:

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
- headline remains a Remotion overlay above/around the visual as designed
- karaoke caption remains separate and readable
- cover keeps its Google-Flow headline; no Remotion replacement
- target `scene-index.json` is authoritative for per-scene filename and content

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

1. run `npm run validate:image-world`
2. inspect every image semantically and against the locked world
3. verify cover headline and exact typography
4. verify all normal scene images are 1:1
5. generate real final-audio word timestamps
6. create short caption units
7. resolve final scene timeline
8. verify semantic animation/image mix
9. implement Remotion mechanism scenes
10. integrate user images without distortion
11. add scene headlines
12. add safe karaoke captions
13. create universal five-hashtag caption
14. run `npm run reel:validate -- <TARGET-REEL> --final`
15. run TypeScript check
16. render preview via the locked render command
17. inspect every scene and contact sheet
18. fix all issues
19. render full MP4 via the locked render command
20. inspect complete MP4 with audio
21. measure loudness/true peak
22. fill `05-projektdateien/final-qa.json` truthfully
23. mark QA `passed` only after real checks pass
24. rerun final validator
25. safety audit
26. commit + draft PR when appropriate

Final QA must confirm image/voice semantic match, locked image-world match, generated text correctness, scene/audio sync, subtitle safe-area, subtitle word sync, meaningful animations, no long static tail and audio around -16 LUFS with True Peak <= -1 dBTP.

## Final response

Only:

- `PRODUCTION COMPLETE` when final MP4 and every required check truly passed.
- `BLOCKED` with exact blocker/action when further progress is genuinely impossible.

Never end a normal production phase by asking `Weiter?`.
