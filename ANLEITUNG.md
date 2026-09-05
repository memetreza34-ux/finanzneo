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
- **Cover Hook V3:** scene-01 ist Cover + erster Content-Beat
- Hook beginnt mit dem ersten gesprochenen Wort in scene-01
- erste Zeile = Frage/Aussage/Problem/Warnung/Kontrast/Zahl + konkreter Themenanker
- kein separater 0,1-s-/3-Frame-Cover-Clip und keine neutrale Vorrede
- von Anfang an Szene für Szene schreiben
- ungefähr 14–16 Visual-Beats als Zielkorridor
- ungefähr 60 % Bild / 40 % Animation als Richtwert, Qualität vor Quote
- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s
- Animation ideal 4,5–7 s
- kurze deutsche Sätze
- Zahlen und Fakten prüfen

### V9-Bildwelt

```text
finanzneo-stylized-3d-animated-black-v9
```

- Quellbilder inklusive Cover: 1:1
- klar stylized 3D animated, nicht photorealistisch
- soft rounded, vereinfachte erkennbare Formen
- nahtloser tiefschwarzer Hintergrund Pflicht
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
- `PremiumPhysicalStage` transparent
- mindestens ein echtes sichtbares Hauptobjekt
- keine feste Support-Objekt-Anzahl
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
→ V9-QA
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
- Voiceover startet bereits in scene-01 mit `scene-01.hook.spokenLine`; keine Begrüßung/Vorrede davor
- Frame 0 ist nur der caption-freie Cover-Snapshot derselben normalen Hook-Szene
- Captions dürfen nach Frame 0 bereits innerhalb scene-01 starten
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
