# FinanzNeo

Remotion-Studio und Produktionspipeline für deutsche Finanz-Erklärvideos.

## Start

```bash
npm ci
npm run validate
npm run studio
```

## Aktiver Produktionsstandard

Die aktuell zusammengehörige Kombination aus Reel-Layout, Hintergrund, Bildwelt, Flow-Modus, Animationsstandard und Produktions-Gates steht in:

```text
config/finanzneo-production-standard.json
```

`CLAUDE.md` bleibt die höchste Regelquelle für Produktionsverantwortung und Agent-Verhalten. Der schnelle Einstieg liegt in `START-HIER.md`.

## Zentrale Befehle

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
npm run reel:sort-images -- reels/<Woche>/<Tag>/<Reel>
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
npm run protect:install
npm run build
npm run smoke
npm run render
```

## Struktur

- `config/` — aktive Maschinen-Konfiguration und Locks
- `src/design-system/` — öffentlicher Importpfad für neue Produktion
- `src/production/reel-template/` — technische Reel-Vorlage
- `src/root/` — getrennte Production-, Experiment- und Showcase-Registries
- `reels/` — konkrete Reel-Projekte
- `youtube/` — eigenständige YouTube-Longform-Projekte
- `scripts/` — Scaffold, Validatoren und Render-Gates
- `docs/` — Detailregeln, Workflows und Qualitätsstandards

Verbindliche Abläufe: `docs/3-PHASEN-WORKFLOW.md` und `docs/YOUTUBE-LONGFORM-WORKFLOW.md`.

Die Produktionsregistry bleibt bewusst eine Freigabeliste und kann leer sein, solange kein Reel den vollständigen Produktionspfad bestanden hat.
