# FinanzNeo

Remotion-Studio und Produktionspipeline für deutsche Finanz-Erklärvideos.

## Start

```bash
npm ci
npm run validate
npm run studio
```

## Zwei getrennte Produktionswelten

### Reels

Die bestehende Reel-Produktion behält ihre eigenen Layout-, Bildwelt-, Flow- und Motion-Regeln. Aktiver Reel-Standard:

```text
config/finanzneo-production-standard.json
docs/3-PHASEN-WORKFLOW.md
```

`docs/3-PHASEN-WORKFLOW.md` bleibt der verbindliche Einstieg für den bestehenden Reel-3-Phasen-Prozess. Der YouTube-Umbau verändert diese Reel-Regeln nicht.

### YouTube Longform

YouTube nutzt bewusst ein **eigenes Simple-Finance-System**:

```text
youtube/PRODUKTIONSSTANDARD.md
docs/YOUTUBE-LONGFORM-WORKFLOW.md
docs/YOUTUBE-MOTION-V4-SIMPLE.md
docs/FINANZNEO-VISUAL-SELECTION-RULE.md
config/finanzneo-youtube-visual-system.json
```

Grundregel für YouTube:

```text
Sprechpunkt
→ Was muss verstanden werden?
→ einfachste Visualform
→ Remotion zuerst
→ echtes Asset wenn Realität gezeigt werden soll
→ Google Flow nur bei wirklich hilfreicher Alltagsszene
```

Wichtige Texte und Zahlen werden in Remotion gerendert. Flow ist kein Default. Wenn Flow eingesetzt wird, bleibt die freigegebene premium stylized 3D Bildwelt `finanzneo-youtube-grounded-3d-black-v1` verbindlich. **Simple** bedeutet wenige klare Elemente und einfache Komposition — nicht flache 2D-Illustrationen.

`CLAUDE.md` bleibt die höchste Regelquelle für Produktionsverantwortung und Repository-Sicherheit. Reel-spezifische V9-Regeln werden nicht automatisch auf YouTube Longform übertragen.

## Zentrale Befehle

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
npm run reel:sort-images -- reels/<Woche>/<Tag>/<Reel>

npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>

npm run protect:install
npm run build
npm run smoke
npm run render
```

## Struktur

- `config/` — Maschinen-Konfiguration, Bildwelten und Locks
- `src/design-system/` — öffentlicher Importpfad für neue Produktion
- `src/production/reel-template/` — technische Reel-Vorlage
- `src/root/` — getrennte Production-, Experiment- und Showcase-Registries
- `reels/` — konkrete Reel-Projekte
- `youtube/` — eigenständige YouTube-Longform-Projekte
- `scripts/` — Scaffold, Validatoren und Render-Gates
- `docs/` — Detailregeln, Workflows und Qualitätsstandards

Die Produktionsregistry bleibt bewusst eine Freigabeliste und kann leer sein, solange kein Reel den vollständigen Produktionspfad bestanden hat.
