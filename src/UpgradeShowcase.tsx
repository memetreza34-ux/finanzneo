// ════════════════════════════════════════════════════════════════════════════
//  UPGRADE-SHOWCASE — alle neuen Bausteine (Juni 2026) auf einen Blick.
//  7 Kapitel à 4s: Rollers (3×), TextFX, DataBlocks, Übergänge.
//  npx remotion still src/index.ts UpgradeShowcase out/up-N.png --frame=N
// ════════════════════════════════════════════════════════════════════════════
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import {
  C, FONT, sec, euro, a,
  Background, Vignette,
  SlotRoller, DigitSlots, SplitFlap, DrumRoller, DramaticNumber, CountdownRoller,
  Scramble, KineticPunch, FlipIn3D, WaveText,
  MilestoneTimeline, StatsCards,
  sceneTransition,
} from './brand';

const SEG = sec(4); // 4s pro Kapitel

const Chapter: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <AbsoluteFill>
    <Background />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </AbsoluteFill>
    <div style={{ position: 'absolute', left: 60, bottom: 44, fontFamily: FONT.body,
      fontSize: 24, fontWeight: 700, color: a(C.gray, 0.8), letterSpacing: 3 }}>
      {label}
    </div>
    <Vignette />
  </AbsoluteFill>
);

// Kapitel 1 — DigitSlots: das Geld-Zahl-Reveal
const K1: React.FC = () => (
  <Chapter label="NEU · DIGITSLOTS — ZIFFERN RASTEN EIN">
    <div style={{ fontFamily: FONT.body, fontSize: 34, fontWeight: 700, color: C.white,
      marginBottom: 50 }}>
      Nach 30 Jahren:
    </div>
    <DigitSlots value="121.997 €" fontSize={170} color={C.gold} startAt={8} />
  </Chapter>
);

// Kapitel 2 — DramaticNumber + SlotRoller
const K2: React.FC = () => (
  <Chapter label="NEU · DRAMATICNUMBER + SLOTROLLER">
    <DramaticNumber to={264000} format={euro} fontSize={150} color={C.accent}
      startAt={5} durationFrames={75} />
    <div style={{ marginTop: 70, display: 'flex', alignItems: 'baseline', gap: 28 }}>
      <span style={{ fontFamily: FONT.body, fontSize: 40, fontWeight: 700, color: C.white }}>
        Dein Geld kann
      </span>
      <SlotRoller items={['schlafen', 'warten', 'schrumpfen', 'WACHSEN']}
        fontSize={72} color={C.accent} startAt={20} />
    </div>
  </Chapter>
);

// Kapitel 3 — SplitFlap + DrumRoller + Countdown
const K3: React.FC = () => (
  <Chapter label="NEU · SPLITFLAP · DRUMROLLER · COUNTDOWN">
    <SplitFlap text="100 € MTL." fontSize={64} startAt={6} />
    <div style={{ marginTop: 80 }}>
      <DrumRoller items={['10 Jahre', '20 Jahre', '30 Jahre', '40 JAHRE']}
        fontSize={84} startAt={20} />
    </div>
    <div style={{ position: 'absolute', right: 150, top: 110 }}>
      <CountdownRoller from={3} finalWord="LOS!" fontSize={130} startAt={30} />
    </div>
  </Chapter>
);

// Kapitel 4 — Text-FX
const K4: React.FC = () => (
  <Chapter label="NEU · SCRAMBLE · FLIPIN3D · WAVETEXT">
    <Scramble text="ZINSESZINS" at={6} dur={28} size={120} color={C.white} />
    <div style={{ marginTop: 60 }}>
      <FlipIn3D text="Zeit schlägt Geld" at={36} size={84} color={C.blue} />
    </div>
    <div style={{ marginTop: 60 }}>
      <WaveText text="+10,7 % p.a." at={66} size={76} color={C.accent} />
    </div>
  </Chapter>
);

// Kapitel 5 — KineticPunch
const K5: React.FC = () => (
  <Chapter label="NEU · KINETICPUNCH — WORT-SCHLÄGE">
    <KineticPunch
      words={['SPAREN.', 'HOFFEN.', 'WARTEN.', 'VERLIEREN?', 'INVESTIEREN!']}
      at={8} per={20} size={150}
      colors={[C.white, C.white, C.white, C.negative, C.accent]} />
  </Chapter>
);

// Kapitel 6 — StatsCards
const K6: React.FC = () => (
  <Chapter label="NEU · STATSCARDS — KENNZAHLEN-KARTEN">
    <StatsCards at={8} items={[
      { value: '36.000 €', label: 'Eingezahlt', sub: '100 € × 360 Monate', color: C.white },
      { value: '121.997 €', label: 'Endwert', sub: 'bei 7 % p.a.', color: C.gold },
      { value: '+85.997 €', label: 'Zinseszins', sub: 'geschenkte Arbeit', color: C.accent },
    ]} />
  </Chapter>
);

// Kapitel 7 — MilestoneTimeline + neue Übergänge als Demo
const K7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Chapter label="NEU · MILESTONETIMELINE + 5 ÜBERGÄNGE (iris/diagonal/split/skew/liquid)">
      <div style={{ display: 'flex', gap: 140, alignItems: 'center' }}>
        <MilestoneTimeline at={6} items={[
          { label: 'JAHR 10', title: '17.000 €', desc: 'langsamer Start' },
          { label: 'JAHR 20', title: '52.000 €', desc: 'es zieht an' },
          { label: 'JAHR 30', title: '121.997 €', desc: 'Lawine rollt', color: C.gold },
        ]} width={520} />
        <div style={{ ...sceneTransition(f, 40, sec(4), 'iris', 16), width: 420, height: 300,
          borderRadius: 24, background: a(C.accent, 0.12), border: `1px solid ${a(C.accent, 0.4)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: FONT.title, fontSize: 56, color: C.accent }}>IRIS-REVEAL</span>
        </div>
      </div>
    </Chapter>
  );
};

export const UpgradeShowcase: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence durationInFrames={SEG}><K1 /></Sequence>
    <Sequence from={SEG} durationInFrames={SEG}><K2 /></Sequence>
    <Sequence from={SEG * 2} durationInFrames={SEG}><K3 /></Sequence>
    <Sequence from={SEG * 3} durationInFrames={SEG}><K4 /></Sequence>
    <Sequence from={SEG * 4} durationInFrames={SEG}><K5 /></Sequence>
    <Sequence from={SEG * 5} durationInFrames={SEG}><K6 /></Sequence>
    <Sequence from={SEG * 6} durationInFrames={SEG}><K7 /></Sequence>
  </AbsoluteFill>
);

export const UPGRADE_SHOWCASE_DURATION = SEG * 7;
