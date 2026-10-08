---
name: finanzneo-youtube-motion-director
description: Builds high-quality, data-driven, bright 2D Remotion scenes for 16:9 FinanzNeo YouTube videos using canonical Light Motion V3; visual change first, real layout motion and QA.
---

# FinanzNeo YouTube Motion Director — Light 2D + Motion Engine V3

## Goal

Build clear and professionally authored 16:9 motion for the spoken thought.
A new animation must not be merely an existing scene with other labels.

**Design lock**:
- 1920×1080, 30 fps
- light background, clean 2D/vector/editorial
- no 3D/pseudo-3D, dark world, glow, giant generic headlines or demo scene numbers
- only values, short content labels, legend/axis/table headers when needed
- illustrations/styles can vary widely **within** the light 2D direction

## Active implementation

Start with:
1. `docs/YOUTUBE-LIGHT-MOTION-V3-ENGINE.md`
2. `docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md`
3. `src/youtube-motion/light-v3/core.ts`
4. `src/youtube-motion/light-v3/charts.tsx`
5. `src/youtube-motion/light-v3/systems.tsx`
6. `src/youtube-motion/light-v3/LightMotionV3.tsx`
7. target visual plan and `animation.tsx`

New YouTube motion chooses from this **canonical V3 engine** when suitable.
Older motion libraries and showcases are legacy references; never assume they are the current default. Do not delete old components used in existing videos.

## Core workflow

1. Identify spoken thought and concrete viewer change.
2. Propose **three genuinely distinct light 2D mechanisms**, not merely three colors.
3. Choose the clearest, best-looking approach.
4. Determine the data/labels/unit.
5. Select a mechanism: `reorder`, `trace`, `draw-arc`, `follow-path`, `fill-grid`, `compare-delta`, `split`, `merge`, `highlight`, `filter`, `morph`, or create custom.
6. Use reusable data-driven Visual from V3 or write a new one **without copying a demo's hardcoded data**.
7. Plan start → change → consequence → payoff, including result hold.
8. Render and visually inspect 10/35/65/90% keyframes, plus the full clip.
9. Fix only real defects and rerender. A successful TypeScript build alone does not mean visual quality passed.

## Essential distinction

`BarChart` is a **visual**.
`Grow`, `Sort`, `Reorder`, `Compare`, `Stack`, `Filter` are **mechanics**.

An animation is selected by combining the best visual with the best mechanic.
A table that sorts must **reflow positions with persistent row identities**.
A line graph must **draw continuously**, with its marker following the line.
A donut must **draw segments**, not fade in an already-complete ring.

## Code quality

- Deterministic frame math only (`useCurrentFrame`, `interpolate`/`spring`, helpers).
- No `Math.random`, timers, runtime fetches or CSS transitions.
- No silent nonsense financial figures; provide example values with documented assumptions.
- Use data/props, not constants buried in visual primitives.
- Stable keys, correct totals, axes, unit formatting and ranking ties.
- Motion reuse **when it best explains the scene**. Avoid repetition without purpose; do not invent effects for novelty.
- Stay in safe margins. No clipping, overlapping text or tiny chart labels.
- Do not add titles like "BAR CHART" or "STATS".

## Preview and QA

```bash
npm run typecheck
node --import tsx --test tests/youtube-light-motion-v3.test.ts
npm run render:youtube-light-motion-v3
npm run qa:youtube-light-motion-v3
```

Inspect:
```text
out/youtube-light-motion-v3/showcase.mp4
out/youtube-light-motion-v3/qa/contact-10.png
out/youtube-light-motion-v3/qa/contact-35.png
out/youtube-light-motion-v3/qa/contact-65.png
out/youtube-light-motion-v3/qa/contact-90.png
```

The contact-sheet process confirms render output; **human/vision review remains required** to accept clarity and aesthetics.
Do not claim that an automatic size check detects clipping.

## Source rules and integration

New per-beat source must still satisfy the existing Phase-1 `animation.tsx` contract, Motion V3 metadata, and the Phase-1 seal.
The V3 showcase is a lab, **not** a replacement for production integration, voiceover or caption systems.

## Final direction

Light, clean, 2D, data-accurate. Animate the *idea*, not a generic presentation template.
