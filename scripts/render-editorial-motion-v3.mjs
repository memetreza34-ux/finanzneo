#!/usr/bin/env node
import {mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const jobs=[
  {id:'EditorialV3MortgageReset',file:'01-mortgage-reset',frames:210},
  {id:'EditorialV3InvestmentCrossroads',file:'02-investment-crossroads',frames:210},
  {id:'EditorialV3RecurringCosts',file:'03-recurring-costs',frames:210},
];

const out='out/editorial-motion-v3';
const stills=out+'/keyframes';
mkdirSync(stills,{recursive:true});

const run=(args)=>{
  const r=spawnSync(process.platform==='win32'?'npx.cmd':'npx',args,{stdio:'inherit'});
  if(r.status!==0) process.exit(r.status ?? 1);
};

for(const job of jobs){
  console.log('\n▶ MP4 '+job.id);
  run(['remotion','render','src/index.ts',job.id,`${out}/${job.file}.mp4`]);

  const checkpoints=[
    ['10',Math.round(job.frames*0.10)],
    ['35',Math.round(job.frames*0.35)],
    ['65',Math.round(job.frames*0.65)],
    ['90',Math.round(job.frames*0.90)],
  ];

  for(const [label,frame] of checkpoints){
    console.log(`  ▸ still ${label}% · frame ${frame}`);
    run([
      'remotion','still','src/index.ts',job.id,
      `${stills}/${job.file}-${label}.png`,
      '--frame='+frame,
    ]);
  }
}

console.log('\n✓ Editorial Motion V3: 3 MP4s + 12 QA keyframes rendered.');
