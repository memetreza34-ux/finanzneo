---
name: finanzneo-reel
description: Safely creates, repairs or reviews FinanzNeo vertical Remotion reels while preserving repository rules, image-prompt consistency, karaoke captions, platform publishing and validation requirements.
---

# FinanzNeo Reel Skill

Read these first and treat them as authoritative:

1. `CLAUDE.md`
2. `reels/PRODUKTIONSSTANDARD.md`
3. `docs/FINANZNEO-IMAGE-WORLD-V3.md`
4. `docs/IMAGE-SYSTEM.md`
5. `docs/PLATFORM-PUBLISHING.md`
6. target reel `03-szenen/alle-bildprompts.txt`
7. target reel `03-szenen/scene-index.json`

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

## Final image-prompt style

Every image prompt follows the canonical FinanzNeo style:

- Premium fintech editorial 3D render
- ONE dominant financial metaphor / large hero object
- optional stylized anonymous adult 3D person
- if a person appears: clearly visible face, stylized eyes/nose/mouth, front-facing or natural three-quarter view
- no faceless mannequin, hidden face or back-view-only person
- deep charcoal green-black world
- vivid emerald/mint accents
- gold only for money/value
- warm red-orange only for risk/loss/debt
- smooth rounded 3D geometry, soft bevelled edges
- confident high-contrast lighting with emerald rim light
- no photorealism, real identifiable human, Pixar or clay
- no tiny diorama, neon tunnel, sci-fi corridor, dashboard or game-level layout

## Seamless-background rule — critical

**Do not use top/middle/bottom percentage zones in prompts.**

Every prompt must demand:

```text
ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
No horizontal divisions.
No visible top section or bottom section.
No separate zones or panels.
No dark/light band at the top or bottom.
No floor-wall boundary.
No horizon line.
No studio wall split.
Use only one subtle continuous gradient/vignette.
Do not create a visible floor, wall or studio horizon.
Objects may cast soft contact shadows.
Leave generous natural empty space above and below the central subject without changing the background.
```

Any image with two visible backgrounds/bands is wrong and must be reported for user regeneration.

## Text inside generated images

Allowed:

- only explicitly requested short German object labels
- normally 1–3 words
- directly near the relevant object

Forbidden:

- headline
- subtitle
- explanatory sentence
- CTA
- random extra labels
- English explanatory text

Relevant real brands/services may be used as concrete examples when the scene needs them; spell names correctly and never imply an invented partnership.

## Google Flow filenames and numbering

Every `03-szenen/alle-bildprompts.txt` must put the exact final filename directly at each individual image prompt.

- `Bild 00` = cover
- scene image uses its real chronological scene number
- Remotion animation reserves its number and has no image
- never close numbering gaps

Example:

```text
scene 01 image → Bild 01
scene 02 animation → no Bild 02
scene 03 image → Bild 03
```

Google Flow user workflow:

```text
1 image generate
→ immediately rename
→ check metaphor + labels + face + seamless background + filename
→ only then next image
```

After ALL user images are complete and renamed, collect them together in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Do not distribute them to individual scene folders at generation time.

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

- `caption.txt` is the verified master facts/caption basis.
- Instagram Reels: caption, CTA, source/note, hashtags, optional pinned comment.
- TikTok: short caption, CTA, source/note, hashtags.
- Facebook Reels: reel text, CTA, source/note, hashtags.
- Snapchat: very short caption, optional CTA, note only when needed.
- Never create `youtube-shorts.txt` or any YouTube Shorts publishing artifact.
- YouTube is exclusively a separate long-form workflow under `youtube/`; Reel projects are not mirrored to YouTube.
- Platform files must not invent facts beyond the master caption/script.
- If exact current platform limits or upload features matter, verify official platform documentation before publishing rather than hard-coding old limits.

A reel is not complete without required user assets or an explicit missing-asset report, real audio timings, successful validation/typecheck/preview, visual review and safety audit. Cross-platform Reel publishing additionally requires the four Reel platform files to be prepared for the same final reel.
