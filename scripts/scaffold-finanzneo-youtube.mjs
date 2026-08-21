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
  YOUTUBE_PUBLISHING_FILES,
  YOUTUBE_VIDEO_ASPECT_RATIO,
  YOUTUBE_VIDEO_FPS,
  YOUTUBE_VIDEO_HEIGHT,
  YOUTUBE_VIDEO_WIDTH,
} from './lib/youtube-contract.mjs';

const args = process.argv.slice(2);
const valueOf = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const targetArg = valueOf('--target');
const title = valueOf('--title');
const typesArg = valueOf('--types');
const defaultTypes = ['image', 'animation', 'image', 'image', 'animation', 'image', 'image', 'animation', 'image', 'image', 'animation', 'image'];
const types = typesArg ? typesArg.split(',').map((value) => value.trim()) : defaultTypes;

if (!targetArg || !title) {
  console.error('Nutzung: npm run youtube:create -- --target youtube/<Projekt> --title "Titel" [--types image,animation,...]');
  process.exit(1);
}
if (types.length < 1 || types.some((type) => !['image', 'animation'].includes(type))) {
  console.error('--types darf nur eine Kommaliste aus image und animation enthalten.');
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

const styleBlock = `${WORLD_ID_MARKER}\n${SERIES_LOCK_MARKER}\n${GENERATED_IMAGE_ASPECT_MARKER}\n\nPremium fintech editorial 3D render. Keep the exact same FinanzNeo visual world across the whole image series: deep charcoal green-black, vivid emerald and mint accents, gold only for money or value, warm red-orange only for risk, loss or debt, smooth rounded 3D geometry, soft bevelled edges, premium matte and transparent materials, confident high-contrast lighting and a bold emerald rim light. Use ONE dominant financial metaphor and only a few supporting objects. A stylized anonymous adult person is optional; if present, show a clearly visible stylized face with eyes, nose and mouth in front or natural three-quarter view. Use only explicitly requested short German object labels near their objects. No headline, subtitle, explanatory sentence, random text, photorealism, real identifiable human, faceless character, Pixar, clay, dashboard, app screen, tiny diorama, neon tunnel, sci-fi corridor or game-level layout.\n\nUse ONE single seamless continuous deep charcoal green-black background across the entire horizontal 16:9 image. No horizontal divisions, sections, panels, floor-wall boundary, horizon line or studio wall split. Use only one subtle continuous gradient or vignette. Compose for a cinematic horizontal frame with safe breathing room. Horizontal 16:9 source image; width must be approximately 1.7778 times the height. No square, portrait or vertical format.\n`;

const flowStep = (fileName, referenceText) => `${FLOW_AGENT_PROTOCOL_MARKER}\nCURRENT SINGLE STEP — DO NOT JUMP AHEAD\n\nFINAL FILE NAME:\n${fileName}\n\nGenerate exactly this one image now. Wait until it is fully complete. Rename it immediately to the exact final file name above. Verify the metaphor, requested German labels, visible face if a person appears, seamless background, horizontal 16:9 format, same-world lock and exact file name. ${referenceText} If any check fails, regenerate this same image number and replace the failed file. Continue only after this image passes. Never render the file name inside the image.\n`;

const promptFor = (index) => {
  const name = visualFileName(index);
  return `${flowStep(name, 'Compare the art direction with the approved thumbnail style reference, but never copy its subject, layout or labels.')}\nIMAGE PROMPT:\nShow [ONE LARGE DOMINANT FINANCIAL METAPHOR FOR THIS SCRIPT BEAT]. [DESCRIBE ONE CLEAR CAUSE-AND-EFFECT ACTION WITH A FEW LARGE OBJECTS]. Include only these short German object labels: [LABELS].\n\n${styleBlock}`;
};

const thumbnailPrompt = `${flowStep(thumbnailFileName, 'After approval, this thumbnail becomes the pure visual style reference for the following images.')}\nTHUMBNAIL PROMPT:\nCreate a high-impact YouTube thumbnail that communicates [CORE PROMISE OR TENSION] through one large financial metaphor. Use a clear focal point, strong foreground-background separation and generous space for optional typography that will be added later in Remotion. Do not generate headline text inside the image.\n\n${styleBlock}`;

const visuals = types.map((type, index) => {
  const number = numberOf(index);
  const id = `visual-${number}`;
  const directory = `04-visuals/EINZELNE-VISUALS/${id}`;
  if (type === 'image') {
    write(`${directory}/bildprompt.txt`, promptFor(index));
    return {
      id,
      type,
      planFile: `${directory}/bildprompt.txt`,
      googleFlowFileName: visualFileName(index),
      chapter: '[CHAPTER]',
      scriptBeat: '[SCRIPT BEAT]',
      expectedVisual: '[VISUAL DESCRIPTION]',
      objectLabels: ['[LABEL]'],
    };
  }
  write(`${directory}/remotion.md`, `# Remotion-Spezifikation ${id}\n\n- Kapitel: [CHAPTER]\n- Sprechtext-Bezug: [SCRIPT BEAT]\n- Startzustand: [EINFÜGEN]\n- Bewegung: [EINFÜGEN]\n- Endzustand: [EINFÜGEN]\n- Datenquelle/Berechnung: [EINFÜGEN ODER NICHT NÖTIG]\n`);
  return {
    id,
    type,
    planFile: `${directory}/remotion.md`,
    chapter: '[CHAPTER]',
    scriptBeat: '[SCRIPT BEAT]',
  };
});

const promptSections = visuals.map((visual, index) => {
  if (visual.type === 'animation') {
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — REMOTION ANIMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDO NOT GENERATE IMAGE ${numberOf(index)}. Keep this number reserved and continue with the next block.\n`;
  }
  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nVISUAL ${numberOf(index)} — IMAGE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${promptFor(index)}`;
}).join('\n');

write('README.md', `# ${title}\n\nEigenständiges YouTube-Longform-Projekt. Kein Reel und kein YouTube Short.\n\n## Drei Phasen\n\n1. ChatGPT vervollständigt Recherche, Skript, Dramaturgie, Visuals und das gesamte Publishing-Paket ohne Platzhalter.\n2. Der Nutzer erstellt Thumbnail und Bilder einzeln mit Google Flow, benennt sie sofort exakt um und legt sie gemeinsam in \`${IMAGE_INBOX}/\`. Danach genau ein finales Voiceover plus echte Wort-Timings.\n3. \`npm run youtube:ready -- ${targetArg}\` prüft alles. Bei Erfolg baut Antigravity das Video ohne Zwischenfragen bis zur QA.\n`);
write('01-recherche/briefing.md', '# Briefing\n\n- Thema: [THEMA]\n- Zielgruppe: Finanzanfänger\n- Lernziel: [EINFÜGEN]\n- Kernversprechen: [EINFÜGEN]\n- Warum Longform nötig ist: [EINFÜGEN]\n- Datenstand: [EINFÜGEN]\n');
write('01-recherche/recherche-quellen.md', '# Recherche und Quellen\n\n[GEPRÜFTE QUELLEN, DATENSTAND, ANNAHMEN UND RECHENWEGE EINFÜGEN]\n');
write('02-script/script-fliess-text.txt', '[VOLLSTÄNDIGES LONGFORM-VOICEOVER-SKRIPT EINFÜGEN]\n');
write('02-script/kapitel-dramaturgie.md', '# Kapitel und Dramaturgie\n\n[HOOK, KAPITEL, BEISPIELE, ZUSAMMENFASSUNG UND CTA EINFÜGEN]\n');
write('02-script/retention-plan.md', '# Retention-Plan\n\n[OFFENE FRAGEN, PAYOFFS, PATTERN-INTERRUPTS UND ÜBERGÄNGE EINFÜGEN]\n');
write('03-audio/README.md', '# AUDIO HIER REIN\n\nGenau eine finale Voiceover-Datei ablegen. Danach aus genau dieser Datei echte Wort-Zeitstempel in `word-timings.json` erzeugen.\n');
write('03-audio/word-timings.json', `${JSON.stringify({version:'finanzneo-caption-v1',language:'de',source:'',generatedAt:'',duration:0,wordCount:0,fps:YOUTUBE_VIDEO_FPS,subtitleMode:SUBTITLE_MODE,activeWordColor:ACTIVE_WORD_COLOR,words:[],sentences:[]}, null, 2)}\n`);
write(`${IMAGE_INBOX}/README.md`, '# ALLE FERTIGEN 16:9-BILDER HIER REIN\n\nThumbnail und Video-Bilder einzeln erzeugen, sofort exakt umbenennen, prüfen und erst danach das nächste Bild starten. Keine Batches.\n');
write('04-visuals/bildwelt.txt', `FINANZNEO YOUTUBE IMAGE WORLD\n\n${styleBlock}`);
write('04-visuals/thumbnail-prompt.txt', thumbnailPrompt);
write('04-visuals/alle-bildprompts.txt', `FINANZNEO — SINGLE HANDOFF FILE FOR THE GOOGLE FLOW AI AGENT\n\n${FLOW_AGENT_PROTOCOL_MARKER}\n\nSTRICT SEQUENTIAL WORKFLOW:\n1. Read the full file once, then work from top to bottom on only the current image block.\n2. Generate exactly ONE image. Never generate a batch and never prepare the next image in parallel.\n3. Wait until the current image is fully complete.\n4. Rename it immediately to the exact final file name stated in its block.\n5. Verify the metaphor, labels, face if present, seamless background, 16:9 format, same-world lock and file name.\n6. If anything fails, regenerate the same image number and replace the failed file. Do not move on.\n7. Continue only after the current image passes.\n8. Skip blocks marked DO NOT GENERATE without closing the numbering gap.\n9. At the end, place every generated and correctly named image together in ${IMAGE_INBOX}/.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTHUMBNAIL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${thumbnailPrompt}\n${promptSections}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINISH\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nFinish only after every expected image has been generated one at a time, renamed immediately and verified. All final files must be together in ${IMAGE_INBOX}/.\n`);
write('06-projektdateien/visual-plan.md', '# Visual-Plan\n\n[JEDEN SCRIPT-BEAT EINEM BILD, EINER REMOTION-ANIMATION ODER BEWUSSTEM WEITERLAUF ZUORDNEN]\n');
write('06-projektdateien/remotion-plan.md', '# Remotion-Plan\n\n- Ausgabe: 1920 × 1080, 16:9, 30 fps\n- Schnitte: nach finalem Voiceover und Kapitel-/Satzlogik\n- Untertitel: satzweise, aktives Wort grün\n- Thumbnail: separate 16:9-Datei, Typografie bei Bedarf in Remotion\n');
write('06-projektdateien/PHASENSTATUS.md', `# Phasenstatus\n\n- [ ] Phase 1 vollständig und ohne Platzhalter\n- [ ] Phase 2: alle exakten 16:9-Bilder, ein finales Voiceover und echte Wort-Timings vorhanden\n- [ ] Phase 3: \`npm run youtube:ready -- ${targetArg}\` erfolgreich; Produktion und QA abgeschlossen\n\nTechnische Autorität für den Start von Phase 3 ist ausschließlich \`youtube:ready\`.\n`);
write('06-projektdateien/timeline.json', `${JSON.stringify({version:1,title,fps:YOUTUBE_VIDEO_FPS,timingSource:'03-audio/word-timings.json',cutRule:'voice-and-chapter-driven',visuals:visuals.map((visual) => ({id:visual.id,type:visual.type,startFrame:0,durationFrames:0}))}, null, 2)}\n`);
write('04-visuals/visual-index.json', `${JSON.stringify({
  version:1,
  title,
  format:'youtube-longform',
  shortsForbidden:true,
  video:{aspectRatio:YOUTUBE_VIDEO_ASPECT_RATIO,width:YOUTUBE_VIDEO_WIDTH,height:YOUTUBE_VIDEO_HEIGHT,fps:YOUTUBE_VIDEO_FPS},
  thumbnail:{type:'image',googleFlowFileName:thumbnailFileName,planFile:'04-visuals/thumbnail-prompt.txt'},
  userCreatesImages:true,
  antigravityGeneratesImages:false,
  googleFlow:{protocolId:FLOW_AGENT_PROTOCOL_ID,generationMode:'one-image-at-a-time',strictSequential:true,waitForCurrentImage:true,renameBeforeNext:true,qaBeforeNext:true,retrySameImageOnFailure:true,finalCollectionDirectory:`${IMAGE_INBOX}/`,distributeToVisualFolders:false},
  imageWorld:{id:WORLD_ID,seriesLockId:SERIES_LOCK_ID,generatedImageAspectRatio:GENERATED_IMAGE_ASPECT_RATIO,horizontalGeneratedImagesRequired:true,referencePromptFile:'04-visuals/bildwelt.txt',styleReferenceStrategy:'approved-thumbnail-style-only',sameWorldAcrossSeriesRequired:true,seamlessSingleBackgroundRequired:true,visibleFaceRequiredWhenPersonPresent:true,objectLabelsOnly:true},
  timelineRules:{timingSource:'03-audio/word-timings.json',cutsFollowVoiceAndChapters:true,equalLengthVisualsForbiddenByDefault:true},
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
write(YOUTUBE_PUBLISHING_FILES.thumbnailBrief, '[THUMBNAIL-KERNAUSSAGE, MOTIV, KOMPOSITION UND OPTIONALEN REMOTION-TEXT EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.pinnedComment, '[ANGEHEFTETEN KOMMENTAR MIT SINNVOLLEM CTA EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.communityPost, '[YOUTUBE-COMMUNITY-POST EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.sourcesDisclaimer, '[QUELLEN, DATENSTAND, ANNAHMEN UND PASSENDEN DISCLAIMER EINFÜGEN]\n');
write(YOUTUBE_PUBLISHING_FILES.uploadChecklist, '# Upload-Checkliste\n\n- [ ] Finales Video vollständig geprüft\n- [ ] Finaler Titel passt zum tatsächlichen Inhalt\n- [ ] Beschreibung, Quellen und Disclaimer final\n- [ ] Kapitel-Zeitstempel passen zum finalen Render\n- [ ] Thumbnail geprüft\n- [ ] Untertitel geprüft\n- [ ] Sichtbarkeit und Veröffentlichungszeit bewusst gewählt\n');
write(SOCIAL_PROMO_FILES.instagram, 'CAPTION:\n[EINFÜGEN]\n\nCTA ZUM YOUTUBE-VIDEO:\n[EINFÜGEN]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.tiktok, 'CAPTION:\n[EINFÜGEN]\n\nCTA ZUM YOUTUBE-VIDEO:\n[EINFÜGEN]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.facebook, 'BEITRAGSTEXT:\n[EINFÜGEN]\n\nCTA ZUM YOUTUBE-VIDEO:\n[EINFÜGEN]\n\nHASHTAGS:\n[EINFÜGEN]\n');
write(SOCIAL_PROMO_FILES.snapchat, 'CAPTION:\n[EINFÜGEN]\n\nOPTIONALER CTA ZUM YOUTUBE-VIDEO:\n[EINFÜGEN ODER ENTFERNEN]\n');

console.log(`✓ YouTube-Longform-Gerüst erstellt: ${root}`);
console.log(`  ${visuals.filter((visual) => visual.type === 'image').length} Bild-Visuals · ${visuals.filter((visual) => visual.type === 'animation').length} Remotion-Visuals · 1 Thumbnail`);
console.log('  Format: 1920 × 1080 · 16:9 · 30 fps · keine YouTube Shorts');
console.log('  Publishing: YouTube-Komplettpaket + Instagram · TikTok · Facebook · Snapchat');
console.log(`  Phase-3-Prüfung: npm run youtube:ready -- ${targetArg}`);
