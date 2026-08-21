export type CaptionWord = {
  word: string;
  start: number;
  end: number;
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
  sentences?: Array<{
    text: string;
    start: number;
    end: number;
    words: CaptionWord[];
  }>;
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
