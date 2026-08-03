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
  'channels/finanzneo/src/animation-system/public.ts',
  'channels/finanzneo/src/animation-system/public.test.ts',
  'channels/finanzneo/src/animation-system/internal.ts',
  'channels/finanzneo/src/animation-system/index.ts',
  'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts',
  'channels/finanzneo/src/animation-system/templates/registry.ts',
  'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts',
  'channels/finanzneo/src/animation-system/templates/allowedTemplateData.ts',
  'channels/finanzneo/src/animation-system/router/financeAnimationKeywords.ts',
  'channels/finanzneo/src/animation-system/router/rankFinanceAnimationCandidates.ts',
  'channels/finanzneo/src/animation-system/router/classifyFinanceScene.ts',
  'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.ts',
  'channels/finanzneo/src/animation-system/selector/planFinanceAnimationScene.ts',
  'channels/finanzneo/src/animation-system/planning/buildAnimationPlan.ts',
  'channels/finanzneo/src/animation-system/fixtures/financeAnimationFixtures.ts',
  'channels/finanzneo/src/animation-system/render/FinanceAnimationRenderer.tsx',
  'channels/finanzneo/src/animation-system/render/SafeFinanceAnimationRenderer.tsx',
  'channels/finanzneo/src/animation-system/render/validateTemplateData.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplateSemantics.ts',
  'channels/finanzneo/src/animation-system/render/validateTemplatePresentation.ts',
  'channels/finanzneo/src/animation-system/gallery/AnimationGallery.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryOverview.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationFrameMatrix.tsx',
  'channels/finanzneo/src/animation-system/gallery/AnimationGalleryRoot.tsx',
  'channels/finanzneo/src/animation-system/gallery/VISUAL_QA_REPORT.md',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReel.tsx',
  'channels/finanzneo/src/animation-system/test-reel/AnimationTestReelRoot.tsx',
  'channels/finanzneo/src/animation-system/test-reel/test-reel-index.ts',
  'channels/finanzneo/tsconfig.animation-system.json',
  'scripts/verify-finance-animation-data-contracts.mjs',
  'scripts/verify-finance-animation-activation-policy.mjs',
  'scripts/verify-finance-animation-public-api.mjs',
  'scripts/verify-finance-animation-frame-matrix.mjs',
  'scripts/verify-finance-animation-isolation.mjs',
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
    'channels/finanzneo/src/animation-system/contracts.ts',
    'channels/finanzneo/src/animation-system/templateDataContracts.ts',
    'channels/finanzneo/src/animation-system/templates/registry.ts',
    'channels/finanzneo/src/animation-system/templates/requiredTemplateData.ts',
    'channels/finanzneo/src/animation-system/templates/allowedTemplateData.ts',
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

const checkSafeInputAndRenderBoundaries = async () => {
  const parserPath =
    'channels/finanzneo/src/animation-system/ingestion/parseFinanceAnimationInput.ts';
  requireTokens(await readRepositoryFile(parserPath), parserPath, [
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

  const validatorPath =
    'channels/finanzneo/src/animation-system/render/validateTemplateData.ts';
  requireTokens(await readRepositoryFile(validatorPath), validatorPath, [
    'FINANCE_ANIMATION_ALLOWED_DATA',
    'FINANCE_ANIMATION_STRUCTURED_ENTRY_KEYS',
    'Unbekanntes Datenfeld für',
    'validateTemplateSemantics',
    'validateTemplatePresentation',
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
};

const checkStagedPlanning = async () => {
  const featuresPath =
    'channels/finanzneo/src/animation-system/featureFlags.ts';
  requireTokens(await readRepositoryFile(featuresPath), featuresPath, [
    'Object.freeze',
    'validateFinanceAnimationFeatureFlags',
    'enabled: false',
    'allowHybrid: false',
    'allowFullAnimation: false',
    'allowAutomaticRouting: false',
  ]);

  const scenePlannerPath =
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationScene.ts';
  requireTokens(await readRepositoryFile(scenePlannerPath), scenePlannerPath, [
    'planFinanceAnimationSceneForTemplate',
    'planFinanceAnimationSceneWithFeatures',
    'planFinanceAnimationSceneFromDecision',
  ]);

  const inputPlannerPath =
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.ts';
  requireTokens(await readRepositoryFile(inputPlannerPath), inputPlannerPath, [
    'planFinanceAnimationInputForTemplate',
    'planFinanceAnimationInputWithFeatures',
    'parseFinanceAnimationRequest',
  ]);

  const finalPlanPath =
    'channels/finanzneo/src/animation-system/planning/buildAnimationPlan.ts';
  requireTokens(await readRepositoryFile(finalPlanPath), finalPlanPath, [
    'buildAnimationPlanForTemplate',
    'buildAnimationPlanWithFeatures',
    'result.decision.blockedReasons',
  ]);
};

const checkPublicBoundary = async () => {
  const rootPath = 'channels/finanzneo/src/animation-system/index.ts';
  const root = await readRepositoryFile(rootPath);
  const activeExports = root
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('export '));
  if (
    activeExports.length !== 1 ||
    activeExports[0] !== "export * from './public';"
  ) {
    fail(`${rootPath} muss ausschließlich public.ts exportieren.`);
  }

  const publicPath = 'channels/finanzneo/src/animation-system/public.ts';
  requireTokens(await readRepositoryFile(publicPath), publicPath, [
    'SafeFinanceAnimationRenderer',
    'planFinanceAnimationInputForTemplate',
    'planFinanceAnimationInputWithFeatures',
    'buildAnimationPlanForTemplate',
    'buildAnimationPlanWithFeatures',
    'FINANCE_ANIMATION_ALLOWED_DATA',
  ]);
};

const checkVisualQaAndTestReel = async () => {
  const matrixPath =
    'channels/finanzneo/src/animation-system/gallery/AnimationFrameMatrix.tsx';
  requireTokens(await readRepositoryFile(matrixPath), matrixPath, [
    'FINANCE_ANIMATION_GALLERY_ITEMS.flatMap',
    "id: 'start'",
    "id: 'middle'",
    "id: 'end'",
    'freeze={item.checkpoint.frame}',
    'durationInFrames={FINANCE_ANIMATION_CARD_DURATION}',
    'width={SOURCE_WIDTH}',
    'height={SOURCE_HEIGHT}',
  ]);

  const reelPath =
    'channels/finanzneo/src/animation-system/test-reel/AnimationTestReel.tsx';
  requireTokens(await readRepositoryFile(reelPath), reelPath, [
    'FINANCE_ANIMATION_TEMPLATES.map',
    'SafeFinanceAnimationRenderer',
    "fallbackKind: 'missing-data'",
    "fallbackKind: 'unsafe-data'",
    "fallbackKind: 'invalid-mode'",
    'AnimationFallbackPreview',
  ]);

  const rootPath =
    'channels/finanzneo/src/animation-system/test-reel/AnimationTestReelRoot.tsx';
  requireTokens(await readRepositoryFile(rootPath), rootPath, [
    'id="FinanceAnimationTestReel"',
    'id="FinanceAnimationFallbackPreview"',
  ]);
};

const checkPackageAndWorkflow = async () => {
  const packageJson = JSON.parse(await readRepositoryFile('package.json'));
  const scripts = packageJson.scripts ?? {};
  const requiredScripts = [
    'finance:animation-structure',
    'finance:animation-isolation',
    'finance:animation-typecheck',
    'finance:animation-test',
    'finance:animation-gallery:still',
    'finance:animation-gallery:sequence-still',
    'finance:animation-gallery:matrix-still',
    'finance:animation-test-reel:still',
    'finance:animation-test-reel:render',
    'finance:animation-validate',
  ];
  for (const scriptName of requiredScripts) {
    if (typeof scripts[scriptName] !== 'string' || scripts[scriptName].trim() === '') {
      fail(`package.json enthält kein ausführbares Skript ${scriptName}.`);
    }
  }

  const structureScript = scripts['finance:animation-structure'] ?? '';
  for (const verifier of [
    'verify-finance-animation-foundation.mjs',
    'verify-finance-animation-data-contracts.mjs',
    'verify-finance-animation-activation-policy.mjs',
    'verify-finance-animation-public-api.mjs',
    'verify-finance-animation-frame-matrix.mjs',
  ]) {
    if (!structureScript.includes(verifier)) {
      fail(`finance:animation-structure führt ${verifier} nicht aus.`);
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
    'finance:animation-gallery:matrix-still',
    'finance:animation-test-reel:still',
  ]) {
    if (!validationScript.includes(requiredStep)) {
      fail(`finance:animation-validate führt ${requiredStep} nicht aus.`);
    }
  }

  const workflowPath = '.github/workflows/finance-animation-foundation.yml';
  const workflow = await readRepositoryFile(workflowPath);
  requireTokens(workflow, workflowPath, [
    'finance:animation-structure',
    'finance:animation-isolation',
    'finance:animation-typecheck',
    'finance:animation-test',
    'finance:animation-gallery:still',
    'finance:animation-gallery:sequence-still',
    'finance:animation-gallery:matrix-still',
    'finance:animation-test-reel:still',
    '/tmp/finance-animation-frame-matrix.png',
    '/tmp/finance-animation-fallback-preview.png',
    'FinanceProductionLayer.tsx',
    'FinanceImageFirstReel.tsx',
    'FinanzNeoRoot.tsx',
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
  await checkSafeInputAndRenderBoundaries();
  await checkStagedPlanning();
  await checkPublicBoundary();
  await checkVisualQaAndTestReel();
  await checkPackageAndWorkflow();
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
  console.log('Verified safe public boundary, staged planning, hardened ingestion and isolated visual QA.');
};

run().catch((error) => {
  console.error(
    `Finance animation foundation check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
