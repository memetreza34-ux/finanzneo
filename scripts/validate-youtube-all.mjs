#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:validate -- youtube/<Projekt>');
  process.exit(1);
}

const validators = [
  'scripts/validate-youtube.mjs',
  'scripts/validate-youtube-layout.mjs',
  'scripts/validate-youtube-visual-freedom.mjs',
];

for (const validator of validators) {
  const result = spawnSync(process.execPath, [resolve(validator), target], {stdio: 'inherit'});
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('\n✓ Alle YouTube-Verträge erfolgreich geprüft.');
