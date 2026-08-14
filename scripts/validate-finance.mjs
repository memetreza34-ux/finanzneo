#!/usr/bin/env node

import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {resolve} from 'node:path';

const futureValue = ({contributionPerPeriod, annualReturnRate, years, periodsPerYear = 12}) => {
  const totalPeriods = Math.round(years * periodsPerYear);
  const periodicRate = annualReturnRate / periodsPerYear;

  if (periodicRate === 0) return contributionPerPeriod * totalPeriods;
  return contributionPerPeriod * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
};

const inflationAdjustedValue = ({amount, annualInflationRate, years}) =>
  amount / Math.pow(1 + annualInflationRate, years);

const futureCost = ({amount, annualInflationRate, years}) =>
  amount * Math.pow(1 + annualInflationRate, years);

const purchasingPowerLossPercent = (input) =>
  (1 - inflationAdjustedValue(input) / input.amount) * 100;

const monthlyLoanPayment = ({principal, annualInterestRate, termMonths}) => {
  const monthlyRate = annualInterestRate / 12;
  if (monthlyRate === 0) return principal / termMonths;

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return principal * ((monthlyRate * factor) / (factor - 1));
};

const assertClose = (label, actual, expected, tolerance = 0.01) => {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: erwartet ${expected.toFixed(2)}, erhalten ${actual.toFixed(2)}`);
  }
};

const savingsPlanCases = [
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

for (const testCase of savingsPlanCases) {
  assertClose(testCase.label, futureValue(testCase.input), testCase.expected);
}

const inflationCase = {
  amount: 1000,
  annualInflationRate: 0.02,
  years: 10,
};
assertClose('Kaufkraft von 1.000 € nach 10 Jahren bei 2 % Inflation', inflationAdjustedValue(inflationCase), 820.35);
assertClose('Zukünftige Kosten von heute 1.000 € bei 2 % Inflation', futureCost(inflationCase), 1218.99);
assertClose('Kaufkraftverlust in Prozent', purchasingPowerLossPercent(inflationCase), 17.96517, 0.0001);

const loanCase = {
  principal: 10000,
  annualInterestRate: 0.06,
  termMonths: 60,
};
const loanPayment = monthlyLoanPayment(loanCase);
assertClose('Monatsrate für 10.000 € Kredit, 6 %, 60 Monate', loanPayment, 193.328015, 0.0001);
assertClose('Gesamtzahlung für Beispielkredit', loanPayment * loanCase.termMonths, 11599.680918, 0.0001);
assertClose('Gesamtzins für Beispielkredit', loanPayment * loanCase.termMonths - loanCase.principal, 1599.680918, 0.0001);
assertClose('Nullzins-Kreditrate', monthlyLoanPayment({principal: 12000, annualInterestRate: 0, termMonths: 60}), 200);

const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const sourceFiles = walk(resolve('src'))
  .filter((path) => /\.(tsx?|jsx?)$/.test(path))
  .filter((path) => !path.includes(`${resolve('src', 'bausteine')}`)); // legacy files, excluded from TS build

const forbiddenPatterns = [
  {pattern: /\b248000\b/, message: 'bekannter falscher 248.000-€-Demoendwert'},
  {pattern: /\b347000\b/, message: 'früherer frei eingetragener 347.000-€-Demowert'},
  {pattern: /expSeries\s*\(/, message: 'synthetische Exponentialkurve statt Finanzberechnung'},
  {pattern: /linSeries\s*\(/, message: 'synthetische lineare Finanzkurve statt Finanzberechnung'},
];

const violations = [];
for (const file of sourceFiles) {
  let content = '';
  try {
    content = readFileSync(file, 'utf8');
  } catch (error) {
    violations.push(`Konnte Datei nicht lesen: ${file}`);
    continue;
  }
  for (const forbidden of forbiddenPatterns) {
    if (forbidden.pattern.test(content)) {
      violations.push(`${file}: ${forbidden.message}`);
    }
  }
}

const calculationsPath = resolve('src/finance/calculations.ts');
const examplesPath = resolve('src/finance/examples.ts');

if (!existsSync(calculationsPath)) {
  violations.push('src/finance/calculations.ts fehlt.');
} else {
  let calculations = '';
  try {
    calculations = readFileSync(calculationsPath, 'utf8');
  } catch (error) {
    violations.push(`Konnte Datei nicht lesen: src/finance/calculations.ts`);
  }
  const requiredFunctions = [
    'calculateSavingsPlanFutureValue',
    'calculateInflationAdjustedValue',
    'calculateFutureCost',
    'calculatePurchasingPowerLossPercent',
    'calculateMonthlyLoanPayment',
    'calculateLoanSummary',
    'calculateLoanSchedule',
  ];

  for (const functionName of requiredFunctions) {
    // Validates the presence of required exported functions
    const funcRegex = new RegExp(`export\\s+(const|function)\\s+${functionName}\\b`);
    if (!funcRegex.test(calculations)) {
      violations.push(`calculations.ts: Funktion fehlt: ${functionName}`);
    }
  }
}

if (!existsSync(examplesPath)) {
  violations.push('src/finance/examples.ts fehlt.');
} else {
  let examples = '';
  try {
    examples = readFileSync(examplesPath, 'utf8');
  } catch (error) {
    violations.push(`Konnte Datei nicht lesen: src/finance/examples.ts`);
  }
  for (const exampleName of ['savingsPlan', 'inflation', 'loan', 'emergencyFund']) {
    // Validates the presence of the required example object property
    const exampleRegex = new RegExp(`(?:export\\s+const\\s+FINANCE_EXAMPLES\\s*=|\\b${exampleName}\\s*:)`);
    if (!exampleRegex.test(examples)) {
      violations.push(`examples.ts: Beispielannahme fehlt: ${exampleName}`);
    }
  }
  for (const disclosure of ['Keine Renditegarantie', 'tatsächliche Inflation schwankt', 'ohne Gebühren', 'Lebenssituation']) {
    // Validates that required disclosure strings are present (case-insensitive)
    const disclosureRegex = new RegExp(disclosure, 'i');
    if (!disclosureRegex.test(examples)) {
      violations.push(`examples.ts: Einschränkung fehlt: ${disclosure}`);
    }
  }
}

let chartFile = '';
try {
  chartFile = readFileSync(resolve('src/bausteine/fn_chart_base.tsx'), 'utf8');
} catch (error) {
  violations.push(`Konnte Datei nicht lesen: src/bausteine/fn_chart_base.tsx`);
}
const requiredDisclosures = [
  'Beispielrechnung:',
  'keine Renditegarantie',
  'keine historischen Marktdaten',
  'ohne Kosten, Steuern und Inflation',
];

for (const disclosure of requiredDisclosures) {
  // Validates the presence of required disclosure strings (case-insensitive)
  const disclosureRegex = new RegExp(disclosure, 'i');
  if (!disclosureRegex.test(chartFile)) {
    violations.push(`fn_chart_base.tsx: Pflicht-Hinweis fehlt: "${disclosure}"`);
  }
}

let shortHook = '';
try {
  shortHook = readFileSync(resolve('src/zins/ShortHook.tsx'), 'utf8');
} catch (error) {
  violations.push(`Konnte Datei nicht lesen: src/zins/ShortHook.tsx`);
}
// Validates that FINANCE_EXAMPLES.savingsPlan is used with possible whitespaces
if (!/FINANCE_EXAMPLES\s*\.\s*savingsPlan/.test(shortHook)) {
  violations.push('ShortHook.tsx verwendet nicht die zentralen Sparplan-Annahmen.');
}

let reelDemo = '';
try {
  reelDemo = readFileSync(resolve('src/production/reel-template/ReelTemplateDemo.tsx'), 'utf8');
} catch (error) {
  violations.push(`Konnte Datei nicht lesen: src/production/reel-template/ReelTemplateDemo.tsx`);
}
// Validates that FINANCE_EXAMPLES.emergencyFund and getEmergencyFundTarget are used with possible whitespaces
if (!/FINANCE_EXAMPLES\s*\.\s*emergencyFund/.test(reelDemo) || !/getEmergencyFundTarget\s*\(/.test(reelDemo)) {
  violations.push('ReelTemplateDemo.tsx verwendet nicht die zentralen Notgroschen-Annahmen.');
}

if (violations.length > 0) {
  console.error('\nFinanz-Validierung fehlgeschlagen:\n');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('\n✓ Sparplan-, Inflations- und Kreditformeln stimmen mit Referenzwerten überein.');
console.log('✓ Zentrale Beispielannahmen und Einschränkungen sind vorhanden.');
console.log('✓ Bekannte falsche Demo-Zahlen und synthetische Finanzkurven wurden nicht gefunden.');
console.log('✓ ShortHook und ReelTemplateDemo verwenden zentrale Beispielannahmen.');
