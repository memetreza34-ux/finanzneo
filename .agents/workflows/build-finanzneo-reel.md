---
description: Build a complete new FinanzNeo Reel safely, including images, Remotion animation, captions, validation and preview render.
---

# Build a complete FinanzNeo Reel

Read `.agents/rules/finanzneo-reel-safety.md`, `CLAUDE.md` and all linked production documents first.

## Pre-flight
Run:
```bash
git status --short
git branch --show-current
git rev-parse HEAD
git diff --stat
git diff --name-only
```
Record the starting HEAD. Never clean unrelated work destructively.

## Topic and branch
Search existing reels so the topic is genuinely new. Create a dedicated `reel/YYYY-MM-DD-topic-slug` branch and a new reel folder.

Immediately initialize the central image inbox:

```bash
npm run reel:sort-images -- <REEL-ORDNER>
```

This creates `03-szenen/BILDER-EINGANG/` when it does not exist.

## Visual plan
Default target: 10 scenes with 6 Image World V3 scenes and 4 native Remotion animations, unless a different split is clearly stronger.

## Generate images inside Antigravity
1. Create `03-szenen/bildwelt.txt`.
2. Generate `03-szenen/bildwelt-referenz.png`.
3. If Antigravity explicitly offers **Image 3 / Imagen 3**, use it.
4. Otherwise use Antigravity's integrated generative-image tool and record the real tool/model in `05-review/image-generation-report.md`.
5. Generate each final image from its scene prompt while attaching the same world reference.
6. No text, numbers, labels, logos, UI, web images or stock images.
7. Save every generated final image first into `03-szenen/BILDER-EINGANG/` with its destination number:
   - `Bild 00` = Cover
   - `Bild 01` = Szene 01
   - `Bild 02` = Szene 02
   - usw.
8. Do not manually drag files into individual scene folders.
9. Inspect all generated images side by side and regenerate inconsistent images before sorting.
10. Run a dry run first:

```bash
npm run reel:sort-images -- <REEL-ORDNER> --dry-run
```

11. If the mapping is correct, run:

```bash
npm run reel:sort-images -- <REEL-ORDNER>
```

The sorter must refuse duplicates, unknown scene numbers, animation scenes and existing destination images. Never bypass those protections.

## Audio and timing
Use one final voiceover and derive real word timings from that audio. Scene cuts follow sentence starts, not equal-duration blocks.

## Remotion
1080×1920 at 30fps. Headline plus matching icon on top. Images use `contain`. No blurred image copy as background. Exactly one full subtitle sentence, current word green, max two lines, safe above platform controls. Animation timing is relative to actual scene duration.

## Validation
Before asset sync or rendering, confirm `BILDER-EINGANG` contains no still-unresolved numbered image files. Then run asset sync, source-contract validation, TypeScript check and preview render. Inspect first/middle/last frame of each scene, transitions, captions, contact sheet and full MP4. Target voiceover around -16 LUFS and no higher than about -1 dBTP true peak.

## Safety audit
Run:
```bash
npm run antigravity:safety -- <starting-head>
```
Existing reels, core rules, dependencies, lockfiles and assets must remain untouched unless explicitly authorized. Create a draft PR only. Never merge.
