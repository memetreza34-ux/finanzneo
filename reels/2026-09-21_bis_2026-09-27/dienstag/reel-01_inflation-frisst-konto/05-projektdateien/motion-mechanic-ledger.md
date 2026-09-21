# Motion-Mechanik-Ledger

Jede Animations- und Datenszene bekommt genau eine Mechanik. Dieselbe Mechanik
darf im Reel nicht zweimal vorkommen.

| Szene | MECHANIC_ID | Hauptaktion | Abgrenzung |
|---|---|---|---|
| scene-03 | `same-sum-lower-purchasing-power` | Der rechte Balken sinkt auf 7.812 Euro, die Differenz bleibt als roter Block stehen. | Als einzige Szene arbeitet hier ein Balkenpaar; Szene 6 bewegt Gegenstaende, Szene 8 zeichnet eine Linie. |
| scene-06 | `amount-stays-purchasing-power-shrinks` | Der Kalender laeuft von Jahr 1 auf Jahr 10, der Stapel verliert dabei Muenzen. | Als einzige Szene bewegen sich hier echte Gegenstaende; Szene 3 und 8 zeichnen Formen. |
| scene-08 | `measured-decade-with-marked-drawdown` | Der Pfad zeichnet sich von links nach rechts, der Tiefpunkt faellt als markierter Kreis ein. | Als einzige Szene zeichnet hier eine gemessene Reihe sich selbst. |

Keine Wiederverwendung: alle drei Mechaniken sind neu erfunden (reuseDecision = invent-new).
