# YouTube-Longform

Dieser Bereich ist ausschließlich für eigenständige längere FinanzNeo-Videos. Keine YouTube Shorts und keine gestreckten Reel-Kopien.

## Neues Projekt

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Optional lässt sich die Bild-/Animationsfolge vorgeben:

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel" --types image,animation,image
```

Verbindlich:

- [Produktionsstandard](PRODUKTIONSSTANDARD.md)
- [3-Phasen-Workflow](../docs/YOUTUBE-LONGFORM-WORKFLOW.md)
- `CLAUDE.md`

`youtube:ready` gibt Phase 3 nur frei, wenn Recherche, Skript, Visuals, Publishing-Paket, alle exakten 16:9-Nutzerbilder, genau ein finales Voiceover und echte Wort-Timings vollständig sind.
