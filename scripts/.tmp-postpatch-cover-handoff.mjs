import {readFileSync, writeFileSync} from 'node:fs';

const path = 'reels/2026-08-31_bis_2026-09-06/donnerstag/reel-04_kreditkarten-teilzahlung/05-projektdateien/ANTIGRAVITY-AUFTRAG.md';
let source = readFileSync(path, 'utf8');
const block = `

## 3-FRAME-COVER — TECHNISCHE SPERRE

- Während scene-01 darf KEINE Caption-/Subtitle-Komponente gemountet oder sichtbar sein.
- Untertitel beginnen erst mit scene-02.
- Voiceover ist in Frame 0–2 gesperrt und startet ab Frame 3 mit scene-02.
`;
if (!source.includes('## 3-FRAME-COVER — TECHNISCHE SPERRE')) source += block;
writeFileSync(path, source.endsWith('\n') ? source : source + '\n', 'utf8');
console.log('✓ Antigravity-Handoff für 3-Frame-Cover technisch eindeutig.');
