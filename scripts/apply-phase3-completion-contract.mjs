#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  PHASE3_CONTRACT_ID,
  phase3CompletionContractFields,
} from './lib/phase3-completion.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/apply-phase3-completion-contract.mjs reels/<Woche>/<Tag>/<Reel>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('reels'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein Reel-Projekt unter reels/ sein.');
  process.exit(1);
}

const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.phase3CompletionContract = phase3CompletionContractFields();
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log(`✓ Phase-3-Fertigkeitsvertrag gesetzt: ${PHASE3_CONTRACT_ID}`);
console.log('  MP4 allein reicht nicht · jede Szene braucht Visual · Post-Render-QA vor Export Pflicht.');
