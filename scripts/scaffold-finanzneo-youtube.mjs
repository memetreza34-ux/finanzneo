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

const styleBlock = `${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\n${GENERATED_IMAGE_ASPECT_MARKER}\nIMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1\n\nLiteral first, creative second. Show the concrete real-world financial situation described by the script beat before considering any metaphor. The viewer should understand the approximate situation without a subtitle. Show cause/effect in the same frame when possible. A metaphor is optional and must only be used when it communicates the beat more clearly than the literal situation. Avoid generic finance-symbol collections.\n\nPremium clearly stylized 3D FinanzNeo world, never photorealistic: believable everyday objects, semi-realistic material cues, large readable hero objects, deep seamless black as the dominant world, only as much local real-world context as the explanation needs. Emerald green for positive/solution/value when semantically correct, warm red-orange for cost/risk/loss, warm ivory and soft gray for neutral objects, subtle gold only for money/value. Clean soft studio lighting, readable contact shadows, controlled highlights and strong subject separation. Do not reuse green folders, coin stacks, glowing money ribbons, piggy banks, plants or arrows as recurring defaults. Use only explicitly requested short German object labels near their objects. No headline, subtitle, explanatory sentence, random text, photorealism, dashboard, app screen, floating info cards, flowchart, tiny diorama, generic finance icon kit or unrelated decorative props.\n\nUse ONE single seamless deep-black world across the horizontal 16:9 image. Local context may dissolve into black when it improves credibility. Compose for a wide YouTube frame with important objects large enough for mobile, laptop and TV playback. Horizontal 16:9 source image; width approximately 1.7778 times height.\n`;

const flowStep = (fileName, referenceText) => `${FLOW_AGENT_PROTOCOL_MARKER}\nCURRENT SINGLE STEP — DO NOT JUMP AHEAD\n\nFINAL FILE NAME:\n${fileName}\n\nGenerate exactly ONE image. Wait until it is fully complete. Rename it immediately to the exact final file name above. Verify the literal situation, financial context, requested German labels, seamless background, horizontal 16:9 format, same-world lock and exact file name. ${referenceText} If any check fails, regenerate the same image number and replace the failed file. Continue only after this image passes. Never render the file name inside the image.\n`;

const promptFor = (index) => {
  const name = visualFileName(index);
  return `${flowStep(name, 'Use the approved FinanzNeo YouTube visual world, but never copy another scene subject, composition or labels.')}\nLITERAL_REAL_WORLD_SITUATION: [DESCRIBE THE EXACT REAL SITUATION]\nREAL_WORLD_CONTEXT_ANCHOR: [BANK / HOME / SHOP / CONTRACT / MARKET / OTHER CONCRETE CONTEXT]\nVOICEOVER_VISUAL_MATCH: [EXPLAIN HOW THIS FRAME DIRECTLY SHOWS THE SCRIPT BEAT]\nTRANSFERABILITY_TEST: [PASS — EXPLAIN WHY THIS IMAGE WOULD NOT FIT FIVE OTHER FINANCE TOPICS]\nVISUAL_STRATEGY: [literal OR metaphor]\nMETAPHOR_JUSTIFICATION: [NONE IF LITERAL; OTHERWISE WHY METAPHOR IS CLEARER]\n\nIMAGE PROMPT:\nShow [THE EXACT CONCRETE SITUATION AND CAUSE/EFFECT]. Include only these short German object labels if needed: [LABELS].\n\n${styleBlock}`;
};

const thumbnailPrompt = `${flowStep(thumbnailFileName, 'Use the approved FinanzNeo YouTube visual world. The thumbnail is not a mandatory subject template for following scenes.')}\nTHUMBNAIL PROMPT:\nCreate a high-impact 16:9 YouTube thumbnail that communicates [CORE PROMISE OR TENSION] with one instantly understandable concrete situation. Prefer a literal financial context over an abstract metaphor. Use a clear focal point, strong foreground-background separation and generous space for optional typography that will be added later in Remotion. Do not generate headline text inside the image.\n\n${styleBlock}`;

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
write(`${IMAGE_INBOX}/README.md`, '# ALLE FERTIGEN 16:9-BILDER HIER REIN\n\nThumbnail und Video-Bilder einzeln erzeugen, sofort exakt umbenennen, prüfen und erst danach das nächste Bild starten. Keine Batches.\n');
write('04-visuals/bildwelt.txt', `FINANZNEO YOUTUBE IMAGE WORLD\n\n${styleBlock}`);
write('04-visuals/thumbnail-prompt.txt', thumbnailPrompt);
write('04-visuals/alle-bildprompts.txt', `FINANZNEO — SINGLE HANDOFF FILE FOR THE GOOGLE FLOW AI AGENT\n\n${FLOW_AGENT_PROTOCOL_MARKER}\n\nSTRICT SEQUENTIAL WORKFLOW:\n1. Read the full file once, then work from top to bottom on only the current image block.\n2. Generate exactly ONE image. Never generate a batch and never prepare the next image in parallel.\n3. Wait until the current image is fully complete.\n4. Rename it immediately to the exact final file name stated in its block.\n5. Verify literal situation, context, labels, seamless background, 16:9 format, same-world lock and file name.\n6. If anything fails, regenerate the same image number and replace the failed file. Do not move on.\n7. Continue only after the current image passes.\n8. Skip non-image blocks without closing the numbering gap.\n9. At the end, place every generated and correctly named image together in ${IMAGE_INBOX}/.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTHUMBNAIL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${thumbnailPrompt}\n${promptSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINISH\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFinish only after every expected image has been generated one at a time, renamed immediately and verified. All final files must be together in ${IMAGE_INBOX}/.\n`);
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
  thumbnail:{type:'image',googleFlowFileName:thumbnailFileName,planFile:'04-visuals/thumbnail-prompt.txt'},
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{protocolId:FLOW_AGENT_PROTOCOL_ID,generationMode:'one-image-at-a-time',strictSequential:true,waitForCurrentImage:true,renameBeforeNext:true,qaBeforeNext:true,retrySameImageOnFailure:true,finalCollectionDirectory:`${IMAGE_INBOX}/`,distributeToVisualFolders:false},
  imageWorld:{id:WORLD_ID,seriesLockId:SERIES_LOCK_ID,generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,horizontalGeneratedImagesRequired:true,referencePromptFile:'04-visuals/bildwelt.txt',styleReferenceStrategy:'canonical-youtube-image-world',sameWorldAcrossSeriesRequired:true,literalFirst:true,metaphorOptional:true,seamlessSingleBackgroundRequired:true,objectLabelsOnly:true},
  motionStandard:{id:YOUTUBE_MOTION_STANDARD_ID,viewerChangeFirstRequired:true,openTechniqueSelection:true,compositionFamiliesAreExamplesOnly:true,motionSignatureRequired:true,recentMotionWindow:4,customReactAllowed:true,svgAllowed:true,css3dAllowed:true,canvasAllowed:true,threeAllowed:true,hybridAllowed:true,dataVisualizationAllowed:true,existingComponentsOptional:true,physicalPrimitivesOptional:true,semanticVariationRequired:true},
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
