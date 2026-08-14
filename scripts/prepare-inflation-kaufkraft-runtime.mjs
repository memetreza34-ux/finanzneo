#!/usr/bin/env node
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {extname,resolve} from 'node:path';

const root=resolve('reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft');
const timing=JSON.parse(readFileSync(resolve(root,'04-caption/word-timings.json'),'utf8'));
const timeline=JSON.parse(readFileSync(resolve(root,'05-projektdateien/timeline.json'),'utf8'));

if(timing.timingStatus!=='final-audio-aligned'||!Array.isArray(timing.sentences)||!timing.sentences.length){
  throw new Error('BLOCKED: echte final-audio-aligned Wortzeiten fehlen.');
}
if(!Array.isArray(timeline.scenes)||timeline.scenes.length!==10||timeline.scenes.some(s=>!Number.isFinite(s.startFrame)||!Number.isFinite(s.durationFrames)||s.durationFrames<=0)){
  throw new Error('BLOCKED: finale 10-Szenen-Timeline ist nicht aufgelöst.');
}

const audioDir=resolve(root,'02-audio');
const allowed=new Set(['.wav','.mp3','.m4a','.aac']);
const audio=readdirSync(audioDir).filter(f=>allowed.has(extname(f).toLowerCase()));
if(audio.length!==1){
  throw new Error(`BLOCKED: erwartet genau ein finales Audio in ${audioDir}, gefunden ${audio.length}.`);
}

const words=[];
for(const sentence of timing.sentences){
  const tokens=String(sentence.text).trim().split(/\s+/).filter(Boolean);
  if(!Array.isArray(sentence.frames)||sentence.frames.length!==tokens.length+1){
    throw new Error(`Ungültige Wortgrenzen: ${sentence.id}`);
  }
  tokens.forEach((word,i)=>words.push({word,start:sentence.frames[i]/30,end:sentence.frames[i+1]/30}));
}

const runtime={
  status:'ready',
  sceneStarts:timeline.scenes.map(s=>s.startFrame),
  sceneDurations:timeline.scenes.map(s=>s.durationFrames),
  captionWords:words,
  audioSrc:`reels/inflation-kaufkraft/voiceover${extname(audio[0]).toLowerCase()}`,
};

const serialized=JSON.stringify(runtime,null,2)+'\n';
writeFileSync(resolve(root,'05-projektdateien/runtime-data.json'),serialized);
writeFileSync(resolve('src/reels/inflation/runtime-data.json'),serialized);
console.log('✓ Inflation/Kaufkraft Runtime-Daten für Projekt und finale Composition vorbereitet.');
