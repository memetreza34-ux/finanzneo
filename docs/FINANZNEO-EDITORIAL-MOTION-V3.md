# FinanzNeo Editorial Motion V3

`MOTION_WORLD: finanzneo-editorial-motion-v3`

V3 is the preferred implementation layer for new high-quality FinanzNeo animations.

It does not replace the Editorial Finance image world. It turns that world into motion.

## Goal

Move away from:

- animated dashboards
- animated cards
- generic chart templates
- glossy finance objects
- motion for motion's sake

Move toward:

- animated editorial illustrations
- content-shaped compositions
- simple real-world metaphors
- meaningful geometry
- clear narrative transformations
- fewer but stronger movements

## Core question

Before coding:

> What should the viewer literally see change?

Then design the simplest strong visual mechanism.

## Motion grammar

V3 uses a small reusable motion grammar:

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

These are movement verbs, not templates.

A scene can combine them, but every extra verb must carry information.

## Scene design sequence

```text
spoken idea
→ visible question
→ 3 visual concepts
→ choose strongest concept
→ plan 4 keyframes
→ choose motion grammar
→ build Remotion scene
→ render MP4
→ render 10 / 35 / 65 / 90 percent keyframes
→ visual QA
```

Do not begin with code.

## Keyframe planning

Every scene must be understandable in four representative stills:

1. **10% — START**
2. **35% — CHANGE**
3. **65% — PAYOFF BUILD**
4. **90% — RESULT HOLD**

If those four images look like unrelated UI states, redesign.

## Visual language

Preferred:

- 2D editorial illustration
- subtle 2.5D only when useful
- warm cream, off-white, mist, sage, muted colors
- simple objects
- clean paths
- low detail
- strong silhouette
- readable hierarchy
- human-designed asymmetry when helpful

Not default:

- chart-in-card
- text box stacks
- generic dashboard layouts
- glass UI
- glossy coins
- pedestals
- neon
- particle worlds
- cinematic camera moves

## V3 code structure

```text
src/finance-motion/v3/
├── motion-tokens.ts
├── motion-primitives.tsx
├── editorial-objects.tsx
├── morphs.tsx
├── path-motion.tsx
├── reveals.tsx
├── scene-composer.tsx
├── index.ts
└── examples/
```

## Native Remotion

Prefer the existing native Remotion stack:

- `useCurrentFrame`
- `interpolate`
- `spring`
- `Easing`
- `@remotion/paths`
- `@remotion/shapes`
- `@remotion/layout-utils`
- `@remotion/transitions`
- `@remotion/effects` only when restrained
- `@remotion/motion-blur` only for truly fast movement

Do not install another runtime animation framework unless Remotion genuinely cannot express the idea.

## V3 examples

### 1. Mortgage Reset

`EditorialV3MortgageReset`

Story:

```text
house
→ fixed-rate contract
→ 10-year calendar travels forward
→ old rate swaps to new rate
→ monthly payment rises
```

Motion grammar:

```text
FOLLOW + SWAP + COUNT + EMPHASIZE
```

### 2. Investment Crossroads

`EditorialV3InvestmentCrossroads`

Story:

```text
person at crossroads
→ same money takes two paths
→ bank path stays flat
→ investment path visibly grows
```

Motion grammar:

```text
SPLIT + DRAW + FOLLOW + EMPHASIZE
```

### 3. Recurring Costs

`EditorialV3RecurringCosts`

Story:

```text
phone + streaming + gym
→ small costs merge
→ one monthly receipt
→ monthly total becomes annual total
```

Motion grammar:

```text
MERGE + STACK + SWAP + COUNT
```

## Quality gate

A V3 scene fails if:

- it is mainly a card/dashboard
- the motion could be removed without changing the explanation
- labels explain more than the objects
- there is no clear hero
- too many things move simultaneously
- result is weaker than start
- it looks unlike the Editorial Finance image world
- keyframes do not tell a coherent visual story

A V3 scene passes when:

- the scene is understandable without narration
- the motion expresses the mechanism
- the result reads instantly
- it looks like a moving editorial illustration
- the visual language matches Flow images
