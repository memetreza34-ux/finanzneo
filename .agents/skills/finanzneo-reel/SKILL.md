---
name: finanzneo-reel
description: Safely creates, repairs or reviews FinanzNeo vertical Remotion reels while preserving repository rules, stylized 3D image consistency, scene headers, readable karaoke captions, animation clarity, platform publishing and validation requirements.
---

# FinanzNeo Reel Skill

Read these first and treat them as authoritative:

1. `CLAUDE.md`
2. `reels/PRODUKTIONSSTANDARD.md`
3. `docs/IMAGE-SYSTEM.md`
4. `docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md`
5. `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`
6. `docs/PLATFORM-PUBLISHING.md`
7. target reel `03-szenen/alle-bildprompts.txt`
8. target reel `03-szenen/scene-index.json`

`CLAUDE.md` wins on conflicts.

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

## Stylized 3D Editorial V5 — mandatory for new prompts

Every new FinanzNeo image must be a **clearly stylized premium 3D CGI financial editorial explainer** built from recognizable everyday objects.

Do NOT interpret finance as:

- photorealistic office/stationery photography
- flat paper still-life
- fintech software/dashboard/app UI
- gameboard/control panel/module system

Required:

- ONE large recognizable stylized 3D hero object
- 2–5 concrete topic-specific stylized 3D supporting objects when useful
- chunky substantial volume
- smooth rounded forms and soft bevels
- simplified slightly exaggerated proportions
- natural asymmetry, slight overlap, foreground/midground/background depth
- cinematic soft key light + controlled emerald rim light
- premium emerald polymer/brushed metal, warm cream card material, restrained glass
- chunky gold only for money/value
- warm red-orange only for warning/loss/unwanted cost
- deep charcoal green-black seamless world
- clearly NOT photorealistic, NOT Pixar, NOT clay, NOT toy-like

Hard forbidden screenshot failure mode:

- realistic calendar/receipt/contract/product photo
- digital dashboard, app UI, screen, HUD or control panel
- central rectangular board/tablet/panel
- repeated rectangular cards, tiles or blocks as composition language
- floating cards, chips, badges, buttons or widgets
- microchip/circuit-board look
- circular orbit or ring of modules
- gameboard/board-game composition
- mechanical inspection gate or conveyor-board layout
- neon connector lines, rails, tracks, tubes or abstract finance streams
- tiny isometric diorama
- sterile product plinth

## NO image-reference rule — critical

Do NOT upload, attach or use `Bild 00` or any prior scene as an image-to-image/reference image for later Reel scenes.

Same-world consistency comes from repeating the same WRITTEN:

- world ID
- stylized-3D lock
- materials
- color roles
- background
- lighting signature
- geometry language

in every image prompt.

This prevents Flow from copying camera angle, silhouette or composition through the entire series.

## Labels inside generated images

Allowed:

- only explicitly requested short German object labels
- normally 1–3 words
- physical presentation on modeled tags/cards/objects

Forbidden:

- headline
- subtitle
- explanatory sentence
- CTA
- random extra labels
- floating/glowing UI labels

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
→ check stylized-3D quality + everyday clarity + labels + background + filename
→ reject photo/UI/gameboard/module result
→ only then next image
```

After ALL images are complete and renamed, collect them in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## Visual timing — mandatory

Target roughly 60% image beats / 40% native Remotion animations, but clarity wins over a rigid quota.

- image beat ideal: 3.5–5.5 s
- image beat absolute max: 6.0 s
- animation beat ideal: 4.5–7.0 s
- if an image would need >6 s: split it or animate it
- one main idea per beat
- viewer should understand an image in under 2 s

## Scene header — mandatory on EVERY scene

Every image and animation scene must render a clear top header with a matching icon.

Preferred implementation:

```tsx
<SceneHeader title="KONTOAUSZUG PRÜFEN" icon="search" />
```

Rules:

- icon normally FinanzNeo green
- headline white
- consistent top position
- short direct wording
- red only for warning/problem
- gold only for money/value
- never black text on dark scene background

## Animation clarity — mandatory

Every native Remotion explainer animation must have:

```text
START
→ VISIBLE MECHANISM / CHANGE
→ RESULT
```

- motion itself explains the point
- no zoom/fade/number-popup-only animation
- start and result must be visibly distinguishable
- for complex animations use `MechanismCue`
- animation should be basically understandable with sound muted

Animation color system from `ANIMATION_COLORS`:

- white = neutral information
- green = focus/solution/core explanation
- red = warning/problem/loss/unnecessary cost
- gold = money/value/result amount
- black = forbidden on dark Reel surfaces

## Audio, captions and finalization

After all user images and final audio are present:

- use real audio-derived word timings
- scene cuts follow sentence starts and meaningful phrase starts when needed for the 6-second rule
- one sentence-based subtitle unit visible
- active spoken word ALWAYS green
- remaining words ALWAYS white
- no yellow/gold karaoke active word
- no black subtitle text
- max two subtitle lines
- no word jump
- no scale-pop
- hold previous caption over short pauses
- no caption gaps
- images use `contain`
- no visible blurred duplicate image background
- validate/safety-check/typecheck/preview before claiming completion
- inspect image set/contact sheet and full MP4
- review animation clarity once with sound muted
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

A reel is not complete without required user assets, real audio timings, successful validation/typecheck/preview, visual review, scene-header review, caption-color review, animation-without-sound review and safety audit.
