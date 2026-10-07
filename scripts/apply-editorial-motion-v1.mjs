#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  EDITORIAL_MOTION_LOCK,
  EDITORIAL_MOTION_LIBRARY_ID,
  editorialMotionContractFields,
} from './lib/editorial-motion-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-editorial-motion-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : content + '\n', 'utf8');

const index = JSON.parse(read(indexPath));
index.phase1AnimationCode = {
  ...(index.phase1AnimationCode ?? {}),
  ...editorialMotionContractFields(),
};

const animations = Array.isArray(index.scenes)
  ? index.scenes.filter((scene) => scene?.type === 'animation')
  : [];

const heading = '## FINANZNEO EDITORIAL MOTION V1';
const block = `
${heading}
MOTION_WORLD: ${EDITORIAL_MOTION_LOCK}
FINANCE_MOTION_LIBRARY: ${EDITORIAL_MOTION_LIBRARY_ID}
VISUAL_TARGET_WORLD: finanzneo-editorial-finance-v1

Nur Animation:
- Bildwelt als bewegte Editorial-Version behandeln.
- 2D / leichtes 2.5D bevorzugen.
- matte, ruhige Farben und wenige große Formen.
- helle Creme-/Off-White-/Grau-Flächen sind Standard; dunkel nur wenn der Inhalt es wirklich besser macht.
- simples 3D nur wenn es Verständnis verbessert.
- eine klare Hauptveränderung kann vollständig reichen.
- Kamera standardmäßig still.
- keine Pflicht für mehrere Motion-Channels.

Content-first:
1. Sprechpunkt verstehen.
2. Sichtbare Frage bestimmen.
3. Einfachste verständliche Veränderung wählen.
4. Editorial Motion Library auf echten Best-Fit prüfen.
5. Best-Fit parametrisieren oder individuell bauen.
6. Ergebnis mindestens 15 Frames lesbar halten.

Nicht als Default:
- PremiumPhysicalStage
- PhysicalCoinStack / PhysicalObject / Podeste
- glänzende Materialien
- Metall-/Gold-3D
- Neon-/Glow-Look
- Hologramme
- Partikel-/Aurora-/Grid-Hintergründe
- futuristische Dashboards
- dauernde Kamera-Bewegung
- dekorative Rotation/Bounce

Neue Library-Imports bei Best-Fit:
src/finance-motion/editorial-v1.tsx
`;

for (const scene of animations) {
  scene.animationVisualMotionLock = EDITORIAL_MOTION_LOCK;
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  const remotionPath = resolve(root, '03-szenen', plan);
  if (!existsSync(remotionPath)) {
    console.error('Remotion-Spezifikation fehlt: ' + remotionPath);
    process.exit(1);
  }
  const current = read(remotionPath);
  if (!current.includes(heading)) {
    write(remotionPath, current.trim() + '\n\n' + block.trim() + '\n');
  }
}

write(indexPath, JSON.stringify(index, null, 2));

const overviewPath = resolve(root, '05-projektdateien/animationen.md');
if (existsSync(overviewPath)) {
  const overview = read(overviewPath);
  if (!overview.includes(heading)) {
    write(overviewPath, overview.trim() + '\n\n' + block.trim() + '\n');
  }
}

console.log('✓ Editorial Motion angewendet: ' + EDITORIAL_MOTION_LOCK);
console.log('  Animation = bewegte Version der neuen Editorial-Finance-Bildwelt.');
console.log('  2D/2.5D bevorzugt · flexible Surface · minimale klare Motion · kein Physical-3D-Default.');
