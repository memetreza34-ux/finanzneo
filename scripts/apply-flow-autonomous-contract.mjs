#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, flowAutonomyFields, modernizeLegacyWaitWording} from './lib/flow-autonomy.mjs';

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
  console.error('Reel muss vor dem Flow-Lock bereits angelegt sein.');
  process.exit(1);
}

let master = readFileSync(allPromptsPath, 'utf8');

// V2/V1-Kopf immer vollständig ersetzen. So kann kein alter Batch-fördernder
// Satz wie "Lies die gesamte Datei einmal" unter dem neuen V3-Kopf überleben.
const handoffMarker = 'FINANZNEO — EINZIGE ÜBERGABEDATEI FÜR DEN GOOGLE-FLOW-KI-AGENTEN';
const handoffIndex = master.indexOf(handoffMarker);
if (handoffIndex !== -1) {
  master = `${AUTONOMY_BLOCK}\n${master.slice(handoffIndex)}`;
} else {
  master = `${AUTONOMY_BLOCK}\n${master}`;
}

// Den Agentenblock ebenfalls kanonisch ersetzen statt nur einzelne Wörter zu
// patchen. Ende des Blocks ist in allen Masterprompts die Bildnummerierung.
const protocolIndex = master.indexOf('FLOW_AGENT_PROTOCOL:');
const numberingIndex = master.indexOf('BILDNUMMERIERUNG:', protocolIndex);
if (protocolIndex !== -1 && numberingIndex !== -1) {
  master = `${master.slice(0, protocolIndex)}${FLOW_AGENT_BLOCK}\n${master.slice(numberingIndex)}`;
}

master = modernizeLegacyWaitWording(master);

// Jeder konkrete Bildblock bekommt zusätzlich ein lokales Gate. Dadurch ist
// selbst beim Lesen der gesamten Datei eindeutig: dieser Prompt darf nur als
// EINZELJOB ausgeführt werden; der nächste Block ist bis Rename+QA gesperrt.
master = master
  .replaceAll('FLOW_STEP_GATE: STRICT_CURRENT_ONLY\nCURRENT_STEP_ONLY: true\nNEXT_STEP_LOCKED_UNTIL_RENAME_AND_QA: true\n', '')
  .replaceAll(
    'GOOGLE FLOW – FINALER DATEINAME:',
    'FLOW_STEP_GATE: STRICT_CURRENT_ONLY\nCURRENT_STEP_ONLY: true\nNEXT_STEP_LOCKED_UNTIL_RENAME_AND_QA: true\nBATCH_WITH_OTHER_IMAGE_BLOCKS: FORBIDDEN\nGOOGLE FLOW – FINALER DATEINAME:',
  );

writeFileSync(allPromptsPath, master, 'utf8');

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.googleFlow = {...(index.googleFlow ?? {}), ...flowAutonomyFields()};
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log('✓ Google-Flow Strict-Single-Job V3 gesetzt.');
console.log('  Concurrency=1 · kein Batch/Queueing · Ergebnis → Rename → QA → erst dann nächster Bildblock · kein Nutzer-„weiter“ nötig.');
