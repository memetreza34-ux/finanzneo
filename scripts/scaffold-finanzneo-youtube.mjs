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
  YOUTUBE_IMAGE_WORLD_ID,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_PUBLISHING_FILES,
  YOUTUBE_VIDEO_ASPECT_RATIO,
  YOUTUBE_VIDEO_FPS,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
  YOUTUBE_VISUAL_PROFILE_ID,
  YOUTUBE_VISUAL_TYPES,
} from './lib/youtube-contract.mjs';
import {requiresYouTubeImage, requiresYouTubeMotion, requiresYouTubeRealAsset} from './lib/youtube-motion-contract.mjs';

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
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types animation,data,image,hybrid,real-asset,...]');
  process.exit(1);
}
if (types.some((type) => !YOUTUBE_VISUAL_TYPES.includes(type))) {
  console.error(`--types darf nur enthalten: ${YOUTUBE_VISUAL_TYPES.join(', ')}.`);
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

const styleBlock = `${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\n${GENERATED_IMAGE_ASPECT_MARKER}\nIMAGE_WORLD: ${YOUTUBE_IMAGE_WORLD_ID}\n\nFINANZNEO 3D VISUAL WORLD:\nPremium clearly stylized 3D animation-film rendering in the approved FinanzNeo YouTube world. The image should look like a polished frame from a modern high-budget animated movie, never like a flat illustration or a real photograph. Use soft refined geometry, believable proportions, high-quality modeling, semi-realistic but visibly stylized materials, soft premium studio lighting, readable contact shadows, controlled highlights and strong subject separation. Deep seamless black is the dominant world; show only the small amount of local real-world context needed to understand the situation and let it dissolve naturally into black. Emerald green marks positive/value/solution when semantically correct, warm red-orange marks cost/risk/problem, warm ivory and soft gray are neutral, subtle gold only for money/value accents.\n\nGLOBAL RULES:\nKeep one dominant situation. Use only the main subject and 2-3 necessary supporting objects. Important ambiguous finance objects may receive a short German label physically printed on the object when that label materially improves 1-2 second comprehension. Do not label obvious objects. No generic finance clutter, no recurring piggy-bank/coin/vault template, no fake app or website, no infographic layout, no floating UI. No headline, subtitle, explanatory paragraph or important total inside the generated image; Remotion owns explanatory text and numbers. Not photorealistic, not flat 2D vector art, not corporate stock illustration, not anime, not isometric, not a tiny diorama. Horizontal 16:9.\n`;

const flowStep = (fileName) => `${FLOW_AGENT_PROTOCOL_MARKER}\nCURRENT SINGLE STEP — DO NOT JUMP AHEAD\n\nFINAL FILE NAME:\n${fileName}\n\nGenerate exactly ONE image. Wait until it is fully complete. Rename it immediately to the exact final file name above. Verify the main situation, simple composition, premium stylized 3D animation-film look, deep-black FinanzNeo world, horizontal 16:9 format and exact file name. If any check fails, regenerate the same image number and replace the failed file. Continue only after this image passes. Never render the file name inside the image.\n`;

const promptFor = (index) => {
  const name = visualFileName(index);
  return `${flowStep(name)}\nFLOW_NECESSITY_REASON: [WHY FLOW IS BETTER FOR THIS BEAT THAN TEXT / NUMBER / CHART / SCREENSHOT / REAL ASSET]\nVOICEOVER_VISUAL_MATCH: [HOW THE SCENE DIRECTLY MATCHES THE SPOKEN POINT]\nREMOTION_OVERLAY_TEXT: [IMPORTANT TEXT/NUMBERS ADDED LATER, NOT GENERATED IN THE IMAGE]\n\nGOOGLE FLOW PROMPT — COPY/PASTE READY\n\nCreate a premium stylized 3D animation-film scene for a German finance education video.\n\nSCENE:\n[WRITE THE EXACT CONCRETE FINANCE SITUATION IN FULL SENTENCES. SAY WHAT IS HAPPENING, WHAT THE MAIN SUBJECT IS, WHAT THE VIEWER MUST UNDERSTAND, AND THE VISIBLE CAUSE/EFFECT. DO NOT WRITE A GENERIC PROMPT.]\n\nIMPORTANT GERMAN OBJECT LABELS:\n[ONLY IF AN IMPORTANT OBJECT COULD BE MISUNDERSTOOD: SPECIFY THE EXACT SHORT GERMAN WORD THAT MUST BE PHYSICALLY PRINTED ON IT, FOR EXAMPLE “Versicherung”, “Rechnung”, “Zinsen”, “Miete”, “Vertrag”. IF ALL IMPORTANT OBJECTS ARE SELF-EXPLANATORY, WRITE “No labels needed.” DO NOT USE FLOATING UI TEXT.]\n\nOBJECTS:\n- [MAIN SUBJECT]\n- [ONLY NECESSARY SUPPORTING OBJECT 1]\n- [ONLY NECESSARY SUPPORTING OBJECT 2 IF NEEDED]\n- [ONLY NECESSARY SUPPORTING OBJECT 3 IF NEEDED]\n\nCOMPOSITION:\n[DESCRIBE A SPECIFIC CAMERA VIEW AND FRAMING FOR THIS SCENE: FOR EXAMPLE MEDIUM 3/4 VIEW, SLIGHTLY LOW ANGLE, TOP-DOWN, CLOSE-UP, ETC. STATE WHICH OBJECT IS DOMINANT, WHERE SUPPORTING OBJECTS SIT, WHAT MUST FACE THE CAMERA, AND HOW THE 16:9 FRAME SHOULD READ. AVOID GENERIC PRESENTATION-SLIDE LAYOUTS.]\n\nMATERIALS:\n[DESCRIBE ONLY THE MATERIALS THAT MATTER FOR THIS EXACT SCENE: PAPER, GLASS, METAL, FABRIC, PLASTIC, RUBBER, WOOD, ETC. KEEP THEM SEMI-REALISTIC BUT CLEARLY STYLIZED 3D.]\n\nBACKGROUND:\nDeep seamless black is the dominant surrounding world. [DESCRIBE ONLY THE SMALL LOCAL CONTEXT NEEDED FOR THIS EXACT SCENE.] The local environment must softly dissolve into black. Do not build a complete bright room unless the spoken point genuinely requires it.\n\nLIGHTING:\nPremium soft studio lighting with clear subject separation, controlled highlights, soft contact shadows and subtle grounded reflections. [ADD SCENE-SPECIFIC LIGHTING ONLY WHEN IT HELPS THE FINANCIAL MEANING, FOR EXAMPLE WARM RED-ORANGE AROUND COST/RISK OR EMERALD AROUND A POSITIVE/SOLUTION ELEMENT.]\n\nCOLOR LANGUAGE:\nDeep black dominant world, warm ivory and soft gray neutrals, emerald green only for positive/value/solution when semantically correct, warm red-orange only for cost/risk/problem when semantically correct, subtle gold only for money/value accents. Keep the palette restrained and premium.\n\nTEXT:\nNo headline. No subtitle. No explanatory paragraph. No floating UI text. No important total or percentage unless it is explicitly required as a natural physical label in the scene. Important explanatory text and numbers will be added later in Remotion.\n\nFORBIDDEN:\n[List the scene-specific mistakes that would break this exact image, then keep these global bans: photorealism, flat 2D illustration, corporate vector art, Canva style, anime, cheap toy-like 3D, isometric infographic, floating UI cards, fake app screens, generic piggy-bank/coin/vault finance scenes, excessive glow, cyberpunk, clutter, tiny diorama framing.]\n\n${styleBlock}`;
};

const thumbnailPrompt = `${flowStep(thumbnailFileName)}\nGOOGLE FLOW THUMBNAIL PROMPT — COPY/PASTE READY\n\nCreate a high-impact horizontal 16:9 finance YouTube thumbnail scene for [CORE PROMISE OR TENSION] in the same premium stylized 3D animated-film FinanzNeo world.\n\nSCENE:\n[ONE VERY CLEAR THUMBNAIL IDEA WITH ONE DOMINANT SUBJECT OR CONFLICT.]\n\nCOMPOSITION:\n[EXACT SUBJECT PLACEMENT, CAMERA VIEW AND CLEAR NEGATIVE SPACE FOR TYPOGRAPHY THAT WILL BE ADDED LATER.]\n\nDo not generate the headline inside the image. Keep the frame simple, readable and instantly understandable.\n\n${styleBlock}`;

const motionTemplate = (index, type) => {
  const exportName = exportNameFor(index);
  return `import React from 'react';\nimport {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';\n\nexport const ${exportName}: React.FC = () => {\n  const frame = useCurrentFrame();\n  const progress = interpolate(frame, [0, 24], [0, 1], {\n    extrapolateLeft: 'clamp',\n    extrapolateRight: 'clamp',\n  });\n\n  return (\n    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>\n      {/* PLACEHOLDER: replace in Phase 1 with the simplest production-ready ${type} visual for this spoken point. */}\n      <div style={{opacity: progress}}>[EINFÜGEN]</div>\n    </AbsoluteFill>\n  );\n};\n`;
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
    message: '[WHAT MUST THE VIEWER UNDERSTAND?]',
    reason: '[WHY IS THIS THE SIMPLEST CLEAR VISUAL?]',
    overlayText: [],
  };

  if (requiresYouTubeImage({type})) {
    write(`${directory}/bildprompt.txt`, promptFor(index));
    Object.assign(base, {
      assetSource: 'google-flow',
      flowAllowed: true,
      flowReason: '[WHY FLOW IS NECESSARY AFTER THE FLOW GATE]',
      googleFlowFileName: visualFileName(index),
      expectedVisual: '[SIMPLE STYLIZED 3D EVERYDAY VISUAL DESCRIPTION]',
      objectLabels: [],
    });
  }

  if (requiresYouTubeRealAsset({type})) {
    write(`${directory}/asset-plan.md`, '# Echtes Asset\n\n- Was soll gezeigt werden?: [ASSET]\n- Warum ist das echte Asset besser als eine KI-Imitation?: [REASON]\n- Quelle / Herkunft / Nutzungsrecht dokumentieren: [SOURCE]\n- Gewünschter Ausschnitt: [CROP]\n- Remotion-Overlay: [OPTIONAL TEXT/HIGHLIGHT]\n');
    Object.assign(base, {
      assetSource: 'real-asset',
      flowAllowed: false,
      flowReason: '',
      planFile: `${directory}/asset-plan.md`,
      assetFile: '[LOCAL ASSET FILE]',
      sourceNote: '[SOURCE / ORIGIN / RIGHTS NOTE]',
    });
  }

  if (requiresYouTubeMotion({type})) {
    const animationSourceFile = `${directory}/animation.tsx`;
    const animationExport = exportNameFor(index);
    write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\nMOTION_STANDARD: ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Kapitel: [CHAPTER]\n- Sprechtext-Bezug: [SCRIPT BEAT]\n- Message: [WHAT MUST THE VIEWER UNDERSTAND?]\n- Viewer Change: [WHAT DOES THE VIEWER LITERALLY SEE CHANGE?]\n- Reason: [WHY DOES THIS SIMPLE MOTION EXPLAIN THE POINT?]\n- Motion Preset: [FADE_IN | SLIDE_UP | SLIDE_LEFT | SCALE_IN | COUNT_UP | BAR_GROW | LINE_DRAW | HIGHLIGHT | SLOW_ZOOM | CUSTOM]\n- Overlay Text / Numbers: [TEXT RENDERED BY REMOTION]\n- Advanced Reason: [EMPTY UNLESS CUSTOM/ADVANCED MOTION IS TRULY NECESSARY]\n\nStart with a reusable simple pattern such as BigNumber, Comparison, Percentage, BarChart, LineChart, Timeline, MoneyFlow, ProcessSteps, SimpleDiagram, Allocation or Formula. Reuse is allowed. Do not invent complexity for variety.\n`);
    write(animationSourceFile, motionTemplate(index, type));
    Object.assign(base, {
      planFile: `${directory}/remotion.md`,
      animationSourceFile,
      animationExport,
      viewerChange: '[VIEWER CHANGE]',
      motionPreset: '[MOTION PRESET]',
      advancedReason: '',
      toolStack: ['Remotion'],
    });
    if (!requiresYouTubeImage({type})) {
      Object.assign(base, {
        assetSource: 'remotion',
        flowAllowed: false,
        flowReason: '',
      });
    }
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
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — ${visual.type.toUpperCase()} / NO FLOW IMAGE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDO NOT GENERATE IMAGE ${numberOf(index)}. This visual is explained by Remotion or a real asset. Keep numbering reserved and continue.\n`;
  }
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — FLOW IMAGE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${promptFor(index)}`;
}).join('\n');

write('README.md', `# ${title}\n\nEigenständiges YouTube-Longform-Projekt. Kein Reel und kein YouTube Short.\n\n## Ziel\n\nFaceless Simple-Finance-Explainer: klare Finanz-Erklärung, direkte einfache Visuals, einfache Remotion-Motion und nur wenige gezielt eingesetzte Flow-Bilder. Wenn Flow verwendet wird, bleibt die originale premium stylized 3D FinanzNeo-Bildwelt verbindlich.\n\n## Drei Phasen\n\n1. Recherche + Skript + Simple-first Visualplanung. Remotion ist Default, echte Assets werden real gezeigt, Flow nur nach bestandenem Flow-Gate. Jede Motion-Szene wird in Phase 1 produktionsreif gebaut.\n2. Nur die tatsächlich benötigten 16:9-Flow-Bilder einzeln in der freigegebenen stylized-3D-Bildwelt erzeugen, sofort exakt umbenennen und in \`${IMAGE_INBOX}/\` legen. Danach ein finales Voiceover plus echte Wort-Timings.\n3. Nach Motion-Validation + Phase-1-Seal prüft \`npm run youtube:ready -- ${targetArg}\` alles. Phase 3 integriert/retimed die freigegebene Motion und übernimmt QA/Render.\n`);
write('01-recherche/briefing.md', '# Briefing\n\n- Thema: [THEMA]\n- Zielgruppe: Finanzanfänger\n- Lernziel: [EINFÜGEN]\n- Kernversprechen: [EINFÜGEN]\n- Konkrete Zuschauerfrage: [EINFÜGEN]\n- Datenstand: [EINFÜGEN]\n');
write('01-recherche/recherche-quellen.md', '# Recherche und Quellen\n\n[GEPRÜFTE QUELLEN, DATENSTAND, ANNAHMEN UND RECHENWEGE EINFÜGEN]\n');
write('02-script/script-fliess-text.txt', '[VOLLSTÄNDIGES LONGFORM-VOICEOVER-SKRIPT EINFÜGEN]\n');
write('02-script/kapitel-dramaturgie.md', '# Kapitel und Dramaturgie\n\n[HOOK, KLARE KAPITEL, KONKRETE BEISPIELE, PAYOFFS, ZUSAMMENFASSUNG UND CTA EINFÜGEN]\n');
write('02-script/retention-plan.md', '# Retention-Plan\n\n[OFFENE FRAGEN, PAYOFFS, VISUELLE WECHSEL NUR BEI NEUEM GEDANKEN UND ÜBERGÄNGE EINFÜGEN]\n');
write('03-audio/README.md', '# AUDIO HIER REIN\n\nGenau eine finale Voiceover-Datei ablegen. Danach aus genau dieser Datei echte Wort-Zeitstempel in `word-timings.json` erzeugen.\n');
write('03-audio/word-timings.json', `${JSON.stringify({version:'finanzneo-caption-v1',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:YOUTUBE_VIDEO_FPS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]}, null, 2)}\n`);
write(`${IMAGE_INBOX}/README.md`, '# NUR TATSÄCHLICH BENÖTIGTE FLOW-BILDER HIER REIN\n\nJedes benötigte 16:9-Bild einzeln in der freigegebenen premium stylized 3D FinanzNeo-Bildwelt erzeugen, sofort exakt umbenennen, prüfen und erst danach das nächste Bild starten. Keine Batches. Remotion-Visuals und echte Assets werden hier nicht abgelegt.\n');
write('04-visuals/bildwelt.txt', `FINANZNEO YOUTUBE IMAGE WORLD\n\n${styleBlock}`);
write('04-visuals/thumbnail-prompt.txt', thumbnailPrompt);
write('04-visuals/alle-bildprompts.txt', `FINANZNEO — GOOGLE FLOW HANDOFF\n\n${FLOW_AGENT_PROTOCOL_MARKER}\n\nIMPORTANT: Flow is NOT the default visual source. This file contains only thumbnail + visuals that already passed the Flow necessity gate. Every generated image must use the approved premium stylized 3D FinanzNeo image world. Every final prompt must be fully written, scene-specific and directly copy/paste ready for Google Flow. Do not leave generic master-prompt language in a production prompt.\n\nSTRICT SEQUENTIAL WORKFLOW:\n1. Read the file once.\n2. Generate exactly ONE image for the current image block.\n3. Wait until it is complete.\n4. Rename it immediately to the exact requested name.\n5. QA clarity, simple composition, premium stylized 3D image-world consistency and horizontal 16:9.\n6. If it fails, regenerate the same image number.\n7. Only then continue.\n8. Skip NO FLOW IMAGE blocks.\n9. Put all final generated images in ${IMAGE_INBOX}/.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTHUMBNAIL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${thumbnailPrompt}\n${promptSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINISH\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
write('06-projektdateien/visual-plan.md', '# Visual-Plan — Simple First\n\nFür jeden gesprochenen Gedanken:\n\n1. Was muss der Zuschauer verstehen?\n2. Kann Remotion es mit Zahl, Vergleich, Chart, Timeline, Diagramm oder wenigen Texten einfacher erklären?\n3. Existiert ein echtes Asset, das statt KI gezeigt werden soll?\n4. Nur wenn beides nicht reicht: Flow-Alltagsszene mit konkreter Begründung.\n5. Wenn Flow gewählt wird, bleibt die originale premium stylized 3D FinanzNeo-Bildwelt Pflicht; simpel bedeutet nur wenige Elemente, nicht flacher 2D-Stil.\n6. Jeder Flow-Prompt wird danach vollständig und individuell als direkt einsetzbarer Google-Flow-Prompt geschrieben: konkrete Szene, Labels falls nötig, Objekte, Kamera/Komposition, Materialien, Hintergrund, Licht, Farben, Textregeln und szenenspezifische Verbote.\n7. Danach nur die nötige Bewegung wählen.\n\nKeine feste Visualzahl. Keine feste Flow-Quote. Keine Novelty-Quote. Wiederverwendbare Muster sind erwünscht.\n');
write('06-projektdateien/remotion-plan.md', `# Remotion-Plan — ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Ausgabe: 1920 × 1080, 16:9, 30 fps\n- Remotion ist Default für Erklärvisuals.\n- Standardmuster: BigNumber, Comparison, Percentage, BarChart, LineChart, Timeline, MoneyFlow, ProcessSteps, SimpleDiagram, Allocation, Formula.\n- Standardbewegungen: FADE_IN, SLIDE_UP, SLIDE_LEFT, SCALE_IN, COUNT_UP, BAR_GROW, LINE_DRAW, HIGHLIGHT, SLOW_ZOOM.\n- Sinnvolle Wiederholung ist erlaubt.\n- Fortgeschrittene Techniken nur mit inhaltlicher advancedReason.\n- Wichtige Texte/Zahlen immer in Remotion.\n- Schnitte und finale Dauern folgen dem finalen Voiceover.\n`);
write('06-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [ ] Phase 1 vollständig und ohne Platzhalter\n- [ ] \`npm run youtube:animation:validate -- ${targetArg}\` erfolgreich\n- [ ] \`npm run youtube:phase1:seal -- ${targetArg}\` erfolgreich\n- [ ] Phase 2: nur erwartete 16:9-Flow-Bilder, ein finales Voiceover und echte Wort-Timings vorhanden\n- [ ] Phase 3: \`npm run youtube:ready -- ${targetArg}\` erfolgreich; Produktion und QA abgeschlossen\n`);
write('06-projektdateien/timeline.json', `${JSON.stringify({version:3,title,fps:YOUTUBE_VIDEO_FPS,timingSource:'03-audio/word-timings.json',cutRule:'voice-beat-and-chapter-driven',fixedVisualCount:false,visuals:visuals.map((visual) => ({id:visual.id,type:visual.type,startFrame:0,durationFrames:0}))}, null, 2)}\n`);
write('04-visuals/visual-index.json', `${JSON.stringify({
  version:4,
  title,
  format:'youtube-longform',
  shortsForbidden:true,
  fixedVisualCount:false,
  fixedImageAnimationRatio:false,
  video:{aspectRatio:YOUTUBE_VIDEO_ASPECT_RATIO,width:YOUTUBE_VIDEO_WIDTH,height:YOUTUBE_VIDEO_HEIGHT,fps:YOUTUBE_VIDEO_FPS},
  thumbnail:{type:'image',googleFlowFileName:thumbnailFileName,planFile:'04-visuals/thumbnail-prompt.txt'},
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  visualProfile:{id:YOUTUBE_VISUAL_PROFILE_ID,simplestVisualFirst:true,remotionDefault:true,flowRequiresJustification:true,realAssetsPreferred:true,reusablePatternsAllowed:true,noveltyForItsOwnSake:false},
  googleFlow:{protocolId:FLOW_AGENT_PROTOCOL_ID,generationMode:'one-image-at-a-time',strictSequential:true,waitForCurrentImage:true,renameBeforeNext:true,qaBeforeNext:true,retrySameImageOnFailure:true,finalCollectionDirectory:`${IMAGE_INBOX}/`,distributeToVisualFolders:false,defaultVisualSource:false},
  imageWorld:{id:YOUTUBE_IMAGE_WORLD_ID,brandWorldId:WORLD_ID,seriesLockId:SERIES_LOCK_ID,generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,horizontalGeneratedImagesRequired:true,referencePromptFile:'04-visuals/bildwelt.txt',styleReferenceStrategy:'approved-grounded-3d-black-v1',sameWorldAcrossSeriesRequired:true,stylized3D:true,simpleComposition:true,deepBlackWorld:true,remotionOwnsTextAndNumbers:true},
  motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,simplestVisualFirst:true,repetitionAllowed:true,varietyQuota:false,standardPresetsPreferred:true,advancedMotionNeedsReason:true,deterministicFrameMotionRequired:true},
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
write(YOUTUBE_PUBLISHING_FILES.thumbnailBrief, '[THUMBNAIL-BRIEF MIT EINER KLAREN IDEE, FOKUSPUNKT, KONTRAST UND TEXTOPTION EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.pinnedComment, '[ANGEHEFTETEN KOMMENTAR EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.communityPost, '[COMMUNITY-POST EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.sourcesDisclaimer, '[QUELLEN- UND DISCLAIMER-TEXT EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.uploadChecklist, '# Upload-Checkliste\n\n[FINALEN TITEL, BESCHREIBUNG, THUMBNAIL, KAPITEL, QUELLEN, TON, 16:9, UNTERTITEL UND ENDCARD PRÜFEN]\n');
write(SOCIAL_PROMO_FILES.instagram, '[INSTAGRAM-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.tiktok, '[TIKTOK-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.facebook, '[FACEBOOK-PROMO EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.snapchat, '[SNAPCHAT-PROMO EINFÜGEN]\n');

console.log(`\n✓ YouTube-Longform-Projekt angelegt: ${targetArg}`);
console.log(`  Visual Profile: ${YOUTUBE_VISUAL_PROFILE_ID}`);
console.log(`  Motion: ${YOUTUBE_MOTION_STANDARD_ID}`);
console.log(`  Image World: ${YOUTUBE_IMAGE_WORLD_ID}`);
if (types.length === 0) console.log('  Noch keine Visualtypen vorgegeben: zuerst Skript → Aussage → einfachstes Visual → Assetquelle planen.');
else console.log(`  Visuals: ${types.length} · ${types.join(' / ')}`);