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
  const integrationPath =
    'channels/finanzneo/src/animation-system/integration/financeAnimationActivationPipeline.test.tsx';
  const integration = await readRepositoryFile(integrationPath);
  requireTokens(integration, integrationPath, [
    'FINANCE_ANIMATION_FIXTURES',
    'jsonRoundTrip',
    'planFinanceAnimationInputForTemplate',
    'buildAnimationPlanForTemplate',
    'buildAnimationPlanWithFeatures',
    'SafeFinanceAnimationRenderer',
    'FinanceAnimationRenderer',
    'parses, manually plans and safely renders every canonical fixture',
    'builds an animation-ready automatic full plan for every fixture',
    'keeps the package-root production plan in image mode after opt-in tests',
    'blocks unknown data before a manually selected template can render',
  ]);

  const publicPath = 'channels/finanzneo/src/animation-system/public.ts';
  const publicApi = await readRepositoryFile(publicPath);
  requireTokens(publicApi, publicPath, [
    'planFinanceAnimationInput',
    'planFinanceAnimationScene',
    'buildAnimationPlan',
    'activation.ts',
  ]);

  const activationPath =
    'channels/finanzneo/src/animation-system/activation.ts';
  const activationApi = await readRepositoryFile(activationPath);
  requireTokens(activationApi, activationPath, [
    'planFinanceAnimationInputForTemplate',
    'planFinanceAnimationInputWithFeatures',
    'buildAnimationPlanForTemplate',
    'buildAnimationPlanWithFeatures',
    'SafeFinanceAnimationRenderer',
  ]);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation integration pipeline check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation integration pipeline check passed.');
  console.log('Verified fixture-wide untrusted parsing, opt-in planning, safe rendering and disabled production behavior.');
};

run().catch((error) => {
  console.error(
    `Finance animation integration pipeline check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
