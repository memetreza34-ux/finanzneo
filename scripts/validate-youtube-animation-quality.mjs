#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_EDITORIAL_MOTION_WORLD_ID,
  YOUTUBE_EDITORIAL_VISUAL_TARGET_ID,
} from './lib/youtube-motion-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:animation:validate -- youtube/<Projekt>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const indexPath = resolve(root, '04-visuals/visual-index.json');
if (!existsSync(indexPath)) {
  console.error('04-visuals/visual-index.json fehlt.');
  process.exit(1);
}

let index;
try {
  index = JSON.parse(readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`visual-index.json ist ungültig: ${error.message}`);
  process.exit(1);
}

const errors = [];
if (index?.motionStandard?.id !== YOUTUBE_MOTION_STANDARD_ID) {
  errors.push(`motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein.`);
}
if (index?.motionStandard?.visualMotionWorld !== YOUTUBE_EDITORIAL_MOTION_WORLD_ID) {
  errors.push(`motionStandard.visualMotionWorld muss ${YOUTUBE_EDITORIAL_MOTION_WORLD_ID} sein.`);
}
if (index?.motionStandard?.visualTargetWorld !== YOUTUBE_EDITORIAL_VISUAL_TARGET_ID) {
  errors.push(`motionStandard.visualTargetWorld muss ${YOUTUBE_EDITORIAL_VISUAL_TARGET_ID} sein.`);
}
if (index?.motionStandard?.minimumMotionPreferred !== true) errors.push('motionStandard.minimumMotionPreferred muss true sein.');
if (index?.motionStandard?.cameraStillDefault !== false) errors.push('motionStandard.cameraStillDefault muss false sein; Kamera wird story-driven gewählt.');
if (index?.motionStandard?.cameraStoryDriven !== true) errors.push('motionStandard.cameraStoryDriven muss true sein.');
if (index?.motionStandard?.staticImageStyleCopyRequired !== false) errors.push('motionStandard.staticImageStyleCopyRequired muss false sein.');
if (index?.motionStandard?.youtubeNativeCompositionRequired !== true) errors.push('motionStandard.youtubeNativeCompositionRequired muss true sein.');
if (index?.motionStandard?.conceptCandidatesRequired !== 3) errors.push('motionStandard.conceptCandidatesRequired muss 3 sein.');
if (index?.motionStandard?.keyframeQaRequired !== true) errors.push('motionStandard.keyframeQaRequired muss true sein.');
if (JSON.stringify(index?.motionStandard?.keyframeQaPercentages) !== JSON.stringify([10,35,65,90])) errors.push('motionStandard.keyframeQaPercentages muss 10/35/65/90 sein.');
if (index?.motionStandard?.fixed3DStyleForbidden !== true) errors.push('motionStandard.fixed3DStyleForbidden muss true sein.');
const visuals = Array.isArray(index?.visuals) ? index.visuals : [];
for (const visual of visuals) errors.push(...validateYouTubeMotionMetadata(visual));
errors.push(...validateYouTubeMotionVariety(visuals));

const forbiddenSourcePatterns = [
  [/\bMath\.random\s*\(/, 'Math.random ist in produktiver Motion verboten.'],
  [/\bDate\.now\s*\(/, 'Date.now ist in produktiver Motion verboten.'],
  [/\bsetInterval\s*\(/, 'setInterval ist in produktiver Motion verboten.'],
  [/\bsetTimeout\s*\(/, 'setTimeout ist in produktiver Motion verboten.'],
  [/\bfetch\s*\(/, 'Runtime-fetch ist in produktiver Motion verboten.'],
  [/https?:\/\//, 'Remote Runtime-Abhängigkeiten sind in animation.tsx verboten.'],
  [/\banimation\s*:/, 'CSS animation ist für gerenderte Motion verboten.'],
  [/\btransition\s*:/, 'CSS transition ist für gerenderte Motion verboten.'],
  [/\b(TODO|PLACEHOLDER|EINFÜGEN|KURZER NAME|SCRIPT BEAT)\b/i, 'animation.tsx enthält noch einen Platzhalter.'],
];

for (const visual of visuals.filter(requiresYouTubeMotion)) {
  const id = visual.id ?? 'Unbekanntes Visual';
  const sourcePath = resolve(root, visual.animationSourceFile ?? '');
  if (!visual.animationSourceFile || !existsSync(sourcePath)) {
    errors.push(`${id}: animation.tsx fehlt: ${visual.animationSourceFile ?? '(kein Pfad)'}.`);
    continue;
  }
  const source = readFileSync(sourcePath, 'utf8');
  for (const [pattern, message] of forbiddenSourcePatterns) {
    if (pattern.test(source)) errors.push(`${id}: ${message}`);
  }
  if (!/useCurrentFrame\s*\(/.test(source)) errors.push(`${id}: useCurrentFrame() fehlt.`);
  if (/PremiumPhysicalStage|<Physical(?:Object|Tag|Rail|Bill|Account|Washer|ReserveTank|CalendarPage|CoinStack)\b/.test(source)) {
    errors.push(`${id}: neue YouTube Editorial Motion darf nicht auf alte PremiumPhysical-/Physical-Primitives zurückfallen.`);
  }
  if (!/\b(interpolate|spring)\s*\(/.test(source)) errors.push(`${id}: mindestens interpolate() oder spring() muss echte Frame-Motion steuern.`);
  if (!source.includes(`MECHANIC_ID = '${visual.mechanicId}'`) && !source.includes(`MECHANIC_ID = "${visual.mechanicId}"`)) {
    errors.push(`${id}: MECHANIC_ID im Code stimmt nicht mit visual-index.json überein.`);
  }
  if (!source.includes(`VISUAL_TECHNIQUE_ID = '${visual.visualTechniqueId}'`) && !source.includes(`VISUAL_TECHNIQUE_ID = "${visual.visualTechniqueId}"`)) {
    errors.push(`${id}: VISUAL_TECHNIQUE_ID im Code stimmt nicht mit visual-index.json überein.`);
  }
  if (!source.includes(`COMPOSITION_FAMILY_ID = '${visual.compositionFamilyId}'`) && !source.includes(`COMPOSITION_FAMILY_ID = "${visual.compositionFamilyId}"`)) {
    errors.push(`${id}: COMPOSITION_FAMILY_ID im Code stimmt nicht mit visual-index.json überein.`);
  }
  if (!/ANIMATION_NARRATIVE/.test(source) || !/START/.test(source) || !/RESULT/.test(source)) {
    errors.push(`${id}: ANIMATION_NARRATIVE mit START und RESULT fehlt.`);
  }
  const safeExport = String(visual.animationExport ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exportPattern = new RegExp(`export\\s+(?:const|function)\\s+${safeExport}\\b`);
  if (!visual.animationExport || !exportPattern.test(source)) errors.push(`${id}: Export ${visual.animationExport ?? '(fehlt)'} wurde nicht gefunden.`);
}

if (errors.length) {
  console.error('\nYouTube Motion V3 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ YouTube Motion V3 erfüllt.');
console.log('  Editorial Motion V1 · minimale klare Bewegung · Viewer-change-first · deterministisch · kein 3D-/Physical-Default.');
