# Daten / Rechenweg — visual-32

## Quelle

- Verbraucherzentrale Hamburg: „Milka Alpenmilch ist Mogelpackung des Jahres 2025“ (vzhh.de). Im Bild oben links: „Quelle: Verbraucherzentrale Hamburg · Mogelpackung des Jahres 2025“.
- Markenname nur als Text („Milka Alpenmilch“), kein Logo, keine Markenfarbe.

## Werte

- Füllmenge: 100 g → 90 g (−10 g = −10 %).
- Preis pro Tafel: 1,49 € → 1,99 € (+0,50 €).
- Preis pro 100 g vorher: 1,49 € : 100 g × 100 g = 1,49 €.
- Preis pro 100 g jetzt: 1,99 € : 90 g × 100 g = 2,2111 € → angezeigt 2,21 €.
- Versteckte Preiserhöhung: 2,2111 / 1,49 = 1,4840 → +48,4 %; angezeigt „+48 %“ (abgerundet; Skript: „über achtundvierzig Prozent“).
- Im Code per throw abgesichert (2,21 € und ganzzahlig 48 %).

## Darstellung

- Tafel aus 10 gleich großen Spalten à 10 g; 90 g = exakt 9 von 10 Spalten (Proportionsdarstellung, nicht die echte Stückzahl der Tafel).
- Balken „Preis pro 100 g“ exakt im Verhältnis 1,49 : 2,2111 (Skala 0–2,2111 € auf 880 px); der rote Teil ist genau der Mehrpreis 0,7211 €.
