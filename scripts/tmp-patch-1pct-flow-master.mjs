#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const path=resolve('reels/2026-09-28_bis_2026-10-04/freitag/reel-01_1-prozent-kosten-test/03-szenen/alle-bildprompts.txt');
let source=readFileSync(path,'utf8');
const block=`FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
FLOW_STRUCTURE_LOCK: finanzneo-flow-structure-lock-v2
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1

STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH
DIES IST KEIN BATCH-AUFTRAG.
MAXIMAL 1 LAUFENDER BILDGENERIERUNGSJOB GLEICHZEITIG.
ALLE SPÄTEREN BILDBLÖCKE SIND GESPERRT, bis das aktuelle Bild vollständig zurückgegeben, exakt umbenannt und per QA geprüft wurde.

AKTIVER ABLAUF PRO BILD:
1. Nur den aktuell freigegebenen Bildblock lesen und ausführen.
2. Genau einen Bildgenerierungsjob starten und intern auf dessen Ergebnis warten.
3. Das Ergebnis sofort exakt umbenennen.
4. Das aktuelle Ergebnis per QA prüfen.
5. Nur bei PASS den nächsten Bildblock freischalten und automatisch fortfahren.
6. Bei FAIL ausschließlich dieselbe Bildnummer neu erzeugen.
7. WARTE NIEMALS AUF "WEITER" oder eine Zwischenfreigabe des Nutzers.

AUSDRÜCKLICH VERBOTEN:
- mehrere Bilder in einem Generierungsaufruf erzeugen
- mehrere Bildprompts zusammenfassen
- Bilder vorab in eine Queue stellen
- alle Bilder zuerst erzeugen und erst danach gesammelt umbenennen
- Galerie oder Kontaktbogen als Ersatz für die einzelnen finalen Bilder

`;
if(!source.includes('STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH')) source=block+source;
writeFileSync(path,source.endsWith('\n')?source:source+'\n','utf8');
console.log('✓ Strict Single-Job Flow master contract restored.');
