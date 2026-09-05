#!/usr/bin/env node

// Legt ein neues Reel atomar an: Grundgerüst + Google-Flow-Lock +
// Stylized 3D Animated Black World V9 + Phase-3-Fertigkeitsvertrag + Reel-V5-Layout +
// kanonischer Phase-1-Animationscode + Cinematic Real-World Animation Contract +
// scene-01-als-Cover + Future Cover Hook V3 + Image Storytelling V3 + Visual Beats V2 +
// Future Production V3 (Timing, Animationsframing, Audio-Mastering) + automatischer Finalexport.
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
  // Cover Hook V3 erstellt/garantiert zuerst den Phase-3-Handoff. Danach kann
  // Image Storytelling seinen Block sicher in dieselbe Datei einhängen.
  ['scripts/apply-future-cover-hook-v3.mjs', [target]],
  ['scripts/apply-future-image-storytelling-v3.mjs', [target]],
  // Letzter Future-Layer: verschärft nur neue Reels. Alte Reels besitzen den
  // Marker nicht und bleiben bei Validator/Render vollständig unverändert.
  ['scripts/apply-future-production-standard-v3.mjs', [target]],
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
console.log('  Bildwelt V9 + Storytelling V3: Literal first, creative second · reale Situation + Kontextanker + Voiceover-Match vor Metapher.');
console.log('  Bild-QA V3: Subtitle-off-Test + Transferability-Test · generische Maschinen-/Symbolbilder werden vor Flow blockiert.');
console.log('  Cover Hook V3: scene-01 = Cover + erster echter Content-Hook · kein separater 0,1-s-/3-Frame-Cover-Clip.');
console.log('  Hook V3: Voiceover startet mit dem ersten Wort in scene-01; direkte Frage/Aussage/Problem/Warnung/Kontrast/Zahl + konkreter Themenanker.');
console.log('  Cover-Export V3: Frame 0 derselben normalen Hook-Szene · Hero-Bild + Remotion-Hook-Titel, caption-frei; danach läuft scene-01 normal weiter.');
console.log('  Visual Beats V2 + Future V3: Szenenzahl flexibel · 1 Gedanke = 1 sichtbarer Beat · zusätzliche Bilder ausdrücklich erlaubt.');
console.log('  Timing V3: statische Bilder ideal 1,8–3,0 s · ab 3,6 s Split prüfen · ohne neue sichtbare Information max. 4,0 s.');
console.log('  Layout V5: Header Y154 · 56 px · max. 2 Zeilen · Visual Y320–1400 · Captions bottom340; in scene-01 nach Frame 0 erlaubt.');
console.log('  Animation Safe Zone: hart Y320–1400 · kein Eindringen in Header/Caption.');
console.log('  Animation V3: reale stylized-3D-Situation · physische Ursache/Wirkung · Hauptmechanik größer/füllender · Occupancy-QA im echten Render.');
console.log('  Audio V3: Candidate wird vor Render-QA automatisch auf -16 LUFS / -1 dBTP gemastert.');
console.log('  Phase 1 muss jede placeholder animation.tsx individuell zum Sprechpunkt produktionsreif ausarbeiten; der Validator blockiert generische Ersatzmechaniken.');
console.log('  Phase 3: MP4 allein gilt nicht als fertig · Frame-0-Cover-QA + scene-01-Hook-QA + jede Szene braucht Visual · Post-Render-QA + Future-V3-QA + Hash-Gate vor Export.');
console.log('  Rückwärtskompatibilität: Cover Hook V3, Image Storytelling V3 und Future Production V3 gelten nur für neu mit reel:create angelegte Reels.');
