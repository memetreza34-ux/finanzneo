# FinanzNeo — Start hier

> `CLAUDE.md` ist die höchste Regelquelle für Produktionsverantwortung und Agent-Verhalten.

## 1. Zuerst Format wählen

### Reel

```text
CLAUDE.md
→ config/finanzneo-production-standard.json
→ reels/PRODUKTIONSSTANDARD.md
→ docs/3-PHASEN-WORKFLOW.md
```

Wichtige autoritative Reel-Quellen:

- Layout/Safe-Zones: `src/brand/tokens.ts -> REEL_STYLE`
- Hintergrund: `src/design-system/FinanceBackground.tsx`
- Bildwelt/Flow: `config/finanzneo-image-world-lock.json`
- Animation: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- Phase 3: `docs/PHASE-3-COMPLETION-GATE.md`

### YouTube Longform

```text
config/finanzneo-youtube-visual-system.json
→ docs/YOUTUBE-PRODUCTION-MODES.md
→ youtube/PRODUKTIONSSTANDARD.md
→ docs/YOUTUBE-LONGFORM-WORKFLOW.md
```

Danach Modus wählen:

- `images-only` = Überschrift + Icon + eingebettetes statisches Flow-Bild, **keine Animation**.
- `hybrid` = dasselbe Szenenlayout + Remotion/Animation/Daten/echte Assets.

Für beide Modi gilt: **Flow-Bild niemals fullscreen.**

## 2. Keine Versionsmischung

Versionsnummern nicht aus alten Dokumenten zusammensuchen. Dateien mit Namen wie `V2`, `V3`, `FUTURE-*` oder frühere Motion-/Image-Standards sind nur dann Grundlage einer neuen Produktion, wenn eine aktuelle autoritative Quelle ausdrücklich darauf verweist.

Bei Widerspruch gilt:

```text
CLAUDE.md
→ aktiver Maschinen-Standard in config/
→ aktueller PRODUKTIONSSTANDARD des Formats
→ aktueller Workflow
→ übrige Dokumentation
```

## 3. Reels — drei Phasen

```text
PHASE 1 — ChatGPT
Recherche + Skript + Bildprompts + produktionsreife animation.tsx

PHASE 2 — Nutzer
Flow-Bilder + finales Voiceover + echte Wort-Timings

PHASE 3 — konfigurierter Executor
Assets integrieren + Animationen binden + Preflight + Render + QA + Export
```

`scene-01` ist das Cover. Es gibt keinen separaten `Bild 00`-Job.

Neue Future-V3-Reels: Bildbeat ideal ca. 1,8–3,0 s; ab ca. 3,6 s zusätzlichen Visual Beat prüfen; ohne neue sichtbare Information hart max. 4,0 s.

## 4. Daten / Charts

Remote-Daten nie während des finalen Remotion-Renders laden.

```text
externe Quelle
→ scripts/fetch-data.mjs
→ lokaler Snapshot in public/data/
→ Validierung
→ Remotion
```

Details: `docs/DATA-PIPELINE.md`.

## 5. Zentrale Befehle

```bash
# Reel
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>

# YouTube
npm run youtube:create:mode -- --mode images-only --target youtube/<Projekt> --title "Titel" --visual-count 20
npm run youtube:create:mode -- --mode hybrid --target youtube/<Projekt> --title "Titel" --types image,animation,data
npm run youtube:validate -- youtube/<Projekt>

# Daten
npm run data:fetch
npm run data:validate

# Gesamt
npm run validate
npm run build
npm run smoke
```

## 6. Grundregel für Änderungen

Eine Regel nur an ihrer autoritativen Quelle ändern. Andere Dokumente sollen möglichst nur darauf verweisen. Keine zweite parallele Wahrheit anlegen.

Architekturübersicht: `docs/REPOSITORY-ARCHITECTURE.md`.
