# FinanzNeo YouTube Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

`MOTION_WORLD: finanzneo-youtube-explain-motion-v1`

Dieser Standard gilt nur für YouTube-Longform-Motion. Bildwelt, Header, Untertitel und Publishing werden hier nicht gestaltet.

## Ziel

YouTube-Animationen bekommen eine **eigene Motion-Welt für 16:9**. Sie muss zur FinanzNeo-Marke passen, darf aber deutlich dynamischer und eigenständiger sein als die statische Flow-Bildwelt.

Die Motion-Welt priorisiert:
- direkte 1920 × 1080 / 16:9-Komposition
- starke visuelle Metaphern
- breite räumliche Inszenierung
- fortlaufende Szenenentwicklung
- 2D / 2.5D als Basis
- selektives 3D, Perspektive und Parallax wenn sinnvoll
- Kamera-Bewegung, wenn sie Information enthüllt
- große Objekte statt Karten-UI
- integrierte Zahlen statt aufgesetzte Labels
- klare Payoffs

## Core rule

```text
SCRIPT BEAT
→ VIEWER CHANGE
→ SIMPLEST CLEAR MOTION
→ RESULT
```

Die Motion-Komplexität richtet sich nach dem Inhalt, nicht nach dem Wunsch nach mehr Effekten.

Eine einzige starke sichtbare Veränderung kann vollständig reichen.

## Viewer-change-first

`viewerChange` beantwortet:

> Was soll der Zuschauer tatsächlich sehen, das sich verändert, enthüllt, vergleicht, aufbaut, zerlegt oder bewegt?

Erst danach wird die Technik gewählt.

## Visualtypen

- `image`: statisches 16:9-Flow-Bild
- `animation`: native Remotion-Motion
- `hybrid`: Flow-Bild + bedeutungsvolle Remotion-Veränderung
- `data`: verifizierte Daten-/Chart-/Modellanimation

Es gibt keine feste Bild-/Animationsquote.

## Editorial Motion style

Default:
- 16:9 wide staging
- one strong hero idea
- evolving scene instead of repeated screen resets
- 2D / 2.5D first
- depth, crop and overlap allowed
- camera may move when it supports the story
- meaningful visual progression every 1–2 seconds when the spoken idea advances
- text remains secondary

Nicht als Standard verwenden:

- `PremiumPhysicalStage`
- `Physical*`-Primitives
- schwarze Glossy-3D-Welt
- Goldmünzen/Podeste als generische Finanzsprache
- Neon / Glow / Hologramm
- futuristische Dashboards
- Partikel-/Aurora-/Grid-Hintergründe
- permanente Kamerafahrten
- dekorative Bounce-/Spin-Bewegung

## Offene Technik

Erlaubt, wenn sinnvoll:

- Custom React / DOM
- SVG / Paths / Shapes
- masks / clip-path
- Canvas
- data visualization
- document motion
- timelines
- comparisons
- simple simulations
- image compositing / 2.5D
- Lottie als Support
- Three.js / R3F nur bei echtem räumlichem Nutzen
- neue Kombinationen, wenn sie den Beat besser erklären

Werkzeuge folgen dem Inhalt.

## Motion channels

Es gibt **keine Pflicht für mehrere Motion-Channels**.

Mindestens eine sichtbare erklärende Veränderung ist nötig.

Beispiele:

- ein Balken wächst
- eine Linie wird sichtbar
- eine Zahl verändert sich
- ein Dokument erhält eine neue Kostenzeile
- ein Vergleich wechselt Zustand
- eine Timeline verlängert sich
- ein Portfolio verschiebt Gewichte

Mehrere Motion-Channels sind erlaubt, wenn jeder davon zusätzliche Information trägt.

## Visual beats

Mindestens:

```text
START
→ RESULT
```

Bei komplexeren Szenen:

```text
START
→ MECHANISM
→ RESULT
```

Camera drift oder Background motion zählt nicht als neuer Beat.

## Kamera

Default:

```text
motionSignature.camera = still | push | follow | reframe | zoom-out
```

Push, follow oder reframe nur wenn es die Erklärung verbessert.

## Composition families

`compositionFamilyId` bleibt frei beschreibbar.

Beispiele:

- `vector-motion`
- `data-viz`
- `timeline`
- `document-motion`
- `comparison`
- `image-composite`
- `simple-simulation`
- `map-journey`
- `selective-2.5d`
- `custom`

3D-Familien sind erlaubt, aber nicht Default.

## Required metadata

Jedes Motion-Visual definiert:

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

`motionChannels` braucht mindestens **eine** sinnvolle erklärende Bewegung.

`visualBeats` braucht mindestens zwei Zustände.

## Variety

Variation ist semantisch, nicht kosmetisch.

Nicht künstlich neue Animationen erfinden, wenn dieselbe Mechanik für einen direkten Vergleich absichtlich gleich bleiben sollte.

Wiederholung ist erlaubt, wenn `repeatTechniqueReason` erklärt, warum die Konsistenz dem Verständnis dient.

## Hybrid visuals

`hybrid` nur wenn ein Flow-Bild eine starke statische Basis liefert und Remotion echte Information ergänzt.

Gut:

- Wert ändert sich
- Objekt wird gezielt markiert
- Dokument wird annotiert
- Vorher/Nachher wird sichtbar
- einfache Maske enthüllt relevanten Bereich

Nicht:

- Parallax nur damit sich etwas bewegt
- Glow/Zoom als künstliche Dynamik

## Data visuals

Charts, Achsen, Tabellen, Counter und Modellvisualisierungen dürfen flach und editorial sein.

Keine erfundenen Werte für visuelle Dramatik.

## Source requirements

Jede Phase-1-`animation.tsx` muss:

- `useCurrentFrame()` verwenden
- `interpolate()` und/oder `spring()` verwenden
- `MECHANIC_ID`, `VISUAL_TECHNIQUE_ID`, `COMPOSITION_FAMILY_ID` exportieren
- `ANIMATION_NARRATIVE` mit START und RESULT enthalten
- deterministisch sein
- keine Platzhalter/TODOs enthalten
- keine Runtime-Fetches, Timer, CSS animation/transition oder `Math.random` enthalten
- keine alten `PremiumPhysicalStage`-/`Physical*`-Primitives für neue Editorial Motion verwenden

## Phase-1 seal

Vor Phase 2:

```bash
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Phase 3 darf die versiegelte Mechanik nicht kreativ ersetzen.

## Quality target

Die letzte Frage für jede Szene:

> Ist diese Bewegung die einfachste gute Möglichkeit, genau diesen Satz sichtbar zu machen?

Wenn weniger Motion genauso verständlich wäre, wird reduziert.


## Canonical motion world

```text
docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md
```

This document is the authority for the visual identity of new YouTube motion scenes.

The static Editorial Finance image world is no longer a visual cage for motion. It remains a brand reference only.
