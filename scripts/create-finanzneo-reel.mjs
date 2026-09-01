#!/usr/bin/env node

// Legt ein neues Reel atomar an: Grundgerüst + Google-Flow-Lock +
// Stylized 3D Animated Black World V9 + Phase-3-Fertigkeitsvertrag + Reel-V5-Layout +
// kanonischer Phase-1-Animationscode + Cinematic Real-World Animation Contract +
// scene-01-als-Cover + Future Cover Hook V2 + Image Storytelling V2 + Visual Beats V2 + automatischer Finalexport.
// Scheitert einer der Schritte, wird ein in diesem Lauf neu erzeugter Reel-Ordner
// vollständig zurückgerollt. Bestehende Reels werden durch diesen Creator nie nachträglich verändert.

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
  ['scripts/apply-visual-beat-contract.mjs', [target]],
  ['scripts/apply-future-image-storytelling-v2.mjs', [target]],
  ['scripts/apply-future-cover-hook-v2.mjs', [target]],
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
console.log('  Bildwelt V9 + Storytelling V2: Alltag/Handlung/Konsequenz zuerst · keine stumpfen Symbolbilder.');
console.log('  Cover Hook V2: scene-01 = Hero-Bild + exakter Reel-Titel ab Frame 0 · keine Untertitel · kein Standard-Header-Icon.');
console.log('  Cover-Export V2: finaler Frame 0 der geprüften MP4, damit die Remotion-Titeltypografie im Cover enthalten ist.');
console.log('  Visual Beats V2: Szenenzahl flexibel · 1 gesprochener Gedanke = 1 sichtbarer Beat · zusätzliche Bilder ausdrücklich erlaubt.');
console.log('  Timing: statische Bilder ideal 1,8–3,2 s und ohne neue sichtbare Information max. 4,2 s; echte Wortzeiten entscheiden final.');
console.log('  Layout V5: Header Y154 · 56 px · max. 2 Zeilen · Visual Y320–1400 · Captions bottom340 ab scene-02.');
console.log('  Animation Safe Zone: hart Y320–1400 · kein Eindringen in Header/Caption.');
console.log('  Animation: reale stylized-3D-Situation · eigene MECHANIC_ID · physische Ursache/Wirkung · keine Karten-/Balken-Ersatzanimation.');
console.log('  Phase 1 muss jede placeholder animation.tsx individuell zum Sprechpunkt produktionsreif ausarbeiten; der Validator blockiert generische Ersatzmechaniken.');
console.log('  Phase 3: MP4 allein gilt nicht als fertig · Frame-0-Cover-QA + jede Szene braucht Visual · Post-Render-QA + Hash-Gate vor Export.');
console.log('  Rückwärtskompatibilität: Diese V2-Verträge gelten nur für neu mit reel:create angelegte Reels.');
