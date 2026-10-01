#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, flowAutonomyFields} from './lib/flow-autonomy.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/apply-flow-five-pack-reference-v1.mjs <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const scenesRoot = resolve(root, '03-szenen');
const indexPath = resolve(scenesRoot, 'scene-index.json');
const centralPath = resolve(scenesRoot, 'alle-bildprompts.txt');
const coverPath = resolve(scenesRoot, '00-cover/cover.txt');

if (!existsSync(indexPath)) {
  console.error('scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];
const imageScenes = scenes.filter((scene) => scene?.type === 'image');
const animationScenes = scenes.filter((scene) => scene?.type === 'animation');
if (imageScenes.length === 0) {
  console.error('Keine Bildszenen gefunden.');
  process.exit(1);
}

index.googleFlow = {
  ...(index.googleFlow ?? {}),
  ...flowAutonomyFields(),
  generationMode: 'one-image-at-a-time',
  strictSequential: true,
  waitForCurrentImage: true,
  renameBeforeNext: true,
  qaBeforeNext: true,
  retrySameImageOnFailure: true,
  finalCollectionDirectory: '03-szenen/00-ALLE-BILDER-HIER-REIN/',
  distributeToSceneFolders: false,
  controlledStyleReferenceException: 'selected-cover-only',
  styleReferenceScope: ['material-feel', '3d-form-language', 'lighting', 'contrast', 'color-character', 'camera-feel', 'render-look'],
  styleReferenceCopiesTextForbidden: true,
  styleReferenceCopiesLayoutForbidden: true,
  styleReferenceCopiesSceneContentForbidden: true,
};

// Der allgemeine V9-Vertrag verbietet weiterhin unkontrollierte Bild-zu-Bild-
// Referenzen. Die einzige Ausnahme lebt explizit im googleFlow-Vertrag oben:
// nur das vom Nutzer gewählte Cover darf als enger Style-Anker dienen.
if (index.imageWorld) {
  index.imageWorld.styleReferenceStrategy = 'written-style-lock-only';
  index.imageWorld.referenceImageUse = 'forbidden';
  delete index.imageWorld.selectedCoverStyleReferenceOnly;
  delete index.imageWorld.referenceCopiesLayoutForbidden;
  delete index.imageWorld.referenceCopiesContentForbidden;
}
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

const sceneNumber = (scene) => String(scene.id ?? '').match(/scene-(\d+)/)?.[1] ?? '??';
const resolvePlanFile = (planFile) => planFile?.startsWith('03-szenen/')
  ? resolve(root, planFile)
  : resolve(scenesRoot, planFile ?? '');

const promptFor = (scene) => {
  const path = resolvePlanFile(scene.planFile);
  if (!path || !existsSync(path)) throw new Error(`${scene.id}: Bildprompt fehlt.`);
  return readFileSync(path, 'utf8').trim();
};

const firstImage = imageScenes[0];
const firstPrompt = promptFor(firstImage);
const firstFileName = firstImage.googleFlowFileName ?? `Bild ${sceneNumber(firstImage)} - Cover.png`;
const title = String(index.title ?? 'FinanzNeo').trim();
const customCover = existsSync(coverPath) ? readFileSync(coverPath, 'utf8').trim() : '';
const hasCustomCoverVariants = /COVER A[\s\S]*COVER B[\s\S]*COVER C/i.test(customCover);
const remaining = imageScenes.slice(1);
const blocks = [];
for (let i = 0; i < remaining.length; i += 5) blocks.push(remaining.slice(i, i + 5));

const coverVariant = (label, direction) => `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER-VARIANTE ${label}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFINALER KANDIDATEN-DATEINAME:\nCover-${label}.png\n\nCOVER-TEXT — MUSS SICHTBAR IM BILD STEHEN:\n${title}\n\nKOMPOSITIONSRICHTUNG:\n${direction}\n\nNutze denselben inhaltlichen Kern wie Szene ${sceneNumber(firstImage)}, aber gestalte daraus ein starkes Cover. Der Cover-Text ist die einzige große Textausnahme. Keine zusätzlichen Sätze oder UI-Elemente.\n`;

const coverPhase = hasCustomCoverVariants
  ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPHASE 0 — 3 COVER-VARIANTEN\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${customCover}`
  : [
      coverVariant('A', 'Großes zentrales Hero-Motiv, sehr klar, plakativ, hoher Kontrast, minimaler Aufbau.'),
      coverVariant('B', 'Asymmetrische Premium-Komposition mit starkem Größenkontrast und klarer Tiefenstaffelung; nicht wie Variante A arrangieren.'),
      coverVariant('C', 'Cinematischere räumliche Komposition mit deutlicher Vordergrund-Hintergrund-Tiefe und physischer Ursache-Wirkung; trotzdem sofort verständlich.'),
    ].join('\n');

const sceneBlock = (scene) => `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${sceneNumber(scene)} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSTYLE-REFERENZ:\nNutze ausschließlich das vom Nutzer ausgewählte Cover als kontrollierte VISUELLE STYLE-REFERENZ für Materialgefühl, 3D-Formensprache, Licht, Kontrast, Farbcharakter, Kameragefühl und Render-Sprache.\nNICHT übernehmen: Cover-Layout, Cover-Text, konkrete Cover-Objektanordnung oder Bildinhalt, sofern der Szenenprompt das nicht verlangt. Keine anderen Flow-Bilder als Referenz verwenden.\n\n${promptFor(scene)}\n`;

const animationReservations = animationScenes
  .map((scene) => `SZENE ${sceneNumber(scene)} – REMOTION-ANIMATION\nKEIN BILD ${sceneNumber(scene)} ERZEUGEN.`)
  .join('\n\n');

const blockText = blocks.map((block, blockIndex) => {
  const sceneList = block.map((scene) => sceneNumber(scene)).join(', ');
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n5ER-BLOCK ${blockIndex + 1}\nSZENEN: ${sceneList}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nWICHTIG: maximal 5 fertige Bilder in diesem Arbeitsblock, aber STRICT SINGLE JOB.\nErzeuge immer nur EIN Bild gleichzeitig. Nach jedem Bild: warten → prüfen → exakt umbenennen → erst dann das nächste Bild im selben Block.\nNach dem letzten Bild dieses Blocks STOPPEN und auf Nutzerfreigabe „weiter“ warten.\n\n${block.map(sceneBlock).join('\n')}`;
}).join('\n');

const output = `${AUTONOMY_BLOCK}\n${FLOW_AGENT_BLOCK}\nFINANZNEO — ZENTRALE GOOGLE-FLOW-PROMPTDATEI\nFLOW_WORKFLOW_ID: finanzneo-cover-reference-5pack-v1\n\nDIES IST KEIN BATCH-AUFTRAG.\nBLOCKGRÖSSE = 5\nMAX_CONCURRENT_GENERATIONS = 1\nCOVER_VARIANT_COUNT = 3\nCOVER-AUSWAHL ERFORDERLICH = JA\nSTYLE-REFERENZ = GEWÄHLTES COVER\n\nABLAUF — NICHT ÜBERSPRINGEN:\n1. Cover A einzeln erzeugen und vollständig abwarten.\n2. Cover B einzeln erzeugen und vollständig abwarten.\n3. Cover C einzeln erzeugen und vollständig abwarten.\n4. STOPP. Nutzer entscheidet A, B oder C. Vor dieser Entscheidung KEINE normalen Szenenbilder erzeugen.\n5. Gewählte Variante exakt umbenennen zu: ${firstFileName}\n6. Das gewählte Cover ist gleichzeitig finales Cover + Bild ${sceneNumber(firstImage)} + einzige erlaubte visuelle Style-Referenz für die restlichen Flow-Bilder.\n7. Danach 5ER-BLOCK 1 strikt sequenziell abarbeiten. STOPP und Nutzerfreigabe abwarten.\n8. Danach 5ER-BLOCK 2 usw.\n\nSTYLE-REFERENZ-REGEL:\nDas gewählte Cover ist die einzige kontrollierte Ausnahme vom allgemeinen Bildreferenz-Verbot. Es stabilisiert ausschließlich Materialgefühl, Licht, 3D-Geometriesprache, Kontrast, Farbcharakter, Kameragefühl und Render-Look.\nJede normale Szene bekommt eine FRISCHE KOMPOSITION passend zu ihrem eigenen Inhalt. Niemals Cover-Text oder Cover-Layout in normale Szenen kopieren. Niemals ein normales Szenenbild als nächste Referenz weiterreichen.\n\n${coverPhase}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nBASIS-PROMPT FÜR FINALES BILD 01\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${firstPrompt}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNACH COVER-AUSWAHL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${animationReservations}\n\n${blockText}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nErwartete finale Flow-Bilder inklusive gewähltem Cover/Bild ${sceneNumber(firstImage)}: ${imageScenes.map(sceneNumber).join(', ')}.\nKeine Bilder für Animationsszenen: ${animationScenes.map(sceneNumber).join(', ')}.\nNicht gewählte Cover-Kandidaten sind keine Produktionsassets.\nAlle finalen Bilder anschließend nach:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`;

writeFileSync(centralPath, output, 'utf8');
console.log(`✓ Flow 5er-Workflow synchronisiert: ${centralPath}`);
console.log('  3 Cover-Varianten → Nutzerwahl → gewähltes Cover als einziger Style-Anker.');
console.log(`  Danach ${blocks.length} Block/Blöcke mit maximal 5 Bildern, concurrency=1.`);
