# Drei-Konten-System — Remotion

- Composition-ID: `DreiKontenSystem`
- 10 Szenen à 6 Sekunden, 30 fps, 1080 × 1920
- 4 echte Remotion-Animationsszenen
- 6 Bildszenen
- Verhältnis: exakt 40 % Animation / 60 % Bilder

## Quellenvertrag

- Bildszene wird durch `bildprompt.txt` und später genau eine finale Bilddatei definiert.
- Animationsszene wird durch `remotion.md` und die React-Komponente definiert.
- Es existieren keine Motionprompt-Dateien.
- In den redaktionellen Szenenordnern existieren keine Platzhalterbilder.
- Standbildbewegungen sind zentral in `shared.tsx` implementiert.

Vor Studio oder Render kopiert `npm run assets:drei-konten` vorhandene finale Bilddateien nach `public/reels/drei-konten-system/` und aktualisiert `asset-manifest.json`. Fehlt ein finales Bild, bleibt der bereits zentrale technische Fallback unter `public/` aktiv.
