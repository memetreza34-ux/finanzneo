#!/usr/bin/env node

// Legt ein neues Reel atomar an: Grundgerüst + Google-Flow-Lock +
// Premium-Visual-World V8 + Phase-3-Fertigkeitsvertrag + Reel-V5-Layout +
// kanonischer Phase-1-Animationscode + Premium-Physical-Animation V2.
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
  ['scripts/apply-premium-visual-world-v6.mjs', [target]],
  ['scripts/apply-phase3-completion-contract.mjs', [target]],
  ['scripts/apply-reel-layout-v5.mjs', [target]],
  ['scripts/apply-phase1-animation-code-contract.mjs', [target]],
  ['scripts/apply-premium-animation-v2.mjs', [target]],
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
console.log('  Premium Visual V8: großer physischer Hero · 2–4 Supporting Objects · Tiefe/Material/Licht · kein UI-/Flowchart-Look.');
console.log('  Layout V5: plain Header Y154 · Visual 320–1480 · Captions bottom 340.');
console.log('  Animation V2: PremiumPhysicalStage + physische Hero-/Support-Objekte · gleiche Premium-Welt wie die Flow-Bilder.');
console.log('  Phase 3: MP4 allein gilt nicht als fertig · jede Szene braucht Visual · Post-Render-QA + Hash-Gate vor Export.');
