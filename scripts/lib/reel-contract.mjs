// Gemeinsame Vertragskonstanten für alle Reel-Skripte.
//
// Diese Werte lagen früher mehrfach kopiert in scaffold-finanzneo-reel.mjs,
// validate-reel-source-contract.mjs und validate-platform-publishing.mjs.
// Dadurch entstanden Widersprüche, sobald eine Regel nur an einzelnen Stellen
// nachgezogen wurde — zuletzt beim Entfernen der YouTube Shorts. Jede Änderung
// an der Bildwelt oder an den Plattformen gehört ausschließlich hierher.

export const WORLD_ID = 'finanzneo-connected-studio-v3';
export const WORLD_ID_MARKER = `FINANZNEO_WORLD_ID: ${WORLD_ID}`;

export const CAPTION_DIRECTORY = '04-caption';
export const IMAGE_INBOX = '03-szenen/00-ALLE-BILDER-HIER-REIN';
export const SCENE_INDEX = '03-szenen/scene-index.json';
export const ALL_PROMPTS = '03-szenen/alle-bildprompts.txt';

export const SUBTITLE_MODE = 'sentence-with-audio-synced-active-word';
export const ACTIVE_WORD_COLOR = 'finance-green';

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

// Textregel, getrennt nach Bildtyp (CLAUDE.md 6.4).
//
// Cover: trägt Headline + Subline eingebrannt und sagt damit direkt, worum
// es im Reel geht. Szenenbilder: tragen KEINEN Satz, nur kurze deutsche
// Objektlabels — die Aussage kommt aus dem Voiceover und den Remotion-
// Untertiteln. Ein Satz im Szenenbild würde mit beidem konkurrieren.
export const COVER_HEADLINE_MARKERS = [
  'HEADLINE + SUBLINE',
  'Bake exactly ONE bold German headline',
  'Bake the headline',
];

// Szenenprompts müssen Fließtext im Bild ausdrücklich ausschließen.
export const SCENE_NO_SENTENCE_MARKERS = [
  'No headline. No subtitle. No sentence.',
  'No headline, no subtitle, no sentence',
];

// Szenenprompts müssen die erlaubten Labels explizit benennen.
export const SCENE_LABEL_MARKERS = [
  'BESCHRIFTUNGEN',
  'object labels',
];
