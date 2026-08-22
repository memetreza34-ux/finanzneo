import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, REEL_CAPTION, REEL_LAYOUT} from '../tokens';
import {FONT} from '../fonts';
import type {CaptionSentence, CaptionWord} from '../../lib/captions';
import {validateCaptionSentences} from '../../lib/captions';

export type {CaptionSentence, CaptionWord} from '../../lib/captions';

const separatorFor = (word: string, index: number): string => {
  if (index === 0 || /^[,.;:!?%)\]}»”]/.test(word)) return '';
  return ' ';
};

const fontSizeFor = (text: string): number => {
  if (text.length <= 42) return 52;
  if (text.length <= 58) return 46;
  return 42;
};

export const SentenceKaraokeCaptions: React.FC<{
  sentences: CaptionSentence[];
}> = ({sentences}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const validationErrors = validateCaptionSentences(sentences, REEL_CAPTION);

  if (validationErrors.length > 0) {
    throw new Error(`Unsicheres FinanzNeo-Untertitel-Layout:\n${validationErrors.join('\n')}`);
  }

  const index = sentences.findIndex((sentence, sentenceIndex) => {
    const nextStart = sentences[sentenceIndex + 1]?.start ?? sentence.end + 0.35;
    return time >= sentence.start && time < nextStart;
  });

  if (index < 0) return null;
  const sentence = sentences[index];
  const fontSize = fontSizeFor(sentence.text);

  return (
    <div style={{
      position: 'absolute',
      top: REEL_LAYOUT.caption.top,
      left: REEL_LAYOUT.caption.left,
      right: REEL_LAYOUT.caption.right,
      zIndex: 50,
      textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-block',
        maxWidth: '100%',
        padding: '18px 24px',
        borderRadius: 24,
        background: 'rgba(4,12,8,0.92)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 22px 64px rgba(0,0,0,0.48)',
        color: C.white,
        fontFamily: FONT.body,
        fontSize,
        fontWeight: 900,
        lineHeight: 1.12,
        letterSpacing: -0.3,
        textWrap: 'balance',
      }}>
        {sentence.words.map((word: CaptionWord, wordIndex) => {
          const active = time >= word.start && time < word.end;
          return (
            <React.Fragment key={`${word.start}-${wordIndex}`}>
              <span>{separatorFor(word.word, wordIndex)}</span>
              <span style={{
                color: active ? C.accent : C.white,
                textShadow: active
                  ? `0 0 20px ${C.accent}66`
                  : '0 3px 12px rgba(0,0,0,0.72)',
              }}>
                {word.word}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Alte Importnamen bleiben kompatibel, verwenden aber dieselbe Satz-Runtime.
export const Captions = SentenceKaraokeCaptions;
export const CaptionsBoxed = SentenceKaraokeCaptions;
