#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
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
if (!existsSync(allPromptsPath) || !existsSync(indexPath)) {
  console.error('Reel muss vor dem Flow-Autonomie-Lock bereits angelegt sein.');
  process.exit(1);
}

const AUTONOMY_BLOCK = `${FLOW_EXECUTION_MODE_MARKER}\n${FLOW_STRUCTURE_LOCK_MARKER}\n\nAUTONOMER GESAMTDURCHLAUF — VERBINDLICH\n- ARBEITE DAS GESAMTE BILDSET OHNE NUTZER-ZWISCHENSTOPP BIS ZUM LETZTEN BENÖTIGTEN BILD AB.\n- WARTE NIEMALS AUF "WEITER", "MACH WEITER", "OKAY", EINE BESTÄTIGUNG ODER EINE FREIGABE DES NUTZERS.\n- "WARTEN" BEDEUTET AUSSCHLIESSLICH: INTERN WARTEN, BIS DIE AKTUELLE BILDERZEUGUNG TECHNISCH VOLLSTÄNDIG ABGESCHLOSSEN IST. ES BEDEUTET NIEMALS, AUF DEN NUTZER ZU WARTEN.\n- NACH JEDEM BILD AUTOMATISCH: vollständig erzeugen → sofort exakt umbenennen → QA prüfen → bei Fehler dieselbe Bildnummer neu erzeugen → bei bestandener QA DIREKT mit dem nächsten benötigten Bild fortfahren.\n- Remotion-/Animationsnummern automatisch überspringen; dafür kein Bild erzeugen.\n- Nur bei einem echten technischen Hard-Blocker stoppen. Geschmacksfragen, Zwischenfreigaben oder fehlendes "weiter" sind KEINE Stop-Gründe.\n- DIESE STRUKTUR, REIHENFOLGE, DATEINAMENLOGIK, BILDWELT, MATERIALLOGIK, FARBROLLEN, LICHTLOGIK UND QUALITÄTSREGELN BIS ZUM LETZTEN BILD KONSEQUENT BEIBEHALTEN.\n- Keine Stiländerung, keine neue Bildwelt und keine abweichende Prompt-Struktur mitten im Durchlauf. Jede Szene bekommt eine frische Komposition INNERHALB derselben festgeschriebenen Welt.\n`;

let master = readFileSync(allPromptsPath, 'utf8');
if (!master.includes(FLOW_EXECUTION_MODE_MARKER)) {
  master = `${AUTONOMY_BLOCK}\n${master}`;
} else {
  const blockStart = master.indexOf(FLOW_EXECUTION_MODE_MARKER);
  const firstContentMarker = master.indexOf('\n\n', blockStart);
  if (blockStart === 0 && firstContentMarker !== -1 && !master.includes('AUTONOMER GESAMTDURCHLAUF — VERBINDLICH')) {
    master = `${AUTONOMY_BLOCK}\n${master.slice(firstContentMarker + 2)}`;
  }
}

// Alte Formulierungen dürfen nur das interne Warten auf die aktuelle Generierung meinen.
master = master
  .replaceAll('3. Vollständig warten.', '3. INTERN warten, bis dieses eine Bild vollständig erzeugt ist — niemals auf Nutzerfreigabe warten.')
  .replaceAll('3. Warte, bis dieses eine Bild vollständig erzeugt ist.', '3. Warte INTERN, bis dieses eine Bild vollständig erzeugt ist — niemals auf Nutzerfreigabe warten.')
  .replaceAll('7. Erst nach bestandener QA das nächste Bild.', '7. Nach bestandener QA AUTOMATISCH und ohne Nutzer-Zwischenfreigabe mit dem nächsten benötigten Bild fortfahren.')
  .replaceAll('7. Erst nach bestandener QA darf der nächste Bildblock beginnen.', '7. Nach bestandener QA beginnt der nächste benötigte Bildblock AUTOMATISCH und ohne Nutzer-Zwischenfreigabe.');
writeFileSync(allPromptsPath, master, 'utf8');

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.googleFlow = {
  ...(index.googleFlow ?? {}),
  executionModeId: FLOW_EXECUTION_MODE_ID,
  autonomousFullRun: true,
  userContinueSignalForbidden: true,
  userApprovalBetweenImagesForbidden: true,
  internalWaitForGenerationOnly: true,
  autoContinueAfterQa: true,
  hardBlockerOnlyStop: true,
  structureLockId: FLOW_STRUCTURE_LOCK_ID,
  preserveStructureThroughLastImage: true,
  preserveStyleThroughLastImage: true,
};
writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

console.log('✓ Google-Flow-Autonomie-Lock gesetzt.');
console.log('  Gesamtes Bildset ohne Nutzer-Zwischenstopps · internes Warten nur auf Generierung · Struktur/Stil bis zum letzten Bild gesperrt.');
