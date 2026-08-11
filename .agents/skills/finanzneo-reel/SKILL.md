---
name: finanzneo-reel
description: Build, repair and finish FinanzNeo vertical Remotion reels with strict user-media boundaries, full-frame user visuals, exact final-audio captions and one universal social caption.
---

# FinanzNeo Reel Skill

Read first:

1. `CLAUDE.md`
2. `reels/PRODUKTIONSSTANDARD.md`
3. `.agents/rules/finanzneo-reel-safety.md`
4. target Reel `03-szenen/scene-index.json`
5. target Reel `03-szenen/alle-bildprompts.txt`

`CLAUDE.md` is the production/style authority. Stricter Antigravity safety rules remain binding.

## Autopilot

If the user says the required images and final audio are ready and asks to make/finish the Reel, execute one continuous production run. Do not ask for `weiter` between normal phases.

Recoverable failures are work to fix:

```text
diagnose → fix → rerun → continue
```

Stop only for a genuine blocker. The production command authorizes final render + Antigravity QA, not merge/publish/delete/force-push/history rewrite.

## Hard target-Reel media boundary

User media is valid only from:

```text
<TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
<TARGET-REEL>/02-audio/
```

- Required image filenames come from the target Reel's `scene-index.json`.
- Exactly one final audio file is required for final production.
- Never use another Reel, `legacy-main`, Desktop/Downloads, web/stock media, placeholders, old exports, caches or similarly named outside files.
- Never guess or substitute missing media.
- Shared repo code/design-system/scripts/docs remain allowed.

Missing/wrong/unreadable/ambiguous required media → **BLOCKED** with exact path/file and exact user action.

## Images belong to the user

Antigravity may create prompts and inspect supplied images but MUST NOT generate final images or replacement media.

Google Flow numbering:

- `Bild 00` = cover
- image scene uses its real scene number
- animation keeps its number but has no image
- never close gaps

Final images are collected only in `03-szenen/00-ALLE-BILDER-HIER-REIN/`.

## Image-world rules

- Premium Fintech Editorial 3D
- one dominant financial metaphor / hero object
- optional stylized adult; visible face required when present
- deep charcoal green-black
- emerald/mint accents
- gold for money/value
- red-orange for loss/risk/debt
- short German object labels only, normally 1–3 words
- no generated headline/subtitle/full explanatory sentence
- no Pixar/clay/photorealism/diorama/neon tunnel/sci-fi corridor/dashboard
- one seamless continuous background from top to bottom
- no percentage zones, bands, floor-wall boundary, horizon or panels

## Remotion image presentation — mandatory

Use **full-frame-no-crop** for productive user-image scenes:

- complete vertical 9:16 source spans the full 1080×1920 scene
- never wrap user images in `VisualStage` or a smaller middle container
- no intentional crop, zoom/focal-point contract or visible inset panel
- no blurred duplicate image background
- headline and subtitle are overlays over the same full image
- only a soft continuous transparent readability scrim is allowed; no hard header/footer background blocks
- `object-fit: contain` is allowed only across the complete 1080×1920 scene for a vertical 9:16 source

Use `src/design-system/FullFrameImage.tsx` for new productive image scenes.

Native Remotion animation scenes must use one continuous full-canvas background with no floor, horizon, wall split or segmented studio stage.

Target layout at 1080×1920:

```text
headlineTop ≈ 72
image scene = full Y 0–1920
animation content ≈ Y 220–1490
subtitleBottom ≈ 300
subtitleLeft ≈ 64
subtitleRight ≈ 156
platform UI bottom safe zone ≥ 260
```

## Captions and timing

Use only real word-level start/end timestamps derived from the exact final audio in `02-audio/`.

Never evenly distribute or estimate word times.

Caption behavior inside the video:

- **exactly one complete sentence visible at a time**
- never two sentences simultaneously
- hard max two lines
- use a readable smartphone font size; split/rewrite an overlong sentence instead of making captions tiny
- active spoken word green, rest white
- hold previous sentence through short pauses
- switch exactly at the first spoken word of the next sentence
- no dead gaps
- no opaque/black caption card

Use `src/design-system/SentenceKaraokeCaptions.tsx` for new productive reels.

Final `word-timings.json` must have `timingStatus: final-audio-aligned`. If exact word alignment cannot be produced, report **BLOCKED** instead of estimating.

## Universal social caption — mandatory

Create exactly **one** publishing caption:

```text
<TARGET-REEL>/04-caption/caption.txt
```

The exact same caption is used unchanged for Instagram Reels, TikTok, Facebook Reels and Snapchat.

Rules:

- no per-platform variants
- final file contains copy-ready text, no `CAPTION:`/`CTA:` template headers
- first line is a strong but truthful hook
- then concise core value / aha from the Reel
- optional natural save/follow/comment CTA
- **exactly 5 relevant hashtags**
- no random trend tags, hashtag spam or irrelevant `#fyp`
- no viral guarantee or misleading clickbait
- no facts beyond verified script/research

Do not create or keep these active publishing files:

```text
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
youtube-shorts.txt
```

`word-timings.json` remains separate because it powers in-video subtitles, not social publishing.

## End-to-end finalization

When the media gate passes, continue automatically through:

1. target-media ingest/sync
2. real final-audio word timings
3. sentence-based scene timing
4. Remotion implementation
5. full-frame-no-crop user-image integration
6. exactly-one-sentence karaoke captions
7. one universal social caption with exactly 5 relevant hashtags
8. final validator
9. TypeScript
10. preview render
11. visual QA: first/middle/last frame of every scene + contact sheet
12. explicitly reject second background areas, chopped image bottoms, hard header/footer blocks, inset image panels, opaque caption cards or tiny/unsafe captions
13. full MP4 render/review with audio
14. audio-level check when available
15. fix and rerun every recoverable issue
16. safety audit
17. commit + draft PR when appropriate

Final validation:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

No YouTube Shorts. YouTube is separate Longform under `youtube/`.

## Final response

Only:

- **PRODUCTION COMPLETE** — final MP4 exists and required checks really completed.
- **BLOCKED** — exact blocker and exact user action.

Never end a normal production phase by asking `Weiter?`.
