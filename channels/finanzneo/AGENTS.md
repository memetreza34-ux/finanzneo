# FinanzNeo – Codex reel workflow

These instructions apply inside `channels/finanzneo/` and extend the repository-level `AGENTS.md`.

## Operating mode: handoff-driven image-first hybrid

Codex receives a finished creative package. The user supplies the final images and voiceover. Codex builds the complete Remotion reel and all technical deliverables.

Codex does not choose a new topic or rewrite the approved script unless the user explicitly asks for a creative revision.

The required package is:

```text
<project>/06-projektdateien/codex-reel-package.json
```

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

Use the supplied image as the main visual. Remotion may add:

- controlled crop and focal positioning,
- a slow push-in or pull-out,
- a small pan,
- optional two-layer parallax when separate assets are supplied,
- headline, kicker, body text and icon,
- captions,
- a short transition derived from the scene plan.

Do not rebuild the supplied illustration as generic cards, charts or UI. Do not hide the image inside a small framed panel unless the package explicitly requests it.

## What belongs in an animation scene

A custom Remotion animation must explain an action that benefits from time:

- money moving through a process,
- a value being divided or transformed,
- inflation reducing purchasing power,
- debt or savings changing over time,
- cause and effect,
- a timeline, threshold or crossover,
- a concrete object-based financial mechanism.

Each animation scene must have a different narrative action, visual family, start state and end state. Reusing primitives is allowed; reusing the same visible composition with different numbers is not.

Avoid:

- repeated dark cards,
- generic bar-chart sequences,
- counters as the only movement,
- seven versions of the same comparison,
- decorative particles without explanatory purpose,
- tiny labels that fail phone readability.

## Project and source locations

The production project stays under:

```text
channels/finanzneo/reels/<week>/<day_reel>/
```

Reel-specific source code belongs under:

```text
channels/finanzneo/src/reels/<publish-date>-<slug>/
```

Use a dedicated composition ID from `codex-reel-package.json`. Do not replace the generic `FinanzNeo` composition or any production entry point unless the task explicitly requires integration.

## Audio and captions

Expected voiceover path:

```text
<project>/01-script-audio/audio/voiceover-final.wav
```

If final word captions are missing, create deterministic provisional captions from the approved scene voice text and the final audio duration:

```bash
npm run finance:codex-reel:captions -- <project>
```

These generated timings are estimates. Codex must report that they were generated and visually inspect synchronization. Do not describe them as speech-recognition timestamps.

Voiceover is mandatory for the final render. Music and sound effects are only used when the package includes approved asset paths and cue timings.

## Implementation requirements

- 1080 × 1920, 30 fps unless the package says otherwise.
- Permanent subtitle-safe area.
- Use `staticFile()` or verified project asset imports.
- Never use absolute local paths inside committed source code.
- Avoid frame-dependent randomness.
- All financial calculations must be deterministic and separately tested.
- Scene boundaries must derive from the approved durations or final caption alignment.
- The first frame must already show the hook's main motif.
- The last scene must answer the hook and use the approved cover/payoff language.

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

Then run the reel-specific still and render commands created for that reel. Inspect:

- full MP4,
- first frame,
- at least one frame from every scene,
- every scene boundary,
- cover readability,
- caption-safe zone,
- audio duration and end frame,
- all financial values.

## Stop conditions

Stop instead of guessing when:

- an image or voiceover file is missing,
- the package and actual files disagree,
- the script differs from the recorded voiceover,
- an animation description is too vague to implement faithfully,
- the planned duration cannot fit the final voiceover,
- a financial claim lacks the supplied source or calculation,
- the package fails the image-first ratio.
