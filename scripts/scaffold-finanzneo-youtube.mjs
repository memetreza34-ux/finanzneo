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
  IMAGE_STORYTELLING_CONTRACT_ID,
  MIN_IMAGE_ASSETS_8_TO_10_MIN,
  MIN_TOTAL_VISIBLE_BEATS_8_TO_10_MIN,
  MOTION_RENDER_QA,
  PREMIUM_VISUAL_WORLD_LOCK_ID,
  PRODUCTION_MANIFEST,
  SERIES_LOCK_MARKER,
  SOCIAL_PROMO_FILES,
  STATIC_IMAGE_MAX_SECONDS,
  SUBTITLE_MODE,
  TIMELINE,
  VISUAL_INDEX,
  WORD_TIMINGS,
  WORLD_ID_MARKER,
  YOUTUBE_IMAGE_DENSITY_STANDARD_ID,
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

const imageStyle = `${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\nPREMIUM_VISUAL_WORLD_LOCK: ${PREMIUM_VISUAL_WORLD_LOCK_ID}\n${GENERATED_IMAGE_ASPECT_MARKER}\nIMAGE_STORYTELLING_CONTRACT: ${IMAGE_STORYTELLING_CONTRACT_ID}\n\nLITERAL_FIRST_POLICY: Literal first, creative second.\n\nSTYLE:\nCreate a premium real-world-grounded stylized 3D explanatory scene in the exact FinanzNeo Reel visual language. Everyday objects must keep believable proportions, recognizable construction and useful material detail, while the final rendering remains clearly stylized and never photorealistic. The result must feel intentionally art-directed and authored, not like generic AI art, a toy, a game asset, an icon pack or a stock photograph.\n\nBACKGROUND:\nA seamless deep-black background is mandatory. A small believable local environment such as part of a desk, bank counter, home office, shop, contract table or custody context may appear when it helps explain the situation, but it must visually dissolve into the deep-black world. Keep the background clean and non-distracting. Horizontal cinematic 16:9 composition only.\n\nCOMPOSITION:\nThe image must visually explain the exact spoken point, not merely symbolize the general finance topic. Build one coherent real-life situation with the necessary context and make cause and effect readable in the same frame whenever possible. Use familiar objects that directly match the content. Supporting objects have no fixed count: include only what is needed for immediate understanding. The viewer should understand the intended meaning within 1–2 seconds without a subtitle. Prefer one additional focused image over an overloaded still.\n\nMATERIALS + LIGHT:\nUse premium matte, paper, glass, metal and soft-plastic materials with believable contact shadows and restrained studio lighting. Emerald green is for positive/active elements, warm ivory and soft gray for neutral surfaces, subtle gold only for money/value and warm red-orange only for risk/loss/cost. Keep glow restrained; the frame must not become neon or cyberpunk.\n\nBRANDS + LOGOS:\nDo not invent fake corporate logos or fill scenes with random brand marks. If a real brand is essential to the spoken point, keep it secondary and stylized in the same world; never paste a real screenshot or flat logo into the scene. Prefer generic recognizable company/market context when the specific brand is not necessary.\n\nTEXT:\nOnly explicitly requested short German object labels may appear. Labels are supplemental and attached to the exact object/state they describe. No headline, subtitle, CTA, long explanatory sentence or random generated text inside the image.\n\nANTI_AI_LOOK_QA:\nReject and regenerate if the image looks generically AI-generated: impossible geometry, melted or duplicated objects, random unreadable text, fake logos, excessive glow, incoherent details, meaningless cable networks, floating technology panels, fantasy machinery, game-map aesthetics, miniature diorama staging or decorative complexity without explanatory purpose.\n\nFORBIDDEN:\nNo photorealism or stock-photo look. No Pixar/clay/toy look. No sci-fi, cyberpunk or neon-tech environment. No generic finance-icon collage as the main explanation. No isolated vault + shield + coins + arrow composition. No fantasy vaults, portals, conveyor belts, rails, cages, sorting machines or giant levers unless that exact real object is literally part of the situation. No dashboard/app UI as the main composition. No fake broker screenshot. No flowchart as the main composition. No tiny floating info cards. No microchip/circuit-board visual language. No miniature world map made of toy buildings. No decorative brand-logo wall. No visual clutter.\n`;

const flowStep = (fileName) => `${FLOW_AGENT_PROTOCOL_MARKER}\nFINAL FILE NAME: ${fileName}\nGenerate exactly ONE image. Wait until it is fully complete. Rename it immediately to the exact final file name. QA the literal situation, recognizable real-world context, short labels, written V9 same-world lock, clean deep-black background and horizontal 16:9 before continuing. Reject generic AI-looking, neon-tech, toy-like, miniature-diorama, fantasy-machine, fake-UI or fake-logo results. If any check fails, regenerate the same image number. Never batch, queue or merge prompts.\n`;

const imagePrompt = (i) => `${flowStep(imageNameOf(i))}\nVISUAL_STRATEGY: literal\nLITERAL_REAL_WORLD_SITUATION: [EXAKTE REALE SITUATION]\nREAL_WORLD_CONTEXT_ANCHOR: [KLAR ERKENNBARER ALLTAGS-/FINANZKONTEXT]\nVOICEOVER_VISUAL_MATCH: [WELCHES SICHTBARE DETAIL ZEIGT EXAKT DEN SPRECHBEAT]\nTRANSFERABILITY_TEST: [PASS — WARUM DIESES BILD NICHT UNVERÄNDERT ZU FÜNF ANDEREN FINANZTHEMEN PASST]\nSUBTITLE_OFF_TEST: [PASS — WAS EIN FREMDER ZUSCHAUER OHNE TEXT ERKENNT]\nMETAPHOR_JUSTIFICATION: none\n\nIMAGE PROMPT:\n[PRODUKTIONSREIFER ENGLISCHER PROMPT FÜR GENAU DIESEN BEAT]\n\n${imageStyle}`;

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

write('README.md', `# ${title}\n\nFinanzNeo YouTube Longform — Motion V3 + Reel Image World V9.\n\n01-script · 02-audio · 03-szenen · 04-caption · 05-projektdateien · 06-export.\n\nFür 8–10 Minuten: mindestens ${MIN_IMAGE_ASSETS_8_TO_10_MIN} unterschiedliche Bild-/Hybrid-Assets und mindestens ${MIN_TOTAL_VISIBLE_BEATS_8_TO_10_MIN} sichtbare Beats planen. Keine starre Quote; wenn der Inhalt mehr Bilder braucht, mehr Bilder verwenden.\n\nFinalrender ausschließlich über \`npm run youtube:render -- ${targetArg}\`.\n`);
write('01-script/script-fliess-text.txt','[VOLLSTÄNDIGES VOICEOVER]\n');
write('01-script/kapitel-dramaturgie.md','# Kapitel / Dramaturgie\n\n[HOOK, KAPITEL, PAYOFFS, CTA]\n');
write('01-script/retention-plan.md','# Retention\n\n[PATTERN INTERRUPTS, OFFENE FRAGEN, VISUELLE PAYOFFS]\n');
write('02-audio/README.md','# AUDIO HIER REIN\n\nGenau ein finales Voiceover. Danach echte Word-Timestamps erzeugen und `youtube:timeline:build` ausführen.\n');
write(WORD_TIMINGS,`${JSON.stringify({version:'finanzneo-caption-v2',language:'de',source:'',duration:0,wordCount:0,fps:YOUTUBE_VIDEO_FPS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]},null,2)}\n`);
write(`${IMAGE_INBOX}/README.md`,'# ALLE FERTIGEN 16:9-BILDER HIER REIN\n');
write('03-szenen/bildwelt.txt',imageStyle);
write('03-szenen/thumbnail-prompt.txt',`${flowStep('YouTube Thumbnail - [KURZER NAME].png')}\nCreate one literal-first high-impact 16:9 thumbnail in the exact written FinanzNeo V9 Reel visual world. Use one concrete real-world finance situation and one unmistakable focal conflict. No generated headline text. No neon-tech, toy, fake-UI or generic AI-art look.\n\n${imageStyle}`);
const promptSections = visuals.map((v,i)=>requiresYouTubeImage(v)?`\n━━ SZENE ${num(i)} ━━\n${imagePrompt(i)}`:`\n━━ SZENE ${num(i)} — REMOTION ━━\nDO NOT GENERATE AN IMAGE FOR THIS SCENE.\n`).join('\n');
write(ALL_PROMPTS,`FINANZNEO FLOW SINGLE-JOB FILE\n${FLOW_AGENT_PROTOCOL_MARKER}\nPREMIUM_VISUAL_WORLD_LOCK: ${PREMIUM_VISUAL_WORLD_LOCK_ID}\nIMAGE_STORYTELLING_CONTRACT: ${IMAGE_STORYTELLING_CONTRACT_ID}\nGenerate exactly ONE image at a time. Rename it immediately. QA before next. Literal first, creative second. Use the exact written Reel V9 visual world. Reject generic AI-art, neon-tech, toy-like, miniature-diorama, fake-UI and fantasy-machine outputs. Final images go to ${IMAGE_INBOX}/.\n${promptSections}\n`);
for (const [key,path] of Object.entries(YOUTUBE_PUBLISHING_FILES)) write(path,`[FINAL ${key}]\n`);
for (const [key,path] of Object.entries(SOCIAL_PROMO_FILES)) write(path,`[FINAL ${key}]\n`);
write('05-projektdateien/briefing.md','# Briefing\n\n[THEMA, ZIELGRUPPE, LERNZIEL, DATENSTAND]\n');
write('05-projektdateien/recherche-quellen.md','# Recherche / Quellen\n\n[GEPRÜFTE QUELLEN]\n');
write('05-projektdateien/visual-plan.md',`# Visual-Plan\n\nBeat-first. Keine feste Bild-/Animationsquote. Für 8–10 Minuten mindestens ${MIN_IMAGE_ASSETS_8_TO_10_MIN} unterschiedliche Bild-/Hybrid-Assets und mindestens ${MIN_TOTAL_VISIBLE_BEATS_8_TO_10_MIN} sichtbare Beats. Ein zusätzliches gutes Bild ist besser als ein überladener Still. Reine Bildbeats maximal ${STATIC_IMAGE_MAX_SECONDS} Sekunden. Motion muss einen Gedanken sichtbar passieren lassen.\n`);
write('05-projektdateien/remotion-plan.md',`# Remotion Motion V3\n\n${YOUTUBE_MOTION_STANDARD_ID}\n\nProduktionsreifer Code, deutscher Viewer-Text, Render-Frame-QA vor Seal, Captions Pflicht, Final-Staticness-QA.\n`);
write(VISUAL_INDEX,`${JSON.stringify({
  version:3,format:'youtube-longform',title,shortsForbidden:true,fixedVisualCount:false,fixedImageAnimationRatio:false,
  targetDurationSeconds:{min:480,max:600},video:{aspectRatio:'16:9',width:YOUTUBE_VIDEO_WIDTH,height:YOUTUBE_VIDEO_HEIGHT,fps:YOUTUBE_VIDEO_FPS},
  userCreatesImages:true,antigravityGeneratesImages:false,
  imageWorld:{
    id:'finanzneo-connected-studio-v3',seriesLockId:'finanzneo-same-world-v1',premiumVisualWorldLockId:PREMIUM_VISUAL_WORLD_LOCK_ID,
    imageStorytellingContractId:IMAGE_STORYTELLING_CONTRACT_ID,generatedImageAspectRatio:'16:9',style:'stylized-3d-animated-black-v9',
    literalFirst:true,metaphorOptional:true,referencePromptFile:'03-szenen/bildwelt.txt',styleReferenceStrategy:'written-style-lock-only',referenceImageUse:'forbidden',
    sameWorldAcrossSeriesRequired:true,realWorldGroundedSituationRequired:true,believableObjectProportionsRequired:true,recognizableEverydayDetailsRequired:true,
    genericAiLookForbidden:true,sciFiNeonTechForbidden:true,toyGameLookForbidden:true,miniatureDioramaForbidden:true,fakeUiForbidden:true,fakeLogoWallForbidden:true,
    abstractSymbolOnlyCompositionForbidden:true,genericFinanceIconCompositionForbidden:true,photorealismForbidden:true,clutterForbidden:true,
  },
  imageDensity:{id:YOUTUBE_IMAGE_DENSITY_STANDARD_ID,adaptive:true,minDistinctImageAssetsFor8to10Min:MIN_IMAGE_ASSETS_8_TO_10_MIN,minTotalVisibleBeatsFor8to10Min:MIN_TOTAL_VISIBLE_BEATS_8_TO_10_MIN,staticImageMaxSeconds:STATIC_IMAGE_MAX_SECONDS,preferExtraImageOverOverloadedStill:true,oneImagePerSentenceWhenItImprovesClarity:true},
  motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,contentFirstTechniqueSelection:true,existingComponentsOptional:true,physicalPrimitivesOptional:true,renderedFrameQaRequired:true,productionDirectionsForbiddenInViewerText:true},
  captions:{required:true,layerId:CAPTION_LAYER_ID,timingSource:WORD_TIMINGS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR},
  googleFlow:{protocolId:'finanzneo-flow-sequential-v1',generationMode:'one-image-at-a-time',strictSequential:true,finalCollectionDirectory:`${IMAGE_INBOX}/`},
  timelineRules:{beatFirst:true,wordTimestampDriven:true,staticImageMaxSeconds:STATIC_IMAGE_MAX_SECONDS,maxStaticRunFinalSeconds:8},audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  thumbnail:{type:'image',googleFlowFileName:'YouTube Thumbnail - [KURZER NAME].png',planFile:'03-szenen/thumbnail-prompt.txt'},publishing:{youtube:YOUTUBE_PUBLISHING_FILES,socialPromo:SOCIAL_PROMO_FILES},visuals,
},null,2)}\n`);
write(TIMELINE,`${JSON.stringify({version:3,fps:YOUTUBE_VIDEO_FPS,timingSource:WORD_TIMINGS,cutRule:'real-word-timestamps',durationFrames:0,visuals:visuals.map((v)=>({id:v.id,type:v.type,startFrame:0,durationFrames:0}))},null,2)}\n`);
write(PRODUCTION_MANIFEST,`${JSON.stringify({version:1,compositionId:'[COMPOSITION_ID]',entryPoint:'src/index.ts',productionSourceFile:'05-projektdateien/production.tsx',outputFile:'06-export/final.mp4',captionLayerId:CAPTION_LAYER_ID},null,2)}\n`);
write(ANIMATION_SEAL,`${JSON.stringify({version:2,motionStandardId:YOUTUBE_MOTION_STANDARD_ID,sourceIndex:VISUAL_INDEX,motionRenderQa:MOTION_RENDER_QA,motionRenderQaSha256:'',entries:[]},null,2)}\n`);
write('06-export/README.md','# FINAL EXPORT\n\nNur ein durch youtube:render + youtube:final:qa freigegebenes MP4 hier ablegen.\n');

console.log(`✓ YouTube Motion V3 Projekt angelegt: ${targetArg}`);
console.log(`  ${visuals.length} Beat-Szenen · Reel-artige Ordnerstruktur · Reel Image World V9 · adaptive Bilddichte.`);
