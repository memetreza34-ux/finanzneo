# FinanzNeo — YouTube Motion Quality V1

`YOUTUBE_MOTION_QUALITY_STANDARD: finanzneo-youtube-motion-quality-v1`

## Ziel

YouTube-Finanzanimationen sollen nicht wie animierte Präsentationen wirken. Motion wird nur eingesetzt, wenn Bewegung eine Aussage klarer macht als ein starkes Standbild, Diagramm oder Beispiel.

## Qualitätsreihenfolge

```text
Kernaussage
→ stärkste statische Lösung prüfen
→ konkrete sichtbare Mechanik definieren
→ vorhandenen FinanzNeo-Baustein / Remotion-Werkzeug routen
→ START / Veränderung / RESULT planen
→ implementieren
→ Representative-Frame-QA
```

Wenn eine statische Lösung gleich klar oder besser ist, wird nicht animiert.

## Pflicht für echte Animationsszenen

```text
START
→ TRIGGER
→ ACTION
→ REACTION / CHANGE
→ RESULT
→ SHORT RESULT HOLD
```

Nicht jeder Beat braucht alle sechs Phasen, aber `START`, eine sichtbare Veränderung und ein klarer `RESULT` müssen unterscheidbar sein.

## Zentraler YouTube-Finance-Motion-Baukasten

Neue Animationen sollen nicht jedes Mal bei null anfangen. Der erste Routing-Punkt ist `src/design-system/YouTubeMotionExplainers.tsx`.

### Basis

- `MotionNumber` — Betrag / Prozent / Kennzahl
- `MotionComparisonBars` — zwei Werte auf gemeinsamer Skala
- `MotionLineChart` — einfache Entwicklung
- `MotionBeforeAfter` — klarer Zustand A → Zustand B

### Bewegung mit echter Mechanik

- `MotionPathFlow` / `MotionMoneyFlow` — Geld bewegt sich entlang eines echten SVG-Pfads
- `MotionTimeline` — zeitliche Abfolge / Meilensteine
- `MotionBudgetAllocation` — Budget wird sichtbar auf Bereiche verteilt

### Finanzspezifisch mit zentralen Berechnungen

- `MotionCompoundGrowth` — Sparplan / Zinseszins mit `calculateSavingsPlanSeries()`
- `MotionLoanPaydown` — Kredit / Restschuld mit `calculateLoanSchedule()` und `calculateLoanSummary()`
- `MotionPurchasingPower` — Inflation / Kaufkraft mit den zentralen Inflationsfunktionen

Diese Komponenten erfinden keine Finanzwerte im JSX. Abgeleitete Werte kommen aus `src/finance/`.

## Tool-Routing

Bevorzugte Reihenfolge:

1. passender Baustein aus `YouTubeMotionExplainers.tsx`
2. zentrale Finanzberechnungen aus `src/finance/`
3. vorhandene PremiumCharts / FinanceBlocks / DiagramBlocks
4. native Remotion-Komposition mit `useCurrentFrame()`, `interpolate()`, `spring()`
5. `@remotion/paths` / `@remotion/shapes`, wenn Pfad oder Geometrie die Erklärung trägt
6. Recharts / PremiumCharts bei echten Datenreihen
7. Three.js / React Three Fiber nur bei echtem räumlichem Erklärwert
8. Lottie nur als unterstützende Mikroanimation
9. Motion Blur / Effects / Transitions erst als zurückhaltender Polish

Die Verfügbarkeit eines Tools ist kein Grund, es einzusetzen.

## Paths + Shapes

Der zentrale Baukasten nutzt `@remotion/paths` und `@remotion/shapes` produktiv:

- `evolvePath()` für gezeichnete Kurven und Flüsse
- `getLength()` / `getPointAtLength()` für Objekte entlang eines Pfads
- `Rect` für deterministische geometrische Budgetsegmente

Keine dekorativen Pfade ohne Informationswert.

## Bewegungsphysik

`YOUTUBE_MOTION_PHYSICS` stellt unterschiedliche physische Presets bereit:

- `chart` — sauber, kontrolliert
- `money` — schneller, kurzer kontrollierter Spring
- `paper` — leichteres Slide/Settle
- `heavy` — träger, wenig Overshoot
- `confirm` — schneller klarer Abschluss

Nicht alle Objekte dürfen dieselbe Bewegung erhalten.

## Finanzspezifisches Routing

### Zahl / Prozent / Betrag

`MotionNumber` oder statische Zahl. Count-up nur, wenn der Aufbau selbst etwas erklärt.

### Zwei Werte

`MotionComparisonBars` oder `MotionBeforeAfter`.

### Entwicklung über Zeit

`MotionLineChart`, `MotionTimeline`, PremiumCharts oder Recharts.

### Geldfluss

`MotionMoneyFlow` / `MotionPathFlow`. Der Pfad muss semantisch sinnvoll sein.

### Budget

`MotionBudgetAllocation`. Bei statischer Aussage darf ein statisches Diagramm besser sein.

### Inflation / Kaufkraft

`MotionPurchasingPower` oder konkretes Vorher/Nachher-Bild. Animation nur bei sichtbarer Veränderung.

### Sparplan / Zinseszins

`MotionCompoundGrowth` oder PremiumChart. Werte aus zentraler Finanzberechnung.

### Kredit / Raten

`MotionLoanPaydown`, Tilgungs-/Kostenvergleich oder Timeline.

## Ablehnungsgründe

Animation neu planen oder durch statische Lösung ersetzen, wenn:

- nur Textzeilen nacheinander einblenden;
- nur drei Karten erscheinen;
- ein Progress-Bar die ganze Aussage trägt;
- START und RESULT fast gleich aussehen;
- Bewegung nur Dekoration ist;
- dieselbe Balken-/Kartenlogik mehrfach hintereinander wiederholt wird;
- die Animation schwächer aussieht als ein gutes Standbild;
- Bild und Remotion dieselbe Aussage doppelt erklären;
- wichtige Objekte klein in viel leerer Fläche stehen;
- die Szene wie Dashboard, PowerPoint oder App-UI wirkt.

## Representative-Frame-QA

Für Quality-V1-Hybridprojekte nach finaler Timeline:

```bash
npm run youtube:motion:qa -- youtube/<Projekt>
```

Das rendert pro animiertem Visual:

- START
- 25 %
- 50 %
- 75 %
- RESULT HOLD

Ergebnisse landen in `06-projektdateien/motion-qa-frames/`.

Danach `06-projektdateien/motion-qa-review.json` prüfen und nur bei bestandener Sichtprüfung auf `PASS` setzen. Anschließend:

```bash
npm run youtube:motion:qa:validate -- youtube/<Projekt>
```

`youtube:ready` führt diese Validierung bei Quality-V1-Projekten ebenfalls aus. Ein `--draft`-Render ist nur für frühe Vorschau und zählt nicht als finale QA.

## Interner Motion-Lab

Die Showcase-Composition `YouTubeFinanceMotionLab` zeigt die zentralen Finanzmechaniken in 1920×1080 und ist ausdrücklich keine Produktionscomposition. Sie dient zum visuellen Vergleich und zur Weiterentwicklung des Baukastens.

## Kurzregel

> Erst starke statische Idee. Motion muss zusätzlichen Informationswert liefern. Vorhandenen FinanzNeo-Stack nutzen. START und RESULT müssen verschieden sein. Finanzwerte zentral berechnen. Fünf Representative Frames prüfen. Schwache Animation ersetzen statt aufpolieren.
