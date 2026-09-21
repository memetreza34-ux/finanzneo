#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {ALL_PROMPTS, VISUAL_INDEX, WORLD_ID} from './lib/youtube-contract.mjs';
import {requiresYouTubeImage} from './lib/youtube-motion-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-youtube-visual-direction-v1.mjs <YouTube-Projekt>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-youtube-visual-direction-v1';
const root = resolve(target);
const indexPath = resolve(root, VISUAL_INDEX);
if (!existsSync(indexPath)) {
  console.error(`${VISUAL_INDEX} fehlt.`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.visualDirection;
if (!contract) {
  console.log('✓ YouTube-Projekt ohne Visual-Direction-V1 bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const nonPlaceholder = (value, min = 4) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);
const readMarker = (source, marker) => {
  const line = source.split(/\r?\n/).find((item) => item.startsWith(marker + ':'));
  return line ? line.slice(marker.length + 1).trim() : '';
};
const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8');

if (contract.id !== CONTRACT_ID) fail(`visualDirection.id muss ${CONTRACT_ID} sein.`);
if (contract.imageWorldPreserved !== WORLD_ID) fail(`visualDirection.imageWorldPreserved muss ${WORLD_ID} sein.`);
for (const key of [
  'appliesToNewProjectsOnly',
  'existingLiteralFirstMarkersPreserved',
  'groundedAnchorRequired',
  'cinematicStagingEncouraged',
  'storyActionRequired',
  'tensionOrConsequenceRequired',
  'visualHookRequired',
  'shotScaleRequired',
  'cameraAngleRequired',
  'depthPlanRequired',
  'emotionalBeatRequired',
  'causeEffectRequired',
  'patternInterruptDecisionRequired',
  'motionHintRequired',
  'noveltyCheckRequired',
  'abstractRiddleForbidden',
  'styleOverrideForbidden',
]) {
  if (contract[key] !== true) fail(`visualDirection.${key} muss true sein.`);
}
if (Number(contract.maxSameVisualModeInRow) !== 2) fail('visualDirection.maxSameVisualModeInRow muss 2 sein.');
if (Number(contract.maxSameShotScaleInRow) !== 2) fail('visualDirection.maxSameShotScaleInRow muss 2 sein.');

for (const relativePath of [
  ALL_PROMPTS,
  '04-visuals/bildwelt.txt',
  '04-visuals/thumbnail-prompt.txt',
  '06-projektdateien/visual-plan.md',
  '02-script/retention-plan.md',
]) {
  if (!existsSync(resolve(root, relativePath))) {
    fail(`${relativePath} fehlt.`);
    continue;
  }
  const source = read(relativePath);
  if (!source.includes(`YOUTUBE_VISUAL_DIRECTION: ${CONTRACT_ID}`)) fail(`${relativePath} enthält den Visual-Direction-Marker nicht.`);
  if (!source.includes(`IMAGE_WORLD_PRESERVED: ${WORLD_ID}`)) fail(`${relativePath} bestätigt die bestehende Bildwelt nicht.`);
}

const allowedModes = new Set(['cinematic-literal', 'cause-effect', 'comparison', 'scale', 'object-story', 'pov', 'grounded-metaphor']);
const allowedShotScales = new Set(['extreme-wide', 'wide', 'medium', 'close-up', 'extreme-close-up', 'macro']);
const allowedAngles = new Set(['eye-level', 'low-angle', 'high-angle', 'top-down', 'over-shoulder', 'pov', 'dutch-subtle']);
const plannedImages = [];

for (const visual of Array.isArray(index.visuals) ? index.visuals : []) {
  if (!requiresYouTubeImage(visual)) continue;
  const imagePlan = visual.type === 'hybrid' ? visual.imagePlanFile : visual.planFile;
  if (typeof imagePlan !== 'string' || !existsSync(resolve(root, imagePlan))) {
    fail(`${visual.id ?? 'Visual'}: Bildprompt fehlt.`);
    continue;
  }
  const source = read(imagePlan);
  if (!source.includes(`YOUTUBE_VISUAL_DIRECTION: ${CONTRACT_ID}`)) fail(`${visual.id}: Visual-Direction-Marker fehlt im Bildprompt.`);

  const values = {
    strategy: readMarker(source, 'VISUAL_STRATEGY'),
    visualMode: readMarker(source, 'VISUAL_MODE'),
    visualPurpose: readMarker(source, 'VISUAL_PURPOSE'),
    storyAction: readMarker(source, 'STORY_ACTION'),
    tensionOrConsequence: readMarker(source, 'TENSION_OR_CONSEQUENCE'),
    visualHook: readMarker(source, 'VISUAL_HOOK'),
    shotScale: readMarker(source, 'SHOT_SCALE'),
    cameraAngle: readMarker(source, 'CAMERA_ANGLE'),
    depthPlan: readMarker(source, 'DEPTH_PLAN'),
    emotionalBeat: readMarker(source, 'EMOTIONAL_BEAT'),
    causeEffect: readMarker(source, 'CAUSE_EFFECT'),
    patternInterrupt: readMarker(source, 'PATTERN_INTERRUPT'),
    motionHint: readMarker(source, 'MOTION_HINT'),
    noveltyCheck: readMarker(source, 'NOVELTY_CHECK'),
    metaphorJustification: readMarker(source, 'METAPHOR_JUSTIFICATION'),
  };

  if (!allowedModes.has(values.visualMode)) fail(`${visual.id}: VISUAL_MODE ist nicht erlaubt oder noch Platzhalter.`);
  if (!allowedShotScales.has(values.shotScale)) fail(`${visual.id}: SHOT_SCALE ist nicht erlaubt oder noch Platzhalter.`);
  if (!allowedAngles.has(values.cameraAngle)) fail(`${visual.id}: CAMERA_ANGLE ist nicht erlaubt oder noch Platzhalter.`);
  for (const [key, minimum] of [
    ['visualPurpose', 8],
    ['storyAction', 12],
    ['tensionOrConsequence', 12],
    ['visualHook', 12],
    ['depthPlan', 12],
    ['emotionalBeat', 8],
    ['causeEffect', 12],
    ['patternInterrupt', 4],
    ['motionHint', 4],
  ]) {
    if (!nonPlaceholder(values[key], minimum)) fail(`${visual.id}: ${key} fehlt/ist Platzhalter.`);
  }
  if (!nonPlaceholder(values.noveltyCheck, 20) || !/^PASS\b/i.test(values.noveltyCheck)) {
    fail(`${visual.id}: NOVELTY_CHECK muss mit PASS beginnen und konkrete Abwechslung benennen.`);
  }
  if (values.visualMode === 'grounded-metaphor') {
    if (values.strategy !== 'metaphor') fail(`${visual.id}: grounded-metaphor verlangt VISUAL_STRATEGY=metaphor.`);
    if (!nonPlaceholder(values.metaphorJustification, 20) || /^none$/i.test(values.metaphorJustification)) fail(`${visual.id}: grounded-metaphor braucht eine konkrete METAPHOR_JUSTIFICATION.`);
  } else {
    if (values.strategy !== 'literal') fail(`${visual.id}: nicht-metaphorische Modi verlangen VISUAL_STRATEGY=literal.`);
    if (values.metaphorJustification.toLowerCase() !== 'none') fail(`${visual.id}: ohne grounded-metaphor muss METAPHOR_JUSTIFICATION none sein.`);
  }
  plannedImages.push({id: visual.id, ...values});
}

const checkRun = (key, max, label) => {
  let previous = null;
  let run = 0;
  for (const item of plannedImages) {
    const value = item[key];
    if (value === previous) run += 1;
    else { previous = value; run = 1; }
    if (value && run > max) fail(`${item.id}: ${label} '${value}' wird mehr als ${max} Mal direkt hintereinander verwendet.`);
  }
};
checkRun('visualMode', 2, 'VISUAL_MODE');
checkRun('shotScale', 2, 'SHOT_SCALE');

if (errors.length) {
  console.error('\nYouTube Visual Direction V1 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ YouTube Visual Direction erfüllt: ${CONTRACT_ID}`);
console.log(`✓ Bildwelt ${WORLD_ID} bleibt erhalten; geprüft werden nur Regie, Hook, Handlung, Kamera und Vielfalt.`);
