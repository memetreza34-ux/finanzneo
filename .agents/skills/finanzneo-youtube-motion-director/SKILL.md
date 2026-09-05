---
name: finanzneo-youtube-motion-director
description: Directs FinanzNeo YouTube Longform motion with content-first technique selection, high visual variety, deterministic Remotion code and sealed Phase-1 animation sources.
---

# FinanzNeo YouTube Motion Director V2

## Goal

Create longform motion that explains the spoken idea with the best visual mechanism for that idea. Do not begin by choosing an existing component or primitive. Begin by deciding what the viewer should see happen.

## Core rule

**Remotion has no predefined creative ceiling.** Existing FinanzNeo components, Physical* primitives and previous animation patterns are optional tools, never mandatory templates.

Allowed when useful:

- custom React / DOM
- SVG and path animation
- CSS 3D / perspective / masks / clip-path
- Canvas
- Three.js / React Three Fiber / @remotion/three
- @remotion/shapes and @remotion/paths
- @remotion/motion-blur
- @remotion/effects
- @remotion/layout-utils
- Lottie as a support layer
- charts and data visualization
- Flow image + Remotion hybrid compositing
- kinetic typography
- document/paper animation
- timelines and temporal progression
- split-screen comparison
- simulations and spatial camera journeys

All productive motion remains deterministic from the Remotion frame timeline.

## Authority

Read in this order:

1. `CLAUDE.md`
2. `youtube/PRODUKTIONSSTANDARD.md`
3. `docs/YOUTUBE-MOTION-V2.md`
4. target `04-visuals/visual-index.json`
5. target visual `remotion.md` / `bildprompt.txt` / `data-notes.md`
6. target `animation.tsx`
7. official Remotion skills

Reel-specific safe zones and PhysicalObject requirements do not automatically apply to YouTube Longform.

## Technique selection

For each spoken beat, first write one sentence answering:

> What should the viewer literally see change, reveal, compare or travel through?

Then choose the best family. Useful families include:

- `spatial-3d` — genuine depth/object/camera interaction
- `vector-motion` — SVG/path/morph construction
- `css-3d` — perspective, cards/paper/object layers
- `kinetic-type` — a number/phrase itself is the visual event
- `data-viz` — verified values, charts, tables, model outputs
- `timeline` — time progression is the explanation
- `document-motion` — contracts, invoices, statements, papers
- `image-composite` — Flow image + masks/parallax/overlays
- `simulation` — a process or system evolves visibly
- `comparison` — two states/paths progress side by side
- `camera-journey` — spatial movement itself reveals the relationship
- `custom` — a better technique does not fit another family

Do not overuse a family because its implementation is convenient.

## Required metadata

Every motion-capable visual defines:

- `mechanicId`
- `visualTechniqueId`
- `compositionFamilyId`
- `animationIntent`
- at least two meaningful `motionChannels`
- at least two visible `visualBeats`
- `animationSourceFile`
- `animationExport`

`visualTechniqueId` should be materially different across different mechanisms. Reuse needs an explicit `repeatTechniqueReason`.

## Narrative

A YouTube motion visual is not required to imitate a physical machine. It must, however, visibly progress.

Valid structures include:

- START → TRANSFORMATION → RESULT
- QUESTION → REVEAL → CONSEQUENCE
- BEFORE → MECHANISM → AFTER
- DATA INPUT → CHANGE → COMPARISON
- CAMERA ENTRY → DISCOVERY → PAYOFF
- IMAGE ESTABLISH → MASK/DEPTH REVEAL → EXPLANATION

Camera drift alone is not a new beat. Background motion alone is not a new beat.

## Longform rhythm

Do not cut on a fixed timer. Voiceover thought, visual information and chapter logic decide timing.

A longer visual may remain on screen if it keeps producing new visible information. Example:

0–2 s establish
2–4 s trigger
4–6 s first consequence
6–8 s second consequence
8–10 s comparison
10–12 s payoff

A static state must not sit under several new spoken thoughts without a visual reason.

## Hybrid visuals

Use `hybrid` when a strong Flow image provides the detailed world and Remotion can add meaningful temporal information:

- controlled 2.5D parallax
- masks/focus reveals
- value changes
- selective object highlights
- document annotations
- before/after transitions
- chart overlays
- depth/compositing

Do not add movement merely to avoid a static image.

## Data visuals

Verified data may use charts, counters, tables, axes or model simulations when those are the clearest explanation. Data visuals are exempt from the rule that every scene must contain physical real-world objects.

Never fabricate values for visual drama.

## Variety rule

Variation is semantic, not cosmetic.

Bad variation:

- same cards with different labels
- same coin stack with different numbers
- same progress bar with different colors
- same slide-in blocks under different `MECHANIC_ID`s

Good variation:

- document comparison → SVG name/IBAN match
- time progression → calendar/timeline depth
- compound growth → spatial stack/simulation
- historical development → camera journey
- key number → restrained kinetic typography
- real-life situation → Flow image hybrid

## Source requirements

Every Phase-1 `animation.tsx` must:

- use `useCurrentFrame()`
- use `interpolate()` and/or `spring()` for frame-driven motion
- export `MECHANIC_ID`, `VISUAL_TECHNIQUE_ID`, `COMPOSITION_FAMILY_ID`
- export `ANIMATION_NARRATIVE` containing at least START and RESULT
- export the component named in `visual-index.json`
- contain no placeholder/TODO content
- contain no CSS animation/transition, timer, Math.random, runtime fetch or remote runtime dependency

There is deliberately no requirement for `PremiumPhysicalStage`, `PhysicalObject` or any fixed primitive count.

## Phase ownership

Phase 1 owns creative motion design and production-ready source code.

After:

`npm run youtube:animation:validate -- youtube/<Projekt>`

run:

`npm run youtube:phase1:seal -- youtube/<Projekt>`

Phase 3 may retime/integrate the sealed source, captions, local SFX and final assets. It may not replace the sealed mechanism with an easier animation.
