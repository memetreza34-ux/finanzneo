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

const YOUTUBE_MOTION_QUALITY_STANDARD_ID = 'finanzneo-youtube-motion-quality-v1';
const YOUTUBE_VISUAL_QA_STANDARD_ID = 'finanzneo-youtube-visual-qa-16x9-v1';
const REQUIRED_REPRESENTATIVE_STATES = ['START', '25%', '50%', '75%', 'RESULT HOLD'];

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

const unresolvedTextPattern = /(^\s*$|\[[^\]]+\]|\b(?:TODO|PLACEHOLDER|EINFÜGEN|SCRIPT BEAT|VIEWER CHANGE|MOTION REASON)\b)/i;
const isResolvedText = (value) => typeof value === 'string' && !unresolvedTextPattern.test(value.trim());
const qualityEnabled = index?.phaseB?.motionQualityStandardId === YOUTUBE_MOTION_QUALITY_STANDARD_ID;

if (qualityEnabled) {
  if (index?.phaseB?.visualQaStandardId !== YOUTUBE_VISUAL_QA_STANDARD_ID) {
    errors.push(`phaseB.visualQaStandardId muss ${YOUTUBE_VISUAL_QA_STANDARD_ID} sein.`);
  }
  if (index?.phaseB?.reuseExistingMotionStackFirst !== true) {
    errors.push('phaseB.reuseExistingMotionStackFirst muss true sein.');
  }
  if (JSON.stringify(index?.phaseB?.representativeMotionStatesRequired) !== JSON.stringify(REQUIRED_REPRESENTATIVE_STATES)) {
    errors.push(`phaseB.representativeMotionStatesRequired muss ${REQUIRED_REPRESENTATIVE_STATES.join(' | ')} enthalten.`);
  }

  const qaPlanPath = resolve(root, '06-projektdateien/motion-qa.md');
  if (!existsSync(qaPlanPath)) {
    errors.push('06-projektdateien/motion-qa.md fehlt für den YouTube-16:9-Motion-Quality-Standard.');
  } else {
    const qaPlan = readFileSync(qaPlanPath, 'utf8');
    if (!qaPlan.includes(YOUTUBE_VISUAL_QA_STANDARD_ID)) errors.push(`motion-qa.md muss ${YOUTUBE_VISUAL_QA_STANDARD_ID} referenzieren.`);
    if (!qaPlan.includes(YOUTUBE_MOTION_QUALITY_STANDARD_ID)) errors.push(`motion-qa.md muss ${YOUTUBE_MOTION_QUALITY_STANDARD_ID} referenzieren.`);
  }

  for (const visual of visuals.filter(requiresYouTubeMotion).filter((visual) => !isStaticYouTubeVisual(visual))) {
    const id = visual.id ?? 'Unbekanntes Visual';
    const quality = visual?.motionQuality;
    if (!quality || typeof quality !== 'object') {
      errors.push(`${id}: motionQuality fehlt.`);
      continue;
    }

    if (quality.standardId !== YOUTUBE_MOTION_QUALITY_STANDARD_ID) {
      errors.push(`${id}: motionQuality.standardId muss ${YOUTUBE_MOTION_QUALITY_STANDARD_ID} sein.`);
    }
    if (quality.visualQaStandardId !== YOUTUBE_VISUAL_QA_STANDARD_ID) {
      errors.push(`${id}: motionQuality.visualQaStandardId muss ${YOUTUBE_VISUAL_QA_STANDARD_ID} sein.`);
    }
    if (!isResolvedText(quality.staticAlternative)) errors.push(`${id}: motionQuality.staticAlternative ist noch nicht konkret geplant.`);
    if (!isResolvedText(quality.motionValue)) errors.push(`${id}: motionQuality.motionValue ist noch nicht konkret geplant.`);
    if (!isResolvedText(quality.toolRoute)) errors.push(`${id}: motionQuality.toolRoute ist noch nicht konkret gewählt.`);
    if (!isResolvedText(quality.whyThisTool)) errors.push(`${id}: motionQuality.whyThisTool ist noch nicht begründet.`);
    if (quality.replaceWithStaticIfNotStronger !== true) errors.push(`${id}: motionQuality.replaceWithStaticIfNotStronger muss true sein.`);

    const mechanism = quality?.mechanism ?? {};
    for (const field of ['start', 'action', 'result']) {
      if (!isResolvedText(mechanism[field])) errors.push(`${id}: motionQuality.mechanism.${field} ist noch nicht konkret geplant.`);
    }

    if (JSON.stringify(quality.representativeStates) !== JSON.stringify(REQUIRED_REPRESENTATIVE_STATES)) {
      errors.push(`${id}: motionQuality.representativeStates muss ${REQUIRED_REPRESENTATIVE_STATES.join(' | ')} enthalten.`);
    }

    if (visual.type === 'hybrid') {
      if (!isResolvedText(quality.imageJob)) errors.push(`${id}: Hybrid braucht einen konkreten motionQuality.imageJob.`);
      if (!isResolvedText(quality.motionJob)) errors.push(`${id}: Hybrid braucht einen konkreten motionQuality.motionJob.`);
      if (quality.semanticOverlapForbidden !== true) errors.push(`${id}: Hybrid muss semanticOverlapForbidden=true setzen.`);
      if (isResolvedText(quality.imageJob) && isResolvedText(quality.motionJob) && quality.imageJob.trim() === quality.motionJob.trim()) {
        errors.push(`${id}: imageJob und motionJob dürfen semantisch nicht als identischer Job beschrieben sein.`);
      }
    }
  }
}

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
  if (qualityEnabled) console.log(`  ${YOUTUBE_MOTION_QUALITY_STANDARD_ID} · ${YOUTUBE_VISUAL_QA_STANDARD_ID} · Planung aufgelöst.`);
} else {
  console.log('  Legacy Motion V3 akzeptiert; neue Projekte sollen Motion V4 Simple verwenden.');
}
