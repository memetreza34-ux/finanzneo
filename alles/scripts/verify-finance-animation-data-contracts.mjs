import {readFile} from 'node:fs/promises';
import process from 'node:process';

const repositoryRoot = new URL('../', import.meta.url);
const readRepositoryFile = async (relativePath) =>
  readFile(new URL(relativePath, repositoryRoot), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);

const templateIds = [
  'money-flow',
  'budget-split',
  'compound-growth',
  'portfolio-allocation',
  'inflation-erosion',
  'debt-paydown',
  'monthly-investment',
  'before-after-comparison',
  'risk-return-scale',
  'timeline-milestones',
  'income-expense-balance',
  'tax-fee-flow',
];

const requireTokens = (content, filePath, tokens) => {
  for (const token of tokens) {
    if (!content.includes(token)) {
      fail(`${filePath} enthält ${token} nicht.`);
    }
  }
};

const run = async () => {
  const allowedPath =
    'channels/finanzneo/src/animation-system/templates/allowedTemplateData.ts';
  const allowed = await readRepositoryFile(allowedPath);
  for (const templateId of templateIds) {
    if (!allowed.includes(`'${templateId}': [`)) {
      fail(`${allowedPath} enthält keine Allowlist für ${templateId}.`);
    }
  }
  requireTokens(allowed, allowedPath, [
    'FinanceAnimationTemplateDataMap',
    'satisfies FinanceAnimationAllowedDataMap',
    "'monthly-investment': ['monthlyRate', 'months', 'annualReturn']",
    "'portfolio-allocation': ['label', 'percent', 'value']",
    "'timeline-milestones': ['label', 'value']",
  ]);

  const requiredPath =
    'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts';
  const required = await readRepositoryFile(requiredPath);
  for (const templateId of templateIds) {
    if (!required.includes(`'${templateId}': [`)) {
      fail(`${requiredPath} enthält keine Pflichtfelder für ${templateId}.`);
    }
  }

  const validatorPath =
    'channels/finanzneo/src/animation-system/render/validateTemplateData.ts';
  const validator = await readRepositoryFile(validatorPath);
  requireTokens(validator, validatorPath, [
    'FINANCE_ANIMATION_ALLOWED_DATA',
    'FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS',
    'Unbekanntes Datenfeld für',
    'Unbekanntes Portfolio-Feld in Position',
    'Unbekanntes Meilenstein-Feld in Position',
  ]);

  const presentationPath =
    'channels/finanzneo/src/animation-system/render/validateTemplatePresentation.ts';
  const presentation = await readRepositoryFile(presentationPath);
  requireTokens(presentation, presentationPath, [
    'Portfolio-Positionen müssen einheitlich entweder percent oder value verwenden.',
    'Portfolio-Werte ergeben',
    'portfolioValueTolerance',
  ]);

  const exactTestPath =
    'channels/finanzneo/src/animation-system/render/validateExactTemplateData.test.ts';
  const exactTest = await readRepositoryFile(exactTestPath);
  requireTokens(exactTest, exactTestPath, [
    'rejects unknown top-level data fields',
    'rejects unknown fields inside portfolio entries',
    'rejects unknown fields inside timeline milestones',
    'rejects mixed portfolio weighting modes',
    'rejects value-based allocations whose sum differs from the displayed total',
  ]);

  const allowlistTestPath =
    'channels/finanzneo/src/animation-system/templates/allowedTemplateData.test.ts';
  const allowlistTest = await readRepositoryFile(allowlistTestPath);
  requireTokens(allowlistTest, allowlistTestPath, [
    'contains every registered template exactly once',
    'contains every required field for each template',
    'does not contain duplicate fields',
  ]);

  const rendererPath =
    'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx';
  const renderer = await readRepositoryFile(rendererPath);
  if (/numberValue\(scene, 'total',\s*\d+\)/.test(renderer)) {
    fail('Der Renderer erfindet einen Portfoliogesamtwert.');
  }
  if (/numberValue\(scene, 'paidInstallments',\s*\d+\)/.test(renderer)) {
    fail('Der Renderer erfindet bezahlte Kreditraten.');
  }
  if (/numberValue\(scene, 'totalInstallments',\s*\d+\)/.test(renderer)) {
    fail('Der Renderer erfindet die Gesamtratenzahl.');
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation data contract check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation data contract check passed.');
  console.log(`Verified exact allowlists and required fields for ${templateIds.length} templates.`);
  console.log('Verified strict nested portfolio and timeline entry contracts.');
};

run().catch((error) => {
  console.error(
    `Finance animation data contract check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
