#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-image-storytelling-v5.mjs <Reel-Pfad>');
  process.exit(1);
}

const V5 = 'finanzneo-image-storytelling-v5';
const SEQUENCE_ID = 'finanzneo-visual-sequence-plan-v1';
const IMAGE_WORLD_LOCK = 'finanzneo-stylized-3d-animated-black-v9';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const c = index.imageStorytellingContract;
if (!c || c.id !== V5) {
  console.log('✓ Kein Image-Storytelling-V5-Reel; bestehende Version bleibt rückwärtskompatibel.');
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

if (c.appliesToNewReelsOnly !== true) fail('imageStorytellingContract.appliesToNewReelsOnly muss true sein.');
if (c.legacyV3V4Compatible !== true) fail('imageStorytellingContract.legacyV3V4Compatible muss true sein.');
if (c.imageWorldLockPreserved !== IMAGE_WORLD_LOCK) fail(`imageStorytellingContract.imageWorldLockPreserved muss ${IMAGE_WORLD_LOCK} sein.`);
for (const key of [
  'sequencePlanningRequiredBeforePrompts',
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
  'energyArcRequired',
  'archetypeRotationRequired',
  'locationRotationRequired',
  'compositionRotationRequired',
  'humanPresenceRotationRequired',
  'mainSubjectRotationRequired',
  'firstTwoNeedHighEnergyScene',
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
for (const [key, expected] of [
  ['maxSameVisualModeInRow', 2],
  ['maxSameShotScaleInRow', 2],
  ['maxSameCameraAngleInRow', 2],
  ['maxSameLocationFamilyInRow', 2],
  ['maxSameMainSubjectFamilyInRow', 2],
  ['maxSameCompositionFamilyInRow', 1],
  ['maxSameArchetypeInRow', 1],
  ['maxTableDocumentScenesPerSixImages', 2],
  ['maxImagesWithoutPatternInterrupt', 2],
]) {
  if (Number(c[key]) !== expected) fail(`imageStorytellingContract.${key} muss ${expected} sein.`);
}

const sequence = index.visualSequencePlan;
if (!sequence || sequence.id !== SEQUENCE_ID) fail(`visualSequencePlan.id muss ${SEQUENCE_ID} sein.`);
if (sequence?.contractId !== V5) fail(`visualSequencePlan.contractId muss ${V5} sein.`);
if (sequence?.status !== 'PLAN_BEFORE_PROMPTS') fail('visualSequencePlan.status muss PLAN_BEFORE_PROMPTS sein.');
for (const key of [
  'planWholeSequenceBeforeIndividualPrompts',
  'storyArcRequired',
  'cameraDirectionOverridesGenericStyleFraming',
  'locationMustServeVoiceBeat',
  'noveltyMustBeSequenceRelative',
]) {
  if (sequence?.rules?.[key] !== true) fail(`visualSequencePlan.rules.${key} muss true sein.`);
}

const globalPaths = [
  '03-szenen/alle-bildprompts.txt',
  '03-szenen/bildwelt.txt',
  '03-szenen/00-cover/cover.txt',
  '05-projektdateien/szenenplan.md',
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
  '05-projektdateien/VISUAL-SEQUENCE-PLAN.md',
];
for (const relative of globalPaths) {
  const path = resolve(root, relative);
  if (!existsSync(path)) {
    fail(relative + ' fehlt.');
    continue;
  }
  const source = readFileSync(path, 'utf8');
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${V5}`)) fail(relative + ' enthält den V5-Marker nicht.');
  if (!source.includes(`IMAGE_WORLD_LOCK_PRESERVED: ${IMAGE_WORLD_LOCK}`)) fail(relative + ' bestätigt den unveränderten V9-World-Lock nicht.');
  if (!source.includes(`VISUAL_SEQUENCE_PLAN: ${SEQUENCE_ID}`)) fail(relative + ' enthält den Sequence-Plan-Marker nicht.');
}

const allowedModes = new Set(['cinematic-literal', 'cause-effect', 'comparison', 'scale', 'object-story', 'pov', 'grounded-metaphor']);
const allowedRoles = new Set(['hook', 'detail', 'escalation', 'contrast', 'reveal', 'bridge', 'payoff']);
const allowedArchetypes = new Set(['character-action', 'pov', 'macro-object', 'environment', 'comparison', 'scale-reveal', 'cause-effect', 'before-after', 'object-story', 'grounded-metaphor']);
const allowedHuman = new Set(['none', 'hands-only', 'single-person', 'multi-person']);
const allowedComposition = new Set(['face-led', 'object-led', 'environment-led', 'comparison', 'process', 'scale-reveal', 'before-after']);
const allowedShotScales = new Set(['extreme-wide', 'wide', 'medium', 'close-up', 'extreme-close-up', 'macro']);
const allowedAngles = new Set(['eye-level', 'low-angle', 'high-angle', 'top-down', 'over-shoulder', 'pov', 'dutch-subtle']);

const fields = [
  ['VISUAL_STRATEGY', 'strategy'],
  ['VISUAL_MODE', 'visualMode'],
  ['SEQUENCE_ROLE', 'sequenceRole'],
  ['ENERGY_LEVEL', 'energyLevel'],
  ['VISUAL_ARCHETYPE', 'visualArchetype'],
  ['LOCATION_FAMILY', 'locationFamily'],
  ['HUMAN_PRESENCE', 'humanPresence'],
  ['COMPOSITION_FAMILY', 'compositionFamily'],
  ['MAIN_SUBJECT_FAMILY', 'mainSubjectFamily'],
  ['TABLE_DOCUMENT_SCENE', 'tableDocumentScene'],
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
const plannedOrder = Array.isArray(sequence?.imageSceneOrder) ? sequence.imageSceneOrder : [];
if (plannedOrder.length !== imageScenes.length || plannedOrder.some((id, i) => id !== imageScenes[i]?.id)) {
  fail('visualSequencePlan.imageSceneOrder muss exakt der Reihenfolge aller IMAGE-Szenen entsprechen.');
}

for (const scene of imageScenes) {
  const prefix = scene.id ?? 'Bildszene';
  const meta = scene.imageStorytelling;
  if (!meta || typeof meta !== 'object') {
    fail(prefix + ': imageStorytelling-Metadaten fehlen.');
    continue;
  }

  if (!allowedModes.has(meta.visualMode)) fail(prefix + ': visualMode ist nicht erlaubt.');
  if (!allowedRoles.has(meta.sequenceRole)) fail(prefix + ': sequenceRole ist nicht erlaubt.');
  if (!allowedArchetypes.has(meta.visualArchetype)) fail(prefix + ': visualArchetype ist nicht erlaubt.');
  if (!allowedHuman.has(meta.humanPresence)) fail(prefix + ': humanPresence ist nicht erlaubt.');
  if (!allowedComposition.has(meta.compositionFamily)) fail(prefix + ': compositionFamily ist nicht erlaubt.');
  if (!allowedShotScales.has(meta.shotScale)) fail(prefix + ': shotScale ist nicht erlaubt.');
  if (!allowedAngles.has(meta.cameraAngle)) fail(prefix + ': cameraAngle ist nicht erlaubt.');
  if (!Number.isInteger(Number(meta.energyLevel)) || Number(meta.energyLevel) < 1 || Number(meta.energyLevel) > 5) fail(prefix + ': energyLevel muss 1–5 sein.');
  if (typeof meta.tableDocumentScene !== 'boolean') fail(prefix + ': tableDocumentScene muss boolean sein.');
  if (!nonPlaceholder(meta.locationFamily, 3)) fail(prefix + ': locationFamily fehlt/ist Platzhalter.');
  if (!nonPlaceholder(meta.mainSubjectFamily, 3)) fail(prefix + ': mainSubjectFamily fehlt/ist Platzhalter.');

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
    fail(prefix + ': noveltyCheck muss mit PASS beginnen und sequenzrelative Abwechslung benennen.');
  }

  if (meta.visualMode === 'grounded-metaphor' || meta.visualArchetype === 'grounded-metaphor') {
    if (meta.strategy !== 'metaphor') fail(prefix + ': grounded-metaphor verlangt strategy=metaphor.');
    if (!nonPlaceholder(meta.metaphorJustification, 20) || /^none$/i.test(String(meta.metaphorJustification).trim())) {
      fail(prefix + ': grounded-metaphor braucht eine konkrete metaphorJustification.');
    }
  } else {
    if (meta.strategy !== 'literal') fail(prefix + ': nicht-metaphorische V5-Modi verlangen strategy=literal.');
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
  if (!source.includes(`IMAGE_STORYTELLING_CONTRACT: ${V5}`)) fail(prefix + ': Bildprompt enthält den V5-Marker nicht.');
  if (!source.includes(`IMAGE_WORLD_LOCK_PRESERVED: ${IMAGE_WORLD_LOCK}`)) fail(prefix + ': Bildprompt bestätigt den V9-World-Lock nicht.');
  if (!source.includes(`VISUAL_SEQUENCE_PLAN: ${SEQUENCE_ID}`)) fail(prefix + ': Bildprompt enthält den Sequence-Plan-Marker nicht.');

  for (const [marker, key] of fields) {
    const promptValue = readMarker(source, marker);
    const expected = String(meta[key]);
    if (promptValue !== expected) fail(`${prefix}: Prompt und scene-index widersprechen sich bei ${key}.`);
  }
}

const checkMaxRun = (key, max, label) => {
  let previous = null;
  let run = 0;
  for (const scene of imageScenes) {
    const value = scene.imageStorytelling?.[key];
    if (value === undefined || value === null || value === '') continue;
    if (value === previous) run += 1;
    else { previous = value; run = 1; }
    if (run > max) fail(`${scene.id ?? 'Bildszene'}: ${label} ${value} wird mehr als ${max} Mal direkt hintereinander verwendet.`);
  }
};

checkMaxRun('visualMode', 2, 'VISUAL_MODE');
checkMaxRun('shotScale', 2, 'SHOT_SCALE');
checkMaxRun('cameraAngle', 2, 'CAMERA_ANGLE');
checkMaxRun('locationFamily', 2, 'LOCATION_FAMILY');
checkMaxRun('mainSubjectFamily', 2, 'MAIN_SUBJECT_FAMILY');
checkMaxRun('compositionFamily', 1, 'COMPOSITION_FAMILY');
checkMaxRun('visualArchetype', 1, 'VISUAL_ARCHETYPE');

if (imageScenes.length >= 1) {
  const firstTwo = imageScenes.slice(0, 2);
  if (!firstTwo.some((scene) => Number(scene.imageStorytelling?.energyLevel) >= 4)) {
    fail('Unter den ersten zwei IMAGE-Szenen muss mindestens eine ENERGY_LEVEL >= 4 haben.');
  }
}

let noInterruptRun = 0;
for (const scene of imageScenes) {
  const value = String(scene.imageStorytelling?.patternInterrupt ?? '').trim();
  if (/^none$/i.test(value)) noInterruptRun += 1;
  else noInterruptRun = 0;
  if (noInterruptRun > 2) fail(`${scene.id ?? 'Bildszene'}: mehr als zwei IMAGE-Szenen ohne Pattern Interrupt hintereinander.`);
}

for (let start = 0; start < imageScenes.length; start += 1) {
  const window = imageScenes.slice(start, start + 6);
  if (window.length < 3) continue;
  const count = window.filter((scene) => scene.imageStorytelling?.tableDocumentScene === true).length;
  if (count > 2) fail(`IMAGE-Fenster ab ${window[0]?.id ?? start}: mehr als 2 Table/Document-Szenen in bis zu 6 Bildern.`);
}

if (errors.length) {
  console.error('\nFuture-Image-Storytelling-V5 verletzt:\n');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('\n✓ Future-Image-Storytelling erfüllt: ' + V5);
console.log('✓ FinanzNeo V9 bleibt gesperrt; V5 verändert nur Sequenzregie, Bildidee, Handlung und Kamera.');
console.log('✓ Sequence-first: Bildfolge, Energy Arc, Archetypen, Locations und Pattern Interrupts sind vor Einzelprompts geplant.');
console.log('✓ Anti-Wiederholung: Composition/Archetype direkt verschieden; Location/Kamera/Main Subject max. zwei in Folge.');
console.log('✓ Table+Document-Muster ist auf max. zwei pro 6 IMAGE-Szenen begrenzt.');
