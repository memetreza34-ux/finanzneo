---
description: Build and visually QA FinanzNeo Editorial Motion V3 scenes with Remotion.
---

# Antigravity — Editorial Motion V3

## Scope

Animation only.

Do not redesign headers, captions, voiceover, cover or unrelated video structure.

## Read first

1. `docs/FINANZNEO-EDITORIAL-MOTION-V3.md`
2. `.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md`
3. target scene script / spoken point
4. `src/finance-motion/v3/`

Use the installed official Remotion skills when an API or rendering detail is uncertain.

## Mandatory creative preflight

Before writing code, produce exactly three **meaningfully different** visual concepts.

For each concept state:

- hero object
- visible question
- main transformation
- motion grammar
- final payoff

Reject concepts that are only three visual variants of the same dashboard/chart.

Choose one concept and document why it is strongest.

## Keyframe plan

Plan these four stills before coding:

```text
10% START
35% CHANGE
65% PAYOFF BUILD
90% RESULT HOLD
```

They must form one coherent visual story.

## Motion grammar

Use only the verbs that carry information:

```text
DRAW
FOLLOW
REVEAL
SPLIT
MERGE
STACK
SHIFT
SWAP
EMPHASIZE
COUNT
```

## Implementation

Prefer:

- `src/finance-motion/v3`
- `@remotion/paths`
- `@remotion/shapes`
- SVG
- `useCurrentFrame`
- `interpolate`
- `spring`
- `Easing`

Use 3D only when the information is genuinely spatial.

## Render QA

Run:

```bash
npm run render:editorial-motion-v3
```

Expected:

- 3 MP4s
- 12 PNG keyframes

Review every 10/35/65/90 PNG.

FAIL when:

- scene looks like UI/dashboard
- hero object is unclear
- labels explain more than motion
- start and result are visually too similar
- too many things move at once
- scene no longer matches Editorial Finance image world
- payoff is weak
- clipping/overlap occurs

PASS when the four frames tell the visual story without narration.

## Hard boundary

Antigravity may improve a V3 scene only after identifying the exact QA failure.

Do not add glow, particles, black glossy 3D, camera motion or decorative movement as a generic quality fix.
