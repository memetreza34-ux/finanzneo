---
name: remotion-director
description: Directs FinanzNeo animation scenes as simple editorial motion that matches the FinanzNeo Editorial Finance image world.
---

# FinanzNeo Remotion Director

## Goal

Build animation scenes that feel like the **moving version of the FinanzNeo Editorial Finance image world**.

The animation must help a beginner understand the spoken sentence faster and more clearly.

## Authority

Read in this order:

1. `CLAUDE.md`
2. `docs/FINANZNEO-EDITORIAL-MOTION-V1.md`
3. target reel `03-szenen/scene-index.json`
4. target scene `szene.md`
5. target scene `remotion.md`
6. existing `animation.tsx`
7. `.agents/plugins/finanzneo-motion/rules/remotion-production.md`
8. this skill

## EDITORIAL MOTION

Default visual language:

- 2D or subtle 2.5D
- matte colors
- simple large shapes
- low-to-moderate detail
- warm cream / off-white / light gray / muted color surfaces
- dark only when it clearly fits the subject
- no forced physical-object scene
- no forced 3D
- no forced camera movement
- no decorative finance spectacle

Preferred high-quality library:

```text
src/finance-motion/editorial-v2.tsx
```

Legacy fallback only:

```text
src/finance-motion/editorial-v1.tsx
```

## Core narrative

Every animation must have:

```text
START
→ MEANINGFUL CHANGE
→ RESULT
→ RESULT HOLD
```

A trigger/reaction chain may be added when the content needs it, but it is not mandatory.

## Minimum motion rule

Use the **minimum motion** required to explain the beat.

One motion channel may be enough.

Examples:

- one bar grows
- one amount changes
- one timeline extends
- one document gets an extra fee
- one path toward a goal reveals
- one allocation changes its proportions

Do not add extra movement just to make the scene feel active.

## Camera

Default:

```text
CAMERA_ROLE: still
```

Use follow, push or reframe only when the camera itself improves understanding.

No constant zooming or parallax by default.

## Engine routing

Use the simplest implementation that explains the scene:

- **Remotion HTML/CSS**: flat editorial shapes, documents, labels, bars, simple people/objects.
- **SVG / @remotion/paths / shapes**: timelines, charts, routes, mountain paths, clean vector mechanisms.
- **2.5D / Three.js**: only when real spatial depth matters to the explanation.
- **Lottie**: small support motion only.
- **Flow image**: not part of an ANIMATION scene's main visual.

## Editorial surfaces

Prefer `EditorialMotionStage` for new Reel animations.

Available surfaces:

- cream
- off-white
- light-gray
- muted-green
- dark when justified

Do not fall back to `PremiumPhysicalStage` or old Physical primitives for new Editorial Motion scenes.

## Visual beats

The visual should advance only when the spoken idea advances.

A new visible beat can be:

- a new value
- a changed size
- a revealed milestone
- a changed comparison
- a new cost line
- a moved object
- a completed path
- a final result

Camera drift alone is not a new beat.

## Lottie

Use Lottie only when a small vector motion materially improves the scene.

Good:

- restrained check
- calendar page flip
- simple warning accent
- short chart stroke

Bad:

- full generic Lottie scene
- decorative looping
- unrelated animated finance icons

## Representative-frame review

Inspect:

- START
- MID-CHANGE
- RESULT
- FINAL RESULT HOLD

The meaning should be clear at each stage.

## Quality checklist

Reject and redesign if:

- it looks like the retired glossy black 3D world
- it uses old `PremiumPhysicalStage` / `Physical*` primitives
- it looks like a dashboard or app UI
- the meaning depends mainly on labels
- too many elements move at once
- motion exists only for spectacle
- glow, holograms, coins or podiums dominate
- the camera moves without explanatory reason
- a simpler animation would explain the same sentence better
- the final result is not held long enough

## Final workflow

1. read the spoken beat;
2. write one sentence describing what must visibly change;
3. choose the simplest editorial mechanism;
4. check `src/finance-motion/editorial-v2.tsx` first for a genuine best fit; use `editorial-v1.tsx` only as legacy fallback;
5. otherwise build a custom Editorial Motion scene;
6. use `EDITORIAL_MOTION_COLORS`;
7. implement deterministic Remotion motion;
8. inspect START, MID-CHANGE, RESULT and RESULT HOLD;
9. run the animation validator;
10. only then seal Phase 1 animation code.


## Editorial Motion example lab

For the prepared multi-example test, use:

```bash
npm run render:editorial-motion-v2
```

Do not redesign the prepared examples during render QA. Antigravity should render and inspect them exactly as authored.


## Official Remotion skills — required for advanced motion work

The workspace bootstrap already installs the official `remotion-dev/skills` pack for Antigravity.

For non-trivial animation work, consult these installed skills instead of guessing APIs:

- `/remotion-best-practices`
- `/remotion-markup`
- `/remotion-docs`
- `/remotion-studio`
- `/remotion-render`

Use `/remotion-docs` before introducing a Remotion package/API that is not already familiar.

## Preferred native Remotion toolkit

Before adding another animation library, prefer the packages already present in this repo:

- `@remotion/paths` for drawn paths, path-following and SVG geometry
- `@remotion/shapes` for editable vector primitives and pie/arrow/callout geometry
- `@remotion/transitions` for scene-to-scene showcase transitions
- `@remotion/layout-utils` for text/layout fitting
- `@remotion/effects` for restrained canvas effects only when they improve the editorial look
- `@remotion/motion-blur` only for fast movement where blur materially improves readability
- `@remotion/lottie` for small support motions
- `@remotion/three` only when spatial depth is necessary
- `recharts` for data-heavy charts when native SVG would be unnecessarily complex

Do not install another runtime animation framework merely to make a scene feel more sophisticated. First use Remotion's native timing, paths, shapes, sequences and spring/interpolation system properly.
