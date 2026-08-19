# Reels

Hier liegen ausschließlich die fertigen FinanzNeo-Reel-Projekte. Aktuell ist noch keines angelegt — `npm run reel:create` erzeugt das erste.

Pfad:

`reels/<Wochenordner>/<Wochentag>/<Reel-Ordner>/`

Jedes Reel hat genau diese Struktur (erzeugt von `npm run reel:create`, geprüft von `npm run reel:validate`):

```text
01-script/                        fertiger Fließtext für das Voiceover
02-audio/                         finale Audiodatei
03-szenen/
├── 00-cover/                     Cover-Prompt
├── 00-ALLE-BILDER-HIER-REIN/     alle fertigen Bilder gesammelt
├── EINZELNE-SZENEN/scene-XX/     je Szene bildprompt.txt oder remotion.md
├── alle-bildprompts.txt
├── bildwelt.txt
└── scene-index.json
04-caption/                       Social Captions + echte Wort-Timings
05-projektdateien/                Recherche, Quellen, Szenenplan, Timeline
README.md
```

## Verbindlicher Szenenvertrag

- Bildszene: `bildprompt.txt` und `szene.md`.
- Remotion-Szene: `remotion.md` und `szene.md`.
- Eine Szene darf niemals gleichzeitig `bildprompt.txt` und `remotion.md` enthalten.
- `motionprompt.txt` und `alle-motionprompts.txt` sind verboten.
- `placeholder.svg` ist im Szenenordner verboten. Fertige Bilder liegen gesammelt in `03-szenen/00-ALLE-BILDER-HIER-REIN/`, nicht in den Szenenordnern.
- Zoom, Pan und andere einfache Bewegungen von Standbildern werden zentral im Remotion-Code definiert.

Vollständige Regeln: `reels/PRODUKTIONSSTANDARD.md`

Neues Reel erzeugen:

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Reel prüfen:

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```
