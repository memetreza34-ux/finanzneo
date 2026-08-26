# FinanzNeo Reel Template

Datengetriebene Vorlage für vertikale FinanzNeo-Reels von 60 bis 90 Sekunden.

## Ziel

Ein neues Reel soll zentrale Layout-, Caption- und Header-Regeln aus dem Designsystem erben. Reel-spezifische Dateien dürfen diese Werte nicht lokal überschreiben.

## Unterstützte Beat-Typen

- `hook`
- `explain`
- `number`
- `compare`
- `checklist`
- `image`
- `cta`

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
- Checklisten besitzen mindestens einen Punkt

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

V5-Standard:

- mittig zentriert
- `top = 154`
- normale Schreibweise / Sentence Case
- Text neutral weiß
- einfaches Linien-Icon links neben dem Text
- semantische Farbe primär über das Icon
- keine Capsule, kein Chip, keine Pill, kein Panel
- keine automatische ALL-CAPS-Transformation
- Aussage oder Frage, nie nur Stichwort oder Zahl
- `warning` nur für echte Warnung/Problem
- `money` nur für Geld-/Wertfokus

## V5-Layout

Einzige technische Quelle: `REEL_STYLE` in `src/brand/tokens.ts`.

```text
Header      Y = 154
Visual      Y = 320–1480
Caption     bottom = 340
Transition  3 Frames
```

Bilder und native Animationen nutzen dieselbe Visualzone. `AnimationStage` verschiebt/zentriert native Animationen passend zur V5-Bühne.

## Untertitel

Die zentrale `Captions`-Komponente erzwingt:

- aktives Wort FinanzNeo-Grün
- restliche Wörter Weiß
- satz-/phrasenbasierte Einheiten
- maximal zwei Zeilen
- kein gelbes/goldenes Active-Word
- kein schwarzer Text
- kein Word-Jump
- kein Scale-Pop
- kein `WebkitTextStroke`
- `bottom = 340`, `left = 72`, `right = 140`

Lokale Caption-Positionen und Farb-Overrides sind nicht vorgesehen.

## Animationen

Produktive Reel-Animationen werden nicht in Phase 3 kreativ erfunden.

Für neue Reels liefert Phase 1 pro Animationsszene bereits eine fertige:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/animation.tsx
```

Verbindlicher Standard: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`.

Jede Animation zeigt:

```text
STARTZUSTAND
→ SICHTBARER MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ RESULT mindestens 15 Frames stabil
```

Verboten sind unter anderem Dummy-/Placeholder-Komponenten, Debug-Boxen, wackelnde Rechtecke und `Math.sin`/`Math.cos` als künstlicher Frame-Diff-Hack.

Bei `reel:ready` werden die Phase-1-Animationsquellen per SHA-256 versiegelt. Phase 3 muss exakt diese Quellen verwenden.

## Animationsfarben

Auf dunklen Reel-Flächen gilt `ANIMATION_COLORS`:

- Weiß = neutral
- Grün = Fokus/Lösung
- Rot = Problem/Warnung/Verlust
- Gold = Geld/Wert
- Schwarz = verboten

## Bilder

Image-Beats erwarten freigegebene 1:1-Nutzerbilder. Darstellung in Remotion erfolgt mit `contain`; wichtige Motive und Labels dürfen nicht abgeschnitten werden.

Verbindliche Quellen:

- `docs/IMAGE-SYSTEM.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`

## Safe Areas

Für Studio-Prüfungen:

```ts
showSafeAreaGuide: true
```

Vor Produktionsrendern:

```ts
showSafeAreaGuide: false
```

## Phase 3

Eine erzeugte MP4 ist kein Fertigkeitsnachweis. Produktive Reels laufen über den Phase-3-Completion-Contract mit Preflight, Candidate-Render, Post-Render-QA und Export.

Details:

- `docs/PHASE-3-COMPLETION-GATE.md`
- `scripts/lib/phase3-completion.mjs`

## Demo

`ReelTemplateDemo.tsx` liegt unter Experiments. Sie ist eine technische Vorschau, keine veröffentlichungsfertige Produktion.
