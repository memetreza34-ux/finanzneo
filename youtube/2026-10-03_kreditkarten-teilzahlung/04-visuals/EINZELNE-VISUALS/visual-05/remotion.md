# Remotion-Spezifikation visual-05

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Zwischenstand
- Sprechtext-Bezug: Nach zwölf Monaten sind 1.200 € gezahlt, aber noch rund 1.069,72 € offen.
- Viewer Change: Zwölf 100-€-Monatszahlungen erscheinen nacheinander und summieren sich zu 1.200 €; anschließend tritt die Restschuld 1.069,72 € groß daneben.
- Animation Intent: Der Widerspruch „viel gezahlt, trotzdem viel offen“ soll ohne KI-generierte Zahlentafeln sofort verständlich sein.
- Mechanik: twelve-payments-vs-balance
- Technikbeschreibung: Code-basierte Monatsmatrix mit präziser Typografie; nach Aufbau der zwölf Raten erscheint eine große kontrastierende Restschuldfläche.
- Tool Stack: React, CSS Grid, Remotion interpolate
- Composition Family: editorial-data-comparison
- Motion Signature Camera: statische frontale Editorial-Ansicht
- Motion Signature Layout: links 4×3-Monatsmatrix, rechts eine große Restschuldfläche
- Motion Signature Transformation: sequenzieller Aufbau vieler kleiner Zahlungen gefolgt von einem einzelnen großen Gegenwert
- Startzustand: leere Monatsmatrix
- sichtbare Mechanik/Transformation: 12 Monatsraten erscheinen nacheinander
- Resultat: 1.200 € gezahlt vs. 1.069,72 € offen
- Motion Channels: Monats-Reveal, Summen-Hierarchie, Restschuld-Skalierung
- SFX-Cues: optional zwölf sehr dezente Ticks und ein tieferer Akzent beim Restschuld-Reveal
