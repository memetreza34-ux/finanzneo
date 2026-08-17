# FinanzNeo — Antigravity Safety Rules

These rules apply only to Google Antigravity in this workspace.

## Authority

Read completely before work:

1. `.agents/rules/finanzneo-image-world-lock.md`
2. `config/finanzneo-image-world-lock.json`
3. `CLAUDE.md`
4. `reels/PRODUKTIONSSTANDARD.md`
5. `docs/REEL-QUALITY-CONTRACT-V2.md`
6. `docs/BEAT-TO-IMAGE-RULES.md`
7. target Reel files

`CLAUDE.md` remains the highest general production/style authority.

**Exception — image world only:** `config/finanzneo-image-world-lock.json` plus `.agents/rules/finanzneo-image-world-lock.md` is the hard technical authority for the Google-Flow image world and supersedes older image-world wording that may remain in historical docs or old Reels. Never weaken validators, tests, design tokens, finance calculations, lockfiles or quality gates just to make a Reel pass.

## GLOBAL IMAGE-WORLD LOCK — NEVER DRIFT PER REEL

Locked world:

```text
finanzneo-central-object-editorial-v6
```

For every NEW Reel:

- normal Google-Flow scene images are strict 1:1, preferably 1080×1080
- Cover Bild 00 remains 9:16
- each normal scene image uses ONE large central hero object
- 3–5 smaller supporting symbolic finance objects surround the hero
- premium stylized 3D explainer composition
- strong central focus, rich depth and clear hierarchy

Forbidden as image-world drift:

- realistic everyday / desk / room scene as the main composition
- glowing finance-flow lines or line networks as the main motif
- tubes, rails, tracks or roads as main visual
- repeated contract-paper wall
- wealth tower / monolith / meaningless columns
- sterile product-ad hero shot
- almost-empty black studio shot
- dashboard/app UI
- sci-fi corridor / neon tunnel
- tiny subject in huge empty space

Never invent or rename a new Reel-specific world. A different world is allowed only after an explicit GLOBAL user request and an intentional edit of `config/finanzneo-image-world-lock.json`.

Mandatory technical gates:

```bash
npm run validate:image-world
npm run reel:validate -- <TARGET-REEL>
```

New Reels must be created through:

```bash
npm run reel:create -- --target <TARGET-REEL> --title "..."
```

This command must remain wired to `scripts/scaffold-finanzneo-reel-locked.mjs`.

## Google Flow image autopilot

Every new `03-szenen/alle-bildprompts.txt` must instruct Google Flow to generate the complete required image set in one uninterrupted autonomous sequence.

Required behavior:

```text
Bild 00
→ wait internally until generation is complete
→ inspect against exact requirements
→ regenerate automatically if wrong
→ assign exact filename
→ immediately continue to next required image
→ repeat until every required image is finished
→ only then give one final summary
```

Hard rules:

- NEVER ask the user `Weiter?`, `Continue?`, approval, feedback or confirmation between images.
- NEVER stop after one completed image.
- NEVER announce the next image and then wait for user input.
- A failed image is regenerated automatically before continuing.
- Sequential generation means one image at a time internally, NOT one user turn per image.

## Autopilot

When the user says required images and final audio are ready and says `Mach das Reel`, `Erstelle das Reel`, `Mach es fertig` or equivalent:

- run continuously until `PRODUCTION COMPLETE` or a genuine `BLOCKED`
- do not ask `Weiter?` between normal phases
- recoverable validator/TypeScript/layout/timing/render issues must be fixed and rerun automatically

The command does NOT authorize merge, publish, delete, force-push or history rewrite.

## Hard target-Reel user-media boundary

Final user media only from:

```text
<TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
<TARGET-REEL>/02-audio/
```

Never substitute another Reel, archive, Desktop/Downloads, web/stock media, placeholders, previous exports, caches or similarly named outside files.

Before production verify:

- every required image exists with exact expected filename
- exactly one readable final audio exists
- `Bild 00` contains the exact required Google-Flow cover headline
- every normal supplied Flow image matches the locked 1:1 Central-Object world

Missing/wrong/unreadable/ambiguous required media →

```text
BLOCKED
Problem: <exact target-Reel path/file/cause>
Action: <exact user action required>
```

Antigravity never generates replacement images.

## Visual quality gate

For new Reels:

```text
Target: about 60 % native Remotion animation / 40 % Google-Flow images
Allowed animation range: 50–70 % when semantic quality requires it
```

Rules:

- 6 animation + 4 images is the normal starting point for 10 scenes, not a reason to create meaningless motion
- no two image scenes directly consecutive
- static image normally <= 8 seconds
- no long static tail
- dynamic information is animation-first
- every scene needs real `visualRole` + `visualSelectionReason`
- every image scene needs `expectedVisual`
- every animation needs Start → visible action/mechanism → result
- icon-only, number-zoom, static-bar, emoji, generic-card or text-only animation is forbidden

Use Remotion for comparisons, calculations, timelines, growth, money flow, mechanisms, steps and changing cause/effect.

## Mandatory supplied-image QA

Inspect every actual supplied image before integrating it.

Reject if:

- motif does not match the exact spoken beat
- image is unclear/misleading
- random/wrong text appears
- disallowed label appears
- number conflicts with script/research
- contradictory information appears
- image unnecessarily repeats headline + caption information
- cover headline is wrong/missing/clipped/unreadable
- normal scene image is not 1:1
- image violates `finanzneo-central-object-editorial-v6`
- central hero object is missing
- line network / realistic scene / contract wall / wealth tower / product-ad drift appears

If regeneration is needed → `BLOCKED`. Never hide a bad image with Remotion overlays.

## Canonical image presentation

For new Reels:

```text
Cover Bild 00: vertical 9:16
Normal Flow scene images: square 1:1, preferably 1080×1080
Reel canvas: 1080×1920
Square image display: approximately 1000×1000, centered horizontally
```

- never stretch a 1:1 source vertically to 9:16
- no tiny centered poster
- cover gets no Remotion replacement headline
- target `scene-index.json` remains authoritative for per-scene filenames and content

Native Remotion scenes use one continuous full-canvas background without floor/horizon/studio split.

## Exact audio timing

Only the exact final audio from `02-audio/` may drive timing.

```text
final audio
→ real word start/end timestamps
→ short caption units
→ resolved scene start/end frames
→ animation timing
→ render
```

Never estimate/evenly distribute word timing. Final `word-timings.json` requires `timingStatus: final-audio-aligned`.

Final `timeline.json` must have positive real durations, chronological/gapless starts and no unresolved zero-duration placeholders.

If exact audio alignment cannot be produced → `BLOCKED`.

## Caption safety

At any time show exactly one short caption unit.

Current target:

```text
max 12 words
max 68 characters
max 2 lines
min 42 px effective font
bottom ≈ 430
left ≈ 72
right ≈ 170–180
```

Never show two units simultaneously, let text overflow/clip, shrink below safe size, fabricate timing or use opaque black caption cards. Current spoken word follows exact real start/end timing.

## Non-destructive repository policy

- never work directly on `main`
- never merge unless explicitly instructed
- never force-push or rewrite shared history
- do not delete branches/reels/user assets without explicit authorization
- new topic = new branch + new Reel directory
- existing Reels read-only unless targeted
- do not upgrade dependencies unless requested
- validation failure must be fixed, never bypassed by weakening rules
- image-world lock must never be bypassed just to satisfy a Reel

## Final QA

Final completion requires actual full-MP4 QA documented in:

```text
05-projektdateien/final-qa.json
```

It must truthfully confirm full MP4 inspection, every scene inspection, image/voice semantic match, generated text correctness, scene/audio sync, subtitle safe-area, active-word sync, meaningful animations, no long static tail and passed audio levels.

Audio target:

```text
Integrated loudness: about -16 LUFS (validator -17 to -15)
True Peak: <= -1 dBTP
```

Never mark QA `passed` without actually doing the checks.

Final validator:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

## Final response

Only:

- `PRODUCTION COMPLETE` when final MP4 and all required checks truly passed.
- `BLOCKED` with exact cause/action when further progress is genuinely impossible.
