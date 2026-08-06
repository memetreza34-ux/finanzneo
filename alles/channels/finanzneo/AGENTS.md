# FinanzNeo – Codex workflow for every reel

These instructions apply inside `alles/channels/finanzneo/` and extend `alles/AGENTS.md`.

## Default mode: execute prebuilt reels

Every current and future Reel project must contain:

```text
<project>/timeline/codex-reel-package.json
<project>/timeline/reel-build-manifest.json
```

The planning assistant completes the creative work and programs the individual Remotion composition and animations before Codex runs.

Codex must not choose a topic, rewrite the approved script, redesign scenes, invent an animation, replace a prebuilt component or recreate an already approved visual system.

## Manifest gate

The build manifest has one of two states:

### `awaiting-prebuild`

Composition or animations are not finished. Stop. Do not generate the missing creative code.

### `prebuilt-ready`

All creative and animation code is finished. Run only the general command from `alles/`:

```bash
npm run finance:reel:build -- <project>
```

The general builder reads composition ID, entry point, source files, animation components, runtime props and output paths from the manifest.

## User media

The user supplies:

- exactly one supported audio or media file in `<project>/02-audio/`; filename irrelevant,
- exactly one supported image in each expected image-scene folder; filename irrelevant.

The `scene-XX` folder determines the image assignment.

Supported audio/media:

```text
.wav .mp3 .m4a .aac .flac .ogg .opus .mp4 .mov .m4v .webm
```

Supported images:

```text
.png .jpg .jpeg .webp .avif
```

If zero or multiple matching files are found, stop instead of guessing.

## Visual Quality V2 for future reels

All reels planned after the ETF test reel use:

```text
creativeRules.visualQualityProfile = finanzneo-process-v2
```

Required distribution:

```text
55–65% image scenes
35–45% animation scenes
```

Preferred production structure:

```text
9 scenes = 5 process images + 4 high-quality animations
```

This matches the existing 60–75-second and 9–14-beat production system.

Allowed standard distributions:

- 5 scenes: 3 images + 2 animations
- 7 scenes: 4 images + 3 animations
- 8 scenes: 5 images + 3 animations
- 9 scenes: 5 images + 4 animations

Do not add a weak animation merely to satisfy the ratio. Every animation must show a concrete state change with its own start state, visible action, end state and spatial logic.

### Process image contract

Every image scene must behave like a frozen process animation. The package must contain:

```text
image.process.startState
image.process.processPath
image.process.resultState
image.process.instantReadabilitySeconds = 1
image.process.decorativeOnly = false
```

The generated image must make cause, path and result understandable within roughly one second. It must not be a decorative character standing beside a finance object, a repeated transparent miniature box, a dashboard card, an unrelated icon collection or an image dependent on tiny labels.

### Scene header contract

Every future composition must use:

```text
src/reels/shared/FinanzNeoSceneHeader.tsx
```

Required profile:

```text
finanzneo-scene-header-v2
```

The header provides:

- light headline at least 72 px, default 78 px,
- maximum two lines,
- scene-specific icon,
- soft dark top gradient,
- strong readable shadow,
- mint or light-green kicker.

Never use black or dark-gray headline text on a dark background. Never place a hard black rectangle behind the headline.

## What the general build already does

- verifies that composition and animations are prebuilt,
- validates the future visual profile when present,
- keeps the original voiceover,
- creates a pitch-preserving 1.10× runtime voiceover,
- transcribes locally in German with Whisper.cpp,
- creates real word timestamps,
- aligns final scene boundaries to spoken sections,
- stages images and runtime audio,
- runs regression tests and TypeScript,
- renders MP4 and cover,
- creates render QA, contact sheet and build report.

Generated timing source of truth:

```text
<project>/timeline/scene-timing.json
```

Planned and final scene durations do not need to match. Animation and image movement phases must already scale relatively to the final scene duration.

## Allowed Codex work

Codex may only:

1. run the general build,
2. report concrete results,
3. fix the smallest reproducible technical defect if the executed command fails,
4. rerun the same general build.

No speculative refactor, no creative redevelopment, no global feature flags, no merge, no PR-ready transition and no automatic human approval.

## Required report

Report only:

- commands actually executed,
- detected media,
- processed audio duration,
- transcript coverage and final scene times,
- test and typecheck results,
- output paths and file sizes,
- concrete remaining errors,
- manual visual approval still required.
