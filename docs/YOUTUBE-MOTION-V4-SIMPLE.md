# FinanzNeo YouTube Motion V4 — Simple Finance

`MOTION_STANDARD: finanzneo-youtube-motion-v4-simple`

## Ziel

FinanzNeo Longform erklärt Finanzthemen so einfach wie möglich. Die Animation soll Verständnis erzeugen, nicht technische Komplexität zeigen.

> **Ein Gedanke → ein klares Visual → nur so viel Bewegung wie für das Verständnis nötig.**

## Reihenfolge

Für jeden Sprechpunkt gilt:

```text
1. Was muss der Zuschauer verstehen?
2. Kann ein statisches, sehr simples Visual reichen?
3. Falls Bewegung nötig ist: Was muss sich sichtbar verändern?
4. Welche einfachste Remotion-Umsetzung zeigt genau das?
5. Erst wenn einfache Mittel nicht reichen: komplexere Technik begründen.
```

Die Toolwahl kommt immer nach der Aussage.

## Standard-Bausteine

Bevorzugte Erklärmuster:

- `BigNumber` — eine wichtige Zahl
- `Comparison` — zwei oder drei Optionen direkt vergleichen
- `Percentage` — Anteil oder Prozentwert
- `BarChart` — Größenvergleich
- `LineChart` — Entwicklung über Zeit
- `Timeline` — Reihenfolge oder Zeitraum
- `MoneyFlow` — einfacher Geldfluss
- `ProcessSteps` — wenige Schritte
- `SimpleDiagram` — Beziehung zwischen wenigen Elementen
- `HighlightText` — kurze Kernaussage hervorheben
- `Allocation` — einfache Aufteilung
- `Formula` — nachvollziehbares Rechenbeispiel

Diese Muster dürfen beliebig oft wiederverwendet werden, wenn sie die Aussage am besten erklären. Wiederholung ist keine Qualitätsverletzung.

## Standard-Motion

Bevorzugte Bewegungen:

- `FADE_IN`
- `SLIDE_UP`
- `SLIDE_LEFT`
- `SCALE_IN`
- `COUNT_UP`
- `BAR_GROW`
- `LINE_DRAW`
- `HIGHLIGHT`
- `SLOW_ZOOM`

Mehrere Effekte gleichzeitig sind kein Qualitätsmerkmal. Meist reicht eine Hauptbewegung plus optional eine kleine Fokusbewegung.

## Remotion ist Default

Nutze Remotion zuerst für:

- Zahlen
- Prozente
- Vergleiche
- Gebühren
- Sparraten
- Rendite-/Kostenentwicklung
- Zinseszins
- Charts
- Zeitachsen
- ETF-/Portfolio-Aufteilungen
- Prozessschritte
- einfache Rechenwege

Wichtige Texte und Zahlen werden in Remotion gerendert und nicht von einem Bildgenerator erzeugt.

## Echte Assets

Wenn der Sprechpunkt eine reale Website, App, Quelle, ein Dokument, Factsheet, Logo oder Produkt betrifft, nutze das echte Asset bzw. einen echten Screenshot. Kein KI-Bild soll eine vorhandene Quelle imitieren.

## Google Flow

Flow ist keine Standardquelle für jede Szene.

Flow ist nur sinnvoll, wenn eine konkrete Alltagssituation schneller verstanden wird als eine Grafik, z. B.:

- kaputte Waschmaschine + Reparaturkosten
- Einkauf / Inflation
- Miete / Versicherung / Vertrag
- konkreter finanzieller Alltagsstress

Vor jedem Flow-Einsatz gilt der Gate-Test aus `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

## Hybrid

`hybrid` ist erlaubt, aber selten. Ein Flow-Bild muss die reale Situation bereits klar tragen; Remotion ergänzt nur notwendige zeitliche Information oder Labels. Kein Hybrid nur deshalb, damit sich ein Bild bewegt.

## Fortgeschrittene Techniken

SVG, Canvas, CSS 3D, Three.js/R3F, Masks, Motion Blur, aufwendige Kamerawege oder komplexe Simulationen sind erlaubt, aber **nicht Default**.

Wenn eine fortgeschrittene Technik eingesetzt wird, muss `advancedReason` konkret erklären, warum ein einfaches Standardmuster die Aussage nicht gleich gut verständlich machen kann.

Ungültige Begründungen:

- „sieht hochwertiger aus“
- „mehr Abwechslung“
- „wir hatten schon einen Balken“
- „wir können Three.js benutzen“

Gültige Begründung ist immer inhaltlich.

## Minimale Motion-Metadaten

Ein Motion-Visual braucht nur:

```json
{
  "viewerChange": "Was sieht der Zuschauer konkret passieren?",
  "reason": "Warum erklärt diese Bewegung den gesprochenen Punkt?",
  "motionPreset": "BAR_GROW",
  "animationSourceFile": "04-visuals/EINZELNE-VISUALS/visual-03/animation.tsx",
  "animationExport": "YouTubeVisual03Animation"
}
```

Optional bei Spezialfällen:

```json
{
  "advancedReason": "Warum die Standardmuster hier nicht reichen",
  "toolStack": ["SVG", "Remotion"]
}
```

Keine Pflicht mehr für einzigartige `mechanicId`, `visualTechniqueId`, `compositionFamilyId`, Motion-Signatures, mehrere Motion-Channels oder künstlich verschiedene Mechaniken.

## Source-Regeln

Produktive `animation.tsx`:

- verwendet `useCurrentFrame()`
- steuert sichtbare Bewegung mit `interpolate()` und/oder `spring()`
- ist deterministisch
- enthält keine TODOs oder Platzhalter
- kein `Math.random()`
- kein `Date.now()`
- keine Timer
- kein Runtime-Fetch
- keine CSS-Keyframe-/Transition-Animation als Ersatz für framebasierte Remotion-Motion
- exportiert die in `visual-index.json` genannte Komponente

## Qualitätsprüfung

Eine Szene besteht den V4-Test, wenn:

1. die Hauptaussage nach ungefähr 1–2 Sekunden erkennbar ist;
2. ein dominanter Gedanke sichtbar ist;
3. unnötige Elemente entfernt wurden;
4. die Bewegung eine Information erklärt oder fokussiert;
5. wichtige Zahlen und Texte sauber lesbar sind;
6. kein einfacheres Visual dieselbe Aussage gleich gut erklären würde.

## Rhythmus

Keine starre Szenenlänge. Schnitte folgen Voiceover, Gedanken und Kapiteln. Ein Visual darf länger stehen, wenn es weiterhin genau den aktuellen Gedanken erklärt.

## Leitidee

**Finanzfluss-artige Erklärklarheit + Finanzbär-artige visuelle Direktheit + eigene FinanzNeo-Identität.**

Nicht kopieren. Die übertragbaren Prinzipien sind: verständliche Struktur, konkrete Beispiele, große lesbare Informationen, wenige Elemente und zweckmäßige Bewegung.
