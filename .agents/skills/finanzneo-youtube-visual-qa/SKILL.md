---
name: finanzneo-youtube-visual-qa
description: Reviews FinanzNeo YouTube 16:9 static and animated scenes in Remotion Studio using representative frames, YouTube-safe zones, finance-value checks and anti-PowerPoint motion criteria.
---

# FinanzNeo YouTube Visual QA

## Goal

Catch visible YouTube Longform defects that code validators cannot reliably detect.

This skill applies to `youtube/` projects only. Do not reuse vertical Reel coordinates or caption zones.

## Authority

Read in this order:

1. `CLAUDE.md`
2. `youtube/PRODUKTIONSSTANDARD.md`
3. `docs/YOUTUBE-SCRIPT-VISUAL-PLANNING.md`
4. `docs/YOUTUBE-MOTION-QUALITY-V1.md`
5. `docs/YOUTUBE-VISUAL-QA-16X9.md`
6. target `04-visuals/visual-index.json`
7. target scene source and plan

## Tool

Use Remotion Studio locally. When browser automation is available, prefer the Playwright CLI for screenshots and state inspection.

Do not inspect a Reel composition when the target is YouTube Longform.

## Representative-state review

For each real animation inspect:

```text
START
EARLY ~25%
MID ~50%
LATE ~75%
RESULT HOLD
```

For static/image scenes inspect one stable representative frame.

The exact frame numbers follow the target scene duration and processed voiceover timing.

## YouTube 16:9 checks

Verify:

- 1920×1080 composition
- pure Remotion may use full frame
- Flow image remains contained
- critical content stays within about 64 px motion safe area
- no important object, number, label, chart point or result is clipped
- header/icon do not collide with the explanatory mechanism
- main action is large enough
- black-space balance is intentional rather than empty
- result state is readable as a still

Do not apply Reel-specific `Y320–1400`, `Header Y=154` or `bottom 340` checks to YouTube.

## Motion-quality review

Reject when:

- START and RESULT look almost identical
- only zoom/camera drift changes
- the animation is mostly text fading in
- three cards/panels are the whole scene
- a progress bar carries the explanation
- all objects share one identical progress curve
- the mechanism is tiny inside the frame
- motion only decorates a static idea
- image and overlay duplicate the same semantic job
- the result is not held long enough to understand

## Existing-stack review

Before accepting a custom implementation, check whether an existing repository mechanism would be stronger:

- `MotionNumber`
- `MotionComparisonBars`
- `MotionLineChart`
- `MotionMoneyFlow`
- `MotionBeforeAfter`
- PremiumCharts / FinanceConcepts / DiagramBlocks
- central calculations in `src/finance/`
- paths/shapes for meaningful routes/geometry
- Three/R3F only for explanatory spatial depth
- Lottie only for supporting micro-motion

Do not force reuse when the custom scene is genuinely clearer.

## Finance correctness

For finance scenes verify visually and against source data:

- exact numbers
- units and percent signs
- consistent scales
- nominal vs real distinction when relevant
- no chart implication unsupported by data
- positive/negative/money color meaning stays consistent

## Cross-scene comparison

Inspect nearby scenes together.

Reject monotonous runs such as:

- repeated identical bars
- repeated text-only stacks
- repeated left/right cards
- repeated same camera/layout with no teaching reason

Repetition is allowed when the repeated structure itself is instructional.

## Fix ownership

When a problem is found:

- scene-specific motion defect → fix target `animation.tsx`
- reusable primitive defect → fix central motion primitive plus regression test
- wrong finance value → fix approved data/calculation source
- bad generated image → fix/re-generate source image, not the render artifact
- global YouTube layout defect → fix the YouTube layout contract/source, not a screenshot

Never patch rendered frames to hide source defects.

## Pass condition

PASS requires:

1. real state change across the animation
2. clear result state
3. safe 16:9 composition
4. correct finance values
5. motion stronger than a reasonable static alternative
6. no accidental clipping
7. no obvious PowerPoint/dashboard regression
8. acceptable rhythm against neighboring scenes

A green TypeScript/build result does not override a visible QA failure.
