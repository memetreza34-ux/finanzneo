---
description: Build a complete new FinanzNeo Reel safely using user-provided images, Remotion animation, captions, platform publishing, validation and preview render.
---

# Build a complete FinanzNeo Reel

Read in this order before editing:

1. `.agents/rules/finanzneo-reel-safety.md`
2. `CLAUDE.md`
3. `reels/PRODUKTIONSSTANDARD.md`
4. `docs/IMAGE-SYSTEM.md`
5. `docs/FINANZNEO-IMAGE-WORLD-V3.md`
6. `docs/PLATFORM-PUBLISHING.md`

`CLAUDE.md` wins on conflicts. For image composition, use the current Physical Explainer rules from `docs/IMAGE-SYSTEM.md` and never fall back to the dashboard/board failure mode.

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

## Visual plan

Default target: 10 scenes with approximately 6 image scenes and 4 native Remotion animations, unless another split is clearly stronger.

## Bildprompts — user images only

Antigravity generates NO images.

For every image prompt:

1. Put the exact final filename directly at the prompt.
2. Put exact allowed short German object labels directly in the prompt.
3. Create a premium stylized 3D **financial editorial explainer from recognizable physical objects**.
4. Use ONE large recognizable physical hero object plus a few concrete topic-specific physical objects.
5. Use natural asymmetry, slight overlap, foreground/midground depth and soft local contact shadows.
6. Prefer front-facing or gentle natural three-quarter camera. Never tiny isometric/gameboard view.
7. Use paper, brushed metal, glass, premium plastic and real money objects; avoid abstract generic icons when a concrete object is available.
8. Deep charcoal green-black background; emerald/mint only as restrained rim light/structure accent; gold only for money/value; warm red-orange only for warning/loss/unwanted cost.
9. Labels must be physical: printed on tags, stickers, receipts or small attached plaques. Never floating/glowing UI labels.
10. Never create headline, subtitle, explanatory sentence or CTA inside generated images.
11. Every prompt requires ONE seamless continuous background from top edge to bottom edge; no floor-wall boundary, horizon, bands or panels.
12. `Bild 00` is the cover; scene images use their REAL chronological scene number. Remotion numbers remain reserved.
13. `scene-index.json` is the authority for numbering and scene type.
14. The user creates all final images externally.

## Hard reject: dashboard/board failure mode

Reject and regenerate any image containing:

- dashboard, app UI, software screen, HUD or control panel
- central rectangular board/tablet/panel
- repeated rectangular cards/tiles/blocks as the main visual language
- floating cards, chips, badges, buttons or widgets
- microchip/circuit-board styling
- circular orbit or ring of modules
- twelve-slot mechanism
- gameboard/board-game layout
- mechanical inspection gate / conveyor-board composition
- neon connector lines, rails, tracks, tubes or abstract finance streams
- four-corner mini-module layout
- tiny isometric diorama
- sterile product-ad plinth

## Cover-reference rule

Do NOT upload, attach or use `Bild 00` as an image-to-image/reference image for later scenes.

Consistency comes from repeating the same written material/light/color/background lock in every image prompt. Later scenes must not inherit the cover camera angle, silhouette, board shape, object arrangement or geometry.

## Google Flow user workflow

```text
one image generate
→ wait completely
→ immediately rename
→ check physical objects + labels + background + filename
→ reject board/UI/gameboard/module results
→ only then next image
```

After ALL images are complete and correctly named, the user places them together in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

If required user images are missing, stop at the asset boundary and report exact missing filenames. Never fabricate replacements.

## Audio and timing

Use one final voiceover and derive real word timings from that exact audio. Scene cuts follow sentence starts, not equal-duration blocks.

## Remotion

1080×1920 at 30fps. Headlines/icons are rendered in Remotion. Images use `contain`. No blurred duplicate image background. Exactly one full subtitle sentence, current word green, max two lines, platform-safe. Animation timing is relative to actual scene duration.

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

## Validation

When assets exist:

- supported asset ingest/sync
- source-contract validation
- TypeScript check
- preview render
- inspect first/middle/last frame of each scene
- inspect captions/transitions
- contact-sheet review
- full MP4 review
- explicitly reject background bands, faceless people, dashboard/board/UI/module compositions
- target audio around -16 LUFS and <= -1 dBTP true peak

## Safety audit

Run:

```bash
npm run antigravity:safety -- <starting-head>
```

Create a draft PR only. Never merge.
