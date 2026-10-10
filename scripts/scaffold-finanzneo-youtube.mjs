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
  YOUTUBE_FLOW_BATCH_SIZE,
  YOUTUBE_FLOW_PROTOCOL_ID,
  YOUTUBE_FLOW_PROTOCOL_MARKER,
  YOUTUBE_IMAGE_TEXT_LANGUAGE_RULE,
  ALL_PROMPTS,
  AUDIO_INBOX,
  EXPORT_DIR,
  SCRIPT_FILE,
  internWurzel,
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

const youtubeRoot = resolve('youtube');
const projektRoot = resolve(targetArg);
const root = internWurzel(targetArg);
const relativeTarget = relative(youtubeRoot, projektRoot);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein neuer Projektordner direkt oder verschachtelt unter youtube/ sein.');
  process.exit(1);
}
if (existsSync(projektRoot)) {
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

const styleBlock = `${WORLD_ID_MARKER}
${SERIES_LOCK_MARKER}
${GENERATED_IMAGE_ASPECT_MARKER}

IMAGE WORLD:
FinanzNeo Editorial Finance V1.

CORE:
One spoken thought becomes one simple visual idea that is understandable at first glance.

STYLE:
Use a clean editorial finance illustration. Prefer 2D or subtle 2.5D. Simple 3D is allowed only when it genuinely helps the subject. Use matte restrained colors, clear silhouettes, large readable elements and low-to-moderate detail.

BACKGROUND:
Choose the background that makes the image clearest. Warm off-white, cream, light gray, muted color, dark charcoal or black are all allowed. Never force a black background.

VISUAL FREEDOM:
Metaphors, charts, timelines, comparisons, documents, quote visuals, people, companies/brands and simple everyday scenes are all allowed when they are the clearest choice.

ANTI-AI-SLOP:
Avoid decorative neon finance glow, holograms, floating coin showers, futuristic dashboards, generic UI cards, miniature cities, glowing networks, podiums, cinematic finance spectacle and glossy toy-like 3D blocks unless the actual subject requires them.

TEXT:
No automatic generic headline. Numbers, short labels, dates, quotes and document text are allowed when useful. ${YOUTUBE_IMAGE_TEXT_LANGUAGE_RULE}

FORMAT:
Horizontal 16:9 source image.
`;

const flowStep = (fileName) => `${YOUTUBE_FLOW_PROTOCOL_MARKER}
ONE IMAGE OF THE CURRENT BATCH — SEE BATCH HEADER

FINAL FILE NAME:
${fileName}

Generate this image together with the other images of its batch (at most ${YOUTUBE_FLOW_BATCH_SIZE} in parallel). Rename it immediately to the exact final file name above as soon as it returns. Verify that the visual matches the script beat, reads clearly at first glance, follows the Editorial Finance image world, uses horizontal 16:9 and contains only German text. If REFERENCE_IMAGE points to an approved prior visual, attach that exact file before generating and preserve its composition while making only the planned change; such an image always belongs to a later batch than its reference. If any check fails, regenerate the same image number before the next batch starts. Never render the file name inside the image.
`;

const promptFor = (index) => {
  const name = visualFileName(index);
  return `${flowStep(name)}
REFERENCE_IMAGE:
[NONE OR EXACT APPROVED FILE FROM visual-XX]

IMAGE PROMPT:
[WRITE THE COMPLETE ENGLISH PROMPT FOR THIS EXACT STATIC VISUAL. DESCRIBE THE VISUAL ITSELF FIRST. IF THIS IS A PROGRESSIVE CONTINUATION, REPEAT THE FULL COMPOSITION AND ADD ONLY THE ONE PLANNED CHANGE.]

${styleBlock}`;
};

const thumbnailPrompt = `${flowStep(thumbnailFileName)}
REFERENCE_IMAGE:
NONE

THUMBNAIL PROMPT:
[WRITE A COMPLETE ENGLISH THUMBNAIL PROMPT WITH ONE CLEAR FOCAL IDEA. DO NOT FORCE THE NORMAL VIDEO-IMAGE COMPOSITION.]

${styleBlock}`;

const motionTemplate = (index, type) => {
  const exportName = exportNameFor(index);
  return `import React from 'react';\nimport {AbsoluteFill, useCurrentFrame} from 'remotion';\n\nexport const MECHANIC_ID = '[MECHANIC_ID]';\nexport const VISUAL_TECHNIQUE_ID = '[VISUAL_TECHNIQUE_ID]';\nexport const COMPOSITION_FAMILY_ID = '[COMPOSITION_FAMILY_ID]';\nexport const ANIMATION_NARRATIVE = {\n  START: '[START STATE]',\n  MECHANISM: '[VISIBLE CHANGE]',\n  RESULT: '[CLEAR RESULT]',\n};\n\nexport const ${exportName}: React.FC = () => {\n  const frame = useCurrentFrame();\n  // No example fade: select an actual motion mechanism from the plan.\n  void frame;\n  return <AbsoluteFill style={{background:'#FAF8F2'}}>{/* TODO: Phase 1 requires a real visual mechanism and final rendering. */}</AbsoluteFill>;\n};\n`;
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
      imageSequence:{mode:'independent',referenceVisualId:null,plannedChange:null},
    });
  }

  if (requiresYouTubeMotion({type})) {
    const animationSourceFile = `${directory}/animation.tsx`;
    const animationExport = exportNameFor(index);
    write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\nMOTION_STANDARD: ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Kapitel: [CHAPTER]\n- Sprechtext-Bezug: [SCRIPT BEAT]\n- Viewer Change — was soll der Zuschauer tatsächlich sehen, das sich verändert/revealt/vergleicht/bewegt?: [VIEWER CHANGE]\n- Animation Intent — warum erklärt genau diese Veränderung den Punkt?: [ANIMATION INTENT]\n- Mechanik: [MECHANIC]\n- Technikbeschreibung: [TECHNIQUE DESCRIPTION]\n- Tool Stack: [TOOL STACK]\n- Composition Family: [FREE DESCRIPTIVE FAMILY; EXAMPLES ARE NOT A WHITELIST]\n- Motion Signature Camera: [STILL | PUSH | FOLLOW | REFRAME | ZOOM-OUT — CHOOSE FOR STORY]\n- Motion Signature Layout: [SPATIAL / COMPOSITIONAL ARRANGEMENT]\n- Motion Signature Transformation: [PRIMARY VISIBLE TRANSFORMATION]\n- Startzustand: [START]\n- sichtbare Mechanik/Transformation: [TRANSFORMATION]\n- Resultat: [RESULT]\n- Concept A: [DISTINCT VISUAL CONCEPT]
- Concept B: [DISTINCT VISUAL CONCEPT]
- Concept C: [DISTINCT VISUAL CONCEPT]
- Chosen Concept: [BEST CONCEPT + WHY]
- Keyframe 10%: [START]
- Keyframe 35%: [MECHANISM]
- Keyframe 65%: [CONSEQUENCE]
- Keyframe 90%: [PAYOFF]
- Motion Channels: [AT LEAST ONE MEANINGFUL EXPLANATORY CHANGE]\n- SFX-Cues: [OPTIONAL FRAME-BOUND EVENTS]\n\nWähle die Technik erst NACH dem Viewer Change. Eine neue Technik darf frei erfunden/kombiniert werden, wenn sie den Inhalt besser erklärt. Nicht künstlich variieren; Wiederholung ist erlaubt, wenn sie wirklich die beste Erklärung ist und begründet wird.\n`);
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
      motionChannels: ['[PRIMARY CHANGE]'],
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

// Bild-Blöcke (Thumbnail zählt mit) werden in Batches zu je YOUTUBE_FLOW_BATCH_SIZE gruppiert.
const bildNummern = ['Thumbnail', ...visuals.map((visual, index) => (requiresYouTubeImage(visual) ? numberOf(index) : null)).filter(Boolean)];
const batchVon = (nummer) => Math.floor(bildNummern.indexOf(nummer) / YOUTUBE_FLOW_BATCH_SIZE);
const batchKopf = (nummer) => {
  const pos = bildNummern.indexOf(nummer);
  if (pos % YOUTUBE_FLOW_BATCH_SIZE !== 0) return '';
  const mitglieder = bildNummern.slice(pos, pos + YOUTUBE_FLOW_BATCH_SIZE).map((n) => (n === 'Thumbnail' ? 'Thumbnail' : `Bild ${n}`));
  return `████████████████████████████████████\nBATCH ${batchVon(nummer) + 1} — START ALL TOGETHER: ${mitglieder.join(', ')}\n████████████████████████████████████\n\n`;
};
const promptSections = visuals.map((visual, index) => {
  if (!requiresYouTubeImage(visual)) {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — ${visual.type.toUpperCase()} / REMOTION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDO NOT GENERATE IMAGE ${numberOf(index)}. Keep this number reserved and continue with the next block.\n`;
  }
  return `${batchKopf(numberOf(index))}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — ${visual.type.toUpperCase()} IMAGE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${promptFor(index)}`;
}).join('\n');

write('README.md', `# ${title} — interne Projektdateien\n\nEigenständiges YouTube-Longform-Projekt. Kein Reel und kein YouTube Short.\n\n## Drei Phasen\n\n1. ChatGPT vervollständigt Recherche, Skript, Visual Beats, Visualtypen, alle Bildprompts und jede Motion-Szene als produktionsreife animation.tsx. Motion V3 arbeitet Viewer-change-first und hat keine feste Animationsbibliothek oder erlaubte Familienliste.\n2. Der Nutzer erstellt Thumbnail und alle benötigten 16:9-Bilder mit Google Flow in Batches von bis zu 5 gleichzeitig, benennt sie sofort exakt um und legt sie gemeinsam in \`${IMAGE_INBOX}/\`. Danach genau ein finales Voiceover plus echte Wort-Timings.\n3. Nach Motion-Validation + Phase-1-Seal prüft \`npm run youtube:ready -- ${targetArg}\` alles. Phase 3 integriert die versiegelte Motion, retimed sie zum echten Voiceover und übernimmt QA/Render, ohne die Mechanik kreativ zu ersetzen.\n`);
write('01-recherche/briefing.md', '# Briefing\n\n- Thema: [THEMA]\n- Zielgruppe: Finanzanfänger\n- Lernziel: [EINFÜGEN]\n- Kernversprechen: [EINFÜGEN]\n- Warum Longform nötig ist: [EINFÜGEN]\n- Datenstand: [EINFÜGEN]\n');
write('01-recherche/recherche-quellen.md', '# Recherche und Quellen\n\n[GEPRÜFTE QUELLEN, DATENSTAND, ANNAHMEN UND RECHENWEGE EINFÜGEN]\n');
write(SCRIPT_FILE, '[VOLLSTÄNDIGES LONGFORM-VOICEOVER-SKRIPT EINFÜGEN]\n');
write('02-script/kapitel-dramaturgie.md', '# Kapitel und Dramaturgie\n\n[HOOK, KAPITEL, BEISPIELE, PAYOFFS, ZUSAMMENFASSUNG UND CTA EINFÜGEN]\n');
write('02-script/retention-plan.md', '# Retention-Plan\n\n[OFFENE FRAGEN, PAYOFFS, PATTERN-INTERRUPTS, VISUELLE RHYTHMUSWECHSEL UND ÜBERGÄNGE EINFÜGEN]\n');
write(`${AUDIO_INBOX}/.gitkeep`, '');
write(`${EXPORT_DIR}/.gitkeep`, '');
write('03-audio/word-timings.json', `${JSON.stringify({version:'finanzneo-caption-v1',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:YOUTUBE_VIDEO_FPS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]}, null, 2)}\n`);
write(`${IMAGE_INBOX}/.gitkeep`, '');
write('04-visuals/bildwelt.txt', `FINANZNEO YOUTUBE IMAGE WORLD\n\n${styleBlock}`);
write('04-visuals/thumbnail-prompt.txt', thumbnailPrompt);
write(ALL_PROMPTS, `FINANZNEO — SINGLE HANDOFF FILE FOR THE GOOGLE FLOW AI AGENT\n\n${YOUTUBE_FLOW_PROTOCOL_MARKER}\n\nBATCH WORKFLOW (MAX. ${YOUTUBE_FLOW_BATCH_SIZE} IMAGES IN PARALLEL):\n1. Read the full file once. Images are grouped into numbered BATCH blocks of up to ${YOUTUBE_FLOW_BATCH_SIZE}.\n2. Start every image of the current batch at the same time, each as its own single-image job. Never put several prompts into one request and never make a collage or contact sheet.\n3. As soon as an image returns, rename it immediately to the exact final file name stated in its block.\n4. Verify every image of the batch: script-beat fit, first-glance clarity, Editorial Finance style, 16:9 format, German-only text and file name. For a continuation visual, also verify that the approved reference composition is preserved and only the planned change was made.\n5. Regenerate every failed image (same image number, replace the failed file) before the next batch starts.\n6. Start the next batch only after all images of the current batch pass. A continuation image is never in the same batch as its reference.\n7. Skip non-image blocks without closing the numbering gap.\n8. At the end, place every generated and correctly named image together in ${IMAGE_INBOX.replace(/^\.\.\//, '')}/.\n\n${batchKopf('Thumbnail')}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTHUMBNAIL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${thumbnailPrompt}\n${promptSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINISH\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFinish only after every expected image has been generated in its batch, renamed immediately and verified. All final files must be together in ${IMAGE_INBOX.replace(/^\.\.\//, '')}/.\n`);
write('06-projektdateien/visual-plan.md', '# Visual-Plan — Viewer Change First\n\n1. Skript in gesprochene Gedanken zerlegen.\n2. Jedem Gedanken einen sichtbaren Visual Beat geben.\n3. Für jeden Motion-Beat zuerst in einem Satz festlegen: Was soll der Zuschauer tatsächlich sehen, das sich verändert, enthüllt, vergleicht oder räumlich erschließt?\n4. Erst danach den besten Typ und die beste konkrete Technik wählen.\n5. Technik darf frei erfunden oder kombiniert werden; Familien sind nur Beschreibungen, keine Whitelist.\n6. Vor Freigabe die letzten vier Motion-Visuals auf echte Wiederholung von Kamera, Layout und Transformation prüfen.\n\nKeine feste Visualzahl. Keine feste Bild-/Animationsquote. Keine Standardanimation. Keine bestehende Komponente auswählen, bevor klar ist, was der Zuschauer sehen soll. Variation dient der Erklärung, nicht der Effekthascherei.\n');
write('06-projektdateien/remotion-plan.md', `# Remotion-Plan — ${YOUTUBE_MOTION_STANDARD_ID}\n\n- Ausgabe: 1920 × 1080, 16:9, 30 fps\n- Viewer Change zuerst; Technik danach.\n- Motion World: finanzneo-youtube-light-motion-v2. Die Animation bleibt hell, sauber und 2D. Unterschiedliche Designs sind erlaubt, aber keine dunklen Welten, kein Full-3D und keine großen generischen Szenenüberschriften. Die aktuelle Mechanik/Visual-Bibliothek liegt unter src/youtube-motion/light-v3/.
Wähle pro Szene frei zwischen Vergleich, Chart, Tabelle, Icons, Dokument, Timeline, Prozess, Flow-Diagramm, Route, abstrakter 2D-Geometrie oder einer anderen hellen Custom-Lösung.\n- Erlaubt: Custom React, SVG, Canvas, Masks, clip-path, Paths, Shapes, Motion Blur, Effects, Lottie als Support, Datenvisualisierung, Bild+Motion-Hybrid und neue sinnvolle Kombinationen.\n- Composition Families sind freie Beschreibungen, keine erlaubte Endmenge.\n- Neue kanonische Light-2D-Bibliothek: src/youtube-motion/light-v3/. Dort sind Mechanik/Core von Visual-Komponenten getrennt.\n- Bestehende FinanzNeo-Komponenten sind optionale Werkzeuge, keine Pflichtvorlagen.\n- Pro Motion-Visual: viewerChange + animationIntent + mechanicId + visualTechniqueId + techniqueDescription + toolStack + motionSignature + mindestens eine klare erklärende Bewegung + Start/Result-Beats.\n- Anti-Fake-Variation: neuer Name allein reicht nicht; Kamera + Layout + Transformation werden gegen die letzten vier Motion-Visuals geprüft.\n- Wiederholung bleibt erlaubt, wenn sie für den Inhalt wirklich die beste Lösung ist und mit repeatTechniqueReason begründet wird.\n- Schnitte und finale Dauern folgen dem finalen Voiceover.\n`);
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
  thumbnail:{type:'image',googleFlowFileName:thumbnailFileName,planFile:'04-visuals/thumbnail-prompt.txt'},
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{protocolId:YOUTUBE_FLOW_PROTOCOL_ID,generationMode:'parallel-batches',batchSize:YOUTUBE_FLOW_BATCH_SIZE,oneJobPerImage:true,strictSequential:false,waitForBatch:true,renameImmediately:true,qaBeforeNextBatch:true,germanTextOnly:true,retrySameImageOnFailure:true,referenceImagesAllowed:true,continuationReferenceRequiredWhenDeclared:true,referenceMustUseApprovedPriorImage:true,finalCollectionDirectory:`${IMAGE_INBOX}/`,distributeToVisualFolders:false},
  imageWorld:{id:WORLD_ID,seriesLockId:SERIES_LOCK_ID,authority:'docs/FINANZNEO-IMAGE-WORLD.md',generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,horizontalGeneratedImagesRequired:true,referencePromptFile:'04-visuals/bildwelt.txt',promptLanguage:'en',primaryStyle:'clean-editorial-finance-illustration',flexibleBackgrounds:true,fixedBlackBackgroundForbidden:true,fixed3DRenderingForbidden:true,twoDAllowed:true,subtleTwoPointFiveDAllowed:true,selectiveSimple3DAllowed:true,firstGlanceUnderstandingRequired:true,oneCoreIdeaPerImageRequired:true,progressiveSequencesAllowed:true,approvedPriorImageReferenceAllowed:true,genericHeadlineByDefault:false,aiSlopAvoidanceRequired:true},
  motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,visualMotionWorld:'finanzneo-youtube-light-motion-v2',visualTargetWorld:'finanzneo-youtube-light-motion-v2',minimumMotionPreferred:false,motionDensityStoryDriven:true,cameraStillDefault:true,cameraStoryDriven:false,staticImageStyleCopyRequired:false,youtubeNativeCompositionRequired:true,conceptCandidatesRequired:3,keyframeQaRequired:true,keyframeQaPercentages:[10,35,65,90],fixed3DStyleForbidden:true,fixedArtDirectionForbidden:false,flexibleBackgrounds:true,darkBackgroundAllowed:false,blackBackgroundAllowed:false,full3DAllowed:false,simpleComparisonAllowed:true,chartAllowed:true,sceneArtDirectionOpen:false,mixedStyleAcrossScenesAllowed:true,brandStyleMatchRequired:false,lightBackgroundRequired:true,flat2DPreferred:true,genericSceneHeadlinesForbidden:true,viewerChangeFirstRequired:true,contentFirstTechniqueSelection:true,openTechniqueSelection:true,compositionFamiliesAreExamplesOnly:true,motionSignatureRequired:true,recentMotionWindow:4,customReactAllowed:true,svgAllowed:true,css3dAllowed:false,canvasAllowed:true,threeAllowed:false,hybridAllowed:true,dataVisualizationAllowed:true,existingComponentsOptional:true,physicalPrimitivesOptional:true,semanticVariationRequired:false},
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
console.log(`  Motion: ${YOUTUBE_MOTION_STANDARD_ID}`);
if (types.length === 0) console.log('  Noch keine Visualtypen vorgegeben: zuerst Skript → Visual Beats → Viewer Change → Typen/Techniken planen, dann visual-index/Visualordner in Phase 1 befüllen.');
else console.log(`  Visuals: ${types.length} · ${types.join(' / ')}`);
