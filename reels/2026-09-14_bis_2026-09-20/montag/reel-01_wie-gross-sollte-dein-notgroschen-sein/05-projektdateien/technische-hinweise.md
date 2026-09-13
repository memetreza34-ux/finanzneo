# Technische Hinweise

COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3
FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1
PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1

- 1080×1920, 30 fps.
- Zentraler Canvas bleibt statisch #000000.
- V5: Header Y154; Visual Y320–1400; Captions bottom340.
- scene-01: exakter Titel aus scene-index.title ab Frame 0, Hero-Bild sichtbar, keine Captions, kein Standard-Header-Icon.
- Ab scene-02: echte SceneHeader + Icon + audio-synchrone Captions.
- IMAGE: Bild bleibt einziges Hauptvisual; keine erklärenden Motion-Overlays.
- ANIMATION: kanonische animation.tsx aus Phase 1; kein Flow-Bild als Hauptvisual.
- Finale Szenenlängen werden aus dem finalen Nutzer-Voiceover und echten Wort-Timings retimed.
- Future-V3 Candidate vor QA auf -16 LUFS / -1 dBTP mastern.
- Der finale Export erzeugt cover.png aus Frame 0 der geprüften finalen MP4.
