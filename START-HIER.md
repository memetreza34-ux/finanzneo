# FinanzNeo — Start hier

> `CLAUDE.md` ist die höchste Regelquelle.

## Drei Phasen

```text
PHASE 1 — ChatGPT
Recherche + Skript + V9-Bildprompts + Header/Icons + Captions
+ produktionsreife animation.tsx für jede Animationsszene

        ↓

PHASE 2 — Nutzer
Flow-Bilder + genau ein finales Voiceover + echte Wort-Timings

        ↓

PHASE 3 — konfigurierter Executor
Assets integrieren + versiegelte Phase-1-Animationen binden
+ Preflight + Candidate-Render + Post-Render-QA + Export
```

Einstiege:

- Phase 1: `docs/PHASE-1-BRIEFING.md`
- Cover/Hook: `docs/FUTURE-COVER-HOOK-V3.md`
- Bildwelt: `docs/GLOBAL-IMAGE-WORLD-LOCK.md`
- Animation: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- Scene Index: `docs/SCENE-INDEX-SCHEMA.md`
- Gesamtworkflow: `docs/3-PHASEN-WORKFLOW.md`
- Phase 3: `docs/PHASE-3-COMPLETION-GATE.md`

## Cover Hook V3

`scene-01` ist bei neuen Reels **Cover + erster echter Content-Hook**. Frame 0 wird als Cover exportiert, aber die Szene selbst läuft normal weiter. Das Voiceover beginnt mit dem ersten gesprochenen Wort bereits in scene-01. Kein separater 0,1-s-/3-Frame-Cover-Clip, kein Bild 00 und keine neutrale Einleitung.

```text
FUTURE_COVER_HOOK: finanzneo-cover-hook-v3
```

## Finales Layout

`src/brand/tokens.ts -> REEL_STYLE` ist die einzige Wahrheit:

```text
Header               Y = 154
Header Text          56 px, Minimum 50 px
Header Icon          34 px
Header Zeilen        max. 2
Visual               Y = 320–1400
Caption              bottom = 340
Caption Font         50 px, Minimum 40 px
Transition           3 Frames
```

Animationen werden technisch auf **Y320–1400** geclippt. Sie können nicht sichtbar in Header oder Caption-Zone hineinlaufen.

Header: reines Weiß, normale Schreibweise, passendes Linien-Icon, keine Capsule/Chip/Pill und kein erzwungenes ALL CAPS.

## Bildwelt V9

```text
finanzneo-stylized-3d-animated-black-v9
```

- Quellbilder inklusive Cover: 1:1
- klar nicht realistisch
- stylized 3D animated
- soft rounded, vereinfachte erkennbare Details
- premium, freundlich, leicht verspielt
- deep-black Flow-Hintergrund Pflicht
- keine feste Objektanzahl
- Klarheit/Inhalt vor Deko
- mittel-lange Prompts
- kein Produktfoto, Dashboard, App-UI, Flowchart, Microchip, Mini-Diorama oder Clutter

Marken/Logos: **erkennbar, aber stilisiert**. Kein Flat-Paste-Logo und kein Screenshot-Look.

## Google Flow

```text
GENAU EIN Bild
→ intern warten
→ sofort exakt umbenennen
→ V9-QA
→ erst nach PASS nächstes Bild
```

Strict-Single-Job V3: nie Batch, parallel, Queue oder Nutzer-„weiter“.

## Remotion-Hintergrund

Produktive Reels:

```text
#000000
statisch
```

Keine Partikel, Aurora, Grid, Glow-Felder, Vignette, Hintergrund-Gradienten oder Background-Motion. `PremiumPhysicalStage` bleibt transparent.

## Animationen

Jede Animationsszene besitzt in Phase 1:

```text
scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

Pflicht:

```text
START → SICHTBARER MECHANISMUS → ERGEBNIS → mindestens 15 Frames stabil
```

- mindestens ein echtes sichtbares Hauptobjekt
- **keine feste Support-Objekt-Anzahl**
- Inhalt muss visuell erklärt werden
- kein Dummy/Debug/Wackeln
- kein `Math.sin`/`Math.cos`-QA-Hack
- keine Hintergrundbewegung als Fake-Motion

## Phase 3

`scene-index.json -> phase3Executor` bestimmt Antigravity oder Claude Code.

```bash
npm run reel:ready -- <Reel>
npm run reel:phase3:init -- <Reel> <Composition-ID>
npm run reel:phase3:preflight -- <Reel>
npm run reel:render -- <Reel>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel> <Final-MP4>
```

Eine MP4 allein ist **kein** Fertigkeitsnachweis.

Post-Render-QA prüft insbesondere:

- echter visueller Kern in jeder Szene
- Bildszene nicht schwarz/leer/caption-only
- Animation sichtbar und inhaltlich bewegt
- freier Rand bleibt statisch schwarz
- keine Partikel/Aurora/Grid/Glow-Hintergründe
- Audio, 1080×1920 und Timeline korrekt

**Schwarzes/leeres Reel = FAIL.** Header, Caption oder Hintergrund allein zählen nicht als Szenenvisual.

## Neuer Reel

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Der Ersteller setzt automatisch:

- Flow Strict-Single-Job V3
- Stylized 3D Animated Black V9
- Pure-Black Background V1
- finales Reel-Layout V5 mit Y320–1400 Safe-Zone
- Phase-1-Animationscode-Vertrag
- Phase-3-Completion-Gate

## Final

Ein Reel ist erst final, wenn Assets vollständig sind, `reel:ready` bestanden ist, Preflight bestanden ist, Candidate-Render die Post-Render-QA besteht und `reel:export` erfolgreich war.
