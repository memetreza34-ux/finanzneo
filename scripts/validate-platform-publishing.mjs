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
  console.error(`\nPublishing-Vertrag verletzt:\n- ${SCENE_INDEX} fehlt.`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.imageWorld?.legacyAssetSet === true) {
  console.log('✓ Legacy-Reel: Universal-Caption-Vertrag wird nicht rückwirkend erzwungen.');
  process.exit(0);
}

const publishing = index.platformPublishing ?? {};
const sourcePath = PLATFORM_PUBLISHING_FILES.universalCaption;

assert(publishing.directory === CAPTION_DIRECTORY, `platformPublishing.directory muss ${CAPTION_DIRECTORY} sein.`);
assert(publishing.universalCaptionSource === sourcePath, `platformPublishing.universalCaptionSource muss ${sourcePath} sein.`);
assert(publishing.universalCaptionExport === '06-export/caption-universal.txt', 'platformPublishing.universalCaptionExport muss 06-export/caption-universal.txt sein.');
assert(publishing.universalCaptionForAllReelPlatforms === true, 'Eine universelle Caption muss für alle Reel-Plattformen gelten.');

for (const key of FORBIDDEN_PUBLISHING_KEYS) {
  assert(!Object.prototype.hasOwnProperty.call(publishing, key), `platformPublishing.${key} ist im Universal-Caption-Vertrag verboten.`);
}
for (const relativePath of FORBIDDEN_PUBLISHING_FILES) {
  assert(!existsSync(resolve(root, relativePath)), `${relativePath} ist im Universal-Caption-Vertrag verboten.`);
}

const captionPath = resolve(root, sourcePath);
assert(existsSync(captionPath), `${sourcePath} fehlt.`);
if (existsSync(captionPath)) {
  const content = readFileSync(captionPath, 'utf8');
  if (/\[(?:EINFÜGEN|OPTIONAL|VOLLSTÄNDIG)/i.test(content)) warnings.push(`${sourcePath} enthält noch Platzhalter.`);
}

if (errors.length) {
  console.error('\nUniversal-Caption-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Universal-Caption-Struktur vollständig.');
console.log('  Eine Quelle: 04-caption/caption.txt');
console.log('  Ein Export: 06-export/caption-universal.txt');
console.log('  Gilt identisch für Instagram Reels · TikTok · Facebook Reels · Snapchat.');
console.log('  Keine separaten Plattform-Captiondateien.');
if (warnings.length) warnings.forEach((warning) => console.log(`  Hinweis: ${warning}`));
