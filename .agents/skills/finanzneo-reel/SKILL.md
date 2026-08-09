---
name: finanzneo-reel
description: Safely creates, repairs or reviews FinanzNeo vertical Remotion reels while preserving repository rules, existing reels, Image World V3 consistency, karaoke captions and validation requirements.
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
- Keep the prompt contract text-free: generated scene images are expected to contain no text, numbers, labels, logos, watermarks or app UI.
- Every `03-szenen/alle-bildprompts.txt` must include the exact filename directly at each individual cover/scene prompt.
- Numbering always follows the actual chronological reel position: `Bild 00` = cover, `Bild 01` = scene 01, `Bild 02` = scene 02, and so on.
- A Remotion animation reserves its scene number but has no image file. Never close the numbering gap. Example: scene 01 image = `Bild 01`, scene 02 animation = no `Bild 02`, scene 03 image = `Bild 03`.
- Never number images by the count of image files. `scene-index.json` is the authority.
- User-created final images are collected together in `03-szenen/00-ALLE-BILDER-HIER-REIN/` after they are all generated and renamed.
- If required user images are missing, report the exact missing filenames and wait. Do not fabricate replacements.
- If a supplied image is inconsistent or incorrect, report it to the user so the user can regenerate it. Antigravity must not regenerate it.
- After all user-provided images and final audio are present, continue with the repository-supported asset ingest/sync, validation, safety check and preview.

A reel is not complete without the required user-provided images/audio or an explicit missing-asset report, real audio-derived timings, successful validation/typecheck/preview, visual review, and a clean safety audit.
