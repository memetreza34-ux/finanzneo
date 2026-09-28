import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FINANCE_MOTION_COMPONENTS,
  FINANCE_MOTION_REGISTRY,
  searchFinanceMotions,
} from '../src/finance-motion';
import {
  FINANCE_MOTION_LAB_IDS,
  FINANCE_MOTION_LAB_SEGMENT_FRAMES,
  FINANCE_MOTION_QA_LOCAL_FRAMES,
} from '../src/finance-motion/lab-config';

test('Finance Motion Lab deckt jede registrierte Library-Mechanik exakt einmal ab', () => {
  const registryIds = FINANCE_MOTION_REGISTRY.map((item) => item.id).sort();
  const componentIds = Object.keys(FINANCE_MOTION_COMPONENTS).sort();
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

test('semantische Library-Suche findet passende wiederverwendbare Mechaniken', () => {
  assert.equal(searchFinanceMotions('ETF diversification')[0]?.id, 'diversification');
  assert.equal(searchFinanceMotions('loan repayment')[0]?.id, 'loan-paydown');
  assert.equal(searchFinanceMotions('fees reduce value')[0]?.id, 'value-drain');
});
