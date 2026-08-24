# Technische Hinweise

- Reel: 1080 × 1920, 9:16, 30 fps
- Flow-Quellen inklusive Cover: strikt 1:1
- Bildwelt: Stylized 3D V5 + Physical Explainer Editorial V7
- ein großes physisches Hero-Objekt + 3–6 konkrete themenspezifische Objekte pro Flow-Bild
- keine Bildreferenzen
- kein Dashboard/UI, Microchip/Circuit-Board, Gameboard, Orbit-Modul, Vier-Ecken-Tiles oder Liniennetz
- Bildbeat ideal 3,5–5,5 s, absolut maximal 6 s
- Szenenschnitt folgt echten Wort-Timings und `audioTrigger`
- jede Szene: SceneHeader + passendes Icon
- zentrale Layout-/Caption-/Transitionwerte ausschließlich aus `REEL_STYLE`; Reel-Metadaten dürfen sie nicht überschreiben
- Captions: satzbasiert, aktives Wort hellgrün, Rest weiß, kein Stroke/Glow/Jump/Scale
- Animationen: START → MECHANISMUS → ERGEBNIS; ohne Ton grundsätzlich verständlich
- Animationsfarben: weiß neutral, grün Fokus/Lösung, rot Warnung, gold Geld/Wert
- Fade-to-black verboten; zentrale Continuity aktuell 3 Frames
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP
- Finalrender: H.264 CRF14, PNG-Zwischenframes, AAC 320k, yuv420p
