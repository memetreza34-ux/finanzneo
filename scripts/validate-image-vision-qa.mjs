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
import {COVER_ANCHOR_FLOW_ID} from './lib/cover-anchor-flow-v1.mjs';

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
const coverAnchorRequired = index.coverAnchorFlow?.id === COVER_ANCHOR_FLOW_ID;
const anchorSceneId = coverAnchorRequired ? String(index.coverAnchorFlow.sourceSceneId ?? 'scene-01') : null;

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
const imageSceneById = new Map(imageScenes.map((scene) => [scene.id, scene]));
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

  const objective = request.objectivePixelQa;
  if (!objective || objective.status !== 'PASS') {
    errors.push(`${scene.id}: objektive Pixel-QA ist nicht PASS: ${(objective?.blockers ?? ['fehlender objektiver Pixel-Report']).join(' | ')}`);
  }
  if (typeof objective?.dHash !== 'string' || !/^[0-9a-f]{16}$/i.test(objective.dHash)) {
    errors.push(`${scene.id}: objectivePixelQa.dHash fehlt oder ist ungültig.`);
  }
  for (const key of ['mean', 'stddev', 'nonBlackRatio']) {
    if (!Number.isFinite(Number(objective?.luminance?.[key]))) errors.push(`${scene.id}: objectivePixelQa.luminance.${key} fehlt.`);
  }
  if (!Array.isArray(objective?.blockers) || !Array.isArray(objective?.warnings)) {
    errors.push(`${scene.id}: objectivePixelQa blockers/warnings müssen Arrays sein.`);
  }

  const comparisons = Array.isArray(request.compareAgainst) ? request.compareAgainst : [];
  for (const compared of comparisons) {
    const comparedScene = imageSceneById.get(compared.sceneId);
    if (!comparedScene || comparedScene.googleFlowFileName !== compared.imageFile) {
      errors.push(`${scene.id}: Vergleichsreferenz ${compared.sceneId ?? 'unbekannt'} passt nicht mehr zum scene-index.`);
      continue;
    }
    const comparedPath = resolve(root, IMAGE_INBOX, compared.imageFile);
    if (!existsSync(comparedPath)) {
      errors.push(`${scene.id}: verglichenes Bild fehlt inzwischen: ${compared.imageFile}.`);
      continue;
    }
    const currentComparedHash = await sha256Hex(readFileSync(comparedPath));
    if (currentComparedHash !== compared.imageSha256) {
      errors.push(`${scene.id}: Sequenzvergleich ist veraltet, weil ${compared.sceneId} inzwischen andere Pixel besitzt. Request und Vision-QA neu erstellen.`);
    }
    if (typeof compared.dHash !== 'string' || !/^[0-9a-f]{16}$/i.test(compared.dHash)) {
      errors.push(`${scene.id}: Vergleichsreferenz ${compared.sceneId} hat keinen gültigen dHash.`);
    }
  }

  const expectedComparisonHashes = comparisons.map((item) => item.imageSha256).sort();
  const reportedComparisonHashes = Array.isArray(result.comparedImageSha256) ? [...result.comparedImageSha256].sort() : [];
  if (JSON.stringify(reportedComparisonHashes) !== JSON.stringify(expectedComparisonHashes)) {
    errors.push(`${scene.id}: Sequenzvergleich ist unvollständig oder bezieht sich auf andere Bildhashes als der QA-Request.`);
  }

  const anchorRequiredForScene = coverAnchorRequired && scene.id !== anchorSceneId;
  if (anchorRequiredForScene) {
    const anchorReference = request.anchorReference;
    const anchorScene = imageSceneById.get(anchorSceneId);
    const expectedAnchorFile = anchorScene?.googleFlowFileName;
    if (anchorReference?.contractId !== COVER_ANCHOR_FLOW_ID) errors.push(`${scene.id}: anchorReference.contractId fehlt/falsch.`);
    if (anchorReference?.sourceSceneId !== anchorSceneId) errors.push(`${scene.id}: anchorReference.sourceSceneId muss ${anchorSceneId} sein.`);
    if (anchorReference?.imageFile !== expectedAnchorFile) errors.push(`${scene.id}: anchorReference.imageFile muss die aktuelle scene-01-Datei sein.`);
    if (expectedAnchorFile) {
      const anchorPath = resolve(root, IMAGE_INBOX, expectedAnchorFile);
      if (!existsSync(anchorPath)) errors.push(`${scene.id}: Anchor-Datei fehlt: ${expectedAnchorFile}.`);
      else {
        const currentAnchorHash = await sha256Hex(readFileSync(anchorPath));
        if (anchorReference?.imageSha256 !== currentAnchorHash) errors.push(`${scene.id}: Anchor-Referenz ist veraltet; scene-01-Pixel haben sich geändert. QA neu vorbereiten.`);
      }
    }
    if (String(result.observed?.anchorMatchNotes ?? '').trim().length < 12) errors.push(`${scene.id}: observed.anchorMatchNotes fehlt.`);
  } else if (request.anchorReference !== null && request.anchorReference !== undefined) {
    errors.push(`${scene.id}: Master/Cover darf keine externe anchorReference benötigen.`);
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

  const creativeConceptRequired = request.expected?.creativeConceptRequired === true;
  if (creativeConceptRequired) {
    for (const key of ['conceptRead', 'viewerThoughtRead', 'memorableElement', 'fantasyReadability']) {
      if (String(result.observed?.[key] ?? '').trim().length < 2) errors.push(`${scene.id}: Creative Concept observed.${key} fehlt.`);
    }
  }

  const isCover = request.isCover === true;
  const conceptMode = String(request.expected?.conceptMode ?? '');
  const evaluation = evaluateVisionQaResult(result, {isCover, creativeConceptRequired, conceptMode, anchorRequired: anchorRequiredForScene});
  for (const error of evaluation.errors) errors.push(`${scene.id}: ${error}`);
}

if (errors.length > 0) {
  console.error('\n✗ PIXEL-VISION-QA NICHT BESTANDEN:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  if (sceneFilter) console.error(`\nREGENERATE_SAME_SCENE: ${sceneFilter}`);
  else console.error('\nNur fehlgeschlagene IMAGE-Szenen neu erzeugen oder veraltete QA erneut ausführen; ihre Bildnummer bleibt unverändert. Spätere Flow-Schritte bleiben bis PASS gesperrt.');
  process.exit(1);
}

console.log(`\n✓ PIXEL-VISION-QA PASS: ${selected.length} IMAGE-Szene${selected.length === 1 ? '' : 'n'}`);
console.log('✓ Jeder PASS gehört zum SHA-256-Hash der aktuellen echten Bildpixel.');
console.log('✓ Objektive Pixel-QA hat Near-Duplicate-/Leerbild-Gates bestanden.');
console.log('✓ Auch alle Bildhashes, auf denen der Sequenz-/Novelty-Vergleich basiert, sind noch aktuell.');
console.log('✓ Plan-Match, Kamera, Hook, Visual Interest, V9-Welt, Klarheit und Sequenz-Neuheit erfüllen die Mindestwerte.');
console.log('✓ Bei Creative-Concept-Reels sind zusätzlich Concept Clarity, Entertainment Value, Memorability und Viewer-Thought-Match geprüft.');
if (coverAnchorRequired) console.log('✓ Folge-Bilder sind zusätzlich gegen die aktuellen echten Pixel des scene-01-Cover-Anchors geprüft.');
