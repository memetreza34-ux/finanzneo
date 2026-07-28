#!/usr/bin/env node

import {readFileSync, readdirSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

const futureValue = ({contributionPerPeriod, annualReturnRate, years, periodsPerYear = 12}) => {
  const totalPeriods = Math.round(years * periodsPerYear);
  const periodicRate = annualReturnRate / periodsPerYear;

  if (periodicRate === 0) return contributionPerPeriod * totalPeriods;
  return contributionPerPeriod * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
};

const assertClose = (label, actual, expected, tolerance = 0.01) => {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: erwartet ${expected.toFixed(2)}, erhalten ${actual.toFixed(2)}`);
  }
};

const cases = [
  {
    label: '100 € monatlich, 0 % p. a., 30 Jahre',
    input: {contributionPerPeriod: 100, annualReturnRate: 0, years: 30},
    expected: 36000,
  },
  {
    label: '100 € monatlich, 7 % p. a., 30 Jahre',
    input: {contributionPerPeriod: 100, annualReturnRate: 0.07, years: 30},
    expected: 121997.10,
  },
  {
    label: '100 € monatlich, 1,2 % p. a., 30 Jahre',
    input: {contributionPerPeriod: 100, annualReturnRate: 0.012, years: 30},
    expected: 43307.16,
  },
  {
    label: '100 € monatlich, 7 % p. a., 40 Jahre',
    input: {contributionPerPeriod: 100, annualReturnRate: 0.07, years: 40},
    expected: 262481.34,
  },
];

for (const testCase of cases) {
  assertClose(testCase.label, futureValue(testCase.input), testCase.expected);
}

const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const sourceFiles = walk(resolve('src')).filter((path) => /\.(tsx?|jsx?)$/.test(path));
const forbiddenPatterns = [
  {pattern: /\b248000\b/, message: 'bekannter falscher 248.000-€-Demoendwert'},
  {pattern: /expSeries\s*\(/, message: 'synthetische Exponentialkurve statt Finanzberechnung'},
  {pattern: /linSeries\s*\(/, message: 'synthetische lineare Finanzkurve statt Finanzberechnung'},
];

const violations = [];
for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  for (const forbidden of forbiddenPatterns) {
    if (forbidden.pattern.test(content)) {
      violations.push(`${file}: ${forbidden.message}`);
    }
  }
}

const chartFile = readFileSync(resolve('src/bausteine/fn_chart_base.tsx'), 'utf8');
const requiredDisclosures = [
  'Beispielrechnung:',
  'keine Renditegarantie',
  'keine historischen Marktdaten',
  'ohne Kosten, Steuern und Inflation',
];

for (const disclosure of requiredDisclosures) {
  if (!chartFile.includes(disclosure)) {
    violations.push(`fn_chart_base.tsx: Pflicht-Hinweis fehlt: "${disclosure}"`);
  }
}

if (violations.length > 0) {
  console.error('\nFinanz-Validierung fehlgeschlagen:\n');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('\n✓ Finanzformeln stimmen mit den hinterlegten Referenzwerten überein.');
console.log('✓ Bekannte falsche Demo-Zahlen und synthetische Finanzkurven wurden nicht gefunden.');
console.log('✓ Beispielannahmen und Einschränkungen sind in den Premium-Charts sichtbar.');
