import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, E, REEL_STYLE, a, prog} from '../tokens';
import {FONT} from '../fonts';
import {Icon, type IconName} from './Icon';

export type SceneHeaderTone = 'default' | 'positive' | 'warning' | 'money' | 'neutral';

const H = REEL_STYLE.header;

const toneColor = (tone: SceneHeaderTone) => {
  if (tone === 'warning') return C.negativeLt;
  if (tone === 'money') return C.gold;
  if (tone === 'neutral') return C.white;
  return C.accentLt;
};

/**
 * Zwischenüberschrift mit Linien-Icon — Pflicht in jeder Szene.
 *
 * V2: kompakte Chip-Geometrie und sofortiger Einstieg. Alle Maße stammen aus
 * REEL_STYLE.header, damit Header über alle Reels identisch sitzen.
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
  top = H.top,
  left = H.left,
  right = H.right,
  size = H.fontSize,
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, at, at + H.enterFrames, E.out);
  const accent = toneColor(tone);

  return (
    <div style={{position: 'absolute', top, left, right, zIndex: 45, opacity: enter, transform: `translateY(${(1 - enter) * 5}px)`, pointerEvents: 'none', display: 'flex', justifyContent: 'center'}}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: H.gap,
        maxWidth: '100%',
        padding: '7px 16px 7px 7px',
        borderRadius: 18,
        background: 'rgba(4, 17, 10, 0.78)',
        border: `1px solid ${a(accent, tone === 'neutral' ? 0.18 : 0.30)}`,
        boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
      }}>
        <div style={{
          width: H.iconBox,
          height: H.iconBox,
          borderRadius: 14,
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tone === 'neutral' ? 'rgba(255,255,255,0.08)' : a(accent, 0.12),
          border: `1.5px solid ${tone === 'neutral' ? 'rgba(255,255,255,0.16)' : a(accent, 0.36)}`,
        }}>
          <Icon name={icon} size={H.iconSize} color={accent} stroke={2.1} glow={false} />
        </div>
        <div style={{
          minWidth: 0,
          fontFamily: FONT.title,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: 0.4,
          color: accent,
          textTransform: 'uppercase',
          textShadow: H.textShadow,
          textRendering: 'geometricPrecision',
          WebkitFontSmoothing: 'antialiased',
        }}>
          {title}
        </div>
      </div>
    </div>
  );
};
