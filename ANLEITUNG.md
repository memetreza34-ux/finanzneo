# FinanzNeo — praktischer Reel-Produktionsablauf

> `CLAUDE.md` ist die höchste Regelquelle. Der aktive Maschinenstandard ist `config/finanzneo-production-standard.json`. Dieses Dokument erklärt nur den praktischen Ablauf und definiert keine parallelen Versionen.

## 1. Drei Phasen

```text
PHASE 1 — ChatGPT
Recherche + Szenenskript + V9-Bildprompts + Header/Icons + Caption
+ produktionsreife animation.tsx für jede Animationsszene

PHASE 2 — Nutzer
Google-Flow-Bilder + genau ein finales Voiceover + echte Wort-Timings

PHASE 3 — konfigurierter Executor
Assets integrieren + versiegelte Animationen binden
+ Preflight + Candidate-Render + Visual-QA + Export
```

`scene-index.json -> phase3Executor` entscheidet, wer Phase 3 ausführt.

## 2. Phase 1

Aktive Regeln stehen in `reels/PRODUKTIONSSTANDARD.md`.

Für neue Future-V3-Reels:

- Hook in den ersten 2 Sekunden.
- keine feste Szenenzahl; zuerst Sprechgedanke → Visual Beat → Szene.
- 1 gesprochener Gedanke = 1 sichtbarer Beat.
- statischer Bildbeat ideal ca. 1,8–3,0 s.
- ab ca. 3,6 s aktiv einen weiteren Beat prüfen.
- ohne neue sichtbare Information hart max. 4,0 s.
- 60/40 Bild/Animation ist nur Richtwert.
- Animation darf länger sein, wenn der sichtbare Zustand mit der Sprache weiter fortschreitet.

### Bildwelt

Aktiv: `finanzneo-stylized-3d-animated-black-v9`.

- stylized 3D, niemals fotorealistisch
- deep black
- reale Ursache/Wirkung statt abstrakter Finanzsymbol-Sammlung
- kurze deutsche Objektlabels nur wenn sie Verständnis schaffen
- kein Dashboard, Flowchart, Clutter oder generisches Produktfoto

### Animationsszene

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

Mechanik:

```text
START → TRIGGER → PHYSICAL ACTION → REACTION → RESULT → RESULT HOLD
```

Der Ergebniszustand bleibt mindestens 15 Frames stabil. Phase 3 darf den versiegelten Code nicht kreativ ersetzen.

## 3. Phase 2

### Google Flow

```text
GENAU EIN Bild starten
→ vollständig warten
→ exakt umbenennen
→ V9-QA
→ bei Fehler dieselbe Bildnummer neu
→ erst dann nächstes Bild
```

`scene-01` ist automatisch das Cover. **Kein separater Bild-00-Job.**

Finale Bilder:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

### Audio

- genau ein finales Voiceover in `02-audio/`
- echte Wortzeiten aus genau diesem Audio
- keine erfundenen Timings

## 4. Layout

Einzige technische Quelle: `src/brand/tokens.ts -> REEL_STYLE`.

```text
Header Y154
Header 56 px, Minimum 50 px, maximal 2 Zeilen
Icon 34 px
Visual Y320–1400
Caption bottom340, maximal 2 Zeilen
Transition 3 Frames
```

Produktiver Hintergrund bleibt statisch `#000000`.

## 5. Phase 3

```bash
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
```

`reel:render` erzeugt zuerst einen Candidate. Erst nach QA wird der finale Export freigegeben.

Bildszene: exaktes Nutzerbild, kein Ersatz.

Animationsszene: exakte versiegelte `animationSourceFile` + `animationExport`; fehlendes Binding = harter Fehler.

## 6. Publishing

`04-caption/` enthält für neue Produktionen:

```text
caption.txt
word-timings.json
```

Der finale Export verwendet **eine universelle Social-Caption**, keine getrennten Plattformtexte.

Keine YouTube Shorts. YouTube Longform bleibt separat unter `youtube/`.

## 7. Daten in Remotion

Statistik- und Marktdaten vor dem Render holen und lokal einfrieren:

```bash
npm run data:fetch
npm run data:validate
```

Details: `docs/DATA-PIPELINE.md`.

Ohne tatsächlichen Lauf niemals behaupten, Validator, Typecheck, Render oder QA seien bestanden.
