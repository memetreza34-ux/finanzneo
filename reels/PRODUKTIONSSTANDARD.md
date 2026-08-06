# FinanzNeo-Reel-Produktionsstandard

## Grundsatz: genau eine Produktionsquelle pro Szene

Jede Szene besitzt exakt eine fachliche Quelle für ihre visuelle Umsetzung.

### Bildszene

```text
scene-XX/
├── bildprompt.txt
├── finales-bild.png   ← erst nach der Generierung
└── szene.md
```

Vor der Bildgenerierung enthält der Ordner nur `bildprompt.txt` und `szene.md`. Es wird kein Platzhalterbild angelegt.

`bildprompt.txt` beschreibt das zu erzeugende Bild. Die Bewegung des fertigen Standbilds wird nicht in einer zweiten Promptdatei beschrieben. Zoom, Pan, Fokusfahrt und Ein-/Ausblendung gehören in eine zentrale Remotion-Komponente.

### Remotion-Szene

```text
scene-XX/
├── remotion.md
└── szene.md
```

`remotion.md` beschreibt Startzustand, sichtbare Handlung, Endzustand, Ablaufphasen und die zuständige React-/Remotion-Komponente. Ein zusätzliches `bildprompt.txt` ist in dieser Szene verboten.

## Verbotene Dateien und Kombinationen

- `motionprompt.txt`
- `alle-motionprompts.txt`
- `placeholder.svg` in einem Szenenordner
- `bildprompt.txt` und `remotion.md` im selben Szenenordner
- Bilddateien in einer reinen Remotion-Szene

Technische Render-Fallbacks dürfen ausschließlich zentral unter `public/` oder direkt im Remotion-Code liegen. Sie gehören niemals in den redaktionellen `scene-XX`-Ordner.

## Sammeldatei

`03-szenen/alle-bildprompts.txt` enthält zuerst den Cover-Prompt und danach ausschließlich die Prompts der Bildszenen in chronologischer Reihenfolge. Animationsszenen werden dort nicht aufgeführt.

## Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Standardmäßig entstehen zehn Szenen mit sechs Bild- und vier Remotion-Szenen. Eine andere Reihenfolge kann explizit gesetzt werden:

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel" \
  --types image,image,animation,image,animation,image
```

Der Scaffolder erzeugt weder Motionprompt- noch Platzhalterdateien.

## Automatische Prüfung

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator schlägt unter anderem fehl bei:

- fehlender oder doppelter Produktionsquelle,
- Motionprompt-Dateien,
- Platzhalterbildern in Szenenordnern,
- falschem Szenentyp im Index,
- mehreren finalen Bildern in einem Bildordner,
- Bilddateien in Remotion-Szenen,
- falschem `planFile` im `scene-index.json`.

Fehlende finale Bilder werden während der Planung nur als Hinweis gemeldet. Vor dem finalen Render müssen alle benötigten Bilddateien vorhanden sein.
