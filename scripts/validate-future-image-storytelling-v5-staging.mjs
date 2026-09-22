#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {V5_CONTRACT_ID, V5_HARDENING_ID, V5_COMPILED_START, buildCompiledDirection} from './lib/image-storytelling-v5-hardening.mjs';
import {
  V5_STAGING_ID,
  FRAME_OCCUPANCY_CLASSES,
  STAGING_MODES,
  CAUSE_EFFECT_STRENGTHS,
  HUMAN_REACTIONS,
  SPATIAL_PRESSURES,
  IMPACT_COMPOSITIONS,
  isHumanPresent,
} from './lib/image-storytelling-v5-staging.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-image-storytelling-v5-staging.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.imageStorytellingContract;
if (contract?.id !== V5_CONTRACT_ID || contract?.hardeningId !== V5_HARDENING_ID) {
  console.log('✓ Kein gehärtetes V5-Reel; V5.1-Staging-Validator übersprungen.');
  process.exit(0);
}
if (!contract?.stagingId) {
  console.log('✓ Legacy-V5-Hardening ohne V5.1-Staging; rückwärtskompatibel übersprungen.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const validText = (value, min = 3) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);

if (contract.stagingId !== V5_STAGING_ID) fail(`imageStorytellingContract.stagingId muss ${V5_STAGING_ID} sein.`);
for (const key of [
  'dynamicStagingRequired', 'frameOccupancyRequired', 'explicitCauseEffectQuotaRequired', 'humanReactionRequired',
  'spatialPressureRequired', 'impactCompositionQuotaRequired', 'catalogArrangementForbidden',
]) {
  if (contract[key] !== true) fail(`imageStorytellingContract.${key} muss true sein.`);
}
for (const [key, expected] of [
  ['minExplicitCauseEffectPerSixImages', 3],
  ['maxImagesWithoutImpactComposition', 3],
  ['minDistinctStagingModesPerSixImages', 3],
]) {
  if (Number(contract[key]) !== expected) fail(`imageStorytellingContract.${key} muss ${expected} sein.`);
}

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
const impact = (scene) => String(scene.imageStorytelling?.impactComposition ?? '') !== 'none';
const explicit = (scene) => String(scene.imageStorytelling?.causeEffectStrength ?? '') === 'explicit';

for (let i = 0; i < imageScenes.length; i += 1) {
  const scene = imageScenes[i];
  const id = scene.id ?? `IMAGE-${i + 1}`;
  const meta = scene.imageStorytelling ?? {};

  if (!FRAME_OCCUPANCY_CLASSES.has(String(meta.frameOccupancyClass))) fail(`${id}: frameOccupancyClass ist ungültig/noch nicht geplant.`);
  if (!STAGING_MODES.has(String(meta.stagingMode))) fail(`${id}: stagingMode ist ungültig/noch nicht geplant.`);
  if (!CAUSE_EFFECT_STRENGTHS.has(String(meta.causeEffectStrength))) fail(`${id}: causeEffectStrength ist ungültig/noch nicht geplant.`);
  if (!HUMAN_REACTIONS.has(String(meta.humanReaction))) fail(`${id}: humanReaction ist ungültig/noch nicht geplant.`);
  if (!SPATIAL_PRESSURES.has(String(meta.spatialPressure))) fail(`${id}: spatialPressure ist ungültig/noch nicht geplant.`);
  if (!IMPACT_COMPOSITIONS.has(String(meta.impactComposition))) fail(`${id}: impactComposition ist ungültig/noch nicht geplant.`);

  const humans = isHumanPresent(meta.humanPresence);
  if (!humans && meta.humanReaction !== 'none') fail(`${id}: HUMAN_PRESENCE=none verlangt HUMAN_REACTION=none.`);
  if (humans && meta.humanReaction === 'none') fail(`${id}: sichtbare Menschen/Hände brauchen eine lesbare HUMAN_REACTION.`);
  if (meta.humanReaction === 'neutral-justified') {
    if (!validText(meta.humanReactionJustification, 20) || /^none$/i.test(String(meta.humanReactionJustification))) {
      fail(`${id}: neutral-justified braucht eine konkrete humanReactionJustification.`);
    }
  } else if (String(meta.humanReactionJustification ?? '').trim().toLowerCase() !== 'none') {
    fail(`${id}: humanReactionJustification muss außerhalb neutral-justified exakt none sein.`);
  }

  const impactType = String(meta.impactComposition);
  if (impactType === 'extreme-close-up' && !['extreme-close-up', 'macro'].includes(meta.shotScale)) fail(`${id}: IMPACT_COMPOSITION=extreme-close-up braucht SHOT_SCALE extreme-close-up oder macro.`);
  if (impactType === 'strong-pov' && meta.cameraAngle !== 'pov') fail(`${id}: IMPACT_COMPOSITION=strong-pov braucht CAMERA_ANGLE=pov.`);
  if (impactType === 'low-angle-scale' && meta.cameraAngle !== 'low-angle') fail(`${id}: IMPACT_COMPOSITION=low-angle-scale braucht CAMERA_ANGLE=low-angle.`);
  if (impactType === 'environment-wide' && !['wide', 'extreme-wide'].includes(meta.shotScale)) fail(`${id}: IMPACT_COMPOSITION=environment-wide braucht SHOT_SCALE wide oder extreme-wide.`);
  if (impactType === 'reveal' && meta.sequenceRole !== 'reveal' && meta.patternInterruptType !== 'reveal') fail(`${id}: IMPACT_COMPOSITION=reveal braucht SEQUENCE_ROLE=reveal oder PATTERN_INTERRUPT_TYPE=reveal.`);
  if (impactType === 'foreground-blocking' && !/vordergrund|foreground/i.test(String(meta.depthPlan ?? ''))) fail(`${id}: IMPACT_COMPOSITION=foreground-blocking muss im DEPTH_PLAN klaren Vordergrund nennen.`);

  if (typeof scene.planFile !== 'string') {
    fail(`${id}: planFile fehlt.`);
    continue;
  }
  const promptPath = resolve(root, '03-szenen', scene.planFile.replace(/^03-szenen\//, ''));
  if (!existsSync(promptPath)) {
    fail(`${id}: Bildprompt fehlt.`);
    continue;
  }
  const source = readFileSync(promptPath, 'utf8');
  const compiled = buildCompiledDirection(meta);
  if (!source.includes(V5_COMPILED_START) || !source.includes(compiled)) {
    fail(`${id}: kompilierter Flow-Prompt enthält die aktuelle V5.1-Staging-Regie nicht. reel:image-prompts:compile erneut ausführen.`);
  }
}

const countDistinct = (window, key) => new Set(window.map((scene) => String(scene.imageStorytelling?.[key] ?? '')).filter(Boolean)).size;
const checkWindow = (window, label, {fullSix = false} = {}) => {
  const explicitMin = fullSix ? 3 : window.length >= 4 ? 2 : 1;
  const explicitCount = window.filter(explicit).length;
  if (explicitCount < explicitMin) fail(`${label}: nur ${explicitCount} explicit Cause/Effect-Szenen; mindestens ${explicitMin} erforderlich.`);
  const stagingMin = window.length >= 4 ? 3 : Math.min(2, window.length);
  const stagingCount = countDistinct(window, 'stagingMode');
  if (stagingCount < stagingMin) fail(`${label}: nur ${stagingCount} unterschiedliche STAGING_MODE-Werte; mindestens ${stagingMin} erforderlich.`);
};

if (imageScenes.length >= 6) {
  for (let start = 0; start <= imageScenes.length - 6; start += 1) checkWindow(imageScenes.slice(start, start + 6), `6-IMAGE-Fenster ab ${imageScenes[start]?.id ?? start}`, {fullSix: true});
} else if (imageScenes.length >= 2) {
  checkWindow(imageScenes, `gesamte ${imageScenes.length}-IMAGE-Sequenz`);
}

if (imageScenes.length >= 4) {
  for (let start = 0; start <= imageScenes.length - 4; start += 1) {
    const window = imageScenes.slice(start, start + 4);
    if (!window.some(impact)) fail(`4-IMAGE-Fenster ab ${window[0]?.id ?? start}: keine echte IMPACT_COMPOSITION.`);
  }
} else if (imageScenes.length >= 2 && !imageScenes.some(impact)) {
  fail(`gesamte ${imageScenes.length}-IMAGE-Sequenz: mindestens eine echte IMPACT_COMPOSITION erforderlich.`);
}

if (errors.length) {
  console.error('\nV5.1 Dynamic Staging verletzt:\n');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log(`\n✓ V5.1 Dynamic Staging erfüllt: ${V5_STAGING_ID}`);
console.log('✓ Frame Occupancy, aktive Inszenierung, Cause/Effect, Human Reaction und Spatial Pressure sind final geplant.');
console.log('✓ Impact Composition und Staging-Modi erzeugen Sequenzrhythmus statt Black-Stage-/Katalog-Wiederholung.');
console.log('✓ Kompilierte Flow-Prompts enthalten dieselbe V5.1-Regie wie scene-index.json.');
