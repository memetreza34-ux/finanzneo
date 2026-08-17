---
description: Build a complete FinanzNeo Reel end-to-end with the globally locked Google-Flow image world, animation-first visuals, exact final-audio timing and hard final MP4 QA.
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

Never ask `Weiter?` between normal phases. Recoverable errors are work to fix:

```text
diagnose → fix → validate → render → inspect → repeat
```

No merge/publish/delete/force-push/history rewrite without separate user authorization.

## GLOBAL IMAGE-WORLD GATE — BEFORE EVERYTHING ELSE

Run:

```bash
npm run validate:image-world
```

Locked world:

```text
finanzneo-central-object-editorial-v6
```

For every NEW Reel:

- Cover Bild 00 = 9:16 with exact Google-Flow cover text
- normal Flow scene images = strict 1:1, preferably 1080×1080
- ONE large central hero object
- 3–5 smaller supporting symbolic finance objects
- premium stylized 3D explainer composition
- no realistic everyday/desk/room main scene
- no line-network / glowing-finance-stream main motif
- no repeated contract wall
- no wealth tower / monolith
- no sterile product-ad or empty black studio shot

A per-Reel image-world override is forbidden. If target `scene-index.json`, `bildwelt.txt` or `alle-bildprompts.txt` uses another world, stop as `BLOCKED` and fix the target back to the global lock. Do not weaken the validator.

## GOOGLE FLOW AUTONOMOUS IMAGE SET

Google Flow must generate the complete required image set in one continuous sequence:

```text
generate image
→ wait internally
→ inspect
→ auto-regenerate if invalid
→ exact filename
→ immediately continue
→ final summary only after all images pass
```

Never ask `Weiter?`, `Continue?`, approval or confirmation between images.

## HARD USER-MEDIA GATE

Use only:

```text
Images: <TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  <TARGET-REEL>/02-audio/
```

Before production verify every expected image, exactly one readable final audio, the exact Google-Flow cover headline, all normal images are 1:1 and every image matches the locked world.

Missing/wrong/unreadable/ambiguous user media →

```text
BLOCKED
Problem: <exact path/file/cause>
Action: <exact user action needed>
```

Antigravity never generates replacement images.

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

Use Remotion for comparison, calculations, timelines, growth, money flow, mechanisms, step sequences and changing cause/effect.

Use Google-Flow images mainly for hook, strong single symbolic metaphor and closing image — always inside the global Central-Object world.

## QUALITY GATE 2 — Inspect every supplied image

Reject if motif is wrong/unclear, generated text or labels are wrong, numbers conflict with script/research, contradictory information appears, unnecessary text repetition appears, cover headline is wrong, normal image is not 1:1, central hero object is missing or the locked image-world rules fail.

If user must regenerate → `BLOCKED`. Never hide a bad image with Remotion overlays.

## Canonical image presentation

```text
Cover: 9:16
Normal Flow scene image: 1:1, preferably 1080×1080
Reel canvas: 1080×1920
Square display: about 1000×1000, centered horizontally
```

Never stretch square images to 9:16. Do not make them tiny inset posters. Cover gets no Remotion replacement headline.

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

Current target:

```text
max 12 words
max 68 characters
max 2 lines
min effective font 42 px
bottom ≈ 430
left ≈ 72
right ≈ 170–180
```

Never show two units, overflow/clip text, shrink below safe size, fabricate timing or use opaque caption cards. Current word is green only during its real audio timing.

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
16. render preview via `npm run reel:preview -- <TARGET-REEL> --scale=0.5`
17. inspect every scene + contact sheet; fix issues
18. render full MP4 via `npm run reel:render -- <TARGET-REEL>`
19. inspect complete final MP4
20. measure audio loudness/true peak
21. fill `05-projektdateien/final-qa.json` with actual results
22. set `status: passed` only when all required QA passed
23. rerun final validation / QA
24. safety audit
25. commit + draft PR when appropriate
26. report result

## Mandatory final QA

Final QA must truthfully confirm:

- full MP4 inspected
- every scene inspected
- images semantically match voice beats
- generated text/labels correct
- all normal Flow images are 1:1
- locked Central-Object world passed
- scene/audio sync correct
- captions stay inside safe area
- active-word timing synced
- animations are meaningful mechanisms
- no long static tail
- audio levels passed

Audio target:

```text
Integrated loudness: approximately -16 LUFS (validator -17 to -15)
True Peak: <= -1 dBTP
```

Never mark QA passed without actually checking.

## Stop conditions

Only genuine blockers may stop Autopilot: missing/wrong media, image requiring user regeneration, global image-world violation, inability to produce real word alignment, external credential/quota/permission failure, prohibited repository action, or material ambiguity unresolved by target Reel files.

## Completion response

Only return `PRODUCTION COMPLETE` after all required checks truly passed. Otherwise return `BLOCKED` with exact cause/action.
