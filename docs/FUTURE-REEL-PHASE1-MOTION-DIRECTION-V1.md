# FinanzNeo Future Reel — Phase 1 Motion Direction

`PHASE1_MOTION_DIRECTION: finanzneo-phase1-hybrid-motion-v2`

Dieser Standard gilt für neue Animationsszenen.

## Scope

Nur die **Animation** wird hier entschieden. Header, Captions, Cover und Bildszenen sind nicht Teil dieser Regel.

## Kernregel

> Erst den Sprechpunkt verstehen. Dann die einfachste sichtbare Veränderung entwickeln. Erst danach Technik oder Library wählen.

## Pflichtreihenfolge

```text
Sprechpunkt
→ sichtbares Verständnisziel
→ visuelle Frage
→ einfachste klare Mechanik
→ Editorial Motion Library auf echten Best-Fit prüfen
→ library-best-fit ODER custom-build
→ motionDesign
→ animation.tsx
```

## Visuelle Richtung

Neue Animationen folgen:

```text
MOTION_WORLD: finanzneo-editorial-motion-v1
VISUAL_TARGET_WORLD: finanzneo-editorial-finance-v1
```

Das bedeutet:

- 2D / leichtes 2.5D bevorzugt
- matte einfache Formen
- wenige große Elemente
- flexible helle oder gedämpfte Flächen
- kein Schwarz-/3D-Zwang
- keine Physical-Primitives als Standard
- keine Kamerabewegung als Pflicht
- eine klare Bewegung darf vollständig reichen

## Sichtbare Frage

Vor der Technik wird gefragt:

- Was wächst oder schrumpft?
- Was kommt hinzu oder fällt weg?
- Was bewegt sich von A nach B?
- Was verändert sich über Zeit?
- Was wird verglichen?
- Was wird aufgeteilt?
- Was wird teurer oder günstiger?
- Wie nähert sich etwas einem Ziel?

## Keine feste Animationsliste

Unzulässig:

```text
Wir haben Animation A, B und C.
→ Welche passt ungefähr?
```

Gewünscht:

```text
Sprechpunkt
→ beste sichtbare Veränderung
→ passende vorhandene Mechanik prüfen
→ falls nicht passend: individuell bauen
```

## Editorial Motion Library

```text
FINANCE_MOTION_LIBRARY: finanzneo-editorial-motion-library-v1
```

Die Library liegt unter:

```text
src/finance-motion/editorial-v2.tsx
```

Wiederverwendung ist erlaubt, wenn dieselbe Mechanik tatsächlich wieder die klarste Erklärung ist.

## Pflichtfelder in phase1MotionDirection

- `spokenPoint`
- `viewerMustUnderstand`
- `visualQuestion`
- `chosenMechanism`
- `mechanismRationale`
- `implementationDecision`
- `financeMotionId`
- `libraryFitReason`
- `parameterPlan`
- `customReason`
- `libraryPromotionCandidate`

## Qualitätsregel

Eine Animation ist erst richtig geplant, wenn man ohne Code erklären kann:

1. was der Zuschauer verstehen soll,
2. was sich sichtbar verändert,
3. warum genau diese Veränderung reicht,
4. warum zusätzliche Motion nicht nötig oder sinnvoll ist.

## Kurzregel

> **Nicht möglichst viel animieren. Genau das animieren, was den Satz verständlicher macht — im selben Editorial-Stil wie die neue Bildwelt.**
