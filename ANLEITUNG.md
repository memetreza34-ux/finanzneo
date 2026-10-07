# FinanzNeo — aktueller Produktionsablauf V9

> `CLAUDE.md` ist die höchste Regelquelle. Dieses Dokument beschreibt den praktischen Ablauf.

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

`scene-index.json -> phase3Executor` entscheidet, ob Antigravity oder Claude Code Phase 3 ausführt.

## Phase 1

### Inhalt und Skript

- 60–90 Sekunden als Standard
- Hook in den ersten 2 Sekunden
- von Anfang an Szene für Szene schreiben
- ungefähr 14–16 Visual-Beats als Zielkorridor
- ungefähr 60 % Bild / 40 % Animation als Richtwert, Qualität vor Quote
- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s
- Animation ideal 4,5–7 s
- kurze deutsche Sätze
- Zahlen und Fakten prüfen

### Editorial-Finance-Bildwelt

```text
finanzneo-editorial-finance-v1
```

- Reel-Quellbilder inklusive Cover: 1:1
- YouTube-Quellbilder: 16:9
- saubere Editorial-Finanzillustration
- überwiegend 2D / leichtes 2.5D
- einfaches 3D nur wenn sinnvoll
- flexible Hintergründe
- ein Sprechgedanke = eine klare Bildidee
- progressive Bildfolgen dürfen das freigegebene vorherige Bild als echte Referenz verwenden
- kein automatischer Headline-Zwang
- kein unnötiger AI-Slop

Kanonische Quelle: `docs/FINANZNEO-IMAGE-WORLD.md`.


### Phase-1-Animationen

Jede Animationsszene braucht:

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
- Motion-Welt: `finanzneo-editorial-motion-v1`
- 2D / leichtes 2.5D bevorzugt
- `EditorialMotionStage` für passende helle oder gedämpfte Editorial-Flächen
- eine klare Hauptbewegung kann vollständig reichen
- Kamera standardmäßig still
- kein `PremiumPhysicalStage`-/Physical-Default bei neuen Animationen
- keine Dummy-/Debug-/Wackelanimation
- kein `Math.sin/Math.cos` als QA-Hack
- keine Partikel/Aurora/Grid/Glow-Flächen als Hintergrund
- Phase 3 darf diesen Code später nicht kreativ ersetzen

## Phase 2

### Google Flow

```text
GENAU EIN Bild erzeugen
→ vollständig warten
→ sofort exakt umbenennen
→ Bildwelt + Dateiname prüfen
→ bei Fehler dieselbe Bildnummer neu
→ erst dann nächstes Bild
```

Kein Batch, kein paralleles Queueing, kein späteres Sammel-Umbenennen und kein Nutzer-„weiter“.

Alle finalen Bilder kommen nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

### Audio und Timings

- genau ein finales Voiceover in `02-audio/`
- echte Wortzeiten aus genau diesem Audio
- keine Ersatz-Audiodatei
- keine erfundenen Timings

## Finales Layout

Einzige technische Quelle: `REEL_STYLE`.

```text
Header Y154
Header 56 px, Minimum 50 px, maximal 2 Zeilen
Icon 34 px
Visual Y320–1400
Caption bottom340, 50 px, maximal 2 Zeilen
Transition 3 Frames
```

Header: reines Weiß + semantisches Linien-Icon, keine Capsule/Chip/Pill/ALL CAPS.

`AnimationStage` clippt sichtbare Animationen hart auf **Y320–1400**. Sie können dadurch nicht in Header oder Caption-Zone laufen.

Quellenhinweise liegen oberhalb der Caption-Zone und dürfen zweizeilige Captions nicht überdecken.

## Phase 3

Start immer mit:

```bash
npm run reel:ready -- <Reel-Pfad>
```

Bei FAIL nicht mit Ersatzassets weiterbauen.

Danach:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

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

## Remotion-Hintergrund

Produktive Reels:

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

## Post-Render-QA

Candidate-MP4 ist nicht automatisch final.

Prüfen:

- visueller Kern jeder Szene wirklich belegt
- Bildszene nicht leer
- Animationsszene mit echtem Inhalt und echter Bewegung
- Animation erklärt den gesprochenen Inhalt
- Header/Caption allein zählen nicht
- schwarzer/leerer Kern = FAIL
- freier Rand bleibt statisch schwarz
- keine Partikel/Aurora/Grid/Glow-Hintergründe
- Audio vorhanden
- 1080×1920
- Timeline korrekt

## Technische Prüfung

```bash
npm run validate
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
```

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

Keine YouTube Shorts. YouTube-Longform bleibt separat unter `youtube/`.
