# Remotion-Spezifikation visual-03

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Monat 1
- Sprechtext-Bezug: Im ersten Monat entstehen rund 28,33 € Zinsen; nur rund 71,67 € tilgen die ursprüngliche Schuld.
- Viewer Change: Eine große 100-€-Rate steht frei im Raum; ein roter Pfad zweigt 28,33 € als Zinsen ab, während ein grüner Pfad 71,67 € als Tilgung weiterführt. Danach erscheint die Restschuld.
- Animation Intent: Die exakte Aufteilung wird frame-genau und ohne generierte Infografik-Karten gezeigt.
- Mechanik: payment-stream-split
- Technikbeschreibung: Zwei offene SVG-Pfade teilen sich aus einem zentralen Betrag; Zahlen erscheinen an den Pfadenden, ohne Panels, Tiles oder Karten.
- Tool Stack: React, SVG, Remotion interpolate
- Composition Family: precision-flow-graphic
- Motion Signature Camera: statische frontale 2D/2.5D Editorial-Ansicht
- Motion Signature Layout: ein zentraler Betrag oben, zwei offene Pfade fächern nach links und rechts aus
- Motion Signature Transformation: ein Betrag teilt sich räumlich in Zins- und Tilgungspfad, danach erscheint die Restschuld
- Startzustand: 100 € steht allein im Zentrum
- sichtbare Mechanik/Transformation: zwei farbcodierte Pfade werden gezeichnet und Zahlen erscheinen an den Enden
- Resultat: 28,33 € Zinsen, 71,67 € Tilgung und 1.928,33 € Restschuld sind exakt lesbar
- Motion Channels: SVG-Pfad-Reveal, Zahlen-Opacity/Translation, Restschuld-Reveal
- SFX-Cues: optional ein dezenter Split-Impuls und ein leiser Abschluss-Tick
