# Remotion-Spezifikation visual-18

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Vier Fallen
- Sprechtext-Bezug: Versicherung 8 € pro Monat × 12 = 96 € → aus 600 € werden 696 €.
- Inhaltlicher Brief (Phase 1 Content): Beispielrechnung (als „Annahme“ gekennzeichnet): Kaufpreis-Balken 600 €. Zwölf kleine Zusatzstücke à 8 € hängen sich Monat für Monat an → 96 €. Gesamt 696 €. Die Zusatzstücke in anderer Farbe, Label „Versicherung“.
- Startet bei: „Das klingt vernünftig, kostet aber extra“ · Stufen bei: „Das klingt vernünftig“ · „Nehmen wir an“ · „acht Euro im Monat“ · „Nach zwölf Monaten“ · „Aus sechshundert werden“
- Viewer Change: Der fertige Kaufpreis steht bereits als Säule 600 €; rechts erscheint ein Versicherungszettel „8 € pro Monat“ mit 12 Monatsfeldern, jedes abgehakte Feld legt eine orange 8-€-Scheibe oben auf die Säule, bis der Aufschlag 96 € beträgt und die Gesamtzahl von 600 € auf 696 € rollt.
- Animation Intent: Anders als beim Ratenaufbau wird hier nichts abbezahlt, sondern etwas auf einen fertigen Preis draufgelegt: Die Monate des Zusatzvertrags schichten einen sichtbaren Aufschlag auf, der den Preis dauerhaft erhöht.
- Mechanik: monthly-addon-slices-stack-onto-finished-price
- Technik-ID: insurance-ticket-month-ticks-drop-slices-on-price-column
- Technikbeschreibung: Senkrechte Preissäule ab 0 € (696 € = 620 px, 8 € = 7,1 px); Versicherungszettel mit 6 × 2 Monatsfeldern; jedes Feld färbt sich orange und schiebt eine 8-€-Scheibe schräg von rechts oben auf die Säule; Zählwerk am Zettel 8 € → 96 €, Klammer „+96 €“ am Aufschlag, Gesamt-Zählwerk 600 € → 696 €.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, Zaehlwerk (daten.tsx)
- Composition Family: stacked-surcharge
- Motion Signature Camera: still
- Motion Signature Layout: Preissäule links, Versicherungszettel mit Monatsfeldern rechts
- Motion Signature Transformation: Monatsfelder haken ab, Scheiben stapeln sich als Aufschlag oben auf die Säule
- Startzustand: Blaue Säule „Kaufpreis 600 €“ (fertiger Preis), Kennzeichnung „Annahme: Ratenschutzversicherung 8 € pro Monat, 12 Monate“.
- sichtbare Mechanik/Transformation: Bei „Nehmen wir an“ erscheint rechts der Zettel „Versicherung“ mit 12 leeren Monatsfeldern; bei „acht Euro im Monat“ steht „8 € pro Monat“, Feld 1 wird orange und schiebt eine 8-€-Scheibe oben auf die Säule, das Zählwerk „Versicherung bisher“ zeigt 8 €. Bei „Nach zwölf Monaten“ folgen Felder 2–12 im 4-Frame-Takt, die Scheiben stapeln sich, Zählwerk 96 €.
- Resultat: Bei „Aus sechshundert werden“ rollt „gesamt“ von 600 € auf 696 €, Klammer „+96 €“ am orangen Aufschlag; Säule 600 € blau + 96 € orange = 696 €.
- Concept A: Kaufpreis-Balken, an den rechts 12 kleine Stücke angehängt werden — zu nah an der Ratenkette aus visual-11 (gleiche Bewegungslogik).
- Concept B: Fertige Preissäule; ein Versicherungszettel hakt 12 Monate ab und jede Monatsprämie legt sich als Scheibe oben auf den Preis — Aufschlag statt Aufbau.
- Concept C: Zwei Preisschilder 600 € und 696 € mit Pfeil — zeigt Ergebnis, aber nicht, dass die Mehrkosten Monat für Monat entstehen.
- Chosen Concept: B — klar anders als visual-11 (dort füllen Raten einen Preis; hier wird auf den fertigen Preis draufgelegt), Monatslogik sichtbar, wertgenau (8 € = 7,1 px).
- Keyframe 10%: Säule Kaufpreis 600 € allein.
- Keyframe 35%: Versicherungszettel da, Monatsfelder noch leer.
- Keyframe 65%: Felder werden abgehakt, Scheiben stapeln sich, Zählwerk läuft auf 96 € zu.
- Keyframe 90%: gesamt 696 €, +96 € Aufschlag, alle 12 Felder orange.
- Sichtbare Zustände: Kaufpreis 600 € → Annahme: Versicherung → 8 € pro Monat: erste Scheibe → 12 Monate: 96 € Aufschlag → 600 € + 96 € = 696 €
- Motion Channels: Preissäule 600 € steht, Versicherungszettel erscheint, Monatsfelder färben sich orange, 8-€-Scheiben stapeln sich auf der Säule, Zählwerk 96 €, Gesamt 600 € → 696 €
- SFX-Cues: optional leiser Tick je Monatsfeld (Feld 1 bei „acht Euro im Monat“ + 6, Felder 2–12 ab „Nach zwölf Monaten“ + 4 im 4-Frame-Takt); Akzent beim Gesamtbetrag („Aus sechshundert werden“ + 20). Keine SFX, die mit Stimme oder Hintergrundmusik konkurrieren.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual18Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 70, 140, 187, 269] Frames, Vorschau-Dauer 350 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Endergebnis steht spätestens ca. 20 Frames nach dem letzten Beat und bleibt danach unverändert stehen (mind. 15 Frames Hold bis zum Schnitt).
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Die 8 € pro Monat sind eine Annahme des Skripts, keine Marktangabe; 12 × 8 € = 96 €, 600 € + 96 € = 696 €. Skala ab 0 €: 696 € = 620 px.

## QA (Phase 1, Claude Code Opus 5.5)

- Gerendert über `out/null-prozent-qa/entry.tsx` mit Vorschau-Beats; Stills bei 10/35/65/90 % + letztem Frame + einem Übergangsframe sowie Voll-Clip (Kontaktbogen alle 0,5 s, verkleinert) geprüft: keine Überlappungen, nichts angeschnitten, Werte und Geometrie stimmen.
