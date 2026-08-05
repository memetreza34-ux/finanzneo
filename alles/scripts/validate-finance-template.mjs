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

if (plan.scenes.length !== 9) errors.push(`Template benötigt 9 Szenen, gefunden: ${plan.scenes.length}.`);
const imageScenes = plan.scenes.filter((scene) => scene.layout === 'full-bleed' || scene.layout === 'framed-image');
if (imageScenes.length !== 8) errors.push(`Template benötigt 8 Bildszenen, gefunden: ${imageScenes.length}.`);
if (plan.scenes[0]?.id !== 'hook') errors.push('Erste Szene muss hook sein.');
if (plan.scenes.at(-1)?.id !== 'payoff') errors.push('Letzte Szene muss payoff sein (kein CTA-Baustein mehr im Standard-Template).');

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
  if (scene.transition !== 'cut') errors.push(`${scene.id}: Template muss cut verwenden.`);
  if ((scene.visualPhases ?? []).length > 1) errors.push(`${scene.id}: Template darf höchstens eine visualPhase enthalten.`);
  if ((scene.soundCues ?? []).length > 0) errors.push(`${scene.id}: Template darf keine SFX planen.`);
}

for (const scene of imageScenes) {
  if (!String(scene.imagePrompt ?? '').trim()) errors.push(`${scene.id}: imagePrompt fehlt.`);
}

const oldTemplate = path.join(root, 'channels', 'finanzneo', 'engine', 'scene-plan.template.json');
if (fs.existsSync(oldTemplate)) errors.push('Alte widersprüchliche JSON-Vorlage existiert weiterhin.');

if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log('✓ FinanzNeo-Template: image-first-lite, acht Bildszenen, reale Umgebungen, optionale deutsche Labels.');
