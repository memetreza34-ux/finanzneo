---
description: Render the 14 prepared FinanzNeo Editorial Motion V1 examples with Antigravity without changing their creative design.
---

# Antigravity — Render Editorial Motion V1 Examples

## Goal

Render the prepared Remotion examples exactly as authored.

Antigravity is the **renderer and QA executor** here, not the creative director.

## Branch safety

Never work on `main`.

Use the current feature branch.

## Read first

1. `docs/FINANZNEO-EDITORIAL-MOTION-V1.md`
2. `src/reels-test/EditorialMotionExamplesV1.tsx`
3. `src/finance-motion/editorial-v1.tsx`
4. this workflow

## Hard rule

Do **not** redesign the examples before rendering.

Do not:

- replace them with old PremiumPhysical animations
- add headers
- add captions
- add voiceover
- add black glossy 3D
- add glow / particles / dashboards
- add extra camera movement
- simplify them into placeholders

## Render all examples

Run:

```bash
npm ci
npm run render:editorial-motion-examples
```

Expected output directory:

```text
out/editorial-motion-v1/
```

Expected files:

```text
01-transfer.mp4
02-budget-split.mp4
03-salary-growth.mp4
04-fee-drag.mp4
05-portfolio-split.mp4
06-rebalancing.mp4
07-diversification.mp4
08-loan-paydown.mp4
09-deposit-protection.mp4
10-scenario-compare.mp4
11-timeline.mp4
12-compound-growth.mp4
13-mountain-goal.mp4
14-late-fee.mp4
```

## Visual QA

Check each MP4 at:

- first meaningful frame
- mid-motion frame
- final result frame

Reject only for a real technical or visual defect:

- clipped content
- unreadable text
- broken layout
- missing motion
- broken colors
- render error
- obvious visual overlap

Do not reject merely because the animation is intentionally simple.

## Output

Report:

- PASS / FAIL for each of the 14 renders
- exact failed composition if any
- exact technical reason
- do not modify creative direction unless explicitly requested
