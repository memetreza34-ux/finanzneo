#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';
import {
  AUTONOMY_BLOCK,
  FLOW_AGENT_BLOCK,
  LEGACY_STYLE_ANCHOR_NOTES,
  STYLE_ANCHOR_NOTE,
  flowAutonomyFields,
  modernizeLegacyWaitWording,
} from './lib/flow-autonomy.mjs';

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

// Alten Kopf immer vollständig ersetzen. So überlebt weder ein Batch-fördernder
// Satz wie "Lies die gesamte Datei einmal" noch eine Anker-Fassung ohne
// Szenenvarianz unter dem neuen Kopfblock.
// Der Kopf endet immer vor der ersten "FINANZNEO — ..."-Titelzeile. Über diese
// Grenze wird er ersetzt, egal wie die Titelzeile in der jeweiligen Generation
// hieß. Sonst stapeln sich alter und neuer Kopfblock übereinander.
const headlineMatch = master.match(/^FINANZNEO — .*$/m);
if (headlineMatch?.index !== undefined) {
  master = `${AUTONOMY_BLOCK}\n${master.slice(headlineMatch.index)}`;
} else {
  master = `${AUTONOMY_BLOCK}\n${master}`;
}

// Den Agentenblock ebenfalls kanonisch ersetzen statt nur einzelne Wörter zu
// patchen. Je nach Generation folgt auf ihn die Bildnummerierung oder direkt
// der Bildwelt-Lock; es gewinnt der erste Abschnitt, der danach beginnt.
const AGENT_BLOCK_END_MARKERS = ['BILDNUMMERIERUNG:', 'PREMIUM_VISUAL_WORLD_LOCK:', 'BILDWELT:'];
const protocolIndex = master.indexOf('FLOW_AGENT_PROTOCOL:');
if (protocolIndex !== -1) {
  const endIndex = AGENT_BLOCK_END_MARKERS
    .map((marker) => master.indexOf(marker, protocolIndex))
    .filter((index) => index !== -1)
    .sort((a, b) => a - b)[0];
  if (endIndex !== undefined) {
    master = `${master.slice(0, protocolIndex)}${FLOW_AGENT_BLOCK}\n${master.slice(endIndex)}`;
  }
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

// Anker-Hinweis je Bildblock auf die Stilreferenz-Fassung heben.
for (const legacy of LEGACY_STYLE_ANCHOR_NOTES) {
  master = master.replaceAll(legacy, STYLE_ANCHOR_NOTE);
}

writeFileSync(allPromptsPath, master, 'utf8');

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.googleFlow = {...(index.googleFlow ?? {}), ...flowAutonomyFields()};
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log('✓ Google-Flow Style-Anker V4 mit Szenenvarianz gesetzt.');
console.log('  Concurrency=1 · Blöcke zu höchstens 5 · Anker liefert nur den Look · Varianz-QA je Bild · kein Nutzer-„weiter“ nötig.');
