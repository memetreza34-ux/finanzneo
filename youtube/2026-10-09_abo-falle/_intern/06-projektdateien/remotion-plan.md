# Remotion-Plan — finanzneo-youtube-motion-v3

- Ausgabe: 1920 × 1080, 16:9, 30 fps
- Viewer Change zuerst; Technik danach.
- Motion World: finanzneo-youtube-light-motion-v2. Die Animation bleibt hell, sauber und 2D. Unterschiedliche Designs sind erlaubt, aber keine dunklen Welten, kein Full-3D und keine großen generischen Szenenüberschriften. Die aktuelle Mechanik/Visual-Bibliothek liegt unter src/youtube-motion/light-v3/.
Wähle pro Szene frei zwischen Vergleich, Chart, Tabelle, Icons, Dokument, Timeline, Prozess, Flow-Diagramm, Route, abstrakter 2D-Geometrie oder einer anderen hellen Custom-Lösung.
- Erlaubt: Custom React, SVG, Canvas, Masks, clip-path, Paths, Shapes, Motion Blur, Effects, Lottie als Support, Datenvisualisierung, Bild+Motion-Hybrid und neue sinnvolle Kombinationen.
- Composition Families sind freie Beschreibungen, keine erlaubte Endmenge.
- Neue kanonische Light-2D-Bibliothek: src/youtube-motion/light-v3/. Dort sind Mechanik/Core von Visual-Komponenten getrennt.
- Bestehende FinanzNeo-Komponenten sind optionale Werkzeuge, keine Pflichtvorlagen.
- Pro Motion-Visual: viewerChange + animationIntent + mechanicId + visualTechniqueId + techniqueDescription + toolStack + motionSignature + mindestens eine klare erklärende Bewegung + Start/Result-Beats.
- Anti-Fake-Variation: neuer Name allein reicht nicht; Kamera + Layout + Transformation werden gegen die letzten vier Motion-Visuals geprüft.
- Wiederholung bleibt erlaubt, wenn sie für den Inhalt wirklich die beste Lösung ist und mit repeatTechniqueReason begründet wird.
- Schnitte und finale Dauern folgen dem finalen Voiceover.
