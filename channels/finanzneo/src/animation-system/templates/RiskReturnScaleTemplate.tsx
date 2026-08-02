import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type RiskReturnScaleTemplateProps = {
  risk: number;
  returnPotential: number;
  riskLabel?: string;
  returnLabel?: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const RiskReturnScaleTemplate: React.FC<RiskReturnScaleTemplateProps> = ({
  risk,
  returnPotential,
  riskLabel = 'Risiko',
  returnLabel = 'Renditechance',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames * 0.8)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const riskProgress = clamp01(risk) * progress;
  const returnProgress = clamp01(returnPotential) * progress;

  return (
    <AbsoluteFill style={{padding: 72, background: '#07120B', color: '#F5F7F4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 34, fontWeight: 850, color: '#5CFF9A', letterSpacing: 2}}>Risiko und Rendite</div>
      <div style={{marginTop: 90, display: 'grid', gap: 54}}>
        {[
          {label: riskLabel, value: riskProgress, color: '#FF6B6B'},
          {label: returnLabel, value: returnProgress, color: '#5CFF9A'},
        ].map((item) => (
          <div key={item.label}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 32, fontWeight: 800}}>
              <span>{item.label}</span>
              <span>{Math.round(item.value * 100)} %</span>
            </div>
            <div style={{height: 42, borderRadius: 999, background: 'rgba(255,255,255,0.1)', marginTop: 18, overflow: 'hidden'}}>
              <div style={{width: `${item.value * 100}%`, height: '100%', borderRadius: 999, background: item.color, boxShadow: `0 0 34px ${item.color}55`}} />
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 126, fontSize: 29, lineHeight: 1.35, color: '#AFC0B4', textAlign: 'center'}}>
        Höhere Renditechancen können mit stärkeren Schwankungen verbunden sein.
      </div>
    </AbsoluteFill>
  );
};
