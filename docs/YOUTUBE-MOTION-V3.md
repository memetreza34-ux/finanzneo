# FinanzNeo YouTube Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

Dieser Standard gilt nur für eigenständige YouTube-Longform-Projekte unter `youtube/`. Bestehende Reels, Reel-Safe-Zones, Reel-Cover-Verträge und Reel-Image-World-Dateien werden dadurch nicht verändert.

## Ziel

Longform darf nicht wie ein gestrecktes Reel oder eine Folge derselben Animation mit anderen Zahlen wirken.

**Eine visuelle Welt, aber keine feste Animationsart.**

Für jeden gesprochenen Gedanken wird zuerst entschieden, was der Zuschauer sichtbar erleben soll. Erst danach wird die konkrete Technik gewählt.

## Viewer-change-first

Reihenfolge:

```text
Skript
→ gesprochene Gedanken
→ sichtbare Visual Beats
→ viewerChange
→ beste Visualart
→ beste Technik
→ produktionsreife Quelle
```

`viewerChange` beantwortet in einem klaren Satz:

> Was soll der Zuschauer tatsächlich sehen, das sich verändert, enthüllt, vergleicht, aufbaut, zerlegt oder räumlich erschließt?

Beispiel:

```text
Kleine monatliche Einzahlungen kommen regelmäßig hinzu,
während der durch Rendite entstandene Anteil zunehmend schneller wächst
und am Ende einen großen Teil des Gesamtwerts ausmacht.
```

Erst danach darf eine Technik gewählt werden.

## Visualtypen

- `image`: statisches 16:9-Flow-Bild
- `animation`: vollständig native Remotion-Motion
- `hybrid`: 16:9-Flow-Bild + bedeutungsvolle Remotion-Komposition
- `data`: verifizierte Daten-/Chart-/Modellanimation

Es gibt keine feste Szenenzahl und keine feste Bild-/Animationsquote.

## Visual Selection V1

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

Kanonische Regel:

```text
docs/FINANZNEO-VISUAL-SELECTION-RULE.md
```

Vor der Technik wird die Visualart gewählt:

- einfache, zahlen-/datengetriebene Erklärung → **pure Remotion**
- komplexe, reale oder räumliche Erklärung → **Flow image + Remotion hybrid**
- SVG → präzise Vektor-/Pfad-/Chartmechanik
- Icons → semantischer Support
- Lottie → kleine Support-Bewegung

Die technische Umsetzung darf komplex sein. Die Erklärung für den Zuschauer soll dadurch **einfacher**, nicht komplizierter werden.

Ein vorhandenes Lottie, Icon, Component oder 3D-Tool ist niemals allein ein Grund für die Visualwahl.

## Offene Technik

Remotion und Web-Technologien sind Werkzeuge, keine Animationsbibliothek mit fester Endmenge.

Erlaubt sind unter anderem:

- Custom React / DOM
- SVG / Paths / Shapes
- CSS 3D / perspective
- masks / clip-path
- Canvas
- Three.js / React Three Fiber / `@remotion/three`
- Motion Blur
- Remotion Effects
- Layout Utils
- Lottie als Support
- konsistente SVG-Icons als Support
- kinetic typography
- document motion
- timelines
- data visualization
- simulations
- camera journeys
- image compositing / 2.5D
- spatial object animation
- material transformation
- network/process visualization
- map or geographic motion
- combinations of several techniques
- a new custom technique when it explains the content better

Bestehende FinanzNeo-Komponenten sind optionale Werkzeuge. `PremiumPhysicalStage` und `Physical*` are not mandatory for YouTube.

## Composition Families are descriptions, not a whitelist

Useful example family names:

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

These names are examples only. A scene may use a new `compositionFamilyId` without changing the repository contract first.

## Required Motion V3 metadata

Every `animation`, `hybrid` or `data` visual defines:

```text
viewerChange
animationIntent
mechanicId
visualTechniqueId
techniqueDescription
compositionFamilyId
toolStack[]
motionSignature.camera
motionSignature.layout
motionSignature.transformation
motionChannels[]
visualBeats[]
animationSourceFile
animationExport
```

Meaning:

- `viewerChange`: what the viewer literally sees change
- `animationIntent`: why that visible change explains the spoken idea
- `mechanicId`: semantic mechanism of the scene
- `visualTechniqueId`: specific implementation concept
- `techniqueDescription`: short concrete description of how the visual works
- `compositionFamilyId`: free descriptive category; not restricted to a predefined list
- `toolStack`: actual implementation tools / methods
- `motionSignature.camera`: dominant camera behavior
- `motionSignature.layout`: dominant spatial/compositional arrangement
- `motionSignature.transformation`: dominant visible transformation
- `motionChannels`: at least two meaningful simultaneous/sequential motion channels
- `visualBeats`: at least two visibly different information states

## Anti-fake-variation

Changing only a name, color or label is not a new animation.

The validator blocks unreasoned repetition of:

- identical `visualTechniqueId`
- identical `mechanicId`
- identical `techniqueDescription`
- more than two consecutive motion visuals from the same family
- the same full `motionSignature` (`camera + layout + transformation`) within the previous four motion visuals

This catches patterns such as:

- the same cards sliding in with different labels
- the same coin stack with new numbers
- the same camera push with a renamed technique ID
- the same three-column layout with different colors

## Repetition is still allowed

Variety is not an end in itself.

If the same technique is genuinely the clearest way to explain a later beat, it may be reused with a concrete `repeatTechniqueReason`.

Bad reason:

```text
Looks good.
```

Good reason:

```text
This is the second half of the same before/after comparison;
using the identical camera and layout is necessary so the viewer can compare the two states directly.
```

## Technique selection rule

For every motion beat:

1. Write `viewerChange` without naming a tool or existing component.
2. Decide the explanatory mechanism.
3. Classify the beat as simple/data-driven vs. complex/real-world/spatial.
4. Select `animation`, `hybrid`, `data` or `image` using Visual Selection V1.
5. Review the previous four motion visuals.
6. Choose or invent the clearest technique.
7. Record technique, tools and motion signature.
8. Build production-ready `animation.tsx`.
9. Validate actual diversity and source quality.

Do not choose a technique because it is easy to code or because a component already exists.

## Narrative progression

A YouTube motion visual must visibly progress. Valid structures include:

- START → TRANSFORMATION → RESULT
- QUESTION → REVEAL → CONSEQUENCE
- BEFORE → MECHANISM → AFTER
- DATA INPUT → CHANGE → COMPARISON
- CAMERA ENTRY → DISCOVERY → PAYOFF
- IMAGE ESTABLISH → MASK/DEPTH REVEAL → EXPLANATION
- OBJECT ASSEMBLY → SYSTEM BEHAVIOR → OUTCOME
- DOCUMENT STATE → MARK/COMPARE → DECISION

Camera drift or background motion alone is not a meaningful new beat.

## Longform rhythm

Do not cut on a fixed timer. Voiceover thought, visual information and chapter logic decide timing.

A long visual is allowed when it continues to reveal meaningful information. A static state must not remain while several new spoken thoughts arrive without a visual reason.

## Hybrid visuals

Use `hybrid` when a strong Flow image provides the detailed FinanzNeo world and Remotion adds meaningful temporal information, for example:

- controlled 2.5D parallax
- masks / focus reveals
- value changes
- selective object highlights
- document annotations
- before/after transitions
- chart overlays
- depth compositing

Do not add motion only to avoid a static image.

## Support layers: SVG, Icons, Lottie

- SVG may be a main explanatory mechanism when precise vector logic is clearest.
- Icons are semantic shorthand and support, not a substitute for a complex scene.
- Lottie is support for small self-contained cues such as warning, check, search, document or status actions.
- Several tools may be combined only when every added layer contributes information.

## Data visuals

Verified data may use charts, counters, tables, axes or model simulations when they are the clearest explanation. They do not need physical real-world objects.

Never fabricate values for visual drama.

## Source requirements

Every Phase-1 `animation.tsx` must:

- use `useCurrentFrame()`
- use `interpolate()` and/or `spring()` for frame-driven motion
- export `MECHANIC_ID`, `VISUAL_TECHNIQUE_ID`, `COMPOSITION_FAMILY_ID`
- export `ANIMATION_NARRATIVE` containing at least START and RESULT
- export the component named in `visual-index.json`
- contain no placeholder/TODO content
- contain no CSS animation/transition, timer, `Math.random`, runtime fetch or remote runtime dependency

All productive motion remains deterministic from the Remotion frame timeline.

## Phase-1 seal

Before Phase 2:

```bash
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Motion V3 seals both:

- the source-code hash
- the creative contract: viewer change, intent, mechanism, technique description, tool stack, motion signature, channels and beats

Phase 3 may retime/integrate the sealed source, captions, local SFX and final assets. It may not replace the sealed mechanism with an easier animation.

## Quality target

The video should feel visually varied because **the ideas are explained in different ways**, not because random effects were added.

The final question for every motion scene is:

> If I removed the voiceover, can I still see the important change this sentence is talking about?