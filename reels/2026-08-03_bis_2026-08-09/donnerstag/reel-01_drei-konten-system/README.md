# Reel 01 — Drei-Konten-System

**Veröffentlichung:** Donnerstag, 6. August 2026  
**Format:** vertikales FinanzNeo-Reel, 1080 × 1920, 30 fps  
**Geplante Länge:** 60,0 Sekunden  
**Szenen:** 10

## Verbindliches Verhältnis

- 6 Bildszenen = 60 %
- 4 native Remotion-Animationsszenen = 40 %

## Produktionsordner

- `00-cover`: Cover-Prompt und Coverbild
- `01-voice-script`: kompletter Sprechtext
- `02-audio`: finales Voiceover
- `03-szenen`: Prompts, Szenenindex und Bildablage
- `04-caption`: Social Caption und spätere Wort-Captions
- `05-review`: Quellen und Freigabecheck
- `06-video`: finaler Export
- `render`: Test-Render
- `timeline`: Szenenlängen

## Remotion

- Composition-ID: `DreiKontenSystem`
- Code: `src/reels/drei-konten/DreiKontenSystem.tsx`
- Studio: `npm run studio:drei-konten`
- Vorschau: `npm run render:drei-konten:preview`
- Final: `npm run render:drei-konten`

Vor Studio oder Render synchronisiert `npm run assets:drei-konten` die sechs Bildszenen aus den jeweiligen `scene-XX`-Ordnern nach `public/`.
