---
description: Build a complete new FinanzNeo Reel safely using user-provided images, Remotion animation, captions, platform publishing, validation and preview render.
---

# Build a complete FinanzNeo Reel

Read in this order before editing:

1. `.agents/rules/finanzneo-reel-safety.md`
2. `CLAUDE.md`
3. `reels/PRODUKTIONSSTANDARD.md`
4. `docs/FINANZNEO-IMAGE-WORLD-V3.md`
5. `docs/IMAGE-SYSTEM.md`
6. `docs/PLATFORM-PUBLISHING.md`

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

Use the simple reel structure:

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

`04-caption/` contains the master caption, Reel-platform publishing files and word timings.

## Visual plan

Default target: 10 scenes with approximately 6 image scenes and 4 native Remotion animations, unless another split is clearly stronger.

## Bildprompts — images come exclusively from the user

Antigravity generates NO images.

1. Create `03-szenen/bildwelt.txt` using the current canonical FinanzNeo image rules.
2. Create cover prompt and every required scene `bildprompt.txt`.
3. Create/update `03-szenen/alle-bildprompts.txt` in chronological order.
4. Put the exact final filename directly at every individual image prompt.
5. Put exact allowed short German object labels directly in every image prompt.
6. Never create headline, subtitle, full explanatory sentence or CTA inside generated images.
7. Use one dominant financial metaphor / large hero object and only a few supporting elements.
8. A stylized adult 3D person is optional. If present, the face must be clearly visible with stylized eyes, nose and mouth; prefer front-facing or natural three-quarter view. No faceless/back-view-only character.
9. Use Premium Fintech Editorial 3D: deep charcoal green-black, emerald/mint accents, gold for money/value, warm red-orange for risk/loss, rounded geometry and bold rim light.
10. Never use percentage-based top/middle/bottom zones.
11. Every prompt requires ONE seamless continuous background from top edge to bottom edge: no horizontal bands, top/bottom sections, floor-wall boundary, horizon line or panels. Leave natural empty space above/below without changing the background.
12. No tiny diorama, game-level, neon tunnel, sci-fi corridor or UI dashboard.
13. Relevant real brands/services may be used as concrete examples when useful; spell them correctly and do not imply an invented partnership.
14. `Bild 00` is the cover. Every scene image uses its REAL chronological scene number.
15. A Remotion animation keeps its scene number but gets no image. Never close the numbering gap.
16. `scene-index.json` is the authority for numbering and scene type.
17. The user creates ALL final images externally. Antigravity must not call image generators, web image search, stock images or placeholders.

Google Flow user workflow:

```text
one image generate
→ immediately rename
→ check metaphor + labels + face + seamless background + filename
→ only then next image
```

After ALL images are complete and correctly named, the user places them together in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Do not distribute images to individual scene folders during generation.

If required user images are missing, stop at the asset boundary and report exact missing filenames. Never fabricate replacements or overwrite user images.

## Audio and timing

Use one final voiceover and derive real word timings from that exact audio. Scene cuts follow sentence starts, not equal-duration blocks.

## Remotion

1080×1920 at 30fps. Actual scene headlines/icons are rendered in Remotion, not as large generated image typography. Images use `contain`. No blurred duplicate image background. Exactly one full subtitle sentence, current word green, max two lines, platform-safe. Animation timing is relative to actual scene duration.

## Platform publishing

Prepare these files in `04-caption/` for the same final reel:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

- `caption.txt` is the verified master caption/facts basis.
- Instagram Reels: caption, CTA, source/note, hashtags, optional pinned comment.
- TikTok: short caption, CTA, source/note, hashtags.
- Facebook Reels: reel text, CTA, source/note, hashtags.
- Snapchat: very short caption, optional CTA, note only when needed.
- Never create `youtube-shorts.txt` and never prepare a YouTube Shorts upload.
- YouTube is exclusively a separate long-form workflow under `youtube/`; Reel projects are not mirrored there.
- Never invent new facts for a platform file.
- If exact current limits/features matter, verify official platform documentation before publishing.

## Validation

If required user images or final audio are missing, report waiting for assets and do not claim final render.

When assets exist:

- supported asset ingest/sync
- source-contract validation
- TypeScript check
- preview render
- inspect first/middle/last frame of each scene
- inspect captions/transitions
- contact-sheet review
- full MP4 review
- explicitly reject any image with two background bands/zones or a faceless person
- target audio around -16 LUFS and <= -1 dBTP true peak

## Safety audit

Run:

```bash
npm run antigravity:safety -- <starting-head>
```

Create a draft PR only. Never merge.
