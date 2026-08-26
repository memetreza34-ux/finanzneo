import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, E, REEL_STYLE, prog} from '../tokens';
import {FONT} from '../fonts';
import {Icon, type IconName} from './Icon';

export type SceneHeaderTone = 'default' | 'positive' | 'warning' | 'money' | 'neutral';

const H = REEL_STYLE.header;

const iconColorForTone = (tone: SceneHeaderTone) => {
  if (tone === 'warning') return C.negativeLt;
  if (tone === 'money') return C.gold;
  if (tone === 'neutral') return C.whiteSoft;
  return H.defaultIconColor;
};

/**
 * Ruhige V5-Zwischenüberschrift mit einfachem Linien-Icon.
 *
 * Kein Chip, keine Capsule, kein Panel: Die Überschrift soll wie normale
 * Typografie wirken und nicht wie ein zusätzliches UI-Element. Die semantische
 * Farbe sitzt primär im Icon; der Text bleibt neutral weiß und damit ruhiger.
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
  const iconColor = iconColorForTone(tone);
  const fittedSize = Math.max(36, title.length > 38 ? size - 6 : title.length > 30 ? size - 3 : size);

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        zIndex: 45,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 4}px)`,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: H.gap,
          maxWidth: '100%',
        }}
      >
        <Icon
          name={icon}
          size={H.iconSize}
          color={iconColor}
          stroke={2.15}
          glow={false}
        />
        <div
          style={{
            minWidth: 0,
            maxWidth: 820,
            fontFamily: FONT.body,
            fontSize: fittedSize,
            fontWeight: H.fontWeight,
            lineHeight: 1.08,
            letterSpacing: 0,
            color: H.headlineColor,
            textTransform: 'none',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: H.textShadow,
            textRendering: 'geometricPrecision',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};
