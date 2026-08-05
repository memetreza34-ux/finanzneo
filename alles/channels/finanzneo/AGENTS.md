# FinanzNeo – Codex reel workflow

These instructions apply inside `alles/channels/finanzneo/` and extend `alles/AGENTS.md`.

## Operating mode: handoff-driven image-first hybrid

Codex receives a finished creative package. The user supplies the final images and voiceover. Codex builds the complete Remotion reel and all technical deliverables.

Codex does not choose a new topic or rewrite the approved script unless the user explicitly asks for a creative revision.

The required package is:

```text
<project>/timeline/codex-reel-package.json
```

Run commands from `alles/`. Because reel projects live one level above, a project argument normally begins with `../reels/`.

Validate it before implementation:

```bash
npm run finance:codex-reel:check -- <project>
```

When final images and audio are present, validate assets too:

```bash
npm run finance:codex-reel:check-ready -- <project>
```

## Required creative ratio

- 5–9 scenes total.
- Image scenes must strictly outnumber Remotion animation scenes.
- Default target: 5 image scenes + 2 animation scenes.
- Animation scenes may occupy at most 40% of all scenes.
- Never place two animation scenes directly next to each other unless the package explicitly records a justified exception.
- A dashboard-style scene is not allowed by default.

## What belongs in an image scene

Use the supplied image as the main visual. Remotion may add controlled crop, focal positioning, push-in, pull-out, small pan, approved overlays, captions and a short planned transition.

Do not rebuild the supplied illustration as generic cards, charts or UI. Do not hide the image inside a small framed panel unless the package explicitly requests it.

## What belongs in an animation scene

A custom Remotion animation must explain an action that benefits from time: money moving through a process, a value being divided or transformed, cause and effect, a timeline, threshold, crossover or a concrete object-based financial mechanism.

Each animation scene must have a different narrative action, visual family, start state and end state. Reusing primitives is allowed; reusing the same visible composition with different numbers is not.

Avoid repeated dark cards, generic bar-chart sequences, counters as the only movement, repeated comparisons, decorative particles and unreadable labels.

## Project and source locations

The user-facing production project lives under:

```text
../reels/<week>/<weekday>/<reel-name>/
```

Every reel uses:

```text
00-cover/
01-voice-script/
03-szenen/
04-caption/
05-review/
06-video/
render/
timeline/
```

There is no separate `02-audio/` folder. There is also no central `BILDER-HIER-EINFUEGEN/` folder.

Reel-specific source code belongs under:

```text
channels/finanzneo/src/reels/<publish-date>-<slug>/
```

Use a dedicated composition ID from `timeline/codex-reel-package.json`. Do not replace the generic `FinanzNeo` composition or any production entry point unless the task explicitly requires integration.

## Audio, images and captions

Expected voiceover path:

```text
<project>/01-voice-script/voiceover-final.wav
```

Every image must be stored directly beside its own prompt and scene description:

```text
<project>/03-szenen/EINZELNE-SZENEN/scene-01/
├── bildprompt.txt
├── scene-01-<name>.png
└── szene.md
```

The parent directory of `image.asset` must equal the parent directory of `image.promptFile`.

If final word captions are missing, create deterministic provisional captions from the approved scene voice text and final audio duration:

```bash
npm run finance:codex-reel:captions -- <project>
```

Generated timings are estimates. Report that they were generated and visually inspect synchronization. Do not describe them as speech-recognition timestamps.

Voiceover is mandatory for the final render. Music and sound effects are only used when the package includes approved asset paths and cue timings.

## Implementation requirements

- 1080 × 1920, 30 fps unless the package says otherwise.
- Permanent subtitle-safe area.
- Use `staticFile()` or verified project asset imports.
- Never use absolute local paths inside committed source code.
- Avoid frame-dependent randomness.
- All financial calculations must be deterministic and separately tested.
- Scene boundaries must derive from approved durations or final caption alignment.
- The first frame must already show the hook's main motif.
- The last scene must answer the hook and use the approved payoff language.

## Mandatory checks

Before coding:

```bash
npm run finance:codex-reel:check-ready -- <project>
```

After coding, run at least:

```bash
npm run typecheck
npm test
npm run finance:assets -- <project>
npm run finance:ready -- <project>
```

Then run reel-specific still and render commands. Inspect the full MP4, first frame, at least one frame from every scene, every scene boundary, cover readability, caption-safe zone, audio duration, end frame and all financial values.

## Stop conditions

Stop instead of guessing when an image or voiceover file is missing, package and files disagree, an image is not stored beside its prompt, the script differs from audio, an animation is too vague, planned duration cannot fit audio, a financial claim lacks support or the package fails the image-first ratio.
