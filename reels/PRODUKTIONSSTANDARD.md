# FinanzNeo-Reel-Produktionsstandard

## 1. Genau eine Produktionsquelle pro Szene

### Bildszene

```text
scene-XX/
├── bildprompt.txt
├── finales-bild.png
└── szene.md
```

Vor der Bildgenerierung besteht der Ordner nur aus `bildprompt.txt` und `szene.md`.

### Remotion-Szene

```text
scene-XX/
├── remotion.md
└── szene.md
```

Eine Remotion-Szene enthält weder Bildprompt noch Bilddatei.

Verboten:

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` in einem Szenenordner
- `bildprompt.txt` und `remotion.md` in derselben Szene
- Bilddateien in einer Remotion-Szene
- mehr als ein finales Bild in einer Bildszene

## 2. FinanzNeo Image World V3

Alle neuen Reels verwenden:

```text
World ID: finanzneo-connected-studio-v3
```

Verbindliche Dokumentation:

- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/IMAGE-QA-CHECKLIST.md`

Jedes Reel besitzt:

```text
03-szenen/bildwelt.txt
03-szenen/bildwelt-referenz.png
```

Die Referenz wird zuerst erzeugt. Alle Szenenbilder verwenden sie ausschließlich als Stil- und Weltreferenz.

## 3. Einheitliche Bildwelt

Alle Bilder eines Reels behalten dieselben Merkmale:

- gleiche leicht isometrische Drei-Viertel-Kamera
- gleiche 35-mm-äquivalente Perspektive
- gleiche Kamerahöhe und Blickrichtung
- gleiche Anthrazit-Studioarchitektur
- gleicher matter Boden und gebogene Rückwand
- gleiche smaragdgrünen Lichtkanäle
- gleiche Lichtführung und Materialien
- ähnliche Größe des wichtigsten Motivs

Die finanzielle Handlung darf wechseln. Die Welt darf nicht wechseln.

## 4. Kein leerer Hintergrund

Ein Szenenbild zeigt niemals nur ein isoliertes Objekt vor schwarzem Nichts.

Pflicht:

- sichtbare, ruhige Studioarchitektur
- Vordergrund, Mittelgrund und Hintergrund
- nahtloser Boden-Rückwand-Übergang
- crop-sichere Randbereiche als Fortsetzung der Umgebung
- Hauptszene füllt ungefähr 68–78 % der nutzbaren Breite

Verboten:

- leerer schwarzer Hintergrund
- reiner Glow oder Verlauf ohne Raum
- schwebende Werbeplattform
- freigestellter Produkt-Render
- zufällige Umgebung pro Szene

## 5. Textfreie Bildquellen

Neue Bilder enthalten grundsätzlich keinen Text:

- keine Überschrift
- keine Untertitel
- keine Labels
- keine Zahlen
- keine Konto-Namen
- keine Logos oder Wasserzeichen

Remotion rendert sämtliche Typografie und geprüften Werte.

## 6. Bildprompt-Vertrag

Jeder Bildprompt enthält exakt folgende Marker:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
SERIES CONTINUITY LOCK:
ENVIRONMENT:
COMPOSITION LOCK:
TEXT:
CONSISTENCY NEGATIVES:
SCENE MESSAGE:
CONNECTED VISUAL STORY:
```

Die Weltbeschreibung bleibt in allen Prompts gleich. Nur `SCENE MESSAGE`, Objekte und Handlung werden individuell angepasst.

## 7. Darstellung in Remotion

- Vordergrundbild mit `object-fit: contain`.
- Keine sichtbare unscharfe Kopie desselben Bildes im Hintergrund.
- Freie Flächen werden durch die zentrale FinanzNeo-Studiobühne gefüllt.
- Source-Crop oben höchstens `0.20`.
- Source-Crop unten höchstens `0.20`.
- Source-Crop insgesamt höchstens `0.34`.
- Zusätzliche Skalierung höchstens `1.04`.
- Nur nachweislich ruhige Umgebungsfläche darf beschnitten werden.
- Wichtige Objekte, Pfeile, Geld und erklärende Elemente dürfen nie abgeschnitten werden.

## 8. Verbindliches 9:16-Layout

```text
0–250 px       Überschrift mit passendem Icon
270–1350 px    Bild oder Remotion-Animation
ca. 1450 px    Untertitelbereich
untere 320 px  Plattform-Safe-Area
rechte 150 px  Reels-Bedienleiste freihalten
```

- Überschrift oben, nie im Untertitelkasten.
- Erste Zeile weiß.
- Schwerpunktzeile grün oder bei Geldrechnungen gold.
- Passendes Linien-Icon neben der Schwerpunktzeile.
- Icon und Schwerpunktzeile besitzen dieselbe visuelle Höhe.

## 9. Untertitel

- Immer genau ein vollständiger Satz sichtbar.
- Nur das aktuell gesprochene Wort ist FinanzNeo-grün.
- Übrige Wörter bleiben weiß.
- Vorheriger Satz bleibt während kurzer Pausen sichtbar.
- Keine leeren Caption-Lücken.
- Höchstens zwei fest berechnete Zeilen.
- Keine springenden Wörter und keine Größenanimation.

## 10. Satzbasierte Szenenschnitte

Szenenlängen werden aus den finalen Wort-Zeitstempeln abgeleitet.

Der Beginn einer neuen Szene entspricht dem Beginn des ersten zugehörigen Satzes. Ein starres Raster aus gleich langen Szenen ist standardmäßig verboten.

```text
word-timings → Satzanfänge → Szenenstarts → relative Animationsdauer
```

## 11. Audio

Ziel für das veröffentlichte Voiceover:

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

Der genaue Wert wird am finalen Export gemessen. Eine reine Code-Verstärkung ersetzt keine finale Audiokontrolle.

## 12. Bildsatz-QA

Vor Freigabe:

1. alle Bilder als Kontaktbogen nebeneinander prüfen
2. gleiche Kamera, Architektur, Palette, Licht und Motivgröße bestätigen
3. Satzgenauigkeit jedes Bildes prüfen
4. Anfang, Mitte und Ende jeder Bildszene im Render prüfen
5. vollständige MP4 mit Ton ansehen

Ein Bildsatz wird neu erstellt, wenn ein einzelnes Bild sichtbar aus einer anderen Welt stammt oder dem gesprochenen Satz widerspricht.

## 13. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt:

- `bildwelt.txt`
- Weltmetadaten im `scene-index.json`
- vollständige V3-Promptstruktur pro Bildszene
- Bilddarstellungswerte
- Caption-, Timing- und Audioverträge

## 14. Automatische Prüfung

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator prüft unter anderem:

- genau eine Produktionsquelle
- keine verbotenen Dateien
- Image World V3 und `bildwelt.txt`
- alle Pflichtmarker in jedem Bildprompt
- kein leerer Hintergrund als Zielstil
- `contain` und sichere Crop-Grenzen
- Icon, Überschrift und Schwerpunktzeile
- Worttiming-Datei und Satzmodus
- keine Caption-Lücken
- mindestens 250 px untere Safe-Area
- Satzanfänge als Schnittgrundlage
- Audio-Zielmetadaten
