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
npm run build
npm run smoke
npm run render
```

## Struktur

- `src/design-system/` — freigegebene Design-Bausteine
- `src/production/reel-template/` — technische Reel-Vorlage
- `src/root/` — getrennte Production-, Experiment- und Showcase-Registries
- `reels/` — künftige konkrete Reel-Projekte
- `scripts/` — Scaffold, Validatoren und Render-Gates
- `docs/` — Bildwelt, Publishing und Qualitätsregeln

Die Produktionsregistry ist nach der Bereinigung bewusst leer. Verbindliche Projektregeln stehen in [`CLAUDE.md`](CLAUDE.md).
