# FinanzNeo — Pre-Video Ready

Dieses Dokument beschreibt den letzten Produktionsstandard vor einem neuen YouTube-Finanzvideo.

## Ziel

Vor dem nächsten echten Video soll der Werkzeugkasten vollständig geprüft sein. Danach wird nicht weiter am System gebaut, sondern ein echtes Video produziert und anhand des Ergebnisses verbessert.

## Visual-Auswahl

Für jeden Script-Beat gilt diese Reihenfolge:

1. stärkste statische Lösung prüfen
2. konkretes 3D-Bild / Beispiel prüfen
3. Diagramm / Vergleich / Rechnung prüfen
4. nur dann Motion einsetzen, wenn Bewegung zusätzlichen Erklärwert liefert
5. Bild + Remotion nur, wenn beide klar unterschiedliche Jobs haben

Keine Motion-Quote. Keine Hybrid-Quote. Keine Animation nur wegen Abwechslung.

## Wiederverwendbare Finanz-Motion

### Einzelzahl / Prozent / Betrag
- `MotionNumber`

### Zwei Werte vergleichen
- `MotionComparisonBars`
- `MotionBeforeAfter`

### Entwicklung / Kurve
- `MotionLineChart`
- PremiumCharts / Recharts bei echten Datenserien

### Geld bewegt sich zwischen Zielen
- `MotionPathFlow`
- `MotionMoneyFlow`

### Budget aufteilen
- `MotionBudgetAllocation`

### Sparplan / Zinseszins
- `MotionCompoundGrowth`
- Werte aus zentralen Finanzberechnungen

### Kredit / Tilgung
- `MotionLoanPaydown`
- Werte aus zentralen Finanzberechnungen

### Inflation / Kaufkraft
- `MotionPurchasingPower`
- bei emotionaler Alltagserklärung darf ein starkes Vorher/Nachher-Bild besser sein

### Ablauf / Monats- oder Jahresverlauf
- `MotionTimeline`

## Werkzeug-Routing

Nur verwenden, wenn es wirklich passt:

- `@remotion/paths`: Pfade, Kurven, Geldrouten
- `@remotion/shapes`: saubere Vektorformen und Diagrammgeometrie
- Recharts / PremiumCharts: reale Datenserien
- Three.js / React Three Fiber: nur bei echtem räumlichem Erklärwert
- Lottie: kleine unterstützende Mikroanimation
- Motion Blur: schnelle physische Bewegung
- Transitions / Effects: letzter Polish, nicht Hauptidee

## Bewegungsphysik

Nicht alle Objekte gleich animieren. Das zentrale Motion-System besitzt unterschiedliche Presets für Chart, Geld, Papier, schwere Objekte und Bestätigungen.

Eine echte Motion-Szene wird als sichtbare Mechanik geplant:

`START → TRIGGER → ACTION → REACTION/CHANGE → RESULT → HOLD`

## YouTube 16:9 QA

Jede echte Motion-Szene wird in fünf Zuständen gerendert:

- START
- 25 %
- 50 %
- 75 %
- RESULT HOLD

Danach werden mindestens geprüft:

- Hauptmechanik verständlich
- START und RESULT klar verschieden
- 1920×1080 sinnvoll genutzt
- kritische Inhalte etwa 64 px von den Außenkanten entfernt
- kein unbeabsichtigtes Clipping
- Resultat als Standbild lesbar
- Finanzwerte korrekt
- statische Alternative erneut geprüft
- keine unnötig gleiche Motion in Nachbarszenen

## Thumbnail

Das finale Thumbnail wird direkt mit sichtbarem Hook-Text geplant und erzeugt. Kein textloses Hintergrundbild als finaler Stand.

Der Text muss exakt stimmen. Fehlender, falscher, verzerrter oder unlesbarer Text bedeutet: Thumbnail neu erzeugen.

## Befehle

Vor einem neuen Video:

```bash
npm run youtube:system:ready
```

Für ein Hybrid-Projekt:

```bash
npm run youtube:create:mode -- --mode hybrid --target youtube/<projekt> --title "<Titel>" --types <visualtypen>
```

Während Phase 1:

```bash
npm run youtube:animation:validate -- youtube/<projekt>
npm run youtube:phase1:seal -- youtube/<projekt>
```

Representative-Frame-QA:

```bash
npm run youtube:motion:qa -- youtube/<projekt>
npm run youtube:motion:qa:validate -- youtube/<projekt>
```

Vor Phase 3:

```bash
npm run youtube:ready -- youtube/<projekt>
```

## Produktionsentscheidung

Wenn `youtube:system:ready` und CI grün sind, wird als nächster Schritt ein echtes Testvideo produziert. Weitere allgemeine System-Erweiterungen werden nur vorgenommen, wenn dieses Video einen konkreten neuen Mangel zeigt.
