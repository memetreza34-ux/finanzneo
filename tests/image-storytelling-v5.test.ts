import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-image-storytelling-v5.mjs');
const v3Validator = resolve('scripts/validate-future-image-storytelling-v3.mjs');
const v4Validator = resolve('scripts/validate-future-image-storytelling-v4.mjs');
const WORLD = 'finanzneo-stylized-3d-animated-black-v9';
const CONTRACT = 'finanzneo-image-storytelling-v5';
const SEQUENCE = 'finanzneo-visual-sequence-plan-v1';
const POLICY = `IMAGE_STORYTELLING_CONTRACT: ${CONTRACT}
VISUAL_SEQUENCE_PLAN: ${SEQUENCE}
IMAGE_WORLD_LOCK_PRESERVED: ${WORLD}
SEQUENCE-FIRST VISUAL STORYTELLING V5`;

const contract = {
  id: CONTRACT,
  appliesToNewReelsOnly: true,
  legacyV3V4Compatible: true,
  imageWorldLockPreserved: WORLD,
  sequencePlanningRequiredBeforePrompts: true,
  groundedAnchorRequired: true,
  recognizableFinanceContextRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  transferabilityTestRequired: true,
  creativeDirectionRequired: true,
  visualPurposeRequired: true,
  storyActionRequired: true,
  conflictOrConsequenceRequired: true,
  visualHookUnderOneSecondRequired: true,
  shotScaleRequired: true,
  cameraAngleRequired: true,
  depthPlanRequired: true,
  emotionalBeatRequired: true,
  causeEffectRequired: true,
  patternInterruptDecisionRequired: true,
  motionHintRequired: true,
  noveltyCheckRequired: true,
  visualDiversityAcrossSequenceRequired: true,
  energyArcRequired: true,
  archetypeRotationRequired: true,
  locationRotationRequired: true,
  compositionRotationRequired: true,
  humanPresenceRotationRequired: true,
  mainSubjectRotationRequired: true,
  maxSameVisualModeInRow: 2,
  maxSameShotScaleInRow: 2,
  maxSameCameraAngleInRow: 2,
  maxSameLocationFamilyInRow: 2,
  maxSameMainSubjectFamilyInRow: 2,
  maxSameCompositionFamilyInRow: 1,
  maxSameArchetypeInRow: 1,
  maxTableDocumentScenesPerSixImages: 2,
  maxImagesWithoutPatternInterrupt: 2,
  firstTwoNeedHighEnergyScene: true,
  groundedMetaphorAllowed: true,
  groundedMetaphorNeedsExplicitJustification: true,
  abstractRiddleForbidden: true,
  genericFinanceIconAsMainStoryForbidden: true,
  staticCatalogCompositionForbidden: true,
  worldStyleOverrideForbidden: true,
  photorealismForbidden: true,
  labelsSupplementalOnly: true,
};

type Meta = {
  strategy: string;
  visualMode: string;
  sequenceRole: string;
  energyLevel: number;
  visualArchetype: string;
  locationFamily: string;
  humanPresence: string;
  compositionFamily: string;
  mainSubjectFamily: string;
  tableDocumentScene: boolean;
  literalSituation: string;
  contextAnchor: string;
  voiceVisualMatch: string;
  transferabilityTest: string;
  visualPurpose: string;
  storyAction: string;
  tensionOrConsequence: string;
  visualHook: string;
  shotScale: string;
  cameraAngle: string;
  depthPlan: string;
  emotionalBeat: string;
  causeEffect: string;
  patternInterrupt: string;
  motionHint: string;
  noveltyCheck: string;
  metaphorJustification: string;
};

const baseMeta = (overrides: Partial<Meta> = {}): Meta => ({
  strategy: 'literal',
  visualMode: 'cause-effect',
  sequenceRole: 'hook',
  energyLevel: 5,
  visualArchetype: 'character-action',
  locationFamily: 'Küche',
  humanPresence: 'single-person',
  compositionFamily: 'face-led',
  mainSubjectFamily: 'Gehaltsumschlag',
  tableDocumentScene: true,
  literalSituation: 'Eine Person legt ihr Gehalt auf den Küchentisch, während Fixkosten bereits sichtbar warten.',
  contextAnchor: 'Monatlicher Haushalts-Cashflow direkt nach Gehaltseingang',
  voiceVisualMatch: 'Fixkosten liegen bereits am Gehaltsumschlag und beanspruchen sichtbar einen großen Teil.',
  transferabilityTest: 'PASS - Gehalt und konkrete Fixkosten machen die Szene spezifisch für monatlichen Cashflow.',
  visualPurpose: 'Druck der Fixkosten sofort verstehen',
  storyAction: 'Die Person legt den Gehaltsumschlag ab, während Rechnungen ihn sichtbar bedrängen.',
  tensionOrConsequence: 'Ein großer Teil des verfügbaren Geldes ist bereits gebunden.',
  visualHook: 'Der große Gehaltsumschlag wird von Kostenbelegen sichtbar eingekreist.',
  shotScale: 'close-up',
  cameraAngle: 'low-angle',
  depthPlan: 'Rechnungen im Vordergrund, Gehalt zentral, Gesicht klar dahinter.',
  emotionalBeat: 'Druck und sofortige Wiedererkennung',
  causeEffect: 'Gehalt kommt an und wird im selben Moment sichtbar von Fixkosten beansprucht.',
  patternInterrupt: 'hook',
  motionHint: 'hard hold',
  noveltyCheck: 'PASS - Erste Szene eröffnet mit aggressivem Close-up und klarer menschlicher Reaktion.',
  metaphorJustification: 'none',
  ...overrides,
});

const markerMap: Array<[string, keyof Meta]> = [
  ['VISUAL_STRATEGY', 'strategy'],
  ['VISUAL_MODE', 'visualMode'],
  ['SEQUENCE_ROLE', 'sequenceRole'],
  ['ENERGY_LEVEL', 'energyLevel'],
  ['VISUAL_ARCHETYPE', 'visualArchetype'],
  ['LOCATION_FAMILY', 'locationFamily'],
  ['HUMAN_PRESENCE', 'humanPresence'],
  ['COMPOSITION_FAMILY', 'compositionFamily'],
  ['MAIN_SUBJECT_FAMILY', 'mainSubjectFamily'],
  ['TABLE_DOCUMENT_SCENE', 'tableDocumentScene'],
  ['LITERAL_REAL_WORLD_SITUATION', 'literalSituation'],
  ['REAL_WORLD_CONTEXT_ANCHOR', 'contextAnchor'],
  ['VOICEOVER_VISUAL_MATCH', 'voiceVisualMatch'],
  ['TRANSFERABILITY_TEST', 'transferabilityTest'],
  ['VISUAL_PURPOSE', 'visualPurpose'],
  ['STORY_ACTION', 'storyAction'],
  ['TENSION_OR_CONSEQUENCE', 'tensionOrConsequence'],
  ['VISUAL_HOOK', 'visualHook'],
  ['SHOT_SCALE', 'shotScale'],
  ['CAMERA_ANGLE', 'cameraAngle'],
  ['DEPTH_PLAN', 'depthPlan'],
  ['EMOTIONAL_BEAT', 'emotionalBeat'],
  ['CAUSE_EFFECT', 'causeEffect'],
  ['PATTERN_INTERRUPT', 'patternInterrupt'],
  ['MOTION_HINT', 'motionHint'],
  ['NOVELTY_CHECK', 'noveltyCheck'],
  ['METAPHOR_JUSTIFICATION', 'metaphorJustification'],
];

const promptFor = (meta: Meta) => `${markerMap.map(([marker, key]) => `${marker}: ${meta[key]}`).join('\n')}

IMAGE PROMPT:
Show the exact grounded finance beat in the locked FinanzNeo V9 world.

${POLICY}
`;

const makeReel = (customize?: (metas: Meta[]) => void) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v5-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  const metas = [
    baseMeta(),
    baseMeta({
      visualMode: 'pov', sequenceRole: 'detail', energyLevel: 3, visualArchetype: 'pov', locationFamily: 'Café', humanPresence: 'hands-only', compositionFamily: 'object-led', mainSubjectFamily: 'Alltagskauf', tableDocumentScene: false,
      literalSituation: 'Mehrere kleine Alltagskäufe liegen aus POV-Perspektive sichtbar nebeneinander.',
      contextAnchor: 'Kaffee und spontane kleine Ausgaben im Alltag',
      voiceVisualMatch: 'Mehrere kleine Preise stehen gleichzeitig im Bild und zeigen die Summe der Gewohnheit.',
      storyAction: 'Hände legen den letzten kleinen Kassenbon zu mehreren bereits vorhandenen Käufen.',
      tensionOrConsequence: 'Viele kleine Beträge reduzieren zusammen sichtbar das übrige Budget.',
      visualHook: 'Top-down POV auf mehrere echte Kleinkäufe mit stark unterschiedlicher Form.',
      shotScale: 'macro', cameraAngle: 'top-down', depthPlan: 'Hände am Rand, Käufe zentral, Umgebung nur als knapper Kontext.', emotionalBeat: 'Überraschung über die Summe kleiner Käufe',
      causeEffect: 'Jeder kleine Kauf liegt neben dem sichtbar kleiner werdenden Restbudget.', patternInterrupt: 'camera-change', noveltyCheck: 'PASS - Wechsel von menschlichem Low-Angle-Hook zu objektgeführtem Top-down-POV.', transferabilityTest: 'PASS - Konkrete Alltagskäufe machen die Szene spezifisch für kleine Konsumausgaben.',
    }),
    baseMeta({
      visualMode: 'object-story', sequenceRole: 'payoff', energyLevel: 2, visualArchetype: 'object-story', locationFamily: 'Arbeitsplatz', humanPresence: 'hands-only', compositionFamily: 'process', mainSubjectFamily: 'Dauerauftrag', tableDocumentScene: false,
      literalSituation: 'Ein fester Sparbetrag wird direkt nach Gehaltseingang sichtbar zuerst zurückgelegt.', contextAnchor: 'Automatisierter Sparprozess am Monatsanfang', voiceVisualMatch: 'Der feste Sparbetrag wird vor allen anderen Ausgaben in die Rücklage gelegt.',
      storyAction: 'Eine Hand schiebt den Dauerauftrag sichtbar in die grüne Rücklage.', tensionOrConsequence: 'Sparen hängt nicht mehr davon ab, ob am Monatsende zufällig Geld übrig bleibt.', visualHook: 'Der erste sichtbare Geldweg führt direkt in die geschützte Rücklage.', shotScale: 'medium', cameraAngle: 'over-shoulder',
      depthPlan: 'Hand vorne, Sparvorgang zentral, geschlossene Ausgabenobjekte dahinter.', emotionalBeat: 'Kontrolle und Erleichterung', causeEffect: 'Automatisierung trennt Sparen sichtbar vor dem späteren Konsum ab.', patternInterrupt: 'payoff', noveltyCheck: 'PASS - Ruhiger Prozess-Payoff nach POV-Detail; neuer Ort und neue Kompositionsfamilie.', transferabilityTest: 'PASS - Dauerauftrag und Rücklage machen die Szene spezifisch für Save-first.',
    }),
  ];
  customize?.(metas);

  const scenes = metas.map((meta, i) => ({id: `scene-0${i + 1}`, type: 'image', planFile: `EINZELNE-SZENEN/scene-0${i + 1}/bildprompt.txt`, imageStorytelling: meta}));
  const sequence = {id: SEQUENCE, contractId: CONTRACT, status: 'PLAN_BEFORE_PROMPTS', imageSceneOrder: scenes.map((scene) => scene.id), rules: {planWholeSequenceBeforeIndividualPrompts: true, storyArcRequired: true, energyScale: [1, 5], firstTwoNeedEnergyAtLeast: 4, maxSameCompositionFamilyInRow: 1, maxSameArchetypeInRow: 1, maxSameLocationFamilyInRow: 2, maxSameMainSubjectFamilyInRow: 2, maxSameCameraAngleInRow: 2, maxTableDocumentScenesPerSixImages: 2, maxImagesWithoutPatternInterrupt: 2, cameraDirectionOverridesGenericStyleFraming: true, locationMustServeVoiceBeat: true, noveltyMustBeSequenceRelative: true}};

  write('03-szenen/scene-index.json', JSON.stringify({imageStorytellingContract: contract, visualSequencePlan: sequence, scenes}, null, 2));
  scenes.forEach((scene, i) => write(`03-szenen/${scene.planFile}`, promptFor(metas[i])));
  write('03-szenen/alle-bildprompts.txt', scenes.map((_, i) => promptFor(metas[i])).join('\n') + POLICY);
  write('03-szenen/bildwelt.txt', POLICY);
  write('03-szenen/00-cover/cover.txt', promptFor(metas[0]));
  write('05-projektdateien/szenenplan.md', POLICY);
  write('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', POLICY);
  write('05-projektdateien/VISUAL-SEQUENCE-PLAN.md', POLICY);
  return root;
};

test('V5 akzeptiert sequence-first Visual-Regie ohne Änderung der V9-Bildwelt', () => {
  const root = makeReel();
  try { execFileSync(process.execPath, [validator, root], {stdio: 'pipe'}); } finally { rmSync(root, {recursive: true, force: true}); }
});

test('V5 blockiert dieselbe Composition-Family direkt hintereinander', () => {
  const root = makeReel((metas) => { metas[1].compositionFamily = metas[0].compositionFamily; });
  try { const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'}); assert.notEqual(result.status, 0); assert.match(result.stderr, /COMPOSITION_FAMILY|composition/i); } finally { rmSync(root, {recursive: true, force: true}); }
});

test('V5 verlangt einen High-Energy-Beat unter den ersten zwei Bildern', () => {
  const root = makeReel((metas) => { metas[0].energyLevel = 2; metas[1].energyLevel = 3; });
  try { const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'}); assert.notEqual(result.status, 0); assert.match(result.stderr, /ENERGY_LEVEL|Energy/i); } finally { rmSync(root, {recursive: true, force: true}); }
});

test('Legacy-V3/V4-Validatoren überlassen V5 dem V5-Validator', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v5-compat-'));
  try { mkdirSync(join(root, '03-szenen'), {recursive: true}); writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify({imageStorytellingContract: {id: CONTRACT}})); execFileSync(process.execPath, [v3Validator, root], {stdio: 'pipe'}); execFileSync(process.execPath, [v4Validator, root], {stdio: 'pipe'}); } finally { rmSync(root, {recursive: true, force: true}); }
});
