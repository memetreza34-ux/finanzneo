# FinanzNeo — Antigravity Safety Rules

These rules apply to Google Antigravity in this workspace. `CLAUDE.md` is the highest project authority; this file may only be stricter.

## Repository safety

- Never work directly on `main`.
- Never merge, force-push, rewrite shared history, delete previous reels/assets or weaken validators/tests/locks.
- Existing reels are read-only unless explicitly targeted.
- If a gate fails, fix the real reel/integration problem. Never weaken the gate.
- Do not upgrade dependencies unless explicitly requested.

## Respect the three-phase boundary

Phase 1 owns creative content and final `animation.tsx` sources.
Phase 2 owns final user images, final voiceover and real word timings.
Phase 3 integrates and renders.

Before Phase 3, run:

```bash
npm run reel:ready -- <Reel-Pfad>
```

If it fails, stop and report exact blockers. Never fabricate missing images/audio/timings/animations.

If `scene-index.json.phase3Executor` is not `antigravity`, do not take over that Phase-3 job.

## Image boundary

Antigravity MUST NOT generate or replace final Reel images. The user places all completed exact assets in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Missing image = report exact filename and wait.

The canonical still-image world is `finanzneo-editorial-finance-v1`, defined only in `docs/FINANZNEO-IMAGE-WORLD.md`.

Still images:
- prioritize one simple visual idea per spoken thought
- may use 2D, subtle 2.5D or selective simple 3D
- may use light, muted or dark backgrounds depending on the scene
- may use metaphors, charts, timelines, documents, companies/brands and simple scenes
- must avoid unnecessary AI-spectacle and clutter

For progressive image sequences, an approved previous scene image may be used as a real Flow reference. The next prompt must remain complete and should add/change only the planned element.

Do not reintroduce the retired black-3D image world or legacy image-world rules.


## Sealed animation boundary

After readiness succeeds, Phase-1 animation files are SHA-256 sealed.

Antigravity MUST NOT:

- edit or replace a sealed `animation.tsx`
- create a substitute animation
- use dummy/debug rectangles
- use `Math.sin`/`Math.cos` wiggle to satisfy frame-diff
- hide missing animation behind captions/header/background motion

Every animation scene must bind the exact `animationSourceFile` + `animationExport`. Missing binding is a hard blocker.

## Pure-black background boundary

Every Reel frame uses a static pure-black `#000000` canvas.

Antigravity MUST NOT import or add:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- particle fields
- moving grids
- aurora/glow backgrounds
- animated background gradients
- decorative moving background elements

Background motion must never count as scene animation.

## Required Phase-3 gates

```bash
npm run reel:phase3:init -- <Reel> <Composition-ID>
# implement every scene, complete manifest
npm run reel:phase3:preflight -- <Reel>
npm run reel:render -- <Reel>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel> <Final-MP4>
```

`reel:render` must release no final MP4 unless post-render QA passes.

The QA must reject black/empty visual cores, caption-only/header-only scenes, missing images, missing animation bindings, motionless animations, decorative/non-black backgrounds, missing audio or wrong dimensions/timeline.

A generated MP4 is not completion proof.

## Final permission boundary

Antigravity may create commits and a draft PR. It must not merge, publish, delete previous work or claim `FINAL_COMPLETE` unless all required gates actually pass.
