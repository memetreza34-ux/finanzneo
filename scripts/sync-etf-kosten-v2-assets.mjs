#!/usr/bin/env node
import {copyFileSync,existsSync,mkdirSync,readdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {extname,resolve} from 'node:path';

const reelRoot=resolve('reels/2026-08-10_bis_2026-08-16/mittwoch/reel-01_etf-vs-fonds-kosten-v2');
const imageRoot=resolve(reelRoot,'03-szenen/00-ALLE-BILDER-HIER-REIN');
const audioRoot=resolve(reelRoot,'02-audio');
const indexPath=resolve(reelRoot,'03-szenen/scene-index.json');
const publicRoot=resolve('public/reels/etf-kosten-v2');
const manifestPath=resolve('src/reels/etf-kosten-v2/asset-manifest.json');
const imageExt=new Set(['.png','.jpg','.jpeg','.webp','.avif']);
const audioExt=new Set(['.wav','.mp3','.m4a','.aac']);
const fail=(message)=>{console.error(`BLOCKED: ${message}`);process.exit(1)};

if(!existsSync(indexPath))fail(`scene-index.json fehlt: ${indexPath}`);
if(!existsSync(imageRoot))fail(`Bilderordner fehlt: ${imageRoot}`);
if(!existsSync(audioRoot))fail(`Audioordner fehlt: ${audioRoot}`);

const index=JSON.parse(readFileSync(indexPath,'utf8'));
const expected=(index.scenes??[]).filter((s)=>s.type==='image').map((s)=>({id:s.id,file:s.googleFlowFileName}));
if(index.coverHeadline?.googleFlowFileName)expected.push({id:'cover',file:index.coverHeadline.googleFlowFileName});

for(const item of expected){
 if(!item.file)fail(`${item.id}: Dateiname fehlt.`);
 const p=resolve(imageRoot,item.file);
 if(!existsSync(p))fail(`Pflichtbild fehlt: ${p}`);
 if(!imageExt.has(extname(item.file).toLowerCase()))fail(`Bildformat nicht unterstützt: ${p}`);
}

const actualImages=readdirSync(imageRoot).filter((n)=>imageExt.has(extname(n).toLowerCase()));
const expectedNames=new Set(expected.map((x)=>x.file));
const unexpected=actualImages.filter((n)=>!expectedNames.has(n));
if(unexpected.length)fail(`Unerwartete Bilder im Zielordner: ${unexpected.join(', ')}`);

const audioFiles=readdirSync(audioRoot).filter((n)=>audioExt.has(extname(n).toLowerCase()));
if(audioFiles.length!==1)fail(`02-audio benötigt genau eine finale Audiodatei; gefunden: ${audioFiles.join(', ')||'keine'}`);

mkdirSync(publicRoot,{recursive:true});
for(const old of readdirSync(publicRoot)){if(/^(scene-\d{2}|cover|voiceover)\./.test(old))rmSync(resolve(publicRoot,old))}

const manifest={audio:null};
for(const item of expected){const ext=extname(item.file).toLowerCase();const target=`${item.id}${ext}`;copyFileSync(resolve(imageRoot,item.file),resolve(publicRoot,target));manifest[item.id]=`reels/etf-kosten-v2/${target}`}
const audioExtName=extname(audioFiles[0]).toLowerCase();
const audioTarget=`voiceover${audioExtName}`;
copyFileSync(resolve(audioRoot,audioFiles[0]),resolve(publicRoot,audioTarget));
manifest.audio=`reels/etf-kosten-v2/${audioTarget}`;
writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`✓ ${expected.length} Bilder aus dem Ziel-Reel synchronisiert.`);
console.log('✓ Genau ein finales Voiceover synchronisiert.');
