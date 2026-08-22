// Gemeinsame Vertragskonstanten für alle Reel-Skripte.
//
// Diese Werte lagen früher mehrfach kopiert in scaffold-finanzneo-reel.mjs,
// validate-reel-source-contract.mjs, validate-platform-publishing.mjs und
// validate-drei-konten.mjs. Dadurch entstanden Widersprüche, sobald eine
// Regel nur an einzelnen Stellen nachgezogen wurde — zuletzt beim Entfernen
// der YouTube Shorts. Formatübergreifende Bildweltwerte liegen heute in
// finanzneo-media-contract.mjs; Reel-spezifische Werte bleiben hier.
import {readFileSync} from 'node:fs';

const runtimeContract = JSON.parse(
  readFileSync(new URL('../../src/brand/reel-contract.json', import.meta.url), 'utf8'),
);

export const REEL_LAYOUT = runtimeContract.layout;
export const REEL_CAPTION = runtimeContract.captions;
export const REEL_VISUAL_MIX = runtimeContract.visualMix;
export const REEL_FINAL_EXPORT = runtimeContract.finalExport;

export {
  FLOW_AGENT_PROTOCOL_ID,
  FLOW_AGENT_PROTOCOL_MARKER,
  SERIES_LOCK_ID,
  SERIES_LOCK_MARKER,
  WORLD_ID,
  WORLD_ID_MARKER,
} from './finanzneo-media-contract.mjs';
export const GENERATED_IMAGE_ASPECT_RATIO = '1:1';
export const GENERATED_IMAGE_ASPECT_MARKER = `GENERATED_IMAGE_ASPECT_RATIO: ${GENERATED_IMAGE_ASPECT_RATIO}`;
export const REEL_VIDEO_ASPECT_RATIO = '9:16';

export const CAPTION_DIRECTORY = '04-caption';
export const IMAGE_INBOX = '03-szenen/00-ALLE-BILDER-HIER-REIN';
export const SCENE_INDEX = '03-szenen/scene-index.json';
export const ALL_PROMPTS = '03-szenen/alle-bildprompts.txt';

export const SUBTITLE_MODE = REEL_CAPTION.mode;
export const ACTIVE_WORD_COLOR = REEL_CAPTION.activeWordColor;

// FinanzNeo veröffentlicht keine YouTube Shorts.
// YouTube ist ausschließlich Longform unter youtube/ — siehe docs/PLATFORM-PUBLISHING.md.
export const PLATFORM_PUBLISHING_FILES = {
  masterCaption: `${CAPTION_DIRECTORY}/caption.txt`,
  instagramReels: `${CAPTION_DIRECTORY}/instagram-reels.txt`,
  tiktok: `${CAPTION_DIRECTORY}/tiktok.txt`,
  facebookReels: `${CAPTION_DIRECTORY}/facebook-reels.txt`,
  snapchat: `${CAPTION_DIRECTORY}/snapchat.txt`,
};

// Schlüssel und Dateien, die in aktiven Reel-Projekten nicht vorkommen dürfen.
export const FORBIDDEN_PUBLISHING_KEYS = ['youtubeShorts'];
export const FORBIDDEN_PUBLISHING_FILES = [`${CAPTION_DIRECTORY}/youtube-shorts.txt`];
