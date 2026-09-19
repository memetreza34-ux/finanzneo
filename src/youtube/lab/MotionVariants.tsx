// Sechs visuell verschiedene Ansätze für dieselbe Aufgabe: Finanzen erklären.
//
// Die erste Probe (`PremiumMotionProbe`) zeigte fünf Themen in einer Bildsprache.
// Hier geht es um das Gegenteil: sechs Bildsprachen, damit sichtbar wird, was
// überhaupt zur Wahl steht, bevor eine Szene sich auf eine festlegt.
//
// 1 Echtes 3D          Körper mit Licht und Material, WebGL
// 2 Kinetische Zahl    Typografie ist das Motiv, nicht die Beschriftung
// 3 Kurve              eine Linie, die sich zeichnet, mit Fläche und Läufer
// 4 Direktvergleich    zwei Wege nebeneinander, einer setzt sich ab
// 5 Geldstrom          viele kleine Einheiten statt einem grossen Objekt
// 6 Makro              ein Gegenstand füllt den Frame, Kamera geht nah ran

import React from 'react';
import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {
  CameraBlur,
  CameraPush,
  ContactShadow,
  DrawnLine,
  FONT,
  OBJECT_TONES,
  clamp01,
  dropIn,
  ease,
  linear,
  pointOnPath,
  settle,
} from '../../design-system';
import {CoinStack3D, Slab3D, Tank3D, ThreeStage} from '../three-kit';

export const MOTION_VARIANTS_FRAMES = 6 * 150;

const TONE = {
  ink: '#F7F7F2',
  dim: '#8A9298',
  gold: '#D8B15A',
  goldDeep: '#8A6B1E',
  green: '#2DD881',
  greenDeep: '#0E5C3A',
  red: '#FF6B4A',
} as const;

const Kopf: React.FC<{text: string; unter: string}> = ({text, unter}) => {
  const frame = useCurrentFrame();
  const auf = ease(frame, 0, 18);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center', opacity: auf}}>
      <div style={{fontFamily: FONT.body, fontSize: 50, fontWeight: 900, color: TONE.ink, letterSpacing: -1}}>{text}</div>
      <div style={{fontFamily: FONT.body, fontSize: 26, fontWeight: 700, color: TONE.dim, marginTop: 8}}>{unter}</div>
    </div>
  );
};

// ── 1 · Echtes 3D ───────────────────────────────────────────────────────────
// Der auffälligste Unterschied zu allem anderen: Licht fällt wirklich auf einen
// Körper, statt gemalt zu werden. Kostet Renderzeit und braucht `--gl=angle`.
const Dreidimensional: React.FC = () => {
  const frame = useCurrentFrame();
  const wachsen = ease(frame, 14, 104);
  const fuellen = ease(frame, 30, 120);
  const kamera = ease(frame, 0, 148);

  return (
    <AbsoluteFill>
      <Kopf text="Echtes 3D" unter="Körper mit Licht, nicht gemalter Verlauf" />
      <ThreeStage cameraY={1.1 + kamera * 0.9} cameraZ={13.5 - kamera * 2.2} fov={36}>
        <Slab3D position={[0, -3.6, 0]} size={[11, 0.35, 5]} material="steel" />
        <CoinStack3D position={[-3.1, -3.25, 0]} count={Math.round(wachsen * 7)} radius={1.15} material="gold" />
        <Tank3D position={[3.2, -1.6, 0]} width={3.1} height={3.6} depth={1.7} fill={fuellen} material="steel" fillMaterial="green" />
      </ThreeStage>
    </AbsoluteFill>
  );
};

// ── 2 · Kinetische Zahl ─────────────────────────────────────────────────────
// Keine Objekte. Die Zahl selbst ist das Motiv: sie zählt hoch, kommt mit
// Gewicht an und die Zeile darunter zieht sich unter ihr durch.
const Kinetisch: React.FC = () => {
  const frame = useCurrentFrame();
  const zaehlen = ease(frame, 12, 96);
  const wert = Math.round(zaehlen * 47320);
  const ankommen = settle(frame, 88, 116);
  const strich = ease(frame, 96, 128);

  return (
    <AbsoluteFill>
      <Kopf text="Kinetische Zahl" unter="Die Zahl ist das Motiv" />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 400,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 210,
          fontWeight: 900,
          color: TONE.ink,
          letterSpacing: -10,
          fontVariantNumeric: 'tabular-nums',
          transform: `scale(${0.88 + ease(frame, 12, 60) * 0.12 + ankommen * 0.04})`,
        }}
      >
        {wert.toLocaleString('de-DE')} €
      </div>
      <div style={{position: 'absolute', left: 560, top: 660, width: 800, height: 8, background: '#1C2226', borderRadius: 4}}>
        <div
          style={{
            height: '100%',
            width: `${strich * 100}%`,
            background: `linear-gradient(90deg, ${TONE.goldDeep}, ${TONE.gold})`,
            borderRadius: 4,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 706,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 32,
          fontWeight: 800,
          color: TONE.gold,
          opacity: strich,
        }}
      >
        nach 15 Jahren
      </div>
    </AbsoluteFill>
  );
};

// ── 3 · Kurve ───────────────────────────────────────────────────────────────
// Eine Linie, die entsteht, mit Fläche darunter und einem Läufer auf der Spitze.
// `DrawnLine` zeichnet, `pointOnPath` schickt den Punkt — dieselbe Quelle.
const KURVE = 'M100 560 C 320 548, 460 500, 620 430 S 940 250, 1180 160 S 1600 70, 1800 46';
const FLAECHE = `${KURVE} L1800 620 L100 620 Z`;

const Kurve: React.FC = () => {
  const frame = useCurrentFrame();
  const zeichnen = ease(frame, 10, 110);
  const laeufer = pointOnPath(KURVE, zeichnen);

  return (
    <AbsoluteFill>
      <Kopf text="Kurve" unter="Die Linie entsteht, der Punkt läuft mit" />
      <div style={{position: 'absolute', left: 0, top: 260}}>
        <svg width={1920} height={680} viewBox="0 0 1920 680" fill="none">
          <defs>
            <linearGradient id="fnKurveFlaeche" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TONE.green} stopOpacity={0.34} />
              <stop offset="100%" stopColor={TONE.green} stopOpacity={0} />
            </linearGradient>
            <clipPath id="fnKurveClip">
              <rect x={0} y={0} width={1920 * zeichnen} height={680} />
            </clipPath>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M100 ${140 + i * 120} H1800`} stroke="#1A2024" strokeWidth={2} />
          ))}
          <path d={FLAECHE} fill="url(#fnKurveFlaeche)" clipPath="url(#fnKurveClip)" />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 0, top: 260}}>
        <DrawnLine d={KURVE} progress={zeichnen} width={1920} height={680} stroke={TONE.green} strokeWidth={7} />
      </div>
      <CameraBlur>
        <div
          style={{
            position: 'absolute',
            left: laeufer.x - 17,
            top: 260 + laeufer.y - 17,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: TONE.green,
            boxShadow: `0 0 26px ${TONE.green}`,
            opacity: ease(frame, 10, 24),
          }}
        />
      </CameraBlur>
    </AbsoluteFill>
  );
};

// ── 4 · Direktvergleich ─────────────────────────────────────────────────────
// Zwei Wege nebeneinander. Beide starten gleich, einer setzt sich ab — die
// Aussage liegt im Abstand, nicht in einem einzelnen Objekt.
const Vergleich: React.FC = () => {
  const frame = useCurrentFrame();
  const lauf = ease(frame, 14, 118);
  const boden = 880;

  const bahnen = [
    {x: 560, label: 'Sparbuch', hoehe: 190, farbe: OBJECT_TONES.ivory, kante: OBJECT_TONES.ivoryEdge},
    {x: 1080, label: 'Breit gestreut', hoehe: 560, farbe: TONE.green, kante: TONE.greenDeep},
  ];

  return (
    <AbsoluteFill>
      <Kopf text="Direktvergleich" unter="Der Abstand ist die Aussage" />
      {bahnen.map((b, i) => {
        const h = b.hoehe * ease(frame, 14 + i * 10, 118);
        return (
          <div key={b.label}>
            <ContactShadow x={b.x} y={boden + 8} width={280} contact={lauf} opacity={lauf * 0.75} />
            <div
              style={{
                position: 'absolute',
                left: b.x,
                top: boden - h,
                width: 280,
                height: h,
                background: `linear-gradient(180deg, ${b.farbe}, ${b.kante})`,
                borderRadius: '14px 14px 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: b.x,
                top: boden - h - 56,
                width: 280,
                textAlign: 'center',
                fontFamily: FONT.body,
                fontSize: 36,
                fontWeight: 900,
                color: i === 1 ? TONE.green : TONE.dim,
                opacity: ease(frame, 40 + i * 12, 70 + i * 12),
              }}
            >
              {i === 1 ? '3,0×' : '1,1×'}
            </div>
            <div
              style={{
                position: 'absolute',
                left: b.x,
                top: boden + 22,
                width: 280,
                textAlign: 'center',
                fontFamily: FONT.body,
                fontSize: 30,
                fontWeight: 800,
                color: TONE.dim,
                opacity: lauf,
              }}
            >
              {b.label}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 840,
          top: 300,
          width: 240,
          borderTop: `3px dashed ${TONE.dim}`,
          opacity: ease(frame, 108, 132),
        }}
      />
    </AbsoluteFill>
  );
};

// ── 5 · Geldstrom ───────────────────────────────────────────────────────────
// Viele kleine Einheiten statt einem grossen Objekt. Ein Betrag wirkt dadurch
// als Menge und nicht als Zahl — und die Aufteilung wird ohne Text sichtbar.
const STROM = 'M240 300 C 620 300, 700 640, 1060 640 S 1500 380, 1740 380';
const TROPFEN = Array.from({length: 16}, (_, i) => i);

const Geldstrom: React.FC = () => {
  const frame = useCurrentFrame();
  const bahn = ease(frame, 6, 44);

  return (
    <AbsoluteFill>
      <Kopf text="Geldstrom" unter="Ein Betrag als Menge, nicht als Zahl" />
      <div style={{position: 'absolute', left: 0, top: 200, opacity: 0.22}}>
        <DrawnLine d={STROM} progress={bahn} width={1920} height={760} stroke="#232B33" strokeWidth={12} />
      </div>
      <CameraBlur samples={4}>
        {TROPFEN.map((i) => {
          const versatz = i * 6.6;
          const roh = linear(frame, 26 + versatz, 122 + versatz);
          const p = pointOnPath(STROM, roh);
          const da = clamp01(Math.min(roh * 6, (1 - roh) * 6));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.x - 23,
                top: 200 + p.y - 23,
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: `radial-gradient(circle at 36% 32%, #FFE9B0, ${TONE.gold} 58%, ${TONE.goldDeep})`,
                opacity: da,
              }}
            />
          );
        })}
      </CameraBlur>
      <div
        style={{
          position: 'absolute',
          left: 1640,
          top: 620,
          fontFamily: FONT.body,
          fontSize: 30,
          fontWeight: 800,
          color: TONE.gold,
          opacity: ease(frame, 100, 128),
        }}
      >
        Depot
      </div>
    </AbsoluteFill>
  );
};

// ── 6 · Makro ───────────────────────────────────────────────────────────────
// Ein Gegenstand füllt den Frame, die Kamera geht näher ran. Dadurch wird ein
// Detail lesbar, das in einer Totalen untergeht — hier die Zeile, die zählt.
const Makro: React.FC = () => {
  const frame = useCurrentFrame();
  const auf = settle(frame, 6, 36);
  const zeile = ease(frame, 42, 74);
  const stempel = dropIn(frame, {start: 86, duration: 18, from: 300, tilt: -8});

  return (
    <AbsoluteFill>
      <Kopf text="Makro" unter="Die Kamera geht an das Detail" />
      <CameraPush from={1} to={1.16} start={20} end={150}>
        <div
          style={{
            position: 'absolute',
            left: 520,
            top: 250,
            transform: `rotate(${(1 - auf) * -5}deg) scale(${0.94 + auf * 0.06})`,
            opacity: auf,
          }}
        >
          <svg width={880} height={640} viewBox="0 0 880 640" fill="none">
            <rect x={6} y={6} width={868} height={628} rx={16} fill="#F4F1E8" stroke="#B3A992" strokeWidth={3} />
            <rect x={60} y={64} width={420} height={22} rx={6} fill="#C9C4B6" />
            <rect x={60} y={116} width={300} height={16} rx={5} fill="#D9D5C9" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={60} y={210 + i * 46} width={i === 3 ? 340 : 760} height={13} rx={5} fill="#DDD9CD" />
            ))}
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 580,
            top: 690,
            fontFamily: FONT.body,
            fontSize: 58,
            fontWeight: 900,
            color: '#8A2E1C',
            opacity: zeile,
            transform: `translateX(${(1 - zeile) * -26}px)`,
          }}
        >
          Verwaltung 1,9 % p. a.
        </div>

        <div
          style={{
            position: 'absolute',
            left: 1080,
            top: 470 + stempel.offsetY,
            transform: `rotate(${-14 + stempel.rotate}deg) scale(${stempel.scaleX}, ${stempel.scaleY})`,
            opacity: stempel.progress,
          }}
        >
          <svg width={300} height={140} viewBox="0 0 300 140" fill="none">
            <rect x={6} y={6} width={288} height={128} rx={10} fill="none" stroke={TONE.red} strokeWidth={8} />
            <text x={150} y={92} textAnchor="middle" fontFamily={FONT.body} fontSize={54} fontWeight="900" fill={TONE.red}>
              TEUER
            </text>
          </svg>
        </div>
      </CameraPush>
    </AbsoluteFill>
  );
};

export const MotionVariants: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    <Series>
      <Series.Sequence durationInFrames={150}><Dreidimensional /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Kinetisch /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Kurve /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Vergleich /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Geldstrom /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Makro /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
