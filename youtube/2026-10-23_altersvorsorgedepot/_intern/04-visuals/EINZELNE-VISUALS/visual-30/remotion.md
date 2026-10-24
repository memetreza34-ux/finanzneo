# Remotion-Spezifikation visual-30

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 4 — Haken zwei und drei: gebunden und versteuert
- Sprechtext-Bezug: Ab 65: höchstens 30 % auf einen Schlag, der Rest als lebenslange Rente oder Auszahlplan bis mindestens 85.
- Inhaltlicher Brief (Phase 1 Content): Das Depot-Glas aus dem Bild davor steht links bei „65“ auf einem Zeitstrahl „65 → 85“. Das Schloss geht auf. Ein Stück von genau „30 %“ des Inhalts löst sich und springt als Block „bis 30 % auf einmal“ heraus. Der Rest (70 %) fließt danach in vielen gleich großen Monatsportionen nach rechts entlang des Zeitstrahls bis „85“, Label „Auszahlplan bis mind. 85“; alternativ kurzer Hinweis-Pfeil über 85 hinaus „oder lebenslange Rente“. Ergebnis: Glas leert sich gleichmäßig. Keine Eurobeträge erfinden.

- Startet bei: „Und nicht alles auf einmal“ · Stufen bei: „Und nicht alles auf einmal“ · „höchstens dreißig Prozent“ · „auf einen Schlag“ · „Der Rest kommt“ · „lebenslange Rente“ · „Auszahlplan bis mindestens“
- Bridge-Objekt: Depot-Glas
- Viewer Change: Das verschlossene Depot-Glas aus Bild 29 (Bügelverschluss, bunte Münzen, Etikett „Altersvorsorgedepot“, Kupferschloss mit Anhänger „ab 65“) steht am Anfang des Zeitstrahls 65 → 85. Das Schloss springt auf, Schloss fällt ab, der Bügeldeckel geht weg, „65“ wird grün. Eine Linie teilt genau die oberen 30 % des Inhalts ab, der Block springt nach oben aus dem Glas: „bis 30 % auf einmal“. Dann fließt der Rest („70 %“) als 240 gleich große Münzen aus dem Glas und stapelt sich zu 20 gleich hohen Jahresstapeln von 65 bis 85, bis das Glas leer ist; gestrichelter Pfeil über 85 hinaus „oder lebenslange Rente“, Klammer „Auszahlplan bis mind. 85“.
- Animation Intent: „Gebunden“ heißt auch: nicht alles auf einmal. Die Teilung des Glases zeigt das Verhältnis 30 : 70 direkt, der gleichmäßige Münzstrom über 20 Jahre macht den Auszahlplan greifbar — ohne Eurobeträge zu erfinden.
- Mechanik: locked-jar-opens-lump-sum-lifts-rest-streams-monthly
- Technik-ID: depot-jar-unlock-30-percent-block-lift-240-month-coins-to-year-stacks-65-85
- Technikbeschreibung: Gezeichnetes Bügelglas wie Bild 29 (grünliche Glas-Tönung, Glasdeckel mit Dichtung und Drahtbügel, Kupferschloss am Bügel mit Hänge-Anhänger „ab / 65“, Etikett „Altersvorsorgedepot“ quer, Stiftlinie) mit buntem Münz-Inhalt (Gold/Terrakotta/Silber) 336 × 400 px = 100 %; Schnitt bei 120 px = 30 %, Block springt mit Overshoot-Easing nach oben. Der Rest-Pegel sinkt linear mit 240 Münzen (je 1 Monat), die hinter dem Glasrand auftauchen und auf Bézier-Bögen zu 20 Jahresstapeln à 12 Münzen fliegen (37,5 px je Jahr); Stapelfläche = Fläche der 70 % im Glas, Block : Stapel = 30 : 70. Gestrichelte Verlängerung über 85 mit Pfeil, geschweifte Klammer 65–85.
- Tool Stack: Remotion, React, SVG (clipPath, Bézier-Flugbahnen, feDisplacementMap als Stiftlinie), src/design-system/daten.tsx (DATEN, DatenBuehne)
- Composition Family: payout-timeline
- Motion Signature Camera: still
- Motion Signature Layout: Depot-Glas links, 30-%-Block oben links, Zeitstrahl 65 → 85 mit Jahresstapeln rechts, Hinweis-Pfeil über 85
- Motion Signature Transformation: Glas öffnet sich, 30-%-Block springt heraus, Rest fließt als Münzstrom in Jahresstapel und leert das Glas
- Startzustand: Das Depot-Glas aus Bild 29 — Bügelglas mit Glasdeckel, Dichtung und Drahtbügel, voller bunter Münzen (Gold/Terrakotta/Silber), Etikett „Altersvorsorgedepot“ quer, Kupferschloss am Bügel mit Hänge-Anhänger „ab / 65“ — steht links am Anfang des Zeitstrahls „65“ → „85“ (Jahresstriche).
- Sichtbare Mechanik/Transformation: Bei „Und nicht alles auf einmal“ springt der Schlossbügel auf, das Schloss fällt ab, der Bügeldeckel geht nach oben weg, „65“ wird grün. Bei „höchstens dreißig Prozent“ teilt eine Linie genau die oberen 30 % des Inhalts ab, Klammer „30 %“ am Glas. Bei „auf einen Schlag“ springt dieser Block nach oben aus dem Glas: „bis 30 % auf einmal“. Bei „Der Rest kommt“ steht „70 %“ auf dem Rest, dann fließen 240 gleich große Münzen (je ein Monat) aus der Glasöffnung und landen als 20 Jahresstapel à 12 zwischen 65 und 85; der Pegel sinkt gleichmäßig. Bei „lebenslange Rente“ zeichnet sich ein gestrichelter Pfeil über 85 hinaus mit „oder lebenslange Rente“.
- Resultat: Bei „Auszahlplan bis mindestens“ erscheint die Klammer 65–85 mit „Auszahlplan bis mind. 85“; das Glas ist bei Frame 260 leer, die letzte Münze landet bei Frame 280 (echte Wortzeiten).
- Concept A: Kreis/Donut 30 : 70 mit Zeitstrahl — sauber, aber abstrakt; das Depot-Glas aus Bild 29 ginge verloren.
- Concept B: Depot-Glas öffnet sich, 30-%-Block springt heraus, der Rest fließt als Münzstrom in Jahresstapel entlang 65 → 85, Glas leert sich.
- Concept C: Glas kippt und gießt in eine lange Rinne „Auszahlplan“ — anschaulich, aber eher Physik-Show; einzelne Monatsportionen wären nicht abzählbar.
- Chosen Concept: B — führt das Glas aus Bild 29 direkt weiter, 30 % und 70 % sind als Flächen vergleichbar (Stapelfläche = Fläche der 70 % im Glas) und die Monatsportionen sind zählbar (12 pro Jahr, 20 Jahre). Abweichung vom Brief: Der Block landet über dem Glas (statt seitlich), damit der Münzstrom zum Zeitstrahl freie Bahn hat; „Auszahlplan bis mind. 85“ steht als Klammer unter dem Zeitstrahl.
- Keyframe 10%: Schloss offen und fällt ab, Bügeldeckel geht weg, „65“ grün.
- Keyframe 35%: Obere 30 % abgeteilt, Klammer „30 %“.
- Keyframe 65%: Block oben „bis 30 % auf einmal“, Münzstrom läuft, erste Jahresstapel, Pfeil „oder lebenslange Rente“ steht.
- Keyframe 90%: Glas leer, alle 20 Stapel stehen, „oder lebenslange Rente“, Klammer „Auszahlplan bis mind. 85“.
- Sichtbare Zustände: Glas verschlossen, ab 65 → Schloss offen bei 65 → 30 % abgeteilt → bis 30 % auf einmal → Rest 70 % fließt in Monatsportionen → oder lebenslange Rente → Auszahlplan bis mind. 85, Glas leer
- Motion Channels: Schloss springt auf und fällt ab, Bügeldeckel geht weg, Schnittlinie und Klammer 30 %, 30-%-Block springt aus dem Glas, Pegel im Glas sinkt gleichmäßig, 240 Monatsmünzen fliegen in 20 Jahresstapel, gestrichelter Pfeil „oder lebenslange Rente“, Klammer „Auszahlplan bis mind. 85“
- SFX-Cues: leises Schloss-Klicken („Und nicht alles auf einmal“ + 8 Frames); kurzes weiches Hochspringen des Blocks („auf einen Schlag“ + 2 Frames); sehr leises, gleichmäßiges Münz-Rieseln während des Stroms (ab „Der Rest kommt“ + 14 Frames für ca. 90 Frames, deutlich unter der Stimme).

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual30Animation`, Prop `beats` (Frames ab Visual-Start, aus `beatCues`).
- Vorschau-Beats = echte Wortzeiten aus dem finalen Voiceover: [0, 73, 112, 156, 178, 226] Frames, Visual-Dauer 314 Frames (vorher geschätzt 355 / [0, 114, 152, 203, 254, 304]). Block-Sprung frühestens 18 Frames nach dem Schnitt; Münzstrom von „Der Rest kommt“ + 14 bis mindestens 90 Frames später bzw. „Auszahlplan“ + 4; letzte Landung + 20 Frames. Echte Wortzeiten: Strom 170–260, Glas leer bei 260, letzte Landung 280, Hold 34 Frames bis zum Schnitt.
- Regeln: helles 2D auf `DATEN.grund`, keine Szenenüberschrift, Inhalt x 140–1.745 (84 %), vertikal y 96–965, Etikett 32 px, Labels ≥ 40 px, „bis 30 %“ 72 px.

## Hinweise / Annahmen

- Regeln laut Skript/Brief: ab 65, höchstens 30 % auf einen Schlag, Rest als lebenslange Rente oder Auszahlplan bis mindestens 85. Keine Eurobeträge.
- Vereinfachung: gleich große Monatsportionen (240 = 20 Jahre × 12 Monate) bis genau 85 — der Plan darf auch länger laufen („mind. 85“, gestrichelter Pfeil). Steigende Raten oder Wertentwicklung während der Auszahlung sind bewusst nicht dargestellt.
- Geometrie: Inhalt 336 × 400 px = 100 %, Schnitt bei 120 px = 30 %; Stapelfläche 20 × 30 px × 12 × 13,07 px = 94.080 px² = Fläche der 70 % im Glas.

## QA (Phase 1, Claude Code Opus 5.5, 23.10.2026)

- Gerendert über `out/altersvorsorge-qa/entry.tsx` (nicht versioniert) mit Vorschau-Beats und geschätzter Dauer; MP4 `out/altersvorsorge-qa/V30.mp4`.
- Aus dem MP4 geprüft: Frames bei 10/35/65/90 % + letzter Frame (`out/altersvorsorge-qa/V30-10.png` … `-90.png`, `-ende.png`), Kontaktbogen `out/altersvorsorge-qa/V30-kontakt-10-35-65-90.png`, Handy-Größe `out/altersvorsorge-qa/V30-kontakt-mobil.png`, Voll-Clip alle 0,5 s `out/altersvorsorge-qa/V30-vollclip-0.5s.png`.
- Geprüft: Werte und Längen stimmen mit den Daten überein, keine Überlappungen oder Anschnitte, kein vorzeitiger Payoff, Ergebnis bleibt ruhig stehen, stumm verständlich.
- Nachtrag 24.10.2026 (Bridge-Abgleich mit dem echten Flow-Bild und echte Wortzeiten): erneut gerendert mit den echten Beats als Vorschau-Werten; geprüft 10/35/65/90 % + letzter Frame, Voll-Clip alle 0,5 s und Startframe neben dem Nachbarbild: `out/altersvorsorge-qa/bridge-bild29-vs-V30-start.png`.
