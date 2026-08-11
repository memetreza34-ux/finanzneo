#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const readArg=(name)=>{const i=args.indexOf(`--${name}`);return i===-1?null:args[i+1]??null;};
const target=readArg('target');
if(!target){
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types ...]');
  process.exit(1);
}

const hasTypes=args.includes('--types');
const defaultTypes='image,animation,animation,image,animation,image,animation,animation,animation,image';
const scaffoldArgs=hasTypes?args:[...args,'--types',defaultTypes];
const result=spawnSync(process.execPath,['scripts/scaffold-finanzneo-reel.mjs',...scaffoldArgs],{stdio:'inherit'});
if(result.error){
  console.error(result.error.message);
  process.exit(1);
}
if(result.status!==0)process.exit(result.status??1);

const root=resolve(target);
const indexPath=resolve(root,'03-szenen/scene-index.json');
const timingPath=resolve(root,'04-caption/word-timings.json');
const timelinePath=resolve(root,'05-projektdateien/timeline.json');
const techPath=resolve(root,'05-projektdateien/technische-hinweise.md');
const planPath=resolve(root,'05-projektdateien/szenenplan.md');
const qaPath=resolve(root,'05-projektdateien/final-qa.json');

for(const path of [indexPath,timingPath,timelinePath,techPath,planPath]){
  if(!existsSync(path)){
    console.error(`Quality-Scaffolder: erwartete Datei fehlt: ${path}`);
    process.exit(1);
  }
}

const index=JSON.parse(readFileSync(indexPath,'utf8'));
index.version=17;
index.layout={...(index.layout??{}),subtitleBottom:320,subtitleLeft:72,subtitleRight:180,platformUiSafeBottom:280};
index.subtitleDisplay={
  ...(index.subtitleDisplay??{}),
  preferredSentences:1,
  maxSentences:1,
  maxLines:2,
  minFontSizePx:42,
  maxWordsPerCaptionUnit:12,
  maxCharactersPerCaptionUnit:72,
  semanticSplitAllowedForLongSentence:true,
  horizontalOverflowForbidden:true,
  clippingForbidden:true,
};
index.productionQualityContract={
  version:2,
  targetAnimationShare:0.60,
  minAnimationDurationShare:0.55,
  maxAnimationDurationShare:0.65,
  targetImageShare:0.40,
  minImageDurationShare:0.35,
  maxImageDurationShare:0.45,
  maxConsecutiveImageScenes:1,
  maxImageSceneSeconds:8,
  animationFirstForDynamicInformation:true,
  finalTimelineMustBeResolved:true,
  fullMp4QaRequired:true,
  imageSemanticQaRequired:true,
  audioQaRequired:true,
};
index.scenes=(index.scenes??[]).map((scene)=>({
  ...scene,
  visualRole:'[EINFÜGEN]',
  visualSelectionReason:'[EINFÜGEN – WARUM BILD ODER ANIMATION HIER DIE BESTE WAHL IST]',
}));
writeFileSync(indexPath,`${JSON.stringify(index,null,2)}\n`,'utf8');

const timing=JSON.parse(readFileSync(timingPath,'utf8'));
timing.version=Math.max(Number(timing.version)||0,4);
timing.rules={
  ...(timing.rules??{}),
  preferredCaptionUnitsVisible:1,
  maxCaptionUnitsVisible:1,
  maxLines:2,
  minFontSizePx:42,
  maxWordsPerCaptionUnit:12,
  maxCharactersPerCaptionUnit:72,
  semanticSplitAllowedForLongSentence:true,
  horizontalOverflowForbidden:true,
  clippingForbidden:true,
};
writeFileSync(timingPath,`${JSON.stringify(timing,null,2)}\n`,'utf8');

const timeline=JSON.parse(readFileSync(timelinePath,'utf8'));
timeline.version=Math.max(Number(timeline.version)||0,4);
timeline.qualityContract={
  timingMustBeResolvedBeforeFinalRender:true,
  animationDurationShare:'0.55-0.65',
  imageDurationShare:'0.35-0.45',
  maxImageSceneSeconds:8,
  maxConsecutiveImageScenes:1,
};
writeFileSync(timelinePath,`${JSON.stringify(timeline,null,2)}\n`,'utf8');

writeFileSync(qaPath,`${JSON.stringify({
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
},null,2)}\n`,'utf8');

const qualityText=`\n\n## QUALITY CONTRACT V2 — VERBINDLICH\n\n- Ziel: 60 % native Remotion-Animation / 40 % Google-Flow-Bild.\n- Finale Laufzeit: Animation 55–65 %, Bilder 35–45 %.\n- Bei 10 Szenen: 6 Animationen + 4 Bilder.\n- Höchstens eine Bildszene direkt hintereinander.\n- Bildszene normalerweise maximal 8 Sekunden.\n- Dynamische Information (Vergleich, Rechnung, Zeit, Wachstum, Geldfluss, Mechanismus, Ursache→Wirkung) bevorzugt Remotion.\n- Jedes Bild muss vor Einbau semantisch gegen den Voice-Beat geprüft werden.\n- Finale Timeline erst aus echtem finalen Audio + echten Wortzeiten.\n- Caption: genau eine kurze Einheit gleichzeitig, max. 12 Wörter / 72 Zeichen / 2 Zeilen, effektive Schrift mindestens 42 px.\n- Finale MP4 vollständig prüfen; Ergebnis in 05-projektdateien/final-qa.json dokumentieren.\n- Details: docs/REEL-QUALITY-CONTRACT-V2.md\n`;
writeFileSync(techPath,`${readFileSync(techPath,'utf8').trimEnd()}${qualityText}`,'utf8');
writeFileSync(planPath,`${readFileSync(planPath,'utf8').trimEnd()}\n\n## Visual-Auswahl pro Szene\n\nFür jede Szene vor Produktion ausfüllen:\n- Sprechbeat\n- Hauptaussage\n- Visualtyp\n- Visual Role\n- Begründung für Bild/Animation\n- Expected Visual\n\nDynamische Information ist animation-first. Ziel: 60 % Animation / 40 % Bilder.\n`,'utf8');

console.log('✓ Quality Contract V2 ergänzt.');
console.log('  Zielmix: 60 % Animation / 40 % Bilder (final 55–65 % Animation).');
console.log('  Captions: 1 kurze Einheit · max. 12 Wörter · 72 Zeichen · 2 Zeilen · min. 42 px.');
console.log('  Final QA: 05-projektdateien/final-qa.json ist vor PRODUCTION COMPLETE Pflicht.');
