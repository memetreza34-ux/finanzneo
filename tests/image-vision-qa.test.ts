import assert from 'node:assert/strict';
import test from 'node:test';
import {evaluateVisionQaResult, IMAGE_VISION_QA_ID} from '../scripts/lib/image-vision-qa.mjs';

const baseResult = () => ({
  contractId: IMAGE_VISION_QA_ID,
  evaluatorMode: 'multimodal-pixel-review',
  scores: {
    planAlignment: 92,
    cameraCompliance: 88,
    actionReadability: 90,
    hookStrength: 86,
    visualInterest: 84,
    worldConsistency: 95,
    compositionClarity: 91,
    sequenceNovelty: 82,
  },
  flags: {
    photorealistic: false,
    genericFinanceIconMain: false,
    staticCatalogLike: false,
    wrongBackground: false,
    headlineOrSentenceInsideImage: false,
    labelBudgetExceeded: false,
    sceneMismatch: false,
    genericDeskScene: false,
    deadSpaceDominant: false,
  },
  evidence: [
    'Low-angle camera is visibly below the main subject.',
    'The main action clearly shows money leaving the account.',
    'The background is seamless deep black with stylized 3D materials.',
  ],
  verdict: 'PASS',
  regenerationInstruction: 'none',
});

test('starke multimodale Pixel-QA besteht', () => {
  const result = evaluateVisionQaResult(baseResult());
  assert.equal(result.expectedVerdict, 'PASS');
  assert.deepEqual(result.errors, []);
});

test('langweilige generische Schreibtischszene wird bei schwachem Visual Interest blockiert', () => {
  const input = baseResult();
  input.scores.visualInterest = 68;
  input.flags.genericDeskScene = true;
  input.verdict = 'REGENERATE';
  input.regenerationInstruction = 'Replace the generic desk staging with a strong visible cause-effect action and a more distinctive camera angle.';
  const result = evaluateVisionQaResult(input);
  assert.equal(result.expectedVerdict, 'REGENERATE');
  assert.ok(result.errors.some((error) => error.includes('visualInterest')));
  assert.ok(result.errors.some((error) => error.includes('genericDeskScene')));
});

test('Cover braucht einen stärkeren Hook als normale Bildszenen', () => {
  const normalInput = baseResult();
  normalInput.scores.hookStrength = 78;
  normalInput.verdict = 'PASS';
  const normal = evaluateVisionQaResult(normalInput, {isCover: false});

  const coverInput = baseResult();
  coverInput.scores.hookStrength = 78;
  coverInput.verdict = 'REGENERATE';
  coverInput.regenerationInstruction = 'Increase first-second impact with one dominant hero action, stronger scale contrast and clearer immediate consequence.';
  const cover = evaluateVisionQaResult(coverInput, {isCover: true});

  assert.equal(normal.expectedVerdict, 'PASS');
  assert.deepEqual(normal.errors, []);
  assert.equal(cover.expectedVerdict, 'REGENERATE');
  assert.ok(cover.errors.some((error) => error.includes('unter 82')));
});

test('Prompt-only Bericht ohne konkrete Pixelbeobachtungen wird blockiert', () => {
  const input = baseResult();
  input.evaluatorMode = 'prompt-review';
  input.evidence = ['looks good'];
  input.verdict = 'REGENERATE';
  input.regenerationInstruction = 'Run the required multimodal inspection on the actual generated image pixels before accepting this scene.';
  const result = evaluateVisionQaResult(input);
  assert.equal(result.expectedVerdict, 'REGENERATE');
  assert.ok(result.errors.some((error) => error.includes('multimodal-pixel-review')));
  assert.ok(result.errors.some((error) => error.includes('Pixel-Beobachtungen')));
});
