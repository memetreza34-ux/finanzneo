#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  V5_CONTRACT_ID,
  V5_HARDENING_ID,
  compileAllPromptBlocksFromMarkers,
  compileOnePromptSource,
} from './lib/image-storytelling-v5-hardening.mjs';
import {V5_STAGING_ID} from './lib/image-storytelling-v5-staging.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/compile-future-image-prompts-v5.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.imageStorytellingContract?.id !== V5_CONTRACT_ID) {
  console.log('✓ Kein V5-Reel; kein Prompt-Compile nötig.');
  process.exit(0);
}
if (index.imageStorytellingContract?.hardeningId !== V5_HARDENING_ID) {
  console.error(`V5-Hardening fehlt. Erwartet: ${V5_HARDENING_ID}`);
  process.exit(1);
}

const stagingRequired = index.imageStorytellingContract?.stagingId === V5_STAGING_ID;
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const required = [
  'strategy', 'visualMode', 'sequenceRole', 'visualArchetype', 'locationFamily', 'locationClass',
  'humanPresence', 'compositionFamily', 'mainSubjectFamily', 'mainSubjectClass', 'literalSituation',
  'contextAnchor', 'voiceVisualMatch', 'visualPurpose', 'storyAction', 'tensionOrConsequence',
  'visualHook', 'shotScale', 'cameraAngle', 'depthPlan', 'emotionalBeat', 'causeEffect',
  'patternInterrupt', 'patternInterruptType', 'motionHint', 'noveltyCheck', 'lightingVariation',
];
const stagingRequiredFields = [
  'frameOccupancyClass', 'stagingMode', 'causeEffectStrength', 'humanReaction',
  'humanReactionJustification', 'spatialPressure', 'impactComposition',
];

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
for (const scene of imageScenes) {
  const meta = scene.imageStorytelling ?? {};
  for (const key of [...required, ...(stagingRequired ? stagingRequiredFields : [])]) {
    const value = String(meta[key] ?? '').trim();
    if (!value || placeholder.test(value)) {
      console.error(`${scene.id}: ${key} ist noch nicht final geplant. Compile abgebrochen.`);
      process.exit(1);
    }
  }
  if (!Number.isInteger(Number(meta.energyLevel)) || Number(meta.energyLevel) < 1 || Number(meta.energyLevel) > 5) {
    console.error(`${scene.id}: energyLevel muss vor dem Compile 1–5 sein.`);
    process.exit(1);
  }
  if (typeof meta.tableDocumentScene !== 'boolean') {
    console.error(`${scene.id}: tableDocumentScene muss vor dem Compile true/false sein.`);
    process.exit(1);
  }
  if (!Number.isInteger(Number(meta.labelBudget)) || Number(meta.labelBudget) < 0 || Number(meta.labelBudget) > 3) {
    console.error(`${scene.id}: labelBudget muss vor dem Compile 0–3 sein.`);
    process.exit(1);
  }

  if (typeof scene.planFile !== 'string') {
    console.error(`${scene.id}: planFile fehlt.`);
    process.exit(1);
  }
  const promptPath = resolve(root, '03-szenen', scene.planFile.replace(/^03-szenen\//, ''));
  if (!existsSync(promptPath)) {
    console.error(`${scene.id}: Bildprompt fehlt: ${scene.planFile}`);
    process.exit(1);
  }
  const source = readFileSync(promptPath, 'utf8');
  writeFileSync(promptPath, compileOnePromptSource(source, meta), 'utf8');
}

const firstImage = imageScenes[0];
const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
if (firstImage?.imageStorytelling && existsSync(coverPath)) {
  writeFileSync(coverPath, compileOnePromptSource(readFileSync(coverPath, 'utf8'), firstImage.imageStorytelling), 'utf8');
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
if (!existsSync(masterPath)) {
  console.error('03-szenen/alle-bildprompts.txt fehlt.');
  process.exit(1);
}
writeFileSync(masterPath, compileAllPromptBlocksFromMarkers(readFileSync(masterPath, 'utf8')), 'utf8');

index.imageStorytellingContract.lastCompiledAt = new Date().toISOString();
index.imageStorytellingContract.compiledPromptCount = imageScenes.length;
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

console.log(`✓ ${imageScenes.length} V5-Bildprompts kompiliert.`);
console.log('✓ Kamera, Archetyp, Handlung, Ort, Hauptmotiv, Spannung, Cause/Effect, Licht und Label-Budget stehen jetzt direkt im IMAGE PROMPT.');
if (stagingRequired) console.log('✓ V5.1: Frame Occupancy, Dynamic Staging, Human Reaction, Spatial Pressure und Impact Composition stehen ebenfalls direkt im IMAGE PROMPT.');
console.log('✓ Google Flow muss diese Regie nicht mehr aus vorgelagerten Metadaten erraten.');
