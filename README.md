# FinanzNeo

Remotion-Studio und Produktionspipeline für deutsche Finanz-Erklärvideos.

## Aktiver Produktionsmodus

**YouTube Longform V4** ist der aktive Produktionsweg für neue FinanzNeo-Videos.

```text
ACTIVE_PRODUCTION_MODE: youtube-longform-v4
NEW_REELS_PAUSED: true
YOUTUBE_SHORTS_FORBIDDEN: true
```

Die maschinenlesbare aktive Kombination steht in:

```text
config/finanzneo-production-standard.json
```

`CLAUDE.md` bleibt die höchste Regelquelle für Produktionsverantwortung und Agent-Verhalten. Der schnelle Einstieg liegt in `START-HIER.md`. Der verbindliche YouTube-Standard liegt in `youtube/PRODUKTIONSSTANDARD.md`.

## Start

```bash
npm ci
npm run validate
npm run studio
```

## Neues YouTube-Video

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
```

Mit vorgeplanten Visualtypen:

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel" --types image,animation,image,hybrid,image,animation,image
```

Normale Projekte brauchen mindestens zwei echte Motion-/Animationsvisuals.

## Zentrale YouTube-Befehle

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
npm run build
npm run smoke
npm run studio
```

## V4-Kern

- 1920 × 1080, 16:9, 30 fps
- `LOOK FEST — INHALT FREI`: Standbilder im stilisierten 3D-Animationsfilm-Look auf tiefem Schwarz; Menschen, Hände, echte Gegenstände und Orte, wenn es passt
- Bildwelt `finanzneo-youtube-animated-black-v3`
- mindestens zwei Motion-/Animationsvisuals
- drei Thumbnail-Kandidaten parallel, danach einmalige A/B/C-Auswahl
- Szenenbilder anschließend in parallelen Batches mit maximal fünf getrennten Einzelbild-Jobs
- Charts/Diagramme frontal und datenlesbar
- die geschriebene V9-Welt ist die Style-Autorität; Thumbnail/Bilder sind keine Style-Referenzen

## Struktur

- `youtube/` — **aktive neue YouTube-Longform-Produktionen**
- `config/` — aktive Maschinen-Konfiguration und Style-/Flow-Locks
- `src/design-system/` — öffentlicher Importpfad für produktive Visuals
- `src/root/` — getrennte Production-, Experiment- und Showcase-Registries
- `scripts/` — Scaffold, Validatoren, Seals, QA- und Render-Gates
- `docs/` — Detailregeln, Motion- und Qualitätsstandards
- `reels/` — Legacy-Reel-Projekte; für neue Produktion pausiert
- `src/production/reel-template/` — Legacy-/Kompatibilitätsweg für bestehende Reels

## Legacy-Reels

Bestehende Reel-Dateien, Tests und Tooling bleiben für Rückwärtskompatibilität erhalten. Sie sind **nicht** der aktive Produktionsweg für neue Videos. Keine neuen Reels und keine YouTube Shorts erstellen, solange `CLAUDE.md` bzw. der aktive Produktionsstandard dies nicht ausdrücklich wieder freigeben.

Für bestehende Legacy-Reel-Projekte bleibt `docs/3-PHASEN-WORKFLOW.md` als Kompatibilitätsquelle erhalten. Die **Produktionsregistry** für Legacy-Reels bleibt weiterhin eine Freigabeliste für bereits vollständig validierte Reel-Produktionen; daraus entsteht keine Freigabe für neue Reels.
