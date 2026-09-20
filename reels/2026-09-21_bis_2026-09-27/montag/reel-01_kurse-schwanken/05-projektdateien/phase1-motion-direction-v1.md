# Phase 1 Motion Direction V1

PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1
MOTION_CORE: finanzneo-motion-core-v1
CANONICAL_MOTION_SOURCE: src/motion
MECHANIC_REGISTRY: src/motion/mechanics.ts

## Verbindliche Reihenfolge

Sprechpunkt analysieren -> sichtbares Verständnisziel -> visuelle Frage -> physische Ursache/Wirkung -> eindeutige MECHANIC_ID -> Hero/Support -> individuell beste Hauptmechanik -> passende Technik -> motionDesign -> animation.tsx -> Motion Art Direction -> Playwright Visual QA.

## Motion Core ist kein Animations-Menü

`src/motion` ist die kanonische technische Basis für Stage, Physical-Primitives, Timing und Springs. Die Mechanik-Familien in `src/motion/mechanics.ts` sind semantische Ursache/Wirkungs-Referenzen, keine fertigen Layout-Schablonen. Bestehende Animationen, Lotties, Icons, SVGs oder frühere Mechaniken sind Werkzeuge und Referenzen, niemals das kreative Auswahlmenü. Jede Animationsszene wird zuerst aus ihrem Inhalt hergeleitet.

## Wiederverwendung

Wiederverwendung ist erlaubt, wenn dieselbe Technik für diesen Sprechpunkt wirklich die klarste Lösung ist, etwa für Vergleich oder bewusste Kontinuität. Dann reuseDecision=reuse-best-fit setzen, reusedTechniqueId angeben und reuseJustification konkret ausfüllen. Reuse nur aus Bequemlichkeit ist verboten.

## Anti-Wiederholung

Vor Code alle Animationsszenen des Reels in `motion-mechanic-ledger.md` vergleichen. Dieselbe MECHANIC_ID ist standardmäßig verboten. Wenn mindestens drei Kerndimensionen aus Hero, Primary Action, Motion Axis, Result Type und Mechanik-Familie übereinstimmen, die physische Erklärung neu entwerfen. Farbe, Text, Icon, Mirroring, Timing, Kamera oder Lottie-Akzent zählen nicht als neue Mechanik.

## Art Direction + Visual QA

Nach der inhaltlich/technisch fertigen Animation prüft der Motion Art Director Proportionen, Materialität, Tiefe, Perspektive, Blickführung, Kamera und RESULT HOLD. Danach prüft Playwright START, TRIGGER, MID-MECHANISM, NEAR RESULT und FINAL RESULT HOLD. Vor Phase-3-Render müssen beide Gates in `visual-qa.md` explizit PASS sein.

## Pflichtfelder

Jede Animationsszene dokumentiert phase1MotionDirection mit spokenPoint, viewerMustUnderstand, visualQuestion, chosenMechanism, mechanismRationale, mechanicId, heroObject, supportObjects, primaryAction, motionAxis, resultType, uniquenessRationale, reuseDecision, reusedTechniqueId und reuseJustification.
