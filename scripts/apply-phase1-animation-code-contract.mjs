#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {ANIMATION_QUALITY_LOCK, canonicalSceneDirectory} from './lib/reel-scene-schema.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-phase1-animation-code-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];

const exportNameFor = (sceneId) => {
  const n = String(sceneId ?? '').match(/(\d+)/)?.[1] ?? '00';
  return `Scene${n.padStart(2, '0')}Animation`;
};

for (const scene of scenes) {
  if (scene?.type !== 'animation') continue;
  const directory = canonicalSceneDirectory(scene);
  if (!directory) throw new Error(`${scene.id}: Szenenordner kann nicht abgeleitet werden.`);

  const relativeSource = `${directory}/animation.tsx`;
  const exportName = exportNameFor(scene.id);
  scene.animationSourceFile = relativeSource;
  scene.animationExport = exportName;
  scene.animationIntent = scene.animationIntent ?? '[EINFÜGEN — konkrete sichtbare Kette: Startzustand → Mechanismus → Ergebnis]';
  scene.animationQualityLock = ANIMATION_QUALITY_LOCK;

  const sourcePath = resolve(root, '03-szenen', relativeSource);
  if (!existsSync(sourcePath)) {
    mkdirSync(dirname(sourcePath), {recursive: true});
    writeFileSync(sourcePath, `import React from 'react';\n\n/**\n * PHASE-1 CANONICAL ANIMATION SOURCE\n * Diese Datei MUSS in Phase 1 vollständig durch produktionsreifen Code ersetzt werden.\n * Phase 3 darf sie nicht durch Platzhalter, Debug-Rechtecke oder künstliche Wackelbewegung ersetzen.\n *\n * ANIMATION_NARRATIVE\n * START: [EINFÜGEN]\n * MECHANISM: [EINFÜGEN]\n * RESULT: [EINFÜGEN]\n */\nexport const ${exportName}: React.FC<{durationFrames?: number}> = () => {\n  throw new Error('PHASE 1 ANIMATION CODE NOT COMPLETED');\n};\n`, 'utf8');
  }
}

index.phase1AnimationCode = {
  required: true,
  qualityLock: ANIMATION_QUALITY_LOCK,
  canonicalSourceRequiredForEveryAnimation: true,
  phase3MayNotReplaceCanonicalAnimation: true,
  placeholderMotionForbidden: true,
  decorativeMotionDoesNotCountAsExplanation: true,
  mathSinCosCompletionHackForbidden: true,
  narrativeMarkersRequired: ['START', 'MECHANISM', 'RESULT'],
  resultHoldFramesMin: 15,
};

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`✓ Phase-1-Animationscode-Vertrag gesetzt: ${scenes.filter((s) => s?.type === 'animation').length} Animation(en).`);
