// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SHORT 4 — DIE 3 ZINSESZINS-KILLER  (9:16 · 1080×1920)
//  Audio: public/audio/short-04.mp3 (Szene 6, 0–71,6s)  ·  kein Untertitel.
//  Drei Killer-Karten gestaffelt · Merksatz am Schluss.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, Background, Vignette } from '../brand';

export const SHORT_KILLER_FRAMES = Math.round(72 * 30);

const CARDS = [
  { n: 1, emoji: '💸', title: 'Hohe Gebühren', desc: '0,2 % vs. 1,8 % im Jahr — über 30 Jahre zehntausende € weniger.', at: 8.64 },
  { n: 2, emoji: '😱', title: 'Zu früh verkaufen', desc: 'Panik beim Crash → du tötest den Zinseszins genau im falschen Moment.', at: 41.24 },
  { n: 3, emoji: '✋', title: 'Das Geld anfassen', desc: 'Jeder entnommene € nimmt auch alle Zinsen mit, die er noch gebracht hätte.', at: 54.06 },
];
const T = { intro: 0.0, merke: 66.94 };
const fade = (f: number, at: number, d = 0.45) => prog(f, sec(at), sec(at + d));
const rise = (f: number, at: number, d = 0.5) => lerpF(f, 26, 0, sec(at), sec(at + d));

const Card: React.FC<{ n: number; emoji: string; title: string; desc: string; at: number }> = ({ n, emoji, title, desc, at }) => {
  const f = useCurrentFrame();
  const op = life(f, sec(at), sec(99), 6);
  if (op <= 0) return null;
  const active = f >= sec(at) && f < sec(at + 6);
  return (
    <div style={{ opacity: op, transform: `translateY(${rise(f, at)}px)`, width: 940, padding: '26px 34px', borderRadius: 26,
      background: a(C.negative, active ? 0.14 : 0.07), border: `2px solid ${a(C.negative, active ? 0.7 : 0.35)}`,
      display: 'flex', gap: 26, alignItems: 'center' }}>
      <div style={{ flexShrink: 0, width: 96, height: 96, borderRadius: '50%', background: a(C.negative, 0.18),
        border: `2px solid ${a(C.negative, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT.title, fontSize: 60, color: C.negative }}>{n}</div>
      <div>
        <div style={{ fontFamily: FONT.title, fontSize: 62, color: C.white }}>{emoji} {title}</div>
        <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 36, color: a(C.white, 0.82), marginTop: 6, lineHeight: 1.25 }}>{desc}</div>
      </div>
    </div>
  );
};

export const ShortKiller: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('audio/short-04.mp3')} />
      <div style={{ position: 'absolute', top: 56, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 46 }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>
      <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: a(C.gray, 0.55) }}>KEINE ANLAGEBERATUNG</div>

      {/* Titel */}
      <div style={{ position: 'absolute', top: 175, width: '100%', textAlign: 'center', opacity: fade(f, 0.3) }}>
        <div style={{ fontFamily: FONT.title, fontSize: 96, color: C.negative, textShadow: `0 0 40px ${a(C.negative, 0.4)}` }}>3 KILLER</div>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: a(C.white, 0.9) }}>die deinen Zinseszins heimlich auffressen</div>
      </div>

      {/* Karten */}
      <div style={{ position: 'absolute', top: 380, width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 26 }}>
        {CARDS.map((c) => <Card key={c.n} {...c} />)}
      </div>

      {/* Merksatz */}
      <div style={{ position: 'absolute', bottom: 150, width: '100%', textAlign: 'center', opacity: fade(f, T.merke) }}>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: a(C.white, 0.8) }}>Merk dir:</div>
        <div style={{ fontFamily: FONT.title, fontSize: 70, color: C.accent, marginTop: 6, lineHeight: 1.2 }}>
          Niedrige Kosten ·<br />ruhig bleiben · liegen lassen
        </div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
