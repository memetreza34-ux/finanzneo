#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve('reels/2026-08-10_bis_2026-08-16/mittwoch/reel-01_etf-vs-fonds-kosten-v2');
const timeline=JSON.parse(readFileSync(resolve(root,'05-projektdateien/timeline.json'),'utf8'));
const timings=JSON.parse(readFileSync(resolve(root,'04-caption/word-timings.json'),'utf8'));
const output=resolve('src/reels/etf-kosten-v2/runtime-data.json');
const stop=(message)=>{console.error(message);process.exit(1)};

if(timings.timingStatus!=='final-audio-aligned')stop('Final word alignment is required.');
if(!Array.isArray(timeline.scenes)||timeline.scenes.length!==10)stop('Timeline must contain exactly 10 scenes.');
const durations=timeline.scenes.map((scene)=>scene.finalDurationFrames);
if(durations.some((value)=>!Number.isFinite(value)||value<=0))stop('Final scene durations must be positive.');
if(!Array.isArray(timings.units)||timings.units.length===0)stop('Caption units are required.');

for(const [index,unit] of timings.units.entries()){
 if(!Number.isFinite(unit.startFrame)||!Number.isFinite(unit.endFrame)||unit.endFrame<=unit.startFrame)stop(`Invalid caption bounds at ${index}.`);
 if(!Array.isArray(unit.words)||unit.words.length===0||unit.words.length>12)stop(`Invalid caption word count at ${index}.`);
 const text=unit.words.map((word)=>word.text).join(' ');
 if(text.length>68)stop(`Caption ${index} is too long.`);
 for(const word of unit.words){
  if(typeof word.text!=='string'||!Number.isFinite(word.startFrame)||!Number.isFinite(word.endFrame)||word.endFrame<=word.startFrame)stop(`Invalid word timing at ${index}.`);
 }
}

const data={status:'final-audio-aligned',durations,captionUnits:timings.units};
writeFileSync(output,`${JSON.stringify(data,null,2)}\n`,'utf8');
console.log(`Runtime ready: ${durations.reduce((a,b)=>a+b,0)} frames, ${timings.units.length} caption units.`);
