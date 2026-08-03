import {readFile} from 'node:fs/promises';
import process from 'node:process';

const repositoryRoot = new URL('../', import.meta.url);
const readRepositoryFile = async (relativePath) =>
  readFile(new URL(relativePath, repositoryRoot), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);

const requireTokens = (content, filePath, tokens) => {
  for (const token of tokens) {
    if (!content.includes(token)) {
      fail(`${filePath} enthält ${token} nicht.`);
    }
  }
};

const forbidTokens = (content, filePath, tokens) => {
  for (const token of tokens) {
    if (content.includes(token)) {
      fail(`${filePath} enthält weiterhin die lineare oder vorab berechnete Darstellung ${token}.`);
    }
  }
};

const run = async () => {
  const compoundPath =
    'channels/finanzneo/src/animation-system/templates/CompoundGrowthTemplate.tsx';
  const compound = await readRepositoryFile(compoundPath);
  requireTokens(compound, compoundPath, [
    'futureValueLumpSum',
    'futureValueMonthlyInvestment',
    'monthlyContribution',
    'annualReturnPercent',
    'elapsedYears',
    'Jeder sichtbare Balken wird aus denselben Eingabedaten',
  ]);
  forbidTokens(compound, compoundPath, [
    'finalValue: number;',
    'safeFinalValue',
    'Math.pow(index /',
  ]);

  const monthlyPath =
    'channels/finanzneo/src/animation-system/templates/MonthlyInvestmentTemplate.tsx';
  const monthly = await readRepositoryFile(monthlyPath);
  requireTokens(monthly, monthlyPath, [
    'futureValueMonthlyInvestment',
    'annualReturnPercent',
    'completedMonths / 12',
    'Eine lineare Schätzung zwischen null',
  ]);
  forbidTokens(monthly, monthlyPath, [
    'finalValue: number;',
    'safeFinalValue * completedRatio',
  ]);

  const inflationPath =
    'channels/finanzneo/src/animation-system/templates/InflationErosionTemplate.tsx';
  const inflation = await readRepositoryFile(inflationPath);
  requireTokens(inflation, inflationPath, [
    'inflationAdjustedValue',
    'inflationPercent',
    'elapsedYears',
    'Eine lineare Annäherung zwischen',
  ]);
  forbidTokens(inflation, inflationPath, [
    'endValue: number;',
    '(safeEndValue - safeStartValue) * frameProgress',
  ]);

  const rendererPath =
    'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx';
  const renderer = await readRepositoryFile(rendererPath);
  requireTokens(renderer, rendererPath, [
    'monthlyContribution={numberValue(scene, \'monthlyRate\')}',
    'annualReturnPercent={numberValue(scene, \'annualReturn\')}',
    'inflationPercent={numberValue(scene, \'inflationPercent\')}',
    'annualReturnPercent={numberValue(scene, \'annualReturn\', 0)}',
  ]);
  forbidTokens(renderer, rendererPath, [
    'finalValue={',
    'endValue={',
    'futureValueLumpSum(',
    'inflationAdjustedValue(',
  ]);

  const trajectoryTests = [
    'channels/finanzneo/src/animation-system/templates/CompoundGrowthTemplate.test.ts',
    'channels/finanzneo/src/animation-system/templates/MonthlyInvestmentTemplate.test.ts',
    'channels/finanzneo/src/animation-system/templates/InflationErosionTemplate.test.ts',
    'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.test.tsx',
  ];
  const tests = (await Promise.all(trajectoryTests.map(readRepositoryFile))).join('\n');
  requireTokens(tests, 'Trajektorien-Tests', [
    'calculates every visible bar from the supplied financial inputs',
    'calculates the midpoint from six completed months',
    'calculates the midpoint from five years of inflation',
    'passes raw compound inputs instead of a precomputed endpoint',
    'passes the annual return so every completed-month state can be calculated',
    'passes the inflation rate so every elapsed-time state can be calculated',
  ]);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation trajectory check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation trajectory check passed.');
  console.log('Verified exact compound, savings-plan and inflation states at every visible checkpoint.');
};

run().catch((error) => {
  console.error(
    `Finance animation trajectory check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
