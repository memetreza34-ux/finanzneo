// ════════════════════════════════════════════════════════════════════════════
//  ZINSESZINS · SHORT 2 — ANNA vs TOM  (9:16 · 1080×1920)
//  Audio: public/audio/short-02.mp3 (Szene 7 ab 20,3s · Anna-vs-Tom-Kern).
//  KEIN Untertitel · große zentrale Texte · Split Anna(oben)/Tom(unten).
//  Endet auf der Pointe „…ist heute".
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a, euro,
  Background, Vignette, DigitSlots, Emphasis, Shine,
} from '../brand';

export const SHORT_ANNATOM_FRAMES = Math.round(58 * 30);

// Beat-Zeiten (s, Short-relativ)
const T = {
  // Anna
  aIn: 0.0, a100: 2.92, a10j: 4.54, aStop: 7.72, aPaid: 11.12,
  // Tom
  tIn: 13.76, t100: 19.54, t35j: 21.34, tPaid: 24.78, t3x: 27.88,
  // Auflösung
  frage: 30.0, denkst: 32.46, falsch: 36.7, reveal: 37.66,
  grund: 40.96, best: 50.44, heute: 54.26,
};

const fade = (f: number, at: number, dur = 0.45) => prog(f, sec(at), sec(at + dur));
const rise = (f: number, at: number, dur = 0.45) => lerpF(f, 18, 0, sec(at), sec(at + dur));

// eine Person-Spalte
const Panel: React.FC<{
  emoji: string; name: string; color: string; age: string;
  inAt: number; m100: number; years: string; yearsAt: number;
  extra: string; extraAt: number; paid: string; paidAt: number;
  endValue: number; winner?: boolean;
}> = ({ emoji, name, color, age, inAt, m100, years, yearsAt, extra, extraAt, paid, paidAt, endValue, winner }) => {
  const f = useCurrentFrame();
  const op = life(f, sec(inAt), sec(99), 8);
  if (op <= 0) return null;
  return (
    <div style={{ opacity: op, width: 940, padding: '34px 40px', borderRadius: 28,
      background: a(color, 0.08), border: `2px solid ${a(color, winner ? 0.7 : 0.35)}`,
      boxShadow: winner && f > sec(T.reveal) ? `0 0 50px ${a(color, 0.35)}` : 'none' }}>
      {/* Kopf */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18,
        opacity: fade(f, inAt), transform: `translateY(${rise(f, inAt)}px)` }}>
        <span style={{ fontSize: 70 }}>{emoji}</span>
        <span style={{ fontFamily: FONT.title, fontSize: 78, color }}>{name}</span>
        <span style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: a(C.white, 0.7) }}>{age}</span>
        {winner && (
          <span style={{ fontSize: 60, marginLeft: 'auto', opacity: fade(f, T.reveal + 0.3) }}>👑</span>
        )}
      </div>
      {/* Details */}
      <div style={{ marginTop: 16, fontFamily: FONT.body, fontWeight: 700, fontSize: 42, color: a(C.white, 0.9) }}>
        <span style={{ opacity: fade(f, m100) }}>100 €/Monat</span>
        <span style={{ opacity: fade(f, yearsAt) }}>{'  ·  ' + years}</span>
      </div>
      <div style={{ marginTop: 8, fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: a(C.gray, 0.95),
        opacity: fade(f, extraAt) }}>{extra}</div>
      {/* eingezahlt + Endwert */}
      <div style={{ marginTop: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ opacity: fade(f, paidAt) }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: a(C.gray, 0.8) }}>eingezahlt</div>
          <div style={{ fontFamily: FONT.title, fontSize: 64, color: C.gold }}>{paid}</div>
        </div>
        <div style={{ opacity: fade(f, T.reveal), textAlign: 'right' }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 30, color: a(C.gray, 0.8) }}>mit 65</div>
          <DigitSlots value={euro(endValue)} fontSize={92} color={color} startAt={sec(T.reveal)} />
        </div>
      </div>
    </div>
  );
};

export const ShortAnnaTom: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile('audio/short-02.mp3')} />

      {/* Marke + Rechtshinweis */}
      <div style={{ position: 'absolute', top: 56, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 46 }}>
        <span style={{ color: C.white }}>Finanz</span><span style={{ color: C.accent }}>Neo</span>
      </div>
      <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center',
        fontFamily: FONT.body, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: a(C.gray, 0.55) }}>
        KEINE ANLAGEBERATUNG
      </div>

      {/* Hook-Frage oben */}
      <div style={{ position: 'absolute', top: 168, width: '100%', textAlign: 'center',
        fontFamily: FONT.title, fontSize: 58, color: C.white,
        opacity: f < sec(T.frage) ? fade(f, 0.3) : 1 - fade(f, T.falsch - 0.2, 0.3) }}>
        Wer wird mit 65 reicher?
      </div>

      {/* Panels */}
      <div style={{ position: 'absolute', top: 300, width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 28 }}>
        <Panel emoji="👩" name="Anna" color={C.accent} age="ab 20"
          inAt={T.aIn} m100={T.a100} years="10 Jahre" yearsAt={T.a10j}
          extra="dann Stopp ✋ — nie wieder eingezahlt" extraAt={T.aStop}
          paid="12.000 €" paidAt={T.aPaid} endValue={185000} winner />
        <div style={{ fontFamily: FONT.title, fontSize: 54, color: a(C.white, 0.6),
          opacity: life(f, sec(T.tIn - 0.4), sec(99), 6) }}>VS</div>
        <Panel emoji="👨" name="Tom" color={C.blue} age="ab 30"
          inAt={T.tIn} m100={T.t100} years="35 Jahre durch" yearsAt={T.t35j}
          extra="zahlt die ganze Zeit weiter" extraAt={T.t35j + 0.6}
          paid="42.000 €" paidAt={T.tPaid} endValue={180000} />
      </div>

      {/* 3×-Badge bei Tom */}
      <div style={{ position: 'absolute', top: 1230, width: '100%', textAlign: 'center',
        opacity: fade(f, T.t3x) * (1 - fade(f, T.falsch - 0.2, 0.3)) }}>
        <span style={{ display: 'inline-block', padding: '8px 26px', borderRadius: 14, background: C.blue,
          color: C.white, fontFamily: FONT.title, fontSize: 44, transform: 'rotate(-3deg)' }}>
          3× so viel eingezahlt!
        </span>
      </div>

      {/* Auflösungs-Zone unten */}
      <div style={{ position: 'absolute', bottom: 150, width: '100%', textAlign: 'center' }}>
        {/* "Du denkst: Tom" */}
        <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 56, color: a(C.white, 0.9),
          opacity: fade(f, T.denkst) * (1 - fade(f, T.falsch - 0.1, 0.2)) }}>
          Du denkst: Tom 🤔
        </div>
        {/* FALSCH */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: -10,
          opacity: fade(f, T.falsch) * (1 - fade(f, T.grund, 0.3)) }}>
          <Emphasis at={sec(T.falsch)} color={C.negative}>
            <span style={{ fontFamily: FONT.title, fontSize: 150, color: C.negative,
              textShadow: `0 0 40px ${a(C.negative, 0.5)}` }}>FALSCH!</span>
          </Emphasis>
        </div>
        {/* Grund */}
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 46, color: C.accentLt,
          opacity: fade(f, T.grund) * (1 - fade(f, T.best - 0.2, 0.3)) }}>
          Annas Geld hatte 10 Jahre länger Zeit zu wachsen.
        </div>
        {/* Pointe */}
        <div style={{ opacity: fade(f, T.best) }}>
          <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 44, color: a(C.white, 0.85) }}>
            Der beste Tag war vor 10 Jahren.
          </div>
          <div style={{ marginTop: 10, opacity: fade(f, T.heute) }}>
            <Shine at={sec(T.heute)}>
              <span style={{ fontFamily: FONT.title, fontSize: 96, color: C.accent }}>
                Der zweitbeste ist HEUTE.
              </span>
            </Shine>
          </div>
        </div>
      </div>

      <Vignette />
    </AbsoluteFill>
  );
};
