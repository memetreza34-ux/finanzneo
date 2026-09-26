# Warum Ratenzahlung gefährlicher ist, als sie wirkt

PRODUCTION_MODE: images-only
PHASE_A: static
TARGET_DURATION: ca. 2:30 nach Voiceover-Pacing
FORMAT: YouTube Longform 16:9
VISUAL_COUNT: 20
LAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v1
IMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1

Dieses Video ist der zweite Phase-A-Test nach `warum-dein-geld-verschwindet-images-only`.

WICHTIG:
- Die freigegebene FinanzNeo-3D-Bildwelt bleibt unverändert.
- Phase A bedeutet nur: keine Animation.
- Jede Szene behält kurze Überschrift + passendes Icon + eingebettetes Visualfenster auf sichtbarer deep-black Grundfläche.
- Flow-Bilder sind niemals fullscreen.
- Exakte Zahlen, Pfeile, kurze Erklärtexte und Mini-Charts dürfen statisch mit Remotion gesetzt werden.
- Keine Bewegung, kein Count-up, kein Fade, kein Zoom, keine Chart-Animation.

Geplante Mischung für 20 Szenen:
- 13 × `3d-story`
- 4 × `3d-explainer`
- 3 × `static-data`

Audio:
- `config/finanzneo-audio-standard.json` ist verbindlich.
- Voiceover standardmäßig 1,10×.
- unnötig lange Pausen werden gekürzt; natürliche kurze Sprechpausen bleiben.
- Wort-Timings, Untertitel und Szenendauern folgen ausschließlich `voiceover.processed.wav`.
- Musik und SFX werden nicht mitbeschleunigt.

Produktionsreihenfolge:
1. Skript und Storyboard prüfen.
2. Voiceover aufnehmen und nach dem gemeinsamen Audio-Standard verarbeiten.
3. Nur die 17 tatsächlich benötigten Flow-Bilder strikt sequenziell erzeugen; Visual 07, 14 und 19 sind reine statische Remotion-Visuals.
4. Exakte statische Erklärlayer für Visual 02, 06, 07, 10, 14, 15 und 19 bauen.
5. Überschrift + Icon + Visual im festen 1920×1080 Layout zusammensetzen.
6. Wort-Timings aus dem verarbeiteten Voiceover erzeugen und die Timeline daran ausrichten.
7. Phase-A-Validation, QA und finalen Render durchführen.
