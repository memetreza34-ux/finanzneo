# Remotion-Spezifikation visual-12

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 2 — So viel legt der Staat drauf
- Sprechtext-Bezug: Zulagen-Staffel: 50 % auf die ersten 360 € (bis 180 €), 25 % auf 360–1.800 € (bis 360 €) = maximal 540 € im Jahr.
- Inhaltlicher Brief (Phase 1 Content): Ein waagrechter Balken „Eigenbeitrag im Jahr“ von 0 bis 1.800 €, in zwei Zonen geteilt wie die zwei Stufen aus dem Bild davor: Zone 1 (0–360 €) Label „50 %“, Zone 2 (360–1.800 €) Label „25 %“. Beim Sprechen von Stufe 1 wächst darüber ein Zulagen-Stück auf „180 €“ (halb so lang wie Zone 1, wertgenau). Bei Stufe 2 wächst ein zweites Stück auf „360 €“ (ein Viertel von Zone 2). Ergebnis: beide Stücke rutschen zusammen zu „540 € im Jahr“. Quelle oben links: „Altersvorsorgereformgesetz, Bundestag 27.03.2026“. Zahlen exakt, keine weiteren Werte erfinden.

- Startet bei: „Auf die ersten dreihundertsechzig Euro“ · Stufen bei: „Auf die ersten dreihundertsechzig Euro“ · „fünfzig Prozent dazu“ · „Auf alles darüber“ · „fünfundzwanzig Prozent“ · „Zusammen sind das“
- Bridge-Objekt: Stufen
- Viewer Change: Die zwei Stufen aus Bild 11 stehen als Treppe auf der Achse „Eigenbeitrag im Jahr“ (Stufe 1 = 0–360 €, Stufe 2 = 360–1.800 €, wertgenaue Breiten). Der Eigenbeitrag füllt Stufe 1, darauf zeichnet sich ein gestricheltes Fach mit 2 Zellen; bei „fünfzig Prozent“ erscheint „50 %“ und die grüne Zulage füllt genau eine Zelle: +180 €. Dann füllt sich Stufe 2 mit einem 4-Zellen-Fach, bei „fünfundzwanzig Prozent“ füllt die Zulage genau eine Zelle: +360 €. Bei „Zusammen“ rutschen beide grünen Stücke oben auf Stufe 2 zu einem Balken zusammen: „höchstens = 540 € im Jahr“.
- Animation Intent: Die Zwei-Stufen-Förderung soll ohne Rechnen verständlich werden: Die Zellen zeigen 50 % und 25 % als Bruchteil der jeweiligen Stufe, die grünen Stücke stehen auf derselben €-Skala wie der Eigenbeitrag, und ihr Zusammenrutschen zeigt 180 € + 360 € = 540 € als eine Länge.
- Mechanik: grant-steps-fill-rate-cells-then-merge
- Technik-ID: two-step-contribution-staircase-dashed-rate-cells-green-grant-slabs-merge-to-540
- Technikbeschreibung: Treppe als €-Achse (1.800 € = 1.560 px, 1 € = 0,867 px): Stufe 1 312 px, Stufe 2 1.248 px breit, Stiftkontur per statischem SVG-Displacement wie die Flow-Zeichnungen. Eigenbeitrag-Füllung läuft von links; gestrichelte Fächer in Stufenlänge mit 2 bzw. 4 Zellen; grüne Zulage-Stücke wachsen auf px(180 €) = 156 px und px(360 €) = 312 px mit mitzählendem Betrag; am Ende macht Stück 2 Platz, Stück 1 springt auf Stufe 2, gemeinsamer Rahmen und „= 540 € im Jahr“ (128 px).
- Tool Stack: Remotion, React, SVG (clipPath, feTurbulence/feDisplacementMap als Stiftlinie), src/design-system/daten.tsx (DATEN, DatenBuehne, skala, euroText)
- Composition Family: stepped-grant-scale
- Motion Signature Camera: still
- Motion Signature Layout: zweistufige Treppe über die volle Breite mit €-Achse darunter, Ergebnis oben auf Stufe 2
- Motion Signature Transformation: Stufen füllen sich, Zulage füllt 1 von 2 bzw. 1 von 4 Zellen, Stücke rutschen zu einem Balken zusammen
- Startzustand: Die Treppe aus Bild 11 steht sofort da (helle Sandfläche, Stiftkontur, „Stufe 1“ / „Stufe 2“), darunter die €-Achse „Eigenbeitrag im Jahr“ mit 0 € · 360 € · 1.800 €. Quelle oben links „Altersvorsorgereformgesetz, Bundestag 27.03.2026“ (32 px).
- Sichtbare Mechanik/Transformation: Ab Visual-Start füllt der Eigenbeitrag Stufe 1 von links (0 → 360 €), darauf zeichnet sich ein gestricheltes Fach in Stufenlänge mit 2 Zellen. Bei „fünfzig Prozent dazu“ erscheint „50 %“ auf der Stufe und die grüne Zulage füllt genau eine Zelle (156 px = 180 €), Betrag zählt „+180 €“. Bei „Auf alles darüber“ füllt sich Stufe 2 (360 → 1.800 €) und ein 4-Zellen-Fach zeichnet sich. Bei „fünfundzwanzig Prozent“ erscheint „25 %“, die Zulage füllt eine Zelle (312 px = 360 €), „+360 €“.
- Resultat: Bei „Zusammen sind das“ verschwinden die Fächer, Stück 2 rückt um 156 px nach rechts, Stück 1 springt von Stufe 1 hinauf davor; ein grüner Rahmen fasst beide zu einem 468-px-Balken (= 540 €), daneben „höchstens“ und „= 540 € im Jahr“ (128 px). Steht ca. 40 Frames nach dem letzten Beat still.
- Concept A: Tabelle bzw. zwei getrennte Balkenpaare (Eigenbeitrag-Zone + Zulage-Balken je Stufe) — korrekt, aber wirkt wie ein generisches Diagramm und verliert die Treppe aus Bild 11 als Bridge.
- Concept B: Treppe = €-Achse; gestrichelte Fächer mit 2 bzw. 4 Zellen machen 50 % und 25 % als Bruchteil der Stufe sichtbar; grüne Zulage-Stücke auf derselben Skala rutschen oben auf der Treppe zu 540 € zusammen.
- Concept C: Kumulierte Zulage als Knick-Linie über dem Eigenbeitrag (0 → 180 € bei 360 €, → 540 € bei 1.800 €) — mathematisch elegant, aber Steigungen sind für Laien schwer als Prozentsätze lesbar und die „zwei Stufen“ werden nur ein Knick.
- Chosen Concept: B — die Stufen aus dem Nachbarbild tragen die Zahlen, die Prozentsätze sind als Zellen abzählbar (1 von 2, 1 von 4) und alle Längen kommen aus einer €-Skala. Abweichung vom Brief: Der Balken „Eigenbeitrag“ ist als Treppe gezeichnet (gleiche Zonenbreiten), und das Ergebnis rutscht oben auf Stufe 2 zusammen statt über einem flachen Balken — so bleibt die Komposition vertikal mittig und die Bridge erkennbar.
- Keyframe 10%: Eigenbeitrag füllt Stufe 1 fast vollständig, Stufe 2 noch hell, „360 €“ wird dunkel.
- Keyframe 35%: Fach mit 2 Zellen liegt auf Stufe 1, „50 %“ kommt mit „fünfzig Prozent dazu“.
- Keyframe 65%: +180 € liegt auf Stufe 1, Stufe 2 gefüllt, 4-Zellen-Fach gezeichnet, „25 %“ noch nicht gesprochen.
- Keyframe 90%: Ergebnis-Hold „+180 € +360 € = 540 € im Jahr“, „höchstens“, beide Prozentsätze auf den Stufen.
- Sichtbare Zustände: Zwei Stufen: 0–360 € und 360–1.800 € → Die ersten 360 € Eigenbeitrag → 50 % → +180 € → Alles darüber bis 1.800 € → 25 % → +360 € → Zusammen höchstens 540 € im Jahr
- Motion Channels: Eigenbeitrag füllt Stufe 1, später Stufe 2, gestrichelte Fächer mit 2 bzw. 4 Zellen zeichnen sich, Prozentsätze 50 % / 25 % erscheinen auf den Stufen, grüne Zulage-Stücke wachsen wertgenau, Betrag zählt mit, Stücke rutschen zusammen, „= 540 € im Jahr“ erscheint
- SFX-Cues: sehr leiser weicher Klick, wenn die 180-€-Zelle voll ist („fünfzig Prozent dazu“ + 30 Frames) und wenn die 360-€-Zelle voll ist („fünfundzwanzig Prozent“ + 30 Frames); kurzes leises Rutschen beim Zusammenschieben („Zusammen sind das“ + 4 Frames), optional heller Bestätigungston bei „= 540 €“ (+ 30 Frames). Nichts, was mit der Stimme konkurriert.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual12Animation`, Prop `beats` (Frames ab Visual-Start, aus `beatCues`).
- Vorschau-Beats ohne Audio (142 Wörter/Minute): [0, 152, 190, 304, 330] Frames; geschätzte Visual-Dauer 431 Frames (34 Wörter). Alle Stufen hängen relativ an den Beats und haben Mindestabstände (Wachsen erst nach fertigem Fach, Zusammenschieben erst nach fertigem 360-€-Stück). Ergebnis steht 40 Frames nach „Zusammen sind das“ (Vorschau: ab Frame 376, Hold ≈ 55 Frames).
- Regeln: helles 2D auf `DATEN.grund`, keine Szenenüberschrift, keine Untertitel, Inhalt 1.560 px breit (81 %), vertikal ca. y 220–850, kleinster Text 32 px (Quelle), Labels ≥ 40 px, Hero 128 px.

## Hinweise / Annahmen

- Zahlen exakt aus dem Brief/Skript: 50 % auf 0–360 € (= 180 €), 25 % auf 360–1.800 € (= 360 €), zusammen höchstens 540 € im Jahr; im Code als Konstanten mit Laufzeit-Check (`180 + 360 = 540`). Quelle und Datum „Bundestag 27.03.2026“ unverändert aus dem Brief übernommen (vom Motion-Agent nicht separat nachrecherchiert).
- Skala: 1.800 € = 1.560 px → 360 € = 312 px, 180 € = 156 px, 360 € Zulage = 312 px, 540 € = 468 px.
- Stiftlinie: statisches `feTurbulence`/`feDisplacementMap` (fester Seed) nur auf ruhenden Konturen — kein Flimmern.

## QA (Phase 1, Claude Code Opus 5.5, 23.10.2026)

- Gerendert über `out/altersvorsorge-qa/entry.tsx` (nicht versioniert) mit Vorschau-Beats und geschätzter Dauer; MP4 `out/altersvorsorge-qa/V12.mp4`.
- Aus dem MP4 geprüft: Frames bei 10/35/65/90 % + letzter Frame (`out/altersvorsorge-qa/V12-10.png` … `-90.png`, `-ende.png`), Kontaktbogen `out/altersvorsorge-qa/V12-kontakt-10-35-65-90.png`, Handy-Größe `out/altersvorsorge-qa/V12-kontakt-mobil.png`, Voll-Clip alle 0,5 s `out/altersvorsorge-qa/V12-vollclip-0.5s.png`.
- Geprüft: Werte und Längen stimmen mit den Daten überein, keine Überlappungen oder Anschnitte, kein vorzeitiger Payoff, Ergebnis bleibt ruhig stehen, stumm verständlich.
