#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ALL_PROMPTS,
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  FORBIDDEN_YOUTUBE_ARTIFACTS,
  GENERATED_IMAGE_ASPECT_MARKER,
  GENERATED_IMAGE_ASPECT_RATIO,
  IMAGE_INBOX,
  IMAGE_WORLD_PROMPT,
  PROMPT_DIRECTORY,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  SOCIAL_PROMO_FILES,
  SUBTITLE_MODE,
  THUMBNAIL_PROMPT,
  VISUAL_INDEX,
  WORD_TIMINGS,
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
import {
  requiresYouTubeImage,
  requiresYouTubeMotion,
  validateYouTubeMotionMetadata,
  validateYouTubeMotionVariety,
} from './lib/youtube-motion-contract.mjs';

const [target] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run youtube:validate -- youtube/<Projekt>');
  process.exit(1);
}

const root = resolve(target);
const relativeTarget = relative(resolve('youtube'), root);
if (!relativeTarget || relativeTarget.startsWith('..') || relativeTarget.split(sep).includes('..')) {
  console.error('Ziel muss ein YouTube-Projekt unter youtube/ sein.');
  process.exit(1);
}

const PHASE_STATUS = '06-projektdateien/PHASENSTATUS.md';
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8');
const requiredDirectories = ['01-recherche', '02-script', '03-audio', '04-visuals', '05-publishing', '06-projektdateien', IMAGE_INBOX, PROMPT_DIRECTORY];
for (const directory of requiredDirectories) {
  assert(existsSync(resolve(root, directory)) && statSync(resolve(root, directory)).isDirectory(), `${directory}/ fehlt.`);
}

const findForbidden = (directory) => {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory)) {
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) findForbidden(path);
    else if (FORBIDDEN_YOUTUBE_ARTIFACTS.includes(entry.toLowerCase())) errors.push(`YouTube-Shorts-Artefakt verboten: ${path}`);
  }
};
findForbidden(root);

let index = null;
if (!existsSync(resolve(root, VISUAL_INDEX))) {
  errors.push(`${VISUAL_INDEX} fehlt.`);
} else {
  try { index = JSON.parse(read(VISUAL_INDEX)); }
  catch (error) { errors.push(`${VISUAL_INDEX} ist kein gültiges JSON: ${error.message}`); }
}

assert(existsSync(resolve(root, ALL_PROMPTS)), `${ALL_PROMPTS} fehlt.`);
assert(existsSync(resolve(root, IMAGE_WORLD_PROMPT)), `${IMAGE_WORLD_PROMPT} fehlt.`);
assert(existsSync(resolve(root, THUMBNAIL_PROMPT)), `${THUMBNAIL_PROMPT} fehlt.`);
assert(existsSync(resolve(root, WORD_TIMINGS)), `${WORD_TIMINGS} fehlt.`);

if (index) {
  assert(index.format === 'youtube-longform', 'format muss youtube-longform sein.');
  assert(index.shortsForbidden === true, 'YouTube Shorts müssen ausdrücklich verboten sein.');
  assert(index.fixedVisualCount === false, 'YouTube Longform darf keine feste Visualzahl erzwingen.');
  assert(index.fixedImageAnimationRatio === false, 'YouTube Longform darf keine feste Bild-/Animationsquote erzwingen.');
  assert(index.video?.aspectRatio === YOUTUBE_VIDEO_ASPECT_RATIO, 'YouTube-Videoformat muss 16:9 sein.');
  assert(Number(index.video?.width) === YOUTUBE_VIDEO_WIDTH && Number(index.video?.height) === YOUTUBE_VIDEO_HEIGHT, 'YouTube-Video muss 1920 × 1080 verwenden.');
  assert(Number(index.video?.fps) === YOUTUBE_VIDEO_FPS, 'YouTube-Video muss 30 fps verwenden.');
  assert(index.userCreatesImages === true && index.antigravityGeneratesImages === false, 'Bilder müssen ausschließlich vom Nutzer kommen.');
  assert(index.imageWorld?.id === WORLD_ID, 'FinanzNeo Image World ID fehlt.');
  assert(index.imageWorld?.seriesLockId === SERIES_LOCK_ID, 'FinanzNeo Same-World-Lock fehlt.');
  assert(index.imageWorld?.generatedImageAspectRatio === GENERATED_IMAGE_ASPECT_RATIO, 'YouTube-Quellbilder müssen 16:9 sein.');
  assert(index.imageWorld?.horizontalGeneratedImagesRequired === true, 'Horizontale 16:9-Quellbilder müssen verpflichtend sein.');
  assert(index.imageWorld?.sameWorldAcrossSeriesRequired === true, 'Dieselbe Bildwelt muss für die ganze Serie vorgeschrieben sein.');
  assert(index.imageWorld?.styleLockId === YOUTUBE_IMAGE_WORLD_LOCK, `YouTube-Bildwelt muss ${YOUTUBE_IMAGE_WORLD_LOCK} sein.`);
  assert(index.imageWorld?.formFree === true && index.imageWorld?.frontReadableDefault === true, 'YouTube-Bilder brauchen Form-frei + Front-readable V2.');
  assert(index.imageWorld?.frontFacingChartsRequired === true, 'Charts/Diagramme müssen frontal dargestellt werden.');
  assert(index.imageWorld?.styleReferenceStrategy === 'written-youtube-v9-lock-only', 'Nur die geschriebene YouTube-V9-Welt darf Style-Autorität sein.');
  assert(index.imageWorld?.selectedThumbnailMayBeStyleReference === false, 'Das gewählte Thumbnail darf keine Style-Referenz sein.');
  assert(index.imageWorld?.referencePromptFile === IMAGE_WORLD_PROMPT, 'referencePromptFile ist falsch.');
  assert(index.imageWorld?.primaryApprovedStyleAnchor === 'finanzneo-stylized-3d-animated-black-v9', 'Stylized 3D Animated Black V9 muss primärer Flow-Stilanker sein.');
  assert(index.imageWorld?.legacyPromptDna === undefined, 'Die alte Legacy-Prompt-DNA (grün-goldene Chunky-CGI) darf nicht mehr Stilquelle sein.');
  if (Array.isArray(index.imageWorld?.flowVisualModes)) {
    assert(index.imageWorld.flowVisualModes.includes('character-moment') && index.imageWorld.flowVisualModes.includes('object-story'), 'Flow-Bildwelt muss Figuren-Momente und Objektgeschichten unterstützen.');
  assert(index.imageWorld?.precisionGraphicsOwner === 'remotion', 'Präzise Daten/UI/Checklisten müssen Remotion gehören.');
  assert(index.imageWorld?.flowInfographicLayoutsForbidden === true, 'Google Flow darf keine Infografik-/Dashboard-Layouts erzeugen.');
  }
  assert(index.motionStandard?.id === YOUTUBE_MOTION_STANDARD_ID, `motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein.`);
  assert(index.motionStandard?.contentFirstTechniqueSelection === true, 'Motion-Technik muss aus dem Inhalt gewählt werden.');
  assert(index.motionStandard?.existingComponentsOptional === true && index.motionStandard?.physicalPrimitivesOptional === true, 'Bestehende/Physical-Primitives müssen optional bleiben.');
  assert(index.googleFlow?.protocolId === FLOW_AGENT_PROTOCOL_ID, 'Google-Flow-Agent-Protokoll fehlt.');
  assert(index.googleFlow?.executionModeId === YOUTUBE_FLOW_EXECUTION_MODE_ID, `Google Flow muss ${YOUTUBE_FLOW_EXECUTION_MODE_ID} verwenden.`);
  assert(index.googleFlow?.generationMode === 'thumbnail3-parallel-then-image5-parallel-batches' && index.googleFlow?.strictSequential === false, 'Google Flow muss Thumbnail-3 parallel und danach Bild-5 parallel arbeiten.');
  assert(Number(index.googleFlow?.thumbnailCandidateCount) === YOUTUBE_THUMBNAIL_CANDIDATE_COUNT && Number(index.googleFlow?.thumbnailConcurrency) === YOUTUBE_THUMBNAIL_CONCURRENCY, 'Thumbnail-Phase muss exakt 3 parallele getrennte Jobs verwenden.');
  assert(index.googleFlow?.thumbnailSeparateJobsRequired === true && index.googleFlow?.thumbnailSelectionRequired === true, 'Thumbnail A/B/C müssen getrennte Jobs sein und eine einmalige Auswahl verlangen.');
  assert(index.googleFlow?.selectedThumbnailMayBeStyleReference === false, 'Gewähltes Thumbnail darf keine Style-Referenz werden.');
  assert(Number(index.googleFlow?.imageBatchSize) === YOUTUBE_IMAGE_BATCH_SIZE && Number(index.googleFlow?.imageConcurrency) === YOUTUBE_IMAGE_CONCURRENCY, 'Szenenbilder müssen in parallelen 5er-Batches laufen.');
  assert(index.googleFlow?.separateOneImageJobsRequired === true && index.googleFlow?.multiImageRequestForbidden === true, '5er-Batch muss aus getrennten Ein-Bild-Jobs bestehen.');
  assert(index.googleFlow?.renameImmediatelyOnReturn === true && index.googleFlow?.qaEachResult === true && index.googleFlow?.nextBatchLockedUntilCurrentBatchPasses === true, 'Jedes Batch-Ergebnis muss sofort umbenannt/QA-geprüft werden; nächster Batch erst nach Gesamt-PASS.');
  assert(index.googleFlow?.retrySameImageOnFailure === true && index.googleFlow?.userApprovalBetweenBatchesForbidden === true && index.googleFlow?.finalInventoryQaRequired === true, 'Retry/Auto-Continue/Final-Inventory-Vertrag fehlt.');
  assert(index.googleFlow?.finalCollectionDirectory === `${IMAGE_INBOX}/`, 'Finaler gemeinsamer Bilderordner ist falsch.');
  assert(index.googleFlow?.distributeToVisualFolders === false, 'Google Flow darf Bilder nicht auf Visual-Ordner verteilen.');
  assert(index.timelineRules?.cutsFollowVoiceAndChapters === true && index.timelineRules?.beatFirst === true, 'Schnitte müssen Voiceover/Beats/Kapiteln folgen.');
  assert(index.timelineRules?.equalLengthVisualsForbiddenByDefault === true, 'Starre gleich lange Visuals müssen standardmäßig verboten sein.');
  assert(Number(index.audio?.targetIntegratedLufs) === -16 && Number(index.audio?.targetTruePeakDbtp) === -1, 'Audioziel muss ungefähr -16 LUFS und höchstens -1 dBTP sein.');
  assert(index.thumbnail?.type === 'image' && typeof index.thumbnail?.googleFlowFileName === 'string', 'Thumbnail-Vertrag fehlt.');
  assert(index.thumbnail?.planFile === THUMBNAIL_PROMPT, 'Thumbnail-Promptpfad ist falsch.');
  assert(Number(index.thumbnail?.candidateCount) === YOUTUBE_THUMBNAIL_CANDIDATE_COUNT && Number(index.thumbnail?.concurrency) === YOUTUBE_THUMBNAIL_CONCURRENCY, 'Es müssen 3 Thumbnail-Kandidaten gleichzeitig geplant sein.');
  assert(index.thumbnail?.textRequired === true && Number(index.thumbnail?.textMaxLines) === 2, 'Thumbnail braucht kurzen Inhalts-Hook mit max. 2 Zeilen.');
  assert(index.thumbnail?.mustUseSameV9World === true && index.thumbnail?.mayBeStyleReference === false, 'Thumbnail muss dieselbe V9-Welt nutzen, darf aber nie Style-Referenz sein.');
  assert(Array.isArray(index.visuals) && index.visuals.length > 0, `${VISUAL_INDEX} benötigt nach Phase-1-Planung visuals[].`);

  for (const [key, expectedPath] of Object.entries(YOUTUBE_PUBLISHING_FILES)) {
    assert(index.publishing?.youtube?.[key] === expectedPath, `publishing.youtube.${key} muss auf ${expectedPath} zeigen.`);
    assert(existsSync(resolve(root, expectedPath)), `Publishing-Datei fehlt: ${expectedPath}`);
  }
  for (const [key, expectedPath] of Object.entries(SOCIAL_PROMO_FILES)) {
    assert(index.publishing?.socialPromo?.[key] === expectedPath, `publishing.socialPromo.${key} muss auf ${expectedPath} zeigen.`);
    assert(existsSync(resolve(root, expectedPath)), `Social-Promo-Datei fehlt: ${expectedPath}`);
  }

  const imageFileNames = new Set();
  for (const [position, visual] of (index.visuals ?? []).entries()) {
    const id = typeof visual?.id === 'string' ? visual.id : 'Unbekanntes Visual';
    const expectedId = `visual-${String(position + 1).padStart(2, '0')}`;
    assert(id === expectedId, `${id}: ID und Reihenfolge müssen lückenlos ${expectedId} entsprechen.`);
    assert(YOUTUBE_VISUAL_TYPES.includes(visual?.type), `${id}: type muss ${YOUTUBE_VISUAL_TYPES.join(', ')} sein.`);
    assert(typeof visual?.chapter === 'string' && visual.chapter.trim(), `${id}: chapter fehlt.`);
    assert(typeof visual?.scriptBeat === 'string' && visual.scriptBeat.trim(), `${id}: scriptBeat fehlt.`);

    if (requiresYouTubeImage(visual)) {
      assert(typeof visual.googleFlowFileName === 'string' && visual.googleFlowFileName.trim(), `${id}: googleFlowFileName fehlt.`);
      assert(!imageFileNames.has(visual.googleFlowFileName), `${id}: googleFlowFileName ist doppelt.`);
      imageFileNames.add(visual.googleFlowFileName);
      const imagePlan = visual.type === 'hybrid' ? visual.imagePlanFile : visual.planFile;
      assert(typeof imagePlan === 'string' && imagePlan.endsWith('/bildprompt.txt') && existsSync(resolve(root, imagePlan)), `${id}: bildprompt.txt fehlt.`);
      assert(typeof imagePlan !== 'string' || imagePlan.startsWith(`${PROMPT_DIRECTORY}/`), `${id}: Bildprompt muss unter ${PROMPT_DIRECTORY}/ liegen.`);
      if (typeof imagePlan === 'string' && existsSync(resolve(root, imagePlan))) {
        const prompt = readFileSync(resolve(root, imagePlan), 'utf8');
        for (const marker of ['VISUAL_FORM:', 'VISUAL_CONCEPT:', 'DECISIVE_MOMENT:', 'VOICEOVER_VISUAL_MATCH:', 'FRONT_READABILITY_TEST:', 'DATA_INTEGRITY_TEST:']) {
          assert(prompt.includes(marker), `${id}: YouTube-V4 Bildmarker fehlt: ${marker}`);
        }
      }
    }

    if (requiresYouTubeMotion(visual)) {
      errors.push(...validateYouTubeMotionMetadata(visual));
      assert(typeof visual.planFile === 'string' && visual.planFile.endsWith('/remotion.md') && existsSync(resolve(root, visual.planFile)), `${id}: remotion.md fehlt.`);
      assert(typeof visual.animationSourceFile === 'string' && existsSync(resolve(root, visual.animationSourceFile ?? '')), `${id}: animation.tsx fehlt.`);
    }

    if (visual?.type === 'data') {
      assert(typeof visual.dataNotesFile === 'string' && existsSync(resolve(root, visual.dataNotesFile ?? '')), `${id}: data-notes.md fehlt.`);
    }
  }
  const motionCount = (index.visuals ?? []).filter(requiresYouTubeMotion).length;
  assert(motionCount >= YOUTUBE_MIN_MOTION_VISUALS, `YouTube Longform braucht mindestens ${YOUTUBE_MIN_MOTION_VISUALS} echte Motion-Visuals; gefunden: ${motionCount}.`);
  errors.push(...validateYouTubeMotionVariety(index.visuals ?? []));

  // Statusdateien dürfen dem Visualplan nicht widersprechen — sonst erzeugt Phase 2 falsche Bilder.
  if (existsSync(resolve(root, PHASE_STATUS))) {
    const flowImageCount = (index.visuals ?? []).filter(requiresYouTubeImage).length;
    const NUMBER_WORDS = {ein: 1, eins: 1, zwei: 2, drei: 3, vier: 4, 'fünf': 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, 'zwölf': 12};
    for (const match of read(PHASE_STATUS).matchAll(/(\d+|[a-zäöü]+)\s+(?:finale\s+)?(?:Flow-Szenenbilder|Flow-Bilder|Flow-Bild|Szenenbilder)\b/gi)) {
      const stated = /^\d+$/.test(match[1]) ? Number(match[1]) : NUMBER_WORDS[match[1].toLowerCase()];
      if (stated === undefined) continue;
      assert(stated === flowImageCount, `${PHASE_STATUS} nennt „${match[0]}“, ${VISUAL_INDEX} plant aber ${flowImageCount} Flow-Szenenbild(er).`);
    }
  }
}

if (existsSync(resolve(root, ALL_PROMPTS))) {
  const prompts = read(ALL_PROMPTS);
  assert(prompts.includes(WORLD_ID_MARKER), `${ALL_PROMPTS} verwendet nicht die FinanzNeo World ID.`);
  assert(prompts.includes(SERIES_LOCK_MARKER), `${ALL_PROMPTS} enthält keinen Same-World-Lock.`);
  assert(prompts.includes(GENERATED_IMAGE_ASPECT_MARKER), `${ALL_PROMPTS} schreibt 16:9 nicht vor.`);
  assert(prompts.includes(FLOW_AGENT_PROTOCOL_MARKER), `${ALL_PROMPTS} enthält kein Flow-Protokoll.`);
  assert(prompts.includes(`FLOW_EXECUTION_MODE: ${YOUTUBE_FLOW_EXECUTION_MODE_ID}`), 'Aktueller YouTube-Flow-Modus fehlt.');
  assert(prompts.includes(`THUMBNAIL_CONCURRENCY: ${YOUTUBE_THUMBNAIL_CONCURRENCY}`), '3 parallele Thumbnail-Jobs fehlen.');
  assert(prompts.includes(`IMAGE_BATCH_SIZE: ${YOUTUBE_IMAGE_BATCH_SIZE}`) && prompts.includes(`IMAGE_CONCURRENCY: ${YOUTUBE_IMAGE_CONCURRENCY}`), 'Paralleler 5er-Bildbatch fehlt.');
  assert(prompts.includes('SEPARATE one-image jobs'), '5er-Batch muss aus getrennten Ein-Bild-Jobs bestehen.');
  assert(prompts.includes('rename immediately'), 'Sofortige Umbenennung bei Rückgabe fehlt.');
  assert(prompts.includes('regenerate only that same number'), 'Wiederholungsregel für fehlerhafte Bilder fehlt.');
  assert(prompts.includes(IMAGE_INBOX), 'Gemeinsamer Bilderordner fehlt in der Flow-Übergabe.');
  assert(prompts.includes('horizontal 16:9'), 'Horizontales 16:9-Quellbild fehlt in der Flow-Übergabe.');
  assert(prompts.includes(`STYLE_AUTHORITY: ${YOUTUBE_IMAGE_WORLD_LOCK}`), 'Geschriebene V9-Bildwelt fehlt als Style-Autorität.');
  assert(prompts.includes('APPROVED_STYLE_REFERENCES:'), 'Freigegebene Stilreferenzen (Kurse schwanken + Notgroschen) fehlen im Flow-Master.');
  assert(/LOOK FEST — INHALT FREI/.test(prompts), 'Flow-Master muss die Bildwelt als „Look fest — Inhalt frei“ festlegen.');
  assert(/ENTSCHEIDENDER MOMENT/.test(prompts), 'Flow-Master muss regeln, wann ein entscheidender Moment ins Bild gehört.');
  assert(/animated[- ]feature[- ]film/i.test(prompts), 'Flow-Master muss den Animationsfilm-Look verlangen.');
  // Diese Vorgaben haben am 2026-10-03/04 genau den gewünschten Look verboten.
  assert(!/LEGACY_PROMPT_DNA|premium-physical-editorial-v8|stylized-3d-editorial-v5/.test(prompts), 'Flow-Master darf die alte grün-goldene Chunky-CGI-DNA nicht mehr als Stilquelle nennen.');
  assert(!/NOT Pixar|Pixar\/clay|toy\/clay\/Pixar|clay\/toy\/Pixar/i.test(prompts), 'Flow-Master darf den Animationsfilm-Look nicht verbieten.');
  assert(!/realistisches (langweiliges )?Büro-\/Papier-Stillleben/i.test(prompts), 'Flow-Master darf echte Alltagsgegenstände wie Rechnungen nicht pauschal verbieten.');
  assert(!/SIMPLE EXPLAINER/i.test(prompts), 'Flow-Master darf keinen Simple-Explainer-Infografikmodus mehr enthalten.');
  assert(/PRECISION_GRAPHICS_OWNER:\s*REMOTION/i.test(prompts), 'Präzisionsgrafiken müssen explizit Remotion gehören.');
  assert(/DIESEN TEXT 1:1 AUSFÜHREN|DIESER TEXT IST ZUR DIREKTEN AUSFÜHRUNG/.test(prompts), 'Flow-Master muss die direkte Bildausführung ausdrücklich anweisen.');
  assert(!/NICHT MEHR HIER ARBEITEN/i.test(prompts), `${ALL_PROMPTS} darf kein Redirect-/Stub-Hinweis sein.`);
  assert(!/vollständigen.{0,80}(liegen|findest du|stehen).{0,80}(ander|zentral)/is.test(prompts), `${ALL_PROMPTS} darf nicht auf einen anderen Master-Prompt verweisen.`);
  assert(!/square 1:1 source image|portrait 9:16|vertical 9:16 image/i.test(prompts), 'YouTube-Prompts enthalten ein falsches Quellbildformat.');
}

if (existsSync(resolve(root, WORD_TIMINGS))) {
  try {
    const timing = JSON.parse(read(WORD_TIMINGS));
    assert(timing.subtitleMode === SUBTITLE_MODE, `${WORD_TIMINGS}: subtitleMode ist falsch.`);
    assert(timing.activeWordColor === ACTIVE_WORD_COLOR, `${WORD_TIMINGS}: activeWordColor ist falsch.`);
    assert(Array.isArray(timing.words) && Array.isArray(timing.sentences), `${WORD_TIMINGS} benötigt words[] und sentences[].`);
  } catch (error) {
    errors.push(`${WORD_TIMINGS} ist kein gültiges JSON: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error('\nYouTube-Longform-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('\n✓ YouTube-Longform-Vertrag erfüllt.');
console.log(`  16:9 · ${YOUTUBE_IMAGE_WORLD_LOCK} · Animationsfilm-Look, Inhalt frei · Precision = Remotion · min. ${YOUTUBE_MIN_MOTION_VISUALS} Motion · keine Shorts/Reels`);
