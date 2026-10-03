# Remotion-Spezifikation visual-08

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Abschluss
- Sprechtext-Bezug: Offener Saldo über Monate bedeutet: Du nutzt zusätzlich einen Kredit.
- Viewer Change: Eine klar gestaltete Banking-Einstellung wird vollständig in Remotion aufgebaut; die Auswahl wandert von Teilzahlung zu Vollzahlung 100 % und bestätigt den Endzustand.
- Animation Intent: UI-Text und Zustand müssen exakt, sauber und animierbar sein; deshalb kein Google-Flow-UI-Bild mehr.
- Mechanik: payment-setting-switch
- Technikbeschreibung: Native React/CSS-Einstellung mit zwei großen Zeilen; ein farbcodierter Auswahlrahmen bewegt sich zwischen den Optionen, Bestätigung erscheint danach.
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: settings-action
- Motion Signature Camera: statische frontale Interface-Ansicht
- Motion Signature Layout: ein großes zentrales Einstellungsmodul mit zwei übereinanderliegenden Optionen
- Motion Signature Transformation: Auswahlrahmen verschiebt sich vertikal und wechselt semantisch von Rot-Orange zu Emerald
- Startzustand: Teilzahlung ausgewählt
- sichtbare Mechanik/Transformation: Auswahl wandert nach unten
- Resultat: Vollzahlung 100 % ausgewählt und bestätigt
- Motion Channels: vertikale Positionsänderung, Farbwechsel, Bestätigungs-Opacity
- SFX-Cues: optional ein dezenter Auswahlklick und Bestätigungs-Tick
