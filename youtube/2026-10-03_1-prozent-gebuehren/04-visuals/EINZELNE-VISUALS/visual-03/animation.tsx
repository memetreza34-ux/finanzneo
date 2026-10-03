import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'fee-slice-extraction-v1';
export const VISUAL_TECHNIQUE_ID = 'react-fee-slice-transfer-v1';
export const COMPOSITION_FAMILY_ID = 'physical-process';

export const ANIMATION_NARRATIVE = {
  START: 'Ein wachsendes Depot wirkt nahezu unberührt.',
  MECHANISM: 'Bei jedem Jahresschritt löst sich ein kleiner roter Kostenanteil und wandert aus dem Depot heraus.',
  RESULT: 'Die Summe der entnommenen Kosten bleibt sichtbar und macht den dauerhaften Renditeabfluss verständlich.',
};

const years = [1, 5, 10, 15, 20, 25, 30];

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const activeIndex = Math.min(years.length - 1, Math.floor(progress * years.length));
  const portfolioHeight = interpolate(progress, [0, 1], [220, 520]);
  const feeHeight = interpolate(progress, [0, 1], [8, 120]);

  return (
    <AbsoluteFill style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 120, height: 620}}>
        <div style={{width: 360, position: 'relative', height: 560, display: 'flex', alignItems: 'flex-end'}}>
          <div
            style={{
              width: '100%',
              height: portfolioHeight,
              borderRadius: 36,
              background: 'linear-gradient(180deg, #1ED79B 0%, #0E7C5A 100%)',
              boxShadow: '0 22px 70px rgba(30,215,155,0.22)',
            }}
          />
          <div style={{position: 'absolute', top: 6, left: 0, right: 0, textAlign: 'center', color: '#F4F1E8', fontSize: 42, fontWeight: 700}}>
            Depot
          </div>
          {years.map((year, index) => {
            const local = interpolate(progress, [index / years.length, (index + 0.75) / years.length], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const x = interpolate(local, [0, 1], [0, 480]);
            const y = interpolate(local, [0, 1], [0, -70 + index * 16]);
            const opacity = index <= activeIndex ? 1 : 0;
            return (
              <div
                key={year}
                style={{
                  position: 'absolute',
                  left: 310,
                  bottom: 60 + index * 52,
                  width: 76,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#FF6B45',
                  opacity,
                  transform: `translate(${x}px, ${y}px)`,
                  boxShadow: '0 8px 20px rgba(255,107,69,0.28)',
                }}
              />
            );
          })}
        </div>
        <div style={{width: 260, height: 560, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center'}}>
          <div style={{color: '#FFB7A6', fontSize: 34, fontWeight: 700, marginBottom: 18}}>laufende Kosten</div>
          <div
            style={{
              width: 220,
              height: feeHeight,
              minHeight: 26,
              borderRadius: 28,
              backgroundColor: '#FF6B45',
              boxShadow: '0 18px 50px rgba(255,107,69,0.25)',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
