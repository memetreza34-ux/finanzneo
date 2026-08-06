#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/finance-contracts.mjs';
import {createFinanceScenePlanTemplate} from './lib/create-finance-scene-plan-template.mjs';

const plan = createFinanceScenePlanTemplate({
  slug: 'visual-quality-v2-test',
  title: 'Visual Quality V2 Test',
  topic: 'Ein nachvollziehbarer Finanzprozess',
});

ScenePlan.parse(plan);

const images = plan.scenes.filter((scene) => scene.type === 'image');
const animations = plan.scenes.filter((scene) => scene.type === 'animation');
const total = plan.scenes.length;
const imageShare = images.length / total;
const animationShare = animations.length / total;
const duration = plan.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

expect(plan.visualQualityProfile === 'finanzneo-process-v2', 'Visual-Quality-Profil fehlt.');
expect(plan.headerProfile === 'finanzneo-scene-header-v2', 'Scene-Header-Profil fehlt.');
expect(total === 9, `Neun Szenen erwartet, gefunden: ${total}.`);
expect(images.length === 5, `Fünf Prozessbilder erwartet, gefunden: ${images.length}.`);
expect(animations.length === 4, `Vier Animationen erwartet, gefunden: ${animations.length}.`);
expect(imageShare >= 0.55 && imageShare <= 0.65, `Bildanteil außerhalb 55–65 %: ${imageShare}.`);
expect(animationShare >= 0.35 && animationShare <= 0.45, `Animationsanteil außerhalb 35–45 %: ${animationShare}.`);
expect(duration >= 60 && duration <= 75, `Laufzeit außerhalb 60–75 Sekunden: ${duration}.`);
expect(plan.scenes[0]?.frameZeroMainMotif === true, 'Hook-Motiv fehlt in Frame 0.');

for (const scene of plan.scenes) {
  expect(scene.content?.profile === 'finanzneo-scene-header-v2', `${scene.id}: Headerprofil fehlt.`);
  expect(typeof scene.content?.icon === 'string' && scene.content.icon.length > 1, `${scene.id}: Icon fehlt.`);
  expect(scene.content?.headlineMinPx >= 72, `${scene.id}: Überschrift ist zu klein.`);
  expect(scene.content?.maxLines <= 2, `${scene.id}: Überschrift nutzt zu viele Zeilen.`);
  expect(scene.content?.textTone === 'light', `${scene.id}: Überschrift muss hell sein.`);
  expect(scene.content?.topGradient === true, `${scene.id}: oberer Kontrastverlauf fehlt.`);
}

for (const scene of images) {
  expect(scene.processImage?.decorativeOnly === false, `${scene.id}: Bild darf nicht rein dekorativ sein.`);
  expect(scene.processImage?.instantReadabilitySeconds <= 1, `${scene.id}: Bild ist nicht schnell genug verständlich.`);
  expect(String(scene.processImage?.startState ?? '').length >= 8, `${scene.id}: Ausgangslage fehlt.`);
  expect(String(scene.processImage?.processPath ?? '').length >= 8, `${scene.id}: Prozessweg fehlt.`);
  expect(String(scene.processImage?.resultState ?? '').length >= 8, `${scene.id}: Ergebnis fehlt.`);
  expect(scene.visualPhases.length >= 2, `${scene.id}: Prozessbild benötigt mindestens zwei Bewegungsphasen.`);
  const prompt = String(scene.imagePrompt ?? '').toLowerCase();
  expect(prompt.includes('start state'), `${scene.id}: Bildprompt enthält keine Ausgangslage.`);
  expect(prompt.includes('process path'), `${scene.id}: Bildprompt enthält keinen Prozessweg.`);
  expect(prompt.includes('result state'), `${scene.id}: Bildprompt enthält kein Ergebnis.`);
  expect(prompt.includes('no tiny labels'), `${scene.id}: Schutz gegen winzige Beschriftungen fehlt.`);
}

const visualFamilies = new Set();
for (const scene of animations) {
  expect(String(scene.animation?.startState ?? '').length >= 8, `${scene.id}: Animations-Startzustand fehlt.`);
  expect(String(scene.animation?.narrativeAction ?? '').length >= 12, `${scene.id}: Animationshandlung fehlt.`);
  expect(String(scene.animation?.endState ?? '').length >= 8, `${scene.id}: Animations-Endzustand fehlt.`);
  expect(scene.visualPhases.length >= 3, `${scene.id}: Animation benötigt mindestens drei Phasen.`);
  expect(!visualFamilies.has(scene.visualFamily), `${scene.id}: Animations-Raumlogik wird wiederholt.`);
  visualFamilies.add(scene.visualFamily);
}

const sharedHeaderFile = path.resolve(
  process.cwd(),
  'channels',
  'finanzneo',
  'src',
  'reels',
  'shared',
  'FinanzNeoSceneHeader.tsx',
);
expect(fs.existsSync(sharedHeaderFile), `Gemeinsamer Scene Header fehlt: ${sharedHeaderFile}`);
const headerSource = fs.readFileSync(sharedHeaderFile, 'utf8');
expect(headerSource.includes("'finanzneo-scene-header-v2'"), 'Headerprofil fehlt im gemeinsamen Component-Code.');
expect(headerSource.includes("color: '#F7FAF5'"), 'Helle Hauptüberschrift fehlt im Component-Code.');
expect(headerSource.includes('fontSize: 78'), 'Standard-Schriftgröße 78 px fehlt.');
expect(headerSource.includes('WebkitLineClamp: 2'), 'Zweizeilige Begrenzung fehlt.');
expect(headerSource.includes('linear-gradient(180deg'), 'Oberer Kontrastverlauf fehlt.');

console.log('✓ Visual Quality V2 Regressionstest bestanden.');
console.log(`  Szenen: ${total}`);
console.log(`  Verteilung: ${images.length} Prozessbilder / ${animations.length} Animationen`);
console.log(`  Laufzeit: ${duration.toFixed(2)} Sekunden`);
console.log('  Scene Header: finanzneo-scene-header-v2');
