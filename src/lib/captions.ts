export type CaptionWord = {
  word: string;
  start: number;
  end: number;
};

export type CaptionSentence = {
  text: string;
  start: number;
  end: number;
  words: CaptionWord[];
};

export type FinanzNeoCaptionFile = {
  version: 'finanzneo-caption-v1';
  language: string;
  source: string;
  generatedAt: string;
  duration?: number;
  wordCount?: number;
  fps?: number;
  subtitleMode?: 'sentence-with-audio-synced-active-word';
  activeWordColor?: 'finance-green';
  words: CaptionWord[];
  sentences?: CaptionSentence[];
};

type LegacyCaptionSegment = {
  words?: unknown[];
};

type CaptionObject = {
  words?: unknown[];
  segments?: LegacyCaptionSegment[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toFiniteNumber = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const sanitizeWords = (input: unknown[]): CaptionWord[] => {
  const words: CaptionWord[] = [];

  for (const entry of input) {
    if (!isRecord(entry) || typeof entry.word !== 'string') continue;

    const start = toFiniteNumber(entry.start);
    const end = toFiniteNumber(entry.end);
    const word = entry.word.trim();

    if (!word || start === null || end === null || start < 0 || end < start) continue;
    words.push({word, start, end});
  }

  return words.sort((a, b) => a.start - b.start || a.end - b.end);
};

/** Unterstützt alte Arrays, Whisper-Segmente und FinanzNeo v1. */
export const normalizeCaptionData = (input: unknown): CaptionWord[] => {
  if (Array.isArray(input)) return sanitizeWords(input);
  if (!isRecord(input)) return [];

  const object = input as CaptionObject;

  if (Array.isArray(object.words)) return sanitizeWords(object.words);

  if (Array.isArray(object.segments)) {
    return sanitizeWords(
      object.segments.flatMap((segment) =>
        segment && Array.isArray(segment.words) ? segment.words : [],
      ),
    );
  }

  return [];
};

export const normalizeCaptionSentences = (input: unknown): CaptionSentence[] => {
  if (!isRecord(input) || !Array.isArray(input.sentences)) return [];

  return input.sentences.flatMap((entry) => {
    if (!isRecord(entry) || typeof entry.text !== 'string' || !Array.isArray(entry.words)) return [];
    const words = sanitizeWords(entry.words);
    const text = entry.text.trim();
    const start = toFiniteNumber(entry.start);
    const end = toFiniteNumber(entry.end);
    if (!text || words.length === 0 || start === null || end === null || start < 0 || end < start) return [];
    return [{text, start, end, words}];
  });
};

const lineText = (words: CaptionWord[]): string => words.map((word) => word.word).join(' ');

export const splitCaptionLines = (
  words: CaptionWord[],
  limits: {singleLineMaxCharacters: number; maxCharactersPerLine: number},
): CaptionWord[][] => {
  if (words.length <= 1 || lineText(words).length <= limits.singleLineMaxCharacters) return [words];

  let bestSplit = 1;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let split = 1; split < words.length; split += 1) {
    const firstLength = lineText(words.slice(0, split)).length;
    const secondLength = lineText(words.slice(split)).length;
    const overflow = Math.max(0, firstLength - limits.maxCharactersPerLine)
      + Math.max(0, secondLength - limits.maxCharactersPerLine);
    const score = overflow * 1000 + Math.abs(firstLength - secondLength);
    if (score < bestScore) {
      bestScore = score;
      bestSplit = split;
    }
  }

  return [words.slice(0, bestSplit), words.slice(bestSplit)];
};

export const validateCaptionSentences = (
  sentences: CaptionSentence[],
  limits: {
    maxWords: number;
    maxCharacters: number;
    singleLineMaxCharacters?: number;
    maxCharactersPerLine?: number;
  },
): string[] => {
  const errors: string[] = [];

  sentences.forEach((sentence, index) => {
    const label = `Untertitelsatz ${index + 1}`;
    if (!sentence.text.trim()) errors.push(`${label} ist leer.`);
    if (sentence.words.length === 0) errors.push(`${label} besitzt keine Wortzeiten.`);
    if (sentence.words.length > limits.maxWords) {
      errors.push(`${label} hat ${sentence.words.length} Wörter; erlaubt sind höchstens ${limits.maxWords}.`);
    }
    if (sentence.text.length > limits.maxCharacters) {
      errors.push(`${label} hat ${sentence.text.length} Zeichen; erlaubt sind höchstens ${limits.maxCharacters}.`);
    }
    if (limits.singleLineMaxCharacters !== undefined && limits.maxCharactersPerLine !== undefined) {
      const lines = splitCaptionLines(sentence.words, {
        singleLineMaxCharacters: limits.singleLineMaxCharacters,
        maxCharactersPerLine: limits.maxCharactersPerLine,
      });
      const longestLine = Math.max(...lines.map((line) => lineText(line).length));
      if (longestLine > limits.maxCharactersPerLine) {
        errors.push(`${label} erzeugt eine Zeile mit ${longestLine} Zeichen; erlaubt sind höchstens ${limits.maxCharactersPerLine}.`);
      }
    }
    if (!Number.isFinite(sentence.start) || !Number.isFinite(sentence.end) || sentence.start < 0 || sentence.end < sentence.start) {
      errors.push(`${label} besitzt ungültige Satzzeiten.`);
    }
  });

  return errors;
};

export const clipCaptionWords = (
  words: CaptionWord[],
  options: {startAt?: number; endAt?: number} = {},
): CaptionWord[] => {
  const {startAt = 0, endAt = Number.POSITIVE_INFINITY} = options;

  return words
    .filter((word) => word.end >= startAt && word.start < endAt)
    .map((word) => ({
      ...word,
      start: Math.max(0, word.start - startAt),
      end: Math.max(0, Math.min(word.end, endAt) - startAt),
    }));
};
