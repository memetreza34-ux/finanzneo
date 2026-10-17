# Remotion-Spezifikation visual-15

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Vier Fallen
- Sprechtext-Bezug: Gleicher Fernseher: 600 € mit 0 % vs. 550 € woanders → 50 € mehr, die Zinsen stecken im Preis.
- Inhaltlicher Brief (Phase 1 Content): Beispielrechnung (als „Beispiel“ gekennzeichnet): zwei Shops, gleicher Fernseher. Shop A „0 % Finanzierung“ 600 €, Shop B ohne Finanzierung 550 €. Die Differenz von 50 € wird sichtbar herausgelöst und als „Zinsen im Preis“ beschriftet.
- Startet bei: „Kostet derselbe Fernseher in einem anderen Shop“ · Stufen bei: „Kostet derselbe Fernseher“ · „fünfhundertfünfzig Euro“ · „fünfzig Euro mehr“ · „Die Zinsen stecken“
- Viewer Change: Neben der 600-€-Säule von Shop A („0 % Finanzierung“) wächst Shop B auf 550 €; eine Schnittlinie bei 550 € läuft über beide Säulen, das obere 50-€-Stück von Shop A löst sich orange heraus, gleitet zur Seite und wird zu „+50 € · Zinsen im Preis“.
- Animation Intent: Die Zinsen sind hier nicht sichtbar ausgewiesen; erst der Vergleich mit dem günstigeren Shop schneidet sie aus dem Preis heraus. Das herausgelöste Stück macht genau diese versteckte Differenz greifbar.
- Mechanik: price-columns-cut-difference-slice-out
- Technik-ID: two-shop-columns-level-line-lifts-top-slice
- Technikbeschreibung: Zwei Preissäulen ab 0 € (600 € = 540 px, 50 € = 45 px), gemeinsame Preiszeile darüber; gestrichelte 550-€-Linie zeichnet sich über beide Säulen, das 50-€-Kopfstück von Shop A färbt sich orange und gleitet seitlich neben die Säulen; an seiner Stelle bleibt eine gestrichelte Kontur.
- Tool Stack: Remotion, React, src/design-system/daten.tsx
- Composition Family: comparison
- Motion Signature Camera: still
- Motion Signature Layout: zwei Preissäulen nebeneinander, herausgelöstes Stück rechts daneben
- Motion Signature Transformation: Schnittlinie trennt die Differenz ab, Stück gleitet heraus
- Startzustand: Blaue Säule Shop A wächst auf 600 € (Label „Shop A · 0 % Finanzierung“, Fernseher-Icon), Kennzeichnung „Beispiel: derselbe Fernseher in zwei Shops“.
- sichtbare Mechanik/Transformation: Bei „fünfhundertfünfzig Euro“ wächst die grüne Säule Shop B („ohne Finanzierung“) auf 550 €; anschließend zieht sich eine gestrichelte 550-€-Linie über beide Säulen. Bei „fünfzig Euro mehr“ färbt sich das Kopfstück von Shop A (550–600 €) orange, löst sich mit einer Fuge und gleitet nach rechts neben die Säulen; „+50 €“ erscheint in der Preiszeile.
- Resultat: Shop A 600 € (Sockel bis 550 € + gestrichelte Kontur des fehlenden Stücks), Shop B 550 €, rechts das orange 50-€-Stück mit „+50 €“ und darunter „Zinsen im Preis“ (bei „Die Zinsen stecken“).
- Concept A: Zwei Preisschilder, von 600 € wird 550 € abgezogen, ein Zählwerk landet bei 50 € — reine Rechnung, keine sichtbare Lage der Zinsen.
- Concept B: Zwei Preissäulen auf gleicher Skala; eine Schnittlinie bei 550 € trennt das 50-€-Stück von Shop A ab, das heraus gleitet und zu „Zinsen im Preis“ wird.
- Concept C: Waage mit zwei Fernsehern, die zur teureren Seite kippt — Neigung ist kein exakter Wert, die 50 € wären nur Text.
- Chosen Concept: B — die Differenz ist ein exakt bemessenes Stück (45 px = 50 €) und sitzt sichtbar im Preis von Shop A; Achse ab 0 €, damit nichts übertrieben wird.
- Keyframe 10%: Shop A 600 € steht allein.
- Keyframe 35%: Shop A 600 € und Shop B 550 € nebeneinander.
- Keyframe 65%: Schnittlinie bei 550 €, orange Stück hat Shop A verlassen, „+50 €“ blendet ein.
- Keyframe 90%: Hold: +50 € · Zinsen im Preis.
- Sichtbare Zustände: Shop A mit 0 % Finanzierung: 600 € → Shop B: 550 € → Schnitt bei 550 €: 50 € Differenz löst sich → +50 € = Zinsen im Preis
- Motion Channels: Säule Shop A wächst auf 600 €, Säule Shop B wächst auf 550 €, 550-€-Schnittlinie zeichnet sich, 50-€-Stück löst sich und gleitet heraus, „Zinsen im Preis“ erscheint
- SFX-Cues: optional weiches „Schnitt“-Geräusch beim Ablösen („fünfzig Euro mehr“ + 8 Frames); kein weiterer Akzent. Keine SFX, die mit Stimme oder Hintergrundmusik konkurrieren.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual15Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 82, 175, 210] Frames, Vorschau-Dauer 310 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Endergebnis steht spätestens ca. 20 Frames nach dem letzten Beat und bleibt danach unverändert stehen (mind. 15 Frames Hold bis zum Schnitt).
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Beispielwerte aus dem Skript (600 € vs. 550 €). Skala ab 0 €: 600 € = 540 px.

## QA (Phase 1, Claude Code Opus 5.5)

- Gerendert über `out/null-prozent-qa/entry.tsx` mit Vorschau-Beats; Stills bei 10/35/65/90 % + letztem Frame + einem Übergangsframe sowie Voll-Clip (Kontaktbogen alle 0,5 s, verkleinert) geprüft: keine Überlappungen, nichts angeschnitten, Werte und Geometrie stimmen.
