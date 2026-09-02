import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, E, a, prog} from '../tokens';
import {FONT} from '../fonts';
import {Icon, type IconName} from './Icon';

export type MechanismCueTone = 'neutral' | 'positive' | 'warning' | 'money';

const colorForTone = (tone: MechanismCueTone) => {
  if (tone === 'warning') return C.negative;
  if (tone === 'money') return C.gold;
  if (tone === 'positive') return C.accent;
  return C.white;
};

const iconForTone: Record<MechanismCueTone, IconName> = {
  neutral: 'target',
  positive: 'check',
  warning: 'cross',
  money: 'euro',
};

/**
 * Kleine Klarheitsmarke für Start → Prozess → Ergebnis.
 * Alle Texte bleiben auf dunklem Hintergrund weiß/grün/rot/gold – niemals schwarz.
 */
export const MechanismCue: React.FC<{
  label: string;
  value?: string;
  tone?: MechanismCueTone;
  icon?: IconName;
  at?: number;
  x?: number;
  y?: number;
}> = ({
  label,
  value,
  tone = 'neutral',
  icon,
  at = 0,
  x = 72,
  y = 300,
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, at, at + 7, E.out);
  const accent = colorForTone(tone);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        borderRadius: 18,
        background: 'rgba(6, 20, 12, 0.72)',
        border: `1.5px solid ${tone === 'neutral' ? 'rgba(255,255,255,0.18)' : a(accent, 0.42)}`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.22)`,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 10}px)`,
      }}
    >
      <Icon name={icon ?? iconForTone[tone]} size={30} color={accent} stroke={2.2} glow={tone !== 'neutral'} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
        <span
          style={{
            fontFamily: FONT.body,
            fontWeight: 800,
            fontSize: 28,
            color: C.white,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
          }}
        >
          {label}
        </span>
        {value ? (
          <span
            style={{
              fontFamily: FONT.body,
              fontWeight: 900,
              fontSize: 31,
              color: accent,
              textShadow: tone === 'neutral' ? 'none' : `0 0 16px ${a(accent, 0.24)}`,
            }}
          >
            {value}
          </span>
        ) : null}
      </div>
    </div>
  );
};
