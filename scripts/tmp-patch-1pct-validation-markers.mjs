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
if (!/COVER = SZENE 01/i.test(master)) master = 'COVER = SZENE 01\n'+master;
if (!/KEIN separates Cover erzeugen/i.test(master)) master = 'KEIN separates Cover erzeugen.\n'+master;
if (!/KEIN Bild 00 erzeugen/i.test(master)) master = 'KEIN Bild 00 erzeugen.\n'+master;
writeFileSync(masterPath,master.endsWith('\n')?master:master+'\n','utf8');

const coverHookMarker = 'FUTURE_COVER_HOOK: finanzneo-cover-hook-v3\n';
const coverPath = resolve(root,'03-szenen/00-cover/cover.txt');
let cover = readFileSync(coverPath,'utf8');
const aliasHeader = 'COVER_ALIAS: SZENE 01\nKEIN SEPARATER BILDJOB.\nNo separate cover generation.\nno Bild 00.\n';
if (!/KEIN SEPARATER BILDJOB/i.test(cover)) cover = aliasHeader + cover;
if (!cover.includes('finanzneo-cover-hook-v3')) cover = coverHookMarker + cover;
writeFileSync(coverPath,cover.endsWith('\n')?cover:cover+'\n','utf8');

const scene01Path = resolve(root,'03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt');
let scene01 = readFileSync(scene01Path,'utf8');
if (!scene01.includes('finanzneo-cover-hook-v3')) scene01 = coverHookMarker + scene01;
writeFileSync(scene01Path,scene01.endsWith('\n')?scene01:scene01+'\n','utf8');

console.log('✓ Source-contract, scene-01 cover and Cover-Hook-V3 markers normalized.');
