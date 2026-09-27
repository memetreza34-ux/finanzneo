import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const renderQa = readFileSync(resolve('scripts/render-youtube-motion-qa.mjs'), 'utf8');
const validateQa = readFileSync(resolve('scripts/validate-youtube-motion-qa.mjs'), 'utf8');
const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const ready = readFileSync(resolve('scripts/check-youtube-production-ready.mjs'), 'utf8');
const showcase = readFileSync(resolve('src/showcases/YouTubeFinanceMotionLab.tsx'), 'utf8');
const showcaseRegistry = readFileSync(resolve('src/root/ShowcaseCompositions.tsx'), 'utf8');

test('YouTube motion QA can render five representative 16:9 states with final timeline timing', () => {
  for (const state of ['START', '25%', '50%', '75%', 'RESULT HOLD']) {
    assert.match(renderQa, new RegExp(state.replace('%', '%')));
  }
  assert.match(renderQa, /1920/);
  assert.match(renderQa, /1080/);
  assert.match(renderQa, /timingSource/);
  assert.match(renderQa, /remotion[',\s]+still/);
  assert.equal(packageJson.scripts['youtube:motion:qa'], 'node scripts/render-youtube-motion-qa.mjs');
});

test('final YouTube readiness requires approved representative-frame QA for quality-v1 projects', () => {
  assert.match(validateQa, /motion-qa-manifest\.json/);
  assert.match(validateQa, /motion-qa-review\.json/);
  assert.match(validateQa, /status !== 'PASS'/);
  for (const check of ['startResultDifferent', 'mechanismReadable', 'safeArea', 'noClipping', 'resultReadable', 'financeValuesVerified', 'staticAlternativeRechecked', 'adjacentVariety']) {
    assert.match(validateQa, new RegExp(check));
  }
  assert.match(ready, /validate-youtube-motion-qa\.mjs/);
  assert.equal(packageJson.scripts['youtube:motion:qa:validate'], 'node scripts/validate-youtube-motion-qa.mjs');
});

test('the 16:9 finance motion lab exercises the reusable production primitives without becoming a production composition', () => {
  for (const name of ['MotionBudgetAllocation', 'MotionCompoundGrowth', 'MotionLoanPaydown', 'MotionPurchasingPower', 'MotionTimeline', 'MotionMoneyFlow']) {
    assert.match(showcase, new RegExp(`\\b${name}\\b`));
  }
  assert.match(showcaseRegistry, /id="YouTubeFinanceMotionLab"/);
  assert.doesNotMatch(readFileSync(resolve('src/root/ProductionCompositions.tsx'), 'utf8'), /YouTubeFinanceMotionLab/);
});
