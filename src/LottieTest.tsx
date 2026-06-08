import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, Background } from './brand';
import { LottieBox } from './brand/components/Lottie';

const IDS = ['warnung', 'konfetti', 'lupe', 'warenkorb'];

// Test-Raster: zeigt alle geladenen Lottie-Animationen mit ID-Label.
export const LottieTest: React.FC = () => (
  <AbsoluteFill>
    <Background grid={false} glow />
    <div style={{ position: 'absolute', top: 60, width: '100%', textAlign: 'center',
      fontFamily: FONT.title, fontSize: 90, color: C.white }}>LOTTIE TEST</div>
    <div style={{ position: 'absolute', top: 240, left: 60, right: 60,
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      {IDS.map((id) => (
        <div key={id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'rgba(255,255,255,0.04)', border: `2px solid ${C.accent}44`,
          borderRadius: 24, padding: 20 }}>
          <LottieBox file={`lottie/${id}.json`} size={360} />
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 30, color: C.accent, marginTop: 8 }}>{id}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
