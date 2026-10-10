#!/usr/bin/env node
// Sprachaufnahme in mehreren Teilen (z. B. „Finanzneo (1).mp4“, „Finanzneo 2.mp4“, …) in
// 4-audio-hier-rein/ → eine voiceover.wav. Die Originale wandern nach _intern/03-audio/teile/.
// Die Nahtstellen werden ausgegeben, damit man dort gezielt reinhören kann.
//
//   node scripts/youtube-audio-teile.mjs youtube/<Projekt>

import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, renameSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {AUDIO_INBOX, internWurzel} from './lib/youtube-contract.mjs';

const TEILE = ['.wav', '.mp3', '.m4a', '.aiff', '.aif', '.mp4', '.mov', '.webm'];
const zeit = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const dauer = (pfad) => Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', pfad], {encoding: 'utf8'}).stdout.trim());

/** Fügt mehrere Teile zusammen. Gibt die Nahtstellen in Sekunden zurück, [] wenn nichts zu tun war. */
export const verbindeAudioTeile = (projekt) => {
  const root = internWurzel(projekt);
  const inbox = resolve(root, AUDIO_INBOX);
  if (!existsSync(inbox)) return [];
  const teile = readdirSync(inbox)
    .filter((f) => !f.startsWith('.') && TEILE.some((e) => f.toLowerCase().endsWith(e)))
    .sort((a, b) => a.localeCompare(b, 'de', {numeric: true}));
  if (teile.length < 2) return [];

  const ziel = resolve(inbox, 'voiceover.wav');
  if (existsSync(ziel)) throw new Error('4-audio-hier-rein/ enthält voiceover.wav und weitere Teile — bitte nur eins von beidem.');
  const eingaben = teile.flatMap((f) => ['-i', resolve(inbox, f)]);
  const filter = `${teile.map((_, i) => `[${i}:a]`).join('')}concat=n=${teile.length}:v=0:a=1[a]`;
  const r = spawnSync('ffmpeg', ['-v', 'error', '-y', ...eingaben, '-filter_complex', filter, '-map', '[a]', '-ar', '48000', '-ac', '1', ziel], {stdio: 'inherit'});
  if (r.status !== 0) throw new Error('Audio-Teile konnten nicht verbunden werden.');

  const ablage = resolve(root, '03-audio/teile');
  mkdirSync(ablage, {recursive: true});
  const naehte = [];
  let summe = 0;
  teile.forEach((f, i) => {
    summe += dauer(resolve(inbox, f));
    if (i < teile.length - 1) naehte.push(summe);
    renameSync(resolve(inbox, f), resolve(ablage, f));
  });
  console.log(`✓ ${teile.length} Audio-Teile → 4-audio-hier-rein/voiceover.wav (Reihenfolge: ${teile.join(' · ')})`);
  console.log(`  Nahtstellen zum Reinhören: ${naehte.map(zeit).join(', ')}`);
  return naehte;
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const projekt = process.argv[2];
  if (!projekt) {
    console.error('Aufruf: node scripts/youtube-audio-teile.mjs youtube/<Projekt>');
    process.exit(1);
  }
  try {
    if (verbindeAudioTeile(projekt).length === 0) console.log('Nichts zu verbinden: höchstens eine Aufnahme vorhanden.');
  } catch (error) {
    console.error(`✗ ${error.message}`);
    process.exit(1);
  }
}
