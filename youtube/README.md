# YouTube-Longform

Dieser Bereich ist ausschließlich für eigenständige längere FinanzNeo-Videos. Keine YouTube Shorts und keine gestreckten Reel-Kopien.

## Ordnerstruktur

```text
youtube/
└── 2026-09-14_bis_2026-09-20/     Woche, Montag bis Sonntag
    └── notgroschen/                Thema
        ├── 01-script/              Script und Voiceover
        ├── 02-bilder/              Flow-Prompts, ZIP-Ablage, fertige Bilder
        ├── 03-export/              fertiges Video und komplettes Upload-Paket
        └── 04-projekt/             Recherche, Pläne, Technik
```

Im Alltag brauchst du nur drei Ordner:

| Ordner | was du hier tust |
|---|---|
| `01-script/` | Voiceover-Datei ablegen |
| `02-bilder/` | `alle-bildprompts.txt` an Google Flow geben, Flow-ZIP nach `ZIP-HIER-REIN/` |
| `03-export/` | fertiges Video, Titel, Beschreibung, Kapitel, Hashtags, Social-Texte |

`04-projekt/` hält Recherche, Visual-Index und Animationscode. Für Phase 2 nicht nötig.

## Bilder aus Google Flow importieren

ZIP nach `02-bilder/ZIP-HIER-REIN/` legen, dann:

```bash
npm run youtube:images:import -- youtube/<Woche>/<Thema>
```

Entpackt, prüft jeden Dateinamen gegen `04-projekt/visual-index.json` und meldet fehlende und falsch benannte Bilder gesammelt.

## Neues Projekt

```bash
npm run youtube:create -- --target youtube/<Woche>/<Thema> --title "Titel"
```

Ohne `--types` wird bewusst **keine feste Visualzahl** vorgegeben. Phase 1 plant zuerst Skript und Visual Beats. Wenn die Visualtypen bereits feststehen, können sie beim Scaffold übergeben werden:

```bash
npm run youtube:create -- --target youtube/<Woche>/<Thema> --title "Titel" --types image,animation,data,image
```

Erlaubt:

- `image`
- `animation`
- `data`

Für Motion gilt V3: erst `viewerChange`, dann die beste Technik. Es gibt keine feste Animationsbibliothek und keine Whitelist für Composition Families.

Danach:

```bash
npm run youtube:validate -- youtube/<Woche>/<Thema>
npm run youtube:animation:validate -- youtube/<Woche>/<Thema>
npm run youtube:phase1:seal -- youtube/<Woche>/<Thema>
npm run youtube:ready -- youtube/<Woche>/<Thema>
```

Verbindlich:

- [Produktionsstandard](PRODUKTIONSSTANDARD.md)
- [YouTube Motion V3](../docs/YOUTUBE-MOTION-V3.md)
- [3-Phasen-Workflow](../docs/YOUTUBE-LONGFORM-WORKFLOW.md)
- `CLAUDE.md`

`youtube:ready` gibt Phase 3 nur frei, wenn Recherche, Skript, Visuals, produktionsreife und Motion-V3-versiegelte Quellen, Publishing-Paket, alle exakten 16:9-Nutzerbilder, genau ein finales Voiceover und echte Wort-Timings vollständig sind.
