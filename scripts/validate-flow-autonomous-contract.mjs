#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  FLOW_COVER_CONCURRENCY,
  FLOW_COVER_CONCURRENCY_MARKER,
  FLOW_COVER_WORKFLOW_ID,
  FLOW_COVER_WORKFLOW_MARKER,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_IMAGE_BLOCK_SIZE,
  FLOW_IMAGE_BLOCK_SIZE_MARKER,
  FLOW_SCENE_CONCURRENCY,
  FLOW_SCENE_CONCURRENCY_MARKER,
  FLOW_STATE_MACHINE_ID,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
  IMAGE_INBOX,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: node scripts/validate-flow-autonomous-contract.mjs reels/<Woche>/<Tag>/<Reel>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('reels'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein Reel-Projekt unter reels/ sein.');
  process.exit(1);
}

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const masterPath = resolve(root, ALL_PROMPTS);
const indexPath = resolve(root, SCENE_INDEX);
const coverPath = resolve(root, '03-szenen/00-cover/cover.txt');

assert(existsSync(masterPath), `${ALL_PROMPTS} fehlt.`);
assert(existsSync(indexPath), `${SCENE_INDEX} fehlt.`);

if (existsSync(masterPath) && existsSync(indexPath)) {
  const master = readFileSync(masterPath, 'utf8');
  const lower = master.toLowerCase();
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const flow = index.googleFlow ?? {};
  const coverWorkflow = flow.coverFivePackWorkflowId === FLOW_COVER_WORKFLOW_ID;

  assert(master.includes(FLOW_EXECUTION_MODE_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_EXECUTION_MODE_MARKER}.`);
  assert(master.includes(FLOW_STRUCTURE_LOCK_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_STRUCTURE_LOCK_MARKER}.`);
  assert(master.includes(FLOW_STATE_MACHINE_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_STATE_MACHINE_MARKER}.`);
  assert(master.includes(FLOW_COVER_CONCURRENCY_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_COVER_CONCURRENCY_MARKER}.`);
  assert(master.includes(FLOW_SCENE_CONCURRENCY_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_SCENE_CONCURRENCY_MARKER}.`);
  assert(master.includes('COVER-PARALLEL + SCENE-SINGLE-JOB STATE MACHINE — VERBINDLICH'), 'Cover-parallel/Scene-single State-Machine fehlt im Masterprompt.');
  assert(master.includes('COVER A, B UND C ALS DREI GETRENNTE BILDJOBS GLEICHZEITIG STARTEN'), 'Drei parallele getrennte Cover-Jobs sind nicht ausdrücklich festgelegt.');
  assert(master.includes('NICHT ALS KONTAKTBOGEN, COLLAGE ODER EIN GEMEINSAMER MULTI-IMAGE-PROMPT'), 'Cover-Parallelität muss drei getrennte Jobs bleiben, kein Multi-Image-Request.');
  assert(master.includes('MAX_CONCURRENT_SCENE_GENERATIONS = 1'), 'Szenenbild-Concurrency=1 fehlt.');
  assert(master.includes('mehrere Szenenbilder in einem Generierungsaufruf'), 'Multi-Image-Generierung für Szenenbilder ist nicht ausdrücklich verboten.');
  assert(master.includes('mehrere Szenenbildprompts zusammenfassen'), 'Zusammenfassen mehrerer Szenenbildprompts ist nicht ausdrücklich verboten.');
  assert(master.includes('Szenenbilder vorab in eine Queue stellen'), 'Queueing späterer Szenenbilder ist nicht ausdrücklich verboten.');
  assert(master.includes('alle Szenenbilder zuerst erzeugen und erst danach gesammelt umbenennen'), 'Gesammeltes spätes Umbenennen ist nicht ausdrücklich verboten.');
  assert(master.includes('WARTE NIEMALS AUF "WEITER"'), 'Nutzer-„weiter“ muss nach dem Cover-Gate ausdrücklich verboten sein.');
  assert(!master.includes('Lies die gesamte Datei einmal'), 'Alter Batch-fördernder Satz „Lies die gesamte Datei einmal“ ist verboten.');

  assert(flow.executionModeId === FLOW_EXECUTION_MODE_ID, `scene-index.googleFlow.executionModeId muss ${FLOW_EXECUTION_MODE_ID} sein.`);
  assert(flow.stateMachineId === FLOW_STATE_MACHINE_ID, `scene-index.googleFlow.stateMachineId muss ${FLOW_STATE_MACHINE_ID} sein.`);
  assert(flow.coverParallelGenerationRequired === true, 'Die drei Cover müssen parallel gestartet werden.');
  assert(flow.coverConcurrentGenerations === FLOW_COVER_CONCURRENCY, `Cover-Concurrency muss ${FLOW_COVER_CONCURRENCY} sein.`);
  assert(flow.coverSeparateJobsRequired === true, 'Cover A/B/C müssen drei getrennte Jobs sein.');
  assert(flow.coverMultiImageRequestForbidden === true, 'Ein gemeinsamer Multi-Image-Cover-Request muss verboten sein.');
  assert(flow.maxConcurrentGenerations === FLOW_SCENE_CONCURRENCY, `Szenenbild maxConcurrentGenerations muss ${FLOW_SCENE_CONCURRENCY} sein.`);
  assert(flow.sceneMaxConcurrentGenerations === FLOW_SCENE_CONCURRENCY, `sceneMaxConcurrentGenerations muss ${FLOW_SCENE_CONCURRENCY} sein.`);
  assert(flow.batchGenerationForbidden === true, 'Batch-Generierung der Szenenbilder muss verboten sein.');
  assert(flow.multiImageRequestForbidden === true, 'Multi-Image-Requests für Szenenbilder müssen verboten sein.');
  assert(flow.queueLaterImagesForbidden === true, 'Spätere Szenenbilder dürfen nicht vorab gequeued werden.');
  assert(flow.galleryOrContactSheetForbidden === true, 'Galerie/Kontaktbogen als Ersatz für Einzelbilder muss verboten sein.');
  assert(flow.currentStepGateRequired === true, 'ACTIVE_STEP-Gate muss für Szenenbilder verpflichtend sein.');
  assert(flow.nextStepLockedUntilCurrentResultReturned === true, 'Nächster Szenenbild-Schritt muss bis zur Rückgabe des aktuellen Bildes gesperrt bleiben.');
  assert(flow.renameBeforeUnlockNext === true, 'Aktuelles Szenenbild muss vor Freischaltung des nächsten exakt umbenannt werden.');
  assert(flow.qaBeforeUnlockNext === true, 'QA muss vor Freischaltung des nächsten Szenenbildes bestehen.');
  assert(flow.userApprovalBetweenImagesForbidden === true, 'Zwischenfreigaben zwischen Szenenbildern müssen verboten sein.');
  assert(flow.internalWaitForGenerationOnly === true, 'Nach der Cover-Auswahl darf Warten nur intern auf die aktuelle Generierung erfolgen.');
  assert(flow.autoContinueAfterQa === true, 'Nach bestandener QA muss automatisch fortgefahren werden.');
  assert(flow.hardBlockerOnlyStop === true, 'Nach der Cover-Auswahl darf Flow nur bei echtem Hard-Blocker stoppen.');
  assert(flow.structureLockId === FLOW_STRUCTURE_LOCK_ID, `structureLockId muss ${FLOW_STRUCTURE_LOCK_ID} sein.`);
  assert(flow.preserveStructureThroughLastImage === true, 'Struktur muss bis zum letzten Bild erhalten bleiben.');
  assert(flow.preserveStyleThroughLastImage === true, 'V9-Bildwelt muss bis zum letzten Bild erhalten bleiben.');

  if (coverWorkflow) {
    assert(master.includes(FLOW_COVER_WORKFLOW_MARKER), `Masterprompt benötigt ${FLOW_COVER_WORKFLOW_MARKER}.`);
    assert(master.includes(FLOW_IMAGE_BLOCK_SIZE_MARKER), `Masterprompt benötigt ${FLOW_IMAGE_BLOCK_SIZE_MARKER}.`);
    assert(master.includes('COVER A') && master.includes('COVER B') && master.includes('COVER C'), 'Masterprompt muss drei Cover-Kandidaten A/B/C verlangen.');
    assert(master.includes('COVER-TEXT MUSS DEN VIDEOINHALT KURZ WIEDERGEBEN'), 'Cover-Text muss kurz und direkt inhaltsbezogen sein.');
    assert(master.includes('MAXIMAL 2 ZEILEN') && master.includes('2–5 WÖRTER'), 'Kurze Cover-Textgrenzen fehlen.');
    assert(master.includes('KEINE LANGEN SÄTZE'), 'Lange Cover-Sätze müssen ausdrücklich verboten sein.');
    assert(master.includes('STOPP') && master.includes('A/B/C'), 'Cover-Auswahl-Gate des Nutzers fehlt.');
    assert(master.includes('DAS GEWÄHLTE COVER IST AUSDRÜCKLICH KEINE STYLE-VORLAGE'), 'Cover darf nicht als Style-Vorlage verwendet werden.');
    assert(master.includes('STYLE-AUTORITÄT') && master.includes('FINANZNEO-V9-BILDWELT'), 'V9 muss die einzige Style-Autorität sein.');
    assert(master.includes('SPÄTERE BILDER DÜRFEN ES NICHT ALS BILDREFERENZ VERWENDEN'), 'Bild-zu-Bild-Style-Referenz vom Cover muss verboten sein.');
    assert(master.includes('5ER-SCHRITTE'), '5er-Blockstruktur fehlt im Masterprompt.');
    assert(master.includes('SOFORT exakt umbenennen') || master.includes('SOFORT EXAKT UMBENANNT'), 'Sofortiges Umbenennen jedes Szenenbildes fehlt.');
    assert(master.includes('FINAL INVENTORY QA'), 'Finaler Inventory-QA fehlt im Masterprompt.');
    assert(master.includes(`FINAL_IMAGE_DIRECTORY: ${IMAGE_INBOX}/`), 'Ein finaler gemeinsamer Bildordner ist nicht eindeutig festgelegt.');

    assert(existsSync(coverPath), '03-szenen/00-cover/cover.txt fehlt.');
    if (existsSync(coverPath)) {
      const cover = readFileSync(coverPath, 'utf8');
      assert(cover.includes(FLOW_COVER_WORKFLOW_MARKER), 'cover.txt enthält den aktuellen Cover-Vertragsmarker nicht.');
      assert(cover.includes('COVER_VARIANT_COUNT: 3'), 'cover.txt muss exakt drei Cover-Varianten verlangen.');
      assert(cover.includes('COVER_PARALLEL_GENERATION_REQUIRED: true'), 'cover.txt muss parallele Cover-Generierung verlangen.');
      assert(cover.includes(`COVER_CONCURRENCY: ${FLOW_COVER_CONCURRENCY}`), `cover.txt muss Cover-Concurrency ${FLOW_COVER_CONCURRENCY} setzen.`);
      assert(cover.includes('COVER_TEXT_REQUIRED: true'), 'cover.txt muss Text auf jedem Cover verpflichtend machen.');
      assert(cover.includes('COVER_TEXT_MUST_DESCRIBE_REEL_CONTENT: true'), 'cover.txt muss direkten Inhaltsbezug des Textes verlangen.');
      assert(cover.includes('COVER_LONG_SENTENCE_FORBIDDEN: true'), 'cover.txt muss lange Cover-Sätze verbieten.');
      assert(cover.includes('COVER_SELECTION_REQUIRED: true'), 'cover.txt muss Nutzerwahl vor Szenenbildern verlangen.');
      assert(cover.includes('SELECTED_COVER_IS_STYLE_REFERENCE: false'), 'cover.txt muss klarstellen, dass das Cover keine Style-Referenz ist.');
      assert(cover.includes('STYLE_AUTHORITY: finanzneo-stylized-3d-animated-black-v9'), 'cover.txt muss V9 als Style-Autorität setzen.');
    }

    assert(flow.autonomousFullRun === false, 'Mit Cover-Auswahl darf autonomousFullRun nicht true sein.');
    assert(flow.autonomousAfterCoverSelection === true, 'Nach Cover-Auswahl muss der Rest autonom laufen.');
    assert(flow.coverVariantCount === 3, 'Es müssen exakt drei Cover-Kandidaten erzeugt werden.');
    assert(flow.coverTextRequired === true, 'Cover-Text muss verpflichtend sein.');
    assert(flow.coverHookMaxLines === 2, 'Cover-Hook darf maximal zwei Zeilen haben.');
    assert(flow.coverHookIdealWordMin === 2 && flow.coverHookIdealWordMax === 5, 'Cover-Hook-Ziel muss 2–5 Wörter sein.');
    assert(flow.coverLongSentenceForbidden === true, 'Lange Cover-Sätze müssen verboten sein.');
    assert(flow.coverTextMustDescribeReelContent === true, 'Cover-Text muss den Reel-Inhalt direkt wiedergeben.');
    assert(flow.coverMustUseV9World === true, 'Cover muss direkt die V9-Bildwelt verwenden.');
    assert(flow.coverSelectionRequiredBeforeSceneImages === true, 'Cover-Auswahl muss vor allen weiteren Szenenbildern erfolgen.');
    assert(flow.userApprovalOnlyForCoverSelection === true, 'Die einzige Nutzerfreigabe muss die Cover-Auswahl sein.');
    assert(flow.selectedCoverPromotedToFinalCover === true, 'Gewähltes Cover muss finaler Cover-Asset werden.');
    assert(flow.selectedCoverPromotedToScene01 === true, 'Gewähltes Cover muss Scene 01 erfüllen.');
    assert(flow.selectedCoverAsOnlyStyleReference === false, 'Gewähltes Cover darf nicht als Style-Referenz gesetzt sein.');
    assert(flow.coverMayBeUsedAsStyleReference === false, 'Cover darf für spätere Bilder nicht als Style-Referenz verwendet werden.');
    assert(flow.imageToImageStyleReferenceForbidden === true, 'Bild-zu-Bild-Style-Referenzen müssen verboten sein.');
    assert(flow.canonicalStyleAuthority === 'finanzneo-stylized-3d-animated-black-v9', 'V9 muss kanonische Style-Autorität sein.');
    assert(flow.laterImagesMayNotBecomeStyleReference === true, 'Spätere Szenenbilder dürfen ebenfalls nicht zum Style-Anker werden.');
    assert(flow.imageBlockSize === FLOW_IMAGE_BLOCK_SIZE, `imageBlockSize muss ${FLOW_IMAGE_BLOCK_SIZE} sein.`);
    assert(flow.blockAutonomousRun === true, '5er-Blöcke müssen nach Cover-Auswahl autonom laufen.');
    assert(flow.autoContinueBetweenBlocks === true, 'Zwischen 5er-Blöcken muss automatisch weitergearbeitet werden.');
    assert(flow.userApprovalBetweenBlocksForbidden === true, 'Zwischen 5er-Blöcken darf keine Nutzerfreigabe verlangt werden.');
    assert(flow.immediateRenameRequired === true, 'Jedes Szenenbild muss sofort nach Rückgabe umbenannt werden.');
    assert(flow.finalInventoryQaRequired === true, 'Finaler Inventory-QA muss verpflichtend sein.');
    assert(flow.finalFileNameQaRequired === true, 'Finaler Dateinamen-QA muss verpflichtend sein.');
    assert(flow.finalSingleDirectoryQaRequired === true, 'Finaler Ein-Ordner-QA muss verpflichtend sein.');
    assert(flow.finalCollectionDirectory === `${IMAGE_INBOX}/`, `finalCollectionDirectory muss ${IMAGE_INBOX}/ sein.`);
    assert(flow.temporaryCoverCandidatesExcludedFromFinalAudit === true, 'Temporäre Cover-Kandidaten müssen aus dem finalen Dateisatz ausgeschlossen sein.');
    assert(flow.finalFolderMustContainAllExpectedFinalImages === true, 'Finaler Ordner muss alle erwarteten finalen Bilder enthalten.');

    const imageScenes = (index.scenes ?? []).filter((scene) => scene?.type === 'image');
    const coverScene = imageScenes.find((scene) => scene.id === 'scene-01') ?? imageScenes[0];
    const fileNameFor = (scene) => scene.id === coverScene?.id && index.cover?.googleFlowFileName
      ? index.cover.googleFlowFileName
      : scene.googleFlowFileName;
    const expectedFiles = imageScenes.map(fileNameFor);
    assert(flow.expectedFinalImageCount === imageScenes.length, `expectedFinalImageCount muss ${imageScenes.length} sein.`);
    assert(JSON.stringify(flow.expectedFinalFiles) === JSON.stringify(expectedFiles), 'expectedFinalFiles stimmt nicht exakt mit den IMAGE-Szenen überein.');

    const blocks = Array.isArray(flow.imageBlocksAfterCover) ? flow.imageBlocksAfterCover : [];
    const flattened = [];
    for (const block of blocks) {
      assert(Array.isArray(block.sceneIds), `5er-Block ${block.block ?? '?'} braucht sceneIds.`);
      assert((block.sceneIds ?? []).length <= FLOW_IMAGE_BLOCK_SIZE, `5er-Block ${block.block ?? '?'} enthält mehr als ${FLOW_IMAGE_BLOCK_SIZE} Bilder.`);
      assert((block.sceneIds ?? []).length > 0, `5er-Block ${block.block ?? '?'} darf nicht leer sein.`);
      flattened.push(...(block.sceneIds ?? []));
      for (const sceneId of block.sceneIds ?? []) {
        const scene = (index.scenes ?? []).find((item) => item.id === sceneId);
        assert(scene?.type === 'image', `${sceneId} in imageBlocksAfterCover ist keine IMAGE-Szene.`);
        assert(sceneId !== coverScene?.id, `${sceneId} darf nicht erneut in den 5er-Blöcken generiert werden.`);
      }
    }
    const expectedRemainingIds = imageScenes.filter((scene) => scene.id !== coverScene?.id).map((scene) => scene.id);
    assert(JSON.stringify(flattened) === JSON.stringify(expectedRemainingIds), '5er-Blockplan deckt die verbleibenden IMAGE-Szenen nicht exakt in Reihenfolge ab.');
  } else {
    // Rückwärtskompatibilität für bestehende Reels ohne aktuellen Cover-Vertrag.
    assert(flow.autonomousFullRun === true, 'Legacy-Flow muss autonomousFullRun=true setzen.');
    assert(flow.userContinueSignalForbidden === true, 'Legacy-Flow muss Nutzer-„weiter“-Signale verbieten.');
  }

  const lines = master.split(/\r?\n/);
  for (const line of lines) {
    const l = line.toLowerCase();
    const allowedCoverSelection = l.includes('cover') && (l.includes('a/b/c') || l.includes('a, b oder c') || l.includes('auswahl'));
    if ((l.includes('warte auf den nutzer') || l.includes('warte auf eine bestätigung') || l.includes('warte auf "weiter"')) && !l.includes('niemals') && !l.includes('nicht') && !allowedCoverSelection) {
      errors.push(`Unzulässige Nutzer-Warteanweisung außerhalb des Cover-Gates: ${line.trim()}`);
    }
  }

  assert(!lower.includes('batch generation allowed'), 'Batch-Generierung darf nirgendwo erlaubt werden.');
}

if (errors.length) {
  console.error('\nGoogle-Flow-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Google-Flow-Vertrag erfüllt.');
console.log('  3 Cover gleichzeitig als getrennte Jobs -> Nutzerwahl -> Cover nur als Scene 01 -> V9 bleibt einzige Style-Autorität.');
console.log('  Danach: 5er-Blöcke -> pro Szenenbild Single Job + Sofort-Rename + QA.');
console.log(`  Abschluss: vollständiger Datei-/Namens-Audit in ${IMAGE_INBOX}/.`);
