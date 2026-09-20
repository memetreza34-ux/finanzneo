# FinanzNeo — Phase-1-Animationscode-Standard

## Grundsatz

Eine Animationsszene ist **in Phase 1 kreativ und technisch fertig**. `remotion.md` allein reicht nicht. Phase 1 liefert zusätzlich eine produktionsreife `animation.tsx`, die Phase 3 direkt verwendet.

Phase 3 darf keine Animation neu erfinden, vereinfachen oder durch einen technischen Platzhalter ersetzen.

## Technischer Lock + visuelles Ziel

Technischer Kompatibilitäts-Lock:

```text
finanzneo-premium-physical-animation-v2
```

Kanonischer Motion Core für neue bzw. bewusst überarbeitete Reel-Animationen:

```text
finanzneo-motion-core-v1
Quelle: src/motion
```

Visuelles Ziel:

```text
finanzneo-stylized-3d-animated-black-v9
```

Der Premium-Lock bleibt für bestehende Seals stabil. Neue Produktionen nutzen zusätzlich den Motion Core V1. Die Optik folgt V9: klar nicht realistisch, soft rounded, vereinfacht, hochwertig und leicht verspielt.

## Pflichtdateien pro Animationsszene

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`scene-index.json` enthält `animationSourceFile`, `animationExport`, `animationIntent`, `animationQualityLock` und `animationPremiumVisualLock`. Neue Reels mit Motion-Direction-Contract führen zusätzlich die Motion-Core-/Mechanik-Metadaten und den Mechanik-Ledger.

## Motion Direction vor Code

Vor JSX wird nicht aus einer Effekt- oder Template-Liste ausgewählt. Die Reihenfolge ist:

```text
VOICEOVER-BEAT
→ FINANZ-AUSSAGE
→ SICHTBARES VERSTÄNDNISZIEL
→ PHYSISCHE URSACHE/WIRKUNG
→ MECHANIC_ID
→ HERO_OBJECT + SUPPORT_OBJECTS
→ PRIMARY_ACTION + MOTION_AXIS + RESULT_TYPE
→ START / ACTION / REACTION / RESULT / HOLD
→ REMOTION-CODE
```

Für neue Reels gilt `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`. Der `remotion-director` prüft vor Implementierung die anderen Animationsszenen desselben Reels und führt den Mechanik-Ledger.

Eine Mechanik-Familie ist eine **semantische Ursache/Wirkung**, keine starre Layout-Schablone. Wenn keine vorhandene Familie inhaltlich passt, darf eine neue Mechanik entstehen; sie muss aber begründet und physisch konkret sein.

## Kanonische Implementierungsquelle

Für neue oder bewusst überarbeitete Reel-Animationen zuerst aus `src/motion` importieren:

```ts
import {
  FN_MOTION,
  PremiumPhysicalStage,
  PhysicalObject,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalAccount,
  PhysicalReserveTank,
  PhysicalCalendarPage,
  PhysicalWasher,
} from '../../../../../../../src/motion';
```

Der konkrete relative Pfad hängt von der Szenenposition ab. `ANIMATION_COLORS` darf weiterhin aus den zentralen Brand-Tokens kommen.

Regeln:

- keine lokalen Kopien der Core-Primitives nur zum Restylen;
- szenenspezifische Objekte sind erlaubt, wenn die reale Handlung sie braucht;
- lokale Objekte möglichst auf `PhysicalObject` bzw. den Core-Primitives aufbauen;
- `FinanceMotionLab*`, alte Experimente und Legacy-Reels sind keine Stilautorität;
- Lottie, Three, Paths, Shapes und Motion Blur sind Support-Werkzeuge; Remotion bleibt Timeline-Autorität.

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
- eindeutige `MECHANIC_ID`
- konkrete `PRIMARY_ACTION`
- `ANIMATION_NARRATIVE`
- `PREMIUM_VISUAL_NARRATIVE`

Es gibt **keine feste Support-Objekt-Anzahl**. Ein starkes Objekt kann reichen; mehrere sind erlaubt, wenn sie die Aussage klarer machen. Der bestehende Source-Validator verlangt je nach aktivem Premium-Vertrag konkrete Realwelt-Instanzen; Klarheit bleibt wichtiger als dekorative Objektmenge.

Pflichtmarker:

```text
MECHANIC_ID: eindeutiger slug
PRIMARY_ACTION: konkrete physische Zustandsänderung

ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Ursache-Wirkungs-Veränderung
RESULT: konkretes sichtbares Ergebnis

PREMIUM_VISUAL_NARRATIVE
HERO: klares sichtbares Hauptmotiv
SUPPORT: nur sinnvolle unterstützende Objekte; keine feste Anzahl
MATERIAL: Material- und Farblogik
DEPTH: Vordergrund / Hauptmotiv / Hintergrund und Lichttrennung
```

## Anti-Wiederholung

Für alle Animationsszenen eines Reels wird geführt:

```text
SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE
```

Eine Szene muss neu entworfen werden, wenn sie die vorige Erklärung nur umbenennt oder dekorativ variiert.

Nicht als neue Mechanik zählen:

- andere Farbe
- anderes Label oder Icon
- Mirroring
- anderes Tempo
- Kamera-Zoom
- anderer Lottie-Akzent

Dieselbe `MECHANIC_ID` ist innerhalb eines Reels verboten. Treffen mindestens drei zentrale Ledger-Merkmale mit einer bereits verwendeten Animation zusammen, muss die physische Erklärung neu geprüft und in der Regel neu entworfen werden.

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
Visual: Y 320–1400
Caption: bottom 340
```

`AnimationStage` clippt produktive Animationen technisch auf **Y320–1400**. Phase-1-Code darf weiterhin im vollen 1080×1920-Koordinatensystem arbeiten, kann aber nicht sichtbar in Header- oder Caption-Zone hineinzeichnen.

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

## Visual QA

Source-Validator und Frame-0-Smoke-Test sind notwendige technische Gates, aber kein Beweis für gute Choreografie.

Bei neuer Mechanik, geändertem Core oder repräsentativem Pilotfall mindestens prüfen:

- Start
- Trigger
- Mitte der Hauptaktion
- Near Result
- Result Hold

Wenn praktikabel, vollständigen MP4-Render prüfen. Hero-/Support-Objekte dürfen weder Header- noch Caption-Safe-Zonen kreuzen.

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
- Mechanik-Ledger und Anti-Wiederholungs-Check bestanden sind, wenn der aktuelle Reel-Vertrag sie verlangt
- Code ohne Platzhalter vorliegt
- neue Animationen den kanonischen Motion Core verwenden, wenn der aktuelle Reel-Vertrag ihn verlangt
- Animation auch ohne Ton grundsätzlich verständlich ist
- sie optisch zur V9-Bildwelt passt
- der Stage keinen eigenen dekorativen Hintergrund erzeugt
- die Visualzone Y320–1400 sinnvoll gefüllt ist
- Phase 3 keinen kreativen Umbau mehr vornehmen muss
