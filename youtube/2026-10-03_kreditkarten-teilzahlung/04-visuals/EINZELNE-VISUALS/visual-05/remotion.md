# Remotion-Spezifikation visual-05

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Zwischenstand
- Sprechtext-Bezug: Nach zwölf Monaten sind 1.200 € gezahlt, aber noch rund 1.069,72 € offen.
- Viewer Change: Auf einer textarmen gerenderten Abrechnungsszene erscheint zuerst 1.200 € gezahlt; danach tritt 1.069,72 € offen als klarer Gegenwert hinzu.
- Animation Intent: Google Flow liefert nur die hochwertige Szene. Die exakten Zahlen werden fehlerfrei in Remotion gesetzt.
- Mechanik: paid-versus-open-reveal
- Technikbeschreibung: Transparente Typografie-/Linienebene über dem Flow-Szenenbild; zwei Werte erscheinen zeitversetzt und werden durch eine schlanke vertikale Linie getrennt.
- Tool Stack: React, CSS, Remotion interpolate, Flow scene plate
- Composition Family: hybrid-document-overlay
- Motion Signature Camera: statische Kamera auf dem gerenderten Szenenbild
- Motion Signature Layout: zwei große Zahlenanker am unteren Bildrand über einer räumlichen Papier-/Abrechnungsszene
- Motion Signature Transformation: erst gezahlter Betrag, dann offene Restschuld; Trennlinie wächst dazwischen
- Startzustand: nur das textarme Flow-Szenenbild
- sichtbare Mechanik/Transformation: Zahlentypografie und Trennlinie werden nacheinander eingeblendet
- Resultat: 1.200 € gezahlt und 1.069,72 € offen sind exakt und schnell vergleichbar
- Motion Channels: Opacity/Translation der beiden Werte, Wachstum der Trennlinie
- SFX-Cues: optional zwei dezente Ticks für gezahlt und offen
