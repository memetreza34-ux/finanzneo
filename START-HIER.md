# FinanzNeo — Start hier

## Drei Phasen

```text
PHASE 1 — ChatGPT                  PHASE 2 — Nutzer            PHASE 3 — Executor
Recherche, Skript,                 Flow-Bilder,                Assets integrieren,
V9-Bildprompts, Header,            finales Voiceover,          versiegelte Phase-1-
Remotion-Specs UND            →    echte Wortzeiten       →    Animationen verwenden,
fertige animation.tsx                                         Preflight + Render-QA + Export
```

Einstiege:

- Phase 1: `docs/PHASE-1-BRIEFING.md`
- Bildwelt: `docs/GLOBAL-IMAGE-WORLD-LOCK.md`
- Phase 1 Animation: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- Scene-Index-Schema: `docs/SCENE-INDEX-SCHEMA.md`
- Gesamtworkflow: `docs/3-PHASEN-WORKFLOW.md`
- Phase 3 Completion: `docs/PHASE-3-COMPLETION-GATE.md`

## Layout V5 — eine Wahrheit

`src/brand/tokens.ts -> REEL_STYLE`:

```text
Header               Y = 154
Header-Stil          plain, weißer Text + semantisches Linien-Icon
Visual               Y = 320–1480
Caption              bottom = 340
Transition           3 Frames
```

Keine lokalen Reel-Abweichungen.

## Bildwelt V9

Reel-Quellbilder inklusive Cover bleiben `1:1`.

```text
finanzneo-stylized-3d-animated-black-v9
```

- nicht realistisch
- stylized 3D animated
- soft rounded, vereinfachte erkennbare Details
- premium, freundlich, leicht verspielt
- deep-black Flow-Hintergrund Pflicht
- keine feste Objektanzahl
- Klarheit/Inhalt vor Deko
- mittel-lange Prompts
- kein Produktfoto, Dashboard, App-UI, Flowchart, Microchip, Mini-Diorama oder Clutter

Marken/Logos: **erkennbar, aber stilisiert** in derselben Welt. Kein flach aufgeklebtes Real-Logo und kein Screenshot-Look.

Google Flow: exakt ein Bild → warten → sofort umbenennen → QA → nächstes Bild. Nie Batch/Queue.

## Remotion-Hintergrund — immer schwarz

Der Reel-Canvas ist technisch immer:

```text
#000000
statisch
```

Zentrale Quelle: `src/design-system/FinanceBackground.tsx`.

Verboten:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- Partikelfelder
- Aurora/Glow-Hintergründe
- bewegte Grids
- dekorative Hintergrund-Gradienten/Vignetten

Animation-Stage bleibt transparent. Bewegung gehört zum Szeneninhalt, nie zum Hintergrund.

## Phase 1 besitzt die Animation

```text
scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`animation.tsx` ist in Phase 1 produktionsreif. Phase 3 darf sie nicht ersetzen.

Pflicht:

```text
START → MECHANISMUS → ERGEBNIS → mindestens 15 Frames stabil
```

Keine feste Support-Objekt-Anzahl. Kein Dummy, Debug, `Math.sin`/`Math.cos`-QA-Wackeln oder Hintergrundbewegung als Fake-Motion.

## Phase-1-Animationsseal

```bash
npm run reel:ready -- <Reel-Pfad>
```

schreibt:

```text
05-projektdateien/phase1-animation-seal.json
```

Phase 3 muss exakt diese Quellen/Exports verwenden. Änderung oder Ersatz blockiert den Preflight.

## Phase-3-Executor

`scene-index.json -> phase3Executor`:

| Wert | Executor |
|---|---|
| `antigravity` | Antigravity |
| `claude-code` | Claude Code |

Nur der konfigurierte Executor führt Phase 3 aus.

## Phase-3-Fertigkeitsgate

Eine MP4 allein ist **kein** Fertigkeitsnachweis.

```bash
npm run reel:ready -- <Reel>
npm run reel:phase3:init -- <Reel> <Composition-ID>
# Manifest vollständig machen
npm run reel:phase3:preflight -- <Reel>
npm run reel:render -- <Reel>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel> <Final-MP4>
```

Ablauf:

```text
Candidate-MP4
→ Post-Render-QA pro Szene
→ nur PASSED wird Final-MP4
→ Export mit Hash-Gates
→ FINAL_COMPLETE
```

Render-QA prüft insbesondere:

- visueller Kern jeder Szene tatsächlich belegt
- Bildszene nicht schwarz/leer/caption-only
- Animation sichtbar + echte Veränderung
- freier Rand bleibt statisch schwarz
- keine Partikel/Aurora/Grid/Glow-Hintergründe
- Audio vorhanden
- 1080×1920 + korrekte Dauer

**Schwarzes/leeres Reel = FAIL.** Header, Caption oder Hintergrund allein zählen nicht als Szenenvisual.

## Automatische Checks

```bash
npm run validate
npm run validate:image-world
npm run validate:reel-background
npm run reel:validate -- <Reel>
npm run reel:ready -- <Reel>
npm run reel:animation:validate -- <Reel>
npm run reel:phase3:preflight -- <Reel>
```

## Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

`04-caption/`:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Keine YouTube Shorts.

## Neuer Reel

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Der Scaffolder ist jetzt **selbst nativ V9** und erzeugt keinen alten V7/V8-Zwischenstand mehr. Der atomare Wrapper setzt zusätzlich die idempotenten Contracts:

- Flow Strict-Single-Job V3
- Stylized 3D Animated Black V9
- Pure-Black Reel Background V1
- Reel-Layout V5
- Phase-1-Animationscode-Vertrag
- Phase-3-Completion-Gate

## Final

Ein Reel ist erst final, wenn:

- alle Nutzerbilder vorhanden sind
- finales Voiceover + echte Wortzeiten vorhanden sind
- jeder Animationsbeat finaler Phase-1-Code ist
- Animation-Seal unverändert ist
- jede Szene sichtbar umgesetzt ist
- Phase-3-Preflight bestanden ist
- Post-Render-QA `PASSED` ist
- komplette MP4 mit Ton geprüft ist
- `reel:export` erfolgreich ist
- `06-export/` vollständig ist

`CLAUDE.md` ist die höchste Regelquelle.
