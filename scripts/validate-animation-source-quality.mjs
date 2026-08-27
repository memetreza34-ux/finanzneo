#!/usr/bin/env node

import {existsSync, readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {ANIMATION_QUALITY_LOCK} from './lib/reel-scene-schema.mjs';
import {
  PREMIUM_ANIMATION_LOCK,
  validatePremiumAnimationSceneMetadata,
} from './lib/premium-animation-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-animation-source-quality.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const animations = scenes.filter((scene) => scene?.type === 'animation');
const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|PLACEHOLDER|PHASE 1 ANIMATION CODE NOT COMPLETED/i;
const hackWords = /\b(dummy|debug|placeholder|temporary|technik-hack|wackel|wiggle|test rectangle|fake motion)\b/i;

if (index.phase1AnimationCode?.required !== true) fail('phase1AnimationCode.required muss true sein.');
if (index.phase1AnimationCode?.qualityLock !== ANIMATION_QUALITY_LOCK) fail(`phase1AnimationCode.qualityLock muss ${ANIMATION_QUALITY_LOCK} sein.`);
if (index.phase1AnimationCode?.premiumVisualLock !== PREMIUM_ANIMATION_LOCK) fail(`phase1AnimationCode.premiumVisualLock muss ${PREMIUM_ANIMATION_LOCK} sein.`);
if (index.phase1AnimationCode?.phase3MayNotReplaceCanonicalAnimation !== true) fail('Phase 3 darf kanonischen Phase-1-Animationscode nicht ersetzen.');
if (index.phase1AnimationCode?.requirePremiumPhysicalStage !== true) fail('PremiumPhysicalStage muss für Premium-V2 verpflichtend sein.');
if (index.phase1AnimationCode?.requirePhysicalObjects !== true) fail('Physische Objekte müssen für Premium-V2 verpflichtend sein.');
if (index.phase1AnimationCode?.sameVisualLanguageAsFlowImages !== true) fail('Animationen müssen dieselbe visuelle Sprache wie Flow-Bilder verwenden.');

for (const scene of animations) {
  const id = scene.id ?? 'unbekannte Animation';
  errors.push(...validatePremiumAnimationSceneMetadata(scene));
  if (scene.animationQualityLock !== ANIMATION_QUALITY_LOCK) fail(`${id}: animationQualityLock fehlt/falsch.`);
  if (typeof scene.animationSourceFile !== 'string' || !scene.animationSourceFile.trim()) {
    fail(`${id}: animationSourceFile fehlt.`);
    continue;
  }
  if (typeof scene.animationExport !== 'string' || !scene.animationExport.trim()) fail(`${id}: animationExport fehlt.`);
  if (typeof scene.animationIntent !== 'string' || scene.animationIntent.trim().length < 18 || placeholder.test(scene.animationIntent)) {
    fail(`${id}: animationIntent ist leer, zu vage oder Platzhalter.`);
  }

  const sourcePath = resolve(root, '03-szenen', scene.animationSourceFile.replace(/^03-szenen\//, ''));
  if (!existsSync(sourcePath)) {
    fail(`${id}: kanonische Phase-1-Animationsdatei fehlt: ${scene.animationSourceFile}`);
    continue;
  }
  if (!statSync(sourcePath).isFile() || statSync(sourcePath).size < 1400) {
    fail(`${id}: animation.tsx ist zu klein/leer; Premium-V2 erwartet produktionsreifen, visuell ausgearbeiteten Code.`);
    continue;
  }

  const source = readFileSync(sourcePath, 'utf8');
  if (placeholder.test(source)) fail(`${id}: animation.tsx enthält Platzhalter/TODO.`);
  if (hackWords.test(source)) fail(`${id}: animation.tsx enthält Platzhalter-/Hack-Sprache.`);
  if (/Math\.(?:sin|cos)\s*\(/.test(source)) fail(`${id}: Math.sin/Math.cos als Dauer-Wackelbewegung ist im Produktionscode gesperrt.`);
  if (/\b(?:color|background(?:Color)?)\s*:\s*['"](?:black|#000(?:000)?)['"]/i.test(source)) fail(`${id}: schwarzer Inhalt auf dunklem Reel-Hintergrund ist gesperrt.`);
  if (!source.includes(scene.animationExport)) fail(`${id}: Export ${scene.animationExport} ist im kanonischen Code nicht auffindbar.`);
  if (!/useCurrentFrame/.test(source)) fail(`${id}: Animation muss useCurrentFrame nutzen und sichtbar zeitgesteuert sein.`);
  if (!/ANIMATION_COLORS/.test(source)) fail(`${id}: Animation muss die zentrale ANIMATION_COLORS-Palette verwenden.`);
  if (!/(?:prog\s*\(|interpolate\s*\(|spring\s*\()/.test(source)) fail(`${id}: kein nachvollziehbarer zeitlicher Animationsfortschritt gefunden.`);

  // Premium V2: gleiche massive, physische Sprache wie die Flow-Bilder.
  if (!/PremiumPhysicalStage/.test(source)) fail(`${id}: Premium-V2 muss PremiumPhysicalStage verwenden.`);
  const physicalObjects = [...source.matchAll(/<PhysicalObject\b/g)].length;
  if (physicalObjects < 2) fail(`${id}: Premium-V2 braucht mindestens zwei sichtbare PhysicalObject-Instanzen (Hero + Support).`);
  if (!/(?:material=['"](?:neutral|money|warning|positive)['"])/.test(source)) {
    fail(`${id}: Premium-V2 braucht neben der Struktur mindestens eine semantische Materialrolle (neutral/money/warning/positive).`);
  }
  if (/\b(?:Flowchart|Dashboard|ControlPanel|WindowMock|IconTile)\b/.test(source)) {
    fail(`${id}: Dashboard-/Flowchart-/UI-Komponenten sind als Premium-Hauptsprache gesperrt.`);
  }

  const narrative = source.match(/ANIMATION_NARRATIVE[\s\S]{0,1800}?START:\s*([^\n]+)[\s\S]*?MECHANISM:\s*([^\n]+)[\s\S]*?RESULT:\s*([^\n]+)/i);
  if (!narrative) {
    fail(`${id}: Code braucht ANIMATION_NARRATIVE mit START, MECHANISM und RESULT.`);
  } else {
    for (const [label, text] of [['START', narrative[1]], ['MECHANISM', narrative[2]], ['RESULT', narrative[3]]]) {
      if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: ${label}-Beschreibung ist zu vage/Platzhalter.`);
    }
  }

  const premiumNarrative = source.match(/PREMIUM_VISUAL_NARRATIVE[\s\S]{0,1800}?HERO:\s*([^\n]+)[\s\S]*?SUPPORT:\s*([^\n]+)[\s\S]*?MATERIAL:\s*([^\n]+)[\s\S]*?DEPTH:\s*([^\n]+)/i);
  if (!premiumNarrative) {
    fail(`${id}: Premium-V2 braucht PREMIUM_VISUAL_NARRATIVE mit HERO, SUPPORT, MATERIAL und DEPTH.`);
  } else {
    for (const [label, text] of [['HERO', premiumNarrative[1]], ['SUPPORT', premiumNarrative[2]], ['MATERIAL', premiumNarrative[3]], ['DEPTH', premiumNarrative[4]]]) {
      if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: Premium-${label} ist zu vage/Platzhalter.`);
    }
  }

  const hold = source.match(/RESULT_HOLD_FRAMES\s*=\s*(\d+)/);
  if (!hold || Number(hold[1]) < 15) fail(`${id}: RESULT_HOLD_FRAMES muss mindestens 15 Frames betragen.`);
}

if (errors.length) {
  console.error('\nPhase-1-Animationscode verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ ${animations.length} kanonische Phase-1-Animation(en) erfüllen Premium Physical Animation V2.`);
console.log('✓ PremiumPhysicalStage + physische Hero-/Support-Objekte + Materialkontrast + Tiefe sind erzwungen.');
console.log('✓ Dashboard/Flowchart/UI-Hauptsprache sowie Platzhalter-/Wackel-Hacks sind gesperrt.');
