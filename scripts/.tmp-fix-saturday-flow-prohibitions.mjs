#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const path = resolve('reels/2026-08-31_bis_2026-09-06/samstag/reel-06_tagesgeld-aktionszins/03-szenen/alle-bildprompts.txt');
if (!existsSync(path)) throw new Error('alle-bildprompts.txt fehlt');

let source = readFileSync(path, 'utf8');
const marker = 'EXPLIZITE FLOW-VERBOTE — VERBINDLICH';
const block = `

${marker}
- Niemals mehrere Bilder in einem Generierungsaufruf erzeugen.
- Niemals mehrere Bildprompts zusammenfassen.
- Niemals Bilder vorab in eine Queue stellen.
- Niemals alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen.
`;

if (!source.includes(marker)) source += block;
writeFileSync(path, source, 'utf8');

for (const required of [
  'mehrere Bilder in einem Generierungsaufruf',
  'mehrere Bildprompts zusammenfassen',
  'Bilder vorab in eine Queue stellen',
  'alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen',
]) {
  if (!source.includes(required)) throw new Error('Flow-Verbot fehlt: ' + required);
}

console.log('✓ Vier explizite Flow-Verbote ergänzt: kein Multi-Image, kein Prompt-Merge, kein Queueing, kein spätes Sammel-Rename.');
