#!/usr/bin/env node
// Derive 10/35/65/90% review frames from the RENDERED MP4, not from a separate preview.
// Fail closed on missing frames, duplicate contact sheets, ffmpeg errors or unexpected geometry.
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

const movie='out/youtube-light-motion-v3/showcase.mp4';
const root='out/youtube-light-motion-v3/qa';
const percentages=[10,35,65,90];
const fps=30;
const sceneFrames=165;
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

const run=(args)=>{
  const result=spawnSync('ffmpeg',args,{stdio:'inherit'});
  if(result.error || result.status!==0) {
    throw new Error('ffmpeg failed: '+args.join(' ')+' (exit '+String(result.status)+', error '+(result.error?.message ?? 'none')+')');
  }
};
const required=(p)=>{
  if(!existsSync(p)||statSync(p).size<1000){
    throw new Error('QA image missing or suspiciously small: '+p);
  }
};
if(!existsSync(movie))throw new Error('Render video first: '+movie);
mkdirSync(root,{recursive:true});

const scenePositions=percentages.map(pct=>Math.round((sceneFrames-1)*pct/100));
const frames=scenes.flatMap((_,index)=>scenePositions.map(offset=>index*sceneFrames+offset));
// Single decode pass through the actual rendered video (8 scenes × 4 checkpoints = 32 PNGs).
const expression=frames.map(frame=>'eq(n\\,'+frame+')').join('+');
run(['-y','-loglevel','error','-i',movie,
  '-vf','select='+expression,'-vsync','0',join(root,'frame-%02d.png')]);

for(let i=0;i<frames.length;i++)required(join(root,'frame-'+String(i+1).padStart(2,'0')+'.png'));

const checks=[];
for(let p=0;p<percentages.length;p++){
  const inputs=scenes.map((_,i)=>join(root,'frame-'+String(i*4+p+1).padStart(2,'0')+'.png'));
  const path=join(root,'contact-'+percentages[p]+'.png');
  const args=['-y','-loglevel','error'];
  inputs.forEach(input=>args.push('-i',input));
  const scaled=inputs.map((_,i)=>'['+i+':v]scale=960:540[v'+i+']').join(';');
  const streams=inputs.map((_,i)=>'[v'+i+']').join('');
  const layouts=inputs.map((_,i)=>(i%2*960)+'_'+(Math.floor(i/2)*540)).join('|');
  args.push('-filter_complex',scaled+';'+streams+'xstack=inputs=8:layout='+layouts+'[out]',
    '-map','[out]','-frames:v','1',path);
  run(args);
  required(path);
  const digest=createHash('sha256').update(readFileSync(path)).digest('hex');
  checks.push({percent:percentages[p],localFrame:scenePositions[p],
    path,sha256:digest,fileSize:statSync(path).size});
}

if(new Set(checks.map(check=>check.sha256)).size!==checks.length){
  throw new Error('QA failed: two or more checkpoint contact sheets are byte-identical.');
}
writeFileSync(join(root,'manifest.json'),JSON.stringify({
  version:2,sourceVideo:movie,
  purpose:'Visual review of exact movie frames; no aesthetic auto-approval',
  fps,sceneFrames,sourceFrameIndices:frames,
  contactWidth:1920,contactHeight:2160,
  scenes:scenes.map(([compositionId,mechanism])=>({compositionId,mechanism})),
  checks,
},null,2)+'\n');
console.log('Verified 32 unique-position movie snapshots and 4 non-identical review contacts.');
