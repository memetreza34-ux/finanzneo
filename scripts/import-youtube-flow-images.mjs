#!/usr/bin/env node

// Entpackt die Google-Flow-ZIP und prüft jeden Dateinamen gegen visual-index.json.
//
// Phase 2 lädt aus Flow ein ZIP herunter und legt es in 02-bilder/ZIP-HIER-REIN/.
// Dieser Import entpackt es, vergleicht jeden Dateinamen mit den erwarteten Namen und
// legt nur geprüfte Bilder in die Bilder-Inbox. Falsch benannte oder fehlende Bilder
// werden gesammelt gemeldet, damit nicht erst der Render-Gate sie findet.

import {spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {basename, extname, join, relative, resolve, sep} from 'node:path';
import {IMAGE_INBOX, VISUAL_INDEX, ZIP_INBOX} from './lib/youtube-contract.mjs';
import {requiresYouTubeImage} from './lib/youtube-motion-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:images:import -- youtube/<Woche>/<Thema>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

// macOS speichert Umlaute zerlegt, ZIP-Tools oft zusammengesetzt. Ohne Normalisierung
// gilt "Echte Notfälle" sonst als falsch benannt.
const key = (name) => name.normalize('NFC');

let index;
try {
  index = JSON.parse(readFileSync(resolve(root, VISUAL_INDEX), 'utf8'));
} catch (error) {
  console.error(`${VISUAL_INDEX} ist nicht lesbar: ${error.message}`);
  process.exit(1);
}

const expected = new Set();
if (typeof index.thumbnail?.googleFlowFileName === 'string') expected.add(key(index.thumbnail.googleFlowFileName));
for (const visual of index.visuals ?? []) {
  if (requiresYouTubeImage(visual) && typeof visual.googleFlowFileName === 'string') expected.add(key(visual.googleFlowFileName));
}
if (expected.size === 0) {
  console.error(`${VISUAL_INDEX} nennt keine erwarteten Bilddateien.`);
  process.exit(1);
}

const zipDirectory = resolve(root, ZIP_INBOX);
const inbox = resolve(root, IMAGE_INBOX);
mkdirSync(inbox, {recursive: true});

const zips = existsSync(zipDirectory)
  ? readdirSync(zipDirectory).filter((entry) => extname(entry).toLowerCase() === '.zip')
  : [];

const staging = mkdtempSync(join(tmpdir(), 'finanzneo-flow-'));
const found = new Map();

const collect = (directory) => {
  for (const entry of readdirSync(directory)) {
    if (entry === '__MACOSX' || entry.startsWith('._') || entry === '.DS_Store') continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) collect(path);
    else if (['.png', '.jpg', '.jpeg', '.webp'].includes(extname(entry).toLowerCase())) found.set(key(basename(entry)), path);
  }
};

try {
  for (const zip of zips) {
    const unzip = spawnSync('unzip', ['-o', '-q', resolve(zipDirectory, zip), '-d', staging], {encoding: 'utf8'});
    if (unzip.error?.code === 'ENOENT') {
      console.error('✗ unzip fehlt auf diesem System. ZIP bitte von Hand entpacken und die Bilder direkt in die Inbox legen.');
      process.exit(1);
    }
    if (unzip.status !== 0) {
      console.error(`✗ ZIP ist beschädigt oder nicht lesbar: ${ZIP_INBOX}/${zip}`);
      process.exit(1);
    }
  }
  collect(staging);

  // Bereits abgelegte Bilder zählen als vorhanden.
  for (const entry of readdirSync(inbox)) {
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(extname(entry).toLowerCase())) found.set(key(entry), resolve(inbox, entry));
  }

  const imported = [];
  const wrongName = [];
  for (const [name, path] of found) {
    if (!expected.has(name)) {
      wrongName.push(name);
      continue;
    }
    const destination = resolve(inbox, name);
    if (resolve(path) !== destination) {
      copyFileSync(path, destination);
      imported.push(name);
    }
  }
  const missing = [...expected].filter((name) => !found.has(name)).sort();

  console.log(`\nZIP-Dateien: ${zips.length === 0 ? 'keine' : zips.join(', ')}`);
  console.log(`Erwartet: ${expected.size} · gefunden: ${[...found.keys()].filter((n) => expected.has(n)).length} · neu übernommen: ${imported.length}`);
  imported.forEach((name) => console.log(`  + ${name}`));

  if (wrongName.length > 0) {
    console.error('\nNicht im visual-index.json — falsch benannt oder überflüssig:');
    wrongName.sort().forEach((name) => console.error(`  ? ${name}`));
  }
  if (missing.length > 0) {
    console.error('\nFehlt noch:');
    missing.forEach((name) => console.error(`  - ${name}`));
  }

  if (missing.length > 0 || wrongName.length > 0) {
    console.error(`\n✗ Bildsatz noch nicht vollständig. Fehlende Bilder unter derselben Bildnummer neu erzeugen, falsch benannte exakt umbenennen.`);
    process.exit(1);
  }
  console.log(`\n✓ Bildsatz vollständig in ${IMAGE_INBOX}/ — ${expected.size} Dateien, alle Namen korrekt.`);
} finally {
  rmSync(staging, {recursive: true, force: true});
}
