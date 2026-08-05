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

const run = async () => {
  const limitsPath =
    'channels/finanzneo/src/animation-system/domainLimits.ts';
  const limits = await readRepositoryFile(limitsPath);
  requireTokens(limits, limitsPath, [
    'Object.freeze',
    'maxAbsoluteMoney',
    'maxYears',
    'maxMonths',
    'maxInstallments',
    'maxTimelineAbsoluteValue',
    'maxVisibleLabelLength',
  ]);

  const validatorPath =
    'channels/finanzneo/src/animation-system/render/validateTemplateData.ts';
  const validator = await readRepositoryFile(validatorPath);
  requireTokens(validator, validatorPath, [
    'FINANCE_ANIMATION_DOMAIN_LIMITS',
    'Geldwert überschreitet das Darstellungsmaximum',
    'Laufzeit überschreitet',
    'Ratenzahl überschreitet',
    'Portfolio-Wert in Position',
    'Meilenstein-Wert in Position',
    'maxVisibleLabelLength',
  ]);

  const semanticsPath =
    'channels/finanzneo/src/animation-system/render/validateTemplateSemantics.ts';
  const semantics = await readRepositoryFile(semanticsPath);
  requireTokens(semantics, semanticsPath, [
    'futureValueLumpSum',
    'futureValueMonthlyInvestment',
    'exceedsDisplayDomain',
    'Der berechnete Zinseszins-Endwert überschreitet das Darstellungsmaximum.',
    'Der berechnete Sparplan-Endwert überschreitet das Darstellungsmaximum.',
  ]);

  const domainTestPath =
    'channels/finanzneo/src/animation-system/render/validateDomainLimits.test.ts';
  const domainTest = await readRepositoryFile(domainTestPath);
  requireTokens(domainTest, domainTestPath, [
    'rejects compound and inflation periods above one hundred years',
    'rejects monthly plans above the supported month range',
    'rejects installment counts above the supported range',
    'rejects top-level money values above the display maximum',
    'rejects oversized structured labels',
    'accepts exact upper boundaries',
  ]);

  const derivedTestPath =
    'channels/finanzneo/src/animation-system/render/validateDerivedValues.test.ts';
  const derivedTest = await readRepositoryFile(derivedTestPath);
  requireTokens(derivedTest, derivedTestPath, [
    'rejects a compound-growth result above the display maximum',
    'rejects a monthly-investment result above the display maximum',
    'accepts normal compound-growth fixture values',
    'keeps a negative but valid monthly return within the display domain',
  ]);

  const publicPath = 'channels/finanzneo/src/animation-system/public.ts';
  const publicApi = await readRepositoryFile(publicPath);
  requireTokens(publicApi, publicPath, [
    'FINANCE_ANIMATION_DOMAIN_LIMITS',
    'FinanceAnimationDomainLimits',
  ]);
  if (publicApi.includes("from './calculations/financeMath'")) {
    fail('Die öffentliche API exponiert rohe, nicht validierte Finanzberechnungen.');
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation domain limit check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation domain limit check passed.');
  console.log('Verified bounded input values, derived values and structured labels.');
};

run().catch((error) => {
  console.error(
    `Finance animation domain limit check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
