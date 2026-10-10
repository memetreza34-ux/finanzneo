# Remotion-Spezifikation visual-14

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 1 — Der Weg durch den Markt
- Sprechtext-Bezug: Schnelle vs. langsame Musik: bei langsamer Musik rund 38 % mehr Umsatz (Milliman 1982).
- Inhaltlicher Brief (Phase 1 Content): Zwei Zustände nacheinander: Takt/Tempo schnell → Umsatzbalken Basis; Tempo langsam → Balken wächst sichtbar um rund 38 %. Quelle klein: „Milliman, Journal of Marketing, 1982“.
- Startet bei: „In einer bekannten Studie aus den USA“ · Stufen bei: „In einer bekannten Studie“ · „mal schnelle“ · „mal langsame Musik“ · „Bei langsamer Musik“ · „Und der Umsatz“
- Viewer Change: Zwei Zeilen der Studie — schnelle und langsame Musik — zeigen ihr Tempo als laufende Takt-Striche; dann wachsen beide Umsatzbalken bis 100 %, der Balken der langsamen Musik wächst weiter auf 138 % und das Plus von 38 % ist farbig abgesetzt.
- Animation Intent: Das Ergebnis der Studie ist ein relativer Vergleich; die gemeinsame 100-%-Linie und das Überwachsen machen „rund 38 % mehr“ ohne erfundene Euro-Werte sofort sichtbar, das Tempo der Musik wird als echte Bewegung gezeigt.
- Mechanik: tempo-track-to-revenue-overshoot
- Technik-ID: scrolling-beat-ticks-with-baseline-overshoot-bar
- Technikbeschreibung: Zwei Studienzeilen: Takt-Striche laufen in einem maskierten Fenster mit schnellem bzw. langsamem Tempo; zwei Umsatzbalken wachsen synchron bis zur gestrichelten 100-%-Linie, der untere wächst weiter auf 138 %, Mehrumsatz orange mit Label +38 %.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, SVG-Maske
- Composition Family: comparison
- Motion Signature Camera: still
- Motion Signature Layout: zwei gestapelte Studienzeilen: Musiktempo links, Umsatzbalken rechts
- Motion Signature Transformation: Takt läuft, Balken wachsen gemeinsam, einer überholt die 100-%-Linie
- Startzustand: Zwei weiße Karten „schnelle Musik“ und „langsame Musik“ (grau, Takt steht), Umsatzspuren leer, Quelle oben links.
- sichtbare Mechanik/Transformation: Bei „mal schnelle“ läuft die obere Taktspur dicht und schnell (≈ 5 Striche/s), bei „mal langsame Musik“ die untere weit und langsam (≈ 0,7 Striche/s); bei „Bei langsamer Musik“ erscheinen „Kunden gehen schneller / langsamer“. Bei „Und der Umsatz“ wachsen beide Balken bis zur 100-%-Linie, der untere wächst weiter.
- Resultat: Oben 100 %, unten 138 % (Balkenlängen exakt 100 : 138), Mehrsegment orange, „+38 %“ darüber; gestrichelte 100-%-Linie über beide Zeilen.
- Concept A: Metronom-Zeiger, der von schnell auf langsam umschaltet, darunter ein einzelner Umsatzbalken, der um 38 % länger wird — nur ein Balken, der Vergleich bleibt implizit.
- Concept B: Zwei Studienzeilen mit laufendem Takt und Umsatzbalken; gemeinsames Wachsen bis 100 %, dann Überholen auf 138 %.
- Concept C: Ladengrundriss mit zwei Kunden-Punkten, die unterschiedlich schnell laufen, und Warenkorb-Zähler — würde Gehgeschwindigkeit und Warenkorbgrößen quantifizieren, die das Briefing nicht liefert.
- Chosen Concept: B — direkter Vergleich beider Studienbedingungen, rein relativ (100 % → 138 %), keine erfundenen Zahlen zu Tempo oder Laufweg.
- Keyframe 10%: beide Karten aufgebaut, Takt steht, Umsatz leer (Startzustand während „In einer bekannten Studie…“).
- Keyframe 35%: beide Taktspuren laufen sichtbar unterschiedlich schnell, Kunden-Zeilen erscheinen.
- Keyframe 65%: beide Balken stehen: 100 % und 138 %, +38 % ist sichtbar.
- Keyframe 90%: Hold auf 100 % gegen 138 %, Takt läuft weiter.
- Sichtbare Zustände: schnelle und langsame Musik, Umsatz leer → schnelles Tempo läuft → langsames Tempo läuft, Kunden gehen langsamer → Umsatz 100 % gegen 138 %, +38 %
- Motion Channels: Takt-Striche laufen schnell / langsam, Umsatzbalken wachsen bis 100 %, Balken der langsamen Musik überholt die Linie, +38 % erscheint
- SFX-Cues: optional weicher Tick beim Erreichen der 100-%-Linie (Beat „Und der Umsatz“ + 22 Frames) und Akzent bei +38 % (+ 50 Frames). Keine Musik-SFX, die mit der Hintergrundmusik konkurrieren.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual14Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 129, 161, 205, 296] Frames, Vorschau-Dauer 590 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Ergebnis steht spätestens ca. 60 Frames nach dem letzten Beat.
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Quelle/Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Hinweis: Zwischen Visual-Start und „mal schnelle“ (≈ 4 s) bleibt der Startzustand ruhig stehen; das ist der Sprechtext der Studienbeschreibung.
