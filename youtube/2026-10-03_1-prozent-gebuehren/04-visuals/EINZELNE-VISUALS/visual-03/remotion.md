# Remotion-Spezifikation visual-03

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Mechanismus — Kosten arbeiten gegen den Zinseszins
- Sprechtext-Bezug: Der Kostenunterschied wirkt jedes Jahr erneut und das fehlende Geld kann danach selbst keine Rendite mehr erwirtschaften.
- Viewer Change: Der Zuschauer sieht, wie bei mehreren Jahresschritten jeweils ein kleiner roter Kostenanteil aus einem wachsenden grünen Depot herausgelöst wird und sich separat ansammelt.
- Animation Intent: Die Szene macht sichtbar, dass laufende Kosten wiederholt wirken und nicht nur einmal am Anfang abgezogen werden.
- Mechanik: Wiederkehrende Kosten-Slices werden aus einem wachsenden Depot extrahiert und in einem Kostenbehälter gesammelt.
- Technikbeschreibung: React-basierte geometrische 2D/2.5D-Prozessanimation mit zeitversetzten Kostenscheiben, wachsendem Depotkörper und separatem Kostenkörper.
- Tool Stack: React, Remotion interpolate, CSS transforms
- Composition Family: physical-process
- Motion Signature Camera: locked-front-process-view
- Motion Signature Layout: central-portfolio-to-right-cost-bin
- Motion Signature Transformation: recurring-red-slices-extract-and-accumulate
- Startzustand: Ein kompaktes grünes Depot steht allein.
- sichtbare Mechanik: Das Depot wächst, während nacheinander kleine rote Scheiben nach rechts herauswandern.
- Resultat: Das Depot ist größer, aber rechts ist gleichzeitig ein sichtbarer Kostenkörper entstanden.
- Motion Channels: Depot-Höhenwachstum; horizontale Kostenscheiben-Transfers; Kostenkörper-Akkumulation
- Visual Beats: Depot startet ohne sichtbaren Kostenabfluss; erste rote Scheiben verlassen das Depot; mehrere Jahresschritte laufen; Kostenkörper bleibt als Ergebnis sichtbar
- SFX-Cues: dezenter Tick bei einzelnen Jahresschritten, kein Dauergeräusch
