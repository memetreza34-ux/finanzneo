#!/usr/bin/env node

import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {validateManifest} from './validate-assets.mjs';

const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error('Nutzung: node scripts/render-validated.mjs <manifest.json>');
  process.exit(1);
}

let manifest;

try {
  manifest = validateManifest(manifestPath);
} catch (error) {
  console.error(`\nRender abgebrochen: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const composition = manifest.composition;
const entryPoint = manifest.entryPoint ?? 'src/index.ts';
const output = manifest.output;

if (!composition || !output) {
  console.error('Render abgebrochen: Manifest benötigt "composition" und "output".');
  process.exit(1);
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['remotion', 'render', entryPoint, composition, output];

if (Array.isArray(manifest.renderArgs)) {
  args.push(...manifest.renderArgs.map(String));
}

console.log(`\nStarte Render: ${composition} → ${output}\n`);

const result = spawnSync(npx, args, {
  cwd: resolve('.'),
  stdio: 'inherit',
});

if (result.error) {
  console.error(`Render konnte nicht gestartet werden: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
