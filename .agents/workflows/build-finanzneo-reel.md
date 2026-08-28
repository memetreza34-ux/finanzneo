---
description: Execute FinanzNeo Phase 3 safely from prepared Phase-1/Phase-2 assets, with hard animation bindings, pure-black background and render QA.
---

# FinanzNeo Reel — Phase 3 workflow

`CLAUDE.md` is the highest authority. This workflow is intentionally narrow: Antigravity integrates a prepared reel; it does not invent missing Phase-1 creative work.

## Read first

1. `CLAUDE.md`
2. `.agents/rules/finanzneo-reel-safety.md`
3. target `03-szenen/scene-index.json`
4. target `05-projektdateien/PHASENSTATUS.md`
5. `docs/PHASE-3-COMPLETION-GATE.md`
6. `reels/PRODUKTIONSSTANDARD.md`

If `scene-index.json.phase3Executor` is not `antigravity`, stop and use the configured executor.

## 0. Repository safety

Record:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
git diff --stat
git diff --name-only
```

Never work on `main`. Never merge, force-push, delete previous work or weaken validators.

## 1. Hard readiness gate

Run first:

```bash
npm run reel:ready -- <Reel-Pfad>
```

If this fails, STOP. Report all exact missing/invalid files. Do not create substitute images, audio, timings or animations.

A successful run means the canonical Phase-1 `animation.tsx` files are SHA-256 sealed. Antigravity may not edit, replace or simplify them.

## 2. Production manifest

Create it only after readiness passes:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
```

Implement every scene from `scene-index.json` and complete `phase3-production-manifest.json`.

### Image scene

- use the exact user image named by `googleFlowFileName`
- image must be visibly rendered in the scene
- no stock/generated/placeholder replacement
- no caption-only or header-only substitute

### Animation scene

- import the exact `scene.animationSourceFile`
- bind `scene.animationExport` to the scene's `animationId`
- `componentPath` must point to the sealed Phase-1 source
- no replacement animation
- no dummy/fallback animation
- missing binding must fail the render

## 3. Background contract — non-negotiable

Every Reel frame uses the central `FinanceBackground`, which is static pure black `#000000`.

Antigravity MUST NOT add or import:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- particle fields
- aurora/glow backgrounds
- animated grids
- background gradients/vignettes
- decorative moving background elements

The black canvas is intentionally plain. Motion belongs to the scene content, never to the background.

## 4. Layout

Use only central `REEL_STYLE`:

```text
Header Y154
Visual Y320–1480
Caption bottom340
Transition 3 frames
```

Header = normal white text + simple semantic line icon. No capsule/chip/pill/panel and no forced ALL CAPS.

## 5. Captions

- real Phase-2 word timings only
- active word green, remaining words white
- max 2 lines
- no stroke, jump or scale-pop
- clip at scene boundary

## 6. Preflight — must pass before render

Set manifest status to `READY_TO_RENDER`, then run:

```bash
npm run reel:phase3:preflight -- <Reel-Pfad>
```

This must verify all scenes, animation hashes/bindings and the pure-black background contract. Do not render around a failed preflight.

## 7. Only supported production render

```bash
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

This creates a candidate first. Post-render QA must pass before a final MP4 is released.

Render QA checks per scene:

- visual core is actually occupied
- image scene is not blank/caption-only
- animation scene has visible content and real motion
- free edge remains static black
- no background particles/aurora/grid
- audio stream exists
- dimensions and timeline are correct

A black/empty reel is a FAILURE, not a deliverable.

## 8. Export

Only after render QA passes:

```bash
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

Only successful export = `FINAL_COMPLETE`.

## Never do this

- claim an MP4 is finished because Remotion produced a file
- bypass `reel:ready`, preflight or render QA
- hide missing visuals behind captions/header/background motion
- use particles/aurora/grid to make frame-diff QA pass
- alter sealed Phase-1 animation code
- create fake movement for QA
- output a candidate MP4 as final

If a gate fails, fix the actual scene/asset/integration error or stop with the exact blocker.
