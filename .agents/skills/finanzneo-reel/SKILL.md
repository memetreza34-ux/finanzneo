---
name: finanzneo-reel
description: Safely creates, repairs or reviews FinanzNeo vertical Remotion reels while preserving repository rules, image-prompt consistency, karaoke captions, platform publishing and validation requirements.
---

# FinanzNeo Reel Skill

Read these first and treat them as authoritative:

1. `CLAUDE.md`
2. `reels/PRODUKTIONSSTANDARD.md`
3. `docs/IMAGE-SYSTEM.md`
4. `docs/FINANZNEO-IMAGE-WORLD-V3.md`
5. `docs/PLATFORM-PUBLISHING.md`
6. target reel `03-szenen/alle-bildprompts.txt`
7. target reel `03-szenen/scene-index.json`

`CLAUDE.md` wins on conflicts. For image composition, the current Physical Explainer rules in `docs/IMAGE-SYSTEM.md` override older softer examples.

## Repository safety

- New topic = new branch + new reel folder.
- Never work directly on main.
- Never merge, force-push, rewrite shared history or delete branches/reels/assets unless explicitly requested.
- Existing reels are read-only unless explicitly targeted.
- Do not weaken validators, tests, finance calculations or lockfiles.

## Images belong to the user

- Antigravity prepares image prompts, filenames and QA rules.
- Antigravity MUST NOT generate cover images, scene images or world-reference images.
- Never call Antigravity image generation, Imagen, Nano Banana, web image search, stock images or placeholders as substitutes.
- If a required user image is missing, report the exact filename and wait.

## Physical Explainer V4 — mandatory for new prompts

Every new FinanzNeo image must be a premium stylized 3D **financial editorial explainer built from recognizable physical objects**.

Do NOT interpret finance as fintech software, dashboards, app UI or control panels.

Required:

- ONE large recognizable physical hero object
- a few concrete topic-specific physical supporting objects
- natural asymmetry, slight overlap, foreground/midground depth
- soft local contact shadows
- front-facing or gentle natural three-quarter camera
- substantial physical materials: paper, brushed metal, glass, premium plastic
- deep charcoal green-black world
- emerald/mint used sparingly as rim-light/accent, not as UI outlines
- gold only for money/value
- warm red-orange only for warning/loss/unwanted cost

Hard forbidden screenshot failure mode:

- digital dashboard, app UI, screen, HUD or control panel
- central rectangular board/tablet/panel
- repeated rectangular cards, tiles or blocks as the composition language
- floating cards, chips, badges, buttons or widgets
- microchip/circuit-board look
- circular orbit or ring of modules
- twelve-slot mechanism
- gameboard/board-game composition
- mechanical inspection gate or conveyor-board layout
- neon connector lines, rails, tracks, tubes or abstract finance streams
- four-corner module layout
- tiny isometric diorama
- sterile product plinth

## Cover-reference rule — critical

Do NOT upload, attach or use `Bild 00` as an image-to-image/reference image for later scenes.

Same-world consistency must come from repeating the same WRITTEN material/light/color/background lock in every prompt. This prevents Flow from copying the cover camera angle, board shape, silhouette or object arrangement into the entire series.

## Labels inside generated images

Allowed:

- only explicitly requested short German object labels
- normally 1–3 words
- physical presentation: printed on paper tags, stickers, receipts or small attached plaques

Forbidden:

- headline
- subtitle
- explanatory sentence
- CTA
- random extra labels
- floating/glowing labels
- digital badges or UI chips

If a person appears: stylized adult, face clearly visible with eyes/nose/mouth, front-facing or natural three-quarter view. No faceless mannequin or back-view-only person.

## Seamless-background rule

Every prompt must demand:

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image.
No horizontal divisions, top/bottom sections, floor-wall boundary, horizon line, panels or background bands.
Use only one subtle continuous gradient/vignette.
Objects may cast soft local contact shadows without creating a visible floor plane.
```

## Google Flow filenames and numbering

Every `03-szenen/alle-bildprompts.txt` must put the exact final filename directly at each image prompt.

- `Bild 00` = cover
- scene image uses its real chronological scene number
- Remotion animation reserves its number and has no image
- never close numbering gaps

Workflow:

```text
1 image generate
→ wait completely
→ immediately rename
→ check physical-object composition + labels + background + filename
→ reject any board/UI/gameboard/module result
→ only then next image
```

After ALL images are complete and renamed, collect them in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## Audio, captions and finalization

After all user images and final audio are present:

- use real audio-derived word timings
- scene cuts follow sentence starts
- one full subtitle sentence visible
- active spoken word green, remaining words white
- max two subtitle lines
- images use `contain`
- no visible blurred duplicate image background
- validate/safety-check/typecheck/preview before claiming completion
- inspect image set/contact sheet and full MP4
- target audio around -16 LUFS and <= -1 dBTP true peak

## Platform publishing

Keep the simple five-folder reel structure. Publishing files live directly in `04-caption/`:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Never create `youtube-shorts.txt`. YouTube remains a separate long-form workflow under `youtube/`.

A reel is not complete without required user assets, real audio timings, successful validation/typecheck/preview, visual review and safety audit.
