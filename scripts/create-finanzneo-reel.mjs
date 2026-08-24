#!/usr/bin/env node

// Legt ein neues Reel an: Grundgerüst plus verbindlicher Google-Flow-Lock.
//
// Beide Schritte gehören zusammen. Scheitert der zweite, bliebe sonst ein
// halbfertiges Reel liegen, das den nächsten Versuch mit "Ziel existiert
// bereits" blockiert. Deshalb wird ein neu angelegter Ordner bei einem Fehler
// wieder entfernt — entweder entsteht ein vollständiges Reel oder gar keines.

import {spawnSync} from 'node:child_process';
import {existsSync, readdirSync, rmSync, rmdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex === -1 ? null : args[targetIndex + 1] ?? null;

if (!target) {
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,animation,...]');
  process.exit(1);
}

const absolutesZiel = resolve(target);
const bestandVorher = existsSync(absolutesZiel);
const reelsWurzel = resolve('reels');

const zuruecknehmen = () => {
  if (bestandVorher || !existsSync(absolutesZiel)) return;
  rmSync(absolutesZiel, {recursive: true, force: true});

  let ordner = dirname(absolutesZiel);
  while (ordner.startsWith(reelsWurzel) && ordner !== reelsWurzel) {
    if (!existsSync(ordner) || readdirSync(ordner).length > 0) break;
    rmdirSync(ordner);
    ordner = dirname(ordner);
  }

  console.error(`\nAngelegtes Reel wurde wieder entfernt: ${target}`);
  console.error('Ursache oben beheben und reel:create erneut ausführen.');
};

const scaffold = spawnSync(process.execPath, [resolve('scripts/scaffold-finanzneo-reel.mjs'), ...args], {
  stdio: 'inherit',
});
if (scaffold.status !== 0) {
  zuruecknehmen();
  process.exit(scaffold.status ?? 1);
}

const lock = spawnSync(process.execPath, [resolve('scripts/apply-flow-autonomous-contract.mjs'), target], {
  stdio: 'inherit',
});
if (lock.status !== 0) {
  zuruecknehmen();
  process.exit(lock.status ?? 1);
}

console.log('\n✓ Neues Reel angelegt und mit Google-Flow Strict-Single-Job V3 gesperrt.');
console.log('  Immer genau 1 Bildjob: Ergebnis → Rename → QA → erst dann nächster Bildblock. Kein Batch und kein Nutzer-„weiter“.');
