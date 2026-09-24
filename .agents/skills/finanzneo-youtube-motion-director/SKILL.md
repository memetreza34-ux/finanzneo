---
name: finanzneo-youtube-motion-director
description: Directs FinanzNeo YouTube Longform with simplest-visual-first selection, simple reusable Remotion patterns, real assets where appropriate and Google Flow only when a real-world scene genuinely improves understanding.
---

# FinanzNeo YouTube Motion Director V4 Simple

## Goal

Make finance easy to understand. Do not try to make every scene visually unique. Choose the simplest visual that communicates the spoken point correctly and quickly.

> **Clarity first. Simplicity second. Novelty only when it adds explanatory value.**

Important: simple composition does **not** mean flat 2D illustration. When Google Flow is chosen, the approved premium stylized 3D FinanzNeo image world remains mandatory.

## Authority

Read in this order:

1. `CLAUDE.md`
2. `youtube/PRODUKTIONSSTANDARD.md`
3. `docs/YOUTUBE-MOTION-V4-SIMPLE.md`
4. `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`
5. `config/finanzneo-youtube-visual-system.json`
6. target `04-visuals/visual-index.json`
7. target visual plan/source files
8. official Remotion skills

Reel rules do not automatically apply to YouTube Longform.

## First question

For every spoken beat write one sentence:

> What must the viewer understand from this beat?

Then choose the visual in this order:

1. Can a simple Remotion visual explain it?
2. Is there a real website/app/document/logo/product/source that should be shown directly?
3. Only then: would a Google Flow everyday scene communicate it better?

Do not begin with an effect, 3D technique or existing component. The 3D rule applies only after Flow has already been selected as the right source.

## Default tool roles

### Remotion — default

Prefer for:

- big numbers
- percentages
- comparisons
- bar charts
- line charts
- timelines
- fees
- savings rates
- compound growth
- allocations
- money flows
- simple processes
- formulas and calculations
- short highlighted text

### Real asset — when reality matters

Prefer a real asset or screenshot for:

- websites
- apps
- official documents
- ETF factsheets
- source tables
- logos
- real products

Never generate a fake version of a real source when the real source can be shown.

### Google Flow — exception

Use only for a concrete everyday situation where an image is faster and clearer than text/data, for example:

- a grocery-shopping inflation moment
- a rent increase letter in a real housing context
- a car repair creating an unexpected cost
- a salary or workplace money decision
- an insurance or contract situation

Before Flow, apply the mandatory gate from `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

If Flow is used, the scene is rendered in the approved stylized 3D animation-film FinanzNeo world. Do not switch to flat editorial art just because the composition should be simple.

## Flow visual storytelling — mandatory

A Flow image must not merely contain the right objects. It must show a clear visual relationship between them.

Before writing any Flow prompt, determine:

1. the visible cause;
2. the visible consequence;
3. the physical or spatial storytelling device that connects them.

Good storytelling devices include, when appropriate:

- progression through depth
- one object pulling, pushing, blocking, weighing down, splitting, covering or connecting another
- growing stacks, chains or sequences
- asymmetric / diagonal composition
- meaningful overlap and scale hierarchy
- objects suspended in space when no real surface is needed
- a believable local environment when grounding improves the story
- lighting accents that support cost/risk/solution semantics

Do not turn one successful device into a new template. Floating objects are not mandatory. Tables/desks are not mandatory. Every staging decision must come from the spoken point.

Reject generic staging such as:

- object + document + object arranged neatly on a table
- centered product shot with finance props
- symmetrical catalog layout
- three unrelated objects lying side by side
- floating props with no cause/effect simply because the background is black

The still frame should feel like a paused moment from an animated finance story while remaining immediately understandable.

## Standard visual patterns

Reusable patterns are encouraged:

- `BigNumber`
- `Comparison`
- `Percentage`
- `BarChart`
- `LineChart`
- `Timeline`
- `MoneyFlow`
- `ProcessSteps`
- `SimpleDiagram`
- `HighlightText`
- `Allocation`
- `Formula`

Do not reject a pattern because it appeared earlier. If a bar chart is again the clearest explanation, use a bar chart again.

## Standard motion presets

Prefer:

- `FADE_IN`
- `SLIDE_UP`
- `SLIDE_LEFT`
- `SCALE_IN`
- `COUNT_UP`
- `BAR_GROW`
- `LINE_DRAW`
- `HIGHLIGHT`
- `SLOW_ZOOM`

Usually one main motion preset is enough.

## Motion decision

For a motion beat:

1. write `viewerChange` — what does the viewer literally see change?
2. write `reason` — why does this motion explain the spoken point?
3. choose the simplest suitable `motionPreset`;
4. build deterministic production-ready Remotion source;
5. only use advanced motion if the simple options fail to communicate the point.

## Minimal metadata

Every motion-capable visual needs:

- `viewerChange`
- `reason`
- `motionPreset`
- `animationSourceFile`
- `animationExport`

Optional:

- `advancedReason`
- `toolStack`

Do **not** invent unique mechanic IDs, technique IDs, composition-family IDs or motion signatures merely to satisfy variety. They are not V4 requirements.

## Advanced motion gate

SVG can be used freely when it is the simple way to draw paths/charts/connections.

Canvas, CSS 3D, Three.js/R3F, Motion Blur, complex masks, simulations and camera journeys are advanced. Use them only if `advancedReason` explains why the standard patterns cannot communicate the idea equally well.

Never use advanced motion because:

- the previous scene used a similar layout;
- it looks more premium;
- the dependency exists;
- variety is desired for its own sake.

## Repetition

There is no visual-novelty quota.

Consistency is positive when it helps recognition and comprehension. Reusing the same comparison, chart or number pattern is allowed without a `repeatTechniqueReason`.

Avoid only meaningless copy/paste where the visual does not match the spoken point.

## Image rules

For generated YouTube images use:

`config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt`

Important text, values, labels and captions belong in Remotion. Flow should generate the visual situation, not the explanation.

Generated images must contain:

- one clear real-world situation
- a visible cause/effect, progression, tension or relationship when the spoken point contains one
- only a few meaningful supporting objects
- premium stylized 3D animation-film rendering
- believable but clearly stylized people/objects
- semi-realistic materials with refined rounded geometry
- deep seamless black as the dominant FinanzNeo world
- small local environment context only when it improves understanding
- clean soft studio lighting and readable contact shadows
- emerald green / warm red-orange only when semantically useful

Generated images must **not** become:

- generic flat editorial illustration
- corporate vector / stock explainer art
- Canva-style illustration
- photorealistic photography
- anime
- isometric diagram art
- generic coins/vault/piggy-bank scene
- cluttered cinematic environment
- static tabletop/catalog still life with no narrative relationship
- repeated floating-object template unrelated to the spoken point

Simple means fewer elements and clearer composition — **not** boring staging and not lower-dimensional or flatter rendering.

## Hybrid

Hybrid is allowed only when the still image is genuinely useful and Remotion must add temporal information. Do not create hybrid scenes just to keep a still image moving.

## Source requirements

Every production Phase-1 `animation.tsx` must:

- use `useCurrentFrame()`
- use `interpolate()` and/or `spring()` for visible frame-driven motion
- export the component named in `visual-index.json`
- contain no TODO/placeholder content
- contain no `Math.random()`, `Date.now()`, timer, runtime fetch or remote runtime dependency
- avoid CSS animation/transition as a replacement for frame-driven Remotion motion

## Scene QA

Before accepting a visual ask:

1. Can the main idea be understood in about 1–2 seconds?
2. Is there one dominant thought?
3. Can anything be removed?
4. Is Flow actually needed?
5. If Flow is used: is the approved stylized 3D world unmistakable?
6. If the spoken point has cause/effect or progression: is that relationship visible in the staging?
7. Does this look like a paused story moment rather than a catalog/product shot?
8. Are important ambiguous physical objects labeled briefly in German when needed?
9. Are important explanatory text/numbers rendered by Remotion?
10. Does the motion explain or focus information?
11. Could a simpler visual work equally well?

If yes to question 11, simplify the composition — not the approved image style or meaningful visual storytelling.

## Phase ownership

Phase 1 owns the visual concept and production-ready motion source.

Run:

`npm run youtube:animation:validate -- youtube/<Projekt>`

then:

`npm run youtube:phase1:seal -- youtube/<Projekt>`

Phase 3 may retime the sealed source to the real voiceover and integrate captions/SFX/assets. It must not silently replace the explanatory idea with another one.
