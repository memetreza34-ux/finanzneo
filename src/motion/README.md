# FinanzNeo Motion Core V1

`src/motion` ist die kanonische Motion-Schicht für neue FinanzNeo-Animationen.
Alte `FinanceMotionLab*`-Compositions bleiben Technik-Sandboxes und sind keine Stilreferenz.

## Motion-Grammatik

Jeder Erklärbeat folgt:

`STATE -> MECHANISM -> CHANGE -> RESULT -> HOLD`

Pflichtgedanke: Die Bewegung muss die Finanz-Aussage erklären. Bewegung nur für visuelle Aktivität ist kein gültiger Mechanismus.

## Dichte

- ein Hero-Objekt
- höchstens eine Support-Gruppe
- höchstens zwei gleichzeitig wichtige Bewegungen
- höchstens eine Kameraaktion
- keine dekorative Hintergrundanimation

Die numerischen Defaults stehen in `FN_MOTION`.

## Timeline

Alle zeitabhängigen Werte werden aus der Remotion-Timeline abgeleitet (`useCurrentFrame`, `interpolate`, `spring`).
Keine CSS-Transitions oder CSS-Keyframes für produktive Motion.

## Physical Primitives

Bevorzugt werden die zentralen Bausteine aus `physical.tsx`:

- `PremiumPhysicalStage`
- `PhysicalObject`
- `PhysicalBill`
- `PhysicalCoinStack`
- `PhysicalAccount`
- `PhysicalReserveTank`
- `PhysicalCalendarPage`
- `PhysicalWasher`

Sie enthalten bewusst keine eigene Dauerschleifen-Animation. Die Szene liefert Position, Progress und Zustand.

Die Basiskomponenten liefern Materialtiefe, Kanten, Highlights und Kontakt-/Bodenschatten zentral. Einzelne Szenen sollen diese Materiallogik nicht erneut erfinden.

## Materialrollen

- `neutral`: Kontext / neutrale Objekte
- `money`: Geld / Wert
- `warning`: Kosten / Risiko / Verlust
- `positive`: Lösung / Zielzustand

## Zehn kanonische Mechaniken

`FinanzNeoMotionReferenceV1` zeigt aktuell zehn wiederverwendbare Erklärprinzipien:

1. Wachstum / Kapitalaufbau
2. Kostenabzug / Verlust durch Mechanismus
3. Rebalancing / Transfer zwischen Zuständen
4. Result-Lock / stabiles Ergebnis
5. Aufteilung / Allocation Split
6. Konto-zu-Konto-Transfer
7. Schockpuffer / Notgroschen absorbiert Belastung
8. Ergebnisvergleich A gegen B
9. Zeit + Zinseszinseffekt
10. Positive Resolution / stabiler Zielzustand

Das sind keine starren Vorlagen. Neue Szenen dürfen andere konkrete Objekte verwenden, sollen aber zuerst prüfen, ob ihre Aussage mit einer dieser Mechaniken klar erklärbar ist.

## Lottie

Lottie ist eine Support-Schicht, kein Ersatz für die Hauptmechanik.
`LottieBox` bleibt standardmäßig `loop={false}`. Dauerloops sind für Erklärmechaniken zu vermeiden; wenn ein Lottie gebraucht wird, bekommt es ein eindeutiges Zeitfenster in der Remotion-Sequenz.

## Referenz

Die Remotion-Composition `FinanzNeoMotionReferenceV1` ist die visuelle Referenz für neue Motion-Arbeit.
Sie ist ein Showcase, kein veröffentlichbares Produktionsvideo.

Bei 30 fps umfasst sie 10 Szenen à 90 Frames und damit 30 Sekunden. Jede Szene endet in einem stabilen HOLD statt in dekorativer Dauerbewegung.
