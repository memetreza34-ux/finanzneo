# Remotion-Animationen

## Szene 02 — `PriceLevelMechanismAnimation`
Start: gleicher 100-€-Token und Warenkorb.
Prozess: Preisniveau-Leiste steigt; einzelne Preise bewegen sich gemeinsam nach oben; Warenkorb verliert relativ an Reichweite.
Ergebnis: derselbe Euro kauft weniger.

## Szene 03 — `BasketPriceOverTimeAnimation`
Start: Warenkorb heute = 100 €.
Prozess: Zeitachse 0 → 5 → 10 → 20 Jahre, Preis wächst im 3-%-Modell kontinuierlich.
Ergebnis: ca. 181 € nach 20 Jahren.

## Szene 05 — `PurchasingPowerTimelineAnimation`
Start: 10.000 € heutige Kaufkraft.
Prozess: Zeitmarker 5/10/20 Jahre; realer Wert fällt nachvollziehbar entlang einer Kurve.
Ergebnis: 8.626 → 7.441 → 5.537 €.

## Szene 06 — `BuyingPowerLossAnimation`
Start: 100 gleich große Waren-/Kaufkraft-Tiles.
Prozess: rund 45 % der Tiles werden durch rote Preiswelle neutralisiert/ausgeblendet, während der Nominalblock 10.000 € stehen bleibt.
Ergebnis: etwa 55 % heutige Kaufkraft verbleibt.

## Szene 08 — `NominalVsRealAnimation`
Start: zwei identische 10.000-€-Werte.
Prozess: Nominal-Linie bleibt horizontal, reale Kaufkraftlinie fällt über Zeit.
Ergebnis: sichtbar getrennte Größen `NOMINAL` vs. `REAL`.

## Szene 09 — `SamePurchasingPowerTargetAnimation`
Start: heutiger Warenkorb / Zielwert 10.000 €.
Prozess: 20-Jahres-Zeitachse + 3-%-Preisentwicklung erhöhen den benötigten nominalen Zielbetrag.
Ergebnis: rund 18.061 € nominal für dieselbe Modell-Kaufkraft.

## Qualitätsgate
Jede Animation besitzt Start → Mechanismus → Ergebnis und nutzt den gesamten VisualViewport sinnvoll. Keine Szene zählt als Animation, wenn nur Icon/Zahl/Text/Balken ein- oder ausfadet.
