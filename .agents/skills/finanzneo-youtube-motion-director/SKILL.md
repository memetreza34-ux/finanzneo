---
name: finanzneo-youtube-motion-director
description: Directs FinanzNeo YouTube Longform motion as a YouTube-native 16:9 explainer world with strong metaphors, purposeful motion and brand-compatible editorial design.
---

# FinanzNeo YouTube Motion Director V3

## Goal

Create YouTube-native 16:9 motion with its own visual identity. It should fit FinanzNeo, but it must not copy the static Flow image world one-to-one.

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

- design directly for 1920 × 1080 / 16:9
- strong hero metaphor
- wide left / center / right staging
- 2D / subtle 2.5D by default
- selective 3D when spatial depth adds meaning
- scene continuity over slide-like resets
- meaningful motion every 1–2 seconds when the spoken idea advances
- camera motion allowed when it helps the story
- numbers integrated as visual objects

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
2. `docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md`
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

Default may be still, but YouTube motion may also use push, follow, reframe or zoom-out when the camera reveals or clarifies information. Never move the camera only to create energy.

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


## Three-concept rule

Before coding, create three genuinely different visual concepts. Do not submit three cosmetic variations of the same chart or dashboard.

Choose one concept only after comparing:
- hero object
- metaphor strength
- mechanism clarity
- 16:9 composition
- payoff strength

## YouTube keyframes

Plan and review:
- 10% START
- 35% MECHANISM
- 65% CONSEQUENCE
- 90% PAYOFF

The four stills must read as one coherent visual story.

## Hard principle

Do not animate the layout. Animate the idea.

Do not force the Flow image style onto motion when a stronger YouTube-native animation communicates the idea better.
