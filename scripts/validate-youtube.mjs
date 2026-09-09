#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {relative, resolve, sep} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ALL_PROMPTS,
  AUDIO_DIR,
  CAPTION_DIR,
  CAPTION_LAYER_ID,
  EXPORT_DIR,
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  FORBIDDEN_YOUTUBE_ARTIFACTS,
  GENERATED_IMAGE_ASPECT_MARKER,
  GENERATED_IMAGE_ASPECT_RATIO,
  IMAGE_INBOX,
  PROJECT_DIR,
  PRODUCTION_MANIFEST,
  SCENES_DIR,
  SCRIPT_DIR,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  SOCIAL_PROMO_FILES,
  SUBTITLE_MODE,
  TIMELINE,
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
import {requiresYouTubeImage, requiresYouTubeMotion, validateYouTubeMotionMetadata, validateYouTubeMotionVariety} from './lib/youtube-motion-contract.mjs';

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
const requiredDirectories = [SCRIPT_DIR, AUDIO_DIR, SCENES_DIR, CAPTION_DIR, PROJECT_DIR, EXPORT_DIR, IMAGE_INBOX];
for (const directory of requiredDirectories) assert(existsSync(resolve(root, directory)) && statSync(resolve(root, directory)).isDirectory(), `${directory}/ fehlt.`);

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
if (!existsSync(resolve(root, VISUAL_INDEX))) errors.push(`${VISUAL_INDEX} fehlt.`);
else {
  try { index = JSON.parse(read(VISUAL_INDEX)); }
  catch (error) { errors.push(`${VISUAL_INDEX} ist kein gültiges JSON: ${error.message}`); }
}

for (const path of [ALL_PROMPTS, `${SCENES_DIR}/bildwelt.txt`, `${SCENES_DIR}/thumbnail-prompt.txt`, WORD_TIMINGS, TIMELINE, PRODUCTION_MANIFEST]) {
  assert(existsSync(resolve(root, path)), `${path} fehlt.`);
}

const scriptWords = existsSync(resolve(root, `${SCRIPT_DIR}/script-fliess-text.txt`))
  ? read(`${SCRIPT_DIR}/script-fliess-text.txt`).trim().split(/\s+/).filter(Boolean)
  : [];

if (index) {
  assert(index.format === 'youtube-longform', 'format muss youtube-longform sein.');
  assert(index.shortsForbidden === true, 'YouTube Shorts müssen ausdrücklich verboten sein.');
  assert(index.fixedVisualCount === false && index.fixedImageAnimationRatio === false, 'Longform darf keine feste Visualzahl oder Bild-/Animationsquote erzwingen.');
  assert(index.video?.aspectRatio === YOUTUBE_VIDEO_ASPECT_RATIO, 'YouTube-Videoformat muss 16:9 sein.');
  assert(Number(index.video?.width) === YOUTUBE_VIDEO_WIDTH && Number(index.video?.height) === YOUTUBE_VIDEO_HEIGHT, 'YouTube-Video muss 1920 × 1080 verwenden.');
  assert(Number(index.video?.fps) === YOUTUBE_VIDEO_FPS, 'YouTube-Video muss 30 fps verwenden.');
  assert(Number(index.targetDurationSeconds?.min) >= 360 && Number(index.targetDurationSeconds?.max) <= 720, 'Plausibles Longform-Zeitfenster fehlt.');
  assert(index.userCreatesImages === true && index.antigravityGeneratesImages === false, 'Bilder müssen ausschließlich vom Nutzer/Flow kommen.');

  assert(index.imageWorld?.id === WORLD_ID, 'FinanzNeo Image World ID fehlt.');
  assert(index.imageWorld?.seriesLockId === SERIES_LOCK_ID, 'FinanzNeo Same-World-Lock fehlt.');
  assert(index.imageWorld?.generatedImageAspectRatio === GENERATED_IMAGE_ASPECT_RATIO, 'YouTube-Quellbilder müssen 16:9 sein.');
  assert(index.imageWorld?.literalFirst === true && index.imageWorld?.metaphorOptional === true, 'YouTube-Bilder müssen Literal-first V3 verwenden.');
  assert(index.imageWorld?.referencePromptFile === `${SCENES_DIR}/bildwelt.txt`, 'referencePromptFile ist falsch.');

  assert(index.motionStandard?.id === YOUTUBE_MOTION_STANDARD_ID, `motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein.`);
  assert(index.motionStandard?.contentFirstTechniqueSelection === true, 'Motion-Technik muss aus dem Inhalt gewählt werden.');
  assert(index.motionStandard?.existingComponentsOptional === true && index.motionStandard?.physicalPrimitivesOptional === true, 'Bestehende/Physical-Primitives müssen optional bleiben.');
  assert(index.motionStandard?.renderedFrameQaRequired === true, 'Motion V3 muss gerenderte Frame-QA verlangen.');
  assert(index.motionStandard?.productionDirectionsForbiddenInViewerText === true, 'Regieanweisungen müssen im Viewer-Layer verboten sein.');

  assert(index.captions?.required === true, 'Untertitel müssen verpflichtend sein.');
  assert(index.captions?.layerId === CAPTION_LAYER_ID, `Caption-Layer muss ${CAPTION_LAYER_ID} sein.`);
  assert(index.captions?.timingSource === WORD_TIMINGS, 'Caption timingSource ist falsch.');
  assert(index.captions?.subtitleMode === SUBTITLE_MODE && index.captions?.activeWordColor === ACTIVE_WORD_COLOR, 'Caption-Modus/Farbe ist falsch.');

  assert(index.googleFlow?.protocolId === FLOW_AGENT_PROTOCOL_ID, 'Google-Flow-Agent-Protokoll fehlt.');
  assert(index.googleFlow?.generationMode === 'one-image-at-a-time' && index.googleFlow?.strictSequential === true, 'Google Flow muss strikt Bild für Bild arbeiten.');
  assert(index.googleFlow?.finalCollectionDirectory === `${IMAGE_INBOX}/`, 'Finaler Bilderordner ist falsch.');

  assert(index.timelineRules?.beatFirst === true && index.timelineRules?.wordTimestampDriven === true, 'Timeline muss Beat-first und Wort-Timestamp-getrieben sein.');
  assert(index.timelineRules?.staticImageMaxSeconds === 7, 'Statische Bilder dürfen maximal 7 Sekunden am Stück laufen.');
  assert(index.timelineRules?.maxStaticRunFinalSeconds === 8, 'Finales Staticness-Limit muss 8 Sekunden sein.');

  assert(index.thumbnail?.type === 'image' && typeof index.thumbnail?.googleFlowFileName === 'string', 'Thumbnail-Vertrag fehlt.');
  assert(index.thumbnail?.planFile === `${SCENES_DIR}/thumbnail-prompt.txt`, 'Thumbnail-Promptpfad ist falsch.');
  assert(Array.isArray(index.visuals) && index.visuals.length > 0, `${VISUAL_INDEX} benötigt visuals[].`);

  for (const [key, expectedPath] of Object.entries(YOUTUBE_PUBLISHING_FILES)) {
    assert(index.publishing?.youtube?.[key] === expectedPath, `publishing.youtube.${key} muss auf ${expectedPath} zeigen.`);
    assert(existsSync(resolve(root, expectedPath)), `Publishing-Datei fehlt: ${expectedPath}`);
  }
  for (const [key, expectedPath] of Object.entries(SOCIAL_PROMO_FILES)) {
    assert(index.publishing?.socialPromo?.[key] === expectedPath, `publishing.socialPromo.${key} muss auf ${expectedPath} zeigen.`);
    assert(existsSync(resolve(root, expectedPath)), `Social-Promo-Datei fehlt: ${expectedPath}`);
  }

  const imageFileNames = new Set();
  let expectedWordStart = 0;
  for (const [position, visual] of (index.visuals ?? []).entries()) {
    const expectedId = `szene-${String(position + 1).padStart(2, '0')}`;
    const id = typeof visual?.id === 'string' ? visual.id : 'Unbekannte Szene';
    assert(id === expectedId, `${id}: ID und Reihenfolge müssen lückenlos ${expectedId} entsprechen.`);
    assert(YOUTUBE_VISUAL_TYPES.includes(visual?.type), `${id}: type muss ${YOUTUBE_VISUAL_TYPES.join(', ')} sein.`);
    assert(typeof visual?.chapter === 'string' && visual.chapter.trim(), `${id}: chapter fehlt.`);
    assert(typeof visual?.scriptBeat === 'string' && visual.scriptBeat.trim(), `${id}: scriptBeat fehlt.`);

    const wordStart = Number(visual?.wordStartIndex);
    const wordEnd = Number(visual?.wordEndIndex);
    assert(Number.isInteger(wordStart) && Number.isInteger(wordEnd) && wordStart >= 0 && wordEnd >= wordStart, `${id}: gültiger Wortbereich fehlt.`);
    if (Number.isInteger(wordStart)) assert(wordStart === expectedWordStart, `${id}: wordStartIndex muss ${expectedWordStart} sein.`);
    if (Number.isInteger(wordEnd)) expectedWordStart = wordEnd + 1;

    const sceneDir = `${SCENES_DIR}/${id}`;
    assert(existsSync(resolve(root, sceneDir)), `${sceneDir}/ fehlt.`);

    if (requiresYouTubeImage(visual)) {
      assert(typeof visual.googleFlowFileName === 'string' && visual.googleFlowFileName.trim(), `${id}: googleFlowFileName fehlt.`);
      assert(!imageFileNames.has(visual.googleFlowFileName), `${id}: googleFlowFileName ist doppelt.`);
      imageFileNames.add(visual.googleFlowFileName);
      const imagePlan = visual.type === 'hybrid' ? visual.imagePlanFile : visual.planFile;
      assert(imagePlan === `${sceneDir}/bildprompt.txt` && existsSync(resolve(root, imagePlan)), `${id}: bildprompt.txt fehlt oder Pfad ist falsch.`);
      if (existsSync(resolve(root, imagePlan))) {
        const prompt = read(imagePlan);
        for (const marker of ['LITERAL_REAL_WORLD_SITUATION:', 'REAL_WORLD_CONTEXT_ANCHOR:', 'VOICEOVER_VISUAL_MATCH:', 'TRANSFERABILITY_TEST:', 'VISUAL_STRATEGY:', 'METAPHOR_JUSTIFICATION:']) assert(prompt.includes(marker), `${id}: Literal-first Marker fehlt: ${marker}`);
      }
    }

    if (requiresYouTubeMotion(visual)) {
      errors.push(...validateYouTubeMotionMetadata(visual));
      assert(visual.planFile === `${sceneDir}/remotion.md` && existsSync(resolve(root, visual.planFile)), `${id}: remotion.md fehlt oder Pfad ist falsch.`);
      assert(visual.animationSourceFile === `${sceneDir}/animation.tsx` && existsSync(resolve(root, visual.animationSourceFile)), `${id}: animation.tsx fehlt oder Pfad ist falsch.`);
    }
    if (visual?.type === 'data') assert(visual.dataNotesFile === `${sceneDir}/data-notes.md` && existsSync(resolve(root, visual.dataNotesFile)), `${id}: data-notes.md fehlt.`);
  }
  if (scriptWords.length) assert(expectedWordStart === scriptWords.length, `Szenen-Wortbereiche decken ${expectedWordStart} Wörter ab, Skript enthält aber ${scriptWords.length}.`);
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
  assert(prompts.includes('Literal first, creative second'), 'Literal-first Bildlogik fehlt.');
}

if (existsSync(resolve(root, WORD_TIMINGS))) {
  try {
    const timing = JSON.parse(read(WORD_TIMINGS));
    assert(timing.subtitleMode === SUBTITLE_MODE, `${WORD_TIMINGS}: subtitleMode ist falsch.`);
    assert(timing.activeWordColor === ACTIVE_WORD_COLOR, `${WORD_TIMINGS}: activeWordColor ist falsch.`);
    assert(Array.isArray(timing.words) && Array.isArray(timing.sentences), `${WORD_TIMINGS} benötigt words[] und sentences[].`);
  } catch (error) { errors.push(`${WORD_TIMINGS} ist kein gültiges JSON: ${error.message}`); }
}

if (errors.length > 0) {
  console.error('\nYouTube-Longform-V3-Vertrag verletzt:\n');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('\n✓ YouTube-Longform-V3-Vertrag erfüllt.');
console.log('  Reel-artige Struktur · 16:9 · Literal-first V3 · Motion V3 · Caption-Pflicht · Wortbereich-Timeline · keine Shorts');
