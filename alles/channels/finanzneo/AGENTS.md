# FinanzNeo – Codex reel workflow

These instructions apply inside `alles/channels/finanzneo/` and extend `alles/AGENTS.md`.

## Operating mode: handoff-driven image-first hybrid

Codex receives a finished creative package. The user supplies final images and one voiceover file. Codex builds the Remotion reel and all technical deliverables.

Codex does not choose a new topic or rewrite the approved script unless the user explicitly requests a creative revision.

The required package is:

```text
<project>/timeline/codex-reel-package.json
```

Run commands from `alles/`. A project argument normally begins with `../reels/`.

```bash
npm run finance:codex-reel:check -- <project>
npm run finance:codex-reel:check-ready -- <project>
```

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

Codex must use the path printed by `finance:codex-reel:check-ready`. If the source is a video container with an audio track, Codex may create a normalized runtime audio file without requiring the user to rename the original.

If zero or multiple supported files are found, stop and report the exact folder and candidates.

## Voiceover-led timing

The measured voiceover duration is the timing source of truth. A reel package may be 25–90 seconds long.

Do not automatically accelerate, trim or time-stretch the voiceover. If measured audio and planned scene duration disagree, update the package timing before implementation:

- `composition.targetDurationSec`
- `composition.durationInFrames`
- `voiceover.measuredDurationSec`
- every `scene.durationSec`
- storyboard, motion plan and generated captions

Longer image scenes require at least two controlled movement phases rather than one static hold.

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

Use the path printed by `finance:codex-reel:check-ready`. If a scene folder contains zero or more than one supported image, stop rather than guessing.

Animation scene folders do not require an image.

## Image scenes

Use the discovered image as the main full-frame visual. Remotion may add controlled crop, focal positioning, push-in, pull-out, small pan, approved overlays, captions and the planned transition.

Do not rebuild the illustration as generic cards, charts or UI. Do not hide it inside a small framed panel unless the package explicitly requests that.

## Animation scenes

A custom Remotion animation must explain an action that benefits from time: a process, transformation, cause and effect, timeline, threshold, crossover or concrete financial mechanism.

Each animation scene must have a different narrative action, visual family, start state and end state. Avoid repeated cards, generic bar-chart sequences, counters as the only movement, repeated comparisons and decorative particles.

## Audio and captions

If final word captions are missing, create provisional captions from the approved scene text and the automatically discovered voiceover duration:

```bash
npm run finance:codex-reel:captions -- <project>
```

Generated timings are estimates, not speech-recognition timestamps. Inspect synchronization in the complete render.

## Implementation requirements

- 1080 × 1920, 30 fps unless the package says otherwise.
- Permanent subtitle-safe area.
- Use verified project assets; never commit absolute local paths.
- Avoid frame-dependent randomness.
- Financial calculations must be deterministic and tested.
- Scene boundaries derive from approved durations or caption alignment.
- The first frame already shows the hook motif.
- The last scene answers the hook.

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

Then run reel-specific still and render commands. Inspect the full MP4, first frame, one or more frames per scene, scene boundaries, cover, caption-safe zone, audio duration, end frame and financial values.

## Stop conditions

Stop instead of guessing when media is missing or ambiguous, the package and folders disagree, the script differs from the recording, an animation description is too vague, duration cannot fit the voiceover, a financial claim lacks support or the package fails the image-first ratio.
