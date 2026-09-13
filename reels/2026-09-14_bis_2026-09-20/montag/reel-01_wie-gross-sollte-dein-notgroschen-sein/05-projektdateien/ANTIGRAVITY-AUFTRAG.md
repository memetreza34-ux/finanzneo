# ANTIGRAVITY — PHASE 3

IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
LITERAL_FIRST_POLICY: Literal first, creative second.
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3
FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1
PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1
COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2

Phase 3 startet erst, wenn der Nutzer die originalen Google-Flow-Bilder, genau ein finales Voiceover und echte Wort-Timings geliefert hat.

## Szenentypen
- IMAGE: Flow-Bild ist einziges Hauptvisual. Ab scene-02 SceneHeader/Icon + echte Captions. Keine erklärenden Remotion-Overlays, Pfeile, Parallax-, Lottie-, SVG- oder Chart-Hauptmechanik über dem Bild.
- ANIMATION: versiegelte Phase-1-animation.tsx verwenden. Kein generiertes Bild als Hauptvisual.

## Szene 01 — harter Render-Vertrag
- Szene 01 ist Hero-Bild + exakter Reel-Titel ab Frame 0.
- Während scene-01 darf KEINE Caption-/Subtitle-Komponente gemountet oder sichtbar sein.
- Untertitel beginnen erst mit scene-02.
- Kein normales Header-Icon, keine Zusatzkarte, kein CTA.
- Der finale Export erzeugt cover.png aus Frame 0 der bereits geprüften finalen MP4.

## Finalisierung
1. Assets exakt zuordnen.
2. Echte Wort-Timings übernehmen; keine künstlich gleich langen Szenen.
3. SceneHeader + Icon ab scene-02 mounten.
4. Captions ab scene-02 audio-synchron mounten.
5. Versiegelte Animationen nicht kreativ ersetzen.
6. SFX nur framegenau und unterhalb der Voiceover-Priorität.
7. Candidate auf -16 LUFS / -1 dBTP mastern.
8. Playwright/Render-QA ausführen; sichtbarer Timing-, Layout- oder Erklärfehler = FAIL.
9. Erst nach PASS final exportieren.

## Future Image Storytelling V3
Literal first, creative second. SUBTITLE-OFF-TEST und TRANSFERABILITY-TEST bleiben QA-Pflicht für Bilder.
Förderbänder, Schienen, Schranken, Käfige, Fantasie-Portale und ähnliche Fantasiemechaniken sind keine Standard-Erklärung.
