# Remotion-Spezifikation visual-07

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Drei Checks
- Sprechtext-Bezug: Prüfe Vollzahlung, Zinssatz und die Teilzahlungs-Einstellung.
- Viewer Change: Neben einer großen neutralen Kreditkarte erscheinen nacheinander exakt drei grüne Prüfpunkte.
- Animation Intent: Präzise Handlungslabels sollen fehlerfrei lesbar sein; deshalb code-basiert statt Google-Flow-Bild.
- Mechanik: three-checks-sequential
- Technikbeschreibung: Große Kartenform links, drei typografische Check-Reveals rechts mit klarer visueller Hierarchie.
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: action-checklist
- Motion Signature Camera: statische frontale Editorial-Ansicht
- Motion Signature Layout: große Karte links, vertikale Dreierliste rechts
- Motion Signature Transformation: drei Handlungspunkte schieben sich zeitversetzt ein
- Startzustand: nur Kreditkarte
- sichtbare Mechanik/Transformation: Check 1, Check 2, Check 3 erscheinen nacheinander
- Resultat: drei konkrete Prüfungen vollständig sichtbar
- Motion Channels: horizontale Bewegung, Opacity, sequenzielles Timing
- SFX-Cues: optional dezente Klicks je Check
