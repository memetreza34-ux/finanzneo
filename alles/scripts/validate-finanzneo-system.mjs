#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const errors = [];
const exists = (relative) => fs.existsSync(path.join(root, relative));
const read = (relative) => exists(relative) ? fs.readFileSync(path.join(root, relative), 'utf8') : '';
const requireFile = (relative) => {
  if (!exists(relative)) errors.push(`Pflichtdatei fehlt: ${relative}`);
  return read(relative);
};
const requireAll = (relative, tokens) => {
  const content = requireFile(relative);
  for (const token of tokens) if (!content.includes(token)) errors.push(`${relative} enthält die Pflichtlogik nicht: ${token}`);
  return content;
};
const forbid = (relative, patterns) => {
  const content = read(relative);
  for (const pattern of patterns) if (pattern.test(content)) errors.push(`${relative} enthält widersprüchliche Logik: ${pattern}`);
};

if (exists('channels/finanzneo/engine/scene-plan.template.json')) errors.push('Alte scene-plan.template.json darf nicht existieren.');

requireAll('channels/finanzneo/CLAUDE.md', [
  'finanzneo-process-v2',
  '9 Szenen mit 5 Prozessbildern und 4 hochwertigen Animationen',
  'FinanzNeoSceneHeader.tsx',
  'npm run finance:reel:build',
  'niemals schwarze oder dunkelgraue Hauptschrift',
]);
requireAll('channels/finanzneo/AGENTS.md', [
  'finanzneo-process-v2',
  '9 scenes = 5 process images + 4 high-quality animations',
  'FinanzNeoSceneHeader.tsx',
  '35–45% animation scenes',
]);
requireAll('scripts/lib/create-finance-scene-plan-template.mjs', [
  'twoPhases',
  'threePhases',
  "id: 'scene-09-payoff'",
  'actualImages: 5',
  'actualAnimations: 4',
  'processImage',
  "type: 'animation'",
]);
requireAll('channels/finanzneo/templates/codex-reel-package.template.json', [
  'finanzneo-process-v2',
  'finanzneo-scene-header-v2',
  'minimumAnimationShare',
  'maximumAnimationScenes',
  'scene-08-solution',
]);
requireAll('channels/finanzneo/templates/reel-build-manifest.template.json', [
  'expectedSceneCount',
  'imageCount',
  'animationCount',
  'visualQualityV2Implemented',
  'ETF process animation level or better',
]);
requireAll('channels/finanzneo/src/reels/shared/FinanzNeoSceneHeader.tsx', [
  'finanzneo-scene-header-v2',
  "color: '#F7FAF5'",
  'fontSize: 78',
  'WebkitLineClamp: 2',
  'linear-gradient(180deg',
  'type FinanzNeoSceneIcon',
]);
requireAll('scripts/verify-finance-codex-reel-package.mjs', [
  'usesVisualQualityV2',
  'minimumAnimationShare',
  'maximumAnimationScenes',
  'image.process.startState',
  'finanzneo-scene-header-v2',
]);
requireAll('scripts/verify-finance-prebuilt-reel.mjs', [
  'FinanzNeoSceneHeader',
  'Visual Quality V2',
  '55–65',
  '35–45',
]);
requireAll('scripts/lib/finance-reel-build-manifest.mjs', [
  'visualQualityV2Implemented',
  'expectedDistribution',
  'ETF process animation level or better',
]);
requireAll('scripts/new-finance-reel.mjs', [
  'visual-quality-profile.json',
  'distributionLabel',
  'processImageRule',
  'sharedSceneHeader',
]);
requireAll('scripts/test-finance-visual-quality-v2.mjs', [
  'Fünf Prozessbilder erwartet',
  'Vier Animationen erwartet',
  'Scene Header',
]);
requireAll('scripts/build-finance-reel.mjs', [
  'verify-finance-prebuilt-reel.mjs',
  'sync-finance-reel-to-voiceover.mjs',
  'remotion',
  'contactSheet',
]);
requireAll('scripts/check-finance-readiness.mjs', ['check-finance-content-package.mjs', "status.stage = 'ready'"]);
requireAll('scripts/render-finance-reel.mjs', ['check-finance-readiness.mjs', 'run-finance-render-qa.mjs', 'export-finance-deliverables.mjs']);

forbid('channels/finanzneo/src/reels/shared/FinanzNeoSceneHeader.tsx', [
  /color:\s*['"]#0{3,6}['"]/i,
  /background:\s*['"]#0{3,6}['"]/i,
]);
forbid('scripts/lib/create-finance-scene-plan-template.mjs', [
  /decorative person standing beside a finance object[^.]*allowed/i,
  /dashboard card[^.]*required/i,
]);
forbid('CLAUDE.md', [/^\s*git\s+(?:switch|checkout)\s+main\s*$/gim]);
forbid('channels/finanzneo/CLAUDE.md', [/^\s*git\s+(?:switch|checkout)\s+main\s*$/gim]);

const config = loadFinanceConfig();
const v2 = config.visuals?.visualQualityV2;
if (v2?.enabledForNewReels !== true) errors.push('Visual Quality V2 muss für neue Reels aktiviert sein.');
if (v2?.profile !== 'finanzneo-process-v2') errors.push('Visual-Quality-Profil muss finanzneo-process-v2 sein.');
if (v2?.targetImageShare !== 0.6) errors.push('Ziel-Bildanteil muss 0.6 sein.');
if (v2?.targetAnimationShare !== 0.4) errors.push('Ziel-Animationsanteil muss 0.4 sein.');
if (v2?.allowedImageShare?.min !== 0.55 || v2?.allowedImageShare?.max !== 0.65) errors.push('Bildanteil muss im Bereich 0.55–0.65 liegen.');
if (v2?.allowedAnimationShare?.min !== 0.35 || v2?.allowedAnimationShare?.max !== 0.45) errors.push('Animationsanteil muss im Bereich 0.35–0.45 liegen.');
if (v2?.maximumAnimationScenes !== 4) errors.push('Höchstens vier Animationsszenen müssen erlaubt sein.');
if (v2?.preferredSceneCount !== 9 || v2?.preferredImageScenes !== 5 || v2?.preferredAnimationScenes !== 4) {
  errors.push('Bevorzugte V2-Verteilung muss 9 Szenen = 5 Bilder + 4 Animationen sein.');
}
if (v2?.processImagesRequired !== true || v2?.instantReadabilitySeconds !== 1) {
  errors.push('Prozessbilder müssen Pflicht und innerhalb einer Sekunde verständlich sein.');
}
if (config.visuals?.sceneHeader?.futureProfile !== 'finanzneo-scene-header-v2') errors.push('Zukünftiges Headerprofil fehlt.');
if (config.visuals?.sceneHeader?.headlineMinPx !== 72 || config.visuals?.sceneHeader?.headlineDefaultPx !== 78) {
  errors.push('Header-Schriftgrößen müssen 72 px Minimum und 78 px Standard sein.');
}
if (config.visuals?.sceneHeader?.maximumLines !== 2) errors.push('Header darf höchstens zwei Zeilen verwenden.');
if (config.visuals?.sceneHeader?.lightTextRequired !== true) errors.push('Helle Header-Schrift muss Pflicht sein.');
if (config.visuals?.sceneHeader?.topGradientRequired !== true) errors.push('Oberer Kontrastverlauf muss Pflicht sein.');
if (config.visuals?.sceneHeader?.darkHeadlineOnDarkBackgroundForbidden !== true) errors.push('Dunkle Schrift auf dunklem Hintergrund muss verboten sein.');
if (config.voice?.speed !== 1.1) errors.push('Voiceover-Standardgeschwindigkeit muss 1,10× sein.');

const pkg = JSON.parse(requireFile('package.json') || '{}');
const scripts = pkg.scripts ?? {};
if (!String(scripts['finance:new'] ?? '').includes('safe-new-finance-week-reel.mjs')) errors.push('finance:new verwendet nicht den transaktionalen Wrapper.');
if (!String(scripts['finance:reel:build'] ?? '').includes('build-finance-reel.mjs')) errors.push('Allgemeiner finance:reel:build-Befehl fehlt.');
if (!String(scripts.test ?? '').includes('validate:finanzneo-system')) errors.push('npm test führt den FinanzNeo-Systemvalidator nicht aus.');
if (!String(scripts['finance:system-test'] ?? '').includes('finance:e2e')) errors.push('finance:system-test enthält keinen End-to-End-Test.');

if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log('✓ FinanzNeo-Systemarchitektur unterstützt Visual Quality V2 für alle zukünftigen Reels.');
console.log('✓ Standard: neun Szenen, fünf Prozessbilder, vier hochwertige Animationen.');
console.log('✓ Header: hell, groß, zweizeilig, mit passendem Icon und weichem Kontrastverlauf.');
console.log('✓ Bestehende Legacy-Pipeline bleibt für ältere Reels verfügbar.');
