---
name: finanzneo-reel
description: Safely executes or reviews FinanzNeo Reel production while preserving the three-phase contract, V9 image world, sealed animations, pure-black canvas and completion gates.
---

# FinanzNeo Reel Skill

## Authority

Read in this order:

1. `CLAUDE.md`
2. target `03-szenen/scene-index.json`
3. `docs/3-PHASEN-WORKFLOW.md`
4. `docs/PHASE-3-COMPLETION-GATE.md`
5. `reels/PRODUKTIONSSTANDARD.md`
6. `.agents/rules/finanzneo-reel-safety.md`

`CLAUDE.md` wins on conflicts.

## Three phases

### Phase 1 — ChatGPT

Owns research, scene-by-scene script, Flow prompts, headers/icons, captions and the final production-ready `animation.tsx` for every animation scene.

### Phase 2 — user

Owns final Flow images, final voiceover and real word timings.

### Phase 3 — configured executor

Integrates only. It must not invent missing Phase-1 animation or substitute missing Phase-2 assets.

If `phase3Executor` names another executor, do not take over Phase 3.

## V9 image world

New Flow prompts use `finanzneo-stylized-3d-animated-black-v9`:

- clearly non-realistic stylized 3D animated look
- soft rounded shapes and simplified recognizable details
- premium but slightly playful
- deep black background mandatory
- content/clarity before object count; no fixed supporting-object quota
- emerald positive, ivory/soft gray neutral, subtle gold money/value, red-orange warning/cost
- medium-length prompts
- no realism/product-photo look/dashboard/app UI/flowchart/tiny boxes/microchip/minidiorama/clutter

If a brand/logo/app appears, keep it recognizable but stylized in the same animated world. Never paste a flat real-world logo, screenshot or photorealistic branded UI into the scene.

Antigravity does not generate the user's final images. Missing exact image = stop and report filename.

## Pure-black Reel background

The Remotion canvas is always static `#000000` through central `FinanceBackground`.

Never use or import `FNBgAurora`, `FNBgParticles`, `FNBgGrid`, `FNBgRadial`, particle fields, moving grids, aurora, glow fields, decorative background gradients or animated background elements.

Do not use background motion to make an otherwise empty scene pass visual QA.

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
- Icon 34 px
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
# implement every scene and complete manifest
npm run reel:phase3:preflight -- <Reel>
npm run reel:render -- <Reel>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel> <Final-MP4>
```

`reel:render` must create a candidate, run post-render QA and release a final MP4 only if QA passes.

QA must reject:

- black/empty visual core
- caption-only/header-only scene
- missing image
- missing animation binding
- animation with no real motion
- animation that does not explain its beat
- non-black/decorative background
- missing audio
- wrong dimensions/timeline

An MP4 file by itself is never proof of completion.

## Repository safety

- never work on `main`
- never merge/force-push/delete previous work without explicit instruction
- never weaken tests/validators/locks to make a reel pass
- fix actual content/integration errors instead
