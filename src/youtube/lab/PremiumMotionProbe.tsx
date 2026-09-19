// Vier Finanz-Animationen aus dem gemeinsamen Baukasten.
//
// Zweck: zeigen, was mit `src/design-system/motion.tsx` und `object-kit.tsx`
// ohne Handarbeit pro Szene möglich ist. Bewusst vier verschiedene Themen und
// vier verschiedene Mechaniken — nicht dieselbe Bewegung mit anderen Zahlen.
//
// Nichts davon gehört zu einem bestehenden Reel oder Video. Wer eine davon
// produktiv braucht, kopiert die Szene in ein Projekt und setzt echte Zahlen ein.

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
  pointOnPath,
  settle,
} from '../../design-system';

export const PREMIUM_MOTION_PROBE_FRAMES = 5 * 150;

const TONE = {
  ink: '#F7F7F2',
  dim: '#8A9298',
  gold: '#D8B15A',
  goldDeep: '#8A6B1E',
  green: '#2DD881',
  red: '#FF6B4A',
} as const;

/** Überschrift einer Probeszene. Steht über der Visualzone, y 90. */
const Titel: React.FC<{text: string; unter: string}> = ({text, unter}) => {
  const frame = useCurrentFrame();
  const auf = ease(frame, 0, 18);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center', opacity: auf}}>
      <div style={{fontFamily: FONT.body, fontSize: 52, fontWeight: 900, color: TONE.ink, letterSpacing: -1}}>{text}</div>
      <div style={{fontFamily: FONT.body, fontSize: 28, fontWeight: 700, color: TONE.dim, marginTop: 10}}>{unter}</div>
    </div>
  );
};

/** Drei erkennbare Waren. Graue Kästen sagen nichts über einen Einkauf. */
const Ware: React.FC<{art: number}> = ({art}) => {
  if (art === 0) {
    return (
      <svg width={70} height={104} viewBox="0 0 70 104" fill="none">
        <path d="M28 6 H42 V26 L54 44 V96 Q54 100 50 100 H20 Q16 100 16 96 V44 L28 26 Z" fill="#8FB8C9" stroke="#C9E2EC" strokeWidth={3} />
        <rect x={26} y={2} width={18} height={10} rx={3} fill="#C9E2EC" />
        <rect x={20} y={58} width={30} height={22} rx={4} fill="#EDF5F8" opacity={0.75} />
      </svg>
    );
  }
  if (art === 1) {
    return (
      <svg width={104} height={70} viewBox="0 0 104 70" fill="none">
        <path d="M8 46 Q8 16 34 14 Q52 6 70 14 Q96 16 96 46 Q96 62 78 62 H26 Q8 62 8 46 Z" fill="#C9A265" stroke="#E4C894" strokeWidth={3} />
        <path d="M30 28 L40 20 M50 26 L60 18 M70 28 L78 21" stroke="#8A6B3C" strokeWidth={3} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={78} height={92} viewBox="0 0 78 92" fill="none">
      <rect x={8} y={18} width={62} height={70} rx={8} fill="#B4525A" stroke="#E08D93" strokeWidth={3} />
      <ellipse cx={39} cy={18} rx={31} ry={9} fill="#E08D93" />
      <rect x={18} y={40} width={42} height={22} rx={3} fill="#F2DCD5" opacity={0.85} />
    </svg>
  );
};

/** Eine Münze in Aufsicht — Ellipse mit Kante, damit sie Körper hat. */
const Muenze: React.FC<{w: number; h: number; farbe: string; kante: string}> = ({w, h, farbe, kante}) => (
  <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} fill="none">
    <ellipse cx={w / 2} cy={h / 2 + 8} rx={w / 2 - 2} ry={h / 2 - 2} fill={kante} />
    <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 2} ry={h / 2 - 2} fill={farbe} />
    <ellipse cx={w / 2} cy={h / 2 - 1} rx={w / 2 - 9} ry={h / 2 - 7} fill="none" stroke={kante} strokeWidth={2} opacity={0.5} />
  </svg>
);

// ── 1 · Zinseszins ──────────────────────────────────────────────────────────
// Mechanik: zwei Anteile wachsen unterschiedlich schnell. Das Eingezahlte steigt
// gleichmässig, der Zinsanteil beschleunigt und überholt es am Ende sichtbar.
const JAHRE = 9;

const Zinseszins: React.FC = () => {
  const frame = useCurrentFrame();
  const saeulenBreite = 96;
  const abstand = 26;
  const gesamt = JAHRE * saeulenBreite + (JAHRE - 1) * abstand;
  const links = (1920 - gesamt) / 2;
  const boden = 900;

  return (
    <AbsoluteFill>
      <Titel text="Zinseszins" unter="200 € im Monat, 7 % im Jahr" />
      <CameraPush from={1} to={1.05} start={10} end={140}>
        {Array.from({length: JAHRE}, (_, i) => {
          const start = 14 + i * 9;
          const auf = ease(frame, start, start + 26);

          // Eingezahlt wächst linear, Zinsen quadratisch — der Punkt der Szene.
          const eingezahlt = 46 + i * 40;
          const zinsen = 6 + i * i * 7.2;

          const hEin = eingezahlt * auf;
          const hZins = zinsen * auf;

          return (
            <div key={i}>
              <ContactShadow x={links + i * (saeulenBreite + abstand)} y={boden + 6} width={saeulenBreite} contact={auf} opacity={auf * 0.8} />
              <div
                style={{
                  position: 'absolute',
                  left: links + i * (saeulenBreite + abstand),
                  top: boden - hEin - hZins,
                  width: saeulenBreite,
                }}
              >
                <div style={{height: hZins, background: `linear-gradient(180deg, ${TONE.gold}, ${TONE.goldDeep})`, borderRadius: '10px 10px 0 0'}} />
                <div style={{height: hEin, background: `linear-gradient(180deg, ${OBJECT_TONES.ivory}, ${OBJECT_TONES.ivoryEdge})`}} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: links + i * (saeulenBreite + abstand),
                  top: boden + 16,
                  width: saeulenBreite,
                  textAlign: 'center',
                  fontFamily: FONT.body,
                  fontSize: 24,
                  fontWeight: 800,
                  color: TONE.dim,
                  opacity: auf,
                }}
              >
                {i + 1}
              </div>
            </div>
          );
        })}

        <div style={{position: 'absolute', left: 1500, top: 300, opacity: ease(frame, 96, 124)}}>
          <div style={{fontFamily: FONT.body, fontSize: 34, fontWeight: 900, color: TONE.gold}}>Zinsen</div>
          <div style={{fontFamily: FONT.body, fontSize: 34, fontWeight: 900, color: OBJECT_TONES.ivory, marginTop: 16}}>Eingezahlt</div>
        </div>
      </CameraPush>
    </AbsoluteFill>
  );
};

// ── 2 · Inflation ───────────────────────────────────────────────────────────
// Mechanik: der Einsatz bleibt gleich, das Ergebnis wird weniger. Der Schein
// liegt unverändert da, während aus dem Korb Stück für Stück etwas verschwindet.
const KORB = Array.from({length: 12}, (_, i) => ({
  x: 1130 + (i % 4) * 136,
  y: 400 + Math.floor(i / 4) * 138,
  art: i % 3,
  weg: i >= 8 ? 62 + (11 - i) * 15 : null,
}));

const Inflation: React.FC = () => {
  const frame = useCurrentFrame();
  const scheinAuf = settle(frame, 8, 34);

  return (
    <AbsoluteFill>
      <Titel text="Inflation" unter="Gleicher Schein, weniger im Korb" />
      <CameraPush from={1.03} to={1} start={0} end={150}>
        <div
          style={{
            position: 'absolute',
            left: 430,
            top: 470,
            transform: `rotate(${(1 - scheinAuf) * -9}deg) scale(${0.9 + scheinAuf * 0.1})`,
            opacity: scheinAuf,
          }}
        >
          <svg width={330} height={170} viewBox="0 0 330 170" fill="none">
            <rect x={4} y={4} width={322} height={162} rx={12} fill="#CDE3D2" stroke="#7FA98A" strokeWidth={3} />
            <circle cx={82} cy={85} r={44} fill="none" stroke="#7FA98A" strokeWidth={3} />
            <text x={200} y={104} fontFamily={FONT.body} fontSize={60} fontWeight="900" fill="#31624A">50</text>
          </svg>
        </div>
        <ContactShadow x={430} y={648} width={330} contact={scheinAuf} opacity={scheinAuf * 0.7} />

        {KORB.map((stueck, i) => {
          const rein = settle(frame, 20 + i * 4, 46 + i * 4);
          const raus = stueck.weg === null ? 0 : ease(frame, stueck.weg, stueck.weg + 22);
          const da = clamp01(rein - raus);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: stueck.x,
                top: stueck.y - (1 - rein) * 60 - raus * 40,
                opacity: da,
                transform: `scale(${0.82 + da * 0.18})`,
              }}
            >
              <Ware art={stueck.art} />
            </div>
          );
        })}

        <div
          style={{
            position: 'absolute',
            left: 1180,
            top: 830,
            fontFamily: FONT.body,
            fontSize: 32,
            fontWeight: 900,
            color: TONE.red,
            opacity: ease(frame, 100, 126),
          }}
        >
          vier Stück weniger
        </div>
      </CameraPush>
    </AbsoluteFill>
  );
};

// ── 3 · Gebühren ────────────────────────────────────────────────────────────
// Mechanik: etwas legt eine Strecke zurück und verliert unterwegs an jeder
// Station. `DrawnLine` zeichnet den Weg, `pointOnPath` schickt die Münze darauf.
const WEG = 'M120 300 C 430 300, 470 620, 760 620 S 1180 300, 1480 300 S 1800 560, 1830 620';
const STATIONEN = [0.3, 0.58, 0.85];

const Gebuehren: React.FC = () => {
  const frame = useCurrentFrame();
  const gezeichnet = ease(frame, 6, 52);
  const reise = ease(frame, 46, 132);
  const punkt = pointOnPath(WEG, reise);

  // Jede Station nimmt etwas weg — die Münze wird kleiner, nicht langsamer.
  const verlust = STATIONEN.reduce((sum, s) => sum + ease(frame, 46 + s * 86, 46 + s * 86 + 12) * 0.17, 0);
  const groesse = 150 * (1 - verlust);

  return (
    <AbsoluteFill>
      <Titel text="Gebühren" unter="Jede Station nimmt sich ihren Teil" />
      <div style={{position: 'absolute', left: 0, top: 180}}>
        <DrawnLine d={WEG} progress={gezeichnet} width={1920} height={760} stroke={OBJECT_TONES.slateRim} strokeWidth={5} />
      </div>

      {STATIONEN.map((s, i) => {
        const p = pointOnPath(WEG, s);
        const auf = ease(frame, 20 + i * 8, 44 + i * 8);
        const abzug = ease(frame, 46 + s * 86, 46 + s * 86 + 30);
        return (
          <div key={i}>
            <div style={{position: 'absolute', left: p.x - 34, top: 180 + p.y - 34, opacity: auf}}>
              <svg width={68} height={68} viewBox="0 0 68 68" fill="none">
                <circle cx={34} cy={34} r={30} fill="#15191C" stroke={TONE.red} strokeWidth={4} />
                <path d="M22 34 H46" stroke={TONE.red} strokeWidth={5} strokeLinecap="round" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                left: p.x - 20,
                top: 180 + p.y + 20 + abzug * 150,
                opacity: Math.min(1, abzug * 2.4) * (1 - abzug * abzug),
              }}
            >
              <Muenze w={58} h={58} farbe={TONE.red} kante="#7A2416" />
            </div>
          </div>
        );
      })}

      <CameraBlur>
        <div style={{position: 'absolute', left: punkt.x - groesse / 2, top: 180 + punkt.y - groesse / 2, opacity: ease(frame, 42, 58)}}>
          <Muenze w={groesse} h={groesse} farbe={TONE.gold} kante={TONE.goldDeep} />
        </div>
      </CameraBlur>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          textAlign: 'center',
          top: 930,
          fontFamily: FONT.body,
          fontSize: 34,
          fontWeight: 900,
          color: TONE.red,
          opacity: ease(frame, 120, 142),
        }}
      >
        gut die Hälfte weg
      </div>
    </AbsoluteFill>
  );
};

// ── 4 · Streuung ────────────────────────────────────────────────────────────
// Mechanik: ein Block zerfällt in viele. Einer fällt aus, das Ganze bleibt
// stehen — der Unterschied zwischen einem Klumpen und vielen Teilen.
const TEILE = Array.from({length: 9}, (_, i) => ({
  zielX: 620 + (i % 3) * 240,
  zielY: 300 + Math.floor(i / 3) * 176,
  faellt: i === 4,
}));

const Streuung: React.FC = () => {
  const frame = useCurrentFrame();
  const zerfall = ease(frame, 30, 76);
  const ausfall = ease(frame, 92, 126);

  return (
    <AbsoluteFill>
      <Titel text="Streuung" unter="Ein Ausfall trifft nicht alles" />
      {TEILE.map((teil, i) => {
        const startX = 860;
        const startY = 410;
        const x = startX + (teil.zielX - startX) * zerfall;
        const y = startY + (teil.zielY - startY) * zerfall;
        const runter = teil.faellt ? ausfall : 0;
        const dreh = (i - 4) * 5 * zerfall;

        return (
          <div key={i}>
            <ContactShadow x={x} y={y + 132} width={150} contact={zerfall} opacity={zerfall * 0.6 * (1 - runter)} />
            <div
              style={{
                position: 'absolute',
                left: x,
                top: y + runter * 260,
                transform: `rotate(${dreh + runter * 22}deg) scale(${1 - zerfall * 0.12})`,
                opacity: 1 - runter * 0.75,
              }}
            >
              <svg width={150} height={132} viewBox="0 0 150 132" fill="none">
                <rect
                  x={5}
                  y={5}
                  width={140}
                  height={122}
                  rx={14}
                  fill={teil.faellt && runter > 0.1 ? '#6E2A1E' : '#1B5E43'}
                  stroke={teil.faellt && runter > 0.1 ? TONE.red : TONE.green}
                  strokeWidth={4}
                />
                <path d="M30 92 L60 62 L88 80 L120 44" stroke={teil.faellt && runter > 0.1 ? TONE.red : TONE.green} strokeWidth={5} fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 830,
          textAlign: 'center',
          fontFamily: FONT.body,
          fontSize: 36,
          fontWeight: 900,
          color: TONE.green,
          opacity: ease(frame, 128, 148),
        }}
      >
        acht von neun tragen weiter
      </div>
    </AbsoluteFill>
  );
};

// ── 5 · Rate ────────────────────────────────────────────────────────────────
// Mechanik: etwas fällt herein und setzt sich ab. Nutzt `dropIn` unverändert aus
// dem Baukasten — dieselbe Physik wie in einer Produktionsszene.
const RATEN = Array.from({length: 9}, (_, i) => ({start: 10 + i * 14, x: 908 + (i % 2 === 0 ? -7 : 6)}));

const Rate: React.FC = () => {
  const frame = useCurrentFrame();
  const boden = 860;

  return (
    <AbsoluteFill>
      <Titel text="Sparrate" unter="Jeden Monat dasselbe, sichtbar mehr" />
      <CameraBlur>
        {RATEN.map((r, i) => {
          const drop = dropIn(frame, {start: r.start, tilt: i % 2 === 0 ? -6 : 5, from: 420});
          const hoehe = 34;
          // Jede Rate legt sich auf die vorige: der Stapel waechst sichtbar nach oben.
          const ruhe = boden - (i + 1) * 27 - hoehe;
          return (
            <div key={i}>
              <ContactShadow x={r.x} y={boden + 10} width={156} contact={drop.contact} opacity={i === 0 ? drop.contact * 0.8 : 0} />
              <div
                style={{
                  position: 'absolute',
                  left: r.x + drop.swingX,
                  top: ruhe + drop.offsetY,
                  transform: `rotate(${drop.rotate}deg) scale(${drop.scaleX}, ${drop.scaleY})`,
                  opacity: drop.progress,
                }}
              >
                <Muenze w={156} h={hoehe} farbe={TONE.gold} kante={TONE.goldDeep} />
              </div>
            </div>
          );
        })}
      </CameraBlur>
    </AbsoluteFill>
  );
};

export const PremiumMotionProbe: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    <Series>
      <Series.Sequence durationInFrames={150}>
        <Zinseszins />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Inflation />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Gebuehren />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Streuung />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Rate />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
