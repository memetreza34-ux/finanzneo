#!/usr/bin/env node

// Baut 04-visuals/alle-bildprompts.txt aus den einzelnen bildprompt.txt.
//
// Die Handoff-Datei ist die einzige Übergabe an Google Flow. Wurde sie von Hand
// gepflegt, drifteten Einzelprompt und Handoff auseinander: korrigiert wurde der
// Einzelprompt, erzeugt wurde aus dem alten Handoff. Deshalb ist der Einzelprompt
// ab hier die einzige Quelle und die Handoff-Datei nur noch generiert.

import {readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  FLOW_AGENT_PROTOCOL_MARKER,
  GENERATED_IMAGE_ASPECT_MARKER,
  IMAGE_INBOX,
  SERIES_LOCK_MARKER,
  VISUAL_INDEX,
  WORLD_ID_MARKER,
} from './lib/youtube-contract.mjs';
import {requiresYouTubeImage} from './lib/youtube-motion-contract.mjs';

const args = process.argv.slice(2);
const check = args.includes('--check');
const target = args.find((arg) => !arg.startsWith('--'));

if (!target) {
  console.error('Nutzung: npm run youtube:prompts:build -- youtube/<Projekt> [--check]');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8');

let index;
try {
  index = JSON.parse(read(VISUAL_INDEX));
} catch (error) {
  console.error(`${VISUAL_INDEX} ist nicht lesbar: ${error.message}`);
  process.exit(1);
}

const imageVisuals = (index.visuals ?? []).filter(requiresYouTubeImage);
if (imageVisuals.length === 0) {
  console.error('Keine Bild- oder Hybrid-Visuals in visual-index.json gefunden.');
  process.exit(1);
}

const header = [
  'FINANZNEO — GOOGLE FLOW YOUTUBE HANDOFF',
  '',
  'GENERIERT AUS DEN EINZELNEN bildprompt.txt — NICHT VON HAND BEARBEITEN.',
  'Quelle: 04-visuals/EINZELNE-VISUALS/<visual>/bildprompt.txt',
  'Neu bauen: npm run youtube:prompts:build -- ' + target,
  '',
  FLOW_AGENT_PROTOCOL_MARKER,
  WORLD_ID_MARKER,
  SERIES_LOCK_MARKER,
  'YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-cg-animated-black-v2',
  'SOURCE_VISUAL_LANGUAGE: finanzneo-stylized-3d-animated-black-v9',
  GENERATED_IMAGE_ASPECT_MARKER,
  '',
  'ARBEITSWEISE — STRIKT SEQUENZIELL',
  'Work through the blocks below in the given order, one block at a time.',
  'Generate exactly ONE image per block. Wait until it is fully complete.',
  'Rename it immediately to the exact FINAL FILE NAME of that block.',
  'Run the checks of the block. If any check fails, regenerate the same image number and replace the failed file.',
  'Only then continue with the next block.',
  'Never generate several images in parallel or as a batch.',
  'Never attach or upload another image as a reference. Every block carries its complete style lock in writing.',
  '',
  'Literal first, creative second — every block starts from the concrete real-world situation behind the spoken line.',
  '',
  'All source images are horizontal 16:9.',
  `Put every finished, correctly named file together into ${IMAGE_INBOX}/`,
  '',
  `Blocks in this handoff: ${imageVisuals.length}`,
  '',
].join('\n');

const divider = '━'.repeat(60);

const blocks = imageVisuals.map((visual, position) => {
  const planFile = visual.type === 'hybrid' ? visual.imagePlanFile : visual.planFile;
  const body = read(planFile).trimEnd();
  return [
    divider,
    `BLOCK ${position + 1} / ${imageVisuals.length} — ${visual.id} — ${visual.googleFlowFileName}`,
    divider,
    '',
    body,
    '',
  ].join('\n');
});

const content = `${header}${blocks.join('\n')}`;

if (check) {
  let current = null;
  try {
    current = read(ALL_PROMPTS);
  } catch {
    current = null;
  }
  if (current !== content) {
    console.error(`\n✗ ${ALL_PROMPTS} ist nicht mehr synchron mit den einzelnen bildprompt.txt.`);
    console.error(`  Neu bauen: npm run youtube:prompts:build -- ${target}`);
    process.exit(1);
  }
  console.log(`✓ ${ALL_PROMPTS} ist synchron (${imageVisuals.length} Blöcke).`);
  process.exit(0);
}

writeFileSync(resolve(root, ALL_PROMPTS), content);
console.log(`✓ ${ALL_PROMPTS} neu gebaut (${imageVisuals.length} Blöcke).`);
imageVisuals.forEach((visual) => console.log(`  ${visual.id} → ${visual.googleFlowFileName}`));
