import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {basename, extname, resolve} from 'node:path';
import {
  ACTIVE_WORD_COLOR,
  ALL_PROMPTS,
  IMAGE_INBOX,
  PLATFORM_PUBLISHING_FILES,
  REEL_CAPTION,
  REEL_LAYOUT,
  REEL_VISUAL_MIX,
  SCENE_INDEX,
  SUBTITLE_MODE,
} from './reel-contract.mjs';

export const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.aiff', '.aif', '.m4a']);
export const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

export const isSquareImageDimensions = (widthValue, heightValue) => {
  const width = Number(widthValue);
  const height = Number(heightValue);
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && width === height;
};

const PLACEHOLDER_PATTERN = /\[(?:[^\]]*(?:EINFÜGEN|VOLLSTÄNDIG|KURZER|OPTIONAL|THEMA|NAME|LABEL|METAPHOR|DESCRIBE|PLACE EACH|ONE LARGE)[^\]]*)\]/i;

const readText = (path) => readFileSync(path, 'utf8');
const isFile = (path) => existsSync(path) && statSync(path).isFile();
const listFiles = (directory, extensions) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((entry) => isFile(resolve(directory, entry)))
    .filter((entry) => extensions.has(extname(entry).toLowerCase()))
    .sort();
};

const hasPlaceholder = (content) => PLACEHOLDER_PATTERN.test(content);
const isCompletedString = (value) => typeof value === 'string' && value.trim() && !hasPlaceholder(value);

const readJson = (path, blockers, label) => {
  if (!isFile(path)) {
    blockers.push(`${label} fehlt.`);
    return null;
  }

  try {
    return JSON.parse(readText(path));
  } catch (error) {
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

export const analyzeReelReadiness = (rootDirectory) => {
  const root = resolve(rootDirectory);
  const phase1Blockers = [];
  const phase2Blockers = [];
  const warnings = [];

  if (!existsSync(root) || !statSync(root).isDirectory()) {
    return {
      ready: false,
      phase1Blockers: [`Reel-Ordner fehlt: ${root}`],
      phase2Blockers,
      warnings,
      expectedImages: [],
      audioFiles: [],
    };
  }

  const index = readJson(resolve(root, SCENE_INDEX), phase1Blockers, SCENE_INDEX);

  const phase1Files = [
    '01-script/script-fliess-text.txt',
    '03-szenen/00-cover/cover.txt',
    ALL_PROMPTS,
    '05-projektdateien/recherche-quellen.md',
    '05-projektdateien/szenenplan.md',
    PLATFORM_PUBLISHING_FILES.masterCaption,
    PLATFORM_PUBLISHING_FILES.instagramReels,
    PLATFORM_PUBLISHING_FILES.tiktok,
    PLATFORM_PUBLISHING_FILES.facebookReels,
    PLATFORM_PUBLISHING_FILES.snapchat,
  ];

  for (const relativePath of phase1Files) {
    checkCompletedText(root, relativePath, phase1Blockers);
  }

  const scenes = Array.isArray(index?.scenes) ? index.scenes : [];
  if (index && scenes.length === 0) phase1Blockers.push(`${SCENE_INDEX} enthält keine Szenen.`);
  if (index && (typeof index.title !== 'string' || !index.title.trim() || hasPlaceholder(index.title))) {
    phase1Blockers.push(`${SCENE_INDEX}: title fehlt oder enthält einen Platzhalter.`);
  }

  for (const field of ['headline', 'accentLine', 'payoff']) {
    if (!isCompletedString(index?.cover?.overlay?.[field])) {
      phase1Blockers.push(`${SCENE_INDEX}: cover.overlay.${field} fehlt oder enthält einen Platzhalter.`);
    }
  }

  if (JSON.stringify(index?.layout) !== JSON.stringify(REEL_LAYOUT)) {
    phase1Blockers.push(`${SCENE_INDEX}: layout muss exakt dem zentralen Reel-Vertrag entsprechen.`);
  }

  const subtitle = index?.subtitleDisplay;
  if (subtitle?.mode !== REEL_CAPTION.mode
    || subtitle?.activeWordColor !== REEL_CAPTION.activeWordColor
    || Number(subtitle?.maxWords) !== REEL_CAPTION.maxWords
    || Number(subtitle?.maxCharacters) !== REEL_CAPTION.maxCharacters
    || Number(subtitle?.maxLines) !== REEL_CAPTION.maxLines
    || subtitle?.noWordJump !== true
    || subtitle?.noWordScale !== true) {
    phase1Blockers.push(`${SCENE_INDEX}: subtitleDisplay widerspricht dem zentralen Satz-Karaoke-Vertrag.`);
  }

  const expectedImages = [];
  const coverFileName = index?.cover?.googleFlowFileName;
  if (typeof coverFileName !== 'string' || !coverFileName.trim() || hasPlaceholder(coverFileName)) {
    phase1Blockers.push(`${SCENE_INDEX}: cover.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
  } else {
    expectedImages.push(coverFileName);
  }

  for (const scene of scenes) {
    const id = typeof scene?.id === 'string' ? scene.id : 'Unbekannte Szene';
    const sceneDirectory = typeof scene?.directory === 'string' ? `03-szenen/${scene.directory}` : '';
    if (!sceneDirectory) phase1Blockers.push(`${SCENE_INDEX}: ${id}.directory fehlt.`);
    else checkCompletedText(root, `${sceneDirectory}/szene.md`, phase1Blockers);
    for (const field of ['headline', 'accent', 'icon']) {
      if (typeof scene?.[field] !== 'string' || !scene[field].trim() || hasPlaceholder(scene[field])) {
        phase1Blockers.push(`${SCENE_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
      }
    }

    if (scene?.type === 'image') {
      if (typeof scene.planFile === 'string') checkCompletedText(root, `03-szenen/${scene.planFile.replace(/^03-szenen\//, '')}`, phase1Blockers);
      else phase1Blockers.push(`${SCENE_INDEX}: ${id}.planFile fehlt.`);
      const fileName = scene.googleFlowFileName;
      if (typeof fileName !== 'string' || !fileName.trim() || hasPlaceholder(fileName)) {
        phase1Blockers.push(`${SCENE_INDEX}: ${id}.googleFlowFileName fehlt oder enthält einen Platzhalter.`);
      } else {
        expectedImages.push(fileName);
      }
      if (typeof scene.expectedVisual !== 'string' || !scene.expectedVisual.trim() || hasPlaceholder(scene.expectedVisual)) {
        phase1Blockers.push(`${SCENE_INDEX}: ${id}.expectedVisual fehlt oder enthält einen Platzhalter.`);
      }
      if (!Array.isArray(scene.objectLabels) || scene.objectLabels.length === 0 || scene.objectLabels.some((label) => typeof label !== 'string' || !label.trim() || hasPlaceholder(label))) {
        phase1Blockers.push(`${SCENE_INDEX}: ${id}.objectLabels fehlen oder enthalten Platzhalter.`);
      }
    } else if (scene?.type === 'animation') {
      if (typeof scene.planFile === 'string') checkCompletedText(root, `03-szenen/${scene.planFile.replace(/^03-szenen\//, '')}`, phase1Blockers);
      else phase1Blockers.push(`${SCENE_INDEX}: ${id}.planFile fehlt.`);
      for (const field of ['visualMetaphor', 'startState', 'action', 'endState']) {
        if (!isCompletedString(scene?.[field])) {
          phase1Blockers.push(`${SCENE_INDEX}: ${id}.${field} fehlt oder enthält einen Platzhalter.`);
        }
      }
    }
  }

  if (scenes.length > 0) {
    const animationCount = scenes.filter((scene) => scene?.type === 'animation').length;
    const animationShare = animationCount / scenes.length;
    if (index?.visualMix?.strategy !== REEL_VISUAL_MIX.strategy) {
      phase1Blockers.push(`${SCENE_INDEX}: visualMix.strategy muss ${REEL_VISUAL_MIX.strategy} sein.`);
    }
    if (Math.abs(Number(index?.visualMix?.actualAnimationShare) - Number(animationShare.toFixed(2))) > 0.001) {
      phase1Blockers.push(`${SCENE_INDEX}: visualMix.actualAnimationShare stimmt nicht mit den Szenentypen überein.`);
    }
    if (animationShare < REEL_VISUAL_MIX.minimumAnimationShare
      && !isCompletedString(index?.visualMix?.exceptionRationale)) {
      phase1Blockers.push(`${SCENE_INDEX}: Animationsanteil unter ${Math.round(REEL_VISUAL_MIX.minimumAnimationShare * 100)} % benötigt eine konkrete fachliche Begründung.`);
    }
  }

  if (scenes.some((scene) => scene?.type === 'animation')) {
    checkCompletedText(root, '05-projektdateien/animationen.md', phase1Blockers);
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

  const audioFiles = listFiles(resolve(root, '02-audio'), AUDIO_EXTENSIONS);
  if (audioFiles.length === 0) phase2Blockers.push('Finales Voiceover fehlt in 02-audio/.');
  if (audioFiles.length > 1) phase2Blockers.push(`02-audio/ enthält mehrere Audiodateien: ${audioFiles.join(', ')}`);
  if (audioFiles.length === 1 && statSync(resolve(root, '02-audio', audioFiles[0])).size === 0) {
    phase2Blockers.push(`Finales Voiceover ist leer: 02-audio/${audioFiles[0]}`);
  }

  const timing = readJson(resolve(root, '04-caption/word-timings.json'), phase2Blockers, '04-caption/word-timings.json');
  if (timing) {
    const words = flattenTimingWords(timing);
    if (timing.subtitleMode !== SUBTITLE_MODE) phase2Blockers.push(`word-timings.json: subtitleMode muss ${SUBTITLE_MODE} sein.`);
    if (timing.activeWordColor !== ACTIVE_WORD_COLOR) phase2Blockers.push(`word-timings.json: activeWordColor muss ${ACTIVE_WORD_COLOR} sein.`);
    if (words.length === 0) phase2Blockers.push('word-timings.json enthält keine echten Wort-Zeitstempel.');
    else if (words.some((word) => !isValidTimingWord(word))) phase2Blockers.push('word-timings.json enthält ungültige Wort-Zeitstempel.');
    if (!Array.isArray(timing.sentences) || timing.sentences.length === 0) {
      phase2Blockers.push('word-timings.json enthält keine satzbasierten Caption-Gruppen.');
    } else {
      timing.sentences.forEach((sentence, index) => {
        const text = typeof sentence?.text === 'string' ? sentence.text.trim() : '';
        const sentenceWords = Array.isArray(sentence?.words) ? sentence.words : [];
        if (!text || sentenceWords.length === 0) {
          phase2Blockers.push(`word-timings.json: Untertitelsatz ${index + 1} ist unvollständig.`);
        }
        if (sentenceWords.length > REEL_CAPTION.maxWords) {
          phase2Blockers.push(`word-timings.json: Untertitelsatz ${index + 1} hat ${sentenceWords.length} Wörter; erlaubt sind höchstens ${REEL_CAPTION.maxWords}.`);
        }
        if (text.length > REEL_CAPTION.maxCharacters) {
          phase2Blockers.push(`word-timings.json: Untertitelsatz ${index + 1} hat ${text.length} Zeichen; erlaubt sind höchstens ${REEL_CAPTION.maxCharacters}.`);
        }
      });
    }

    if (audioFiles.length === 1) {
      const sourceName = typeof timing.source === 'string' ? basename(timing.source) : '';
      if (!sourceName || sourceName !== audioFiles[0]) {
        phase2Blockers.push(`word-timings.json muss nachweislich aus 02-audio/${audioFiles[0]} erzeugt sein.`);
      }
    }
  }

  if (actualImages.length === expectedImages.length && expectedImages.length > 0) {
    warnings.push('Die Bilder sind vollständig. Phase 3 kopiert sie mit reel:sort-images in die technischen Szenenordner.');
  }

  return {
    ready: phase1Blockers.length === 0 && phase2Blockers.length === 0,
    phase1Blockers,
    phase2Blockers,
    warnings,
    expectedImages,
    audioFiles,
  };
};
