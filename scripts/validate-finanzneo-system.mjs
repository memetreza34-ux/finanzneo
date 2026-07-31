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
  for (const pattern of patterns) if (pattern.test(content)) errors.push(`${relative} enthält widersprüchliche Altlogik: ${pattern}`);
};

if (exists('channels/finanzneo/engine/scene-plan.template.json')) errors.push('Alte scene-plan.template.json darf nicht existieren.');

requireAll('channels/finanzneo/CLAUDE.md', [
  'image-first-lite',
  '8–10 eigenständige Bilder',
  'langsamer Zoom bis höchstens 1,035',
  'Bildfahrt bis höchstens 12 Pixel',
]);
requireAll('channels/finanzneo/skills/reel-planen.md', [
  'image-first-lite',
  '8–10 eigenständige Bilder',
  'transition: "cut"',
]);
requireAll('scripts/lib/create-finance-scene-plan-template.mjs', ['singlePhase', "transition: 'cut'", 'Ein starkes Bild']);
requireAll('scripts/lib/create-finance-test-plan.mjs', ['createFinanceScenePlanTemplate', 'home-office desk', 'kitchen table', 'ScenePlan.parse(plan)']);
requireAll('channels/finanzneo/src/engine/FinanceImageFirstReel.tsx', ['resolveImages', 'motion.imageScaleStart', 'motion.imageScaleEnd', 'motion.imagePanPixels', 'translate3d', 'Voiceover', 'PremiumGrade']);
requireAll('channels/finanzneo/src/engine/FinanceProductionLayer.tsx', ['FinanceImageFirstReel', 'FinanceSceneHeader', 'ctaKeyword', 'Captions']);
requireAll('channels/finanzneo/src/engine/FinanceSceneHeader.tsx', ['headline?: string', 'useCurrentFrame', 'headerFadeFrames', 'headerTranslatePixels', 'textShadow']);
requireAll('scripts/run-finance-creative-qa.mjs', ['PRODUCTION_MODE_INVALID', 'LITE_TRANSITION_NOT_CUT', 'LITE_MULTIPLE_PHASES', 'LITE_SFX_DISABLED', 'image-first-lite']);
requireAll('scripts/check-finance-content-package.mjs', ['run-finance-creative-qa.mjs', 'COMPLEX_TRANSITION_DISABLED', 'MULTIPLE_PHASES_DISABLED', "productionMode = 'image-first-lite'"]);
requireAll('scripts/check-finance-readiness.mjs', ['check-finance-content-package.mjs', "status.stage = 'ready'"]);
requireAll('scripts/render-finance-reel.mjs', ['check-finance-readiness.mjs', 'run-finance-render-qa.mjs', 'export-finance-deliverables.mjs']);
requireAll('scripts/test-finance-e2e.mjs', ['check-finance-content-package.mjs', 'check-finance-readiness.mjs', 'FinanzNeo-End-to-End-Test bestanden']);

forbid('channels/finanzneo/src/engine/FinanceProductionLayer.tsx', [/\bSfx\b/, /FinanceInfoRail/, /soundLayers/, /infoLayers/]);
forbid('channels/finanzneo/src/engine/FinanceSceneHeader.tsx', [/\bspring\(/]);
forbid('scripts/check-finance-content-package.mjs', [/buildMotionRouting/, /motion-routing\.json/, /MOTION_ROUTING/]);
forbid('scripts/lib/create-finance-scene-plan-template.mjs', [/transition:\s*'push'/, /transition:\s*'wipe'/, /transition:\s*'zoom-through'/, /transition:\s*'match-move'/]);
forbid('channels/finanzneo/CLAUDE.md', [/keine sichtbare standfläche/i, /kein tisch/i, /no visible support surface/i]);
forbid('scripts/lib/create-finance-scene-plan-template.mjs', [/no visible support surface/i, /no table/i, /no floor/i]);
forbid('scripts/lib/create-finance-test-plan.mjs', [/no visible support surface/i, /no table/i, /no floor/i]);
forbid('CLAUDE.md', [/^\s*git\s+(?:switch|checkout)\s+main\s*$/gim]);
forbid('channels/finanzneo/CLAUDE.md', [/^\s*git\s+(?:switch|checkout)\s+main\s*$/gim]);

const config = loadFinanceConfig();
if (config.visuals?.productionMode !== 'image-first-lite') errors.push('Produktionsmodus muss image-first-lite sein.');
if (config.visuals?.minimumImageLedScenes !== 8) errors.push('Mindestens acht eigenständige Bilder müssen geplant werden.');
if (config.visuals?.targetImageLedScenes?.max !== 10) errors.push('Höchstens zehn eigenständige Bilder müssen vorgesehen sein.');
if (config.visuals?.minimumPhasesFromSeconds !== 999) errors.push('Mehrstufige Phasenpflicht muss deaktiviert sein.');
if (config.visuals?.minimalMotion?.transition !== 'cut') errors.push('Minimaler Produktionsmodus muss harte Schnitte verwenden.');
if (config.visuals?.minimalMotion?.imageScaleEnd !== 1.035) errors.push('Sanfter Bildzoom muss bei maximal 1,035 enden.');
if (config.visuals?.minimalMotion?.imagePanPixels !== 12) errors.push('Minimale Bildfahrt muss auf zwölf Pixel begrenzt sein.');
if (config.visuals?.minimalMotion?.headerAnimated !== true) errors.push('Kurze Header-Einblendung muss aktiviert sein.');
if (config.visuals?.minimalMotion?.headerFadeFrames !== 8) errors.push('Header-Einblendung muss acht Frames dauern.');
if (config.visuals?.minimalMotion?.sfxEnabled !== false) errors.push('SFX müssen im Bildmodus deaktiviert sein.');
if (config.sound?.recommendedCuesPerReel?.max !== 0) errors.push('SFX-Empfehlung muss null sein.');

const pkg = JSON.parse(requireFile('package.json') || '{}');
const scripts = pkg.scripts ?? {};
if (!String(scripts['finance:new'] ?? '').includes('safe-new-finance-week-reel.mjs')) errors.push('finance:new verwendet nicht den transaktionalen Wrapper.');
if (!String(scripts['finance:content-ready'] ?? '').includes('check-finance-content-package.mjs')) errors.push('finance:content-ready verwendet nicht das kanonische Inhalts-Gate.');
if (String(scripts.test ?? '').includes('validate:motion-router')) errors.push('Motion Router darf nicht mehr Teil der verpflichtenden Tests sein.');
if (!String(scripts.test ?? '').includes('validate:finanzneo-system')) errors.push('npm test führt den FinanzNeo-Systemvalidator nicht aus.');
if (!String(scripts['finance:system-test'] ?? '').includes('finance:e2e')) errors.push('finance:system-test enthält keinen End-to-End-Test.');

if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log('✓ FinanzNeo-Systemarchitektur arbeitet im image-first-lite-Modus.');
console.log('✓ Remotion nutzt nur harte Schnitte, sanften Zoom, minimale Bildfahrt und kurze Header-Einblendungen.');
console.log('ℹ Bildstil-System (v6) wurde entfernt und muss neu definiert werden.');
