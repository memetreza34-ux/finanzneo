import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'cost-per-use-example';
export const VISUAL_TECHNIQUE_ID = 'sequential-unit-cost-comparison';
export const COMPOSITION_FAMILY_ID = 'data-comparison';
export const RESULT_HOLD_FRAMES = 45;
export const ANIMATION_NARRATIVE = {
  START: 'Die erste Beispielrechnung 40 € geteilt durch 200 Nutzungen wird gezeigt.',
  MECHANISM: 'Danach folgt getrennt die zweite Rechnung 20 € geteilt durch 50 Nutzungen.',
  RESULT: '0,20 € und 0,40 € pro Nutzung stehen groß im direkten Vergleich.',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const YouTubeVisual06Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const resultStart = Math.max(96, durationInFrames - RESULT_HOLD_FRAMES);
  const firstResultAt = Math.round(resultStart * 0.28);
  const secondStart = Math.round(resultStart * 0.42);
  const secondResultAt = Math.round(resultStart * 0.66);
  const compareAt = Math.round(resultStart * 0.82);

  const firstResult = interpolate(frame, [firstResultAt, firstResultAt + 12], [0, 1], clamp);
  const second = interpolate(frame, [secondStart, secondStart + 12], [0, 1], clamp);
  const secondResult = interpolate(frame, [secondResultAt, secondResultAt + 12], [0, 1], clamp);
  const compare = interpolate(frame, [compareAt, resultStart], [0, 1], clamp);

  return (
    <YouTubeSectionFrame title="Kosten pro Nutzung" icon="calculator">
      <AbsoluteFill style={{padding: '50px 76px', boxSizing: 'border-box', fontFamily: 'Arial', color: '#F4F0E8'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          <div style={{border: '2px solid #303030', borderRadius: 24, padding: '26px 34px', display: 'grid', gridTemplateColumns: '180px 1fr 80px 1fr', alignItems: 'center'}}>
            <div style={{fontSize: 30, color: '#A7A7A7'}}>Beispiel A</div>
            <div style={{fontSize: 50, fontWeight: 800}}>40 € ÷ 200</div>
            <div style={{fontSize: 38, color: '#777', opacity: firstResult}}>=</div>
            <div style={{fontSize: 54, fontWeight: 900, color: '#2FCB8B', opacity: firstResult}}>0,20 €</div>
          </div>

          <div style={{border: '2px solid #303030', borderRadius: 24, padding: '26px 34px', display: 'grid', gridTemplateColumns: '180px 1fr 80px 1fr', alignItems: 'center', opacity: second, transform: `translateY(${(1-second)*12}px)`}}>
            <div style={{fontSize: 30, color: '#A7A7A7'}}>Beispiel B</div>
            <div style={{fontSize: 50, fontWeight: 800}}>20 € ÷ 50</div>
            <div style={{fontSize: 38, color: '#777', opacity: secondResult}}>=</div>
            <div style={{fontSize: 54, fontWeight: 900, color: '#E66B4E', opacity: secondResult}}>0,40 €</div>
          </div>
        </div>

        <div style={{
          marginTop: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          opacity: compare,
          transform: `translateY(${(1-compare)*10}px)`,
        }}>
          <div style={{fontSize: 66, fontWeight: 900, color: '#2FCB8B'}}>0,20 €</div>
          <div style={{fontSize: 30, color: '#A7A7A7'}}>pro Nutzung</div>
          <div style={{fontSize: 42, color: '#555'}}>&lt;</div>
          <div style={{fontSize: 66, fontWeight: 900, color: '#E66B4E'}}>0,40 €</div>
        </div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
