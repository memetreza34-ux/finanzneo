import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {basename, extname, resolve} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ANIMATION_SEAL,
  IMAGE_INBOX,
  PHASE_1_FILES,
  SUBTITLE_MODE,
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
  if (index && (typeof index.title !== 'string' || !index.title.trim() || hasPlaceholder(index.title))) {
    phase1Blockers.push(`${VISUAL_INDEX}: title fehlt oder enthält einen Platzhalter.`);
  }
  if (index?.motionStandard?.id !== YOUTUBE_MOTION_STANDARD_ID) {
    phase1Blockers.push(`${VISUAL_INDEX}: motionStandard.id muss ${YOUTUBE_MOTION_STANDARD_ID} sein.`);
  }

  const expectedImages = [];
  const thumbnailFileName = index?.thumbnail?.googleFlowFileName;
  if (typeof thumbnailFileName !== 'string' || !thumbnailFileName.trim() || hasPlaceholder(thumbnailFileName)) {
    phase1Blockers.push(`${VISUAL_INDEX}: thumbnail.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
  } else {
    expectedImages.push(thumbnailFileName);
  }

  for (const visual of visuals) {
    const id = typeof visual?.id === 'string' ? visual.id : 'Unbekanntes Visual';
    for (const field of ['chapter', 'scriptBeat']) {
      if (typeof visual?.[field] !== 'string' || !visual[field].trim() || hasPlaceholder(visual[field])) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
      }
    }

    if (requiresYouTubeImage(visual)) {
      const fileName = visual.googleFlowFileName;
      if (typeof fileName !== 'string' || !fileName.trim() || hasPlaceholder(fileName)) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
      } else expectedImages.push(fileName);

      for (const field of ['expectedVisual']) {
        if (typeof visual?.[field] !== 'string' || !visual[field].trim() || hasPlaceholder(visual[field])) {
          phase1Blockers.push(`${VISUAL_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
        }
      }
      if (!Array.isArray(visual.objectLabels) || visual.objectLabels.some((label) => typeof label !== 'string' || !label.trim() || hasPlaceholder(label))) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.objectLabels fehlen oder enthalten Platzhalter.`);
      }
      const imagePlanFile = visual.type === 'hybrid' ? visual.imagePlanFile : visual.planFile;
      if (typeof imagePlanFile !== 'string' || !imagePlanFile.trim()) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.image plan file fehlt.`);
      else checkCompletedText(root, imagePlanFile, phase1Blockers);
    }

    if (requiresYouTubeMotion(visual)) {
      for (const error of validateYouTubeMotionMetadata(visual)) phase1Blockers.push(`${VISUAL_INDEX}: ${error}`);
      const sourceFile = visual.animationSourceFile;
      if (typeof sourceFile !== 'string' || !sourceFile.trim()) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.animationSourceFile fehlt.`);
      else checkCompletedText(root, sourceFile, phase1Blockers);
      if (typeof visual.planFile !== 'string' || !visual.planFile.trim()) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.planFile fehlt.`);
      else checkCompletedText(root, visual.planFile, phase1Blockers);
      for (const field of ['animationIntent', 'mechanicId', 'visualTechniqueId', 'compositionFamilyId', 'animationExport']) {
        if (typeof visual?.[field] !== 'string' || !visual[field].trim() || hasPlaceholder(visual[field])) {
          phase1Blockers.push(`${VISUAL_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
        }
      }
      if (!Array.isArray(visual.motionChannels) || visual.motionChannels.length < 2 || visual.motionChannels.some(hasPlaceholder)) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.motionChannels benötigt mindestens zwei finale Kanäle.`);
      }
      if (!Array.isArray(visual.visualBeats) || visual.visualBeats.length < 2 || visual.visualBeats.some(hasPlaceholder)) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.visualBeats benötigt mindestens zwei finale Zustände.`);
      }
    }

    if (visual?.type === 'data') {
      if (typeof visual.dataNotesFile !== 'string' || !visual.dataNotesFile.trim()) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.dataNotesFile fehlt.`);
      else checkCompletedText(root, visual.dataNotesFile, phase1Blockers);
    }
  }
  for (const error of validateYouTubeMotionVariety(visuals)) phase1Blockers.push(`${VISUAL_INDEX}: ${error}`);

  const motionVisuals = visuals.filter(requiresYouTubeMotion);
  if (motionVisuals.length > 0) {
    const seal = readJson(resolve(root, ANIMATION_SEAL), phase1Blockers, ANIMATION_SEAL);
    if (seal) {
      if (seal.motionStandardId !== YOUTUBE_MOTION_STANDARD_ID) phase1Blockers.push(`${ANIMATION_SEAL}: motionStandardId ist falsch.`);
      const entries = Array.isArray(seal.entries) ? seal.entries : [];
      for (const visual of motionVisuals) {
        const entry = entries.find((candidate) => candidate.id === visual.id);
        if (!entry) {
          phase1Blockers.push(`${ANIMATION_SEAL}: Eintrag für ${visual.id} fehlt.`);
          continue;
        }
        const sourcePath = resolve(root, visual.animationSourceFile ?? '');
        if (isFile(sourcePath) && entry.sha256 !== sha256(sourcePath)) phase1Blockers.push(`${ANIMATION_SEAL}: Hash für ${visual.id} stimmt nicht mehr; Phase 1 erneut validieren und versiegeln.`);
        if (entry.exportName !== visual.animationExport) phase1Blockers.push(`${ANIMATION_SEAL}: Export für ${visual.id} stimmt nicht.`);
        if (entry.visualTechniqueId !== visual.visualTechniqueId || entry.compositionFamilyId !== visual.compositionFamilyId || entry.mechanicId !== visual.mechanicId) {
          phase1Blockers.push(`${ANIMATION_SEAL}: Motion-Metadaten für ${visual.id} stimmen nicht mehr.`);
        }
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
  for (const fileName of actualImages) {
    if (!expectedSet.has(fileName)) phase2Blockers.push(`Unerwartetes Nutzerbild: ${IMAGE_INBOX}/${fileName}`);
  }

  const audioFiles = listFiles(resolve(root, '03-audio'), AUDIO_EXTENSIONS);
  if (audioFiles.length === 0) phase2Blockers.push('Finales Voiceover fehlt in 03-audio/.');
  if (audioFiles.length > 1) phase2Blockers.push(`03-audio/ enthält mehrere Audiodateien: ${audioFiles.join(', ')}`);
  if (audioFiles.length === 1 && statSync(resolve(root, '03-audio', audioFiles[0])).size === 0) phase2Blockers.push(`Finales Voiceover ist leer: 03-audio/${audioFiles[0]}`);

  const timing = readJson(resolve(root, WORD_TIMINGS), phase2Blockers, WORD_TIMINGS);
  if (timing) {
    const words = flattenTimingWords(timing);
    if (timing.subtitleMode !== SUBTITLE_MODE) phase2Blockers.push(`${WORD_TIMINGS}: subtitleMode muss ${SUBTITLE_MODE} sein.`);
    if (timing.activeWordColor !== ACTIVE_WORD_COLOR) phase2Blockers.push(`${WORD_TIMINGS}: activeWordColor muss ${ACTIVE_WORD_COLOR} sein.`);
    if (words.length === 0) phase2Blockers.push(`${WORD_TIMINGS} enthält keine echten Wort-Zeitstempel.`);
    else if (words.some((word) => !isValidTimingWord(word))) phase2Blockers.push(`${WORD_TIMINGS} enthält ungültige Wort-Zeitstempel.`);
    if (!Array.isArray(timing.sentences) || timing.sentences.length === 0) phase2Blockers.push(`${WORD_TIMINGS} enthält keine satzbasierten Caption-Gruppen.`);
    if (audioFiles.length === 1) {
      const sourceName = typeof timing.source === 'string' ? basename(timing.source) : '';
      if (!sourceName || sourceName !== audioFiles[0]) phase2Blockers.push(`${WORD_TIMINGS} muss nachweislich aus 03-audio/${audioFiles[0]} erzeugt sein.`);
    }
  }

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
