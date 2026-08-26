# FinanzNeo — Phase-1-Animationscode-Standard

## Grundsatz

Eine Animationsszene ist **in Phase 1 kreativ und technisch fertig**.
`remotion.md` allein reicht nicht mehr. Phase 1 liefert zusätzlich eine
produktionsreife `animation.tsx`, die Phase 3 direkt verwendet.

Phase 3 darf keine Animation neu erfinden, vereinfachen oder durch einen
technischen Platzhalter ersetzen.

## Pflichtdateien pro Animationsszene

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`scene-index.json` enthält zusätzlich:

```json
{
  "animationSourceFile": "EINZELNE-SZENEN/scene-XX/animation.tsx",
  "animationExport": "SceneXXAnimation",
  "animationIntent": "Konkrete sichtbare Kette von Start über Mechanismus zum Ergebnis.",
  "animationQualityLock": "finanzneo-phase1-animation-code-v1"
}
```

## Code-Vertrag

Jede `animation.tsx` ist vollständiger React-/Remotion-Code und enthält:

- `useCurrentFrame`
- `AnimationStage`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- den in `scene-index.json` genannten Export
- `RESULT_HOLD_FRAMES` mit mindestens `15`
- einen Kommentarblock `ANIMATION_NARRATIVE`

Beispiel für die Pflichtmarker:

```text
ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Veränderung
RESULT: konkretes sichtbares Ergebnis
```

Diese Marker sind keine Deko. Sie müssen exakt zur sichtbaren Mechanik im Code
passen.

## Visuelle Qualitätsregel

Eine gute FinanzNeo-Animation zeigt:

```text
STARTZUSTAND
→ SICHTBARE URSACHE / VERÄNDERUNG
→ EINDEUTIGES ERGEBNIS
→ ERGEBNIS MINDESTENS 15 FRAMES STABIL
```

Die Bewegung erklärt die Aussage. Sie existiert nicht nur, damit Pixel sich
ändern.

Die V5-Bühne liegt ungefähr bei:

```text
Header: Y 154
Visual: Y 320–1480
Caption: bottom 340
```

Animationen sollen die Visualzone sichtbar nutzen und optisch auf derselben
Höhe wie die Bildszenen sitzen.

## Verboten

- `Math.sin` / `Math.cos` als künstliches Dauerwackeln für Frame-Diff
- wackelnde Rechtecke
- Debug-Boxen
- bunte Testflächen
- Dummy-/Placeholder-Komponenten
- generische Cards + Text ohne sichtbaren Mechanismus
- reine Zoom-/Fade-/Popup-Bewegung als komplette Erkläranimation
- zufällige Dauerbewegung
- schwarzer Text auf dunklem Hintergrund
- TODO / TBD / PLACEHOLDER / TEMP
- „erst technisch bestehen, später hübsch machen"

## Phase-3-Sperre

Bei erfolgreichem `reel:ready` schreibt das Repo:

```text
05-projektdateien/phase1-animation-seal.json
```

Darin steht der SHA-256-Hash jeder kanonischen `animation.tsx`.

Danach gilt:

- Phase 3 verwendet direkt diese Datei.
- `componentPath` darf nicht auf eine Ersatzkomponente zeigen.
- Der Hash muss unverändert bleiben.
- Wird die Datei nach `reel:ready` verändert, blockiert der Preflight.

Damit kann Phase 3 das Completion-Gate nicht mehr mit einer selbst gebauten
Wackel-/Debug-Komponente umgehen.

## Fertig bedeutet

Phase 1 darf eine Animationsszene erst als fertig markieren, wenn:

- der gesprochene Satz und die Mechanik 1:1 zusammenpassen
- Start, Veränderung und Ergebnis konkret sichtbar sind
- Code ohne Platzhalter vorliegt
- Animation auch ohne Ton grundsätzlich verständlich ist
- Layout, Farben und Materiallogik zum FinanzNeo-Reel passen
- die Animation ohne kreativen Umbau durch Phase 3 gerendert werden kann
