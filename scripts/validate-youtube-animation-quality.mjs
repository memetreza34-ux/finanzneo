#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
  YOUTUBE_MOTION_STANDARD_ID,
} from './lib/youtube-motion-contract.mjs';
import {
  YOUTUBE_VISUAL_CLARITY_MIN_RESULT_HOLD_FRAMES,
  YOUTUBE_VISUAL_CLARITY_STANDARD_ID,
  validateYouTubeVisualClarity,
} from './lib/youtube-visual-clarity-contract.mjs';

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
const visuals = Array.isArray(index?.visuals) ? index.visuals : [];
const clarityEnabled = index?.visualClarityStandard?.id === YOUTUBE_VISUAL_CLARITY_STANDARD_ID;
for (const visual of visuals) {
  errors.push(...validateYouTubeMotionMetadata(visual));
  if (clarityEnabled && requiresYouTubeMotion(visual)) errors.push(...validateYouTubeVisualClarity(visual));
}
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
  // Karten aus dem Karten-Baukasten tragen ihre Frame-Motion selbst (src/design-system/karten.tsx).
  const nutztKarten = /from\s+['"][^'"]*design-system(?:\/karten|\/index)?['"]/.test(source)
    && /\b(StichwortKarte|ZitatKarte|TabellenKarte|IconAblauf|Zeitstrahl)\b/.test(source);
  if (!nutztKarten && !/useCurrentFrame\s*\(/.test(source)) errors.push(`${id}: useCurrentFrame() fehlt.`);
  if (!nutztKarten && !/\b(interpolate|spring)\s*\(/.test(source)) errors.push(`${id}: mindestens interpolate() oder spring() muss echte Frame-Motion steuern.`);
  if (!source.includes(`MECHANIC_ID = '${visual.mechanicId}'`) && !source.includes(`MECHANIC_ID = "${visual.mechanicId}"`)) {
    errors.push(`${id}: MECHANIC_ID im Code stimmt nicht mit visual-index.json überein.`);
  }
  if (!source.includes(`VISUAL_TECHNIQUE_ID = '${visual.visualTechniqueId}'`) && !source.includes(`VISUAL_TECHNIQUE_ID = "${visual.visualTechniqueId}"`)) {
    errors.push(`${id}: VISUAL_TECHNIQUE_ID im Code stimmt nicht mit visual-index.json überein.`);
  }
  if (!source.includes(`COMPOSITION_FAMILY_ID = '${visual.compositionFamilyId}'`) && !source.includes(`COMPOSITION_FAMILY_ID = "${visual.compositionFamilyId}"`)) {
    errors.push(`${id}: COMPOSITION_FAMILY_ID im Code stimmt nicht mit visual-index.json überein.`);
  }
  if (!/ANIMATION_NARRATIVE/.test(source) || !/START/.test(source) || !/MECHANISM/.test(source) || !/RESULT/.test(source)) {
    errors.push(`${id}: ANIMATION_NARRATIVE mit START, MECHANISM und RESULT fehlt.`);
  }
  if (clarityEnabled) {
    const holdFrames = Number(visual?.clarityPlan?.resultHoldFrames);
    if (!Number.isFinite(holdFrames) || holdFrames < YOUTUBE_VISUAL_CLARITY_MIN_RESULT_HOLD_FRAMES) {
      errors.push(`${id}: clarityPlan.resultHoldFrames muss mindestens ${YOUTUBE_VISUAL_CLARITY_MIN_RESULT_HOLD_FRAMES} Frames sein.`);
    } else {
      const holdPattern = new RegExp(`RESULT_HOLD_FRAMES\\s*=\\s*${holdFrames}\\b`);
      if (!holdPattern.test(source)) errors.push(`${id}: RESULT_HOLD_FRAMES im Code stimmt nicht mit clarityPlan.resultHoldFrames überein.`);
    }
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
console.log('  Viewer-change-first · Klarheit vor Bewegung · START→CHANGE→RESULT · stabiler Result-Hold · offene Technik.');
