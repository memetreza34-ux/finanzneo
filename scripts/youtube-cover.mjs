#!/usr/bin/env node
// FinanzNeo-Cover V1: setzt den exakten Thumbnail-Text auf die Flow-Illustration.
//
//   npm run youtube:cover -- youtube/<Projekt>
//   npm run youtube:cover -- --bild <png> --zeilen "540 € vom Staat|Der Haken" --marker "540 €" [--ton rot] [--kicker "Neu ab 2027"] --aus <png>
//
// Projektmodus: liest `thumbnail.cover` aus dem Visual-Index und das Flow-Thumbnail aus
// 3-bilder-hier-rein/, schreibt _intern/04-visuals/cover.png (1280 × 720) und eine Feed-Vorschau
// in Handygröße (320 × 180) zur Sichtprüfung. youtube:render übernimmt cover.png nach 5-export/.

import {spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {IMAGE_INBOX, VISUAL_INDEX, internWurzel} from './lib/youtube-contract.mjs';
import {findeChrome} from './lib/youtube-chrome.mjs';
import {YOUTUBE_COVER_BREITE, YOUTUBE_COVER_DATEI, YOUTUBE_COVER_HOEHE, YOUTUBE_COVER_KLEIN_DATEI, coverHtml, pruefeCover} from './lib/youtube-cover.mjs';

const args = process.argv.slice(2);
const wert = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const optionen = new Set(['--bild', '--zeilen', '--marker', '--ton', '--kicker', '--aus', '--fokus']);
const projekt = args.find((a, i) => !a.startsWith('--') && !optionen.has(args[i - 1]));

let cover;
let bild;
let aus;
let klein = null;
if (projekt) {
  const root = internWurzel(projekt);
  const index = JSON.parse(readFileSync(resolve(root, VISUAL_INDEX), 'utf8'));
  cover = index.thumbnail?.cover;
  bild = resolve(root, IMAGE_INBOX, index.thumbnail?.googleFlowFileName ?? '');
  aus = resolve(root, YOUTUBE_COVER_DATEI);
  klein = resolve(root, YOUTUBE_COVER_KLEIN_DATEI);
} else {
  cover = {zeilen: (wert('--zeilen') ?? '').split('|').filter(Boolean), marker: wert('--marker'), ton: wert('--ton') ?? 'rot', kicker: wert('--kicker') ?? null, bildFokus: wert('--fokus')};
  bild = resolve(wert('--bild') ?? '');
  aus = resolve(wert('--aus') ?? 'cover.png');
  klein = aus.replace(/\.png$/, '-feed-vorschau.png');
}

const fehler = pruefeCover(cover);
if (!existsSync(bild)) fehler.push(`Illustration fehlt: ${bild}`);
if (fehler.length) {
  console.error('Cover nicht möglich:\n' + fehler.map((f) => `- ${f}`).join('\n'));
  process.exit(1);
}
const chrome = findeChrome();
if (!chrome) {
  console.error('Kein Chrome gefunden. Google Chrome installieren oder FINANZNEO_CHROME=<Pfad> setzen.');
  process.exit(1);
}

const tmp = mkdtempSync(join(tmpdir(), 'finanzneo-cover-'));
try {
  const html = join(tmp, 'cover.html');
  writeFileSync(html, coverHtml({...cover, bildFokus: cover.bildFokus ?? undefined, bildUrl: pathToFileURL(bild).href}));
  const lauf = spawnSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--allow-file-access-from-files',
    `--user-data-dir=${join(tmp, 'profil')}`, `--window-size=${YOUTUBE_COVER_BREITE},${YOUTUBE_COVER_HOEHE}`,
    '--force-device-scale-factor=1', '--virtual-time-budget=8000', `--screenshot=${aus}`, pathToFileURL(html).href,
  ], {encoding: 'utf8', timeout: 60000});
  if (!existsSync(aus)) {
    console.error(`Chrome hat kein Cover geschrieben.\n${lauf.stderr?.slice(-600) ?? ''}`);
    process.exit(1);
  }
  spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', aus, '-vf', 'scale=320:180', klein]);
} finally {
  rmSync(tmp, {recursive: true, force: true});
}
console.log(`✓ Cover: ${aus}`);
if (existsSync(klein)) console.log(`  Feed-Vorschau (Handygröße): ${klein} — dort muss der Text noch klar lesbar sein.`);
