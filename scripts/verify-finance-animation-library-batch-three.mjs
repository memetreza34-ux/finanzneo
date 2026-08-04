import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const requireFile = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Fehlende Datei: ${relativePath}`);
  }
  return read(relativePath);
};
const requireTokens = (source, relativePath, tokens) => {
  for (const token of tokens) {
    if (!source.includes(token)) {
      throw new Error(`${relativePath} enthält den erwarteten Eintrag nicht: ${token}`);
    }
  }
};

const batchPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchThree.tsx';
const testPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchThree.test.ts';
const catalogPath = 'channels/finanzneo/src/animation-system/library/catalog.tsx';
const galleryPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchThreeGallery.tsx';
const rootPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchThreeRoot.tsx';
const indexPath = 'channels/finanzneo/src/animation-system/library/library-batch-three-index.ts';
const readmePath = 'channels/finanzneo/src/animation-system/library/README_BATCH_3.md';

const batch = requireFile(batchPath);
const tests = requireFile(testPath);
const catalog = requireFile(catalogPath);
const gallery = requireFile(galleryPath);
const compositionRoot = requireFile(rootPath);
const entrypoint = requireFile(indexPath);
const readme = requireFile(readmePath);
const packageJson = requireFile('package.json');

const componentNames = [
  'GrossNetWaterfallAnimation',
  'TaxClassComparisonAnimation',
  'DcaVsLumpSumAnimation',
  'MarketBubbleCycleAnimation',
  'InsuranceCostStackAnimation',
  'WealthDistributionAnimation',
];
const calculationNames = [
  'calculateNetSalary',
  'findHighestNetVariant',
  'calculateDcaShares',
  'calculateDcaEndValue',
  'calculateLumpSumEndValue',
  'calculateBubblePeakValue',
  'calculateBubbleCrashValue',
  'calculateAnnualInsuranceCost',
  'normalizeWealthDistribution',
  'calculateLargestWealthShare',
];
const itemIds = [
  'gross-net-waterfall',
  'tax-class-comparison',
  'dca-vs-lump-sum',
  'market-bubble-cycle',
  'insurance-cost-stack',
  'wealth-distribution',
];

requireTokens(batch, batchPath, componentNames.map((name) => `export const ${name}`));
requireTokens(batch, batchPath, calculationNames.map((name) => `export const ${name}`));
requireTokens(catalog, catalogPath, itemIds.map((id) => `id: '${id}'`));
requireTokens(catalog, catalogPath, ["batch: 3", "title: 'Steuern & Gehalt'", "title: 'Versicherungen'"]);
requireTokens(gallery, galleryPath, [
  'FinanceAnimationLibraryBatchThreeGallery',
  'FinanceAnimationLibraryBatchThreeOverview',
  'getFinanceAnimationLibraryItemsByBatch(3)',
]);
requireTokens(compositionRoot, rootPath, [
  'FinanzNeoAnimationLibraryBatchThree',
  'FinanzNeoAnimationLibraryBatchThreeOverview',
  'width={1080}',
  'height={1920}',
  'width={1920}',
  'height={1080}',
]);
requireTokens(entrypoint, indexPath, ['registerRoot(FinanceAnimationLibraryBatchThreeRoot)']);
requireTokens(tests, testPath, itemIds);
requireTokens(readme, readmePath, itemIds);
requireTokens(packageJson, 'package.json', [
  'finance:animation-library-batch-three:structure',
  'finance:animation-library-batch-three:validate',
  'finance:animation-library-batch-three:studio',
  'finance:animation-library-batch-three:overview',
  'finance:animation-library-batch-three:render',
]);

for (const productionPath of [
  'channels/finanzneo/src/index.ts',
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
]) {
  const source = requireFile(productionPath);
  if (source.includes('FinanceAnimationLibraryBatchThree') || source.includes('library-batch-three-index')) {
    throw new Error(`${productionPath} darf Batch 3 noch nicht produktiv importieren.`);
  }
}

console.log('Finance animation library batch three structure check passed.');
console.log('Verified six named animations, catalog metadata, tests and isolated compositions.');
console.log('Verified no production wiring and no global feature activation.');
