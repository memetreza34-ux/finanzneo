#!/usr/bin/env node
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  GENERATED_IMAGE_ASPECT_MARKER,
  GENERATED_IMAGE_ASPECT_RATIO,
  IMAGE_INBOX,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  SOCIAL_PROMO_FILES,
  SUBTITLE_MODE,
  WORD_TIMING_PURPOSE,
  WORLD_ID,
  WORLD_ID_MARKER,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_PUBLISHING_FILES,
  YOUTUBE_RENDER_CAPTIONS,
  YOUTUBE_VIDEO_ASPECT_RATIO,
  YOUTUBE_VIDEO_FPS,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
  YOUTUBE_VISUAL_TYPES,
  YOUTUBE_IMAGE_WORLD_LOCK,
  YOUTUBE_FLOW_IMAGE_POLICY_ID,
  YOUTUBE_FLOW_EXECUTION_MODE_ID,
  YOUTUBE_FLOW_ONE_FOLDER_MARKER,
  YOUTUBE_FLOW_DELETE_LOSERS_MARKER,
  YOUTUBE_FLOW_FINISHED_FOLDER_MARKER,
  YOUTUBE_THUMBNAIL_CANDIDATE_COUNT,
  YOUTUBE_THUMBNAIL_CONCURRENCY,
  YOUTUBE_IMAGE_BATCH_SIZE,
  YOUTUBE_IMAGE_CONCURRENCY,
  YOUTUBE_MIN_MOTION_VISUALS,
} from './lib/youtube-contract.mjs';
import {requiresYouTubeImage, requiresYouTubeMotion} from './lib/youtube-motion-contract.mjs';

const args = process.argv.slice(2);
const valueOf = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const targetArg = valueOf('--target');
const title = valueOf('--title');
const typesArg = valueOf('--types');
const types = typesArg ? typesArg.split(',').map((value) => value.trim()).filter(Boolean) : [];

if (!targetArg || !title) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types image,hybrid,animation,data,...]');
  process.exit(1);
}
if (types.some((type) => !YOUTUBE_VISUAL_TYPES.includes(type))) {
  console.error(`--types darf nur enthalten: ${YOUTUBE_VISUAL_TYPES.join(', ')}.`);
  process.exit(1);
}
const requestedMotionCount = types.filter((type) => ['animation', 'hybrid', 'data'].includes(type)).length;
if (types.length > 0 && requestedMotionCount < YOUTUBE_MIN_MOTION_VISUALS) {
  console.error(`YouTube Longform braucht mindestens ${YOUTUBE_MIN_MOTION_VISUALS} Motion-Visuals (animation/hybrid/data).`);
  process.exit(1);
}

const youtubeRoot = resolve('youtube');
const root = resolve(targetArg);
const relativeTarget = relative(youtubeRoot, root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein neuer Projektordner direkt oder verschachtelt unter youtube/ sein.');
  process.exit(1);
}
if (existsSync(root)) {
  console.error(`Ziel existiert bereits: ${root}`);
  process.exit(1);
}

const write = (relativePath, content) => {
  const path = resolve(root, relativePath);
  mkdirSync(resolve(path, '..'), {recursive: true});
  writeFileSync(path, content);
};
const numberOf = (index) => String(index + 1).padStart(2, '0');
const visualFileName = (index) => `YouTube Bild ${numberOf(index)} - [KURZER NAME].png`;
const thumbnailFileName = 'YouTube Thumbnail - [KURZER NAME].png';
const exportNameFor = (index) => `YouTubeVisual${numberOf(index)}Animation`;

const styleBlock = `${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\n${GENERATED_IMAGE_ASPECT_MARKER}\nYOUTUBE_VISUAL_WORLD_LOCK: ${YOUTUBE_IMAGE_WORLD_LOCK}\nFLOW_IMAGE_POLICY: ${YOUTUBE_FLOW_IMAGE_POLICY_ID}\n\nLOOK FIXED — CONTENT AND FORM FREE. Understand the spoken beat first, then choose the strongest visual form. Equal options: isolated object, object detail, hands, character moment, everyday scene, comparison, semantic object composition, visual metaphor, creative idea or hybrid plate. There is no scene-first rule, no people quota and no location requirement.\n\nMEANING FIRST: every visible object and its position must have a reason. Objects may float or stand in empty space when their relationship communicates cause/effect, before/after, choice, comparison, repetition or hierarchy. Never create decorative spirals, trails, object clouds, tables, rooms or people just to fill the frame.\n\nLOOK: stylized 3D animated-feature-film rendering, never photorealistic; believable materials; soft natural key light; gentle rim; deep seamless black. Emerald = positive, warm red-orange = cost/warning, gold only as small value accent, ivory/soft gray neutral.\n\nNATURAL, NOT AI-LOOKING: no glowing/neon edges, glass finance bars, value blocks, smoke, sparks, lens flares, epic drama, generic finance collage or decorative money piles.\n\nPRECISION: exact charts, axes, numbers, tables, checklists and UI belong to Remotion.\n\nCAMERA FREE: macro, close-up, top-down, frontal, side, 3/4, isolated object or wide scene are all allowed. No forced eye-level, horizon, room or depth layers.\n\nhorizontal 16:9 source image. Main information large enough for phone viewing. Short German object labels only when useful. Prompts in English.\n`;

const flowStep = (fileName, referenceText) => `${FLOW_AGENT_PROTOCOL_MARKER}\nONE JOB = ONE IMAGE\n\nFINAL FILE NAME:\n${fileName}\n\nThis prompt belongs to one separate image-generation job. Generate exactly ONE image for this job. ${referenceText} As soon as the result returns, rename it immediately to the exact final file name, place it in the final image directory and run QA. If it fails, regenerate only this same image number. Never render the file name inside the image.\n`;

const promptFor = (index) => {
  const name = visualFileName(index);
  return `${flowStep(name, 'Use only the written FinanzNeo YouTube world. Do not use the selected thumbnail or another scene as a style reference.')}\nCORE_MESSAGE: [ONE SENTENCE — WHAT MUST THE VIEWER UNDERSTAND]\nVISUAL_FORM: [FREE CONTENT-SPECIFIC FORM — e.g. schema illustration, concept illustration, comparison, object detail, action, scene, hybrid, or any clearer form]\nTWO_SECOND_TAKEAWAY: [WHAT MUST BE UNDERSTOOD IN ABOUT TWO SECONDS]\nWHY_THIS_FORM: [WHY THIS FORM EXPLAINS THIS BEAT BETTER THAN THE OBVIOUS ALTERNATIVES]\nESSENTIAL_ELEMENTS: [ONLY THE FEW ELEMENTS NEEDED TO EXPLAIN THE CORE MESSAGE]\nREMOVE_IF_NOT_NEEDED: [PEOPLE / ROOM / TABLE / EXTRA OBJECTS / DECORATION / TEXT — REMOVE WHATEVER DOES NOT HELP]\nVISUAL_CONCEPT: [ONE CLEAR CONTENT-SPECIFIC IDEA]\nMEANING_RELATION: [WHY EACH OBJECT AND ITS POSITION EXPLAINS THE SPOKEN BEAT]\nDECISIVE_MOMENT: [not-applicable OR THE EXACT SECOND IF ACTION REALLY MATTERS]\nVOICEOVER_VISUAL_MATCH: [WHY THIS DIRECTLY EXPLAINS THE SPOKEN BEAT]\nFRONT_READABILITY_TEST: [PASS — WHY THE MAIN IDEA IS CLEAR IN ABOUT TWO SECONDS]\nDATA_INTEGRITY_TEST: [PASS FOR EXACT DATA OR not-applicable]\n\nIMAGE PROMPT:\nStylized 3D animated feature film still, 16:9. [BEST VISUAL IDEA FOR THIS SPOKEN BEAT — OBJECT, DETAIL, ACTION, SCENE, COMPARISON, SEMANTIC OBJECT COMPOSITION OR VISUAL METAPHOR]. [OPTIONAL LOCATION ONLY IF IT ADDS MEANING — OMIT OTHERWISE]. Only text: "[MAX TWO SHORT GERMAN LABELS — OR WRITE: No text.]". Soft natural light, deep black background. Not photorealistic, no logos.\n\nQA\nPASS only if the meaning is clear, every element has a reason, and no person/place/table/decorative object was added just to make the frame look complete.\n\n${styleBlock}`;
};

const thumbnailPrompt = `${FLOW_AGENT_PROTOCOL_MARKER}\nYOUTUBE THUMBNAIL PHASE — THREE SEPARATE JOBS IN PARALLEL\n\nCreate exactly three separate 16:9 thumbnail candidates A, B and C as three concurrent one-image jobs. All three use the written ${YOUTUBE_IMAGE_WORLD_LOCK} world directly. No candidate is a style reference for another image.\n\nTEXT RULE FOR ALL THREE: visible German hook text is required, max 2 lines, ideally 2–5 words, directly about the real video content.\n\nTHUMBNAIL A/B/C: three genuinely different visual ideas for the same topic. Do not force one candidate to be a person, one hands and one object. Choose three strong concepts independently. A candidate may be an isolated object, a semantic object composition, a real scene, a comparison or another immediately clear idea.\nPROMPT FORM: Stylized 3D animated feature film still, 16:9. [BEST VISUAL IDEA]. [OPTIONAL LOCATION ONLY IF USEFUL]. Big clean white headline on the left: "[HOOK]". Soft natural light, deep black background. Not photorealistic, no logos.\n\nForbidden: arbitrary finance symbols, decorative spirals/trails, giant gold percentage statues, trophy plinths, glass money jars, coin mountains, generic finance icon collage.\n\nTemporary names: YouTube Thumbnail A.png, YouTube Thumbnail B.png, YouTube Thumbnail C.png. After all three pass QA, stop once and ask A/B/C. Delete the two non-selected candidates and rename the selected candidate to ${thumbnailFileName}. The selected thumbnail is NOT a style reference for scene images.\n\n${styleBlock}`;

const motionTemplate = (index, type) => {
  const exportName = exportNameFor(index);
  return `import React from 'react';\nimport {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';\n\nexport const MECHANIC_ID = '[MECHANIC_ID]';\nexport const VISUAL_TECHNIQUE_ID = '[VISUAL_TECHNIQUE_ID]';\nexport const COMPOSITION_FAMILY_ID = '[COMPOSITION_FAMILY_ID]';\nexport const RESULT_HOLD_FRAMES = 36;\nexport const ANIMATION_NARRATIVE = {\n  START: '[START STATE]',\n  MECHANISM: '[VISIBLE CHANGE]',\n  RESULT: '[CLEAR RESULT]',\n};\n\nexport const ${exportName}: React.FC = () => {\n  const frame = useCurrentFrame();\n  const progress = interpolate(frame, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});\n  return (\n    <AbsoluteFill>\n      {/* PLACEHOLDER: replace in Phase 1 with production-ready ${type} motion chosen from viewerChange, not from a preset animation list. */}\n      <div style={{opacity: progress}}>[EINFÜGEN]</div>\n    </AbsoluteFill>\n  );\n};\n`;
};

const visuals = types.map((type, index) => {
  const number = numberOf(index);
  const id = `visual-${number}`;
  const directory = `04-visuals/EINZELNE-VISUALS/${id}`;
  const base = {
    id,
    type,
    chapter:'[CHAPTER]',
    scriptBeat:'[SCRIPT BEAT]',
    coreMessage:'[ONE CORE MESSAGE]',
    visualForm:'[FREE VISUAL FORM — schema, illustration, comparison, object, scene, detail, hybrid, or a better custom form]',
    twoSecondTakeaway:'[WHAT THE VIEWER UNDERSTANDS IN ABOUT TWO SECONDS]',
    whyThisForm:'[WHY THIS FORM IS THE CLEAREST FOR THIS BEAT]',
    essentialElements:['[ESSENTIAL ELEMENT 1]'],
  };

  if (requiresYouTubeImage({type})) {
    write(`${directory}/bildprompt.txt`, promptFor(index));
    Object.assign(base, {googleFlowFileName:visualFileName(index),expectedVisual:'[VISUAL DESCRIPTION]',objectLabels:['[LABEL]']});
  }

  if (requiresYouTubeMotion({type})) {
    const animationSourceFile = `${directory}/animation.tsx`;
    const animationExport = exportNameFor(index);
    write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\nMOTION_STANDARD: ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Kapitel: [CHAPTER]\n- Sprechtext-Bezug: [SCRIPT BEAT]\n- Viewer Change: [VIEWER CHANGE]\n- Animation Intent: [ANIMATION INTENT]\n- Mechanik: [MECHANIC]\n- Technikbeschreibung: [TECHNIQUE DESCRIPTION]\n- Tool Stack: [TOOL STACK]\n- Composition Family: [FREE DESCRIPTIVE FAMILY]\n- Motion Signature Camera: [CAMERA BEHAVIOR]\n- Motion Signature Layout: [SPATIAL / COMPOSITIONAL ARRANGEMENT]\n- Motion Signature Transformation: [PRIMARY VISIBLE TRANSFORMATION]\n- Startzustand: [START]\n- sichtbare Mechanik/Transformation: [TRANSFORMATION]\n- Resultat: [RESULT]\n- Motion Channels: [AT LEAST TWO MEANINGFUL CHANNELS]\n- SFX-Cues: [OPTIONAL FRAME-BOUND EVENTS]\n\nWähle die Technik erst NACH dem Viewer Change. Wiederholung ist erlaubt, wenn sie wirklich die beste Erklärung ist und begründet wird.\n`);
    write(animationSourceFile, motionTemplate(index, type));
    Object.assign(base, {
      planFile:`${directory}/remotion.md`,animationSourceFile,animationExport,
      viewerChange:'[VIEWER CHANGE]',animationIntent:'[ANIMATION INTENT]',mechanicId:'[MECHANIC_ID]',visualTechniqueId:'[VISUAL_TECHNIQUE_ID]',techniqueDescription:'[TECHNIQUE DESCRIPTION]',compositionFamilyId:'[COMPOSITION_FAMILY_ID]',toolStack:['[TOOL 1]'],
      motionSignature:{camera:'[CAMERA]',layout:'[LAYOUT]',transformation:'[TRANSFORMATION]'},
      repeatTechniqueReason:'',motionChannels:['[CHANNEL 1]','[CHANNEL 2]'],visualBeats:['[START]','[CHANGE]','[RESULT]'],
      clarityPlan:{start:'[CLEAR START STATE]',change:'[ONE MAIN VISIBLE CHANGE]',result:'[ONE CLEAR FINAL RESULT]',resultHoldFrames:36},
    });
  } else {
    base.planFile = `${directory}/bildprompt.txt`;
  }

  if (type === 'hybrid') {
    base.imagePlanFile = `${directory}/bildprompt.txt`;
    base.motionPlanFile = `${directory}/remotion.md`;
  }
  if (type === 'data') {
    write(`${directory}/data-notes.md`, '# Daten / Rechenweg\n\n[GEPRÜFTE DATENQUELLE, WERTE, EINHEITEN, RECHENWEG UND DARSTELLUNGSGRENZEN EINFÜGEN]\n');
    base.dataNotesFile = `${directory}/data-notes.md`;
  }
  return base;
});

const promptSections = visuals.map((visual, index) => {
  if (!requiresYouTubeImage(visual)) {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — ${visual.type.toUpperCase()} / REMOTION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDO NOT GENERATE IMAGE ${numberOf(index)}. Keep this number reserved and continue with the next block.\n`;
  }
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — ${visual.type.toUpperCase()} IMAGE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${promptFor(index)}`;
}).join('\n');

write('README.md', `# ${title}\n\nEigenständiges YouTube-Longform-Projekt. Kein Reel und kein YouTube Short.\n\n## Drei Phasen\n\n1. ChatGPT vervollständigt Recherche, Skript, Visual Beats, Visualtypen, alle Bildprompts und jede Motion-Szene. Bildlogik: Bedeutung zuerst, Form frei.\n2. Der Nutzer erstellt Thumbnail und alle benötigten 16:9-Bilder mit Google Flow und legt sie gemeinsam in \`${IMAGE_INBOX}/\`. Danach genau ein finales Voiceover plus echte Wort-Timings.\n3. Nach Validation + Seal integriert Phase 3 Bilder/Motion, retimed zum Voiceover und übernimmt QA/Render.\n`);
write('01-recherche/briefing.md', '# Briefing\n\n- Thema: [THEMA]\n- Zielgruppe: Finanzanfänger\n- Lernziel: [EINFÜGEN]\n- Kernversprechen: [EINFÜGEN]\n- Warum Longform nötig ist: [EINFÜGEN]\n- Datenstand: [EINFÜGEN]\n');
write('01-recherche/recherche-quellen.md', '# Recherche und Quellen\n\n[GEPRÜFTE QUELLEN, DATENSTAND, ANNAHMEN UND RECHENWEGE EINFÜGEN]\n');
write('02-script/script-fliess-text.txt', '[VOLLSTÄNDIGES LONGFORM-VOICEOVER-SKRIPT EINFÜGEN]\n');
write('02-script/kapitel-dramaturgie.md', '# Kapitel und Dramaturgie\n\n[HOOK, KAPITEL, BEISPIELE, PAYOFFS, ZUSAMMENFASSUNG UND CTA EINFÜGEN]\n');
write('02-script/retention-plan.md', '# Retention-Plan\n\n[OFFENE FRAGEN, PAYOFFS, PATTERN-INTERRUPTS, VISUELLE RHYTHMUSWECHSEL UND ÜBERGÄNGE EINFÜGEN]\n');
write('03-audio/README.md', '# AUDIO HIER REIN\n\nGenau eine finale Voiceover-Datei ablegen. Danach echte Wort-Zeitstempel in `word-timings.json` erzeugen. Diese dienen Schnitt und externem Export; keine eingebrannten Untertitel.\n');
write('03-audio/word-timings.json', `${JSON.stringify({version:'finanzneo-word-timing-v2',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:YOUTUBE_VIDEO_FPS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,renderCaptions:YOUTUBE_RENDER_CAPTIONS,purpose:WORD_TIMING_PURPOSE,words:[],sentences:[]}, null, 2)}\n`);
write(`${IMAGE_INBOX}/README.md`, `# ALLE FERTIGEN 16:9-BILDER HIER REIN\n\nFinales ausgewähltes Thumbnail plus alle finalen Video-Bilder. Flow arbeitet nach der Thumbnail-Auswahl in parallelen Batches mit maximal ${YOUTUBE_IMAGE_BATCH_SIZE} getrennten Ein-Bild-Jobs. Jedes Bild sofort exakt umbenennen und QA prüfen.\n`);
write('04-visuals/bildwelt.txt', `FINANZNEO YOUTUBE IMAGE WORLD\n\n${styleBlock}`);
write('04-visuals/thumbnail-prompt.txt', thumbnailPrompt);
write('04-visuals/alle-bildprompts.txt', `FINANZNEO — GOOGLE FLOW YOUTUBE HANDOFF\n\n${FLOW_AGENT_PROTOCOL_MARKER}\nFLOW_EXECUTION_MODE: ${YOUTUBE_FLOW_EXECUTION_MODE_ID}\nFLOW_IMAGE_POLICY: ${YOUTUBE_FLOW_IMAGE_POLICY_ID}\nTHUMBNAIL_CONCURRENCY: ${YOUTUBE_THUMBNAIL_CONCURRENCY}\nIMAGE_BATCH_SIZE: ${YOUTUBE_IMAGE_BATCH_SIZE}\nIMAGE_CONCURRENCY: ${YOUTUBE_IMAGE_CONCURRENCY}\nSTYLE_AUTHORITY: ${YOUTUBE_IMAGE_WORLD_LOCK}\n\nLOOK FEST — INHALT FREI — KLARHEIT VOR FORM.\nBEDEUTUNG ZUERST — FORM FREI.\n\nPHASE 0 — ${YOUTUBE_FLOW_ONE_FOLDER_MARKER}\n1. Work in exactly ONE Google Flow project for this video. Name it: FinanzNeo – ${title}\n2. Thumbnail candidates and all scene images stay in this folder.\n\nPHASE A — THUMBNAILS\n1. Start A/B/C simultaneously as ${YOUTUBE_THUMBNAIL_CANDIDATE_COUNT} separate one-image jobs.\n2. QA each candidate.\n3. Ask exactly once: "Welches Cover: A, B oder C?"\n4. ${YOUTUBE_FLOW_DELETE_LOSERS_MARKER}.\n5. Rename winner to final thumbnail filename.\n6. Never use selected thumbnail as style reference.\n\nPHASE B — SCENE IMAGES\n1. Generate exactly the IMAGE/HYBRID jobs planned below — no more, no less.\n2. Split into batches up to ${YOUTUBE_IMAGE_BATCH_SIZE}.\n3. Start up to ${YOUTUBE_IMAGE_CONCURRENCY} separate one-image jobs in parallel.\n4. Rename immediately and QA.\n5. On FAIL regenerate only that number.\n6. No user approval between batches.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTHUMBNAIL A/B/C\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${thumbnailPrompt}\n${promptSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINISH\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${YOUTUBE_FLOW_FINISHED_FOLDER_MARKER}\n1. Exactly selected thumbnail plus every planned scene image, each once.\n2. No rejected covers, failed attempts or duplicates.\n3. Final inventory QA.\n4. User downloads folder and puts files into ${IMAGE_INBOX}/.\n`);
write('06-projektdateien/visual-plan.md', '# Visual-Plan — Klarheit vor Form\n\nFür JEDEN Beat zuerst ausfüllen:\n\n- CORE_MESSAGE: genau eine Kernaussage\n- VISUAL_FORM: frei gewählt; Schema/Illustration/Vergleich/Objekt/Detail/Mensch/Szene/Hybrid oder etwas Besseres\n- TWO_SECOND_TAKEAWAY: was in ca. 2 Sekunden verstanden werden muss\n- WHY_THIS_FORM: warum genau diese Form am klarsten ist\n- ESSENTIAL_ELEMENTS: nur notwendige Elemente\n\nDanach erst Prompt oder Motion-Code bauen. Kein Mensch, Ort, Tisch, Raum oder schwebendes Objekt als Standard. Schema- und Illustrationsbilder sind ausdrücklich erwünscht, wenn sie eine Aussage schneller erklären. Keine feste Visualzahl, keine feste Bild-/Animationsquote, keine feste Formliste.\n');
write('06-projektdateien/remotion-plan.md', `# Remotion-Plan — ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Ausgabe: 1920 × 1080, 16:9, 30 fps\n- Viewer Change zuerst; Technik danach.\n- Custom React, SVG, CSS 3D, Canvas, Three.js/R3F und Datenvisualisierung erlaubt.\n- Bestehende Komponenten optional.\n- Pro Motion-Visual: EIN Kerngedanke. START → eine Hauptveränderung → RESULTAT.\n- Ergebnis mindestens 30 Frames stabil sichtbar halten; Standard 36 Frames.\n- Keine Bewegung nur als Deko. Nicht mehrere neue Informationen gleichzeitig starten.\n- viewerChange + animationIntent + mechanicId + visualTechniqueId + techniqueDescription + toolStack + motionSignature + mehrere Motion Channels + klare sichtbare Beats.\n- Schnitte und finale Dauern folgen dem finalen Voiceover.\n`);
write('06-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [ ] Phase 1 vollständig und ohne Platzhalter\n- [ ] \`npm run youtube:animation:validate -- ${targetArg}\` erfolgreich\n- [ ] \`npm run youtube:phase1:seal -- ${targetArg}\` erfolgreich\n- [ ] Phase 2: alle exakten 16:9-Bilder, ein finales Voiceover und echte Wort-Timings vorhanden\n- [ ] Phase 3: \`npm run youtube:ready -- ${targetArg}\` erfolgreich; Produktion und QA abgeschlossen\n`);
write('06-projektdateien/timeline.json', `${JSON.stringify({version:2,title,fps:YOUTUBE_VIDEO_FPS,timingSource:'03-audio/word-timings.json',cutRule:'voice-beat-and-chapter-driven',fixedVisualCount:false,visuals:visuals.map((visual) => ({id:visual.id,type:visual.type,startFrame:0,durationFrames:0}))}, null, 2)}\n`);
write('04-visuals/visual-index.json', `${JSON.stringify({
  version:4,title,format:'youtube-longform',shortsForbidden:true,fixedVisualCount:false,fixedImageAnimationRatio:false,
  video:{aspectRatio:YOUTUBE_VIDEO_ASPECT_RATIO,width:YOUTUBE_VIDEO_WIDTH,height:YOUTUBE_VIDEO_HEIGHT,fps:YOUTUBE_VIDEO_FPS},
  thumbnail:{type:'image',googleFlowFileName:thumbnailFileName,planFile:'04-visuals/thumbnail-prompt.txt',candidateCount:YOUTUBE_THUMBNAIL_CANDIDATE_COUNT,concurrency:YOUTUBE_THUMBNAIL_CONCURRENCY,temporaryCandidateNames:['YouTube Thumbnail A.png','YouTube Thumbnail B.png','YouTube Thumbnail C.png'],textRequired:true,textMaxLines:2,textIdealWords:[2,5],mustUseSameV9World:true,mayBeStyleReference:false},
  userCreatesImages:true,antigravityGeneratesImages:false,
  googleFlow:{protocolId:FLOW_AGENT_PROTOCOL_ID,executionModeId:YOUTUBE_FLOW_EXECUTION_MODE_ID,generationMode:'thumbnail3-parallel-then-image5-parallel-batches',strictSequential:false,thumbnailCandidateCount:YOUTUBE_THUMBNAIL_CANDIDATE_COUNT,thumbnailConcurrency:YOUTUBE_THUMBNAIL_CONCURRENCY,thumbnailSeparateJobsRequired:true,thumbnailSelectionRequired:true,selectedThumbnailMayBeStyleReference:false,imageBatchSize:YOUTUBE_IMAGE_BATCH_SIZE,imageConcurrency:YOUTUBE_IMAGE_CONCURRENCY,separateOneImageJobsRequired:true,multiImageRequestForbidden:true,renameImmediatelyOnReturn:true,qaEachResult:true,nextBatchLockedUntilCurrentBatchPasses:true,retrySameImageOnFailure:true,userApprovalBetweenBatchesForbidden:true,finalInventoryQaRequired:true,finalCollectionDirectory:`${IMAGE_INBOX}/`,distributeToVisualFolders:false},
  imageWorld:{id:WORLD_ID,seriesLockId:SERIES_LOCK_ID,styleLockId:YOUTUBE_IMAGE_WORLD_LOCK,generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,horizontalGeneratedImagesRequired:true,referencePromptFile:'04-visuals/bildwelt.txt',styleReferenceStrategy:'written-youtube-v9-lock-only',sameWorldAcrossSeriesRequired:true,formFree:true,frontReadableDefault:true,frontFacingChartsRequired:true,selectedThumbnailMayBeStyleReference:false,seamlessSingleBackgroundRequired:true,objectLabelsOnly:true,visualDecisionPolicy:YOUTUBE_FLOW_IMAGE_POLICY_ID,meaningFirstRequired:true,sceneFirst:false,placeRequired:false,realSceneRequired:false,peopleRequired:false,semanticObjectCompositionsAllowed:true,visualMetaphorsAllowed:true},
  visualClarityStandard:{id:'finanzneo-youtube-clarity-v1',oneCoreMessagePerBeat:true,visualFormFree:true,twoSecondComprehensionRequired:true,imageWorldUnchanged:true,motionResultHoldMinFrames:30},
  motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,viewerChangeFirstRequired:true,contentFirstTechniqueSelection:true,openTechniqueSelection:true,compositionFamiliesAreExamplesOnly:true,motionSignatureRequired:true,recentMotionWindow:4,customReactAllowed:true,svgAllowed:true,css3dAllowed:true,canvasAllowed:true,threeAllowed:true,hybridAllowed:true,dataVisualizationAllowed:true,existingComponentsOptional:true,physicalPrimitivesOptional:true,semanticVariationRequired:true},
  timelineRules:{timingSource:'03-audio/word-timings.json',cutsFollowVoiceAndChapters:true,equalLengthVisualsForbiddenByDefault:true,beatFirst:true},
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  publishing:{youtube:YOUTUBE_PUBLISHING_FILES,socialPromo:SOCIAL_PROMO_FILES},visuals,
}, null, 2)}\n`);

write(YOUTUBE_PUBLISHING_FILES.titleOptions, '[5 GEPRÜFTE TITELVARIANTEN EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.finalTitle, '[FINALEN YOUTUBE-TITEL EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.description, '[VOLLSTÄNDIGE YOUTUBE-BESCHREIBUNG MIT NUTZEN, KAPITELHINWEIS, QUELLEN UND CTA EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.chapters, '[KAPITEL MIT ZEITSTEMPELN NACH FINALEM RENDER EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.tagsKeywords, '[PRIMÄRES KEYWORD, SEKUNDÄRE KEYWORDS UND PASSENDE TAGS EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.hashtags, '[PASSENDE HASHTAGS EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.thumbnailBrief, '[THUMBNAIL-BRIEF MIT KERNVERSPRECHEN, KONTRAST, FOKUSPUNKT UND TEXTOPTION EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.pinnedComment, '[ANGEHEFTETEN KOMMENTAR EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.communityPost, '[COMMUNITY-POST EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.sourcesDisclaimer, '[QUELLEN- UND DISCLAIMER-TEXT EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.uploadChecklist, '# Upload-Checkliste\n\n[FINALEN TITEL, BESCHREIBUNG, THUMBNAIL, KAPITEL, QUELLEN, TON, 16:9, EXTERNE UNTERTITEL UND ENDCARD PRÜFEN]\n');
write(SOCIAL_PROMO_FILES.instagram, '[INSTAGRAM-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.tiktok, '[TIKTOK-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.facebook, '[FACEBOOK-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.snapchat, '[SNAPCHAT-PROMO EINFÜGEN]\n');

console.log(`\n✓ YouTube-Longform-Projekt angelegt: ${targetArg}`);
console.log(`  Motion: ${YOUTUBE_MOTION_STANDARD_ID} · mindestens ${YOUTUBE_MIN_MOTION_VISUALS} Motion-Visuals`);
console.log(`  Flow: 3 Thumbnails parallel -> Auswahl -> Szene-Bilder in ${YOUTUBE_IMAGE_BATCH_SIZE}er-Batches parallel.`);
console.log(`  Bildlogik: ${YOUTUBE_FLOW_IMAGE_POLICY_ID} · Ort/Mensch/Szene optional.`);
if (types.length === 0) console.log('  Noch keine Visualtypen vorgegeben: zuerst Skript → Visual Beats → Bedeutung → Typen/Techniken planen.');
else console.log(`  Visuals: ${types.length} · ${types.join(' / ')}`);
