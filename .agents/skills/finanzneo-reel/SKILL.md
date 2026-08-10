---
name: finanzneo-reel
description: Safely creates, repairs or reviews FinanzNeo vertical Remotion reels while preserving repository rules, image-prompt consistency, karaoke captions and validation requirements.
---

# FinanzNeo Reel Skill

Load this skill for FinanzNeo reel, Remotion, scene image, image prompt, voiceover timing, caption timing, render or QA tasks.

Read `.agents/rules/finanzneo-reel-safety.md`, `CLAUDE.md`, linked production docs and target reel metadata before editing.

- Preserve production quality and shared infrastructure.
- Prefer additive reel-specific changes.
- New topic = new branch + new reel folder.
- Never merge or rewrite shared history.
- Existing reels are read-only unless explicitly targeted.
- Antigravity prepares image prompts and filenames, but MUST NOT generate any final image or world-reference image.
- The user exclusively creates `bildwelt-referenz.png`, the cover image and all final scene images outside Antigravity.
- Never call Antigravity's integrated image generator, Imagen, Nano Banana, web image search, stock-image sources or placeholder-image generation as a substitute.

## Verbindlicher Bildprompt-Stil

Every generated-image prompt must follow the FinanzNeo Premium Fintech Editorial 3D reference from `CLAUDE.md` and `docs/FINANZNEO-IMAGE-WORLD-V3.md`:

- one dominant financial metaphor or one large hero object
- a stylized anonymous 3D adult person may stand beside the metaphor when useful
- whenever a person appears, the face must be clearly visible with stylized eyes, nose and mouth
- prefer front-facing or a natural three-quarter view
- no faceless mannequin, blank face, hidden face or back-view-only person
- ONE seamless deep charcoal green-black background from top edge to bottom edge
- no horizontal top band, bottom band, tonal slab, panel or visible background transition
- top 15 percent contains no objects/labels/effects but uses the SAME continuous background
- bottom 25 percent contains no objects/labels/effects but uses the SAME continuous background
- vivid emerald and mint-green accents
- gold only for money/value
- warm red-orange only for loss, risk, debt or blocked money
- smooth rounded 3D geometry
- soft bevelled edges
- confident high-contrast studio lighting with bold emerald rim light
- no photorealism, no real humans, no UI dashboards
- no tiny diorama, neon tunnel, sci-fi corridor or miniature game level

Generated images may contain ONLY the explicitly requested short German object labels, normally 1–3 words, placed directly near the related object. No headline, subtitle, explanatory sentence, CTA, random labels or English text.

- Every `03-szenen/alle-bildprompts.txt` must include the exact filename directly at each individual cover/scene prompt.
- Numbering always follows the actual chronological reel position: `Bild 00` = cover, `Bild 01` = scene 01, `Bild 02` = scene 02, and so on.
- A Remotion animation reserves its scene number but has no image file. Never close the numbering gap. Example: scene 01 image = `Bild 01`, scene 02 animation = no `Bild 02`, scene 03 image = `Bild 03`.
- Never number images by the count of image files. `scene-index.json` is the authority.
- User-created final images are collected together in `03-szenen/00-ALLE-BILDER-HIER-REIN/` after they are all generated and renamed.
- If required user images are missing, report the exact missing filenames and wait. Do not fabricate replacements.
- If a supplied image contains background bands/transitions, a faceless/hidden-face person, wrong labels, a wrong visual world or another inconsistency, report it to the user so the user can regenerate it. Antigravity must not regenerate it.
- After all user-provided images and final audio are present, continue with the repository-supported asset ingest/sync, validation, safety check and preview.

A reel is not complete without the required user-provided images/audio or an explicit missing-asset report, real audio-derived timings, successful validation/typecheck/preview, visual review, and a clean safety audit.