import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const root = resolve('youtube/warum-du-trotz-gehaltserhoehung-nicht-mehr-geld-hast-hybrid');
const index = JSON.parse(readFileSync(resolve(root, '04-visuals/visual-index.json'), 'utf8'));
const layout = JSON.parse(readFileSync(resolve(root, '06-projektdateien/layout-contract.json'), 'utf8'));
const mode = JSON.parse(readFileSync(resolve(root, '06-projektdateien/production-mode.json'), 'utf8'));

test('current hybrid video uses full-frame Remotion while Flow stays contained', () => {
  assert.equal(index.layoutContract.id, 'finanzneo-youtube-framed-scene-v2');
  assert.equal(index.layoutContract.hybridMotionCanvas, 'full-1920x1080');
  assert.equal(index.layoutContract.motionSafeAreaPx, 64);
  assert.equal(index.layoutContract.flowImageFullscreenForbidden, true);
  assert.equal(index.layoutContract.hybridPureRemotionMayUseFullFrame, true);
  assert.equal(layout.id, 'finanzneo-youtube-framed-scene-v2');
  assert.equal(layout.unintentionalCroppingForbidden, true);
  assert.equal(mode.fullFrameRemotionAllowed, true);
  assert.equal(mode.fullFrameFlowForbidden, true);
});

test('current hybrid video has production motion quality metadata for all 12 motion scenes', () => {
  const motion = index.visuals.filter((visual: {type: string}) => ['animation', 'data', 'hybrid'].includes(visual.type));
  assert.equal(motion.length, 12);
  assert.equal(index.phaseB.motionQualityStandardId, 'finanzneo-youtube-motion-quality-v1');
  assert.equal(index.phaseB.visualQaStandardId, 'finanzneo-youtube-visual-qa-16x9-v1');
  for (const visual of motion) {
    assert.equal(visual.motionQuality.standardId, 'finanzneo-youtube-motion-quality-v1');
    assert.deepEqual(visual.motionQuality.representativeStates, ['START', '25%', '50%', '75%', 'RESULT HOLD']);
    assert.equal(visual.motionQuality.replaceWithStaticIfNotStronger, true);
  }
  assert.equal(existsSync(resolve(root, '06-projektdateien/motion-qa.md')), true);
});
