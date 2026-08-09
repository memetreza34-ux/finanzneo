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

## 2. Google Flow: Einzelbild-Erzeugung, Benennung und Sammelordner

Für Google Flow gilt ein eigener verbindlicher Ablauf. Dieser Abschnitt gilt **ausschließlich für den Google-Flow-KI-Agenten**, nicht für Codex, Antigravity oder andere Agenten.

### Grundregel

Google Flow erzeugt immer genau **ein einziges benötigtes Bild** nach dem anderen.

```text
1 Bild generieren
→ sofort endgültig umbenennen
→ genau dieses Bild prüfen
→ erst dann das nächste Bild generieren
```

Google Flow darf niemals mehrere neue Bilder gleichzeitig erzeugen und sie später gesammelt umbenennen.

### Verbindliche Nummerierung

Die Bildnummer entspricht immer exakt der echten chronologischen Szenennummer im Reel.

```text
Bild 00 → Cover
Bild 01 → Szene 01
Bild 02 → Szene 02
Bild 03 → Szene 03
...
```

Die Nummer ist **nicht** die laufende Nummer der tatsächlich erzeugten Bilddateien.

### Animationsszenen erzeugen Lücken

Eine Remotion-Animationsszene behält ihre Szenennummer, bekommt aber keine Bilddatei. Diese Nummer darf niemals an die nächste Bildszene weitergegeben werden.

Beispiel:

```text
Szene 01 = Bild      → Bild 01.png
Szene 02 = Animation → kein Bild 02
Szene 03 = Bild      → Bild 03.png
```

`Bild 03` ist hier zwar das zweite tatsächlich erzeugte Szenenbild, heißt aber trotzdem `Bild 03`, weil es zu Szene 03 gehört. `Bild 02` wäre ausdrücklich falsch.

Maßgeblich ist ausschließlich die echte Szenennummer aus `03-szenen/scene-index.json`.

### Pflichtblock am Ende von `alle-bildprompts.txt`

Jede Datei

```text
03-szenen/alle-bildprompts.txt
```

endet mit einer ausdrücklichen Google-Flow-Anweisung für genau dieses Reel. Sie muss enthalten:

- Einzelbild-Schleife: `GENERIEREN → SOFORT UMBENENNEN → PRÜFEN → NÄCHSTES BILD`
- Cover = `Bild 00`
- jede echte Bildszene mit ihrer exakten Szenennummer
- jede Remotion-Szene als reservierte Nummer ohne Bild
- einen konkreten endgültigen Dateinamen je benötigtem Bild
- den Hinweis, Animationslücken niemals zu schließen oder neu durchzunummerieren
- die vollständige erwartete Dateiliste für genau dieses Reel
- den finalen Google-Flow-Sammelordner `00-bildprompts/00-ALLE-BILDER-HIER-REIN/`

### Verbindlicher Ablauf pro einzelnes Bild

Für jedes benötigte Bild gilt:

1. **Generieren:** genau das Cover oder genau die aktuelle echte Bildszene mit dem zugehörigen Prompt und derselben `bildwelt-referenz.png` erzeugen. Nur ein Bild gleichzeitig.
2. **Sofort umbenennen:** unmittelbar nach der Generierung den endgültigen Namen vergeben: `Bild XX - Kurzer Szenenname.png`.
3. **Prüfen:** Motiv, echte Szenennummer, Szenenname, Dateiname, Textfreiheit und Bildwelt prüfen.
4. **Erst danach weiter:** nur wenn dieses eine Bild vollständig korrekt ist, darf das nächste benötigte Bild generiert werden.

Wenn ein Bild falsch ist, wird genau dieses Bild korrigiert oder neu generiert, erneut korrekt benannt und erneut geprüft, bevor Google Flow fortfährt.

### Sammeln erst ganz am Ende

Erst wenn Cover und **alle** benötigten Bildszenen einzeln vollständig generiert, endgültig benannt und geprüft sind, erfolgt die Abschlussprüfung:

- keine erwartete Bilddatei fehlt
- keine Bildnummer doppelt
- keine Bildnummer vertauscht
- jedes Bild gehört zur richtigen echten Szene
- Animationsszenen wurden ausgelassen
- Lücken durch Animationsszenen wurden nicht geschlossen

Erst danach legt Google Flow alle fertigen Bilder gemeinsam in:

```text
00-bildprompts/00-ALLE-BILDER-HIER-REIN/
```

Google Flow verteilt diese Bilder **nicht** auf einzelne Szenenordner. Die weitere technische Einsortierung ist nicht Teil der Google-Flow-Bildaufgabe.

Nummer, Szenenname und Dateiname gehören ausschließlich in den Dateinamen beziehungsweise die Ausgabebezeichnung. Sie dürfen niemals sichtbar in das generierte Bild geschrieben werden.

## 3. FinanzNeo Image World V3

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

## 4. Einheitliche Bildwelt

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

## 5. Kein leerer Hintergrund

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

## 6. Textfreie Bildquellen

Neue Bilder enthalten grundsätzlich keinen Text:

- keine Überschrift
- keine Untertitel
- keine Labels
- keine Zahlen
- keine Konto-Namen
- keine Logos oder Wasserzeichen

Remotion rendert sämtliche Typografie und geprüften Werte.

## 7. Bildprompt-Vertrag

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

## 8. Darstellung in Remotion

- Vordergrundbild mit `object-fit: contain`.
- Keine sichtbare unscharfe Kopie desselben Bildes im Hintergrund.
- Freie Flächen werden durch die zentrale FinanzNeo-Studiobühne gefüllt.
- Source-Crop oben höchstens `0.20`.
- Source-Crop unten höchstens `0.20`.
- Source-Crop insgesamt höchstens `0.34`.
- Zusätzliche Skalierung höchstens `1.04`.
- Nur nachweislich ruhige Umgebungsfläche darf beschnitten werden.
- Wichtige Objekte, Pfeile, Geld und erklärende Elemente dürfen nie abgeschnitten werden.

## 9. Verbindliches 9:16-Layout

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

## 10. Untertitel

- Immer genau ein vollständiger Satz sichtbar.
- Nur das aktuell gesprochene Wort ist FinanzNeo-grün.
- Übrige Wörter bleiben weiß.
- Vorheriger Satz bleibt während kurzer Pausen sichtbar.
- Keine leeren Caption-Lücken.
- Höchstens zwei fest berechnete Zeilen.
- Keine springenden Wörter und keine Größenanimation.

## 11. Satzbasierte Szenenschnitte

Szenenlängen werden aus den finalen Wort-Zeitstempeln abgeleitet.

Der Beginn einer neuen Szene entspricht dem Beginn des ersten zugehörigen Satzes. Ein starres Raster aus gleich langen Szenen ist standardmäßig verboten.

```text
word-timings → Satzanfänge → Szenenstarts → relative Animationsdauer
```

## 12. Audio

Ziel für das veröffentlichte Voiceover:

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

Der genaue Wert wird am finalen Export gemessen. Eine reine Code-Verstärkung ersetzt keine finale Audiokontrolle.

## 13. Bildsatz-QA

Vor Freigabe:

1. alle Bilder als Kontaktbogen nebeneinander prüfen
2. gleiche Kamera, Architektur, Palette, Licht und Motivgröße bestätigen
3. Satzgenauigkeit jedes Bildes prüfen
4. Bildnummer gegen die echte Szenennummer prüfen
5. Anfang, Mitte und Ende jeder Bildszene im Render prüfen
6. vollständige MP4 mit Ton ansehen

Ein Bildsatz wird neu erstellt, wenn ein einzelnes Bild sichtbar aus einer anderen Welt stammt oder dem gesprochenen Satz widerspricht.

## 14. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt die Produktionsstruktur inklusive:

- `alle-bildprompts.txt` mit verbindlichem Nummerierungsblock am Ende
- `bildwelt.txt`
- Weltmetadaten im `scene-index.json`
- vollständige V3-Promptstruktur pro Bildszene
- Bilddarstellungswerte
- Caption-, Timing- und Audioverträge

Für jedes neue Reel muss `alle-bildprompts.txt` am Ende den vollständigen **Google-Flow-Einzelbild-Block** enthalten, einschließlich der konkreten endgültigen Dateinamen für Cover und jede echte Bildszene sowie des finalen Sammelordners:

```text
00-bildprompts/00-ALLE-BILDER-HIER-REIN/
```

## 15. Automatische Prüfung

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
