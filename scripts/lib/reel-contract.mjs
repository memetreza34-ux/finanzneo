// Gemeinsame Vertragskonstanten für alle Reel-Skripte.
//
// Diese Werte lagen früher mehrfach kopiert in scaffold-finanzneo-reel.mjs,
// validate-reel-source-contract.mjs, validate-platform-publishing.mjs und
// validate-drei-konten.mjs. Dadurch entstanden Widersprüche, sobald eine
// Regel nur an einzelnen Stellen nachgezogen wurde — zuletzt beim Entfernen
// der YouTube Shorts. Formatübergreifende Bildweltwerte liegen heute in
// finanzneo-media-contract.mjs; Reel-spezifische Werte bleiben hier.

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

// Google-Flow-Ausführung: harte Single-Job-State-Machine.
// Vor den Szenenbildern gibt es genau eine Nutzerentscheidung: drei Cover-
// Kandidaten werden nacheinander erzeugt und der Nutzer wählt A/B/C. Das
// gewählte Cover wird finaler Cover-/Scene-01-Asset und einziger Style-Anker.
// Danach läuft Flow autonom in organisatorischen 5er-Blöcken weiter, technisch
// aber weiterhin mit maximal EINEM laufenden Bildjob. Jedes Bild wird sofort
// umbenannt und geprüft; am Ende folgt ein vollständiger Datei-/Namens-Audit.
export const FLOW_EXECUTION_MODE_ID = 'finanzneo-flow-strict-single-job-v3';
export const FLOW_EXECUTION_MODE_MARKER = `FLOW_EXECUTION_MODE: ${FLOW_EXECUTION_MODE_ID}`;
export const FLOW_STRUCTURE_LOCK_ID = 'finanzneo-flow-structure-lock-v2';
export const FLOW_STRUCTURE_LOCK_MARKER = `FLOW_STRUCTURE_LOCK: ${FLOW_STRUCTURE_LOCK_ID}`;
export const FLOW_STATE_MACHINE_ID = 'finanzneo-flow-state-machine-v1';
export const FLOW_STATE_MACHINE_MARKER = `FLOW_STATE_MACHINE: ${FLOW_STATE_MACHINE_ID}`;
export const FLOW_COVER_WORKFLOW_ID = 'finanzneo-flow-cover-anchor-5pack-v1';
export const FLOW_COVER_WORKFLOW_MARKER = `FLOW_COVER_WORKFLOW: ${FLOW_COVER_WORKFLOW_ID}`;
export const FLOW_IMAGE_BLOCK_SIZE = 5;
export const FLOW_IMAGE_BLOCK_SIZE_MARKER = `FLOW_IMAGE_BLOCK_SIZE: ${FLOW_IMAGE_BLOCK_SIZE}`;

export const SUBTITLE_MODE = 'sentence-with-audio-synced-active-word';
export const ACTIVE_WORD_COLOR = 'finance-green';

// Reel-Publishing nutzt genau EINE Caption-Quelle für alle Reel-Plattformen.
// YouTube ist ausschließlich Longform unter youtube/ — siehe docs/PLATFORM-PUBLISHING.md.
export const PLATFORM_PUBLISHING_FILES = {
  universalCaption: `${CAPTION_DIRECTORY}/caption.txt`,
};

// Alte Plattformvarianten sind verboten, damit Generator, Validator und Export
// nicht wieder mehrere widersprüchliche Caption-Wahrheiten erzeugen.
export const FORBIDDEN_PUBLISHING_KEYS = [
  'youtubeShorts',
  'masterCaption',
  'instagramReels',
  'tiktok',
  'facebookReels',
  'snapchat',
];
export const FORBIDDEN_PUBLISHING_FILES = [
  `${CAPTION_DIRECTORY}/youtube-shorts.txt`,
  `${CAPTION_DIRECTORY}/instagram-reels.txt`,
  `${CAPTION_DIRECTORY}/tiktok.txt`,
  `${CAPTION_DIRECTORY}/facebook-reels.txt`,
  `${CAPTION_DIRECTORY}/snapchat.txt`,
];