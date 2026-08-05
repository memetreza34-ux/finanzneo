# FinanzNeo – Codex reel workflow

These instructions apply inside `alles/channels/finanzneo/` and extend `alles/AGENTS.md`.

## Operating mode: handoff-driven image-first hybrid

Codex receives a finished creative package. The user supplies final images and exactly one voiceover file. Codex builds the Remotion reel and all technical deliverables.

Codex does not choose a new topic or rewrite the approved script unless the user explicitly requests a creative revision.

The required package is:

```text
<project>/timeline/codex-reel-package.json
```

Run commands from `alles/`. A project argument normally begins with `../reels/`.

## Required creative ratio

- 5–9 scenes total.
- Image scenes must strictly outnumber Remotion animation scenes.
- Default target: 5 image scenes + 2 animation scenes.
- Animation scenes may occupy at most 40% of all scenes.
- Never place two animation scenes directly next to each other unless explicitly justified.
- A dashboard-style scene is not allowed by default.

## User-facing reel structure

```text
../reels/<week>/<weekday>/<reel-name>/
├── 00-cover/
├── 01-voice-script/
├── 02-audio/
├── 03-szenen/
│   └── EINZELNE-SZENEN/
│       ├── scene-01/
│       ├── scene-02/
│       └── ...
├── 04-caption/
├── 05-review/
├── 06-video/
├── render/
└── timeline/
```

There is no central `BILDER-HIER-EINFUEGEN` directory.

## Automatic voiceover discovery

The user places exactly one supported audio or media file in:

```text
<project>/02-audio/
```

The filename is irrelevant. Examples such as `F 1.mp4`, `aufnahme.m4a`, `voice.mp3` or `final.wav` are valid.

Supported extensions:

```text
.wav .mp3 .m4a .aac .flac .ogg .opus .mp4 .mov .m4v .webm
```

If zero or multiple supported files are found, stop and report the exact folder and candidates.

## Mandatory voiceover synchronization

For this workflow, planned durations are creative estimates only. The processed audio and transcript determine final timing.

Before `check-ready` and before coding, run:

```bash
npm run finance:codex-reel:captions -- <project>
```

This command must:

1. detect the single original voiceover in `02-audio/`,
2. preserve the original file,
3. create a pitch-preserving **1.10×** runtime voiceover using FFmpeg `atempo`,
4. transcribe the processed audio locally in German with Whisper.cpp,
5. generate real token-level word timestamps,
6. align the approved scene text to the transcript,
7. update scene durations and composition frames,
8. write captions, raw transcript, timing JSON and a QA report.

Generated timing source of truth:

```text
<project>/render/audio/voiceover-runtime-1-10x.wav
<project>/04-caption/voiceover-final.captions.json
<project>/04-caption/voiceover-transcript.json
<project>/timeline/scene-timing.json
<project>/timeline/transcript-timing.md
<project>/05-review/audio-sync-report.json
```

The original and processed duration do not need to match. Planned and final scene times also do not need to match. Scene order and approved text do not change.

Do not use the original source file in the final render when a `voiceover.runtimeAsset` exists. Do not generate estimated word timings after real Whisper timestamps are available.

If transcription covers less than the required portion of the approved script, stop. Do not guess timing.

## Automatic image discovery

For every scene whose package type is `image`, the user places exactly one supported image in that scene's folder:

```text
<project>/03-szenen/EINZELNE-SZENEN/scene-01/
├── bildprompt.txt
├── szene.md
└── irgendein-dateiname.jpeg
```

The folder determines the scene. The filename does not determine the scene and must not be required to match a template.

Supported extensions:

```text
.png .jpg .jpeg .webp .avif
```

If a scene folder contains zero or more than one supported image, stop rather than guessing. Animation scene folders do not require an image.

## Image scenes

Use the discovered image as the main full-frame visual. Remotion may add controlled crop, focal positioning, push-in, pull-out, small pan, approved overlays, captions and the planned transition.

Do not rebuild the illustration as generic cards, charts or UI. Do not hide it inside a small framed panel unless the package explicitly requests that.

Long image scenes require at least two controlled movement phases. Scale phases proportionally to the final transcript-derived scene duration.

## Animation scenes

A custom Remotion animation must explain an action that benefits from time: a process, transformation, cause and effect, timeline, threshold, crossover or concrete financial mechanism.

Each animation scene must have a different narrative action, visual family, start state and end state. Avoid repeated cards, generic bar-chart sequences, counters as the only movement, repeated comparisons and decorative particles.

Scale animation phases to the final transcript-derived scene duration instead of hardcoding obsolete planning frames.

## Implementation requirements

- 1080 × 1920, 30 fps unless the package says otherwise.
- Composition duration must equal the processed runtime voiceover.
- Permanent subtitle-safe area.
- Use verified project assets; never commit absolute local paths.
- Avoid frame-dependent randomness.
- Financial calculations must be deterministic and tested.
- Scene boundaries come from `timeline/scene-timing.json` after synchronization.
- The first frame already shows the hook motif.
- The last scene answers the hook.

## Mandatory checks

Before coding:

```bash
npm run finance:codex-reel:captions -- <project>
npm run finance:codex-reel:check-ready -- <project>
```

After coding, run at least:

```bash
npm run finance:codex-reel:test
npm run typecheck
npm test
npm run finance:assets -- <project>
npm run finance:ready -- <project>
```

Then run reel-specific still and render commands. Inspect the full MP4, first frame, one or more frames per scene, transcript boundaries, cover, caption-safe zone, audio duration, end frame and financial values.

## Stop conditions

Stop instead of guessing when media is missing or ambiguous, the package and folders disagree, transcript coverage is too low, the script differs materially from the recording, an animation description is too vague, the runtime audio and scene sum disagree, a financial claim lacks support or the package fails the image-first ratio.
