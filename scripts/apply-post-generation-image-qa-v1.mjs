#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {SCENE_INDEX} from './lib/reel-contract.mjs';
import {POST_GENERATION_QA_ID, POST_GENERATION_QA_FILE, MIN_SEMANTIC_SCORE, MAX_DHASH_DISTANCE_FOR_NEAR_DUPLICATE} from './lib/post-generation-image-qa-v1.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/apply-post-generation-image-qa-v1.mjs <Reel-Pfad>');
  process.exit(1);
}
const root = resolve(target);
const indexPath = resolve(root, SCENE_INDEX);
if (!existsSync(indexPath)) {
  console.error(`${SCENE_INDEX} fehlt.`);
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.postGenerationImageQaContract = {
  id: POST_GENERATION_QA_ID,
  reportFile: POST_GENERATION_QA_FILE,
  appliesToFinalFlowPixels: true,
  pixelQaRequired: true,
  semanticVisionQaRequired: true,
  actualPixelsMustBeInspected: true,
  promptOnlyAssessmentForbidden: true,
  minimumSemanticScore: MIN_SEMANTIC_SCORE,
  nearDuplicateMaxDHashDistance: MAX_DHASH_DISTANCE_FOR_NEAR_DUPLICATE,
  failAction: 'REGENERATE_SAME_IMAGE_NUMBER',
  advanceSingleJobQueueOnFail: false,
  requiredBeforePhase3: true,
};
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`✓ Post-Generation Image QA aktiviert: ${POST_GENERATION_QA_ID}`);
