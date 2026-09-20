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
Mechanik-Registry: src/motion/mechanics.ts
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

Neue Motion-Core-Reels besitzen außerdem:

```text
05-projektdateien/motion-mechanic-ledger.md
05-projektdateien/visual-qa.md
```

## Motion Direction vor Code

Vor JSX wird nicht aus einer Effekt- oder Template-Liste ausgewählt. Die Reihenfolge ist:

```text
VOICEOVER-BEAT
→ FINANZ-AUSSAGE
→ SICHTBARES VERSTÄNDNISZIEL
→ PHYSISCHE URSACHE/WIRKUNG
→ MECHANIC_ID
→ HERO_OBJECT + OPTIONALER SUPPORT
→ PRIMARY_ACTION + MOTION_AXIS + RESULT_TYPE
→ START / ACTION / REACTION / RESULT / HOLD
→ REMOTION-CODE
→ MOTION ART DIRECTION
→ PLAYWRIGHT VISUAL QA
```

Für neue Reels gilt `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`. Der `remotion-director` prüft vor Implementierung die anderen Animationsszenen desselben Reels und führt den Mechanik-Ledger.

Eine Mechanik-Familie ist eine **semantische Ursache/Wirkung**, keine starre Layout-Schablone. `src/motion/mechanics.ts` ist die maschinenlesbare V1-Registry. Wenn keine vorhandene Familie inhaltlich passt, darf eine neue Mechanik entstehen; sie muss aber begründet und physisch konkret sein.

## Kanonische Implementierungsquelle

Für neue oder bewusst überarbeitete Reel-Animationen zuerst aus `src/motion` importieren:

```ts
import {
  FN_MOTION,
  PremiumPhysicalStage,
  PhysicalObject,
  PhysicalBanknote,
  PhysicalInvoice,
  PhysicalCoinStack,
  PhysicalAccount,
  PhysicalReserveTank,
  PhysicalCalendarPage,
  PhysicalWasher,
} from '../../../../../../../src/motion';
```

Der konkrete relative Pfad hängt von der Szenenposition ab. `ANIMATION_COLORS` darf weiterhin aus den zentralen Brand-Tokens kommen.

`PhysicalBill` bleibt als kompatibler alter Motion-Core-Name für die Banknote exportiert. Neue Szenen verwenden wegen der eindeutigen Semantik `PhysicalBanknote` bzw. `PhysicalInvoice`.

Regeln:

- keine lokalen Kopien der Core-Primitives nur zum Restylen;
- szenenspezifische Objekte sind erlaubt, wenn die reale Handlung sie braucht;
- lokale Objekte möglichst auf `PhysicalObject` bzw. den Core-Primitives aufbauen;
- ein starkes Hero darf allein reichen; Support-Objekte nur bei echtem Verständnisgewinn;
- `FinanceMotionLab*`, alte Experimente und Legacy-Reels sind keine Stilautorität;
- alte Physical-Exports aus `src/brand` / `src/design-system` bleiben Legacy-Kompatibilität und sind für Motion-Core-V1 keine kanonische Quelle;
- Lottie, Three, Paths, Shapes und Motion Blur sind Support-Werkzeuge; Remotion bleibt Timeline-Autorität.

## Technischer Code-Vertrag

Jede `animation.tsx` enthält:

- `useCurrentFrame`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- `PremiumPhysicalStage`
- mindestens ein klares physisches Hero-Objekt
- mindestens eine semantische Materialrolle `neutral`, `money`, `warning` oder `positive`
- den in `scene-index.json` genannten Export
- `RESULT_HOLD_FRAMES >= 15`
- eindeutige `MECHANIC_ID`
- konkrete `PRIMARY_ACTION`
- `ANIMATION_NARRATIVE`
- `PREMIUM_VISUAL_NARRATIVE`

Für Motion-Core-V1 gilt zusätzlich im Contract:

```text
singleHeroObjectAllowed=true
supportingObjectCountFlexible=true
clarityBeforeObjectCount=true
```

Es gibt **keine feste Support-Objekt-Anzahl**. Ein starkes Objekt kann reichen; mehrere sind erlaubt, wenn sie die Aussage klarer machen. Kein Validator darf wieder eine Mindestquote von zwei oder drei konkreten `Physical*`-Instanzen erzwingen.

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

Dieselbe `MECHANIC_ID` ist innerhalb eines Reels in Motion Core V1 standardmäßig verboten. Treffen mindestens drei zentrale Ledger-Merkmale mit einer bereits verwendeten Animation zusammen, muss die physische Erklärung neu geprüft und in der Regel neu entworfen werden.

## Primitive Promotion

Einmalige szenenspezifische Objekte bleiben lokal. Erst bei echter Wiederverwendung in mindestens zwei unterschiedlichen Szenen/Reels prüft der `motion-core-curator`, ob ein Objekt nach `src/motion` gehört.

Vor Promotion müssen Semantik, Props, Materialrolle und Name stabil sein. Keine Promotion nur wegen langer JSX-Datei; keine zweite fast identische Core-Komponente mit anderem Namen.

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

## Motion Art Direction

Nach korrekter Mechanik und Code prüft `.agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md`:

- Hero-Größe und visuelle Dominanz
- Proportionen
- Materialität
- Kontakt-/Bodenschatten
- Tiefenstaffelung
- Perspektive
- optische Zentrierung
- Blickführung
- Kamera-Support
- RESULT HOLD als saubersten Zustand

Art Direction darf die Mechanik nicht verändern, nur hochwertig inszenieren.

## Visual QA — hartes Gate für neue Motion-Core-Reels

Source-Validator und Frame-0-Smoke-Test sind notwendige technische Gates, aber kein Beweis für gute Choreografie.

Mindestens prüfen:

- START
- TRIGGER
- MID-MECHANISM
- NEAR RESULT
- FINAL RESULT HOLD

Wenn praktikabel, vollständigen MP4-Render prüfen. Hero-/Support-Objekte dürfen weder Header- noch Caption-Safe-Zonen kreuzen.

`05-projektdateien/visual-qa.md` beginnt bei neuen Motion-Core-Reels mit:

```text
MOTION_ART_DIRECTION=PENDING
PLAYWRIGHT_VISUAL_QA=PENDING
```

Vor produktivem Phase-3-Render müssen nach echter Sichtprüfung gelten:

```text
MOTION_ART_DIRECTION=PASS
PLAYWRIGHT_VISUAL_QA=PASS
```

Keine Szenenzeile darf noch `PENDING` oder `FAIL` sein. `reel:phase3:preflight` blockiert andernfalls. PASS-Marker dürfen niemals nur gesetzt werden, um den Validator zu umgehen.

## Phase-3-Sperre

Bei erfolgreichem `reel:ready` entsteht:

```text
05-projektdateien/phase1-animation-seal.json
```

Danach gilt:

- Phase 3 verwendet direkt diese Datei.
- `componentPath` darf nicht auf eine Ersatzkomponente zeigen.
- kreative Motion-Änderungen gehen zurück in Phase 1.
- Motion-Core-V1-Reels benötigen zusätzlich ein grünes Art-Direction-/Playwright-Gate vor `reel:render`.
