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
  'docs/COMPONENT-CATALOG.md',
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
  const catalog = read('docs/COMPONENT-CATALOG.md');

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

  if (!backgrounds.includes('FONT.body')) {
    errors.push('VerticalSafeAreaGuide verwendet nicht die zentrale Fontdefinition.');
  }

  const requiredCatalogEntries = [
    'FinanceBackground',
    'VerticalSafeAreaGuide',
    'Captions',
    'DramaticNumber',
    'PremiumCharts.PremiumChart',
    'CompareSplit',
    'EndCard',
  ];

  for (const entry of requiredCatalogEntries) {
    if (!catalog.includes(entry)) {
      errors.push(`Komponenten-Katalog enthält keinen Standard für ${entry}.`);
    }
  }

  const requiredWarnings = [
    'LegacyKit.FNGrowthCurve',
    'ComplexBlocks.FNExponential',
    'GrowthChart` ohne explizite',
  ];

  for (const warning of requiredWarnings) {
    if (!catalog.includes(warning)) {
      errors.push(`Komponenten-Katalog enthält die notwendige Warnung nicht: ${warning}.`);
    }
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

// ─── Verbindlicher Reel-Look V4 ─────────────────────────────────────────────
// Diese Regeln halten Untertitel, Zwischenüberschriften und Übergänge über ALLE
// Reels konstant. Sie sind aus einem konkreten Qualitätsproblem entstanden:
// Untertitel wurden mit Weight 900, 64 px und WebkitTextStroke gerendert und
// wirkten dadurch dick und matschig.
const tokensSource = read('src/brand/tokens.ts');

if (!tokensSource.includes('export const REEL_STYLE')) {
  errors.push('src/brand/tokens.ts definiert keinen zentralen REEL_STYLE-Block.');
} else {
  const captionSize = tokensSource.match(/fontSize:\s*(\d+)[\s\S]*?fontWeight:\s*(\d+)/);

  if (captionSize) {
    const size = Number(captionSize[1]);
    const weight = Number(captionSize[2]);

    if (size > 54) {
      errors.push(`Untertitel-Grundgröße ist mit ${size} px zu groß (max. 54 px).`);
    }
    if (weight > 800) {
      errors.push(`Untertitel-Schriftstärke ${weight} ist zu fett (max. 800).`);
    }
  }

  if (!tokensSource.includes('textStrokeForbidden: true')) {
    errors.push('REEL_STYLE muss WebkitTextStroke auf Untertiteln ausdrücklich verbieten.');
  }
  if (!tokensSource.includes('fadeToBlackForbidden: true')) {
    errors.push('REEL_STYLE muss Fade-to-black bei Szenenwechseln verbieten.');
  }

  const continuity = tokensSource.match(/continuityFrames:\s*(\d+)/);
  if (continuity && Number(continuity[1]) > 4) {
    errors.push(`Szenenübergang ist mit ${continuity[1]} Frames zu träge (max. 4).`);
  }

  notes.push('REEL_STYLE definiert Untertitel-, Header- und Übergangswerte zentral.');
}

// WebkitTextStroke lässt Glyphen zulaufen — auf Reel-Text repo-weit verboten.
const reelSurfaces = [...walk('src/brand'), ...walk('src/reels'), ...walk('src/production')]
  .filter((path) => /\.tsx?$/.test(path));

for (const path of reelSurfaces) {
  const source = readFileSync(path, 'utf8');
  if (/WebkitTextStroke\s*:/.test(source)) {
    errors.push(`WebkitTextStroke ist auf Reel-Flächen verboten: ${relative(root, path)}`);
  }
}

// Zentrale Komponenten dürfen ihre Maße nicht lokal überschreiben.
const captionsSource = read('src/brand/components/Captions.tsx');
const headerSource = read('src/brand/components/SceneHeader.tsx');

if (!captionsSource.includes('REEL_STYLE')) {
  errors.push('Captions.tsx liest die Maße nicht aus REEL_STYLE.');
}
if (!headerSource.includes('REEL_STYLE')) {
  errors.push('SceneHeader.tsx liest die Maße nicht aus REEL_STYLE.');
}
if (!existsSync(resolve(root, 'src/brand/components/ReelStage.tsx'))) {
  errors.push('Die zentrale ReelStage-Komponente (SceneTransition/AnimationStage) fehlt.');
} else {
  notes.push('SceneTransition und AnimationStage stehen allen Reels zentral bereit.');
}

const reelTemplate = resolve(root, 'src/production/reel-template/ReelTemplate.tsx');
if (!existsSync(reelTemplate)) {
  errors.push('Die zentrale ReelTemplate-Komponente fehlt.');
} else if (!readFileSync(reelTemplate, 'utf8').includes("from '../../design-system'")) {
  errors.push('ReelTemplate.tsx verwendet nicht den zentralen Design-System-Import.');
} else {
  notes.push('ReelTemplate nutzt den zentralen Design-System-Import.');
}

if (errors.length > 0) {
  console.error('\nDesign-System-Prüfung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\n✓ Design-System-Grundlagen sind konsistent.');
console.log('✓ Komponenten-Katalog enthält verbindliche Standards und Warnungen.');
console.log('✓ Hintergrundvarianten standard, data und premium sind definiert.');
console.log('✓ Safe-Area-Prüfraster nutzt zentrale 18-/22-Prozent-Tokens und Fonts.');
console.log(`✓ ${bausteinFiles.length} Baustein-Dateien ohne externe Font-Imports geprüft.`);
for (const note of notes) console.log(`✓ ${note}`);
