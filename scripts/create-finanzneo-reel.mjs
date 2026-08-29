#!/usr/bin/env node

// Legt ein neues Reel atomar an: Grundgerüst + Google-Flow-Lock +
// Stylized 3D Animated Black World V9 + Phase-3-Fertigkeitsvertrag + Reel-V5-Layout +
// kanonischer Phase-1-Animationscode + Premium-Physical-Animation V2 +
// scene-01-als-Cover + automatischer Finalexport.
// Scheitert einer der Schritte, wird ein in diesem Lauf neu erzeugter Reel-Ordner
// vollständig zurückgerollt.

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

const run = (script, scriptArgs = []) => spawnSync(process.execPath, [resolve(script), ...scriptArgs], {stdio: 'inherit'});

const steps = [
  ['scripts/scaffold-finanzneo-reel.mjs', args],
  ['scripts/apply-flow-autonomous-contract.mjs', [target]],
  ['scripts/apply-stylized-animated-black-world-v9.mjs', [target]],
  ['scripts/apply-phase3-completion-contract.mjs', [target]],
  ['scripts/apply-reel-layout-v5.mjs', [target]],
  ['scripts/apply-phase1-animation-code-contract.mjs', [target]],
  ['scripts/apply-premium-animation-v2.mjs', [target]],
  ['scripts/apply-scene01-cover-export-contract.mjs', [target]],
];

for (const [script, scriptArgs] of steps) {
  const result = run(script, scriptArgs);
  if (result.status !== 0) {
    zuruecknehmen();
    process.exit(result.status ?? 1);
  }
}

console.log('\n✓ Neues Reel vollständig angelegt.');
console.log('  Google Flow: Strict-Single-Job V3 · immer genau 1 Bildjob · kein Batch · kein Nutzer-„weiter“.');
console.log('  Bildwelt V9: realitätsnahe Erklärszene · stylized 3D · nicht fotorealistisch · deep black Pflicht.');
console.log('  Cover: scene-01 ist automatisch das Cover · kein separater Cover-Job · kein Bild 00.');
console.log('  Layout V5: Header Y154 · 56 px · max. 2 Zeilen · Visual Y320–1400 · Captions bottom340.');
console.log('  Animation Safe Zone: hart Y320–1400 · kein Eindringen in Header/Caption.');
console.log('  Animation V2: Phase-1-Code bleibt kanonisch und muss visuell zur V9-Bildwelt passen.');
console.log('  Phase 3: MP4 allein gilt nicht als fertig · jede Szene braucht Visual · Post-Render-QA + Hash-Gate vor Export.');
console.log('  Export: nach bestandenem Render-QA automatisch nach 06-export/ + caption-universal.txt.');
