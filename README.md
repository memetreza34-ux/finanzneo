# FinanzNeo

Remotion-Studio und Produktionspipeline für deutsche Finanz-Erklärvideos.

## Start

```bash
npm ci
npm run validate
npm run studio
```

## Zentrale Befehle

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
npm run reel:sort-images -- reels/<Woche>/<Tag>/<Reel>
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
npm run build
npm run smoke
npm run render
```

## Struktur

- `src/design-system/` — freigegebene Design-Bausteine
- `src/production/reel-template/` — technische Reel-Vorlage
- `src/root/` — getrennte Production-, Experiment- und Showcase-Registries
- `reels/` — künftige konkrete Reel-Projekte
- `youtube/` — eigenständige YouTube-Longform-Projekte, keine Shorts
- `scripts/` — Scaffold, Validatoren und Render-Gates
- `docs/` — Bildwelt, Publishing und Qualitätsregeln

Verbindliche Abläufe: [Reel in drei Phasen](docs/3-PHASEN-WORKFLOW.md) und [YouTube-Longform in drei Phasen](docs/YOUTUBE-LONGFORM-WORKFLOW.md).

Die Produktionsregistry ist nach der Bereinigung bewusst leer. Verbindliche Projektregeln stehen in [`CLAUDE.md`](CLAUDE.md).
