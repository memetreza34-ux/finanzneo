#!/usr/bin/env node
// Finaler YouTube-Render: prüft youtube:ready, baut den Zeitplan ohne Vorschau,
// rendert 1920 × 1080 und mastert den Ton auf −16 LUFS / −1 dBTP.
//
//   npm run youtube:render -- youtube/<Projekt>
//
// Ergebnis in youtube/<Projekt>/5-export/: video.mp4, cover.png, caption.txt (Titel +
// YouTube-Beschreibung) und untertitel-zeitstempel.txt („00:00 Satz“ je Zeile, für die
// YouTube-Untertitel). Zwischenstände und Kontaktbogen liegen unter out/youtube/<Projekt>/.

import {spawnSync} from 'node:child_process';
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, resolve} from 'node:path';
import {EXPORT_DIR, EXPORT_FILES, IMAGE_INBOX, VISUAL_INDEX, WORD_TIMINGS, YOUTUBE_PUBLISHING_FILES, internWurzel} from './lib/youtube-contract.mjs';

const projekt = process.argv[2];
if (!projekt) {
  console.error('Aufruf: npm run youtube:render -- youtube/<Projekt>');
  process.exit(1);
}
const slug = basename(resolve(projekt));
const id = `YouTube-${slug.replace(/[^a-zA-Z0-9-]/g, '-')}`;
const out = resolve('out/youtube', slug);
mkdirSync(out, {recursive: true});
const roh = resolve(out, 'roh.mp4');
const final = resolve(out, `${slug}.mp4`);

const lauf = (cmd, args, beschreibung) => {
  console.log(`→ ${beschreibung}`);
  const r = spawnSync(cmd, args, {stdio: 'inherit'});
  if (r.status !== 0) {
    console.error(`✗ ${beschreibung} fehlgeschlagen.`);
    process.exit(r.status ?? 1);
  }
};
const lies = (cmd, args) => spawnSync(cmd, args, {encoding: 'utf8'}).stderr;

lauf('node', ['scripts/check-youtube-production-ready.mjs', projekt], 'Startfreigabe (youtube:ready)');
lauf('node', ['scripts/youtube-zusammenbau.mjs', projekt], 'Zeitplan ohne Vorschau');
lauf('npx', ['remotion', 'render', 'src/index.ts', id, roh, '--codec=h264', '--crf=18', '--log=error'], `Render ${id}`);

// Zweistufiges loudnorm: erst messen, dann linear auf −16 LUFS / −1 dBTP.
const messung = lies('ffmpeg', ['-hide_banner', '-i', roh, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
const json = JSON.parse(messung.slice(messung.lastIndexOf('{'), messung.lastIndexOf('}') + 1));
const filter = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${json.input_i}:measured_TP=${json.input_tp}:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true`;
lauf('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', roh, '-c:v', 'copy', '-af', filter, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', final], 'Ton-Mastering −16 LUFS / −1 dBTP');

const kontrolle = lies('ffmpeg', ['-hide_banner', '-i', final, '-af', 'ebur128=peak=true', '-f', 'null', '-']);
const lufs = Number(/I:\s+(-?[\d.]+) LUFS/.exec(kontrolle.slice(kontrolle.lastIndexOf('Summary')))?.[1]);
const peak = Number(/Peak:\s+(-?[\d.]+) dBFS/.exec(kontrolle.slice(kontrolle.lastIndexOf('Summary')))?.[1]);
if (!(Math.abs(lufs + 16) <= 1 && peak <= -1)) {
  console.error(`✗ Lautheit ${lufs} LUFS / Peak ${peak} dBFS außerhalb −16 ± 1 LUFS / ≤ −1 dBTP.`);
  process.exit(1);
}

// Kontaktbogen aus der fertigen Datei
const dauer = Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', final], {encoding: 'utf8'}).stdout);
const args = ['-hide_banner', '-loglevel', 'error', '-y'];
for (const p of [10, 35, 65, 90]) args.push('-ss', String((dauer * p) / 100), '-i', final);
args.push('-filter_complex', '[0:v]scale=960:540[a];[1:v]scale=960:540[b];[2:v]scale=960:540[c];[3:v]scale=960:540[d];[a][b]hstack[t];[c][d]hstack[u];[t][u]vstack', '-frames:v', '1', resolve(out, 'kontaktbogen.png'));
lauf('ffmpeg', args, 'Kontaktbogen 10/35/65/90 %');

// ─── Export-Ordner: nur was für den Upload gebraucht wird ───────────────────
const intern = internWurzel(projekt);
const liesIntern = (rel) => readFileSync(resolve(intern, rel), 'utf8').trim();
mkdirSync(resolve(intern, EXPORT_DIR), {recursive: true});
copyFileSync(final, resolve(intern, EXPORT_FILES.video));
const index = JSON.parse(liesIntern(VISUAL_INDEX));
copyFileSync(resolve(intern, IMAGE_INBOX, index.thumbnail.googleFlowFileName), resolve(intern, EXPORT_FILES.cover));
writeFileSync(resolve(intern, EXPORT_FILES.caption), `${liesIntern(YOUTUBE_PUBLISHING_FILES.finalTitle)}\n\n${liesIntern(YOUTUBE_PUBLISHING_FILES.description)}\n`);
const zeit = (sek) => {
  const s = Math.floor(sek);
  const h = Math.floor(s / 3600);
  const mmss = `${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return h > 0 ? `${String(h).padStart(2, '0')}:${mmss}` : mmss;
};
const timing = JSON.parse(liesIntern(WORD_TIMINGS));
writeFileSync(resolve(intern, EXPORT_FILES.untertitel), `${timing.sentences.map((satz) => `${zeit(satz.start)} ${satz.text}`).join('\n')}\n`);

console.log(`\n✓ Fertig: ${resolve(intern, EXPORT_DIR)}`);
console.log('  video.mp4 · cover.png · caption.txt · untertitel-zeitstempel.txt');
console.log(`  ${dauer.toFixed(1)} s · 1920 × 1080 · ${lufs} LUFS · Peak ${peak} dBFS`);
console.log('  Danach: ganzes Video ansehen — technische Prüfung ersetzt keine Sichtprüfung.');
