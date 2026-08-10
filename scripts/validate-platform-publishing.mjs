#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const args=process.argv.slice(2);
const target=args.find((arg)=>!arg.startsWith('--'));
const requireFinal=args.includes('--final')||args.includes('--require-final-assets');
if(!target){
  console.error('Nutzung: node scripts/validate-platform-publishing.mjs <Reel-Projektordner> [--final]');
  process.exit(1);
}

const root=resolve(target);
const indexPath=resolve(root,'03-szenen/scene-index.json');
const errors=[];
const warnings=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};

assert(existsSync(indexPath),'03-szenen/scene-index.json fehlt.');
if(!existsSync(indexPath)){
  console.error('\nPublishing-Vertrag verletzt:\n- 03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index=JSON.parse(readFileSync(indexPath,'utf8'));
if(index.imageWorld?.legacyAssetSet===true){
  console.log('✓ Legacy-Reel: neue Universal-Caption-Struktur wird nicht rückwirkend erzwungen.');
  process.exit(0);
}

const publishing=index.platformPublishing;
const captionRelative='04-caption/caption.txt';
const captionPath=resolve(root,captionRelative);
const forbiddenFiles=['instagram-reels.txt','tiktok.txt','facebook-reels.txt','snapchat.txt','youtube-shorts.txt'];
const expectedPlatforms=['instagram-reels','tiktok','facebook-reels','snapchat'];

assert(publishing&&typeof publishing==='object','scene-index.json benötigt platformPublishing.');
assert(publishing?.directory==='04-caption','platformPublishing.directory muss 04-caption sein.');
assert(publishing?.universalCaption===captionRelative,`platformPublishing.universalCaption muss auf ${captionRelative} zeigen.`);
assert(publishing?.sameCaptionForAllReelPlatforms===true,'Dieselbe Caption muss für alle Reel-Plattformen gelten.');
assert(publishing?.separatePlatformCaptionsForbidden===true,'Separate Plattform-Captions müssen ausdrücklich verboten sein.');
assert(Number(publishing?.hashtagCount)===5,'platformPublishing.hashtagCount muss exakt 5 sein.');
assert(Array.isArray(publishing?.platforms),'platformPublishing.platforms muss ein Array sein.');
if(Array.isArray(publishing?.platforms)){
  assert(publishing.platforms.length===expectedPlatforms.length&&expectedPlatforms.every((p)=>publishing.platforms.includes(p)),'platformPublishing.platforms muss Instagram Reels, TikTok, Facebook Reels und Snapchat enthalten.');
}
for(const oldKey of ['masterCaption','instagramReels','tiktok','facebookReels','snapchat','youtubeShorts']){
  assert(!Object.prototype.hasOwnProperty.call(publishing??{},oldKey),`Altes platformPublishing-Feld ist verboten: ${oldKey}.`);
}
for(const file of forbiddenFiles){
  assert(!existsSync(resolve(root,'04-caption',file)),`Verbotene alte Publishing-Datei vorhanden: 04-caption/${file}`);
}
assert(existsSync(captionPath),`${captionRelative} fehlt.`);
assert(existsSync(resolve(root,'04-caption/word-timings.json')),'04-caption/word-timings.json fehlt.');

if(existsSync(captionPath)){
  const content=readFileSync(captionPath,'utf8').trim();
  const hashtags=content.match(/#[A-Za-z0-9ÄÖÜäöüß_]+/g)??[];
  const uniqueHashtags=new Set(hashtags.map((tag)=>tag.toLocaleLowerCase('de-DE')));
  const hasTemplateMarkers=/\[[^\]]+\]/.test(content)||/^(CAPTION|CTA|HASHTAGS|REEL-TEXT)\s*:/im.test(content);
  const spamTag=hashtags.some((tag)=>['#fyp','#foryou','#viral'].includes(tag.toLowerCase()));

  if(requireFinal){
    assert(content.length>0,'Finale universelle Caption ist leer.');
    assert(!hasTemplateMarkers,'Finale universelle Caption enthält noch Template-Platzhalter oder Abschnittsmarker.');
    assert(hashtags.length===5,`Finale universelle Caption benötigt exakt 5 Hashtags, gefunden: ${hashtags.length}.`);
    assert(uniqueHashtags.size===5,'Die 5 Hashtags müssen eindeutig sein.');
    assert(!spamTag,'Irrelevante Viral-/FYP-Spam-Hashtags sind im finalen Standard verboten.');
  }else{
    if(hasTemplateMarkers)warnings.push('caption.txt enthält noch Template-Platzhalter/Marker.');
    if(hashtags.length!==5)warnings.push(`caption.txt sollte final exakt 5 Hashtags enthalten; aktuell ${hashtags.length}.`);
    if(uniqueHashtags.size!==hashtags.length)warnings.push('caption.txt enthält doppelte Hashtags.');
  }
}

if(errors.length){
  console.error('\nPublishing-Vertrag verletzt:\n');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Universal-Caption-Vertrag erfüllt.');
console.log('  Eine caption.txt für Instagram Reels · TikTok · Facebook Reels · Snapchat');
console.log('  Final: exakt 5 relevante, eindeutige Hashtags · keine separaten Plattformdateien');
for(const warning of warnings)console.log(`  Hinweis: ${warning}`);
