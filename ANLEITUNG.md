# FinanzNeo — aktueller Produktionsablauf V9

> `CLAUDE.md` ist die höchste Regelquelle. Dieses Dokument beschreibt nur den praktischen Ablauf.

## Die drei Phasen

```text
PHASE 1 — ChatGPT
Recherche + Szenenskript + V9-Bildprompts + Header/Icons + Captions
+ produktionsreife animation.tsx für jede Animationsszene

        ↓

PHASE 2 — Nutzer
Google-Flow-Bilder + genau ein finales Voiceover + echte Wort-Timings

        ↓

PHASE 3 — konfigurierte Executor-Rolle
Assets integrieren + versiegelte Phase-1-Animationen binden
+ Preflight + Candidate-Render + Post-Render-QA + Export
```

`scene-index.json -> phase3Executor` entscheidet, ob Antigravity oder Claude Code Phase 3 ausführt. Der andere Executor übernimmt nicht einfach.

## Vor einem neuen Reel lesen

- `CLAUDE.md`
- `docs/PHASE-1-BRIEFING.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- `docs/3-PHASEN-WORKFLOW.md`
- `docs/PHASE-3-COMPLETION-GATE.md`
- `reels/PRODUKTIONSSTANDARD.md`

Alte Image-World-V3/V4/V7/V8-Dateien sind keine aktive Produktionsautorität.

## Phase 1

### Inhalt und Skript

- 60–90 Sekunden als Standard
- Hook in den ersten 2 Sekunden
- von Anfang an Szene für Szene schreiben
- ungefähr 14–16 Visual-Beats als Zielkorridor
- ungefähr 60 % Bild / 40 % Animation, Qualität vor Quote
- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s
- Animation ideal 4,5–7 s
- kurze deutsche Sätze, direkte Du-Ansprache
- Zahlen und Fakten prüfen

### V9-Bildwelt

Kanonischer Lock:

```text
finanzneo-stylized-3d-animated-black-v9
```

Quellbilder inklusive Cover bleiben `1:1`.

Verbindlich:

- klar stylized 3D animated, nicht photorealistisch
- soft rounded, vereinfachte erkennbare Formen
- **nahtloser tiefschwarzer Hintergrund Pflicht**
- Inhalt und Klarheit vor Deko
- keine feste Objektanzahl
- Support-Objekte nur, wenn sie helfen
- Emerald positiv/Fokus
- Ivory/Soft Gray neutral
- Gold Geld/Wert
- Red-Orange Warnung/Kosten
- keine UI-/Dashboard-/Flowchart-/Microchip-/Diorama-Sprache
- kein Clutter
- Marken/Logos erkennbar, aber stilisiert; keine Screenshots/Flat-Paste-Logos

### Phase-1-Animationen

Jede Animationsszene braucht bereits:

```text
scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

Pflicht:

```text
START → SICHTBARER MECHANISMUS → ERGEBNIS
```

- Ergebnis mindestens 15 Frames stabil
- `PremiumPhysicalStage` transparent
- mindestens ein echtes sichtbares Hauptobjekt
- keine feste Support-Objekt-Anzahl
- keine Dummy-/Debug-/Wackelanimation
- kein `Math.sin/Math.cos` als QA-Hack
- keine Partikel/Aurora/Grid/Glow-Flächen als Hintergrund
- Phase 3 darf diesen Code später nicht kreativ ersetzen

## Phase 2

### Google Flow

Einzige Regel:

```text
GENAU EIN Bild erzeugen
→ vollständig warten
→ sofort exakt umbenennen
→ V9-QA
→ bei Fehler dieselbe Bildnummer neu
→ erst dann nächstes Bild
```

Kein Batch, kein paralleles Queueing, kein späteres Sammel-Umbenennen und kein Nutzer-„weiter“.

Alle finalen Bilder kommen gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

### Audio und Timings

- genau ein finales Voiceover in `02-audio/`
- echte Wortzeiten aus genau diesem Audio
- keine Ersatz-Audiodatei
- keine erfundenen Timings

## Phase 3

Start immer mit:

```bash
npm run reel:ready -- <Reel-Pfad>
```

Wenn das fehlschlägt: nicht mit Ersatzassets weiterbauen.

Bei Erfolg werden die kanonischen `animation.tsx`-Dateien SHA-256-versiegelt.

Danach:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
```

Jede Szene aus `scene-index.json` muss im Produktionsmanifest exakt belegt werden.

### Bildszene

- exaktes Nutzerbild
- sichtbares Visual
- kein Stock-/Placeholder-Ersatz
- kein Header-/Caption-only-Fallback

### Animationsszene

- exakte `animationSourceFile`
- exakter `animationExport`
- exakter SHA-256-Seal
- echtes `customAnimations[animationId]`-Binding
- fehlendes Binding = harter Renderfehler
- keine Ersatzanimation

## Remotion-Hintergrund — immer schwarz

Für produktive Reels gilt technisch:

```text
#000000
statisch
```

Verboten als Background:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- Partikelfelder
- Aurora/Glow
- bewegte Grids
- Vignetten
- dekorative Background-Gradienten
- Hintergrundbewegung als Animationsnachweis

Objektmaterialien dürfen lokale Highlights, Schatten und Oberflächenverläufe haben. Der Canvas selbst bleibt schwarz.

## Layout

Einzige technische Quelle: `REEL_STYLE`.

```text
Header Y154
Visual Y320–1480
Caption bottom340
Transition 3 Frames
```

Header: normaler weißer Text + semantisches Linien-Icon, keine Capsule/Chip/Pill/ALL CAPS.

## Preflight und Render

```bash
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

`reel:render` erzeugt zuerst nur eine Candidate-MP4.

Post-Render-QA muss pro Szene prüfen:

- visueller Kern wirklich belegt
- Bildszene nicht leer
- Animationsszene mit echtem Inhalt und echter Bewegung
- Header/Caption allein zählen nicht
- schwarzer/leerer Kern = FAIL
- freier Rand bleibt statisch schwarz
- keine Partikel/Aurora/Grid/Glow-Hintergründe
- Audio vorhanden
- 1080×1920
- Timeline korrekt

Candidate wird bei QA-Fehler nicht als Final ausgegeben.

## Export

Nur nach bestandener Render-QA:

```bash
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

Erst erfolgreicher Export und vollständiges `06-export/` erlauben `FINAL_COMPLETE`.

## Technische Prüfung

```bash
npm run validate
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
```

Bei Phase 3 zusätzlich Preflight, Candidate-Render und Post-Render-QA.

Ohne tatsächlichen Lauf niemals behaupten, Validator, Typecheck, Render oder QA seien bestanden.

## Publishing

`04-caption/` enthält:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Keine YouTube Shorts. YouTube-Longform bleibt ein separater Workflow unter `youtube/`.
