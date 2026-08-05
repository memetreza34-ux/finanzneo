# FinanzNeo – Codex repository rules

These instructions apply to the technical workspace inside `alles/`. The repository root contains the user-facing areas `reels/`, `youtube/` and `alles/`.

## Mission

Codex implements FinanzNeo reels from a complete, user-approved handoff package. The creative plan is prepared before Codex starts. Codex is responsible for repository work, Remotion implementation, asset integration, validation, rendering and a precise completion report.

Codex must not silently rewrite the topic, script, scene order, image prompts, cover text, financial claims or approved visual concept.

## Working directories

- Run technical commands from `alles/`.
- Active reel projects live outside this folder under `../reels/<week>/<weekday>/<reel-name>/`.
- YouTube projects live under `../youtube/`.
- Do not recreate a root-level `channels/` folder.
- Do not place reel projects back under `alles/channels/finanzneo/reels/`.

## Source-of-truth order

1. The user's current task.
2. `<project>/timeline/codex-reel-package.json`.
3. `<project>/03-szenen/scene-index.json` and `<project>/05-review/production-status.json`.
4. The closest nested `AGENTS.md`.
5. Existing repository documentation and reusable components.

If these sources conflict, stop and report the exact conflict instead of guessing.

## Git and safety

- Inspect `git status`, the current branch and existing work before changing files.
- Never work directly on `main`.
- Never merge a pull request.
- Never mark a draft pull request ready for review.
- Never apply, drop or rewrite an unrelated stash.
- Never use destructive commands such as `git reset --hard` or `git clean -fd` unless the user explicitly requests them.
- Keep every reel or workflow change isolated on its own branch.
- Do not activate global animation feature flags, automatic routing or production integrations without explicit user approval.
- Do not replace the current production composition merely to make a test render easier.

## Asset integrity

- Never invent image, audio, caption, font or sound-effect files.
- Never claim an asset exists without checking the file system.
- Never generate replacement images or voiceover when the handoff says the user supplies them.
- If required assets are missing, stop and print the exact missing paths.
- Use the supplied script and media filenames exactly unless a verified repository constraint requires a change. Report every required rename.

## Required implementation sequence

1. Read the root `AGENTS.md`, this file and `channels/finanzneo/AGENTS.md`.
2. Locate the active reel under `../reels/` and read its timeline package, scene index and production status.
3. Run the Codex package validator before writing reel code.
4. Confirm that image scenes outnumber Remotion animation scenes.
5. Confirm that every animation explains a process, transformation, timing relationship or cause-and-effect action that a still image cannot explain as clearly.
6. Build the reel in an isolated source directory under `channels/finanzneo/src/reels/`.
7. Reuse tested primitives where useful, but create reel-specific narrative animation components when the package requires them.
8. Integrate voiceover, captions, image motion, overlays, transitions and sound cues exactly as specified.
9. Run the required validation, still and render commands.
10. Inspect the complete MP4 and representative frames before describing visual quality.

## Quality boundaries

- Technical success is not creative approval.
- Different component names do not prove visual variety.
- Do not turn image scenes into dashboard cards.
- Do not repeat the same comparison as bars, lines, cards and counters.
- Do not add animation merely to increase movement.
- Maintain a permanent subtitle-safe zone.
- Preserve phone readability at 1080 × 1920.
- Use the supplied cover text exactly and keep it readable at thumbnail size.

## Completion report

Always distinguish:

1. files implemented,
2. commands executed,
3. tests that actually passed,
4. render outputs that actually exist,
5. manual visual checks actually completed,
6. missing assets or unresolved defects,
7. production integration status,
8. merge status.

Never claim GitHub Actions passed when no runner steps and logs exist.
