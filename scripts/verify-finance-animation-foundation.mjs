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
  'channels/finanzneo/src/animation-system/README.md',
  'channels/finanzneo/src/animation-system/ACTIVATION_CHECKLIST.md',
  'channels/finanzneo/src/animation-system/contracts.ts',
  'channels/finanzneo/src/animation-system/templateDataContracts.ts',
  'channels/finanzneo/src/animation-system/featureFlags.ts',
  'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts',
  'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.test.ts',
  'channels/finanzneo/src/animation-system/templates/registry.ts',
  'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts',
  'channels/finanzneo/src/animation-system/router/financeAnimationKeywords.ts',
  'channels/finanzneo/src/animation-system/router/rankFinanceAnimationCandidates.ts',
  'channels/finanzneo/src/animation-system/router/classifyFinanceScene.ts',
  'channels/finanzneo/src/animation-system/planning/selectAnimationTemplate.ts',
  'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.ts',
  'channels/finanzneo/src/animation-system/selector/planFinanceAnimationScene.ts',
  'channels/finanzneo/src/animation-system/selector/planFinanceAnimationActivation.test.ts',
  'channels/finanzneo/src/animation-system/fixtures/financeAnimationFixtures.ts',
  'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx',
  'channels/finanzneo/src/animation-system/render/SafeFinanceAnimationRenderer.tsx',
  'channels/finanzneo/src/animation-system/render/SafeFinanceAnimationRenderer.test.tsx',
  'channels/finanzneo/src/animation-system/render/validateTemplateData.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplateSemantics.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplatePresentation.ts',
  'channels/finanzneo/src/animation-system/gallery/AnimationGallery.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryOverview.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryRoot.tsx',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReel.tsx',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReel.test.tsx',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReelRoot.tsx',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReelRoot.test.tsx',
  'channels/finanzneo/src/animation-system/test-reel/test-reel-index.ts',
  'channels/finanzneo/tsconfig.animation-system.json',
  '.github/workflows/finance-animation-foundation.yml',
  '.github/workflows/finance-animation-runner-diagnostic.yml',
  ...templateFiles,
];

const requireTokens = (content, filePath, tokens) => {
  for (const token of tokens) {
    if (!content.includes(token)) {
      fail(`${filePath} enthält ${token} nicht.`);
    }
  }
};

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

const checkVisibleValuesAreRequired = async () => {
  const requiredDataPath =
    'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts';
  const requiredData = await readRepositoryFile(requiredDataPath);
  const requiredPatterns = [
    [
      /'portfolio-allocation':\s*\[[^\]]*'allocations'[^\]]*'total'/s,
      'Portfolio-Total ist nicht als Pflichtwert hinterlegt.',
    ],
    [
      /'debt-paydown':\s*\[[^\]]*'originalDebt'[^\]]*'remainingDebt'[^\]]*'paidInstallments'[^\]]*'totalInstallments'/s,
      'Kreditratenfortschritt ist nicht vollständig als Pflichtwert hinterlegt.',
    ],
  ];
  for (const [pattern, message] of requiredPatterns) {
    if (!pattern.test(requiredData)) fail(message);
  }

  const rendererPath =
    'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx';
  const renderer = await readRepositoryFile(rendererPath);
  for (const [pattern, message] of [
    [/numberValue\(scene, 'total',\s*\d+\)/, 'Der Renderer erfindet einen Portfoliowert.'],
    [/numberValue\(scene, 'paidInstallments',\s*\d+\)/, 'Der Renderer erfindet bezahlte Kreditraten.'],
    [/numberValue\(scene, 'totalInstallments',\s*\d+\)/, 'Der Renderer erfindet die Gesamtzahl der Kreditraten.'],
  ]) {
    if (pattern.test(renderer)) fail(message);
  }
};

const checkSharedRouting = async () => {
  const consumers = [
    'channels/finanzneo/src/animation-system/router/classifyFinanceScene.ts',
    'channels/finanzneo/src/animation-system/planning/selectAnimationTemplate.ts',
  ];
  for (const consumer of consumers) {
    requireTokens(await readRepositoryFile(consumer), consumer, [
      'rankFinanceAnimationCandidates',
      'haveAmbiguousTopCandidates',
    ]);
  }
};

const checkSafeInputBoundary = async () => {
  const parserPath =
    'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts';
  const parser = await readRepositoryFile(parserPath);
  requireTokens(parser, parserPath, [
    'validateAnimationScene',
    'validateTemplateData',
    'Object.getOwnPropertyDescriptors',
    'Object.getOwnPropertySymbols',
    'FINANCE_ANIMATION_FORBIDDEN_KEYS',
    'Object.create(null)',
    'parseFinanceAnimationRequestInternal',
    'parseFinanceAnimationSceneInternal',
    'konnte nicht sicher gelesen werden',
  ]);

  const safeRendererPath =
    'channels/finanzneo/src/animation-system/render/SafeFinanceAnimationRenderer.tsx';
  const safeRenderer = await readRepositoryFile(safeRendererPath);
  requireTokens(safeRenderer, safeRendererPath, [
    'parseFinanceAnimationScene',
    'renderFallback',
    'resolveFinanceAnimationFallbackContext',
    'errors: Object.freeze([...result.errors])',
    'warnings: Object.freeze([...result.warnings])',
  ]);
  if (/FinanceAnimationFallbackContext\s*=\s*\{[^}]*\binput\s*:/s.test(safeRenderer)) {
    fail('Der Fallback-Kontext exponiert weiterhin das rohe Eingabeobjekt.');
  }

  const safePlannerPath =
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.ts';
  requireTokens(await readRepositoryFile(safePlannerPath), safePlannerPath, [
    'parseFinanceAnimationRequest',
    'planFinanceAnimationScene',
  ]);

  const publicIndexPath =
    'channels/finanzneo/src/animation-system/index.ts';
  requireTokens(await readRepositoryFile(publicIndexPath), publicIndexPath, [
    "export * from './ingestion'",
    "export * from './selector/planFinanceAnimationInput'",
    "export * from './selector/planFinanceAnimationScene'",
    "export * from './render'",
  ]);
};

const checkActivationSimulation = async () => {
  const plannerPath =
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationScene.ts';
  requireTokens(await readRepositoryFile(plannerPath), plannerPath, [
    'planFinanceAnimationSceneWithFeatures',
    'classifyFinanceSceneWithFeatures',
    'planFinanceAnimationSceneFromDecision',
  ]);

  const activationTestPath =
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationActivation.test.ts';
  const activationTest = await readRepositoryFile(activationTestPath);
  requireTokens(activationTest, activationTestPath, [
    'FINANCE_ANIMATION_FIXTURES',
    'hybridFeatures',
    'fullAnimationFeatures',
    'allowAutomaticRouting: false',
  ]);
};

const checkTestReelCoverage = async () => {
  const reelPath =
    'channels/finanzneo/src/animation-system/test-reel/AnimationTestReel.tsx';
  requireTokens(await readRepositoryFile(reelPath), reelPath, [
    'FINANCE_ANIMATION_TEMPLATES.map',
    'SafeFinanceAnimationRenderer',
    "fallbackKind: 'missing-data'",
    "fallbackKind: 'unsafe-data'",
    "fallbackKind: 'invalid-mode'",
    'FinanceAnimationFallbackCard',
    'AnimationFallbackPreview',
  ]);

  const rootPath =
    'channels/finanzneo/src/animation-system/test-reel/AnimationTestReelRoot.tsx';
  requireTokens(await readRepositoryFile(rootPath), rootPath, [
    'id="FinanceAnimationTestReel"',
    'id="FinanceAnimationFallbackPreview"',
  ]);
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
    'finance:animation-gallery:sequence-still',
    'finance:animation-test-reel:still',
    'finance:animation-test-reel:render',
    'finance:animation-validate',
  ];
  for (const scriptName of requiredScripts) {
    if (typeof scripts[scriptName] !== 'string' || scripts[scriptName].trim() === '') {
      fail(`package.json enthält kein ausführbares Skript ${scriptName}.`);
    }
  }

  const validationScript = scripts['finance:animation-validate'] ?? '';
  for (const requiredStep of requiredScripts.slice(0, -2)) {
    if (!validationScript.includes(requiredStep)) {
      fail(`finance:animation-validate führt ${requiredStep} nicht aus.`);
    }
  }
};

const checkWorkflowCoverage = async () => {
  const workflowPath = '.github/workflows/finance-animation-foundation.yml';
  const workflow = await readRepositoryFile(workflowPath);
  requireTokens(workflow, workflowPath, [
    'finance:animation-structure',
    'finance:animation-isolation',
    'finance:animation-typecheck',
    'finance:animation-test',
    'finance:animation-gallery:still',
    'finance:animation-gallery:sequence-still',
    'finance:animation-test-reel:still',
    '/tmp/finance-animation-fallback-preview.png',
  ]);
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
  await checkVisibleValuesAreRequired();
  await checkSharedRouting();
  await checkSafeInputBoundary();
  await checkActivationSimulation();
  await checkTestReelCoverage();
  await checkPackageScripts();
  await checkWorkflowCoverage();
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
  console.log('Verified shared routing, hardened ingestion, sanitized fallbacks, activation simulation and full test-reel coverage.');
};

run().catch((error) => {
  console.error(
    `Finance animation foundation check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
