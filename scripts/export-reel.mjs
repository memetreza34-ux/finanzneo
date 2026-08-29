#!/usr/bin/env node

// Baut das fertige Upload-Paket eines Reels in 06-export/.
// Ein MP4 allein gilt NICHT als fertig. Vor jedem Export wird geprüft, dass
// genau dieses Video die Phase-3-Render-QA bestanden hat und dass weder
// scene-index noch Produktionsmanifest seit der QA verändert wurden.
// Szene 01 ist das Cover; es gibt keinen separaten Cover-Bildjob.

import {existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, rmSync} from 'node:fs';
import {resolve, basename, join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  PHASE3_CONTRACT_ID,
  PHASE3_MANIFEST_RELATIVE,
  PHASE3_QA_RELATIVE,
  sha256File,
} from './lib/phase3-completion.mjs';

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

// ── Video sicher finden ─────────────────────────────────────────────────────
let videoPfad = videoArg ? resolve(videoArg) : null;
if (!videoPfad) {
  const kandidaten = existsSync(resolve('out'))
    ? readdirSync(resolve('out'))
        .filter((f) => f.endsWith('.mp4') && !f.includes('.phase3-candidate.'))
        .map((f) => resolve('out', f))
        .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
    : [];

  const passend = kandidaten.filter((pfad) => basename(pfad, '.mp4').toLowerCase().includes(reelName.toLowerCase()));

  if (passend.length > 0) {
    videoPfad = passend[0];
  } else if (kandidaten.length === 1) {
    videoPfad = kandidaten[0];
  } else if (kandidaten.length > 1) {
    console.error('\n✗ Export nicht möglich: mehrere MP4-Dateien in out/ und keine ist eindeutig diesem Reel zugeordnet.');
    console.error('  Übergib den exakten Videopfad als zweites Argument:');
    console.error(`  npm run reel:export -- ${target} out/<dieses-reel>.mp4`);
    process.exit(1);
  }
}

if (!videoPfad || !existsSync(videoPfad)) {
  console.error('\n✗ Export nicht möglich: keine gerenderte MP4 gefunden.');
  console.error('  Erst über scripts/render-validated.mjs rendern; Candidate-Dateien zählen nicht als final.');
  process.exit(1);
}

// ── Phase-3-Fertigkeitsgate ─────────────────────────────────────────────────
const indexPfad = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPfad)) {
  console.error('\n✗ Export blockiert: 03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

let index;
try {
  index = JSON.parse(readFileSync(indexPfad, 'utf8'));
} catch {
  console.error('\n✗ Export blockiert: scene-index.json ist nicht lesbar.');
  process.exit(1);
}

const contract = index.phase3CompletionContract;
if (contract?.id !== PHASE3_CONTRACT_ID || contract?.required !== true || contract?.exportRequiresPassedRenderQa !== true) {
  console.error(`\n✗ Export blockiert: verbindlicher Phase-3-Fertigkeitsvertrag ${PHASE3_CONTRACT_ID} fehlt.`);
  console.error('  Reel zuerst mit dem aktuellen Systemvertrag aktualisieren und Phase 3 neu prüfen.');
  process.exit(1);
}

const qaPfad = resolve(root, contract.renderQa ?? PHASE3_QA_RELATIVE);
const productionManifestPfad = resolve(root, contract.productionManifest ?? PHASE3_MANIFEST_RELATIVE);
if (!existsSync(qaPfad) || !existsSync(productionManifestPfad)) {
  console.error('\n✗ Export blockiert: Phase-3-QA oder Produktionsmanifest fehlt.');
  console.error(`  Erwartet: ${contract.productionManifest ?? PHASE3_MANIFEST_RELATIVE}`);
  console.error(`  Erwartet: ${contract.renderQa ?? PHASE3_QA_RELATIVE}`);
  process.exit(1);
}

let qa;
try {
  qa = JSON.parse(readFileSync(qaPfad, 'utf8'));
} catch {
  console.error('\n✗ Export blockiert: Phase-3-QA-Bericht ist nicht lesbar.');
  process.exit(1);
}

const gateErrors = [];
if (qa.status !== 'PASSED') gateErrors.push(`Render-QA-Status ist ${qa.status ?? 'unbekannt'}, nicht PASSED.`);
if (qa.contractId !== PHASE3_CONTRACT_ID) gateErrors.push('QA-Bericht gehört nicht zum aktuellen Phase-3-Vertrag.');
if (!Array.isArray(qa.scenes) || qa.scenes.length !== (index.scenes?.length ?? 0)) gateErrors.push('QA-Bericht deckt nicht alle Szenen ab.');
if (Array.isArray(qa.scenes) && qa.scenes.some((scene) => scene.passed !== true)) gateErrors.push('Mindestens eine Szene hat die visuelle Render-QA nicht bestanden.');
if (qa.videoSha256 !== sha256File(videoPfad)) gateErrors.push('Die ausgewählte MP4 ist NICHT exakt die visuell geprüfte MP4 (SHA-256 abweichend).');
if (qa.sceneIndexSha256 !== sha256File(indexPfad)) gateErrors.push('scene-index.json wurde nach der Render-QA verändert. Neu rendern und erneut prüfen.');
if (qa.productionManifestSha256 !== sha256File(productionManifestPfad)) gateErrors.push('phase3-production-manifest.json wurde nach der Render-QA verändert. Neu rendern und erneut prüfen.');

if (gateErrors.length) {
  console.error('\n✗ EXPORT GESPERRT — REEL IST NICHT FINAL_COMPLETE\n');
  gateErrors.forEach((error) => console.error(`- ${error}`));
  console.error('\nKein Upload-Paket wird erzeugt. Phase-3-Render-QA erneut vollständig ausführen.');
  process.exit(1);
}

console.log(`\n✓ Phase-3-Fertigkeitsgate bestanden: ${videoPfad}`);
console.log('  Exakter Video-Hash + alle Szenen + unveränderte Produktionsdaten bestätigt.');

// ── Zielordner frisch aufbauen ──────────────────────────────────────────────
if (existsSync(exportDir)) rmSync(exportDir, {recursive: true, force: true});
mkdirSync(exportDir, {recursive: true});

// ── 1. Video ────────────────────────────────────────────────────────────────
const videoZiel = join(exportDir, `${reelName}.mp4`);
copyFileSync(videoPfad, videoZiel);
gebaut.push(`${reelName}.mp4`);

// ── 2. Cover = exakt scene-01 ───────────────────────────────────────────────
const bilderOrdner = resolve(root, '03-szenen/00-ALLE-BILDER-HIER-REIN');
const firstScene = Array.isArray(index.scenes) ? index.scenes[0] : null;
let coverExportName = 'cover.png';
if (!firstScene || firstScene.id !== 'scene-01' || firstScene.type !== 'image') {
  fehlt.push('scene-01 muss als Bildszene das Cover liefern');
} else if (existsSync(bilderOrdner)) {
  const erwarteterCoverName = String(firstScene.googleFlowFileName ?? '').trim();
  const dateien = readdirSync(bilderOrdner);
  const coverDatei = dateien.find((f) => f.toLowerCase() === erwarteterCoverName.toLowerCase())
    ?? dateien.find((f) => /^Bild 01\b/i.test(f) && /\.(png|jpe?g|webp)$/i.test(f));

  if (coverDatei && /\.(png|jpe?g|webp)$/i.test(coverDatei)) {
    const extension = coverDatei.slice(coverDatei.lastIndexOf('.'));
    coverExportName = `cover${extension}`;
    copyFileSync(join(bilderOrdner, coverDatei), join(exportDir, coverExportName));
    gebaut.push(`${coverExportName} (identisch mit scene-01)`);
  } else {
    fehlt.push(`Cover = scene-01 (${erwarteterCoverName || 'Bild 01'}) im Bilderordner`);
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
// caption-universal.txt ist die primäre Caption für ALLE Reel-Plattformen.
// Plattformvarianten bleiben als zusätzliche Dateien erhalten, falls später
// doch eine plattformspezifische Anpassung gebraucht wird.
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
try { titel = index.title ?? reelName; } catch { /* Standardtitel */ }

const mb = (b) => (b ? `${(b / 1024 / 1024).toFixed(1)} MB` : 'unbekannt');
const upload = `# Upload-Paket — ${titel}

Dieses Paket wurde automatisch nach bestandenem Phase-3-Fertigkeitsgate erzeugt.
Die enthaltene MP4 ist exakt die per SHA-256 geprüfte Finaldatei.

## Video

- Datei: \`${reelName}.mp4\`
- Format: ${technik.breite ?? '?'} × ${technik.hoehe ?? '?'} (9:16)
- Länge: ${technik.dauer ? `${technik.dauer.toFixed(1)} s` : 'unbekannt'}
- Größe: ${mb(technik.groesse)}
- Lautheit: ${lufs ? `${lufs} LUFS` : 'nicht gemessen'} (Ziel ca. -16)
- True Peak: ${peak ? `${peak} dBFS` : 'nicht gemessen'} (Ziel höchstens -1)
- Phase-3-Render-QA: PASSED

Untertitel sind fest im Video eingebrannt. \`untertitel.srt\` liegt zusätzlich
bei, falls eine Plattform eigene Untertitel möchte.

## Universelle Reel-Caption

Für Instagram Reels, TikTok, Facebook Reels und Snapchat standardmäßig dieselbe Datei verwenden:

- \`caption-universal.txt\`

Die zusätzlichen Plattformdateien bleiben nur als optionale Varianten im Paket.

## Cover

- \`${coverExportName}\` ist exakt dasselbe Bild wie scene-01.
- Es wurde KEIN separates Cover und KEIN Bild 00 erzeugt.

## Weitere Dateien

- \`bilder.zip\` — alle Szenenbilder, falls du einzelne nachnutzen willst
- \`untertitel.srt\` — separate Untertiteldatei
- optionale Plattform-Captions für spätere Sonderanpassungen

## Vor dem Hochladen

- [ ] Video einmal komplett mit Ton angesehen
- [ ] \`caption-universal.txt\` für die Reel-Plattform kopiert
- [ ] scene-01-Cover als Vorschaubild gesetzt
- [ ] Hochformat 9:16 in der Vorschau geprüft

## Nicht für YouTube

FinanzNeo veröffentlicht keine YouTube Shorts. YouTube läuft ausschließlich
als eigenständige Longform unter \`youtube/\`.
`;
writeFileSync(join(exportDir, 'UPLOAD.md'), upload, 'utf8');
gebaut.push('UPLOAD.md');

console.log(`\n✓ Upload-Paket erstellt: ${target}/06-export/\n`);
gebaut.forEach((g) => console.log(`  ✓ ${g}`));

if (fehlt.length) {
  console.warn('\nNicht enthalten:');
  fehlt.forEach((f) => console.warn(`  ✗ ${f}`));
  console.warn('\nDas Paket ist unvollständig. Fehlende Teile ergänzen und erneut exportieren.');
  process.exit(1);
}

console.log('\n✓ FINAL_COMPLETE — 06-export enthält das geprüfte Reel, scene-01 als Cover und die universelle Reel-Caption.');
