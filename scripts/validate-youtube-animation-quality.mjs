#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
  YOUTUBE_MOTION_STANDARD_ID,
} from './lib/youtube-motion-contract.mjs';
import {VISUAL_INDEX} from './lib/youtube-contract.mjs';

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

const indexPath = resolve(root, VISUAL_INDEX);
if (!existsSync(indexPath)) {
  console.error(`${VISUAL_INDEX} fehlt.`);
  process.exit(1);
}

let index;
try {
  index = JSON.parse(readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`${VISUAL_INDEX} ist ungültig: ${error.message}`);
  process.exit(1);
}

const errors = [];
if (index?.motionStandard?.id !== YOUTUBE_MOTION_STANDARD_ID) {
  errors.push(`motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein.`);
}
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

const leakedDirectionPattern = /(?:>|['"`])\s*(?:show|reveal|explain|animate|build|move the camera|finish with|turn |create |display |demonstrate |visualize |keep the |make the )[^<\n'"`]{12,}/i;
const suspiciousEnglishSentence = /(?:>|['"`])\s*(?:the |this |your |a |an )[A-Za-z][^<\n'"`]{32,}[.!?]?\s*(?:<|['"`])/i;
const motionDriverPattern = /\b(?:interpolate|spring)\s*\(/g;
const visualChangeTokens = [
  /\bopacity\b/g,
  /\btranslate\b|translate[XYZ]?\s*\(/g,
  /\bscale\b|scale[XYZ]?\s*\(/g,
  /\brotate\b|rotate[XYZ]?\s*\(/g,
  /\bclipPath\b|clip-path/g,
  /\bstrokeDash(?:array|offset)\b/g,
  /\bwidth\b|\bheight\b/g,
  /\bposition\b|camera\.position|lookAt\s*\(/g,
  /\bpathLength\b|\bdashOffset\b/g,
];

const countMatches = (source, pattern) => (source.match(pattern) ?? []).length;
const countDistinctChangeFamilies = (source) => visualChangeTokens.filter((pattern) => pattern.test(source)).length;

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

  if (leakedDirectionPattern.test(source)) {
    errors.push(`${id}: sichtbare oder rendernahe englische Regieanweisung gefunden. Produktionsanweisungen dürfen niemals Zuschauertext werden.`);
  }
  if (suspiciousEnglishSentence.test(source)) {
    errors.push(`${id}: langer englischer Satz in animation.tsx gefunden. Sichtbarer Zuschauertext muss kurz, final und deutsch sein.`);
  }
  if (!/export\s+const\s+VIEWER_TEXT\s*=/.test(source)) {
    errors.push(`${id}: VIEWER_TEXT-Export fehlt. Jeder sichtbare Text muss dort explizit als Zuschauertext deklariert werden.`);
  }
  if (!/useCurrentFrame\s*\(/.test(source)) errors.push(`${id}: useCurrentFrame() fehlt.`);

  const minDrivers = visual.qualityTier === 'hero' ? 6 : 4;
  const motionDrivers = countMatches(source, motionDriverPattern);
  if (motionDrivers < minDrivers) {
    errors.push(`${id}: nur ${motionDrivers} Frame-Motion-Treiber; ${visual.qualityTier} benötigt mindestens ${minDrivers}.`);
  }
  const changeFamilies = countDistinctChangeFamilies(source);
  if (changeFamilies < 3) {
    errors.push(`${id}: Motion verändert zu wenige visuelle Eigenschaften (${changeFamilies}). Mindestens 3 unterschiedliche Veränderungsfamilien nötig.`);
  }

  const minSourceLength = visual.qualityTier === 'hero' ? 2600 : 1800;
  if (source.length < minSourceLength) {
    errors.push(`${id}: animation.tsx ist mit ${source.length} Zeichen zu trivial für ${visual.qualityTier}-Motion (Minimum ${minSourceLength}).`);
  }

  if (!source.includes(`MECHANIC_ID = '${visual.mechanicId}'`) && !source.includes(`MECHANIC_ID = "${visual.mechanicId}"`)) {
    errors.push(`${id}: MECHANIC_ID im Code stimmt nicht mit ${VISUAL_INDEX} überein.`);
  }
  if (!source.includes(`VISUAL_TECHNIQUE_ID = '${visual.visualTechniqueId}'`) && !source.includes(`VISUAL_TECHNIQUE_ID = "${visual.visualTechniqueId}"`)) {
    errors.push(`${id}: VISUAL_TECHNIQUE_ID im Code stimmt nicht mit ${VISUAL_INDEX} überein.`);
  }
  if (!source.includes(`COMPOSITION_FAMILY_ID = '${visual.compositionFamilyId}'`) && !source.includes(`COMPOSITION_FAMILY_ID = "${visual.compositionFamilyId}"`)) {
    errors.push(`${id}: COMPOSITION_FAMILY_ID im Code stimmt nicht mit ${VISUAL_INDEX} überein.`);
  }
  if (!/ANIMATION_NARRATIVE/.test(source) || !/START/.test(source) || !/MECHANISM/.test(source) || !/RESULT/.test(source)) {
    errors.push(`${id}: ANIMATION_NARRATIVE mit START, MECHANISM und RESULT fehlt.`);
  }
  if (!/MOTION_EVENTS/.test(source)) {
    errors.push(`${id}: MOTION_EVENTS-Export fehlt.`);
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

console.log('\n✓ YouTube Motion V3 Source-QA erfüllt.');
console.log('  Keine Regieanweisungen im Viewer-Layer · mehrstufige Motion · Content-first · Technikvariation geprüft.');
