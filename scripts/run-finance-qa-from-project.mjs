#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const positionals = args.filter((arg) => !arg.startsWith('--'));
const planFile = path.resolve(positionals[0] || 'scene-plan.json');
const manifestFile = path.resolve(positionals[1] || path.join(path.dirname(planFile), 'asset-manifest.json'));
if (!fs.existsSync(planFile)) throw new Error(`Szenenplan fehlt: ${planFile}`);
if (!fs.existsSync(manifestFile)) throw new Error(`Asset-Manifest fehlt: ${manifestFile}`);
if (path.basename(path.dirname(manifestFile)) !== '06-projektdateien') throw new Error('Asset-Manifest muss im kanonischen Ordner 06-projektdateien/ liegen.');

const projectRoot = path.resolve(path.dirname(manifestFile), '..');
const expectedPlan = path.join(projectRoot, '06-projektdateien', 'scene-plan.json');
if (path.resolve(planFile) !== expectedPlan) throw new Error('Szenenplan und Asset-Manifest gehören nicht zum selben kanonischen Reel-Projekt.');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const declaredRoot = path.isAbsolute(manifest.root ?? '') ? path.resolve(manifest.root) : path.resolve(process.cwd(), manifest.root || projectRoot);
if (declaredRoot !== projectRoot) throw new Error(`manifest.root ist inkonsistent: erwartet ${projectRoot}, gefunden ${declaredRoot}.`);

const normalizedManifest = {
  ...manifest,
  root: projectRoot,
  assets: (manifest.assets ?? []).map((asset) => ({
    ...asset,
    file: path.isAbsolute(asset.file) ? path.resolve(asset.file) : path.resolve(projectRoot, asset.file),
  })),
};
for (const asset of normalizedManifest.assets) {
  const relative = path.relative(projectRoot, asset.file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Asset liegt außerhalb des Reel-Projekts: ${asset.file}`);
}

const temporaryManifest = path.join(os.tmpdir(), `finanzneo-qa-manifest-${process.pid}-${Date.now()}.json`);
fs.writeFileSync(temporaryManifest, JSON.stringify(normalizedManifest, null, 2));
const forwarded = [planFile, temporaryManifest, ...args.filter((arg) => arg.startsWith('--'))];
try {
  const result = spawnSync(process.execPath, ['scripts/run-finance-qa.mjs', ...forwarded], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: process.env,
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  fs.rmSync(temporaryManifest, {force: true});
}
