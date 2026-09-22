import assert from 'node:assert/strict';
import test from 'node:test';
import {evaluateVisionQaResult} from '../scripts/lib/image-vision-qa.mjs';

const passingResult = () => ({
  contractId: 'finanzneo-image-vision-qa-v1',
  evaluatorMode: 'multimodal-pixel-review',
  scores: {
    planAlignment: 92,
    cameraCompliance: 90,
    actionReadability: 91,
    hookStrength: 86,
    visualInterest: 88,
    worldConsistency: 95,
    compositionClarity: 90,
    sequenceNovelty: 84,
    spatialStaging: 86,
    causeEffectStrength: 90,
    humanReactionReadability: 82,
    impactComposition: 85,
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
    studioShowcaseLike: false,
    objectsNeatlyArranged: false,
    actionConsequenceWeak: false,
    humanReactionWeak: false,
    emptyBlackDominant: false,
  },
  evidence: [
    'Foreground repair bill visibly overlaps the shrinking savings envelope.',
    'The person leans back with tense shoulders and looks toward the cost.',
    'Garage context fills the frame and dissolves naturally into deep black.',
  ],
  verdict: 'PASS',
  regenerationInstruction: 'none',
});

test('V5.1 Vision-QA akzeptiert starke dynamische Inszenierung', () => {
  const evaluation = evaluateVisionQaResult(passingResult(), {dynamicStagingRequired: true});
  assert.equal(evaluation.expectedVerdict, 'PASS');
  assert.deepEqual(evaluation.errors, []);
});

test('V5.1 Vision-QA blockiert sauber angeordnete Kataloginszenierung', () => {
  const result = passingResult();
  result.flags.objectsNeatlyArranged = true;
  result.verdict = 'REGENERATE';
  result.regenerationInstruction = 'Regenerate with active object collision and visible spatial consequence instead of a neat display.';
  const evaluation = evaluateVisionQaResult(result, {dynamicStagingRequired: true});
  assert.equal(evaluation.expectedVerdict, 'REGENERATE');
  assert.match(evaluation.errors.join('\n'), /objectsNeatlyArranged/);
});

test('V5.1 Vision-QA verlangt zusätzliche Staging-Scores', () => {
  const result = passingResult();
  delete (result.scores as Record<string, number>).spatialStaging;
  result.verdict = 'REGENERATE';
  result.regenerationInstruction = 'Re-evaluate the actual image pixels and provide the missing spatial staging score.';
  const evaluation = evaluateVisionQaResult(result, {dynamicStagingRequired: true});
  assert.equal(evaluation.expectedVerdict, 'REGENERATE');
  assert.match(evaluation.errors.join('\n'), /scores\.spatialStaging/);
});
