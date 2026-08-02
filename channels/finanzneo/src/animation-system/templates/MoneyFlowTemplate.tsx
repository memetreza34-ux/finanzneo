import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FlowNode} from '../primitives';

export type MoneyFlowItem = {
  label: string;
  value: string;
  share: number;
};

export type ResolvedMoneyFlowItem = MoneyFlowItem & {
  normalizedShare: number;
};

export type MoneyFlowTemplateProps = {
  incomeLabel?: string;
  incomeValue: string;
  items: MoneyFlowItem[];
  accent?: string;
};

export const normalizeMoneyFlowItems = (
  items: MoneyFlowItem[],
): ResolvedMoneyFlowItem[] => {
  const visibleItems = items.slice(0, 4);
  const safeShares = visibleItems.map((item) =>
    Number.isFinite(item.share) ? Math.max(0, item.share) : 0,
  );
  const total = safeShares.reduce((sum, share) => sum + share, 0);
  const equalShare = visibleItems.length > 0 ? 1 / visibleItems.length : 0;

  return visibleItems.map((item, index) => ({
    ...item,
    normalizedShare: total > 0 ? safeShares[index] / total : equalShare,
  }));
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
  const visibleItems = normalizeMoneyFlowItems(items);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #07120B 0%, #030805 100%)', color: '#F5F7F4', padding: 70, boxSizing: 'border-box'}}>
      <div style={{fontSize: 32, fontWeight: 850, letterSpacing: 3, color: accent}}>GELDFLUSS</div>
      <div style={{fontSize: 70, fontWeight: 950, marginTop: 16}}>Wohin dein Geld jeden Monat fließt</div>

      <div style={{position: 'relative', flex: 1, marginTop: 90}}>
        <FlowNode label={incomeLabel} value={incomeValue} accent={accent} width={330} style={{position: 'absolute', left: 0, top: 300}} />

        {visibleItems.map((item, index) => {
          const y = 40 + index * 230;
          const lineProgress = Math.max(0, Math.min(1, progress * 1.7 - index * 0.18));
          const lineHeight = 6 + item.normalizedShare * 22;
          const itemAccent = index === visibleItems.length - 1 ? '#F2C14E' : accent;
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <div style={{
                position: 'absolute',
                left: 350,
                top: y + 70 - lineHeight / 2,
                width: 300 * lineProgress,
                height: lineHeight,
                borderRadius: 999,
                background: itemAccent,
                transformOrigin: 'left center',
                opacity: lineProgress * (0.58 + item.normalizedShare * 0.42),
                boxShadow: `0 0 ${18 + item.normalizedShare * 22}px ${itemAccent}55`,
              }} />
              <div style={{
                position: 'absolute',
                left: 485,
                top: y + 28,
                fontSize: 20,
                fontWeight: 850,
                color: '#D8E5DB',
                opacity: lineProgress,
              }}>
                {Math.round(item.normalizedShare * 100)} %
              </div>
              <FlowNode
                label={item.label}
                value={item.value}
                startFrame={10 + index * 8}
                accent={itemAccent}
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
