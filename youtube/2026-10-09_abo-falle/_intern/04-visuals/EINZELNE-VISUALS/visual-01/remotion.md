# Remotion-Spezifikation visual-01

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 1 — 9,99 € sind nicht 9,99 €
- Sprechtext-Bezug: 9,99 € × 12 = 119,88 € für ein einziges Abo
- Startet bei: „Neun Euro neunundneunzig im Monat“ · Stufen bei: „Neun Euro neunundneunzig“ · „nicht einmal“ · „zwölfmal“ · „hundertneunzehn“
- Viewer Change: Eine einzelne Abbuchung von 9,99 € wird sichtbar zu zwölf Abbuchungen und verschmilzt zu 119,88 € im Jahr.
- Animation Intent: Der Zuschauer soll den Jahresbetrag nicht ausrechnen müssen, sondern sehen, wie er Monat für Monat entsteht.
- Mechanik: card-to-chip-monthly-stack-merge
- Technikbeschreibung: Abbuchungskarte schrumpft samt Inhalt zum Januar-Chip; jeder Monat wirft einen Chip unter seinem Monat in einen wertgenauen Jahresbalken; Zähler springt beim Landen; Chips verschmelzen, Klammer zeichnet sich.
- Tool Stack: Remotion, React, @remotion/paths, src/youtube-motion/szenen/AboJahr.tsx, src/design-system/daten.tsx
- Composition Family: single-object-transformation
- Motion Signature Camera: still, leichter Push beim Ergebnis
- Motion Signature Layout: Monatsleiste oben, Jahresbalken darunter, Summe mittig
- Motion Signature Transformation: Karte → Chip → Balken → Summe (Magic Move)
- Sichtbare Zustände: Abbuchungskarte −9,99 € → Karte wird Januar-Chip → Zwölf Chips im Jahresbalken → 119,88 € im Jahr
- Motion Channels: Karte schrumpft zum Chip, Chips fallen in den Balken, Zähler springt, Verschmelzen und Klammer
- Regeln: Größen aus Werten (skala), wertzeigende Federn ohne Überschwingen, Inhalt oberhalb der Untertitel-Zone (y ≤ 860), Quelle oben links
- SFX-Cues: optional bei Landungen/Einrasten (Phase 3)
