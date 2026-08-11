#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';

const DEFAULT_TYPES=['image','image','animation','image','animation','image','animation','animation','image','image'];
const args=process.argv.slice(2);
const readArg=(name)=>{const i=args.indexOf(`--${name}`);return i===-1?null:args[i+1]??null;};
const targetArg=readArg('target');
const title=readArg('title')??'Neues FinanzNeo-Reel';
const typeArg=readArg('types');
const types=typeArg?typeArg.split(',').map((value)=>value.trim()):DEFAULT_TYPES;

if(!targetArg){
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,image,animation]');
  process.exit(1);
}
if(types.length<5||types.length>12||types.some((type)=>!['image','animation'].includes(type))){
  console.error('Szenentypen: 5–12 Einträge, nur image oder animation.');
  process.exit(1);
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

const STYLE_BLOCK=`FINANZNEO_WORLD_ID: ${WORLD_ID}\n\nVERBINDLICHER BILDSTIL:\nPremium fintech editorial 3D render style. Deep charcoal green-black world. Accents in vivid emerald and mint green. Gold only for euro coins, cash and financial value. Warm red-orange only for loss, debt, danger or blocked money. Smooth rounded 3D geometry, soft bevelled edges, premium matte/glass materials, confident high-contrast lighting with bold emerald rim light.\n\nVISUAL LANGUAGE:\nUse ONE dominant visual metaphor and only a few supporting elements. A stylized anonymous adult 3D person may appear when useful. If a person appears, the face must be clearly visible with stylized eyes, nose and mouth; prefer front-facing or a natural three-quarter view. No faceless mannequin, hidden face or back-view-only person.\n\nBACKGROUND RULE:\nUse ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image. Keep the same continuous material, tone and gradient from the top edge to the bottom edge. NO horizontal divisions. NO visible top section. NO visible bottom section. NO separate zones. NO dark band at the top or bottom. NO floor-wall boundary. NO horizon line. NO studio wall split. NO panel background. NO layered backdrop. Use only one subtle continuous gradient or vignette. Do not create a visible floor, wall or studio horizon. Objects may cast soft local contact shadows. Keep the important subject/text comfortably inside the vertical 9:16 frame so the complete source image can be used later without intentional crop.\n\nFORBIDDEN:\nNo percentage-based top/middle/bottom zones, no photorealism, no real identifiable human, no UI dashboard, no app screen, no tiny isometric diorama, no neon tunnel, no sci-fi corridor, no miniature game level, no clutter, no random labels, no Pixar, no clay.\n`;

const SCENE_TEXT_RULE=`TEXT RULE – SZENENBILD BILD 01+:\nNo headline. No subtitle. No explanatory sentence. Only explicitly requested short German object labels, normally 1–3 words, directly near the objects they describe.\n`;

const COVER_TEXT_RULE=`COVER-REGEL – BILD 00:\nDas Cover MUSS eine große klare deutsche Überschrift direkt im von Google Flow erzeugten Bild enthalten. Die Überschrift nennt konkret das Reel-Thema, ist ungefähr 3–8 Wörter lang und maximal zwei Zeilen. Im fertigen Prompt MUSS der Platzhalter unter \"COVER-ÜBERSCHRIFT – EXAKT SO:\" durch die exakte gewünschte Überschrift ersetzt werden. Spell it exactly. No subtitle, no CTA, no explanatory sentence. No separate text box, header band, panel or second background behind the headline. Wenn die Überschrift fehlt, falsch geschrieben, abgeschnitten oder schlecht lesbar ist, Cover in Google Flow neu erzeugen. Die Cover-Überschrift später niemals in Remotion ergänzen, ersetzen oder reparieren.\n`;

const flowInstruction=(fileName)=>`GOOGLE FLOW – FINALER DATEINAME:\n\`${fileName}\`\n\nWICHTIG:\nErzeuge GENAU EIN vertikales 9:16-Bild. Danach SOFORT exakt wie oben umbenennen, Motiv + erlaubten Text + Gesicht (falls Person) + nahtlosen Hintergrund + Dateiname prüfen und erst dann das nächste Bild erzeugen. Der Dateiname selbst darf NICHT sichtbar im Bild erscheinen.\n`;

const imagePrompt=(id,index)=>`${flowInstruction(sceneFileName(index))}\n${STYLE_BLOCK}\n${SCENE_TEXT_RULE}\nBESCHRIFTUNGEN – EXAKT SO:\n- [KURZES DEUTSCHES OBJEKT-LABEL]\n- [OPTIONALES ZWEITES KURZES LABEL]\n\nBILDPROMPT:\nA stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE DOMINANT VISUAL METAPHOR FOR ${id}]. [DESCRIBE ONE CLEAR CAUSE-AND-EFFECT ACTION USING ONLY A FEW LARGE OBJECTS]. Include German object labels: [PLACE EACH SHORT LABEL DIRECTLY BESIDE THE RELEVANT OBJECT]. No headline. No subtitle. No explanatory sentence. ${STYLE_BLOCK}\n`;

const coverPrompt=`${flowInstruction('Bild 00 - [KURZER COVER-NAME].png')}\n${STYLE_BLOCK}\n${COVER_TEXT_RULE}\nCOVER-ÜBERSCHRIFT – EXAKT SO:\n[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]\n\nOBJEKTLABELS:\n[NUR WENN ZUSÄTZLICH NÖTIG, SONST: KEINE]\n\nBILDPROMPT:\nA stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE DOMINANT COVER METAPHOR]. [SHOW THE CORE IDEA OF THE REEL IN ONE CLEAR VISUAL]. Include the exact German cover headline '[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]' directly in the generated image, large, premium, bold, smartphone-readable and maximum two lines. Spell it exactly. Do not add a subtitle, CTA, explanatory sentence or random extra text. Do not create a separate headline box, header band, panel or second background. ${STYLE_BLOCK}\n`;

write('README.md',`# ${title}\n\nEinfache Struktur:\n- 01-script = finaler Fließtext fürs Voiceover\n- 02-audio = genau ein finales Nutzer-Voiceover\n- 03-szenen = Bildprompts, Szenen und finaler gemeinsamer Nutzerbilder-Ordner\n- 04-caption = genau eine universelle Social-Caption + echte Wort-Timings\n- 05-projektdateien = Animationen, Recherche und Technik\n\nAntigravity generiert keine Bilder. Nutzerbilder dürfen für den finalen Build ausschließlich aus 03-szenen/00-ALLE-BILDER-HIER-REIN/ kommen; Audio ausschließlich aus 02-audio/. Fehlende Pflichtmedien blockieren den finalen Build.\n\nCover Bild 00 enthält seine große deutsche Überschrift direkt aus Google Flow. Diese Cover-Überschrift wird nicht in Remotion ergänzt oder repariert. Szenenbilder 01+ enthalten keine KI-Headline.\n\nBildszenen verwenden das komplette vertikale 9:16-Nutzerbild über die gesamte 1080×1920-Szene. Kein mittlerer Bildcontainer und kein absichtlicher Crop. Szenenheadline 01+ + Untertitel liegen als Overlay darüber.\n\nDie Datei 04-caption/caption.txt wird unverändert für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet und enthält exakt 5 relevante Hashtags.\n\nYouTube Shorts gibt es nicht. YouTube ist ausschließlich Longform unter youtube/.\n`);

write('01-script/script-fliess-text.txt','[VOLLSTÄNDIGEN FINALEN FLIESSTEXT EINFÜGEN]\n');
write('02-audio/README.md','# AUDIO HIER REIN\n\nHier genau EINE finale Voiceover-Datei ablegen. Keine Test-/Altversion parallel. Die echte Audiodatei ist die einzige Quelle für Wortzeiten und Szenenschnitt.\n');
write('03-szenen/00-ALLE-BILDER-HIER-REIN/README.md','# ALLE FERTIGEN NUTZERBILDER HIER REIN\n\nNur die exakt erwarteten finalen vertikalen 9:16-Bilder ablegen. Keine Zusatzbilder, Platzhalter oder Altversionen. Cover Bild 00 muss die exakt vorgegebene Google-Flow-Cover-Überschrift enthalten. Animationsszenen haben kein Bild und ihre Nummer bleibt reserviert.\n');
write('03-szenen/00-cover/cover.txt',coverPrompt);
write('03-szenen/bildwelt.txt',`FINANZNEO WORLD REFERENCE\n\n${STYLE_BLOCK}\n${COVER_TEXT_RULE}\n${SCENE_TEXT_RULE}`);
write('03-szenen/README.md','# SZENEN\n\nGoogle Flow: 1 Bild erzeugen → sofort umbenennen → Motiv + erlaubten Text + Gesicht + nahtlosen Hintergrund prüfen → erst dann nächstes Bild. Cover Bild 00 braucht die exakte Pflichtüberschrift direkt aus Google Flow. Am Ende nur die finalen Bilder gemeinsam nach 00-ALLE-BILDER-HIER-REIN/.\n');
write('04-caption/caption.txt','[STARKE ERSTE ZEILE / HOOK]\n\n[KURZE KERNAUSSAGE ODER AHA-NUTZEN]\n\n[KURZER NATÜRLICHER CTA, WENN PASSEND]\n\n#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5\n');
write('04-caption/word-timings.json',`${JSON.stringify({
  version:3,
  fps:30,
  subtitleMode:'sentence-with-audio-synced-active-word',
  activeWordColor:'finance-green',
  timingStatus:'missing-final-audio-alignment',
  timingMethod:'real-word-boundaries-required',
  rules:{
    preferredSentencesVisible:1,
    maxSentencesVisible:1,
    maxLines:2,
    sentenceSwitch:'next-sentence-first-word-start',
    holdPreviousSentenceDuringShortPause:true,
    equalWordSpacingForbidden:true,
    opaqueCaptionCardForbidden:true,
  },
  sentences:[],
},null,2)}\n`);
write('05-projektdateien/animationen.md','# ANIMATIONEN\n\n[REMOTION-ANIMATIONEN EINFÜGEN]\n');
write('05-projektdateien/recherche-quellen.md','# RECHERCHE UND QUELLEN\n\n[QUELLEN EINFÜGEN]\n');
write('05-projektdateien/szenenplan.md','# SZENENPLAN\n\n[SZENENPLAN EINFÜGEN]\n');
write('05-projektdateien/technische-hinweise.md','# TECHNISCHE HINWEISE\n\n- 1080 × 1920, 30 fps\n- Cover Bild 00: exakte große deutsche Überschrift direkt aus Google Flow; keine Remotion-Ersatzheadline\n- Szenenbilder 01+: keine KI-Headline; Szenenheadline in Remotion\n- Bildszenen: full-frame-no-crop\n- komplettes vertikales 9:16-Nutzerbild über die gesamte Szene\n- kein mittlerer Bildcontainer, kein absichtlicher Crop, keine unscharfe Bildkopie\n- Szenenheadline 01+ + Untertitel als Overlay über demselben Bild\n- nur ein weicher kontinuierlicher Transparenz-Scrim für Lesbarkeit; keine harten Header/Footer-Flächen\n- Untertitel: GENAU 1 Satz gleichzeitig, hart maximal 2 Zeilen\n- Untertitel ungefähr 300 px über dem unteren Rand; rechts zusätzlicher Plattform-UI-Abstand\n- keine schwarze/undurchsichtige Caption-Karte\n- Wortmarkierung ausschließlich nach echten start/end-Zeitstempeln des finalen Voiceovers\n- gleichmäßig geschätzte Wortzeiten verboten\n- kurze Sprachpausen: bisherigen Satz halten; Satzwechsel erst beim ersten gesprochenen Wort des nächsten Satzes\n- native Remotion-Szenen: ein durchgehender Hintergrund, kein Boden/Horizont/Studio-Split\n- Publishing: genau eine caption.txt für Instagram Reels, TikTok, Facebook Reels und Snapchat\n- finale Social-Caption: starker Hook + kurzer Nutzen + optional natürlicher CTA + exakt 5 relevante Hashtags\n- keine separaten Plattform-Caption-Dateien\n- keine YouTube Shorts; YouTube nur Longform unter youtube/\n- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP\n');
write('05-projektdateien/timeline.json',`${JSON.stringify({
  version:3,
  title,
  fps:30,
  timingSource:'04-caption/word-timings.json',
  cutRule:'voice-sentence-start',
  wordTimingSource:'final-audio-only',
  scenes:types.map((type,index)=>({id:`scene-${num(index)}`,type,startFrame:0,durationFrames:0,cutReason:'voice-sentence-start'})),
},null,2)}\n`);

const scenes=types.map((type,index)=>{
  const number=num(index);
  const id=`scene-${number}`;
  const dir=`03-szenen/EINZELNE-SZENEN/${id}`;
  write(`${dir}/szene.md`,`# ${id}\n\n**Typ:** ${type}\n\n**Sprechtext:** [EINFÜGEN]\n\n${type==='image'?`**Google-Flow-Dateiname:** ${sceneFileName(index)}\n**Erlaubte Objekt-Beschriftungen:** [EINFÜGEN]\n`:`**Google Flow:** KEIN Bild ${number}; Nummer bleibt reserviert.\n`}`);

  const common={
    id,
    type,
    startFrame:0,
    durationFrames:0,
    cutReason:'voice-sentence-start',
    directory:`EINZELNE-SZENEN/${id}`,
    headline:'[EINFÜGEN]',
    accent:'[EINFÜGEN]',
    icon:'[EINFÜGEN]',
  };

  if(type==='image'){
    write(`${dir}/bildprompt.txt`,imagePrompt(id,index));
    return {
      ...common,
      planFile:`EINZELNE-SZENEN/${id}/bildprompt.txt`,
      googleFlowFileName:sceneFileName(index),
      objectLabels:['[EINFÜGEN]'],
      expectedVisual:'[EINFÜGEN]',
      imagePresentation:{mode:'full-frame-no-crop'},
    };
  }

  write(`${dir}/remotion.md`,`# Remotion-Spezifikation ${id}\n\n- Komponente: [NAME]\n- Startzustand: [EINFÜGEN]\n- Handlung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- Hintergrund: EIN durchgehender FinanzNeo-Hintergrund; kein Boden/Horizont/Studio-Split\n`);
  return {...common,planFile:`EINZELNE-SZENEN/${id}/remotion.md`};
});

const allSections=types.map((type,index)=>{
  const number=num(index);
  if(type==='animation')return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – REMOTION-ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nKEIN BILD ${number} ERZEUGEN. Nummer ${number} bleibt reserviert.\n`;
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSZENE ${number} – BILDSZENE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${imagePrompt(`scene-${number}`,index)}`;
}).join('\n');

write('03-szenen/alle-bildprompts.txt',`FINANZNEO — ALLE BILDPROMPTS FÜR GOOGLE FLOW\n\nVERBINDLICH:\n1 Bild erzeugen → sofort umbenennen → Motiv + erlaubten Text + Gesicht + nahtlosen Hintergrund prüfen → erst dann nächstes Bild.\nBildnummer = echte Szenennummer. Animationsnummern bleiben reserviert.\nBildwelt: Premium Fintech Editorial 3D, eine starke Metapher, EIN nahtloser Hintergrund ohne Bänder/Zonen.\nCover Bild 00: große exakte deutsche Pflichtüberschrift direkt aus Google Flow; keine Remotion-Reparatur.\nSzenenbilder 01+: No headline. No subtitle. No explanatory sentence. Kurze deutsche Objektlabels sind erlaubt.\nDie finalen Bilder sind vertikal 9:16 und werden später vollständig ohne absichtlichen Crop als Full-Frame-Szenen genutzt.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOVER\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${coverPrompt}\n${allSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nABSCHLUSS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCover zusätzlich auf exakte Pflichtüberschrift prüfen. Erst wenn alle benötigten Bilder fertig, korrekt benannt und geprüft sind, alle gemeinsam nach:\n03-szenen/00-ALLE-BILDER-HIER-REIN/\n`);

const imageSceneIds=types.flatMap((type,index)=>type==='image'?[`scene-${num(index)}`]:[]);
const animationSceneIds=types.flatMap((type,index)=>type==='animation'?[`scene-${num(index)}`]:[]);

write('03-szenen/scene-index.json',`${JSON.stringify({
  version:16,
  title,
  sceneCount:scenes.length,
  imageSceneCount:imageSceneIds.length,
  animationSceneCount:animationSceneIds.length,
  fps:30,
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  coverHeadline:{
    source:'google-flow',
    required:true,
    exactTextRequired:true,
    maxLines:2,
    remotionOverlayForbidden:true,
    regenerateIfMissingOrWrong:true,
  },
  subtitleDisplay:{
    preferredSentences:1,
    maxSentences:1,
    maxLines:2,
    balancedLines:true,
    holdDuringPauses:true,
    noDeadGaps:true,
    timingSource:'real-audio-word-timestamps',
    activeWordTiming:'exact-word-start-end',
    sentenceSwitch:'next-sentence-first-word-start',
    equalWordSpacingForbidden:true,
    opaqueCaptionCardForbidden:true,
  },
  layout:{
    headlineTop:72,
    animationVisualTop:220,
    animationVisualBottom:1490,
    subtitleBottom:300,
    subtitleLeft:64,
    subtitleRight:156,
    platformUiSafeBottom:260,
    imageScenesFullFrame:true,
  },
  imageWorld:{
    id:WORLD_ID,
    referencePromptFile:'03-szenen/bildwelt.txt',
    style:'premium-fintech-editorial-3d-metaphor',
    stylizedPersonAllowed:true,
    visibleFaceRequiredWhenPersonPresent:true,
    objectLabelsOnly:true,
    seamlessSingleBackgroundRequired:true,
    percentageZonesForbidden:true,
    backgroundBandsForbidden:true,
    floorWallBoundaryForbidden:true,
    horizonLineForbidden:true,
  },
  googleFlow:{
    generationMode:'one-image-at-a-time',
    fileNameRule:'Bild XX - Kurzer Szenenname.png',
    numberSource:'real-scene-number',
    animationNumbersStayReserved:true,
    finalCollectionDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',
    distributeToSceneFolders:false,
  },
  userMediaBoundary:{
    imagesDirectory:'03-szenen/00-ALLE-BILDER-HIER-REIN/',
    audioDirectory:'02-audio/',
    outsideMediaForbidden:true,
    substitutesForbidden:true,
    missingRequiredMediaIsBlocker:true,
  },
  platformPublishing:{
    directory:'04-caption',
    universalCaption:'04-caption/caption.txt',
    sameCaptionForAllReelPlatforms:true,
    platforms:['instagram-reels','tiktok','facebook-reels','snapchat'],
    hashtagCount:5,
    separatePlatformCaptionsForbidden:true,
  },
  timelineRules:{
    timingSource:'04-caption/word-timings.json',
    cutsFollowSentenceStarts:true,
    equalLengthScenesForbiddenByDefault:true,
    wordTimingsMustComeFromFinalAudio:true,
    evenlyDistributedWordTimingsForbidden:true,
  },
  imagePresentationContract:{
    mode:'full-frame-no-crop',
    fullCanvas:true,
    sourceMustBeVertical916:true,
    headlineOverlay:true,
    captionOverlay:true,
    continuousReadabilityScrimOnly:true,
    hardHeaderFooterPanelsForbidden:true,
    intentionalCropForbidden:true,
    blurredImageBackgroundForbidden:true,
    visibleInsetPanelForbidden:true,
  },
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  scenes,
},null,2)}\n`);

console.log(`✓ Neues FinanzNeo-Reel angelegt: ${root}`);
console.log(`  Szenen: ${scenes.length} · Bilder: ${imageSceneIds.length} · Animationen: ${animationSceneIds.length}`);
console.log('  Cover: Pflichtüberschrift direkt aus Google Flow · keine Remotion-Ersatzheadline');
console.log('  Bilddarstellung: full-frame-no-crop · vollständiges vertikales 9:16-Bild · Szenenheadline/Caption als Overlay');
console.log('  Untertitel: genau 1 Satz · max. 2 Zeilen · echte Audio-Wortgrenzen · keine schwarze Caption-Karte');
console.log('  Medien: nur Ziel-Reel-Sammelordner + 02-audio; fehlende Pflichtmedien blockieren finalen Build');
console.log('  Publishing: eine universelle caption.txt · Instagram/TikTok/Facebook/Snapchat · exakt 5 relevante Hashtags');
console.log('  YouTube: ausschließlich eigenständige Longform-Videos unter youtube/');
