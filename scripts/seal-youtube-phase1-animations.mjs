#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {requiresYouTubeMotion, YOUTUBE_MOTION_STANDARD_ID} from './lib/youtube-motion-contract.mjs';
import {ANIMATION_SEAL, MOTION_RENDER_QA, VISUAL_INDEX} from './lib/youtube-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:phase1:seal -- youtube/<Projekt>');
  process.exit(1);
}
const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const runNodeGate = (script) => {
  const result = spawnSync(process.execPath, [resolve(script), root], {stdio: 'inherit'});
  if (result.status !== 0) process.exit(result.status ?? 1);
};
runNodeGate('scripts/validate-youtube-animation-quality.mjs');
runNodeGate('scripts/validate-youtube-motion-render-qa.mjs');

const indexPath = resolve(root, VISUAL_INDEX);
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const entries = [];
for (const visual of (index.visuals ?? []).filter(requiresYouTubeMotion)) {
  const sourcePath = resolve(root, visual.animationSourceFile);
  if (!existsSync(sourcePath)) {
    console.error(`animation.tsx fehlt: ${visual.animationSourceFile}`);
    process.exit(1);
  }
  const bytes = readFileSync(sourcePath);
  entries.push({
    id: visual.id,
    sourceFile: visual.animationSourceFile,
    exportName: visual.animationExport,
    qualityTier: visual.qualityTier,
    mechanicId: visual.mechanicId,
    visualTechniqueId: visual.visualTechniqueId,
    compositionFamilyId: visual.compositionFamilyId,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}

const qaPath = resolve(root, MOTION_RENDER_QA);
if (!existsSync(qaPath)) {
  console.error(`${MOTION_RENDER_QA} fehlt nach Render-QA.`);
  process.exit(1);
}
const qaSha256 = createHash('sha256').update(readFileSync(qaPath)).digest('hex');

const out = resolve(root, ANIMATION_SEAL);
mkdirSync(resolve(out, '..'), {recursive: true});
writeFileSync(out, `${JSON.stringify({
  version: 2,
  motionStandardId: YOUTUBE_MOTION_STANDARD_ID,
  sourceIndex: VISUAL_INDEX,
  motionRenderQa: MOTION_RENDER_QA,
  motionRenderQaSha256: qaSha256,
  entries,
}, null, 2)}\n`);
console.log(`\n✓ ${entries.length} YouTube-Motion-Szene(n) nach Source-QA + Render-QA versiegelt: ${ANIMATION_SEAL}`);
