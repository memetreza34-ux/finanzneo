# Remotion-Spezifikation visual-32

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 4 — Der teuerste Trick
- Sprechtext-Bezug: Milka Alpenmilch: 100 g → 90 g, 1,49 € → 1,99 € = über 48 % teurer pro Gramm.
- Inhaltlicher Brief (Phase 1 Content): Tafel schrumpft von 100 g auf 90 g, Preis steigt von 1,49 € auf 1,99 €. Dann Umrechnung auf 100 g: 1,49 € → 2,21 € → Ergebnis „+48 %“ versteckte Preiserhöhung. Quelle: Verbraucherzentrale Hamburg. Markenname als reiner Text, kein Logo.
- Startet bei: „Das bekannteste Beispiel ist Milka“ · Stufen bei: „Das bekannteste Beispiel“ · „Die Tafel ist“ · „Und der Preis ist“ · „Rechnet man das“ · „versteckte Preiserhöhung“
- Viewer Change: Die Tafel Milka Alpenmilch verliert sichtbar eine von zehn Spalten (100 g → 90 g), der Preis zählt von 1,49 € auf 1,99 €; umgerechnet auf 100 g zeigen zwei wertgenaue Balken 1,49 € gegen 2,21 € — das rote Mehrsegment ist die versteckte Preiserhöhung von +48 %.
- Animation Intent: Shrinkflation versteckt sich in zwei gleichzeitigen Änderungen; erst die Umrechnung auf dieselbe Menge macht das Ausmaß sichtbar.
- Mechanik: shrinking-bar-price-rise-normalize-100g
- Technik-ID: chocolate-grid-column-removal-with-per-100g-bars
- Technikbeschreibung: Flache Schokoladentafel aus 10 gleichen Spalten (je 10 g), letzte Spalte schrumpft weg, Lücke bleibt gestrichelt; Zählwerk-Preisschild 1,49 € → 1,99 €; obere Gruppe rückt nach oben, Rechnung auf 100 g, zwei Balken pro 100 g wachsen, Mehrsegment rot, +48 %.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, Zaehlwerk (daten.tsx)
- Composition Family: shrinkflation-normalization
- Motion Signature Camera: still, Layout rückt einmal nach oben
- Motion Signature Layout: Tafel links, Preisschild rechts, darunter Balken pro 100 g
- Motion Signature Transformation: Tafel schrumpft, Preis zählt hoch, Umrechnung auf 100 g
- Startzustand: „Milka Alpenmilch“ (nur Text, kein Logo) über einer flachen Tafel aus 10 × 3 Stücken, darunter „100 g“; rechts Preisschild „Preis pro Tafel 1,49 €“; Gruppe vertikal mittig.
- sichtbare Mechanik/Transformation: Bei „Die Tafel ist“ schrumpft die letzte Spalte auf 0 (Tafelbreite exakt 9/10), gestrichelte Lücke „−10 g“, Gewicht „90 g statt 100 g“; bei „Und der Preis ist“ rollt das Zählwerk auf 1,99 €, „+0,50 €“.
- Resultat: Bei „Rechnet man das“ rückt die Gruppe nach oben, Rechnung „1,99 € : 90 g × 100 g = 2,21 €“, Balken „Preis pro 100 g“: vorher 1,49 €, jetzt 2,21 € (Längen exakt im Verhältnis), Mehrsegment rot; bei „versteckte Preiserhöhung“ erscheint „+48 % versteckte Preiserhöhung“.
- Concept A: Zwei Packungen vorher/nachher nebeneinander mit Preisetiketten — statisch, die Umrechnung bleibt Kopfrechnen.
- Concept B: Tafel verliert eine Spalte, Preis zählt hoch, danach Normierung auf 100 g mit zwei wertgenauen Balken und rotem Mehrsegment.
- Concept C: Preis-pro-Gramm-Linie über die Zeit mit Knick nach oben — abstrakt, verliert die greifbare Tafel.
- Chosen Concept: B — beide Tricks (weniger drin, teurer) werden einzeln sichtbar, danach zeigt dieselbe Bezugsmenge das wahre Ausmaß.
- Keyframe 10%: Tafel 100 g und 1,49 € stehen ruhig.
- Keyframe 35%: Tafel 90 g mit gestrichelter Lücke, Preis rollt auf 1,99 €.
- Keyframe 65%: Hold auf 90 g und 1,99 € (+0,50 €) während des langen Satzes.
- Keyframe 90%: Balken pro 100 g 1,49 € gegen 2,21 €, „+48 % versteckte Preiserhöhung“.
- Sichtbare Zustände: Tafel 100 g, 1,49 € → 90 g statt 100 g → 1,99 € (+0,50 €) → pro 100 g: 1,49 € gegen 2,21 € → +48 % versteckte Preiserhöhung
- Motion Channels: Tafel verliert eine Spalte, Gramm-Zahl 100 → 90, Preis zählt 1,49 € → 1,99 €, Balken pro 100 g wachsen, Mehrpreis rot
- SFX-Cues: optional leises Schrumpf-Geräusch (Beat „Die Tafel ist“ + 4), Kassen-Tick beim Preis (Beat „Und der Preis ist“ + 6), Akzent bei +48 % (Beat „versteckte Preiserhöhung“).

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual32Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 79, 193, 366, 504] Frames, Vorschau-Dauer 600 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Ergebnis steht spätestens ca. 60 Frames nach dem letzten Beat.
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Quelle/Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

10 Spalten à 10 g sind eine Proportionsdarstellung, nicht die echte Stückzahl der Tafel. Zwischen Preisänderung und „Rechnet man das“ bleibt das Bild ca. 4–5 s ruhig (langer Sprechsatz).
