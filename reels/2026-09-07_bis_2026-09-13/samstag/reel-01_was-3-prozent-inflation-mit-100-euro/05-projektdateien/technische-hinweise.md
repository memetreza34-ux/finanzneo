# TECHNISCHE HINWEISE

- Reel: 1080 × 1920, 30 fps
- Flow-Bilder: 1:1, V9 stylized 3D, deep black
- Reel-Canvas: statisch #000000
- Header V5: Y154, 56 px, max. 2 Zeilen
- Visual: Y320–1400, AnimationStage hart geclippt
- Caption: bottom340, aktives Wort grün
- Future V3: Bild ohne neue Information max. 4,0 s
- Audioziel: -16 LUFS integrated / -1 dBTP
- Phase 3 darf versiegelte animation.tsx nicht kreativ ersetzen

FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3
Die Hauptmechanik muss groß und bildfüllend genug sein; excessive empty space gilt als Qualitätsfehler.

COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2
## Szene 01 — harter Render-Vertrag
- Szene 01 ist Cover und erster sichtbarer Frame.
- Exakten Titel aus scene-index.title mit Remotion bereits bei Frame 0 rendern.
- Während scene-01 KEINE Caption-/Subtitle-Komponente mounten oder sichtbar machen. Untertitel beginnen erst mit scene-02.
- Kein Standard-Header-Icon, keine Erklärung, kein CTA.
- Titel mindestens 30 Frames stabil.
- Der finale Export erzeugt cover.png aus Frame 0 der geprüften finalen MP4.

## Finaler Cover-/Export-Vertrag
- scene-01 = Cover.
- FINAL_RENDER_QA_PASSED löst automatisch `reel:export` aus.
- Universelle Social-Caption kommt aus `04-caption/caption.txt`.
