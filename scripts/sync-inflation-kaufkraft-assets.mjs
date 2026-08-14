#!/usr/bin/env node
import {copyFileSync,existsSync,mkdirSync,readdirSync} from 'node:fs';
import {extname,resolve} from 'node:path';

const root=resolve('reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft');
const inbox=resolve(root,'03-szenen/00-ALLE-BILDER-HIER-REIN');
const out=resolve('public/reels/inflation-kaufkraft'); mkdirSync(out,{recursive:true});
const images={
  'Bild 00 - Inflation Kaufkraft Cover.png':'scene-00.png',
  'Bild 01 - 10000 Euro heute.png':'scene-01.png',
  'Bild 04 - Kontostand bleibt gleich.png':'scene-04.png',
  'Bild 07 - Einkaufskorb wird kleiner.png':'scene-07.png',
  'Bild 10 - Kaufkraft statt Kontostand.png':'scene-10.png',
};
for(const [src,dst] of Object.entries(images)){const from=resolve(inbox,src);if(!existsSync(from))throw new Error(`BLOCKED: fehlt ${from}`);copyFileSync(from,resolve(out,dst));}
const audioDir=resolve(root,'02-audio'); const allowed=new Set(['.wav','.mp3','.m4a','.aac']); const audio=readdirSync(audioDir).filter(f=>allowed.has(extname(f).toLowerCase()));
if(audio.length!==1)throw new Error(`BLOCKED: genau ein finales Audio erwartet, gefunden ${audio.length}.`);
copyFileSync(resolve(audioDir,audio[0]),resolve(out,`voiceover${extname(audio[0]).toLowerCase()}`));
console.log('✓ Inflation/Kaufkraft Assets synchronisiert.');
