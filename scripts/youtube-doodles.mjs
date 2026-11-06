// Doodles (kostenlos, ohne KI) suchen und laden — docs/YOUTUBE-BILDMIX-UND-COVER.md
//
//   npm run youtube:doodles -- --suche "piggy bank"   Treffer aller erlaubten Sammlungen + Übersichtsbild
//   npm run youtube:doodles -- youtube/<Projekt>      alle Doodles des Projekts nach public/doodles/ laden

import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {VISUAL_INDEX, internWurzel} from './lib/youtube-contract.mjs';
import {findeChrome} from './lib/youtube-chrome.mjs';
import {folieDoodles} from './lib/youtube-folie.mjs';
import {YOUTUBE_DOODLE_API, YOUTUBE_DOODLE_SAMMLUNGEN, doodleNachweise, ladeDoodles} from './lib/youtube-doodle.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);

if (args.includes('--suche')) {
  const begriff = args[args.indexOf('--suche') + 1];
  if (!begriff) {
    console.error('Aufruf: npm run youtube:doodles -- --suche "piggy bank"');
    process.exit(1);
  }
  const treffer = [];
  for (const sammlung of Object.keys(YOUTUBE_DOODLE_SAMMLUNGEN).sort((a, b) => YOUTUBE_DOODLE_SAMMLUNGEN[a].rang - YOUTUBE_DOODLE_SAMMLUNGEN[b].rang)) {
    const antwort = await fetch(`${YOUTUBE_DOODLE_API}/search?${new URLSearchParams({query: begriff, prefixes: sammlung, limit: '32'})}`);
    const icons = antwort.ok ? (await antwort.json()).icons ?? [] : [];
    treffer.push(...icons.slice(0, 12));
  }
  if (!treffer.length) {
    console.log(`Keine Treffer für „${begriff}“ — englischen Begriff variieren, sonst Flow-Sticker (Ausnahme).`);
    process.exit(0);
  }
  treffer.forEach((id) => console.log(id));
  // Übersichtsbild zum Aussuchen.
  const ordner = mkdtempSync(join(tmpdir(), 'finanzneo-doodles-'));
  const kacheln = treffer.map((id) => `<div><img src="${YOUTUBE_DOODLE_API}/${id.replace(':', '/')}.svg?height=120"><p>${id}</p></div>`).join('');
  writeFileSync(join(ordner, 'suche.html'), `<html><body style="margin:0;background:#fff;font:12px sans-serif;display:flex;flex-wrap:wrap">${kacheln.replaceAll('<div>', '<div style="width:190px;text-align:center;padding:8px">')}</body></html>`);
  const chrome = findeChrome();
  if (chrome) {
    spawnSync(chrome, ['--headless=new', '--disable-gpu', '--virtual-time-budget=15000', `--screenshot=${join(ordner, 'suche.png')}`, '--window-size=1340,1100', `file://${join(ordner, 'suche.html')}`], {stdio: 'ignore'});
    console.log(`\nÜbersicht: ${join(ordner, 'suche.png')}`);
  }
  process.exit(0);
}

const projekt = args.find((a) => !a.startsWith('--'));
if (!projekt) {
  console.error('Aufruf: npm run youtube:doodles -- youtube/<Projekt>  |  --suche "<begriff>"');
  process.exit(1);
}
const index = JSON.parse(readFileSync(resolve(internWurzel(projekt), VISUAL_INDEX), 'utf8'));
const ids = (index.visuals ?? []).flatMap((v) => (v.type === 'folie' ? folieDoodles(v.folie) : []));
const neu = await ladeDoodles(ROOT, ids);
console.log(`✓ ${new Set(ids).size} Doodle(s) bereit (${neu.length} neu geladen) in public/doodles/`);
for (const zeile of doodleNachweise(ids)) console.log(`  Bildnachweis: ${zeile}`);
