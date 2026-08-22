# Remotion-Spezifikation scene-05

- **Komponente:** `TwoHouseholdBudgetWeights`
- **Headline:** `GLEICHES EINKOMMEN. ANDERE RATE.`
- **Beispielbasis:** zwei identische Monatsbudgets à `2.000 €`

## Startzustand

Links und rechts stehen zwei identische goldene Budget-Stapel. Beide zeigen `2.000 €`. Darüber kleine Labels `HAUSHALT A` und `HAUSHALT B`. Größe, Position und Ausgangswert sind exakt gleich.

## Handlung

1. Beide Budget-Stapel zerlegen sich sichtbar in dieselben vier Kategorien: Wohnen, Mobilität, Lebensmittel, Energie.
2. Die Blöcke von Haushalt A ordnen sich mit großem Mobilitätsanteil an; Haushalt B erhält einen deutlich kleineren Mobilitätsblock. Die Gesamthöhe beider Budgets bleibt gleich.
3. Ein identischer Rot-Orange-Impuls `KRAFTSTOFF +23 %` trifft beide Mobilitätsblöcke.
4. Aus jedem Mobilitätsblock wird proportional zu seiner sichtbaren Größe ein Druckarm auf eine separate Belastungswaage übertragen.
5. Bei Haushalt A schlägt die Waage deutlich weiter aus, bei B geringer. Es wird bewusst keine persönliche Prozentzahl ausgegeben.

## Endzustand

Oben bleiben die beiden gleichen `2.000 €` sichtbar. Darunter sind die unterschiedlichen Budgetgewichte und zwei verschieden starke Belastungsausschläge gleichzeitig zu sehen. Zwischen beiden Systemen erscheint kurz und ruhig: `ANDERE GEWICHTE`.

## Mechanismus

`gleiche Ausgangsbasis → unterschiedliche Ausgabenverteilung → gleicher Preisimpuls → unterschiedliche Wirkung`

## Motion-Regeln

- Budgetblöcke müssen sich physisch aus dem identischen Ausgangsstapel bilden, nicht einfach einblenden.
- Die Gesamtsumme bleibt optisch bei beiden gleich; nur die Verteilung ändert sich.
- Preisimpuls auf beide Haushalte zeitgleich, damit Ursache und Unterschied vergleichbar bleiben.
- Keine fiktive persönliche Inflationsrate.
- Kein statisches Tortendiagramm.
- Kein Dashboard-/App-Look.
- Keine Zoom-/Fade-Sequenz als Hauptmechanismus.
- Finale Dauer und Trigger aus echtem Voiceover ableiten.
