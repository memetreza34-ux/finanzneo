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

if (!central.includes('DIES IST KEIN BATCH-AUFTRAG')) {
  fail('alle-bildprompts.txt muss den Strict-Single-Job-Hinweis "DIES IST KEIN BATCH-AUFTRAG" enthalten.');
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

  const number = String(scene.id ?? '').match(/scene-(\d+)/)?.[1];
  if (number && !central.includes(`SZENE ${number}`)) {
    fail(`${scene.id}: Szenenblock fehlt in alle-bildprompts.txt.`);
  }
}

for (const scene of animationScenes) {
  const number = String(scene.id ?? '').match(/scene-(\d+)/)?.[1];
  if (number && !central.includes(`KEIN BILD ${number}`)) {
    fail(`${scene.id}: Animationsnummer muss in alle-bildprompts.txt ausdrücklich als "KEIN BILD ${number}" reserviert sein.`);
  }
}

const cover = index.cover;
if (cover && cover.separateGenerationForbidden !== true && cover.planFile) {
  const coverPath = resolvePlanFile(cover.planFile);
  if (!coverPath || !existsSync(coverPath)) fail('Cover-Promptdatei fehlt.');
  const coverPrompt = normalize(readFileSync(coverPath, 'utf8'));
  if (coverPrompt && !central.includes(coverPrompt)) {
    fail('Der separate Cover-Prompt fehlt in alle-bildprompts.txt.');
  }
}

console.log(`✓ Zentrale Google-Flow-Übergabe vollständig: ${imageScenes.length} Bildprompts · ${animationScenes.length} reservierte Animationsnummern.`);
