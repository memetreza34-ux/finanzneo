#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ALL_PROMPTS,
  ANIMATION_SEAL,
  CAPTION_LAYER_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  GENERATED_IMAGE_ASPECT_MARKER,
  IMAGE_INBOX,
  MOTION_RENDER_QA,
  PRODUCTION_MANIFEST,
  SERIES_LOCK_MARKER,
  SOCIAL_PROMO_FILES,
  SUBTITLE_MODE,
  TIMELINE,
  VISUAL_INDEX,
  WORD_TIMINGS,
  WORLD_ID_MARKER,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_PUBLISHING_FILES,
  YOUTUBE_VIDEO_FPS,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
  YOUTUBE_VISUAL_TYPES,
} from './lib/youtube-contract.mjs';
import {requiresYouTubeImage, requiresYouTubeMotion} from './lib/youtube-motion-contract.mjs';

const args = process.argv.slice(2);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const targetArg = valueOf('--target');
const title = valueOf('--title');
const types = (valueOf('--types') ?? '').split(',').map((v) => v.trim()).filter(Boolean);

if (!targetArg || !title || types.length === 0) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" --types image,animation,hybrid,data,...');
  console.error('Keine Default-Szenenzahl: --types kommt aus dem fertigen Beat-Plan.');
  process.exit(1);
}
if (types.some((type) => !YOUTUBE_VISUAL_TYPES.includes(type))) {
  console.error(`--types darf nur enthalten: ${YOUTUBE_VISUAL_TYPES.join(', ')}.`);
  process.exit(1);
}

const root = resolve(targetArg);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss unter youtube/ liegen.');
  process.exit(1);
}
if (existsSync(root)) {
  console.error(`Ziel existiert bereits: ${root}`);
  process.exit(1);
}

const write = (path, content) => {
  const absolute = resolve(root, path);
  mkdirSync(resolve(absolute, '..'), {recursive: true});
  writeFileSync(absolute, content);
};
const num = (i) => String(i + 1).padStart(2, '0');
const idOf = (i) => `szene-${num(i)}`;
const dirOf = (i) => `03-szenen/${idOf(i)}`;
const imageNameOf = (i) => `YouTube Bild ${num(i)} - [KURZER NAME].png`;
const exportOf = (i) => `YouTubeScene${num(i)}Animation`;

const imageStyle = `${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\n${GENERATED_IMAGE_ASPECT_MARKER}\nIMAGE_STORYTELLING_STANDARD: finanzneo-image-storytelling-v3\n\nLiteral first, creative second. Concrete real-world finance situation first. Premium stylized 3D FinanzNeo world, deep black, emerald/mint accents, gold only for money/value, warm red-orange only for risk/loss/debt. Horizontal 16:9. No photorealism, no generic finance-icon collage, no dashboard as the main explanation, no conveyor/portal/cage/machine metaphor unless literally required by the situation.\n`;
const flowStep = (fileName) => `${FLOW_AGENT_PROTOCOL_MARKER}\nFINAL FILE NAME: ${fileName}\nGenerate exactly ONE image. Wait until complete. Rename it immediately. QA literal situation, labels, same-world lock and horizontal 16:9 before continuing. If it fails, regenerate the same image number. Never batch or queue images.\n`;
const imagePrompt = (i) => `${flowStep(imageNameOf(i))}\nLITERAL_REAL_WORLD_SITUATION: [EXAKTE SITUATION]\nREAL_WORLD_CONTEXT_ANCHOR: [KONTEXT]\nVOICEOVER_VISUAL_MATCH: [DIREKTER MATCH]\nTRANSFERABILITY_TEST: [PASS — WARUM THEMENSPEZIFISCH]\nVISUAL_STRATEGY: literal\nMETAPHOR_JUSTIFICATION: none\n\nIMAGE PROMPT:\n[PRODUKTIONSREIFER ENGLISCHER PROMPT]\n\n${imageStyle}`;

const motionTemplate = (i) => `import React from 'react';\nimport {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';\n\nexport const MECHANIC_ID = '[MECHANIC_ID]';\nexport const VISUAL_TECHNIQUE_ID = '[VISUAL_TECHNIQUE_ID]';\nexport const COMPOSITION_FAMILY_ID = '[COMPOSITION_FAMILY_ID]';\nexport const VIEWER_TEXT = ['[KURZER DEUTSCHER ZUSCHAUERTEXT]'];\nexport const MOTION_EVENTS = ['[EVENT 1]','[EVENT 2]','[EVENT 3]','[EVENT 4]'];\nexport const ANIMATION_NARRATIVE = {START:'[START]',MECHANISM:'[MECHANISMUS]',RESULT:'[RESULTAT]'};\n\nexport const ${exportOf(i)}: React.FC = () => {\n  const frame = useCurrentFrame();\n  const {fps} = useVideoConfig();\n  const a = interpolate(frame,[0,fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});\n  const b = spring({frame:frame-fps,fps,config:{damping:18,stiffness:120}});\n  const c = interpolate(frame,[2*fps,3*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});\n  const d = interpolate(frame,[3*fps,4*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});\n  return <AbsoluteFill style={{background:'#000'}}><div style={{opacity:a,scale:0.85+0.15*b,translate:(40-40*c)+'px 0px',rotate:(2-2*d)+'deg',color:'#fff'}}>{VIEWER_TEXT[0]}</div></AbsoluteFill>;\n};\n`;

const visuals = types.map((type, i) => {
  const id = idOf(i);
  const dir = dirOf(i);
  const visual = {id,type,chapter:'[KAPITEL]',scriptBeat:'[SPRECHBEAT]',wordStartIndex:-1,wordEndIndex:-1};
  if (requiresYouTubeImage({type})) {
    write(`${dir}/bildprompt.txt`, imagePrompt(i));
    Object.assign(visual,{googleFlowFileName:imageNameOf(i),expectedVisual:'[VISUAL]',objectLabels:[]});
  }
  if (requiresYouTubeMotion({type})) {
    write(`${dir}/remotion.md`, `# ${id} — Motion V3\n\n- Zuschauer-Erkenntnis: [KLARER SATZ]\n- Story: START → URSACHE → VERÄNDERUNG → RESULTAT\n- Technik: [INHALTSABHÄNGIG]\n- Motion-Events: support >=4, hero >=6\n- sichtbarer Text: nur kurzer finaler deutscher Zuschauertext\n- niemals Regieanweisungen rendern\n`);
    write(`${dir}/animation.tsx`, motionTemplate(i));
    Object.assign(visual,{
      planFile:`${dir}/remotion.md`,animationSourceFile:`${dir}/animation.tsx`,animationExport:exportOf(i),
      animationIntent:'[ANIMATION INTENT]',viewerTakeaway:'[ZUSCHAUER ERKENNT ...]',qualityTier:'support',
      mechanicId:'[MECHANIC_ID]',visualTechniqueId:'[VISUAL_TECHNIQUE_ID]',compositionFamilyId:'[COMPOSITION_FAMILY_ID]',repeatTechniqueReason:'',
      motionChannels:['[CHANNEL 1]','[CHANNEL 2]','[CHANNEL 3]'],visualBeats:['[START]','[BEAT 2]','[BEAT 3]','[RESULTAT]'],
      motionEvents:['[EVENT 1]','[EVENT 2]','[EVENT 3]','[EVENT 4]'],previewDurationFrames:180,maxQuietFrames:90,
    });
  } else visual.planFile = `${dir}/bildprompt.txt`;
  if (type === 'hybrid') visual.imagePlanFile = `${dir}/bildprompt.txt`;
  if (type === 'data') {
    write(`${dir}/data-notes.md`, '# Daten / Rechenweg\n\n[GEPRÜFTE QUELLE, ZAHLEN, EINHEITEN, RECHENWEG]\n');
    visual.dataNotesFile = `${dir}/data-notes.md`;
  }
  return visual;
});

write('README.md', `# ${title}\n\nFinanzNeo YouTube Longform — Motion V3.\n\n01-script · 02-audio · 03-szenen · 04-caption · 05-projektdateien · 06-export.\n\nFinalrender ausschließlich über \`npm run youtube:render -- ${targetArg}\`.\n`);
write('01-script/script-fliess-text.txt','[VOLLSTÄNDIGES VOICEOVER]\n');
write('01-script/kapitel-dramaturgie.md','# Kapitel / Dramaturgie\n\n[HOOK, KAPITEL, PAYOFFS, CTA]\n');
write('01-script/retention-plan.md','# Retention\n\n[PATTERN INTERRUPTS, OFFENE FRAGEN, VISUELLE PAYOFFS]\n');
write('02-audio/README.md','# AUDIO HIER REIN\n\nGenau ein finales Voiceover. Danach echte Word-Timestamps erzeugen und `youtube:timeline:build` ausführen.\n');
write(WORD_TIMINGS,`${JSON.stringify({version:'finanzneo-caption-v2',language:'de',source:'',duration:0,wordCount:0,fps:YOUTUBE_VIDEO_FPS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]},null,2)}\n`);
write(`${IMAGE_INBOX}/README.md`,'# ALLE FERTIGEN 16:9-BILDER HIER REIN\n');
write('03-szenen/bildwelt.txt',imageStyle);
write('03-szenen/thumbnail-prompt.txt',`${flowStep('YouTube Thumbnail - [KURZER NAME].png')}\nCreate one literal-first high-impact 16:9 thumbnail. No text inside the generated image.\n\n${imageStyle}`);
const promptSections = visuals.map((v,i)=>requiresYouTubeImage(v)?`\n━━ SZENE ${num(i)} ━━\n${imagePrompt(i)}`:`\n━━ SZENE ${num(i)} — REMOTION ━━\nDO NOT GENERATE AN IMAGE FOR THIS SCENE.\n`).join('\n');
write(ALL_PROMPTS,`FINANZNEO FLOW SINGLE-JOB FILE\n${FLOW_AGENT_PROTOCOL_MARKER}\nGenerate exactly ONE image at a time. Rename it immediately. QA before next. Literal first, creative second. Final images go to ${IMAGE_INBOX}/.\n${promptSections}\n`);
for (const [key,path] of Object.entries(YOUTUBE_PUBLISHING_FILES)) write(path,`[FINAL ${key}]\n`);
for (const [key,path] of Object.entries(SOCIAL_PROMO_FILES)) write(path,`[FINAL ${key}]\n`);
write('05-projektdateien/briefing.md','# Briefing\n\n[THEMA, ZIELGRUPPE, LERNZIEL, DATENSTAND]\n');
write('05-projektdateien/recherche-quellen.md','# Recherche / Quellen\n\n[GEPRÜFTE QUELLEN]\n');
write('05-projektdateien/visual-plan.md','# Visual-Plan\n\nBeat-first. Keine feste Quote. Motion muss einen Gedanken sichtbar passieren lassen. Statische Bilder maximal 7 Sekunden.\n');
write('05-projektdateien/remotion-plan.md',`# Remotion Motion V3\n\n${YOUTUBE_MOTION_STANDARD_ID}\n\nProduktionsreifer Code, deutscher Viewer-Text, Render-Frame-QA vor Seal, Captions Pflicht, Final-Staticness-QA.\n`);
write(VISUAL_INDEX,`${JSON.stringify({
  version:3,format:'youtube-longform',title,shortsForbidden:true,fixedVisualCount:false,fixedImageAnimationRatio:false,
  targetDurationSeconds:{min:480,max:600},video:{aspectRatio:'16:9',width:YOUTUBE_VIDEO_WIDTH,height:YOUTUBE_VIDEO_HEIGHT,fps:YOUTUBE_VIDEO_FPS},
  userCreatesImages:true,antigravityGeneratesImages:false,
  imageWorld:{id:'finanzneo-connected-studio-v3',seriesLockId:'finanzneo-same-world-v1',generatedImageAspectRatio:'16:9',literalFirst:true,metaphorOptional:true,referencePromptFile:'03-szenen/bildwelt.txt'},
  motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,contentFirstTechniqueSelection:true,existingComponentsOptional:true,physicalPrimitivesOptional:true,renderedFrameQaRequired:true,productionDirectionsForbiddenInViewerText:true},
  captions:{required:true,layerId:CAPTION_LAYER_ID,timingSource:WORD_TIMINGS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR},
  googleFlow:{protocolId:'finanzneo-flow-sequential-v1',generationMode:'one-image-at-a-time',strictSequential:true,finalCollectionDirectory:`${IMAGE_INBOX}/`},
  timelineRules:{beatFirst:true,wordTimestampDriven:true,staticImageMaxSeconds:7,maxStaticRunFinalSeconds:8},audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  thumbnail:{type:'image',googleFlowFileName:'YouTube Thumbnail - [KURZER NAME].png',planFile:'03-szenen/thumbnail-prompt.txt'},publishing:{youtube:YOUTUBE_PUBLISHING_FILES,socialPromo:SOCIAL_PROMO_FILES},visuals,
},null,2)}\n`);
write(TIMELINE,`${JSON.stringify({version:3,fps:YOUTUBE_VIDEO_FPS,timingSource:WORD_TIMINGS,cutRule:'real-word-timestamps',durationFrames:0,visuals:visuals.map((v)=>({id:v.id,type:v.type,startFrame:0,durationFrames:0}))},null,2)}\n`);
write(PRODUCTION_MANIFEST,`${JSON.stringify({version:1,compositionId:'[COMPOSITION_ID]',entryPoint:'src/index.ts',productionSourceFile:'05-projektdateien/production.tsx',outputFile:'06-export/final.mp4',captionLayerId:CAPTION_LAYER_ID},null,2)}\n`);
write(ANIMATION_SEAL,`${JSON.stringify({version:2,motionStandardId:YOUTUBE_MOTION_STANDARD_ID,sourceIndex:VISUAL_INDEX,motionRenderQa:MOTION_RENDER_QA,motionRenderQaSha256:'',entries:[]},null,2)}\n`);
write('06-export/README.md','# FINAL EXPORT\n\nNur ein durch youtube:render + youtube:final:qa freigegebenes MP4 hier ablegen.\n');

console.log(`✓ YouTube Motion V3 Projekt angelegt: ${targetArg}`);
console.log(`  ${visuals.length} Beat-Szenen · Reel-artige Ordnerstruktur · keine Default-Quote.`);
