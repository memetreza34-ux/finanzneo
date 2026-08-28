# FinanzNeo — Phase-1-Animationscode-Standard

## Grundsatz

Eine Animationsszene ist **in Phase 1 kreativ und technisch fertig**. `remotion.md` allein reicht nicht. Phase 1 liefert zusätzlich eine produktionsreife `animation.tsx`, die Phase 3 direkt verwendet.

Phase 3 darf keine Animation neu erfinden, vereinfachen oder durch einen technischen Platzhalter ersetzen.

## Technischer Lock + visuelles Ziel

Technischer Kompatibilitäts-Lock:

```text
finanzneo-premium-physical-animation-v2
```

Visuelles Ziel:

```text
finanzneo-stylized-3d-animated-black-v9
```

Der Lock bleibt für bestehende Seals stabil. Die Optik folgt trotzdem V9: klar nicht realistisch, soft rounded, vereinfacht, hochwertig und leicht verspielt.

## Pflichtdateien pro Animationsszene

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`scene-index.json` enthält `animationSourceFile`, `animationExport`, `animationIntent`, `animationQualityLock` und `animationPremiumVisualLock`.

## Technischer Code-Vertrag

Jede `animation.tsx` enthält:

- `useCurrentFrame`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- `PremiumPhysicalStage`
- mindestens ein echtes `PhysicalObject` als sichtbares Hauptmotiv
- mindestens eine semantische Materialrolle `neutral`, `money`, `warning` oder `positive`
- den in `scene-index.json` genannten Export
- `RESULT_HOLD_FRAMES >= 15`
- `ANIMATION_NARRATIVE`
- `PREMIUM_VISUAL_NARRATIVE`

Es gibt **keine feste Support-Objekt-Anzahl**. Ein starkes Objekt kann reichen; mehrere sind erlaubt, wenn sie die Aussage klarer machen.

Pflichtmarker:

```text
ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Veränderung
RESULT: konkretes sichtbares Ergebnis

PREMIUM_VISUAL_NARRATIVE
HERO: klares sichtbares Hauptmotiv
SUPPORT: nur sinnvolle unterstützende Objekte; keine feste Anzahl
MATERIAL: Material- und Farblogik
DEPTH: Vordergrund / Hauptmotiv / Hintergrund und Lichttrennung
```

## Visuelle Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARE URSACHE / VERÄNDERUNG
→ EINDEUTIGES ERGEBNIS
→ ERGEBNIS MINDESTENS 15 FRAMES STABIL
```

Die Bewegung erklärt die Aussage. Sie existiert nicht nur, damit Pixel sich ändern.

## V9-Komposition

- klar nicht realistische stylized-3D-Animationswelt
- soft rounded / vereinfachte erkennbare Formen
- eine klare Hauptaktion
- Support-Objekte nur wenn inhaltlich hilfreich
- sichtbare Materialität, Dicke und Tiefenstaffelung
- Weiß/Ivory/Soft Gray neutral
- Gold Geld/Wert
- Rot-Orange Kosten/Warnung
- Emerald Fokus/Lösung
- Visualzone groß und verständlich nutzen

V5-Bühne:

```text
Header: Y 154
Visual: Y 320–1480
Caption: bottom 340
```

## Hintergrund — strikt getrennt vom Inhalt

`PremiumPhysicalStage` bleibt **transparent**.

Der einzige Reel-Hintergrund ist der zentrale Remotion-Canvas:

```text
#000000
statisch
```

In einer Animation verboten:

- `FNBgAurora`
- `FNBgParticles`
- `FNBgGrid`
- `FNBgRadial`
- Partikelfelder
- Aurora/Glow-Flächen
- bewegte Grids
- dekorative Hintergrund-Gradienten/Vignetten
- Hintergrundbewegung als Frame-Diff-Hack

Objekte dürfen selbstverständlich Material-Highlights, Schatten und lokale Oberflächenverläufe besitzen. Verboten ist die **dekorative Hintergrundebene**, nicht die 3D-Materialgestaltung der Objekte.

## Weitere Verbote

- `Math.sin` / `Math.cos` als künstliches Dauerwackeln
- wackelnde Rechtecke
- Debug-Boxen und Testflächen
- Dummy-/Placeholder-Komponenten
- Dashboard-/Control-Panel-Komposition
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- generische Info-Cards als Hauptsprache
- reine Texttafel
- reine Zoom-/Fade-/Popup-Bewegung als komplette Erkläranimation
- Bewegung nur für Frame-Diff
- schwarzer Inhalt auf schwarzem Canvas
- TODO / TBD / PLACEHOLDER / TEMP
- „erst Tests bestehen, später hübsch machen“

## Phase-3-Sperre

Bei erfolgreichem `reel:ready` entsteht:

```text
05-projektdateien/phase1-animation-seal.json
```

Danach gilt:

- Phase 3 verwendet direkt diese Datei.
- `componentPath` darf nicht auf eine Ersatzkomponente zeigen.
- `componentExport` muss stimmen.
- Der SHA-256-Hash muss unverändert bleiben.
- Fehlendes Binding blockiert den Render.

## Fertig bedeutet

Phase 1 darf eine Animationsszene erst als fertig markieren, wenn:

- gesprochener Satz und Mechanik 1:1 zusammenpassen
- Start, Veränderung und Ergebnis konkret sichtbar sind
- Code ohne Platzhalter vorliegt
- Animation auch ohne Ton grundsätzlich verständlich ist
- sie optisch zur V9-Bildwelt passt
- der Stage keinen eigenen dekorativen Hintergrund erzeugt
- die Visualzone sinnvoll gefüllt ist
- Phase 3 keinen kreativen Umbau mehr vornehmen muss
