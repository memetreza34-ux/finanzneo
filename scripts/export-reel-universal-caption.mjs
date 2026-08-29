#!/usr/bin/env node

import {existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const target = args[0];

if (!target) {
  console.error('Nutzung: npm run reel:export -- <Reel-Pfad> [Video-Datei]');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['scripts/export-reel.mjs', ...args], {
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const exportDir = resolve(target, '06-export');
const separateCaptions = [
  'caption-instagram.txt',
  'caption-tiktok.txt',
  'caption-facebook.txt',
  'caption-snapchat.txt',
];

for (const file of separateCaptions) {
  const path = resolve(exportDir, file);
  if (existsSync(path)) rmSync(path, {force: true});
}

const uploadPath = resolve(exportDir, 'UPLOAD.md');
if (existsSync(uploadPath)) {
  let upload = readFileSync(uploadPath, 'utf8');
  upload = upload.replace(
    'Die zusätzlichen Plattformdateien bleiben nur als optionale Varianten im Paket.',
    'Es werden bewusst keine separaten Plattform-Captiondateien erzeugt.',
  );
  upload = upload.replace(
    '- optionale Plattform-Captions für spätere Sonderanpassungen',
    '- `caption-universal.txt` — die einzige Caption für alle Reel-Plattformen',
  );
  writeFileSync(uploadPath, upload, 'utf8');
}

console.log('\n✓ Caption-Export vereinheitlicht: nur caption-universal.txt für alle Reel-Plattformen.');
