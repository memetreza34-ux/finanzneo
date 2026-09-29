import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';
import {
  FINANCE_MOTION_LAB_IDS,
  FINANCE_MOTION_LAB_SEGMENT_FRAMES,
  FINANCE_MOTION_QA_LOCAL_FRAMES,
} from '../src/finance-motion/lab-config';

const librarySource = readFileSync(resolve('src/finance-motion/index.tsx'), 'utf8');

const registryBlock = librarySource.match(
  /FINANCE_MOTION_REGISTRY:\s*FinanceMotionDescriptor\[\]\s*=\s*\[([\s\S]*?)\n\];/,
)?.[1] ?? '';
const componentBlock = librarySource.match(
  /FINANCE_MOTION_COMPONENTS\s*=\s*\{([\s\S]*?)\n\}\s*as const;/,
)?.[1] ?? '';

const registryIds = [...registryBlock.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]).sort();
const componentIds = [...componentBlock.matchAll(/^\s*(?:'([^']+)'|([a-z][a-z0-9]*))\s*:/gm)]
  .map((match) => match[1] ?? match[2])
  .sort();

test('Finance Motion Lab deckt jede registrierte Library-Mechanik exakt einmal ab', () => {
  const labIds = [...FINANCE_MOTION_LAB_IDS].sort();

  assert.deepEqual(labIds, registryIds);
  assert.deepEqual(labIds, componentIds);
  assert.equal(new Set(FINANCE_MOTION_LAB_IDS).size, FINANCE_MOTION_LAB_IDS.length);
});

test('Finance Motion QA prüft Setup, Hauptaktion und stabilen Ergebnisbereich', () => {
  assert.equal(FINANCE_MOTION_QA_LOCAL_FRAMES.length, 3);
  const [setup, action, result] = FINANCE_MOTION_QA_LOCAL_FRAMES;
  assert.ok(setup > 0 && setup < action);
  assert.ok(action < result);
  assert.ok(result <= FINANCE_MOTION_LAB_SEGMENT_FRAMES - 15 + 1);
});

test('Finance Motion Library behält die semantische Best-Fit-Suche', () => {
  assert.match(librarySource, /export const searchFinanceMotions/);
  assert.match(registryBlock, /ETF diversification/);
  assert.match(registryBlock, /loan repayment/);
  assert.match(registryBlock, /fees/);
});
