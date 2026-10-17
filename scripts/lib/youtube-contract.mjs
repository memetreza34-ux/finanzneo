import {basename, resolve} from 'node:path';
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

// YouTube: Google Flow arbeitet in Batches von bis zu 5 Bildern gleichzeitig (Arman, 10.10.2026).
// Das alte Einzelbild-Protokoll (FLOW_AGENT_PROTOCOL_ID) bleibt für bestehende Projekte gültig.
export const YOUTUBE_FLOW_PROTOCOL_ID = 'finanzneo-flow-batch5-v1';
export const YOUTUBE_FLOW_PROTOCOL_MARKER = `FLOW_AGENT_PROTOCOL: ${YOUTUBE_FLOW_PROTOCOL_ID}`;
export const YOUTUBE_FLOW_BATCH_SIZE = 5;
export const YOUTUBE_IMAGE_TEXT_LANGUAGE_RULE = 'All visible text in the image must be German: labels, numbers, buttons, screens and documents. Never use English words.';

export const GENERATED_IMAGE_ASPECT_RATIO = '16:9';
export const GENERATED_IMAGE_ASPECT_MARKER = `GENERATED_IMAGE_ASPECT_RATIO: ${GENERATED_IMAGE_ASPECT_RATIO}`;
export const YOUTUBE_VIDEO_ASPECT_RATIO = '16:9';
export const YOUTUBE_VIDEO_WIDTH = 1920;
export const YOUTUBE_VIDEO_HEIGHT = 1080;
export const YOUTUBE_VIDEO_FPS = 30;

// Projektordner (Arman, 10.10.2026): nur das Nötige sichtbar, alles andere unter _intern/.
//
//   youtube/<Projekt>/
//   ├── 1-script/script.txt              Sprechtext
//   ├── 2-bildprompts/bildprompts.txt    alle Flow-Prompts inkl. Thumbnail (5er-Batches)
//   ├── 3-bilder-hier-rein/              Flow-Bilder
//   ├── 4-audio-hier-rein/               genau eine Sprachaufnahme
//   ├── 5-export/                        cover.png · video.mp4 · caption.txt · untertitel-zeitstempel.txt
//   └── _intern/                         Recherche, Visual-Index, Animationen, Zeitplan, Publishing …
//
// Alle Pfade unten sind relativ zu _intern/ (der „root“ aller YouTube-Skripte).
export const INTERN_DIR = '_intern';
export const SCRIPT_FILE = '../1-script/script.txt';
export const ALL_PROMPTS = '../2-bildprompts/bildprompts.txt';
export const IMAGE_INBOX = '../3-bilder-hier-rein';
export const AUDIO_INBOX = '../4-audio-hier-rein';
export const EXPORT_DIR = '../5-export';
export const EXPORT_FILES = {
  cover: `${EXPORT_DIR}/cover.png`,
  video: `${EXPORT_DIR}/video.mp4`,
  caption: `${EXPORT_DIR}/caption.txt`,
  untertitel: `${EXPORT_DIR}/untertitel-zeitstempel.txt`,
};
export const VISUAL_INDEX = '04-visuals/visual-index.json';
export const WORD_TIMINGS = '03-audio/word-timings.json';

/** Projektpfad (youtube/<Projekt>) → interner root. Akzeptiert auch direkt den _intern-Pfad. */
export const internWurzel = (projekt) => {
  const pfad = resolve(projekt);
  return basename(pfad) === INTERN_DIR ? pfad : resolve(pfad, INTERN_DIR);
};
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
  SCRIPT_FILE,
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

// Qualitätsregeln aus dem Feedback zum ersten Video (Arman, 10.10.2026). Gelten für Projekte mit
// `qualityRules: YOUTUBE_QUALITY_RULES_ID`; ältere Projekte werden nicht rückwirkend migriert.
export const YOUTUBE_QUALITY_RULES_ID = 'finanzneo-youtube-quality-v1';
// V2 (17.10.2026, Wettbewerbsanalyse): Skript, Bild und Animation werden fest aneinander gebunden.
export const YOUTUBE_QUALITY_RULES_V2_ID = 'finanzneo-youtube-quality-v2';
export const YOUTUBE_QUALITY_RULES_IDS = [YOUTUBE_QUALITY_RULES_ID, YOUTUBE_QUALITY_RULES_V2_ID];
/** Hook beginnt mit Szene/Person/Konflikt, nicht mit einer Ankündigung (simplicissimus-Prinzip). */
export const YOUTUBE_HOOK_ANNOUNCEMENT_PATTERN = /\b(?:in diesem video|heute (?:zeige|erkläre|erklaere|schauen|sprechen)|ich zeige dir|ich erkläre dir|ich erklaere dir|lass uns (?:heute|mal))\b/i;
/** Sprechtempo des echten FinanzNeo-Voiceovers inkl. Pausen (gemessen: Supermarkt-Tricks 141,6 und
 *  0-%-Finanzierung 142,1 Wörter/Min.; vorher 154 ohne Pausen → Haltezeiten wurden ~10 % unterschätzt). */
export const YOUTUBE_SPEECH_WPM = 142;
/** Ein Standbild ohne neue sichtbare Information höchstens so lange (geschätzt aus dem Skript). */
export const YOUTUBE_IMAGE_MAX_HOLD_SECONDS = 8;
/** Nach echtem Audio: ab hier warnt der Zusammenbau. */
export const YOUTUBE_IMAGE_WARN_HOLD_SECONDS = 10;
/** Hook: bis zum ersten inhaltlichen Kapitel höchstens so lange. */
export const YOUTUBE_HOOK_MAX_SECONDS = 20;
/** Die Kommentarfrage steht im mittleren Teil des Skripts (Anteil der Wörter). */
export const YOUTUBE_COMMENT_CTA_WINDOW = [0.3, 0.75];
export const YOUTUBE_COMMENT_CTA_PATTERN = /kommentar/i;
/** Endkarte nach dem Voiceover für die YouTube-Endelemente (Studio erlaubt 5–20 s). */
export const YOUTUBE_ENDCARD_SECONDS = 15;
/** Optionale Hintergrundmusik (nur _intern/, nie im Nutzer-Audio-Ordner) und ihr Pegel unter der Stimme. */
export const YOUTUBE_MUSIC_FILES = ['03-audio/musik.mp3', '03-audio/musik.wav', '03-audio/musik.m4a'];
export const YOUTUBE_MUSIC_GAIN_DB = -24;
/** Bildwelt: Das Thumbnail wird zuerst erzeugt und hängt als Stilvorlage an jedem Bild. */
export const YOUTUBE_STYLE_MASTER = 'thumbnail';
/** Seit 17.10.2026: EINE kanalweite Stilvorlage für alle Bilder aller Videos (inkl. Thumbnail), damit die
 *  Videos untereinander nicht driften (Supermarkt vs. 0 % streuten in Hintergrund und Strich). */
export const YOUTUBE_STYLE_MASTER_KANAL = 'kanal';
export const YOUTUBE_CHANNEL_STYLE_FILE = 'FinanzNeo Stilvorlage.png';
export const YOUTUBE_CHANNEL_STYLE_PATH = `youtube/_kanal/${YOUTUBE_CHANNEL_STYLE_FILE}`;
export const youtubeStyleReferenceText = (datei) => `${datei} — attach this approved FinanzNeo style master to EVERY image as a style reference (from ${YOUTUBE_CHANNEL_STYLE_PATH} in the repository). Copy only its drawing style: warm cream background, gentle pencil-like outlines, softly painted flat fills, muted palette and hand-lettered labels. Never copy its composition, amount of detail, people, objects or text — the composition always follows the current scene.`;
export const YOUTUBE_STYLE_REFERENCE_MARKER = 'STYLE_REFERENCE:';
/** Hauptfigur: dieselbe Person in jedem Bild über ein angehängtes Referenzbild (kein Flow-„Charakter“ nötig). */
export const YOUTUBE_CHARACTER_REFERENCE_MARKER = 'CHARACTER_REFERENCE:';

export const FORBIDDEN_YOUTUBE_ARTIFACTS = [
  'youtube-shorts.txt',
  'shorts.txt',
  'shorts-metadata.txt',
];
