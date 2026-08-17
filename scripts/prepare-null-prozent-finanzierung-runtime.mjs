import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();
const reel=path.join(root,'reels/2026-08-17_bis_2026-08-23/montag/reel-01_0-prozent-finanzierung');
const timingPath=path.join(reel,'04-caption/word-timings.json');const timelinePath=path.join(reel,'05-projektdateien/timeline.json');
const timing=JSON.parse(fs.readFileSync(timingPath,'utf8'));const timeline=JSON.parse(fs.readFileSync(timelinePath,'utf8'));
if(timing.timingStatus!=='final-audio-aligned'||!Array.isArray(timing.words)||!timing.words.length)throw new Error('BLOCKED: echte final-audio-aligned Wortzeiten fehlen.');
if(timeline.status!=='ready'||!Array.isArray(timeline.sceneStarts)||!Array.isArray(timeline.sceneDurations)||timeline.sceneStarts.length!==10||timeline.sceneDurations.length!==10)throw new Error('BLOCKED: finale 10-Szenen-Timeline fehlt.');
for(let i=0;i<10;i++){if(!(timeline.sceneDurations[i]>0))throw new Error(`BLOCKED: Szene ${i+1} hat keine positive Dauer.`);if(i>0&&timeline.sceneStarts[i]!==timeline.sceneStarts[i-1]+timeline.sceneDurations[i-1])throw new Error(`BLOCKED: Timeline-Lücke/Overlap vor Szene ${i+1}.`);}
const publicDir=path.join(root,'public/reels/0-prozent-finanzierung');const audioCandidates=fs.existsSync(publicDir)?fs.readdirSync(publicDir).filter(n=>n.startsWith('voiceover.')):[];if(audioCandidates.length!==1)throw new Error('BLOCKED: synchronisiertes finales Voiceover fehlt oder ist mehrdeutig.');
const runtime={status:'ready',audioSrc:`reels/0-prozent-finanzierung/${audioCandidates[0]}`,sceneStarts:timeline.sceneStarts,sceneDurations:timeline.sceneDurations,captionWords:timing.words};
fs.writeFileSync(path.join(root,'src/reels/null-prozent-finanzierung/runtime-data.json'),JSON.stringify(runtime,null,2)+'\n');console.log('Runtime für 0%-Finanzierung ist bereit.');
