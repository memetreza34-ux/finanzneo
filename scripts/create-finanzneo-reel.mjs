#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex === -1 ? null : args[targetIndex + 1] ?? null;

if (!target) {
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,animation,...]');
  process.exit(1);
}

const scaffold = spawnSync(process.execPath, [resolve('scripts/scaffold-finanzneo-reel.mjs'), ...args], {
  stdio: 'inherit',
});
if (scaffold.status !== 0) process.exit(scaffold.status ?? 1);

const lock = spawnSync(process.execPath, [resolve('scripts/apply-flow-autonomous-contract.mjs'), target], {
  stdio: 'inherit',
});
if (lock.status !== 0) process.exit(lock.status ?? 1);

console.log('\n✓ Neues Reel angelegt und automatisch mit dem Google-Flow-Gesamtdurchlauf-Lock versehen.');
