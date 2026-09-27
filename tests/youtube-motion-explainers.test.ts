import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve('src/design-system/YouTubeMotionExplainers.tsx'), 'utf8');
const index = readFileSync(resolve('src/design-system/index.ts'), 'utf8');

const primitives = [
  'MotionNumber',
  'MotionComparisonBars',
  'MotionLineChart',
  'MotionMoneyFlow',
  'MotionPathFlow',
  'MotionBeforeAfter',
  'MotionBudgetAllocation',
  'MotionCompoundGrowth',
  'MotionLoanPaydown',
  'MotionPurchasingPower',
  'MotionTimeline',
];

test('YouTube finance motion primitives are exported through the central design system', () => {
  for (const name of primitives) {
    assert.match(source, new RegExp(`export const ${name}\\b`));
    assert.match(index, new RegExp(`\\b${name}\\b`));
  }
});

test('YouTube motion primitives use deterministic Remotion timing only', () => {
  assert.match(source, /useCurrentFrame\s*\(/);
  assert.match(source, /\binterpolate\s*\(/);
  assert.match(source, /\bspring\s*\(/);
  assert.doesNotMatch(source, /\bMath\.random\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\s*\(/);
  assert.doesNotMatch(source, /\bsetTimeout\s*\(/);
  assert.doesNotMatch(source, /\bsetInterval\s*\(/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\banimation\s*:/);
  assert.doesNotMatch(source, /\btransition\s*:/);
});

test('YouTube motion primitives route through paths, shapes and central finance calculations', () => {
  assert.match(source, /from '@remotion\/paths'/);
  assert.match(source, /from '@remotion\/shapes'/);
  assert.match(source, /evolvePath\s*\(/);
  assert.match(source, /getPointAtLength\s*\(/);
  assert.match(source, /<Rect\b/);
  assert.match(source, /calculateSavingsPlanSeries\s*\(/);
  assert.match(source, /calculateLoanSchedule\s*\(/);
  assert.match(source, /calculateInflationAdjustedValue\s*\(/);
});

test('YouTube motion primitives expose different physical motion presets instead of one universal easing', () => {
  for (const preset of ['chart', 'money', 'paper', 'heavy', 'confirm']) {
    assert.match(source, new RegExp(`\\b${preset}:`));
  }
  assert.match(source, /YOUTUBE_MOTION_PHYSICS/);
  assert.match(source, /Easing\.bezier/);
});
