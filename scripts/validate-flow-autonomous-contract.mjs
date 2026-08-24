#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ALL_PROMPTS,
  FLOW_EXECUTION_MODE_ID,
  FLOW_EXECUTION_MODE_MARKER,
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
  assert(master.includes('AUTONOMER GESAMTDURCHLAUF — VERBINDLICH'), 'Autonomer Gesamtdurchlauf ist im Masterprompt nicht ausdrücklich festgelegt.');
  assert(master.includes('OHNE NUTZER-ZWISCHENSTOPP BIS ZUM LETZTEN BENÖTIGTEN BILD'), 'Masterprompt erzwingt keinen vollständigen Durchlauf bis zum letzten Bild.');
  assert(master.includes('WARTE NIEMALS AUF "WEITER"'), 'Masterprompt verbietet das Warten auf „weiter“ nicht ausdrücklich.');
  assert(master.includes('INTERN WARTEN'), 'Masterprompt erklärt nicht eindeutig, dass Warten nur die technische Bilderzeugung betrifft.');
  assert(master.includes('AUTOMATISCH') && master.includes('nächsten benötigten Bild'), 'Automatisches Fortfahren nach QA fehlt.');
  assert(master.includes('BIS ZUM LETZTEN BILD KONSEQUENT BEIBEHALTEN'), 'Struktur-/Stil-Lock bis zum letzten Bild fehlt.');

  const forbiddenPatterns = [
    /warte\s+auf\s+(?:den\s+)?nutzer/i,
    /warte[^\n]{0,50}(?:„|"|')?(?:weiter|mach weiter)(?:“|"|')?/i,
    /nach\s+nutz(?:er)?freigabe/i,
    /warte\s+auf\s+(?:eine\s+)?bestätigung/i,
  ];
  for (const pattern of forbiddenPatterns) {
    const match = master.match(pattern);
    if (match && !lower.includes('warte niemals auf "weiter"')) {
      errors.push(`Unzulässige Nutzer-Warteanweisung im Masterprompt: ${match[0]}`);
    }
  }

  assert(flow.executionModeId === FLOW_EXECUTION_MODE_ID, `scene-index.googleFlow.executionModeId muss ${FLOW_EXECUTION_MODE_ID} sein.`);
  assert(flow.autonomousFullRun === true, 'scene-index muss autonomousFullRun=true setzen.');
  assert(flow.userContinueSignalForbidden === true, 'scene-index muss Nutzer-„weiter“-Signale verbieten.');
  assert(flow.userApprovalBetweenImagesForbidden === true, 'Zwischenfreigaben zwischen Bildern müssen verboten sein.');
  assert(flow.internalWaitForGenerationOnly === true, 'Warten darf nur intern auf die aktuelle Generierung erfolgen.');
  assert(flow.autoContinueAfterQa === true, 'Nach bestandener QA muss automatisch fortgefahren werden.');
  assert(flow.hardBlockerOnlyStop === true, 'Flow darf nur bei echtem Hard-Blocker stoppen.');
  assert(flow.structureLockId === FLOW_STRUCTURE_LOCK_ID, `structureLockId muss ${FLOW_STRUCTURE_LOCK_ID} sein.`);
  assert(flow.preserveStructureThroughLastImage === true, 'Struktur muss bis zum letzten Bild erhalten bleiben.');
  assert(flow.preserveStyleThroughLastImage === true, 'Bildwelt/Stil muss bis zum letzten Bild erhalten bleiben.');
}

if (errors.length) {
  console.error('\nGoogle-Flow-Autonomie-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Google-Flow-Autonomie-Vertrag erfüllt.');
console.log('  Ein Gesamtdurchlauf · kein „weiter“ nötig · internes Warten nur auf Generierung · Struktur/Stil bis zum letzten Bild gelockt.');
