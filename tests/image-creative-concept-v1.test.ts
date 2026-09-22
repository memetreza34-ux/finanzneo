import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';
import {evaluateVisionQaResult} from '../scripts/lib/image-vision-qa.mjs';

const compiler = resolve('scripts/compile-future-image-prompts-v5.mjs');
const validator = resolve('scripts/validate-image-creative-concept-v1.mjs');
const CONTRACT = 'finanzneo-image-storytelling-v5';
const HARDENING = 'finanzneo-image-storytelling-v5-hardening-v1';
const CREATIVE = 'finanzneo-image-creative-concept-v1';

type Meta = Record<string, string | number | boolean>;

const meta = (overrides: Meta = {}): Meta => ({
  strategy: 'literal', visualMode: 'object-story', sequenceRole: 'hook', energyLevel: 4,
  visualArchetype: 'object-story', locationFamily: 'Wohnung', locationClass: 'home',
  humanPresence: 'none', compositionFamily: 'object-led', mainSubjectFamily: 'Rücklage', mainSubjectClass: 'savings',
  tableDocumentScene: false,
  literalSituation: 'Ein einzelner grüner Notgroschen-Ordner steht zwischen einer kaputten Waschmaschine und dem übrigen Haushalt.',
  contextAnchor: 'Realer Haushalts-Notgroschen für eine unerwartete Reparatur',
  voiceVisualMatch: 'Der Notgroschen ist als klarer Puffer für die unerwartete Reparatur sichtbar.',
  visualPurpose: 'Schutzfunktion der Rücklage sofort verstehen',
  storyAction: 'Keine aktive Handlung nötig; die räumliche Position des einzelnen Schutzobjekts trägt die Aussage.',
  tensionOrConsequence: 'Ohne den Ordner würde die Reparatur direkt das Haushaltsgeld treffen.',
  visualHook: 'Ein einziges grünes Schutzobjekt steht dominant vor dem roten Reparaturproblem.',
  shotScale: 'close-up', cameraAngle: 'low-angle', depthPlan: 'Ordner dominant vorne, kaputte Waschmaschine klar im Hintergrund.',
  emotionalBeat: 'Erleichterung durch vorhandenen Puffer', causeEffect: 'Die Rücklage trennt das Reparaturproblem sichtbar vom übrigen Geld.',
  patternInterrupt: 'starker minimalistischer Objekt-Hook', patternInterruptType: 'reveal', motionHint: 'slow push-in',
  noveltyCheck: 'PASS - bewusst nur ein dominantes Finanzobjekt statt einer Erklärgegenstand-Sammlung.',
  lightingVariation: 'rim-heavy', labelBudget: 1, labelBudgetJustification: 'none', metaphorJustification: 'none',
  conceptMode: 'single-iconic-object',
  viewerThought: 'Gut, genau dafür ist ein Notgroschen da.',
  entertainmentHook: 'Ein einziges grünes Objekt wirkt wie der klare Held vor dem Reparaturproblem.',
  memorabilityHook: 'Der dominante grüne Rücklagen-Ordner vor der defekten Waschmaschine bleibt als Schutzbild im Kopf.',
  realityAnchor: 'Kaputte Waschmaschine und realer Notgroschen im Haushalt.',
  fantasyLevel: 0,
  fantasyJustification: 'none',
  whyThisConcept: 'Ein starkes Einzelobjekt erklärt den Puffer klarer und merkbarer als eine weitere Person-am-Tisch-Szene.',
  ...overrides,
});

const prompt = (m: Meta) => `VISUAL_STRATEGY: ${m.strategy}
VISUAL_MODE: ${m.visualMode}
SEQUENCE_ROLE: ${m.sequenceRole}
ENERGY_LEVEL: ${m.energyLevel}
VISUAL_ARCHETYPE: ${m.visualArchetype}
LOCATION_FAMILY: ${m.locationFamily}
LOCATION_CLASS: ${m.locationClass}
HUMAN_PRESENCE: ${m.humanPresence}
COMPOSITION_FAMILY: ${m.compositionFamily}
MAIN_SUBJECT_FAMILY: ${m.mainSubjectFamily}
MAIN_SUBJECT_CLASS: ${m.mainSubjectClass}
TABLE_DOCUMENT_SCENE: ${m.tableDocumentScene}
LITERAL_REAL_WORLD_SITUATION: ${m.literalSituation}
REAL_WORLD_CONTEXT_ANCHOR: ${m.contextAnchor}
VOICEOVER_VISUAL_MATCH: ${m.voiceVisualMatch}
VISUAL_PURPOSE: ${m.visualPurpose}
STORY_ACTION: ${m.storyAction}
TENSION_OR_CONSEQUENCE: ${m.tensionOrConsequence}
VISUAL_HOOK: ${m.visualHook}
SHOT_SCALE: ${m.shotScale}
CAMERA_ANGLE: ${m.cameraAngle}
DEPTH_PLAN: ${m.depthPlan}
EMOTIONAL_BEAT: ${m.emotionalBeat}
CAUSE_EFFECT: ${m.causeEffect}
PATTERN_INTERRUPT: ${m.patternInterrupt}
PATTERN_INTERRUPT_TYPE: ${m.patternInterruptType}
MOTION_HINT: ${m.motionHint}
NOVELTY_CHECK: ${m.noveltyCheck}
LIGHTING_VARIATION: ${m.lightingVariation}
LABEL_BUDGET: ${m.labelBudget}
LABEL_BUDGET_JUSTIFICATION: ${m.labelBudgetJustification}
CONCEPT_MODE: ${m.conceptMode}
VIEWER_THOUGHT: ${m.viewerThought}
ENTERTAINMENT_HOOK: ${m.entertainmentHook}
MEMORABILITY_HOOK: ${m.memorabilityHook}
REALITY_ANCHOR: ${m.realityAnchor}
FANTASY_LEVEL: ${m.fantasyLevel}
FANTASY_JUSTIFICATION: ${m.fantasyJustification}
WHY_THIS_CONCEPT: ${m.whyThisConcept}

IMAGE PROMPT:
Create the exact planned concept inside the locked FinanzNeo V9 world.

STYLE:
Locked FinanzNeo V9 world.
`;

const makeReel = (m = meta()) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-creative-concept-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };
  const contract = {
    id: CONTRACT, hardeningId: HARDENING, creativeConceptId: CREATIVE,
    creativeConceptRequired: true, entertainmentFirstButRelevant: true, singleIconicObjectAllowed: true,
    peopleOptional: true, visualMetaphorAllowed: true, controlledFantasyAllowed: true,
    thoughtVisualizationAllowed: true, conceptTypeQuotaForbidden: true, strongestConceptWins: true,
  };
  const scene = {id: 'scene-01', type: 'image', planFile: 'EINZELNE-SZENEN/scene-01/bildprompt.txt', imageStorytelling: m};
  write('03-szenen/scene-index.json', JSON.stringify({imageStorytellingContract: contract, scenes: [scene]}, null, 2));
  write(`03-szenen/${scene.planFile}`, prompt(m));
  write('03-szenen/00-cover/cover.txt', prompt(m));
  write('03-szenen/alle-bildprompts.txt', prompt(m));
  return root;
};

test('starkes einzelnes Objekt ist ein vollständig gültiges Creative Concept', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
    const source = readFileSync(join(root, '03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt'), 'utf8');
    assert.match(source, /Creative concept mode: single-iconic-object/);
    assert.match(source, /Entertainment \/ scroll-stop hook:/);
    assert.match(source, /One iconic object is valid/);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('kontrollierte Fantasie braucht eine konkrete Begründung', () => {
  const root = makeReel(meta({conceptMode: 'controlled-fantasy', fantasyLevel: 2, fantasyJustification: 'none'}));
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /fantasyJustification/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

const passingVision = () => ({
  contractId: 'finanzneo-image-vision-qa-v1', evaluatorMode: 'multimodal-pixel-review',
  scores: {
    planAlignment: 92, cameraCompliance: 88, hookStrength: 86, visualInterest: 90,
    worldConsistency: 95, compositionClarity: 91, sequenceNovelty: 84,
    conceptClarity: 94, entertainmentValue: 88, memorability: 87, viewerThoughtMatch: 92,
  },
  flags: {
    photorealistic: false, genericFinanceIconMain: false, staticCatalogLike: false, wrongBackground: false,
    headlineOrSentenceInsideImage: false, labelBudgetExceeded: false, sceneMismatch: false,
    genericDeskScene: false, deadSpaceDominant: false,
    boringLiteral: false, decorativeWithoutMeaning: false, fantasyConfusing: false, overexplainedPropLayout: false,
  },
  evidence: [
    'The single green reserve folder dominates the foreground as the planned hero object.',
    'The broken washing machine remains clearly readable behind it as the real-world repair anchor.',
    'No extra explanatory prop collection distracts from the one memorable visual idea.',
  ],
  verdict: 'PASS', regenerationInstruction: 'none',
});

test('Vision-QA bestraft ein starkes Einzelobjekt nicht wegen fehlender Handlung', () => {
  const evaluation = evaluateVisionQaResult(passingVision(), {creativeConceptRequired: true, conceptMode: 'single-iconic-object'});
  assert.equal(evaluation.expectedVerdict, 'PASS');
  assert.deepEqual(evaluation.errors, []);
});

test('Vision-QA blockiert langweilige Literalität', () => {
  const result = passingVision();
  result.flags.boringLiteral = true;
  result.verdict = 'REGENERATE';
  result.regenerationInstruction = 'Regenerate with a more memorable concept that still communicates the same finance beat immediately.';
  const evaluation = evaluateVisionQaResult(result, {creativeConceptRequired: true, conceptMode: 'single-iconic-object'});
  assert.equal(evaluation.expectedVerdict, 'REGENERATE');
  assert.match(evaluation.errors.join('\n'), /boringLiteral/);
});
