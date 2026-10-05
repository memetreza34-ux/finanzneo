# FinanzNeo — Start hier

> `CLAUDE.md` ist die höchste Regelquelle für Produktionsverantwortung und Agent-Verhalten.

## Aktiver Produktionsmodus

```text
ACTIVE_PRODUCTION_MODE: youtube-longform-v4
NEW_REELS_PAUSED: true
YOUTUBE_SHORTS_FORBIDDEN: true
```

Die maschinenlesbare aktive Kombination steht in:

```text
config/finanzneo-production-standard.json
```

Für neue Produktionen gelten ausschließlich die YouTube-Longform-Quellen:

- Produktionsstandard: `youtube/PRODUKTIONSSTANDARD.md`
- Motion: `docs/YOUTUBE-MOTION-V3.md`
- Bildwelt: `config/finanzneo-image-worlds/finanzneo-youtube-animated-black-v3.txt`
- Maschinenvertrag: `scripts/lib/youtube-contract.mjs`

Bestehende Reel-Dateien und Reel-Regeln bleiben nur für Legacy-Projekte erhalten. **Keine neuen Reels und keine YouTube Shorts erstellen.**

## Neues Video

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
```

Wenn die Visualtypen bereits feststehen, mindestens zwei Motion-Visuals einplanen:

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel" --types image,animation,image,hybrid,image,animation,image
```

Verbindlicher V4-Rahmen:

- 1920 × 1080, horizontal 16:9, 30 fps
- mindestens zwei echte Motion-/Animationsvisuals pro normalem Projekt
- `LOOK FEST — INHALT FREI`: Standbilder im stilisierten 3D-Animationsfilm-Look auf tiefem Schwarz; Menschen, Hände, echte Gegenstände und Orte, wenn es passt
- Bildwelt `finanzneo-youtube-animated-black-v3`
- Charts und Diagramme frontal, gerade und sofort lesbar
- drei Thumbnail-Kandidaten A/B/C als drei parallele Einzelbild-Jobs
- nach einmaliger A/B/C-Auswahl Szenenbilder in parallelen Batches mit maximal fünf getrennten Einzelbild-Jobs
- Thumbnail oder andere Szenenbilder niemals als Style-Referenz verwenden; die geschriebene V9-Welt ist die Style-Autorität

## Drei Phasen

```text
PHASE 1 — ChatGPT
Recherche + geprüftes Skript + Dramaturgie + Visualplanung + Flow-Prompts
+ produktionsreife animation.tsx + Publishing-Paket

        ↓

PHASE 2 — Nutzer
3 Thumbnail-Kandidaten → A/B/C-Auswahl → finale Flow-Bilder
+ genau ein finales Voiceover + echte Wort-Timings

        ↓

PHASE 3 — konfigurierter Executor
versiegelte Motion integrieren + Assets/Timing binden + QA + Render + Export
```

Phase 3 darf fehlende kreative Arbeit nicht mit Platzhaltern, Dummy-Motion oder Ersatzbildern kaschieren.

## Startfreigabe vor Phase 3

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Nur ein erfolgreicher Lauf aller Gates gibt Phase 3 frei.

## Grundregel für Änderungen

Neue Regeln nicht parallel in mehreren Dokumenten neu definieren. Die autoritative Quelle ändern und andere Dokumente nur darauf verweisen lassen. Alte Reel-/Versionsdokumente sind keine Grundlage für neue Produktionen, sofern der aktive YouTube-V4-Standard sie nicht ausdrücklich referenziert.
