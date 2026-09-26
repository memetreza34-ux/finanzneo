# FinanzNeo

Remotion-Studio und Produktionspipeline für deutsche Finanz-Erklärvideos.

## Start

```bash
npm ci
npm run validate
npm run studio
```

## Zuerst Produktionsart wählen

FinanzNeo hat zwei getrennte Welten. Regeln nie vermischen.

### Reels — 9:16

Autoritative Einstiegskette:

```text
CLAUDE.md
→ config/finanzneo-production-standard.json
→ reels/PRODUKTIONSSTANDARD.md
→ docs/3-PHASEN-WORKFLOW.md
```

Reels bleiben IMAGE oder ANIMATION. Der aktive Standard entscheidet Layout, V9-Bildwelt, Flow, Motion, QA und Export.

### YouTube Longform — 16:9

Autoritative Einstiegskette:

```text
config/finanzneo-youtube-visual-system.json
→ docs/YOUTUBE-PRODUCTION-MODES.md
→ youtube/PRODUKTIONSSTANDARD.md
→ docs/YOUTUBE-LONGFORM-WORKFLOW.md
```

YouTube besitzt zwei Produktionsmodi mit demselben Szenenlayout:

- `images-only`: fertige statische Szene mit Überschrift + Icon + eingebettetem Flow-Bild; keine Animation.
- `hybrid`: dasselbe Layout; zusätzlich Remotion, Charts, Daten, Animation und echte Assets erlaubt.

In beiden Modi gilt: **Flow-Bilder niemals fullscreen.** Überschrift und Icon liegen außerhalb des Flow-Bildes. Die sichtbare deep-black FinanzNeo-Grundfläche bleibt erhalten.

Im Hybrid-Modus gilt für abstrakte Zahlen, Vergleiche, Charts, Timelines und Prozesse weiterhin Remotion zuerst. Im `images-only`-Modus ist Flow die Hauptquelle, aber jedes Bild erklärt nur einen dominanten Gedanken.

## Daten für Remotion

Chart- und Statistikdaten werden **vor dem Rendern** geholt, geprüft und lokal unter `public/data/` gespeichert. Der Render selbst bleibt netzwerkfrei.

```bash
npm run data:fetch
npm run data:validate
```

Quellen- und Provenienzregeln: `docs/DATA-PIPELINE.md` und `config/finanzneo-data-sources.json`.

## Zentrale Befehle

```bash
# Reels
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>

# YouTube
npm run youtube:create:mode -- --mode images-only --target youtube/<Projekt> --title "Titel" --visual-count 20
npm run youtube:create:mode -- --mode hybrid --target youtube/<Projekt> --title "Titel" --types image,animation,data
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>

# Repo
npm run validate
npm run build
npm run smoke
```

## Struktur

- `config/` — Maschinen-Konfiguration, aktive Standards, Datenquellen und Locks
- `docs/` — Workflows und Qualitätsstandards; nicht referenzierte alte Versionsdokumente sind nicht autoritativ
- `src/design-system/` — öffentlicher Importpfad für neue Produktion
- `src/production/` — produktive technische Vorlagen
- `src/root/` — getrennte Production-, Experiment- und Showcase-Registries
- `src/bausteine/` — wiederverwendbare Remotion-Bausteine
- `reels/` — konkrete Reel-Projekte
- `youtube/` — eigenständige YouTube-Longform-Projekte
- `public/data/` — lokale Daten-Snapshots für reproduzierbare Charts
- `scripts/` — Scaffold, Daten-Fetcher, Validatoren und Render-Gates

Die Produktionsregistry ist bewusst eine Freigabeliste und darf leer bleiben, bis eine Produktion alle Gates bestanden hat. Repository-Orientierung: `docs/REPOSITORY-ARCHITECTURE.md`.
