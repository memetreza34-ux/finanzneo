#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

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
const required = [
  'FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1',
  'FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3',
  'FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1',
  'MAX_CONCURRENT_GENERATIONS = 1',
];
const prefix = required.filter((marker) => !master.includes(marker)).join('\n');
if (prefix) master = prefix + '\n\n' + master;
writeFileSync(masterPath, master, 'utf8');

console.log('✓ Tuesday Flow-Master auf kanonisches Single-Job-Protokoll korrigiert.');
