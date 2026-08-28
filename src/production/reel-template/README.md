# FinanzNeo Reel Template

Datengetriebene Vorlage für vertikale FinanzNeo-Reels von 60 bis 90 Sekunden.

## Ziel

Ein neues Reel erbt Layout, Captions, Header, Animation-Dispatch und Pure-Black-Hintergrund zentral aus dem Designsystem. Reel-spezifische Dateien dürfen diese Regeln nicht lokal umgehen.

## Unterstützte Beat-Typen

- `hook`
- `explain`
- `number`
- `compare`
- `checklist`
- `image`
- `animation`
- `cta`

`animation` ist ein **first-class Beat**. Es gibt keinen CTA-/Text-/Caption-Fallback für eine fehlende Animation.

## Pure-Black Background

Der einzige produktive Reel-Hintergrund ist:

```text
#000000
statisch
```

Keine Partikel, Aurora, Grid, Glow-Felder, Vignette, dekorativen Background-Gradienten oder Background-Motion. `PremiumPhysicalStage` bleibt transparent.

## SceneHeader V5

```tsx
<SceneHeader title="Kontoauszug prüfen" icon="search" />
```

Verbindlich:

- Y154
- 56 px Standard, Minimum 50 px
- maximal 2 Zeilen
- 34-px-Linien-Icon
- Text #FFFFFF
- semantische Farbe primär über das Icon
- Sentence Case
- keine Capsule / Chip / Pill / Panel
- kein automatisches ALL CAPS

## Finales V5-Layout

Einzige technische Quelle: `REEL_STYLE` in `src/brand/tokens.ts`.

```text
Header      Y = 154
Visual      Y = 320–1400
Caption     bottom = 340
Transition  3 Frames
```

`AnimationStage` behält für Phase-1-Code das volle 1080×1920-Koordinatensystem, clippt die **sichtbare Ausgabe hart auf Y320–1400**. Animationen können damit nicht sichtbar in Header oder Caption-Zone laufen.

## Untertitel

`Captions` erzwingt:

- aktives Wort Grün
- Rest Weiß
- 50 px Basis, Minimum 40 px
- max. zwei Zeilen
- kein Word-Jump / Scale-Pop / Stroke
- `bottom = 340`, `left = 72`, `right = 140`
- pro Szene geclippt

`SourceNote` liegt oberhalb der Caption und darf zweizeilige Captions nicht überdecken.

## Animationen

Phase 1 liefert pro Animationsszene bereits:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/animation.tsx
```

Pflicht:

```text
START → SICHTBARER MECHANISMUS → ERGEBNIS
```

- Ergebnis mindestens 15 Frames stabil
- V9-kompatible stylized-3D-Sprache
- mindestens ein echtes sichtbares Hauptmotiv
- keine feste Support-Objekt-Anzahl
- keine Dummy-/Placeholder-/Debugbewegung
- kein `Math.sin`/`Math.cos`-QA-Hack
- keine Background-Partikel/Aurora/Grid/Glow-Bewegung

Bei `reel:ready` wird jede Phase-1-Animationsquelle per SHA-256 versiegelt. Phase 3 muss exakt dieselbe Datei und denselben Export binden.

## Animation-Dispatch

```text
scene.type = animation
→ scene.animationId
→ customAnimations[animationId]
→ versiegelte Phase-1-Komponente
```

Fehlt das Binding, wirft `ReelTemplate` `MISSING ANIMATION BINDING` und der Render stoppt.

## Bilder

Image-Beats verwenden die exakten freigegebenen 1:1-Nutzerbilder. Darstellung mit `contain`; kein generiertes/Stock-/Placeholder-Ersatzbild.

## Phase 3

Eine erzeugte MP4 ist kein Fertigkeitsnachweis.

```text
reel:ready
→ Manifest
→ phase3:preflight
→ Candidate-Render
→ Post-Render-QA
→ Final-MP4
→ reel:export
```

Render-QA muss schwarze/leere Visualkerne, Caption-/Header-only-Szenen, fehlende Bilder, fehlende Animationen und nicht-schwarze/dekorative Backgrounds blockieren.
