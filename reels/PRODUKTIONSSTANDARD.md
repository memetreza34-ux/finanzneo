# FinanzNeo-Reel-Produktionsstandard

> Bei Widersprüchen gilt immer `CLAUDE.md`.

## 1. Einfache Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

Keine doppelten Hauptordner für Script, Bilder, Caption, Review, Export oder Video anlegen, wenn sie nicht technisch zwingend nötig sind.

`04-caption/` enthält:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Keine YouTube Shorts. YouTube-Longform liegt getrennt unter `youtube/`.

## 2. Produktionsquelle pro Szene

Bildszene:

```text
scene-XX/
├── bildprompt.txt
└── szene.md
```

Animationsszene:

```text
scene-XX/
├── remotion.md
├── animation.tsx
└── szene.md
```

`animation.tsx` ist die kanonische produktionsreife Phase-1-Quelle. Phase 3 darf keine Ersatzanimation bauen.

## 3. Google Flow — Einzelbild-Ablauf

Einzige Übergabedatei:

```text
03-szenen/alle-bildprompts.txt
```

Cover und Szenenbilder bleiben `1:1`.

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ VOLLSTÄNDIG WARTEN
→ SOFORT EXAKT UMBENENNEN
→ V9-QA
→ ERST DANN NÄCHSTES BILD
```

Keine Batches, keine Parallelgenerierung, kein späteres Sammel-Umbenennen, keine Bildreferenz.

## 4. Nummerierung

```text
Bild 00 = Cover
Bild 01 = Szene 01
Bild 02 = Szene 02
...
```

Animationsszenen behalten ihre Szenennummer, erzeugen aber kein Bild.

## 5. Finaler Bild-Sammelordner

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Alle finalen Bilder müssen dort exakt benannt vorliegen, bevor Phase 3 startet.

## 6. Drei Phasen

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

## 7. Bildwelt — Stylized 3D Animated Black V9

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
- klare Hauptaussage oder Hauptaktion
- keine feste Objektanzahl
- Inhalt und Verständlichkeit vor Deko
- Deep Black als Bildhintergrund
- Emerald positiv/bevorzugt
- Warm Ivory + Soft Gray neutral
- Gold Geld/Wert
- Warm Red-Orange Warnung/Kosten/Verlust

### Marken / Logos

Wenn Marke, Bank, App oder Logo relevant ist:

- erkennbar ähnlich, aber stilisiert in derselben 3D-Animationswelt
- vereinfachte rounded 3D-Form
- passendes Material und Licht
- kein flach aufgeklebtes echtes Logo
- kein Website-/App-Screenshot
- kein photorealistischer Markenprodukt-/UI-Look

## 8. Flow-Hintergrund — Deep Black Pflicht

```text
Use one seamless deep black background.
Keep it clean, minimal and uninterrupted.
No bright studio background.
No floor-wall boundary.
No horizon line.
No colored background zones.
```

Das Motiv muss sich durch Licht und Schatten klar vom Schwarz lösen.

## 9. Text im KI-Bild

Erlaubt:

- nur explizit vorgegebene kurze deutsche Objektlabels

Verboten:

- Headline
- Untertitel
- ganzer erklärender Satz
- CTA
- zufällige Zusatztexte

## 10. Darstellung der Bilder in Remotion

- `object-fit: contain`
- keine unscharfe Bildkopie als Hintergrund
- Source-Crop oben max. `0.20`
- Source-Crop unten max. `0.20`
- Source-Crop insgesamt max. `0.34`
- zusätzliche Skalierung max. `1.04`
- wichtige Motive/Labels nie abschneiden

## 11. Remotion-Reel-Hintergrund — Pure Black V1

Der finale Reel-Canvas ist technisch immer:

```text
#000000
statisch
```

Zentrale Quelle: `src/design-system/FinanceBackground.tsx`.

Alte `standard/data/premium`-Props dürfen die Optik nicht verändern.

Als Reel-Hintergrund strikt verboten:

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

## 12. Timing

- Bildbeat ideal: 3,5–5,5 s
- Bildbeat absolut max.: 6,0 s
- Animation ideal: 4,5–7,0 s
- bei >6 s Bild-Erklärzeit: splitten oder animieren

Die 60/40-Verteilung ist Ziel, kein Zwang.

## 13. V5 Plain Header

- mittig
- natürliche Schreibweise / Sentence Case
- weißer Text
- einfaches semantisch gefärbtes Linien-Icon
- keine Capsule, kein Chip, kein Panel, keine Pill
- keine erzwungene ALL-CAPS-Transformation
- Aussage oder Frage statt Zahl/Stichwort

## 14. Layout V5

Quelle: `REEL_STYLE`.

```text
Header               Y = 154
Visual               Y = 320–1480
Untertitel           bottom = 340
Caption links        72
Caption rechts       140
Szenenübergang       3 Frames
```

Lokale Reel-Werte dürfen das nicht überschreiben.

## 15. Untertitel

- satz-/phrasenbasiert
- aktives Wort grün
- Rest weiß
- max. 2 Zeilen
- 50 px Basis, Weight 800
- kein Stroke
- kein Jump/Scale-Pop
- keine Caption-Lücke
- kein Wort der nächsten Szene vor Szenengrenze

## 16. Animationsklarheit — Phase 1 verantwortlich

Detailquelle: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`.

Pflicht:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG / MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ mindestens 15 Frames stabil
```

`animation.tsx` muss u. a. verwenden:

- `useCurrentFrame`
- `ANIMATION_COLORS`
- `PremiumPhysicalStage`
- mindestens ein echtes `PhysicalObject`
- `prog`, `interpolate` oder `spring`
- `ANIMATION_NARRATIVE`
- `PREMIUM_VISUAL_NARRATIVE`
- `RESULT_HOLD_FRAMES >= 15`

Visuell:

- dieselbe V9-Animationswelt wie die Flow-Bilder
- keine feste Support-Objekt-Anzahl
- transparente Animations-Stage
- schwarzer Canvas kommt ausschließlich aus zentralem `FinanceBackground`

Verboten:

- `Math.sin`/`Math.cos` als QA-Wackel-Hack
- Debug-/Test-/Dummy-/Placeholder-Komponenten
- generische Cards + Text ohne Mechanismus
- reine Zoom/Fade/Popup-Erklärung
- Partikel/Aurora/Grid/Glow/Gradient als Animationshintergrund
- Background-Motion als Frame-Diff-Hack

Bei erfolgreichem `reel:ready` wird jede Phase-1-Animationsdatei per SHA-256 versiegelt.

## 17. Phase 3 — Hard Completion

Start zwingend:

```bash
npm run reel:ready -- <Reel-Pfad>
```

Bei FAIL stoppen und echte Blocker melden.

Danach:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
# Manifest vollständig machen
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

### Bildszene

- exaktes Nutzerbild sichtbar
- kein Ersatzbild
- kein Caption-/Header-only-Fallback

### Animationsszene

- exaktes `animationSourceFile`
- exakter `animationExport`
- SHA-256 muss Seal entsprechen
- echtes Animation-Binding
- kein Ersatzcode

## 18. Post-Render-QA

Eine MP4 allein ist kein Fertigkeitsnachweis.

Render-QA prüft pro Szene:

- visueller Kern ist tatsächlich belegt
- Bildszene ist nicht schwarz/leer/caption-only
- Animationsszene besitzt sichtbaren Inhalt und echte Veränderung
- aktive Visualfläche ist ausreichend
- freier Rand bleibt statisch schwarz
- keine Partikel/Aurora/Grid/Glow-Hintergründe
- Audio-Stream vorhanden
- 1080×1920
- Timeline-Dauer korrekt

Schwarzes/leeres Reel oder schwarze/leere Szene = **FAIL**.

## 19. Audio

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

## 20. Reel-QA

Sofort korrigieren bei:

- fehlendem/falschem Nutzerbild
- Realismus / Produktfoto-Look
- nicht tiefschwarzem Flow-Hintergrund
- nicht rein schwarzem Remotion-Hintergrund
- Partikel/Aurora/Grid/Glow/Vignette im Reel-Hintergrund
- aufgeklebt wirkender Marke / Screenshot-UI
- UI-/Dashboard-/Flowchart-Look
- unnötigem Clutter
- falschen Labels
- Bildbeat >6 s
- fehlendem Header/Icon
- Header-Capsule/ALL-CAPS
- falscher Caption-Position/Farbe
- schwarzem/leeren visuellen Kern
- unverständlicher/dekorativer Animation
- Debug-/Wackel-/Placeholder-Animation
- fehlendem Animation-Binding
- durch Phase 3 ersetztem Animationscode
- fehlendem Audio

## 21. Publishing

Pflichtdateien:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
```

Keine YouTube Shorts.

## 22. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

`reel:create` setzt nativ:

- Flow Strict-Single-Job V3
- V9 Bildwelt
- Pure-Black Reel Background V1
- V5 Layout
- Phase-1-Animationscode-Vertrag
- Phase-3-Completion-Gate

## 23. Automatische Prüfung

```bash
npm run validate:image-world
npm run validate:reel-background
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

Ein Reel ist erst final, wenn Preflight, Candidate-Render, Post-Render-QA und `reel:export` tatsächlich erfolgreich waren.
