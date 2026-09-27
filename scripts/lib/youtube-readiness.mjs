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
import {
  getYouTubeMotionPreset,
  getYouTubeMotionReason,
  requiresYouTubeImage,
  requiresYouTubeMotion,
  requiresYouTubeRealAsset,
  validateYouTubeMotionMetadata,
} from './youtube-motion-contract.mjs';

export const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.aiff', '.aif', '.m4a']);
export const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

const PLACEHOLDER_PATTERN = /\[(?:[^\]]*(?:EINFÜGEN|VOLLSTÄNDIG|KURZER|OPTIONAL|THEMA|NAME|LABEL|DESCRIBE|TITLE|SOURCE|HOOK|VISUAL|CHAPTER|SCRIPT BEAT|CORE|PROMISE|TENSION|VIEWER|MOTION|ASSET|REASON|WHAT|WHY|TEXT|NUMBER|SUBJECT|OBJECT|CROP|START|RESULT|CONTEXT)[^\]]*)\]/i;
const readText = (path) => readFileSync(path, 'utf8');
const isFile = (path) => existsSync(path) && statSync(path).isFile();
const hasPlaceholder = (content) => PLACEHOLDER_PATTERN.test(content) || /\b(?:TODO|PLACEHOLDER)\b/i.test(content);
const nonEmpty = (value) => typeof value === 'string' && value.trim();

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
const sameJson = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const motionSealContract = (visual) => ({
  viewerChange: visual?.viewerChange,
  reason: getYouTubeMotionReason(visual),
  motionPreset: getYouTubeMotionPreset(visual),
  advancedReason: visual?.advancedReason ?? '',
  toolStack: Array.isArray(visual?.toolStack) ? visual.toolStack : [],
});

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
  if (index && (!nonEmpty(index.title) || hasPlaceholder(index.title))) {
    phase1Blockers.push(`${VISUAL_INDEX}: title fehlt oder enthält einen Platzhalter.`);
  }
  if (index?.motionStandard?.id !== YOUTUBE_MOTION_STANDARD_ID) {
    warnings.push(`${VISUAL_INDEX}: Legacy-Motion-Standard erkannt; neue Projekte sollen ${YOUTUBE_MOTION_STANDARD_ID} verwenden.`);
  }

  const expectedImages = [];
  const thumbnailFileName = index?.thumbnail?.googleFlowFileName;
  if (!nonEmpty(thumbnailFileName) || hasPlaceholder(thumbnailFileName)) {
    phase1Blockers.push(`${VISUAL_INDEX}: thumbnail.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
  } else {
    expectedImages.push(thumbnailFileName);
  }

  const realAssets = [];

  for (const visual of visuals) {
    const id = nonEmpty(visual?.id) ? visual.id : 'Unbekanntes Visual';

    for (const field of ['chapter', 'scriptBeat']) {
      if (!nonEmpty(visual?.[field]) || hasPlaceholder(visual[field])) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
      }
    }

    if (index?.motionStandard?.id === YOUTUBE_MOTION_STANDARD_ID) {
      for (const field of ['message', 'reason']) {
        if (!nonEmpty(visual?.[field]) || hasPlaceholder(visual[field])) {
          phase1Blockers.push(`${VISUAL_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
        }
      }
    }

    if (requiresYouTubeImage(visual)) {
      const fileName = visual.googleFlowFileName;
      if (!nonEmpty(fileName) || hasPlaceholder(fileName)) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
      } else expectedImages.push(fileName);

      if (!nonEmpty(visual.expectedVisual) || hasPlaceholder(visual.expectedVisual)) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.expectedVisual fehlt oder enthält einen Platzhalter.`);
      }
      if (!Array.isArray(visual.objectLabels) || visual.objectLabels.some((label) => typeof label !== 'string' || hasPlaceholder(label))) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.objectLabels ist ungültig.`);
      }
      if (index?.motionStandard?.id === YOUTUBE_MOTION_STANDARD_ID) {
        if (visual.flowAllowed !== true) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.flowAllowed muss true sein.`);
        if (!nonEmpty(visual.flowReason) || hasPlaceholder(visual.flowReason)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.flowReason fehlt oder enthält einen Platzhalter.`);
      }

      const imagePlanFile = visual.type === 'hybrid' ? visual.imagePlanFile : visual.planFile;
      if (!nonEmpty(imagePlanFile)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.image plan file fehlt.`);
      else checkCompletedText(root, imagePlanFile, phase1Blockers);
    }

    if (requiresYouTubeRealAsset(visual)) {
      if (!nonEmpty(visual.planFile)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.planFile fehlt.`);
      else checkCompletedText(root, visual.planFile, phase1Blockers);
      if (!nonEmpty(visual.sourceNote) || hasPlaceholder(visual.sourceNote)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.sourceNote fehlt oder enthält einen Platzhalter.`);
      if (!nonEmpty(visual.assetFile) || hasPlaceholder(visual.assetFile)) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.assetFile fehlt oder enthält einen Platzhalter.`);
      } else {
        realAssets.push({id, path: visual.assetFile});
      }
    }

    if (requiresYouTubeMotion(visual)) {
      for (const error of validateYouTubeMotionMetadata(visual)) phase1Blockers.push(`${VISUAL_INDEX}: ${error}`);

      const sourceFile = visual.animationSourceFile;
      if (!nonEmpty(sourceFile)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.animationSourceFile fehlt.`);
      else checkCompletedText(root, sourceFile, phase1Blockers);

      if (!nonEmpty(visual.planFile)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.planFile fehlt.`);
      else checkCompletedText(root, visual.planFile, phase1Blockers);

      for (const [field, value] of [
        ['viewerChange', visual.viewerChange],
        ['reason', getYouTubeMotionReason(visual)],
        ['motionPreset', getYouTubeMotionPreset(visual)],
        ['animationExport', visual.animationExport],
      ]) {
        if (!nonEmpty(value) || hasPlaceholder(value)) {
          phase1Blockers.push(`${VISUAL_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
        }
      }
      if (nonEmpty(visual.advancedReason) && hasPlaceholder(visual.advancedReason)) {
        phase1Blockers.push(`${VISUAL_INDEX}: ${id}.advancedReason enthält einen Platzhalter.`);
      }
    }

    if (visual?.type === 'data') {
      if (!nonEmpty(visual.dataNotesFile)) phase1Blockers.push(`${VISUAL_INDEX}: ${id}.dataNotesFile fehlt.`);
      else checkCompletedText(root, visual.dataNotesFile, phase1Blockers);
    }
  }

  const motionVisuals = visuals.filter(requiresYouTubeMotion);
  if (motionVisuals.length > 0) {
    const seal = readJson(resolve(root, ANIMATION_SEAL), phase1Blockers, ANIMATION_SEAL);
    if (seal) {
      if (seal.version !== 3) phase1Blockers.push(`${ANIMATION_SEAL}: version muss 3 für Motion V4 sein. Phase 1 erneut versiegeln.`);
      if (seal.motionStandardId !== index?.motionStandard?.id) phase1Blockers.push(`${ANIMATION_SEAL}: motionStandardId stimmt nicht mit visual-index.json überein.`);
      const entries = Array.isArray(seal.entries) ? seal.entries : [];

      for (const visual of motionVisuals) {
        const entry = entries.find((candidate) => candidate.id === visual.id);
        if (!entry) {
          phase1Blockers.push(`${ANIMATION_SEAL}: Eintrag für ${visual.id} fehlt.`);
          continue;
        }

        const sourcePath = resolve(root, visual.animationSourceFile ?? '');
        if (isFile(sourcePath) && entry.sha256 !== sha256(sourcePath)) {
          phase1Blockers.push(`${ANIMATION_SEAL}: Hash für ${visual.id} stimmt nicht mehr; Phase 1 erneut validieren und versiegeln.`);
        }
        if (entry.exportName !== visual.animationExport) phase1Blockers.push(`${ANIMATION_SEAL}: Export für ${visual.id} stimmt nicht.`);

        const sealedContract = motionSealContract({
          viewerChange: entry.viewerChange,
          reason: entry.reason,
          motionPreset: entry.motionPreset,
          advancedReason: entry.advancedReason,
          toolStack: entry.toolStack,
        });
        if (!sameJson(sealedContract, motionSealContract(visual))) {
          phase1Blockers.push(`${ANIMATION_SEAL}: Motion-V4-Vertrag für ${visual.id} stimmt nicht mehr.`);
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

  for (const asset of realAssets) {
    const assetPath = resolve(root, asset.path);
    if (!isFile(assetPath)) phase2Blockers.push(`Echtes Asset fehlt für ${asset.id}: ${asset.path}`);
    else if (statSync(assetPath).size === 0) phase2Blockers.push(`Echtes Asset ist leer für ${asset.id}: ${asset.path}`);
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

  if (actualImages.length === expectedImages.length && expectedImages.length > 0) warnings.push('Alle erwarteten Flow-/Thumbnail-Bilder sind vorhanden.');
  if (realAssets.length > 0) warnings.push(`${realAssets.length} echtes/e Asset(s) eingeplant.`);

  return {
    ready: phase1Blockers.length === 0 && phase2Blockers.length === 0,
    phase1Blockers,
    phase2Blockers,
    warnings,
    expectedImages,
    audioFiles,
  };
};
