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


COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2

## Szene 01 — harter Render-Vertrag

- Szene 01 ist ein echtes Reel-Cover und zugleich der erste sichtbare Videoframe.
- Rendere den exakten Titel aus scene-index.title mit Remotion bereits bei Frame 0. Kein Fade-in, kein Intro davor, keine verzögerte Einblendung.
- Während scene-01 darf KEINE Caption-/Subtitle-Komponente gemountet oder sichtbar sein. Untertitel beginnen erst mit scene-02.
- Szene 01 enthält nur Hero-Bild + Reel-Titel. Kein normales SceneHeader-Icon, keine zweite Textzeile als Erklärung, kein CTA, keine Zusatzkarte.
- Der Titel muss mindestens die ersten 30 Frames stabil lesbar sein und darf während scene-01 sichtbar bleiben.
- Das Flow-Bild selbst enthält den Titel NICHT; die exakte Typografie kommt aus Remotion.
- Implementiere die Caption-Sperre im tatsächlichen Composition-Code über die aktive Szene/Frame-Grenze, nicht nur über Metadaten.
- Playwright/Render-QA muss Frame 0 prüfen: Titel sichtbar, Bild sichtbar, keine Untertitel, kein Icon, keine Zusatztexte.
- Der finale Export erzeugt cover.png aus Frame 0 der bereits geprüften finalen MP4. So ist das Cover exakt dieselbe sichtbare erste Szene inklusive Titel.
