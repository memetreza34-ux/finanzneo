import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const requireFile = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) throw new Error(`Fehlende Datei: ${relativePath}`);
  return read(relativePath);
};
const requireTokens = (source, relativePath, tokens) => {
  for (const token of tokens) {
    if (!source.includes(token)) throw new Error(`${relativePath} enthält den erwarteten Eintrag nicht: ${token}`);
  }
};

const batchPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFour.tsx';
const catalogPath = 'channels/finanzneo/src/animation-system/library/catalog.tsx';
const galleryPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFourGallery.tsx';
const rootPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFourRoot.tsx';
const indexPath = 'channels/finanzneo/src/animation-system/library/library-batch-four-index.ts';
const testPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchFour.test.ts';
const readmePath = 'channels/finanzneo/src/animation-system/library/README_BATCH_4.md';

const batch = requireFile(batchPath);
const catalog = requireFile(catalogPath);
const gallery = requireFile(galleryPath);
const compositionRoot = requireFile(rootPath);
const entrypoint = requireFile(indexPath);
const tests = requireFile(testPath);
const readme = requireFile(readmePath);
const packageJson = requireFile('package.json');

const componentNames = [
  'CashflowSurplusFunnelAnimation',
  'CreditCardMinimumPaymentAnimation',
  'PortfolioRebalancingAnimation',
  'RentVsBuyBreakEvenAnimation',
  'DrawdownRecoveryAnimation',
  'SequenceRiskAnimation',
];
const calculationNames = [
  'calculateCashflowSurplus',
  'calculateMinimumPaymentPlan',
  'calculateRebalanceTrades',
  'calculateRentVsBuyBreakEvenYears',
  'calculateRecoveryGainNeeded',
  'calculateSequenceEndBalance',
];
const itemIds = [
  'cashflow-surplus-funnel',
  'credit-card-minimum-payment',
  'portfolio-rebalancing',
  'rent-vs-buy-break-even',
  'drawdown-recovery-time',
  'sequence-of-returns-risk',
];

requireTokens(batch, batchPath, componentNames.map((name) => `export const ${name}`));
requireTokens(batch, batchPath, calculationNames.map((name) => `export const ${name}`));
requireTokens(catalog, catalogPath, itemIds.map((id) => `id: '${id}'`));
requireTokens(catalog, catalogPath, componentNames);
requireTokens(catalog, catalogPath, ["id: 'budget-cashflow'", "batch: 4", "batch: 1 | 2 | 3 | 4"]);
requireTokens(gallery, galleryPath, [
  'FinanceAnimationLibraryBatchFourGallery',
  'FinanceAnimationLibraryBatchFourOverview',
  'FINANCE_ANIMATION_LIBRARY_BATCH_FOUR_DURATION',
]);
requireTokens(compositionRoot, rootPath, [
  'FinanzNeoAnimationLibraryBatchFour',
  'FinanzNeoAnimationLibraryBatchFourOverview',
  'width={1080}',
  'height={1920}',
  'width={1920}',
  'height={1080}',
]);
requireTokens(entrypoint, indexPath, ['registerRoot(FinanceAnimationLibraryBatchFourRoot)']);
requireTokens(tests, testPath, itemIds);
requireTokens(readme, readmePath, itemIds);
requireTokens(packageJson, 'package.json', [
  'finance:animation-library-batch-four:structure',
  'finance:animation-library-batch-four:validate',
  'finance:animation-library-batch-four:studio',
  'finance:animation-library-batch-four:overview',
  'finance:animation-library-batch-four:render',
]);

for (const productionPath of [
  'channels/finanzneo/src/index.ts',
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
]) {
  const source = requireFile(productionPath);
  if (source.includes('FinanceAnimationLibraryBatchFour') || source.includes('library-batch-four-index')) {
    throw new Error(`${productionPath} darf Batch 4 nicht produktiv importieren.`);
  }
}

console.log('Finance animation library batch four structure check passed.');
console.log('Verified six named Batch-4 animations and one explicit new category.');
console.log('Verified isolated gallery, tests, calculations and non-production wiring.');
