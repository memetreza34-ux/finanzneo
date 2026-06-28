// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SHORT 6 — SCHON 25 € REICHEN  (9:16 · 1080×1920)
//  Audio: public/audio/short-06.mp3 (Szene 8, 0–57s)  ·  kein Untertitel.
//  Pointe: „Der Zinseszins will nur eins — deine Zeit".
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, Background, Vignette, KineticPunch, Shine } from '../brand';

export const SHORT_START_FRAMES = Math.round(57 * 30);

const T = {
  hook: 0.3, fehler: 7.74, vermoegen: 11.0, fuenf25: 20.24, kaffee: 24.12,
  dass: 30.3, steigern: 43.1, pointe: 52.56,
};
const fade = (f: number, at: number, d = 0.45) => prog(f, sec(at), sec(at + d));
const rise = (f: number, at: number, d = 0.5) => lerpF(f, 22, 0, sec(at), sec(at + d));

const Stage: React.FC<{ a: number; b: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ a: s, b: e, children, style }) => {
  const f = useCurrentFrame();
  const op = life(f, sec(s), sec(e), 8);
  if (op <= 0) return null;
  return <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: op, ...style }}>{children}</AbsoluteFill>;
};

export const ShortStart: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('audio/short-06.mp3')} />
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 50 }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>
      <div style={{ position: 'absolute', top: 132, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 600, fontSize: 24, letterSpacing: 2, color: a(C.gray, 0.6) }}>KEINE ANLAGEBERATUNG</div>

      {/* A · Hook + Denkfehler */}
      <Stage a={T.hook} b={T.fuenf25} style={{ marginTop: -80 }}>
        <div style={{ fontFamily: FONT.title, fontSize: 96, color: C.white, textAlign: 'center' }}>„Ich hab gerade<br />kein Geld übrig."</div>
        <div style={{ marginTop: 30, fontFamily: FONT.title, fontSize: 64, color: C.negative,
          opacity: fade(f, T.fehler) }}>= der größte Denkfehler</div>
        <div style={{ marginTop: 26, fontFamily: FONT.body, fontWeight: 700, fontSize: 46, color: a(C.white, 0.88),
          textAlign: 'center', opacity: fade(f, T.vermoegen) }}>
          Du brauchst kein Vermögen,<br />um eins aufzubauen.
        </div>
      </Stage>

      {/* B · 25 €/Monat + Kaffee */}
      <Stage a={T.fuenf25} b={T.dass} style={{ marginTop: -60 }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 50, color: a(C.white, 0.85) }}>schon</div>
        <KineticPunch words={['25 €/Monat']} at={sec(T.fuenf25)} size={170} colors={[C.gold]} />
        <div style={{ marginTop: 30, fontFamily: FONT.body, fontWeight: 700, fontSize: 52, color: C.accentLt,
          opacity: fade(f, T.kaffee) }}>☕ ein Kaffee weniger pro Woche</div>
      </Stage>

      {/* C · dass du startest + steigern */}
      <Stage a={T.dass} b={T.pointe} style={{ marginTop: -40 }}>
        <div style={{ fontFamily: FONT.title, fontSize: 72, color: C.white, textAlign: 'center', lineHeight: 1.15 }}>
          Nicht <span style={{ color: a(C.gray, 0.7) }}>wie groß</span> du startest.<br />Sondern <span style={{ color: C.accent }}>DASS</span> du startest.
        </div>
        <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 24, opacity: fade(f, T.steigern),
          transform: `translateY(${rise(f, T.steigern)}px)` }}>
          {['25 €', '50 €', '100 €'].map((v, i) => (
            <React.Fragment key={v}>
              {i > 0 && <span style={{ fontFamily: FONT.title, fontSize: 70, color: C.accent }}>→</span>}
              <span style={{ fontFamily: FONT.title, fontSize: 84, color: i === 2 ? C.accent : C.gold }}>{v}</span>
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 16, fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: a(C.gray, 0.9),
          opacity: fade(f, T.steigern + 0.6) }}>später einfach erhöhen</div>
      </Stage>

      {/* D · Pointe */}
      <Stage a={T.pointe} b={99}>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 50, color: a(C.white, 0.85), textAlign: 'center' }}>
          Der Zinseszins will nur eins:
        </div>
        <Shine at={sec(T.pointe + 0.4)}>
          <span style={{ fontFamily: FONT.title, fontSize: 150, color: C.accent }}>deine ZEIT ⏳</span>
        </Shine>
        <div style={{ marginTop: 18, fontFamily: FONT.body, fontWeight: 700, fontSize: 44, color: C.accentLt }}>Gib sie ihm — den Rest macht er allein.</div>
      </Stage>
      <Vignette />
    </AbsoluteFill>
  );
};
