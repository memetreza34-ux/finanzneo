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
 * Große V5-Zwischenüberschrift mit fest normalisiertem Icon-Slot.
 *
 * WICHTIG FÜR KONSISTENZ:
 * - die gesamte Header-Gruppe wird horizontal zentriert;
 * - Text innerhalb der Gruppe ist linksbündig, damit bei zwei Zeilen die erste
 *   Zeile direkt am Icon beginnt und kein optisch riesiger Abstand entsteht;
 * - das Icon sitzt immer in einem festen H.iconBox und wird vertikal an der
 *   ERSTEN Textzeile ausgerichtet, niemals an der Mitte eines Zweizeilers;
 * - die SVG-Glyphen werden optisch normalisiert, damit unterschiedliche
 *   ViewBox-Füllungen nicht wie unterschiedliche Icon-Größen aussehen.
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
    title.length > 64 ? size - 6 : title.length > 48 ? size - 3 : size,
  );
  const lineHeight = 1.08;
  const firstLineHeight = fittedSize * lineHeight;

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
        data-finanzneo-header-layout="icon-first-line-lock-v1"
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: H.gap,
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            width: H.iconBox,
            height: firstLineHeight,
            flex: `0 0 ${H.iconBox}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name={icon}
            size={H.iconSize}
            color={iconColor}
            stroke={2.15}
            glow={false}
            opticalNormalize
          />
        </div>
        <div
          style={{
            minWidth: 0,
            maxWidth: H.maxWidth,
            fontFamily: FONT.body,
            fontSize: fittedSize,
            fontWeight: H.fontWeight,
            lineHeight,
            letterSpacing: 0,
            color: H.headlineColor,
            textTransform: 'none',
            textAlign: 'left',
            whiteSpace: 'normal',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: H.maxLines,
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
