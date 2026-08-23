import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, E, a, prog} from '../tokens';
import {FONT} from '../fonts';
import {Icon, type IconName} from './Icon';

export type SceneHeaderTone = 'default' | 'positive' | 'warning' | 'money' | 'neutral';

const toneColor = (tone: SceneHeaderTone) => {
  if (tone === 'warning') return C.negative;
  if (tone === 'money') return C.gold;
  if (tone === 'neutral') return C.white;
  return C.accent;
};

/**
 * Einheitliche Zwischenüberschrift für JEDE Reel-Szene.
 * Icon standardmäßig grün, Text immer weiß. Schwarz auf dunklem Hintergrund ist verboten.
 */
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
  top = 78,
  left = 62,
  right = 150,
  size = 62,
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, at, at + 8, E.out);
  const accent = toneColor(tone);

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 12}px)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 18,
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tone === 'neutral' ? 'rgba(255,255,255,0.10)' : a(accent, 0.14),
          border: `1.5px solid ${tone === 'neutral' ? 'rgba(255,255,255,0.22)' : a(accent, 0.48)}`,
          boxShadow: tone === 'neutral' ? 'none' : `0 0 24px ${a(accent, 0.16)}`,
        }}
      >
        <Icon name={icon} size={34} color={accent} stroke={2.2} glow={tone !== 'neutral'} />
      </div>

      <div
        style={{
          minWidth: 0,
          fontFamily: FONT.title,
          fontSize: size,
          lineHeight: 0.98,
          letterSpacing: 0.6,
          color: C.white,
          textTransform: 'uppercase',
          textShadow: '0 5px 16px rgba(0,0,0,0.72)',
        }}
      >
        {title}
      </div>
    </div>
  );
};
