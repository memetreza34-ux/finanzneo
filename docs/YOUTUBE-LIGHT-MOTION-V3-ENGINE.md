# FinanzNeo YouTube Light Motion V3 — Implementation

## Purpose

One canonical reusable motion engine for **new** 16:9 YouTube finance animation.

- 1920 × 1080 / 30 fps.
- Light backgrounds, graphic 2D, no simulated physical 3D.
- No large scene headlines, scene numbers, demo chrome or baked-in captions.
- Numbers, labels and data are allowed only when they explain the current beat.
- Each scene may have a different *light 2D* design.
- Reuse motion logic; do **not** copy a hardcoded demo and replace only its labels.
- Existing Reel/YouTube V1/V2 examples stay for regression or reference, **not** as defaults. Do not delete legacy components used by existing productions.

## Architecture

```text
src/youtube-motion/light-v3/
  core.ts             frame math, stable ranking, arcs, path sampling, Bézier movement
  charts.tsx          data-driven table and bar reflow, donut build, continuous trend
  systems.tsx         moving cashflow tokens, value heatmap, waffle, delta comparison
  LightMotionV3.tsx   isolated example scenes, showcase composition, visual QA sheet
  index.ts            optional API import
```

Composition IDs:

```text
YouTubeLightMotionV3       complete 8-scene motion lab
YouTubeLightMotionV3QA     4-frame 2-column contact sheet (each of 8 scenes)
RankRaceV3
DonutBuildV3
TrendTraceV3
FlowTokensV3
HeatmapFillV3
SortableTableV3
WaffleGrowV3
DeltaCompareV3
```

## Real mechanism examples

| Visual | Motion | What changes |
|---|---|---|
| Bar ranking | reflow | ranks, Y positions, values and bar widths continuously interpolate |
| Table | reflow | rows move to new ranked positions rather than disappearing/reappearing |
| Donut | segmented-arc | every slice grows from its real start/end angles |
| Trend | path-trace | tip moves continuously between samples; no jumping |
| Money flow | token-follow | tokens follow Bézier curves and sink counters accumulate |
| Heatmap | value-fill | cells gradually change intensity based on actual values |
| Waffle | grid-fill | 100 cells progressively fill to a data-driven target |
| Comparison | delta | final value, width and difference all animate together |

These are reference implementations, **not** a closed list.

## Motion contract

```text
spoken beat
→ viewer change
→ 3 distinct light-2D ideas
→ best visual choice
→ mechanic (reorder / draw / follow / split / etc.)
→ data-driven component or custom React
→ start → change → consequence → result hold
→ 4-keyframe visual review
```

Prefer meaningful transformation over identical spring-pop entries. Mechanic can repeat when it remains the best explanation.

## Commands

```bash
npm ci
npm run typecheck
node --import tsx --test tests/youtube-light-motion-v3.test.ts
npm run render:youtube-light-motion-v3
npm run qa:youtube-light-motion-v3
```

Video: `out/youtube-light-motion-v3/showcase.mp4`

QA contacts:

```text
out/youtube-light-motion-v3/qa/contact-10.png
out/youtube-light-motion-v3/qa/contact-35.png
out/youtube-light-motion-v3/qa/contact-65.png
out/youtube-light-motion-v3/qa/contact-90.png
out/youtube-light-motion-v3/qa/manifest.json
```

Each contact sheet tiles the **same exact frame** of all 8 standalone compositions.

The QA script checks that files were rendered and have nontrivial size. It does **not** claim aesthetic approval, detect every collision or infer human readability. Review all contact sheets and the full motion video at 100% and 50% display scale.

## Acceptance criteria

- Every visual makes its explanatory point without voiceover-assisted guesswork.
- No missing text, cut-off values, numeric jumps, broken formats, or accidental overlaps.
- Start and payoff are visibly different.
- Smooth reordering means real stable identity-based position interpolation.
- Trends follow real plotted values and labels.
- All charts have valid totals/scales and faithful numeric representations.
- Contrast/typography stays readable on common desktop and mobile previews.
- Result is held long enough to understand before transition.
- No dark backgrounds, giant generic demo headlines, fake 3D, or generic canned fades.

## Status / legacy

This V3 engine is a **new reusable path** for future YouTube visuals. It does not silently replace all legacy Reel or YouTube components, and a passing render is not itself proof of publication-ready editorial quality.

Security audit is a separate repository-wide gate; keep `npm audit --audit-level=high` enabled. Fix dependencies in a controlled lockfile update instead of skipping this step.
