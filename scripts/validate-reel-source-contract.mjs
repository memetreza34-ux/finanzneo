#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {extname, resolve} from 'node:path';

const args=process.argv.slice(2);
const target=args.find((arg)=>!arg.startsWith('--'));
const requireFinal=args.includes('--final')||args.includes('--require-final-assets');
if(!target){
  console.error('Nutzung: npm run reel:validate -- <Reel-Projektordner> [--final]');
  process.exit(1);
}

const root=resolve(target);
const sceneRoot=resolve(root,'03-szenen/EINZELNE-SZENEN');
const indexPath=resolve(root,'03-szenen/scene-index.json');
const allPromptsPath=resolve(root,'03-szenen/alle-bildprompts.txt');
const imageInbox=resolve(root,'03-szenen/00-ALLE-BILDER-HIER-REIN');
const audioRoot=resolve(root,'02-audio');
const errors=[];
const warnings=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};
const imageExt=new Set(['.png','.jpg','.jpeg','.webp','.avif']);
const audioExt=new Set(['.wav','.mp3','.m4a','.aac']);

for(const [path,message] of [
  [sceneRoot,'03-szenen/EINZELNE-SZENEN fehlt.'],
  [indexPath,'03-szenen/scene-index.json fehlt.'],
  [allPromptsPath,'03-szenen/alle-bildprompts.txt fehlt.'],
  [resolve(root,'03-szenen/bildwelt.txt'),'03-szenen/bildwelt.txt fehlt.'],
  [imageInbox,'03-szenen/00-ALLE-BILDER-HIER-REIN fehlt.'],
  [resolve(root,'04-caption/caption.txt'),'04-caption/caption.txt fehlt.'],
  [resolve(root,'04-caption/word-timings.json'),'04-caption/word-timings.json fehlt.'],
]) assert(existsSync(path),message);
assert(!existsSync(resolve(root,'03-szenen/alle-motionprompts.txt')),'alle-motionprompts.txt ist verboten.');

const walk=(directory)=>{
  if(!existsSync(directory))return;
  for(const entry of readdirSync(directory)){
    const path=resolve(directory,entry);
    if(statSync(path).isDirectory())walk(path);
    else if(entry.toLowerCase()==='motionprompt.txt')errors.push(`Verbotene Datei: ${path}`);
    else if(entry.toLowerCase()==='placeholder.svg'&&path.startsWith(sceneRoot))errors.push(`Platzhalter im Szenenordner verboten: ${path}`);
  }
};
walk(root);

const containsObsoleteZoning=(text)=>['top 15 percent','top 15%','bottom 25 percent','bottom 25%','middle 60 percent','middle 60%','central 64 percent'].some((needle)=>text.toLowerCase().includes(needle));
const isAscending=(frames)=>frames.every((value,index)=>index===0||value>frames[index-1]);

if(existsSync(sceneRoot)&&existsSync(indexPath)){
  const index=JSON.parse(readFileSync(indexPath,'utf8'));
  const legacy=index.imageWorld?.legacyAssetSet===true;
  const directories=readdirSync(sceneRoot).filter((entry)=>/^scene-\d{2}$/.test(entry)&&statSync(resolve(sceneRoot,entry)).isDirectory()).sort();

  assert(Array.isArray(index.scenes),'scene-index.json benötigt scenes[].');
  assert(index.sceneCount===directories.length,'sceneCount stimmt nicht mit den Szenenordnern überein.');
  assert(index.imageWorld?.id==='finanzneo-connected-studio-v3','FinanzNeo Image World ID fehlt.');
  assert(index.imageWorld?.referencePromptFile==='03-szenen/bildwelt.txt','referencePromptFile ist falsch.');
  assert(index.timelineRules?.cutsFollowSentenceStarts===true,'Szenenschnitte müssen Satzanfängen folgen.');
  assert(index.timelineRules?.equalLengthScenesForbiddenByDefault===true,'Starre gleich lange Szenen müssen standardmäßig verboten sein.');

  if(!legacy){
    assert(index.imageWorld?.seamlessSingleBackgroundRequired===true,'Ein nahtloser Hintergrund muss verbindlich sein.');
    assert(index.imageWorld?.percentageZonesForbidden===true,'Prozent-Zonen müssen ausdrücklich verboten sein.');
    assert(index.imageWorld?.backgroundBandsForbidden===true,'Hintergrundbänder müssen verboten sein.');
    assert(index.imageWorld?.floorWallBoundaryForbidden===true,'Boden-Wand-Grenzen müssen verboten sein.');
    assert(index.imageWorld?.horizonLineForbidden===true,'Horizontlinien müssen verboten sein.');
    assert(index.imageWorld?.visibleFaceRequiredWhenPersonPresent===true,'Bei Personen muss ein sichtbares Gesicht vorgeschrieben sein.');
    assert(index.imageWorld?.objectLabelsOnly===true,'KI-Bilder dürfen nur kurze Objektlabels als Text enthalten.');

    const media=index.userMediaBoundary;
    assert(media?.imagesDirectory==='03-szenen/00-ALLE-BILDER-HIER-REIN/','Nutzerbilder dürfen nur aus dem finalen Sammelordner kommen.');
    assert(media?.audioDirectory==='02-audio/','Finales Voiceover darf nur aus 02-audio kommen.');
    assert(media?.outsideMediaForbidden===true&&media?.substitutesForbidden===true,'Medien außerhalb des Ziel-Reels/Ersatzmedien müssen verboten sein.');
    assert(media?.missingRequiredMediaIsBlocker===true,'Fehlende Pflichtmedien müssen BLOCKED auslösen.');

    const publishing=index.platformPublishing;
    assert(publishing?.directory==='04-caption','Plattform-Publishing muss direkt in 04-caption liegen.');
    assert(publishing?.universalCaption==='04-caption/caption.txt','Universal-Caption muss 04-caption/caption.txt sein.');
    assert(publishing?.sameCaptionForAllReelPlatforms===true,'Dieselbe Caption muss für alle Reel-Plattformen gelten.');
    assert(publishing?.separatePlatformCaptionsForbidden===true,'Separate Plattform-Captions müssen verboten sein.');
    assert(Number(publishing?.hashtagCount)===5,'Universal-Caption muss exakt 5 Hashtags verlangen.');
    const expectedPlatforms=['instagram-reels','tiktok','facebook-reels','snapchat'];
    assert(Array.isArray(publishing?.platforms)&&publishing.platforms.length===4&&expectedPlatforms.every((p)=>publishing.platforms.includes(p)),'platformPublishing.platforms ist unvollständig.');
    for(const oldKey of ['masterCaption','instagramReels','tiktok','facebookReels','snapchat','youtubeShorts'])assert(!Object.prototype.hasOwnProperty.call(publishing??{},oldKey),`Altes platformPublishing-Feld ist verboten: ${oldKey}.`);
    for(const oldFile of ['instagram-reels.txt','tiktok.txt','facebook-reels.txt','snapchat.txt','youtube-shorts.txt'])assert(!existsSync(resolve(root,'04-caption',oldFile)),`Verbotene alte Publishing-Datei vorhanden: 04-caption/${oldFile}`);
  }

  const presentation=index.imagePresentationContract;
  if(!legacy){
    assert(presentation?.mode==='adaptive-safe-fill','Bilddarstellung muss adaptive-safe-fill verwenden.');
    assert(presentation?.maximizeVisualArea===true,'Bildfläche muss maximal ausgenutzt werden.');
    assert(presentation?.preferCropEmptyBackground===true,'Leerer Hintergrund muss vor wichtigem Inhalt gecroppt werden.');
    assert(presentation?.preserveFace===true,'Gesichter müssen beim Framing geschützt werden.');
    assert(presentation?.preserveObjectLabels===true,'Objektlabels müssen beim Framing geschützt werden.');
    assert(presentation?.preserveHeroObject===true,'Hauptobjekt muss beim Framing geschützt werden.');
    assert(presentation?.blurredImageBackgroundForbidden===true,'Unscharfe Bildkopien als Hintergrund sind verboten.');
    assert(presentation?.visibleInsetPanelForbidden===true,'Kleine sichtbare Bild-im-Bild-Panels sind verboten.');
    assert(presentation?.containAsDefaultForbidden===true,'contain als Standarddarstellung ist verboten.');
    assert(!Object.prototype.hasOwnProperty.call(presentation??{},'maxIntentionalImageScale'),'Alte 1.04-Skalierungsgrenze ist verboten.');
    assert(!Object.prototype.hasOwnProperty.call(presentation??{},'maxSourceCropPerSide'),'Alte starre Crop-Grenze ist verboten.');
    assert(!Object.prototype.hasOwnProperty.call(presentation??{},'maxSourceCropTotal'),'Alte starre Gesamt-Crop-Grenze ist verboten.');
  }

  assert(Number(index.audio?.targetIntegratedLufs)===-16,'Audioziel muss ungefähr -16 LUFS sein.');
  assert(Number(index.audio?.targetTruePeakDbtp)===-1,'True-Peak-Ziel muss -1 dBTP sein.');

  if(index.subtitleDisplay){
    assert(index.subtitleDisplay.preferredSentences===1,'Bevorzugt muss genau ein Untertitelsatz sichtbar sein.');
    assert(Number(index.subtitleDisplay.maxSentences)<=2,'Untertitel dürfen maximal zwei sehr kurze Sätze gleichzeitig zeigen.');
    assert(index.subtitleDisplay.maxLines===2,'Untertitel müssen hart auf zwei Zeilen begrenzt sein.');
    assert(index.subtitleDisplay.noDeadGaps===true&&index.subtitleDisplay.holdDuringPauses===true,'Kurze Pausen dürfen keine Caption-Lücken erzeugen.');
    assert(index.subtitleDisplay.timingSource==='real-audio-word-timestamps','Untertitel müssen echte Audio-Wortzeiten verwenden.');
    assert(index.subtitleDisplay.activeWordTiming==='exact-word-start-end','Aktives Wort muss an echten Wortgrenzen hängen.');
    assert(index.subtitleDisplay.sentenceSwitch==='next-sentence-first-word-start','Satzwechsel muss am ersten Wort des neuen Satzes erfolgen.');
    assert(index.subtitleDisplay.equalWordSpacingForbidden===true,'Gleichmäßig geschätzte Wortzeiten müssen verboten sein.');
  }
  if(index.layout){
    assert(Number(index.layout.subtitleBottom)>=260,'Untertitel liegen zu tief in der Plattform-Totzone.');
    assert(Number(index.layout.subtitleBottom)<=340,'Untertitel liegen unnötig weit oben.');
    assert(Number(index.layout.visualTop)<=230,'Bildfläche beginnt zu weit unter der Überschrift.');
    assert(Number(index.layout.visualBottom)>=1480,'Bildfläche endet zu früh vor den Untertiteln.');
    assert(Number(index.layout.subtitleRight)>=160,'Rechts fehlt Sicherheitsabstand für Plattform-UI.');
  }

  const timingPath=resolve(root,index.timelineRules?.timingSource??'04-caption/word-timings.json');
  assert(existsSync(timingPath),`Worttiming-Datei fehlt: ${timingPath}`);
  if(existsSync(timingPath)){
    const timing=JSON.parse(readFileSync(timingPath,'utf8'));
    assert(timing.subtitleMode==='sentence-with-audio-synced-active-word','Worttiming-Datei hat falschen subtitleMode.');
    assert(timing.activeWordColor==='finance-green','Aktive Wortfarbe muss finance-green sein.');
    assert(timing.timingMethod!=='equal-distribution'&&timing.timingMethod!=='estimated-even-spacing','Gleichmäßig verteilte Wortzeiten sind verboten.');
    assert(Array.isArray(timing.sentences),'Worttiming-Datei benötigt sentences[].');
    if(requireFinal){
      assert(timing.timingStatus==='final-audio-aligned','Finaler Render ist BLOCKED: word-timings.json ist nicht am finalen Voiceover ausgerichtet.');
      assert(timing.sentences.length>0,'Finaler Render ist BLOCKED: echte Wortzeiten fehlen.');
    }
    for(const sentence of timing.sentences??[]){
      const words=String(sentence.text??'').trim().split(/\s+/).filter(Boolean);
      assert(Array.isArray(sentence.frames)&&sentence.frames.length===words.length+1,`${sentence.id??'Satz'}: frames benötigt exakt Wortanzahl + 1 Grenzen.`);
      if(Array.isArray(sentence.frames))assert(isAscending(sentence.frames),`${sentence.id??'Satz'}: Wortgrenzen müssen streng aufsteigend sein.`);
    }
  }

  const allPrompts=existsSync(allPromptsPath)?readFileSync(allPromptsPath,'utf8'):'';
  assert(allPrompts.includes('FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3'),'alle-bildprompts.txt verwendet nicht die FinanzNeo World ID.');
  if(!legacy){
    assert(allPrompts.includes('ONE single seamless continuous deep charcoal green-black background'),'alle-bildprompts.txt fordert keinen nahtlosen Einzelhintergrund.');
    assert(!containsObsoleteZoning(allPrompts),'alle-bildprompts.txt enthält verbotene Prozent-Zonen.');
    assert(allPrompts.toLowerCase().includes('no headline'),'alle-bildprompts.txt verbietet generierte Headlines nicht.');
    assert(allPrompts.includes('00-ALLE-BILDER-HIER-REIN'),'Finaler gemeinsamer Bilderordner fehlt in alle-bildprompts.txt.');
  }

  const expectedImageNames=new Set();
  directories.forEach((id,position)=>{
    const directory=resolve(sceneRoot,id);
    const hasImagePrompt=existsSync(resolve(directory,'bildprompt.txt'));
    const hasRemotion=existsSync(resolve(directory,'remotion.md'));
    const hasSceneInfo=existsSync(resolve(directory,'szene.md'));
    const sourceCount=Number(hasImagePrompt)+Number(hasRemotion);
    const indexed=index.scenes?.[position];
    const mediaInsideScene=readdirSync(directory).filter((entry)=>imageExt.has(extname(entry).toLowerCase()));

    assert(sourceCount===1,`${id}: exakt eine Produktionsquelle erforderlich.`);
    assert(hasSceneInfo,`${id}: szene.md fehlt.`);
    assert(indexed?.id===id,`${id}: Reihenfolge oder ID im scene-index stimmt nicht.`);
    assert(mediaInsideScene.length===0,`${id}: Nutzerbilder gehören ausschließlich in 00-ALLE-BILDER-HIER-REIN, nicht in Szenenordner.`);

    if(hasImagePrompt){
      assert(indexed?.type==='image',`${id}: scene-index-Typ muss image sein.`);
      assert(indexed?.planFile?.endsWith('/bildprompt.txt'),`${id}: planFile muss auf bildprompt.txt zeigen.`);
      assert(typeof indexed?.expectedVisual==='string'&&indexed.expectedVisual.trim(),`${id}: expectedVisual fehlt.`);
      const prompt=readFileSync(resolve(directory,'bildprompt.txt'),'utf8');
      if(!legacy){
        assert(prompt.includes('GOOGLE FLOW – FINALER DATEINAME:'),`${id}: finaler Google-Flow-Dateiname fehlt direkt am Prompt.`);
        assert(prompt.includes('ONE single seamless continuous deep charcoal green-black background'),`${id}: nahtloser Einzelhintergrund fehlt.`);
        assert(!containsObsoleteZoning(prompt),`${id}: Prompt enthält verbotene Prozent-Zonen.`);
        assert(prompt.toLowerCase().includes('no headline'),`${id}: große generierte Headline ist nicht verboten.`);
      }
      assert(typeof indexed?.googleFlowFileName==='string'&&indexed.googleFlowFileName.trim(),`${id}: googleFlowFileName fehlt.`);
      if(indexed?.googleFlowFileName)expectedImageNames.add(indexed.googleFlowFileName);
      const p=indexed?.imagePresentation;
      assert(p?.mode==='adaptive-safe-fill',`${id}: imagePresentation.mode muss adaptive-safe-fill sein.`);
      assert(Number(p?.focalX)>=0&&Number(p?.focalX)<=1,`${id}: focalX muss zwischen 0 und 1 liegen.`);
      assert(Number(p?.focalY)>=0&&Number(p?.focalY)<=1,`${id}: focalY muss zwischen 0 und 1 liegen.`);
      assert(!Object.prototype.hasOwnProperty.call(p??{},'scale'),`${id}: alte feste scale-Regel ist verboten.`);
      assert(!Object.prototype.hasOwnProperty.call(p??{},'sourceCropTop'),`${id}: alte sourceCropTop-Regel ist verboten.`);
      assert(!Object.prototype.hasOwnProperty.call(p??{},'sourceCropBottom'),`${id}: alte sourceCropBottom-Regel ist verboten.`);
    }

    if(hasRemotion){
      assert(indexed?.type==='animation',`${id}: scene-index-Typ muss animation sein.`);
      assert(indexed?.planFile?.endsWith('/remotion.md'),`${id}: planFile muss auf remotion.md zeigen.`);
    }
  });

  if(existsSync(imageInbox)){
    const actualImages=readdirSync(imageInbox).filter((name)=>imageExt.has(extname(name).toLowerCase()));
    const unexpected=actualImages.filter((name)=>!expectedImageNames.has(name));
    const missing=[...expectedImageNames].filter((name)=>!actualImages.includes(name));
    assert(unexpected.length===0,`Unerwartete Nutzerbilder im finalen Sammelordner: ${unexpected.join(', ')}`);
    if(requireFinal)assert(missing.length===0,`Finaler Render BLOCKED. Pflichtbilder fehlen: ${missing.join(', ')}`);
    else if(missing.length)warnings.push(`${missing.length} Pflichtbilder fehlen noch: ${missing.join(', ')}`);
  }

  const audioFiles=existsSync(audioRoot)?readdirSync(audioRoot).filter((name)=>audioExt.has(extname(name).toLowerCase())):[];
  assert(audioFiles.length<=1,'02-audio darf höchstens eine finale Audiodatei enthalten.');
  if(requireFinal)assert(audioFiles.length===1,'Finaler Render BLOCKED: genau eine finale Audiodatei in 02-audio ist erforderlich.');
  else if(audioFiles.length===0)warnings.push('Finales Voiceover fehlt noch in 02-audio.');
}

if(errors.length){
  console.error('\nReel-Vertrag verletzt:\n');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ Reel-Quellen-, Medien-, Timing-, Publishing- und Präsentationsvertrag erfüllt.');
console.log('  Bilder: adaptive-safe-fill · maximale Nutzfläche · kein sichtbares Inset-Panel');
console.log('  Captions im Video: bevorzugt 1 Satz · max. 2 Sätze/2 Zeilen · echte Audio-Wortgrenzen');
console.log('  Social: eine universelle caption.txt · Instagram/TikTok/Facebook/Snapchat · exakt 5 Hashtags im Finalmodus');
for(const warning of warnings)console.log(`  Hinweis: ${warning}`);
