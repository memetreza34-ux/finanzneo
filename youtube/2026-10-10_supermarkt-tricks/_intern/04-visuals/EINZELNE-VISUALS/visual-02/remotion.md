# Remotion-Spezifikation visual-02

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Hook — Milch und Brot, vierzig Euro
- Sprechtext-Bezug: Und an der Kasse stehen plötzlich vierzig Euro auf dem Display. Das ist kein Zufall. Das ist geplant.
- Inhaltlicher Brief (Phase 1 Content): Ein Kassenbon mit zwei Zeilen (Milch, Brot) wächst Zeile für Zeile zu einem langen Bon; die Summe zählt mit bis 40,00 €. Ergebnis: Kontrast zwischen Plan (2 Artikel) und Realität (40 €).
- Startet bei: „Und an der Kasse stehen plötzlich“ · Stufen bei: „Und an der Kasse“ · „vierzig Euro“ · „Das ist kein Zufall“ · „Das ist geplant“
- Viewer Change: Ein Kassenbon mit nur Milch und Brot druckt Zeile für Zeile weiter, bis Bon-Summe und Kassendisplay 40,00 € zeigen; danach stehen 3,68 € Plan gegen 40,00 € Kasse.
- Animation Intent: Der Hook soll den Sprung von „nur Milch und Brot“ zu „vierzig Euro“ sichtbar machen: jede Zeile ist ein ungeplanter Kauf, die Summe wächst mit, der Abstand Plan gegen Kasse bleibt als Ergebnis stehen.
- Mechanik: receipt-print-growth-plan-vs-till
- Technik-ID: growing-receipt-with-till-display-count
- Technikbeschreibung: Kassenbon wächst symmetrisch um die Bildmitte, jede neue Zeile erhöht Bon-Summe und Zählwerk-Display um exakt ihren Preis; Klammern markieren 2 geplante und 11 ungeplante Zeilen; zwei wertgenaue Balken vergleichen 3,68 € mit 40,00 €.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, Zaehlwerk (daten.tsx)
- Composition Family: document-motion
- Motion Signature Camera: still
- Motion Signature Layout: Kassenbon mittig links, Kassendisplay und Vergleichsbalken rechts
- Motion Signature Transformation: Bon druckt und wird länger, Summe zählt mit, Zeilen werden markiert
- Startzustand: Kassenbon mit genau zwei Zeilen: Milch 1,19 €, Brot 2,49 €, Summe 3,68 €; Display rechts zeigt 3,68 €.
- sichtbare Mechanik/Transformation: Elf weitere Zeilen drucken in gleichmäßigem Takt bis „vierzig Euro“; der Bon wird länger (bleibt um y = 540 zentriert), Bon-Summe und Zählwerk springen pro Zeile um genau deren Preis.
- Resultat: Grüne Klammer „geplant“ (Milch, Brot), rote Klammer „ungeplant · 11 Artikel“, rechts Balken „Plan: Milch + Brot 3,68 €“ gegen „Kasse: 13 Artikel 40,00 €“ (Längen exakt im Verhältnis 3,68 : 40).
- Concept A: Einkaufszettel mit zwei Punkten neben einem Kassendisplay, das allein hochzählt — zeigt den Betrag, aber nicht, woher er kommt.
- Concept B: Wachsender Kassenbon, Summe und Display zählen pro Zeile mit, danach Markierung geplant/ungeplant und Vergleichsbalken Plan gegen Kasse.
- Concept C: Einkaufswagen füllt sich mit flachen Produkt-Icons, Preis-Badge oben — anschaulich, aber ohne nachprüfbare Einzelpreise und nahe an generischer Deko.
- Chosen Concept: B — der Bon ist das Dokument, an dem man den Betrag tatsächlich sieht; jede Zeile ist ein ungeplanter Kauf und die Summe bleibt nachrechenbar.
- Keyframe 10%: Bon druckt (ca. 4 Zeilen), Display rollt bei ~5,9 €.
- Keyframe 35%: Bon vollständig mit 13 Zeilen, Summe und Display 40,00 €.
- Keyframe 65%: Hold auf 40,00 € bzw. Beginn der Markierung „geplant / ungeplant“.
- Keyframe 90%: Klammern stehen, Balken Plan 3,68 € gegen Kasse 40,00 € sind voll.
- Sichtbare Zustände: Bon mit Milch und Brot, 3,68 € → 13 Zeilen, Display 40,00 € → 2 geplant, 11 ungeplant → Plan 3,68 € gegen Kasse 40,00 €
- Motion Channels: Bon druckt Zeile für Zeile, Display zählt bis 40,00 €, Markierung geplant / ungeplant, Plan- und Kassenbalken wachsen
- SFX-Cues: optional leiser Bondrucker-Tick pro Zeile (ab Beat 1 + 16 Frames, Takt ≈ 4–5 Frames), Kassen-„Ding“ bei 40,00 € (≈ Beat „vierzig Euro“).

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual02Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 70, 138, 193] Frames, Vorschau-Dauer 255 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Ergebnis steht spätestens ca. 60 Frames nach dem letzten Beat.
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Quelle/Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Artikelpreise sind ein Beispiel-Einkauf (Summe exakt 40,00 €, im Code per throw abgesichert): Milch 1,19 · Brot 2,49 · Schokolade 1,49 · Chips 1,99 · Erdbeeren 2,99 · Käse 4,12 · Kaffee 6,99 · Kekse 1,79 · Weißwein 4,99 · Aufschnitt 3,23 · Tiefkühlpizza 2,79 · Blumen 3,99 · Duschgel 1,95. Kennzeichnung oben links: „Beispiel-Einkauf“.
