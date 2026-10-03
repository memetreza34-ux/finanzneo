# Remotion-Spezifikation visual-04

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: 24-Monats-Tilgungsverlauf
- Sprechtext-Bezug: siehe visual-index.json
- Viewer Change: Eine frontale Restschuld-Kurve zeichnet sich über 24 Monate von 2.000 € bis 0 €, während die kumulierten Zinsen bis 368,38 € steigen.
- Animation Intent: Zeigt, dass die Schuld trotz konstanter Zahlung nur schrittweise sinkt und Zinskosten parallel wachsen.
- Mechanik: amortization-timeline
- Technikbeschreibung: SVG-Liniendiagramm mit zwei klar getrennten Datenpfaden: Restschuld und kumulierter Zins, Achsen frontal und mathematisch konsistent.
- Tool Stack: React, SVG, Remotion interpolate
- Composition Family: data-viz
- Motion Signature Camera: orthogonale Frontansicht ohne Perspektive
- Motion Signature Layout: große Chartfläche mit Monat 0 bis 24, Restschuld links, Zinskennzahl oben rechts
- Motion Signature Transformation: Kurve wird entlang der Zeitachse gezeichnet, Kennzahlen aktualisieren synchron
- Motion Channels: Pfad-Reveal der Restschuld; Zahlen-Counter für kumulierte Zinsen
- Sichtbare Beats: Start 2.000 €; Monat 12: 1.069,72 € offen; Monat 24: 0 € offen; 368,38 € Gesamtzins

Die Technik wurde aus dem Viewer Change gewählt. Keine Ersatzanimation in Phase 3.
