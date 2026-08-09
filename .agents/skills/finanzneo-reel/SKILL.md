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
- Keep scene images text-free and consistent through one shared Image World V3 reference.
- Every new reel gets `03-szenen/BILDER-EINGANG/` before final images are supplied.
- The user may put all final images into that one folder instead of sorting them manually.
- Numbering is authoritative and always follows the actual chronological reel position: `Bild 00` = cover, `Bild 01` = scene 01, `Bild 02` = scene 02, and so on.
- A Remotion animation reserves its scene number but has no image file. Never close the numbering gap. Example: scene 01 image = `Bild 01`, scene 02 animation = no `Bild 02`, scene 03 image = `Bild 03`.
- Never number images by the count of generated image files. `scene-index.json` is the authority.
- Every `03-szenen/alle-bildprompts.txt` must end with the explicit filename/numeration instructions for that reel, including which scene numbers are animation gaps.
- Before moving anything, run `npm run reel:sort-images -- <REEL-ORDNER> --dry-run`.
- If the dry run is clean, run `npm run reel:sort-images -- <REEL-ORDNER>` and let the sorter place the images.
- Never manually bypass duplicate, animation-scene, invalid-number or overwrite protections.
- In Antigravity, generate actual scene images when the integrated image tool is available; do not stop after prompts.
- Prefer explicitly available Image 3 / Imagen 3; otherwise use the native Antigravity image generator and disclose its actual identity.
- When Antigravity generates images, save the finals first into `BILDER-EINGANG` with the correct real scene numbers and then use the same sorter.
- Run validation, safety check and preview before reporting success.

A reel is not complete without final images/audio or an explicit missing-asset report, real audio-derived timings, successful validation/typecheck/preview, visual review, and a clean safety audit.
