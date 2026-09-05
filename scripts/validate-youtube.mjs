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
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  SOCIAL_PROMO_FILES,
  SUBTITLE_MODE,
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

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (relativePath) => readFileSync(resolve(root, relativePath), 'utf8');
const requiredDirectories = ['01-recherche', '02-script', '03-audio', '04-visuals', '05-publishing', '06-projektdateien', IMAGE_INBOX];
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
assert(existsSync(resolve(root, '04-visuals/bildwelt.txt')), '04-visuals/bildwelt.txt fehlt.');
assert(existsSync(resolve(root, '04-visuals/thumbnail-prompt.txt')), '04-visuals/thumbnail-prompt.txt fehlt.');
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
  assert(index.imageWorld?.literalFirst === true && index.imageWorld?.metaphorOptional === true, 'YouTube-Bilder müssen Literal-first V3 verwenden.');
  assert(index.imageWorld?.styleReferenceStrategy === 'approved-thumbnail-style-only', 'Das freigegebene Thumbnail muss reine Stilreferenz sein.');
  assert(index.imageWorld?.referencePromptFile === '04-visuals/bildwelt.txt', 'referencePromptFile ist falsch.');
  assert(index.motionStandard?.id === YOUTUBE_MOTION_STANDARD_ID, `motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein.`);
  assert(index.motionStandard?.contentFirstTechniqueSelection === true, 'Motion-Technik muss aus dem Inhalt gewählt werden.');
  assert(index.motionStandard?.existingComponentsOptional === true && index.motionStandard?.physicalPrimitivesOptional === true, 'Bestehende/Physical-Primitives müssen optional bleiben.');
  assert(index.googleFlow?.protocolId === FLOW_AGENT_PROTOCOL_ID, 'Google-Flow-Agent-Protokoll fehlt.');
  assert(index.googleFlow?.generationMode === 'one-image-at-a-time' && index.googleFlow?.strictSequential === true, 'Google Flow muss strikt Bild für Bild arbeiten.');
  assert(index.googleFlow?.waitForCurrentImage === true && index.googleFlow?.renameBeforeNext === true && index.googleFlow?.qaBeforeNext === true, 'Google Flow muss warten, umbenennen und prüfen, bevor es fortfährt.');
  assert(index.googleFlow?.retrySameImageOnFailure === true, 'Fehlerhafte Bilder müssen unter derselben Nummer neu erzeugt werden.');
  assert(index.googleFlow?.finalCollectionDirectory === `${IMAGE_INBOX}/`, 'Finaler gemeinsamer Bilderordner ist falsch.');
  assert(index.googleFlow?.distributeToVisualFolders === false, 'Google Flow darf Bilder nicht auf Visual-Ordner verteilen.');
  assert(index.timelineRules?.cutsFollowVoiceAndChapters === true && index.timelineRules?.beatFirst === true, 'Schnitte müssen Voiceover/Beats/Kapiteln folgen.');
  assert(index.timelineRules?.equalLengthVisualsForbiddenByDefault === true, 'Starre gleich lange Visuals müssen standardmäßig verboten sein.');
  assert(Number(index.audio?.targetIntegratedLufs) === -16 && Number(index.audio?.targetTruePeakDbtp) === -1, 'Audioziel muss ungefähr -16 LUFS und höchstens -1 dBTP sein.');
  assert(index.thumbnail?.type === 'image' && typeof index.thumbnail?.googleFlowFileName === 'string', 'Thumbnail-Vertrag fehlt.');
  assert(index.thumbnail?.planFile === '04-visuals/thumbnail-prompt.txt', 'Thumbnail-Promptpfad ist falsch.');
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
      if (typeof imagePlan === 'string' && existsSync(resolve(root, imagePlan))) {
        const prompt = readFileSync(resolve(root, imagePlan), 'utf8');
        for (const marker of ['LITERAL_REAL_WORLD_SITUATION:', 'REAL_WORLD_CONTEXT_ANCHOR:', 'VOICEOVER_VISUAL_MATCH:', 'TRANSFERABILITY_TEST:', 'VISUAL_STRATEGY:', 'METAPHOR_JUSTIFICATION:']) {
          assert(prompt.includes(marker), `${id}: Literal-first Marker fehlt: ${marker}`);
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
  errors.push(...validateYouTubeMotionVariety(index.visuals ?? []));
}

if (existsSync(resolve(root, ALL_PROMPTS))) {
  const prompts = read(ALL_PROMPTS);
  assert(prompts.includes(WORLD_ID_MARKER), `${ALL_PROMPTS} verwendet nicht die FinanzNeo World ID.`);
  assert(prompts.includes(SERIES_LOCK_MARKER), `${ALL_PROMPTS} enthält keinen Same-World-Lock.`);
  assert(prompts.includes(GENERATED_IMAGE_ASPECT_MARKER), `${ALL_PROMPTS} schreibt 16:9 nicht vor.`);
  assert(prompts.includes(FLOW_AGENT_PROTOCOL_MARKER), `${ALL_PROMPTS} enthält kein Flow-Protokoll.`);
  assert(prompts.includes('Generate exactly ONE image'), 'Google Flow muss exakt ein Bild pro Schritt erzeugen.');
  assert(prompts.includes('Rename it immediately'), 'Sofortige Umbenennung vor dem nächsten Bild fehlt.');
  assert(prompts.includes('regenerate the same image number'), 'Wiederholungsregel für fehlerhafte Bilder fehlt.');
  assert(prompts.includes(IMAGE_INBOX), 'Gemeinsamer Bilderordner fehlt in der Flow-Übergabe.');
  assert(prompts.includes('horizontal 16:9'), 'Horizontales 16:9-Quellbild fehlt in der Flow-Übergabe.');
  assert(prompts.includes('Literal first, creative second'), 'Literal-first Bildlogik fehlt in der Flow-Übergabe.');
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
console.log('  16:9 · Beat-first · Literal-first V3 · Motion V2 · sequenzieller Flow · keine Shorts');
