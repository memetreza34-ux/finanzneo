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

  assert(master.includes(FLOW_EXECUTION_MODE_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_EXECUTION_MODE_MARKER}.`);
  assert(master.includes(FLOW_STRUCTURE_LOCK_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_STRUCTURE_LOCK_MARKER}.`);
  assert(master.includes(FLOW_STATE_MACHINE_MARKER), `${ALL_PROMPTS} benötigt ${FLOW_STATE_MACHINE_MARKER}.`);
  assert(master.includes('STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH'), 'Strict-Single-Job-State-Machine fehlt im Masterprompt.');
  assert(master.includes('DIES IST KEIN BATCH-AUFTRAG'), 'Masterprompt verbietet Batch nicht ausdrücklich.');
  assert(master.includes('MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG'), 'Concurrency=1 ist nicht ausdrücklich festgelegt.');
  assert(master.includes('BLOCKGRÖSSE = 5'), '5er-Blockgröße fehlt im Masterprompt.');
  assert(master.includes('3 COVER-VARIANTEN A/B/C'), 'Cover-Gate mit 3 Varianten fehlt.');
  assert(master.includes('EINZIGE VISUELLE STYLE-REFERENZ'), 'Gewähltes Cover muss als einzige visuelle Style-Referenz festgelegt sein.');
  assert(master.includes('ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT'), 'Spätere 5er-Blöcke müssen gesperrt bleiben.');
  assert(master.includes('exakt umbenannt') && master.includes('per QA geprüft'), 'Rename+QA-Gate innerhalb des Blocks fehlt.');
  assert(master.includes('NACH MAXIMAL FÜNF FERTIGEN BILDERN'), 'Pflichtstopp nach maximal fünf Bildern fehlt.');
  assert(master.includes('NUTZERFREIGABE') || master.includes('"WEITER"'), 'Nutzerfreigabe zwischen 5er-Blöcken fehlt.');
  assert(master.includes('mehrere Bilder in einem Generierungsaufruf'), 'Multi-Image-Generierung ist nicht ausdrücklich verboten.');
  assert(master.includes('mehrere Bildprompts zusammenfassen'), 'Zusammenfassen mehrerer Bildprompts ist nicht ausdrücklich verboten.');
  assert(master.includes('Bilder vorab in eine Queue stellen'), 'Queueing späterer Bilder ist nicht ausdrücklich verboten.');
  assert(master.includes('alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen'), 'Gesammeltes spätes Umbenennen ist nicht ausdrücklich verboten.');

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
  assert(flow.autonomousFullRun === false, 'scene-index muss autonomousFullRun=false setzen: Nutzer-Checkpoint nach jedem 5er-Block.');
  assert(flow.blockAutonomousRun === true, 'Innerhalb eines 5er-Blocks muss Flow autonom arbeiten.');
  assert(flow.blockSize === 5, 'scene-index muss blockSize=5 setzen.');
  assert(flow.maxConcurrentGenerations === 1, 'scene-index muss maxConcurrentGenerations=1 setzen.');
  assert(flow.batchGenerationForbidden === true, 'Batch-Generierung muss verboten sein.');
  assert(flow.multiImageRequestForbidden === true, 'Multi-Image-Requests müssen verboten sein.');
  assert(flow.queueLaterImagesForbidden === true, 'Spätere Bilder dürfen nicht vorab gequeued werden.');
  assert(flow.galleryOrContactSheetForbidden === true, 'Galerie/Kontaktbogen als Ersatz für Einzelbilder muss verboten sein.');
  assert(flow.currentStepGateRequired === true, 'ACTIVE_STEP-Gate muss verpflichtend sein.');
  assert(flow.nextStepLockedUntilCurrentResultReturned === true, 'Nächster Bildschritt muss bis zur Rückgabe des aktuellen Bildes gesperrt bleiben.');
  assert(flow.renameBeforeUnlockNext === true, 'Aktuelles Bild muss vor dem nächsten exakt umbenannt werden.');
  assert(flow.qaBeforeUnlockNext === true, 'QA muss vor dem nächsten Bild bestehen.');
  assert(flow.userContinueSignalForbidden === false, '„weiter“ muss zwischen 5er-Blöcken erlaubt sein.');
  assert(flow.userApprovalBetweenImagesForbidden === true, 'Zwischen einzelnen Bildern desselben Blocks darf keine Freigabe nötig sein.');
  assert(flow.userApprovalBetweenBlocksRequired === true, 'Zwischen 5er-Blöcken muss Nutzerfreigabe Pflicht sein.');
  assert(flow.internalWaitForGenerationOnly === true, 'Während eines Bildjobs darf nur intern auf die Generierung gewartet werden.');
  assert(flow.autoContinueAfterQaWithinBlock === true, 'Innerhalb eines Blocks muss nach QA automatisch zum nächsten Bild weitergegangen werden.');
  assert(flow.coverVariantCount === 3, 'Vor Block 1 müssen 3 Cover-Varianten erzeugt werden.');
  assert(flow.coverSelectionRequiredBeforeSceneImages === true, 'Normale Szenenbilder müssen bis zur Cover-Wahl gesperrt bleiben.');
  assert(flow.selectedCoverAsOnlyStyleReference === true, 'Nur das gewählte Cover darf Style-Referenz sein.');
  assert(flow.referenceCopiesLayoutForbidden === true, 'Style-Referenz darf Cover-Layout nicht in Szenen kopieren.');
  assert(flow.structureLockId === FLOW_STRUCTURE_LOCK_ID, `structureLockId muss ${FLOW_STRUCTURE_LOCK_ID} sein.`);
  assert(flow.preserveStructureThroughLastImage === true, 'Struktur muss bis zum letzten Bild erhalten bleiben.');
  assert(flow.preserveStyleThroughLastImage === true, 'Bildwelt/Stil muss bis zum letzten Bild erhalten bleiben.');

  assert(!lower.includes('batch generation allowed'), 'Batch-Generierung darf nirgendwo erlaubt werden.');
}

if (errors.length) {
  console.error('\nGoogle-Flow-5er-Single-Job-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Google-Flow-5er-Single-Job-State-Machine erfüllt.');
console.log('  3 Cover-Varianten → Nutzerwahl → Cover als Style-Referenz → max. 5 Bilder pro Block → Nutzerfreigabe → nächster Block.');
console.log('  Innerhalb jedes Blocks: concurrency=1 · Rückgabe → Rename → QA → nächstes Einzelbild.');
