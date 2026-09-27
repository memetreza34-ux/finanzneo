import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve('src/design-system/YouTubeMotionExplainers.tsx'), 'utf8');
const index = readFileSync(resolve('src/design-system/index.ts'), 'utf8');

test('YouTube motion explainer primitives are exported through the central design system', () => {
  for (const name of ['MotionNumber', 'MotionComparisonBars', 'MotionLineChart', 'MotionMoneyFlow', 'MotionBeforeAfter']) {
    assert.match(source, new RegExp(`export const ${name}\\b`));
    assert.match(index, new RegExp(`\\b${name}\\b`));
  }
});

test('YouTube motion explainer primitives use deterministic Remotion timing only', () => {
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

test('YouTube motion explainer primitives include richer finance mechanisms than fade-only motion', () => {
  assert.match(source, /strokeDashoffset/);
  assert.match(source, /MotionMoneyFlow/);
  assert.match(source, /MotionComparisonBars/);
  assert.match(source, /MotionBeforeAfter/);
  assert.match(source, /Easing\.bezier/);
});
