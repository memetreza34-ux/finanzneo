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

## Image generation — Antigravity only
For Antigravity-produced reels, generate the final scene images inside Antigravity whenever its integrated image tool is available.
- First generate `03-szenen/bildwelt-referenz.png` from `03-szenen/bildwelt.txt`.
- Then generate every image scene from its `bildprompt.txt` using that exact reference.
- Prefer an explicitly exposed `Image 3` / `Imagen 3` option if Antigravity actually offers it.
- If it does not, use Antigravity's native generative-image tool and record the actual system used. Never pretend another model is Image 3.
- Never silently fall back to web images, stock images, placeholders or a different visual world.
- Generated scene images contain no text, numbers, labels, logos, watermarks or app UI.
- Review all generated images together as one contact sheet and regenerate inconsistent frames.

## Final permission boundary
Antigravity may create commits and a draft PR. It must not merge, publish, delete previous work or mark a reel final without explicit user instruction.
