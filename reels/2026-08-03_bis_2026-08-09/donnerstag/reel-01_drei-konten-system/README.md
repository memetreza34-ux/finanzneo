# Reel 01 — Drei-Konten-System

**Veröffentlichung:** Donnerstag, 6. August 2026  
**Format:** vertikales FinanzNeo-Reel, 1080 × 1920, 30 fps  
**Geplante Länge:** 60,0 Sekunden  
**Szenen:** 10

## Verbindliches Verhältnis

- 6 Bildszenen = 60 %
- 4 native Remotion-Animationsszenen = 40 %

## Ein-Quellen-Vertrag

- Bildszene: ausschließlich `bildprompt.txt`, später genau eine finale Bilddatei und `szene.md`.
- Remotion-Szene: ausschließlich `remotion.md` plus `szene.md`.
- `motionprompt.txt`, `alle-motionprompts.txt` und `placeholder.svg` in Szenenordnern sind verboten.
- Einfache Bewegungen der Bildszenen sind zentral in `src/reels/drei-konten/shared.tsx` programmiert.
- Technische Vorschau-Fallbacks liegen nur unter `public/`, nicht in den Produktionsordnern.

## Produktionsordner

- `00-cover`: Cover-Prompt und Coverbild
- `01-voice-script`: kompletter Sprechtext
- `02-audio`: finales Voiceover
- `03-szenen`: Bildprompts, Remotion-Spezifikationen, Szenenindex und finale Bildablage
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

Vor Studio oder Render synchronisiert `npm run assets:drei-konten` vorhandene finale Bilder. Solange sie fehlen, verwendet Remotion ausschließlich die zentralen technischen Fallbacks unter `public/`.
