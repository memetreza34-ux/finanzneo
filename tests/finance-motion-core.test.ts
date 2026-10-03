import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';
import {FINANCE_MOTION_CORE_IDS, FINANCE_MOTION_LAB_IDS} from '../src/finance-motion/lab-config';

const indexSource = readFileSync(resolve('src/finance-motion/index.tsx'), 'utf8');
const coreSource = readFileSync(resolve('src/finance-motion/core.tsx'), 'utf8');
const coreLabSource = readFileSync(resolve('src/reels-test/FinanceMotionCoreLab.tsx'), 'utf8');
const qaSource = readFileSync(resolve('scripts/qa-finance-motion-library.ts'), 'utf8');

const registryBlock = indexSource.match(/FINANCE_MOTION_REGISTRY:\s*FinanceMotionDescriptor\[\]\s*=\s*\[([\s\S]*?)\n\];/)?.[1] ?? '';
const registryEntries = [...registryBlock.matchAll(/\{id:\s*'([^']+)'[^\n]*?tier:\s*'(core|situational)'([^\n]*)\}/g)].map((match) => ({
  id: match[1],
  tier: match[2],
  rest: match[3],
}));
const coreComponentBlock = coreSource.match(/FINANCE_MOTION_CORE_COMPONENTS\s*=\s*\{([\s\S]*?)\n\}\s*as const;/)?.[1] ?? '';
const coreComponentIds = [...coreComponentBlock.matchAll(/^\s*'([^']+)'\s*:/gm)].map((match) => match[1]).sort();

test('Jede Library-Mechanik ist als core oder situational eingestuft', () => {
  assert.equal(registryEntries.length, FINANCE_MOTION_LAB_IDS.length);
  const coreIds = registryEntries.filter((entry) => entry.tier === 'core').map((entry) => entry.id).sort();
  assert.deepEqual(coreIds, [...FINANCE_MOTION_CORE_IDS].sort());
  for (const entry of registryEntries.filter((item) => item.tier === 'situational')) {
    assert.match(entry.rest, /preferInstead:\s*'[^']{20,}'/, `${entry.id} braucht eine Begründung, was stattdessen besser erklärt.`);
  }
});

test('Der kanonische Import liefert die Kern-Mechaniken aus core.tsx', () => {
  assert.match(indexSource, /from '\.\/core'/);
  for (const name of ['CompoundGrowth', 'LoanPaydown', 'MoneySplit', 'ScenarioComparison', 'ValueDrain', 'ValueGrowth']) {
    assert.match(coreSource, new RegExp(`export const ${name}: React\\.FC<`));
    assert.match(indexSource, new RegExp(`export const ${name}V1: React\\.FC<`), `${name}V1 bleibt für Direction V2/V2.1 erhalten.`);
  }
  assert.deepEqual(coreComponentIds, [...FINANCE_MOTION_CORE_IDS].sort());
});

test('Das Kern-Lab zeigt die Mechaniken über den kanonischen Import', () => {
  assert.match(coreLabSource, /from '\.\.\/finance-motion';/);
  for (const id of FINANCE_MOTION_CORE_IDS) assert.match(coreLabSource, new RegExp(`case '${id}'`));
});

test('Kern-Mechaniken zeigen Beträge proportional und ohne Wackel-Hacks', () => {
  assert.doesNotMatch(coreSource, /Math\.(?:sin|cos)\s*\(/);
  // Der Startwert des Vergleichs wird wie die Endwerte skaliert, nicht fest gesetzt.
  const comparison = coreSource.match(/export const ScenarioComparison[\s\S]*?\n\};/)?.[0] ?? '';
  assert.match(comparison, /startCoins = clamp\(Math\.round\(\(maxCoins \* startValue\) \/ top\)/);
  // Die Ratenbeschriftung zeigt immer die echte Anzahl, auch wenn Münzen gedeckelt sind.
  const loan = coreSource.match(/export const LoanPaydown[\s\S]*?\n\};/)?.[0] ?? '';
  assert.match(loan, /\{Math\.round\(payments\)\} \{paymentLabel\}/);
});

test('Finance-Motion-QA misst die Belegung der Kern-Mechaniken und räumt ihr Bundle weg', () => {
  assert.match(qaSource, /ReelsTestFinanceMotionCore/);
  assert.match(qaSource, /MIN_PEAK = 0\.15/);
  assert.match(qaSource, /MIN_MEDIAN = 0\.12/);
  assert.match(qaSource, /rmSync\(workDir/);
  assert.doesNotMatch(qaSource, /'remotion',\s*'still'/, 'Kein Bundle pro Frame mehr.');
});
