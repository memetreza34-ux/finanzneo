import fs from 'node:fs';

const captionsPath = 'reels/2026-08-10_bis_2026-08-16/dienstag/reel-01_zinseszins-zeit/02-audio/finanzneo_captions.json';
const outputPath = 'reels/2026-08-10_bis_2026-08-16/dienstag/reel-01_zinseszins-zeit/04-caption/word-timings.json';

const whisperData = JSON.parse(fs.readFileSync(captionsPath, 'utf8'));
const whisperWords = whisperData.words; // {word, start, end}

let sentences = [];
let currentBlockWords = [];
let currentBlockLength = 0;
let blockIndex = 1;

const flushBlock = () => {
    if (currentBlockWords.length === 0) return;
    const text = currentBlockWords.map(w => w.word).join(' ');
    
    // We only need frames for the actual words
    // Let's gather the start frames and the very last end frame
    let frames = currentBlockWords.map(w => Math.round(w.start * 30));
    frames.push(Math.round(currentBlockWords[currentBlockWords.length - 1].end * 30));
    
    sentences.push({
        id: `sentence-${String(blockIndex).padStart(2, '0')}`,
        text: text,
        frames: frames
    });
    
    blockIndex++;
    currentBlockWords = [];
    currentBlockLength = 0;
};

for (let i = 0; i < whisperWords.length; i++) {
    const w = whisperWords[i];
    const wordClean = w.word.trim();
    
    currentBlockWords.push(w);
    currentBlockLength += wordClean.length + (currentBlockWords.length > 1 ? 1 : 0);
    
    const isPunctuation = /[.?!:,;]/.test(wordClean);
    const hasPause = i < whisperWords.length - 1 && (whisperWords[i+1].start - w.end) > 0.4;
    
    // Check if adding next word would exceed limits
    let nextExceeds = false;
    if (i < whisperWords.length - 1) {
        const nextWord = whisperWords[i+1].word.trim();
        if (currentBlockWords.length + 1 > 12 || currentBlockLength + 1 + nextWord.length > 68) {
            nextExceeds = true;
        }
    }
    
    // Flush if:
    // 1. Next word would exceed limits
    // 2. Or we hit a natural pause/punctuation AND we have a decent chunk (e.g. > 3 words) to avoid too many tiny chunks
    // 3. Or it's the absolute end
    if (nextExceeds || (isPunctuation && currentBlockWords.length >= 4) || hasPause || i === whisperWords.length - 1) {
        flushBlock();
    }
}

const wordTimingsTemplate = {
  "version": 3,
  "fps": 30,
  "subtitleMode": "sentence-with-audio-synced-active-word",
  "activeWordColor": "finance-green",
  "timingStatus": "final-audio-aligned",
  "timingMethod": "real-word-boundaries-required",
  "rules": {
    "preferredSentencesVisible": 1,
    "maxSentencesVisible": 1,
    "maxLines": 2,
    "sentenceSwitch": "next-sentence-first-word-start",
    "holdPreviousSentenceDuringShortPause": true,
    "equalWordSpacingForbidden": true,
    "opaqueCaptionCardForbidden": true
  },
  "sentences": sentences
};

fs.writeFileSync(outputPath, JSON.stringify(wordTimingsTemplate, null, 2) + '\n');
console.log('Successfully aligned words to strict V17 caption blocks!');
