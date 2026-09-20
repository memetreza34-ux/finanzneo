# FinanzNeo Motion Core V1

`src/motion` ist die kanonische Motion-Schicht für neue FinanzNeo-Reel-Animationen.
Alte `FinanceMotionLab*`-Compositions und `src/brand/components/PremiumPhysical.tsx` bleiben Technik-/Legacy-Kompatibilität, sind aber keine Stil- oder Importreferenz für neue Motion-Core-Reels.

## Motion-Grammatik

Jeder Erklärbeat folgt:

`STATE -> MECHANISM -> CHANGE -> RESULT -> HOLD`

Pflichtgedanke: Die Bewegung muss die Finanz-Aussage erklären. Bewegung nur für visuelle Aktivität ist kein gültiger Mechanismus.

## Dichte

- ein klares Hero-Objekt; ein starkes Hero darf allein reichen
- höchstens eine Support-Gruppe, wenn sie die Aussage wirklich klarer macht
- höchstens zwei gleichzeitig wichtige Bewegungen
- höchstens eine Kameraaktion
- keine dekorative Hintergrundanimation

Die numerischen Defaults stehen in `FN_MOTION`.

## Timeline

Alle zeitabhängigen Werte werden aus der Remotion-Timeline abgeleitet (`useCurrentFrame`, `interpolate`, `spring`).
Keine CSS-Transitions oder CSS-Keyframes für produktive Motion.

## Physical Primitives

Bevorzugt werden die zentralen Bausteine aus `src/motion`:

- `PremiumPhysicalStage`
- `PhysicalObject`
- `PhysicalBanknote` — eindeutiger Name für Geldschein/Werteinheit
- `PhysicalInvoice` — eindeutiger Name für Rechnung/Dokument
- `PhysicalCoinStack`
- `PhysicalAccount`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`

`PhysicalBill` bleibt innerhalb Motion Core V1 als Legacy-Alias für die bisherige Banknote erhalten. Neue Szenen sollen den semantisch eindeutigen Namen `PhysicalBanknote` verwenden.

Die Primitives enthalten bewusst keine eigene Dauerschleifen-Animation. Die Szene liefert Position, Progress und Zustand.

Die Basiskomponenten liefern Materialtiefe, Kanten, Highlights und Kontakt-/Bodenschatten zentral. Einzelne Szenen sollen diese Materiallogik nicht erneut erfinden.

## Materialrollen

- `neutral`: Kontext / neutrale Objekte
- `money`: Geld / Wert
- `warning`: Kosten / Risiko / Verlust
- `positive`: Lösung / Zielzustand

## Kanonische Mechanik-Registry

`mechanics.ts` ist die maschinenlesbare Quelle für die V1-Mechanik-Familien. Agenten, Validatoren und Dokumentation sollen diese Registry statt paralleler frei formulierter Listen verwenden, wenn technische Auswertung nötig ist.

Aktuell enthalten:

1. `fn-growth-build`
2. `fn-cost-extraction`
3. `fn-rebalance-transfer`
4. `fn-result-lock`
5. `fn-allocation-split`
6. `fn-account-transfer`
7. `fn-shock-buffer`
8. `fn-comparison-mass`
9. `fn-time-compounding`
10. `fn-positive-resolution`

`FinanzNeoMotionReferenceV1` zeigt diese zehn Erklärprinzipien visuell. Die Familien sind keine starren Templates. Neue Szenen dürfen andere konkrete Objekte und Choreografien verwenden, solange die Ursache/Wirkung zum Inhalt passt.

## Primitive Promotion

Szenenspezifische Objekte dürfen lokal entstehen, wenn kein Core-Primitive die reale Handlung sinnvoll ausdrückt.

Promotion-Regel:

1. einmalige Spezialform → lokal im Reel lassen;
2. echte Wiederverwendung in mindestens zwei unterschiedlichen Szenen/Reels → als Core-Kandidat markieren;
3. vor Promotion Semantik, Props, Materialrolle und Name vereinheitlichen;
4. erst danach nach `src/motion` verschieben/exportieren;
5. keine zwei fast identischen Core-Primitives mit anderem Namen pflegen.

Der `motion-core-curator` ist für diese Pflege zuständig.

## Art Direction

Der `remotion-director` entscheidet **was** sichtbar passieren muss. Der `motion-art-director` prüft danach **wie** die Mechanik hochwertig inszeniert wird: Proportionen, Materialität, Tiefe, Perspektive, Blickführung, Kamera, optisches Gewicht und Result-State.

Art Direction darf die Mechanik nicht ersetzen oder durch dekorative Effekte verschleiern.

## Importgrenzen

- Brand, Typografie, Header, Captions, Layout und allgemeine Design-Tokens: `src/brand` / `src/design-system`
- produktive Reel-Motion-Primitives, Timing und Mechanik-Registry: `src/motion`
- alte Physical-Exports aus `src/brand` bleiben nur für Legacy-Reels rückwärtskompatibel

## Lottie

Lottie ist eine Support-Schicht, kein Ersatz für die Hauptmechanik.
`LottieBox` bleibt standardmäßig `loop={false}`. Dauerloops sind für Erklärmechaniken zu vermeiden; wenn ein Lottie gebraucht wird, bekommt es ein eindeutiges Zeitfenster in der Remotion-Sequenz.

## Referenz

Die Remotion-Composition `FinanzNeoMotionReferenceV1` ist die visuelle Referenz für neue Motion-Arbeit.
Sie ist ein Showcase, kein veröffentlichbares Produktionsvideo.

Bei 30 fps umfasst sie 10 Szenen à 90 Frames und damit 30 Sekunden. Jede Szene endet in einem stabilen HOLD statt in dekorativer Dauerbewegung.
