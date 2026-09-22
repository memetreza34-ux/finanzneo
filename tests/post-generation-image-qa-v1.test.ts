import assert from 'node:assert/strict';
import test from 'node:test';
import {
  dHashFromGray9x8,
  hammingDistanceHex,
  luminanceStats,
  evaluatePixelQa,
  emptySemanticAssessment,
  validateSemanticAssessment,
} from '../scripts/lib/post-generation-image-qa-v1.mjs';

test('dHash erkennt identische Pixelproben als Distanz 0', () => {
  const sample = Buffer.from(Array.from({length: 72}, (_, i) => (i * 17) % 256));
  const hash = dHashFromGray9x8(sample);
  assert.equal(hash.length, 16);
  assert.equal(hammingDistanceHex(hash, hash), 0);
});

test('Pixel-QA blockiert nahezu schwarzes leeres Bild', () => {
  const stats = luminanceStats(Buffer.alloc(1024, 0));
  const qa = evaluatePixelQa({stats, nearestDistance: null});
  assert.equal(qa.status, 'FAIL');
  assert.match(qa.blockers.join(' '), /nahezu leer\/schwarz/i);
});

test('Pixel-QA blockiert Near-Duplicate', () => {
  const qa = evaluatePixelQa({stats: {mean: 70, stddev: 30, nonBlackRatio: 0.4}, nearestDistance: 2});
  assert.equal(qa.status, 'FAIL');
  assert.match(qa.blockers.join(' '), /nahezu identisch/i);
});

test('semantische Vision-QA verlangt echte 4–5 Scores und PASS', () => {
  const pending = emptySemanticAssessment('scene-02', '02.png');
  assert.ok(validateSemanticAssessment(pending).length > 0);

  const passed = {
    ...pending,
    status: 'PASS',
    scores: {
      voiceBeatMatch: 5,
      cameraMatch: 4,
      storyActionMatch: 5,
      locationMatch: 4,
      mainSubjectMatch: 5,
      causeEffectReadability: 4,
      visualHookStrength: 5,
      v9WorldConsistency: 5,
      sequenceNovelty: 4,
    },
    blockers: [],
  };
  assert.deepEqual(validateSemanticAssessment(passed), []);
});
