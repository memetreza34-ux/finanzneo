#!/usr/bin/env node
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,extname} from 'node:path';
const root=resolve('reels/2026-08-10_bis_2026-08-16/sonntag/reel-01_25-euro-mehr-sparrate');
const timing=JSON.parse(readFileSync(resolve(root,'04-caption/word-timings.json'),'utf8'));
const timeline=JSON.parse(readFileSync(resolve(root,'05-projektdateien/timeline.json'),'utf8'));
if(timing.timingStatus!=='final-audio-aligned'||!Array.isArray(timing.sentences)||!timing.sentences.length)throw new Error('BLOCKED: echte Wortzeiten fehlen.');
if(!Array.isArray(timeline.scenes)||timeline.scenes.length!==10||timeline.scenes.some(s=>!Number.isFinite(s.startFrame)||!Number.isFinite(s.durationFrames)||s.durationFrames<=0))throw new Error('BLOCKED: finale 10-Szenen-Timeline fehlt.');
for(let i=1;i<timeline.scenes.length;i++){const prev=timeline.scenes[i-1],cur=timeline.scenes[i];if(cur.startFrame!==prev.startFrame+prev.durationFrames)throw new Error(`BLOCKED: Timeline-Gap/Overlap vor ${cur.id}`);}
const audio=readdirSync(resolve(root,'02-audio')).filter(f=>['.wav','.mp3','.m4a','.aac'].includes(extname(f).toLowerCase()));if(audio.length!==1)throw new Error(`BLOCKED: genau ein finales Audio erwartet, gefunden ${audio.length}.`);
const words=[];for(const s of timing.sentences){const tokens=String(s.text).trim().split(/\s+/).filter(Boolean);if(!Array.isArray(s.frames)||s.frames.length!==tokens.length+1)throw new Error(`Ungültige Wortgrenzen ${s.id}`);tokens.forEach((word,i)=>words.push({word,start:s.frames[i]/30,end:s.frames[i+1]/30}));}
const runtime={status:'ready',sceneStarts:timeline.scenes.map(s=>s.startFrame),sceneDurations:timeline.scenes.map(s=>s.durationFrames),captionWords:words,audioSrc:`reels/25-euro-mehr-sparrate/voiceover${extname(audio[0]).toLowerCase()}`};
const serialized=JSON.stringify(runtime,null,2)+'\n';writeFileSync(resolve(root,'05-projektdateien/runtime-data.json'),serialized);writeFileSync(resolve('src/reels/sparrate25/runtime-data.json'),serialized);console.log('✓ V21 Runtime vorbereitet.');
