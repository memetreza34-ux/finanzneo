#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {isDirectMainPushLine} from './lib/protected-files.mjs';

if (process.env.FINANZNEO_ALLOW_MAIN_PUSH === '1') {
  console.log('Direkt-Push auf main: bewusste Einmalfreigabe erkannt.');
  process.exit(0);
}

const lines = readFileSync(0, 'utf8').split('\n').filter(Boolean);
if (!lines.some(isDirectMainPushLine)) process.exit(0);

console.error('\nPush blockiert: direkte Pushes auf main sind nicht erlaubt. Nutze einen Branch und Pull Request.');
console.error('Nur für einen ausdrücklich beabsichtigten Notfall: FINANZNEO_ALLOW_MAIN_PUSH=1 git push ...');
process.exit(1);
