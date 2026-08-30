#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {AUTONOMY_BLOCK, FLOW_AGENT_BLOCK} from './lib/flow-autonomy.mjs';

const root = resolve('reels/2026-08-31_bis_2026-09-06/dienstag/reel-02_konto-im-minus');
const promptPaths = [
  resolve(root, '03-szenen/alle-bildprompts.txt'),
  resolve(root, '03-szenen/00-cover/cover.txt'),
  ...['01','02','04','06','07','08','09','11','13'].map((id) => resolve(root, '03-szenen/EINZELNE-SZENEN/scene-' + id + '/bildprompt.txt')),
];

for (const path of promptPaths) {
  if (!existsSync(path)) throw new Error('Prompt fehlt: ' + path);
  let content = readFileSync(path, 'utf8');
  content = content.replaceAll('FLOW_AGENT_PROTOCOL: finanzneo-flow-agent-protocol-v1', 'FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1');
  writeFileSync(path, content, 'utf8');
}

const masterPath = resolve(root, '03-szenen/alle-bildprompts.txt');
let master = readFileSync(masterPath, 'utf8');

// Der individuelle Masterprompt darf den bewährten globalen Flow-Sicherheitsblock
// nicht ersetzen. Wir verwenden exakt die kanonischen Repo-Konstanten, damit
// Single-Job, Queue-Sperre, Rename+QA und kein Nutzer-„weiter“ identisch bleiben.
if (!master.includes('STRICT SINGLE-JOB STATE MACHINE — VERBINDLICH')) {
  master = `${AUTONOMY_BLOCK}${FLOW_AGENT_BLOCK}\n${master}`;
}

writeFileSync(masterPath, master, 'utf8');

console.log('✓ Tuesday Flow-Master nutzt wieder den kanonischen Repo-Single-Job-State-Machine-Block.');
