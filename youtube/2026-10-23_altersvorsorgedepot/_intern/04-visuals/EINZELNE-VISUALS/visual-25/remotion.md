# Remotion-Spezifikation visual-25

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Haken eins: die Kosten
- Sprechtext-Bezug: 37 Jahre, 195 € im Monat, 5 % vor Kosten: 1 % Kosten → rund 198.000 €, 0,2 % Kosten → rund 238.000 € — rund 40.000 € Unterschied.
- Inhaltlicher Brief (Phase 1 Content): Waagrechte Achse wie der Zeitstrahl aus dem Bild davor: „28“ bis „65“ (Jahre). Zwei Vermögenskurven wachsen gleichzeitig von 0 nach rechts: Kurve „1 % Kosten“ endet bei „rund 198.000 €“, Kurve „0,2 % Kosten“ endet bei „rund 238.000 €“ (wertgenau, gleiche Skala; monatliche Einzahlung 195 €, 4,0 % bzw. 4,8 % netto). Am Ende öffnet sich zwischen beiden Endpunkten eine farbige Lücke mit Callout „rund 40.000 € Unterschied“. Kennzeichnung oben: „Beispiel, Annahme 5 % Rendite vor Kosten“. Keine weiteren Zahlen erfinden.

- Startet bei: „Bei einem Prozent Kosten hat Jonas“ · Stufen bei: „Bei einem Prozent Kosten“ · „rund hundertachtundneunzigtausend“ · „Bei null Komma zwei Prozent“ · „rund zweihundertachtunddreißigtausend“ · „Rund vierzigtausend Euro Unterschied“ · „Nur wegen der Kosten“
- Bridge-Objekt: Zeitstrahl
- Viewer Change: Der Zeitstrahl 28 → 65 aus Bild 24 (mit Münzen entlang des Pfeils) liegt ab Frame 0 als Nulllinie am Boden. Die rote Kurve „1 % Kosten“ zeichnet sich bis 65 und endet bei „rund 198.000 €“; danach zeichnet sich auf derselben Skala die grüne Kurve „0,2 % Kosten“ darüber bis „rund 238.000 €“. Danach zieht die Fläche zwischen beiden langsam rot von links nach rechts auf — anfangs fast null, am Ende breit — und bei „vierzigtausend“ führt ein Pfeil vom Callout „rund 40.000 € Unterschied“ in die Lücke; zuletzt „nur wegen der Kosten“.
- Animation Intent: Ein Prozent Kosten klingt klein; erst zwei gleich skalierte Kurven zeigen, dass sich der Kostenunterschied über 37 Jahre aufschaukelt und am Ende eine Lücke von rund 40.000 € reißt.
- Mechanik: cost-drag-two-wealth-curves-gap-band
- Technik-ID: timeline-arrow-axis-sequential-compound-curves-red-gap-band-callout
- Technikbeschreibung: Kurven im Code aus v = v · (1 + r/12) + 195 € je Monat über 444 Monate, r = 4,0 % bzw. 4,8 % (Endwerte 197.856 € / 238.158 €, per Laufzeit-Check abgesichert); x 28 → 65 = 1.000 px, y 0 → 240.000 € = 560 px, eine Skala für beide, Nulllinie = Zeitstrahl-Pfeil mit Stiftlinie und 12 Münzen wie in Bild 24. Kurve 1 zeichnet sich zuerst, Kurve 2 danach; die Fläche zwischen den Kurven füllt sich monatsgenau bis zum Beat „Rund vierzigtausend“, rote Endkante bei 65, gebogener Pfeil vom Callout „rund 40.000 €“ (124 px) in die Lücke; gerundete Endwerte rechts.
- Tool Stack: Remotion, React, SVG-Pfade aus 445 Monatswerten, src/design-system/daten.tsx (DATEN, DatenBuehne, skala, euroText)
- Composition Family: trend-trace
- Motion Signature Camera: still
- Motion Signature Layout: Zeitstrahl 28 → 65 unten, zwei Kurven darüber, Endwerte rechts, Ergebnis-Callout im freien Feld links oben
- Motion Signature Transformation: zwei Kurven zeichnen sich nacheinander, die Fläche dazwischen füllt sich zur Lücke
- Startzustand: Der Zeitstrahl-Pfeil aus Bild 24 steht ab Frame 0 als Nulllinie unten (Stiftlinie, 12 Münzen entlang des Pfeils wie im Bild), „28“ links, „65“ rechts (64 px), dazwischen „Jonas: 195 € im Monat inkl. Zulage · 37 Jahre“; oben links „Beispiel, Annahme 5 % Rendite vor Kosten“. Rechts erscheint „1 % Kosten“.
- Sichtbare Mechanik/Transformation: Die rote Kurve „1 % Kosten“ zeichnet sich vom Visual-Start bis „rund hundertachtundneunzigtausend“ von 28 bis 65, dann „rund 198.000 €“ am Endpunkt. Bei „Bei null Komma zwei Prozent“ erscheinen „0,2 % Kosten“ und ein grüner Punkt bei 28; die grüne Kurve zeichnet sich (max. 130 Frames) und endet bei „rund zweihundertachtunddreißigtausend“ mit „rund 238.000 €“.
- Resultat: Nach der grünen Kurve zieht die Fläche zwischen den Kurven langsam rot von links nach rechts auf und ist bei „Rund vierzigtausend Euro Unterschied“ voll, die Endkante bei 65 wird rot; Callout „rund 40.000 €“ (124 px) + „Unterschied“ erscheint im freien Feld links oben, ein Pfeil zeigt in die Lücke; bei „Nur wegen der Kosten“ folgt „nur wegen der Kosten“.
- Concept A: Zwei Säulen bei 65 (198.000 € vs. 238.000 €) mit herausgelöstem 40.000-€-Stück — klar, aber ohne Zeitverlauf: man sieht nicht, dass sich die Kosten über 37 Jahre aufschaukeln, und der Zeitstrahl aus Bild 24 fehlt.
- Concept B: Zeitstrahl 28 → 65 als Nulllinie, zwei echt gerechnete Vermögenskurven auf einer Skala, die Fläche dazwischen wird zur roten Lücke mit Callout.
- Concept C: Gestapelte Fläche Einzahlungen / Erträge / Kosten — informativer, bräuchte aber zusätzliche Zahlen (Summe der Einzahlungen, Kosten in €), die nicht im Brief stehen.
- Chosen Concept: B — trägt den Zeitstrahl aus dem Nachbarbild weiter, zeigt die Kostenwirkung als wachsende Lücke und braucht keine neuen Zahlen. Abweichung vom Brief: Die Kurven zeichnen sich nacheinander statt gleichzeitig, weil das Voiceover erst 1 % und dann 0,2 % nennt — sonst stünde die höhere Kurve sichtbar im Bild, bevor sie gesprochen ist. Keine y-Achsenbeschriftung; die Werte stehen an den Endpunkten.
- Keyframe 10%: Rote Kurve zu etwa zwei Dritteln gezeichnet, Label „1 % Kosten“ rechts.
- Keyframe 35%: Rote Kurve fertig mit „rund 198.000 €“, „0,2 % Kosten“ und grüner Startpunkt bei 28.
- Keyframe 65%: Beide Kurven fertig mit „rund 238.000 €“ und „rund 198.000 €“, die rote Lücke beginnt aufzuziehen.
- Keyframe 90%: Rote Lücke, „rund 40.000 € Unterschied“, Pfeil in die Lücke, „nur wegen der Kosten“ blendet ein; beide Endwerte rechts.
- Sichtbare Zustände: Zeitstrahl 28 → 65 → 1 % Kosten: rund 198.000 € → 0,2 % Kosten zeichnet sich → 0,2 % Kosten: rund 238.000 € → Lücke: rund 40.000 € Unterschied → nur wegen der Kosten
- Motion Channels: Kurve 1 % Kosten zeichnet sich 28 → 65, Endwert rund 198.000 € erscheint, Kurve 0,2 % Kosten zeichnet sich darüber, Endwert rund 238.000 € erscheint, rote Lücke füllt sich von links nach rechts, Callout rund 40.000 € Unterschied mit Pfeil, dann „nur wegen der Kosten“
- SFX-Cues: optional sehr leiser Stift-/Zeichenton während beider Kurven; weicher tiefer Akzent, wenn die Lücke sich füllt („Rund vierzigtausend Euro Unterschied“ + 6 Frames). Leise, unter der Stimme.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual25Animation`, Prop `beats` (Frames ab Visual-Start, aus `beatCues`).
- Vorschau-Beats = echte Wortzeiten aus dem finalen Voiceover: [0, 73, 156, 293, 390, 463] Frames, Visual-Dauer 518 Frames (vorher geschätzt 444 / [0, 101, 139, 304, 342, 393]). Kurve 1 endet bei Beat 1 + 4, Kurve 2 bei Beat 3 + 4 (Zeichendauer höchstens 130 Frames), die Lücke zieht ab Kurve 2 + 18 Frames auf und ist bei Beat 4 + 6 voll, Callout ab Beat 4. Ergebnis komplett bei „Nur wegen der Kosten“ + 12 Frames (echte Wortzeiten: Frame 475, Hold 43 Frames).
- Regeln: helles 2D auf `DATEN.grund`, keine Szenenüberschrift, Inhalt x 210–1.690 (77 %), vertikal y 190–900, Kennzeichnung 34 px, Labels ≥ 40 px, Hero 124 px.

## Hinweise / Annahmen

- Beispielrechnung, keine Prognose (so gekennzeichnet). Formel im Code: v = v · (1 + r/12) + 195 € je Monat, 444 Monate (28 → 65), Einzahlung am Monatsende; r = 5 % − 1 % = 4,0 % bzw. 5 % − 0,2 % = 4,8 % netto. Ergebnis 197.855,60 € bzw. 238.158,30 € (Laufzeit-Check auf 197.856 / 238.158), Anzeige gerundet auf 1.000 €: „rund 198.000 €“, „rund 238.000 €“, Differenz 40.302,70 € → „rund 40.000 €“.
- 195 € = 150 € Eigenbeitrag + 45 € Zulage (540 € / 12). Vereinfachung: Die Zulage wird hier monatlich mitgerechnet; real wird sie jährlich gutgeschrieben (Brief/Skript rechnen ebenso).
- Skala: x 28 → 65 = 1.000 px; y 0 → 240.000 € = 560 px; beide Kurven auf derselben Skala, Nulllinie = Zeitstrahl.

## QA (Phase 1, Claude Code Opus 5.5, 23.10.2026)

- Gerendert über `out/altersvorsorge-qa/entry.tsx` (nicht versioniert) mit Vorschau-Beats und geschätzter Dauer; MP4 `out/altersvorsorge-qa/V25.mp4`.
- Aus dem MP4 geprüft: Frames bei 10/35/65/90 % + letzter Frame (`out/altersvorsorge-qa/V25-10.png` … `-90.png`, `-ende.png`), Kontaktbogen `out/altersvorsorge-qa/V25-kontakt-10-35-65-90.png`, Handy-Größe `out/altersvorsorge-qa/V25-kontakt-mobil.png`, Voll-Clip alle 0,5 s `out/altersvorsorge-qa/V25-vollclip-0.5s.png`.
- Geprüft: Werte und Längen stimmen mit den Daten überein, keine Überlappungen oder Anschnitte, kein vorzeitiger Payoff, Ergebnis bleibt ruhig stehen, stumm verständlich.
- Nachtrag 24.10.2026 (Bridge-Abgleich mit dem echten Flow-Bild und echte Wortzeiten): erneut gerendert mit den echten Beats als Vorschau-Werten; geprüft 10/35/65/90 % + letzter Frame, Voll-Clip alle 0,5 s und Startframe neben dem Nachbarbild: `out/altersvorsorge-qa/bridge-bild24-vs-V25-start.png`.
