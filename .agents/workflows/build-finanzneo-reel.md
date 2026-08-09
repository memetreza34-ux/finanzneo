---
description: Build a complete new FinanzNeo Reel safely using user-provided images, Remotion animation, captions, validation and preview render.
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

## Visual plan
Default target: 10 scenes with 6 image scenes and 4 native Remotion animations, unless a different split is clearly stronger.

## Bildprompts vorbereiten — Bilder kommen ausschließlich vom Nutzer
Antigravity erzeugt KEINE Bilder.

1. Create `03-szenen/bildwelt.txt` for the shared FinanzNeo image world.
2. Create the cover prompt and every required scene `bildprompt.txt`.
3. Create/update `03-szenen/alle-bildprompts.txt` so Google Flow can process all required image prompts in chronological order.
4. Put the exact final filename directly next to every individual image prompt.
5. Put the exact allowed short German object labels directly in every image prompt.
6. Never ask Google Flow to create a headline, subtitle, full explanatory sentence or CTA inside an image.
7. Object labels are normally 1–3 German words, directly at the related object and small-to-medium, not headline-sized.
8. Use the premium dark 3D finance look from `CLAUDE.md`: dark charcoal/deep-green environment, controlled emerald lighting, gold for money, red for risk, large clear hero objects, no tiny dioramas/tunnels.
9. `Bild 00` is the cover. Every scene image uses its REAL chronological scene number.
10. A Remotion animation keeps its scene number but gets no image. Never close the numbering gap. Example: Szene 01 image → `Bild 01`; Szene 02 animation → no `Bild 02`; Szene 03 image → `Bild 03`.
11. `scene-index.json` is the authority for scene numbers and image/animation type.
12. The user creates `bildwelt-referenz.png` and ALL final scene images externally. Antigravity must not call an integrated image generator, Imagen, Nano Banana, web image search, stock images or placeholders as a substitute.
13. The user places the completed, already correctly named images together in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

14. If required user images are missing, STOP at the asset boundary and report the exact missing filenames. Do not create replacements.
15. When user images are present, inspect numbering, scene assignment, world consistency and labels before continuing.
16. Reject/report user images with large headlines, subtitles, sentences, wrong/random English text or wrong labels; do not regenerate them yourself.
17. Never overwrite an existing user-provided image.

## Audio and timing
Use one final voiceover and derive real word timings from that audio. Scene cuts follow sentence starts, not equal-duration blocks.

## Remotion
1080×1920 at 30fps. Actual scene headlines and icons are rendered in Remotion, not generated into the image. Images use `contain`. No blurred image copy as background. Exactly one full subtitle sentence, current word green, max two lines, safe above platform controls. Animation timing is relative to actual scene duration.

## Validation
If required user images or final audio are still missing, report the reel as waiting for assets and do not claim a final render. Once the assets are present, run the repository's supported asset-ingest/sync flow, source-contract validation, TypeScript check and preview render. Inspect first/middle/last frame of each scene, transitions, captions, contact sheet and full MP4. Target voiceover around -16 LUFS and no higher than about -1 dBTP true peak.

## Safety audit
Run:
```bash
npm run antigravity:safety -- <starting-head>
```
Existing reels, core rules, dependencies, lockfiles and assets must remain untouched unless explicitly authorized. Create a draft PR only. Never merge.
