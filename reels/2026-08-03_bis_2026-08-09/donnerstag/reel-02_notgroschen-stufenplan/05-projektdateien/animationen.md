# Animationen – Notgroschen in drei Stufen

Diese Datei ist für die technische Umsetzung des Reels. Google Flow erzeugt für diese Szenen KEINE Bilder.

## Szene 03 – TargetRangeAnimation
Sprechtext: Als Daumenregel nennt die Verbraucherzentrale zwei bis drei Monatsgehälter. Die passende Höhe hängt aber von deiner persönlichen Situation ab.

Ablauf:
1. Ein Monatsgehalt erscheint als Referenz.
2. Zwei Monatsgehälter werden sichtbar.
3. Drei Monatsgehälter ergänzen die obere Orientierung.
4. Die starre Spanne öffnet sich zu einem persönlichen Zielkorridor.

Endzustand: Zwei bis drei Monatsgehälter als Daumenregel, klar als individuell anpassbar dargestellt.

## Szene 05 – ThreeStageAnimation
Sprechtext: Danach sicherst du einen Monat deiner notwendigen Ausgaben. Erst dann wächst der Puffer bis zu deinem persönlichen Ziel.

Ablauf:
1. Stufe 1: 500 Euro Mini-Puffer.
2. Stufe 2: ein Monat notwendige Ausgaben.
3. Stufe 3: persönliches Ziel.

Endzustand: 500 Euro → 1 Monat notwendige Ausgaben → persönliches Ziel.

## Szene 07 – ExampleTargetAnimation
Sprechtext: Bei 1.800 Euro netto wären zwei bis drei Monatsgehälter 3.600 bis 5.400 Euro.

Ablauf:
1. 1.800 Euro Monatsnetto erscheint.
2. 1.800 × 2 = 3.600 Euro.
3. 1.800 × 3 = 5.400 Euro.
4. Beide Ergebnisse bilden den Beispiel-Zielkorridor.

## Szene 08 – SavingsTimelineAnimation
Sprechtext: Mit 150 Euro monatlich hast du den 500-Euro-Puffer im vierten Monat und 3.600 Euro nach 24 Monaten.

Ablauf:
1. Start Monat 0 bei 0 Euro.
2. Jeden Monat 150 Euro hinzufügen.
3. Im vierten Monat sind 600 Euro erreicht und damit die 500-Euro-Marke überschritten.
4. Weiter bis Monat 24.
5. Endzustand: 24 × 150 Euro = 3.600 Euro.

## Technische Regeln
- Text, Zahlen, Beträge und Labels ausschließlich in Remotion.
- Keine extern generierten Bilder für Animationsszenen.
- Keine Dashboard-Karten als Ersatz für echte visuelle Abläufe.
- Phasen relativ zur tatsächlichen Szenendauer steuern.
- Animation vollständig vor Szenenende abschließen.
- Finale Szenenlängen erst nach finalem Voiceover und echten Wort-Zeitstempeln festlegen.
