#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {financeProjectPaths} from './lib/finance-project-structure.mjs';

const reelDirArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!reelDirArg) {
  console.error('Nutzung: node scripts/stage-finance-runtime-assets.mjs <projektordner>');
  process.exit(1);
}

const root = process.cwd();
const reelDir = path.resolve(reelDirArg);
const paths = financeProjectPaths(reelDir);
for (const file of [paths.scenePlan, paths.status, paths.manifest]) {
  if (!fs.existsSync(file)) throw new Error(`Pflichtdatei fehlt: ${path.relative(reelDir, file)}`);
}

const plan = JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(paths.manifest, 'utf8'));
if (!plan.slug || manifest.slug !== plan.slug) throw new Error('Szenenplan und Asset-Manifest verwenden unterschiedliche oder fehlende Slugs.');

const publicRoot = path.join(root, 'channels', 'finanzneo', 'public');
const stageDir = path.join(publicRoot, 'reels', plan.slug);
fs.rmSync(stageDir, {recursive: true, force: true});
fs.mkdirSync(stageDir, {recursive: true});

for (const asset of manifest.assets ?? []) {
  const source = path.resolve(reelDir, asset.file);
  const relative = path.relative(reelDir, source);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Asset liegt außerhalb des Projektordners: ${asset.file}`);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) throw new Error(`Asset fehlt: ${asset.file}`);
  const target = path.join(stageDir, relative);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.copyFileSync(source, target);
}

const runtimeInfo = {
  version: 'finance-runtime-v1',
  slug: plan.slug,
  sourceProject: path.relative(root, reelDir).split(path.sep).join('/'),
  stagedAt: new Date().toISOString(),
  assetCount: manifest.assets?.length ?? 0,
};
fs.writeFileSync(path.join(stageDir, 'runtime-info.json'), JSON.stringify(runtimeInfo, null, 2));
console.log(`✓ Runtime-Staging erzeugt: ${path.relative(root, stageDir)}`);
console.log('  Dieser public-Ordner ist automatisch und kein Produktionsordner.');
