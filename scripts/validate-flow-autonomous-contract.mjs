#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
  FLOW_STATE_MACHINE_ID,
  FLOW_STATE_MACHINE_MARKER,
  FLOW_STRUCTURE_LOCK_ID,
  FLOW_STRUCTURE_LOCK_MARKER,
  SCENE_INDEX,
} from './lib/reel-contract.mjs';
import {V5_HARDENING_ID} from './lib/image-storytelling-v5-hardening.mjs';
import {IMAGE_VISION_QA_ID} from './lib/image-vision-qa.mjs';
import {COVER_ANCHOR_BLOCK_SIZE, COVER_ANCHOR_FLOW_ID} from './lib/cover-anchor-flow-v1.mjs';

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

assert(existsSync(masterPath), `${ALL_PROMPTS} fehlt.`);
assert(existsSync(indexPath), `${SCENE_INDEX} fehlt.`);

if (existsSync(masterPath) && existsSync(indexPath)) {
  const master = readFileSync(masterPath, 'utf8');
  const lower = master.toLowerCase();
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const flow = index.googleFlow ?? {};
  const hardenedV5 = index.imageStorytellingContract?.hardeningId === V5_HARDENING_ID;
  const anchorActive = index.coverAnchorFlow?.id === COVER_ANCHOR_FLOW_ID;

  assert(master.includes(FLOW_EXECUTION_MODE_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_EXECUTION_MODE_MARKER}.`);
  assert(master.includes(FLOW_STRUCTURE_LOCK_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_STRUCTURE_LOCK_MARKER}.`);
  assert(master.includes(FLOW_STATE_MACHINE_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_STATE_MACHINE_MARKER}.`);
  assert(master.includes('STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH'), 'Strict-Single-Job-State-Machine fehlt im Masterprompt.');
  assert(master.includes('MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG'), 'Concurrency=1 ist nicht ausdrücklich festgelegt.');
  assert(master.includes('NACH JEDEM FOLGE-BILD: VOLLSTÄNDIG WARTEN'), 'Ergebnis→Rename→QA-Gate für Folge-Bilder fehlt im Masterprompt.');
  assert(master.includes('mehrere Bilder in einem Generierungsaufruf'), 'Multi-Image-Generierung ist nicht ausdrücklich verboten.');
  assert(master.includes('mehrere Bildprompts gemeinsam an die Generierung senden'), 'Zusammenfassen mehrerer Bildprompts ist nicht ausdrücklich verboten.');
  assert(master.includes('alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen'), 'Gesammeltes spätes Umbenennen ist nicht ausdrücklich verboten.');

  if (hardenedV5) {
    assert(master.includes(`POST_GENERATION_VISION_QA: ${IMAGE_VISION_QA_ID}`), 'V5-Hardening braucht den Pixel-Vision-QA-Marker im Masterprompt.');
    assert(master.includes('PIXEL-/VISION-QA') || master.includes('Pixel-Vision-QA'), 'V5-Hardening verlangt keine echte Pixel-/Vision-QA.');
    assert(master.includes('QA-PASS ohne Sichtprüfung der echten Bildpixel'), 'Prompt-only-QA ist nicht ausdrücklich verboten.');
  }

  if (anchorActive) {
    assert(master.includes(`COVER_ANCHOR_FLOW: ${COVER_ANCHOR_FLOW_ID}`), 'Cover-Anchor-Marker fehlt im Masterprompt.');
    assert(master.includes('scene-01 IST ZUERST UND ALLEIN ZU ERZEUGEN'), 'scene-01 wird nicht ausdrücklich zuerst und allein erzeugt.');
    assert(master.includes('DANACH HART STOPPEN'), 'Manueller Stopp nach scene-01 fehlt.');
    assert(master.includes('SIEHT GUT AUS'), 'Explizite Nutzerfreigabe für den Cover-Anchor fehlt.');
    assert(master.includes('QA-PASS + AUSDRÜCKLICHE NUTZERFREIGABE'), 'APPROVED_COVER_ANCHOR braucht QA-PASS + Nutzerfreigabe.');
    assert(master.includes(`ARBEITSBLÖCKEN ZU MAXIMAL ${COVER_ANCHOR_BLOCK_SIZE} BILDERN`), '5er-Arbeitsblöcke fehlen im Flow-Protokoll.');
    assert(master.includes('OHNE WEITERE NUTZERBESTÄTIGUNG AUTOMATISCH ABGEARBEITET'), 'Autonomer Lauf nach Cover-Freigabe fehlt.');
    assert(master.includes('NÄCHSTEN MAXIMALEN 5ER-BLOCK STARTEN'), 'Automatischer Übergang zum nächsten 5er-Block fehlt.');
    assert(master.includes('FÜR JEDES FOLGE-BILD COVER-REFERENZ ANHÄNGEN'), 'Direkte Cover-Referenz für Folge-Bilder fehlt.');
    assert(master.includes('KEIN ANDERES VORHERIGES BILD DARF ALS PERSISTENTE GENERIERUNGSREFERENZ VERWENDET WERDEN'), 'Nur scene-01 darf persistente Generierungsreferenz sein.');
  }

  const forbiddenPositivePatterns = [
    /starte\s+mehrere\s+bilder\s+gleichzeitig/i,
    /erzeuge\s+alle\s+bilder\s+gleichzeitig/i,
    /generiere\s+alle\s+bilder\s+auf\s+einmal/i,
    /queue\s+alle\s+bilder/i,
    /alle\s+prompts\s+gemeinsam\s+(?:senden|ausführen|generieren)/i,
  ];
  for (const pattern of forbiddenPositivePatterns) {
    const match = master.match(pattern);
    if (match) errors.push(`Unzulässige Batch-Anweisung im Masterprompt: ${match[0]}`);
  }

  assert(!master.includes('Lies die gesamte Datei einmal'), 'Alter Batch-fördernder Satz „Lies die gesamte Datei einmal“ ist verboten.');

  assert(flow.executionModeId === FLOW_EXECUTION_MODE_ID, `scene-index.googleFlow.executionModeId muss ${FLOW_EXECUTION_MODE_ID} sein.`);
  assert(flow.stateMachineId === FLOW_STATE_MACHINE_ID, `scene-index.googleFlow.stateMachineId muss ${FLOW_STATE_MACHINE_ID} sein.`);
  assert(flow.autonomousFullRun === true, 'scene-index muss autonomousFullRun=true setzen.');
  assert(flow.maxConcurrentGenerations === 1, 'scene-index muss maxConcurrentGenerations=1 setzen.');
  assert(flow.batchGenerationForbidden === true, 'Batch-Generierung muss verboten sein.');
  assert(flow.multiImageRequestForbidden === true, 'Multi-Image-Requests müssen verboten sein.');
  assert(flow.queueLaterImagesForbidden === true, 'Spätere Bilder dürfen nicht vorab gequeued werden.');
  assert(flow.galleryOrContactSheetForbidden === true, 'Galerie/Kontaktbogen als Ersatz für Einzelbilder muss verboten sein.');
  assert(flow.currentStepGateRequired === true, 'ACTIVE_STEP-Gate muss verpflichtend sein.');
  assert(flow.nextStepLockedUntilCurrentResultReturned === true, 'Nächster Schritt muss bis zur Rückgabe des aktuellen Bildes gesperrt bleiben.');
  assert(flow.renameBeforeUnlockNext === true, 'Aktuelles Bild muss vor Freischaltung des nächsten exakt umbenannt werden.');
  assert(flow.qaBeforeUnlockNext === true, 'QA muss vor Freischaltung des nächsten Bildes bestehen.');

  if (hardenedV5) {
    assert(flow.postGenerationVisionQaId === IMAGE_VISION_QA_ID, `postGenerationVisionQaId muss ${IMAGE_VISION_QA_ID} sein.`);
    assert(flow.postGenerationVisionQaRequired === true, 'Pixel-Vision-QA muss für gehärtete V5-Reels verpflichtend sein.');
    assert(flow.multimodalPixelInspectionRequired === true, 'Echte multimodale Pixelinspektion muss verpflichtend sein.');
    assert(flow.promptOnlyQaForbidden === true, 'Prompt-only-QA muss verboten sein.');
    assert(flow.visionQaBoundToImageSha256 === true, 'Vision-QA muss an SHA-256 gebunden sein.');
    assert(flow.nextStepLockedUntilVisionQaPass === true, 'Nächster Flow-Step muss bis Pixel-PASS gesperrt bleiben.');
    assert(flow.regenerateSameSceneOnVisionQaFail === true, 'Bei Vision-QA-Fail muss dieselbe Scene regeneriert werden.');
  }

  if (anchorActive) {
    assert(flow.coverAnchorFlowId === COVER_ANCHOR_FLOW_ID, `coverAnchorFlowId muss ${COVER_ANCHOR_FLOW_ID} sein.`);
    assert(flow.coverAnchorSourceSceneId === 'scene-01', 'coverAnchorSourceSceneId muss scene-01 sein.');
    assert(flow.coverAnchorQaPassRequiredBeforeFollowups === true, 'Anchor-PASS muss vor Folge-Bildern Pflicht sein.');
    assert(flow.coverAnchorExplicitUserApprovalRequired === true, 'Explizite Nutzerfreigabe des Covers muss Pflicht sein.');
    assert(flow.manualPauseAfterCoverQaPassRequired === true, 'Nach Cover-QA-PASS muss der Ablauf auf Nutzerfreigabe stoppen.');
    assert(flow.followupPlanBlockSize === COVER_ANCHOR_BLOCK_SIZE, `followupPlanBlockSize muss ${COVER_ANCHOR_BLOCK_SIZE} sein.`);
    assert(flow.followupGenerationStillSingleJob === true, '5er-Arbeitsblöcke dürfen keine Parallelgenerierung aktivieren.');
    assert(flow.followupBlocksAutoRunAfterCoverApproval === true, 'Nach Cover-Freigabe müssen Folge-Blöcke automatisch laufen.');
    assert(flow.userApprovalBetweenFollowupsForbidden === true, 'Zwischen Folge-Bildern darf keine weitere Nutzerfreigabe verlangt werden.');
    assert(flow.automaticallyAdvanceToNextFollowupBlock === true, 'Nach einem 5er-Block muss automatisch der nächste Block starten.');
    assert(flow.approvedCoverImageReferenceRequiredForFollowups === true, 'Folge-Bilder müssen die freigegebene Cover-Datei als Referenz verwenden.');
    assert(flow.onlyCoverMayBePersistentGenerationReference === true, 'Nur das Cover darf persistente Generierungsreferenz sein.');
  }

  assert(flow.userContinueSignalForbidden === false, 'Ein einmaliges Nutzer-Freigabesignal nach dem Cover muss erlaubt sein.');
  assert(flow.userApprovalBetweenImagesForbidden === false, 'Der generische Zwischenfreigabe-Flag muss wegen des Cover-Gates false sein.');
  assert(flow.internalWaitForGenerationOnly === true, 'Generierungswartezeiten müssen intern abgewickelt werden.');
  assert(flow.autoContinueAfterQa === true, 'Nach bestandener Folge-Bild-QA muss automatisch fortgefahren werden.');
  assert(flow.hardBlockerOnlyStop === false, 'Vor der Anchor-Freigabe ist ein manueller Nutzer-Stopp vorgesehen; hardBlockerOnlyStop muss daher false sein.');
  assert(flow.hardBlockerOnlyStopAfterCoverApproval === true, 'Nach Cover-Freigabe darf nur noch ein echter Hard-Blocker stoppen.');
  assert(flow.structureLockId === FLOW_STRUCTURE_LOCK_ID, `structureLockId muss ${FLOW_STRUCTURE_LOCK_ID} sein.`);
  assert(flow.preserveStructureThroughLastImage === true, 'Struktur muss bis zum letzten Bild erhalten bleiben.');
  assert(flow.preserveStyleThroughLastImage === true, 'Bildwelt/Stil muss bis zum letzten Bild erhalten bleiben.');

  const lines = master.split(/\r?\n/);
  for (const line of lines) {
    const l = line.toLowerCase();
    const asksUserToWait = l.includes('warte auf den nutzer') || l.includes('warte auf eine bestätigung') || l.includes('warte auf eine ausdrückliche nutzerfreigabe');
    const isAllowedAnchorGate = l.includes('scene-01') || l.includes('cover') || l.includes('anchor');
    if (asksUserToWait && !isAllowedAnchorGate && !l.includes('niemals') && !l.includes('nicht')) {
      errors.push(`Unzulässige Nutzer-Warteanweisung außerhalb des Cover-Gates: ${line.trim()}`);
    }
  }

  assert(!lower.includes('batch generation allowed'), 'Batch-Generierung darf nirgendwo erlaubt werden.');
}

if (errors.length) {
  console.error('\nGoogle-Flow-Single-Job-/Cover-Anchor-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Google-Flow-Single-Job-State-Machine erfüllt.');
console.log('✓ scene-01 wird zuerst allein erzeugt und braucht QA-PASS + ausdrückliche Nutzerfreigabe.');
console.log('✓ Danach laufen Folge-Bilder automatisch in 5er-Arbeitsblöcken weiter; scene-01 bleibt die einzige persistente Referenz.');
console.log('✓ 5er-Arbeitsblöcke ändern nichts an Concurrency=1: jedes Bild wird einzeln erzeugt, umbenannt und geprüft.');
