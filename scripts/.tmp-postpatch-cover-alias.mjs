import {readFileSync, writeFileSync} from 'node:fs';

const root = 'reels/2026-08-31_bis_2026-09-06/donnerstag/reel-04_kreditkarten-teilzahlung';
const index = JSON.parse(readFileSync(`${root}/03-szenen/scene-index.json`, 'utf8'));
const first = index.scenes?.[0];
if (!first || first.id !== 'scene-01' || first.type !== 'image') throw new Error('scene-01 Coverquelle fehlt.');

const content = `COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2

TECHNISCHER COVER-ALIAS ZU SCENE-01
KEIN SEPARATER BILDJOB
No separate cover generation
no Bild 00
KEIN separates Cover erzeugen
KEIN Bild 00 erzeugen

Cover-Quelle: scene-01
Google-Flow-Datei: ${first.googleFlowFileName}
Reel-Titel: ${index.title}

RENDER-REGEL:
- Das Quellbild ist exakt dasselbe Asset wie scene-01.
- Scene-01 dauert exakt 3 Frames = 0,1 s bei 30 fps.
- In Frame 0–2 erscheinen ausschließlich Hero-Bild + exakter Reel-Titel.
- Kein Icon, keine Caption, kein Subtitle, kein CTA, kein Voiceover.
- Voiceover und Untertitel beginnen ab Frame 3 mit scene-02.
- cover.png wird aus Frame 0 des final geprüften Videos exportiert.
`;
writeFileSync(`${root}/03-szenen/00-cover/cover.txt`, content, 'utf8');
console.log('✓ 00-cover/cover.txt ist wieder reiner technischer scene-01-Alias, ohne separaten Bildjob.');
