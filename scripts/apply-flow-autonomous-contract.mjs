#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  FLOW_EXECUTION_MODE_MARKER,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';
import {AUTONOMY_BLOCK, flowAutonomyFields, modernizeLegacyWaitWording} from './lib/flow-autonomy.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/apply-flow-autonomous-contract.mjs reels/<Woche>/<Tag>/<Reel>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('reels'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein Reel-Projekt unter reels/ sein.');
  process.exit(1);
}

const allPromptsPath = resolve(root, ALL_PROMPTS);
const indexPath = resolve(root, SCENE_INDEX);
if (!existsSync(allPromptsPath) || !existsSync(indexPath)) {
  console.error('Reel muss vor dem Flow-Autonomie-Lock bereits angelegt sein.');
  process.exit(1);
}

// AUTONOMY_BLOCK kommt aus scripts/lib/flow-autonomy.mjs.

let master = readFileSync(allPromptsPath, 'utf8');
if (!master.includes(FLOW_EXECUTION_MODE_MARKER)) {
  master = `${AUTONOMY_BLOCK}\n${master}`;
} else {
  const blockStart = master.indexOf(FLOW_EXECUTION_MODE_MARKER);
  const firstContentMarker = master.indexOf('\n\n', blockStart);
  if (blockStart === 0 && firstContentMarker !== -1 && !master.includes('AUTONOMER GESAMTDURCHLAUF — VERBINDLICH')) {
    master = `${AUTONOMY_BLOCK}\n${master.slice(firstContentMarker + 2)}`;
  }
}

// Bestandsreels aus der Zeit vor dem Vertrag auf den aktuellen Wortlaut heben.
master = modernizeLegacyWaitWording(master);
writeFileSync(allPromptsPath, master, 'utf8');

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.googleFlow = {...(index.googleFlow ?? {}), ...flowAutonomyFields()};
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log('✓ Google-Flow-Autonomie-Lock gesetzt.');
console.log('  Gesamtes Bildset ohne Nutzer-Zwischenstopps · internes Warten nur auf Generierung · Struktur/Stil bis zum letzten Bild gesperrt.');
