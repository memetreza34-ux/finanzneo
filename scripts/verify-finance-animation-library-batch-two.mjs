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

const batchPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchTwo.tsx';
const catalogPath = 'channels/finanzneo/src/animation-system/library/catalog.tsx';
const galleryPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchTwoGallery.tsx';
const rootPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchTwoRoot.tsx';
const indexPath = 'channels/finanzneo/src/animation-system/library/library-batch-two-index.ts';
const testPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchTwo.test.ts';
const readmePath = 'channels/finanzneo/src/animation-system/library/README_BATCH_2.md';

const batch = requireFile(batchPath);
const catalog = requireFile(catalogPath);
const gallery = requireFile(galleryPath);
const compositionRoot = requireFile(rootPath);
const entrypoint = requireFile(indexPath);
const tests = requireFile(testPath);
const readme = requireFile(readmePath);
const packageJson = requireFile('package.json');

const componentNames = [
  'StockVsEtfRaceAnimation',
  'SalaryVsInflationAnimation',
  'DebtSnowballAnimation',
  'SavingsGoalCountdownAnimation',
  'RetirementGapAnimation',
  'EtfFeeDragAnimation',
];
const itemIds = [
  'stock-vs-etf-race',
  'salary-vs-inflation',
  'debt-snowball',
  'savings-goal-countdown',
  'retirement-gap',
  'etf-fee-drag',
];
const categoryTitles = [
  'Börse & Märkte',
  'Einkommen & Kaufkraft',
  'Immobilien & Kredite',
  'Sparen & Sicherheit',
  'Altersvorsorge',
  'Kosten & Gebühren',
];

requireTokens(batch, batchPath, componentNames.map((name) => `export const ${name}`));
requireTokens(batch, batchPath, [
  'calculatePercentChange',
  'calculateNominalSalary',
  'calculateRealSalary',
  'calculateTotalDebt',
  'calculateDebtSnowballOrder',
  'calculateSavingsGoalMonths',
  'calculateRetirementGap',
  'calculateFeeAdjustedFutureValue',
  'calculateEtfFeeGap',
]);
requireTokens(catalog, catalogPath, itemIds.map((id) => `id: '${id}'`));
requireTokens(catalog, catalogPath, categoryTitles.map((title) => `title: '${title}'`));
requireTokens(catalog, catalogPath, componentNames);
requireTokens(catalog, catalogPath, ['batch: 2', 'getFinanceAnimationLibraryItemsByBatch']);
requireTokens(gallery, galleryPath, [
  'FinanceAnimationLibraryBatchTwoGallery',
  'FinanceAnimationLibraryBatchTwoOverview',
  'FINANCE_ANIMATION_LIBRARY_BATCH_TWO_DURATION',
]);
requireTokens(compositionRoot, rootPath, [
  'FinanzNeoAnimationLibraryBatchTwo',
  'FinanzNeoAnimationLibraryBatchTwoOverview',
  'width={1080}',
  'height={1920}',
  'width={1920}',
  'height={1080}',
]);
requireTokens(entrypoint, indexPath, ['registerRoot(FinanceAnimationLibraryBatchTwoRoot)']);
requireTokens(tests, testPath, itemIds);
requireTokens(readme, readmePath, itemIds);
requireTokens(packageJson, 'package.json', [
  'finance:animation-library-batch-two:structure',
  'finance:animation-library-batch-two:validate',
  'finance:animation-library-batch-two:studio',
  'finance:animation-library-batch-two:overview',
  'finance:animation-library-batch-two:render',
]);

for (const productionPath of [
  'channels/finanzneo/src/index.ts',
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
]) {
  const source = requireFile(productionPath);
  if (source.includes('FinanceAnimationLibraryBatchTwo') || source.includes('library-batch-two-index')) {
    throw new Error(`${productionPath} darf Batch 2 noch nicht importieren.`);
  }
}

console.log('Finance animation library batch two structure check passed.');
console.log('Verified six additional named animations in explicit finance categories.');
console.log('Verified isolated gallery, overview, tests and non-production wiring.');
