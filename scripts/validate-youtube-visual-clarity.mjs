#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  YOUTUBE_VISUAL_CLARITY_STANDARD_ID,
  validateYouTubeVisualClarity,
} from './lib/youtube-visual-clarity-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/validate-youtube-visual-clarity.mjs youtube/<Projekt>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '04-visuals/visual-index.json');
if (!existsSync(indexPath)) {
  console.error('04-visuals/visual-index.json fehlt.');
  process.exit(1);
}

let index;
try {
  index = JSON.parse(readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`visual-index.json ist ungültig: ${error.message}`);
  process.exit(1);
}

if (!index?.visualClarityStandard) {
  console.log('✓ Legacy-YouTube-Projekt: kein Visual-Clarity-Standard deklariert; keine rückwirkende Blockade.');
  process.exit(0);
}

const errors = [];
if (index.visualClarityStandard.id !== YOUTUBE_VISUAL_CLARITY_STANDARD_ID) {
  errors.push(`visualClarityStandard.id muss ${YOUTUBE_VISUAL_CLARITY_STANDARD_ID} sein.`);
}
if (index?.visualClarityStandard?.oneCoreMessagePerBeat !== true) {
  errors.push('visualClarityStandard.oneCoreMessagePerBeat muss true sein.');
}
if (index?.visualClarityStandard?.visualFormFree !== true) {
  errors.push('visualClarityStandard.visualFormFree muss true sein — keine feste Bildform erzwingen.');
}
if (index?.visualClarityStandard?.imageWorldUnchanged !== true) {
  errors.push('visualClarityStandard.imageWorldUnchanged muss true sein.');
}
if (index?.visualClarityStandard?.twoSecondComprehensionRequired !== true) {
  errors.push('visualClarityStandard.twoSecondComprehensionRequired muss true sein.');
}

for (const visual of index?.visuals ?? []) {
  errors.push(...validateYouTubeVisualClarity(visual));

  if (['animation', 'hybrid', 'data'].includes(visual.type)) {
    const source = visual.animationSourceFile ? resolve(root, visual.animationSourceFile) : null;
    if (!source || !existsSync(source)) {
      errors.push(`${visual.id}: animation.tsx fehlt.`);
      continue;
    }
    const code = readFileSync(source, 'utf8');
    const expected = Number(visual?.clarityPlan?.resultHoldFrames);
    if (!/RESULT_HOLD_FRAMES/.test(code)) {
      errors.push(`${visual.id}: animation.tsx muss RESULT_HOLD_FRAMES exportieren.`);
    }
    if (Number.isFinite(expected)) {
      const single = `RESULT_HOLD_FRAMES = ${expected}`;
      if (!code.includes(single)) errors.push(`${visual.id}: RESULT_HOLD_FRAMES im Code stimmt nicht mit clarityPlan.resultHoldFrames überein.`);
    }
    if (!/ANIMATION_NARRATIVE/.test(code) || !/START/.test(code) || !/MECHANISM/.test(code) || !/RESULT/.test(code)) {
      errors.push(`${visual.id}: Motion braucht START → MECHANISM → RESULT.`);
    }
  }
}

if (errors.length) {
  console.error('\nYouTube Visual-Clarity-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`✓ ${YOUTUBE_VISUAL_CLARITY_STANDARD_ID}: ein Kerngedanke · freie Visualform · 2-Sekunden-Verständlichkeit · klares Motion-Ergebnis`);
