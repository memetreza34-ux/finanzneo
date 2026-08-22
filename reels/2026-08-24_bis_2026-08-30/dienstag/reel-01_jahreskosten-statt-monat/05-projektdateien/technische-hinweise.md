# Technische Hinweise

## Video
- 1080 × 1920
- 30 fps
- 9:16
- finale Laufzeit aus dem echten Voiceover; Zielbereich 60–90 Sekunden

## Bilder
- alle Flow-Quellen strikt 1:1
- `object-fit: contain`
- kein blurred duplicate background
- maximal intentional scale 1.04
- keine wichtigen Motive/Labels beschneiden

## Layout
- Headline Y ca. 78
- Visual Y ca. 270–1350
- Subtitle bottom 320
- Subtitle left 62
- Subtitle right 150

## Captions
- exakt ein vollständiger Satz sichtbar
- aktives gesprochenes Wort finance-green
- übrige Wörter weiß
- maximal zwei balancierte Zeilen
- kein Word-Jump
- keine Größenanimation
- kurze Pausen halten den vorherigen Satz sichtbar

## Audio
- genau ein finales Voiceover
- echte Wortzeiten ausschließlich aus dieser Datei
- Ziel ca. -16 LUFS integrated
- True Peak <= -1 dBTP

## Phase 3
Vor Beginn zwingend:
`npm run reel:ready -- reels/2026-08-24_bis_2026-08-30/dienstag/reel-01_jahreskosten-statt-monat`

Danach Bilder synchronisieren, echte Timeline ableiten, Remotion bauen, validieren, TypeScript prüfen, Preview rendern, Frames/MP4/Ton prüfen.
