import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'repeat-purchase-cost';
export const VISUAL_TECHNIQUE_ID = 'two-purchases-vs-one';
export const COMPOSITION_FAMILY_ID = 'comparison-math';
export const RESULT_HOLD_FRAMES = 45;
export const ANIMATION_NARRATIVE = {
  START: 'Nur der erste Kauf mit 20 € ist sichtbar.',
  MECHANISM: 'Ein zweiter 20-€-Kauf kommt hinzu und erhöht die Gesamtausgabe auf 40 €.',
  RESULT: '40 € steht klar 35 € gegenüber.',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const resultStart = Math.max(72, durationInFrames - RESULT_HOLD_FRAMES);
  const secondStart = Math.round(resultStart * 0.34);
  const sumStart = Math.round(resultStart * 0.56);
  const compareStart = Math.round(resultStart * 0.76);

  const second = interpolate(frame, [secondStart, secondStart + 12], [0, 1], clamp);
  const sum = interpolate(frame, [sumStart, sumStart + 12], [0, 1], clamp);
  const compare = interpolate(frame, [compareStart, resultStart], [0, 1], clamp);

  return (
    <YouTubeSectionFrame title="Wenn billig zweimal kostet" icon="repeat">
      <AbsoluteFill style={{padding: '54px 72px', boxSizing: 'border-box', fontFamily: 'Arial', color: '#F4F0E8'}}>
        <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34}}>
          <div style={{width: 560, border: '2px solid #303030', borderRadius: 28, padding: '38px 42px', boxSizing: 'border-box'}}>
            <div style={{fontSize: 28, color: '#A7A7A7', marginBottom: 30}}>Günstiges Paar</div>

            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{fontSize: 64, fontWeight: 800}}>20 €</div>
              <div style={{fontSize: 34, color: '#A7A7A7', opacity: second}}>+</div>
              <div style={{fontSize: 64, fontWeight: 800, opacity: second, transform: `translateY(${(1 - second) * 12}px)`}}>20 €</div>
            </div>

            <div style={{height: 2, background: '#303030', margin: '30px 0 24px', opacity: sum}} />
            <div style={{fontSize: 30, color: '#A7A7A7', opacity: sum}}>Gesamt</div>
            <div style={{fontSize: 82, fontWeight: 900, color: '#E66B4E', opacity: sum}}>40 €</div>
          </div>

          <div style={{fontSize: 46, color: '#666', opacity: compare}}>vs.</div>

          <div style={{width: 430, border: '2px solid #303030', borderRadius: 28, padding: '38px 42px', boxSizing: 'border-box', opacity: compare}}>
            <div style={{fontSize: 28, color: '#A7A7A7', marginBottom: 54}}>Einmaliger Beispielkauf</div>
            <div style={{fontSize: 82, fontWeight: 900, color: '#2FCB8B'}}>35 €</div>
          </div>
        </div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
