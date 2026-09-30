#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const [projectDirectory] = process.argv.slice(2);

if (!projectDirectory) {
  console.error('\nNutzung: node scripts/validate-central-flow-prompts.mjs <Reel-Projektordner>\n');
  process.exit(1);
}

const root = resolve(projectDirectory);
const scenesRoot = resolve(root, '03-szenen');
const indexPath = resolve(scenesRoot, 'scene-index.json');
const centralPath = resolve(scenesRoot, 'alle-bildprompts.txt');

const fail = (message) => {
  console.error(`\n✗ Zentrale Google-Flow-Übergabe ungültig: ${message}`);
  process.exit(1);
};

if (!existsSync(indexPath)) fail('03-szenen/scene-index.json fehlt.');
if (!existsSync(centralPath)) {
  fail('03-szenen/alle-bildprompts.txt fehlt. Phase 1 muss immer eine zentrale Datei mit allen Flow-Bildprompts liefern.');
}

let index;
try {
  index = JSON.parse(readFileSync(indexPath, 'utf8'));
} catch {
  fail('scene-index.json ist kein gültiges JSON.');
}

const normalize = (value) => value.replace(/\r\n/g, '\n').trim();
const central = normalize(readFileSync(centralPath, 'utf8'));

const requiredMarkers = [
  'DIES IST KEIN BATCH-AUFTRAG',
  'BLOCKGRÖSSE = 5',
  'MAX_CONCURRENT_GENERATIONS = 1',
  'COVER_VARIANT_COUNT = 3',
  'COVER-AUSWAHL ERFORDERLICH = JA',
  'STYLE-REFERENZ = GEWÄHLTES COVER',
  'COVER-VARIANTE A',
  'COVER-VARIANTE B',
  'COVER-VARIANTE C',
];
for (const marker of requiredMarkers) {
  if (!central.includes(marker)) fail(`alle-bildprompts.txt muss den Marker "${marker}" enthalten.`);
}

if (!/STOPP[\s\S]{0,160}Nutzer/i.test(central)) {
  fail('Nach den drei Cover-Varianten muss zwingend auf die Nutzerwahl gewartet werden.');
}
if (!/gewählte(?:s|n)? Cover[\s\S]{0,220}Style-Referenz/i.test(central)) {
  fail('Das gewählte Cover muss als Style-Referenz für die restlichen Bilder festgelegt sein.');
}
if (!/5ER-BLOCK 1/.test(central)) {
  fail('Mindestens ein 5ER-BLOCK muss in der zentralen Flow-Datei vorhanden sein.');
}

const resolvePlanFile = (planFile) => {
  if (!planFile) return null;
  return planFile.startsWith('03-szenen/')
    ? resolve(root, planFile)
    : resolve(scenesRoot, planFile);
};

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const imageScenes = scenes.filter((scene) => scene?.type === 'image');
const animationScenes = scenes.filter((scene) => scene?.type === 'animation');

if (imageScenes.length === 0) fail('scene-index enthält keine Bildszenen.');

for (const scene of imageScenes) {
  const planPath = resolvePlanFile(scene.planFile);
  if (!planPath || !existsSync(planPath)) {
    fail(`${scene.id}: bildprompt.txt/planFile fehlt.`);
  }

  const prompt = normalize(readFileSync(planPath, 'utf8'));
  if (!prompt) fail(`${scene.id}: Bildprompt ist leer.`);
  if (!central.includes(prompt)) {
    fail(`${scene.id}: der vollständige individuelle Bildprompt fehlt in 03-szenen/alle-bildprompts.txt.`);
  }
}

for (const scene of animationScenes) {
  const number = String(scene.id ?? '').match(/scene-(\d+)/)?.[1];
  if (number && !central.includes(`KEIN BILD ${number}`)) {
    fail(`${scene.id}: Animationsnummer muss in alle-bildprompts.txt ausdrücklich als "KEIN BILD ${number}" reserviert sein.`);
  }
}

const remainingImages = Math.max(0, imageScenes.length - 1);
const expectedBlocks = Math.max(1, Math.ceil(remainingImages / 5));
for (let i = 1; i <= expectedBlocks; i += 1) {
  if (!central.includes(`5ER-BLOCK ${i}`)) {
    fail(`5ER-BLOCK ${i} fehlt. Nach der Cover-Auswahl müssen die restlichen Bilder in Blöcken zu maximal 5 organisiert sein.`);
  }
}

console.log(`✓ Zentrale Google-Flow-Übergabe vollständig: 3 Cover-Varianten · Nutzerwahl · Cover als Style-Referenz · ${expectedBlocks} 5er-Block/Blöcke · concurrency=1.`);
