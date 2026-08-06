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
- Keine zusätzliche Kicker-Pille wie „Das Problem“, „Konto 1“ oder „Der Payoff“ im Untertitelbereich.
- KI-Bilder enthalten standardmäßig keine eigene Überschrift und keinen erklärenden Text.

## 4. Untertitel

- Zu jedem Zeitpunkt ist höchstens **ein vollständiger Satz** sichtbar.
- Zwei gesprochene Sätze werden als zwei getrennte Zeit-Cues angelegt.
- Ein langer Satz darf auf mehrere Textzeilen umbrechen, bleibt aber ein einzelner Satz.
- Untertitel erscheinen und verschwinden kurz, ohne sich zeitlich zu überlappen.
- Untertitel dürfen das Bild oder die Animation nicht verdecken.
- Wort-für-Wort-Captions können später ergänzt werden, müssen aber denselben Satzvertrag einhalten.

## 5. Bildbereich

- Bilder werden in einem begrenzten visuellen Bereich gerendert, nicht unkontrolliert über den gesamten Bildschirm.
- Bei vertikalen 9:16-Bildern darf oben und unten beschnitten werden, damit das Hauptmotiv größer und oberhalb der Mitte erscheint.
- Zoom und Pan werden zentral im Remotion-Code gesteuert.
- Text, Beträge und Überschriften werden grundsätzlich durch Remotion gerendert.

## 6. Bildzuordnung

Jede Bildszene erhält im `scene-index.json` ein `expectedVisual`. Vor dem Render muss geprüft werden, ob das tatsächliche Bild genau diese Aussage zeigt. Der Ordnername allein ist keine inhaltliche Qualitätsprüfung.

## 7. Verbotene Dateien und Kombinationen

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` in einem `scene-XX`-Ordner
- `bildprompt.txt` und `remotion.md` im selben Szenenordner
- Bilddateien in einer reinen Remotion-Szene
- mehr als ein finales Bild in einer Bildszene

## 8. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt für jede Szene Felder für Überschrift, Schwerpunktzeile, Untertitel-Cues und erwartetes Visual.

## 9. Automatische Prüfung

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator prüft unter anderem:

- genau eine Produktionsquelle,
- keine verbotenen Dateien,
- Überschrift und Schwerpunktzeile vorhanden,
- Untertitel-Cues überschneiden sich nicht,
- pro Cue höchstens ein Satz,
- Bildszenen besitzen ein erwartetes Visual,
- Remotion-Szenen enthalten keine Bilddateien.
