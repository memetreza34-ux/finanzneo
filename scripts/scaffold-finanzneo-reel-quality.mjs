#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const DEFAULT_TYPES=['image','animation','animation','image','animation','image','animation','animation','animation','image'];
const args=process.argv.slice(2);
const readArg=(name)=>{const i=args.indexOf(`--${name}`);return i===-1?null:args[i+1]??null;};
const targetArg=readArg('target');
const title=readArg('title')??'Neues FinanzNeo-Reel';
const typeArg=readArg('types');
const types=typeArg?typeArg.split(',').map((value)=>value.trim()):DEFAULT_TYPES;

if(!targetArg){
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,animation,...]');
  process.exit(1);
}
if(types.length<5||types.length>12||types.some((type)=>!['image','animation'].includes(type))){
  console.error('Szenentypen: 5–12 Einträge, nur image oder animation.');
  process.exit(1);
}

const expectedAnimations=Math.round(types.length*0.60);
const actualAnimations=types.filter((type)=>type==='animation').length;
if(actualAnimations!==expectedAnimations){
  console.error(`Quality V2: ${types.length} Szenen benötigen ${expectedAnimations} Animationen (60%-Plan), gefunden ${actualAnimations}.`);
  process.exit(1);
}
for(let i=1;i<types.length;i+=1){
  if(types[i]==='image'&&types[i-1]==='image'){
    console.error(`Quality V2: Zwei Bildszenen direkt hintereinander sind verboten (Position ${i} und ${i+1}).`);
    process.exit(1);
  }
}

const root=resolve(targetArg);
const rel=relative(resolve('reels'),root);
if(rel.startsWith('..')||rel===''||rel.split(sep).includes('..')){
  console.error('Ziel muss ein neuer Ordner unter reels/ sein.');
  process.exit(1);
}
if(existsSync(root)){
  console.error(`Ziel existiert bereits: ${root}`);
  process.exit(1);
}

const write=(path,content)=>{
  const abs=resolve(root,path);
  mkdirSync(resolve(abs,'..'),{recursive:true});
  writeFileSync(abs,content,'utf8');
};

const WORLD_ID='finanzneo-connected-studio-v3';
const num=(index)=>String(index+1).padStart(2,'0');
const sceneFileName=(index)=>`Bild ${num(index)} - [KURZER SZENENNAME].png`;
const coverFileName='Bild 00 - [KURZER COVER-NAME].png';
const coverHeadline='[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]';

const STYLE_BLOCK=`FINANZNEO_WORLD_ID: ${WORLD_ID}\n\nVERBINDLICHER BILDSTIL:\nPremium fintech editorial 3D render style. Deep charcoal green-black world. Vivid emerald and mint accents. Gold only for money/value. Warm red-orange only for loss, debt, danger or blocked money. Smooth rounded geometry, soft bevelled edges, premium matte/glass materials, high-contrast lighting and emerald rim light. Use one dominant financial metaphor and only a few supporting elements. A stylized anonymous adult 3D person may appear when useful; if present, the face must be clearly visible with eyes, nose and mouth. No photorealism, Pixar, clay, tiny diorama, neon tunnel, sci-fi corridor, game level, dashboard or clutter.\n\nBACKGROUND RULE:\nUse ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image. Keep the same continuous material, tone and gradient from top edge to bottom edge. No horizontal divisions, no visible top/bottom zones, no panels, no floor-wall boundary, no horizon line and no studio split. Do not create a visible floor or wall. Keep all important content inside the 9:16 frame.\n`;

const SCENE_TEXT_RULE=`TEXT RULE – SZENENBILD BILD 01+:\nNo headline. No subtitle. No explanatory sentence. Only explicitly requested short German object labels, normally 1–3 words, directly beside the related object.\n`;

const COVER_RULE=`COVER-REGEL – BILD 00:\nThe generated cover itself must contain one large clear German title that states the Reel topic. Use the exact text from the block COVER-ÜBERSCHRIFT – EXAKT SO:. Approximately 3–8 words, maximum two lines. No subtitle, CTA or explanatory sentence. No separate text box, header band, panel or second background. If the required title is missing, misspelled, clipped or unreadable, regenerate the cover in Google Flow. Never repair or replace the cover title in Remotion.\n`;

const flowInstruction=(fileName)=>`GOOGLE FLOW – FINALER DATEINAME:\n\`${fileName}\`\n\nErzeuge GENAU EIN vertikales 9:16-Bild. Danach sofort exakt wie oben umbenennen. Prüfe Motiv, erlaubten Text, Gesicht (falls Person), Hintergrund und Dateiname. Erst danach das nächste Bild erzeugen. Der Dateiname darf nicht sichtbar im Bild stehen.\n`;

const imagePrompt=(id,index)=>`${flowInstruction(sceneFileName(index))}\n${STYLE_BLOCK}\n${SCENE_TEXT_RULE}\nVOICE-BEAT:\n[EINFÜGEN]\n\nHAUPTAUSSAGE:\n[EINFÜGEN]\n\nVISUAL ROLE:\n[EINFÜGEN]\n\nVISUAL SELECTION REASON:\n[WARUM IST EIN STATISCHES BILD HIER BESSER ALS REMOTION?]\n\nEXPECTED VISUAL:\n[WAS MUSS INNERHALB ETWA EINER SEKUNDE VERSTÄNDLICH SEIN?]\n\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES DEUTSCHES OBJEKT-LABEL]\n\nBILDPROMPT:\n[ONE LARGE DOMINANT VISUAL METAPHOR FOR ${id}. DESCRIBE ONLY THE OBJECTS/ACTION NEEDED FOR THIS EXACT VOICE BEAT.]\n\n${STYLE_BLOCK}\n${SCENE_TEXT_RULE}\n`;

const coverPrompt=`${flowInstruction(coverFileName)}\n${STYLE_BLOCK}\n${COVER_RULE}\nCOVER-ÜBERSCHRIFT – EXAKT SO:\n${coverHeadline}\n\nBILDPROMPT:\n[ONE LARGE DOMINANT COVER METAPHOR THAT EXPLAINS THE REEL TOPIC IN ONE GLANCE.] Include the exact German cover title '${coverHeadline}' directly in the generated image, large, premium, smartphone-readable and maximum two lines. Spell it exactly. Do not add a subtitle, CTA, explanatory sentence or random extra text. Keep title and visual on the same seamless background.\n`;

write('README.md',`# ${title}\n\nQuality Contract V2 Reel.\n\n- Ziel: 60 % native Remotion-Animation / 40 % Google-Flow-Bilder\n- final erlaubt: 55–65 % Animationslaufzeit / 35–45 % Bildlaufzeit\n- keine zwei Bildszenen direkt hintereinander\n- Bildszene normalerweise max. 8 Sekunden\n- dynamische Information ist animation-first\n- Bilder nur aus 03-szenen/00-ALLE-BILDER-HIER-REIN/\n- genau ein finales Audio nur aus 02-audio/\n- Cover-Überschrift direkt aus Google Flow\n- Untertitel: eine kurze Einheit, max. 12 Wörter / 68 Zeichen / 2 Zeilen / min. 42 px\n- vollständige finale MP4-QA in 05-projektdateien/final-qa.json\n- eine universelle caption.txt mit exakt 5 Hashtags\n- keine YouTube Shorts\n`);
write('01-script/script-fliess-text.txt','[VOLLSTÄNDIGEN FINALEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md','# AUDIO HIER REIN\n\nHier genau EINE finale Voiceover-Datei ablegen. Sie ist die einzige Timing-Quelle.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md','# ALLE FERTIGEN NUTZERBILDER HIER REIN\n\nNur exakt erwartete finale Bilder. Cover Bild 00 plus die echten Bildszenennummern. Keine Zusatz-/Alt-/Platzhalterbilder.\n');
write('03-szenen/00-cover/cover.txt',coverPrompt);
write('03-szenen/bildwelt.txt',`FINANZNEO WORLD REFERENCE\n\n${STYLE_BLOCK}\n${COVER_RULE}\n${SCENE_TEXT_RULE}`);
write('03-szenen/README.md','# SZENEN\n\nAnimation-first Quality V2. Google Flow: ein Bild → sofort umbenennen → semantisch gegen Voice-Beat + Text + Hintergrund prüfen → erst dann weiter.\n');
write('04-caption/caption.txt','[STARKE ERSTE ZEILE / HOOK]\n\n[KURZE KERNAUSSAGE / AHA]\n\n[OPTIONALER NATÜRLICHER CTA]\n\n#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5\n');
write('04-caption/word-timings.json',`${JSON.stringify({
  version:4,
  fps:30,
  subtitleMode:'sentence-with-audio-synced-active-word',
  activeWordColor:'finance-green',
  timingStatus:'missing-final-audio-alignment',
  timingMethod:'real-word-boundaries-required',
  rules:{
    preferredSentencesVisible:1,
    maxSentencesVisible:1,
    preferredCaptionUnitsVisible:1,
    maxCaptionUnitsVisible:1,
    maxLines:2,
    minFontSizePx:42,
    maxWordsPerCaptionUnit:12,
    maxCharactersPerCaptionUnit:68,
    semanticSplitAllowedForLongSentence:true,
    horizontalOverflowForbidden:true,
    clippingForbidden:true,
    sentenceSwitch:'next-sentence-first-word-start',
    holdPreviousSentenceDuringShortPause:true,
    equalWordSpacingForbidden:true,
    opaqueCaptionCardForbidden:true,
  },
  sentences:[],
},null,2)}\n`);

const scenes=types.map((type,index)=>{
  const number=num(index);
  const id=`scene-${number}`;
  const dir=`03-szenen/EINZELNE-SZENEN/${id}`;
  const common={
    id,
    type,
    startFrame:0,
    durationFrames:0,
    cutReason:'voice-caption-unit-start',
    directory:`EINZELNE-SZENEN/${id}`,
    headline:'[EINFÜGEN]',
    accent:'[EINFÜGEN]',
    icon:'[EINFÜGEN]',
    visualRole:'[EINFÜGEN]',
    visualSelectionReason:'[EINFÜGEN – WARUM DIESER VISUALTYP HIER DIE BESTE WAHL IST]',
  };

  if(type==='image'){
    write(`${dir}/szene.md`,`# ${id}\n\n**Typ:** image\n**Sprechtext / Beat:** [EINFÜGEN]\n**Hauptaussage:** [EINFÜGEN]\n**Visual Role:** [EINFÜGEN]\n**Warum Bild:** [EINFÜGEN]\n**Expected Visual:** [EINFÜGEN]\n**Google-Flow-Dateiname:** ${sceneFileName(index)}\n**Erlaubte Labels:** [EINFÜGEN]\n`);
    write(`${dir}/bildprompt.txt`,imagePrompt(id,index));
    return {
      ...common,
      planFile:`EINZELNE-SZENEN/${id}/bildprompt.txt`,
      googleFlowFileName:sceneFileName(index),
      expectedVisual:'[EINFÜGEN – EXAKTES SEMANTISCHES ZIELBILD]',
      allowedObjectLabels:['[EINFÜGEN]'],
      imagePresentation:{mode:'full-frame-no-crop'},
    };
  }

  write(`${dir}/szene.md`,`# ${id}\n\n**Typ:** animation\n**Sprechtext / Beat:** [EINFÜGEN]\n**Hauptaussage:** [EINFÜGEN]\n**Visual Role:** [EINFÜGEN]\n**Warum Remotion:** [EINFÜGEN]\n**Google Flow:** KEIN Bild ${number}; Nummer bleibt reserviert.\n`);
  write(`${dir}/remotion.md`,`# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Voice-Beat: [EINFÜGEN]\n- Hauptaussage: [EINFÜGEN]\n- Startzustand: [EINFÜGEN]\n- sichtbare Veränderung / Erklärung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- Daten/Quellen: [EINFÜGEN]\n- Hintergrund: EIN durchgehender FinanzNeo-Hintergrund; kein Boden/Horizont/Studio-Split\n`);
  return {...common,planFile:`EINZELNE-SZENEN/${id}/remotion.md`,remotionComponent:'[EINFÜGEN]'};
});

const imageSceneIds=scenes.filter((scene)=>scene.type==='image').map((scene)=>scene.id);
const animationSceneIds=scenes.filter((scene)=>scene.type==='animation').map((scene)=>scene.id);

const allSections=types.map((type,index)=>{
  const number=num(index);
  if(type==='animation')return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`;
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${imagePrompt(`scene-${number}`,index)}`;
}).join('\n');

write('03-szenen/alle-bildprompts.txt',`FINANZNEO — ALLE BILDPROMPTS FÜR GOOGLE FLOW\n\nQUALITY V2:\nNur die geplanten Bildszenen erzeugen. Dynamische Beats bleiben Remotion. Jedes fertige Bild muss exakt zum Voice-Beat passen; ein nur schönes, aber unpassendes Bild ist NICHT freigegeben.\n\n${STYLE_BLOCK}\n${SCENE_TEXT_RULE}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nErst wenn Cover und alle benötigten Bildszenen korrekt erzeugt, benannt und semantisch geprüft sind, gemeinsam nach:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

write('05-projektdateien/animationen.md','# ANIMATIONEN\n\nFür jede Remotion-Szene Mechanismus, sichtbare Veränderung, Daten und Timing dokumentieren. Dynamische Information ist animation-first.\n');
write('05-projektdateien/recherche-quellen.md','# RECHERCHE UND QUELLEN\n\n[QUELLEN + DATENSTAND + RECHENANNAHMEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md',`# SZENENPLAN\n\nZiel: 60 % Animation / 40 % Bilder. Finale Laufzeit muss 55–65 % Animation ergeben.\n\nFür jede Szene ausfüllen:\n- Sprechbeat\n- Hauptaussage\n- Visualtyp\n- Visual Role\n- Visual Selection Reason\n- Expected Visual (bei Bild)\n- benötigte Daten/Labels\n\nPlan: ${animationSceneIds.length} Animationen + ${imageSceneIds.length} Bilder.\n`);
write('05-projektdateien/technische-hinweise.md',`# TECHNISCHE HINWEISE\n\n- 1080 × 1920, 30 fps\n- Quality Contract V2 / scene-index v17\n- Ziel 60 % Animation / 40 % Bilder; final 55–65 % Animationslaufzeit\n- keine zwei Bildszenen direkt hintereinander\n- Bildszene normalerweise max. 8 Sekunden\n- Bilder full-frame-no-crop\n- Cover-Headline direkt aus Google Flow; keine Remotion-Reparatur\n- Szenenbilder 01+: keine KI-Headline\n- finales Audio ist einzige Timing-Quelle\n- finale Timeline ohne ungelöste 0-Frames\n- Caption: eine kurze Einheit, max. 12 Wörter / 68 Zeichen / 2 Zeilen / min. 42 px\n- Safe-Area ungefähr Bottom 320 / Left 72 / Right 180\n- Pre-Render: npm run reel:validate -- <TARGET-REEL> --final\n- Post-Render: npm run reel:validate -- <TARGET-REEL> --final --post-render\n- finale MP4 vollständig prüfen und final-qa.json wahrheitsgemäß ausfüllen\n- Audioziel etwa -16 LUFS, True Peak <= -1 dBTP\n- genau eine universelle caption.txt mit 5 Hashtags\n- keine YouTube Shorts\n`);
write('05-projektdateien/timeline.json',`${JSON.stringify({
  version:4,
  title,
  fps:30,
  timingSource:'04-caption/word-timings.json',
  cutRule:'voice-caption-unit-start',
  wordTimingSource:'final-audio-only',
  qualityContract:{
    timingMustBeResolvedBeforeFinalRender:true,
    animationDurationShare:'0.55-0.65',
    imageDurationShare:'0.35-0.45',
    maxImageSceneSeconds:8,
    maxConsecutiveImageScenes:1,
  },
  scenes:scenes.map((scene)=>({id:scene.id,type:scene.type,startFrame:0,durationFrames:0,cutReason:'voice-caption-unit-start'})),
},null,2)}\n`);
write('05-projektdateien/final-qa.json',`${JSON.stringify({
  version:1,
  status:'pending',
  renderPath:'',
  inspectedFullMp4:false,
  inspectedEveryScene:false,
  imageSemanticMatchPassed:false,
  generatedTextQaPassed:false,
  sceneAudioSyncPassed:false,
  subtitleSafeAreaPassed:false,
  subtitleSyncPassed:false,
  visualMixPassed:false,
  noLongStaticTailPassed:false,
  audioLevelsPassed:false,
  measuredIntegratedLufs:null,
  measuredTruePeakDbtp:null,
  notes:[],
},null,2)}\n`);

write('03-szenen/scene-index.json',`${JSON.stringify({
  version:17,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  fps:30,
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  coverHeadline:{
    source:'google-flow',required:true,exactTextRequired:true,exactText:coverHeadline,
    googleFlowFileName:coverFileName,maxLines:2,remotionOverlayForbidden:true,regenerateIfMissingOrWrong:true,
  },
  subtitleDisplay:{
    preferredSentences:1,maxSentences:1,maxLines:2,balancedLines:true,holdDuringPauses:true,noDeadGaps:true,
    timingSource:'real-audio-word-timestamps',activeWordTiming:'exact-word-start-end',sentenceSwitch:'next-sentence-first-word-start',
    equalWordSpacingForbidden:true,opaqueCaptionCardForbidden:true,minFontSizePx:42,maxWordsPerCaptionUnit:12,
    maxCharactersPerCaptionUnit:68,semanticSplitAllowedForLongSentence:true,horizontalOverflowForbidden:true,clippingForbidden:true,
  },
  layout:{
    headlineTop:72,animationVisualTop:220,animationVisualBottom:1490,
    subtitleBottom:320,subtitleLeft:72,subtitleRight:180,platformUiSafeBottom:280,imageScenesFullFrame:true,
  },
  imageWorld:{
    id:WORLD_ID,referencePromptFile:'03-szenen/bildwelt.txt',style:'premium-fintech-editorial-3d-metaphor',
    stylizedPersonAllowed:true,visibleFaceRequiredWhenPersonPresent:true,sceneImagesObjectLabelsOnly:true,
    seamlessSingleBackgroundRequired:true,percentageZonesForbidden:true,backgroundBandsForbidden:true,
    floorWallBoundaryForbidden:true,horizonLineForbidden:true,
  },
  googleFlow:{
    generationMode:'one-image-at-a-time',fileNameRule:'Bild XX - Kurzer Szenenname.png',numberSource:'real-scene-number',
    animationNumbersStayReserved:true,finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',distributeToSceneFolders:false,
  },
  userMediaBoundary:{
    imagesDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',audioDirectory:'02-audio/',outsideMediaForbidden:true,
    substitutesForbidden:true,missingRequiredMediaIsBlocker:true,
  },
  platformPublishing:{
    directory:'04-caption',universalCaption:'04-caption/caption.txt',sameCaptionForAllReelPlatforms:true,
    platforms:['instagram-reels','tiktok','facebook-reels','snapchat'],hashtagCount:5,separatePlatformCaptionsForbidden:true,
  },
  timelineRules:{
    timingSource:'04-caption/word-timings.json',cutsFollowSentenceStarts:true,equalLengthScenesForbiddenByDefault:true,
    wordTimingsMustComeFromFinalAudio:true,evenlyDistributedWordTimingsForbidden:true,
  },
  imagePresentationContract:{
    mode:'full-frame-no-crop',fullCanvas:true,sourceMustBeVertical916:true,sceneHeadlineOverlay:true,
    coverHeadlineOverlayForbidden:true,captionOverlay:true,continuousReadabilityScrimOnly:true,
    hardHeaderFooterPanelsForbidden:true,intentionalCropForbidden:true,blurredImageBackgroundForbidden:true,visibleInsetPanelForbidden:true,
  },
  productionQualityContract:{
    version:2,targetAnimationShare:0.60,minAnimationDurationShare:0.55,maxAnimationDurationShare:0.65,
    targetImageShare:0.40,minImageDurationShare:0.35,maxImageDurationShare:0.45,
    maxConsecutiveImageScenes:1,maxImageSceneSeconds:8,animationFirstForDynamicInformation:true,
    finalTimelineMustBeResolved:true,fullMp4QaRequired:true,imageSemanticQaRequired:true,audioQaRequired:true,
  },
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  scenes,
},null,2)}\n`);

console.log(`✓ Neues FinanzNeo V17-Reel angelegt: ${root}`);
console.log(`  Szenen: ${scenes.length} · Animationen: ${animationSceneIds.length} · Bilder: ${imageSceneIds.length}`);
console.log('  Quality: 60/40 animation-first · final 55–65 % Animationslaufzeit');
console.log('  Captions: 1 kurze Einheit · max. 12 Wörter · 68 Zeichen · 2 Zeilen · min. 42 px');
console.log('  Final QA: Pre-Render --final · Post-Render --final --post-render');
