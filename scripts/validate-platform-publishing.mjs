#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  CAPTION_DIRECTORY,
  FORBIDDEN_PUBLISHING_FILES,
  FORBIDDEN_PUBLISHING_KEYS,
  PLATFORM_PUBLISHING_FILES,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-platform-publishing.mjs <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, SCENE_INDEX);
const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(existsSync(indexPath), `${SCENE_INDEX} fehlt.`);
if (!existsSync(indexPath)) {
  console.error(`\nPlattform-Publishing-Vertrag verletzt:\n- ${SCENE_INDEX} fehlt.`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.imageWorld?.legacyAssetSet === true) {
  console.log('✓ Legacy-Reel: Plattform-Publishing-Struktur wird nicht nachträglich erzwungen.');
  process.exit(0);
}

const expected = PLATFORM_PUBLISHING_FILES;

assert(index.platformPublishing && typeof index.platformPublishing === 'object', 'scene-index.json benötigt platformPublishing.');
assert(index.platformPublishing?.directory === CAPTION_DIRECTORY, `platformPublishing.directory muss ${CAPTION_DIRECTORY} sein.`);
for (const key of FORBIDDEN_PUBLISHING_KEYS) {
  assert(!Object.prototype.hasOwnProperty.call(index.platformPublishing ?? {}, key), `platformPublishing.${key} ist verboten: FinanzNeo veröffentlicht keine YouTube Shorts.`);
}
for (const relativePath of FORBIDDEN_PUBLISHING_FILES) {
  assert(!existsSync(resolve(root, relativePath)), `${relativePath} ist verboten: YouTube ist ausschließlich Longform unter youtube/.`);
}

for (const [key, relativePath] of Object.entries(expected)) {
  assert(index.platformPublishing?.[key] === relativePath, `platformPublishing.${key} muss auf ${relativePath} zeigen.`);
  const filePath = resolve(root, relativePath);
  assert(existsSync(filePath), `${relativePath} fehlt.`);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    if (content.includes('[EINFÜGEN]') || content.includes('[OPTIONAL]')) {
      warnings.push(`${relativePath} enthält noch Platzhalter.`);
    }
  }
}

const structuralChecks = [
  [PLATFORM_PUBLISHING_FILES.instagramReels, ['CAPTION:']],
  [PLATFORM_PUBLISHING_FILES.tiktok, ['CAPTION:']],
  [PLATFORM_PUBLISHING_FILES.facebookReels, ['REEL-TEXT:']],
  [PLATFORM_PUBLISHING_FILES.snapchat, ['CAPTION:']],
];

for (const [relativePath, markers] of structuralChecks) {
  const filePath = resolve(root, relativePath);
  if (!existsSync(filePath)) continue;
  const content = readFileSync(filePath, 'utf8');
  for (const marker of markers) {
    assert(content.includes(marker), `${relativePath} benötigt den Abschnitt ${marker}`);
  }
}

if (errors.length) {
  console.error('\nPlattform-Publishing-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Plattform-Publishing-Struktur vollständig.');
console.log('  Instagram Reels · TikTok · Facebook Reels · Snapchat');
console.log('  YouTube: ausschließlich eigenständige Longform-Videos unter youtube/.');
if (warnings.length) {
  warnings.forEach((warning) => console.log(`  Hinweis: ${warning}`));
}
