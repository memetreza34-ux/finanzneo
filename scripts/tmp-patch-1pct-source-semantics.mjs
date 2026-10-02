#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve('reels/2026-09-28_bis_2026-10-04/freitag/reel-01_1-prozent-kosten-test');
const indexPath=resolve(root,'03-szenen/scene-index.json');
const index=JSON.parse(readFileSync(indexPath,'utf8'));
for(const scene of index.scenes??[]){
  if(scene.type!=='animation') continue;
  delete scene.expectedVisual;
}
writeFileSync(indexPath,JSON.stringify(index,null,2)+'\n','utf8');

const patches={
  'scene-03':[
    ["<div style={{position:'absolute',left:260,top:155,width:420,height:470", "<div data-finanzneo-object=\"investment-folder\" style={{position:'absolute',left:260,top:155,width:420,height:470"]
  ],
  'scene-07':[
    ["<div style={{position:'absolute',left,top:150,width:300,height:500", "<div data-finanzneo-object=\"depot-vessel\" style={{position:'absolute',left,top:150,width:300,height:500"]
  ],
  'scene-11':[
    ["<div key={x} style={{position:'absolute',left:x-120,top:150+i*18,width:250,height:360", "<div data-finanzneo-object=\"cost-document\" key={x} style={{position:'absolute',left:x-120,top:150+i*18,width:250,height:360"],
    ["<div style={{position:'absolute',left:lensX-82,top:252,width:164,height:164", "<div data-finanzneo-object=\"magnifying-glass\" style={{position:'absolute',left:lensX-82,top:252,width:164,height:164"]
  ]
};
for(const [sceneId,repls] of Object.entries(patches)){
  const path=resolve(root,`03-szenen/EINZELNE-SZENEN/${sceneId}/animation.tsx`);
  let source=readFileSync(path,'utf8');
  for(const [from,to] of repls){
    if(!source.includes(from)) throw new Error(`${sceneId}: erwartete Source-Stelle fehlt für semantic object marker.`);
    source=source.replace(from,to);
  }
  writeFileSync(path,source,'utf8');
}
console.log('✓ IMAGE xor ANIMATION bereinigt und gerenderte Custom-Hauptobjekte source-basiert markiert.');
