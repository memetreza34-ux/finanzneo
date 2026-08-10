// ════════════════════════════════════════════════════════════════════════════
//  LOTTIE-FINANZ-GRID — Übersicht aller Lottie-Animationen im Baukasten.
//  Zum Prüfen: npx remotion still src/index.ts LottieFinanzGrid out/lottie.png --frame=45
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, Background, Vignette, LottieBox } from './brand';

const ITEMS = [
  ['muenzen', 'Münzen — sparen'],
  ['muenze', 'Münze — 1 €'],
  ['geldboerse', 'Geldbörse'],
  ['sparschwein', 'Sparschwein'],
  ['wachstum', 'Wachstum — Chart'],
  ['trend', 'Trend — Pfeil'],
  ['trendauf', 'Trend hoch'],
  ['ziel', 'Sparziel'],
  ['sicherheit', 'Sicherheit'],
  ['zeit', 'Zeit'],
  ['konfetti', 'Konfetti — CTA'],
  ['lupe', 'Lupe — prüfen'],
  ['warenkorb', 'Konsum'],
  ['warnung', 'Warnung — Risiko'],
];

export const LottieFinanzGrid: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <AbsoluteFill style={{ padding: 70, alignContent: 'flex-start' }}>
      <div style={{ fontFamily: FONT.title, fontSize: 56, color: C.white, marginBottom: 36 }}>
        LOTTIE-FINANZ-SET · {ITEMS.length} ANIMATIONEN
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28, width: '100%' }}>
        {ITEMS.map(([file, label]) => (
          <div key={file} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <LottieBox file={`lottie/${file}.json`} size={130} />
            <div style={{ fontFamily: FONT.body, fontSize: 18, fontWeight: 600, color: C.gray,
              textAlign: 'center' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
    <Vignette />
  </AbsoluteFill>
);
