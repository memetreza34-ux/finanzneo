# FinanzNeo-Reel-Produktionsstandard

## 1. Genau eine Produktionsquelle pro Szene

### Bildszene

```text
scene-XX/
├── bildprompt.txt
├── finales-bild.png
└── szene.md
```

Vor der Bildgenerierung enthält der Ordner nur `bildprompt.txt` und `szene.md`. Keine `motionprompt.txt` und keine `placeholder.svg`.

### Remotion-Szene

```text
scene-XX/
├── remotion.md
└── szene.md
```

Eine Remotion-Szene enthält weder Bildprompt noch Bilddatei.

## 2. Verbindliches vertikales Layout

```text
0–255 px       Überschrift mit passendem Icon
270–1350 px    Bild oder Remotion-Animation
ab ca. 1470 px Untertitelbereich
untere 320 px  freie Plattform-Safe-Area
```

Technische Referenz für 1080 × 1920:

- Überschrift beginnt ungefähr bei `Y = 78`.
- Visual beginnt bei `Y = 270` und endet bei `Y = 1350`.
- Untertitel stehen mindestens `320 px` über dem unteren Rand.
- Links bleiben mindestens `62 px`, rechts mindestens `150 px` frei, damit Reels-Bedienelemente nichts verdecken.
- Wichtige Objekte, Zahlen und Karten dürfen nie hinter dem Untertitel liegen.

## 3. Überschriften und Icons

- Überschrift immer oben.
- Maximal zwei kurze Zeilen.
- Erste Zeile weiß, Schwerpunktzeile grün oder bei Geldrechnungen gold.
- Neben der Schwerpunktzeile steht ein inhaltlich passendes Linien-Icon.
- Icon und Schwerpunktzeile bilden eine mittig ausgerichtete Einheit.
- Icon und Schwerpunktzeile besitzen dieselbe visuelle Höhe.
- Keine Kicker-Pille im Untertitelbereich.
- KI-Bilder enthalten grundsätzlich keine separate Überschrift oder erklärenden Text.

## 4. Untertitel und Wortverfolgung

- Zu jedem Zeitpunkt ist genau **ein vollständiger Satz** sichtbar.
- Beim nächsten Satz wird der vorherige Satz vollständig ersetzt.
- Während kurzer Sprechpausen bleibt der vorherige Satz sichtbar; keine leeren Caption-Lücken.
- Normale Wörter sind weiß, nur das aktuell gesprochene Wort ist FinanzNeo-grün.
- Die Wortmarkierung folgt Zeitstempeln des finalen Audios.
- Keine Größenanimation, keine springenden Wörter und kein Wort-für-Wort-Einblenden.
- Der Satz wird algorithmisch auf eine oder zwei ausgewogene Zeilen verteilt.
- Eine berechnete Zeile darf anschließend nicht erneut umbrechen.
- Mehr als zwei sichtbare Textzeilen sind verboten.

## 5. Einheitliche Bilddarstellung

Das eigentliche Motiv bleibt `object-fit: contain`. Uneinheitliche Bildgrößen werden nicht mehr durch extremes globales Skalieren gelöst, sondern durch kontrolliertes Entfernen von **nachweislich leerem oberen und unteren Quellraum**.

Verbindliche Regeln:

- Vordergrundbild immer `contain`.
- Unscharfe Hintergrundkopie darf `cover` verwenden.
- `scale` liegt zwischen `1.00` und `1.06`.
- `sourceCropTop` und `sourceCropBottom` dürfen jeweils höchstens `0.22` betragen.
- Die Summe beider Crops darf höchstens `0.36` betragen.
- Sobald ein Source-Crop verwendet wird, muss `cropSafe: true` gesetzt sein.
- Eingebaute Beschriftungen, Zahlen, Icons, Motivkanten und relevante Reflexionen dürfen niemals angeschnitten werden.
- Nur klar leerer Hintergrund darf entfernt werden.
- Jede Bildszene erhält eigene Crop-Werte, damit alle Hauptmotive ähnlich groß wirken.

Verbindliche Metadaten:

```json
{
  "imagePresentation": {
    "scale": 1.02,
    "sourceCropTop": 0.10,
    "sourceCropBottom": 0.16,
    "cropSafe": true
  }
}
```

## 6. Bildzuordnung

Jede Bildszene besitzt im `scene-index.json` ein `expectedVisual`. Vor jedem Render muss geprüft werden, ob das tatsächliche Bild exakt zur Aussage passt.

## 7. Verbotene Dateien und Kombinationen

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` in einem `scene-XX`-Ordner
- `bildprompt.txt` und `remotion.md` im selben Szenenordner
- Bilddateien in einer Remotion-Szene
- mehr als ein finales Bild in einer Bildszene
- `cover` für das eigentliche Vordergrundmotiv
- mehr als zwei Untertitelzeilen
- zwei vollständige Sätze gleichzeitig
- leere Caption-Lücken zwischen Sätzen
- Cropping von Beschriftungen oder relevanten Motivteilen
- `scale` über `1.06`
- Source-Crop pro Seite über `0.22` oder insgesamt über `0.36`

## 8. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt Felder für Überschrift, Icon, Schwerpunktzeile, Worttiming, erwartetes Visual und sichere Bildpräsentation.

## 9. Automatische Prüfung

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator prüft insbesondere:

- genau eine Produktionsquelle,
- keine verbotenen Dateien,
- Überschrift, Schwerpunktzeile und Icon vorhanden,
- genau ein Satz mit grünem aktivem Wort,
- keine Caption-Lücken,
- maximal zwei ausgewogene Zeilen,
- Plattform-Safe-Area von mindestens 320 px,
- rechter Sicherheitsabstand für Reels-Bedienelemente,
- Vordergrundbild `contain`,
- Scale maximal `1.06`,
- Source-Crop pro Seite maximal `0.22` und insgesamt maximal `0.36`,
- `cropSafe: true` bei jedem Crop,
- `expectedVisual` für jede Bildszene.
