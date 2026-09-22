#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {IMAGE_INBOX} from './lib/reel-contract.mjs';
import {
  IMAGE_VISION_QA_ID,
  IMAGE_VISION_QA_REQUESTS_DIR,
  IMAGE_VISION_QA_RESULTS_DIR,
  evaluateVisionQaResult,
  sha256Hex,
} from './lib/image-vision-qa.mjs';

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith('--'));
const sceneArgIndex = args.indexOf('--scene');
const sceneFilter = sceneArgIndex >= 0 ? args[sceneArgIndex + 1] : null;

if (!target) {
  console.error('Nutzung: npm run reel:image-vision:validate -- <Reel-Pfad> [--scene scene-03]');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
if (index.imageStorytellingContract?.hardeningId !== 'finanzneo-image-storytelling-v5-hardening-v1') {
  console.log('✓ Kein gehärtetes V5-Reel; Pixel-Vision-QA übersprungen.');
  process.exit(0);
}

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
const selected = sceneFilter ? imageScenes.filter((scene) => scene.id === sceneFilter) : imageScenes;
if (sceneFilter && selected.length === 0) {
  console.error(`IMAGE-Szene nicht gefunden: ${sceneFilter}`);
  process.exit(1);
}

const errors = [];
for (const scene of selected) {
  const imageFile = scene.googleFlowFileName;
  if (typeof imageFile !== 'string') {
    errors.push(`${scene.id}: googleFlowFileName fehlt.`);
    continue;
  }

  const imagePath = resolve(root, IMAGE_INBOX, imageFile);
  const requestPath = resolve(root, IMAGE_VISION_QA_REQUESTS_DIR, `${scene.id}.json`);
  const resultPath = resolve(root, IMAGE_VISION_QA_RESULTS_DIR, `${scene.id}.json`);
  if (!existsSync(imagePath)) {
    errors.push(`${scene.id}: erzeugtes Bild fehlt: ${imageFile}`);
    continue;
  }
  if (!existsSync(requestPath)) {
    errors.push(`${scene.id}: Vision-QA-Request fehlt. Zuerst reel:image-vision:prepare ausführen.`);
    continue;
  }
  if (!existsSync(resultPath)) {
    errors.push(`${scene.id}: Vision-QA-Ergebnis fehlt. Multimodale Pixelprüfung erforderlich.`);
    continue;
  }

  let request;
  let result;
  try {
    request = JSON.parse(readFileSync(requestPath, 'utf8'));
    result = JSON.parse(readFileSync(resultPath, 'utf8'));
  } catch {
    errors.push(`${scene.id}: Vision-QA JSON ist ungültig.`);
    continue;
  }

  const currentHash = await sha256Hex(readFileSync(imagePath));
  if (request.contractId !== IMAGE_VISION_QA_ID) errors.push(`${scene.id}: Request hat falschen contractId.`);
  if (request.imageSha256 !== currentHash) errors.push(`${scene.id}: Request ist veraltet; Bildpixel haben sich geändert. Neu vorbereiten.`);
  if (result.contractId !== IMAGE_VISION_QA_ID) errors.push(`${scene.id}: Ergebnis hat falschen contractId.`);
  if (result.sceneId !== scene.id) errors.push(`${scene.id}: Ergebnis gehört zu ${result.sceneId ?? 'unbekannt'}.`);
  if (result.imageFile !== imageFile) errors.push(`${scene.id}: Ergebnis referenziert falsche Bilddatei.`);
  if (result.imageSha256 !== currentHash) errors.push(`${scene.id}: PASS/FAIL gehört nicht zu den aktuellen Pixeln. Aktueller Hash: ${currentHash}.`);

  const expectedComparisonHashes = (request.compareAgainst ?? []).map((item) => item.imageSha256).sort();
  const reportedComparisonHashes = Array.isArray(result.comparedImageSha256) ? [...result.comparedImageSha256].sort() : [];
  if (expectedComparisonHashes.length > 0 && JSON.stringify(reportedComparisonHashes) !== JSON.stringify(expectedComparisonHashes)) {
    errors.push(`${scene.id}: Sequenzvergleich ist unvollständig oder bezieht sich auf veraltete Nachbarbilder.`);
  }

  const expectedLabelBudget = Number(request.expected?.labelBudget ?? 0);
  const observedLabelCount = Number(result.observed?.labelCount);
  if (!Number.isInteger(observedLabelCount) || observedLabelCount < 0) {
    errors.push(`${scene.id}: observed.labelCount muss eine nichtnegative Ganzzahl sein.`);
  } else if (observedLabelCount > expectedLabelBudget) {
    errors.push(`${scene.id}: ${observedLabelCount} sichtbare Labels überschreiten Budget ${expectedLabelBudget}.`);
  }

  for (const key of ['cameraAngle', 'shotScale', 'locationClass', 'mainSubjectClass', 'dominantAction']) {
    if (String(result.observed?.[key] ?? '').trim().length < 2) errors.push(`${scene.id}: observed.${key} fehlt.`);
  }

  const isCover = request.isCover === true;
  const evaluation = evaluateVisionQaResult(result, {isCover});
  for (const error of evaluation.errors) errors.push(`${scene.id}: ${error}`);
}

if (errors.length > 0) {
  console.error('\n✗ PIXEL-VISION-QA NICHT BESTANDEN:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  if (sceneFilter) console.error(`\nREGENERATE_SAME_SCENE: ${sceneFilter}`);
  else console.error('\nNur fehlgeschlagene IMAGE-Szenen neu erzeugen; ihre Bildnummer bleibt unverändert. Spätere Flow-Schritte bleiben bis PASS gesperrt.');
  process.exit(1);
}

console.log(`\n✓ PIXEL-VISION-QA PASS: ${selected.length} IMAGE-Szene${selected.length === 1 ? '' : 'n'}`);
console.log('✓ Jeder PASS gehört zum SHA-256-Hash der aktuellen echten Bildpixel.');
console.log('✓ Plan-Match, Kamera, Handlung, Hook, Visual Interest, V9-Welt, Klarheit und Sequenz-Neuheit erfüllen die Mindestwerte.');
