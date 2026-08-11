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
const coverPromptPath=resolve(root,'03-szenen/00-cover/cover.txt');
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
  [coverPromptPath,'03-szenen/00-cover/cover.txt fehlt.'],
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

const containsObsoleteZoning=(text)=>[
  'top 15 percent','top 15%','bottom 25 percent','bottom 25%',
  'middle 60 percent','middle 60%','central 64 percent',
].some((needle)=>text.toLowerCase().includes(needle));
const isAscending=(frames)=>frames.every((value,index)=>index===0||value>frames[index-1]);
const hasOwn=(object,key)=>Object.prototype.hasOwnProperty.call(object??{},key);
const isPlaceholder=(value)=>/\[(?:EXAKTE|KURZER|EINFÜGEN|PLACEHOLDER)/i.test(String(value??''));

if(existsSync(sceneRoot)&&existsSync(indexPath)){
  const index=JSON.parse(readFileSync(indexPath,'utf8'));
  const legacy=index.imageWorld?.legacyAssetSet===true;
  const directories=readdirSync(sceneRoot)
    .filter((entry)=>/^scene-\d{2}$/.test(entry)&&statSync(resolve(sceneRoot,entry)).isDirectory())
    .sort();

  assert(Array.isArray(index.scenes),'scene-index.json benötigt scenes[].');
  assert(index.sceneCount===directories.length,'sceneCount stimmt nicht mit den Szenenordnern überein.');
  assert(index.imageWorld?.id==='finanzneo-connected-studio-v3','FinanzNeo Image World ID fehlt.');
  assert(index.imageWorld?.referencePromptFile==='03-szenen/bildwelt.txt','referencePromptFile ist falsch.');
  assert(index.timelineRules?.cutsFollowSentenceStarts===true,'Szenenschnitte müssen Satzanfängen folgen.');
  assert(index.timelineRules?.equalLengthScenesForbiddenByDefault===true,'Starre gleich lange Szenen müssen standardmäßig verboten sein.');

  if(!legacy){
    assert(Number(index.version)>=16,'Aktive neue Reels müssen scene-index Version 16 oder höher verwenden.');
    assert(index.imageWorld?.seamlessSingleBackgroundRequired===true,'Ein nahtloser Bildhintergrund muss verbindlich sein.');
    assert(index.imageWorld?.percentageZonesForbidden===true,'Prozent-Zonen müssen ausdrücklich verboten sein.');
    assert(index.imageWorld?.backgroundBandsForbidden===true,'Hintergrundbänder müssen verboten sein.');
    assert(index.imageWorld?.floorWallBoundaryForbidden===true,'Boden-Wand-Grenzen müssen verboten sein.');
    assert(index.imageWorld?.horizonLineForbidden===true,'Horizontlinien müssen verboten sein.');
    assert(index.imageWorld?.visibleFaceRequiredWhenPersonPresent===true,'Bei Personen muss ein sichtbares Gesicht vorgeschrieben sein.');
    assert(index.imageWorld?.sceneImagesObjectLabelsOnly===true,'Szenenbilder Bild 01+ dürfen nur kurze Objektlabels als generierten Text enthalten.');
    assert(!hasOwn(index.imageWorld,'objectLabelsOnly'),'Mehrdeutiges Alt-Feld imageWorld.objectLabelsOnly ist verboten; Cover und Szenenbilder müssen getrennt geregelt sein.');

    const cover=index.coverHeadline;
    assert(cover?.source==='google-flow','Cover-Überschrift muss direkt aus Google Flow kommen.');
    assert(cover?.required===true&&cover?.exactTextRequired===true,'Cover-Überschrift muss verpflichtend und exakt vorgegeben sein.');
    assert(Number(cover?.maxLines)===2,'Cover-Überschrift muss auf maximal zwei Zeilen begrenzt sein.');
    assert(cover?.remotionOverlayForbidden===true,'Remotion-Ersatzheadline auf dem Cover muss verboten sein.');
    assert(cover?.regenerateIfMissingOrWrong===true,'Fehlerhafte Cover-Typografie muss eine Neugenerierung in Google Flow verlangen.');
    assert(typeof cover?.exactText==='string'&&cover.exactText.trim(),'coverHeadline.exactText fehlt.');
    assert(typeof cover?.googleFlowFileName==='string'&&cover.googleFlowFileName.trim(),'coverHeadline.googleFlowFileName fehlt.');
    if(requireFinal){
      assert(!isPlaceholder(cover?.exactText),'Finaler Render BLOCKED: exakte Cover-Überschrift ist noch ein Platzhalter.');
      assert(!isPlaceholder(cover?.googleFlowFileName),'Finaler Render BLOCKED: Cover-Dateiname ist noch ein Platzhalter.');
    }

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
    for(const oldKey of ['masterCaption','instagramReels','tiktok','facebookReels','snapchat','youtubeShorts']){
      assert(!hasOwn(publishing,oldKey),`Altes platformPublishing-Feld ist verboten: ${oldKey}.`);
    }
    for(const oldFile of ['instagram-reels.txt','tiktok.txt','facebook-reels.txt','snapchat.txt','youtube-shorts.txt']){
      assert(!existsSync(resolve(root,'04-caption',oldFile)),`Verbotene alte Publishing-Datei vorhanden: 04-caption/${oldFile}`);
    }

    const presentation=index.imagePresentationContract;
    assert(presentation?.mode==='full-frame-no-crop','Bilddarstellung muss full-frame-no-crop verwenden.');
    assert(presentation?.fullCanvas===true,'Nutzerbilder müssen die vollständige 1080x1920-Szenenfläche verwenden.');
    assert(presentation?.sourceMustBeVertical916===true,'Bildquellen müssen als vertikale 9:16-Bilder vorgesehen sein.');
    assert(presentation?.sceneHeadlineOverlay===true&&presentation?.captionOverlay===true,'Szenenheadline 01+ und Untertitel müssen als Overlay über demselben Vollbild liegen.');
    assert(presentation?.coverHeadlineOverlayForbidden===true,'Eine Remotion-Headline über dem Google-Flow-Cover muss verboten sein.');
    assert(!hasOwn(presentation,'headlineOverlay'),'Mehrdeutiges Alt-Feld imagePresentationContract.headlineOverlay ist verboten.');
    assert(presentation?.continuousReadabilityScrimOnly===true,'Nur ein weicher kontinuierlicher Lesbarkeits-Scrim ist erlaubt.');
    assert(presentation?.hardHeaderFooterPanelsForbidden===true,'Harte Header-/Footer-Hintergründe müssen verboten sein.');
    assert(presentation?.intentionalCropForbidden===true,'Absichtliches Cropping der Nutzerbilder muss verboten sein.');
    assert(presentation?.blurredImageBackgroundForbidden===true,'Unscharfe Bildkopien als Hintergrund sind verboten.');
    assert(presentation?.visibleInsetPanelForbidden===true,'Sichtbare Bild-im-Bild-Panels sind verboten.');

    for(const obsolete of [
      'maximizeVisualArea','preferCropEmptyBackground','preserveFace','preserveObjectLabels',
      'preserveHeroObject','preserveMoneyAndValue','containAsDefaultForbidden',
      'maxIntentionalImageScale','maxSourceCropPerSide','maxSourceCropTotal',
    ]) assert(!hasOwn(presentation,obsolete),`Veraltete Bilddarstellungsregel ist verboten: ${obsolete}.`);
  }

  assert(Number(index.audio?.targetIntegratedLufs)===-16,'Audioziel muss ungefähr -16 LUFS sein.');
  assert(Number(index.audio?.targetTruePeakDbtp)===-1,'True-Peak-Ziel muss -1 dBTP sein.');

  if(index.subtitleDisplay){
    assert(index.subtitleDisplay.preferredSentences===1,'Genau ein Untertitelsatz muss sichtbar sein.');
    assert(Number(index.subtitleDisplay.maxSentences)===1,'Untertitel dürfen niemals zwei Sätze gleichzeitig zeigen.');
    assert(Number(index.subtitleDisplay.maxLines)===2,'Untertitel müssen hart auf zwei Zeilen begrenzt sein.');
    assert(index.subtitleDisplay.noDeadGaps===true&&index.subtitleDisplay.holdDuringPauses===true,'Kurze Pausen dürfen keine Caption-Lücken erzeugen.');
    assert(index.subtitleDisplay.timingSource==='real-audio-word-timestamps','Untertitel müssen echte Audio-Wortzeiten verwenden.');
    assert(index.subtitleDisplay.activeWordTiming==='exact-word-start-end','Aktives Wort muss an echten Wortgrenzen hängen.');
    assert(index.subtitleDisplay.sentenceSwitch==='next-sentence-first-word-start','Satzwechsel muss am ersten Wort des neuen Satzes erfolgen.');
    assert(index.subtitleDisplay.equalWordSpacingForbidden===true,'Gleichmäßig geschätzte Wortzeiten müssen verboten sein.');
    assert(index.subtitleDisplay.opaqueCaptionCardForbidden===true,'Undurchsichtige Untertitel-Karten müssen verboten sein.');
  }

  if(index.layout){
    assert(Number(index.layout.subtitleBottom)>=280&&Number(index.layout.subtitleBottom)<=330,'Untertitelposition muss im unteren, plattformsicheren Bereich liegen.');
    assert(Number(index.layout.subtitleLeft)>=56,'Links fehlt Untertitel-Sicherheitsabstand.');
    assert(Number(index.layout.subtitleRight)>=150,'Rechts fehlt Sicherheitsabstand für Plattform-UI.');
    assert(Number(index.layout.platformUiSafeBottom)>=250,'Untere Plattform-UI-Safe-Area ist zu klein.');
    assert(index.layout.imageScenesFullFrame===true,'Bildszenen müssen ausdrücklich Full-Frame sein.');
    assert(Number(index.layout.animationVisualTop)<=230,'Native Animationsfläche beginnt zu tief.');
    assert(Number(index.layout.animationVisualBottom)>=1450,'Native Animationsfläche endet zu früh.');
  }

  const timingPath=resolve(root,index.timelineRules?.timingSource??'04-caption/word-timings.json');
  assert(existsSync(timingPath),`Worttiming-Datei fehlt: ${timingPath}`);
  if(existsSync(timingPath)){
    const timing=JSON.parse(readFileSync(timingPath,'utf8'));
    assert(timing.subtitleMode==='sentence-with-audio-synced-active-word','Worttiming-Datei hat falschen subtitleMode.');
    assert(timing.activeWordColor==='finance-green','Aktive Wortfarbe muss finance-green sein.');
    assert(timing.timingMethod!=='equal-distribution'&&timing.timingMethod!=='estimated-even-spacing','Gleichmäßig verteilte Wortzeiten sind verboten.');
    assert(Number(timing.rules?.maxSentencesVisible)===1,'word-timings.json muss genau einen sichtbaren Satz erzwingen.');
    assert(Number(timing.rules?.maxLines)===2,'word-timings.json muss maximal zwei Zeilen erzwingen.');
    assert(timing.rules?.opaqueCaptionCardForbidden===true,'word-timings.json muss undurchsichtige Caption-Karten verbieten.');
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
  const coverPrompt=existsSync(coverPromptPath)?readFileSync(coverPromptPath,'utf8'):'';
  assert(allPrompts.includes('FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3'),'alle-bildprompts.txt verwendet nicht die FinanzNeo World ID.');
  if(!legacy){
    const exactCoverText=String(index.coverHeadline?.exactText??'').trim();
    assert(allPrompts.includes('ONE single seamless continuous deep charcoal green-black background'),'alle-bildprompts.txt fordert keinen nahtlosen Einzelhintergrund.');
    assert(!containsObsoleteZoning(allPrompts),'alle-bildprompts.txt enthält verbotene Prozent-Zonen.');
    assert(allPrompts.toLowerCase().includes('no headline'),'alle-bildprompts.txt verbietet generierte Headlines für Szenenbilder nicht.');
    assert(allPrompts.includes('COVER-ÜBERSCHRIFT – EXAKT SO:'),'alle-bildprompts.txt enthält keinen exakten Google-Flow-Cover-Headline-Block.');
    assert(coverPrompt.includes('COVER-ÜBERSCHRIFT – EXAKT SO:'),'00-cover/cover.txt enthält keinen exakten Google-Flow-Cover-Headline-Block.');
    assert(!coverPrompt.toLowerCase().includes('no headline'),'Cover-Prompt enthält die widersprüchliche alte Regel „No headline“.');
    if(exactCoverText&&!isPlaceholder(exactCoverText)){
      assert(allPrompts.includes(exactCoverText),'alle-bildprompts.txt enthält nicht die exakte Cover-Überschrift aus scene-index.json.');
      assert(coverPrompt.includes(exactCoverText),'00-cover/cover.txt enthält nicht die exakte Cover-Überschrift aus scene-index.json.');
    }
    assert(allPrompts.includes('00-ALLE-BILDER-HIER-REIN'),'Finaler gemeinsamer Bilderordner fehlt in alle-bildprompts.txt.');
  }

  const expectedImageNames=new Set();
  if(!legacy&&typeof index.coverHeadline?.googleFlowFileName==='string'&&index.coverHeadline.googleFlowFileName.trim()){
    expectedImageNames.add(index.coverHeadline.googleFlowFileName);
  }

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
      assert(p?.mode==='full-frame-no-crop',`${id}: imagePresentation.mode muss full-frame-no-crop sein.`);
      for(const obsolete of ['focalX','focalY','scale','sourceCropTop','sourceCropBottom','objectFit']){
        assert(!hasOwn(p,obsolete),`${id}: veraltetes Framing-Feld ist verboten: ${obsolete}.`);
      }
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
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}

console.log('\n✓ Reel-Quellen-, Medien-, Cover-, Bild-, Timing- und Publishing-Vertrag erfüllt.');
console.log('  Cover: exakte Google-Flow-Überschrift · Bild 00 ist Pflichtmedium · keine Remotion-Ersatzheadline');
console.log('  Bilder: full-frame-no-crop · komplette 9:16-Fläche · keine harten Header/Footer-Panels');
console.log('  Captions im Video: genau 1 Satz · max. 2 Zeilen · echte Audio-Wortgrenzen · keine schwarze Caption-Karte');
console.log('  Social: eine universelle caption.txt · Instagram/TikTok/Facebook/Snapchat · exakt 5 Hashtags im Finalmodus');
for(const warning of warnings)console.log(`  Hinweis: ${warning}`);