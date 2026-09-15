# FinanzNeo Unified Image World

## Authority

Diese Regel vereinheitlicht die visuelle KI-Bildwelt von FinanzNeo über Reels und YouTube. `CLAUDE.md` bleibt die höchste Repo-Autorität.

## One brand, one image world

Reels und YouTube verwenden dieselbe Core-Bildwelt:

- `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3`
- `FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1`
- `PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9`

Es darf keine separate YouTube-Art-Direction wie `finanzneo-youtube-grounded-3d-black-v1` als eigenständige Bildwelt eingeführt werden.

## Consistency lock

Über alle Bilder und Formate gleich halten:

- klar stylized 3D, niemals fotorealistisch
- gleiche weiche, hochwertige Material- und Formensprache
- deep seamless black als gemeinsame Bühne/Welt
- Emerald Green für positive/geschützte Reserve und Lösung
- Warm Red-Orange für Kosten/Risiko/Verlust
- Warm Ivory / Soft Gray für neutrale Materialien
- dezentes Gold nur für Geld/Wert
- weiches Studio-Licht, klare Separation und saubere Kontakt-/Objektschatten
- große, sofort lesbare Hero-Objekte
- keine blau/lila Cyberpunk-Neonsysteme, Sci-Fi-Dekoration oder fremde Farbsysteme

Die Bilder dürfen unterschiedliche Motive und Kompositionen haben, müssen aber wirken, als kämen sie aus demselben FinanzNeo-Studio.

## Best visual explanation first

Nicht automatisch eine reale Wohnung, einen Schreibtisch oder eine Person bauen. Wähle für jeden gesprochenen Gedanken die **einfachste und stärkste visuelle Darstellungsform**.

Erlaubte Darstellungsformen innerhalb derselben V9-Welt:

1. **Real-world scene** — nur wenn ein echtes Alltagsereignis die Aussage am schnellsten erklärt, z. B. kaputte Waschmaschine oder Autoreparatur.
2. **Floating object stage** — wenige große 3D-Objekte frei im schwarzen Raum, wenn Kategorien, Trennung oder Vergleich erklärt werden.
3. **3D data / diagram stage** — Balken, Kurve, Zeitleiste, Monatsblöcke, Verhältnis oder einfache Diagrammform direkt als stylized-3D-Bild, wenn Zahlen/Entwicklung die Aussage besser erklären.
4. **Spatial finance mechanism** — Geld, Reserve, Kosten, Trennung, Puffer oder Wege als klare räumliche Ursache-Wirkung-Mechanik.
5. **Simple comparison** — zwei klare Seiten/Zustände mit wenigen großen Objekten statt einer vollgebauten Szene.

Diese Formen dürfen kreativ kombiniert werden, solange das Bild sofort verständlich bleibt und dieselbe V9-Material-, Licht- und Farbwelt behält.

## Simplicity rule — one image, one idea

Ein Bild darf nicht versuchen, einen ganzen Absatz gleichzeitig zu erklären.

- genau **eine dominante Aussage** pro Bild
- ein klarer visueller Fokus
- wenige große Objekte statt vieler kleiner Objekte
- unterstützende Elemente nur, wenn sie für das Verständnis nötig sind
- keine vier Mini-Szenen, Diorama-Städte oder vollgestopften Collagen
- keine Pflicht, den gesamten 16:9-Raum zu füllen; schwarzer Negativraum ist erwünscht
- Labels kurz halten und nur einsetzen, wenn das Objekt sonst mehrdeutig wäre

Wenn ein Beat nur durch viele unabhängige Objektgruppen verständlich würde, soll Phase 1 lieber **zusätzliche einfache Bildslots planen**, statt alles in ein Bild zu pressen. Neue Bildslots müssen vor Flow-Generierung sauber im Projekt/Manifest geplant werden; Phase 2 darf nicht spontan unregistrierte Dateien erfinden.

## Entertainment + visual rhythm

Die Bildserie soll nicht wie zehn Varianten desselben Schreibtisch-Setups aussehen. Sorge bewusst für Rhythmus durch:

- wechselnde Kameradistanz und Objektgröße
- asymmetrische, klare Kompositionen
- einzelne Objekte, die frei im Raum schweben dürfen
- Tiefenstaffelung und große Vordergrundobjekte
- einfache Vorher/Nachher- oder Links/Rechts-Gegensätze
- visuell interessante Zahlen/Charts/Diagramme, wenn sie inhaltlich passen
- motion-ready Negativraum für spätere Remotion-Animation

Unterhaltung darf nie zu visueller Unordnung führen. **Klarheit zuerst, dann Kreativität.**

## No desk default

Schreibtisch-, Büro-, Wohnungs- oder Workshop-Szenen sind keine Standardlösung. Nutze sie nur, wenn der reale Ort selbst zur Aussage gehört. Für abstrakte Finanzpunkte sind freigestellte 3D-Objekte, Diagramme, räumliche Mechaniken oder einfache Vergleiche meist besser.

## Forbidden

- Photorealismus / Stockfoto-Look
- toy-like Plastik-Look
- überladene Collagen oder Mini-Dioramen
- generische Finance-Icon-Sammlungen als Haupterklärung
- Dashboard-/App-UI als Standarddarstellung
- winzige Floating Cards oder dünne Flowchart-Linien
- dekorative Objekte ohne Erklärfunktion
- Cyberpunk, Microchip-/Circuit-Look, blau/lila Neonwelten
- wiederholter Schreibtisch als Default-Komposition

## Format adaptation

Nur Canvas und Bildausschnitt unterscheiden sich:

- Reels: bestehendes Reel-Quellformat gemäß Reel-Vertrag
- YouTube: horizontal 16:9

YouTube darf den breiteren Raum für Tiefe, große Objekte, Diagramme oder Negativraum verwenden. Das ist **keine** Erlaubnis für eine andere Material-, Farb-, Licht- oder Stilwelt.

## Prompt + QA rule

Jeder neue FinanzNeo-YouTube-Bildprompt muss auf `finanzneo-stylized-3d-animated-black-v9` gelockt sein oder diesen Lock eindeutig über die Projekt-Bildweltdatei erben.

Vor PASS muss der Agent prüfen:

1. Ist innerhalb von 1–2 Sekunden genau eine Hauptaussage erkennbar?
2. Gibt es einen klaren Hero-Fokus?
3. Wurde nur so viel Realität/Umgebung verwendet, wie die Aussage wirklich braucht?
4. Ist die Szene sichtbar dieselbe FinanzNeo-V9-Welt wie die anderen Bilder?
5. Wirkt das Bild einfach, spannend und motion-ready statt vollgestellt?

Wenn eine Antwort `nein` ist, muss derselbe Bildslot regeneriert werden.