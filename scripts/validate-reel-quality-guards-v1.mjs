#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-reel-quality-guards-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-reel-quality-guards-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.reelQualityGuards;
if (!contract) {
  console.log('✓ Reel ohne Quality-Guards-V1 bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
if (contract.id !== ID) fail(`reelQualityGuards.id muss ${ID} sein.`);
for (const key of ['sceneTypeExclusive','imageAnimationHybridMainVisualForbidden','sourceBasedAnimationDiversityRequired','metadataOnlyDiversityForbidden','actualPrimitiveReuseLimited','horizontalAnimationSafeZoneRequired','postRenderEdgeBandQaRequired']) {
  if (contract[key] !== true) fail(`reelQualityGuards.${key} muss true sein.`);
}
const safe = contract.animationHorizontalSafeZone ?? {};
if (Number(safe.left) !== 72 || Number(safe.right) !== 1008 || Number(safe.top) !== 320 || Number(safe.bottom) !== 1400) fail('animationHorizontalSafeZone muss X=72–1008 und Y=320–1400 sein.');
if (Number(safe.perspectiveGuardPx) < 20) fail('perspectiveGuardPx muss mindestens 20 px sein.');
if (Number(contract.edgeBandActivePixelRatioMax) > 0.015) fail('edgeBandActivePixelRatioMax darf höchstens 0.015 sein.');

const policyPath = resolve(root, '05-projektdateien/reel-quality-guards-v1.md');
if (!existsSync(policyPath)) fail('05-projektdateien/reel-quality-guards-v1.md fehlt.');
else if (!readFileSync(policyPath, 'utf8').includes(`REEL_QUALITY_GUARDS: ${ID}`)) fail('reel-quality-guards-v1.md enthält den Vertragsmarker nicht.');

const imageOnlyFields = ['googleFlowFileName','expectedVisual','imagePresentation','imageStorytelling','objectLabels'];
const animationOnlyFields = ['animationSourceFile','animationExport','animationIntent','animationQualityLock','animationPremiumVisualLock','motionDesign','phase1MotionDirection'];
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
for (const scene of scenes) {
  if (scene.type === 'image') {
    for (const field of animationOnlyFields) if (scene[field] !== undefined) fail(`${scene.id}: IMAGE-Szene darf ${field} nicht besitzen. IMAGE und ANIMATION sind exklusiv.`);
  }
  if (scene.type === 'animation') {
    for (const field of imageOnlyFields) if (scene[field] !== undefined) fail(`${scene.id}: ANIMATION-Szene darf ${field} nicht besitzen. Kein Flow-Bild als Hauptvisual.`);
  }
}

const primitiveNames = ['PhysicalBill','PhysicalAccount','PhysicalWasher','PhysicalReserveTank','PhysicalCalendarPage','PhysicalCoinStack','PhysicalObject'];
const coreNames = new Set(['PhysicalBill','PhysicalAccount','PhysicalWasher','PhysicalReserveTank','PhysicalCalendarPage','PhysicalObject']);
const widths = {PhysicalBill:250, PhysicalAccount:310, PhysicalWasher:290, PhysicalReserveTank:250, PhysicalCalendarPage:210, PhysicalCoinStack:150};
const prior = [];

const parseNumberProp = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}=\\{(-?\\d+(?:\\.\\d+)?)\\}`));
  return m ? Number(m[1]) : null;
};
const reasonFor = (scene) => String(scene.motionDesign?.repetitionJustification ?? 'none').trim();
const hasReason = (scene) => {
  const value = reasonFor(scene);
  return value !== 'none' && value.length >= 20;
};

for (const scene of scenes.filter((item) => item?.type === 'animation')) {
  const sourceRel = String(scene.animationSourceFile ?? '').replace(/^03-szenen\//, '');
  const sourcePath = resolve(root, '03-szenen', sourceRel);
  if (!existsSync(sourcePath)) {
    fail(`${scene.id}: animation.tsx fehlt für Source-Diversity-/Safe-Zone-Prüfung.`);
    continue;
  }
  const source = readFileSync(sourcePath, 'utf8');
  const counts = new Map();
  for (const name of primitiveNames) counts.set(name, [...source.matchAll(new RegExp(`<${name}\\b`, 'g'))].length);
  const core = [...coreNames].filter((name) => Number(counts.get(name)) > 0);
  const allConcrete = primitiveNames.filter((name) => Number(counts.get(name)) > 0);
  if (core.length === 0) fail(`${scene.id}: kein konkretes Hauptobjekt für echte Source-Diversität gefunden.`);

  const recent = prior.slice(-4);
  for (const name of core) {
    const recentUse = recent.filter((prev) => prev.core.includes(name)).length;
    if (recentUse >= 2 && !hasReason(scene)) fail(`${scene.id}: ${name} wäre in drei der letzten vier Animationen dieselbe tatsächliche Hauptobjekt-Sprache. Neue sichtbare Mechanik wählen oder konkret begründen.`);
  }
  const prev = prior.at(-1);
  if (prev) {
    const setA = new Set(core);
    const setB = new Set(prev.core);
    const union = new Set([...setA, ...setB]);
    const shared = [...setA].filter((item) => setB.has(item)).length;
    const jaccard = union.size ? shared / union.size : 0;
    if (shared >= 2 && jaccard >= 0.5 && !hasReason(scene)) {
      fail(`${scene.id}: echte TSX-Hauptobjekte überlappen zu stark mit ${prev.id} (${core.join(', ')}). Metadaten allein zählen nicht als neue Animation.`);
    }
  }

  const left = Number(safe.left) + Number(safe.perspectiveGuardPx);
  const right = Number(safe.right) - Number(safe.perspectiveGuardPx);
  const openingTags = [...source.matchAll(/<(PhysicalBill|PhysicalAccount|PhysicalWasher|PhysicalReserveTank|PhysicalCalendarPage|PhysicalCoinStack|PhysicalObject)\b[^>]*>/g)];
  for (const match of openingTags) {
    const name = match[1];
    const tag = match[0];
    const x = parseNumberProp(tag, 'x');
    if (x === null) continue;
    let width = widths[name] ?? null;
    if (name === 'PhysicalReserveTank' || name === 'PhysicalObject') width = parseNumberProp(tag, 'width') ?? width;
    if (!Number.isFinite(width)) continue;
    if (x < left || x + width > right) fail(`${scene.id}: ${name} mit statischem Bereich x=${x}..${x + width} verletzt die perspektivisch geschützte horizontale Zone ${left}..${right}.`);
  }

  prior.push({id: scene.id, core, allConcrete});
}

if (errors.length) {
  console.error('\nReel Quality Guards V1 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`\n✓ Reel Quality Guards erfüllt: ${ID}`);
console.log('✓ IMAGE xor ANIMATION · tatsächliche TSX-Diversität · horizontale Safe-Zone geprüft.');
