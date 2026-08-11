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
- `Bild 00` contains the exact headline required by the target Reel's `COVER-ÜBERSCHRIFT – EXAKT SO:` block

Missing/wrong/unreadable/ambiguous required media, or missing/misspelled/clipped/unreadable cover headline → stop with:

```text
BLOCKED
Problem: <exact target-Reel path/file/cause>
Action: <exact user action required>
```

Do not guess, substitute or render a knowingly incomplete final MP4.

## Image-generation boundary

The user exclusively creates all actual FinanceNeo images.

Antigravity MAY create/update image prompts, define filenames/scene numbers, inspect user-supplied images and report regeneration requirements.

Antigravity MUST NOT generate final images, call image generators for replacements, use web/stock media as replacements, create generated placeholders or overwrite user-provided images.

If a supplied image violates a visual rule and needs regeneration, that is a real blocker requiring the user.

## Cover headline boundary

`Bild 00` is the only generated-headline exception:

- one large German cover headline is mandatory directly inside the Google Flow image
- the exact text is defined in the cover prompt under `COVER-ÜBERSCHRIFT – EXAKT SO:`
- headline must clearly state the Reel topic, ideally 3–8 words, max two lines
- no subtitle, CTA or explanatory sentence
- no separate text box/header band/second background
- spelling and visibility must match exactly
- if wrong/missing/clipped/unreadable, user must regenerate the cover in Google Flow
- Antigravity MUST NOT add, replace, repair or cover the Google Flow cover headline in Remotion

Scene images `Bild 01+` remain free of generated headlines/subtitles/full explanatory sentences; only requested short object labels are allowed.

## Canonical Remotion presentation

Productive user-image scenes use **full-frame-no-crop**:

- the complete vertical 9:16 user image spans the full 1080×1920 scene
- never place the user image inside `VisualStage` or another smaller middle container
- no intentional crop, zoom/focal-point contract or blurred duplicate background
- no visible inset image panel
- scene 01+ headline and captions are overlays on the same full image
- cover receives no Remotion replacement headline
- readability may use only a soft continuous transparent scrim; no hard header/footer background blocks
- `object-fit: contain` is acceptable only on the complete 1080×1920 canvas for a vertical 9:16 source, never as an inset-poster layout

Native Remotion scenes must also use one continuous full-canvas background with no floor, horizon, wall split or segmented studio zones.

Captions must use real final-audio word boundaries:

- exactly one full sentence visible at a time
- never two sentences simultaneously
- hard max two lines
- no opaque/black caption card
- current word follows exact real start/end timing
- no evenly estimated word timing
- hold previous sentence through short pauses
- sentence switch at next sentence's first spoken word

If a sentence cannot remain readable within two lines at a sensible smartphone font size, split/rewrite the sentence instead of shrinking captions to tiny text.

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

Visual QA must explicitly reject:

- missing/wrong/misspelled/clipped Google Flow cover headline
- a Remotion replacement headline over the cover
- a second/third apparent background region
- image ending before the bottom of the frame
- hard header/footer panels
- inset image panel
- opaque caption box
- two subtitle sentences at once
- captions outside safe areas or too small for smartphone viewing

If a recoverable issue appears, fix and rerun automatically. A cover image that must be regenerated by the user is a real blocker.

Before claiming completion, compare against the starting HEAD and verify no unrelated destructive changes occurred.

Antigravity may create commits and a draft PR. It must not publish or merge without explicit user instruction.

Final response only:

- `PRODUCTION COMPLETE` when final MP4 and required checks truly completed.
- `BLOCKED` with exact cause/action when further progress is genuinely impossible.
