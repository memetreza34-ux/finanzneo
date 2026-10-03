# Remotion-Spezifikation visual-08

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Von Teilzahlung zu Vollzahlung
- Sprechtext-Bezug: siehe visual-index.json
- Viewer Change: Auf dem erzeugten Einstellungsbild wandert die Auswahl sichtbar von Teilzahlung zu Vollzahlung 100 %, danach wird ein grüner Bestätigungszustand eingeblendet.
- Animation Intent: Der Schluss endet mit einer konkreten prüfbaren Handlung statt nur mit Warnung.
- Mechanik: payment-setting-switch
- Technikbeschreibung: Das Flow-Bild bildet die ruhige UI-Basis; Remotion legt einen animierten Auswahlring und Bestätigungsstatus darüber.
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: image-composite
- Motion Signature Camera: statische Frontansicht auf dem Nutzerbild
- Motion Signature Layout: UI-Basisbild vollflächig, Fokus-Overlay auf den beiden Abrechnungsoptionen
- Motion Signature Transformation: Fokus verschiebt sich von Teilzahlung zu Vollzahlung und bestätigt den Endzustand
- Motion Channels: Position des Auswahlrings; Farb- und Opazitätswechsel des Bestätigungsstatus
- Sichtbare Beats: Teilzahlung aktiv; Auswahl bewegt sich; Vollzahlung 100 % aktiv; Einstellung prüfen

Die Technik wurde aus dem Viewer Change gewählt. Keine Ersatzanimation in Phase 3.
