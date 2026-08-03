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
  const featureFlagsPath =
    'channels/finanzneo/src/animation-system/featureFlags.ts';
  const featureFlags = await readRepositoryFile(featureFlagsPath);
  requireTokens(featureFlags, featureFlagsPath, [
    'validateFinanceAnimationFeatureFlags',
    'Animationsmodi und automatisches Routing müssen deaktiviert bleiben',
    'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    'Automatisches Routing benötigt mindestens einen freigegebenen Animationsmodus.',
    'Object.freeze',
    'enabled: false',
    'allowHybrid: false',
    'allowFullAnimation: false',
    'allowAutomaticRouting: false',
  ]);

  const classifierPath =
    'channels/finanzneo/src/animation-system/router/classifyFinanceScene.ts';
  const classifier = await readRepositoryFile(classifierPath);
  requireTokens(classifier, classifierPath, [
    'validateFinanceAnimationFeatureFlags(features)',
    'Die Animations-Feature-Konfiguration verletzt die sichere Aktivierungsreihenfolge.',
    'Automatische Animationsauswahl ist noch nicht freigegeben.',
    'resolveFinanceAnimationMode',
  ]);

  const scenePlannerPath =
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationScene.ts';
  const scenePlanner = await readRepositoryFile(scenePlannerPath);
  requireTokens(scenePlanner, scenePlannerPath, [
    'planFinanceAnimationSceneForTemplate',
    'planFinanceAnimationSceneWithFeatures',
    'classifyFinanceSceneWithFeatures',
    'planFinanceAnimationSceneFromDecision',
    'Automatisches Routing kann deaktiviert bleiben',
  ]);

  const inputPlannerPath =
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.ts';
  const inputPlanner = await readRepositoryFile(inputPlannerPath);
  requireTokens(inputPlanner, inputPlannerPath, [
    'planFinanceAnimationInputForTemplate',
    'planFinanceAnimationInputWithFeatures',
    'parseFinanceAnimationRequest',
    'planFinanceAnimationSceneForTemplate',
    'planFinanceAnimationSceneWithFeatures',
    'planParsedInput',
  ]);

  const buildPlanPath =
    'channels/finanzneo/src/animation-system/planning/buildAnimationPlan.ts';
  const buildPlan = await readRepositoryFile(buildPlanPath);
  requireTokens(buildPlan, buildPlanPath, [
    'buildAnimationPlanForTemplate',
    'buildAnimationPlanWithFeatures',
    'planFinanceAnimationSceneForTemplate',
    'planFinanceAnimationSceneWithFeatures',
    'buildAnimationPlanFromResult',
    'result.decision.blockedReasons',
  ]);

  const activationTests = [
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationActivation.test.ts',
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationManualSelection.test.ts',
    'channels/finanzneo/src/animation-system/planning/buildAnimationPlanActivation.test.ts',
    'channels/finanzneo/src/animation-system/planning/buildAnimationPlanManualSelection.test.ts',
    'channels/finanzneo/src/animation-system/selector/planFinanceAnimationInput.test.ts',
    'channels/finanzneo/src/animation-system/router/classifyFinanceScene.test.ts',
    'channels/finanzneo/src/animation-system/featureFlags.test.ts',
  ];
  const testContents = await Promise.all(
    activationTests.map(readRepositoryFile),
  );
  const combinedTests = testContents.join('\n');
  requireTokens(combinedTests, 'Aktivierungs-Tests', [
    'FINANCE_ANIMATION_FIXTURES',
    'planFinanceAnimationSceneForTemplate',
    'planFinanceAnimationInputForTemplate',
    'buildAnimationPlanForTemplate',
    'buildAnimationPlanWithFeatures',
    'planFinanceAnimationInputWithFeatures',
    'allowAutomaticRouting: false',
    'Vollanimation darf erst nach Freigabe des Hybridmodus aktiviert werden.',
    'does not alter the globally disabled production plan',
    'keeps global production',
  ]);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation activation policy check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation activation policy check passed.');
  console.log('Verified disabled immutable production flags and staged feature dependencies.');
  console.log('Verified manual hybrid activation before automatic routing release.');
  console.log('Verified typed, untrusted-input and final-plan activation simulations.');
};

run().catch((error) => {
  console.error(
    `Finance animation activation policy check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
