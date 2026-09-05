# YouTube-Longform

Dieser Bereich ist ausschließlich für eigenständige längere FinanzNeo-Videos. Keine YouTube Shorts und keine gestreckten Reel-Kopien.

## Neues Projekt

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
```

Ohne `--types` wird bewusst **keine feste Visualzahl** vorgegeben. Phase 1 plant zuerst Skript und Visual Beats. Wenn die Visualtypen bereits feststehen, können sie beim Scaffold übergeben werden:

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel" --types image,hybrid,animation,data,image
```

Erlaubt:

- `image`
- `animation`
- `hybrid`
- `data`

Danach:

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Verbindlich:

- [Produktionsstandard](PRODUKTIONSSTANDARD.md)
- [YouTube Motion V2](../docs/YOUTUBE-MOTION-V2.md)
- [3-Phasen-Workflow](../docs/YOUTUBE-LONGFORM-WORKFLOW.md)
- `CLAUDE.md`

`youtube:ready` gibt Phase 3 nur frei, wenn Recherche, Skript, Visuals, produktionsreife und versiegelte Motion, Publishing-Paket, alle exakten 16:9-Nutzerbilder, genau ein finales Voiceover und echte Wort-Timings vollständig sind.
