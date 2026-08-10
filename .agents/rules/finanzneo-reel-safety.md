# FinanzNeo — Antigravity Safety Rules

These rules apply only to Google Antigravity in this workspace.

## Highest-priority project sources
1. Read `CLAUDE.md` completely before changing anything.
2. Follow every linked FinanzNeo production standard unless this Antigravity-only file is stricter.
3. Never weaken existing rules, validators, tests, design tokens, finance calculations or production standards.

## Non-destructive repository policy
- Never work directly on `main`.
- Never merge a pull request.
- Never force-push, hard-reset shared branches, rewrite history, delete branches, delete existing reels or overwrite previous reel assets.
- Create a new branch and a new reel directory for every new topic.
- Existing reels are read-only references unless the user explicitly targets one for repair.
- Do not modify `CLAUDE.md`, `docs/FINANZNEO-IMAGE-WORLD-V3.md`, brand tokens, finance helpers, package versions, lockfiles, CI workflows or shared validators merely to make a new reel pass.
- If validation fails, fix the reel. Do not weaken the validator.
- Do not upgrade dependencies unless explicitly requested.

## Allowed scope for a new reel
Prefer only:
- one new `reels/.../<new-reel>/` folder
- one new `src/reels/<new-reel>/` folder
- one reel-specific asset-sync script
- additive npm scripts
- one additive Remotion composition registration
- `.agents/**`

Any broader change requires a concrete reason and must be reported before editing.

## Pre-flight
Before implementation run `git status --short`, record branch and HEAD, and record `git diff --stat` plus `git diff --name-only`. Never destroy unrelated local changes.

## Post-change safety review
Before claiming completion compare against the recorded starting HEAD. Verify no existing reel was deleted or unintentionally modified, no lockfile/dependency change occurred without permission, and validators/typecheck/preview all succeed.

## Image boundary — Antigravity MUST NOT generate images
The user exclusively creates all actual images for FinanzNeo reels.

Antigravity MAY:
- write `03-szenen/bildwelt.txt`
- write cover and scene `bildprompt.txt` files
- write/update `03-szenen/alle-bildprompts.txt`
- define exact expected filenames and scene numbers
- inspect user-supplied images after they are provided

Antigravity MUST NOT:
- generate `bildwelt-referenz.png`
- generate the cover image
- generate any final scene image
- call an integrated image generator, Imagen, Nano Banana or any other image-generation model
- use web images, stock images or generated placeholders as substitutes
- overwrite or replace a user-provided image

The user creates the world-reference image and all final scene images externally and places the completed, correctly named final images together in:

`03-szenen/00-ALLE-BILDER-HIER-REIN/`

If required images are missing, Antigravity must report the exact missing filenames and wait. If a supplied image is visually inconsistent or incorrect, Antigravity reports the problem to the user and does not regenerate the image itself.

## Final permission boundary
Antigravity may create commits and a draft PR. It must not merge, publish, delete previous work or mark a reel final without explicit user instruction.
