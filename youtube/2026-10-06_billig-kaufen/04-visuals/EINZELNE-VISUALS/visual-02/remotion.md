# Remotion-Spezifikation visual-02
MOTION_STANDARD: finanzneo-youtube-motion-v3
- Kapitel: Beispielrechnung
- Sprechtext-Bezug: 20 € + 20 € werden 40 €, danach 35 € Vergleich.
- Viewer Change: 20 € + 20 € werden 40 €, danach 35 € Vergleich.
- Animation Intent: Der Sprechpunkt wird sichtbar.
- Mechanik: repeat-purchase-cost
- Technikbeschreibung: Zwei Kaufbeträge plus Vergleich
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: comparison-math
- Motion Signature Camera: statische frontale Editorial-Ansicht
- Motion Signature Layout: gerahmter content-spezifischer Bereich
- Motion Signature Transformation: mehrere sichtbare Zustände
- Motion Channels: Opacity + Position/Skalierung oder Werte-Reveal
- Visual Beats: Start → Mechanik → Ergebnis
- SFX-Cues: optional


## Clarity Plan

- Core Message: Zweimal 20 € sind 40 € und damit mehr als einmal 35 €.
- Visual Form: sequential comparison schema
- Two-Second Takeaway: 20 € + 20 € = 40 € > 35 €.
- Why This Form: Eine schrittweise Rechnung macht die Kostenfolge ohne Ablenkung exakt sichtbar.
- START: Nur der erste Kauf mit 20 € ist sichtbar.
- CHANGE: Ein zweiter 20-€-Kauf kommt hinzu und bildet 40 €.
- RESULT: 40 € steht klar 35 € gegenüber; 40 € ist als höhere Gesamtausgabe markiert.
- RESULT HOLD: 45 Frames
- Regel: Neue Informationen nacheinander. Ergebnis ruhig stehen lassen. Bewegung ohne Erklärwert vermeiden.
