#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-future-reel-phase1-motion-direction-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-phase1-individual-motion-v1';
const MOTION_CORE_ID = 'finanzneo-motion-core-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const contract = index.phase1MotionDirectionContract;
if (!contract) {
  console.log('✓ Reel ohne Phase-1-Individual-Motion-V1 bleibt rückwärtskompatibel.');
  process.exit(0);
}

const errors = [];
const fail = (message) => errors.push(message);
const placeholder = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const validText = (value, min = 12) => typeof value === 'string' && value.trim().length >= min && !placeholder.test(value);
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const motionCoreEnabled = contract.motionCoreVersion === MOTION_CORE_ID;

if (contract.id !== CONTRACT_ID) fail(`phase1MotionDirectionContract.id muss ${CONTRACT_ID} sein.`);
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

if (contract.motionCoreVersion != null && !motionCoreEnabled) {
  fail(`phase1MotionDirectionContract.motionCoreVersion muss ${MOTION_CORE_ID} sein, wenn gesetzt.`);
}

if (motionCoreEnabled) {
  if (contract.canonicalMotionSource !== 'src/motion') fail('phase1MotionDirectionContract.canonicalMotionSource muss src/motion sein.');
  if (contract.mechanicSelectionRule !== '.agents/plugins/finanzneo-motion/rules/mechanic-selection.md') fail('mechanicSelectionRule zeigt nicht auf die kanonische FinanzNeo-Regel.');
  if (contract.motionDirectorSkill !== '.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md') fail('motionDirectorSkill zeigt nicht auf den kanonischen Remotion Director.');
  for (const key of [
    'semanticMechanicFamiliesNotTemplates',
    'mechanicLedgerRequired',
    'antiRepetitionGateRequired',
    'coreReuseBeforeLocalPrimitive',
    'legacyLabsNotStyleReference',
  ]) {
    if (contract[key] !== true) fail(`phase1MotionDirectionContract.${key} muss für ${MOTION_CORE_ID} true sein.`);
  }
}

const policyPath = resolve(root, '05-projektdateien/phase1-motion-direction-v1.md');
if (!existsSync(policyPath)) {
  fail('05-projektdateien/phase1-motion-direction-v1.md fehlt.');
} else {
  const policy = readFileSync(policyPath, 'utf8');
  if (!policy.includes(`PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}`)) fail('phase1-motion-direction-v1.md enthält den Vertragsmarker nicht.');
  if (!/Sprechpunkt/i.test(policy) || !/Verständnisziel/i.test(policy) || !/keine Animations-Auswahlliste|kein Animations-Menü/i.test(policy)) {
    fail('phase1-motion-direction-v1.md muss Content-first-Reihenfolge und Verbot eines festen Animations-Menüs festlegen.');
  }
  if (motionCoreEnabled && (!policy.includes(`MOTION_CORE: ${MOTION_CORE_ID}`) || !/src\/motion/.test(policy))) {
    fail(`phase1-motion-direction-v1.md muss ${MOTION_CORE_ID} und src/motion als technische Basis nennen.`);
  }
}

const ledgerPath = resolve(root, '05-projektdateien/motion-mechanic-ledger.md');
const ledger = motionCoreEnabled && existsSync(ledgerPath) ? readFileSync(ledgerPath, 'utf8') : '';
if (motionCoreEnabled && !existsSync(ledgerPath)) {
  fail('05-projektdateien/motion-mechanic-ledger.md fehlt; neue Motion-Core-Reels brauchen den Anti-Wiederholungs-Ledger.');
}

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const animations = scenes.filter((scene) => scene?.type === 'animation');
const mechanicIds = new Map();

for (const scene of animations) {
  const id = scene.id ?? 'Animation';
  const direction = scene.phase1MotionDirection;
  if (!direction || typeof direction !== 'object') {
    fail(`${id}: phase1MotionDirection fehlt.`);
    continue;
  }

  if (!validText(direction.spokenPoint, 18)) fail(`${id}: phase1MotionDirection.spokenPoint fehlt/ist zu vage.`);
  if (!validText(direction.viewerMustUnderstand, 18)) fail(`${id}: phase1MotionDirection.viewerMustUnderstand fehlt/ist zu vage.`);
  if (!validText(direction.visualQuestion, 14)) fail(`${id}: phase1MotionDirection.visualQuestion fehlt/ist zu vage.`);
  if (!validText(direction.chosenMechanism, 20)) fail(`${id}: phase1MotionDirection.chosenMechanism fehlt/ist zu vage.`);
  if (!validText(direction.mechanismRationale, 24)) fail(`${id}: phase1MotionDirection.mechanismRationale muss konkret erklären, warum diese Mechanik inhaltlich passt.`);

  if (motionCoreEnabled) {
    const mechanicId = String(direction.mechanicId ?? '').trim();
    if (!slug.test(mechanicId) || mechanicId === 'none') {
      fail(`${id}: phase1MotionDirection.mechanicId muss ein eindeutiger lower-kebab-case Slug sein.`);
    } else if (mechanicIds.has(mechanicId)) {
      fail(`${id}: mechanicId "${mechanicId}" dupliziert ${mechanicIds.get(mechanicId)}.`);
    } else {
      mechanicIds.set(mechanicId, id);
    }
    if (!validText(direction.heroObject, 6)) fail(`${id}: phase1MotionDirection.heroObject fehlt/ist zu vage.`);
    if (!(direction.supportObjects === 'none' || validText(direction.supportObjects, 4))) fail(`${id}: phase1MotionDirection.supportObjects fehlt/ist zu vage.`);
    if (!validText(direction.primaryAction, 18)) fail(`${id}: phase1MotionDirection.primaryAction fehlt/ist zu vage.`);
    if (!validText(direction.motionAxis, 5)) fail(`${id}: phase1MotionDirection.motionAxis fehlt/ist zu vage.`);
    if (!validText(direction.resultType, 8)) fail(`${id}: phase1MotionDirection.resultType fehlt/ist zu vage.`);
    if (!validText(direction.uniquenessRationale, 24)) fail(`${id}: phase1MotionDirection.uniquenessRationale muss die Abgrenzung zu den anderen Animationsszenen erklären.`);

    if (ledger) {
      if (!ledger.includes(id)) fail(`${id}: fehlt im motion-mechanic-ledger.md.`);
      if (mechanicId && slug.test(mechanicId) && !ledger.includes(mechanicId)) fail(`${id}: mechanicId ${mechanicId} fehlt im motion-mechanic-ledger.md.`);
    }
  }

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

  if (!scene.motionDesign || typeof scene.motionDesign !== 'object') {
    fail(`${id}: motionDesign fehlt; Phase-1-Motion-Direction muss vor der technischen Motion-Spezifikation stehen, diese aber anschließend vollständig ergänzen.`);
  }
  if (typeof scene.animationSourceFile !== 'string' || !scene.animationSourceFile.trim()) {
    fail(`${id}: animationSourceFile fehlt; nach der kreativen Herleitung muss Phase 1 die kanonische Animation umsetzen.`);
    continue;
  }

  if (motionCoreEnabled) {
    const sourcePath = resolve(root, '03-szenen', scene.animationSourceFile.replace(/^03-szenen\//, ''));
    if (!existsSync(sourcePath)) {
      fail(`${id}: animationSourceFile existiert nicht.`);
      continue;
    }
    const source = readFileSync(sourcePath, 'utf8');
    if (!/from\s+['"][^'"]*src\/motion(?:\/index)?['"]/.test(source)) {
      fail(`${id}: neue Motion-Core-Animation muss ihre kanonischen Physical-/Motion-Bausteine aus src/motion importieren.`);
    }
    const legacyCoreImport = /import\s*\{[^}]*\b(?:PremiumPhysicalStage|PhysicalObject|PhysicalBill|PhysicalCoinStack|PhysicalAccount|PhysicalReserveTank|PhysicalCalendarPage|PhysicalWasher)\b[^}]*\}\s*from\s*['"][^'"]*src\/design-system['"]/s;
    if (legacyCoreImport.test(source)) {
      fail(`${id}: Core-Primitives dürfen bei ${MOTION_CORE_ID} nicht mehr aus src/design-system importiert werden; Quelle ist src/motion.`);
    }
  }
}

if (errors.length) {
  console.error('\nPhase-1-Individual-Motion-V1 verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\n✓ Phase 1 Motion Direction erfüllt: ${CONTRACT_ID}`);
console.log(`✓ ${animations.length} Animationsszenen wurden Content-first dokumentiert; Wiederverwendung ist nur als begründeter Best-Fit erlaubt.`);
if (motionCoreEnabled) {
  console.log(`✓ ${MOTION_CORE_ID}: src/motion ist kanonische technische Quelle; Mechanik-Ledger und Anti-Wiederholungs-Metadaten sind vollständig.`);
}
