import {readdir, readFile} from 'node:fs/promises';
import process from 'node:process';

const repositoryRoot = new URL('../', import.meta.url);
const productionSourceRoot = 'channels/finanzneo/src';
const animationSystemDirectory = `${productionSourceRoot}/animation-system`;

const readRepositoryFile = async (relativePath) =>
  readFile(new URL(relativePath, repositoryRoot), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);

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
  'buildAnimationPlanForTemplate',
  'buildAnimationPlanWithFeatures',
  'planFinanceAnimationInput',
  'planFinanceAnimationInputForTemplate',
  'planFinanceAnimationInputWithFeatures',
  'planFinanceAnimationSceneForTemplate',
  'planFinanceAnimationSceneWithFeatures',
  'parseFinanceAnimationRequest',
  'parseFinanceAnimationScene',
  'classifyFinanceScene',
  'FINANCE_ANIMATION_FEATURES',
  'FINANCE_ANIMATION_INPUT_LIMITS',
  'FINANCE_ANIMATION_DOMAIN_LIMITS',
];

const protectedProductionFiles = [
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
  'channels/finanzneo/src/engine/FinanceImageFirstReel.tsx',
  'channels/finanzneo/src/FinanzNeoRoot.tsx',
];

const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const sourceExtension = (fileName) => {
  const index = fileName.lastIndexOf('.');
  return index >= 0 ? fileName.slice(index) : '';
};

const collectProductionSourceFiles = async (relativeDirectory) => {
  const entries = await readdir(
    new URL(`${relativeDirectory}/`, repositoryRoot),
    {withFileTypes: true},
  );
  const files = [];

  for (const entry of entries) {
    const relativePath = `${relativeDirectory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (relativePath === animationSystemDirectory) continue;
      files.push(...await collectProductionSourceFiles(relativePath));
      continue;
    }
    if (entry.isFile() && sourceExtensions.has(sourceExtension(entry.name))) {
      files.push(relativePath);
    }
  }

  return files;
};

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

  const productionFiles = await collectProductionSourceFiles(productionSourceRoot);
  for (const protectedFile of protectedProductionFiles) {
    if (!productionFiles.includes(protectedFile)) {
      fail(`Geschützte Produktionsdatei fehlt im vollständigen Scan: ${protectedFile}.`);
    }
  }

  for (const productionFile of productionFiles) {
    const content = await readRepositoryFile(productionFile);
    for (const forbiddenReference of forbiddenProductionReferences) {
      if (content.includes(forbiddenReference)) {
        fail(`${productionFile} verweist unerlaubt auf ${forbiddenReference}.`);
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation isolation check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation isolation check passed.');
  console.log(`Checked ${productionFiles.length} source files outside animation-system.`);
  console.log(`Blocked ${forbiddenProductionReferences.length} integration references.`);
  console.log('All animation feature flags remain disabled and frozen.');
};

run().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
  for (const failure of failures) {
    console.error(`Finance animation isolation check failed: ${failure}`);
  }
});
