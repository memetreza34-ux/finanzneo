#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {createFinanceScenePlanTemplate} from './lib/create-finance-scene-plan-template.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const errors = [];
const plan = createFinanceScenePlanTemplate({slug: 'template-check', title: 'Template Check', topic: 'ETF-Kosten'});
const parsed = ScenePlan.safeParse(plan);
if (!parsed.success) errors.push(`Template verletzt ScenePlan: ${parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`);

const imageScenes = plan.scenes.filter((scene) => scene.type === 'image');
const animationScenes = plan.scenes.filter((scene) => scene.type === 'animation');
const duration = plan.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);
const imageShare = imageScenes.length / plan.scenes.length;
const animationShare = animationScenes.length / plan.scenes.length;

if (plan.visualQualityProfile !== 'finanzneo-process-v2') errors.push('Template benötigt visualQualityProfile finanzneo-process-v2.');
if (plan.headerProfile !== 'finanzneo-scene-header-v2') errors.push('Template benötigt headerProfile finanzneo-scene-header-v2.');
if (plan.scenes.length !== 9) errors.push(`Template benötigt 9 Szenen, gefunden: ${plan.scenes.length}.`);
if (imageScenes.length !== 5) errors.push(`Template benötigt 5 Prozessbilder, gefunden: ${imageScenes.length}.`);
if (animationScenes.length !== 4) errors.push(`Template benötigt 4 Animationen, gefunden: ${animationScenes.length}.`);
if (imageShare < 0.55 || imageShare > 0.65) errors.push(`Bildanteil liegt außerhalb 55–65 Prozent: ${(imageShare * 100).toFixed(1)} Prozent.`);
if (animationShare < 0.35 || animationShare > 0.45) errors.push(`Animationsanteil liegt außerhalb 35–45 Prozent: ${(animationShare * 100).toFixed(1)} Prozent.`);
if (duration < 60 || duration > 75) errors.push(`Template-Laufzeit muss 60–75 Sekunden betragen; gefunden: ${duration}.`);
if (plan.scenes[0]?.id !== 'scene-01-hook') errors.push('Erste Szene muss scene-01-hook sein.');
if (plan.scenes.at(-1)?.id !== 'scene-09-payoff') errors.push('Letzte Szene muss scene-09-payoff sein.');
if (plan.scenes[0]?.frameZeroMainMotif !== true) errors.push('Hook-Motiv muss ab Frame 0 sichtbar sein.');

const serialized = JSON.stringify(plan);
for (const token of ['FINANCE_TODO_SCRIPT', 'FINANCE_TODO_IMAGE_BRIEF', 'FINANCE_TODO_CONTENT']) {
  if (!serialized.includes(token)) errors.push(`Verbindlicher Planungsmarker fehlt: ${token}.`);
}
for (const forbidden of ['depotordner', 'umsatzbehälter', 'gewinnanzeiger', 'sparplan-behälter', 'zeitlandschaft', 'rechenstrecke', 'kurssäule', 'finanzmaschine']) {
  if (serialized.toLocaleLowerCase('de-DE').includes(forbidden)) errors.push(`Altes Fantasieobjekt in Template gefunden: ${forbidden}.`);
}
for (const legacy of ['no visible support surface', 'no table', 'no floor', 'no pedestal', 'one seamless evenly dark charcoal background across the full canvas']) {
  if (serialized.toLocaleLowerCase('en-US').includes(legacy)) errors.push(`Altes pauschales Umgebungsverbot im Template gefunden: ${legacy}.`);
}

for (const scene of plan.scenes) {
  if (scene.content?.profile !== 'finanzneo-scene-header-v2') errors.push(`${scene.id}: Headerprofil fehlt.`);
  if (!String(scene.content?.icon ?? '').trim()) errors.push(`${scene.id}: passendes Icon fehlt.`);
  if (scene.content?.headlineMinPx < 72) errors.push(`${scene.id}: Überschrift ist kleiner als 72 px.`);
  if (scene.content?.maxLines > 2) errors.push(`${scene.id}: Überschrift darf höchstens zwei Zeilen nutzen.`);
  if (scene.content?.textTone !== 'light') errors.push(`${scene.id}: Überschrift muss hell sein.`);
  if (scene.content?.topGradient !== true) errors.push(`${scene.id}: oberer Kontrastverlauf fehlt.`);
  if ((scene.soundCues ?? []).length > 0) errors.push(`${scene.id}: Template darf keine SFX planen.`);
}

for (const scene of imageScenes) {
  if (!String(scene.imagePrompt ?? '').trim()) errors.push(`${scene.id}: imagePrompt fehlt.`);
  if (!String(scene.processImage?.startState ?? '').trim()) errors.push(`${scene.id}: Prozess-Ausgangslage fehlt.`);
  if (!String(scene.processImage?.processPath ?? '').trim()) errors.push(`${scene.id}: Prozessweg fehlt.`);
  if (!String(scene.processImage?.resultState ?? '').trim()) errors.push(`${scene.id}: Prozess-Ergebnis fehlt.`);
  if (scene.processImage?.instantReadabilitySeconds > 1) errors.push(`${scene.id}: Prozessbild ist nicht innerhalb einer Sekunde verständlich.`);
  if (scene.processImage?.decorativeOnly !== false) errors.push(`${scene.id}: Prozessbild darf nicht rein dekorativ sein.`);
  if ((scene.visualPhases ?? []).length < 2) errors.push(`${scene.id}: Prozessbild benötigt mindestens zwei Bewegungsphasen.`);
}

const visualFamilies = new Set();
for (const scene of animationScenes) {
  if (!String(scene.animation?.startState ?? '').trim()) errors.push(`${scene.id}: Animations-Startzustand fehlt.`);
  if (!String(scene.animation?.narrativeAction ?? '').trim()) errors.push(`${scene.id}: Animationshandlung fehlt.`);
  if (!String(scene.animation?.endState ?? '').trim()) errors.push(`${scene.id}: Animations-Endzustand fehlt.`);
  if ((scene.visualPhases ?? []).length < 3) errors.push(`${scene.id}: Animation benötigt mindestens drei Phasen.`);
  if (visualFamilies.has(scene.visualFamily)) errors.push(`${scene.id}: Animations-Raumlogik wird wiederholt.`);
  visualFamilies.add(scene.visualFamily);
}

const oldTemplate = path.join(root, 'channels', 'finanzneo', 'engine', 'scene-plan.template.json');
if (fs.existsSync(oldTemplate)) errors.push('Alte widersprüchliche JSON-Vorlage existiert weiterhin.');

if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log('✓ FinanzNeo-Template: Visual Quality V2, fünf Prozessbilder, vier hochwertige Animationen.');
console.log('✓ Überschriften: hell, mindestens 72 px, maximal zweizeilig, mit Icon und Kontrastverlauf.');
