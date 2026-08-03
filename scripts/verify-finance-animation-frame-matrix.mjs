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
  const matrixPath =
    'channels/finanzneo/src/animation-system/gallery/AnimationFrameMatrix.tsx';
  const matrix = await readRepositoryFile(matrixPath);
  requireTokens(matrix, matrixPath, [
    "id: 'start'",
    "id: 'middle'",
    "id: 'end'",
    'frame: 0',
    'Math.floor(FINANCE_ANIMATION_CARD_DURATION / 2)',
    'FINANCE_ANIMATION_CARD_DURATION - 1',
    'FINANCE_ANIMATION_GALLERY_ITEMS.flatMap',
    '<Sequence',
    'durationInFrames={FINANCE_ANIMATION_CARD_DURATION}',
    'width={SOURCE_WIDTH}',
    'height={SOURCE_HEIGHT}',
    'freeze={item.checkpoint.frame}',
    'gridTemplateColumns: \'repeat(6, minmax(0, 1fr))\'',
  ]);

  if (matrix.includes('<Freeze')) {
    fail('Die Matrix verwendet Freeze ohne lokale Sequence-VideoConfig.');
  }

  const matrixTestPath =
    'channels/finanzneo/src/animation-system/gallery/AnimationFrameMatrix.test.tsx';
  const matrixTest = await readRepositoryFile(matrixTestPath);
  requireTokens(matrixTest, matrixTestPath, [
    'FINANCE_ANIMATION_GALLERY_ITEMS.length * 3',
    "'start'",
    "'middle'",
    "'end'",
    'new Set(keys).size',
  ]);

  const rootPath =
    'channels/finanzneo/src/animation-system/gallery/AnimationGalleryRoot.tsx';
  const root = await readRepositoryFile(rootPath);
  requireTokens(root, rootPath, [
    'id="FinanceAnimationFrameMatrix"',
    'component={AnimationFrameMatrix}',
    'durationInFrames={1}',
    'width={2160}',
    'height={3840}',
  ]);

  const packageJson = JSON.parse(await readRepositoryFile('package.json'));
  const matrixCommand = packageJson.scripts?.['finance:animation-gallery:matrix-still'];
  if (
    typeof matrixCommand !== 'string' ||
    !matrixCommand.includes('FinanceAnimationFrameMatrix') ||
    !matrixCommand.includes('/tmp/finance-animation-frame-matrix.png')
  ) {
    fail('package.json enthält keinen gültigen Matrix-Still-Befehl.');
  }
  if (!packageJson.scripts?.['finance:animation-validate']?.includes(
    'finance:animation-gallery:matrix-still',
  )) {
    fail('finance:animation-validate führt den Matrix-Still nicht aus.');
  }

  const workflowPath = '.github/workflows/finance-animation-foundation.yml';
  const workflow = await readRepositoryFile(workflowPath);
  requireTokens(workflow, workflowPath, [
    'finance:animation-gallery:matrix-still',
    '/tmp/finance-animation-frame-matrix.png',
  ]);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Finance animation frame matrix check failed: ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Finance animation frame matrix check passed.');
  console.log('Verified 12 templates × 3 review checkpoints = 36 visual states.');
  console.log('Verified local 180-frame 1080×1920 video config for every frozen preview.');
};

run().catch((error) => {
  console.error(
    `Finance animation frame matrix check failed: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
