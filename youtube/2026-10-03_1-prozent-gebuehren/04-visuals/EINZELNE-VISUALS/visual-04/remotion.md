# Remotion-Spezifikation visual-04

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Rechenmodell — der Abstand wächst
- Sprechtext-Bezug: Nach fünf Jahren ist der Unterschied klein, nach 15 Jahren deutlich und nach 30 Jahren groß.
- Viewer Change: Zwei Kurven starten am gleichen Punkt und zeichnen sich gleichzeitig über 30 Jahre; die grüne Kurve entfernt sich zunehmend von der roten.
- Animation Intent: Der Zuschauer soll nicht nur zwei Endwerte sehen, sondern den zeitlichen Verlauf der Divergenz verstehen.
- Mechanik: Zwei datengetreue Wachstumskurven werden entlang der Zeitachse enthüllt und erhalten am Ende ihre Werte plus Differenzmarkierung.
- Technikbeschreibung: Frontale SVG-Datenvisualisierung mit echten Modellwerten, Stroke-Reveal und spätem Gap-Payoff.
- Tool Stack: React, Remotion interpolate, SVG
- Composition Family: data-viz
- Motion Signature Camera: static-front-chart
- Motion Signature Layout: full-width-cartesian-two-lines
- Motion Signature Transformation: two-curves-draw-and-separate-over-time
- Startzustand: Leeres frontales Koordinatensystem mit gemeinsamem Startpunkt.
- sichtbare Mechanik: Beide Kurven zeichnen sich von Jahr 0 bis Jahr 30 und driften auseinander.
- Resultat: Endwerte und rund 74.000 € Differenz werden eingeblendet.
- Motion Channels: SVG-Pfad-Reveal; zeitliche Kurvendivergenz; spätes Label- und Gap-Reveal
- Visual Beats: gemeinsamer Start; erste kleine Trennung; deutliche Trennung ab mittlerer Laufzeit; Endwerte plus Gap
- SFX-Cues: sehr dezente Marker-Ticks bei 10, 20 und 30 Jahren
