import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FinanceBackground, FONT, REEL_LAYOUT} from '../../design-system';

export type ReelCoverProps = {
  imageSrc: string;
  eyebrow?: string;
  headline: string;
  accentLine: string;
  payoff: string;
};

export const ReelCover: React.FC<ReelCoverProps> = ({
  imageSrc,
  eyebrow = 'FINANZNEO',
  headline,
  accentLine,
  payoff,
}) => (
  <AbsoluteFill style={{backgroundColor: C.bgDeep, overflow: 'hidden'}}>
    <FinanceBackground variant="premium" />
    <div style={{
      position: 'absolute',
      top: REEL_LAYOUT.platformSafeArea.top,
      left: REEL_LAYOUT.platformSafeArea.left,
      right: REEL_LAYOUT.platformSafeArea.right,
      zIndex: 3,
    }}>
      <div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, letterSpacing: 3, color: C.accent}}>
        {eyebrow}
      </div>
      <div style={{marginTop: 44, fontFamily: FONT.title, fontSize: 112, lineHeight: 0.88, color: C.white}}>
        {headline}
      </div>
      <div style={{marginTop: 18, fontFamily: FONT.title, fontSize: 96, lineHeight: 0.92, color: C.accent}}>
        {accentLine}
      </div>
    </div>
    <Img src={staticFile(imageSrc)} style={{
      position: 'absolute',
      top: 500,
      left: 0,
      width: 1080,
      height: 1030,
      objectFit: 'contain',
      filter: 'drop-shadow(0 34px 54px rgba(0,0,0,0.48))',
    }} />
    <div style={{
      position: 'absolute',
      left: REEL_LAYOUT.platformSafeArea.left,
      right: REEL_LAYOUT.platformSafeArea.right,
      bottom: REEL_LAYOUT.platformSafeArea.bottom,
      padding: '24px 28px',
      borderRadius: 24,
      background: 'rgba(5,16,10,0.92)',
      border: `1px solid ${C.accent}66`,
      color: C.white,
      fontFamily: FONT.body,
      fontSize: 38,
      fontWeight: 900,
      lineHeight: 1.08,
      textAlign: 'center',
    }}>
      {payoff}
    </div>
  </AbsoluteFill>
);
