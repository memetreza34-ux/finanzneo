# Daten / Rechenweg — visual-25

Rechenbeispiel, im Bild oben links als „Beispielrechnung“ gekennzeichnet. Rechtsgrundlage Grundpreis: § 4 PAngV (siehe 01-recherche/recherche-quellen.md).

## Werte

| Packung | Füllmenge | Endpreis | Rechnung | Grundpreis |
|---|---|---|---|---|
| klein | 200 g = 0,2 kg | 1,49 € | 1,49 € : 0,2 kg | 7,45 € pro kg |
| groß | 500 g = 0,5 kg | 4,29 € | 4,29 € : 0,5 kg | 8,58 € pro kg |

- Differenz: 8,58 € − 7,45 € = 1,13 € pro kg → große Packung pro Kilo teurer.
- Im Code in Cent gerechnet: round(149 × 1000 / 200) = 745, round(429 × 1000 / 500) = 858; per throw abgesichert.

## Darstellung

- Packungsflächen exakt im Verhältnis der Füllmenge 200 : 500 (Seitenlängen × √2,5).
- Der Grundpreis zählt beim Ausrechnen hoch und steht im Ergebnis exakt.
