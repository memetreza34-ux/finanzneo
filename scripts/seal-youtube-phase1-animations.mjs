#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {requiresYouTubeMotion, YOUTUBE_MOTION_STANDARD_ID} from './lib/youtube-motion-contract.mjs';

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

const quality = spawnSync(process.execPath, [resolve('scripts/validate-youtube-animation-quality.mjs'), root], {stdio: 'inherit'});
if (quality.status !== 0) process.exit(quality.status ?? 1);

const indexPath = resolve(root, '04-visuals/visual-index.json');
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
    mechanicId: visual.mechanicId,
    visualTechniqueId: visual.visualTechniqueId,
    compositionFamilyId: visual.compositionFamilyId,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}

const out = resolve(root, '06-projektdateien/animation-seal.json');
mkdirSync(resolve(out, '..'), {recursive: true});
writeFileSync(out, `${JSON.stringify({
  version: 1,
  motionStandardId: YOUTUBE_MOTION_STANDARD_ID,
  sourceIndex: '04-visuals/visual-index.json',
  entries,
}, null, 2)}\n`);
console.log(`\n✓ ${entries.length} YouTube-Animation(en) versiegelt: 06-projektdateien/animation-seal.json`);
