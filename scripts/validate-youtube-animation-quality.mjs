#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  isStaticYouTubeVisual,
  LEGACY_YOUTUBE_MOTION_STANDARD_IDS,
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  YOUTUBE_MOTION_STANDARD_ID,
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
const acceptedStandards = new Set([YOUTUBE_MOTION_STANDARD_ID, ...LEGACY_YOUTUBE_MOTION_STANDARD_IDS]);
if (!acceptedStandards.has(index?.motionStandard?.id)) {
  errors.push(`motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein (Legacy V3 wird nur für bestehende Projekte akzeptiert).`);
}

const visuals = Array.isArray(index?.visuals) ? index.visuals : [];
for (const visual of visuals) errors.push(...validateYouTubeMotionMetadata(visual));

const forbiddenSourcePatterns = [
  [/\bMath\.random\s*\(/, 'Math.random ist in produktiver Motion verboten.'],
  [/\bDate\.now\s*\(/, 'Date.now ist in produktiver Motion verboten.'],
  [/\bsetInterval\s*\(/, 'setInterval ist in produktiver Motion verboten.'],
  [/\bsetTimeout\s*\(/, 'setTimeout ist in produktiver Motion verboten.'],
  [/\bfetch\s*\(/, 'Runtime-fetch ist in produktiver Motion verboten.'],
  [/https?:\/\//, 'Remote Runtime-Abhängigkeiten sind in animation.tsx verboten.'],
  [/\banimation\s*:/, 'CSS animation ist für gerenderte Motion verboten.'],
  [/\btransition\s*:/, 'CSS transition ist für gerenderte Motion verboten.'],
  [/\b(TODO|PLACEHOLDER|EINFÜGEN|KURZER NAME|SCRIPT BEAT|VIEWER CHANGE|MOTION REASON)\b/i, 'animation.tsx enthält noch einen Platzhalter.'],
];

let staticCount = 0;
let animatedCount = 0;
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

  if (isStaticYouTubeVisual(visual)) {
    staticCount += 1;
    if (/useCurrentFrame\s*\(/.test(source)) errors.push(`${id}: Phase-A-STATIC darf useCurrentFrame() nicht für Frame-Motion verwenden.`);
    if (/\b(interpolate|spring)\s*\(/.test(source)) errors.push(`${id}: Phase-A-STATIC darf interpolate() oder spring() nicht verwenden.`);
  } else {
    animatedCount += 1;
    if (!/useCurrentFrame\s*\(/.test(source)) errors.push(`${id}: useCurrentFrame() fehlt.`);
    if (!/\b(interpolate|spring)\s*\(/.test(source)) {
      errors.push(`${id}: mindestens interpolate() oder spring() muss sichtbare Frame-Motion steuern.`);
    }
  }

  const safeExport = String(visual.animationExport ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exportPattern = safeExport
    ? new RegExp(`export\\s+(?:const|function)\\s+${safeExport}\\b`)
    : null;
  if (!exportPattern || !exportPattern.test(source)) {
    errors.push(`${id}: Export ${visual.animationExport ?? '(fehlt)'} wurde nicht gefunden.`);
  }
}

if (errors.length) {
  console.error('\nYouTube Motion/Static-Remotion verletzt den Produktionsvertrag:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ YouTube Remotion erfüllt den Produktionsvertrag.');
if (index?.motionStandard?.id === YOUTUBE_MOTION_STANDARD_ID) {
  console.log(`  Motion V4 Simple · ${staticCount} statische Remotion-Visual(s) · ${animatedCount} animierte Visual(s) · deterministisch.`);
} else {
  console.log('  Legacy Motion V3 akzeptiert; neue Projekte sollen Motion V4 Simple verwenden.');
}
