# FinanzNeo — Start hier

## Drei Phasen

```text
PHASE 1 — ChatGPT                  PHASE 2 — Nutzer            PHASE 3 — Executor
Recherche, Skript,                 Flow-Bilder,                Assets integrieren,
Bildprompts, Header,               finales Voiceover,          versiegelte Phase-1-
Remotion-Specs UND            →    echte Wortzeiten       →    Animationen verwenden,
fertige animation.tsx                                         Render-QA + Export
```

Einstiege:

- Phase 1: `docs/PHASE-1-BRIEFING.md`
- Bildwelt: `docs/GLOBAL-IMAGE-WORLD-LOCK.md`
- Phase 1 Animation: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- Scene-Index-Schema: `docs/SCENE-INDEX-SCHEMA.md`
- Gesamtworkflow: `docs/3-PHASEN-WORKFLOW.md`
- Phase 3 Completion: `docs/PHASE-3-COMPLETION-GATE.md`

## Die eine Layout-Wahrheit

`src/brand/tokens.ts -> REEL_STYLE`:

```text
Header               Y = 154
Header-Stil          plain, weißer Text + semantisches Linien-Icon
Visual               Y = 320–1480
Caption              bottom = 340
Transition           3 Frames
```

Damit sitzen Bilder und Animationen höher, der Header etwas tiefer und näher am Visual, die Untertitel höher; oben und unten bleibt mehr ruhige Luft.

### Header V5

- natürliche Schreibweise / Sentence Case
- kein automatisches ALL CAPS
- keine Capsule
- kein Chip/Pill/Panel
- Text neutral weiß
- Icon trägt semantische Farbe

## Phase 1 besitzt die Animation

Eine Animationsszene besteht aus:

```text
scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`animation.tsx` ist bereits in Phase 1 produktionsreif. Phase 3 darf sie nicht durch eigenen Code ersetzen.

Pflicht:

```text
START → MECHANISMUS → ERGEBNIS → mindestens 15 Frames stabil
```

Verboten:

- wackelnde Rechtecke
- Debug-/Testflächen
- Dummy-/Placeholder-Komponenten
- `Math.sin`/`Math.cos` als künstliches Dauerwackeln für Frame-Diff
- generische Bewegung nur, um QA zu bestehen

## Phase-1-Animationsseal

Nach erfolgreichem:

```bash
npm run reel:ready -- <Reel-Pfad>
```

schreibt das Repo:

```text
05-projektdateien/phase1-animation-seal.json
```

Darin stehen SHA-256-Hashes aller kanonischen `animation.tsx`-Dateien. Phase 3 muss direkt diese Dateien verwenden. Änderung oder Ersatz blockiert den Preflight.

## Phase-3-Executor

`scene-index.json -> phase3Executor`:

| Wert | Übergabe |
|---|---|
| `antigravity` | `MASTER-PROMPTS.md` |
| `claude-code` | `05-projektdateien/CLAUDE-CODE-AUFTRAG.md` |

## Phase-3-Fertigkeitsgate

Eine MP4 allein ist **kein** Fertigkeitsnachweis.

```bash
npm run reel:ready -- <Reel>
npm run reel:phase3:init -- <Reel> <Composition-ID>
# Manifest vervollständigen
npm run reel:phase3:preflight -- <Reel>
npm run reel:render -- <Manifest>
npm run reel:export -- <Reel> <Final-MP4>
```

Produktiver Render:

```text
Candidate-MP4
→ Post-Render-QA pro Szene
→ nur PASSED wird Final-MP4
→ Export mit Hash-Gates
→ FINAL_COMPLETE
```

Caption-only-/Header-only-Szenen zählen nicht als fertige Visuals.

## Automatische Checks

```bash
npm run validate
npm run reel:validate -- <Reel>
npm run reel:ready -- <Reel>
npm run reel:animation:validate -- <Reel>
npm run reel:phase3:preflight -- <Reel>
npm run reel:phase3:qa -- <Reel> <Video>
```

`reel:validate` blockiert unter anderem:

- falsches V5-Layout
- Capsule-/falsche Header-Metadaten
- fehlende Animationsquellen
- Platzhalter im Animationscode
- Wackel-/Debug-Hacks
- fehlende Bildwelt-Locks
- Bildbeats über 6 Sekunden
- unvollständige Publishing-Dateien

## Bildwelt

Reel-Quellbilder inklusive Cover bleiben `1:1`.

Verbindlich ist:

`finanzneo-stylized-3d-animated-black-v9`

Regeln:

- klar stylized 3D animated, nicht realistisch
- soft rounded shapes + vereinfachte Details
- premium, freundlich und leicht verspielt
- **deep-black Hintergrund Pflicht**
- keine feste Objektanzahl
- Inhalt und Klarheit vor Deko
- Emerald positiv, Ivory/Soft Gray neutral, Gold Geld, Red-Orange Warnung/Kosten
- keine Realistik, Produktfoto-Optik, UI/Dashboard, Flowchart, Microchip, Miniatur-Diorama oder Clutter
- Einzelprompts bleiben mittel-lang
- keine Bild-zu-Bild-Referenz

Google Flow arbeitet Strict Single Job: genau ein Bild → warten → umbenennen → QA → nächstes Bild. Nie Batch.

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

Der öffentliche Ersteller setzt automatisch:

- Flow Strict-Single-Job V3
- Stylized 3D Animated Black V9
- Reel-Layout V5
- Phase-1-Animationscode-Vertrag + kanonische `animation.tsx` pro Animationsszene
- Phase-3-Completion-Gate

Die Apply-Skripte sind Teil des atomaren `reel:create`-Ablaufs und sorgen dafür, dass der fertige neue Reel den aktuellen Lock enthält, auch wenn der Basisscaffolder ältere Übergangsfelder besitzt.

## Final

Ein Reel ist erst final, wenn:

- alle Nutzerbilder vorhanden sind
- finales Voiceover + echte Wortzeiten vorhanden sind
- jeder Animationsbeat bereits als finaler Phase-1-Code vorliegt
- Phase-1-Animationsseal unverändert ist
- jede Szene im finalen Render sichtbar umgesetzt ist
- Post-Render-QA PASSED ist
- komplette MP4 mit Ton geprüft wurde
- `06-export/` vollständig erzeugt wurde

`CLAUDE.md` ist die höchste Regelquelle.
