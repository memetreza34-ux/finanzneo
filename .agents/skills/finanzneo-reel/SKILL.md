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
8. `.agents/rules/finanzneo-reel-safety.md`

`CLAUDE.md` wins on general project conflicts; stricter Antigravity-only safety boundaries remain binding for Antigravity execution.

## Autopilot behavior — mandatory
When the user says that the required images and final audio are ready and asks to **make/create/finish the Reel**, treat that as a single end-to-end production instruction.

Once required assets are confirmed present, do not wait for another user message between steps. Continue automatically through asset ingest, image QA, audio-derived word timings, scene timing, Remotion implementation, captions, platform files, validators, TypeScript, preview render, visual review, full MP4 render/review, audio checks, fixes, reruns, safety audit and draft-PR preparation.

Never ask the user to type `weiter` for a normal next step. Brief progress reports are allowed, but continue immediately after them.

Recoverable implementation failures are part of the work: diagnose → fix → rerun → continue. Keep looping until production is complete or a genuine blocker exists.

A genuine blocker is limited to something Antigravity cannot safely solve itself, such as a missing/unreadable required user asset, a user image that must be externally regenerated, an unavoidable external permission/quota/credential failure, or a prohibited action such as merge/publish/delete/force-push/history rewrite.

The user's command to finish the Reel authorizes final rendering and Antigravity technical/visual QA. It does not authorize publishing or merging. Human release approval is separate and must not be used as a production checkpoint.

## Hard target-Reel media boundary — mandatory
For user-provided media, Antigravity may use **only files physically present in the explicitly targeted Reel project**.

Final images are valid only from:

```text
<TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Final voiceover is valid only from:

```text
<TARGET-REEL>/02-audio/
```

The required image filenames come from the target Reel's own `scene-index.json`, scene files and prompt filenames.

Before continuing into timing/Remotion/rendering, verify every required image exists, final audio exists and is readable, and the audio choice is unambiguous.

Never use another Reel, `legacy-main/`, unrelated repo assets, Downloads/Desktop, web/stock media, placeholders, previous exports, cached media or similarly named outside files as a replacement.

Do not guess missing media. Do not silently substitute anything.

Shared source code, Remotion components, design-system files, scripts and documentation may still be used normally. The restriction applies to the **user media inputs** for the Reel.

If even one required media file is missing, wrong, unreadable or ambiguous, STOP and return **BLOCKED** with the exact expected target-Reel path/filename. If multiple plausible final audio files exist and no Reel file identifies the intended one, list the candidates and stop rather than guessing.

If all required media is present and valid, continue Autopilot immediately without another confirmation.

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
- If all required images are present, immediately continue with the full Autopilot production run; do not ask for confirmation again.

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

After all required user images and one unambiguous final audio file are present in the target Reel, execute all of the following in one continuous run:

- use real audio-derived word timings
- derive scene cuts from sentence starts
- implement all required Remotion scenes
- one full subtitle sentence visible
- active spoken word green, remaining words white
- max two subtitle lines
- images use `contain`
- no visible blurred duplicate image background
- prepare all required Reel platform files
- validate/safety-check/typecheck
- preview render and inspect scene frames/contact sheet
- render and inspect the full MP4
- check target audio around -16 LUFS and <= -1 dBTP true peak when tooling allows
- fix every recoverable issue and rerun affected checks automatically

Do not stop after producing timings, code, a preview or the first render. Continue until the completion contract is satisfied or a genuine blocker remains.

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

## Completion response

Do not end with a generic request for the user to continue.

End only with one of these states:

- **PRODUCTION COMPLETE** — the final MP4 exists, required checks/reviews were performed, and paths/results are reported.
- **BLOCKED** — give the exact blocker and the exact target-Reel asset/action needed from the user.

A Reel is not complete without required user assets or an explicit missing-asset report, real audio timings, successful validation/typecheck/preview, visual review and safety audit. Cross-platform Reel publishing additionally requires the four Reel platform files to be prepared for the same final Reel.
