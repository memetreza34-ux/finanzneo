# Remotion-Animationen — bereits programmiert

Produktiver Code:
- `src/reels/dispo/animations.tsx`
- `src/reels/dispo/DispoKosten.tsx`

## Szene 02 — DispoMechanismAnimation
Kontostand bewegt sich sichtbar von Guthaben unter die 0-€-Linie. Der negative Bereich wird als genutzte Kreditlinie erklärt.

## Szene 03 — DailyInterestAnimation
Ein Zeitbalken läuft von 0 bis 365 Tagen. Gleichzeitig wird die vereinfachte Zinsrechnung für 1.500 € bei 12 % p.a. live hochgezählt.

## Szene 05 — InterestExampleAnimation
Drei nacheinander erscheinende Vergleichsblöcke: 30 Tage ≈ 14,79 €, 90 Tage ≈ 44,38 €, 365 Tage = 180 €.

## Szene 06 — SalaryHoleAnimation
2.000 € Beispielgehalt fließt sichtbar in ein bestehendes Minus von 1.500 €. Danach bleiben im Modell nur 500 € übrig. Dies erklärt den Liquiditätskreislauf, nicht eine allgemeine Gehaltsempfehlung.

## Szene 08 — RepaymentStepsAnimation
Drei große Schritte erscheinen nacheinander: echten Saldo sehen → Minus planmäßig senken → 0 € erreichen.

## Szene 09 — TermsCheckAnimation
Zwei große Konditionsfelder werden gegenübergestellt: `Dispozins` und `geduldete Überziehung`. Es werden bewusst keine erfundenen aktuellen Zinssätze eingesetzt.

## Timing-Vertrag
Alle sechs Komponenten erhalten `durationInFrames` aus der späteren finalen Audio-Timeline. `DispoKosten.tsx` verweigert bewusst ungelöste oder nicht-positive Szenendauern und enthält kein künstliches 6-Sekunden-Raster.