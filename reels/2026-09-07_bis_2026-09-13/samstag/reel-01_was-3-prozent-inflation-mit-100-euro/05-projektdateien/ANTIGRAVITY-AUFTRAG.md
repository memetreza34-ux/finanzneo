# ANTIGRAVITY — PHASE 3

IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
Literal first, creative second.
TRANSFERABILITY-TEST: Nutzerbilder müssen exakt die dokumentierte reale Situation zeigen.
Förderbänder, Schienen, Schranken, Käfige, Fantasie-Portale und Sortieranlagen sind keine Standard-Erklärung.

1. Nutzer liefert exakt die sechs finalen Google-Flow-Bilder aus `03-szenen/00-ALLE-BILDER-HIER-REIN/`.
2. Nutzer liefert genau ein finales Voiceover in `02-audio/`.
3. Echte Wort-Timings aus genau diesem Voiceover verwenden.
4. Ausschließlich die versiegelten Phase-1-animation.tsx-Dateien nutzen; Mechanik nicht ersetzen oder vereinfachen.
5. Lottie in scene-09 bleibt nur Support und wird aus der kanonischen Animation übernommen.
6. Playwright-/Render-QA ist Pflicht.
7. Preflight → Candidate → Future-V3-Audio-Mastering → Render-QA → Export.

FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3
Vor Post-Render-QA den Candidate automatisch auf -16 LUFS / -1 dBTP mastern. Animations-Hauptmechanik groß halten; lange statische Holds vermeiden.

COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2
## Szene 01 — harter Render-Vertrag
- Szene 01 = Hero-Bild + exakter Reel-Titel aus scene-index.title ab Frame 0.
- KEINE Caption-/Subtitle-Komponente während scene-01 mounten oder sichtbar machen.
- Untertitel beginnen erst mit scene-02.
- Kein Standard-Header-Icon und kein Zusatztext in scene-01.
- Titel mindestens 30 Frames stabil lesbar.
- Playwright prüft Frame 0: Titel sichtbar, Bild sichtbar, keine Untertitel, kein Icon.
- Der finale Export erzeugt cover.png aus Frame 0 der geprüften finalen MP4.
