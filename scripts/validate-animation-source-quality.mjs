#!/usr/bin/env node

import {existsSync, readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {ANIMATION_QUALITY_LOCK} from './lib/reel-scene-schema.mjs';

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
if (index.phase1AnimationCode?.phase3MayNotReplaceCanonicalAnimation !== true) fail('Phase 3 darf kanonischen Phase-1-Animationscode nicht ersetzen.');

for (const scene of animations) {
  const id = scene.id ?? 'unbekannte Animation';
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
  if (!statSync(sourcePath).isFile() || statSync(sourcePath).size < 900) {
    fail(`${id}: animation.tsx ist zu klein/leer; produktionsreifer Code erwartet.`);
    continue;
  }

  const source = readFileSync(sourcePath, 'utf8');
  if (placeholder.test(source)) fail(`${id}: animation.tsx enthält Platzhalter/TODO.`);
  if (hackWords.test(source)) fail(`${id}: animation.tsx enthält Platzhalter-/Hack-Sprache.`);
  if (/Math\.(?:sin|cos)\s*\(/.test(source)) fail(`${id}: Math.sin/Math.cos als Dauer-Wackelbewegung ist im Produktionscode gesperrt.`);
  if (/\b(?:color|background(?:Color)?)\s*:\s*['"](?:black|#000(?:000)?)['"]/i.test(source)) fail(`${id}: schwarzer Inhalt auf dunklem Reel-Hintergrund ist gesperrt.`);
  if (!source.includes(scene.animationExport)) fail(`${id}: Export ${scene.animationExport} ist im kanonischen Code nicht auffindbar.`);
  if (!/useCurrentFrame/.test(source)) fail(`${id}: Animation muss useCurrentFrame nutzen und sichtbar zeitgesteuert sein.`);
  if (!/AnimationStage/.test(source)) fail(`${id}: Animation muss die zentrale AnimationStage verwenden.`);
  if (!/ANIMATION_COLORS/.test(source)) fail(`${id}: Animation muss die zentrale ANIMATION_COLORS-Palette verwenden.`);
  if (!/(?:prog\s*\(|interpolate\s*\(|spring\s*\()/.test(source)) fail(`${id}: kein nachvollziehbarer zeitlicher Animationsfortschritt gefunden.`);

  const narrative = source.match(/ANIMATION_NARRATIVE[\s\S]{0,1600}?START:\s*([^\n]+)[\s\S]*?MECHANISM:\s*([^\n]+)[\s\S]*?RESULT:\s*([^\n]+)/i);
  if (!narrative) {
    fail(`${id}: Code braucht ANIMATION_NARRATIVE mit START, MECHANISM und RESULT.`);
  } else {
    for (const [label, text] of [['START', narrative[1]], ['MECHANISM', narrative[2]], ['RESULT', narrative[3]]]) {
      if (!text || text.trim().length < 8 || placeholder.test(text)) fail(`${id}: ${label}-Beschreibung ist zu vage/Platzhalter.`);
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

console.log(`\n✓ ${animations.length} kanonische Phase-1-Animation(en) sind produktionsreif beschrieben und codiert.`);
console.log('✓ Keine Platzhalter-/Wackel-Hacks; Start → Mechanismus → Ergebnis + stabiler Endzustand sind erzwungen.');
