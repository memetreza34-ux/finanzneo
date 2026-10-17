# FinanzNeo — Phase-1-Animationscode-Standard

## Scope

Dieser Standard betrifft **nur Animationsszenen**.

Header, Untertitel, Cover, Audio, Flow-Bilder und die restliche Video-Struktur werden hier nicht gestaltet.

## Aktive Motion-Welt für neue Reels

```text
MOTION_WORLD: finanzneo-editorial-motion-v3
VISUAL_TARGET_WORLD: finanzneo-editorial-finance-v1
FINANCE_MOTION_LIBRARY: finanzneo-editorial-motion-v3-library
```

Kanonische visuelle Regel:

```text
docs/FINANZNEO-EDITORIAL-MOTION-V1.md
```

Die Animation soll wie die **bewegte Version der neuen FinanzNeo-Bildwelt** aussehen.

## Grundsatz

Eine Animationsszene ist in Phase 1 kreativ und technisch fertig.

`remotion.md` allein reicht nicht. Phase 1 liefert eine produktionsreife `animation.tsx`.

Phase 3 darf die versiegelte Animation nicht neu erfinden oder durch einen Platzhalter ersetzen.

## Content-first

Für jede Animationsszene:

```text
SPRECHPUNKT
→ WAS MUSS DER ZUSCHAUER SICHTBAR VERSTEHEN?
→ WAS MUSS SICH DAFÜR SICHTBAR VERÄNDERN?
→ EINFACHSTE KLARE MOTION
→ LIBRARY-BEST-FIT ODER CUSTOM
→ PRODUKTIONSREIFE animation.tsx
```

Die Library ist ein Werkzeugkasten, kein Auswahlmenü.

## Visuelle Sprache

Standard:

- saubere Editorial-Finanzillustration
- 2D oder leichtes 2.5D bevorzugt
- matte Farben
- wenige große Formen
- wenig Detail
- klare Leserichtung
- helle Creme-/Off-White-/Grau-/Muted-Flächen bevorzugt
- dunkle Fläche nur wenn das Motiv davon wirklich profitiert
- einfaches 3D nur wenn Tiefe für das Verständnis nötig ist

Nicht automatisch:

- schwarzer Animationshintergrund
- `PremiumPhysicalStage`
- Physical-Primitives
- 3D-Münzen
- Podeste
- metallische/glänzende Materialien
- harte Material-Gradients
- Glow
- futuristische Finance-Optik

## Motion-Regel

Die kleinste sinnvolle Bewegung gewinnt.

Eine hochwertige Animation darf nur **eine** klare Hauptveränderung haben.

Beispiele:

- Balken wächst
- Balken schrumpft
- Zahl verändert sich
- Timeline verlängert sich
- eine Rate reduziert Restschuld
- ein Dokument bekommt eine zusätzliche Kostenzeile
- ein Weg zum Ziel wird schrittweise sichtbar
- eine Verteilung verändert ihre Gewichte

Mehr Bewegung ist nicht automatisch besser.

## Kamera

Default:

```text
CAMERA_ROLE: still
```

`follow`, `push` oder `reframe` nur wenn die Kamera tatsächlich beim Verstehen hilft.

Keine Kamerafahrt nur für Dynamik.

## Editorial Motion Library V2

Neue Library:

```text
src/finance-motion/v3
```

Aktuelle Mechaniken:

- `money-transfer`
- `money-split`
- `value-growth`
- `value-drain`
- `allocation-split`
- `rebalancing`
- `diversification`
- `loan-paydown`
- `protection-limit`
- `scenario-comparison`
- `finance-timeline`
- `compound-growth`
- `mountain-progress`
- `document-cost-increase`

Die IDs beschreiben Mechaniken. Sie bestimmen nicht automatisch die kreative Idee.

## Pflicht-Metadaten im Code

Jede neue Animation dokumentiert:

```text
MOTION_SOURCE: library-best-fit | custom-build
FINANCE_MOTION_ID: <library-slug> | none
MECHANIC_ID: semantische Mechanik
FOCAL_PATH: was das Auge verfolgt
PRIMARY_ACTION: die eine wichtigste sichtbare Veränderung
CAMERA_ROLE: still | follow | push | reframe
PAYOFF: klarer Endzustand

ANIMATION_NARRATIVE
START: Ausgangslage
MECHANISM: sichtbare Veränderung
RESULT: Ergebnis

EDITORIAL_VISUAL_NARRATIVE
HERO: Hauptmotiv
SUPPORT: nur wirklich nötige Unterstützung
SURFACE: cream | off-white | light-gray | muted-color | dark wenn begründet
SHAPE_LANGUAGE: flat | subtle-2.5d | selective-simple-3d
```

Zusätzlich:

```text
RESULT_HOLD_FRAMES >= 15
```

## Library-Best-Fit

Bei `library-best-fit`:

- aus `src/finance-motion/v3` importieren
- Werte, Labels, Gewichtungen und Timing exakt aus dem Sprechpunkt ableiten
- keine Template-Füllwerte
- die Mechanik darf wiederverwendet werden

## Custom-Build

Bei `custom-build`:

- `FINANCE_MOTION_ID: none`
- `useCurrentFrame`
- `interpolate`, `spring` oder `prog`
- `EDITORIAL_MOTION_COLORS`
- klare framegenaue Veränderung
- gleiche Editorial-Sprache wie die Bildwelt

## EditorialMotionStage

Neue Animationen dürfen `EditorialMotionStage` nutzen.

Die Stage:

- hält die Animation innerhalb der Visualzone
- stellt eine ruhige Editorial-Fläche bereit
- unterstützt Creme, Off-White, Hellgrau, Muted Green oder Dark
- erzeugt keine Partikel-/Aurora-/Grid-Welt
- ist kein Dashboard

## Weiterhin verboten

- `Math.sin` / `Math.cos` als künstliches Dauerwackeln
- Debug-/Placeholder-Flächen
- reine Texttafel als Erkläranimation
- Dashboard-/App-UI als Hauptsprache
- Fortschrittsbalken als Ersatz für die eigentliche Aussage
- dekorative Dauerbewegung
- Partikel-/Aurora-/Grid-Hintergründe
- Neon-/Hologramm-Look als Standard
- schwebende Coin-Massen
- alte `PremiumPhysicalStage`-/Physical-Primitives in neuen Editorial-Animationen
- viele Motion-Channels nur um die Szene aktiver wirken zu lassen
- eine Library-Animation nur zu verwenden, weil sie bereits existiert

## Fertig bedeutet

Eine neue Animationsszene ist fertig, wenn:

- der gesprochene Gedanke sichtbar verstanden wird
- die Hauptveränderung sofort erkennbar ist
- die Motion einfacher statt komplizierter macht
- die Szene zur neuen FinanzNeo-Bildwelt passt
- sie nicht wie die alte schwarze 3D-Welt aussieht
- Start, Mechanismus und Ergebnis klar sind
- das Ergebnis mindestens 15 Frames stabil bleibt
- keine kreative Nacharbeit in Phase 3 nötig ist


## V3 Pflichtprozess vor dem Coding

Für jede neue Animationsszene:

1. Drei visuelle Konzepte entwickeln.
2. Das stärkste Konzept auswählen.
3. Vier repräsentative Keyframes planen: 10 %, 35 %, 65 %, 90 %.
4. Passende Motion-Grammatik wählen: DRAW, FOLLOW, REVEAL, SPLIT, MERGE, STACK, SHIFT, SWAP, EMPHASIZE, COUNT.
5. Erst danach Remotion-Code schreiben.
6. Nach dem Render dieselben vier Keyframes als PNG prüfen.

Bevorzugte Implementierung: `src/finance-motion/v3`.

V3 bevorzugt bewegte Editorial-Illustrationen und content-shaped compositions gegenüber animierten Karten oder Dashboard-Flächen.
