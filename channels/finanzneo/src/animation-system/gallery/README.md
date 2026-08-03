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

Für jedes Template werden drei feste Zustände mit `Freeze` gerendert:

- Start: Frame 0
- Mitte: Frame 90
- Ende: Frame 179

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

## Strukturprüfung

`npm run finance:animation-structure` führt zusätzlich den dependency-freien Matrixcheck aus. Dieser prüft:

- drei feste Review-Checkpoints
- Ableitung aus allen Galerie-Templates
- `Freeze` pro Zelle
- eigene Composition-ID
- npm-Renderbefehl
- Workflow-Schritt
- Artefaktpfad

## Sicherheitsstatus

Keine dieser Compositions ist im produktiven `FinanzNeoRoot` registriert. Sie aktivieren weder Hybrid- noch Vollanimationsmodus und verändern den bestehenden `image-first-lite`-Workflow nicht.
