# Remotion-Spezifikation visual-02

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Teilzahlung erzeugt einen offenen Rest
- Sprechtext-Bezug: siehe visual-index.json
- Viewer Change: Eine 2.000-€-Schuld erhält zuerst eine rote Zins-Schicht; danach reduziert eine 100-€-Zahlung den Saldo nur teilweise.
- Animation Intent: Der Zuschauer sieht Ursache und Reihenfolge: Zins kommt vor der Tilgung und frisst einen Teil der Rate.
- Mechanik: interest-before-principal
- Technikbeschreibung: SVG-Balanceblock wächst kurz um den Monatszins und schrumpft danach um die Zahlung; Zins- und Tilgungsanteil trennen sich sichtbar.
- Tool Stack: React, SVG, Remotion interpolate
- Composition Family: financial-process-flow
- Motion Signature Camera: statische Frontansicht
- Motion Signature Layout: zentraler Balanceblock mit Zufluss oben und Zahlungsabfluss rechts
- Motion Signature Transformation: Saldo wächst um Zins und schrumpft anschließend um Rate
- Motion Channels: Breite des Schuldenblocks; Einblendung und Bewegung von Zins- und Zahlungslabels
- Sichtbare Beats: 2.000 € offen; +28,33 € Zins; 100 € Zahlung; 1.928,33 € Rest

Die Technik wurde aus dem Viewer Change gewählt. Keine Ersatzanimation in Phase 3.
