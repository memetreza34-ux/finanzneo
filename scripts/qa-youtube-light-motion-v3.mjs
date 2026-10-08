#!/usr/bin/env node
// Remotion visual checkpoints: rendered 10/35/65/90% for every V3 scene.
// These are review contact sheets, not claims of automatic aesthetic approval.
import {existsSync, mkdirSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

const root='out/youtube-light-motion-v3/qa';
const percentages=[10,35,65,90];
const scenes=[
  ['RankRaceV3','reorder'],
  ['DonutBuildV3','progressive-arc'],
  ['TrendTraceV3','trace'],
  ['FlowTokensV3','follow-path'],
  ['HeatmapFillV3','data-fill'],
  ['SortableTableV3','layout-reflow'],
  ['WaffleGrowV3','grid-fill'],
  ['DeltaCompareV3','compare-delta'],
];
mkdirSync(root,{recursive:true});
const checks=[];
for(let index=0;index<percentages.length;index++){
  const pct=percentages[index];
  const path=join(root,'contact-'+pct+'.png');
  const args=['remotion','still','src/index.ts','YouTubeLightMotionV3QA',path,'--frame='+index];
  const runner=process.platform==='win32'?'npx.cmd':'npx';
  console.log('Rendering '+pct+'% QA sheet ...');
  const result=spawnSync(runner,args,{stdio:'inherit'});
  if(result.status!==0){
    console.error('Failed at '+pct+'%.');
    process.exit(result.status ?? 1);
  }
  if(!existsSync(path)||statSync(path).size<1000){
    console.error('QA still is missing or suspiciously small: '+path);
    process.exit(1);
  }
  checks.push({percent:pct,path,fileSize:statSync(path).size});
}
writeFileSync(join(root,'manifest.json'),JSON.stringify({
  version:1,
  purpose:'Manual visual inspection of 10/35/65/90 percent checkpoints',
  width:1920,
  height:2160,
  scenes:scenes.map(([compositionId,mechanism])=>({compositionId,mechanism})),
  checks,
},null,2)+'\n');
console.log('Four verified QA contact sheets written to '+root);
