#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-production-standard-v3.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-future-production-v3';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.futureProductionStandard;

// Future-only: bestehende Reels sind absichtlich keine V3-Migrationsziele.
if (!contract) {
  console.log('✓ Reel ohne Future-Production-V3 bleibt rückwärtskompatibel; keine neue Pflicht wird rückwirkend erzwungen.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
if (contract.id !== CONTRACT_ID) fail(`futureProductionStandard.id muss ${CONTRACT_ID} sein.`);
if (contract.appliesToNewReelsOnly !== true) fail('futureProductionStandard.appliesToNewReelsOnly muss true sein.');
if (contract.legacyReelsUntouched !== true) fail('futureProductionStandard.legacyReelsUntouched muss true sein.');

const timing = contract.timing ?? {};
if (JSON.stringify(timing.staticImageIdealSeconds) !== JSON.stringify([1.8, 3.0])) fail('V3 staticImageIdealSeconds muss [1.8, 3.0] sein.');
if (Number(timing.staticImageSoftMaxSeconds) !== 3.6) fail('V3 staticImageSoftMaxSeconds muss 3.6 sein.');
if (Number(timing.staticImageHardMaxSeconds) !== 4.0) fail('V3 staticImageHardMaxSeconds muss 4.0 sein.');
for (const key of [
  'longStaticSentenceNeedsAdditionalVisualBeat',
  'sentenceMayUseMultipleImages',
  'newConcreteIdeaNeedsVisualChange',
  'extraImagePreferredOverLongHold',
  'realWordTimingsRemainFinalAuthority',
]) {
  if (timing[key] !== true) fail(`futureProductionStandard.timing.${key} muss true sein.`);
}
if (Number(index.timingStandard?.imageSceneAbsoluteMaxSeconds) !== 4.0) fail('timingStandard.imageSceneAbsoluteMaxSeconds muss für V3 4.0 sein.');
if (Number(index.timingStandard?.imageSceneSoftMaxSeconds) !== 3.6) fail('timingStandard.imageSceneSoftMaxSeconds muss für V3 3.6 sein.');

const framing = contract.animationFraming ?? {};
for (const key of [
  'mainMechanismMustFeelFrameFilling',
  'excessiveEmptySpaceForbidden',
  'widerContextAllowedOnlyWhenStoryNeedsIt',
  'wideContextMustProgressToCloserMechanismState',
]) {
  if (framing[key] !== true) fail(`futureProductionStandard.animationFraming.${key} muss true sein.`);
}
if (!Array.isArray(framing.sampleRatios) || framing.sampleRatios.length < 3) fail('animationFraming.sampleRatios benötigt mindestens drei Samples.');
if (Number(framing.minPeakActivePixelRatio) < 0.15) fail('animationFraming.minPeakActivePixelRatio muss mindestens 0.15 sein.');
if (Number(framing.minMedianActivePixelRatio) < 0.12) fail('animationFraming.minMedianActivePixelRatio muss mindestens 0.12 sein.');

const audio = contract.audioMastering ?? {};
if (audio.normalizeBeforeRenderQa !== true) fail('audioMastering.normalizeBeforeRenderQa muss true sein.');
if (Number(audio.targetIntegratedLufs) !== -16) fail('audioMastering.targetIntegratedLufs muss -16 sein.');
if (Number(audio.integratedLufsTolerance) > 1.0 || Number(audio.integratedLufsTolerance) <= 0) fail('audioMastering.integratedLufsTolerance muss >0 und <=1.0 sein.');
if (Number(audio.targetTruePeakDbtp) !== -1) fail('audioMastering.targetTruePeakDbtp muss -1 sein.');
if (Number(audio.maxTruePeakDbtp) > -0.8) fail('audioMastering.maxTruePeakDbtp darf nicht über -0.8 dBTP liegen.');
if (String(audio.audioBitrate) !== '320k') fail('audioMastering.audioBitrate muss 320k sein.');
if (Number(audio.sampleRate) !== 48000) fail('audioMastering.sampleRate muss 48000 sein.');
if (Number(index.audio?.targetIntegratedLufs) !== -16) fail('index.audio.targetIntegratedLufs muss -16 sein.');
if (Number(index.audio?.targetTruePeakDbtp) !== -1) fail('index.audio.targetTruePeakDbtp muss -1 sein.');

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
for (const scene of scenes.filter((item) => item?.type === 'image')) {
  const planned = Number(scene.plannedDurationSeconds ?? scene.targetSeconds ?? 0);
  if (!Number.isFinite(planned) || planned <= 0) {
    fail(`${scene.id}: geplante Bilddauer fehlt/ist ungültig.`);
    continue;
  }
  if (planned > 4.0001) {
    fail(`${scene.id}: statisches Bild ist mit ${planned.toFixed(2)} s zu lang für Future V3; maximal 4,0 s ohne neue sichtbare Information. Zusätzlichen Visual Beat/Bild einplanen.`);
  }
}

const standardPath = resolve(root, '05-projektdateien/future-production-v3.md');
if (!existsSync(standardPath)) {
  fail('05-projektdateien/future-production-v3.md fehlt.');
} else {
  const content = readFileSync(standardPath, 'utf8');
  if (!content.includes(`FUTURE_PRODUCTION_STANDARD: ${CONTRACT_ID}`)) fail('future-production-v3.md enthält den Vertragsmarker nicht.');
  for (const marker of ['1,8–3,0 s', '4,0 s', '-16 LUFS', '0,15', '0,12']) {
    if (!content.includes(marker)) fail(`future-production-v3.md enthält Pflichtmarker nicht: ${marker}`);
  }
}

if (errors.length) {
  console.error('\nFuture-Production-V3-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Future Production Standard erfüllt: ${CONTRACT_ID}`);
console.log('✓ Still-Rhythmus: max. 4,0 s unverändert · lange Sätze dürfen zusätzliche Bilder bekommen.');
console.log('✓ Animation-Framing: größere Hauptmechanik wird später im echten Render per Occupancy-QA geprüft.');
console.log('✓ Audio-Mastering: -16 LUFS / -1 dBTP ist als verpflichtender Pre-QA-Schritt verankert.');
