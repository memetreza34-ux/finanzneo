#!/usr/bin/env node

import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {resolve, relative} from 'node:path';

const root = resolve('.');
const errors = [];
const notes = [];

const read = (path) => readFileSync(resolve(root, path), 'utf8');

const walk = (directory) => {
  const absolute = resolve(root, directory);
  if (!existsSync(absolute)) return [];

  return readdirSync(absolute).flatMap((entry) => {
    const path = resolve(absolute, entry);
    if (statSync(path).isDirectory()) {
      return walk(relative(root, path));
    }
    return [path];
  });
};

const requiredFiles = [
  'src/design-system/index.ts',
  'src/design-system/README.md',
  'src/design-system/FinanceBackground.tsx',
  'src/brand/tokens.ts',
  'src/brand/fonts.ts',
  'src/bausteine/fn_core.tsx',
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    errors.push(`Pflichtdatei fehlt: ${file}`);
  }
}

if (errors.length === 0) {
  const core = read('src/bausteine/fn_core.tsx');
  const publicIndex = read('src/design-system/index.ts');
  const tokens = read('src/brand/tokens.ts');
  const backgrounds = read('src/design-system/FinanceBackground.tsx');

  if (core.includes('@remotion/google-fonts')) {
    errors.push('src/bausteine/fn_core.tsx lädt weiterhin externe Google Fonts.');
  }

  if (!core.includes("C as BRAND_C") || !core.includes("from '../brand/tokens'")) {
    errors.push('fn_core.tsx bezieht Farben nicht eindeutig aus src/brand/tokens.ts.');
  }

  if (!core.includes('FONT') || !core.includes("from '../brand/fonts'")) {
    errors.push('fn_core.tsx bezieht Fonts nicht eindeutig aus src/brand/fonts.ts.');
  }

  const forbiddenCoreLiterals = [
    '#0A1A0F',
    '#06120A',
    '#00D26A',
    '#FFC83D',
    '#3D8BFF',
    '#FF3333',
    '#B98CFF',
  ];

  for (const literal of forbiddenCoreLiterals) {
    if (core.includes(literal)) {
      errors.push(`fn_core.tsx dupliziert zentralen Markenwert ${literal}.`);
    }
  }

  const requiredIndexExports = [
    "export * from '../brand'",
    "export * from '../finance/calculations'",
    'FinanceBackground',
    'VerticalSafeAreaGuide',
    'PremiumCharts',
    'FinanceConcepts',
    'FinanceBlocks',
    'HookBlocks',
  ];

  for (const required of requiredIndexExports) {
    if (!publicIndex.includes(required)) {
      errors.push(`Design-System-Export fehlt: ${required}`);
    }
  }

  const requiredTokens = ['PREMIUM', 'SAFE_AREA', 'surfaceStrong', 'accentSoft'];
  for (const token of requiredTokens) {
    if (!tokens.includes(token)) {
      errors.push(`Zentraler Design-Token fehlt: ${token}`);
    }
  }

  for (const variant of ["'standard'", "'data'", "'premium'"]) {
    if (!backgrounds.includes(variant)) {
      errors.push(`Verbindliche Hintergrundvariante fehlt: ${variant}.`);
    }
  }

  if (!backgrounds.includes('SAFE_AREA.topPx') || !backgrounds.includes('SAFE_AREA.bottomPx')) {
    errors.push('VerticalSafeAreaGuide verwendet nicht die zentralen Safe-Area-Tokens.');
  }
}

const bausteinFiles = walk('src/bausteine').filter((path) => /\.(ts|tsx)$/.test(path));
for (const file of bausteinFiles) {
  const content = readFileSync(file, 'utf8');
  if (content.includes('@remotion/google-fonts')) {
    errors.push(`Externer Font-Import in ${relative(root, file)}.`);
  }
}

const productionFiles = [
  ...walk('src/zins'),
  ...walk('src/production'),
].filter((path) => /\.(ts|tsx)$/.test(path));

for (const file of productionFiles) {
  const content = readFileSync(file, 'utf8');
  if (/from\s+['"][^'"]*bausteine\//.test(content)) {
    errors.push(`Direkter Baustein-Import in Produktionsdatei: ${relative(root, file)}.`);
  }
}

const migratedShort = resolve(root, 'src/zins/ShortHook.tsx');
if (existsSync(migratedShort)) {
  const content = readFileSync(migratedShort, 'utf8');
  if (!content.includes("from '../design-system'")) {
    errors.push('ShortHook.tsx wurde nicht auf den zentralen Design-System-Import migriert.');
  } else {
    notes.push('ShortHook nutzt den zentralen Design-System-Import.');
  }

  if (!content.includes('calculateSavingsPlanFutureValue')) {
    errors.push('ShortHook.tsx verwendet weiterhin einen frei eingetragenen Sparplan-Endwert.');
  }
}

if (errors.length > 0) {
  console.error('\nDesign-System-Prüfung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\n✓ Design-System-Grundlagen sind konsistent.');
console.log('✓ Hintergrundvarianten standard, data und premium sind definiert.');
console.log('✓ Safe-Area-Prüfraster nutzt zentrale 18-/22-Prozent-Tokens.');
console.log(`✓ ${bausteinFiles.length} Baustein-Dateien ohne externe Font-Imports geprüft.`);
for (const note of notes) console.log(`✓ ${note}`);
