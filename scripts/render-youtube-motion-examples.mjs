#!/usr/bin/env node
import {mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const jobs=[
  ['YouTubeMotionInflation','01-inflation-kaufkraft.mp4'],
  ['YouTubeMotionETFNetwork','02-etf-netzwerk.mp4'],
  ['YouTubeMotionSubscriptions','03-abos-jahreskosten.mp4'],
];

const out='out/youtube-motion-v1';
mkdirSync(out,{recursive:true});

for(const [id,file] of jobs){
  console.log('\n▶ '+id);
  const r=spawnSync(
    process.platform==='win32'?'npx.cmd':'npx',
    ['remotion','render','src/index.ts',id,`${out}/${file}`,'--codec=h264','--crf=18'],
    {stdio:'inherit'}
  );
  if(r.status!==0) process.exit(r.status ?? 1);
}

console.log('\n✓ YouTube Motion V1 examples rendered.');
