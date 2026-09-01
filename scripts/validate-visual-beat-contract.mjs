#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-visual-beat-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const V1 = 'finanzneo-visual-beats-v1';
const V2 = 'finanzneo-visual-beats-v2';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.visualBeatContract;

// Echte Legacy-Reels bleiben unverändert. Existiert aber ein Vertrag, muss er
// bewusst V1 oder V2 sein — Tippfehler dürfen nicht still als Legacy durchgehen.
if (!contract) {
  console.log('✓ Bestehendes Reel ohne Visual-Beat-Vertrag bleibt rückwärtskompatibel; keine neue Pflicht wird rückwirkend erzwungen.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
if (![V1, V2].includes(contract.id)) fail('Unbekannter visualBeatContract.id: ' + String(contract.id));
const isV2 = contract.id === V2;
const CONTRACT_ID = contract.id;
const PLACEHOLDER = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const almostEqual = (a, b, tolerance = 0.16) => Math.abs(a - b) <= tolerance;

for (const key of [
  'sceneCountFlexible',
  'visualBeatCountFlexible',
  'oneSpokenThoughtPerBeatRequired',
  'splitMultiThoughtSentenceWhenHelpful',
  'oneImagePerSentenceAllowed',
  'consecutiveImageScenesAllowedWhenMeaningAdvances',
  'animationMustContainMultipleVisibleStates',
  'visualMustAdvanceWithVoiceover',
  'cameraMotionAloneDoesNotCountAsNewBeat',
  'unchangedVisualAfterMessageUnderstoodForbidden',
  'actualCutsFollowRealWordTimings',
  'ratioIsGuidelineNotQuota',
]) {
  if (contract[key] !== true) fail('visualBeatContract.' + key + ' muss true sein.');
}

if (isV2) {
  for (const key of [
    'visualBeatPlanBeforeSceneCount',
    'oneImagePerSentencePreferredWhenItImprovesClarity',
    'visualChangeWhenVoiceoverIntroducesNewConcreteIdea',
    'extraImagePreferredOverOverloadedStill',
    'longerAnimationRequiresVisibleProgression',
  ]) {
    if (contract[key] !== true) fail('Visual-Beat-v2 verlangt visualBeatContract.' + key + '=true.');
  }
}

const allowedHardMax = isV2 ? 4.2 : 4.5;
const hardMax = Number(contract.staticImageBeatHardMaxSeconds);
if (!Number.isFinite(hardMax) || hardMax <= 0 || hardMax > allowedHardMax) {
  fail('visualBeatContract.staticImageBeatHardMaxSeconds muss bei ' + CONTRACT_ID + ' <= ' + allowedHardMax.toFixed(1) + ' sein.');
}

if (Number(index.timingStandard?.imageSceneAbsoluteMaxSeconds) > allowedHardMax) {
  fail('timingStandard.imageSceneAbsoluteMaxSeconds darf bei ' + CONTRACT_ID + ' nicht über ' + allowedHardMax.toFixed(1) + ' s liegen.');
}
if (index.timingStandard?.visualBeatContractId !== CONTRACT_ID) {
  fail('timingStandard.visualBeatContractId muss ' + CONTRACT_ID + ' sein.');
}
if (isV2 && index.timingStandard?.newConcreteVoiceIdeaShouldTriggerVisualChange !== true) {
  fail('Visual-Beat-v2 verlangt timingStandard.newConcreteVoiceIdeaShouldTriggerVisualChange=true.');
}
if (index.timelineRules?.equalLengthScenesForbiddenByDefault !== true) {
  fail('timelineRules.equalLengthScenesForbiddenByDefault muss true bleiben; echte Voiceover-Timings entscheiden.');
}

const beatPlanPath = resolve(root, '05-projektdateien/visual-beats.md');
if (!existsSync(beatPlanPath)) {
  fail('05-projektdateien/visual-beats.md fehlt.');
} else {
  const beatPlan = readFileSync(beatPlanPath, 'utf8');
  if (!beatPlan.includes('VISUAL_BEAT_CONTRACT: ' + CONTRACT_ID)) fail('visual-beats.md enthält den Vertragsmarker nicht.');
  if (PLACEHOLDER.test(beatPlan)) fail('visual-beats.md enthält noch Platzhalter.');
  if (isV2 && !beatPlan.includes('Lieber ein zusätzliches gutes Bild')) fail('Visual-Beat-v2-Regel für zusätzliche Bilder fehlt in visual-beats.md.');
}

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
if (scenes.length < 5 || scenes.length > 20) fail('Szenenzahl muss weiterhin innerhalb 5–20 liegen, darf darin aber frei gewählt werden.');

let totalBeats = 0;
const seenBeatIds = new Set();
for (const scene of scenes) {
  const planned = Number(scene.plannedDurationSeconds ?? scene.targetSeconds);
  if (!Number.isFinite(planned) || planned <= 0) {
    fail(scene.id + ': plannedDurationSeconds/targetSeconds fehlt oder ist ungültig.');
    continue;
  }

  const beats = Array.isArray(scene.visualBeats) ? scene.visualBeats : [];
  if (beats.length === 0) {
    fail(scene.id + ': visualBeats fehlt.');
    continue;
  }
  totalBeats += beats.length;

  if (scene.type === 'image') {
    if (beats.length !== 1) fail(scene.id + ': Eine Bildszene repräsentiert genau einen statischen Visual Beat. Für einen weiteren Gedanken ein weiteres Bild/eine weitere Szene planen.');
    if (planned > hardMax + 0.001) fail(scene.id + ': geplanter statischer Bildbeat dauert ' + planned.toFixed(1) + ' s; ohne neue sichtbare Information max. ' + hardMax.toFixed(1) + ' s.');
  }
  if (scene.type === 'animation' && beats.length < 2) {
    fail(scene.id + ': Animationsszene braucht mindestens zwei sichtbare Visual-Beats/Zustände.');
  }

  let previousEnd = 0;
  beats.forEach((beat, i) => {
    const prefix = scene.id + ' / Beat ' + (i + 1);
    const id = typeof beat.id === 'string' ? beat.id.trim() : '';
    const voiceText = typeof beat.voiceText === 'string' ? beat.voiceText.trim() : '';
    const visualChange = typeof beat.visualChange === 'string' ? beat.visualChange.trim() : '';
    const start = Number(beat.startSecond);
    const end = Number(beat.endSecond);

    if (!id || PLACEHOLDER.test(id)) fail(prefix + ': gültige Beat-ID fehlt.');
    if (seenBeatIds.has(id)) fail(prefix + ': Beat-ID ist doppelt: ' + id);
    seenBeatIds.add(id);
    if (!voiceText || PLACEHOLDER.test(voiceText)) fail(prefix + ': voiceText fehlt oder ist Platzhalter.');
    if (!visualChange || PLACEHOLDER.test(visualChange)) fail(prefix + ': visualChange fehlt oder ist Platzhalter.');
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) fail(prefix + ': startSecond/endSecond ungültig.');
    if (i === 0 && !almostEqual(start, 0)) fail(prefix + ': erster Beat muss bei 0 s beginnen.');
    if (i > 0 && !almostEqual(start, previousEnd)) fail(prefix + ': Beats müssen ohne tote visuelle Lücke aneinander anschließen.');
    previousEnd = end;
  });

  if (!almostEqual(previousEnd, planned, 0.22)) {
    fail(scene.id + ': letzter Visual Beat endet bei ' + previousEnd.toFixed(2) + ' s, geplante Szene bei ' + planned.toFixed(2) + ' s.');
  }
}

if (totalBeats <= scenes.length && scenes.some((scene) => scene.type === 'animation')) {
  fail(CONTRACT_ID + ' erwartet zusätzliche Zustandswechsel innerhalb von Animationsszenen; Gesamtzahl der Beats muss bei Animationen über der Szenenzahl liegen.');
}

if (errors.length) {
  console.error('\nVisual-Beat-Vertrag verletzt:\n');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('\n✓ Visual-Beat-Vertrag erfüllt: ' + CONTRACT_ID);
console.log('✓ Szenenzahl frei · statische Bilder kurz · zusätzliche Bilder erlaubt, wenn die Aussage fortschreitet.');
console.log('✓ ' + scenes.length + ' Szenen enthalten zusammen ' + totalBeats + ' geplante Visual Beats.');
console.log('✓ Echte Wort-Timings bleiben die finale Quelle für Schnitte und Dauer.');
