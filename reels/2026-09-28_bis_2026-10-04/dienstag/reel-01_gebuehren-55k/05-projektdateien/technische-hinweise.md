# TECHNISCHE HINWEISE

- Reel: 1080 × 1920, 9:16, 30 fps
- Flow-Bilder inklusive Cover: 1:1, keine Bildreferenz
- Bildwelt: finanzneo-stylized-3d-animated-black-v9
- Flow-Hintergrund: deep black
- Remotion-Reel-Canvas: #000000 statisch (finanzneo-pure-black-background-v1)
- keine Partikel/Aurora/Grid/Glow/Vignette als Reel-Hintergrund
- Header: Y154, weiß, 56 px, min. 50 px, max. 2 Zeilen, 34-px-Icon
- Visual: Y320–1400
- AnimationStage: hart auf Y320–1400 geclippt
- Captions: bottom340, aktives Wort grün, Rest weiß
- Animation: fertige Phase-1-animation.tsx, START → MECHANISMUS → ERGEBNIS, Result-Hold >=15 Frames
- Animation-Hacks/Debug-Platzhalter verboten
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP

## Finaler Cover-/Export-Vertrag

- scene-01 = Cover; dieselbe 1:1-Quelldatei wird im Reel und als Cover verwendet.
- FINAL_RENDER_QA_PASSED löst automatisch `reel:export` aus.
- Finalvideo: `06-export/<reel-name>.mp4`.
- Universelle Social-Caption: `06-export/caption-universal.txt` aus `04-caption/caption.txt`.
