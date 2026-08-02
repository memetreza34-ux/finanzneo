import {access, readFile} from 'node:fs/promises';
import process from 'node:process';

const repositoryRoot = new URL('../', import.meta.url);

const pathUrl = (relativePath) => new URL(relativePath, repositoryRoot);
const readRepositoryFile = async (relativePath) =>
  readFile(pathUrl(relativePath), 'utf8');

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

const templateFiles = [
  'MoneyFlowTemplate.tsx',
  'BudgetSplitTemplate.tsx',
  'CompoundGrowthTemplate.tsx',
  'PortfolioAllocationTemplate.tsx',
  'InflationErosionTemplate.tsx',
  'DebtPaydownTemplate.tsx',
  'MonthlyInvestmentTemplate.tsx',
  'BeforeAfterComparisonTemplate.tsx',
  'RiskReturnScaleTemplate.tsx',
  'TimelineMilestonesTemplate.tsx',
  'IncomeExpenseBalanceTemplate.tsx',
  'TaxFeeFlowTemplate.tsx',
].map((fileName) =>
  `channels/finanzneo/src/animation-system/templates/${fileName}`,
);

const criticalFiles = [
  'channels/finanzneo/src/animation-system/contracts.ts',
  'channels/finanzneo/src/animation-system/templateDataContracts.ts',
  'channels/finanzneo/src/animation-system/featureFlags.ts',
  'channels/finanzneo/src/animation-system/templates/registry.ts',
  'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts',
  'channels/finanzneo/src/animation-system/router/financeAnimationKeywords.ts',
  'channels/finanzneo/src/animation-system/router/rankFinanceAnimationCandidates.ts',
  'channels/finanzneo/src/animation-system/router/classifyFinanceScene.ts',
  'channels/finanzneo/src/animation-system/planning/selectAnimationTemplate.ts',
  'channels/finanzneo/src/animation-system/fixtures/financeAnimationFixtures.ts',
  'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx',
  'channels/finanzneo/src/animation-system/render/validateTemplateData.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplateSemantics.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplatePresentation.ts',
  'channels/finanzneo/src/animation-system/gallery/AnimationGallery.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryOverview.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryRoot.tsx',
  'channels/finanzneo/tsconfig.animation-system.json',
  '.github/workflows/finance-animation-foundation.yml',
  ...templateFiles,
];

const checkFilesExist = async () => {
  await Promise.all(criticalFiles.map(async (filePath) => {
    try {
      await access(pathUrl(filePath));
    } catch {
      fail(`Pflichtdatei fehlt: ${filePath}`);
    }
  }));
};

const checkTemplateCoverage = async () => {
  const coverageFiles = [
    'channels/finanzneo/src/animation-system/templateDataContracts.ts',
    'channels/finanzneo/src/animation-system/templates/registry.ts',
    'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts',
    'channels/finanzneo/src/animation-system/router/financeAnimationKeywords.ts',
    'channels/finanzneo/src/animation-system/fixtures/financeAnimationFixtures.ts',
  ];
  const contents = await Promise.all(coverageFiles.map(readRepositoryFile));

  for (const templateId of templateIds) {
    for (const [index, content] of contents.entries()) {
      if (!content.includes(`'${templateId}'`)) {
        fail(`${coverageFiles[index]} enthält Template-ID ${templateId} nicht.`);
      }
    }
  }
};

const checkSharedCandidateRanking = async () => {
  const consumers = [
    'channels/finanzneo/src/animation-system/router/classifyFinanceScene.ts',
    'channels/finanzneo/src/animation-system/planning/selectAnimationTemplate.ts',
  ];

  for (const consumer of consumers) {
    const content = await readRepositoryFile(consumer);
    if (!content.includes('rankFinanceAnimationCandidates')) {
      fail(`${consumer} umgeht die gemeinsame Kandidatenbewertung.`);
    }
    if (!content.includes('haveAmbiguousTopCandidates')) {
      fail(`${consumer} besitzt keinen gemeinsamen Mehrdeutigkeits-Fallback.`);
    }
  }
};

const checkPackageScripts = async () => {
  const packageJson = JSON.parse(await readRepositoryFile('package.json'));
  const scripts = packageJson.scripts ?? {};
  const requiredScripts = [
    'finance:animation-structure',
    'finance:animation-isolation',
    'finance:animation-typecheck',
    'finance:animation-test',
    'finance:animation-gallery:still',
    'finance:animation-validate',
  ];

  for (const scriptName of requiredScripts) {
    if (typeof scripts[scriptName] !== 'string' || scripts[scriptName].trim() === '') {
      fail(`package.json enthält kein ausführbares Skript ${scriptName}.`);
    }
  }

  const validationScript = scripts['finance:animation-validate'] ?? '';
  for (const requiredStep of [
    'finance:animation-structure',
    'finance:animation-isolation',
    'finance:animation-typecheck',
    'finance:animation-test',
    'finance:animation-gallery:still',
  ]) {
    if (!validationScript.includes(requiredStep)) {
      fail(`finance:animation-validate führt ${requiredStep} nicht aus.`);
    }
  }
};

const checkDedicatedTypeScriptScope = async () => {
  const tsconfig = JSON.parse(await readRepositoryFile(
    'channels/finanzneo/tsconfig.animation-system.json',
  ));
  const includes = Array.isArray(tsconfig.include) ? tsconfig.include : [];
  if (!includes.some((entry) => String(entry).includes('src/animation-system'))) {
    fail('Die isolierte TypeScript-Konfiguration umfasst das Animationssystem nicht.');
  }
};

const run = async () => {
  await checkFilesExist();
  await checkTemplateCoverage();
  await checkSharedCandidateRanking();
  await checkPackageScripts();
  await checkDedicatedTypeScriptScope();

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation foundation check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation foundation structure check passed.');
  console.log(`Verified ${templateIds.length} template identifiers.`);
  console.log(`Verified ${criticalFiles.length} required files.`);
  console.log('Verified shared routing and ambiguity handling.');
};

run().catch((error) => {
  console.error(
    `Finance animation foundation check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
