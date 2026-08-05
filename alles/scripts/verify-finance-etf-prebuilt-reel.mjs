#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/verify-finance-etf-prebuilt-reel.mjs <projektordner>');
  process.exit(1);
}

const technicalRoot = process.cwd();
const projectRoot = path.resolve(projectArg);
const sourceRoot = path.join(
  technicalRoot,
  'channels',
  'finanzneo',
  'src',
  'reels',
  '2026-08-05-etf-kauf-100-euro',
);
const packageFile = path.join(projectRoot, 'timeline', 'codex-reel-package.json');
const expectedFiles = {
  types: path.join(sourceRoot, 'types.ts'),
  visual: path.join(sourceRoot, 'visual.tsx'),
  animations: path.join(sourceRoot, 'PrebuiltEtfAnimations.tsx'),
  reel: path.join(sourceRoot, 'EtfKauf100EuroReel.tsx'),
  root: path.join(sourceRoot, 'EtfKauf100EuroRoot.tsx'),
  entry: path.join(sourceRoot, 'index.ts'),
  prepare: path.join(technicalRoot, 'scripts', 'prepare-finance-etf-reel-runtime.mjs'),
  build: path.join(technicalRoot, 'scripts', 'build-finance-etf-reel.mjs'),
};

const errors = [];
const read = (label) => {
  const file = expectedFiles[label];
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    errors.push(`Vorprogrammierte Datei fehlt: ${path.relative(technicalRoot, file)}`);
    return '';
  }
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('FINANCE_TODO')) errors.push(`${path.relative(technicalRoot, file)} enthält FINANCE_TODO.`);
  return content;
};

const animations = read('animations');
const reelSource = read('reel');
const rootSource = read('root');
const entrySource = read('entry');
read('types');
read('visual');
read('prepare');
read('build');

if (!animations.includes('export const PrebuiltEtfOrderMatchAnimation')) {
  errors.push('PrebuiltEtfOrderMatchAnimation ist nicht vollständig exportiert.');
}
if (!animations.includes('export const PrebuiltEtfCreationAnimation')) {
  errors.push('PrebuiltEtfCreationAnimation ist nicht vollständig exportiert.');
}
if (!reelSource.includes('<PrebuiltEtfOrderMatchAnimation')) {
  errors.push('Die fertige Composition verwendet die vorprogrammierte Order-Matching-Animation nicht.');
}
if (!reelSource.includes('<PrebuiltEtfCreationAnimation')) {
  errors.push('Die fertige Composition verwendet die vorprogrammierte Creation-Animation nicht.');
}
if (!rootSource.includes("FinanzNeoEtfKauf100Euro")) {
  errors.push('Dedicated Composition-ID FinanzNeoEtfKauf100Euro fehlt.');
}
if (!entrySource.includes('registerRoot(EtfKauf100EuroRoot)')) {
  errors.push('Dedizierter Remotion-Einstieg registriert den ETF-Root nicht.');
}

if (!fs.existsSync(packageFile)) {
  errors.push(`Codex-Reel-Paket fehlt: ${packageFile}`);
} else {
  const reel = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  if (reel.slug !== 'was-passiert-wenn-du-100-euro-in-einen-etf-steckst') {
    errors.push(`Falscher Reel-Slug: ${reel.slug}.`);
  }
  const animationsInPackage = (reel.scenes ?? []).filter((scene) => scene.type === 'animation');
  const ids = animationsInPackage.map((scene) => scene.id);
  if (JSON.stringify(ids) !== JSON.stringify(['scene-02-order-match', 'scene-05-creation'])) {
    errors.push(`Animationsszenen stimmen nicht mit der vorprogrammierten Composition überein: ${ids.join(', ')}.`);
  }
  if ((reel.scenes ?? []).length !== 7) errors.push('Das ETF-Reel muss genau sieben Szenen enthalten.');
}

if (errors.length) {
  console.error('Vorprogrammierter ETF-Reel-Build ist unvollständig:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('✓ Beide ETF-Animationen sind vollständig vorprogrammiert.');
console.log('✓ Dedizierte Remotion-Composition ist vorhanden.');
console.log('✓ Codex muss keine Animation entwerfen oder programmieren.');
console.log(`  Source: ${path.relative(technicalRoot, sourceRoot)}`);
