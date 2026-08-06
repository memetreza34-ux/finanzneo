# FinanzNeo-Reel-Produktionsstandard

## 1. Genau eine Produktionsquelle pro Szene

### Bildszene

```text
scene-XX/
├── bildprompt.txt
├── finales-bild.png
└── szene.md
```

Vor der Bildgenerierung besteht der Ordner nur aus `bildprompt.txt` und `szene.md`. Es werden keine `motionprompt.txt` und keine `placeholder.svg` im Szenenordner erzeugt.

### Remotion-Szene

```text
scene-XX/
├── remotion.md
└── szene.md
```

Eine Remotion-Szene enthält weder Bildprompt noch Bilddatei.

## 2. Verbindliches vertikales Layout

Alle produktiven Reels verwenden drei getrennte Zonen:

```text
0–280 px       Überschrift
300–1410 px    Bild oder Remotion-Animation
ab ca. 1510 px Untertitel
untere 180 px  freie Plattform-Safe-Area
```

Technische Referenz für 1080 × 1920:

- Überschrift beginnt ungefähr bei `Y = 92`.
- Der visuelle Bereich beginnt bei `Y = 300` und endet bei `Y = 1410`.
- Das optische Zentrum des Hauptmotivs liegt leicht oberhalb der Bildschirmmitte.
- Der Untertitel sitzt separat unterhalb des visuellen Bereichs.
- Wichtige Objekte, Zahlen und Karten dürfen nie hinter dem Untertitel liegen.

## 3. Überschriften

- Überschrift immer oben, niemals im Untertitelkasten.
- Maximal zwei kurze Zeilen.
- Erste Zeile weiß, zweite Schwerpunktzeile grün oder bei Geldrechnungen gold.
- Keine zusätzliche Kicker-Pille im Untertitelbereich.
- KI-Bilder enthalten standardmäßig keine eigene Überschrift und keinen erklärenden Text.

## 4. Untertitel und Wortverfolgung

- Zu jedem Zeitpunkt ist genau **ein vollständiger Satz** sichtbar.
- Beim nächsten Satz wird der vorherige Satz vollständig ersetzt.
- Alle Wörter des aktiven Satzes bleiben sichtbar.
- Normale Wörter sind weiß.
- Nur das aktuell gesprochene Wort ist im FinanzNeo-Grün hervorgehoben.
- Die grüne Hervorhebung folgt Wort-Zeitstempeln des finalen Audios.
- Keine springenden Wörter, keine Größenanimation und kein Wort-für-Wort-Einblenden.
- Zwei gesprochene Sätze werden als zwei getrennte Sätze mit eigenen Wortzeiten angelegt.
- Ein langer Satz darf auf mehrere Textzeilen umbrechen.
- Untertitel dürfen das Bild oder die Animation nicht verdecken.

Verbindliche Metadaten:

```json
{
  "subtitleMode": "sentence-with-audio-synced-active-word",
  "activeWordColor": "finance-green",
  "wordTimingFile": "04-caption/word-timings.json"
}
```

## 5. Bildbereich

- Das eigentliche Motivbild wird standardmäßig mit `object-fit: contain` vollständig gezeigt.
- Wichtige Motivteile dürfen nicht abgeschnitten werden.
- Leere Seitenflächen dürfen mit einer unscharfen, abgedunkelten Kopie desselben Bildes gefüllt werden; nur diese Hintergrundkopie darf `cover` verwenden.
- Das Vordergrundbild darf nur bei sichtbar übermäßigem Leerraum bewusst vergrößert werden.
- Die maximale bewusste Vergrößerung beträgt `1.05`.
- Zoom und Pan werden zentral im Remotion-Code gesteuert.
- Text, Beträge und Überschriften werden grundsätzlich durch Remotion gerendert.

Verbindliche Metadaten:

```json
{
  "imageFit": "contain",
  "maxIntentionalImageScale": 1.05,
  "backgroundFill": "optional-blurred-cover-copy"
}
```

## 6. Bildzuordnung

Jede Bildszene erhält im `scene-index.json` ein `expectedVisual`. Vor dem Render muss geprüft werden, ob das tatsächliche Bild genau diese Aussage zeigt. Der Ordnername allein ist keine inhaltliche Qualitätsprüfung.

## 7. Verbotene Dateien und Kombinationen

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` in einem `scene-XX`-Ordner
- `bildprompt.txt` und `remotion.md` im selben Szenenordner
- Bilddateien in einer reinen Remotion-Szene
- mehr als ein finales Bild in einer Bildszene
- `object-fit: cover` für das eigentliche Vordergrundmotiv
- zwei vollständige Sätze gleichzeitig im Untertitel

## 8. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt für jede Szene Felder für Überschrift, Schwerpunktzeile, Untertitel, erwartetes Visual sowie die verbindlichen Caption- und Bildfit-Metadaten.

## 9. Automatische Prüfung

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator prüft unter anderem:

- genau eine Produktionsquelle,
- keine verbotenen Dateien,
- Überschrift und Schwerpunktzeile vorhanden,
- Caption-Modus und Worttiming-Datei vorhanden,
- pro Zeitpunkt nur ein Satz,
- aktive Wortfarbe FinanzNeo-Grün,
- Vordergrundbild verwendet `contain`,
- maximale bewusste Bildvergrößerung höchstens `1.05`,
- Bildszenen besitzen ein erwartetes Visual,
- Remotion-Szenen enthalten keine Bilddateien.
