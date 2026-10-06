import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'true-cost-takeaway';
export const VISUAL_TECHNIQUE_ID = 'factor-to-total-schema';
export const COMPOSITION_FAMILY_ID = 'summary-schema';
export const RESULT_HOLD_FRAMES = 45;
export const ANIMATION_NARRATIVE = {
  START: 'Nur der Kaufpreis ist als erster Kostenfaktor sichtbar.',
  MECHANISM: 'Nutzung, Haltbarkeit und Reparierbarkeit kommen nacheinander hinzu.',
  RESULT: 'Alle vier Faktoren führen gemeinsam zu den echten Kosten.',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const resultStart = Math.max(96, durationInFrames - RESULT_HOLD_FRAMES);
  const factorStarts = [
    0,
    Math.round(resultStart * 0.26),
    Math.round(resultStart * 0.46),
    Math.round(resultStart * 0.64),
  ];
  const resultReveal = Math.round(resultStart * 0.82);
  const factors = ['Kaufpreis', 'Nutzung', 'Haltbarkeit', 'Reparierbarkeit'];

  return (
    <YouTubeSectionFrame title="Was wirklich zählt" icon="target">
      <AbsoluteFill style={{padding: '62px 76px', boxSizing: 'border-box', fontFamily: 'Arial', color: '#F4F0E8', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, width: 880}}>
            {factors.map((factor, i) => {
              const p = i === 0 ? 1 : interpolate(frame, [factorStarts[i], factorStarts[i] + 12], [0, 1], clamp);
              return (
                <div key={factor} style={{
                  minHeight: 120,
                  border: '2px solid #303030',
                  borderRadius: 22,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 28px',
                  fontSize: 34,
                  fontWeight: 750,
                  opacity: p,
                  transform: `translateY(${(1-p)*10}px)`,
                }}>
                  <span style={{color: '#2FCB8B', marginRight: 18, fontWeight: 900}}>+</span>
                  {factor}
                </div>
              );
            })}
          </div>

          <div style={{fontSize: 54, color: '#666', opacity: interpolate(frame, [resultReveal - 8, resultReveal + 6], [0, 1], clamp)}}>→</div>

          <div style={{
            width: 430,
            minHeight: 260,
            borderRadius: 28,
            border: '2px solid #2FCB8B',
            background: '#07110D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(frame, [resultReveal, resultStart], [0, 1], clamp),
          }}>
            <div style={{fontSize: 30, color: '#A7A7A7', marginBottom: 18}}>Zusammen ergibt das</div>
            <div style={{fontSize: 58, lineHeight: 1.05, textAlign: 'center', fontWeight: 900, color: '#2FCB8B'}}>ECHTE<br/>KOSTEN</div>
          </div>
        </div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
