import {readFile} from 'node:fs/promises';
import process from 'node:process';

const repositoryRoot = new URL('../', import.meta.url);
const readRepositoryFile = async (relativePath) =>
  readFile(new URL(relativePath, repositoryRoot), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);

const requireTokens = (content, filePath, tokens) => {
  for (const token of tokens) {
    if (!content.includes(token)) fail(`${filePath} enthält ${token} nicht.`);
  }
};

const forbidTokens = (content, filePath, tokens) => {
  for (const token of tokens) {
    if (content.includes(token)) fail(`${filePath} enthält verbotenen Token ${token}.`);
  }
};

const run = async () => {
  const reelPath = 'channels/finanzneo/src/animation-system/full-animation-reel/FirstFullAnimationReel.tsx';
  const reel = await readRepositoryFile(reelPath);
  requireTokens(reel, reelPath, [
    "id: 'early-vs-late-race'",
    "id: 'dual-contribution-timeline'",
    "id: 'contribution-result-flip'",
    "id: 'compound-engine'",
    "id: 'delayed-growth-race'",
    "id: 'capital-composition-reveal'",
    "id: 'time-advantage-finale'",
    'export const monthlyFutureValue',
    'EARLY_CONTRIBUTIONS = EARLY_MONTHLY * 12',
    'LATE_CONTRIBUTIONS = LATE_MONTHLY * 12',
    'export const EARLY_FINAL',
    'export const LATE_FINAL',
    'const SCENE_COMPONENTS',
    'Full Animation · ${scene.id}',
    'premountFor={15}',
    'Beispielrechnung: 7 % p. a.',
  ]);
  forbidTokens(reel, reelPath, [
    'FinanceImageFirstReel',
    '<Img',
    '<OffthreadVideo',
    'FINANCE_ANIMATION_FEATURES',
  ]);

  const rootPath = 'channels/finanzneo/src/animation-system/full-animation-reel/FirstFullAnimationReelRoot.tsx';
  const root = await readRepositoryFile(rootPath);
  requireTokens(root, rootPath, [
    'id="FinanzNeoFirstFullAnimationReel"',
    'durationInFrames={FIRST_FULL_ANIMATION_DURATION}',
    'fps={FINANCE_REEL_FPS}',
    'width={1080}',
    'height={1920}',
  ]);

  const testPath = 'channels/finanzneo/src/animation-system/full-animation-reel/FirstFullAnimationReel.test.ts';
  const test = await readRepositoryFile(testPath);
  requireTokens(test, testPath, [
    'seven separately registered components over exactly forty seconds',
    'matches the monthly contribution future-value example',
    'earlier investing wins despite lower contributions',
    'keeps the early-start balance ahead from age thirty through sixty',
    'expect(FIRST_FULL_ANIMATION_DURATION).toBe(1200)',
    'expect(Math.round(EARLY_FINAL)).toBe(262481)',
    'expect(Math.round(LATE_FINAL)).toBe(243994)',
  ]);

  const qualityFiles = [
    'channels/finanzneo/src/animation-system/full-animation-reel/NarrativeAnimationQuality.ts',
    'channels/finanzneo/src/animation-system/full-animation-reel/NarrativeAnimationPlans.ts',
    'channels/finanzneo/src/animation-system/full-animation-reel/NarrativeAnimationQuality.test.ts',
    'channels/finanzneo/src/animation-system/full-animation-reel/narrative-plan.current.json',
    'channels/finanzneo/src/animation-system/full-animation-reel/full-animation-reel-quality.json',
    'scripts/verify-finance-narrative-plan.mjs',
    'scripts/verify-finance-full-animation-approval.mjs',
    'scripts/verify-finance-narrative-quality-system.mjs',
  ];
  for (const qualityFile of qualityFiles) await readRepositoryFile(qualityFile);

  const currentPlan = JSON.parse(await readRepositoryFile(
    'channels/finanzneo/src/animation-system/full-animation-reel/narrative-plan.current.json',
  ));
  const qualityManifest = JSON.parse(await readRepositoryFile(
    'channels/finanzneo/src/animation-system/full-animation-reel/full-animation-reel-quality.json',
  ));
  if (currentPlan.status !== 'rejected') fail('Der aktuelle Storyboard-Plan darf nicht als freigegeben gelten.');
  if (qualityManifest.status !== 'rejected') fail('Der aktuelle Render darf nicht als freigegeben gelten.');
  if (qualityManifest.manualEvidence?.approvedByHuman !== false) fail('Der aktuelle Render behauptet fälschlich eine menschliche Freigabe.');

  const packageJson = JSON.parse(await readRepositoryFile('package.json'));
  const scripts = packageJson.scripts ?? {};
  for (const scriptName of [
    'finance:full-animation-reel:structure',
    'finance:full-animation-reel:quality-system',
    'finance:full-animation-reel:storyboard-quality',
    'finance:full-animation-reel:technical-validate',
    'finance:full-animation-reel:approval',
    'finance:full-animation-reel:studio',
    'finance:full-animation-reel:stills',
    'finance:full-animation-reel:render',
    'finance:full-animation-reel:validate',
  ]) {
    if (typeof scripts[scriptName] !== 'string' || scripts[scriptName].trim() === '') {
      fail(`package.json enthält kein ausführbares Skript ${scriptName}.`);
    }
  }

  const validate = scripts['finance:full-animation-reel:validate'] ?? '';
  for (const requiredScript of [
    'finance:full-animation-reel:quality-system',
    'finance:full-animation-reel:storyboard-quality',
    'finance:full-animation-reel:technical-validate',
    'finance:full-animation-reel:approval',
  ]) {
    if (!validate.includes(requiredScript)) fail(`finance:full-animation-reel:validate umgeht ${requiredScript}.`);
  }

  if (failures.length > 0) {
    for (const failure of failures) console.error(`Finance full animation technical check failed: ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log('Finance full animation technical structure check passed.');
  console.log('Verified timing, finance math, isolated composition and mandatory quality-gate wiring.');
  console.log('This technical check does not prove narrative diversity, visual quality, audio quality or approval.');
};

run().catch((error) => {
  console.error(`Finance full animation technical check failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
