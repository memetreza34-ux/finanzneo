#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-reel-presentation-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-future-reel-presentation-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.futurePresentationContract;
if (!contract) {
  console.log('✓ Reel ohne Future-Reel-Presentation-V1 bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const validText = (value, min = 6) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

if (contract.id !== CONTRACT_ID) fail(`futurePresentationContract.id muss ${CONTRACT_ID} sein.`);
for (const key of [
  'appliesToNewReelsOnly',
  'legacyReelsUntouched',
  'scene01CoverUsesTitleInsteadOfStandardHeader',
  'scene01CaptionsForbidden',
  'standardHeaderRequiredFromScene02',
  'standardIconRequiredFromScene02',
  'captionsRequiredFromScene02',
  'captionsMustUseRealWordTimings',
  'phase3CompositionMustMountAudio',
  'phase3CompositionMustMountSceneHeader',
  'phase3CompositionMustMountCaptions',
  'renderedHeaderQaRequired',
  'renderedCaptionQaRequired',
  'imageMustFeelFrameFilling',
  'smallSquareCardLookForbidden',
  'motionDiversityRequired',
  'supportToolSwapDoesNotCountAsNewTechnique',
  'exactMotionSignatureRepeatWithinPreviousFourForbiddenWithoutReason',
  'sameHeroObjectFamilyMoreThanTwiceWithinPreviousFourForbiddenWithoutReason',
]) {
  if (contract[key] !== true) fail(`futurePresentationContract.${key} muss true sein.`);
}
if (Number(contract.minImageActivePixelRatio) < 0.08) fail('minImageActivePixelRatio muss mindestens 0.08 sein.');

const policyPath = resolve(root, '05-projektdateien/future-reel-presentation-v1.md');
if (!existsSync(policyPath)) fail('05-projektdateien/future-reel-presentation-v1.md fehlt.');
else {
  const source = readFileSync(policyPath, 'utf8');
  if (!source.includes(`FUTURE_REEL_PRESENTATION: ${CONTRACT_ID}`)) fail('future-reel-presentation-v1.md enthält den Vertragsmarker nicht.');
  if (!source.includes('SceneHeader') || !source.includes('Captions')) fail('future-reel-presentation-v1.md muss Header- und Caption-Hierarchie ausdrücklich festlegen.');
}

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const first = scenes[0];
if (!first || first.id !== 'scene-01') fail('scene-01 muss die erste Szene sein.');
if (first) {
  const p = first.presentation ?? {};
  if (p.coverTitleRequired !== true) fail('scene-01.presentation.coverTitleRequired muss true sein.');
  if (p.standardHeaderRequired !== false) fail('scene-01 darf keinen Standard-SceneHeader verlangen.');
  if (p.iconRequired !== false) fail('scene-01 darf kein Standard-Icon verlangen.');
  if (p.captionsRequired !== false) fail('scene-01 darf keine Captions verlangen.');
}

for (const [position, scene] of scenes.entries()) {
  if (position === 0) continue;
  const p = scene.presentation ?? {};
  if (p.coverTitleRequired !== false) fail(`${scene.id}: coverTitleRequired muss false sein.`);
  if (p.standardHeaderRequired !== true) fail(`${scene.id}: standardHeaderRequired muss true sein.`);
  if (p.iconRequired !== true) fail(`${scene.id}: iconRequired muss true sein.`);
  if (p.captionsRequired !== true) fail(`${scene.id}: captionsRequired muss true sein.`);
}

const animations = scenes.filter((scene) => scene?.type === 'animation');
const seenTechnique = new Map();
const previousAnimations = [];
for (const scene of animations) {
  const id = scene.id ?? 'Animation';
  const m = scene.motionDesign;
  if (!m || typeof m !== 'object') {
    fail(`${id}: motionDesign fehlt.`);
    continue;
  }

  if (!validText(m.viewerChange, 18)) fail(`${id}: motionDesign.viewerChange fehlt/ist Platzhalter.`);
  if (!validText(m.primaryAction, 18)) fail(`${id}: motionDesign.primaryAction fehlt/ist Platzhalter.`);
  for (const key of ['visualTechniqueId', 'compositionFamilyId', 'heroObjectFamily']) {
    const value = m[key];
    if (!validText(value, 3) || !slug.test(value.trim())) fail(`${id}: motionDesign.${key} muss ein ausgefüllter slug sein.`);
  }
  const allowedModes = new Set(['pure-remotion', 'svg', 'data', 'physical', 'typography', 'spatial', 'hybrid', 'other']);
  if (!allowedModes.has(String(m.visualMode))) fail(`${id}: motionDesign.visualMode ist ungültig.`);
  if (!Array.isArray(m.supportTools) || m.supportTools.some((tool) => typeof tool !== 'string' || !tool.trim())) {
    fail(`${id}: motionDesign.supportTools muss eine saubere Liste sein.`);
  }

  const sig = m.motionSignature ?? {};
  for (const key of ['camera', 'layout', 'transformation']) {
    if (!validText(sig[key], 3) || !slug.test(sig[key].trim())) fail(`${id}: motionDesign.motionSignature.${key} muss ein ausgefüllter slug sein.`);
  }

  const reason = typeof m.repetitionJustification === 'string' ? m.repetitionJustification.trim() : '';
  const hasReason = reason !== 'none' && validText(reason, 20);
  const technique = String(m.visualTechniqueId ?? '').trim();
  const family = String(m.compositionFamilyId ?? '').trim();
  const hero = String(m.heroObjectFamily ?? '').trim();
  const signature = `${String(sig.camera ?? '').trim()}|${String(sig.layout ?? '').trim()}|${String(sig.transformation ?? '').trim()}`;

  if (technique && seenTechnique.has(technique) && !hasReason) {
    fail(`${id}: visualTechniqueId "${technique}" wiederholt ${seenTechnique.get(technique)} ohne konkrete repetitionJustification.`);
  } else if (technique && !seenTechnique.has(technique)) {
    seenTechnique.set(technique, id);
  }

  const lastFour = previousAnimations.slice(-4);
  if (lastFour.some((prev) => prev.signature === signature) && !hasReason) {
    fail(`${id}: dieselbe sichtbare camera+layout+transformation-Signatur wurde innerhalb der letzten vier Animationen wiederholt.`);
  }
  const heroCount = lastFour.filter((prev) => prev.hero === hero).length;
  if (hero && heroCount >= 2 && !hasReason) {
    fail(`${id}: heroObjectFamily "${hero}" wäre innerhalb der letzten vier Animationen zum dritten Mal Hauptsprache.`);
  }
  const consecutiveSameFamily = previousAnimations.slice(-2).every((prev) => prev.family === family) && previousAnimations.length >= 2;
  if (family && consecutiveSameFamily && !hasReason) {
    fail(`${id}: compositionFamilyId "${family}" wäre zum dritten Mal in Folge dieselbe visuelle Familie.`);
  }

  previousAnimations.push({id, signature, hero, family});
}

if (errors.length) {
  console.error('\nFuture-Reel-Presentation-V1 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Future Reel Presentation erfüllt: ${CONTRACT_ID}`);
console.log('✓ scene-01 bleibt Cover-Sonderfall; ab scene-02 sind Header+Icon+Captions als Präsentationsvertrag gesetzt.');
console.log(`✓ ${animations.length} Animationsszenen erfüllen sichtbare Motion-Diversität; Support-Tool-Swaps zählen nicht als neue Haupttechnik.`);
