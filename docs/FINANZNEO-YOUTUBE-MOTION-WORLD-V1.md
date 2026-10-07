# FinanzNeo YouTube Motion World V1

MOTION_WORLD: finanzneo-youtube-explain-motion-v1

This is the canonical visual and motion direction for new FinanzNeo YouTube animations.

It is intentionally its own motion world. It must feel compatible with the overall FinanzNeo brand, but it does not have to imitate the static Flow image world one-to-one.

## 1. Core goal

The animation should feel like a professionally directed YouTube explainer, not like an animated dashboard, moving infographic template, slideshow with easing, generic finance preset, or a forced copy of the static image style.

Target:

clear visual storytelling + strong metaphor + purposeful motion + clean composition

## 2. Format first

All new YouTube animation concepts are designed for:

1920 × 1080
16:9
landscape

Do not design for 9:16 first and adapt later.

Use wide staging:
- left / center / right composition
- large negative-space areas
- objects may enter from screen edges
- cropped foreground objects are allowed
- depth through overlap is allowed
- avoid vertical-stack thinking

## 3. Independent motion world

The motion world may develop its own visual grammar.

It stays compatible with FinanzNeo through:
- clarity
- restrained color palette
- clean typography
- simple strong shapes
- editorial illustration
- serious but accessible tone
- no AI-slop aesthetics

Motion may be more dynamic, spatial, layered, metaphorical, cinematic, illustrative or abstract than the static Flow world.

Do not reject a strong animation merely because it does not look exactly like a static Flow image.

Judge it by:
1. does it fit the brand?
2. does it explain the idea?
3. does it feel intentional?
4. does it look good in motion?
5. does it feel native to YouTube?

## 4. Visual character

Preferred:
- modern editorial explainer
- flat 2D with selective 2.5D
- controlled depth through scale and overlap
- large simple objects
- strong silhouette
- clean geometry
- human-designed asymmetry
- moderate texture where helpful
- restrained shadows
- selective gradients only when they improve form
- soft motion blur only for genuinely fast movement
- wide compositions with clear focal hierarchy

Allowed when useful:
- dark scenes
- selective 3D
- perspective
- parallax
- camera pushes
- masks
- path-following
- morphing
- simulated physical movement
- diagrammatic motion
- abstract metaphor

Not required:
- cream background
- exact Flow palette
- identical illustration rendering
- identical object style
- static-image consistency at all costs

## 5. Strong visual idea first

Every animation starts with one strong visual idea.

Examples:
- inflation -> same money, smaller basket
- compound interest -> snowball, accelerating curve or multiplying layers
- ETF -> one investment branching into many companies
- debt -> heavy block getting chipped away payment by payment
- tax brackets -> income physically entering stacked zones
- subscriptions -> many small streams merging into one annual cost
- career growth -> staircase, path, elevator or branching opportunity
- risk -> one fragile point versus distributed support

The metaphor should explain the idea before labels do.

## 6. Scene continuity

Prefer one evolving scene over repeated resets.

Good:
START -> object appears -> relationship forms -> something changes -> consequence becomes visible -> payoff remains

Avoid unnecessary screen resets or slide-like cuts.

The viewer should feel: I am watching one idea develop.

## 7. Motion grammar

Preferred motion verbs:
- DRAW
- FOLLOW
- REVEAL
- SPLIT
- MERGE
- STACK
- SHIFT
- SWAP
- MORPH
- COUNT
- ACCELERATE
- DECELERATE
- COLLIDE
- PUSH
- PULL
- EXPAND
- CONTRACT
- CONNECT
- DISCONNECT
- EMPHASIZE
- TRANSFORM

These are building blocks, not templates.

## 8. Motion density

More motion is not automatically better, but YouTube animation should feel alive.

Preferred rule:
Every 1–2 seconds, something meaningful should happen when the spoken idea advances.

Meaningful examples:
- object enters
- path connects
- value changes
- object transforms
- relationship changes
- scale changes
- consequence appears
- composition reframes

Decorative drift does not count.

## 9. Camera

Camera motion is allowed.

Use:
- slow push-in
- lateral follow
- subtle reframe
- zoom-out to reveal consequence
- focus shift between two areas

Only when camera movement helps the explanation.

Avoid:
- constant zoom
- random parallax
- camera movement only for energy
- dramatic sweeps on simple concepts

Default can still be static.

## 10. Text

Text supports the animation.

Preferred:
- numbers
- short labels
- percentages
- one-word categories
- short contrast labels

Avoid:
- paragraphs
- subtitles baked into the animation
- explanation cards
- giant generic headlines inside the scene
- UI panels full of copy

If the scene only works because text explains it, the visual idea is too weak.

## 11. Numbers

Financial numbers may become visual objects.

They may:
- grow
- count
- slide
- split
- replace
- lock into position
- attach to objects

Numbers should feel integrated, not pasted on top.

## 12. Color

Use semantic color roles:
- green = growth / positive / progress
- orange-red = cost / risk / loss / warning
- blue = neutral financial / institution
- gold = value / money only when useful
- charcoal = structure / text
- warm neutral = common background

Additional muted colors are allowed.

Brand compatibility matters more than strict palette policing.

## 13. Depth

Depth may improve YouTube motion.

Use:
- overlap
- object scale
- foreground / midground / background
- crop
- perspective
- shadow
- 2.5D layers

3D is allowed when it clarifies physical stacking, containers, spatial flow, stage progression or scale.

Do not use 3D merely to look expensive.

## 14. Native Remotion toolkit

Prefer first:
- useCurrentFrame
- interpolate
- spring
- Easing
- Sequence
- @remotion/paths
- @remotion/shapes
- SVG
- CSS transforms
- masks / clip paths

Then when useful:
- @remotion/transitions
- @remotion/layout-utils
- @remotion/effects
- @remotion/motion-blur
- @remotion/lottie
- @remotion/three
- recharts

No additional runtime animation framework should be installed by default.

## 15. Three-concept rule

Before coding, Antigravity creates three genuinely different visual concepts.

Bad:
A: bar chart
B: bar chart with circles
C: bar chart with different colors

Good:
A: shrinking shopping basket
B: price tags pushing products out
C: the same 100 euro note moving through increasingly expensive stores

Then choose the strongest concept.

## 16. Keyframe planning

Before coding, plan:
- 10% START
- 35% MECHANISM
- 65% CONSEQUENCE
- 90% PAYOFF

The four stills should already communicate the story.

Keyframe QA asks:
- does the scene read?
- does it have a hero?
- is there visual progression?
- is the payoff strong?
- does it feel like YouTube motion?
- does it fit FinanzNeo?

It is not required to look identical to the static image world.

## 17. Composition rule

A scene usually has:
- one HERO
- only necessary SUPPORT
- enough SPACE for motion
- a clear PAYOFF ZONE

Avoid filling the entire canvas.

## 18. Quality bar

A scene should feel:
- authored
- deliberate
- smooth
- visually intelligent
- easy to follow
- satisfying at payoff
- not obviously template-based

FAIL:
- generic card UI
- generic dashboard
- animated text presentation
- plain chart with labels
- random entrance animation
- repeated fade-up everywhere
- weak payoff
- large unused empty center
- motion without meaning
- same composition reused everywhere

PASS:
- strong metaphor
- clear hierarchy
- scene evolves continuously
- movement explains mechanism
- ending feels earned
- 16:9 is used intentionally
- visually distinct when content differs

## 19. Example directions

Inflation:
100 euro enters -> basket is full -> prices rise -> products disappear -> same 100 euro remains -> basket ends half empty

ETF:
one investment block -> ETF hub -> branches into companies -> companies move independently -> hub remains stable

Subscriptions:
phone + streaming + gym + cloud -> small monthly streams -> merge -> monthly total -> x12 calendar -> annual cost lands large

Compound interest:
small amount -> first gain -> gain joins base -> next gain is larger -> rhythm accelerates -> final value lands

## 20. Final rules

Do not animate the layout. Animate the idea.

Do not force the static image world onto motion when a stronger YouTube-native animation communicates the idea better.

The animation world may have its own identity as long as it remains clearly FinanzNeo.
