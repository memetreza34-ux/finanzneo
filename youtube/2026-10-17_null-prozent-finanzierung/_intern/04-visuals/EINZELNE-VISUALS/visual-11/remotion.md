# Remotion-Spezifikation visual-11

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 2 — Wann null Prozent wirklich gratis ist
- Sprechtext-Bezug: 12 Raten à 50 € = 600 € — genau der Kaufpreis, keinen Cent mehr.
- Inhaltlicher Brief (Phase 1 Content): Zwölf Ratenblöcke à 50 € (Monat 1–12) bauen sich nacheinander zu einem Balken auf, der exakt so lang ist wie das Preisschild „600 €“. Ergebnis: „600 € = Kaufpreis“, darunter „0 € extra“. Beispiel kennzeichnen. Andere Mechanik als ein Wochenraster (das gab es im letzten Video).
- Startet bei: „Du zahlst zwölf Raten“ · Stufen bei: „Du zahlst zwölf Raten“ · „Zwölf mal fünfzig“ · „Wenn sonst nichts dazukommt“ · „Keinen Cent mehr“
- Viewer Change: Unter dem Preisbalken „Kaufpreis 600 €“ setzen sich zwölf 50-€-Blöcke (Monat 1–12) nacheinander in eine leere Ratenspur gleicher Skala; die Summe zählt bis 600 €, die Kette endet exakt am Ende des Preisbalkens, beide werden grün und hinter dem Ende steht „0 € extra“.
- Animation Intent: „Zwölf mal fünfzig sind sechshundert“ soll als Längengleichheit sichtbar werden: Raten und Preis teilen eine Skala, also beweist das bündige Ende ohne Rechnen, dass keine Zinsen dazukommen.
- Mechanik: installment-blocks-fill-price-tag-length
- Technik-ID: twelve-rate-blocks-chain-under-price-bar-with-end-match
- Technikbeschreibung: Preisbalken 600 € und gestrichelte Ratenspur auf gemeinsamer Skala (600 € = 1.200 px, 50 € = 100 px); zwölf Blöcke fallen nacheinander in die Spur, Zählwerk +50 € je Block; End-Hilfslinien an beiden Enden, Farbwechsel auf Grün, „= Kaufpreis“ und „0 € extra“ hinter dem Kettenende.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, Zaehlwerk (daten.tsx)
- Composition Family: comparison
- Motion Signature Camera: still
- Motion Signature Layout: Preisbalken oben, Ratenspur mit Monatsnummern darunter, Summenzeile unten
- Motion Signature Transformation: Blöcke füllen die Spur bis zur Preislänge, Enden werden verglichen
- Startzustand: Weißer Preisbalken „600 €“ mit Fernseher-Icon (Zeile „Kaufpreis“), darunter gleich lange, gestrichelte leere Ratenspur (Zeile „12 Raten“), Kennzeichnung oben links „Beispiel: Fernseher für 600 €, 12 Raten à 50 €, keine Zusatzkosten“.
- sichtbare Mechanik/Transformation: Ab Visual-Start fallen zwölf blaue 50-€-Blöcke nacheinander von oben in die Spur (Monat 1–12 darunter); bis „Zwölf mal fünfzig“ + 22 Frames ist die Spur voll. Das Zählwerk „Summe der Raten“ springt mit jedem Block um 50 €. Bei „Zwölf mal fünfzig“ erscheint „= 12 × 50 €“. Bei „Wenn sonst nichts dazukommt“ ziehen sich grüne gestrichelte Hilfslinien an beiden Enden über Preis und Raten, Blöcke, Rahmen und Summe werden grün, „= Kaufpreis“ erscheint.
- Resultat: Preisbalken und Ratenkette exakt gleich lang (je 1.200 px), Summe 600 € = 12 × 50 € = Kaufpreis, rechts hinter dem Kettenende „0 € extra“ (bei „Keinen Cent mehr“, steht nach 12 Frames).
- Concept A: Zwölf Ratenblöcke stapeln sich senkrecht zu einer Säule neben einer 600-€-Säule — funktioniert, aber 12 schmale Stapelstücke sind schlechter lesbar als eine Kette, und Säulen kommen in visual-15/18/30 schon vor.
- Concept B: Preisbalken oben, darunter eine Ratenspur gleicher Skala, die sich mit zwölf 50-€-Blöcken füllt; das bündige Ende beweist „genau der Kaufpreis“, „0 € extra“ steht hinter dem Ende.
- Concept C: Kreis/Uhr aus 12 Monatssegmenten, die sich füllen, mit 600 € in der Mitte — schön, aber der Vergleich „Raten = Preis“ wäre nur als Zahl, nicht als Geometrie sichtbar.
- Chosen Concept: B — die Gleichheit wird geometrisch gezeigt (gleiche Länge auf gleicher Skala), jeder Block ist sichtbar 50 €, Monate sind abzählbar. Kein Wochenraster wie im letzten Video.
- Keyframe 10%: 2–3 Blöcke in der Spur, Zählwerk läuft (Startzustand + Aufbau während „Du zahlst zwölf Raten…“).
- Keyframe 35%: 11 Blöcke gesetzt, Summe kurz vor 600 €, „= 12 × 50 €“ blendet ein.
- Keyframe 65%: Kette voll, grüne End-Hilfslinien, 600 € = 12 × 50 € = Kaufpreis.
- Keyframe 90%: Ergebnis-Hold inklusive „0 € extra“.
- Sichtbare Zustände: Preisbalken 600 €, leere Ratenspur → Raten füllen die Spur, Summe läuft → 12 × 50 € = 600 € → Kette endet bündig: = Kaufpreis → 0 € extra
- Motion Channels: 12 Ratenblöcke setzen sich nacheinander in die Spur, Summe zählt 50 € je Block bis 600 €, End-Hilfslinien und Farbwechsel auf Grün, „0 € extra“ erscheint hinter dem Kettenende
- SFX-Cues: optional sehr leiser Klick je Block (12 ×, ab Visual-Start + 14 Frames, Abstand ≈ 8,5 Frames); weicher Bestätigungston beim Grünwerden („Wenn sonst nichts dazukommt“ + 8 Frames). Keine SFX, die mit Stimme oder Hintergrundmusik konkurrieren.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual11Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 94, 152, 257] Frames, Vorschau-Dauer 310 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Endergebnis steht spätestens ca. 20 Frames nach dem letzten Beat und bleibt danach unverändert stehen (mind. 15 Frames Hold bis zum Schnitt).
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Beispielwerte aus dem Skript (600 €, 12 × 50 €); als „Beispiel“ gekennzeichnet. Skala: 600 € = 1.200 px, 50 € = 100 px (6 px Fuge innerhalb jedes 100-px-Platzes).

## QA (Phase 1, Claude Code Opus 5.5)

- Gerendert über `out/null-prozent-qa/entry.tsx` mit Vorschau-Beats; Stills bei 10/35/65/90 % + letztem Frame + einem Übergangsframe sowie Voll-Clip (Kontaktbogen alle 0,5 s, verkleinert) geprüft: keine Überlappungen, nichts angeschnitten, Werte und Geometrie stimmen.
