---
description: Build a complete FinanzNeo Reel end-to-end with the globally locked Google-Flow stylized finance-explainer image world, animation-first visuals, exact final-audio timing and hard final MP4 QA.
---

# Build a complete FinanzNeo Reel

Read first:

1. `.agents/rules/finanzneo-image-world-lock.md`
2. `config/finanzneo-image-world-lock.json`
3. `.agents/rules/finanzneo-reel-safety.md`
4. `CLAUDE.md`
5. `reels/PRODUKTIONSSTANDARD.md`
6. `docs/REEL-QUALITY-CONTRACT-V2.md`
7. `docs/BEAT-TO-IMAGE-RULES.md`
8. target Reel `03-szenen/scene-index.json`
9. target Reel `05-projektdateien/szenenplan.md`
10. target Reel `03-szenen/alle-bildprompts.txt`

`CLAUDE.md` wins on general production/style conflicts. For image-world decisions, the global lock wins over older historical wording.

## AUTOPILOT

If the user says images and final audio are ready and asks `Mach das Reel`, `Erstelle das Reel`, `Mach es fertig` or equivalent, run continuously until `PRODUCTION COMPLETE` or genuine `BLOCKED`.
Never ask `Weiter?` between normal phases. Recoverable errors are work to fix.
No merge/publish/delete/force-push/history rewrite without separate user authorization.

## GLOBAL IMAGE-WORLD GATE — BEFORE EVERYTHING ELSE

Run `npm run validate:image-world`.

Locked world:

```text
finanzneo-stylized-finance-explainer-v8
```

For every NEW Reel:
- Cover Bild 00 = 9:16 with exact Google-Flow cover text
- normal Flow scene images = strict 1:1, preferably 1080×1080
- ONE large chunky central explanatory hero object
- 3–6 simplified recognizable topic objects around it
- clean rounded geometry, matte surfaces and reduced realistic detail
- deep charcoal-green background with mint/emerald, cream and muted-gold accents
- labels only as small paper/price tags or printed plaques
- composition is a designed 3D finance infographic, NOT a photograph

Hard forbidden realism drift:
- photorealism / realistic photography
- realistic product photography or product-ad rendering
- leather / stitched leather
- wood grain / wooden sign / rustic wood
- realistic scratched/aged metal
- realistic pen/document/electronics photography
- realistic desk/office/shop/lifestyle scene
- cinematic luxury product-shot look

Hard forbidden UI/game/abstract drift:
- central digital screen/tablet/app card
- microchip / circuit-board world
- floating UI cards, tiles, chips, buttons or widgets
- four-corner mini-tile layout
- circular orbit of icon modules
- game-board / board-game composition
- dashboard / HUD / app interface
- generic icon buttons replacing simplified topic objects
- glowing connector loops or line networks
- abstract finance streams, tubes, rails, tracks or roads
- repeated contract wall
- wealth tower / monolith

A per-Reel image-world override is forbidden. If target `scene-index.json`, `bildwelt.txt` or `alle-bildprompts.txt` uses another world, stop as `BLOCKED` and fix the target back to the global lock. Do not weaken the validator.

## GOOGLE FLOW AUTONOMOUS IMAGE/FILE SET

Google Flow must create ONE final output folder first and process required images strictly one at a time:

```text
generate exactly ONE image
→ wait until fully finished
→ inspect
→ regenerate THIS SAME image if invalid
→ rename immediately to exact final filename
→ move/save renamed file into the one final folder
→ verify exact renamed filename exists there
→ ONLY THEN generate the next image
→ repeat
→ final summary only after all renamed files are together in the one final folder
```

Never batch-generate several required images before renaming the previous one.
Never ask `Weiter?`, `Continue?`, approval or confirmation between images.

## HARD USER-MEDIA GATE

Use only:

```text
Images: <TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  <TARGET-REEL>/02-audio/
```

Before production verify every expected image, exactly one readable final audio, the exact Google-Flow cover headline, all normal images are 1:1 and every image matches the locked world.
Missing/wrong/unreadable/ambiguous user media → `BLOCKED`. Antigravity never generates replacement images.

## QUALITY GATE 1 — Visual plan

Target about 60% native Remotion animation / 40% Google-Flow images, with 50–70% animation allowed when semantic quality requires it.

Rules:
- 6 animation + 4 image is normal for 10 scenes, not a hard reason for meaningless motion
- no two image scenes directly consecutive
- dynamic information is animation-first
- each scene needs real `visualRole` + `visualSelectionReason`
- each image scene needs concrete `expectedVisual`
- every animation needs Start → visible mechanism/action → result
- icon-only, number-zoom, static-bar, emoji, text-only or generic-card animation is forbidden

Use Google-Flow images mainly for hook, strong single stylized explainer metaphor and closing image — always inside the global V8 world.

## QUALITY GATE 2 — Inspect every supplied image

Reject if motif is wrong/unclear, generated text or labels are wrong, numbers conflict with script/research, contradictory information appears, cover headline is wrong, normal image is not 1:1, stylized infographic language is missing, photorealism/product-ad drift appears, leather/wood/realistic materials appear, or any forbidden UI/chip/game-board/line-network drift appears.
If user must regenerate → `BLOCKED`. Never hide a bad image with Remotion overlays.

## Canonical image presentation

Cover 9:16. Normal Flow scene image 1:1, preferably 1080×1080. Reel canvas 1080×1920. Square display about 1000×1000, centered horizontally. Never stretch square images to 9:16. Cover gets no Remotion replacement headline.

## Audio is the only timing source

Final audio → real word start/end timestamps → short caption units → scene start/end frames → animation timing → render. Never estimate/evenly distribute timings. Final `word-timings.json` requires `timingStatus: final-audio-aligned`.

## Captions

Exactly one short caption unit is visible at a time. Max 12 words, 68 characters, 2 lines, minimum 42 px, bottom ≈ 430, left ≈ 72, right ≈ 170–180. No opaque caption cards.

## Universal social caption

Exactly one `04-caption/caption.txt`, unchanged for Instagram Reels, TikTok, Facebook Reels and Snapchat, with a strong truthful hook and exactly 5 relevant hashtags. No YouTube Shorts.

## Continuous production order

1. pre-flight branch/HEAD/diff
2. `npm run validate:image-world`
3. hard media gate
4. inspect every supplied image semantically and against the global image-world lock
5. verify Google-Flow cover headline
6. create real final-audio word timestamps
7. create short caption units
8. resolve final scene timeline
9. verify semantic animation/image mix
10. implement Remotion mechanism scenes
11. integrate square user images without distortion
12. add scene headlines
13. add safe karaoke captions
14. `npm run reel:validate -- <TARGET-REEL> --final`
15. TypeScript check
16. render preview via locked render command
17. inspect every scene + contact sheet; fix issues
18. render full MP4 via locked render command
19. inspect complete final MP4
20. measure audio loudness/true peak
21. fill `05-projektdateien/final-qa.json` with actual results
22. set `status: passed` only when all required QA passed
23. rerun final validation / QA
24. safety audit
25. commit + draft PR when appropriate
26. report result

## Mandatory final QA

Final QA must confirm: full MP4 inspected, every scene inspected, images match voice beats, generated text correct, normal Flow images are 1:1, locked V8 stylized world passed, no photorealism/leather/wood/product-ad drift, no UI/chip/satellite/game-board failure mode, scene/audio sync correct, captions safe and synced, animations meaningful, no long static tail, audio levels passed.

Audio target: approximately -16 LUFS, True Peak <= -1 dBTP.

## Stop conditions

Only genuine blockers may stop Autopilot: missing/wrong media, image requiring user regeneration, global image-world violation, inability to produce real word alignment, external credential/quota/permission failure, prohibited repository action, or material ambiguity unresolved by target Reel files.

## Completion response

Only return `PRODUCTION COMPLETE` after all required checks truly passed. Otherwise return `BLOCKED` with exact cause/action.
