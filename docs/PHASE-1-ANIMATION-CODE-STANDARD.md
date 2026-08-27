# FinanzNeo — Phase-1-Animationscode-Standard

## Grundsatz

Eine Animationsszene ist **in Phase 1 kreativ und technisch fertig**.
`remotion.md` allein reicht nicht. Phase 1 liefert zusätzlich eine produktionsreife `animation.tsx`, die Phase 3 direkt verwendet.

Phase 3 darf keine Animation neu erfinden, vereinfachen oder durch einen technischen Platzhalter ersetzen.

## Premium Visual Lock

Zusätzlich zum technischen Lock gilt:

```text
finanzneo-premium-physical-animation-v2
```

Die Animation muss dieselbe visuelle Sprache wie die Flow-Bilder verwenden: große physische Objekte, sichtbare Materialität, Tiefe, cinematic lighting und klare Ursache-Wirkung. Eine Animation darf nicht wie ein Dashboard oder Flowchart aussehen, wenn die Bildszene daneben wie eine hochwertige 3D-Objektwelt aussieht.

## Pflichtdateien pro Animationsszene

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`scene-index.json` enthält:

```json
{
  "animationSourceFile": "EINZELNE-SZENEN/scene-XX/animation.tsx",
  "animationExport": "SceneXXAnimation",
  "animationIntent": "Konkrete sichtbare Kette von Start über Mechanismus zum Ergebnis.",
  "animationQualityLock": "finanzneo-phase1-animation-code-v1",
  "animationPremiumVisualLock": "finanzneo-premium-physical-animation-v2"
}
```

## Technischer Code-Vertrag

Jede `animation.tsx` enthält:

- `useCurrentFrame`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- `PremiumPhysicalStage`
- mindestens zwei echte `PhysicalObject`-Instanzen
- mindestens eine semantische Materialrolle `neutral`, `money`, `warning` oder `positive`
- den in `scene-index.json` genannten Export
- `RESULT_HOLD_FRAMES` mit mindestens `15`
- `ANIMATION_NARRATIVE`
- `PREMIUM_VISUAL_NARRATIVE`

Pflichtmarker:

```text
ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Veränderung
RESULT: konkretes sichtbares Ergebnis

PREMIUM_VISUAL_NARRATIVE
HERO: großes dominantes physisches Hauptobjekt
SUPPORT: 2–4 konkrete unterstützende Objekte
MATERIAL: Material- und Farblogik
DEPTH: Vordergrund / Hero-Ebene / Hintergrund und Lichttrennung
```

## Visuelle Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARE PHYSISCHE URSACHE / VERÄNDERUNG
→ EINDEUTIGES ERGEBNIS
→ ERGEBNIS MINDESTENS 15 FRAMES STABIL
```

Die Bewegung erklärt die Aussage. Sie existiert nicht nur, damit Pixel sich ändern.

## Premium-Komposition

- ein großes Hero-Objekt dominiert die Szene
- nur 2–4 unterstützende konkrete Objekte
- Hero und Support müssen größer und kräftiger wirken als Text
- mittlere bis nahe 3/4-Perspektive statt kleiner isometrischer Gesamtansicht
- sichtbare Dicke, Bevels, Materialkanten und Gewicht
- Kontakt-Schatten + Ambient-Occlusion-Eindruck
- klare Vordergrund-/Hero-/Hintergrundstaffelung
- Motiv nutzt die V5-Visualzone sichtbar aus
- Weiß/Creme für neutrale Information
- Gold für Geld/Wert
- Rot-Orange für Kosten/Warnung
- Grün für Fokus/Lösung
- kein monochrom-grüner Gesamtlook

V5-Bühne:

```text
Header: Y 154
Visual: Y 320–1480
Caption: bottom 340
```

## Verboten

- `Math.sin` / `Math.cos` als künstliches Dauerwackeln
- wackelnde Rechtecke
- Debug-Boxen und Testflächen
- Dummy-/Placeholder-Komponenten
- Dashboard-/Control-Panel-Komposition
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- generische Info-Cards als Hauptsprache
- UI-Kacheln, Pills oder HUD-Look
- rein monochrom-grüne Szene
- reine Texttafel
- reine Zoom-/Fade-/Popup-Bewegung als komplette Erkläranimation
- Bewegung nur für Frame-Diff
- schwarzer Text auf dunklem Hintergrund
- TODO / TBD / PLACEHOLDER / TEMP
- „erst Tests bestehen, später hübsch machen“

## Phase-3-Sperre

Bei erfolgreichem `reel:ready` entsteht:

```text
05-projektdateien/phase1-animation-seal.json
```

Darin steht der SHA-256-Hash jeder kanonischen `animation.tsx`.

Danach gilt:

- Phase 3 verwendet direkt diese Datei.
- `componentPath` darf nicht auf eine Ersatzkomponente zeigen.
- Der Hash muss unverändert bleiben.
- Wird die Datei nach `reel:ready` verändert, blockiert der Preflight.

## Fertig bedeutet

Phase 1 darf eine Animationsszene erst als fertig markieren, wenn:

- gesprochener Satz und Mechanik 1:1 zusammenpassen
- Start, Veränderung und Ergebnis konkret sichtbar sind
- Code ohne Platzhalter vorliegt
- Animation auch ohne Ton grundsätzlich verständlich ist
- sie optisch **dieselbe Premium-Objektwelt wie die Flow-Bilder** besitzt
- Hero-Objekt, Materialkontrast, Tiefe und Licht sichtbar stark genug sind
- Phase 3 keinen kreativen Umbau mehr vornehmen muss
