# Remotion-Spezifikation visual-04

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 2 — Was Abos wirklich kosten
- Sprechtext-Bezug: Fast jeder fünfte Haushalt zahlt mehr als 100 € im Monat
- Startet bei: „Und fast jeder fünfte Haushalt“ · Stufen bei: „fast jeder fünfte“ · „mehr als hundert“
- Viewer Change: Von 100 Haushalten färben sich 19 rot — fast jeder fünfte zahlt über 100 € im Monat.
- Animation Intent: Einen Prozentwert als zählbare Menge greifbar machen.
- Mechanik: hundred-households-recolor-share
- Technikbeschreibung: 10×10-Punkteraster, 19 Punkte wechseln gestaffelt auf Rot, Zähler 0 → 19.
- Tool Stack: Remotion, React, src/design-system/daten.tsx (Punkteraster, Zaehlwerk)
- Composition Family: proportion-grid
- Motion Signature Camera: still
- Motion Signature Layout: Raster links, Zahl rechts
- Motion Signature Transformation: Umfärben eines Anteils
- Sichtbare Zustände: 100 Haushalte → 19 von 100 über 100 € im Monat
- Motion Channels: Punkte erscheinen, 19 Punkte färben sich, Zähler zählt
- Regeln: Größen aus Werten (skala), wertzeigende Federn ohne Überschwingen, Inhalt oberhalb der Untertitel-Zone (y ≤ 860), Quelle oben links
- SFX-Cues: optional bei Landungen/Einrasten (Phase 3)
