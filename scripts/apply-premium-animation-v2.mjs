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
    write(remotionPath, `${current.trim()}\n\n## V9-KOMPATIBLER ANIMATIONSVERTRAG\nPremium Visual Lock: ${PREMIUM_ANIMATION_LOCK}\nVisual Target World: finanzneo-stylized-3d-animated-black-v9\n\nPflicht:\n- klar nicht-realistische stylized-3D-Animationssprache wie die Flow-Bilder\n- eine klare Hauptaktion / ein klares Hauptmotiv\n- keine feste Anzahl an Support-Objekten; nur verwenden, wenn sie die Aussage verbessern\n- sichtbare Materialität, Dicke, Tiefe und Kontakt-Schatten\n- klare Ursache → Wirkung → Ergebnis\n- Emerald / Ivory / Soft Gray / Gold / Rot-Orange semantisch einsetzen\n- PremiumPhysicalStage + mindestens ein echtes PhysicalObject verwenden\n- PremiumPhysicalStage bleibt transparent; der zentrale Reel-Canvas darunter ist statisch #000000\n\nVerboten:\n- Partikel/Aurora/Grid/Glow/Gradient als Animationshintergrund\n- Dashboard-/Control-Panel-Look\n- Flowchart als Hauptkomposition\n- kleine Boxen mit dünnen Verbindungslinien\n- generische Info-Cards als Hauptsprache\n- reine Texttafeln\n- dekorative Bewegung ohne erklärenden Mechanismus\n`);
  }
}

write(indexPath, JSON.stringify(index, null, 2));

const overviewPath = resolve(root, '05-projektdateien/animationen.md');
if (existsSync(overviewPath)) {
  const overview = read(overviewPath);
  if (!overview.includes(PREMIUM_ANIMATION_LOCK)) {
    write(overviewPath, `${overview.trim()}\n\n## V9-kompatibler Animationsvertrag\nLock: ${PREMIUM_ANIMATION_LOCK}\nVisual Target: finanzneo-stylized-3d-animated-black-v9\n\nAlle Remotion-Szenen verwenden dieselbe nicht-realistische stylized-3D-Animationssprache wie die Flow-Bilder. Keine feste Support-Objekt-Anzahl. Der Animations-Stage bleibt transparent über dem statischen #000000 Reel-Canvas. UI-/Dashboard-/Flowchart-/Partikel-/Aurora-/Grid-Hintergründe sind verboten.\n`);
  }
}

console.log(`✓ Animation Contract angewendet: ${PREMIUM_ANIMATION_LOCK}`);
console.log('  Visual Target: Stylized 3D Animated Black V9 · keine feste Objektanzahl.');
console.log('  Transparenter Animation-Stage über statischem #000000 Canvas · keine Partikel/Aurora/Grid/Glow-Hintergründe.');
