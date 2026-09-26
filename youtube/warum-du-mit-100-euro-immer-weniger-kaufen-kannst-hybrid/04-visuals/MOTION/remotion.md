# Remotion-Plan — Phase B Hybrid V2

MOTION_STANDARD: finanzneo-youtube-motion-v4-simple
LAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v2
MOTION_CANVAS: full-1920x1080 for pure Remotion
SAFE_AREA: minimum 64 px, implemented with 96 px in the shared source
FLOW_IMAGE_FULLSCREEN: forbidden
HYBRID_OVERLAY_MAY_EXTEND_BEYOND_FLOW_WINDOW: true

## Produktionsprinzip

- Reine Remotion-Szenen dürfen die gesamte 1920×1080-Fläche nutzen.
- Bild+Remotion: Flow-Bild bleibt contained; Remotion darf über das Bildfenster hinaus erklären.
- Keine wichtigen Inhalte an den Rand setzen.
- Kein unbeabsichtigtes Cropping/Clipping.
- Bewegung wird ausschließlich frame-basiert mit `useCurrentFrame()` + `interpolate()` gesteuert.
- Keine CSS-Keyframes, Timer, Randomness oder Runtime-Fetches.

## Szenen

- 02: Betrag vs. Kaufkraft — Hybrid, SCALE_IN
- 03: 2-%-/10-Jahres-Rechnung — Full-frame Data, COUNT_UP
- 05: wachsende Großkosten — Hybrid, BAR_GROW
- 06: kumulative Preisentwicklung — Full-frame, LINE_DRAW
- 07: nominal vs. real — Hybrid, BAR_GROW
- 09: Gehalt vs. Preise — Full-frame, BAR_GROW
- 10: +5 % / +4 % / ≈ +1 % real — Hybrid, COUNT_UP
- 11: Notgroschen-Zweck — Full-frame Data, HIGHLIGHT
- 13: drei Zeithorizonte — Hybrid, SLIDE_UP
- 14: Zeitachse — Full-frame, LINE_DRAW
- 15: Aufgaben-Zuordnung — Hybrid, LINE_DRAW
- 16: Dreier-Regel — Full-frame Data, FADE_IN
- 17: Abschlussfrage — Hybrid, HIGHLIGHT

Alle Exporte liegen bewusst in einer gemeinsamen deterministischen Quelle `04-visuals/MOTION/animation.tsx`, damit die Mechanik konsistent bleibt, ohne die Visualauswahl zu vereinheitlichen.