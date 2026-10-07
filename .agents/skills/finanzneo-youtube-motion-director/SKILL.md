---
name: finanzneo-youtube-motion-director
description: Directs FinanzNeo YouTube Longform motion as simple editorial 2D/2.5D animation that matches the Editorial Finance image world.
---

# FinanzNeo YouTube Motion Director V3

## Goal

Create motion that looks like the moving version of the FinanzNeo Editorial Finance image world.

Do not start from a component or effect. Start from the visible change the viewer must understand.

## Core rule

```text
spoken beat
→ viewerChange
→ simplest clear motion
→ result
```

One meaningful motion channel may be enough.

## Visual language

Default:

- 2D / subtle 2.5D
- matte colors
- few large shapes
- low-to-moderate detail
- light / warm / muted background
- still camera
- simple transitions

Optional:

- dark surface
- spatial depth
- 3D
- camera movement

Only use optional complexity when it improves understanding.

## Do not default to

- `PremiumPhysicalStage`
- old `Physical*` primitives
- glossy black 3D
- coin stacks
- podiums
- neon glow
- holograms
- dashboards
- particle backgrounds
- constant zoom/parallax
- multiple motion channels just for activity

## Authority

Read:

1. `CLAUDE.md`
2. `docs/FINANZNEO-EDITORIAL-MOTION-V1.md`
3. `youtube/PRODUKTIONSSTANDARD.md`
4. `docs/YOUTUBE-MOTION-V3.md`
5. target `04-visuals/visual-index.json`
6. target visual `remotion.md`
7. target `animation.tsx`

## Viewer-change-first

Write one sentence:

> What should the viewer literally see change?

Then choose the simplest implementation.

## Tool roles

### Pure Remotion

Good for:

- values
- percentages
- charts
- timelines
- simple comparisons
- debt / fee development
- document changes

### Flow image + Remotion

Use only when the static image is a strong base and motion adds actual information.

### SVG

Use for:

- lines
- curves
- charts
- paths
- weighting
- simple geometric relations

### Lottie

Small support action only.

### 3D

Only when actual spatial depth is part of the explanation.

## Motion density

No fixed count.

One channel is valid.

Add a second or third only when each adds information.

## Camera

Default:

`still`

Use push/follow/reframe only when the viewer benefits from it.

## Narrative

Minimum:

```text
START
→ RESULT
```

Common:

```text
START
→ MECHANISM
→ RESULT
```

The result should remain readable.

## Required metadata

Every motion-capable visual defines:

- `viewerChange`
- `animationIntent`
- `mechanicId`
- `visualTechniqueId`
- `techniqueDescription`
- `compositionFamilyId`
- `toolStack`
- `motionSignature.camera`
- `motionSignature.layout`
- `motionSignature.transformation`
- at least one meaningful `motionChannels` entry
- at least two `visualBeats`
- `animationSourceFile`
- `animationExport`

## Quality rejection

Reject when:

- it looks like the retired black glossy 3D world
- it relies on old Physical primitives
- it is more complicated than the sentence
- the camera is the main attraction
- too many elements move
- the scene looks like an app/dashboard
- decorative effects dominate
- a simpler editorial animation would communicate the same idea better

## Production

All motion remains deterministic from Remotion frames.

Phase 1 owns creative motion. Phase 3 integrates the sealed source and may not replace the mechanism.
