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
 * Große, gut lesbare V5-Zwischenüberschrift mit einfachem Linien-Icon.
 *
 * Kein Chip, keine Capsule, kein Panel: Die Überschrift wirkt wie normale
 * Titeltypografie. Der Text bleibt reines Weiß; semantische Farbe sitzt primär
 * im Icon. Lange Titel dürfen moderat kleiner werden, aber niemals auf eine
 * kleine Label-Größe schrumpfen.
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
  const fittedSize = Math.max(
    H.minFontSize,
    title.length > 40 ? size - 8 : title.length > 32 ? size - 4 : size,
  );

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
            maxWidth: H.maxWidth,
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
