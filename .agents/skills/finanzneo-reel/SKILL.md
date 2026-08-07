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
- In Antigravity, generate actual scene images when the integrated image tool is available; do not stop after prompts.
- Prefer explicitly available Image 3 / Imagen 3; otherwise use the native Antigravity image generator and disclose its actual identity.
- Run validation, safety check and preview before reporting success.

A reel is not complete without final images/audio or an explicit missing-asset report, real audio-derived timings, successful validation/typecheck/preview, visual review, and a clean safety audit.
