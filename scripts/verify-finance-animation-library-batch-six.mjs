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

const batchPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchSix.tsx';
const catalogPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchSixCatalog.tsx';
const galleryPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchSixGallery.tsx';
const rootPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchSixRoot.tsx';
const indexPath = 'channels/finanzneo/src/animation-system/library/library-batch-six-index.ts';
const testPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchSix.test.ts';
const readmePath = 'channels/finanzneo/src/animation-system/library/README_BATCH_6.md';

const batch = requireFile(batchPath);
const catalog = requireFile(catalogPath);
const gallery = requireFile(galleryPath);
const compositionRoot = requireFile(rootPath);
const entrypoint = requireFile(indexPath);
const tests = requireFile(testPath);
const readme = requireFile(readmePath);
const packageJson = requireFile('package.json');

const componentNames = [
  'SubscriptionCreepAnimation',
  'CurrencyExchangeSpreadAnimation',
  'LoanRefinanceBreakEvenAnimation',
  'DividendYieldTrapAnimation',
  'SavingsRateFreedomTimelineAnimation',
  'BnplInstallmentStackAnimation',
];
const calculationNames = [
  'calculateAnnualSubscriptionCost',
  'calculateExchangeReceived',
  'calculateExchangeLoss',
  'calculateLoanMonthlyPayment',
  'calculateRefinanceBreakEvenMonths',
  'calculateDividendTotalReturnPercent',
  'calculateFreedomYears',
  'calculateBnplMonthlyLoad',
  'calculateBnplCommittedAmount',
];
const itemIds = [
  'subscription-creep',
  'currency-exchange-spread',
  'loan-refinance-break-even',
  'dividend-yield-trap',
  'savings-rate-freedom-timeline',
  'bnpl-installment-stack',
];

requireTokens(batch, batchPath, componentNames.map((name) => `export const ${name}`));
requireTokens(batch, batchPath, calculationNames.map((name) => `export const ${name}`));
requireTokens(catalog, catalogPath, itemIds.map((id) => `id: '${id}'`));
requireTokens(catalog, catalogPath, [
  "id: 'consumer-contracts'",
  "title: 'Konsum & Verträge'",
  'FINANCE_ANIMATION_LIBRARY_COMBINED_ITEMS',
  'batch: 6',
]);
requireTokens(gallery, galleryPath, [
  'FinanceAnimationLibraryBatchSixGallery',
  'FinanceAnimationLibraryBatchSixOverview',
  'FINANCE_ANIMATION_LIBRARY_BATCH_SIX_DURATION',
]);
requireTokens(compositionRoot, rootPath, [
  'FinanzNeoAnimationLibraryBatchSix',
  'FinanzNeoAnimationLibraryBatchSixOverview',
  'width={1080}',
  'height={1920}',
  'width={1920}',
  'height={1080}',
]);
requireTokens(entrypoint, indexPath, ['registerRoot(FinanceAnimationLibraryBatchSixRoot)']);
requireTokens(tests, testPath, itemIds);
requireTokens(readme, readmePath, itemIds);
requireTokens(packageJson, 'package.json', [
  'finance:animation-library-batch-six:structure',
  'finance:animation-library-batch-six:validate',
  'finance:animation-library-batch-six:studio',
  'finance:animation-library-batch-six:overview',
  'finance:animation-library-batch-six:render',
]);

for (const productionPath of [
  'channels/finanzneo/src/index.ts',
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
]) {
  const source = requireFile(productionPath);
  if (source.includes('FinanceAnimationLibraryBatchSix') || source.includes('library-batch-six-index')) {
    throw new Error(`${productionPath} darf Batch 6 noch nicht produktiv importieren.`);
  }
}

console.log('Finance animation library batch six structure check passed.');
console.log('Verified six named animations, combined catalog metadata, tests and isolated compositions.');
console.log('Verified no production wiring and no global feature activation.');
