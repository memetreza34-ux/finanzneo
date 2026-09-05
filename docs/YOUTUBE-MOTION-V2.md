# FinanzNeo YouTube Motion V2

`MOTION_STANDARD: finanzneo-youtube-motion-v2`

Dieser Standard gilt nur für eigenständige YouTube-Longform-Projekte unter `youtube/`. Bestehende Reels, Reel-Safe-Zones, Reel-Cover-Verträge und Reel-Image-World-Dateien werden dadurch nicht verändert.

## Ziel

Longform darf nicht wie ein gestrecktes Reel oder eine Folge ähnlicher Finanz-Infografiken wirken. Die visuelle Technik wird aus dem Inhalt gewählt.

## Beat-first statt feste Visualzahl

Reihenfolge:

```text
Skript
→ gesprochene Gedanken
→ sichtbare Visual Beats
→ beste Visualart je Beat
→ sinnvolle Gruppierung zu Visuals
→ produktionsreife Quellen
```

Es gibt keine feste Szenenzahl und keine feste Bild-/Animationsquote.

## Visualtypen

- `image`: statisches 16:9-Flow-Bild
- `animation`: vollständig native Remotion-Motion
- `hybrid`: 16:9-Flow-Bild + bedeutungsvolle Remotion-Komposition
- `data`: verifizierte Daten-/Chart-/Modellanimation ohne Pflicht für physische Gegenstände

## Kreative Freiheit

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
- kinetic typography
- document motion
- timelines
- data visualization
- simulations
- camera journeys
- image compositing / 2.5D

Bestehende FinanzNeo-Komponenten sind optionale Werkzeuge. `PremiumPhysicalStage` und `Physical*` sind für YouTube **nicht** verpflichtend.

## Drei IDs gegen visuelle Wiederholung

Jedes Motion-Visual trägt:

```text
mechanicId
visualTechniqueId
compositionFamilyId
```

`mechanicId` beschreibt, was inhaltlich geschieht.

`visualTechniqueId` beschreibt die konkrete visuelle Haupttechnik.

`compositionFamilyId` ordnet die Szene grob ein, z. B.:

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
- `custom`

Eine identische `visualTechniqueId` darf nur mit `repeatTechniqueReason` wiederverwendet werden. Mehr als zwei aufeinanderfolgende Motion-Visuals derselben Familie benötigen ebenfalls einen inhaltlichen Grund.

## Bildwelt bleibt geschützt

YouTube verwendet weiterhin:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
GENERATED_IMAGE_ASPECT_RATIO: 16:9
```

Zusätzlich gilt bei YouTube-Bildern der aktuelle Ansatz:

**Literal first, creative second.**

Die reale Situation und ein konkreter Finanz-/Alltagskontext kommen vor einer abstrakten Metapher. Metaphern bleiben erlaubt, wenn sie nachweislich klarer sind.

## Phase 1

Für jedes `animation`, `hybrid` oder `data` Visual müssen vor Phase 2 fertig sein:

- `remotion.md`
- produktionsreife `animation.tsx`
- `animationIntent`
- `mechanicId`
- `visualTechniqueId`
- `compositionFamilyId`
- mindestens zwei `motionChannels`
- mindestens zwei `visualBeats`
- korrekter Exportname

Dann:

```bash
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Der Seal liegt in:

```text
06-projektdateien/animation-seal.json
```

und enthält SHA-256-Hashes der kanonischen Motion-Quellen.

## Phase 2

Der Nutzer erzeugt nur die in `image` und `hybrid` benötigten 16:9-Flow-Bilder sowie das Thumbnail, anschließend genau ein finales Voiceover und echte Wort-Timings.

## Phase 3

`youtube:ready` prüft:

- YouTube-Vertrag
- Motion-V2-Source-Quality
- unveränderten Phase-1-Seal
- exakte Nutzerbilder
- echtes Voiceover
- echte Wort-Timings
- vollständiges Publishing-Paket

Phase 3 darf danach Timeline, Retiming, Captions, lokale SFX, Compositing, QA und Render übernehmen. Der versiegelte Mechanismus darf nicht kreativ durch eine einfachere Animation ersetzt werden.
