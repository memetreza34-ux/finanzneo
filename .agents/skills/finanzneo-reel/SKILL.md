---
name: finanzneo-reel
description: Safely executes or reviews FinanzNeo Reel production while preserving the three-phase contract, V9 explanatory image world, cinematic Remotion motion, controlled Lottie/SFX enhancement, Playwright visual QA, sealed animations, pure-black canvas and completion gates.
---

# FinanzNeo Reel Skill

## Authority

Read in this order:

1. `CLAUDE.md`
2. target `03-szenen/scene-index.json`
3. `docs/FUTURE-IMAGE-STORYTELLING-V5.md`
4. `docs/IMAGE-VISION-QA-V1.md`
5. `docs/3-PHASEN-WORKFLOW.md`
6. `docs/PHASE-3-COMPLETION-GATE.md`
7. `reels/PRODUKTIONSSTANDARD.md`
8. `.agents/rules/finanzneo-reel-safety.md`
9. `.agents/plugins/finanzneo-motion/rules/remotion-production.md`
10. `.agents/plugins/finanzneo-motion/rules/lottie-motion.md`
11. `.agents/plugins/finanzneo-motion/rules/sound-design.md`
12. `.agents/plugins/finanzneo-motion/rules/playwright-qa.md`

`CLAUDE.md` wins on conflicts.

## Three phases

### Phase 1 — ChatGPT / motion authoring

Owns research, beginner-friendly scene-by-scene script, Flow prompts, headers/icons, captions and the final production-ready `animation.tsx` for every animation scene.

Phase 1 may use the FinanzNeo Motion Stack while authoring:

- Remotion / HTML / CSS primitives
- React Three Fiber / Three.js where spatial depth genuinely helps
- Lottie Creator MCP for focused support motion
- frame-accurate SFX planning

All final animation choices and local support assets must be committed before the animation seal.

For new V5 reels, Phase 1 is not complete until the full IMAGE sequence is planned, all hardening placeholders are resolved, and the final Flow prompts have been compiled with:

```bash
npm run reel:image-prompts:compile -- <Reel-Pfad>
npm run reel:validate -- <Reel-Pfad>
```

### Phase 2 — user + generated-image pixel QA

Owns final Flow images, final voiceover and real word timings.

For a new V5-Hardening reel, every generated IMAGE scene must also complete `finanzneo-image-vision-qa-v1` before the next image is unlocked:

```text
one Flow image
→ exact rename + save to 03-szenen/00-ALLE-BILDER-HIER-REIN/
→ npm run reel:image-vision:prepare -- <Reel> --scene scene-XX
→ multimodal evaluator opens the actual image file
→ write the exact resultSchema to results/scene-XX.json
→ npm run reel:image-vision:validate -- <Reel> --scene scene-XX
→ PASS: next image
→ REGENERATE: same scene/image number only
```

A prompt-only or metadata-only review is not pixel QA. The evaluator must inspect the actual generated pixels and provide concrete visual evidence. Request and result are bound to the image SHA-256; replacing/regenerating the image invalidates the old PASS.

Previously generated images may be opened only for QA/sequence-novelty comparison. Never upload them to Flow as generation references.

### Phase 3 — configured executor

Integrates only. It must not invent missing Phase-1 animation or substitute missing Phase-2 assets.

If `phase3Executor` names another executor, do not take over Phase 3.

After the animation SHA is sealed, Phase 3 may not invent a new Lottie concept, alter the physical mechanism or generate replacement animation code. Creative redesign returns to Phase 1.

For new V5-Hardening reels, `reel:ready` must also verify a current hash-bound Pixel-Vision-QA PASS for every IMAGE scene. Missing, stale or REGENERATE reports block Phase 3.

## Visual Beat timing

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

For new reels, do not choose a scene count first. Parse the voiceover into spoken thoughts, assign one visible beat per thought, then group beats into scenes. A sentence may receive its own Flow image. If one sentence contains two actions, examples, a comparison or a before/after change, split it into multiple visible beats when that improves comprehension.

For new Future-V3 reels, static image beats should normally last about **1.8–3.0 seconds**. From about **3.6 seconds**, actively check whether a new visual beat would improve comprehension. Without new visible information, a static image beat must not exceed **4.0 seconds**. Multiple consecutive image scenes are allowed when each one advances meaning. Camera push, zoom or parallax alone does not reset the beat.

Animation scenes may be longer only when the visible state keeps advancing with the voiceover. Final cuts follow real word timings from Phase 2, never equal-length scene padding. The 60/40 image-animation mix is guidance, not a quota.

## V5 image storytelling hardening

New reels use:

```text
IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v5
IMAGE_STORYTELLING_HARDENING: finanzneo-image-storytelling-v5-hardening-v1
VISUAL_SEQUENCE_PLAN: finanzneo-visual-sequence-plan-v1
POST_GENERATION_VISION_QA: finanzneo-image-vision-qa-v1
```

### Sequence first

Before finalizing any individual IMAGE prompt:

1. plan the entire IMAGE sequence;
2. assign sequence role and energy;
3. vary archetype, composition, camera, location, human presence and main subject;
4. choose a real pattern interrupt where needed;
5. only then finalize each individual prompt.

Do not optimize six images independently. Optimize the sequence.

### No creative defaults

The following fields must be consciously chosen, not accepted from generic defaults:

- `VISUAL_MODE`
- `ENERGY_LEVEL`
- `SHOT_SCALE`
- `CAMERA_ANGLE`
- `TABLE_DOCUMENT_SCENE`
- `LOCATION_CLASS`
- `MAIN_SUBJECT_CLASS`
- `LIGHTING_VARIATION`
- `PATTERN_INTERRUPT_TYPE`
- `LABEL_BUDGET`

### Window diversity

For every complete six-IMAGE window, require at least three distinct values for:

- visual archetype
- composition family
- camera angle
- location class
- main-subject class

For a whole sequence of four or five IMAGE scenes, the same minimum of three distinct values applies across the sequence.

A-B-A-B-A-B is not sufficient diversity.

### Pattern interrupt truthfulness

`PATTERN_INTERRUPT_TYPE` must reflect a real change. Examples:

- `camera-change` -> camera angle actually changes
- `scale-change` -> shot scale actually changes
- `location-change` -> location class actually changes
- `human-change` -> human presence actually changes

Do not claim an interrupt just to satisfy metadata.

### Label budget

Use 0–2 short German object labels by default. Three labels require a concrete justification. The image must primarily explain itself visually.

### Prompt compilation

The metadata is not the final Flow instruction. After planning, run the compiler. It inserts a canonical `V5_COMPILED_DIRECTION` directly inside every `IMAGE PROMPT`, including:

- camera
- archetype
- action
- location
- main subject
- human presence
- lighting
- tension/consequence
- cause/effect
- visual hook
- pattern interrupt
- label budget

If scene-index metadata changes after compilation, compile again. `reel:validate` must reject stale compiled prompts.

## Post-generation Image Vision QA V1

This gate checks whether Flow actually delivered the planned scene instead of merely accepting a good prompt.

The semantic evaluator must visually inspect the real file and score:

- plan/voice-beat alignment
- camera + shot-scale compliance
- visible action / cause-effect readability
- hook strength
- visual interest
- V9 world consistency
- composition clarity
- sequence novelty against already generated images

Hard failures include photorealism, generic finance-icon main compositions, static catalog-like staging, wrong background, forbidden sentence/headline text, label-budget overflow and scene mismatch.

Generic desk scenes and dominant dead space receive stricter handling; do not pass them merely because other scores are acceptable. `scene-01` / cover requires a stronger hook threshold than a normal IMAGE scene.

Every result must contain at least three concrete observations from the pixels. Never fabricate visual evidence from prompt text.

## V9 image world

New Flow prompts use `finanzneo-stylized-3d-animated-black-v9`:

- real-life explanatory situations instead of abstract finance icon arrangements
- recognizable, believable object construction and proportions
- semi-realistic material/detail structure, but clearly stylized 3D and never photorealistic
- premium clean presentation
- deep black background mandatory
- content/clarity before object count; no fixed supporting-object quota
- short German labels when they materially improve instant understanding
- emerald positive, ivory/soft gray neutral, subtle gold money/value, red-orange warning/cost
- individually written complete prompts
- no stock-photo/product-photo look, dashboard/app UI, flowchart, tiny boxes, microchip language, unreadable minidiorama or clutter

If a brand/logo/app appears, keep it recognizable but stylized in the same animated world. Never paste a flat real-world logo, screenshot or photorealistic branded UI into the scene.

Antigravity does not generate the user's final Flow images. Missing exact image = stop and report filename.

## Pure-black Reel background

The Remotion canvas is always static `#000000` through central `FinanceBackground`.

Never use or import `FNBgAurora`, `FNBgParticles`, `FNBgGrid`, `FNBgRadial`, particle fields, moving grids, aurora, glow fields, decorative background gradients or animated background elements.

Do not use background motion to make an otherwise empty scene pass visual QA.

## Professional Motion Stack

The workspace plugin `.agents/plugins/finanzneo-motion/` extends Antigravity with:

- official Remotion Agent Skills bootstrapped locally at workspace start;
- `remotion-director` for cinematic real-world motion choreography;
- Lottie Creator MCP + `lottie-motion` for controlled vector support animation;
- ElevenLabs `sound-effects` Agent Skill bootstrap for optional SFX generation;
- `sound-design` for frame-synchronized sound planning;
- `playwright-visual-qa` for visual Remotion Studio inspection of representative frames, layout, icons and safe zones;
- repo validation through `npm run validate:antigravity-motion`.

Remotion remains the timeline/render authority.

### Animation language

Every animation should read as:

```text
START
→ TRIGGER
→ PHYSICAL ACTION
→ REACTION
→ RESULT
→ RESULT HOLD
```

Prefer real-world objects and concrete cause/effect. Aim for several meaningful motion channels with different physical character rather than one global progress value controlling everything identically.

Camera movement, Three.js and Lottie are support tools. None of them may replace the explanatory mechanism.

### Lottie

Use Lottie only when it materially improves compact vector motion such as:

- calendar/page flip
- confirmation/check
- restrained warning accent
- money-transfer accent
- chart stroke / target reveal
- semantic icon acting

Never use generic Lottie cards/templates as the full scene when a real-world Remotion mechanism is clearer.

### Sound

Every animation is evaluated for a small number of purposeful SFX cues tied to visible frame events.

Voiceover remains dominant. Final sound files are local under `public/sounds/`; remote/runtime sound dependencies are forbidden.

If ElevenLabs generation is unavailable, preserve the cue plan and report missing final sound assets. Never use placeholder beeps.

### Playwright visual QA

Use the FinanzNeo `playwright-visual-qa` skill with the official Playwright CLI for the local Remotion Studio.

Default tool path:

```bash
npx -y @playwright/cli@latest
```

For each production Reel:

- inspect at least one stable frame from every image scene;
- inspect start, trigger, mid-mechanism, near-result and final hold for every animation scene;
- compare one-line and two-line headers across scenes;
- compare optical icon size, icon-to-text gap and vertical alignment;
- inspect safe-zone boundaries, clipping, centering, hero scale and dead space;
- treat visible inconsistency as QA failure even if TypeScript/bundle/smoke are green.

Playwright screenshots and traces are temporary QA artifacts, not production assets.

A target reel should keep a concrete checklist in `05-projektdateien/visual-qa.md` when it reaches production/Phase 3.

## Animation ownership

For every animation scene:

- use exact `animationSourceFile`
- use exact `animationExport`
- preserve SHA-256 seal from `reel:ready`
- bind through the production composition/customAnimations mapping
- missing binding = hard failure
- Phase 3 may not replace or simplify the source

No placeholders, debug rectangles, `Math.sin`/`Math.cos` QA-wiggle or motion whose only purpose is frame difference.

## Layout V5

Central `REEL_STYLE` only:

- Header Y154
- Header 56 px, minimum 50 px, max 2 lines
- Icon 34 px with optical normalization
- two-line title keeps icon anchored to the first line
- Visual Y320–1400
- captions bottom340, max 2 lines
- transition 3 frames
- header plain #FFFFFF text + simple semantic line icon
- no capsule/chip/pill/panel/forced uppercase
- `AnimationStage` hard-clips visible animation content to Y320–1400
- SourceNote must not overlap a two-line caption

## Completion sequence

```bash
# V5-Hardening: Pixel-Vision-QA must already PASS on current image hashes
npm run reel:ready -- <Reel>
npm run reel:phase3:init -- <Reel> <Composition-ID>
# integrate every sealed scene + final Phase-2 assets
npm run reel:phase3:preflight -- <Reel>
# run Playwright visual QA from the reel's 05-projektdateien/visual-qa.md and require PASS
npm run reel:render -- <Reel>/05-projektdateien/phase3-production-manifest.json
```

`reel:render` creates the candidate, runs post-render QA and only after PASS releases the final MP4 and triggers the final export workflow. A direct `reel:export` call is reserved for a controlled re-export of an already validated final MP4.

Final `06-export/` uses exactly one social caption: `caption-universal.txt`.

QA must reject:

- black/empty visual core
- caption-only/header-only scene
- missing image
- missing or stale V5 Pixel-Vision-QA report
- a generated image whose report is bound to another SHA-256
- prompt-only QA presented as pixel QA
- missing animation binding
- animation with no real motion
- animation that does not explain its beat
- visible header/icon inconsistency found by Playwright QA
- safe-zone/clipping/centering defects found by Playwright QA
- non-black/decorative background
- missing required voiceover/audio
- missing referenced SFX asset when the approved plan marks it required
- wrong dimensions/timeline

An MP4 file by itself is never proof of completion.

## Repository safety

- never work on `main`
- never merge/force-push/delete previous work without explicit instruction
- never weaken tests/validators/locks to make a reel pass
- fix actual content/integration errors instead
