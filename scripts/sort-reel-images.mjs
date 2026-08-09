#!/usr/bin/env node
import {existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync} from 'node:fs';
import {extname, basename, resolve} from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const targetArg = args.find((arg) => !arg.startsWith('--'));

if (!targetArg) {
  console.error('Nutzung: npm run reel:sort-images -- reels/<Woche>/<Tag>/<Reel> [--dry-run]');
  process.exit(1);
}

const root = resolve(targetArg);
const sceneIndexPath = resolve(root, '03-szenen/scene-index.json');
const inbox = resolve(root, '03-szenen/BILDER-EINGANG');
const inboxReadme = resolve(inbox, 'README.md');
const supported = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

if (!existsSync(root)) {
  console.error(`Reel-Ordner nicht gefunden: ${root}`);
  process.exit(1);
}
if (!existsSync(sceneIndexPath)) {
  console.error(`scene-index.json fehlt: ${sceneIndexPath}`);
  process.exit(1);
}

mkdirSync(inbox, {recursive: true});
if (!existsSync(inboxReadme)) {
  writeFileSync(
    inboxReadme,
    `# Bilder-Eingang\n\nLege hier alle finalen Bilder gesammelt ab. Die Nummer im Dateinamen bestimmt das Ziel.\n\n- Bild 00 → Cover\n- Bild 01 → Szene 01\n- Bild 02 → Szene 02\n- usw.\n\nAkzeptierte Beispiele: \`Bild 00.png\`, \`bild01.jpg\`, \`image_02.webp\`, \`03.png\`.\n\nDanach ausführen:\n\n\`npm run reel:sort-images -- <REEL-ORDNER>\`\n\nBestehende Zielbilder werden niemals überschrieben. Bilder für Remotion-Szenen werden abgelehnt.\n`,
    'utf8',
  );
}

const index = JSON.parse(readFileSync(sceneIndexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const sceneByNumber = new Map(
  scenes.map((scene, position) => {
    const idMatch = String(scene.id ?? '').match(/scene-(\d{2})$/i);
    const number = idMatch ? Number(idMatch[1]) : position + 1;
    return [number, scene];
  }),
);

const imageFiles = readdirSync(inbox)
  .filter((name) => !name.startsWith('.'))
  .filter((name) => supported.has(extname(name).toLowerCase()));

if (imageFiles.length === 0) {
  console.log(`✓ Bilder-Eingang bereit: ${inbox}`);
  console.log('  Noch keine einsortierbaren Bilder vorhanden.');
  process.exit(0);
}

const parseNumber = (name) => {
  const stem = basename(name, extname(name)).trim().toLowerCase();
  const match = stem.match(/^(?:(?:bild|image|img)[\s._-]*)?0*(\d{1,2})(?:[\s._-].*)?$/i);
  return match ? Number(match[1]) : null;
};

const errors = [];
const planned = [];
const usedNumbers = new Map();

for (const file of imageFiles) {
  const number = parseNumber(file);
  if (number === null) {
    errors.push(`${file}: keine eindeutige Bildnummer erkannt. Beispiel: "Bild 03.png".`);
    continue;
  }

  if (usedNumbers.has(number)) {
    errors.push(`${file}: Nummer ${String(number).padStart(2, '0')} ist doppelt; bereits belegt durch ${usedNumbers.get(number)}.`);
    continue;
  }
  usedNumbers.set(number, file);

  const extension = extname(file).toLowerCase();
  const source = resolve(inbox, file);

  if (number === 0) {
    const destinationDir = resolve(root, '00-cover');
    mkdirSync(destinationDir, {recursive: true});
    const existing = readdirSync(destinationDir).filter((name) => supported.has(extname(name).toLowerCase()));
    if (existing.length > 0) {
      errors.push(`${file}: Cover-Ziel enthält bereits ein Bild (${existing.join(', ')}). Es wird nichts überschrieben.`);
      continue;
    }
    planned.push({number, file, source, destination: resolve(destinationDir, `cover${extension}`), label: 'Cover'});
    continue;
  }

  const scene = sceneByNumber.get(number);
  if (!scene) {
    errors.push(`${file}: Szene ${String(number).padStart(2, '0')} existiert laut scene-index.json nicht.`);
    continue;
  }
  if (scene.type !== 'image') {
    errors.push(`${file}: Szene ${String(number).padStart(2, '0')} ist eine Remotion-Animation. Dort darf kein finales Bild einsortiert werden.`);
    continue;
  }

  const sceneId = String(scene.id ?? `scene-${String(number).padStart(2, '0')}`);
  const destinationDir = resolve(root, '03-szenen/EINZELNE-SZENEN', sceneId);
  if (!existsSync(destinationDir)) {
    errors.push(`${file}: Zielordner fehlt: ${destinationDir}`);
    continue;
  }

  const existing = readdirSync(destinationDir).filter((name) => supported.has(extname(name).toLowerCase()));
  if (existing.length > 0) {
    errors.push(`${file}: ${sceneId} enthält bereits ein finales Bild (${existing.join(', ')}). Es wird nichts überschrieben.`);
    continue;
  }

  planned.push({
    number,
    file,
    source,
    destination: resolve(destinationDir, `bild-${String(number).padStart(2, '0')}${extension}`),
    label: sceneId,
  });
}

if (errors.length > 0) {
  console.error('\nBilder wurden NICHT verschoben. Erst diese Punkte korrigieren:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(dryRun ? '\nTrockenlauf — geplante Zuordnung:' : '\nBilder werden einsortiert:');
for (const item of planned.sort((a, b) => a.number - b.number)) {
  console.log(`- ${item.file} → ${item.label}`);
  if (!dryRun) renameSync(item.source, item.destination);
}

if (dryRun) {
  console.log('\n✓ Trockenlauf erfolgreich. Keine Datei wurde verändert.');
} else {
  console.log(`\n✓ ${planned.length} Bild${planned.length === 1 ? '' : 'er'} sicher einsortiert.`);
  console.log('  Der Bilder-Eingang enthält danach nur noch nicht unterstützte/administrative Dateien.');
}
