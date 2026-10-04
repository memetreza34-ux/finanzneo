# Remotion-Spezifikation visual-08

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Abschluss
- Sprechtext-Bezug: Offener Saldo über Monate bedeutet: Du nutzt zusätzlich einen Kredit.
- Viewer Change: Eine native, offene Remotion-Einstellung zeigt zunächst Teilzahlung; der Auswahlindikator wandert anschließend zu Vollzahlung 100 % und bestätigt den Endzustand.
- Animation Intent: UI-Zustand und Text müssen exakt sein. Deshalb wird diese Szene vollständig code-basiert gebaut und nicht mehr als Google-Flow-Bild erzeugt.
- Mechanik: payment-setting-switch
- Technikbeschreibung: Zwei offene horizontale Einstellungszeilen ohne schwebendes Panel; ein vertikaler Auswahlindikator bewegt sich zwischen den Zuständen und wechselt von Rot-Orange zu Emerald.
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: settings-action-motion
- Motion Signature Camera: statische frontale Interface-Ansicht
- Motion Signature Layout: zwei breite offene Zeilen auf schwarzem Hintergrund ohne Containerkarte
- Motion Signature Transformation: Auswahlindikator verschiebt sich vertikal und bestätigt den neuen Zustand
- Startzustand: Teilzahlung ist markiert
- sichtbare Mechanik/Transformation: Indikator bewegt sich zur Vollzahlung und wechselt die semantische Farbe
- Resultat: Vollzahlung 100 % ist ausgewählt und „Einstellung geprüft“ erscheint
- Motion Channels: vertikale Indikatorbewegung, Farbwechsel, Bestätigungs-Opacity
- SFX-Cues: optional dezenter Auswahlklick und Bestätigungs-Tick
