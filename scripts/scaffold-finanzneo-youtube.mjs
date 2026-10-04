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
  WORLD_ID,
  WORLD_ID_MARKER,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_PUBLISHING_FILES,
  YOUTUBE_VIDEO_ASPECT_RATIO,
  YOUTUBE_VIDEO_FPS,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
  YOUTUBE_VISUAL_TYPES,
  YOUTUBE_IMAGE_WORLD_LOCK,
  YOUTUBE_FLOW_EXECUTION_MODE_ID,
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

const styleBlock = `${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\n${GENERATED_IMAGE_ASPECT_MARKER}\nYOUTUBE_VISUAL_WORLD_LOCK: ${YOUTUBE_IMAGE_WORLD_LOCK}\n\nLOOK FIXED — CONTENT FREE. Every image supports the spoken point visually in the look of a high-end stylized 3D animated feature film: real everyday objects with believable proportions and recognizable details, a person only when the beat is about a person, soft cinematic light with a gentle rim, soft contact shadows, and a deep seamless black world with at most a small local set that dissolves into black. Anything may appear when it explains the spoken point. Emerald = positive, warm red-orange = cost/warning, gold only as a small money accent, ivory/soft gray neutral, natural skin and clothing colors. Never photorealistic.\n\nDECISIVE MOMENT — NOW AND THEN: only when the beat is about something happening. Most images need no person and no story.\n\nDEFAULT CAMERA: eye-level or natural camera height, level horizon. Creative ideas are welcome. Quotes, keywords and tables are Remotion cards with exact text, not Flow images. Charts, diagrams, exact numbers, tables, checklists and UI belong to Remotion.\n\nANTI-DRIFT: no green-gold symbol world (bank buildings, shields, vaults, coin mountains), no abstract finance sculptures (debt clamps, interest magnets, payment tokens, money ribbons), no dark green-black monochrome frames, no dashboards or flat PowerPoint-style infographics, no charts or diagrams (Remotion), no floating cards, no trophy or gold-luxury staging, no toy/plastic/clay look.\n\nhorizontal 16:9 source image. Important subjects large enough for TV/laptop/mobile. Use one clear idea. Short German object labels only when useful. Prompts in English, one short paragraph, same shape every time.\n`;

const flowStep = (fileName, referenceText) => `${FLOW_AGENT_PROTOCOL_MARKER}\nONE JOB = ONE IMAGE\n\nFINAL FILE NAME:\n${fileName}\n\nThis prompt belongs to one separate image-generation job. Generate exactly ONE image for this job. ${referenceText} As soon as the result returns, rename it immediately to the exact final file name, place it in the final image directory and run QA. If it fails, regenerate only this same image number. Never render the file name inside the image.\n`;

const promptFor = (index) => {
  const name = visualFileName(index);
  return `${flowStep(name, 'Use only the written FinanzNeo YouTube world. Do not use the selected thumbnail or another scene as a style reference.')}\nVISUAL_FORM: [character-moment | hands-in-action | object-story | everyday-scene | comparison-scene | creative-idea | hybrid-scene-plate]\nVISUAL_CONCEPT: [ONE CLEAR CONTENT-SPECIFIC IDEA]\nDECISIVE_MOMENT: [WHAT HAPPENS IN EXACTLY THIS SECOND — AND WHAT WOULD BE DIFFERENT ONE SECOND LATER]\nVOICEOVER_VISUAL_MATCH: [WHY THIS DIRECTLY EXPLAINS THE SPOKEN BEAT]\nFRONT_READABILITY_TEST: [PASS — EXPLAIN WHY THE MAIN INFORMATION IS STRAIGHT, NORMAL AND IMMEDIATELY READABLE]\nDATA_INTEGRITY_TEST: [PASS FOR CHART/DIAGRAM/DATA OR not-applicable]\n\nIMAGE PROMPT:\nShow [THE EXACT CONTENT-SPECIFIC VISUAL]. If this is a chart or diagram, show it straight-on from the front with undistorted axes/labels/proportions. Include only these short German object labels if needed: [LABELS].\n\n${styleBlock}`;
};

const thumbnailPrompt = `${FLOW_AGENT_PROTOCOL_MARKER}\nYOUTUBE THUMBNAIL PHASE — THREE SEPARATE JOBS IN PARALLEL\n\nCreate exactly three separate 16:9 thumbnail candidates A, B and C as three concurrent one-image jobs. All three use the written ${YOUTUBE_IMAGE_WORLD_LOCK} world directly. No candidate is a style reference for another image.\n\nTEXT RULE FOR ALL THREE: visible German hook text is required, max 2 lines, ideally 2–5 words, directly about the real video content. Clean front-facing white/ivory typography with at most one emerald or red-orange emphasis. Never giant metallic/extruded gold 3D text.\n\nTHUMBNAIL A: one expressive stylized character in the decisive moment of the topic.\nTHUMBNAIL B: one strong real everyday object or hand action that shows the problem at a glance.\nTHUMBNAIL C: clear contrast between two real situations in the same frame.\n\nForbidden for all three unless content genuinely requires it: giant gold percentage statues, trophy plinths, glossy gold luxury staging, generic glass money jars, decorative coin mountains, generic finance icon collage.\n\nTemporary names: YouTube Thumbnail A.png, YouTube Thumbnail B.png, YouTube Thumbnail C.png. After all three pass QA, stop once and ask A/B/C. Rename only the selected candidate to ${thumbnailFileName}; discard the other two from the final folder. The selected thumbnail is NOT a style reference for scene images.\n\n${styleBlock}`;

const motionTemplate = (index, type) => {
  const exportName = exportNameFor(index);
  return `import React from 'react';\nimport {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';\n\nexport const MECHANIC_ID = '[MECHANIC_ID]';\nexport const VISUAL_TECHNIQUE_ID = '[VISUAL_TECHNIQUE_ID]';\nexport const COMPOSITION_FAMILY_ID = '[COMPOSITION_FAMILY_ID]';\nexport const ANIMATION_NARRATIVE = {\n  START: '[START STATE]',\n  MECHANISM: '[VISIBLE CHANGE]',\n  RESULT: '[CLEAR RESULT]',\n};\n\nexport const ${exportName}: React.FC = () => {\n  const frame = useCurrentFrame();\n  const progress = interpolate(frame, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});\n  return (\n    <AbsoluteFill>\n      {/* PLACEHOLDER: replace in Phase 1 with production-ready ${type} motion chosen from viewerChange, not from a preset animation list. */}\n      <div style={{opacity: progress}}>[EINFÜGEN]</div>\n    </AbsoluteFill>\n  );\n};\n`;
};

const visuals = types.map((type, index) => {
  const number = numberOf(index);
  const id = `visual-${number}`;
  const directory = `04-visuals/EINZELNE-VISUALS/${id}`;
  const base = {
    id,
    type,
    chapter: '[CHAPTER]',
    scriptBeat: '[SCRIPT BEAT]',
  };

  if (requiresYouTubeImage({type})) {
    write(`${directory}/bildprompt.txt`, promptFor(index));
    Object.assign(base, {
      googleFlowFileName: visualFileName(index),
      expectedVisual: '[VISUAL DESCRIPTION]',
      objectLabels: ['[LABEL]'],
    });
  }

  if (requiresYouTubeMotion({type})) {
    const animationSourceFile = `${directory}/animation.tsx`;
    const animationExport = exportNameFor(index);
    write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\nMOTION_STANDARD: ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Kapitel: [CHAPTER]\n- Sprechtext-Bezug: [SCRIPT BEAT]\n- Viewer Change — was soll der Zuschauer tatsächlich sehen, das sich verändert/revealt/vergleicht/bewegt?: [VIEWER CHANGE]\n- Animation Intent — warum erklärt genau diese Veränderung den Punkt?: [ANIMATION INTENT]\n- Mechanik: [MECHANIC]\n- Technikbeschreibung: [TECHNIQUE DESCRIPTION]\n- Tool Stack: [TOOL STACK]\n- Composition Family: [FREE DESCRIPTIVE FAMILY; EXAMPLES ARE NOT A WHITELIST]\n- Motion Signature Camera: [CAMERA BEHAVIOR]\n- Motion Signature Layout: [SPATIAL / COMPOSITIONAL ARRANGEMENT]\n- Motion Signature Transformation: [PRIMARY VISIBLE TRANSFORMATION]\n- Startzustand: [START]\n- sichtbare Mechanik/Transformation: [TRANSFORMATION]\n- Resultat: [RESULT]\n- Motion Channels: [AT LEAST TWO MEANINGFUL CHANNELS]\n- SFX-Cues: [OPTIONAL FRAME-BOUND EVENTS]\n\nWähle die Technik erst NACH dem Viewer Change. Eine neue Technik darf frei erfunden/kombiniert werden, wenn sie den Inhalt besser erklärt. Nicht künstlich variieren; Wiederholung ist erlaubt, wenn sie wirklich die beste Erklärung ist und begründet wird.\n`);
    write(animationSourceFile, motionTemplate(index, type));
    Object.assign(base, {
      planFile: `${directory}/remotion.md`,
      animationSourceFile,
      animationExport,
      viewerChange: '[VIEWER CHANGE]',
      animationIntent: '[ANIMATION INTENT]',
      mechanicId: '[MECHANIC_ID]',
      visualTechniqueId: '[VISUAL_TECHNIQUE_ID]',
      techniqueDescription: '[TECHNIQUE DESCRIPTION]',
      compositionFamilyId: '[COMPOSITION_FAMILY_ID]',
      toolStack: ['[TOOL 1]'],
      motionSignature: {
        camera: '[CAMERA]',
        layout: '[LAYOUT]',
        transformation: '[TRANSFORMATION]',
      },
      repeatTechniqueReason: '',
      motionChannels: ['[CHANNEL 1]', '[CHANNEL 2]'],
      visualBeats: ['[START]', '[RESULT]'],
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

write('README.md', `# ${title}\n\nEigenständiges YouTube-Longform-Projekt. Kein Reel und kein YouTube Short.\n\n## Drei Phasen\n\n1. ChatGPT vervollständigt Recherche, Skript, Visual Beats, Visualtypen, alle Bildprompts und jede Motion-Szene als produktionsreife animation.tsx. Motion V3 arbeitet Viewer-change-first und hat keine feste Animationsbibliothek oder erlaubte Familienliste.\n2. Der Nutzer erstellt Thumbnail und alle benötigten 16:9-Bilder einzeln mit Google Flow, benennt sie sofort exakt um und legt sie gemeinsam in \`${IMAGE_INBOX}/\`. Danach genau ein finales Voiceover plus echte Wort-Timings.\n3. Nach Motion-Validation + Phase-1-Seal prüft \`npm run youtube:ready -- ${targetArg}\` alles. Phase 3 integriert die versiegelte Motion, retimed sie zum echten Voiceover und übernimmt QA/Render, ohne die Mechanik kreativ zu ersetzen.\n`);
write('01-recherche/briefing.md', '# Briefing\n\n- Thema: [THEMA]\n- Zielgruppe: Finanzanfänger\n- Lernziel: [EINFÜGEN]\n- Kernversprechen: [EINFÜGEN]\n- Warum Longform nötig ist: [EINFÜGEN]\n- Datenstand: [EINFÜGEN]\n');
write('01-recherche/recherche-quellen.md', '# Recherche und Quellen\n\n[GEPRÜFTE QUELLEN, DATENSTAND, ANNAHMEN UND RECHENWEGE EINFÜGEN]\n');
write('02-script/script-fliess-text.txt', '[VOLLSTÄNDIGES LONGFORM-VOICEOVER-SKRIPT EINFÜGEN]\n');
write('02-script/kapitel-dramaturgie.md', '# Kapitel und Dramaturgie\n\n[HOOK, KAPITEL, BEISPIELE, PAYOFFS, ZUSAMMENFASSUNG UND CTA EINFÜGEN]\n');
write('02-script/retention-plan.md', '# Retention-Plan\n\n[OFFENE FRAGEN, PAYOFFS, PATTERN-INTERRUPTS, VISUELLE RHYTHMUSWECHSEL UND ÜBERGÄNGE EINFÜGEN]\n');
write('03-audio/README.md', '# AUDIO HIER REIN\n\nGenau eine finale Voiceover-Datei ablegen. Danach aus genau dieser Datei echte Wort-Zeitstempel in `word-timings.json` erzeugen.\n');
write('03-audio/word-timings.json', `${JSON.stringify({version:'finanzneo-caption-v1',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:YOUTUBE_VIDEO_FPS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]}, null, 2)}\n`);
write(`${IMAGE_INBOX}/README.md`, `# ALLE FERTIGEN 16:9-BILDER HIER REIN\n\nFinales ausgewähltes Thumbnail plus alle finalen Video-Bilder. Flow arbeitet nach der Thumbnail-Auswahl in parallelen Batches mit maximal ${YOUTUBE_IMAGE_BATCH_SIZE} getrennten Ein-Bild-Jobs. Jedes zurückkommende Bild sofort exakt umbenennen und QA prüfen.\n`);
write('04-visuals/bildwelt.txt', `FINANZNEO YOUTUBE IMAGE WORLD\n\n${styleBlock}`);
write('04-visuals/thumbnail-prompt.txt', thumbnailPrompt);
write('04-visuals/alle-bildprompts.txt', `FINANZNEO — GOOGLE FLOW YOUTUBE HANDOFF\n\n${FLOW_AGENT_PROTOCOL_MARKER}\nFLOW_EXECUTION_MODE: ${YOUTUBE_FLOW_EXECUTION_MODE_ID}\nTHUMBNAIL_CONCURRENCY: ${YOUTUBE_THUMBNAIL_CONCURRENCY}\nIMAGE_BATCH_SIZE: ${YOUTUBE_IMAGE_BATCH_SIZE}\nIMAGE_CONCURRENCY: ${YOUTUBE_IMAGE_CONCURRENCY}\nSTYLE_AUTHORITY: ${YOUTUBE_IMAGE_WORLD_LOCK}\n\nPHASE A — THUMBNAILS\n1. Start A/B/C simultaneously as ${YOUTUBE_THUMBNAIL_CANDIDATE_COUNT} separate one-image jobs.\n2. QA each candidate for the animated-black world, short content-specific text and anti-gold-drift rules.\n3. Ask the user once for A/B/C. Rename only the selected candidate to the final thumbnail filename.\n4. Never use the selected thumbnail as style reference.\n\nPHASE B — VIDEO IMAGES\n1. Collect the remaining IMAGE/HYBRID prompts in visual order, skipping animation/data-only numbers.\n2. Split them into batches of up to ${YOUTUBE_IMAGE_BATCH_SIZE}.\n3. For each batch start up to ${YOUTUBE_IMAGE_CONCURRENCY} SEPARATE one-image jobs at the same time. Never ask one job to output five images.\n4. As each result returns: rename immediately, move to ${IMAGE_INBOX}/ and QA it.\n5. Failed image: regenerate only that same number.\n6. Do not start the next batch until every image in the current batch is PASS.\n7. No user approval between image batches.\n8. Final inventory QA after the last batch.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTHUMBNAIL A/B/C\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${thumbnailPrompt}\n${promptSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINISH\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFinish only when the selected final thumbnail and every expected scene image exist exactly once in ${IMAGE_INBOX}/.\n`);
write('06-projektdateien/visual-plan.md', '# Visual-Plan — Viewer Change First\n\n1. Skript in gesprochene Gedanken zerlegen.\n2. Jedem Gedanken einen sichtbaren Visual Beat geben.\n3. Für jeden Motion-Beat zuerst in einem Satz festlegen: Was soll der Zuschauer tatsächlich sehen, das sich verändert, enthüllt, vergleicht oder räumlich erschließt?\n4. Erst danach den besten Typ und die beste konkrete Technik wählen.\n5. Technik darf frei erfunden oder kombiniert werden; Familien sind nur Beschreibungen, keine Whitelist.\n6. Vor Freigabe die letzten vier Motion-Visuals auf echte Wiederholung von Kamera, Layout und Transformation prüfen.\n\nKeine feste Visualzahl. Keine feste Bild-/Animationsquote. Keine Standardanimation. Keine bestehende Komponente auswählen, bevor klar ist, was der Zuschauer sehen soll. Variation dient der Erklärung, nicht der Effekthascherei.\n');
write('06-projektdateien/remotion-plan.md', `# Remotion-Plan — ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Ausgabe: 1920 × 1080, 16:9, 30 fps\n- Viewer Change zuerst; Technik danach.\n- Remotion hat keine vorgegebene kreative Obergrenze.\n- Erlaubt: Custom React, SVG, CSS 3D, Canvas, Three.js/R3F, Masks, clip-path, Paths, Shapes, Motion Blur, Effects, Lottie als Support, Datenvisualisierung, Bild+Motion-Hybrid und neue sinnvolle Kombinationen.\n- Composition Families sind freie Beschreibungen, keine erlaubte Endmenge.\n- Bestehende FinanzNeo-Komponenten sind optionale Werkzeuge, keine Pflichtvorlagen.\n- Pro Motion-Visual: viewerChange + animationIntent + mechanicId + visualTechniqueId + techniqueDescription + toolStack + motionSignature + mehrere Motion Channels + mehrere sichtbare Beats.\n- Anti-Fake-Variation: neuer Name allein reicht nicht; Kamera + Layout + Transformation werden gegen die letzten vier Motion-Visuals geprüft.\n- Wiederholung bleibt erlaubt, wenn sie für den Inhalt wirklich die beste Lösung ist und mit repeatTechniqueReason begründet wird.\n- Schnitte und finale Dauern folgen dem finalen Voiceover.\n`);
write('06-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [ ] Phase 1 vollständig und ohne Platzhalter\n- [ ] \`npm run youtube:animation:validate -- ${targetArg}\` erfolgreich\n- [ ] \`npm run youtube:phase1:seal -- ${targetArg}\` erfolgreich\n- [ ] Phase 2: alle exakten 16:9-Bilder, ein finales Voiceover und echte Wort-Timings vorhanden\n- [ ] Phase 3: \`npm run youtube:ready -- ${targetArg}\` erfolgreich; Produktion und QA abgeschlossen\n`);
write('06-projektdateien/timeline.json', `${JSON.stringify({version:2,title,fps:YOUTUBE_VIDEO_FPS,timingSource:'03-audio/word-timings.json',cutRule:'voice-beat-and-chapter-driven',fixedVisualCount:false,visuals:visuals.map((visual) => ({id:visual.id,type:visual.type,startFrame:0,durationFrames:0}))}, null, 2)}\n`);
write('04-visuals/visual-index.json', `${JSON.stringify({
  version:3,
  title,
  format:'youtube-longform',
  shortsForbidden:true,
  fixedVisualCount:false,
  fixedImageAnimationRatio:false,
  video:{aspectRatio:YOUTUBE_VIDEO_ASPECT_RATIO,width:YOUTUBE_VIDEO_WIDTH,height:YOUTUBE_VIDEO_HEIGHT,fps:YOUTUBE_VIDEO_FPS},
  thumbnail:{type:'image',googleFlowFileName:thumbnailFileName,planFile:'04-visuals/thumbnail-prompt.txt',candidateCount:YOUTUBE_THUMBNAIL_CANDIDATE_COUNT,concurrency:YOUTUBE_THUMBNAIL_CONCURRENCY,temporaryCandidateNames:['YouTube Thumbnail A.png','YouTube Thumbnail B.png','YouTube Thumbnail C.png'],textRequired:true,textMaxLines:2,textIdealWords:[2,5],mustUseSameV9World:true,mayBeStyleReference:false},
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{protocolId:FLOW_AGENT_PROTOCOL_ID,executionModeId:YOUTUBE_FLOW_EXECUTION_MODE_ID,generationMode:'thumbnail3-parallel-then-image5-parallel-batches',strictSequential:false,thumbnailCandidateCount:YOUTUBE_THUMBNAIL_CANDIDATE_COUNT,thumbnailConcurrency:YOUTUBE_THUMBNAIL_CONCURRENCY,thumbnailSeparateJobsRequired:true,thumbnailSelectionRequired:true,selectedThumbnailMayBeStyleReference:false,imageBatchSize:YOUTUBE_IMAGE_BATCH_SIZE,imageConcurrency:YOUTUBE_IMAGE_CONCURRENCY,separateOneImageJobsRequired:true,multiImageRequestForbidden:true,renameImmediatelyOnReturn:true,qaEachResult:true,nextBatchLockedUntilCurrentBatchPasses:true,retrySameImageOnFailure:true,userApprovalBetweenBatchesForbidden:true,finalInventoryQaRequired:true,finalCollectionDirectory:`${IMAGE_INBOX}/`,distributeToVisualFolders:false},
  imageWorld:{id:WORLD_ID,seriesLockId:SERIES_LOCK_ID,styleLockId:YOUTUBE_IMAGE_WORLD_LOCK,generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,horizontalGeneratedImagesRequired:true,referencePromptFile:'04-visuals/bildwelt.txt',styleReferenceStrategy:'written-youtube-v9-lock-only',sameWorldAcrossSeriesRequired:true,formFree:true,frontReadableDefault:true,frontFacingChartsRequired:true,selectedThumbnailMayBeStyleReference:false,seamlessSingleBackgroundRequired:true,objectLabelsOnly:true},
  motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,viewerChangeFirstRequired:true,contentFirstTechniqueSelection:true,openTechniqueSelection:true,compositionFamiliesAreExamplesOnly:true,motionSignatureRequired:true,recentMotionWindow:4,customReactAllowed:true,svgAllowed:true,css3dAllowed:true,canvasAllowed:true,threeAllowed:true,hybridAllowed:true,dataVisualizationAllowed:true,existingComponentsOptional:true,physicalPrimitivesOptional:true,semanticVariationRequired:true},
  timelineRules:{timingSource:'03-audio/word-timings.json',cutsFollowVoiceAndChapters:true,equalLengthVisualsForbiddenByDefault:true,beatFirst:true},
  audio:{targetIntegratedLufs:-16,targetTruePeakDbtp:-1},
  publishing:{youtube:YOUTUBE_PUBLISHING_FILES,socialPromo:SOCIAL_PROMO_FILES},
  visuals,
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
write(YOUTUBE_PUBLISHING_FILES.uploadChecklist, '# Upload-Checkliste\n\n[FINALEN TITEL, BESCHREIBUNG, THUMBNAIL, KAPITEL, QUELLEN, TON, 16:9, UNTERTITEL UND ENDCARD PRÜFEN]\n');
write(SOCIAL_PROMO_FILES.instagram, '[INSTAGRAM-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.tiktok, '[TIKTOK-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.facebook, '[FACEBOOK-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.snapchat, '[SNAPCHAT-PROMO EINFÜGEN]\n');

console.log(`\n✓ YouTube-Longform-Projekt angelegt: ${targetArg}`);
console.log(`  Motion: ${YOUTUBE_MOTION_STANDARD_ID} · mindestens ${YOUTUBE_MIN_MOTION_VISUALS} Motion-Visuals`);
console.log(`  Flow: 3 Thumbnails parallel -> Auswahl -> Szene-Bilder in ${YOUTUBE_IMAGE_BATCH_SIZE}er-Batches parallel.`);
console.log(`  Bildwelt: ${YOUTUBE_IMAGE_WORLD_LOCK} · Charts frontal.`);
if (types.length === 0) console.log('  Noch keine Visualtypen vorgegeben: zuerst Skript → Visual Beats → Viewer Change → Typen/Techniken planen, dann visual-index/Visualordner in Phase 1 befüllen.');
else console.log(`  Visuals: ${types.length} · ${types.join(' / ')}`);
