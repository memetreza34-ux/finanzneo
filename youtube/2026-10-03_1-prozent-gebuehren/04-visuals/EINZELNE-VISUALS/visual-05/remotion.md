# Remotion-Spezifikation visual-05

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Endwert-Payoff — rund 74.000 €
- Sprechtext-Bezug: Nach 30 Jahren endet die günstige Variante bei rund 410.135 €, die teurere bei rund 336.289 €.
- Viewer Change: Zwei Vermögenssäulen wachsen nebeneinander zu unterschiedlichen Endhöhen, die Zahlen zählen synchron hoch und erst am Ende erscheint die Differenz.
- Animation Intent: Der Zuschauer bekommt nach der Kurvenentwicklung einen klaren, statischen Endwertvergleich als großen Payoff.
- Mechanik: Zwei Wertkörper wachsen proportional zu den Modell-Endwerten; anschließend wird die Lücke als eigene Information enthüllt.
- Technikbeschreibung: React-Counter plus vertikale Wertkörper mit spätem Differenz-Reveal.
- Tool Stack: React, Remotion interpolate, CSS layout
- Composition Family: comparison
- Motion Signature Camera: static-front-close
- Motion Signature Layout: side-by-side-value-columns-with-center-gap
- Motion Signature Transformation: columns-grow-then-difference-bracket-reveals
- Startzustand: Zwei gleich breite leere Wertpositionen.
- sichtbare Mechanik: Säulen und Zahlen wachsen gleichzeitig, aber unterschiedlich hoch.
- Resultat: Rund 410.000 € versus 336.000 € und rund 74.000 € Differenz.
- Motion Channels: Säulenwachstum; Zahlen-Counter; spätes Differenz-Label
- Visual Beats: beide bei null; paralleles Wachstum; unterschiedliche Endstände; Differenz erscheint
- SFX-Cues: kurzer tiefer Payoff-Hit beim Differenz-Reveal
