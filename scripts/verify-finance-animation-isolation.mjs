import {readFile} from 'node:fs/promises';
import process from 'node:process';

const repositoryRoot = new URL('../', import.meta.url);

const readRepositoryFile = async (relativePath) =>
  readFile(new URL(relativePath, repositoryRoot), 'utf8');

const fail = (message) => {
  console.error(`Finance animation isolation check failed: ${message}`);
  process.exitCode = 1;
};

const forbiddenProductionReferences = [
  'animation-system',
  'FinanceAnimationRenderer',
  'SafeFinanceAnimationRenderer',
  'FinanceAnimationGalleryRoot',
  'FinanceAnimationFrameMatrix',
  'AnimationFrameMatrix',
  'FinanceAnimationTestReelRoot',
  'FinanceAnimationFallbackPreview',
  'FinanceAnimationFallbackCard',
  'AnimationTestReel',
  'buildAnimationPlan',
  'planFinanceAnimationInput',
  'planFinanceAnimationSceneWithFeatures',
  'parseFinanceAnimationRequest',
  'parseFinanceAnimationScene',
  'classifyFinanceScene',
];

const productionFiles = [
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
  'channels/finanzneo/src/engine/FinanceImageFirstReel.tsx',
  'channels/finanzneo/src/FinanzNeoRoot.tsx',
];

const featureFlagsPath =
  'channels/finanzneo/src/animation-system/featureFlags.ts';

const run = async () => {
  const featureFlags = await readRepositoryFile(featureFlagsPath);
  const requiredDisabledFlags = [
    'enabled: false',
    'allowHybrid: false',
    'allowFullAnimation: false',
    'allowAutomaticRouting: false',
  ];

  for (const disabledFlag of requiredDisabledFlags) {
    if (!featureFlags.includes(disabledFlag)) {
      fail(`${featureFlagsPath} enthält nicht mehr "${disabledFlag}".`);
    }
  }

  if (!featureFlags.includes('Object.freeze')) {
    fail(`${featureFlagsPath} ist nicht zur Laufzeit eingefroren.`);
  }

  for (const productionFile of productionFiles) {
    const content = await readRepositoryFile(productionFile);
    for (const forbiddenReference of forbiddenProductionReferences) {
      if (content.includes(forbiddenReference)) {
        fail(`${productionFile} verweist unerlaubt auf ${forbiddenReference}.`);
      }
    }
  }

  if (process.exitCode) return;

  console.log('Finance animation isolation check passed.');
  console.log(`Checked ${productionFiles.length} production files.`);
  console.log(`Blocked ${forbiddenProductionReferences.length} animation integration references.`);
  console.log('All animation feature flags remain disabled and frozen.');
};

run().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
