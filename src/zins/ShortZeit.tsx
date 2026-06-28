// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SHORT 5 — DIE MACHT DER ZEIT  (9:16 · 1080×1920)
//  Audio: public/audio/short-05.mp3 (Szene 4, 0–57,9s)  ·  kein Untertitel.
//  Wachsende Balken 10/20/30/40 J · Highlight +140k · Pointe.
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, euro, Background, Vignette, Shine } from '../brand';

export const SHORT_ZEIT_FRAMES = Math.round(58 * 30);

const ROWS = [
  { years: '10 Jahre', value: 17000, at: 16.84 },
  { years: '20 Jahre', value: 52000, at: 22.88 },
  { years: '30 Jahre', value: 121000, at: 29.52 },
  { years: '40 Jahre', value: 264000, at: 34.16 },
];
const MAX = 264000;
const T = { title: 3.48, setup: 10.56, jump: 40.68, mehr: 48.32, pointe: 53.74 };
const fade = (f: number, at: number, d = 0.45) => prog(f, sec(at), sec(at + d));

const Row: React.FC<{ years: string; value: number; at: number; hot?: boolean }> = ({ years, value, at, hot }) => {
  const f = useCurrentFrame();
  const op = life(f, sec(at), sec(99), 6);
  if (op <= 0) return null;
  const w = lerpF(f, 0, (value / MAX) * 500, sec(at), sec(at + 0.7));
  const col = hot ? C.accentLt : C.accent;
  return (
    <div style={{ opacity: op, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26 }}>
      <div style={{ width: 200, fontFamily: FONT.title, fontSize: 52, color: C.white, textAlign: 'right' }}>{years}</div>
      <div style={{ position: 'relative', height: 64, flex: 1 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 64, width: w, borderRadius: 12,
          background: `linear-gradient(90deg, ${a(col, 0.6)}, ${col})`, boxShadow: hot ? `0 0 30px ${a(col, 0.6)}` : 'none' }} />
        <div style={{ position: 'absolute', left: w + 16, top: 6, fontFamily: FONT.title, fontSize: 50,
          color: col, opacity: fade(f, at + 0.5) }}>{euro(value)}</div>
      </div>
    </div>
  );
};

export const ShortZeit: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('audio/short-05.mp3')} />
      <div style={{ position: 'absolute', top: 56, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 46 }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>
      <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: a(C.gray, 0.55) }}>KEINE ANLAGEBERATUNG</div>

      {/* Titel */}
      <div style={{ position: 'absolute', top: 180, width: '100%', textAlign: 'center', opacity: fade(f, T.title) }}>
        <div style={{ fontFamily: FONT.title, fontSize: 92, color: C.white }}>Zeit ist stärker</div>
        <div style={{ fontFamily: FONT.title, fontSize: 92, color: C.accent }}>als Geld</div>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: a(C.gray, 0.9), marginTop: 10,
          opacity: fade(f, T.setup) }}>100 €/Monat · 7 % pro Jahr</div>
      </div>

      {/* Balken */}
      <div style={{ position: 'absolute', top: 560, left: 70, right: 50 }}>
        {ROWS.map((r) => <Row key={r.years} {...r} hot={r.years === '40 Jahre'} />)}
      </div>

      {/* Highlight +140k */}
      <div style={{ position: 'absolute', top: 1080, width: '100%', textAlign: 'center', opacity: fade(f, T.jump) }}>
        <div style={{ display: 'inline-block', padding: '20px 40px', borderRadius: 22, background: a(C.accent, 0.12),
          border: `2px solid ${a(C.accent, 0.6)}` }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.white }}>Jahr 30 → 40:</div>
          <Shine at={sec(T.jump + 0.3)}>
            <span style={{ fontFamily: FONT.title, fontSize: 120, color: C.accentLt }}>+ {euro(140000)}</span>
          </Shine>
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 38, color: C.accentLt,
            opacity: fade(f, T.mehr) }}>…in EINEM Jahrzehnt — mehr als die ersten 30 zusammen</div>
        </div>
      </div>

      {/* Pointe */}
      <div style={{ position: 'absolute', bottom: 150, width: '100%', textAlign: 'center', opacity: fade(f, T.pointe) }}>
        <div style={{ fontFamily: FONT.title, fontSize: 64, color: C.white, lineHeight: 1.15 }}>
          Die letzten 10 Jahre bringen<br />mehr als die ersten 30.
        </div>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.gold, marginTop: 14 }}>
          Darum: früh starten ≫ viel einzahlen
        </div>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
