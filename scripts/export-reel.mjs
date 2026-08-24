#!/usr/bin/env node

// Baut das fertige Upload-Paket eines Reels in 06-export/.
//
// Ohne diesen Schritt lagen die Ergebnisse verstreut: Video in out/, Bilder in
// 03-szenen/, Captions in 04-caption/. Zum Hochladen musste alles von Hand
// zusammengesucht werden. 06-export/ enthält alles, was für die
// Veröffentlichung gebraucht wird — und sonst nichts.

import {existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, rmSync} from 'node:fs';
import {resolve, basename, join} from 'node:path';
import {spawnSync} from 'node:child_process';

const target = process.argv[2];
const videoArg = process.argv[3];

if (!target) {
  console.error('Nutzung: npm run reel:export -- <Reel-Pfad> [Video-Datei]');
  process.exit(1);
}

const root = resolve(target);
const reelName = basename(root);
const exportDir = resolve(root, '06-export');

if (!existsSync(root)) {
  console.error(`Reel-Ordner nicht gefunden: ${root}`);
  process.exit(1);
}

const fehlt = [];
const gebaut = [];

// ── Video finden ────────────────────────────────────────────────────────────
let videoPfad = videoArg ? resolve(videoArg) : null;
if (!videoPfad) {
  const kandidaten = existsSync(resolve('out'))
    ? readdirSync(resolve('out'))
        .filter((f) => f.endsWith('.mp4'))
        .map((f) => resolve('out', f))
        .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
    : [];
  videoPfad = kandidaten[0] ?? null;
}

if (!videoPfad || !existsSync(videoPfad)) {
  console.error('\n✗ Export nicht möglich: keine gerenderte MP4 gefunden.');
  console.error('  Erst rendern, dann exportieren — oder Videopfad als zweites Argument angeben.');
  process.exit(1);
}

// ── Zielordner frisch aufbauen ──────────────────────────────────────────────
if (existsSync(exportDir)) rmSync(exportDir, {recursive: true, force: true});
mkdirSync(exportDir, {recursive: true});

// ── 1. Video ────────────────────────────────────────────────────────────────
const videoZiel = join(exportDir, `${reelName}.mp4`);
copyFileSync(videoPfad, videoZiel);
gebaut.push(`${reelName}.mp4`);

// ── 2. Cover ────────────────────────────────────────────────────────────────
const bilderOrdner = resolve(root, '03-szenen/00-ALLE-BILDER-HIER-REIN');
if (existsSync(bilderOrdner)) {
  const coverDatei = readdirSync(bilderOrdner).find((f) => /^Bild 00/i.test(f) && /\.(png|jpe?g|webp)$/i.test(f));
  if (coverDatei) {
    copyFileSync(join(bilderOrdner, coverDatei), join(exportDir, `cover${coverDatei.slice(coverDatei.lastIndexOf('.'))}`));
    gebaut.push('cover.png');
  } else {
    fehlt.push('Cover (Bild 00) im Bilderordner');
  }
} else {
  fehlt.push('Bilderordner 03-szenen/00-ALLE-BILDER-HIER-REIN');
}

// ── 3. Alle Bilder als ZIP ──────────────────────────────────────────────────
if (existsSync(bilderOrdner)) {
  const bilder = readdirSync(bilderOrdner).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  if (bilder.length > 0) {
    const zip = spawnSync('zip', ['-j', '-q', join(exportDir, 'bilder.zip'), ...bilder.map((f) => join(bilderOrdner, f))]);
    if (zip.status === 0) gebaut.push(`bilder.zip (${bilder.length} Bilder)`);
    else fehlt.push('bilder.zip konnte nicht erstellt werden');
  } else {
    fehlt.push('keine Bilder im Bilderordner');
  }
}

// ── 4. Captions ─────────────────────────────────────────────────────────────
const captionQuellen = {
  'caption-universal.txt': '04-caption/caption.txt',
  'caption-instagram.txt': '04-caption/instagram-reels.txt',
  'caption-tiktok.txt': '04-caption/tiktok.txt',
  'caption-facebook.txt': '04-caption/facebook-reels.txt',
  'caption-snapchat.txt': '04-caption/snapchat.txt',
};
for (const [ziel, quelle] of Object.entries(captionQuellen)) {
  const q = resolve(root, quelle);
  if (existsSync(q)) {
    copyFileSync(q, join(exportDir, ziel));
    gebaut.push(ziel);
  } else {
    fehlt.push(quelle);
  }
}

// ── 5. Untertitel als SRT ───────────────────────────────────────────────────
const timingPfad = resolve(root, '04-caption/word-timings.json');
if (existsSync(timingPfad)) {
  try {
    const timing = JSON.parse(readFileSync(timingPfad, 'utf8'));
    const saetze = Array.isArray(timing.sentences) ? timing.sentences : [];
    if (saetze.length > 0) {
      const zeit = (s) => {
        const ms = Math.max(0, Math.round(s * 1000));
        const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
        const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
        const sek = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        const rest = String(ms % 1000).padStart(3, '0');
        return `${h}:${m}:${sek},${rest}`;
      };
      // Dieselbe Bereinigung wie im Video: Transkriptionen zerlegen Beträge am
      // Tausenderpunkt ("100" + ".000"), im Untertitel stand sichtbar "100 .000".
      const zahlenZusammen = (text) => String(text ?? '').replace(/(\d)\s+([.,]\d)/g, '$1$2').trim();
      const srt = saetze
        .map((s, i) => `${i + 1}\n${zeit(s.start)} --> ${zeit(s.end)}\n${zahlenZusammen(s.text)}\n`)
        .join('\n');
      writeFileSync(join(exportDir, 'untertitel.srt'), srt, 'utf8');
      gebaut.push(`untertitel.srt (${saetze.length} Einheiten)`);
    } else {
      fehlt.push('Untertitel: keine Sätze in word-timings.json');
    }
  } catch {
    fehlt.push('word-timings.json ist nicht lesbar');
  }
} else {
  fehlt.push('04-caption/word-timings.json');
}

// ── 6. Technische Daten messen ──────────────────────────────────────────────
const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size',
  '-show_entries', 'stream=width,height,codec_name', '-of', 'json', videoZiel], {encoding: 'utf8'});

let technik = {dauer: null, groesse: null, breite: null, hoehe: null};
if (probe.status === 0) {
  try {
    const j = JSON.parse(probe.stdout);
    technik.dauer = Number(j.format?.duration);
    technik.groesse = Number(j.format?.size);
    const v = (j.streams ?? []).find((s) => s.width);
    technik.breite = v?.width;
    technik.hoehe = v?.height;
  } catch { /* Messwerte bleiben leer */ }
}

const laut = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', videoZiel,
  '-af', 'ebur128=peak=true', '-f', 'null', '-'], {encoding: 'utf8'});
const lufs = laut.stderr?.match(/I:\s*(-?[\d.]+)\s*LUFS/g)?.pop()?.match(/(-?[\d.]+)/)?.[1] ?? null;
const peak = laut.stderr?.match(/Peak:\s*(-?[\d.]+)\s*dBFS/g)?.pop()?.match(/(-?[\d.]+)/)?.[1] ?? null;

// ── 7. Titel und Upload-Anleitung ───────────────────────────────────────────
let titel = reelName;
const indexPfad = resolve(root, '03-szenen/scene-index.json');
if (existsSync(indexPfad)) {
  try { titel = JSON.parse(readFileSync(indexPfad, 'utf8')).title ?? reelName; } catch { /* Standardtitel */ }
}

const mb = (b) => (b ? `${(b / 1024 / 1024).toFixed(1)} MB` : 'unbekannt');
const upload = `# Upload-Paket — ${titel}

Alles in diesem Ordner ist fertig zum Hochladen. Nichts weiter vorbereiten.

## Video

- Datei: \`${reelName}.mp4\`
- Format: ${technik.breite ?? '?'} × ${technik.hoehe ?? '?'} (9:16)
- Länge: ${technik.dauer ? `${technik.dauer.toFixed(1)} s` : 'unbekannt'}
- Größe: ${mb(technik.groesse)}
- Lautheit: ${lufs ? `${lufs} LUFS` : 'nicht gemessen'} (Ziel ca. -16)
- True Peak: ${peak ? `${peak} dBFS` : 'nicht gemessen'} (Ziel höchstens -1)

Untertitel sind fest im Video eingebrannt. \`untertitel.srt\` liegt zusätzlich
bei, falls eine Plattform eigene Untertitel möchte.

## Texte

| Plattform | Datei |
|---|---|
| überall verwendbar | \`caption-universal.txt\` |
| Instagram Reels | \`caption-instagram.txt\` |
| TikTok | \`caption-tiktok.txt\` |
| Facebook Reels | \`caption-facebook.txt\` |
| Snapchat | \`caption-snapchat.txt\` |

## Weitere Dateien

- \`cover.png\` — Titelbild für Vorschau und Thumbnail
- \`bilder.zip\` — alle Szenenbilder, falls du einzelne nachnutzen willst
- \`untertitel.srt\` — separate Untertiteldatei

## Vor dem Hochladen

- [ ] Video einmal komplett mit Ton angesehen
- [ ] Caption der jeweiligen Plattform kopiert
- [ ] Cover als Vorschaubild gesetzt
- [ ] Hochformat 9:16 in der Vorschau geprüft

## Nicht für YouTube

FinanzNeo veröffentlicht keine YouTube Shorts. YouTube läuft ausschließlich
als eigenständige Longform unter \`youtube/\`.
`;
writeFileSync(join(exportDir, 'UPLOAD.md'), upload, 'utf8');
gebaut.push('UPLOAD.md');

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`\n✓ Upload-Paket erstellt: ${target}/06-export/\n`);
gebaut.forEach((g) => console.log(`  ✓ ${g}`));

if (fehlt.length) {
  console.warn('\nNicht enthalten:');
  fehlt.forEach((f) => console.warn(`  ✗ ${f}`));
  console.warn('\nDas Paket ist unvollständig. Fehlende Teile ergänzen und erneut exportieren.');
  process.exit(1);
}

console.log('\nAlles vollständig. Öffne 06-export/UPLOAD.md für die Upload-Anleitung.');
