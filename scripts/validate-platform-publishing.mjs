#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-platform-publishing.mjs <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(existsSync(indexPath), '03-szenen/scene-index.json fehlt.');
if (!existsSync(indexPath)) {
  console.error('\nPlattform-Publishing-Vertrag verletzt:\n- 03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.imageWorld?.legacyAssetSet === true) {
  console.log('✓ Legacy-Reel: Plattform-Publishing-Struktur wird nicht nachträglich erzwungen.');
  process.exit(0);
}

const expected = {
  masterCaption: '04-caption/caption.txt',
  youtubeShorts: '04-caption/youtube-shorts.txt',
  instagramReels: '04-caption/instagram-reels.txt',
  tiktok: '04-caption/tiktok.txt',
  facebookReels: '04-caption/facebook-reels.txt',
  snapchat: '04-caption/snapchat.txt',
};

assert(index.platformPublishing && typeof index.platformPublishing === 'object', 'scene-index.json benötigt platformPublishing.');
assert(index.platformPublishing?.directory === '04-caption', 'platformPublishing.directory muss 04-caption sein.');

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
  ['04-caption/youtube-shorts.txt', ['TITEL:', 'BESCHREIBUNG:']],
  ['04-caption/instagram-reels.txt', ['CAPTION:']],
  ['04-caption/tiktok.txt', ['CAPTION:']],
  ['04-caption/facebook-reels.txt', ['REEL-TEXT:']],
  ['04-caption/snapchat.txt', ['CAPTION:']],
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
console.log('  YouTube Shorts · Instagram Reels · TikTok · Facebook Reels · Snapchat');
if (warnings.length) {
  warnings.forEach((warning) => console.log(`  Hinweis: ${warning}`));
}
