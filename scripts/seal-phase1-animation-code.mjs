#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve} from 'node:path';
import {sha256File} from './lib/phase3-completion.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/seal-phase1-animation-code.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const animations = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'animation');
const sources = [];

for (const scene of animations) {
  if (typeof scene.animationSourceFile !== 'string' || !scene.animationSourceFile.trim()) {
    console.error(`${scene.id}: animationSourceFile fehlt.`);
    process.exit(1);
  }
  const absolute = resolve(root, '03-szenen', scene.animationSourceFile.replace(/^03-szenen\//, ''));
  if (!existsSync(absolute)) {
    console.error(`${scene.id}: kanonische Animation fehlt: ${scene.animationSourceFile}`);
    process.exit(1);
  }
  sources.push({
    id: scene.id,
    animationSourceFile: scene.animationSourceFile,
    animationExport: scene.animationExport,
    sha256: sha256File(absolute),
  });
}

const seal = {
  version: 1,
  lockId: index.phase1AnimationCode?.qualityLock,
  createdAt: new Date().toISOString(),
  reelProject: relative(resolve('.'), root).replaceAll('\\', '/'),
  sceneIndexSha256: sha256File(indexPath),
  sources,
};

const sealPath = resolve(root, '05-projektdateien/phase1-animation-seal.json');
writeFileSync(sealPath, `${JSON.stringify(seal, null, 2)}\n`, 'utf8');
console.log(`✓ Phase-1-Animationscode versiegelt: ${animations.length} Quelle(n). Phase 3 darf diese Dateien nicht verändern.`);
