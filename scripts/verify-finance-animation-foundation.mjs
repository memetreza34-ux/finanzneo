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
  'channels/finanzneo/src/animation-system/ACTIVATION_CHECKLIST.md',
  'channels/finanzneo/src/animation-system/contracts.ts',
  'channels/finanzneo/src/animation-system/templateDataContracts.ts',
  'channels/finanzneo/src/animation-system/featureFlags.ts',
  'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts',
  'channels/finanzneo/src/animation-system/templates/registry.ts',
  'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts',
  'channels/finanzneo/src/animation-system/router/financeAnimationKeywords.ts',
  'channels/finanzneo/src/animation-system/router/rankFinanceAnimationCandidates.ts',
  'channels/finanzneo/src/animation-system/router/classifyFinanceScene.ts',
  'channels/finanzneo/src/animation-system/planning/selectAnimationTemplate.ts',
  'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.ts',
  'channels/finanzneo/src/animation-system/selector/planFinanceAnimationScene.ts',
  'channels/finanzneo/src/animation-system/fixtures/financeAnimationFixtures.ts',
  'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx',
  'channels/finanzneo/src/animation-system/render/SafeFinanceAnimationRenderer.tsx',
  'channels/finanzneo/src/animation-system/render/validateTemplateData.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplateSemantics.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplatePresentation.ts',
  'channels/finanzneo/src/animation-system/gallery/AnimationGallery.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryOverview.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryRoot.tsx',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReel.tsx',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReelRoot.tsx',
  'channels/finanzneo/src/animation-system/test-reel/test-reel-index.ts',
  'channels/finanzneo/tsconfig.animation-system.json',
  '.github/workflows/finance-animation-foundation.yml',
  '.github/workflows/finance-animation-runner-diagnostic.yml',
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

const checkVisibleValuesAreRequired = async () => {
  const requiredData = await readRepositoryFile(
    'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts',
  );
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

  const renderer = await readRepositoryFile(
    'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx',
  );
  if (/numberValue\(scene, 'total',\s*\d+\)/.test(renderer)) {
    fail('Der Renderer erfindet weiterhin einen Portfoliowert.');
  }
  if (/numberValue\(scene, 'paidInstallments',\s*\d+\)/.test(renderer)) {
    fail('Der Renderer erfindet weiterhin bezahlte Kreditraten.');
  }
  if (/numberValue\(scene, 'totalInstallments',\s*\d+\)/.test(renderer)) {
    fail('Der Renderer erfindet weiterhin die Gesamtzahl der Kreditraten.');
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

const checkSafeInputBoundary = async () => {
  const safeRenderer = await readRepositoryFile(
    'channels/finanzneo/src/animation-system/render/SafeFinanceAnimationRenderer.tsx',
  );
  for (const requiredToken of [
    'parseFinanceAnimationScene',
    'renderFallback',
    'resolveFinanceAnimationFallbackContext',
  ]) {
    if (!safeRenderer.includes(requiredToken)) {
      fail(`Der sichere Renderer enthält ${requiredToken} nicht.`);
    }
  }

  const safePlanner = await readRepositoryFile(
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.ts',
  );
  if (!safePlanner.includes('parseFinanceAnimationRequest')) {
    fail('Der sichere Planner umgeht die Request-Parsergrenze.');
  }
  if (!safePlanner.includes('planFinanceAnimationScene')) {
    fail('Der sichere Planner reicht gültige Requests nicht an den zentralen Planner weiter.');
  }

  const parser = await readRepositoryFile(
    'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts',
  );
  for (const requiredValidation of ['validateAnimationScene', 'validateTemplateData']) {
    if (!parser.includes(requiredValidation)) {
      fail(`Der Eingabeparser führt ${requiredValidation} nicht aus.`);
    }
  }
  for (const hardeningToken of [
    'Object.getOwnPropertyDescriptors',
    'Object.getOwnPropertySymbols',
    'FINANCE_ANIMATION_FORBIDDEN_KEYS',
    'Object.create(null)',
  ]) {
    if (!parser.includes(hardeningToken)) {
      fail(`Der Eingabeparser enthält die Schutzmaßnahme ${hardeningToken} nicht.`);
    }
  }

  const publicIndex = await readRepositoryFile(
    'channels/finanzneo/src/animation-system/index.ts',
  );
  for (const safeEntryPoint of [
    "export * from './ingestion'",
    "export * from './selector/planFinanceAnimationInput'",
    "export * from './render'",
  ]) {
    if (!publicIndex.includes(safeEntryPoint)) {
      fail(`Öffentlicher Animationsexport enthält ${safeEntryPoint} nicht.`);
    }
  }
};

const checkTestReelCoverage = async () => {
  const reelPath =
    'channels/finanzneo/src/animation-system/test-reel/AnimationTestReel.tsx';
  const reel = await readRepositoryFile(reelPath);

  for (const requiredToken of [
    'FINANCE_ANIMATION_TEMPLATES.map',
    'SafeFinanceAnimationRenderer',
    "fallbackKind: 'missing-data'",
    "fallbackKind: 'unsafe-data'",
    "fallbackKind: 'invalid-mode'",
    'FinanceAnimationFallbackCard',
    'AnimationFallbackPreview',
  ]) {
    if (!reel.includes(requiredToken)) {
      fail(`${reelPath} enthält ${requiredToken} nicht.`);
    }
  }

  const rootPath =
    'channels/finanzneo/src/animation-system/test-reel/AnimationTestReelRoot.tsx';
  const root = await readRepositoryFile(rootPath);
  for (const compositionId of [
    'FinanceAnimationTestReel',
    'FinanceAnimationFallbackPreview',
  ]) {
    if (!root.includes(`id="${compositionId}"`)) {
      fail(`${rootPath} registriert ${compositionId} nicht.`);
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
  for (const requiredStep of [
    'finance:animation-structure',
    'finance:animation-isolation',
    'finance:animation-typecheck',
    'finance:animation-test',
    'finance:animation-gallery:still',
    'finance:animation-gallery:sequence-still',
    'finance:animation-test-reel:still',
  ]) {
    if (!validationScript.includes(requiredStep)) {
      fail(`finance:animation-validate führt ${requiredStep} nicht aus.`);
    }
  }
};

const checkWorkflowCoverage = async () => {
  const workflow = await readRepositoryFile(
    '.github/workflows/finance-animation-foundation.yml',
  );
  for (const requiredCommand of [
    'finance:animation-structure',
    'finance:animation-isolation',
    'finance:animation-typecheck',
    'finance:animation-test',
    'finance:animation-gallery:still',
    'finance:animation-gallery:sequence-still',
    'finance:animation-test-reel:still',
  ]) {
    if (!workflow.includes(requiredCommand)) {
      fail(`Foundation-Workflow führt ${requiredCommand} nicht aus.`);
    }
  }
  if (!workflow.includes('/tmp/finance-animation-fallback-preview.png')) {
    fail('Foundation-Workflow lädt die Fallback-Vorschau nicht als Artefakt hoch.');
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
  await checkVisibleValuesAreRequired();
  await checkSharedCandidateRanking();
  await checkSafeInputBoundary();
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
  console.log('Verified shared routing, hardened ingestion, safe fallbacks and full test-reel coverage.');
};

run().catch((error) => {
  console.error(
    `Finance animation foundation check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
