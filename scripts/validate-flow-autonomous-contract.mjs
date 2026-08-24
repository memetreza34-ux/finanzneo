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
  assert(master.includes('DIES IST KEIN BATCH-AUFTRAG'), 'Masterprompt verbietet die Batch-Interpretation nicht ausdrücklich.');
  assert(master.includes('MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG'), 'Concurrency=1 ist nicht ausdrücklich festgelegt.');
  assert(master.includes('ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT'), 'Spätere Bildblöcke sind vor Abschluss des aktuellen Bildes nicht gesperrt.');
  assert(master.includes('exakt umbenannt') && master.includes('per QA geprüft'), 'Rename+QA-Gate vor Freischaltung des nächsten Bildes fehlt.');
  assert(master.includes('mehrere Bilder in einem Generierungsaufruf'), 'Multi-Image-Generierung ist nicht ausdrücklich verboten.');
  assert(master.includes('mehrere Bildprompts zusammenfassen'), 'Zusammenfassen mehrerer Bildprompts ist nicht ausdrücklich verboten.');
  assert(master.includes('Bilder vorab in eine Queue stellen'), 'Queueing späterer Bilder ist nicht ausdrücklich verboten.');
  assert(master.includes('alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen'), 'Gesammeltes spätes Umbenennen ist nicht ausdrücklich verboten.');
  assert(master.includes('WARTE NIEMALS AUF "WEITER"'), 'Masterprompt verbietet Nutzer-„weiter“ nicht.');

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

  // Der alte Satz war ein realer Fehlerauslöser: Er ließ den Agenten die Datei
  // als Gesamtauftrag interpretieren, bevor das Single-Image-Gate griff.
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
  assert(flow.userContinueSignalForbidden === true, 'Nutzer-„weiter“-Signale müssen verboten sein.');
  assert(flow.userApprovalBetweenImagesForbidden === true, 'Zwischenfreigaben zwischen Bildern müssen verboten sein.');
  assert(flow.internalWaitForGenerationOnly === true, 'Warten darf nur intern auf die aktuelle Generierung erfolgen.');
  assert(flow.autoContinueAfterQa === true, 'Nach bestandener QA muss automatisch fortgefahren werden.');
  assert(flow.hardBlockerOnlyStop === true, 'Flow darf nur bei echtem Hard-Blocker stoppen.');
  assert(flow.structureLockId === FLOW_STRUCTURE_LOCK_ID, `structureLockId muss ${FLOW_STRUCTURE_LOCK_ID} sein.`);
  assert(flow.preserveStructureThroughLastImage === true, 'Struktur muss bis zum letzten Bild erhalten bleiben.');
  assert(flow.preserveStyleThroughLastImage === true, 'Bildwelt/Stil muss bis zum letzten Bild erhalten bleiben.');

  // Kein positiver Befehl zum Warten auf Nutzer. Negativformulierungen sind erlaubt.
  const lines = master.split(/\r?\n/);
  for (const line of lines) {
    const l = line.toLowerCase();
    if ((l.includes('warte auf den nutzer') || l.includes('warte auf eine bestätigung') || l.includes('warte auf "weiter"')) && !l.includes('niemals') && !l.includes('nicht')) {
      errors.push(`Unzulässige Nutzer-Warteanweisung: ${line.trim()}`);
    }
  }

  assert(!lower.includes('batch generation allowed'), 'Batch-Generierung darf nirgendwo erlaubt werden.');
}

if (errors.length) {
  console.error('\nGoogle-Flow-Single-Job-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Google-Flow-Single-Job-State-Machine erfüllt.');
console.log('  Concurrency=1 · kein Batch/Queueing · aktuelles Bild → Rückgabe → Rename → QA → erst dann nächstes Bild · kein Nutzer-„weiter“ nötig.');
