# FinanzNeo Editorial Motion V1

`MOTION_WORLD: finanzneo-editorial-motion-v1`

This is the canonical visual direction for **new FinanzNeo animations**.

It changes animation styling only. It does not define headers, captions, cover design or the rest of the video layout.

## Relationship to the image world

Animation is the moving version of:

```text
IMAGE_WORLD: finanzneo-editorial-finance-v1
```

The visual language should feel like one family:

- clean editorial finance illustration
- mostly 2D or subtle 2.5D
- matte colors
- large simple shapes
- low to moderate detail
- clear hierarchy
- human-designed composition
- flexible light or dark surfaces when the subject benefits from them

The difference is only that an animation shows a meaningful change over time.

## Core rule

```text
SPOKEN THOUGHT
→ WHAT MUST VISIBLY CHANGE?
→ SIMPLEST CLEAR MOTION
→ RESULT
```

Use the **minimum amount of motion** needed to make the idea easier to understand.

One clear change is enough when one clear change explains the sentence.

## Default visual treatment

Preferred:

- warm cream / off-white / light gray / muted color surface
- flat or lightly layered shapes
- restrained outlines
- almost no decorative shadow
- no glossy materials
- no forced depth
- no forced camera movement
- no forced physical-object metaphor
- short useful labels only

Dark surfaces remain allowed when they genuinely fit the scene, but are not the default.

## Motion character

Good motion:

- a bar grows or shrinks
- a number changes
- one element moves from A to B
- a timeline extends
- a comparison reveals its second state
- a document gains one extra cost line
- milestones appear one after another
- one simple illustrated object changes state
- a path, mountain or staircase progresses

Avoid motion that exists only to make the scene look active.

## Camera

Default camera role:

```text
still
```

Use push, follow or reframe only when it materially improves understanding.

Constant zooming, parallax for its own sake and dramatic camera movement are not part of the default style.

## No mandatory 3D

3D is optional, not a quality signal.

Use simple 3D only when the object or relationship is genuinely easier to understand in depth.

Do not default to:

- 3D coins
- pedestals
- glossy slabs
- metallic finance objects
- heavy material gradients
- dramatic perspective
- deep stage lighting

## No AI-slop motion language

Avoid as default:

- neon glow
- holograms
- floating coin showers
- futuristic dashboards
- glowing rails
- miniature cities
- animated particle backgrounds
- aurora / grid / energy effects
- constant bouncing
- decorative spins
- glossy toy-like objects
- too many simultaneous motion channels

## Content-first remains mandatory

The existing content-first logic stays:

```text
spoken point
→ viewer understanding
→ visible question
→ best mechanism
→ implementation
```

The motion library is a toolbox, not a menu that decides the concept.

## Editorial Motion Library

New animations should use:

```text
FINANCE_MOTION_LIBRARY: finanzneo-editorial-motion-library-v1
```

when a library mechanism is a genuine semantic best fit.

Current semantic mechanisms:

- money-transfer
- money-split
- value-growth
- value-drain
- allocation-split
- rebalancing
- diversification
- loan-paydown
- protection-limit
- scenario-comparison
- finance-timeline
- compound-growth

Their visual treatment is editorial and flat/lightweight, not the retired physical black-3D treatment.

## Animation narrative metadata

Every new production animation documents:

```text
MOTION_SOURCE
FINANCE_MOTION_ID
MECHANIC_ID
FOCAL_PATH
PRIMARY_ACTION
CAMERA_ROLE
PAYOFF

ANIMATION_NARRATIVE
START
MECHANISM
RESULT

EDITORIAL_VISUAL_NARRATIVE
HERO
SUPPORT
SURFACE
SHAPE_LANGUAGE
```

`RESULT_HOLD_FRAMES >= 15` remains required.

## QA

Reject or redesign when:

- the animation looks like a different brand from the new Flow images
- black glossy 3D is used by habit rather than content need
- glow / metallic materials / podiums dominate
- the scene needs several seconds before the idea is understood
- too many objects move at once
- camera movement is the main attraction
- labels carry the explanation instead of the visual change
- a simpler motion would explain the sentence better

Approve when:

- the visual family matches FinanzNeo Editorial Finance V1
- the first state is clear
- one meaningful change explains the spoken point
- the result is obvious and readable
- the scene feels designed, not generated or overproduced


## Remotion-native implementation quality ladder

For new high-quality motion, use the strongest **native Remotion** representation that fits the idea:

1. **Core timeline** — `useCurrentFrame`, `interpolate`, `spring`, `Sequence`, `Easing`.
2. **Paths** — `@remotion/paths` for line drawing, route following, growth curves and connected diagrams.
3. **Shapes** — `@remotion/shapes` for pie pieces, circles, callouts and editable vector geometry.
4. **Layout utils** — fit or measure text when labels must adapt to data.
5. **Transitions** — only between genuinely different visual states/scenes, never as filler.
6. **Effects / motion blur** — restrained use only when a fast movement or paper/vector treatment genuinely benefits.
7. **Lottie** — small support motion.
8. **Three.js** — only when the information is spatial and cannot be explained as clean 2D/2.5D.

The default is **not** plain CSS boxes if a path, shape or data-driven geometry communicates the idea more naturally.

### Preferred V2 implementation library

```text
src/finance-motion/editorial-v2.tsx
```

This library is the higher-quality reference implementation for new motion experiments. It demonstrates:

- SVG path drawing with `evolvePath()`
- markers that follow a path with `getPointAtLength()`
- native `<Pie />` and `<Circle />` shapes
- staged reveals with `Sequence` / frame windows
- `spring()` for meaningful object entrances
- `Easing` for non-linear financial curves
- fewer generic cards and more content-shaped compositions

Use V2 as the quality reference before inventing another visual system.
