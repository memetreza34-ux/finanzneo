#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-image-storytelling-v4.mjs <Reel-Pfad>');
  process.exit(1);
}

const V4 = 'finanzneo-image-storytelling-v4';
const IMAGE_WORLD_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const c = index.imageStorytellingContract;
if (!c || c.id !== V4) {
  console.log('✓ Kein Image-Storytelling-V4-Reel; bestehende Version bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const nonPlaceholder = (value, min = 8) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);
const readMarker = (source, marker) => {
  const line = source.split(/\r?\n/).find((item) => item.startsWith(marker + ':'));
  return line ? line.slice(marker.length + 1).trim() : '';
};

if (c.appliesToNewReelsOnly !== true) fail('imageStorytellingContract.appliesToNewReelsOnly muss true sein.');
if (c.legacyV3Compatible !== true) fail('imageStorytellingContract.legacyV3Compatible muss true sein.');
if (c.imageWorldLockPreserved !== IMAGE_WORLD_LOCK) fail(`imageStorytellingContract.imageWorldLockPreserved muss ${IMAGE_WORLD_LOCK} sein.`);
for (const key of [
  'groundedAnchorRequired',
  'recognizableFinanceContextRequired',
  'exactVoiceBeatVisualMatchRequired',
  'transferabilityTestRequired',
  'creativeDirectionRequired',
  'visualPurposeRequired',
  'storyActionRequired',
  'conflictOrConsequenceRequired',
  'visualHookUnderOneSecondRequired',
  'shotScaleRequired',
  'cameraAngleRequired',
  'depthPlanRequired',
  'emotionalBeatRequired',
  'causeEffectRequired',
  'patternInterruptDecisionRequired',
  'motionHintRequired',
  'noveltyCheckRequired',
  'visualDiversityAcrossSequenceRequired',
  'groundedMetaphorAllowed',
  'groundedMetaphorNeedsExplicitJustification',
  'abstractRiddleForbidden',
  'genericFinanceIconAsMainStoryForbidden',
  'staticCatalogCompositionForbidden',
  'worldStyleOverrideForbidden',
  'photorealismForbidden',
  'labelsSupplementalOnly',
]) {
  if (c[key] !== true) fail(`imageStorytellingContract.${key} muss true sein.`);
}
if (Number(c.maxSameVisualModeInRow) !== 2) fail('maxSameVisualModeInRow muss 2 sein.');
if (Number(c.maxSameShotScaleInRow) !== 2) fail('maxSameShotScaleInRow muss 2 sein.');

const globalPaths = [
  '03-szenen/alle-bildprompts.txt',
  '03-szenen/bildwelt.txt',
  '03-szenen/00-cover/cover.txt',
  '05-projektdateien/szenenplan.md',
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
];
for (const relative of globalPaths) {
  const path = resolve(root, relative);
  if (!existsSync(path)) {
    fail(relative + ' fehlt.');
    continue;
  }
  const source = readFileSync(path, 'utf8');
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${V4}`)) fail(relative + ' enthält den V4-Marker nicht.');
  if (!source.includes(`IMAGE_WORLD_LOCK_PRESERVED: ${IMAGE_WORLD_LOCK}`)) fail(relative + ' bestätigt den unveränderten V9-World-Lock nicht.');
  if (!source.includes('Grounded first, not literal-only')) fail(relative + ' enthält die Grounded-first-Regie nicht.');
  if (!source.includes('VARIETY-RULE')) fail(relative + ' enthält die Visual-Diversity-Regel nicht.');
}

const allowedModes = new Set(['cinematic-literal', 'cause-effect', 'comparison', 'scale', 'object-story', 'pov', 'grounded-metaphor']);
const allowedShotScales = new Set(['extreme-wide', 'wide', 'medium', 'close-up', 'extreme-close-up', 'macro']);
const allowedAngles = new Set(['eye-level', 'low-angle', 'high-angle', 'top-down', 'over-shoulder', 'pov', 'dutch-subtle']);
const fields = [
  ['VISUAL_STRATEGY', 'strategy'],
  ['VISUAL_MODE', 'visualMode'],
  ['LITERAL_REAL_WORLD_SITUATION', 'literalSituation'],
  ['REAL_WORLD_CONTEXT_ANCHOR', 'contextAnchor'],
  ['VOICEOVER_VISUAL_MATCH', 'voiceVisualMatch'],
  ['TRANSFERABILITY_TEST', 'transferabilityTest'],
  ['VISUAL_PURPOSE', 'visualPurpose'],
  ['STORY_ACTION', 'storyAction'],
  ['TENSION_OR_CONSEQUENCE', 'tensionOrConsequence'],
  ['VISUAL_HOOK', 'visualHook'],
  ['SHOT_SCALE', 'shotScale'],
  ['CAMERA_ANGLE', 'cameraAngle'],
  ['DEPTH_PLAN', 'depthPlan'],
  ['EMOTIONAL_BEAT', 'emotionalBeat'],
  ['CAUSE_EFFECT', 'causeEffect'],
  ['PATTERN_INTERRUPT', 'patternInterrupt'],
  ['MOTION_HINT', 'motionHint'],
  ['NOVELTY_CHECK', 'noveltyCheck'],
  ['METAPHOR_JUSTIFICATION', 'metaphorJustification'],
];

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
for (const scene of imageScenes) {
  const prefix = scene.id ?? 'Bildszene';
  const meta = scene.imageStorytelling;
  if (!meta || typeof meta !== 'object') {
    fail(prefix + ': imageStorytelling-Metadaten fehlen.');
    continue;
  }

  if (!allowedModes.has(meta.visualMode)) fail(prefix + ': visualMode ist nicht erlaubt.');
  if (!allowedShotScales.has(meta.shotScale)) fail(prefix + ': shotScale ist nicht erlaubt.');
  if (!allowedAngles.has(meta.cameraAngle)) fail(prefix + ': cameraAngle ist nicht erlaubt.');
  for (const [key, min] of [
    ['literalSituation', 18],
    ['contextAnchor', 12],
    ['voiceVisualMatch', 18],
    ['visualPurpose', 8],
    ['storyAction', 14],
    ['tensionOrConsequence', 12],
    ['visualHook', 12],
    ['depthPlan', 12],
    ['emotionalBeat', 8],
    ['causeEffect', 12],
    ['patternInterrupt', 4],
    ['motionHint', 4],
  ]) {
    if (!nonPlaceholder(meta[key], min)) fail(`${prefix}: ${key} fehlt/ist Platzhalter.`);
  }
  if (!nonPlaceholder(meta.transferabilityTest, 20) || !/^PASS\b/i.test(meta.transferabilityTest.trim())) {
    fail(prefix + ': transferabilityTest muss mit PASS beginnen und konkret sein.');
  }
  if (!nonPlaceholder(meta.noveltyCheck, 20) || !/^PASS\b/i.test(meta.noveltyCheck.trim())) {
    fail(prefix + ': noveltyCheck muss mit PASS beginnen und konkrete Abwechslung benennen.');
  }

  if (meta.visualMode === 'grounded-metaphor') {
    if (meta.strategy !== 'metaphor') fail(prefix + ': grounded-metaphor verlangt strategy=metaphor.');
    if (!nonPlaceholder(meta.metaphorJustification, 20) || /^none$/i.test(String(meta.metaphorJustification).trim())) {
      fail(prefix + ': grounded-metaphor braucht eine konkrete metaphorJustification.');
    }
  } else {
    if (meta.strategy !== 'literal') fail(prefix + ': nicht-metaphorische V4-Modi verlangen strategy=literal.');
    if (String(meta.metaphorJustification).trim().toLowerCase() !== 'none') fail(prefix + ': ohne grounded-metaphor muss metaphorJustification exakt none sein.');
  }

  if (typeof scene.planFile !== 'string') {
    fail(prefix + ': planFile fehlt.');
    continue;
  }
  const promptPath = resolve(root, '03-szenen', scene.planFile);
  if (!existsSync(promptPath)) {
    fail(prefix + ': Bildprompt fehlt: ' + scene.planFile);
    continue;
  }
  const source = readFileSync(promptPath, 'utf8');
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${V4}`)) fail(prefix + ': Bildprompt enthält den V4-Marker nicht.');
  if (!source.includes(`IMAGE_WORLD_LOCK_PRESERVED: ${IMAGE_WORLD_LOCK}`)) fail(prefix + ': Bildprompt bestätigt den V9-World-Lock nicht.');

  for (const [marker, key] of fields) {
    const promptValue = readMarker(source, marker);
    if (promptValue !== String(meta[key])) fail(`${prefix}: Prompt und scene-index widersprechen sich bei ${key}.`);
  }
}

const checkMaxRun = (key, max, label) => {
  let previous = null;
  let run = 0;
  for (const scene of imageScenes) {
    const value = scene.imageStorytelling?.[key];
    if (!value) continue;
    if (value === previous) run += 1;
    else { previous = value; run = 1; }
    if (run > max) fail(`${scene.id ?? 'Bildszene'}: ${label} ${value} wird mehr als ${max} Mal direkt hintereinander verwendet.`);
  }
};
checkMaxRun('visualMode', 2, 'VISUAL_MODE');
checkMaxRun('shotScale', 2, 'SHOT_SCALE');

if (errors.length) {
  console.error('\nFuture-Image-Storytelling-V4 verletzt:\n');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('\n✓ Future-Image-Storytelling erfüllt: ' + V4);
console.log('✓ FinanzNeo V9 bleibt gesperrt; V4 verändert nur Regie, Handlung, Kamera und visuelle Vielfalt.');
console.log('✓ Grounded first · konkrete Finanzsituation bleibt sofort lesbar · keine abstrakten Rätsel.');
console.log('✓ Visual-Mode- und Shot-Scale-Wiederholungen sind auf maximal zwei direkte Wiederholungen begrenzt.');
