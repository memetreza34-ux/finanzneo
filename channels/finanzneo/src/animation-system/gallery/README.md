# Finanzanimationen – visuelle QA

Die Galerie ist vollständig vom produktiven FinanzNeo-Root getrennt und enthält drei unterschiedliche Prüfansichten.

## 1. Sequenzielle Galerie

Composition:

```text
FinanceAnimationGallery
```

Jedes der zwölf Templates wird nacheinander im originalen 9:16-Format gezeigt.

```bash
npm run finance:animation-gallery:sequence-still
```

Ausgabe:

```text
/tmp/finance-animation-gallery-sequence.png
```

## 2. Kontaktbogen

Composition:

```text
FinanceAnimationGalleryOverview
```

Alle zwölf Templates werden bei einem gemeinsamen mittleren Animationsframe dargestellt.

Jede Vorschau läuft in einer eigenen Sequence mit:

- 180 Frames
- 1080 × 1920 Pixel
- unverändertem zentralen Renderer

Dadurch erhalten Templates trotz der großen Kontaktbogen-Composition ihre ursprüngliche lokale `useVideoConfig()`.

```bash
npm run finance:animation-gallery:still
```

Ausgabe:

```text
/tmp/finance-animation-gallery.png
```

## 3. Start-/Mittel-/Endframe-Matrix

Composition:

```text
FinanceAnimationFrameMatrix
```

Für jedes Template werden drei feste Zustände über eine lokale 180-Frame-Sequence mit `freeze` gerendert:

- Start: Frame 0
- Mitte: Frame 90
- Ende: Frame 179

Die Sequence überschreibt für ihre Kinder außerdem Breite und Höhe mit 1080 × 1920 Pixel. Damit sehen die Templates dieselbe Szenendauer und VideoConfig wie in einer echten Einzel-Szene, obwohl die äußere Matrix-Composition nur einen Frame lang und 2160 × 3840 Pixel groß ist.

Zwölf Templates mal drei Prüfpunkte ergeben 36 reproduzierbare Zellen. Die Matrix eignet sich insbesondere zur Prüfung von:

- abgeschnittenen Texten
- überlappenden Labels
- künstlichen Mindestbalken im Startframe
- falschen Zwischenwerten
- nicht erreichten oder abweichenden Endwerten
- uneinheitlichen Farben und Zuständen

```bash
npm run finance:animation-gallery:matrix-still
```

Ausgabe:

```text
/tmp/finance-animation-frame-matrix.png
```

## Visueller Freigabebericht

Nach einem erfolgreichen Render wird die Prüfung in folgendem Dokument festgehalten:

```text
VISUAL_QA_REPORT.md
```

Der Bericht enthält:

- Render-Commit und Artefakt
- Status für alle 36 Frame-Zustände
- templateübergreifende Prüfkriterien
- drei Fallback-Prüfungen
- Fehlerliste mit Priorität und Status
- abschließende visuelle Freigabe

## Strukturprüfung

`npm run finance:animation-structure` führt zusätzlich den dependency-freien Matrixcheck aus. Dieser prüft:

- drei feste Review-Checkpoints
- Ableitung aus allen Galerie-Templates
- lokale 180-Frame-Sequences
- originale 1080 × 1920 VideoConfig
- `freeze` pro Matrixzelle
- eigene Composition-ID
- npm-Renderbefehl
- Workflow-Schritt
- Artefaktpfad

## Sicherheitsstatus

Keine dieser Compositions ist im produktiven `FinanzNeoRoot` registriert. Sie aktivieren weder Hybrid- noch Vollanimationsmodus und verändern den bestehenden `image-first-lite`-Workflow nicht.
