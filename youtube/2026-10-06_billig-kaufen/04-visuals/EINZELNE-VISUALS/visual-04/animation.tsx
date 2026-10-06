import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'three-buying-questions';
export const VISUAL_TECHNIQUE_ID = 'three-step-decision-schema';
export const COMPOSITION_FAMILY_ID = 'decision-framework';
export const RESULT_HOLD_FRAMES = 45;
export const ANIMATION_NARRATIVE = {
  START: 'Nur die Frage nach der Nutzung ist sichtbar.',
  MECHANISM: 'Ersatzrisiko und Reparierbarkeit werden nacheinander ergänzt.',
  RESULT: 'Alle drei Fragen bilden eine klare Entscheidungsfolge.',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const YouTubeVisual04Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const resultStart = Math.max(78, durationInFrames - RESULT_HOLD_FRAMES);
  const reveal2 = Math.round(resultStart * 0.36);
  const reveal3 = Math.round(resultStart * 0.64);

  const steps = [
    {n: '1', label: 'Wie oft nutze ich es?', start: 0},
    {n: '2', label: 'Muss ich es wahrscheinlich ersetzen?', start: reveal2},
    {n: '3', label: 'Kann ich es reparieren?', start: reveal3},
  ];

  return (
    <YouTubeSectionFrame title="Drei Fragen vor dem Kauf" icon="list">
      <AbsoluteFill style={{padding: '70px 86px', boxSizing: 'border-box', fontFamily: 'Arial', color: '#F4F0E8', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'stretch', gap: 22}}>
          {steps.map((step, i) => {
            const p = i === 0 ? 1 : interpolate(frame, [step.start, step.start + 14], [0, 1], clamp);
            return (
              <React.Fragment key={step.n}>
                <div style={{
                  flex: 1,
                  minHeight: 290,
                  border: '2px solid #303030',
                  borderRadius: 26,
                  padding: '30px 28px',
                  boxSizing: 'border-box',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 16}px)`,
                }}>
                  <div style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    background: '#2FCB8B',
                    color: '#07110D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 900,
                    marginBottom: 34,
                  }}>{step.n}</div>
                  <div style={{fontSize: 36, lineHeight: 1.18, fontWeight: 750}}>{step.label}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{alignSelf: 'center', fontSize: 42, color: '#5B5B5B', opacity: i === 0 ? interpolate(frame, [reveal2 - 8, reveal2 + 6], [0, 1], clamp) : interpolate(frame, [reveal3 - 8, reveal3 + 6], [0, 1], clamp)}}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
