#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {existsSync, readdirSync, rmSync, rmdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex === -1 ? null : args[targetIndex + 1] ?? null;

if (!target) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types image,hybrid,animation,data,...]');
  process.exit(1);
}

const absoluteTarget = resolve(target);
const existedBefore = existsSync(absoluteTarget);
const youtubeRoot = resolve('youtube');

const rollback = () => {
  if (existedBefore || !existsSync(absoluteTarget)) return;
  rmSync(absoluteTarget, {recursive: true, force: true});
  let directory = dirname(absoluteTarget);
  while (directory.startsWith(youtubeRoot) && directory !== youtubeRoot) {
    if (!existsSync(directory) || readdirSync(directory).length > 0) break;
    rmdirSync(directory);
    directory = dirname(directory);
  }
  console.error(`\nAngelegtes YouTube-Projekt wurde wieder entfernt: ${target}`);
  console.error('Ursache oben beheben und youtube:create erneut ausführen.');
};

const run = (script, scriptArgs = []) => spawnSync(process.execPath, [resolve(script), ...scriptArgs], {stdio: 'inherit'});

const scaffold = run('scripts/scaffold-finanzneo-youtube.mjs', args);
if (scaffold.status !== 0) process.exit(scaffold.status ?? 1);

const direction = run('scripts/apply-youtube-visual-direction-v1.mjs', [target]);
if (direction.status !== 0) {
  rollback();
  process.exit(direction.status ?? 1);
}

console.log('\n✓ Neues YouTube-Projekt vollständig angelegt.');
console.log('  Bestehende YouTube-Bildwelt und Flow-Regeln bleiben erhalten.');
console.log('  Visual Direction V1 ergänzt Hook, Handlung, Spannung, Kamera, Tiefe, Pattern Interrupts und Novelty-Checks.');
