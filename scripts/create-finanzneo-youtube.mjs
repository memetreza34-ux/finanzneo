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

const anchor = run('scripts/apply-youtube-cover-anchor-flow-v1.mjs', [target]);
if (anchor.status !== 0) {
  rollback();
  process.exit(anchor.status ?? 1);
}

console.log('\n✓ Neues YouTube-Projekt vollständig angelegt.');
console.log('  Visual Direction V1 ergänzt Hook, Handlung, Spannung, Kamera, Tiefe, Pattern Interrupts und Novelty-Checks.');
console.log('  visual-01 ist das Master-Anchor-Bild des Videos und muss zuerst erzeugt/freigegeben werden.');
console.log('  Thumbnail und Folge-Bilder nutzen danach visual-01 als Art-Direction-Referenz, ohne dessen Komposition zu kopieren.');
console.log('  Folge-Bilder werden in 5er-Planblöcken organisiert, aber weiterhin streng einzeln generiert, umbenannt und geprüft.');
