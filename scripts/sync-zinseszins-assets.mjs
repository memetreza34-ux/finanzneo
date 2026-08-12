#!/usr/bin/env node
import {copyFileSync,existsSync,mkdirSync,readdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {extname,resolve} from 'node:path';

const reelRoot=resolve('reels/2026-08-10_bis_2026-08-16/dienstag/reel-01_zinseszins-zeit');
const imageRoot=resolve(reelRoot,'03-szenen/00-ALLE-BILDER-HIER-REIN');
const audioRoot=resolve(reelRoot,'02-audio');
const indexPath=resolve(reelRoot,'03-szenen/scene-index.json');
const publicRoot=resolve('public/reels/zinseszins');
const manifestPath=resolve('src/reels/zinseszins/asset-manifest.json');
const imageExt=new Set(['.png','.jpg','.jpeg','.webp','.avif']);
const audioExt=new Set(['.wav','.mp3','.m4a','.aac']);

const blocked=(message)=>{
  console.error(`BLOCKED: ${message}`);
  process.exit(1);
};

if(!existsSync(indexPath))blocked(`scene-index.json fehlt: ${indexPath}`);
if(!existsSync(imageRoot))blocked(`Bilderordner fehlt: ${imageRoot}`);
if(!existsSync(audioRoot))blocked(`Audioordner fehlt: ${audioRoot}`);

const index=JSON.parse(readFileSync(indexPath,'utf8'));
const imageScenes=(index.scenes??[]).filter((scene)=>scene.type==='image');
if(imageScenes.length===0)blocked('scene-index.json enthält keine Bildszenen.');

const expected=imageScenes.map((scene)=>({id:scene.id,file:scene.googleFlowFileName}));
if (index.coverHeadline && index.coverHeadline.googleFlowFileName) {
  expected.push({id: 'cover', file: index.coverHeadline.googleFlowFileName});
}

for(const item of expected){
  if(!item.file)blocked(`${item.id}: googleFlowFileName fehlt im scene-index.json.`);
  const path=resolve(imageRoot,item.file);
  if(!existsSync(path))blocked(`Pflichtbild fehlt: ${path}`);
  if(!imageExt.has(extname(item.file).toLowerCase()))blocked(`Nicht unterstütztes Pflichtbild: ${path}`);
}

const actualImages=readdirSync(imageRoot).filter((name)=>imageExt.has(extname(name).toLowerCase()));
const expectedNames=new Set(expected.map((item)=>item.file));
const unexpected=actualImages.filter((name)=>!expectedNames.has(name));
if(unexpected.length)blocked(`Unerwartete Bilddatei(en) im Zielordner: ${unexpected.join(', ')}. Nur die in scene-index.json erwarteten Nutzerbilder sind erlaubt.`);

const audioFiles=readdirSync(audioRoot).filter((name)=>audioExt.has(extname(name).toLowerCase()));
if(audioFiles.length===0)blocked(`Finales Voiceover fehlt in ${audioRoot}`);
if(audioFiles.length>1)blocked(`02-audio muss genau eine finale Audiodatei enthalten; gefunden: ${audioFiles.join(', ')}`);

mkdirSync(publicRoot,{recursive:true});
mkdirSync(resolve('src/reels/zinseszins'),{recursive:true});

for(const old of readdirSync(publicRoot)){
  if(/^scene-\d{2}\./.test(old)||old.startsWith('voiceover.'))rmSync(resolve(publicRoot,old));
}

const manifest={audio:null};
for(const item of expected){
  const extension=extname(item.file).toLowerCase();
  const target=`${item.id}${extension}`;
  copyFileSync(resolve(imageRoot,item.file),resolve(publicRoot,target));
  manifest[item.id]=`reels/zinseszins/${target}`;
}

const audioExtension=extname(audioFiles[0]).toLowerCase();
const audioTarget=`voiceover${audioExtension}`;
copyFileSync(resolve(audioRoot,audioFiles[0]),resolve(publicRoot,audioTarget));
manifest.audio=`reels/zinseszins/${audioTarget}`;

writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`✓ ${expected.length} Pflichtbilder ausschließlich aus 00-ALLE-BILDER-HIER-REIN synchronisiert.`);
console.log('✓ Genau ein finales Voiceover ausschließlich aus 02-audio synchronisiert.');
