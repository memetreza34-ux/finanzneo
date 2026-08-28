# FinanzNeo-Reel-Produktionsstandard

> Bei Widersprüchen gilt `CLAUDE.md`.

## 1. Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

Animationsszene:

```text
scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

Bildszene:

```text
scene-XX/
├── szene.md
└── bildprompt.txt
```

## 2. Drei Phasen

### Phase 1 — ChatGPT

- Recherche + Quellen
- szenenweises Skript
- Szenenplan
- V9-Bildprompts
- Header + Icons
- `remotion.md`
- fertige `animation.tsx`
- Captions/Plattformtexte

### Phase 2 — Nutzer

- finale Flow-Bilder
- genau ein finales Voiceover
- echte Wort-Timings aus diesem Voiceover

### Phase 3 — konfigurierter Executor

`scene-index.json.phase3Executor` entscheidet Antigravity oder Claude Code.

Phase 3 integriert. Sie erzeugt keine fehlenden Nutzerbilder und erfindet keine fehlende Animation.

## 3. Google Flow

Einzige Übergabedatei:

```text
03-szenen/alle-bildprompts.txt
```

Strict-Single-Job V3:

```text
GENAU EIN BILD
→ vollständig warten
→ sofort exakt umbenennen
→ V9-QA
→ erst dann nächstes Bild
```

Keine Batches, keine Parallelgenerierung, kein späteres Sammel-Umbenennen, keine Bildreferenz und kein Nutzer-„weiter“.

Finale Bilder liegen gemeinsam in:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 4. Bildwelt — Stylized 3D Animated Black V9

```text
finanzneo-stylized-3d-animated-black-v9
```

Pflicht:

- klar stylized 3D animated
- niemals realistisch / photorealistisch
- soft rounded shapes
- vereinfachte erkennbare Details
- clean materials
- premium, freundlich, leicht verspielt
- Deep Black als Bildhintergrund
- keine feste Objektanzahl
- Inhalt und Verständlichkeit vor Deko
- Emerald positiv/bevorzugt
- Ivory/Soft Gray neutral
- Gold Geld/Wert
- Red-Orange Warnung/Kosten/Verlust

Marken/Logos: erkennbar ähnlich, aber stilisiert. Kein Flat-Paste-Logo, Screenshot oder photorealistischer Marken-Look.

## 5. Finales Layout V5

Quelle: `REEL_STYLE`.

```text
Header               Y = 154
Header Text          56 px, Minimum 50 px
Header Icon          34 px
Header Zeilen        max. 2
Visual               Y = 320–1400
Untertitel           bottom = 340
Caption Font         50 px, Minimum 40 px
Caption Zeilen       max. 2
Szenenübergang       3 Frames
```

Header: reines Weiß, natürliche Schreibweise, semantisches Linien-Icon, keine Capsule/Chip/Pill/ALL CAPS.

`AnimationStage` clippt produktive Animationen hart auf **Y320–1400**. Kein Animationsinhalt darf sichtbar in Header oder Caption-Zone laufen.

`SourceNote` liegt oberhalb der Caption-Zone und darf zweizeilige Captions nicht überdecken.

## 6. Remotion-Reel-Hintergrund

Produktive Reels:

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
- Aurora-/Glow-Flächen
- bewegte Grids
- Hintergrund-Gradienten/Vignetten
- dekorative Background-Motion

Hintergrundbewegung zählt niemals als gültige Szenenanimation.

## 7. Untertitel

- satz-/phrasenbasiert
- aktives Wort grün
- Rest weiß
- max. 2 Zeilen
- 50 px Basis, Minimum 40 px, Weight 800
- kein Stroke
- kein Jump/Scale-Pop
- keine Caption-Lücke
- kein Wort der nächsten Szene vor Szenengrenze

## 8. Animationen — Phase 1 verantwortlich

Pflicht:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG / MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ mindestens 15 Frames stabil
```

`animation.tsx` verwendet u. a.:

- `useCurrentFrame`
- `ANIMATION_COLORS`
- `PremiumPhysicalStage`
- mindestens ein echtes sichtbares `PhysicalObject`
- `prog`, `interpolate` oder `spring`
- `ANIMATION_NARRATIVE`
- `PREMIUM_VISUAL_NARRATIVE`
- `RESULT_HOLD_FRAMES >= 15`

Es gibt **keine feste Support-Objekt-Anzahl**.

Verboten:

- `Math.sin`/`Math.cos` als QA-Wackel-Hack
- Debug-/Test-/Dummy-/Placeholder-Komponenten
- generische Cards + Text ohne Mechanismus
- reine Zoom/Fade/Popup-Erklärung
- Partikel/Aurora/Grid/Glow als Hintergrund
- Background-Motion als Frame-Diff-Hack

Bei erfolgreichem `reel:ready` wird jede Phase-1-Animationsdatei per SHA-256 versiegelt.

## 9. Phase 3 — Hard Completion

Start:

```bash
npm run reel:ready -- <Reel-Pfad>
```

Danach:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

Bildszene:

- exaktes Nutzerbild sichtbar
- kein Ersatzbild
- kein Caption-/Header-only-Fallback

Animationsszene:

- exaktes `animationSourceFile`
- exakter `animationExport`
- SHA-256 muss Seal entsprechen
- echtes Animation-Binding
- kein Ersatzcode

## 10. Post-Render-QA

Eine MP4 allein ist kein Fertigkeitsnachweis.

Render-QA prüft pro Szene:

- visueller Kern tatsächlich belegt
- Bildszene nicht schwarz/leer/caption-only
- Animationsszene besitzt sichtbaren Inhalt und echte Veränderung
- Animation erklärt den Inhalt
- freier Rand bleibt statisch schwarz
- keine Partikel/Aurora/Grid/Glow-Hintergründe
- Audio vorhanden
- 1080×1920
- Timeline-Dauer korrekt

Schwarzes/leeres Reel oder schwarze/leere Szene = **FAIL**.

## 11. Publishing

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

## 12. Automatische Erstellung und Prüfung

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Reel-Titel"
npm run validate
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

Ein Reel ist erst final, wenn Preflight, Candidate-Render, Post-Render-QA und `reel:export` tatsächlich erfolgreich waren.
