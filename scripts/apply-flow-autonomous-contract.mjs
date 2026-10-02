#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  FLOW_COVER_CONCURRENCY,
  FLOW_COVER_CONCURRENCY_MARKER,
  FLOW_COVER_WORKFLOW_ID,
  FLOW_COVER_WORKFLOW_MARKER,
  FLOW_IMAGE_BLOCK_SIZE,
  FLOW_IMAGE_BLOCK_SIZE_MARKER,
  FLOW_SCENE_CONCURRENCY_MARKER,
  IMAGE_INBOX,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK, flowAutonomyFields, modernizeLegacyWaitWording} from './lib/flow-autonomy.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/apply-flow-autonomous-contract.mjs reels/<Woche>/<Tag>/<Reel>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('reels'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein Reel-Projekt unter reels/ sein.');
  process.exit(1);
}

const allPromptsPath = resolve(root, ALL_PROMPTS);
const indexPath = resolve(root, SCENE_INDEX);
const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');
if (!existsSync(allPromptsPath) || !existsSync(indexPath) || !existsSync(coverPath)) {
  console.error('Reel muss vor dem Flow-Lock bereits vollständig angelegt sein.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const imageScenes = (index.scenes ?? []).filter((scene) => scene?.type === 'image');
if (imageScenes.length === 0) {
  console.error('Mindestens eine IMAGE-Szene ist für den Flow-Workflow erforderlich.');
  process.exit(1);
}

const coverScene = imageScenes.find((scene) => scene.id === 'scene-01') ?? imageScenes[0];
const fileNameFor = (scene) => {
  if (scene.id === coverScene.id && index.cover?.googleFlowFileName) return index.cover.googleFlowFileName;
  return scene.googleFlowFileName ?? null;
};
const missingNames = imageScenes.filter((scene) => !fileNameFor(scene));
if (missingNames.length) {
  console.error(`Google-Flow-Dateiname fehlt für: ${missingNames.map((scene) => scene.id).join(', ')}`);
  process.exit(1);
}

const finalDirectory = `${IMAGE_INBOX}/`;
const coverFinalFileName = fileNameFor(coverScene);
const remainingScenes = imageScenes.filter((scene) => scene.id !== coverScene.id);
const imageBlocks = [];
for (let i = 0; i < remainingScenes.length; i += FLOW_IMAGE_BLOCK_SIZE) {
  const chunk = remainingScenes.slice(i, i + FLOW_IMAGE_BLOCK_SIZE);
  imageBlocks.push({
    block: imageBlocks.length + 1,
    sceneIds: chunk.map((scene) => scene.id),
    finalFiles: chunk.map(fileNameFor),
  });
}
const expectedFinalFiles = imageScenes.map(fileNameFor);

const blockPlanLines = imageBlocks.length
  ? imageBlocks.flatMap((block) => [
      `5ER-BLOCK ${block.block}:`,
      ...block.sceneIds.map((sceneId, indexInBlock) => `- ${sceneId} -> ${block.finalFiles[indexInBlock]}`),
    ])
  : ['5ER-BLOCKPLAN: Keine weiteren IMAGE-Szenen nach dem gewählten Cover.'];

const coverWorkflowBlock = [
  'FLOW_COVER_5PACK_BEGIN',
  FLOW_COVER_WORKFLOW_MARKER,
  FLOW_COVER_CONCURRENCY_MARKER,
  FLOW_SCENE_CONCURRENCY_MARKER,
  FLOW_IMAGE_BLOCK_SIZE_MARKER,
  `REEL_TITLE: ${index.title ?? 'Reel'}`,
  `FINAL_IMAGE_DIRECTORY: ${finalDirectory}`,
  `EXPECTED_FINAL_IMAGE_COUNT: ${imageScenes.length}`,
  '',
  'COVER-GATE — IMMER ZUERST:',
  '1. Erzeuge exakt DREI unterschiedliche Cover-Kandidaten: COVER A, COVER B und COVER C.',
  `2. Cover A/B/C werden ALS DREI GETRENNTE EINZELBILD-JOBS GLEICHZEITIG gestartet. COVER_CONCURRENCY = ${FLOW_COVER_CONCURRENCY}. Kein Kontaktbogen, keine Collage, kein gemeinsamer Multi-Image-Request.`,
  '3. COVER-TEXT IST IMMER PFLICHT UND MUSS DEN VIDEOINHALT DIREKT VERDICHTEN: maximal 2 Zeilen, ideal 2–5 Wörter. Keine langen Sätze, kein generischer Clickbait ohne Inhaltsbezug, keine erfundenen Zahlen/Fakten.',
  '4. Alle drei Cover verwenden DIREKT die FinanzNeo-V9-Bildwelt. Sie dürfen unterschiedlich komponiert sein, aber keines dient als Style-Vorlage für ein anderes.',
  '5. Die drei Cover müssen sichtbar verschieden sein:',
  '   - COVER A: starke Hero-Zahl oder dominantes Hero-Objekt, sehr direkte Aussage.',
  '   - COVER B: klare Gegenüberstellung / Kontrast / Vorher-nachher-Logik.',
  '   - COVER C: konkrete Objekt-Story oder verständliche visuelle Metapher mit räumlicher Tiefe.',
  '6. Temporäre Namen: Cover-A.png, Cover-B.png, Cover-C.png. Diese Kandidaten gehören NICHT in den finalen Bildordner.',
  '7. Wenn alle drei Kandidaten QA bestanden haben: STOPP und frage ausschließlich: A, B oder C?',
  '8. Erst nach der Nutzerwahl darf die Szenenbild-Produktion beginnen.',
  `9. Das gewählte Cover sofort exakt umbenennen in: ${coverFinalFileName}`,
  `10. Das gewählte Cover in ${finalDirectory} legen. Es ist zugleich finaler Cover-Asset und ${coverScene.id}; ${coverScene.id} NICHT erneut generieren.`,
  '',
  'STYLE-AUTORITÄT NACH DER COVER-WAHL:',
  '- Das gewählte Cover ist KEINE Style-Referenz und darf für spätere Bilder NICHT als Bildreferenz verwendet werden.',
  '- Alle weiteren Google-Flow-Bilder verwenden direkt die schriftlich definierte FinanzNeo-V9-Bildwelt als einzige Style-Autorität.',
  '- Kein späteres Szenenbild darf zum Style-Anker werden. Keine Bild-zu-Bild-Style-Referenz im kanonischen Flow.',
  '- V9 fest: stylized 3D / hochwertige FinanzNeo-Illustrationssprache, Deep Black, Premium-Licht, hochwertige Materialien, starke Tiefe, Emerald/Gold/Red-Orange gemäß Bedeutung, kein Fotorealismus, kein Corporate-/PowerPoint-Look.',
  '',
  `5ER-SCHRITTE — NACH DER COVER-WAHL, MAXIMAL ${FLOW_IMAGE_BLOCK_SIZE} BILDER PRO ORGANISATORISCHEM BLOCK:`,
  ...blockPlanLines,
  '',
  'WICHTIG FÜR JEDEN 5ER-BLOCK:',
  '- Ein 5er-Block bedeutet NICHT fünf parallele Generierungen. Ab hier exakt EIN Szenenbildjob gleichzeitig.',
  '- Bild erzeugen -> Ergebnis vollständig zurück -> SOFORT exakt umbenennen -> in finalen Bildordner legen -> QA -> erst dann nächstes Bild.',
  '- Nach maximal fünf erfolgreichen Bildern automatisch mit dem nächsten Block fortfahren. Keine weitere Nutzerfreigabe und kein "weiter".',
  '',
  'FINAL INVENTORY QA — PFLICHT NACH DEM LETZTEN BILD:',
  `- Prüfe exakt den Ordner ${finalDirectory}`,
  `- Erwartet werden genau ${imageScenes.length} finale Flow-Bilder.`,
  '- Prüfe: jede erwartete Datei vorhanden, jeder Dateiname exakt, keine Dubletten, keine fehlenden Bilder, keine falschen Szenennummern.',
  '- Animations-/Remotion-Szenen dürfen NICHT als finale Flow-Bilder auftauchen.',
  '- Temporäre Cover-A/B/C-Kandidaten dürfen NICHT als zusätzliche finale Dateien im finalen Bildordner liegen.',
  '- Bei einem Namens-/Ablagefehler nur verschieben/umbenennen; korrekte Bilder nicht neu generieren.',
  '- Abschlussmeldung erst bei FINAL INVENTORY QA = PASS.',
  '',
  'EXPECTED_FINAL_FILES:',
  ...expectedFinalFiles.map((name) => `- ${name}`),
  'FLOW_COVER_5PACK_END',
  '',
].join('\n');

const originalMaster = readFileSync(allPromptsPath, 'utf8');
let body = originalMaster
  .replace(/FLOW_COVER_5PACK_BEGIN[\s\S]*?FLOW_COVER_5PACK_END\n*/g, '')
  .replace(/^FLOW_EXECUTION_MODE:[\s\S]*?(?=FINANZNEO — EINZIGE ÜBERGABEDATEI FÜR DEN GOOGLE-FLOW-KI-AGENTEN|BILDNUMMERIERUNG:|={10,}\s*scene-)/, '');

// Bei individuell umgeschriebenen Reels kann der historische globale Flow-Kopf
// ohne Handoff-/Nummerierungsmarker direkt vor scene-01 stehen. Dann bleibt nur
// der eigentliche Szenenteil erhalten; der kanonische Kopf wird neu aufgebaut.
const handoffMarker = 'FINANZNEO — EINZIGE ÜBERGABEDATEI FÜR DEN GOOGLE-FLOW-KI-AGENTEN';
const handoffIndex = body.indexOf(handoffMarker);
const numberingIndex = body.indexOf('BILDNUMMERIERUNG:');
const firstSceneIndex = body.search(/={10,}\s*scene-/);
if (handoffIndex > 0) body = body.slice(handoffIndex);
else if (numberingIndex > 0 && (firstSceneIndex === -1 || numberingIndex < firstSceneIndex)) body = body.slice(numberingIndex);
else if (firstSceneIndex > 0) body = body.slice(firstSceneIndex);

// Falls ein alter globaler Agentenblock im erhaltenen Body steckt, entfernen.
const globalProtocolIndex = body.indexOf('FLOW_AGENT_PROTOCOL:');
const globalNumberingIndex = body.indexOf('BILDNUMMERIERUNG:', globalProtocolIndex);
if (globalProtocolIndex !== -1 && globalNumberingIndex !== -1 && (firstSceneIndex === -1 || globalProtocolIndex < firstSceneIndex)) {
  body = `${body.slice(0, globalProtocolIndex)}${body.slice(globalNumberingIndex)}`;
}

let master = `${AUTONOMY_BLOCK}\n${coverWorkflowBlock}\n${FLOW_AGENT_BLOCK}\n${body.replace(/^\s+/, '')}`;
master = modernizeLegacyWaitWording(master);

// Jeder konkrete Szenenbildblock bleibt zusätzlich ein harter Einzeljob.
master = master
  .replaceAll('FLOW_STEP_GATE: STRICT_CURRENT_ONLY\nCURRENT_STEP_ONLY: true\nNEXT_STEP_LOCKED_UNTIL_RENAME_AND_QA: true\nBATCH_WITH_OTHER_IMAGE_BLOCKS: FORBIDDEN\n', '')
  .replaceAll('FLOW_STEP_GATE: STRICT_CURRENT_ONLY\nCURRENT_STEP_ONLY: true\nNEXT_STEP_LOCKED_UNTIL_RENAME_AND_QA: true\n', '')
  .replaceAll(
    'GOOGLE FLOW – FINALER DATEINAME:',
    'FLOW_STEP_GATE: STRICT_CURRENT_ONLY\nCURRENT_STEP_ONLY: true\nNEXT_STEP_LOCKED_UNTIL_RENAME_AND_QA: true\nBATCH_WITH_OTHER_IMAGE_BLOCKS: FORBIDDEN\nGOOGLE FLOW – FINALER DATEINAME:',
  );
writeFileSync(allPromptsPath, master, 'utf8');

// Cover-Datei als konkrete Cover-Phase markieren. Der bestehende Cover-Prompt
// bleibt Inhaltsbasis; Text ist kurz und ausschließlich inhaltsbezogen.
let cover = readFileSync(coverPath, 'utf8');
cover = cover.replace(/FLOW_COVER_FILE_BEGIN[\s\S]*?FLOW_COVER_FILE_END\n*/g, '');
cover = cover.replace(/no headline inside the generated image/gi, 'short cover hook text is required; maximum two lines; no additional text beyond the chosen content-based hook');
const coverFileHeader = [
  'FLOW_COVER_FILE_BEGIN',
  FLOW_COVER_WORKFLOW_MARKER,
  'COVER_VARIANT_COUNT: 3',
  'COVER_PARALLEL_GENERATION_REQUIRED: true',
  `COVER_CONCURRENCY: ${FLOW_COVER_CONCURRENCY}`,
  'COVER_SEPARATE_JOBS_REQUIRED: true',
  'COVER_MULTI_IMAGE_REQUEST_FORBIDDEN: true',
  'COVER_TEXT_REQUIRED: true',
  'COVER_TEXT_MAX_LINES: 2',
  'COVER_TEXT_IDEAL_WORDS: 2-5',
  'COVER_TEXT_MUST_DESCRIBE_REEL_CONTENT: true',
  'COVER_LONG_SENTENCE_FORBIDDEN: true',
  'COVER_SELECTION_REQUIRED: true',
  'SELECTED_COVER_BECOMES_SCENE_01: true',
  'SELECTED_COVER_IS_STYLE_REFERENCE: false',
  'IMAGE_TO_IMAGE_STYLE_REFERENCE_FORBIDDEN: true',
  'STYLE_AUTHORITY: finanzneo-stylized-3d-animated-black-v9',
  '',
  'Starte aus der unten stehenden Cover-Idee drei eigenständige Kandidaten A/B/C gleichzeitig als drei getrennte Bildjobs.',
  'Jeder Kandidat MUSS einen kurzen, lesbaren deutschen Cover-Hook enthalten, der den tatsächlichen Inhalt dieses Reels direkt zusammenfasst.',
  'Maximal 2 Zeilen, ideal 2–5 Wörter. Keine langen Sätze. Keine generische Clickbait-Aussage ohne Inhaltsbezug. Keine erfundenen Fakten oder Zahlen.',
  'Alle drei Kandidaten müssen direkt in der FinanzNeo-V9-Bildwelt entstehen. Keines der Cover ist Vorlage für ein anderes.',
  'A = Hero-Zahl/Hero-Objekt. B = Kontrast/Gegenüberstellung. C = Objekt-Story/Metapher.',
  'Keine drei fast identischen Varianten.',
  'Nach A/B/C stoppen und Nutzer A/B/C wählen lassen. Nur die gewählte Variante wird final übernommen.',
  'Die gewählte Variante wird auf den finalen Scene-01-Dateinamen umbenannt. Sie ist danach ausdrücklich KEINE Style-Referenz für weitere Bilder.',
  'Alle weiteren Bilder nutzen direkt die schriftliche FinanzNeo-V9-Bildwelt.',
  'FLOW_COVER_FILE_END',
  '',
].join('\n');
writeFileSync(coverPath, `${coverFileHeader}${cover}`, 'utf8');

index.googleFlow = {
  ...(index.googleFlow ?? {}),
  ...flowAutonomyFields(),
  finalCollectionDirectory: finalDirectory,
  coverCandidateDirectory: '03-szenen/00-cover/KANDIDATEN/',
  coverCandidateFileNames: ['Cover-A.png', 'Cover-B.png', 'Cover-C.png'],
  coverFinalFileName,
  selectedCoverSceneId: coverScene.id,
  styleAuthority: 'finanzneo-stylized-3d-animated-black-v9',
  styleReferenceTransferOnly: [],
  imageBlocksAfterCover: imageBlocks,
  expectedFinalImageCount: imageScenes.length,
  expectedFinalFiles,
  temporaryCoverCandidatesExcludedFromFinalAudit: true,
  finalFolderMustContainAllExpectedFinalImages: true,
};
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log(`✓ ${FLOW_COVER_WORKFLOW_ID} gesetzt.`);
console.log(`  3 Cover parallel als getrennte Jobs -> Nutzerwahl -> Cover nur Scene 01 -> V9 als einzige Style-Autorität -> ${imageBlocks.length} 5er-Block/Blöcke.`);
console.log('  Danach pro Szenenbild: genau 1 Job -> sofort Rename -> finaler Ordner -> QA -> automatisch weiter.');
console.log(`  Abschluss: Inventory-QA auf ${imageScenes.length} erwartete finale Bilder in ${finalDirectory}`);
