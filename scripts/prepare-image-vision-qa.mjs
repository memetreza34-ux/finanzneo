#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {IMAGE_INBOX} from './lib/reel-contract.mjs';
import {
  IMAGE_VISION_QA_ID,
  IMAGE_VISION_QA_REQUESTS_DIR,
  IMAGE_VISION_QA_RESULTS_DIR,
  expectedVisionQaForScene,
  sha256Hex,
  dHashFromGray9x8,
  hammingDistanceHex,
  luminanceStats,
  evaluateObjectivePixelProbe,
} from './lib/image-vision-qa.mjs';
import {IMAGE_CREATIVE_CONCEPT_ID} from './lib/image-creative-concept-v1.mjs';

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith('--'));
const sceneArgIndex = args.indexOf('--scene');
const sceneFilter = sceneArgIndex >= 0 ? args[sceneArgIndex + 1] : null;

if (!target) {
  console.error('Nutzung: npm run reel:image-vision:prepare -- <Reel-Pfad> [--scene scene-03]');
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
const creativeConceptRequired = index.imageStorytellingContract?.creativeConceptId === IMAGE_CREATIVE_CONCEPT_ID;

const imageScenes = (Array.isArray(index.scenes) ? index.scenes : []).filter((scene) => scene?.type === 'image');
const selected = sceneFilter ? imageScenes.filter((scene) => scene.id === sceneFilter) : imageScenes;
if (sceneFilter && selected.length === 0) {
  console.error(`IMAGE-Szene nicht gefunden: ${sceneFilter}`);
  process.exit(1);
}

const requestDir = resolve(root, IMAGE_VISION_QA_REQUESTS_DIR);
const resultDir = resolve(root, IMAGE_VISION_QA_RESULTS_DIR);
mkdirSync(requestDir, {recursive: true});
mkdirSync(resultDir, {recursive: true});

const runGrayProbe = (imagePath, scale) => {
  const probe = spawnSync('ffmpeg', [
    '-v', 'error', '-i', imagePath,
    '-vf', `scale=${scale}:flags=area`,
    '-frames:v', '1',
    '-f', 'rawvideo', '-pix_fmt', 'gray', 'pipe:1',
  ], {encoding: null, maxBuffer: 4 * 1024 * 1024});
  if (probe.error?.code === 'ENOENT') throw new Error('ffmpeg fehlt für die objektive Pixel-QA.');
  if (probe.status !== 0) throw new Error(`ffmpeg konnte ${imagePath} nicht für die Pixel-QA lesen.`);
  return probe.stdout;
};

const inspectPixelFingerprint = (imagePath) => {
  const hashBytes = runGrayProbe(imagePath, '9:8');
  const lumaBytes = runGrayProbe(imagePath, '32:32');
  if (hashBytes.length !== 72 || lumaBytes.length !== 1024) throw new Error(`Unerwartete Pixelprobe für ${imagePath}.`);
  return {
    dHash: dHashFromGray9x8(hashBytes),
    luminance: luminanceStats(lumaBytes),
  };
};

const existingImages = [];
for (const scene of imageScenes) {
  if (typeof scene.googleFlowFileName !== 'string') continue;
  const imagePath = resolve(root, IMAGE_INBOX, scene.googleFlowFileName);
  if (!existsSync(imagePath)) continue;
  let pixelFingerprint;
  try {
    pixelFingerprint = inspectPixelFingerprint(imagePath);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  existingImages.push({
    sceneId: scene.id,
    imageFile: scene.googleFlowFileName,
    imageSha256: await sha256Hex(readFileSync(imagePath)),
    ...pixelFingerprint,
  });
}

let count = 0;
const objectiveFailures = [];
for (const scene of selected) {
  if (typeof scene.googleFlowFileName !== 'string') {
    console.error(`${scene.id}: googleFlowFileName fehlt.`);
    process.exit(1);
  }
  const imagePath = resolve(root, IMAGE_INBOX, scene.googleFlowFileName);
  if (!existsSync(imagePath)) {
    console.error(`${scene.id}: erzeugtes Bild fehlt: ${scene.googleFlowFileName}`);
    process.exit(1);
  }

  const current = existingImages.find((item) => item.sceneId === scene.id);
  if (!current) {
    console.error(`${scene.id}: Pixel-Fingerprint konnte nicht erstellt werden.`);
    process.exit(1);
  }
  let nearestDHashDistance = null;
  let nearestSceneId = null;
  for (const compared of existingImages) {
    if (compared.sceneId === scene.id) continue;
    const distance = hammingDistanceHex(current.dHash, compared.dHash);
    if (distance !== null && (nearestDHashDistance === null || distance < nearestDHashDistance)) {
      nearestDHashDistance = distance;
      nearestSceneId = compared.sceneId;
    }
  }
  const objectivePixelQa = evaluateObjectivePixelProbe({
    luminance: current.luminance,
    nearestDHashDistance,
  });
  if (objectivePixelQa.status !== 'PASS') objectiveFailures.push(`${scene.id}: ${objectivePixelQa.blockers.join(' | ')}`);

  const imageSha256 = current.imageSha256;
  const isCover = index.cover?.sourceSceneId === scene.id || scene.id === 'scene-01';
  const expected = expectedVisionQaForScene(scene, {isCover, creativeConceptRequired});
  const creativeReview = creativeConceptRequired ? [
    'Creative Concept: judge whether the chosen visual idea is genuinely interesting for this exact voice beat, not merely clean or technically correct.',
    'A strong single iconic object is valid. Do not penalize minimalism, empty breathing room, absence of people or absence of action when that is the planned concept.',
    'Multiple objects, real environments, character moments, metaphors, thought-visualizations and controlled fantasy are also valid when they strengthen the beat.',
    'Check that the actual pixels trigger the planned VIEWER_THOUGHT and contain the planned ENTERTAINMENT_HOOK and MEMORABILITY_HOOK.',
    'Fantasy must remain immediately understandable through the REALITY_ANCHOR. Reject random spectacle, confusing symbolism or decorative fantasy without finance meaning.',
    'Reject boring literal restatements, generic explanatory prop layouts and unnecessary clutter when a stronger simpler concept was planned.',
  ] : [];

  const request = {
    contractId: IMAGE_VISION_QA_ID,
    evaluatorModeRequired: 'multimodal-pixel-review',
    sceneId: scene.id,
    imageFile: scene.googleFlowFileName,
    imageRelativePath: `${IMAGE_INBOX}/${scene.googleFlowFileName}`,
    imageSha256,
    isCover,
    objectivePixelQa: {
      dHash: current.dHash,
      luminance: current.luminance,
      nearestDHashDistance,
      nearestSceneId,
      ...objectivePixelQa,
    },
    ...expected,
    compareAgainst: existingImages
      .filter((item) => item.sceneId !== scene.id)
      .map(({sceneId, imageFile, imageSha256, dHash}) => ({sceneId, imageFile, imageSha256, dHash})),
    requiredReview: [
      'Inspect the actual image pixels, not only prompt text or metadata.',
      'Check exact story beat, camera, shot scale, location and main subject against expected.',
      'Check V9 world: stylized 3D, deep black, non-photorealistic, clean subject separation.',
      'Check whether the image is visually interesting rather than generic desk/catalog/finance-icon staging.',
      'Compare against the other generated images and score sequence novelty.',
      'Treat objectivePixelQa warnings as an explicit reason to scrutinize visual similarity and unusably empty output.',
      'Count visible labels and reject headlines, sentences or text beyond the planned label budget.',
      ...creativeReview,
      'If any hard requirement fails, verdict must be REGENERATE and the same scene/file must be regenerated.',
    ],
    resultSchema: {
      contractId: IMAGE_VISION_QA_ID,
      evaluatorMode: 'multimodal-pixel-review',
      sceneId: scene.id,
      imageFile: scene.googleFlowFileName,
      imageSha256,
      comparedImageSha256: existingImages.filter((item) => item.sceneId !== scene.id).map((item) => item.imageSha256),
      scores: {
        planAlignment: '0-100',
        cameraCompliance: '0-100',
        actionReadability: '0-100; may be low without penalty for action-optional creative concepts',
        hookStrength: '0-100',
        visualInterest: '0-100',
        worldConsistency: '0-100',
        compositionClarity: '0-100',
        sequenceNovelty: '0-100',
        ...(creativeConceptRequired ? {
          conceptClarity: '0-100',
          entertainmentValue: '0-100',
          memorability: '0-100',
          viewerThoughtMatch: '0-100',
        } : {}),
      },
      flags: {
        photorealistic: false,
        genericFinanceIconMain: false,
        staticCatalogLike: false,
        wrongBackground: false,
        headlineOrSentenceInsideImage: false,
        labelBudgetExceeded: false,
        sceneMismatch: false,
        genericDeskScene: false,
        deadSpaceDominant: false,
        ...(creativeConceptRequired ? {
          boringLiteral: false,
          decorativeWithoutMeaning: false,
          fantasyConfusing: false,
          overexplainedPropLayout: false,
        } : {}),
      },
      observed: {
        cameraAngle: 'describe observed camera angle',
        shotScale: 'describe observed shot scale',
        locationClass: 'describe observed location',
        mainSubjectClass: 'describe observed main subject',
        dominantAction: 'describe visible action or explicitly state none/minimal by concept',
        labelCount: 0,
        ...(creativeConceptRequired ? {
          conceptRead: 'describe the visual concept visible in the pixels',
          viewerThoughtRead: 'state what a viewer is likely to think or feel immediately',
          memorableElement: 'name the one visual element most likely to be remembered',
          fantasyReadability: 'describe why fantasy/metaphor is clear, or none if fantasy level is 0',
        } : {}),
      },
      evidence: [
        'Concrete visible observation 1',
        'Concrete visible observation 2',
        'Concrete visible observation 3',
      ],
      verdict: 'PASS or REGENERATE',
      regenerationInstruction: 'none on PASS; concrete visual correction on REGENERATE',
    },
    resultFile: `03-szenen/vision-qa/results/${scene.id}.json`,
  };
  writeFileSync(resolve(requestDir, `${scene.id}.json`), `${JSON.stringify(request, null, 2)}\n`, 'utf8');
  count += 1;
}

console.log(`✓ ${count} Pixel-Vision-QA-Request${count === 1 ? '' : 's'} vorbereitet.`);
console.log('✓ Jeder Request ist an den SHA-256-Hash des tatsächlich erzeugten Bildes gebunden.');
console.log('✓ Objektive Pixel-QA prüft zusätzlich Near-Duplicates und nahezu leere/schwarze Fehlausgaben.');
if (creativeConceptRequired) console.log('✓ Creative-Concept-QA prüft zusätzlich Concept Clarity, Entertainment Value, Memorability und Viewer-Thought-Match.');
if (objectiveFailures.length > 0) {
  console.error('\n✗ OBJEKTIVE PIXEL-QA NICHT BESTANDEN:\n');
  objectiveFailures.forEach((error) => console.error(`- ${error}`));
  if (sceneFilter) console.error(`\nREGENERATE_SAME_SCENE: ${sceneFilter}`);
  else console.error('\nNur fehlgeschlagene IMAGE-Szenen neu erzeugen; ihre Bildnummer bleibt unverändert.');
  process.exit(1);
}
console.log('✓ Ein multimodaler Evaluator muss jetzt die echten Pixel prüfen und das passende results/<scene>.json schreiben.');
