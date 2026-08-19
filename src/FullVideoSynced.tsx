import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, sec, prog, lerpF, life, a, E, RollingNumber, AreaPremium, CameraBlur } from './brand';
// ⚠️ AKTIVIEREN: Diese Vorlage ist abgemeldet, bis echtes Material da ist.
//   1) Arman legt Stimme ab:  public/audio/<name>.mp3   (Claude erstellt NIE Audio!)
//   2) Wort-Timing erzeugen:  python scripts/captions.py public/audio/<name>.mp3 public/captions/<name>.json
//   3) Import unten auf die eigene <name>.json umstellen + Audio-src auf <name>.mp3
//   4) In Root.tsx als <Composition id="FullVideoSynced" .../> wieder registrieren
//      (Import + SYNCED_FRAMES-Zeile dort einkommentieren).
//   5) Wort-Indizes/Texte unten an dein Skript anpassen.
import captions from '../public/captions/szene-01-hook.json';

// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO · FULL VIDEO (AUDIO-SYNCHRON) — das Workflow-Muster
//  Stimme (von Arman, fertige Datei) → Whisper Wort-Timing (public/captions/*.json)
//  → Text erscheint exakt wenn das Wort gesprochen wird. Szenen an Wortgrenzen.
//  Eine durchgehende Timeline mit absoluten Frames (kein Sequence-Offset-Chaos).
// ════════════════════════════════════════════════════════════════════════════

type W = { word: string; start: number; end: number };
// Caption-Dateien sind Objekte im Format finanzneo-caption-v1, die Wortliste liegt unter `words`.
const WS = captions.words as W[];

// Wort-Index → Frame (Beginn / Ende des gesprochenen Worts)
const wIn = (i: number) => sec(WS[i].start);
const wOut = (i: number) => sec(WS[i].end);
// Gesamtlänge = letztes Wort + Atempause (0 solange noch keine echten Captions vorliegen)
export const SYNCED_FRAMES = WS.length === 0 ? 0 : wOut(WS.length - 1) + sec(0.8);

// Wort-Reveal, getriggert vom gesprochenen Wort (clean, von unten)
const spoken = (f: number, txt: string, i: number, size: number, col: string = C.white, weight = 800) => {
  const at = wIn(i);
  const o = prog(f, at, at + 5);
  const y = lerpF(f, 30, 0, at, at + 9, E.out);
  return (
    <span style={{ display: 'inline-block', opacity: o, transform: `translateY(${y}px)`,
      fontFamily: FONT.body, fontWeight: weight, fontSize: size, color: col, margin: '0 8px', lineHeight: 1.2 }}>{txt}</span>
  );
};

export const FullVideoSynced: React.FC = () => {
  const f = useCurrentFrame();

  // ── Szenengrenzen aus Wort-Timing (an Sprech-Pausen) ──
  // S1 Hook: Wörter 0–9 ("Dein … an Wert,")  → endet vor Wort 10 ("aber")
  // S2 Zahl: Wörter 10–22 ("aber … 30 Jahren.")
  // S3 Payoff: Wörter 23–29 ("Der … heute.")
  const s1in = wIn(0),  s1out = wIn(10) - 3;
  const s2in = wIn(10) - 3, s2out = wIn(23) - 3;
  const s3in = wIn(23) - 3, s3out = SYNCED_FRAMES;

  // diagonaler Grün-Block in S2: wischt bei "werden" (Wort 16) rein
  const blockP = prog(f, wIn(16) - 4, wIn(16) + 8, E.inOut);
  const blockClip = `polygon(0 0, ${blockP * 100}% 0, ${blockP * 100 - 12}% 100%, 0 100%)`;

  const etf = [
    { x: 'J1', y: 1300 }, { x: 'J10', y: 18000 }, { x: 'J20', y: 52000 }, { x: 'J30', y: 120000 },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* ── Voiceover (einmal, oben) — Pfad auf Armans Datei setzen ── */}
      <Audio src={staticFile('audio/szene-01-hook.mp3')} />

      {/* ── S1 · HOOK (Problem) ── */}
      <AbsoluteFill style={{ opacity: life(f, s1in, s1out, 8),
        background: `radial-gradient(120% 70% at 50% 14%, #1A0E0E 0%, ${C.bg} 60%)`,
        alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', paddingInline: 60 }}>
          <div>
            {spoken(f, 'Dein', 0, 66)}{spoken(f, 'Geld', 1, 66)}{spoken(f, 'auf', 2, 66)}{spoken(f, 'dem', 3, 66)}
          </div>
          <div style={{ marginTop: 6 }}>{spoken(f, 'Sparbuch', 4, 100, C.gold, 900)}</div>
          <div style={{ marginTop: 22 }}>
            {spoken(f, 'verliert', 5, 78, C.negative, 900)}{spoken(f, 'jedes', 6, 78, C.negative, 900)}{spoken(f, 'Jahr', 7, 78, C.negative, 900)}
          </div>
          <div style={{ marginTop: 6 }}>
            {spoken(f, 'an', 8, 66, C.negative, 900)}{spoken(f, 'Wert', 9, 66, C.negative, 900)}
          </div>
        </div>
      </AbsoluteFill>

      {/* ── S2 · GROSSE ZAHL (Signature-Block, synchron) ── */}
      <AbsoluteFill style={{ opacity: life(f, s2in, s2out, 8),
        background: `radial-gradient(120% 70% at 50% 0%, #10261A 0%, ${C.bg} 60%)` }}>
        {/* Setup-Text vor dem Block: "aus 100 Euro im Monat" */}
        <AbsoluteFill style={{ opacity: life(f, s2in, wIn(16), 6), alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div>{spoken(f, 'Aus', 11, 60, C.gray)}{spoken(f, '100 €', 12, 84, C.gold, 900)}</div>
            <div style={{ marginTop: 6 }}>{spoken(f, 'im', 14, 56, C.gray)}{spoken(f, 'Monat', 15, 56, C.gray)}</div>
          </div>
        </AbsoluteFill>
        {/* Block + Zahl: ab "werden" */}
        <AbsoluteFill style={{ opacity: prog(f, wIn(16) - 2, wIn(16) + 8) }}>
          <div style={{ position: 'absolute', inset: 0, background: C.accent, clipPath: blockClip }} />
          {/* CameraBlur = Bewegungsunschärfe auf der rollenden Zahl, Layout bleibt zentriert */}
          <CameraBlur samples={6}>
            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 44, color: C.bg, letterSpacing: 4,
                  opacity: prog(f, wIn(16), wIn(16) + 6) }}>WERDEN</div>
                {/* RollingNumber läuft GENAU während "120.000" gesprochen wird (Wort 17–18) */}
                <div style={{ marginTop: 4 }}>
                  <RollingNumber to={120000} start={wIn(17)} end={wOut(18)} size={172} color={C.bg} />
                </div>
                <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 42, color: C.bg, letterSpacing: 2,
                  opacity: prog(f, wIn(20), wIn(20) + 6),
                  transform: `translateY(${lerpF(f, 18, 0, wIn(20), wIn(20) + 6)}px)` }}>in 30 Jahren</div>
              </div>
            </AbsoluteFill>
          </CameraBlur>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── S3 · PAYOFF ── */}
      <AbsoluteFill style={{ opacity: life(f, s3in, s3out, 8),
        background: `radial-gradient(120% 70% at 50% 50%, #10261A 0%, ${C.bg} 65%)`,
        alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div>
            {spoken(f, 'Der', 23, 64, C.gray, 600)}{spoken(f, 'beste', 24, 64, C.gray, 600)}{spoken(f, 'Tag', 25, 64, C.gray, 600)}
          </div>
          <div style={{ marginTop: 14 }}>
            {spoken(f, 'zum', 26, 96, C.white, 900)}{spoken(f, 'Starten', 27, 96, C.white, 900)}
          </div>
          <div style={{ marginTop: 14 }}>
            {spoken(f, 'ist', 28, 120, C.accent, 900)}{spoken(f, 'HEUTE', 29, 120, C.accent, 900)}
          </div>
          <div style={{ width: lerpF(f, 0, 340, wOut(29), wOut(29) + 14), height: 7, background: C.accent,
            margin: '40px auto 0', borderRadius: 4, boxShadow: `0 0 24px ${a(C.accent, 0.6)}` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
