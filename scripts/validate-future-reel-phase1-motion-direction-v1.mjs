#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-reel-phase1-motion-direction-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const LEGACY_CONTRACT_ID = 'finanzneo-phase1-individual-motion-v1';
const CONTRACT_ID = 'finanzneo-phase1-hybrid-motion-v2';
const LIBRARY_ID = 'finanzneo-finance-motion-library-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.phase1MotionDirectionContract;
if (!contract) {
  console.log('✓ Reel ohne Phase-1-Motion-Vertrag bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const validText = (value, min = 12) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const animations = scenes.filter((scene) => scene?.type === 'animation');
const policyPath = resolve(root, '05-projektdateien/phase1-motion-direction-v1.md');

const validateCommonSceneFields = (scene) => {
  const id = scene.id ?? 'Animation';
  const direction = scene.phase1MotionDirection;
  if (!direction || typeof direction !== 'object') {
    fail(`${id}: phase1MotionDirection fehlt.`);
    return null;
  }
  if (!validText(direction.spokenPoint, 18)) fail(`${id}: phase1MotionDirection.spokenPoint fehlt/ist zu vage.`);
  if (!validText(direction.viewerMustUnderstand, 18)) fail(`${id}: phase1MotionDirection.viewerMustUnderstand fehlt/ist zu vage.`);
  if (!validText(direction.visualQuestion, 14)) fail(`${id}: phase1MotionDirection.visualQuestion fehlt/ist zu vage.`);
  if (!validText(direction.chosenMechanism, 20)) fail(`${id}: phase1MotionDirection.chosenMechanism fehlt/ist zu vage.`);
  if (!validText(direction.mechanismRationale, 24)) fail(`${id}: phase1MotionDirection.mechanismRationale muss konkret erklären, warum diese Mechanik inhaltlich passt.`);
  if (!scene.motionDesign || typeof scene.motionDesign !== 'object') {
    fail(`${id}: motionDesign fehlt; Motion Direction muss anschließend technisch umgesetzt werden.`);
  }
  if (typeof scene.animationSourceFile !== 'string' || !scene.animationSourceFile.trim()) {
    fail(`${id}: animationSourceFile fehlt; Phase 1 muss die kanonische Animation umsetzen.`);
  }
  return direction;
};

if (contract.id === LEGACY_CONTRACT_ID) {
  for (const key of [
    'appliesToNewReelsOnly',
    'legacyReelsUntouched',
    'analyzeSpokenPointBeforeTechnique',
    'viewerUnderstandingBeforeImplementation',
    'visualQuestionBeforeTechnique',
    'mechanismDerivedFromContent',
    'noFixedAnimationMenu',
    'toolsFollowContent',
    'templateReuseOnlyWhenBestFit',
    'reuseNeedsExplicitJustification',
    'supportAssetsCannotDriveSceneConcept',
    'phase1DirectionMustPrecedeMotionDesign',
    'phase1DirectionMustPrecedeAnimationCode',
  ]) {
    if (contract[key] !== true) fail(`phase1MotionDirectionContract.${key} muss true sein.`);
  }

  if (!existsSync(policyPath)) {
    fail('05-projektdateien/phase1-motion-direction-v1.md fehlt.');
  } else {
    const policy = readFileSync(policyPath, 'utf8');
    if (!policy.includes(`PHASE1_MOTION_DIRECTION: ${LEGACY_CONTRACT_ID}`)) fail('phase1-motion-direction-v1.md enthält den Legacy-Vertragsmarker nicht.');
    if (!/Sprechpunkt/i.test(policy) || !/Verständnisziel/i.test(policy) || !/keine Animations-Auswahlliste/i.test(policy)) {
      fail('phase1-motion-direction-v1.md muss die bisherige Content-first-Regel und das Verbot einer festen Animations-Auswahlliste enthalten.');
    }
  }

  for (const scene of animations) {
    const id = scene.id ?? 'Animation';
    const direction = validateCommonSceneFields(scene);
    if (!direction) continue;
    const decision = String(direction.reuseDecision ?? '').trim();
    if (!['invent-new', 'reuse-best-fit'].includes(decision)) {
      fail(`${id}: phase1MotionDirection.reuseDecision muss invent-new oder reuse-best-fit sein.`);
    }
    const reusedTechniqueId = String(direction.reusedTechniqueId ?? '').trim();
    const reuseJustification = String(direction.reuseJustification ?? '').trim();
    if (decision === 'invent-new') {
      if (reusedTechniqueId !== 'none') fail(`${id}: bei invent-new muss reusedTechniqueId "none" sein.`);
      if (reuseJustification !== 'none') fail(`${id}: bei invent-new muss reuseJustification "none" sein.`);
    }
    if (decision === 'reuse-best-fit') {
      if (!slug.test(reusedTechniqueId) || reusedTechniqueId === 'none') {
        fail(`${id}: bei reuse-best-fit muss reusedTechniqueId eine konkrete Technik-ID als slug enthalten.`);
      }
      if (!validText(reuseJustification, 24) || /^none$/i.test(reuseJustification)) {
        fail(`${id}: Wiederverwendung braucht eine konkrete inhaltliche reuseJustification.`);
      }
    }
  }

  if (errors.length) {
    console.error('\nPhase-1-Individual-Motion-V1 verletzt:\n');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }
  console.log(`\n✓ Legacy Motion Direction erfüllt: ${LEGACY_CONTRACT_ID}`);
  console.log(`✓ ${animations.length} Legacy-Animationsszenen behalten ihre bisherigen Qualitätsregeln.`);
  process.exit(0);
}

if (contract.id !== CONTRACT_ID) {
  fail(`phase1MotionDirectionContract.id muss ${CONTRACT_ID} oder ${LEGACY_CONTRACT_ID} sein.`);
} else {
  if (contract.financeMotionLibraryId !== LIBRARY_ID) fail(`phase1MotionDirectionContract.financeMotionLibraryId muss ${LIBRARY_ID} sein.`);
  for (const key of [
    'appliesToNewReelsOnly',
    'legacyReelsUntouched',
    'analyzeSpokenPointBeforeTechnique',
    'viewerUnderstandingBeforeImplementation',
    'visualQuestionBeforeTechnique',
    'mechanismDerivedFromContent',
    'librarySearchAfterMechanismDefinition',
    'libraryBestFitPreferred',
    'libraryUseNeverForced',
    'customBuildAllowed',
    'reusableCustomMechanicsMayBecomeLibraryCandidates',
    'parametersMustFollowSceneContent',
    'supportAssetsCannotDriveSceneConcept',
    'phase1DirectionMustPrecedeMotionDesign',
    'phase1DirectionMustPrecedeAnimationCode',
  ]) {
    if (contract[key] !== true) fail(`phase1MotionDirectionContract.${key} muss true sein.`);
  }

  if (!existsSync(policyPath)) {
    fail('05-projektdateien/phase1-motion-direction-v1.md fehlt.');
  } else {
    const policy = readFileSync(policyPath, 'utf8');
    if (!policy.includes(`PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}`)) fail('phase1-motion-direction-v1.md enthält den Hybrid-Vertragsmarker nicht.');
    if (!policy.includes(`FINANCE_MOTION_LIBRARY: ${LIBRARY_ID}`)) fail('phase1-motion-direction-v1.md enthält den Library-Marker nicht.');
    if (!/Sprechpunkt/i.test(policy) || !/Verständnisziel/i.test(policy) || !/Library ist Werkzeug/i.test(policy)) {
      fail('phase1-motion-direction-v1.md muss Content-first-Reihenfolge und Library-als-Werkzeug-Regel festlegen.');
    }
  }

  for (const scene of animations) {
    const id = scene.id ?? 'Animation';
    const direction = validateCommonSceneFields(scene);
    if (!direction) continue;
    const decision = String(direction.implementationDecision ?? '').trim();
    if (!['library-best-fit', 'custom-build'].includes(decision)) {
      fail(`${id}: implementationDecision muss library-best-fit oder custom-build sein.`);
    }
    const financeMotionId = String(direction.financeMotionId ?? '').trim();
    const libraryFitReason = String(direction.libraryFitReason ?? '').trim();
    const parameterPlan = String(direction.parameterPlan ?? '').trim();
    const customReason = String(direction.customReason ?? '').trim();

    if (decision === 'library-best-fit') {
      if (!slug.test(financeMotionId) || financeMotionId === 'none') fail(`${id}: library-best-fit braucht eine konkrete financeMotionId als slug.`);
      if (!validText(libraryFitReason, 24) || /^none$/i.test(libraryFitReason)) fail(`${id}: library-best-fit braucht eine konkrete libraryFitReason.`);
      if (!validText(parameterPlan, 18) || /^none$/i.test(parameterPlan)) fail(`${id}: library-best-fit braucht einen konkreten parameterPlan.`);
      if (customReason !== 'none') fail(`${id}: bei library-best-fit muss customReason "none" sein.`);
    }

    if (decision === 'custom-build') {
      if (financeMotionId !== 'none') fail(`${id}: custom-build muss financeMotionId "none" setzen.`);
      if (libraryFitReason !== 'none') fail(`${id}: custom-build muss libraryFitReason "none" setzen.`);
      if (parameterPlan !== 'none') fail(`${id}: custom-build muss parameterPlan "none" setzen.`);
      if (!validText(customReason, 24) || /^none$/i.test(customReason)) fail(`${id}: custom-build braucht eine konkrete Begründung, warum kein Library-Best-Fit reicht.`);
    }

    if (typeof direction.libraryPromotionCandidate !== 'boolean') {
      fail(`${id}: libraryPromotionCandidate muss true oder false sein.`);
    }
  }
}

if (errors.length) {
  console.error('\nPhase-1-Hybrid-Motion-V2 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Phase 1 Motion Direction erfüllt: ${CONTRACT_ID}`);
console.log(`✓ ${animations.length} Animationsszenen: Content-first, dann Library-Best-Fit oder begründeter Custom-Build.`);
