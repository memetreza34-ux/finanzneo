# Remotion-Spezifikationen

Alle Zahlen müssen aus einer zentralen Calculation-/Data-Struktur kommen, nicht frei im JSX dupliziert werden. Animationen richten sich relativ nach der späteren echten Szenendauer.

## Szene 02 — fee-drag-flow
Start: voller goldener Geldstrom.
Aktion: ein kleiner warm-rot-oranger Kostenkanal zieht kontinuierlich Wert ab.
Ende: verbleibender emerald/goldener Strom ist sichtbar kleiner.
Phasen: Aufbau → Abzug beginnt → kontinuierlicher Effekt.

## Szene 04 — contribution-assumption-build
Start: 0 €.
Aktion: Monatsrate 200 € pulst wiederholt in einen Zähler; Zeitachse läuft bis 30 Jahre.
Ende: 72.000 € Einzahlungen. Separat klein und eindeutig: `Modell: 6 % p.a. vor Kosten`.
Keine Renditegarantie formulieren.

## Szene 05 — low-cost-growth
Daten: 200 €/Monat, 30 Jahre, 5,8 % Modell-Nettorendite.
Start: 0 €.
Aktion: Einzahlungen + Wachstum bauen dieselbe standardisierte Vermögensskala auf.
Ende: `ca. 188.000 €`.
Label: `0,2 % Kosten`.

## Szene 07 — high-cost-growth
Identische visuelle Skala und Laufzeit wie Szene 05.
Daten: 200 €/Monat, 30 Jahre, 4,5 % Modell-Nettorendite.
Ende: `ca. 149.000 €`.
Label: `1,5 % Kosten`.
Die niedrigere Endhöhe muss allein durch die Daten entstehen, nicht durch andere Skalierung.

## Szene 08 — cost-gap-39000
Start: beide Endwerte nebeneinander auf identischer Skala.
Aktion: Differenzbereich wird zwischen 188.000 € und 149.000 € isoliert.
Ende: `≈ 39.000 € Unterschied` groß, aber innerhalb Safe Area.
Kein zusätzlicher Prozentvergleich.

## Szene 10 — small-percent-big-euros-payoff
Start: zwei kleine Prozentchips `0,2 %` und `1,5 %`.
Aktion: beide laufen entlang derselben 30-Jahre-Zeitachse.
Ende: die Chips transformieren zu den bereits eingeführten Endwerten; Differenz erscheint als goldener Stapel.
Merksatz als Remotion-Headline: `Kleine Prozente. Große Wirkung.`
CTA erst im letzten Abschnitt: `Folge FinanzNeo`.

## Gemeinsame QA
- keine Dashboard-Kartenwand
- mindestens 3 sichtbare Ablaufphasen je Animation
- klare Zustandsänderung
- keine statischen Tails
- Caption-Safe-Area frei halten
- Gold nur für Wert/Geld, Rot-Orange nur für Kosten/Verlust
- gleiche Vergleichsskala in Szenen 05/07/08
- echte Szenendauer erst nach finalem Audio