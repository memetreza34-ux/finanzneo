---
name: finanzneo-youtube-motion-director
description: Directs FinanzNeo YouTube Longform motion with viewer-change-first technique selection, open-ended visual methods, semantic variety, deterministic Remotion code and sealed Phase-1 animation sources.
---

# FinanzNeo YouTube Motion Director V3

## Goal

Create longform motion that explains each spoken idea with the best visible mechanism for that exact idea. Do not begin by choosing an existing component, family or animation pattern. Begin by deciding what the viewer should literally see happen.

## Core rule

**One FinanzNeo world, no fixed animation type.**

Remotion has no predefined creative ceiling. Existing FinanzNeo components, Physical* primitives, previous animation patterns and named composition families are optional tools or descriptions, never mandatory templates.

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
- material/object transformations
- map/network/process motion
- new custom combinations when they explain the beat better

All productive motion remains deterministic from the Remotion frame timeline.

## Authority

Read in this order:

1. `CLAUDE.md`
2. `youtube/PRODUKTIONSSTANDARD.md`
3. `docs/YOUTUBE-MOTION-V3.md`
4. target `04-visuals/visual-index.json`
5. target visual `remotion.md` / `bildprompt.txt` / `data-notes.md`
6. target `animation.tsx`
7. official Remotion skills

Reel-specific safe zones and PhysicalObject requirements do not automatically apply to YouTube Longform.

## Viewer-change-first technique selection

For each spoken beat, first write `viewerChange` as one clear sentence answering:

> What should the viewer literally see change, reveal, compare, build, break apart or travel through?

Do this **without naming a tool, library, existing component or composition family**.

Then:

1. decide the explanatory mechanism,
2. review the previous four motion visuals,
3. choose or invent the clearest technique,
4. record the actual tools and motion signature,
5. build production-ready source code.

Do not choose a technique because it is convenient to implement.

## Composition families are open

Useful examples include:

- `spatial-3d`
- `vector-motion`
- `css-3d`
- `kinetic-type`
- `data-viz`
- `timeline`
- `document-motion`
- `image-composite`
- `simulation`
- `comparison`
- `camera-journey`
- `physical-process`
- `material-transformation`
- `map-journey`
- `macro-to-micro`
- `network-simulation`
- `custom`

These are examples only. `compositionFamilyId` is free-form in V3. Create a better family name when the actual scene needs one.

## Required metadata

Every motion-capable visual defines:

- `viewerChange`
- `animationIntent`
- `mechanicId`
- `visualTechniqueId`
- `techniqueDescription`
- `compositionFamilyId`
- `toolStack`
- `motionSignature.camera`
- `motionSignature.layout`
- `motionSignature.transformation`
- at least two meaningful `motionChannels`
- at least two visible `visualBeats`
- `animationSourceFile`
- `animationExport`

`viewerChange` is the creative starting point. `visualTechniqueId` is the implementation concept. `techniqueDescription` describes how the scene actually works. `motionSignature` describes the dominant camera, layout and visible transformation so fake variety cannot be hidden behind renamed IDs.

## Variety rule

Variation is semantic, not cosmetic.

Bad variation:

- same cards with different labels
- same coin stack with different numbers
- same camera push with a new technique name
- same three-column layout with different colors
- same slide-in blocks under different `MECHANIC_ID`s

Good variation:

- document comparison → SVG name/IBAN match
- time progression → timeline or camera movement through dated layers
- compound growth → simulation / spatial buildup
- historical development → camera journey or map/time transformation
- key number → restrained kinetic typography
- real-life situation → Flow image hybrid with meaningful reveal
- process → custom spatial or network simulation

The validator checks repeated technique, mechanism, technique description and identical camera+layout+transformation signatures. It also flags more than two consecutive visuals from the same family.

## Repetition remains valid when it is best

Do not force novelty for novelty's sake. If the same technique is genuinely the clearest explanation, reuse it with a concrete `repeatTechniqueReason`.

The reason must explain why consistency improves understanding, comparison or continuity. “Looks good” or “same style” is not enough.

## Narrative

A YouTube motion visual must visibly progress.

Valid structures include:

- START → TRANSFORMATION → RESULT
- QUESTION → REVEAL → CONSEQUENCE
- BEFORE → MECHANISM → AFTER
- DATA INPUT → CHANGE → COMPARISON
- CAMERA ENTRY → DISCOVERY → PAYOFF
- IMAGE ESTABLISH → MASK/DEPTH REVEAL → EXPLANATION
- OBJECT ASSEMBLY → SYSTEM BEHAVIOR → OUTCOME
- DOCUMENT STATE → MARK/COMPARE → DECISION

Camera drift alone is not a new beat. Background motion alone is not a new beat.

## Longform rhythm

Do not cut on a fixed timer. Voiceover thought, visual information and chapter logic decide timing.

A longer visual may remain on screen if it keeps producing new visible information. A static state must not sit under several new spoken thoughts without a visual reason.

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

The V3 seal protects both source hash and the creative motion contract. Phase 3 may retime/integrate the sealed source, captions, local SFX and final assets. It may not replace the sealed mechanism with an easier animation.
