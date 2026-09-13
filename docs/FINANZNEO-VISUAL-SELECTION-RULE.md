# FinanzNeo Visual Selection Rule V2

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v2`

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
→ IMAGE oder ANIMATION wählen
→ konkrete Umsetzung ableiten
→ Motion so einfach wie möglich, so komplex wie nötig
```

## 1. Reels: harte IMAGE-ODER-ANIMATION-Regel

Für neue FinanzNeo-Reels ist jede Szene exakt einer von zwei Haupttypen:

### IMAGE

Eine Bildszene besteht aus:

- FinanzNeo `SceneHeader` + passendem Icon oben, außer Cover-Sonderfall scene-01
- genau einem klaren Google-Flow-Bild als Hauptvisual
- audio-synchronen Captions unten, außer Cover-Sonderfall scene-01

Das Bild selbst muss den gesprochenen Punkt bereits verständlich erklären.

Erlaubt sind nur kleine funktionale Objektbeschriftungen im generierten Bild, wenn sie Mehrdeutigkeit entfernen, zum Beispiel `Notgroschen`, `Tagesgeld`, `Reparatur 280 €`, `ETF`, `Zins`, `Tilgung`.

Nicht erlaubt sind erklärende Remotion-Overlays auf der Bildszene:

- keine animierten Pfeile oder Geldflüsse
- keine Parallax-/2.5D-Erklärung
- keine Chart- oder Datenoverlays
- keine Fokusmasken als zusätzliche Hauptaussage
- keine Lottie-Erklärung über dem Bild
- keine zusätzliche SVG-Hauptmechanik über dem Bild
- keine dekorative Dauerbewegung, nur damit das Bild nicht statisch wirkt

Normale kurze Szenenübergänge bleiben erlaubt.

### ANIMATION

Eine Animationsszene verwendet **kein generiertes Bild als Hauptvisual**.

Sie darf Remotion, SVG, Icons, Lottie, Charts, Zahlen, Pfade, 3D-Objekte und andere technische Werkzeuge verwenden. Die Hauptmechanik wird aber für den konkreten Sprechpunkt individuell in Phase 1 hergeleitet.

Pflicht-Reihenfolge:

```text
Sprechpunkt
→ sichtbares Verständnisziel
→ visuelle Frage
→ individuell beste Hauptmechanik
→ passende Technik
→ motionDesign
→ animation.tsx
```

Icons, Lottie und SVG sind Werkzeuge. Sie bestimmen nicht die Szenenidee.

## 2. Wann IMAGE?

IMAGE ist bevorzugt, wenn eine konkrete reale Situation als einzelnes Standbild schneller und klarer verstanden wird als eine Animation.

Typische Fälle:

- Notgroschen bei kaputter Waschmaschine
- Wasserschaden oder Reparatur
- Einkauf / Inflation als reale Alltagssituation
- Vertrag, Rechnung oder konkrete Ausgabe
- konkrete Lebenssituation mit Auto, Wohnung, Arbeit oder Familie
- ETF-/Finanzstruktur, wenn ein einziges klar aufgebautes Bild bereits genügt

Das Bild muss innerhalb ungefähr 1–2 Sekunden lesbar sein.

## 3. Wann ANIMATION?

ANIMATION ist bevorzugt, wenn Veränderung, Reihenfolge, Vergleich oder Ursache/Wirkung über Zeit die Erklärung trägt.

Typische Fälle:

- Zahlen steigen oder sinken
- zwei bis drei Monatsgehälter werden als Reserve aufgebaut
- Sparrate wird monatlich übertragen
- Kreditrate teilt sich in Zins und Tilgung
- Gebühren wirken über Zeit
- Restschuld sinkt
- Gewichtungen verschieben sich
- Geld wird zwischen klaren Stationen bewegt

Komplexität darf im Code entstehen, aber nicht in der Wahrnehmung des Zuschauers.

## 4. SVG

SVG ist erlaubt, wenn präzise Vektorbewegung die Animationsszene verbessert, zum Beispiel für Linien, Kurven, Donuts, Pfade, Netzwerke oder Markierungen.

SVG darf Hauptmechanik einer **Animationsszene** sein, wenn die abstrakte Darstellung klarer ist als eine reale Bildszene.

## 5. Icons

Icons dienen als semantische Kurzschrift, nicht als Ersatz für eine Erklärung.

Geeignet für Bank, Karte, Wallet, Dokument, Steuer, Warnung, Uhr, Haus, Einkauf, Vertrag oder Status.

## 6. Lottie

Lottie ist eine Support-Schicht für kleine klar definierte Bewegungen, zum Beispiel Check, Warnung, Lupe, Dokumentstatus oder Wallet-Signal.

Lottie ist nicht der FinanzNeo-Hauptstil.

## 7. Reels: erlaubte Kombinationen

Innerhalb einer **Animationsszene** sind Kombinationen erlaubt, zum Beispiel:

- Remotion + SVG
- Remotion + Icons
- Remotion + Lottie
- Remotion + SVG + Icons/Lottie

Für **Bildszenen** gilt dagegen:

> Bild + Header/Icon + Captions. Keine zusätzliche erklärende Hauptanimation über dem Bild.

Damit gibt es bei Reels keinen dritten Haupttyp `hybrid`.

## 8. Komplexitätsregel

**Komplexes Finanzthema bedeutet nicht automatisch komplexe Animation.**

Das Ziel ist:

> komplexen Inhalt mit einer möglichst einfachen sichtbaren Mechanik verständlich machen.

Beispiele:

- Zinseszins: Einzahlungen + Renditeanteil wachsen sichtbar auseinander
- Kredit: Monatsrate teilt sich in Zins/Tilgung, Restschuld sinkt
- Rebalancing: Gewichte driften auseinander und werden auf Zielwerte zurückgeführt
- Inflation: gleicher Geldbetrag kauft im Zeitverlauf weniger
- ETF-Replikation: Indexgewichte werden verständlich auf den ETF gespiegelt

## 9. Qualitätsfragen

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

## 10. Wiederholungsregel

Vor einem neuen Motion Beat prüfen:

- wurde gerade dieselbe Chart-Mechanik benutzt?
- wurde derselbe Geldfluss benutzt?
- ist Kamera + Layout + Transformation praktisch identisch?
- dominiert erneut dieselbe sichtbare Objektfamilie?
- gibt es eine klarere oder passendere Darstellung?

Technisch verschieden reicht nicht. Wiederholung bleibt erlaubt, wenn sie Vergleich, Kontinuität oder Verständnis verbessert und konkret begründet wird.

## 11. Verbotene Tool-first-Logik

Nicht zulässig als Entscheidungsgrund:

- `Wir haben dafür schon eine Komponente`
- `Das Lottie sieht cool aus`
- `Three.js ist komplexer`
- `Wir brauchen mehr Effekte`
- `Wir haben dieses Icon schon`

Werkzeuge folgen dem Inhalt, niemals umgekehrt.

## 12. Geltungsbereich

### Reels

Für neue Reels ist diese IMAGE-ODER-ANIMATION-Regel verbindlich. Harte Verträge in `CLAUDE.md`, `docs/FUTURE-REEL-PRODUCTION-V3.md`, `docs/FUTURE-REEL-PRESENTATION-V1.md`, Layout-, Image-World- und Phase-3-Gates gelten zusätzlich.

### YouTube Longform

YouTube Longform darf weiterhin eigene Kombinationen und Hybrid-Techniken verwenden, wenn `youtube/PRODUKTIONSSTANDARD.md` und `docs/YOUTUBE-MOTION-V3.md` sie erlauben. Die exklusive IMAGE-ODER-ANIMATION-Regel dieses Dokuments bezieht sich auf Reels.

## Kurzregel

> **Reel-Szene = IMAGE oder ANIMATION. IMAGE: Bild + Header/Icon + Captions, ohne erklärende Motion-Overlays. ANIMATION: kein generiertes Bild als Hauptvisual; die Mechanik wird individuell aus dem Sprechpunkt entwickelt.**
