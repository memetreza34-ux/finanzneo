---
description: Build a complete new FinanzNeo Reel safely using user-provided stylized 3D images, clear Remotion animation, scene headers, captions, platform publishing, validation and preview render.
---

# Build a complete FinanzNeo Reel

Read in this order before editing:

1. `.agents/rules/finanzneo-reel-safety.md`
2. `CLAUDE.md`
3. `reels/PRODUKTIONSSTANDARD.md`
4. `docs/IMAGE-SYSTEM.md`
5. `docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md`
6. `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`
7. `docs/PLATFORM-PUBLISHING.md`

`CLAUDE.md` wins on conflicts.

## Pre-flight

Run:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
git diff --stat
git diff --name-only
```

Record starting HEAD. Never destroy unrelated work.

## Topic and branch

Search existing reels so the topic is genuinely new. Create a dedicated `reel/YYYY-MM-DD-topic-slug` branch and a new reel folder. Never work directly on main.

## Structure

Use:

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

## Visual plan and pacing

Target roughly **60% image beats / 40% native Remotion animations**, but never force the quota at the expense of pacing.

- image beat ideal: 3.5–5.5 s
- image beat absolute maximum: 6.0 s
- animation beat ideal: 4.5–7.0 s
- if one image would need >6 s: split the idea or animate it
- one clear idea per beat
- image must be readable in under 2 s
- use sentence starts and meaningful phrase starts for cuts when necessary

## Scene header — required for EVERY beat

Every image and animation scene gets:

- short intermediate headline
- matching icon
- same top placement
- white headline
- icon normally FinanzNeo-green
- red only for warning/problem
- gold only for money/value

Preferred implementation:

```tsx
<SceneHeader title="KONTOAUSZUG PRÜFEN" icon="search" />
```

## Bildprompts — user images only

Antigravity generates NO images.

For every image prompt:

1. Put the exact final filename directly at the prompt.
2. Put exact allowed short German object labels directly in the prompt.
3. Use `STYLIZED_3D_LOCK: finanzneo-stylized-3d-editorial-v5`.
4. Create a **clearly stylized premium 3D CGI financial editorial explainer** from recognizable everyday objects.
5. Use chunky substantial volumes, rounded forms, soft bevels and simplified slightly exaggerated proportions.
6. Use one dominant everyday metaphor plus 2–5 concrete supporting objects.
7. Use natural asymmetry, overlap, foreground/midground/background depth and soft contact shadows.
8. Deep charcoal green-black background; emerald/mint signature; gold only for money/value; red-orange only for warning/loss/unwanted cost.
9. No realistic office/stationery/product photography.
10. Labels are short and physically attached to modeled objects/tags; no sentence text.
11. Use ONE seamless continuous background from top to bottom; no floor-wall boundary, horizon, bands or panels.
12. `Bild 00` is cover; image scenes use real chronological scene number; animation numbers remain reserved.
13. The user creates all final images externally.

## Hard reject image modes

Reject and regenerate any image containing:

- photorealistic calendar/receipt/contract/product still-life
- dashboard, app UI, software screen, HUD or control panel
- central rectangular board/tablet/panel
- repeated UI cards/tiles/modules
- microchip/circuit-board styling
- circular orbit/module ring
- gameboard/board-game layout
- inspection gate/conveyor-board
- neon connector networks
- tiny isometric diorama
- sterile product-ad plinth

## No image-reference rule

Do NOT upload, attach or use `Bild 00` or any previous scene as an image-to-image/reference image.

Consistency comes only from repeating the same written world/material/geometry/color/light lock in every prompt. Every scene gets a fresh composition.

## Google Flow user workflow

```text
one image generate
→ wait completely
→ immediately rename
→ check stylized 3D + everyday clarity + labels + background + filename
→ reject photo/UI/gameboard/module results
→ only then next image
```

After ALL images are complete and correctly named, the user places them together in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

If required user images are missing, stop at the asset boundary and report exact missing filenames. Never fabricate replacements.

## Audio and timing

Use one final voiceover and derive real word timings from that exact audio. Cuts follow sentence starts and meaningful phrase starts when needed to honor the 6-second image limit.

## Remotion animation clarity

Every explanatory animation must be:

```text
START
→ VISIBLE MECHANISM / CHANGE
→ RESULT
```

- motion must explain, not decorate
- no zoom/fade/number-popup-only animation
- use `MechanismCue` when start/result need stronger labeling
- animation must be basically understandable with sound muted

### Colors on dark scenes

Use `ANIMATION_COLORS`:

- white = neutral information
- green = focus/solution
- red = warning/problem/loss/unnecessary cost
- gold = money/value
- black = forbidden on dark Reel surfaces

## Captions

Use the central `Captions` component:

- sentence-based caption unit
- active spoken word ALWAYS green
- remaining words ALWAYS white
- no yellow/gold active word
- no black subtitle text
- max two lines
- no word jump
- no scale-pop
- hold through short pauses
- standard position bottom 320, left 62, right 150

## Platform publishing

Prepare in `04-caption/`:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Never create `youtube-shorts.txt`; YouTube remains a separate long-form workflow.

## Validation and review

When assets exist:

- supported asset ingest/sync
- source-contract validation
- TypeScript check
- preview render
- inspect first/middle/last frame of each scene
- verify every scene has SceneHeader + icon
- verify captions: active green/rest white
- verify no black text on dark backgrounds
- verify each animation has Start → Mechanism → Result
- inspect animations once with sound muted
- contact-sheet review
- full MP4 review
- target audio around -16 LUFS and <= -1 dBTP true peak

## Safety audit

Run:

```bash
npm run antigravity:safety -- <starting-head>
```

Create a draft PR only. Never merge.
