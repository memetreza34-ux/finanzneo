# PLAYWRIGHT VISUAL QA

VISUAL_BEAT_CONTRACT: finanzneo-visual-beats-v1

## Bildszenen
Prüfe je mindestens einen stabilen Frame: 01, 02, 04, 06, 07, 08, 09, 11, 13.

Zusätzlich prüfen:
- Kein statisches Bild bleibt nach seiner Aussage unnötig stehen.
- Die Bilder 06→07→08→09 dürfen direkt aufeinander folgen, weil jeder Wechsel einen neuen Gedanken zeigt.
- Hauptmotiv groß genug; keine übermäßige tote schwarze Fläche.
- Header/Icon optisch konsistent.

## Animationsszenen
- scene-03: ca. 0.3 s / 1.7 s / 3.2 s / 4.8 s / final hold
- scene-05: ca. 0.3 s / 1.8 s / 3.4 s / final hold
- scene-10: ca. 0.3 s / 2.2 s / 4.2 s / final hold
- scene-12: ca. 0.3 s / 2.0 s / 4.0 s / final hold

FAIL wenn der gesprochene Gedanke wechselt, aber sichtbar nur Kamera/Zoom weiterläuft.
