# Remotion-Spezifikation visual-03

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Monat 1
- Sprechtext-Bezug: Im ersten Monat entstehen rund 28,33 € Zinsen; nur rund 71,67 € tilgen die ursprüngliche Schuld.
- Viewer Change: Eine große 100-€-Rate teilt sich sichtbar in 28,33 € Zinsen und 71,67 € Tilgung; danach erscheint die Restschuld.
- Animation Intent: Die präzise Rechenaufteilung bleibt typografisch sauber und muss nicht von einem Bildmodell gerendert werden.
- Mechanik: payment-split-reveal
- Technikbeschreibung: Zwei große farbcodierte Remotion-Flächen trennen sich aus einer zentralen 100-€-Karte; Restschuld folgt als zweiter Informationsbeat.
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: precision-number-explainer
- Motion Signature Camera: statische frontale 2D/2.5D Editorial-Ansicht
- Motion Signature Layout: zentrale Zahl teilt sich symmetrisch in zwei große Vergleichsflächen
- Motion Signature Transformation: ein Element zerlegt sich räumlich in zwei semantische Teile
- Startzustand: 100 € im Fokus
- sichtbare Mechanik/Transformation: Split in Zinsen und Tilgung
- Resultat: 28,33 € / 71,67 € plus 1.928,33 € Restschuld
- Motion Channels: horizontale Trennung, Skalierung/Opacity, Restschuld-Reveal
- SFX-Cues: optional dezenter Split/Click
