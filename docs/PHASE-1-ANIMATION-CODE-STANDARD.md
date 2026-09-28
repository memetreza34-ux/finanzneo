# FinanzNeo — Phase-1-Animationscode-Standard

## Grundsatz

Eine Animationsszene ist **in Phase 1 kreativ und technisch fertig**. `remotion.md` allein reicht nicht. Phase 1 liefert zusätzlich eine produktionsreife `animation.tsx`, die Phase 3 direkt verwendet.

Phase 3 darf keine Animation neu erfinden, vereinfachen oder durch einen technischen Platzhalter ersetzen.

Diese Änderung betrifft **nur Animationen**. Bildwelt, Flow-Prompts, Bildszenen, Cover, Layout, Captions, Audio und der restliche 3-Phasen-Workflow bleiben unverändert.

## Technischer Lock + visuelles Ziel

Technischer Kompatibilitäts-Lock bleibt absichtlich stabil:

```text
finanzneo-premium-physical-animation-v2
```

Finance Motion Library:

```text
finanzneo-finance-motion-library-v1
```

Visuelles Ziel bleibt unverändert:

```text
finanzneo-stylized-3d-animated-black-v9
```

Der technische Lock bleibt für bestehende Seals stabil. Die neue Library ersetzt keine Bildwelt und migriert keine bestehenden Reels.

## Kernprinzip: Content-first, dann Library oder Custom

Für jede Animationsszene gilt diese Reihenfolge:

```text
SPRECHPUNKT
→ WAS MUSS DER ZUSCHAUER SICHTBAR VERSTEHEN?
→ WELCHE HAUPTMECHANIK ZEIGT DAS AM KLARSTEN?
→ FINANCE MOTION LIBRARY AUF ECHTEN BEST-FIT PRÜFEN
→ PASSEND: LIBRARY PARAMETRISIEREN
→ NICHT PASSEND: INDIVIDUELLE ANIMATION BAUEN
→ PRODUKTIONSREIFE animation.tsx
```

Die Library ist ein Werkzeugkasten, **kein Zwangsmenü**. Eine vorhandene Mechanik wird nur genutzt, wenn sie die Aussage wirklich erklärt. Eine gute Library-Mechanik darf beliebig oft wiederverwendet werden, auch innerhalb eines Reels, wenn die Finanzlogik dieselbe ist.

Individuelle Animationen bleiben ausdrücklich erlaubt. Ist eine neue Custom-Mechanik später sinnvoll verallgemeinerbar, kann sie als neuer Library-Baustein aufgenommen werden.

## Finance Motion Library V1

Die Library liegt unter:

```text
src/finance-motion/index.tsx
```

Startbestand:

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

Alle Library-Mechaniken sind parametrisiert. Werte, Labels, Gewichtungen, Zeitpunkte und semantische Rollen werden pro Szene gesetzt. Template-Füllmaterial ist verboten.

## Pflichtdateien pro Animationsszene

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`scene-index.json` enthält weiterhin `animationSourceFile`, `animationExport`, `animationIntent`, `animationQualityLock` und `animationPremiumVisualLock`.

## Motion-Director-Pflicht

Jede fertige `animation.tsx` dokumentiert:

```text
MOTION_SOURCE: library-best-fit | custom-build
FINANCE_MOTION_ID: <library-slug> | none
MECHANIC_ID: semantische Mechanik
FOCAL_PATH: was das Auge von Start bis Ergebnis verfolgt
PRIMARY_ACTION: Hauptbewegung, die die Aussage erklärt
CAMERA_ROLE: still | follow | push | reframe + konkrete Rolle
PAYOFF: klarer sichtbarer Endzustand

ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Ursache / Veränderung
RESULT: konkretes sichtbares Ergebnis

PREMIUM_VISUAL_NARRATIVE
HERO: klares sichtbares Hauptmotiv
SUPPORT: nur sinnvolle unterstützende Elemente
MATERIAL: Material- und Farblogik
DEPTH: räumliche Staffelung, wenn sinnvoll
```

Zusätzlich gilt:

```text
RESULT_HOLD_FRAMES >= 15
```

## Technischer Code-Vertrag

### Bei `library-best-fit`

- `FINANCE_MOTION_ID` muss in `FINANCE_MOTION_REGISTRY` existieren.
- Die Szene importiert die passende Mechanik aus `src/finance-motion`.
- Die Parameter müssen exakt aus dem Sprechpunkt abgeleitet sein.
- Ein dünner, klarer Wrapper ist erlaubt; die eigentliche Motion-Logik liegt in der Library.
- Die Mechanik darf wiederverwendet werden.

### Bei `custom-build`

- `FINANCE_MOTION_ID: none`
- `useCurrentFrame`
- zentrale `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- framegenaue, nachvollziehbare Motion-Logik
- vollständige individuelle visuelle Geschichte

### Nicht mehr verpflichtend

Folgende Punkte sind **keine Qualitäts-Pflicht mehr**:

- `PremiumPhysicalStage`
- `PhysicalObject`
- `PhysicalBill`, `PhysicalAccount`, `PhysicalWasher` oder andere konkrete Physical-Primitives
- mindestens zwei Realweltobjekte
- mindestens drei `interpolate`-/`spring`-Variablen
- eine weltweit oder innerhalb des Reels einzigartige Mechanik

Diese Bausteine bleiben verfügbar, wenn sie für eine konkrete Szene wirklich passen.

## Visuelle Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARE URSACHE / HAUPTAKTION
→ REAKTION / VERÄNDERUNG
→ EINDEUTIGER PAYOFF
→ ERGEBNIS MINDESTENS 15 FRAMES STABIL
```

Die Bewegung erklärt die Aussage. Dekorative Bewegung zählt nicht als Mechanik.

## Motion-Hierarchie

Eine hochwertige Szene braucht nicht möglichst viele Bewegungen, sondern eine klare Hierarchie:

1. **Primary Action** — trägt die Aussage.
2. **Secondary Reaction** — zeigt die Konsequenz der Hauptaktion.
3. **Camera Role** — unterstützt die Aufmerksamkeit oder bleibt bewusst still.
4. **Payoff Hold** — lässt das Ergebnis lesbar stehen.

Eine einzige sehr klare Bewegung kann hochwertiger sein als fünf unabhängige Bewegungen.

## Bühne und Hintergrund

Die bestehende V5-Bühne bleibt unverändert:

```text
Header: Y 154
Visual: Y 320–1400
Caption: bottom 340
```

`AnimationStage` clippt produktive Animationen weiter technisch auf **Y320–1400**.

Der einzige Reel-Hintergrund bleibt der zentrale statische Canvas:

```text
#000000
```

Library- und Custom-Animationen bleiben transparent und erzeugen keine eigene dekorative Hintergrundwelt.

## Weiterhin verboten

- `Math.sin` / `Math.cos` als künstliches Dauerwackeln
- wackelnde Rechtecke
- Debug-Boxen und Testflächen
- Dummy-/Placeholder-Komponenten
- Dashboard-/Control-Panel-Komposition als Hauptsprache
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien als Haupterklärung
- generische Info-Cards als Hauptsprache
- reine Texttafel
- reine Zoom-/Fade-/Popup-Bewegung als komplette Erkläranimation
- Lade-/Fortschrittsbalken als Ersatz für die eigentliche Finanzmechanik
- Bewegung nur für Frame-Diff
- eigener dekorativer Partikel-/Aurora-/Grid-/Gradient-Hintergrund
- schwarzer Inhalt auf schwarzem Canvas
- TODO / TBD / PLACEHOLDER / TEMP
- eine Library-Animation zu benutzen, nur weil sie verfügbar ist

## Phase-3-Sperre

Bei erfolgreichem `reel:ready` entsteht weiterhin:

```text
05-projektdateien/phase1-animation-seal.json
```

Danach gilt:

- Phase 3 verwendet direkt die versiegelte Quelle.
- `componentPath` darf nicht auf eine Ersatzkomponente zeigen.
- `componentExport` muss stimmen.
- Der SHA-256-Hash muss unverändert bleiben.
- Fehlendes Binding blockiert den Render.
- Phase 3 darf nicht eigenmächtig zwischen Library und Custom wechseln.

## Fertig bedeutet

Phase 1 darf eine Animationsszene erst als fertig markieren, wenn:

- gesprochener Satz und Mechanik 1:1 zusammenpassen
- Start, Hauptaktion, Reaktion und Ergebnis konkret sichtbar sind
- Focal Path und Primary Action eindeutig sind
- Library-Best-Fit geprüft wurde
- entweder eine passend parametrisierte Library-Mechanik oder ein begründeter Custom-Build vorliegt
- Code ohne Platzhalter vorliegt
- Animation auch ohne Ton grundsätzlich verständlich ist
- sie optisch zum bestehenden FinanzNeo-Reel passt
- der Stage keinen eigenen dekorativen Hintergrund erzeugt
- die Visualzone Y320–1400 sinnvoll gefüllt ist
- Phase 3 keinen kreativen Umbau mehr vornehmen muss
