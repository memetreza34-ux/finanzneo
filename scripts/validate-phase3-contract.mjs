#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  PHASE1_ANIMATION_SEAL_RELATIVE,
  PHASE3_CONTRACT_ID,
  PHASE3_MANIFEST_RELATIVE,
  PHASE3_QA_RELATIVE,
  REEL_BACKGROUND_CONTRACT_ID,
} from './lib/phase3-completion.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-phase3-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const indexPath = resolve(target, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.phase3CompletionContract;
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(contract?.id === PHASE3_CONTRACT_ID, `phase3CompletionContract.id muss ${PHASE3_CONTRACT_ID} sein.`);
assert(contract?.required === true, 'Phase-3-Fertigkeitsvertrag muss required=true sein.');
assert(contract?.productionManifest === PHASE3_MANIFEST_RELATIVE, `productionManifest muss ${PHASE3_MANIFEST_RELATIVE} sein.`);
assert(contract?.renderQa === PHASE3_QA_RELATIVE, `renderQa muss ${PHASE3_QA_RELATIVE} sein.`);
assert(contract?.phase1AnimationSeal === PHASE1_ANIMATION_SEAL_RELATIVE, `phase1AnimationSeal muss ${PHASE1_ANIMATION_SEAL_RELATIVE} sein.`);
assert(contract?.reelBackgroundContractId === REEL_BACKGROUND_CONTRACT_ID, `reelBackgroundContractId muss ${REEL_BACKGROUND_CONTRACT_ID} sein.`);
for (const key of [
  'allScenesMustBeImplemented',
  'imageVisualRequired',
  'animationVisualRequired',
  'captionOnlySceneForbidden',
  'postRenderVisualQaRequired',
  'exportRequiresPassedRenderQa',
  'exactVideoHashRequiredForExport',
  'finalVideoExistsOnlyAfterQaPass',
  'canonicalPhase1AnimationRequired',
  'phase3MayNotReplaceCanonicalAnimation',
  'phase1AnimationHashMustMatchSeal',
  'pureBlackBackgroundRequired',
  'decorativeBackgroundEffectsForbidden',
  'backgroundMotionDoesNotCountAsAnimation',
  'blackOrEmptyVisualMustFail',
]) {
  assert(contract?.[key] === true, `${key} muss true sein.`);
}

const qa = contract?.visualQa ?? {};
assert(Array.isArray(qa.sampleImageRatios) && qa.sampleImageRatios.length >= 1, 'visualQa.sampleImageRatios fehlt.');
assert(Array.isArray(qa.sampleAnimationRatios) && qa.sampleAnimationRatios.length >= 3, 'visualQa.sampleAnimationRatios braucht mindestens 3 Samples.');
assert(qa.sampleBackgroundPerScene === true, 'visualQa.sampleBackgroundPerScene muss true sein.');
assert(Number(qa.minStdDev) > 0, 'visualQa.minStdDev muss > 0 sein.');
assert(Number(qa.minContrastP90P10) > 0, 'visualQa.minContrastP90P10 muss > 0 sein.');
assert(Number(qa.minEdgeMean) > 0, 'visualQa.minEdgeMean muss > 0 sein.');
assert(Number(qa.minActivePixelRatio) >= 0.04, 'visualQa.minActivePixelRatio muss mindestens 0.04 sein.');
assert(Number(qa.minAnimationMeanAbsDiff) > 0, 'visualQa.minAnimationMeanAbsDiff muss > 0 sein.');
assert(Number(qa.maxBackgroundMean) <= 12 && Number(qa.maxBackgroundMean) >= 0, 'visualQa.maxBackgroundMean muss zwischen 0 und 12 liegen.');
assert(Number(qa.maxBackgroundStdDev) <= 4 && Number(qa.maxBackgroundStdDev) >= 0, 'visualQa.maxBackgroundStdDev muss zwischen 0 und 4 liegen.');

if (errors.length) {
  console.error('\nPhase-3-Fertigkeitsvertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Phase-3-Fertigkeitsvertrag erfüllt: ${PHASE3_CONTRACT_ID}`);
console.log(`  Hintergrundvertrag: ${REEL_BACKGROUND_CONTRACT_ID} · statisch #000000 · dekorative Background-Effekte gesperrt.`);
console.log('  Jede Szene braucht echten visuellen Inhalt; Caption-only sowie schwarze/leere Visuals sind gesperrt.');
console.log('  Background-Motion zählt nicht als Animation; Animationsszenen müssen echte Visualbewegung im Kern zeigen.');
console.log('  Animationsszenen müssen direkt den in Phase 1 erstellten und versiegelten TSX-Code verwenden.');
