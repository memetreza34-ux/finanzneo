# Motion-Mechanik-Ledger

Jede Animations- und Datenszene bekommt genau eine Mechanik. Dieselbe Mechanik
darf im Reel nicht zweimal vorkommen.

| Szene | MECHANIC_ID | Hauptaktion | Abgrenzung |
|---|---|---|---|
| scene-03 | `measured-decade-with-marked-drawdown` | Der Pfad zeichnet sich von links nach rechts, der Tiefpunkt faellt als markierter Kreis ein. | Als einzige Szene im Reel zeichnet hier eine gemessene Reihe sich selbst; Szene 5 vergleicht Objekte, Szene 6 stapelt Flaechen. |
| scene-05 | `selling-at-the-low-locks-the-loss` | Beide Werte fallen, links wird entnommen und bleibt stehen, rechts steigt weiter. | Als einzige Szene arbeitet hier ein Objektpaar gegeneinander; Szene 3 und 6 zeichnen Flaechen statt Gegenstaende. |
| scene-06 | `contributions-and-interest-stack-apart` | Beide Flaechen wachsen nach rechts, die goldene Zinsflaeche wird sichtbar die groessere. | Als einzige Szene teilt hier eine Flaeche sich in zwei Anteile; Szene 3 zeichnet eine Linie, Szene 5 bewegt Gegenstaende. |

Keine Wiederverwendung: alle drei Mechaniken sind neu erfunden (reuseDecision = invent-new).
