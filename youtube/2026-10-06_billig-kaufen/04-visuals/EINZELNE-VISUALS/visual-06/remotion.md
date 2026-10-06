# Remotion-Spezifikation visual-06
MOTION_STANDARD: finanzneo-youtube-motion-v3
- Kapitel: Kosten pro Nutzung
- Sprechtext-Bezug: 40/200 und 20/50 lösen sich zu 0,20 bzw. 0,40 € auf.
- Viewer Change: 40/200 und 20/50 lösen sich zu 0,20 bzw. 0,40 € auf.
- Animation Intent: Der Sprechpunkt wird sichtbar.
- Mechanik: cost-per-use-example
- Technikbeschreibung: Exakte Rechenzeilen
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: data-comparison
- Motion Signature Camera: statische frontale Editorial-Ansicht
- Motion Signature Layout: gerahmter content-spezifischer Bereich
- Motion Signature Transformation: mehrere sichtbare Zustände
- Motion Channels: Opacity + Position/Skalierung oder Werte-Reveal
- Visual Beats: Start → Mechanik → Ergebnis
- SFX-Cues: optional


## Clarity Plan

- Core Message: Ein höherer Kaufpreis kann pro Nutzung günstiger sein.
- Visual Form: step-by-step calculation comparison
- Two-Second Takeaway: 0,20 € pro Nutzung ist günstiger als 0,40 €.
- Why This Form: Die zwei Beispielrechnungen müssen nacheinander entstehen und erst danach direkt verglichen werden.
- START: Zuerst wird nur 40 € ÷ 200 Nutzungen gezeigt.
- CHANGE: Nach dem ersten Ergebnis folgt separat 20 € ÷ 50 Nutzungen.
- RESULT: Nur die beiden Resultate 0,20 € und 0,40 € stehen groß im direkten Vergleich.
- RESULT HOLD: 45 Frames
- Regel: Neue Informationen nacheinander. Ergebnis ruhig stehen lassen. Bewegung ohne Erklärwert vermeiden.
