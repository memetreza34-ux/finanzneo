# FinanzNeo — YouTube 16:9 Visual QA V1

`YOUTUBE_VISUAL_QA_STANDARD: finanzneo-youtube-visual-qa-16x9-v1`

## Scope

Gilt nur für YouTube Longform unter `youtube/`.

Reel-Pixelzonen wie `Y320–1400` oder `bottom 340` werden hier nicht übernommen. YouTube nutzt 1920×1080 mit eigener Motion-Safe-Area.

## Pflichtzustände

Für jedes animierte YouTube-Visual:

1. START
2. ca. 25 %
3. ca. 50 %
4. ca. 75 %
5. RESULT HOLD

Für statische Bild-/Diagrammszenen reicht ein stabiler repräsentativer Frame.

## Automatischer Representative-Frame-Render

Nach finaler Timeline:

```bash
npm run youtube:motion:qa -- youtube/<Projekt>
```

Der Renderer erzeugt für jedes animierte Quality-V1-Visual fünf 1920×1080-PNGs unter:

```text
06-projektdateien/motion-qa-frames/<visual-id>/
```

Zusätzlich entstehen:

- `06-projektdateien/motion-qa-manifest.json`
- `06-projektdateien/motion-qa-review.json`

Frühe Vorschau ist mit `--draft` erlaubt. Ein Draft verwendet bei fehlenden Timings eine Fallback-Dauer und wird niemals als finale QA akzeptiert.

## Review

`motion-qa-review.json` darf nur auf `PASS` gesetzt werden, wenn alle Pflichtchecks wahr sind:

- START und RESULT unterscheiden sich klar
- Hauptmechanik ist lesbar
- Safe Area eingehalten
- kein unbeabsichtigtes Clipping
- Resultat als Still verständlich
- Finanzwerte geprüft
- statische Alternative nach Implementierung erneut geprüft
- Nachbarszenen wiederholen das Muster nicht unnötig

Validierung:

```bash
npm run youtube:motion:qa:validate -- youtube/<Projekt>
```

`npm run youtube:ready -- youtube/<Projekt>` führt diese Prüfung bei Motion-Quality-V1-Projekten automatisch aus.

## 16:9 Layout Checks

- Frame 1920×1080
- reine Remotion darf Full Frame nutzen
- Flow-Bild selbst bleibt contained
- kritische Motion-Inhalte ungefähr 64 px von Außenkanten entfernt
- keine wichtigen Labels, Zahlen, Chartpunkte, Objekte oder Resultate abgeschnitten
- Header/Icon und Erklärinhalt kollidieren nicht
- Hauptvisual groß genug für normale YouTube-Ansicht
- kein unnötiger kleiner Innenrahmen für reine Motion

## Motion Quality Checks

Ablehnen oder neu planen, wenn:

- START und RESULT nahezu identisch sind
- nur Kamera-Drift/Zoom passiert
- hauptsächlich Textfades stattfinden
- drei Karten/Panels die komplette Animation sind
- ein Progress-Bar die Erklärung trägt
- Motion nur existiert, weil Hybrid erlaubt ist
- alle Objekte dieselbe Timing-/Easing-Logik nutzen
- ein starkes Standbild/Diagramm klarer wäre
- Bild und Remotion dieselbe Aussage doppeln
- Hauptmechanik im 1920×1080-Canvas zu klein ist
- Resultat verschwindet, bevor es gelesen werden kann

## Finance Checks

- Werte stimmen mit Skript/Datenquelle/zentrale Berechnung überein
- Vergleiche nutzen bei Bedarf gemeinsame Skala
- Achsen, Einheiten und Prozentzeichen sind eindeutig
- nominale und reale Werte sind unterscheidbar
- positive/negative Farblogik bleibt konsistent
- Chart-Animation suggeriert keinen Trend, den Daten nicht tragen

## Tool Routing Checks

Vor einer Custom-Animation prüfen:

- `MotionNumber`
- `MotionComparisonBars`
- `MotionLineChart`
- `MotionBeforeAfter`
- `MotionPathFlow` / `MotionMoneyFlow`
- `MotionBudgetAllocation`
- `MotionCompoundGrowth`
- `MotionLoanPaydown`
- `MotionPurchasingPower`
- `MotionTimeline`
- PremiumCharts / FinanceBlocks / DiagramBlocks
- `@remotion/paths` / `@remotion/shapes`
- Recharts bei echten Datenreihen
- Three/R3F nur bei räumlichem Erklärwert
- Lottie nur als Support

Ein Custom-Ansatz bleibt erlaubt, wenn er sichtbar besser erklärt.

## Cross-Scene Rhythm

Nachbarszenen gemeinsam prüfen:

- nicht mehrere identische Balkenszenen hintereinander
- nicht mehrere Text-only-Motion-Szenen hintereinander
- nicht dieselbe Links/Rechts-Komposition ohne Grund wiederholen
- konkrete, vergleichende, numerische und diagrammatische Ansichten sinnvoll abwechseln
- Wiederholung nur dann, wenn sie bewusst eine wiederkehrende Struktur lehrt

## Acceptance

YouTube Motion QA besteht nur, wenn:

1. die Veränderung über die fünf Frames sichtbar ist
2. der Result-Zustand als Still funktioniert
3. kritischer Inhalt nicht geclippt ist
4. Full Frame bewusst genutzt wird
5. Finanzwerte korrekt sind
6. Motion eine vernünftige statische Alternative schlägt
7. Nachbarszenen nicht unbegründet monoton sind

> Technisch valide Motion kann visuell trotzdem durchfallen. Wenn ein starkes Standbild besser ist, wird die Animation ersetzt.
