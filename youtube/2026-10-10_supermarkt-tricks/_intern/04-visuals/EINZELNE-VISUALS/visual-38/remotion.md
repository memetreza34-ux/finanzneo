# Remotion-Spezifikation visual-38

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 5 — Was dich das kostet
- Sprechtext-Bezug: Annahme: 10 € pro Woche ungeplant = über 40 € im Monat = 520 € im Jahr.
- Inhaltlicher Brief (Phase 1 Content): Rechenbeispiel (als „Annahme“ gekennzeichnet): 52 Wochenfelder füllen sich nacheinander mit je 10 €; Zwischenstand nach 4 Wochen „über 40 € im Monat“; Endstand 520 € im Jahr.
- Startet bei: „Machen wir ein einfaches Rechenbeispiel“ · Stufen bei: „Machen wir ein einfaches“ · „Du kaufst jede Woche“ · „Zehn Euro pro Woche“ · „über vierzig Euro“ · „Und fünfhundertzwanzig Euro“
- Viewer Change: Ein leeres Jahr aus 52 Wochenfeldern füllt sich Woche für Woche mit 10 €; nach 4 Wochen steht der Zähler auf 40 € („über 40 € im Monat“), am Ende sind alle 52 Felder rot und der Zähler zeigt 520 € im Jahr.
- Animation Intent: Kleine wöchentliche Beträge wirken harmlos; das sich füllende Jahr macht sichtbar, wie aus jeweils 10 € in Summe 520 € werden, und jedes Feld ist genau 10 € wert.
- Mechanik: week-calendar-fill-count-up
- Technik-ID: fifty-two-week-grid-column-fill-with-month-bracket
- Technikbeschreibung: Raster aus 52 Wochenfeldern (13 Spalten à 4 Wochen) füllt sich spaltenweise mit roten 10-€-Feldern; der Zähler ist immer exakt 10 € × gefüllte Wochen; Klammer unter den ersten 4 Wochen mit „über 40 € im Monat“; Unterzeile wechselt zu „im Jahr“.
- Tool Stack: Remotion, React, src/design-system/daten.tsx
- Composition Family: calendar-grid-fill
- Motion Signature Camera: still
- Motion Signature Layout: Zähler oben mittig, 52-Wochen-Raster darunter, Monatsklammer unten links
- Motion Signature Transformation: Wochenfelder füllen sich, Zähler läuft mit
- Startzustand: 52 nummerierte leere Wochenfelder, Zähler „0 €“, Unterzeile „52 Wochen“, oben links „Annahme: 10 € pro Woche ungeplant gekauft“.
- sichtbare Mechanik/Transformation: Bei „Du kaufst jede Woche“ füllt sich Woche 1 (10 €), bei „Zehn Euro pro Woche“ Woche 2–4 (40 €, „nach 4 Wochen“); bei „über vierzig Euro“ Klammer unter Spalte 1 mit „über 40 € im Monat · 1 Monat ≈ 4,3 Wochen“; kurz vor „fünfhundertzwanzig“ füllen sich die restlichen 48 Wochen in ≈ 36 Frames.
- Resultat: Alle 52 Felder rot, Zähler 520 €, Unterzeile „im Jahr“; Monatsklammer bleibt stehen.
- Concept A: Sparschwein/Glas, in das 10-€-Scheine fallen — Münz-/Geld-Regen-Nähe, schlecht zählbar.
- Concept B: 52-Wochen-Raster, das sich mit 10-€-Feldern füllt, Zähler exakt gekoppelt, Monatsklammer.
- Concept C: Jahresring aus 52 Segmenten mit Zähler in der Mitte — elegant, aber die 10 € pro Woche sind in schmalen Segmenten nicht lesbar.
- Chosen Concept: B — jedes Feld ist sichtbar genau 10 €, Monat und Jahr sind abzählbar; bewusst anders als die Abo-Mechanik (Karte → Monatschips → Jahresbalken).
- Keyframe 10%: leeres Raster, 0 €.
- Keyframe 35%: Woche 1 gefüllt, 10 €.
- Keyframe 65%: 4 Wochen gefüllt, 40 €, Klammer „über 40 € im Monat“ erscheint.
- Keyframe 90%: 52 Felder voll, 520 € im Jahr.
- Sichtbare Zustände: 52 leere Wochen, 0 € → Woche 1: 10 € → 4 Wochen: 40 €, über 40 € im Monat → 52 Wochen: 520 € im Jahr
- Motion Channels: Woche 1 füllt sich, Wochen 2–4 füllen sich, Zähler 40 €, Monatsklammer erscheint, 48 Wochen füllen sich, Zähler 520 €
- SFX-Cues: optional sehr leiser Tick pro Feld in Woche 1–4; beim Schnell-Füllen ein durchgehendes kurzes Rauschen statt 48 Ticks; Abschluss-Akzent bei 520 € (≈ Beat „Und fünfhundertzwanzig Euro“ + 26).

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual38Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 112, 305, 363, 431] Frames, Vorschau-Dauer 520 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Ergebnis steht spätestens ca. 60 Frames nach dem letzten Beat.
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Quelle/Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Annahme/Rechenbeispiel; „über 40 € im Monat“, weil 1 Monat ≈ 4,33 Wochen (≈ 43,33 €).
