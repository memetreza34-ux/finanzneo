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

export const VISUAL_INDEX = '05-projektdateien/scene-index.json';
export const ALL_PROMPTS = '03-szenen/alle-bildprompts.txt';
export const IMAGE_INBOX = '03-szenen/00-ALLE-BILDER-HIER-REIN';
export const WORD_TIMINGS = '02-audio/word-timings.json';
export const ANIMATION_SEAL = '05-projektdateien/animation-seal.json';

export const SUBTITLE_MODE = 'sentence-with-audio-synced-active-word';
export const ACTIVE_WORD_COLOR = 'finance-green';

export const YOUTUBE_PUBLISHING_FILES = {
  titleOptions: '04-caption/title-options.txt',
  finalTitle: '04-caption/final-title.txt',
  description: '04-caption/description.txt',
  chapters: '04-caption/chapters.txt',
  tagsKeywords: '04-caption/tags-keywords.txt',
  hashtags: '04-caption/hashtags.txt',
  thumbnailBrief: '04-caption/thumbnail-brief.txt',
  pinnedComment: '04-caption/pinned-comment.txt',
  communityPost: '04-caption/community-post.txt',
  sourcesDisclaimer: '04-caption/sources-disclaimer.txt',
  uploadChecklist: '04-caption/upload-checklist.md',
};

export const SOCIAL_PROMO_FILES = {
  instagram: '04-caption/social-promo/instagram.txt',
  tiktok: '04-caption/social-promo/tiktok.txt',
  facebook: '04-caption/social-promo/facebook.txt',
  snapchat: '04-caption/social-promo/snapchat.txt',
};

export const PHASE_1_FILES = [
  '05-projektdateien/briefing.md',
  '05-projektdateien/recherche-quellen.md',
  '01-script/script-fliess-text.txt',
  '01-script/kapitel-dramaturgie.md',
  '01-script/retention-plan.md',
  ALL_PROMPTS,
  '03-szenen/bildwelt.txt',
  '03-szenen/thumbnail-prompt.txt',
  '05-projektdateien/visual-plan.md',
  '05-projektdateien/remotion-plan.md',
  ...Object.values(YOUTUBE_PUBLISHING_FILES),
  ...Object.values(SOCIAL_PROMO_FILES),
];

export const FORBIDDEN_YOUTUBE_ARTIFACTS = [
  'youtube-shorts.txt',
  'shorts.txt',
  'shorts-metadata.txt',
];
