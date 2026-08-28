import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REEL_BACKGROUND_CONTRACT_ID,
  phase3CompletionContractFields,
} from '../scripts/lib/phase3-completion.mjs';

test('Phase 3 erzwingt Pure-Black und blockiert schwarze/leere Visuals', () => {
  const contract = phase3CompletionContractFields();

  assert.equal(contract.reelBackgroundContractId, REEL_BACKGROUND_CONTRACT_ID);
  assert.equal(contract.pureBlackBackgroundRequired, true);
  assert.equal(contract.decorativeBackgroundEffectsForbidden, true);
  assert.equal(contract.backgroundMotionDoesNotCountAsAnimation, true);
  assert.equal(contract.blackOrEmptyVisualMustFail, true);

  assert.equal(contract.visualQa.sampleBackgroundPerScene, true);
  assert.ok(contract.visualQa.minActivePixelRatio >= 0.04);
  assert.ok(contract.visualQa.maxBackgroundMean <= 12);
  assert.ok(contract.visualQa.maxBackgroundStdDev <= 4);
  assert.ok(contract.visualQa.minAnimationMeanAbsDiff > 0);
});
