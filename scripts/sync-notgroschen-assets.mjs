#!/usr/bin/env node
import {copyFileSync,existsSync,mkdirSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {extname,resolve} from 'node:path';

const reelRoot=resolve('reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan');
const sourceRoot=resolve(reelRoot,'03-szenen/EINZELNE-SZENEN');
const audioRoot=resolve(reelRoot,'02-audio');
const publicRoot=resolve('public/reels/notgroschen');
const manifestPath=resolve('src/reels/notgroschen/asset-manifest.json');
const scenes=['scene-01','scene-02','scene-04','scene-06','scene-09','scene-10'];
const imageExt=new Set(['.png','.jpg','.jpeg','.webp','.avif']);
const audioExt=new Set(['.wav','.mp3','.m4a','.aac']);
mkdirSync(publicRoot,{recursive:true});
const manifest={fallback:'reels/notgroschen/fallback.svg',audio:null};let copied=0;
for(const scene of scenes){const dir=resolve(sourceRoot,scene);if(!existsSync(dir))throw new Error(`Szenenordner fehlt: ${dir}`);const files=readdirSync(dir).filter(name=>imageExt.has(extname(name).toLowerCase()));if(files.length>1)throw new Error(`${scene}: mehr als ein finales Bild.`);if(files.length===1){for(const old of readdirSync(publicRoot))if(old.startsWith(`${scene}.`))rmSync(resolve(publicRoot,old));const extension=extname(files[0]).toLowerCase();const target=`${scene}${extension}`;copyFileSync(resolve(dir,files[0]),resolve(publicRoot,target));manifest[scene]=`reels/notgroschen/${target}`;copied+=1;}else manifest[scene]=manifest.fallback;}
if(existsSync(audioRoot)){const files=readdirSync(audioRoot).filter(name=>audioExt.has(extname(name).toLowerCase()));if(files.length>1)throw new Error('02-audio darf nur eine finale Audiodatei enthalten.');if(files.length===1){for(const old of readdirSync(publicRoot))if(old.startsWith('voiceover.'))rmSync(resolve(publicRoot,old));const extension=extname(files[0]).toLowerCase();const target=`voiceover${extension}`;copyFileSync(resolve(audioRoot,files[0]),resolve(publicRoot,target));manifest.audio=`reels/notgroschen/${target}`;}}
writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`✓ ${copied} von 6 Bildern synchronisiert.`);console.log(manifest.audio?'✓ Voiceover synchronisiert.':'Hinweis: Voiceover fehlt noch.');
