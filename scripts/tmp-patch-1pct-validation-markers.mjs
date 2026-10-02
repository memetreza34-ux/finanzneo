#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve('reels/2026-09-28_bis_2026-10-04/freitag/reel-01_1-prozent-kosten-test');
const index = JSON.parse(readFileSync(resolve(root,'03-szenen/scene-index.json'),'utf8'));
const paths = [
  '03-szenen/alle-bildprompts.txt',
  '03-szenen/bildwelt.txt',
  '03-szenen/00-cover/cover.txt',
  ...index.scenes.filter((s)=>s.type==='image').map((s)=>'03-szenen/'+String(s.planFile).replace(/^03-szenen\//,'')),
];
for (const rel of paths) {
  const path = resolve(root,rel);
  if (!existsSync(path)) continue;
  let source = readFileSync(path,'utf8');
  if (!source.toLowerCase().includes('deep black background')) {
    source += '\nBACKGROUND_LOCK: Use one seamless deep black background.\n';
  }
  writeFileSync(path,source.endsWith('\n')?source:source+'\n','utf8');
}
const masterPath = resolve(root,'03-szenen/alle-bildprompts.txt');
let master = readFileSync(masterPath,'utf8');
if (!/MAX_CONCURRENT_GENERATIONS\s*=\s*1/.test(master)) master = 'MAX_CONCURRENT_GENERATIONS=1\n'+master;
if (!master.includes('00-ALLE-BILDER-HIER-REIN')) master = 'FINAL_IMAGE_DIRECTORY: 03-szenen/00-ALLE-BILDER-HIER-REIN/\n'+master;
writeFileSync(masterPath,master.endsWith('\n')?master:master+'\n','utf8');
console.log('✓ Source-contract prompt markers normalized.');
