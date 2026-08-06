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

Alle produktiven Reels verwenden vier klar getrennte Zonen:

```text
0–250 px       Überschrift mit passendem Icon
270–1310 px    Bild oder Remotion-Animation
ca. 1450 px    Untertitelbereich
untere 270 px  freie Plattform-Safe-Area
```

Technische Referenz für 1080 × 1920:

- Überschrift beginnt ungefähr bei `Y = 74`.
- Der visuelle Bereich beginnt bei `Y = 270` und endet bei `Y = 1310`.
- Das Hauptmotiv liegt leicht oberhalb der Bildschirmmitte.
- Der Untertitel sitzt deutlich oberhalb der unteren Reels-Bedienelemente.
- Wichtige Objekte, Zahlen und Karten dürfen nie hinter dem Untertitel liegen.

## 3. Überschriften und Icons

- Überschrift immer oben, niemals im Untertitelkasten.
- Maximal zwei kurze Zeilen.
- Erste Zeile weiß, zweite Schwerpunktzeile grün oder bei Geldrechnungen gold.
- Neben der Schwerpunktzeile steht ein zur Szene passendes Linien-Icon.
- Icon und Schwerpunktzeile bilden eine mittig ausgerichtete Einheit.
- Das Icon hat ungefähr dieselbe visuelle Höhe wie die Schwerpunktzeile.
- Keine zusätzliche Kicker-Pille im Untertitelbereich.
- KI-Bilder enthalten standardmäßig keine eigene Überschrift und keinen erklärenden Text.

## 4. Untertitel und Wortverfolgung

- Zu jedem Zeitpunkt ist genau **ein vollständiger Satz** sichtbar.
- Beim nächsten Satz wird der vorherige Satz vollständig ersetzt.
- Zwischen zwei Sätzen bleibt der vorherige Satz während der kurzen Sprechpause sichtbar; es entstehen keine leeren Caption-Lücken.
- Alle Wörter des aktiven Satzes bleiben sichtbar.
- Normale Wörter sind weiß.
- Nur das aktuell gesprochene Wort ist im FinanzNeo-Grün hervorgehoben.
- Die grüne Hervorhebung folgt Wort-Zeitstempeln des finalen Audios.
- Keine springenden Wörter, keine Größenanimation und kein Wort-für-Wort-Einblenden.
- Der Untertitel darf höchstens zwei Textzeilen beanspruchen; bei langen Sätzen wird die Schrift kontrolliert verkleinert.
- Untertitel dürfen das Bild oder die Animation nicht verdecken.

## 5. Einheitliche Bilddarstellung

- Das eigentliche Motivbild wird standardmäßig mit `object-fit: contain` vollständig gezeigt.
- Leere Seitenflächen dürfen mit einer unscharfen, abgedunkelten Kopie desselben Bildes gefüllt werden; nur diese Hintergrundkopie darf `cover` verwenden.
- Das Vordergrundmotiv darf bei sichtbar übermäßigem Leerraum vergrößert werden.
- Vergrößerungen über `1.05` sind nur erlaubt, wenn `cropSafe: true` gesetzt ist.
- Die maximale bewusste Vergrößerung beträgt `1.18`.
- Eine Vergrößerung ist verboten, sobald dadurch eine eingebaute Beschriftung, Zahl, ein Icon oder ein relevanter Motivteil abgeschnitten würde.
- Jede Bildszene erhält eigene Werte für `scale` und `positionY`, damit die Motive trotz unterschiedlicher Quelldateien ähnlich groß und ähnlich hoch wirken.
- Zoom und Pan werden zentral im Remotion-Code gesteuert.

Verbindliche Metadaten einer Bildszene:

```json
{
  "imagePresentation": {
    "scale": 1.0,
    "positionY": 46,
    "cropSafe": false
  }
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
- leere Untertitelphasen zwischen zwei gesprochenen Sätzen
- Cropping von eingebetteten Beschriftungen oder relevanten Motivteilen

## 8. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt für jede Szene Felder für Überschrift, passendes Icon, Schwerpunktzeile, Untertitel, erwartetes Visual und Bilddarstellung.

## 9. Automatische Prüfung

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator prüft unter anderem:

- genau eine Produktionsquelle,
- keine verbotenen Dateien,
- Überschrift, Schwerpunktzeile und Icon vorhanden,
- Caption-Modus und Worttiming-Datei vorhanden,
- pro Zeitpunkt nur ein Satz,
- keine leeren Caption-Lücken,
- aktive Wortfarbe FinanzNeo-Grün,
- Untertitel-Safe-Area mindestens 270 px,
- Vordergrundbild verwendet `contain`,
- Bildvergrößerung höchstens `1.18`,
- bei Scale über `1.05` muss `cropSafe: true` gesetzt sein,
- Bildszenen besitzen ein erwartetes Visual,
- Remotion-Szenen enthalten keine Bilddateien.
