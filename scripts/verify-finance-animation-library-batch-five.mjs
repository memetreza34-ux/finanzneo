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

const batchPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFive.tsx';
const testPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFive.test.ts';
const catalogPath = 'channels/finanzneo/src/animation-system/library/catalog.tsx';
const galleryPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFiveGallery.tsx';
const rootPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFiveRoot.tsx';
const indexPath = 'channels/finanzneo/src/animation-system/library/library-batch-five-index.ts';
const readmePath = 'channels/finanzneo/src/animation-system/library/README_BATCH_5.md';

const batch = requireFile(batchPath);
const tests = requireFile(testPath);
const catalog = requireFile(catalogPath);
const gallery = requireFile(galleryPath);
const compositionRoot = requireFile(rootPath);
const entrypoint = requireFile(indexPath);
const readme = requireFile(readmePath);
const packageJson = requireFile('package.json');

const componentNames = [
  'BondRatePriceSeesawAnimation',
  'CapitalGainsTaxWaterfallAnimation',
  'BusinessProfitCashflowAnimation',
  'RentalYieldBreakdownAnimation',
  'DiversificationShockAbsorberAnimation',
  'LifestyleInflationAnimation',
];
const calculationNames = [
  'calculateBondPriceChangePercent',
  'calculateBondValueAfterRateChange',
  'calculateCapitalGainsTax',
  'calculateNetInvestmentProceeds',
  'calculateBusinessProfit',
  'calculateOperatingCashflow',
  'calculateGrossRentalYieldPercent',
  'calculateNetRentalYieldPercent',
  'calculateDiversifiedPortfolioShockPercent',
  'calculateSavingsRatePercent',
  'calculateLifestyleInflationLoss',
];
const itemIds = [
  'bond-rate-price-seesaw',
  'capital-gains-tax-waterfall',
  'business-profit-cashflow',
  'rental-yield-breakdown',
  'diversification-shock-absorber',
  'lifestyle-inflation',
];

requireTokens(batch, batchPath, componentNames.map((name) => `export const ${name}`));
requireTokens(batch, batchPath, calculationNames.map((name) => `export const ${name}`));
requireTokens(catalog, catalogPath, itemIds.map((id) => `id: '${id}'`));
requireTokens(catalog, catalogPath, ["batch: 5", "title: 'Anleihen & Zinsen'", "title: 'Business & Selbstständigkeit'"]);
requireTokens(gallery, galleryPath, [
  'FinanceAnimationLibraryBatchFiveGallery',
  'FinanceAnimationLibraryBatchFiveOverview',
  'getFinanceAnimationLibraryItemsByBatch(5)',
]);
requireTokens(compositionRoot, rootPath, [
  'FinanzNeoAnimationLibraryBatchFive',
  'FinanzNeoAnimationLibraryBatchFiveOverview',
  'width={1080}',
  'height={1920}',
  'width={1920}',
  'height={1080}',
]);
requireTokens(entrypoint, indexPath, ['registerRoot(FinanceAnimationLibraryBatchFiveRoot)']);
requireTokens(tests, testPath, itemIds);
requireTokens(readme, readmePath, itemIds);
requireTokens(packageJson, 'package.json', [
  'finance:animation-library-batch-five:structure',
  'finance:animation-library-batch-five:validate',
  'finance:animation-library-batch-five:studio',
  'finance:animation-library-batch-five:overview',
  'finance:animation-library-batch-five:render',
]);

for (const productionPath of [
  'channels/finanzneo/src/index.ts',
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
]) {
  const source = requireFile(productionPath);
  if (source.includes('FinanceAnimationLibraryBatchFive') || source.includes('library-batch-five-index')) {
    throw new Error(`${productionPath} darf Batch 5 noch nicht produktiv importieren.`);
  }
}

console.log('Finance animation library batch five structure check passed.');
console.log('Verified six named animations, catalog metadata, tests and isolated compositions.');
console.log('Verified no production wiring and no global feature activation.');
