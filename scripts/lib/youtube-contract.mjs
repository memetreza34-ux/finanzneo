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

// YouTube uses the same simple top-level structure as Reels.
export const SCRIPT_DIR = '01-script';
export const AUDIO_DIR = '02-audio';
export const SCENES_DIR = '03-szenen';
export const CAPTION_DIR = '04-caption';
export const PROJECT_DIR = '05-projektdateien';
export const EXPORT_DIR = '06-export';

export const VISUAL_INDEX = `${PROJECT_DIR}/scene-index.json`;
export const ALL_PROMPTS = `${SCENES_DIR}/alle-bildprompts.txt`;
export const IMAGE_INBOX = `${SCENES_DIR}/00-ALLE-BILDER-HIER-REIN`;
export const WORD_TIMINGS = `${AUDIO_DIR}/word-timings.json`;
export const ANIMATION_SEAL = `${PROJECT_DIR}/animation-seal.json`;
export const TIMELINE = `${PROJECT_DIR}/timeline.json`;
export const PRODUCTION_MANIFEST = `${PROJECT_DIR}/production-manifest.json`;
export const MOTION_RENDER_QA = `${PROJECT_DIR}/motion-render-qa.json`;

export const SUBTITLE_MODE = 'sentence-with-audio-synced-active-word';
export const ACTIVE_WORD_COLOR = 'finance-green';
export const CAPTION_LAYER_ID = 'finanzneo-youtube-caption-layer-v2';

export const YOUTUBE_PUBLISHING_FILES = {
  titleOptions: `${CAPTION_DIR}/title-options.txt`,
  finalTitle: `${CAPTION_DIR}/final-title.txt`,
  description: `${CAPTION_DIR}/description.txt`,
  chapters: `${CAPTION_DIR}/chapters.txt`,
  tagsKeywords: `${CAPTION_DIR}/tags-keywords.txt`,
  hashtags: `${CAPTION_DIR}/hashtags.txt`,
  thumbnailBrief: `${CAPTION_DIR}/thumbnail-brief.txt`,
  pinnedComment: `${CAPTION_DIR}/pinned-comment.txt`,
  communityPost: `${CAPTION_DIR}/community-post.txt`,
  sourcesDisclaimer: `${CAPTION_DIR}/sources-disclaimer.txt`,
  uploadChecklist: `${CAPTION_DIR}/upload-checklist.md`,
};

export const SOCIAL_PROMO_FILES = {
  instagram: `${CAPTION_DIR}/social-promo/instagram.txt`,
  tiktok: `${CAPTION_DIR}/social-promo/tiktok.txt`,
  facebook: `${CAPTION_DIR}/social-promo/facebook.txt`,
  snapchat: `${CAPTION_DIR}/social-promo/snapchat.txt`,
};

export const PHASE_1_FILES = [
  `${PROJECT_DIR}/briefing.md`,
  `${PROJECT_DIR}/recherche-quellen.md`,
  `${SCRIPT_DIR}/script-fliess-text.txt`,
  `${SCRIPT_DIR}/kapitel-dramaturgie.md`,
  `${SCRIPT_DIR}/retention-plan.md`,
  ALL_PROMPTS,
  `${SCENES_DIR}/bildwelt.txt`,
  `${SCENES_DIR}/thumbnail-prompt.txt`,
  `${PROJECT_DIR}/visual-plan.md`,
  `${PROJECT_DIR}/remotion-plan.md`,
  ...Object.values(YOUTUBE_PUBLISHING_FILES),
  ...Object.values(SOCIAL_PROMO_FILES),
];

export const FORBIDDEN_YOUTUBE_ARTIFACTS = [
  'youtube-shorts.txt',
  'shorts.txt',
  'shorts-metadata.txt',
];
