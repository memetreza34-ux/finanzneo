// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SHORT 7 — MSCI WORLD / „7 %? Wo gibt's das?"  (9:16 · 1080×1920)
//  Audio: public/audio/short-07.mp3 (Szene 5, 0–68,4s)  ·  kein Untertitel.
//  Pointe: „Es geht um den Trend — nach oben."
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, Background, Vignette, Shine } from '../brand';

export const SHORT_MSCI_FRAMES = Math.round(68.5 * 30);

const T = {
  hook: 0.3, msci: 8.64, firms: 15.52, alle: 19.24, zehn: 26.42,
  sieben: 34.52, warum: 38.3, echt: 45.3, risiko: 51.78, trend: 60.68, oben: 63.96,
};
const fade = (f: number, at: number, d = 0.45) => prog(f, sec(at), sec(at + d));
const Stage: React.FC<{ a: number; b: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ a: s, b: e, children, style }) => {
  const f = useCurrentFrame();
  const op = life(f, sec(s), sec(e), 8);
  if (op <= 0) return null;
  return <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: op, ...style }}>{children}</AbsoluteFill>;
};

export const ShortMSCI: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('audio/short-07.mp3')} />
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 50 }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>
      <div style={{ position: 'absolute', top: 132, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: a(C.gray, 0.6) }}>KEINE ANLAGEBERATUNG</div>

      {/* A · Hook + MSCI World */}
      <Stage a={T.hook} b={T.alle} style={{ marginTop: -40 }}>
        <div style={{ fontFamily: FONT.title, fontSize: 92, color: C.white, textAlign: 'center' }}>„7 % Rendite?<br />Wo gibt's das?"</div>
        <div style={{ marginTop: 40, fontFamily: FONT.title, fontSize: 110, color: C.accent, opacity: fade(f, T.msci),
          textShadow: `0 0 50px ${a(C.accent, 0.4)}` }}>MSCI World</div>
        <div style={{ marginTop: 12, fontFamily: FONT.body, fontWeight: 700, fontSize: 46, color: a(C.white, 0.9),
          opacity: fade(f, T.msci + 0.4) }}>1.500+ große Firmen weltweit</div>
        <div style={{ marginTop: 14, fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: a(C.gray, 0.9),
          opacity: fade(f, T.firms) }}>Apple · Microsoft · Nestlé · hunderte mehr</div>
      </Stage>

      {/* B · alle auf einmal + 10% */}
      <Stage a={T.alle} b={T.sieben} style={{ marginTop: -40 }}>
        <div style={{ fontFamily: FONT.title, fontSize: 76, color: C.white, textAlign: 'center', lineHeight: 1.15 }}>
          Du kaufst nicht eine Firma —<br /><span style={{ color: C.accent }}>du kaufst sie alle.</span>
        </div>
        <div style={{ marginTop: 44, fontFamily: FONT.body, fontWeight: 700, fontSize: 44, color: a(C.white, 0.85),
          opacity: fade(f, T.zehn) }}>letzte 10 Jahre im Schnitt:</div>
        <div style={{ opacity: fade(f, T.zehn + 0.3) }}>
          <Shine at={sec(T.zehn + 0.4)}>
            <span style={{ fontFamily: FONT.title, fontSize: 150, color: C.accent }}>≈ 10 % / Jahr</span>
          </Shine>
        </div>
      </Stage>

      {/* C · rechne mit 7 */}
      <Stage a={T.sieben} b={T.risiko} style={{ marginTop: -20 }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 50, color: a(C.white, 0.85) }}>Ich rechne trotzdem nur mit</div>
        <div style={{ fontFamily: FONT.title, fontSize: 200, color: C.gold }}>7 %</div>
        <div style={{ marginTop: 20, fontFamily: FONT.body, fontWeight: 700, fontSize: 48, color: C.accentLt, textAlign: 'center',
          opacity: fade(f, T.warum) }}>lieber zu wenig versprochen<br />als zu viel</div>
        <div style={{ marginTop: 18, fontFamily: FONT.body, fontWeight: 600, fontSize: 38, color: a(C.gray, 0.85),
          opacity: fade(f, T.echt) }}>echte Daten — keine Werbung, keine Show</div>
      </Stage>

      {/* D · Risiko ehrlich + Pointe */}
      <Stage a={T.risiko} b={99} style={{ marginTop: -20 }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 50, color: a(C.white, 0.9), textAlign: 'center', lineHeight: 1.2 }}>
          Nicht jedes Jahr +10 %.<br /><span style={{ color: C.negative }}>Manche Jahre sind tiefrot.</span>
        </div>
        <div style={{ marginTop: 40, fontFamily: FONT.body, fontWeight: 700, fontSize: 46, color: a(C.white, 0.85),
          opacity: fade(f, T.trend) }}>Es geht um den Trend über 20–30 Jahre:</div>
        <div style={{ marginTop: 10, opacity: fade(f, T.oben) }}>
          <Shine at={sec(T.oben + 0.2)}>
            <span style={{ fontFamily: FONT.title, fontSize: 130, color: C.accent }}>nach oben ⬆️</span>
          </Shine>
        </div>
      </Stage>
      <Vignette />
    </AbsoluteFill>
  );
};
