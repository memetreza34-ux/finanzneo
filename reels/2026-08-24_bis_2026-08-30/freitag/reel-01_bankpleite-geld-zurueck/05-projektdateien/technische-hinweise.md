# Technische Hinweise — Premium V3

- 1080 × 1920, 30 fps
- 15 Beats, 9 Bild / 6 Remotion = exakt 60/40
- Bildbeat ideal 3,5–5,5 s; absolut max. 6 s
- Google Flow: square 1:1, `contain`, keine Bildreferenz
- Stylized-3D-Lock: `finanzneo-stylized-3d-editorial-v5`
- jede Szene: SceneHeader + passendes Icon
- Header ca. Y=118
- zentrale Visualzone ca. Y=390–1560
- Captions Premium V3: satzbasiert, Active-Word hellgrün, Rest weiß, ca. bottom=285, crisp Backplate, kein Glow-Blur, kein Jump/Scale
- Bilder/Animationen starten am `audioTrigger`, Zielabweichung max. ca. 0,15 s
- Übergänge 4–6 Frames, gleiche Continuity-Sprache, kein Fade-to-black
- Animationen Start → Mechanismus → Ergebnis; ohne Ton verständlich
- keine schwarzen Texte auf dunklem Hintergrund
- Finalrender: H.264 CRF14, PNG-Zwischenframes, AAC320k, yuv420p
- Audioziel ungefähr -16 LUFS, True Peak <= -1 dBTP
