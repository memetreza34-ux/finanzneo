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
    if (statSync(path).isDirectory()) return walk(relative(root, path));
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
  'src/brand/components/SceneHeader.tsx',
  'src/brand/components/Captions.tsx',
  'src/bausteine/fn_core.tsx',
];
for (const file of requiredFiles) if (!existsSync(resolve(root, file))) errors.push(`Pflichtdatei fehlt: ${file}`);

if (errors.length === 0) {
  const core = read('src/bausteine/fn_core.tsx');
  const publicIndex = read('src/design-system/index.ts');
  const tokens = read('src/brand/tokens.ts');
  const backgrounds = read('src/design-system/FinanceBackground.tsx');
  const catalog = read('docs/COMPONENT-CATALOG.md');
  const captions = read('src/brand/components/Captions.tsx');
  const header = read('src/brand/components/SceneHeader.tsx');

  if (core.includes('@remotion/google-fonts')) errors.push('fn_core.tsx lädt weiterhin externe Google Fonts.');
  if (!core.includes("C as BRAND_C") || !core.includes("from '../brand/tokens'")) errors.push('fn_core.tsx bezieht Farben nicht eindeutig aus Brand Tokens.');
  if (!core.includes('FONT') || !core.includes("from '../brand/fonts'")) errors.push('fn_core.tsx bezieht Fonts nicht eindeutig aus Brand Fonts.');

  for (const literal of ['#0A1A0F','#06120A','#00D26A','#FFC83D','#3D8BFF','#FF3333','#B98CFF']) {
    if (core.includes(literal)) errors.push(`fn_core.tsx dupliziert zentralen Markenwert ${literal}.`);
  }

  for (const required of ["export * from '../brand'", "export * from '../finance/calculations'", 'FinanceBackground', 'VerticalSafeAreaGuide', 'PremiumCharts', 'FinanceConcepts', 'FinanceBlocks', 'HookBlocks']) {
    if (!publicIndex.includes(required)) errors.push(`Design-System-Export fehlt: ${required}`);
  }
  for (const token of ['PREMIUM', 'SAFE_AREA', 'surfaceStrong', 'accentSoft', 'REEL_STYLE']) {
    if (!tokens.includes(token)) errors.push(`Zentraler Design-Token fehlt: ${token}`);
  }
  for (const variant of ["'standard'", "'data'", "'premium'"]) {
    if (!backgrounds.includes(variant)) errors.push(`Verbindliche Hintergrundvariante fehlt: ${variant}.`);
  }
  if (!backgrounds.includes('SAFE_AREA.topPx') || !backgrounds.includes('SAFE_AREA.bottomPx')) errors.push('VerticalSafeAreaGuide verwendet nicht zentrale Safe-Area-Tokens.');
  if (!backgrounds.includes('FONT.body')) errors.push('VerticalSafeAreaGuide verwendet nicht zentrale Fonts.');

  for (const entry of ['FinanceBackground','VerticalSafeAreaGuide','Captions','DramaticNumber','PremiumCharts.PremiumChart','CompareSplit','EndCard']) {
    if (!catalog.includes(entry)) errors.push(`Komponenten-Katalog enthält keinen Standard für ${entry}.`);
  }

  // Reel V5 — exakte zentrale Werte.
  if (!/caption:\s*\{[\s\S]*?fontSize:\s*50\b[\s\S]*?fontWeight:\s*800\b[\s\S]*?bottom:\s*340\b/.test(tokens)) {
    errors.push('REEL_STYLE.caption muss V5 mit 50 px / Weight 800 / bottom 340 definieren.');
  }
  if (!/header:\s*\{[\s\S]*?presentation:\s*'plain'[\s\S]*?headlineColor:\s*C\.white\b[\s\S]*?top:\s*154\b/.test(tokens)) {
    errors.push('REEL_STYLE.header muss V5 plain / weiß / top 154 definieren.');
  }
  if (!/visual:\s*\{[\s\S]*?top:\s*320\b[\s\S]*?bottom:\s*1400\b/.test(tokens)) {
    errors.push('REEL_STYLE.visual muss V5 320–1400 definieren.');
  }
  if (!/textStrokeForbidden:\s*true\b/.test(tokens)) errors.push('REEL_STYLE muss TextStroke verbieten.');
  if (!/fadeToBlackForbidden:\s*true\b/.test(tokens)) errors.push('REEL_STYLE muss Fade-to-black verbieten.');
  const continuity = tokens.match(/continuityFrames:\s*(\d+)/);
  if (!continuity || Number(continuity[1]) !== 3) errors.push('V5 Szenenübergang muss exakt 3 Frames sein.');

  // Captions zentral und crisp.
  if (!captions.includes('REEL_STYLE')) errors.push('Captions.tsx liest Maße nicht aus REEL_STYLE.');
  if (/WebkitTextStroke\s*:/.test(captions)) errors.push('WebkitTextStroke ist auf Untertiteln verboten.');

  // Plain Header: keine visuelle UI-Box und keine ALL-CAPS-Erzwingung.
  if (!header.includes('REEL_STYLE')) errors.push('SceneHeader.tsx liest Maße nicht aus REEL_STYLE.');
  if (!header.includes("textTransform: 'none'")) errors.push('V5 SceneHeader muss textTransform=none erzwingen.');
  if (!header.includes('iconColorForTone')) errors.push('V5 SceneHeader braucht semantische Icon-Farblogik.');
  if (!header.includes('color: H.headlineColor')) errors.push('V5 SceneHeader muss neutralen Text aus REEL_STYLE nutzen.');
  if (/background:\s*['"]rgba\(/.test(header) || /borderRadius\s*:/.test(header) || /border\s*:/.test(header)) {
    errors.push('V5 SceneHeader darf keine Capsule/Chip/Panel-Box rendern.');
  }

  notes.push('REEL_STYLE V5: Header Y154 · Visual 320–1400 · Caption bottom340 · Transition 3 Frames.');
  notes.push('SceneHeader V5 ist plain: weißer Text + semantisches Linien-Icon, keine Capsule.');
}

const bausteinFiles = walk('src/bausteine').filter((path) => /\.(ts|tsx)$/.test(path));
for (const file of bausteinFiles) {
  const content = readFileSync(file, 'utf8');
  if (content.includes('@remotion/google-fonts')) errors.push(`Externer Font-Import in ${relative(root, file)}.`);
}

const productionFiles = [...walk('src/zins'), ...walk('src/production')].filter((path) => /\.(ts|tsx)$/.test(path));
for (const file of productionFiles) {
  const content = readFileSync(file, 'utf8');
  if (/from\s+['"][^'"]*bausteine\//.test(content)) errors.push(`Direkter Baustein-Import in Produktionsdatei: ${relative(root, file)}.`);
}

const reelSurfaces = [...walk('src/brand'), ...walk('src/reels'), ...walk('src/production')].filter((path) => /\.tsx?$/.test(path));
for (const path of reelSurfaces) {
  const source = readFileSync(path, 'utf8');
  if (/WebkitTextStroke\s*:/.test(source)) errors.push(`WebkitTextStroke ist auf Reel-Flächen verboten: ${relative(root, path)}`);
}

if (!existsSync(resolve(root, 'src/brand/components/ReelStage.tsx'))) errors.push('Zentrale ReelStage-Komponente fehlt.');
const reelTemplate = resolve(root, 'src/production/reel-template/ReelTemplate.tsx');
if (!existsSync(reelTemplate)) errors.push('Zentrale ReelTemplate-Komponente fehlt.');
else if (!readFileSync(reelTemplate, 'utf8').includes("from '../../design-system'")) errors.push('ReelTemplate.tsx verwendet nicht zentralen Design-System-Import.');

if (errors.length > 0) {
  console.error('\nDesign-System-Prüfung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('\n✓ Design-System-Grundlagen sind konsistent.');
console.log(`✓ ${bausteinFiles.length} Baustein-Dateien ohne externe Font-Imports geprüft.`);
for (const note of notes) console.log(`✓ ${note}`);
