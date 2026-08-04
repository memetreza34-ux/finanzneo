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

const assertOrder = (content, filePath, tokens) => {
  let previousIndex = -1;
  for (const token of tokens) {
    const index = content.indexOf(token);
    if (index < 0) {
      fail(`${filePath} enthält ${token} nicht.`);
      continue;
    }
    if (index <= previousIndex) {
      fail(`${filePath} ordnet ${token} nicht hinter der vorherigen Ebene an.`);
    }
    previousIndex = index;
  }
};

const run = async () => {
  const layerPath =
    'channels/finanzneo/src/engine/FinanceHybridAnimationLayer.tsx';
  const layer = await readRepositoryFile(layerPath);
  requireTokens(layer, layerPath, [
    "| 'caption-safe';",
    "transform: 'translateY(-100px) scale(0.78)'",
    "zIndex: 20",
    'SafeFinanceAnimationRenderer',
    'HybridAnimationFallback',
    'premountFor={Math.round(plan.fps * 0.5)}',
    'name={`Animation sichtbar · ${scene.id}`}',
  ]);

  const productionPath =
    'channels/finanzneo/src/engine/FinanceProductionLayer.tsx';
  const production = await readRepositoryFile(productionPath);
  requireTokens(production, productionPath, [
    'getFinanceHybridAnimatedSceneIds',
    'animatedSceneIds.has(scene.id)',
    'const shouldRenderHeader = !animationReplacesSceneVisual;',
    'hybridAnimations={hybridAnimations}',
  ]);
  assertOrder(production, productionPath, [
    '<FinanceImageFirstReel',
    '<FinanceHybridAnimationLayer',
    '{overlayLayers}',
    '<Captions',
  ]);

  const testPath =
    'channels/finanzneo/src/animation-system/hybrid-test/FinanceHybridVisibilityTest.tsx';
  const testReel = await readRepositoryFile(testPath);
  requireTokens(testReel, testPath, [
    "'hook-image'",
    "'compound-animation'",
    "'bridge-image'",
    "'inflation-animation'",
    "'portfolio-animation'",
    "'payoff-image'",
    "requiredFixture('compound-growth')",
    "requiredFixture('inflation-erosion')",
    "requiredFixture('portfolio-allocation')",
    "presentation: 'caption-safe'",
    'showAnimationDebugLabels',
  ]);

  const rootPath =
    'channels/finanzneo/src/animation-system/hybrid-test/FinanceHybridVisibilityRoot.tsx';
  const root = await readRepositoryFile(rootPath);
  requireTokens(root, rootPath, [
    'id="FinanceHybridVisibilityTest"',
    'durationInFrames={FINANCE_HYBRID_VISIBILITY_DURATION}',
    'width={1080}',
    'height={1920}',
  ]);

  const unitTestPath =
    'channels/finanzneo/src/animation-system/hybrid-test/FinanceHybridVisibilityTest.test.tsx';
  const unitTest = await readRepositoryFile(unitTestPath);
  requireTokens(unitTest, unitTestPath, [
    'uses three different animation templates inside a reel-shaped plan',
    'alternates image and animation scenes instead of animating everything',
    'uses caption-safe presentation for every animation scene',
    'places the animation layer directly above the image layer',
    'does not render old scene headers over animation-replacement scenes',
  ]);

  const packageJson = JSON.parse(await readRepositoryFile('package.json'));
  const scripts = packageJson.scripts ?? {};
  for (const scriptName of [
    'finance:hybrid-visibility:studio',
    'finance:hybrid-visibility:compound-still',
    'finance:hybrid-visibility:inflation-still',
    'finance:hybrid-visibility:portfolio-still',
    'finance:hybrid-visibility:stills',
    'finance:hybrid-visibility:render',
    'finance:hybrid-visibility:validate',
  ]) {
    if (typeof scripts[scriptName] !== 'string' || scripts[scriptName].trim() === '') {
      fail(`package.json enthält kein ausführbares Skript ${scriptName}.`);
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance hybrid visibility check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance hybrid visibility check passed.');
  console.log('Verified image -> animation -> header -> caption layer order.');
  console.log('Verified three caption-safe animation scenes inside a six-scene hybrid reel.');
};

run().catch((error) => {
  console.error(
    `Finance hybrid visibility check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
