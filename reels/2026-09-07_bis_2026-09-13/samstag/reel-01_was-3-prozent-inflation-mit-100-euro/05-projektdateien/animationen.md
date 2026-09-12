# ANIMATIONEN

VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

Alle vier Animationsszenen sind kanonisch in Phase 1 implementiert und nutzen `finanzneo-phase1-animation-code-v1` + `finanzneo-premium-physical-animation-v2`.

- scene-03: reale Einkaufspreis-Baseline 100 € wird bezahlt.
- scene-04: Kalender-Jahressprung bepreist denselben Einkauf von 100 € auf 103 € neu.
- scene-07: Konto bleibt 100 €, heutiger Kaufkraftgegenwert fällt sichtbar auf rund 74 €.
- scene-09: Konto bleibt 100 €, derselbe Einkauf steigt auf 134 €; `lottie/lupe.json` ist nur eine kleine Support-Schicht.

Die Hauptmechanik muss groß sein. Weiter Kontext darf nicht zu leerer schwarzer Fläche führen; Post-Render-Occupancy-QA prüft reale Visualbelegung. Alle Ergebnisse halten mindestens 20 Frames stabil.
