# FinanzNeo — YouTube Motion Quality V1

`YOUTUBE_MOTION_QUALITY_STANDARD: finanzneo-youtube-motion-quality-v1`

## Ziel

YouTube-Finanzanimationen sollen nicht wie animierte Präsentationen wirken. Motion wird nur eingesetzt, wenn Bewegung eine Aussage klarer macht als ein starkes Standbild, Diagramm oder Beispiel.

## Qualitätsreihenfolge

Vor jeder Animation:

```text
Kernaussage
→ stärkste statische Lösung prüfen
→ konkrete sichtbare Mechanik definieren
→ vorhandenen FinanzNeo-Baustein / Remotion-Werkzeug routen
→ mehrere sichtbare Zustände planen
→ erst dann implementieren
```

Wenn eine statische Lösung gleich klar oder besser ist, wird nicht animiert.

## Pflicht für echte Animationsszenen

Eine Animationsszene soll nach Möglichkeit diese Zustände besitzen:

```text
START
→ TRIGGER
→ ACTION
→ REACTION / CHANGE
→ RESULT
→ SHORT RESULT HOLD
```

Nicht jeder Beat braucht alle sechs Phasen, aber `START`, eine sichtbare Veränderung und ein klarer `RESULT` müssen unterscheidbar sein.

## Bestehenden Stack zuerst nutzen

Neue Animationen sollen nicht jedes Mal bei null anfangen. Vor eigener Speziallösung prüfen:

1. `src/design-system/YouTubeMotionExplainers.tsx`
   - `MotionNumber`
   - `MotionComparisonBars`
   - `MotionLineChart`
   - `MotionMoneyFlow`
   - `MotionBeforeAfter`
2. zentrale Finanzberechnungen aus `src/finance/`
3. vorhandene Chart-/Diagramm-/Finance-Bausteine über `src/design-system/index.ts`
4. native Remotion-Komposition mit `useCurrentFrame()`, `interpolate()`, `spring()`
5. `@remotion/paths` / `@remotion/shapes` für echte Pfade, Kurven und Vektorformen
6. Three.js / React Three Fiber nur wenn räumliche Tiefe wirklich erklärt
7. Lottie nur als unterstützende Mikroanimation
8. Motion Blur nur bei schneller physischer Bewegung
9. Transitions/Effects nur wenn sie den Szenenwechsel oder Fokus verbessern

Die Verfügbarkeit eines Werkzeugs ist kein Grund, es einzusetzen.

## Finanzspezifische Routings

### Zahl / Prozent / Betrag

Bevorzugt:
- `MotionNumber`
- BigNumber-/Percentage-Bausteine
- statische Zahl, wenn Aufbau keinen Mehrwert hat

### Zwei Werte vergleichen

Bevorzugt:
- `MotionComparisonBars`
- `MotionBeforeAfter`
- vorhandene Vergleichs-/Chart-Bausteine

### Entwicklung über Zeit

Bevorzugt:
- `MotionLineChart`
- vorhandene PremiumCharts / Recharts
- Timeline

### Geld bewegt sich zwischen zwei Zielen

Bevorzugt:
- `MotionMoneyFlow`
- Pfad nur wenn die Route selbst Teil der Erklärung ist

### Inflation / Kaufkraft

Bevorzugt:
- konkretes Vorher/Nachher-Bild
- Warenkorb-Vergleich
- Linie oder Balken für Entwicklung
- Animation nur, wenn die zeitliche Veränderung sichtbar erklärt werden soll

### Sparplan / Zinseszins

Bevorzugt:
- zentrale Finanzberechnung
- Linie + Einzahlungen + Wachstum
- keine frei erfundenen Zahlen im JSX

### Kredit / Raten

Bevorzugt:
- Tilgungs-/Kostenvergleich
- Geldfluss oder Timeline
- reale Gesamtkosten sichtbar gegen Monatsrate stellen

## Bewegungsqualität

Nicht alle Objekte gleich bewegen.

- Zahlen: kontrolliert, ruhig, tabular-nums
- Geld: schneller, kurzer kontrollierter Spring
- Balken: sauberer Build ohne Bounce-Orgie
- Papier/Rechnung: leichtes Slide/Settle
- schwere Objekte: träger, weniger Overshoot
- Warnung: kurzer Impuls
- Bestätigung: schneller sauberer Pop + Hold
- Kamera: nur unterstützend, nie Hauptanimation

## Ablehnungsgründe

Animation neu planen oder durch statische Lösung ersetzen, wenn:

- nur Textzeilen nacheinander einblenden;
- nur drei Karten erscheinen;
- ein Progress-Bar die ganze Aussage tragen muss;
- Start und Resultat fast gleich aussehen;
- Bewegung nur Dekoration ist;
- dieselbe Balken-/Kartenlogik mehrfach hintereinander wiederholt wird;
- die Animation schwächer aussieht als ein gutes Standbild;
- Bild und Remotion dieselbe Aussage doppelt erklären;
- wichtige Objekte klein in viel leerer Fläche stehen;
- die Szene wie Dashboard, PowerPoint oder App-UI wirkt.

## Representative-Frame-QA für YouTube 16:9

Für jede echte Animation mindestens diese Zustände prüfen:

- Start
- ca. 25 %
- ca. 50 %
- ca. 75 %
- Result Hold

Fragen:

1. Ist die Hauptveränderung sofort sichtbar?
2. Kann man die Richtung der Aussage ohne Voiceover ungefähr verstehen?
3. Nutzt die Szene 1920×1080 sinnvoll?
4. Bleibt kritischer Inhalt innerhalb der YouTube-Motion-Safe-Area?
5. Ist nichts unbeabsichtigt abgeschnitten?
6. Ist der Result-Zustand als Still verständlich?
7. Wäre ein starkes Standbild besser?
8. Wiederholt die Szene unnötig die vorherigen Motion-Muster?

## Kurzregel

> Erst starke statische Idee. Motion muss zusätzlichen Informationswert liefern. Vorhandene FinanzNeo-Bausteine und Remotion-Werkzeuge gezielt routen. START und RESULT müssen klar verschieden sein. Schwache Animation lieber ersetzen als künstlich aufpolieren.
