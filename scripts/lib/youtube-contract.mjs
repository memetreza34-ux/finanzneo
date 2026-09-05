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

export const VISUAL_INDEX = '04-visuals/visual-index.json';
export const ALL_PROMPTS = '04-visuals/alle-bildprompts.txt';
export const IMAGE_INBOX = '04-visuals/00-ALLE-BILDER-HIER-REIN';
export const WORD_TIMINGS = '03-audio/word-timings.json';
export const ANIMATION_SEAL = '06-projektdateien/animation-seal.json';

export const SUBTITLE_MODE = 'sentence-with-audio-synced-active-word';
export const ACTIVE_WORD_COLOR = 'finance-green';

export const YOUTUBE_PUBLISHING_FILES = {
  titleOptions: '05-publishing/title-options.txt',
  finalTitle: '05-publishing/final-title.txt',
  description: '05-publishing/description.txt',
  chapters: '05-publishing/chapters.txt',
  tagsKeywords: '05-publishing/tags-keywords.txt',
  hashtags: '05-publishing/hashtags.txt',
  thumbnailBrief: '05-publishing/thumbnail-brief.txt',
  pinnedComment: '05-publishing/pinned-comment.txt',
  communityPost: '05-publishing/community-post.txt',
  sourcesDisclaimer: '05-publishing/sources-disclaimer.txt',
  uploadChecklist: '05-publishing/upload-checklist.md',
};

export const SOCIAL_PROMO_FILES = {
  instagram: '05-publishing/social-promo/instagram.txt',
  tiktok: '05-publishing/social-promo/tiktok.txt',
  facebook: '05-publishing/social-promo/facebook.txt',
  snapchat: '05-publishing/social-promo/snapchat.txt',
};

export const PHASE_1_FILES = [
  '01-recherche/briefing.md',
  '01-recherche/recherche-quellen.md',
  '02-script/script-fliess-text.txt',
  '02-script/kapitel-dramaturgie.md',
  '02-script/retention-plan.md',
  ALL_PROMPTS,
  '04-visuals/bildwelt.txt',
  '04-visuals/thumbnail-prompt.txt',
  '06-projektdateien/visual-plan.md',
  '06-projektdateien/remotion-plan.md',
  ...Object.values(YOUTUBE_PUBLISHING_FILES),
  ...Object.values(SOCIAL_PROMO_FILES),
];

export const FORBIDDEN_YOUTUBE_ARTIFACTS = [
  'youtube-shorts.txt',
  'shorts.txt',
  'shorts-metadata.txt',
];
