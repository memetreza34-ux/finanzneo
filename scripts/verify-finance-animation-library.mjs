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

const batchPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchOne.tsx';
const catalogPath = 'channels/finanzneo/src/animation-system/library/catalog.tsx';
const galleryPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryGallery.tsx';
const rootPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryRoot.tsx';
const indexPath = 'channels/finanzneo/src/animation-system/library/library-index.ts';
const testPath = 'channels/finanzneo/src/animation-system/library/FinanceAnimationLibraryBatchOne.test.ts';
const readmePath = 'channels/finanzneo/src/animation-system/library/README.md';

const batch = requireFile(batchPath);
const catalog = requireFile(catalogPath);
const gallery = requireFile(galleryPath);
const compositionRoot = requireFile(rootPath);
const entrypoint = requireFile(indexPath);
const tests = requireFile(testPath);
const readme = requireFile(readmePath);
const packageJson = requireFile('package.json');

const componentNames = [
  'MarketCrashRecoveryAnimation',
  'DividendSnowballAnimation',
  'EmergencyFundAnimation',
  'MortgageAmortizationAnimation',
  'NetWorthStackAnimation',
  'FireProgressAnimation',
];

const itemIds = [
  'market-crash-recovery',
  'dividend-snowball',
  'emergency-fund-progress',
  'mortgage-amortization',
  'net-worth-stack',
  'fire-progress',
];

const categoryTitles = [
  'Börse & Märkte',
  'Investieren',
  'Sparen & Sicherheit',
  'Immobilien & Kredite',
  'Vermögen',
  'Finanzielle Freiheit',
];

requireTokens(batch, batchPath, componentNames.map((name) => `export const ${name}`));
requireTokens(batch, batchPath, [
  'calculateCrashValue',
  'calculateRecoveryValue',
  'calculateDividendIncome',
  'calculateEmergencyFundTarget',
  'calculateMonthlyMortgagePayment',
  'calculateRemainingMortgageBalance',
  'calculateNetWorth',
  'calculateFireTarget',
]);
requireTokens(catalog, catalogPath, itemIds.map((id) => `id: '${id}'`));
requireTokens(catalog, catalogPath, categoryTitles.map((title) => `title: '${title}'`));
requireTokens(catalog, catalogPath, componentNames);
requireTokens(gallery, galleryPath, [
  'FinanceAnimationLibraryGallery',
  'FinanceAnimationLibraryOverview',
  'FINANCE_ANIMATION_LIBRARY_GALLERY_DURATION',
]);
requireTokens(compositionRoot, rootPath, [
  'FinanzNeoAnimationLibraryBatchOne',
  'FinanzNeoAnimationLibraryOverview',
  'width={1080}',
  'height={1920}',
  'width={1920}',
  'height={1080}',
]);
requireTokens(entrypoint, indexPath, ['registerRoot(FinanceAnimationLibraryRoot)']);
requireTokens(tests, testPath, itemIds);
requireTokens(readme, readmePath, itemIds);
requireTokens(packageJson, 'package.json', [
  'finance:animation-library:structure',
  'finance:animation-library:validate',
  'finance:animation-library:studio',
  'finance:animation-library:overview',
  'finance:animation-library:render',
]);

const productionFiles = [
  'channels/finanzneo/src/index.ts',
  'channels/finanzneo/src/engine/FinanceProductionLayer.tsx',
];
for (const productionPath of productionFiles) {
  const source = requireFile(productionPath);
  if (source.includes('/animation-system/library') || source.includes('FinanceAnimationLibrary')) {
    throw new Error(`${productionPath} darf die isolierte Animationsbibliothek noch nicht importieren.`);
  }
}

console.log('Finance animation library structure check passed.');
console.log('Verified six named animations in six explicit finance categories.');
console.log('Verified isolated gallery, overview, tests and non-production wiring.');
