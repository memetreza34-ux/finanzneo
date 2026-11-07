// Lädt fehlende Icons des YouTube-Icon-Katalogs nach public/icons/fluent-3d/ (MIT, Microsoft Fluent Emoji 3D).
//
//   npm run youtube:icons            fehlende Icons laden
//   npm run youtube:icons -- --liste Katalog mit Bedeutungen ausgeben (für die Planung)
//
// Neue Icons: Eintrag in scripts/lib/youtube-icons.mjs ergänzen, dann dieses Skript laufen lassen.

import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {YOUTUBE_ICONS, YOUTUBE_ICONS_DIR, youtubeIconDatei, youtubeIconQuelle} from './lib/youtube-icons.mjs';

const ROOT = resolve(import.meta.dirname, '..');

if (process.argv.includes('--liste')) {
  for (const [name, {bedeutung}] of Object.entries(YOUTUBE_ICONS)) console.log(`${name.padEnd(20)} ${bedeutung}`);
  process.exit(0);
}

const ordner = resolve(ROOT, 'public', YOUTUBE_ICONS_DIR);
mkdirSync(ordner, {recursive: true});

const lade = async (url) => {
  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error(`${antwort.status} ${url}`);
  return Buffer.from(await antwort.arrayBuffer());
};

const lizenz = resolve(ordner, 'LICENSE');
if (!existsSync(lizenz)) writeFileSync(lizenz, await lade('https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/LICENSE'));

const fehler = [];
let neu = 0;
for (const name of Object.keys(YOUTUBE_ICONS)) {
  const ziel = resolve(ROOT, 'public', youtubeIconDatei(name));
  if (existsSync(ziel)) continue;
  try {
    writeFileSync(ziel, await lade(youtubeIconQuelle(name)));
    neu += 1;
  } catch (e) {
    fehler.push(`${name}: ${e.message}`);
  }
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Icon(s) nicht geladen:\n${fehler.map((f) => `- ${f}`).join('\n')}`);
  process.exit(1);
}
console.log(`✓ ${Object.keys(YOUTUBE_ICONS).length} Icons vorhanden (${neu} neu geladen) in public/${YOUTUBE_ICONS_DIR}/`);
