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


COVER_HOOK_CONTRACT: finanzneo-cover-hook-v3

## Szene 01 — harter Render-Vertrag
- Exakter Reel-Titel ist ab Frame 0 sichtbar; kein Intro/Fade davor.
- Kein normaler SceneHeader und kein Header-Icon in scene-01.
- Sobald das Voiceover ab dem ersten gesprochenen Wort startet, MUSS die globale Captions-Komponente sichtbar und wortgenau synchron sein — auch innerhalb scene-01.
- Gesprochenes Audio ohne Captions ist verboten. Eine 5–6 Sekunden lange captionlose Cover-Szene ist ein harter FAIL.
- Das Flow-Bild selbst enthält weder Titel noch Untertitel.
- Frame-0-Coverexport bleibt erlaubt; Captions erscheinen nur, wenn bei Frame 0 bereits ein Wort gesprochen wird.
- Render-QA prüft Titel, Hero-Bild und Caption-Kontinuität ab dem ersten gesprochenen Wort.
