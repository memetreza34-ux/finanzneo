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

## Verbindliche Regeln

Die Konfiguration wird vor dem Render geprüft:

- Gesamtdauer 60–90 Sekunden
- erster Beat ist `hook`
- letzter Beat ist `cta`
- eindeutige Beat-IDs
- positive ganze Frame-Dauern
- jeder Beat besitzt ein passendes `icon`
- Image-Beats besitzen eine Datei
- Image-Beats dauern maximal 6,0 Sekunden
- Animation-Beats besitzen `animationId`
- jedes `animationId` besitzt ein echtes `customAnimations[animationId]`-Binding
- fehlendes Animation-Binding = harter Renderfehler

## Pure-Black Background

Der einzige produktive Reel-Hintergrund ist zentral:

```text
#000000
statisch
```

`FinanceBackground` darf für Reels keine visuelle Variante erzeugen. Alte `standard/data/premium`-Props sind nur Kompatibilität.

Verboten:

- Partikel
- Aurora
- Grid
- Glow-Felder
- Vignette
- dekorative Background-Gradienten
- Hintergrundbewegung als Frame-Diff-/Animationsnachweis

`PremiumPhysicalStage` bleibt transparent.

## SceneHeader V5

Jede Szene erhält einen zentralen `SceneHeader`.

```tsx
{
  id: 'kontoauszug',
  type: 'image',
  icon: 'search',
  headline: 'Kontoauszug prüfen',
}
```

- mittig
- `top = 154`
- Sentence Case
- Text weiß
- semantische Farbe primär über das Linien-Icon
- keine Capsule / Chip / Pill / Panel
- kein automatisches ALL CAPS

## V5-Layout

Einzige technische Quelle: `REEL_STYLE` in `src/brand/tokens.ts`.

```text
Header      Y = 154
Visual      Y = 320–1480
Caption     bottom = 340
Transition  3 Frames
```

## Untertitel

Die zentrale `Captions`-Komponente erzwingt:

- aktives Wort Grün
- Rest Weiß
- max. zwei Zeilen
- kein Word-Jump / Scale-Pop / Stroke
- `bottom = 340`, `left = 72`, `right = 140`
- pro Szene geclippt

## Animationen

Phase 1 liefert pro Animationsszene bereits die fertige kanonische Quelle:

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

Produktive Composition:

```text
scene.type = animation
→ scene.animationId
→ customAnimations[animationId]
→ versiegelte Phase-1-Komponente
```

Fehlt das Binding, wirft `ReelTemplate` `MISSING ANIMATION BINDING` und der Render muss stoppen.

## Bilder

Image-Beats verwenden die exakten freigegebenen 1:1-Nutzerbilder. Darstellung mit `contain`; kein generiertes/Stock-/Placeholder-Ersatzbild.

Verbindliche Quellen:

- `docs/IMAGE-SYSTEM.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`

## Safe Areas

`showSafeAreaGuide: true` nur im Studio/QA. Vor Produktionsrendern `false`.

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

## Demo

`ReelTemplateDemo.tsx` liegt unter Experiments. Sie ist nur technische Vorschau, keine Produktion.
