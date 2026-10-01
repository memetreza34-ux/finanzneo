import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-image-storytelling-v4.mjs');
const v3Validator = resolve('scripts/validate-future-image-storytelling-v3.mjs');
const WORLD = 'finanzneo-stylized-3d-animated-black-v9';
const POLICY = `IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v4
IMAGE_WORLD_LOCK_PRESERVED: ${WORLD}
Grounded first, not literal-only
VARIETY-RULE`;

const contract = {
  id: 'finanzneo-image-storytelling-v4',
  appliesToNewReelsOnly: true,
  legacyV3Compatible: true,
  imageWorldLockPreserved: WORLD,
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
  maxSameVisualModeInRow: 2,
  maxSameShotScaleInRow: 2,
  groundedMetaphorAllowed: true,
  groundedMetaphorNeedsExplicitJustification: true,
  abstractRiddleForbidden: true,
  genericFinanceIconAsMainStoryForbidden: true,
  staticCatalogCompositionForbidden: true,
  worldStyleOverrideForbidden: true,
  photorealismForbidden: true,
  labelsSupplementalOnly: true,
};

const makeMeta = (overrides: Record<string, string> = {}) => ({
  strategy: overrides.strategy ?? 'literal',
  visualMode: overrides.visualMode ?? 'cinematic-literal',
  literalSituation: overrides.literalSituation ?? 'Eine Person prüft vor einer Überweisung sichtbar Empfängername und IBAN.',
  contextAnchor: overrides.contextAnchor ?? 'Online-Banking am Schreibtisch mit echter Überweisung',
  voiceVisualMatch: overrides.voiceVisualMatch ?? 'Die abweichende IBAN stoppt die Überweisung sichtbar vor der Freigabe.',
  transferabilityTest: overrides.transferabilityTest ?? 'PASS - Die konkrete Name-IBAN-Prüfung passt nicht unverändert zu fünf anderen Finanzthemen.',
  visualPurpose: overrides.visualPurpose ?? 'Gefahr sofort erkennen und die Prüfung verstehen',
  storyAction: overrides.storyAction ?? 'Der Finger stoppt direkt über dem Freigabe-Knopf, während die Abweichung sichtbar wird.',
  tensionOrConsequence: overrides.tensionOrConsequence ?? 'Die Zahlung steht unmittelbar vor einer falschen Freigabe.',
  visualHook: overrides.visualHook ?? 'Große rote IBAN-Abweichung direkt neben dem schwebenden Finger.',
  shotScale: overrides.shotScale ?? 'close-up',
  cameraAngle: overrides.cameraAngle ?? 'over-shoulder',
  depthPlan: overrides.depthPlan ?? 'Hand im Vordergrund, Überweisung zentral, Person weich im Hintergrund.',
  emotionalBeat: overrides.emotionalBeat ?? 'Spannung vor einem vermeidbaren Fehler',
  causeEffect: overrides.causeEffect ?? 'Abweichende Daten führen sichtbar zum gestoppten Zahlungsvorgang.',
  patternInterrupt: overrides.patternInterrupt ?? 'close-up statt vorheriger weiter Einstellung',
  motionHint: overrides.motionHint ?? 'slow push-in auf die Abweichung',
  noveltyCheck: overrides.noveltyCheck ?? 'PASS - Nahes Over-Shoulder-Framing und die gestoppte Hand unterscheiden die Szene klar von den vorherigen Bildern.',
  metaphorJustification: overrides.metaphorJustification ?? 'none',
});

const markerMap: Array<[string, keyof ReturnType<typeof makeMeta>]> = [
  ['VISUAL_STRATEGY', 'strategy'],
  ['VISUAL_MODE', 'visualMode'],
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

const promptFor = (meta: ReturnType<typeof makeMeta>) => `${markerMap.map(([marker, key]) => `${marker}: ${meta[key]}`).join('\n')}

IMAGE PROMPT:
Show the grounded bank-transfer moment as a premium stylized 3D scene on the locked FinanzNeo deep-black world.

${POLICY}
`;

const makeReel = (overrides: Record<string, string> = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v4-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };
  const meta = makeMeta(overrides);
  const prompt = promptFor(meta);
  const index = {
    imageStorytellingContract: contract,
    scenes: [{
      id: 'scene-01',
      type: 'image',
      planFile: 'EINZELNE-SZENEN/scene-01/bildprompt.txt',
      imageStorytelling: meta,
    }],
  };

  write('03-szenen/scene-index.json', JSON.stringify(index, null, 2));
  write('03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt', prompt);
  write('03-szenen/alle-bildprompts.txt', prompt + '\n' + POLICY);
  write('03-szenen/bildwelt.txt', POLICY);
  write('03-szenen/00-cover/cover.txt', prompt);
  write('05-projektdateien/szenenplan.md', POLICY);
  write('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', POLICY);
  return root;
};

test('V4 akzeptiert grounded cinematic storytelling ohne Änderung der V9-Bildwelt', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('V4 blockiert einen fehlenden konkreten Novelty-Check', () => {
  const root = makeReel({noveltyCheck: 'gleich wie vorher'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /noveltyCheck|NOVELTY/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('V3-Validator blockiert V4 nicht und überlässt es dem V4-Validator', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v4-compat-'));
  try {
    mkdirSync(join(root, '03-szenen'), {recursive: true});
    writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify({imageStorytellingContract: {id: 'finanzneo-image-storytelling-v4'}}));
    execFileSync(process.execPath, [v3Validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
