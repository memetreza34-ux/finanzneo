import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {basename, extname, resolve} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ANIMATION_SEAL,
  AUDIO_DIR,
  IMAGE_INBOX,
  MOTION_RENDER_QA,
  PHASE_1_FILES,
  STATIC_IMAGE_MAX_SECONDS,
  SUBTITLE_MODE,
  TIMELINE,
  VISUAL_INDEX,
  WORD_TIMINGS,
  YOUTUBE_MOTION_STANDARD_ID,
} from './youtube-contract.mjs';
import {requiresYouTubeImage, requiresYouTubeMotion, validateYouTubeMotionMetadata, validateYouTubeMotionVariety} from './youtube-motion-contract.mjs';

export const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.aiff', '.aif', '.m4a']);
export const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

const PLACEHOLDER_PATTERN = /\[(?:[^\]]*(?:EINFÜGEN|VOLLSTÄNDIG|KURZER|OPTIONAL|THEMA|NAME|LABEL|METAPHOR|DESCRIBE|PLACE EACH|TITLE|SOURCE|HOOK|VISUAL|CHAPTER|SCRIPT BEAT|CORE|PROMISE|TENSION|MECHANIC|TECHNIQUE|FAMILY|CHANNEL|START|RESULT|ANIMATION INTENT|CONTEXT)[^\]]*)\]/i;
const readText = (path) => readFileSync(path, 'utf8');
const isFile = (path) => existsSync(path) && statSync(path).isFile();
const hasPlaceholder = (content) => PLACEHOLDER_PATTERN.test(content) || /\b(?:TODO|PLACEHOLDER)\b/i.test(content);

const listFiles = (directory, extensions) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((entry) => isFile(resolve(directory, entry)))
    .filter((entry) => extensions.has(extname(entry).toLowerCase()))
    .sort();
};

const readJson = (path, blockers, label) => {
  if (!isFile(path)) {
    blockers.push(`${label} fehlt.`);
    return null;
  }
  try { return JSON.parse(readText(path)); }
  catch (error) {
    blockers.push(`${label} ist kein gültiges JSON: ${error.message}`);
    return null;
  }
};

const checkCompletedText = (root, relativePath, blockers) => {
  const path = resolve(root, relativePath);
  if (!isFile(path)) {
    blockers.push(`${relativePath} fehlt.`);
    return;
  }
  const content = readText(path).trim();
  if (!content) blockers.push(`${relativePath} ist leer.`);
  else if (hasPlaceholder(content)) blockers.push(`${relativePath} enthält noch Platzhalter.`);
};

const flattenTimingWords = (timing) => {
  if (Array.isArray(timing?.words)) return timing.words;
  if (!Array.isArray(timing?.sentences)) return [];
  return timing.sentences.flatMap((sentence) => Array.isArray(sentence?.words) ? sentence.words : []);
};

const isValidTimingWord = (word) => {
  const text = typeof word?.word === 'string' ? word.word.trim() : '';
  const start = Number(word?.start);
  const end = Number(word?.end);
  return Boolean(text) && Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end >= start;
};

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

export const isSixteenNineDimensions = (widthValue, heightValue) => {
  const width = Number(widthValue);
  const height = Number(heightValue);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return false;
  return Math.abs((width / height) - (16 / 9)) <= 0.01;
};

export const validateResolvedTimeline = (timeline, visuals, blockers) => {
  const items = Array.isArray(timeline?.visuals) ? timeline.visuals : [];
  if (items.length !== visuals.length) {
    blockers.push(`${TIMELINE}: Anzahl Visuals (${items.length}) stimmt nicht mit ${VISUAL_INDEX} (${visuals.length}) überein.`);
    return;
  }
  let expectedStart = 0;
  const maxImageFrames = STATIC_IMAGE_MAX_SECONDS * 30;
  for (let i = 0; i < visuals.length; i += 1) {
    const visual = visuals[i];
    const item = items[i];
    const start = Number(item?.startFrame);
    const duration = Number(item?.durationFrames);
    if (item?.id !== visual.id) blockers.push(`${TIMELINE}: Position ${i + 1} muss ${visual.id} sein.`);
    if (!Number.isInteger(start) || start !== expectedStart) blockers.push(`${TIMELINE}: ${visual.id}.startFrame muss ${expectedStart} sein.`);
    if (!Number.isInteger(duration) || duration <= 0) blockers.push(`${TIMELINE}: ${visual.id}.durationFrames muss > 0 sein.`);
    if (Number.isInteger(duration) && duration > 0) {
      if (visual.type === 'image' && duration > maxImageFrames) blockers.push(`${TIMELINE}: ${visual.id} ist als statisches Bild länger als ${STATIC_IMAGE_MAX_SECONDS} Sekunden. Splitte den Beat oder nutze Hybrid-Motion.`);
      if (requiresYouTubeMotion(visual)) {
        const events = Math.max(1, Array.isArray(visual.motionEvents) ? visual.motionEvents.length : 1);
        const quietBudget = Math.ceil(duration / (events + 1));
        if (quietBudget > Number(visual.maxQuietFrames)) {
          blockers.push(`${TIMELINE}: ${visual.id} hat für ${duration} Frames zu wenige Motion-Events; rechnerisch ${quietBudget} Frames Ruhe > maxQuietFrames ${visual.maxQuietFrames}.`);
        }
      }
      expectedStart += duration;
    }
  }
  if (!Number.isInteger(timeline?.durationFrames) || timeline.durationFrames !== expectedStart) {
    blockers.push(`${TIMELINE}: durationFrames muss exakt ${expectedStart} sein.`);
  }
};

export const analyzeYouTubeReadiness = (rootDirectory) => {
  const root = resolve(rootDirectory);
  const phase1Blockers = [];
  const phase2Blockers = [];
  const warnings = [];

  if (!existsSync(root) || !statSync(root).isDirectory()) {
    return {ready: false, phase1Blockers: [`YouTube-Projekt fehlt: ${root}`], phase2Blockers, warnings, expectedImages: [], audioFiles: []};
  }

  for (const relativePath of PHASE_1_FILES) checkCompletedText(root, relativePath, phase1Blockers);

  const index = readJson(resolve(root, VISUAL_INDEX), phase1Blockers, VISUAL_INDEX);
  const visuals = Array.isArray(index?.visuals) ? index.visuals : [];
  if (index && visuals.length === 0) phase1Blockers.push(`${VISUAL_INDEX} enthält keine Visuals.`);
  if (index && (typeof index.title !== 'string' || !index.title.trim() || hasPlaceholder(index.title))) phase1Blockers.push(`${VISUAL_INDEX}: title fehlt oder enthält einen Platzhalter.`);
  if (index?.motionStandard?.id !== YOUTUBE_MOTION_STANDARD_ID) phase1Blockers.push(`${VISUAL_INDEX}: motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein.`);

  const expectedImages = [];
  const thumbnailFileName = index?.thumbnail?.googleFlowFileName;
  if (typeof thumbnailFileName !== 'string' || !thumbnailFileName.trim() || hasPlaceholder(thumbnailFileName)) phase1Blockers.push(`${VISUAL_INDEX}: thumbnail.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
  else expectedImages.push(thumbnailFileName);

  for (const visual of visuals) {
    const id = typeof visual?.id === 'string' ? visual.id : 'Unbekanntes Visual';
    for (const field of ['chapter', 'scriptBeat']) {
      if (typeof visual?.[field] !== 'string' || !visual[field].trim() || hasPlaceholder(visual[field])) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
    }

    if (requiresYouTubeImage(visual)) {
      const fileName = visual.googleFlowFileName;
      if (typeof fileName !== 'string' || !fileName.trim() || hasPlaceholder(fileName)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
      else expectedImages.push(fileName);
      if (typeof visual?.expectedVisual !== 'string' || !visual.expectedVisual.trim() || hasPlaceholder(visual.expectedVisual)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.expectedVisual fehlt.`);
      if (!Array.isArray(visual.objectLabels) || visual.objectLabels.some((label) => typeof label !== 'string' || !label.trim() || hasPlaceholder(label))) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.objectLabels fehlen oder enthalten Platzhalter.`);
      const imagePlanFile = visual.type === 'hybrid' ? visual.imagePlanFile : visual.planFile;
      if (typeof imagePlanFile !== 'string' || !imagePlanFile.trim()) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.image plan file fehlt.`);
      else checkCompletedText(root, imagePlanFile, phase1Blockers);
    }

    if (requiresYouTubeMotion(visual)) {
      for (const error of validateYouTubeMotionMetadata(visual)) phase1Blockers.push(`${VISUAL_INDEX}: ${error}`);
      checkCompletedText(root, visual.animationSourceFile ?? '', phase1Blockers);
      checkCompletedText(root, visual.planFile ?? '', phase1Blockers);
    }
    if (visual?.type === 'data') checkCompletedText(root, visual.dataNotesFile ?? '', phase1Blockers);
  }
  for (const error of validateYouTubeMotionVariety(visuals)) phase1Blockers.push(`${VISUAL_INDEX}: ${error}`);

  const motionVisuals = visuals.filter(requiresYouTubeMotion);
  if (motionVisuals.length > 0) {
    const seal = readJson(resolve(root, ANIMATION_SEAL), phase1Blockers, ANIMATION_SEAL);
    if (seal) {
      if (seal.motionStandardId !== YOUTUBE_MOTION_STANDARD_ID) phase1Blockers.push(`${ANIMATION_SEAL}: motionStandardId ist falsch.`);
      const qaPath = resolve(root, MOTION_RENDER_QA);
      if (!isFile(qaPath)) phase1Blockers.push(`${MOTION_RENDER_QA} fehlt; Motion Render-QA erneut ausführen.`);
      else if (!seal.motionRenderQaSha256 || seal.motionRenderQaSha256 !== sha256(qaPath)) phase1Blockers.push(`${ANIMATION_SEAL}: Motion-Render-QA-Hash stimmt nicht mehr.`);
      const entries = Array.isArray(seal.entries) ? seal.entries : [];
      for (const visual of motionVisuals) {
        const entry = entries.find((candidate) => candidate.id === visual.id);
        if (!entry) {
          phase1Blockers.push(`${ANIMATION_SEAL}: Eintrag für ${visual.id} fehlt.`);
          continue;
        }
        const sourcePath = resolve(root, visual.animationSourceFile ?? '');
        if (isFile(sourcePath) && entry.sha256 !== sha256(sourcePath)) phase1Blockers.push(`${ANIMATION_SEAL}: Hash für ${visual.id} stimmt nicht mehr.`);
        if (entry.exportName !== visual.animationExport || entry.visualTechniqueId !== visual.visualTechniqueId || entry.compositionFamilyId !== visual.compositionFamilyId || entry.mechanicId !== visual.mechanicId) phase1Blockers.push(`${ANIMATION_SEAL}: Metadaten für ${visual.id} stimmen nicht mehr.`);
      }
      if (entries.length !== motionVisuals.length) phase1Blockers.push(`${ANIMATION_SEAL}: Anzahl versiegelter Animationen stimmt nicht.`);
    }
  }

  const inbox = resolve(root, IMAGE_INBOX);
  const actualImages = listFiles(inbox, IMAGE_EXTENSIONS);
  const expectedSet = new Set(expectedImages);
  for (const fileName of expectedImages) {
    if (!actualImages.includes(fileName)) phase2Blockers.push(`Nutzerbild fehlt: ${IMAGE_INBOX}/${fileName}`);
    else if (statSync(resolve(inbox, fileName)).size === 0) phase2Blockers.push(`Nutzerbild ist leer: ${IMAGE_INBOX}/${fileName}`);
  }
  for (const fileName of actualImages) if (!expectedSet.has(fileName)) phase2Blockers.push(`Unerwartetes Nutzerbild: ${IMAGE_INBOX}/${fileName}`);

  const audioFiles = listFiles(resolve(root, AUDIO_DIR), AUDIO_EXTENSIONS);
  if (audioFiles.length === 0) phase2Blockers.push(`Finales Voiceover fehlt in ${AUDIO_DIR}/.`);
  if (audioFiles.length > 1) phase2Blockers.push(`${AUDIO_DIR}/ enthält mehrere Audiodateien: ${audioFiles.join(', ')}`);
  if (audioFiles.length === 1 && statSync(resolve(root, AUDIO_DIR, audioFiles[0])).size === 0) phase2Blockers.push(`Finales Voiceover ist leer: ${AUDIO_DIR}/${audioFiles[0]}`);

  const timing = readJson(resolve(root, WORD_TIMINGS), phase2Blockers, WORD_TIMINGS);
  if (timing) {
    const words = flattenTimingWords(timing);
    if (timing.subtitleMode !== SUBTITLE_MODE) phase2Blockers.push(`${WORD_TIMINGS}: subtitleMode muss ${SUBTITLE_MODE} sein.`);
    if (timing.activeWordColor !== ACTIVE_WORD_COLOR) phase2Blockers.push(`${WORD_TIMINGS}: activeWordColor muss ${ACTIVE_WORD_COLOR} sein.`);
    if (words.length < 50) phase2Blockers.push(`${WORD_TIMINGS} enthält keine vollständigen echten Wort-Zeitstempel.`);
    else if (words.some((word) => !isValidTimingWord(word))) phase2Blockers.push(`${WORD_TIMINGS} enthält ungültige Wort-Zeitstempel.`);
    if (!Array.isArray(timing.sentences) || timing.sentences.length < 5) phase2Blockers.push(`${WORD_TIMINGS} enthält keine vollständigen satzbasierten Caption-Gruppen.`);
    if (audioFiles.length === 1) {
      const sourceName = typeof timing.source === 'string' ? basename(timing.source) : '';
      if (!sourceName || sourceName !== audioFiles[0]) phase2Blockers.push(`${WORD_TIMINGS} muss aus ${AUDIO_DIR}/${audioFiles[0]} erzeugt sein.`);
    }
  }

  const timeline = readJson(resolve(root, TIMELINE), phase2Blockers, TIMELINE);
  if (timeline) validateResolvedTimeline(timeline, visuals, phase2Blockers);

  if (actualImages.length === expectedImages.length && expectedImages.length > 0) warnings.push('Alle erwarteten 16:9-Nutzerbilder sind vorhanden.');

  return {
    ready: phase1Blockers.length === 0 && phase2Blockers.length === 0,
    phase1Blockers,
    phase2Blockers,
    warnings,
    expectedImages,
    audioFiles,
  };
};
