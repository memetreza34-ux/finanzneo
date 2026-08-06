# FinanzNeo — verbindliches Bildsystem

Dieses Dokument definiert das Bildsystem für alle neuen FinanzNeo-Reels.

Verbindlicher Stilanker:

- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- World ID: `finanzneo-connected-studio-v3`

## Ziel

Jedes Bild erklärt genau einen gesprochenen Satz durch eine zusammenhängende visuelle Handlung:

```text
Ausgangspunkt → sichtbare Veränderung → verständliches Ergebnis
```

Ein optisch hochwertiges Einzelobjekt reicht nicht. Alle Bildszenen eines Reels müssen außerdem sichtbar aus derselben FinanzNeo-Welt stammen.

## Weltkonsistenz

Vor den Szenenbildern wird pro Reel eine Weltreferenz vorbereitet:

```text
03-szenen/bildwelt.txt
03-szenen/bildwelt-referenz.png
```

Alle Szenenprompts verwenden diese Referenz nur für:

- Kamera und Perspektive
- Architektur und Raum
- Lichtführung
- Materialien
- Farbpalette
- Tiefenwirkung
- einheitliche Motivgröße

Die Welt bleibt gleich. Nur die finanzielle Handlung und die dafür benötigten Objekte wechseln.

## Verbindlicher visueller Stil

- premium isometric editorial finance illustration
- leicht isometrische Drei-Viertel-Kamera
- ungefähr 35-mm-äquivalente Perspektive
- dunkle, gebogene Anthrazit-Rückwand
- nahtlos verbundener matter Studioboden
- integrierte smaragdgrüne Lichtkanäle
- weiches Hauptlicht links oben
- grünes Kantenlicht rechts
- Gold nur für Geld und finanzielle Werte
- Rot nur für Risiko, Verlust oder blockierte Ausgaben
- hochwertige matte Materialien
- wenige dezente Glasdetails
- nicht fotorealistisch
- nicht kindlich, cartoonhaft, Pixar- oder Clay-artig

## Keine leere Bildfläche

Die oberen und unteren Randbereiche sind crop-sicher und detailarm, aber nicht leer. Wand, Boden, Licht und räumliche Tiefe laufen sichtbar weiter.

Verboten:

- isoliertes Objekt vor schwarzem Nichts
- reiner Farbverlauf ohne Raum
- zufälliger Glow als einziger Hintergrund
- schwebende Plattform ohne Verbindung zur Umgebung
- Motive, die wie Produktwerbung freigestellt wurden

Jede Szene besitzt drei Tiefenebenen:

1. unterstützender Vordergrund
2. erklärende Handlung im Mittelgrund
3. ruhige Studioarchitektur im Hintergrund

## Einheitliche Komposition

- Hauptszene füllt ungefähr 68–78 % der nutzbaren Breite.
- Wichtigstes Objekt bleibt zwischen den Bildern ähnlich groß.
- Hauptaktion liegt im mittleren 64-%-Bereich der Quellhöhe.
- Oben und unten bleiben jeweils ungefähr 18 % crop-sicher.
- Crop-sichere Bereiche zeigen weiterhin die gleiche Umgebung.
- Zwei bis vier große Hauptelemente.
- Nur ein eindeutiger Weg, Fluss oder Ursache-Wirkung-Zusammenhang.
- Smartphone-Verständlichkeit innerhalb einer Sekunde.

## Textregeln

In neuen Szenenbildern ist sämtlicher Text verboten:

- keine Überschrift
- kein Untertitel
- keine Labels
- keine Zahlen
- keine Karten- oder Kontobezeichnungen
- keine Logos oder Wasserzeichen

Remotion rendert alle Texte, Zahlen und geprüften Rechenwerte. Dadurch können Bildbeschriftungen weder falsch geschrieben noch beim späteren Crop abgeschnitten werden.

## Darstellung in Remotion

- Vordergrundbild grundsätzlich mit `object-fit: contain`.
- Keine unscharfe Kopie desselben Bildes als sichtbarer Hintergrundstreifen.
- Freie Flächen werden durch die zentrale FinanzNeo-Studiofläche aus Remotion gefüllt.
- Nur nachweislich ruhige Quellbereiche oben und unten dürfen beschnitten werden.
- Source-Crop pro Seite höchstens `0.20`.
- Source-Crop insgesamt höchstens `0.34`.
- Zusätzliche Skalierung höchstens `1.04`.
- Kein Crop von Motiven, Pfeilen, Geld, Icons oder erklärenden Objekten.

## Timing

Szenenschnitte folgen den tatsächlichen Satzanfängen aus den Wort-Zeitstempeln. Gleich lange Sechs-Sekunden-Szenen sind kein Standard.

Richtig:

```text
neuer Satz beginnt → passendes neues Bild oder passende Animation beginnt
```

Falsch:

```text
starres Zeitraster → Bild wechselt mitten im vorherigen Satz
```

## Pflichtstruktur eines Bildprompts

Jeder Prompt enthält:

1. `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3`
2. `SERIES CONTINUITY LOCK`
3. `ENVIRONMENT`
4. `COMPOSITION LOCK`
5. `TEXT`
6. `CONSISTENCY NEGATIVES`
7. konkrete Szenenaussage und visuelle Handlung

## Sofortige Neuerstellung

Ein Bild wird neu erzeugt, wenn:

- es wie eine andere Serie aussieht
- Kamera, Licht oder Architektur sichtbar abweichen
- der Hintergrund leer oder zufällig ist
- die Motivgröße deutlich von den übrigen Bildern abweicht
- das Bild bereits die Lösung zeigt, obwohl der Sprecher noch das Problem erklärt
- Text oder Zahlen im Bild stehen
- die visuelle Aussage nicht exakt zum gesprochenen Satz passt
- wichtige Inhalte nur durch aggressives Cropping nutzbar wären
