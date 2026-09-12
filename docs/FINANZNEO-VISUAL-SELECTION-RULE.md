# FinanzNeo Visual Selection Rule V1

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

Diese Regel entscheidet **vor der Umsetzung**, welche visuelle Form für einen gesprochenen Finanzgedanken verwendet wird.

## Kernprinzip

Nicht zuerst fragen:

> Welche Animation können wir bauen?

Sondern:

> Was soll der Zuschauer nach diesem Beat sichtbar verstanden haben?

Danach wird die **einfachste ausreichend starke** Visualisierung gewählt.

## Entscheidungsreihenfolge

```text
Sprechpunkt
→ sichtbares Lernziel / viewerChange
→ Komplexität des Inhalts einschätzen
→ passende Visualart wählen
→ unterstützende Werkzeuge nur bei echtem Mehrwert ergänzen
→ Motion so einfach wie möglich, so komplex wie nötig
```

## 1. Pure Remotion

`pure-remotion` ist der Default für Inhalte, die ohne aufwendige Bildwelt klar verständlich werden.

Typische Fälle:

- Zahlen hoch-/runterzählen
- Prozentaufteilungen
- Balken-, Linien- und Flächendiagramme
- Sparraten, Rendite, Gebühren, Restschuld
- einfache Vorher/Nachher-Vergleiche
- einfache Zeitachsen
- einfache Geldflüsse
- Zins-/Tilgungsaufteilung
- klar prüfbare Datenvisualisierung

Ziel: **direkt, ruhig, hochwertig und sofort verständlich**.

Komplexität darf im Code entstehen, aber nicht in der Wahrnehmung des Zuschauers.

## 2. Bild + Remotion Hybrid

`hybrid` wird bevorzugt, wenn ein komplexes, reales oder räumliches Finanzthema durch eine konkrete Szene deutlich verständlicher wird.

Typische Fälle:

- Notgroschen in einer realen Alltagssituation
- Inflation beim Einkauf
- Dispo / Kontoüberziehung
- Versicherung, Vertrag oder Rechnung
- ETF-/Index-Strukturen mit mehreren realen oder räumlichen Ebenen
- Dividende → Steuer → Reinvestition
- komplexe Geldflüsse durch mehrere Stationen
- Ursache/Wirkung, die als konkrete Situation schneller verstanden wird als als abstrakte Grafik

Das Bild muss bereits als Standbild verständlich sein. Remotion ergänzt **zeitliche Information**, zum Beispiel:

- Kamera-Push oder kontrollierte 2.5D-Parallax
- Fokuswechsel
- Masken / Reveals
- selektive Objekt-Hervorhebung
- Wert- und Labeländerungen
- Geldfluss-/Pfadbewegung
- Vorher/Nachher-Transformation
- Tiefenstaffelung
- Chart-/Datenoverlay

Bewegung wird nicht nur hinzugefügt, damit ein Bild "animiert" aussieht.

## 3. SVG

SVG ist bevorzugt, wenn präzise Vektorbewegung die Erklärung verbessert.

Geeignet für:

- Linien und Kurven
- Pfade und Verbindungen
- Donuts / Kreise
- Diagrammaufbau
- Netzwerkverbindungen
- Markierungen
- Gewichtungen
- Geldfluss- oder Prozesspfade

SVG darf Hauptmechanik sein, wenn die abstrakte Darstellung klarer ist als eine reale Bildszene.

## 4. Icons

Icons dienen als **semantische Kurzschrift**, nicht als Haupt-Erklärung.

Geeignet für:

- Bank
- Karte
- Wallet
- Dokument
- Steuer
- Warnung
- Uhr
- Haus
- Einkauf
- Vertrag
- Status / Kategorie

Bevorzugt werden konsistente, saubere SVG-Icon-Sets. Icons dürfen animiert werden, aber eine komplexe Finanzlogik nicht durch eine reine Icon-Sammlung ersetzen.

## 5. Lottie

Lottie ist eine **Support-Schicht** für kleine, klar definierte Bewegungen.

Geeignet für:

- Check / Erfolg
- Warnung
- Lupe / Prüfung
- Dokumentstatus
- kleines Geld-/Wallet-Signal
- UI-/Statushinweis
- kurze Übergangs- oder Fokusaktion

Lottie ist nicht der FinanzNeo-Hauptstil. Kein komplettes Erklärvideo und keine komplexe Finanzmechanik wird nur deshalb als Lottie gebaut, weil ein fertiges Asset existiert.

## 6. Kombinationen

Erlaubte Kombinationen umfassen unter anderem:

- Remotion + SVG
- Remotion + Icons
- Remotion + Lottie
- Bild + Remotion
- Bild + Remotion + SVG
- Bild + Remotion + Icons
- Bild + Remotion + Lottie
- Bild + Remotion + SVG + Icons/Lottie

Jedes zusätzliche Werkzeug muss einen **konkreten Erklärwert** haben.

## 7. Komplexitätsregel

**Komplexes Finanzthema bedeutet nicht automatisch komplexe Animation.**

Das Ziel ist:

> komplexen Inhalt mit einer möglichst einfachen sichtbaren Mechanik verständlich machen.

Beispiele:

- Zinseszins: Einzahlungen + Renditeanteil wachsen sichtbar auseinander
- Kredit: Monatsrate teilt sich in Zins/Tilgung, Restschuld sinkt
- Rebalancing: Gewichte driften auseinander und werden auf Zielwerte zurückgeführt
- Inflation: gleicher Geldbetrag kauft im Zeitverlauf weniger
- ETF-Replikation: Indexgewichte werden verständlich auf den ETF gespiegelt

Der Zuschauer soll die **Erklärung** sehen, nicht die technische Komplexität der Umsetzung.

## 8. Qualitätsfragen

Jeder Visual Beat muss mindestens eine konkrete Frage sichtbar beantworten:

- Was verändert sich?
- Was wächst oder schrumpft?
- Was kostet Geld?
- Wo fließt Geld hin?
- Was bleibt übrig?
- Was wird verglichen?
- Was ist Ursache und was Wirkung?
- Was ist Problem und was Lösung?

Wenn die Szene nur dekorativ wirkt, ist die Visualwahl falsch.

## 9. Wiederholungsregel

Vor einem neuen Motion Beat prüfen:

- wurde gerade dieselbe Chart-Mechanik benutzt?
- wurde derselbe Geldfluss benutzt?
- ist Kamera + Layout + Transformation praktisch identisch?
- dominiert erneut dieselbe sichtbare Objektfamilie?
- gibt es eine klarere oder passendere Darstellung?

**Technisch verschieden reicht nicht.** Eine neue Komponenten-ID, `MECHANIC_ID`, andere Variable oder ein anderes Support-Asset macht eine Animation nicht automatisch visuell neu.

Insbesondere gilt:

- anderes Lottie + gleiche Hauptaktion = keine neue Haupttechnik
- anderes Icon + gleiches Layout = keine neue Haupttechnik
- anderes SVG-Supportelement + gleiche camera/layout/transformation-Signatur = keine neue Haupttechnik
- wieder Account + Rechnung + Münzen mit leicht anderer Bewegung = weiterhin dieselbe sichtbare Familie, solange Hauptaktion und Komposition praktisch gleich bleiben

Wiederholung bleibt erlaubt, wenn sie Vergleich, Kontinuität oder Verständnis verbessert und konkret begründet wird.

## 10. Verbotene Tool-first-Logik

Nicht zulässig als Entscheidungsgrund:

- "Wir haben dafür schon eine Komponente"
- "Das Lottie sieht cool aus"
- "Three.js ist komplexer"
- "Wir brauchen mehr Effekte"
- "Wir haben dieses Icon schon"

Werkzeuge folgen dem Inhalt, niemals umgekehrt.

## 11. Geltungsbereich

### YouTube Longform

Diese Regel ist **verbindlich** und ergänzt:

- `youtube/PRODUKTIONSSTANDARD.md`
- `docs/YOUTUBE-MOTION-V3.md`
- `.agents/skills/finanzneo-youtube-motion-director/SKILL.md`

### Reels

Für neue Reels ist diese Regel eine **Planungsregel**. Harte Reel-Verträge in `CLAUDE.md`, `docs/FUTURE-REEL-PRODUCTION-V3.md`, `docs/FUTURE-REEL-PRESENTATION-V1.md`, Layout-/Image-World-/Phase-3-Gates haben weiterhin Vorrang. Sie werden durch dieses Dokument nicht abgeschwächt.

`FUTURE-REEL-PRESENTATION-V1` macht die Wiederholungsregel für neue Reels zusätzlich maschinenlesbar und prüft die sichtbare Zuschauer-Hierarchie im echten Render.

## Kurzregel

> **Einfache Finanzthemen: pure Remotion. Komplexe oder reale Finanzthemen: Bild + Remotion. SVG, Icons und Lottie nur als gezielte Unterstützung. Immer zuerst das sichtbare Lernziel wählen, dann das Werkzeug. Technisch verschieden zählt erst dann als neu, wenn es auch sichtbar eine andere Erklärung ist.**
