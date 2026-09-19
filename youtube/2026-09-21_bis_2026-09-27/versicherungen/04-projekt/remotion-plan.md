# Remotion-Plan

- Composition: wird in Phase 3 aus `visual-index.json` generiert
- Format: 1920 × 1080, 30 fps
- Layout: YOUTUBE_STYLE, Visualzone y 180–990
- Schnitte: folgen den echten Wortzeiten, nicht einem Raster
- Keine Untertitel im Bild und keine Untertiteldatei im Export
- Ton wird vor der Render-QA auf −16 LUFS / −1 dBTP gemastert

## Phase 3

```bash
npm run youtube:ready    -- youtube/2026-09-21_bis_2026-09-27/versicherungen
npm run youtube:phase3:stage -- youtube/2026-09-21_bis_2026-09-27/versicherungen
npm run youtube:phase3:build -- youtube/2026-09-21_bis_2026-09-27/versicherungen
npm run youtube:render   -- youtube/2026-09-21_bis_2026-09-27/versicherungen
```
