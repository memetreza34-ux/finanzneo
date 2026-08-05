# FinanzNeo – Codex workflow for every reel

These instructions apply inside `alles/channels/finanzneo/` and extend `alles/AGENTS.md`.

## Default mode: execute prebuilt reels

Every current and future Reel project must contain:

```text
<project>/timeline/codex-reel-package.json
<project>/timeline/reel-build-manifest.json
```

The planning assistant completes the creative work and programs the individual Remotion composition and animations before Codex runs.

Codex must not choose a topic, rewrite the approved script, redesign scenes, invent an animation, or replace a prebuilt component.

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

## What the general build already does

- verifies that composition and animations are prebuilt,
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

Planned and final scene durations do not need to match. Animation phases must already scale relatively to the final scene duration.

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
