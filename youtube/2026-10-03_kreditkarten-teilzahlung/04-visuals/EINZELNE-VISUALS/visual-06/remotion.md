# Remotion-Spezifikation visual-06

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Teilzahlung gegen Vollzahlung
- Sprechtext-Bezug: siehe visual-index.json
- Viewer Change: Ein gemeinsamer 2.000-€-Start teilt sich in zwei Pfade: Teilzahlung zieht sich über 24 Monate, Vollzahlung endet beim nächsten Abrechnungstermin.
- Animation Intent: Macht den Unterschied der Abrechnungsart ohne moralische Wertung sichtbar.
- Mechanik: repayment-path-fork
- Technikbeschreibung: Zwei horizontale SVG-Timelines starten am selben Punkt; Vollzahlung endet kurz und neutral, Teilzahlung läuft lang mit roten Zinsmarkern.
- Tool Stack: React, SVG, Remotion interpolate
- Composition Family: scenario-comparison
- Motion Signature Camera: statische Frontansicht
- Motion Signature Layout: zwei übereinanderliegende horizontale Zeitpfade mit identischem Startpunkt
- Motion Signature Transformation: beide Pfade wachsen gleichzeitig, aber mit stark unterschiedlicher Länge und Zinsmarkierung
- Motion Channels: Längen-Reveal beider Timelines; Zinsmarker erscheinen nur auf dem Teilzahlungs-Pfad
- Sichtbare Beats: gleicher Startsaldo; Vollzahlung endet beim nächsten Termin; Teilzahlung läuft weiter; 24 Monate im Beispiel

Die Technik wurde aus dem Viewer Change gewählt. Keine Ersatzanimation in Phase 3.
