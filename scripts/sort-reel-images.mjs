#!/usr/bin/env node
import {copyFileSync, existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {extname, resolve} from 'node:path';
import {IMAGE_INBOX, SCENE_INDEX} from './lib/reel-contract.mjs';
import {IMAGE_EXTENSIONS} from './lib/reel-readiness.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const targetArg = args.find((arg) => !arg.startsWith('--'));

if (!targetArg) {
  console.error('Nutzung: npm run reel:sort-images -- reels/<Woche>/<Tag>/<Reel> [--dry-run]');
  process.exit(1);
}

const root = resolve(targetArg);
const indexPath = resolve(root, SCENE_INDEX);
const inbox = resolve(root, IMAGE_INBOX);

if (!existsSync(indexPath)) {
  console.error(`${SCENE_INDEX} fehlt: ${indexPath}`);
  process.exit(1);
}
if (!existsSync(inbox)) {
  console.error(`${IMAGE_INBOX} fehlt: ${inbox}`);
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const expected = [];

if (typeof index.cover?.googleFlowFileName === 'string') {
  expected.push({
    fileName: index.cover.googleFlowFileName,
    destinationDirectory: resolve(root, '03-szenen/00-cover'),
    label: 'Cover',
  });
}

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (scene?.type !== 'image' || typeof scene.googleFlowFileName !== 'string') continue;
  expected.push({
    fileName: scene.googleFlowFileName,
    destinationDirectory: resolve(root, '03-szenen/EINZELNE-SZENEN', scene.id),
    label: scene.id,
  });
}

const actualImages = readdirSync(inbox)
  .filter((entry) => statSync(resolve(inbox, entry)).isFile())
  .filter((entry) => IMAGE_EXTENSIONS.has(extname(entry).toLowerCase()))
  .sort();
const expectedNames = new Set(expected.map((entry) => entry.fileName));
const errors = [];
const planned = [];

for (const item of expected) {
  const source = resolve(inbox, item.fileName);
  const destination = resolve(item.destinationDirectory, item.fileName);
  if (!existsSync(source)) {
    errors.push(`Fehlendes Nutzerbild: ${IMAGE_INBOX}/${item.fileName}`);
    continue;
  }
  if (!existsSync(item.destinationDirectory)) {
    errors.push(`Technischer Zielordner fehlt: ${item.destinationDirectory}`);
    continue;
  }

  const otherImages = readdirSync(item.destinationDirectory)
    .filter((entry) => IMAGE_EXTENSIONS.has(extname(entry).toLowerCase()))
    .filter((entry) => entry !== item.fileName);
  if (otherImages.length > 0) {
    errors.push(`${item.label} enthält widersprüchliche Bilddateien: ${otherImages.join(', ')}`);
    continue;
  }

  if (existsSync(destination)) {
    const sourceBytes = readFileSync(source);
    const destinationBytes = readFileSync(destination);
    if (!sourceBytes.equals(destinationBytes)) {
      errors.push(`${item.label}: ${item.fileName} existiert technisch bereits mit anderem Inhalt.`);
    }
    continue;
  }

  planned.push({...item, source, destination});
}

for (const fileName of actualImages) {
  if (!expectedNames.has(fileName)) errors.push(`Unerwartetes Nutzerbild: ${IMAGE_INBOX}/${fileName}`);
}

if (errors.length > 0) {
  console.error('\nBilder wurden NICHT verarbeitet:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(dryRun ? '\nTrockenlauf — geplante technische Kopien:' : '\nTechnische Bildkopien:');
for (const item of planned) {
  console.log(`- ${item.fileName} → ${item.label}`);
  if (!dryRun) copyFileSync(item.source, item.destination);
}

if (planned.length === 0) console.log('- Alle erwarteten Bilder sind bereits korrekt synchronisiert.');
console.log(dryRun ? '\n✓ Trockenlauf erfolgreich.' : `\n✓ ${planned.length} Bild${planned.length === 1 ? '' : 'er'} synchronisiert; Originale bleiben im gemeinsamen Bilderordner.`);
