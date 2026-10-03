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

Finance Motion Library — aktiver Standard für neue Reels:

```text
finanzneo-finance-motion-library-v1
Quelle: src/finance-motion/index.tsx
```

Motion Core V1 — gilt weiter für Reels, die bereits mit `motionCoreVersion` angelegt wurden:

```text
finanzneo-motion-core-v1
Quelle: src/motion
Mechanik-Registry: src/motion/mechanics.ts
```

Visuelles Ziel bleibt unverändert:

```text
finanzneo-stylized-3d-animated-black-v9
```

Der technische Lock bleibt für bestehende Seals stabil. Die neue Library ersetzt keine Bildwelt und migriert keine bestehenden Reels. Motion-Core-V1-Reels behalten ihre Regeln (siehe „Legacy: Motion Core V1“). Die Optik folgt V9: klar nicht realistisch, soft rounded, vereinfacht, hochwertig und leicht verspielt.

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

Die Library liegt unter `src/finance-motion`. Reels importieren **immer** aus dem Ordner selbst:

```ts
import {ValueGrowth} from '../../../../../../src/finance-motion';
```

Der Index liefert automatisch die aktuelle Fassung. Die Dateien `direction-v2*.tsx` und die Exporte mit Endung `V1` sind Historie für die Labs und kein Import für neue Reels.

### Kern-Mechaniken (`tier: 'core'`, Finance Motion Core V3)

Sie zeigen eine **Menge über Zeit** und sind die erste Wahl:

| ID | Komponente | zeigt |
|---|---|---|
| `value-growth` | `ValueGrowth` | ein Betrag wächst vom Start- auf den Endwert |
| `value-drain` | `ValueDrain` | Kosten ziehen Münze für Münze Wert ab |
| `compound-growth` | `CompoundGrowth` | Zuwächse werden pro Zeitraum größer |
| `scenario-comparison` | `ScenarioComparison` | gleicher Start, unterschiedliches Ergebnis, Lücke als Zahl |
| `loan-paydown` | `LoanPaydown` | jede Rate schlägt eine Scheibe von der Schuld ab |
| `money-split` | `MoneySplit` | ein Betrag verteilt sich auf Töpfe |

Gemeinsame Sprache: Münzen sind Geld, ihre Höhe ist der Betrag. Beträge werden als **Zahlen** übergeben (`startValue={10000}`, nicht `'10.000 €'`); Formatierung, Einheit (`unit`: `€`, `%` oder leer) und Nachkommastellen (`decimals`) übernimmt die Mechanik. Höhen bleiben proportional zum Betrag, Zähler landen exakt auf dem Wert aus dem Sprechpunkt, Beschriftungen zeigen immer die echte Zahl.

### Situative Mechaniken (`tier: 'situational'`)

`money-transfer`, `allocation-split`, `rebalancing`, `diversification`, `protection-limit` und `finance-timeline` zeigen ein Verhältnis oder eine Situation, keine Veränderung über Zeit. Für sie gilt die Reihenfolge aus `CLAUDE.md` §5: meist erklärt ein **Flow-Bild oder eine Datenszene** besser. Jeder Registry-Eintrag nennt in `preferInstead`, was stattdessen passt. Nutzen ist erlaubt, braucht aber in `libraryFitReason` eine Begründung, warum hier trotzdem Bewegung nötig ist.

### Prüfung

- Lab `ReelsTestFinanceMotionCore` zeigt die Kern-Mechaniken über den kanonischen Import.
- `npm run smoke:finance-motion` prüft je Mechanik Start, Aktion und Ergebnis auf sichtbaren Unterschied und misst für die Kern-Mechaniken die Bildbelegung mit denselben Schwellen wie die Future-V3-Render-QA (Peak ≥ 0,15, Median ≥ 0,12).

Alle Library-Mechaniken sind parametrisiert. Werte, Labels, Gewichtungen, Zeitpunkte und semantische Rollen werden pro Szene gesetzt. Template-Füllmaterial ist verboten.

## Pflichtdateien pro Animationsszene

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

`scene-index.json` enthält weiterhin `animationSourceFile`, `animationExport`, `animationIntent`, `animationQualityLock` und `animationPremiumVisualLock`.

Neue Reels besitzen außerdem:

```text
05-projektdateien/visual-qa.md
```

Motion-Core-V1-Reels führen zusätzlich `05-projektdateien/motion-mechanic-ledger.md`.

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

- `FINANCE_MOTION_ID` muss in `FINANCE_MOTION_REGISTRY` existieren; Kern-Mechaniken (`tier: 'core'`) zuerst prüfen.
- Die Szene importiert die passende Mechanik aus `src/finance-motion` (Ordner, nicht Einzeldatei).
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
- **keine feste Support-Objekt-Anzahl**; Inhalt und Klarheit bestimmen, wie viele Support-Elemente sinnvoll sind

Diese Bausteine bleiben verfügbar, wenn sie für eine konkrete Szene wirklich passen.

## Legacy: Motion Core V1

Gilt nur für Reels, deren `phase1MotionDirectionContract` die `motionCoreVersion` `finanzneo-motion-core-v1` trägt. Neue Reels laufen über die Finance Motion Library. Bestehende Motion-Core-Reels werden nicht migriert und behalten diese Regeln.

### Motion Direction vor Code

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

Für Motion-Core-V1-Reels gilt `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`. Der `remotion-director` prüft vor Implementierung die anderen Animationsszenen desselben Reels und führt den Mechanik-Ledger.

Eine Mechanik-Familie ist eine **semantische Ursache/Wirkung**, keine starre Layout-Schablone. `src/motion/mechanics.ts` ist die maschinenlesbare V1-Registry. Wenn keine vorhandene Familie inhaltlich passt, darf eine neue Mechanik entstehen; sie muss aber begründet und physisch konkret sein.

### Kanonische Implementierungsquelle

Motion-Core-V1-Animationen importieren zuerst aus `src/motion`:

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

### Technischer Code-Vertrag

Jede Motion-Core-V1-`animation.tsx` enthält:

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

### Anti-Wiederholung

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

### Primitive Promotion

Einmalige szenenspezifische Objekte bleiben lokal. Erst bei echter Wiederverwendung in mindestens zwei unterschiedlichen Szenen/Reels prüft der `motion-core-curator`, ob ein Objekt nach `src/motion` gehört.

Vor Promotion müssen Semantik, Props, Materialrolle und Name stabil sein. Keine Promotion nur wegen langer JSX-Datei; keine zweite fast identische Core-Komponente mit anderem Namen.

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

## Visual QA — hartes Gate für neue Reels

Source-Validator und Frame-0-Smoke-Test sind notwendige technische Gates, aber kein Beweis für gute Choreografie.

Mindestens prüfen:

- START
- TRIGGER
- MID-MECHANISM
- NEAR RESULT
- FINAL RESULT HOLD

Wenn praktikabel, vollständigen MP4-Render prüfen. Hero-/Support-Objekte dürfen weder Header- noch Caption-Safe-Zonen kreuzen.

`05-projektdateien/visual-qa.md` beginnt bei neuen Reels mit:

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

Bei erfolgreichem `reel:ready` entsteht weiterhin:

```text
05-projektdateien/phase1-animation-seal.json
```

Danach gilt:

- Phase 3 verwendet direkt die versiegelte Quelle.
- `componentPath` darf nicht auf eine Ersatzkomponente zeigen.
- kreative Motion-Änderungen gehen zurück in Phase 1.
- `componentExport` muss stimmen.
- Der SHA-256-Hash muss unverändert bleiben.
- Fehlendes Binding blockiert den Render.
- Phase 3 darf nicht eigenmächtig zwischen Library und Custom wechseln.
- Neue Reels und Motion-Core-V1-Reels benötigen zusätzlich ein grünes Art-Direction-/Playwright-Gate vor `reel:render`.

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
