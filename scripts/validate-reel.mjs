#!/usr/bin/env node

// Führt alle Reel-Validatoren auf demselben Projektordner aus.
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';

const [projectDirectory] = process.argv.slice(2);

if (!projectDirectory) {
  console.error('\nNutzung: npm run reel:validate -- <Reel-Projektordner>\n');
  process.exit(1);
}

const validators = [
  'scripts/validate-active-reel-rules.mjs',
  'scripts/validate-reel-background.mjs',
  'scripts/validate-reel-source-contract.mjs',
  'scripts/validate-scene01-cover-export-contract.mjs',
  'scripts/validate-scene-quality.mjs',
  'scripts/validate-visual-beat-contract.mjs',
  'scripts/validate-reel-layout-v5.mjs',
  'scripts/validate-premium-visual-contract.mjs',
  'scripts/validate-animation-source-quality.mjs',
  'scripts/validate-flow-autonomous-contract.mjs',
  'scripts/validate-phase3-contract.mjs',
  'scripts/validate-platform-publishing.mjs',
];

for (const validator of validators) {
  const result = spawnSync(process.execPath, [resolve(validator), projectDirectory], {stdio: 'inherit'});
  if (result.status !== 0) process.exit(result.status ?? 1);
}
