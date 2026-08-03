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
      fail(`${filePath} exponiert unerlaubt ${token}.`);
    }
  }
};

const run = async () => {
  const rootPath = 'channels/finanzneo/src/animation-system/index.ts';
  const root = await readRepositoryFile(rootPath);
  const activeExportLines = root
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('export '));

  if (
    activeExportLines.length !== 1 ||
    activeExportLines[0] !== "export * from './public';"
  ) {
    fail(`${rootPath} muss ausschließlich die sichere public.ts-Grenze exportieren.`);
  }

  const publicPath = 'channels/finanzneo/src/animation-system/public.ts';
  const publicApi = await readRepositoryFile(publicPath);
  requireTokens(publicApi, publicPath, [
    'FINANCE_ANIMATION_DOMAIN_LIMITS',
    'parseFinanceAnimationRequest',
    'parseFinanceAnimationScene',
    'planFinanceAnimationInputForTemplate',
    'planFinanceAnimationInputWithFeatures',
    'planFinanceAnimationSceneForTemplate',
    'planFinanceAnimationSceneWithFeatures',
    'buildAnimationPlanForTemplate',
    'buildAnimationPlanWithFeatures',
    'SafeFinanceAnimationRenderer',
    'validateFinanceAnimationFeatureFlags',
    'FINANCE_ANIMATION_ALLOWED_DATA',
    'FINANCE_ANIMATION_REQUIRED_DATA',
  ]);
  forbidTokens(publicApi, publicPath, [
    "from './render/FinanceAnimationRenderer'",
    "from './gallery'",
    "from './test-reel'",
    "from './planning/selectAnimationTemplate'",
    'planFinanceAnimationSceneFromDecision',
    'buildAnimationPlanFromResult',
    'validateTemplateData',
    "from './calculations/financeMath'",
  ]);

  const internalPath = 'channels/finanzneo/src/animation-system/internal.ts';
  const internalApi = await readRepositoryFile(internalPath);
  requireTokens(internalApi, internalPath, [
    "export * from './domainLimits';",
    "export * from './calculations/financeMath';",
    "export * from './render';",
    "export * from './gallery';",
    "export * from './test-reel';",
    "export * from './planning/selectAnimationTemplate';",
  ]);

  const publicTestPath =
    'channels/finanzneo/src/animation-system/public.test.ts';
  const publicTest = await readRepositoryFile(publicTestPath);
  requireTokens(publicTest, publicTestPath, [
    'FINANCE_ANIMATION_DOMAIN_LIMITS',
    'futureValueLumpSum',
    'calculateCompoundInterest',
    'forbiddenPublicRuntimeExports',
    'requiredPublicRuntimeExports',
    'makes the package root identical to the safe public module',
    'keeps development-only APIs available only through the internal module',
  ]);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation public API check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation public API check passed.');
  console.log('Verified one safe package-root export and isolated internal development APIs.');
  console.log('Verified public domain limits while raw calculations remain internal.');
};

run().catch((error) => {
  console.error(
    `Finance animation public API check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
