# Remotion-Spezifikation visual-25

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Preise und Angebote
- Sprechtext-Bezug: Verbrauchertests finden immer wieder Großpackungen, die pro Kilo teurer sind. Darum gibt es den Grundpreis.
- Inhaltlicher Brief (Phase 1 Content): Rechenbeispiel (als „Beispiel“ gekennzeichnet): kleine Packung 200 g für 1,49 € und große Packung 500 g für 4,29 €. Zuerst sieht man nur die Endpreise; dann wird der Grundpreis pro Kilo ausgerechnet und eingeblendet: 7,45 €/kg vs. 8,58 €/kg → die große Packung ist pro Kilo teurer.
- Startet bei: „Das stimmt aber nicht immer“ · Stufen bei: „Das stimmt aber nicht immer“ · „Verbrauchertests finden“ · „pro Kilo teurer“ · „Darum gibt es den Grundpreis“ · „Also der Preis pro Kilo“
- Viewer Change: Kleine Packung 200 g für 1,49 € und große Packung 500 g für 4,29 € — nach der Rechnung Preis : kg steht 7,45 € gegen 8,58 € pro kg, und diese Grundpreise wandern auf die Preisschilder; die große Packung ist pro Kilo 1,13 € teurer.
- Animation Intent: „Groß heißt billig“ wird widerlegt, indem die Rechnung vor den Augen passiert und ihr Ergebnis genau dort landet, wo es im Laden steht: als kleine Zahl unter dem großen Preis.
- Mechanik: pack-price-to-unit-price-reveal
- Technik-ID: shelf-labels-with-calculated-unit-price-move-in
- Technikbeschreibung: Regal mit zwei flachen Packungen (Fläche exakt 200 : 500) und Preisschildern; Rechnung Preis : kg blendet ein, Ergebnis zählt hoch, wandert als Grundpreis auf das Schild (Magic Move) mit Markierung; Endpreise treten zurück, Badge +1,13 € pro kg.
- Tool Stack: Remotion, React, src/design-system/daten.tsx
- Composition Family: shelf-label-calculation
- Motion Signature Camera: still
- Motion Signature Layout: zwei Packungen auf Regalboden, Preisschilder darunter, Rechnung unter den Schildern
- Motion Signature Transformation: Rechenergebnis wandert als Grundpreis aufs Schild
- Startzustand: Regalboden, kleine Packung „200 g“ und große „500 g“ (Flächen im Verhältnis 2 : 5), Preisschilder nur mit 1,49 € und 4,29 €.
- sichtbare Mechanik/Transformation: Bei „Verbrauchertests finden“ erscheinen „1,49 € : 0,2 kg =“ und „4,29 € : 0,5 kg =“; bei „pro Kilo teurer“ zählen 7,45 € (grün) und 8,58 € pro kg (rot) hoch, Badge „+1,13 € pro kg“.
- Resultat: Bei „Darum gibt es den Grundpreis“ wandern die Ergebnisse in die Grundpreis-Zeile der Schilder (Label „Grundpreis“, goldene Markierung), die Rechnung blendet aus; bei „Also der Preis pro Kilo“ treten die großen Endpreise grau zurück.
- Concept A: Zwei Balken €/kg ohne Packungen — korrekt, aber ohne den Alltagsbezug „große Packung im Regal“.
- Concept B: Regal mit Packungen und echten Preisschildern; Rechnung unter dem Schild, Ergebnis wandert als Grundpreis aufs Schild.
- Concept C: Waage, auf der die Packungen auf 1 kg „aufgefüllt“ werden (5 kleine bzw. 2 große) — anschaulich, aber 5 × 1,49 und 2 × 4,29 erzeugen zusätzliche Zwischenwerte und Gedränge.
- Chosen Concept: B — verbindet die Rechnung direkt mit dem Ort, an dem der Zuschauer sie im Laden findet (passt zu visual-26 „die kleine Zahl unter dem großen Preis“).
- Keyframe 10%: Packungen und Schilder mit Endpreisen, noch keine Rechnung.
- Keyframe 35%: Rechnung steht, Grundpreise zählen gerade hoch.
- Keyframe 65%: Grundpreise sind ins Schild gewandert und markiert, Badge +1,13 € pro kg.
- Keyframe 90%: Endpreise grau zurückgenommen, Grundpreise 7,45 € / 8,58 € pro kg dominieren.
- Sichtbare Zustände: nur Endpreise 1,49 € und 4,29 € → Rechnung 1,49 € : 0,2 kg und 4,29 € : 0,5 kg → 7,45 € gegen 8,58 € pro kg, +1,13 € → Grundpreis steht auf dem Schild
- Motion Channels: Rechnung Preis : kg erscheint, Grundpreis zählt hoch, Ergebnis wandert aufs Schild, Endpreis tritt zurück, Grundpreis markiert
- SFX-Cues: optional leiser Rechen-Tick beim Ergebnis (Beat „pro Kilo teurer“), weiches Einrasten beim Ankommen auf dem Schild (Beat „Darum gibt es den Grundpreis“ + 26).

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual25Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 67, 147, 249, 384] Frames, Vorschau-Dauer 500 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Ergebnis steht spätestens ca. 60 Frames nach dem letzten Beat.
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Quelle/Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Rechenbeispiel, oben links „Beispielrechnung“.
