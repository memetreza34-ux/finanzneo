import {
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  WORLD_ID,
  WORLD_ID_MARKER,
} from './finanzneo-media-contract.mjs';
import {
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_VISUAL_TYPES,
  YOUTUBE_MOTION_VISUAL_TYPES,
  YOUTUBE_IMAGE_VISUAL_TYPES,
} from './youtube-motion-contract.mjs';

export {
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  WORLD_ID,
  WORLD_ID_MARKER,
  YOUTUBE_MOTION_STANDARD_ID,
  YOUTUBE_VISUAL_TYPES,
  YOUTUBE_MOTION_VISUAL_TYPES,
  YOUTUBE_IMAGE_VISUAL_TYPES,
};

export const GENERATED_IMAGE_ASPECT_RATIO = '16:9';
export const GENERATED_IMAGE_ASPECT_MARKER = `GENERATED_IMAGE_ASPECT_RATIO: ${GENERATED_IMAGE_ASPECT_RATIO}`;
export const YOUTUBE_VIDEO_ASPECT_RATIO = '16:9';
export const YOUTUBE_VIDEO_WIDTH = 1920;
export const YOUTUBE_VIDEO_HEIGHT = 1080;
export const YOUTUBE_VIDEO_FPS = 30;

// Ordnerstruktur: youtube/<Woche>/<Thema>/
export const SCRIPT_DIRECTORY = '01-script';
export const IMAGE_DIRECTORY = '02-bilder';
export const EXPORT_DIRECTORY = '03-export';
export const PROJECT_DIRECTORY = '04-projekt';

export const AUDIO_DIRECTORY = SCRIPT_DIRECTORY;
export const SCRIPT_FILE = `${SCRIPT_DIRECTORY}/script.txt`;
export const WORD_TIMINGS = `${SCRIPT_DIRECTORY}/word-timings.json`;

export const ALL_PROMPTS = `${IMAGE_DIRECTORY}/alle-bildprompts.txt`;
export const IMAGE_WORLD_FILE = `${IMAGE_DIRECTORY}/bildwelt.txt`;
export const THUMBNAIL_PROMPT = `${IMAGE_DIRECTORY}/thumbnail-prompt.txt`;
export const IMAGE_INBOX = `${IMAGE_DIRECTORY}/00-ALLE-BILDER-HIER-REIN`;
export const ZIP_INBOX = `${IMAGE_DIRECTORY}/ZIP-HIER-REIN`;

export const VISUAL_INDEX = `${PROJECT_DIRECTORY}/visual-index.json`;
export const VISUALS_DIRECTORY = `${PROJECT_DIRECTORY}/VISUALS`;
export const ANIMATION_SEAL = `${PROJECT_DIRECTORY}/animation-seal.json`;

export const REQUIRED_DIRECTORIES = [SCRIPT_DIRECTORY, IMAGE_DIRECTORY, EXPORT_DIRECTORY, PROJECT_DIRECTORY, IMAGE_INBOX, ZIP_INBOX, VISUALS_DIRECTORY];

export const SUBTITLE_MODE = 'sentence-with-audio-synced-active-word';
export const ACTIVE_WORD_COLOR = 'finance-green';

export const YOUTUBE_PUBLISHING_FILES = {
  titleOptions: `${EXPORT_DIRECTORY}/titel-varianten.txt`,
  finalTitle: `${EXPORT_DIRECTORY}/titel.txt`,
  description: `${EXPORT_DIRECTORY}/beschreibung.txt`,
  chapters: `${EXPORT_DIRECTORY}/kapitel.txt`,
  tagsKeywords: `${EXPORT_DIRECTORY}/keywords.txt`,
  hashtags: `${EXPORT_DIRECTORY}/hashtags.txt`,
  thumbnailBrief: `${EXPORT_DIRECTORY}/thumbnail-brief.txt`,
  pinnedComment: `${EXPORT_DIRECTORY}/angehefteter-kommentar.txt`,
  communityPost: `${EXPORT_DIRECTORY}/community-post.txt`,
  sourcesDisclaimer: `${EXPORT_DIRECTORY}/quellen-disclaimer.txt`,
  uploadChecklist: `${EXPORT_DIRECTORY}/upload-checkliste.md`,
};

export const SOCIAL_PROMO_FILES = {
  instagram: `${EXPORT_DIRECTORY}/social/instagram.txt`,
  tiktok: `${EXPORT_DIRECTORY}/social/tiktok.txt`,
  facebook: `${EXPORT_DIRECTORY}/social/facebook.txt`,
  snapchat: `${EXPORT_DIRECTORY}/social/snapchat.txt`,
};

export const PHASE_1_FILES = [
  `${PROJECT_DIRECTORY}/briefing.md`,
  `${PROJECT_DIRECTORY}/quellen.md`,
  SCRIPT_FILE,
  `${PROJECT_DIRECTORY}/kapitel-dramaturgie.md`,
  `${PROJECT_DIRECTORY}/retention-plan.md`,
  ALL_PROMPTS,
  IMAGE_WORLD_FILE,
  THUMBNAIL_PROMPT,
  `${PROJECT_DIRECTORY}/visual-plan.md`,
  `${PROJECT_DIRECTORY}/remotion-plan.md`,
  ...Object.values(YOUTUBE_PUBLISHING_FILES),
  ...Object.values(SOCIAL_PROMO_FILES),
];

export const FORBIDDEN_YOUTUBE_ARTIFACTS = [
  'youtube-shorts.txt',
  'shorts.txt',
  'shorts-metadata.txt',
];

/**
 * Vorhandene Icons für die Zwischenüberschrift.
 *
 * Kanonische Quelle sind die PATHS in src/brand/components/Icon.tsx. Diese Liste
 * ist die Kopie für die Validatoren, die kein TSX laden können; ein Test hält
 * beide gegeneinander, damit sie nicht auseinanderlaufen.
 */
export const YOUTUBE_ICON_NAMES = [
  'arrowRight', 'bank', 'bulb', 'calendar', 'chart-bar', 'chart-up', 'check', 'clock',
  'coins', 'cross', 'document', 'euro', 'flame', 'hourglass', 'list', 'lock', 'percent',
  'phone', 'receipt', 'repeat', 'rocket', 'search', 'shield', 'target', 'trending',
  'wallet', 'warning',
];

export const YOUTUBE_HEADER_TONES = ['default', 'positive', 'warning', 'money', 'neutral'];
