import React from 'react';
import {C, FONT, a} from '../../../brand';

// Visualzonen-Werte kommen zentral aus REEL_STYLE (src/brand/tokens.ts).
export {VISUAL_TOP, VISUAL_BOTTOM, VISUAL_CENTER_Y} from '../../../brand';

export const Chip: React.FC<{
  label: string;
  tone?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({label, tone = C.white, size = 28, style}) => (
  <div
    style={{
      padding: '10px 20px',
      borderRadius: 16,
      background: 'rgba(3, 16, 9, 0.80)',
      border: `1.5px solid ${a(tone, 0.42)}`,
      color: tone,
      fontFamily: FONT.body,
      fontWeight: 800,
      fontSize: size,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      textShadow: '0 2px 7px rgba(0,0,0,0.55)',
      ...style,
    }}
  >
    {label}
  </div>
);

export const Block: React.FC<{
  w: number;
  h: number;
  tone?: string;
  fill?: number;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({w, h, tone = C.white, fill = 0.12, radius = 24, style, children}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: radius,
      background: a(tone, fill),
      border: `2px solid ${a(tone, 0.5)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 14px 30px rgba(0,0,0,0.22)',
      ...style,
    }}
  >
    {children}
  </div>
);

