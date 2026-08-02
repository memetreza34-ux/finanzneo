import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FlowNode} from '../primitives';

export type MoneyFlowItem = {
  label: string;
  value: string;
  share: number;
};

export type MoneyFlowTemplateProps = {
  incomeLabel?: string;
  incomeValue: string;
  items: MoneyFlowItem[];
  accent?: string;
};

export const MoneyFlowTemplate: React.FC<MoneyFlowTemplateProps> = ({
  incomeLabel = 'Gehalt',
  incomeValue,
  items,
  accent = '#5CFF9A',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #07120B 0%, #030805 100%)', color: '#F5F7F4', padding: 70, boxSizing: 'border-box'}}>
      <div style={{fontSize: 32, fontWeight: 850, letterSpacing: 3, color: accent}}>GELDFLUSS</div>
      <div style={{fontSize: 70, fontWeight: 950, marginTop: 16}}>Wohin dein Geld jeden Monat fließt</div>

      <div style={{position: 'relative', flex: 1, marginTop: 90}}>
        <FlowNode label={incomeLabel} value={incomeValue} accent={accent} width={330} style={{position: 'absolute', left: 0, top: 300}} />

        {items.slice(0, 4).map((item, index) => {
          const y = 40 + index * 230;
          const lineProgress = Math.max(0, Math.min(1, progress * 1.7 - index * 0.18));
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <div style={{
                position: 'absolute', left: 350, top: y + 66, width: 300 * lineProgress,
                height: 8, borderRadius: 999, background: accent,
                transformOrigin: 'left center', opacity: lineProgress,
                boxShadow: '0 0 24px rgba(92,255,154,0.28)',
              }} />
              <FlowNode
                label={item.label}
                value={item.value}
                startFrame={10 + index * 8}
                accent={index === items.length - 1 ? '#F2C14E' : accent}
                width={330}
                style={{position: 'absolute', right: 0, top: y}}
              />
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
