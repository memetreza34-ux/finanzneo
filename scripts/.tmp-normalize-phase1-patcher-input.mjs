import {readFileSync, writeFileSync} from 'node:fs';

const path = 'scripts/apply-phase1-animation-code-contract.mjs';
let source = readFileSync(path, 'utf8');

const blocks = [
  String.raw` * - reale stylized-3D-Situation statt generischer Kartenreihe\n * - mindestens zwei konkrete Realwelt-Objekte/-Instanzen\n * - mehrere koordinierte Motion-Channels`,
  String.raw` * MECHANIC_ID: [EINDEUTIGE-MECHANIK-FÜR-DIESE-SZENE]\n * PRIMARY_ACTION:`,
];

for (const block of blocks) {
  if (!source.includes(block)) throw new Error('Zu normalisierender Phase-1-Block fehlt.');
  source = source.replace(block, block.replaceAll('\\n', '\n'));
}

writeFileSync(path, source, 'utf8');
console.log('✓ Phase-1-Template für den einmaligen Patch normalisiert.');
