import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import test from 'node:test';
import {
  FINANCE_MOTION_LAB_IDS,
  FINANCE_MOTION_LAB_SEGMENT_FRAMES,
  FINANCE_MOTION_QA_LOCAL_FRAMES,
} from '../src/finance-motion/lab-config';
import {FINANCE_MOTION_PROFILES_V2} from '../src/finance-motion/motion-profiles-v2';

const librarySource = readFileSync(resolve('src/finance-motion/index.tsx'), 'utf8');
const directionV2Source = readFileSync(resolve('src/finance-motion/direction-v2.tsx'), 'utf8');
const directionV21Source = readFileSync(resolve('src/finance-motion/direction-v2-1.tsx'), 'utf8');
const directionV22Source = readFileSync(resolve('src/finance-motion/direction-v2-2.tsx'), 'utf8');
const labSource = readFileSync(resolve('src/reels-test/FinanceMotionLibraryLabV1.tsx'), 'utf8');

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

test('Direction V2 besitzt sechs bewusst unterschiedliche Bewegungsprofile', () => {
  const ids = Object.keys(FINANCE_MOTION_PROFILES_V2).sort();
  assert.deepEqual(ids, ['comparison', 'compound', 'drain', 'growth', 'rebalance', 'transfer']);
  const characters = Object.values(FINANCE_MOTION_PROFILES_V2).map((profile) => profile.character);
  assert.equal(new Set(characters).size, characters.length);
});

test('V2.1 behält die sechs bereits visuell bestätigten Regien', () => {
  for (const component of ['MoneyTransfer', 'ValueGrowth', 'ValueDrain', 'ScenarioComparison', 'CompoundGrowth']) {
    assert.match(directionV21Source, new RegExp(`export const ${component}`));
  }
  assert.match(directionV21Source, /Rebalancing was the strongest V2 scene/);
  assert.match(directionV2Source, /export const Rebalancing/);
});

test('V2.1 verrät den Transfer-Payoff nicht vor der Hauptaktion', () => {
  const transferBlock = directionV21Source.match(/export const MoneyTransfer[\s\S]*?export const ValueGrowth/)?.[0] ?? '';
  assert.match(transferBlock, /sourceDebit/);
  assert.match(transferBlock, /opacity: payoff/);
  assert.doesNotMatch(transferBlock, /AccountPedestal[^\n]*value=/);
});

test('V2.1 Vergleich beginnt sichtbar gleich und zeigt Ergebnisse erst als Payoff', () => {
  const comparisonBlock = directionV21Source.match(/export const ScenarioComparison[\s\S]*?export const CompoundGrowth/)?.[0] ?? '';
  assert.match(comparisonBlock, /GLEICHER START/);
  assert.match(comparisonBlock, /const branch/);
  assert.match(comparisonBlock, /const build/);
  assert.match(comparisonBlock, /opacity: payoff/);
});

test('V2.1 Zinseszins nutzt eine gekrümmte Beschleunigung statt einer geraden Linie', () => {
  const compoundBlock = directionV21Source.match(/export const CompoundGrowth[\s\S]*?FINANCE_MOTION_DIRECTION_V2_1_COMPONENTS/)?.[0] ?? '';
  assert.match(compoundBlock, /C 360 548, 610 470, 930 90/);
  assert.match(compoundBlock, /470 \* ratio \* ratio/);
  assert.match(compoundBlock, /strokeDashoffset=\{1 - progress\}/);
});

test('Finance Motion Lab nutzt V2.2 für alle zwölf Mechaniken', () => {
  assert.match(labSource, /finance-motion\/direction-v2-2/);
  assert.match(labSource, /FINANCE MOTION DIRECTION V2\.2/);
  assert.match(labSource, /alle 12 Mechaniken visuell kalibriert/);
  for (const component of ['MoneySplit', 'AllocationSplit', 'Diversification', 'LoanPaydown', 'ProtectionLimit', 'FinanceTimeline']) {
    assert.match(directionV22Source, new RegExp(`export const ${component}`));
  }
});

test('V2.2 Money Split zeigt echte Verteilung und verrät Anteile erst als Payoff', () => {
  const block = directionV22Source.match(/export const MoneySplit[\s\S]*?type AllocationPart/)?.[0] ?? '';
  assert.match(block, /const arc = -145 \* 4 \* move \* \(1 - move\)/);
  assert.match(block, /value=\{payoff > 0 \? `\$\{part\.share\} %` : undefined\}/);
  assert.match(block, /destinations/);
});

test('V2.2 Allocation fächert einen Portfolio-Kern physisch auf statt Prozentbalken zu zeichnen', () => {
  const block = directionV22Source.match(/export const AllocationSplit[\s\S]*?type Destination/)?.[0] ?? '';
  assert.match(block, /PORTFOLIO/);
  assert.match(block, /ALLOCATION_TARGETS/);
  assert.match(block, /rotate: `\$\{target\.angle \* move\}deg`/);
  assert.doesNotMatch(block, /width: `\$\{[^`]*%`/);
});

test('V2.2 Diversification zeigt sichtbare Verzweigung vom gemeinsamen Ursprung', () => {
  const block = directionV22Source.match(/export const Diversification[\s\S]*?export const LoanPaydown/)?.[0] ?? '';
  assert.match(block, /strokeDashoffset=\{1 - draw\}/);
  assert.match(block, /Q \$\{controlX\} \$\{controlY\}/);
  assert.match(block, /sourceLabel/);
});

test('V2.2 Loan Paydown koppelt jede Zahlung sichtbar an einen entfernten Schuldenblock', () => {
  const block = directionV22Source.match(/export const LoanPaydown[\s\S]*?export const ProtectionLimit/)?.[0] ?? '';
  assert.match(block, /const removed = phase/);
  assert.match(block, /<Coin/);
  assert.match(block, /verbleibt/);
  assert.match(block, /endDebt/);
});

test('V2.2 Protection Limit sammelt Konten unter einem gemeinsamen Schutzbereich', () => {
  const block = directionV22Source.match(/export const ProtectionLimit[\s\S]*?type Milestone/)?.[0] ?? '';
  assert.match(block, /gemeinsamer Schutzbereich/);
  assert.match(block, /geschützt bis/);
  assert.match(block, /borderRadius: '360px 360px 68px 68px'/);
  assert.match(block, /lock = spring/);
});

test('V2.2 Finance Timeline nutzt große Meilensteine und einen sichtbaren Reisepunkt', () => {
  const block = directionV22Source.match(/export const FinanceTimeline[\s\S]*?export \{/)?.[0] ?? '';
  assert.match(block, /TIMELINE_POINTS/);
  assert.match(block, /strokeDashoffset=\{1 - travel\}/);
  assert.match(block, /<Coin x=\{coinX\} y=\{coinY\}/);
  assert.match(block, /milestone\.value/);
});

test('V2.2 bleibt deterministisch und ohne trigonometrische Wackelbewegung', () => {
  assert.doesNotMatch(directionV22Source, /Math\.(sin|cos)/);
  assert.doesNotMatch(directionV22Source, /Math\.random/);
});