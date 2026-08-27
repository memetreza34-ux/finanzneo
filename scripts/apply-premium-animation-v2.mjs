#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  PREMIUM_ANIMATION_LOCK,
  premiumAnimationContractFields,
} from './lib/premium-animation-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-premium-animation-v2.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');

const index = JSON.parse(read(indexPath));
index.phase1AnimationCode = {
  ...(index.phase1AnimationCode ?? {}),
  ...premiumAnimationContractFields(),
};

const animations = Array.isArray(index.scenes)
  ? index.scenes.filter((scene) => scene?.type === 'animation')
  : [];

for (const scene of animations) {
  scene.animationPremiumVisualLock = PREMIUM_ANIMATION_LOCK;
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  const remotionPath = resolve(root, '03-szenen', plan);
  if (!existsSync(remotionPath)) {
    console.error(`Remotion-Spezifikation fehlt: ${remotionPath}`);
    process.exit(1);
  }
  const current = read(remotionPath);
  if (!current.includes(`Premium Visual Lock: ${PREMIUM_ANIMATION_LOCK}`)) {
    write(remotionPath, `${current.trim()}\n\n## PREMIUM PHYSICAL ANIMATION V2\nPremium Visual Lock: ${PREMIUM_ANIMATION_LOCK}\n\nPflicht:\n- dieselbe physische Premium-Objektwelt wie die Flow-Bilder\n- ein großes dominantes Hero-Objekt, nicht viele kleine Kästen\n- 2–4 unterstützende konkrete Objekte\n- sichtbare Materialität, Dicke, Tiefe, Kontakt-Schatten und Lichttrennung\n- klare physische Ursache → Wirkung → Ergebnis\n- Grün nur als Fokus/Lösung; Creme/Weiß plus Gold oder Rot als semantischer Kontrast\n- PremiumPhysicalStage + PhysicalObject aus dem zentralen Designsystem verwenden\n\nVerboten:\n- Dashboard-/Control-Panel-Look\n- Flowchart als Hauptkomposition\n- kleine Boxen mit dünnen Verbindungslinien\n- generische Info-Cards als Hauptsprache\n- monochrom-grüne Komposition\n- reine Texttafeln\n- dekorative Bewegung ohne erklärenden Mechanismus\n`);
  }
}

write(indexPath, JSON.stringify(index, null, 2));

const overviewPath = resolve(root, '05-projektdateien/animationen.md');
if (existsSync(overviewPath)) {
  const overview = read(overviewPath);
  if (!overview.includes(PREMIUM_ANIMATION_LOCK)) {
    write(overviewPath, `${overview.trim()}\n\n## Premium Physical Animation V2\nLock: ${PREMIUM_ANIMATION_LOCK}\n\nAlle Remotion-Szenen müssen dieselbe massive, physische Premium-Welt wie die Flow-Bilder verwenden. Große konkrete Hero-Objekte, Materialkontrast, 3D-Tiefe, Kontakt-Schatten und cinematic lighting sind Pflicht. UI-/Dashboard-/Flowchart-/kleine-Boxen-Sprache ist als Hauptkomposition verboten.\n`);
  }
}

console.log(`✓ Premium Animation Contract angewendet: ${PREMIUM_ANIMATION_LOCK}`);
console.log('  Große physische Hero-Objekte · Material/Tiefe/Licht · gleiche Sprache wie die Bildwelt.');
console.log('  Dashboard/Flowchart/kleine Boxen + dünne Linien/monochrom-grün sind verboten.');
