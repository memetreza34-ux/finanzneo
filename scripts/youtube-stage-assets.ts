#!/usr/bin/env node
// Spiegelt die Nutzerassets eines YouTube-Projekts nach public/.
//
// Remotion liest Medien über staticFile() aus public/. Die Bilder und das
// Voiceover liegen aber im Projektordner, wo Phase 2 sie ablegt. Dieses Skript
// kopiert sie an die Stelle, von der aus gerendert wird — dasselbe Muster, das
// die Reels über public/reels/<slug>/ nutzen.
//
// Kopiert wird nur, was der Visual-Index erwartet. Alles andere bleibt liegen,
// damit kein verwaister Testdateiname in einen Render gerät.

import {copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {AUDIO_EXTENSIONS, expectedImages, listFiles, resolveProjectRoot} from './lib/youtube-project';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:phase3:stage -- youtube/<Woche>/<Thema>');
  process.exit(1);
}

let root: string;
let slug: string;
try {
  ({root, slug} = resolveProjectRoot(target));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const indexPath = resolve(root, '04-projekt/visual-index.json');
if (!existsSync(indexPath)) {
  console.error('04-projekt/visual-index.json fehlt.');
  process.exit(1);
}
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

const publicBase = resolve('public/youtube', slug);
const imageTarget = resolve(publicBase, 'images');
const audioTarget = resolve(publicBase, 'audio');

// Vollständig neu aufbauen: ein altes Bild aus einem früheren Lauf darf nicht
// stillschweigend in einen neuen Render wandern.
rmSync(publicBase, {recursive: true, force: true});
mkdirSync(imageTarget, {recursive: true});
mkdirSync(audioTarget, {recursive: true});

const inbox = resolve(root, '02-bilder/00-ALLE-BILDER-HIER-REIN');
const wanted = expectedImages(index);
const missing: string[] = [];
let copiedImages = 0;

for (const name of wanted) {
  const source = resolve(inbox, name);
  if (!existsSync(source) || statSync(source).size === 0) {
    missing.push(name);
    continue;
  }
  copyFileSync(source, resolve(imageTarget, name));
  copiedImages += 1;
}

const audioFiles = listFiles(resolve(root, '01-script'), AUDIO_EXTENSIONS);
let audioName: string | null = null;
if (audioFiles.length === 1) {
  audioName = audioFiles[0];
  copyFileSync(resolve(root, '01-script', audioName), resolve(audioTarget, audioName));
}

console.log(`\npublic/youtube/${slug}/`);
console.log(`  images/  ${copiedImages} von ${wanted.length}`);
console.log(`  audio/   ${audioName ?? 'keine Datei'}`);

const problems: string[] = [];
if (missing.length > 0) problems.push(`Bilder fehlen oder sind leer:\n  - ${missing.join('\n  - ')}`);
if (audioFiles.length === 0) problems.push('Kein Voiceover in 01-script/.');
if (audioFiles.length > 1) problems.push(`Mehrere Audiodateien in 01-script/: ${audioFiles.join(', ')}`);

if (problems.length > 0) {
  console.error(`\n✗ Assets unvollständig.\n${problems.join('\n')}`);
  process.exit(1);
}

console.log('\n✓ Assets gespiegelt.');
