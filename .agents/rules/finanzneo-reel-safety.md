# FinanzNeo — Antigravity Safety Rules

These rules apply only to Google Antigravity in this workspace.

## Authority

1. Read `CLAUDE.md` completely.
2. Read `reels/PRODUKTIONSSTANDARD.md`.
3. This file may be stricter for Antigravity safety/execution boundaries.
4. Never weaken validators, tests, design tokens, finance calculations or standards just to make a Reel pass.

## Autopilot — mandatory after user production command

When the user says the required images and final audio are ready and instructs **„Mach das Reel“**, **„Erstelle das Reel“**, **„Mach es fertig“** or equivalent, treat that as authorization for one continuous non-destructive production run.

Do not stop between normal phases to ask `Weiter?`, `Soll ich rendern?`, `Soll ich die Untertitel machen?` or similar.

Recoverable failures are not blockers:

```text
diagnose → fix → rerun → continue
```

Continue until `PRODUCTION COMPLETE` or a genuine `BLOCKED` condition.

The production command authorizes final rendering and Antigravity technical/visual QA. It does NOT authorize merge, publish, delete, force-push or history rewrite.

## Hard target-Reel user-media boundary

For final production, user media is valid only from:

```text
<TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
<TARGET-REEL>/02-audio/
```

Required image filenames come from the target Reel's own `03-szenen/scene-index.json`.

Never use as a substitute:

- media from another Reel
- `legacy-main/`
- unrelated repository media
- Desktop/Downloads
- web/stock media
- placeholders
- previous exports
- cached files
- similarly named files outside the target Reel

Shared repository code, Remotion components, design-system files, scripts and documentation remain allowed. This restriction applies to **user-media inputs**.

Before timing/coding/rendering verify:

- every required image exists with the expected filename
- final audio exists and is readable
- exactly one final audio file is selected unambiguously
- no outside media is being substituted

Missing/wrong/unreadable/ambiguous required media → stop with:

```text
BLOCKED
Problem: <exact target-Reel path/file/cause>
Action: <exact user action required>
```

Do not guess, substitute or render a knowingly incomplete final MP4.

## Image-generation boundary

The user exclusively creates all actual FinanceNeo images.

Antigravity MAY:

- create/update image prompts
- define filenames/scene numbers
- inspect user-supplied images
- report regeneration requirements

Antigravity MUST NOT:

- generate final images
- call Imagen/Nano Banana/other image generators for replacements
- use web/stock media as replacements
- create generated placeholders
- overwrite user-provided images

If a supplied image violates a visual rule and needs regeneration, that is a real blocker requiring the user.

## Canonical Remotion presentation

The old inset `contain` presentation is forbidden for productive FinanceNeo image scenes.

Use `adaptive-safe-fill`:

- maximize the visual area between headline and captions
- crop empty seamless background before important content
- preserve face, labels, hero object and money/value
- no visible inset image panel
- no blurred duplicate image background
- per-scene focal point when necessary

Captions must use real final-audio word boundaries:

- preferred one full sentence visible
- hard max two lines
- current word follows exact real start/end timing
- no evenly estimated word timing
- hold previous sentence through short pauses
- sentence switch at next sentence's first spoken word

If exact final-audio word alignment cannot be produced with available tooling, return `BLOCKED`; never fabricate timing.

## Non-destructive repository policy

- Never work directly on `main`.
- Never merge a pull request unless the user explicitly instructs it.
- Never force-push, hard-reset shared branches, rewrite history, delete branches, delete existing Reels or overwrite previous user assets.
- New topic = new branch + new Reel directory.
- Existing Reels are read-only unless explicitly targeted.
- Do not upgrade dependencies unless explicitly requested.
- If validation fails, fix the Reel/system within the authorized scope; do not weaken validation.

## Pre-flight

Before implementation record:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
git diff --stat
git diff --name-only
```

Never destroy unrelated work.

## Final validation and completion

For final production run:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

Then TypeScript, preview, frame/contact-sheet/caption QA, full MP4 review, audio check when available and Antigravity safety audit.

If a recoverable issue appears, fix and rerun automatically.

Before claiming completion, compare against the starting HEAD and verify no unrelated destructive changes occurred.

Antigravity may create commits and a draft PR. It must not publish or merge without explicit user instruction.

Final response only:

- `PRODUCTION COMPLETE` when final MP4 and required checks truly completed.
- `BLOCKED` with exact cause/action when further progress is genuinely impossible.
