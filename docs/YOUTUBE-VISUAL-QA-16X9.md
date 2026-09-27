# FinanzNeo — YouTube 16:9 Visual QA V1

`YOUTUBE_VISUAL_QA_STANDARD: finanzneo-youtube-visual-qa-16x9-v1`

## Scope

Applies only to YouTube Longform under `youtube/`.

Do not reuse Reel pixel zones such as `Y320–1400` or `bottom 340` for YouTube. YouTube uses its own 1920×1080 layout and motion-safe-area contract.

## Required representative states

For every animated YouTube visual inspect at least:

1. START
2. EARLY / about 25%
3. MID / about 50%
4. LATE / about 75%
5. RESULT HOLD

For static/image scenes inspect at least one stable representative frame.

## 16:9 layout checks

- frame is 1920×1080
- pure Remotion may use the full frame
- Flow imagery itself remains contained
- critical animated content stays at least about 64 px from the frame edges
- no important label, number, chart point, object or result is clipped
- header/icon and explanatory content do not collide
- the main visual is large enough to read without excessive empty black space
- the scene remains readable at normal YouTube viewing size, not only when zoomed in

## Motion-quality checks

Reject or redesign when:

- START and RESULT look nearly the same
- only camera drift/zoom changes
- the scene is mainly sequential text fades
- three cards or panels are the whole animation
- a progress bar carries the entire explanation
- motion exists only because Phase B allows motion
- every object shares the same timing/easing
- a strong static diagram/image would be clearer
- an image and Remotion overlay explain the same thing twice
- the mechanism is too small inside the 1920×1080 canvas
- a result disappears before it can be understood

## Finance checks

- numbers shown in the animation match the approved script/data/calculation source
- comparisons use a common scale where needed
- axes/units/percent signs are unambiguous
- nominal vs real values are visually distinguishable when relevant
- positive/negative color semantics stay consistent
- no decorative chart animation implies a trend not present in the data

## Tool-routing checks

Before approving a custom one-off animation, verify whether the scene could use:

- `MotionNumber`
- `MotionComparisonBars`
- `MotionLineChart`
- `MotionMoneyFlow`
- `MotionBeforeAfter`
- existing PremiumCharts / finance components
- `@remotion/paths` / `@remotion/shapes`
- Three/R3F when spatial depth is genuinely explanatory
- Lottie only as a support layer

Using a reusable component is not mandatory when a custom implementation is clearly better. The check exists to avoid rebuilding weaker versions of existing mechanisms.

## Cross-scene rhythm

Review adjacent scenes together:

- avoid several identical bar scenes in sequence
- avoid several text-only motion scenes in sequence
- avoid repeating the same left/right composition without reason
- alternate concrete, comparative, numeric and diagrammatic views when that improves comprehension
- repetition is allowed when it intentionally teaches a repeated structure

## Acceptance

YouTube motion QA passes only when:

1. the explanatory change is visible across representative states
2. the result state works as a still
3. no critical content is clipped
4. the full-frame canvas is used intentionally
5. exact finance values are correct
6. motion beats a reasonable static alternative
7. adjacent scenes do not become visually monotonous without reason

## Rule

> A technically valid animation can still fail visual QA. If it looks weaker than a strong static solution, replace it rather than defending the motion.
