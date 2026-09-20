---
name: finanzneo-reel
description: Safely executes or reviews FinanzNeo Reel production while preserving the three-phase contract, V9 explanatory image world, canonical Motion Core V1, controlled Lottie/SFX enhancement, Playwright visual QA, sealed animations, pure-black canvas and completion gates.
---

# FinanzNeo Reel Skill

## Authority

Read in this order:

1. `CLAUDE.md`
2. target `03-szenen/scene-index.json`
3. `docs/3-PHASEN-WORKFLOW.md`
4. `docs/PHASE-3-COMPLETION-GATE.md`
5. `reels/PRODUKTIONSSTANDARD.md`
6. `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
7. `.agents/rules/finanzneo-reel-safety.md`
8. `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`
9. `.agents/plugins/finanzneo-motion/rules/remotion-production.md`
10. `.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md`
11. `.agents/plugins/finanzneo-motion/rules/lottie-motion.md`
12. `.agents/plugins/finanzneo-motion/rules/sound-design.md`
13. `.agents/plugins/finanzneo-motion/rules/playwright-qa.md`

`CLAUDE.md` wins on conflicts.

## Three phases

### Phase 1 — ChatGPT / motion authoring

Owns research, beginner-friendly scene-by-scene script, Flow prompts, headers/icons, captions and the final production-ready `animation.tsx` for every animation scene.

For every animation scene, Phase 1 routes creative motion decisions through the FinanzNeo `remotion-director` and the canonical `src/motion` core before writing JSX.

Phase 1 may use the FinanzNeo Motion Stack while authoring:

- canonical `src/motion` Physical-Primitives + `FN_MOTION`
- Remotion / HTML / CSS primitives
- React Three Fiber / Three.js where spatial depth genuinely helps
- Lottie Creator MCP for focused support motion
- frame-accurate SFX planning

All final animation choices and local support assets must be committed before the animation seal.

### Phase 2 — user

Owns final Flow images, final voiceover and real word timings.

### Phase 3 — configured executor

Integrates only. It must not invent missing Phase-1 animation or substitute missing Phase-2 assets.

If `phase3Executor` names another executor, do not take over Phase 3.

After the animation SHA is sealed, Phase 3 may not invent a new Lottie concept, alter the physical mechanism or generate replacement animation code. Creative redesign returns to Phase 1.

## Visual Beat timing

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

For new reels, do not choose a scene count first. Parse the voiceover into spoken thoughts, assign one visible beat per thought, then group beats into scenes. A sentence may receive its own Flow image. If one sentence contains two actions, examples, a comparison or a before/after change, split it into multiple visible beats when that improves comprehension.

Static image beats should normally last about 1.8–3.4 seconds and must not remain unchanged beyond 4.5 seconds once the message is already understood. Multiple consecutive image scenes are allowed when each one advances meaning. Camera push, zoom or parallax alone does not reset the beat.

Animation scenes may be longer only when the visible state keeps advancing with the voiceover. Final cuts follow real word timings from Phase 2, never equal-length scene padding. The 60/40 image-animation mix is guidance, not a quota.

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
- `remotion-director` for content-first real-world motion choreography;
- `mechanic-selection` for semantic mechanism routing and anti-repetition;
- canonical `src/motion` Motion Core V1 for Physical-Primitives, Stage, timing and springs;
- Lottie Creator MCP + `lottie-motion` for controlled vector support animation;
- ElevenLabs `sound-effects` Agent Skill bootstrap for optional SFX generation;
- `sound-design` for frame-synchronized sound planning;
- `playwright-visual-qa` for visual Remotion Studio inspection of representative frames, layout, icons and safe zones;
- repo validation through `npm run validate:antigravity-motion`.

Remotion remains the timeline/render authority.

### Motion Core V1 — mandatory routing for new animations

For new or intentionally reworked Reel animations:

1. read all animation scenes in the target Reel;
2. derive the finance statement and visible understanding goal;
3. derive the physical cause/effect before choosing tools;
4. assign one validator-compatible lower-kebab-case `MECHANIC_ID`;
5. record `HERO_OBJECT`, `PRIMARY_ACTION`, `MOTION_AXIS` and `RESULT_TYPE`;
6. compare against the Reel mechanic ledger;
7. pass the anti-repetition gate;
8. check `src/motion` for suitable canonical primitives and timing;
9. only then implement the scene.

The ledger shape is:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

The same `MECHANIC_ID` must never occur twice inside one Reel. If at least three central ledger dimensions match another animation, redesign the physical explanation before coding.

A different color, label, icon, Lottie, camera move, mirroring or speed is **not** a new mechanism.

`src/motion` is a technical house-style core, **not a fixed creative template menu**. The content still decides the mechanism. Scene-specific physical objects are allowed when they are genuinely needed, but do not duplicate existing core primitives merely to restyle them.

Old `FinanceMotionLab*`, experiment compositions and legacy Reel animation styles may provide technical reference only; they are not production house-style authority.

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
- for a new mechanism, changed Motion Core or representative pilot, prefer a full render when practical;
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

For a new Reel carrying `finanzneo-motion-core-v1`, canonical Physical-/Motion-Primitives come from `src/motion`. A Reel that imports the old core primitives from `src/design-system` fails the new Motion-Direction gate.

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
- missing animation binding
- animation with no real motion
- animation that does not explain its beat
- repeated physical mechanism disguised by color/text/camera changes
- new Motion-Core Reel animation that bypasses `src/motion`
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
