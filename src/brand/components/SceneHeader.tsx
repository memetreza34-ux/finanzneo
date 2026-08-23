import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, E, a, prog} from '../tokens';
import {FONT} from '../fonts';
import {Icon, type IconName} from './Icon';

export type SceneHeaderTone = 'default' | 'positive' | 'warning' | 'money' | 'neutral';

const toneColor = (tone: SceneHeaderTone) => {
  if (tone === 'warning') return C.negativeLt;
  if (tone === 'money') return C.gold;
  if (tone === 'neutral') return C.white;
  return C.accentLt;
};

export const SceneHeader: React.FC<{
  title: string;
  icon: IconName;
  tone?: SceneHeaderTone;
  at?: number;
  top?: number;
  left?: number;
  right?: number;
  size?: number;
}> = ({
  title,
  icon,
  tone = 'default',
  at = 0,
  top = 118,
  left = 72,
  right = 140,
  size = 54,
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, at, at + 7, E.out);
  const accent = toneColor(tone);

  return (
    <div style={{position: 'absolute', top, left, right, zIndex: 45, opacity: enter, transform: `translateY(${(1 - enter) * 8}px)`, pointerEvents: 'none'}}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        maxWidth: '100%',
        padding: '9px 18px 9px 9px',
        borderRadius: 22,
        background: 'rgba(3, 16, 9, 0.80)',
        border: `1px solid ${a(accent, tone === 'neutral' ? 0.20 : 0.34)}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      }}>
        <div style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tone === 'neutral' ? 'rgba(255,255,255,0.09)' : a(accent, 0.13),
          border: `1.5px solid ${tone === 'neutral' ? 'rgba(255,255,255,0.18)' : a(accent, 0.40)}`,
        }}>
          <Icon name={icon} size={31} color={accent} stroke={2.15} glow={false} />
        </div>
        <div style={{
          minWidth: 0,
          fontFamily: FONT.title,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: 0.2,
          color: C.white,
          textTransform: 'uppercase',
          textShadow: '0 2px 1px rgba(0,0,0,0.92)',
          textRendering: 'geometricPrecision',
          WebkitFontSmoothing: 'antialiased',
        }}>
          {title}
        </div>
      </div>
    </div>
  );
};
