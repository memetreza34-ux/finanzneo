---
description: Execute FinanzNeo Phase 3 safely from prepared Phase-1/Phase-2 assets, with hard animation bindings, pure-black background and render QA.
---

# FinanzNeo Reel — Phase 3 workflow

`CLAUDE.md` is the highest authority. Antigravity integrates a prepared reel; it does not invent missing Phase-1 creative work.

## Read first

1. `CLAUDE.md`
2. `.agents/rules/finanzneo-reel-safety.md`
3. target `03-szenen/scene-index.json`
4. target `05-projektdateien/PHASENSTATUS.md`
5. `docs/FUTURE-COVER-HOOK-V3.md`
6. `docs/PHASE-3-COMPLETION-GATE.md`
7. `reels/PRODUKTIONSSTANDARD.md`

If `scene-index.json.phase3Executor` is not `antigravity`, stop and use the configured executor.

## 0. Repository safety

Record branch/status/HEAD before changes. Never work on `main`. Never merge, force-push, delete previous work or weaken validators.

## 1. Hard readiness gate

```bash
npm run reel:ready -- <Reel-Pfad>
```

If this fails, STOP. Report exact missing/invalid files. Do not create substitute images, audio, timings or animations.

A successful run SHA-256-seals canonical Phase-1 `animation.tsx` files. Antigravity may not edit, replace or simplify them.

## 2. Production manifest

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
```

Implement every scene from `scene-index.json` and complete `phase3-production-manifest.json`.

### Image scene

- exact user image named by `googleFlowFileName`
- image visibly rendered
- no stock/generated/placeholder replacement
- no caption-only or header-only substitute

### Scene-01 with Cover Hook V3

When `scene-index.coverHookContract.id === finanzneo-cover-hook-v3`:

- `scene-01` is **cover + first real content beat**
- Frame 0 is only the cover snapshot of that same scene
- no separate 0.1-second / 3-frame cover-only segment
- render Hero image + exact Remotion hook title at Frame 0
- Frame 0 has no caption, normal SceneHeader icon, CTA or extra card
- voiceover starts already in `scene-01` with the first spoken word
- captions may appear after Frame 0 while still inside `scene-01`
- scene-01 duration follows the real first hook word timings, never an artificial cover hold
- final `cover.png` comes from Frame 0 of the validated final MP4

### Animation scene

- exact `scene.animationSourceFile`
- exact `scene.animationExport`
- exact sealed path/hash
- bind to the scene's `animationId`
- no replacement/fallback animation
- missing binding = hard failure

## 3. Background contract

Every Reel frame uses static pure black `#000000` from central `FinanceBackground`.

Never add/import:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- particle fields
- aurora/glow backgrounds
- animated grids
- background gradients/vignettes
- decorative moving background elements

Motion belongs to scene content, never the background.

## 4. Final layout

Use only central `REEL_STYLE`:

```text
Header Y154
Header 56 px, minimum 50 px, max 2 lines
Icon 34 px
Visual Y320–1400
Caption bottom340, max 2 lines
Transition 3 frames
```

Header = pure white text + simple semantic line icon. No capsule/chip/pill/panel and no forced ALL CAPS.

`AnimationStage` hard-clips visible animation content to **Y320–1400**. It must not enter header or caption zones.

Source notes must stay above the caption and never overlap a two-line caption.

## 5. Captions

- real Phase-2 word timings only
- active word green, remaining words white
- max 2 lines
- no stroke, jump or scale-pop
- clip at scene boundary
- Cover Hook V3 exception: Frame 0 of scene-01 is caption-free, but captions may begin immediately after Frame 0 inside the same scene

## 6. Preflight

Set manifest status to `READY_TO_RENDER`, then run:

```bash
npm run reel:phase3:preflight -- <Reel-Pfad>
```

This must verify all scenes, animation hashes/bindings, layout and the pure-black background contract. Do not render around a failed preflight.

## 7. Production render

```bash
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

This creates a candidate first. Post-render QA must pass before a final MP4 is released.

Render QA checks per scene:

- visual core actually occupied
- image scene not blank/caption-only
- Cover Hook V3: Frame 0 is a clean cover AND a later frame of the same scene is still the first content hook
- Cover Hook V3: audio begins in scene-01, not scene-02
- animation scene has visible content and real motion
- animation explains its beat
- free edge remains static black
- no background particles/aurora/grid/glow
- audio stream exists
- dimensions and timeline correct

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
- create a separate 0.1-second / 3-frame cover-only intro for Cover Hook V3
- delay the voiceover until scene-02 for Cover Hook V3
- hide missing visuals behind captions/header/background motion
- use particles/aurora/grid to make frame-diff QA pass
- alter sealed Phase-1 animation code
- create fake movement for QA
- output a candidate MP4 as final

If a gate fails, fix the actual scene/asset/integration error or stop with the exact blocker.
