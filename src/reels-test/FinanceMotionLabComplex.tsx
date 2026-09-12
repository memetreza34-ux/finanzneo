import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {C} from '../brand/tokens';
import {LottieBox} from '../brand/components/Lottie';

export const FINANCE_MOTION_LAB_COMPLEX_SCENE_FRAMES = 120;
export const FINANCE_MOTION_LAB_COMPLEX_SCENES = 7;
export const FINANCE_MOTION_LAB_COMPLEX_FRAMES =
  FINANCE_MOTION_LAB_COMPLEX_SCENE_FRAMES * FINANCE_MOTION_LAB_COMPLEX_SCENES;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const progress = (frame: number, from = 6, to = 92) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: ease});

const SceneShell: React.FC<{
  index: string;
  title: string;
  technique: string;
  children: React.ReactNode;
}> = ({index, title, technique, children}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: ease});

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        color: C.white,
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 108,
          left: 72,
          right: 72,
          textAlign: 'center',
          opacity: enter,
          translate: `0 ${interpolate(enter, [0, 1], [28, 0], clamp)}px`,
        }}
      >
        <div style={{fontSize: 24, color: C.accentLt, fontWeight: 900, letterSpacing: 5}}>
          COMPLEX TEST {index}
        </div>
        <div style={{marginTop: 18, fontSize: 62, lineHeight: 1.02, fontWeight: 950, letterSpacing: -2.5}}>
          {title}
        </div>
        <div style={{marginTop: 16, fontSize: 24, color: C.gray, fontWeight: 750}}>
          {technique}
        </div>
      </div>

      <div style={{position: 'absolute', top: 386, left: 56, right: 56, bottom: 150}}>{children}</div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 64,
          textAlign: 'center',
          fontSize: 20,
          color: C.grayDk,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        FINANZNEO · COMPLEX MOTION LAB
      </div>
    </AbsoluteFill>
  );
};

const InflationCurtain: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 12, 88);
  const split = interpolate(p, [0, 1], [18, 82], clamp);
  const oldPrices = ['1,19 €', '0,89 €', '2,49 €'];
  const newPrices = ['1,69 €', '1,29 €', '3,39 €'];
  const groceries = [
    {x: 110, y: 280, w: 150, h: 220, label: 'Milch'},
    {x: 340, y: 210, w: 170, h: 290, label: 'Brot'},
    {x: 610, y: 250, w: 180, h: 250, label: 'Kaffee'},
  ];

  const renderWorld = (modern: boolean) => (
    <div style={{position: 'absolute', inset: 0}}>
      <div
        style={{
          position: 'absolute',
          left: 34,
          right: 34,
          top: 120,
          height: 650,
          border: `1px solid ${C.line}`,
          borderRadius: 34,
          background: modern ? 'linear-gradient(180deg,#0b1710,#050806)' : 'linear-gradient(180deg,#111311,#080908)',
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'absolute', left: 40, top: 34, fontSize: 24, fontWeight: 900, color: modern ? C.negativeLt : C.gray}}>
          {modern ? 'HEUTE' : 'VORHER'}
        </div>
        {groceries.map((g, i) => (
          <div key={g.label} style={{position: 'absolute', left: g.x, top: g.y, width: g.w}}>
            <div
              style={{
                height: g.h,
                borderRadius: 26,
                background: i === 0 ? '#e9ece9' : i === 1 ? '#b18a5a' : '#5d3b28',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 18px 44px rgba(0,0,0,0.32)',
              }}
            >
              <div style={{paddingTop: 28, textAlign: 'center', color: i === 0 ? '#162018' : '#fff', fontWeight: 900, fontSize: 26}}>{g.label}</div>
            </div>
            <div
              style={{
                marginTop: 18,
                borderRadius: 16,
                padding: '14px 16px',
                textAlign: 'center',
                background: modern ? 'rgba(255,51,51,0.15)' : 'rgba(255,255,255,0.07)',
                color: modern ? C.negativeLt : C.white,
                fontWeight: 900,
                fontSize: 28,
              }}
            >
              {(modern ? newPrices : oldPrices)[i]}
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center'}}>
        <span style={{fontSize: 28, color: C.gray}}>Der gleiche Einkauf kostet sichtbar mehr.</span>
      </div>
    </div>
  );

  return (
    <SceneShell index="01" title="Inflation sichtbar machen" technique="Animated comparison curtain + scene replacement">
      <div style={{position: 'absolute', inset: 0}}>
        {renderWorld(false)}
        <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${split}%)`}}>{renderWorld(true)}</div>
        <div
          style={{
            position: 'absolute',
            top: 86,
            bottom: 92,
            left: `${split}%`,
            width: 5,
            background: C.accentLt,
            boxShadow: '0 0 26px rgba(92,255,173,0.45)',
          }}
        />
      </div>
    </SceneShell>
  );
};

const FeeErosionGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 8, 96);
  const cells = Array.from({length: 60}, (_, i) => i);
  const remaining = Math.round(interpolate(p, [0, 1], [60, 44], clamp));

  return (
    <SceneShell index="02" title="Gebühren fressen Rendite" technique="Subtractive grid erosion + delayed residue">
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 26, color: C.gray, marginBottom: 34, fontWeight: 800}}>Langfristiger Portfolio-Wert</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 76px)', gap: 12}}>
          {cells.map((cell) => {
            const row = Math.floor(cell / 10);
            const col = cell % 10;
            const rank = 59 - (row * 10 + col);
            const survives = rank < remaining;
            const vanishAt = interpolate(rank, [44, 59], [0.18, 0.88], clamp);
            const vanish = interpolate(p, [vanishAt, Math.min(1, vanishAt + 0.14)], [0, 1], clamp);
            return (
              <div
                key={cell}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 16,
                  backgroundColor: survives ? C.accentDk : C.negativeDk,
                  border: `1px solid ${survives ? C.accentLt : C.negativeLt}`,
                  opacity: survives ? 1 : 1 - vanish,
                  scale: survives ? 1 : interpolate(vanish, [0, 1], [1, 0.45], clamp),
                  translate: survives ? '0 0' : `0 ${interpolate(vanish, [0, 1], [0, 24], clamp)}px`,
                }}
              />
            );
          })}
        </div>
        <div style={{marginTop: 46, display: 'flex', gap: 30, fontWeight: 900, fontSize: 28}}>
          <span style={{color: C.accentLt}}>Vermögen bleibt</span>
          <span style={{color: C.negativeLt}}>Gebühren verschwinden dauerhaft</span>
        </div>
      </div>
    </SceneShell>
  );
};

const TaxDocumentFocus: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 10, 90);
  const scanY = interpolate(p, [0, 1], [130, 720], clamp);
  const reveal = interpolate(p, [0.38, 0.66], [0, 1], clamp);
  const rows = [
    ['Brutto', '4.000 €'],
    ['Lohnsteuer', '- 520 €'],
    ['Sozialabgaben', '- 810 €'],
    ['Netto', '2.670 €'],
  ];

  return (
    <SceneShell index="03" title="Brutto ist nicht Netto" technique="Document spotlight scan + semantic focus lock">
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 760,
            height: 860,
            borderRadius: 30,
            background: '#f2f0e8',
            color: '#101410',
            padding: 52,
            boxShadow: '0 34px 90px rgba(0,0,0,0.55)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{fontSize: 34, fontWeight: 950}}>Gehaltsabrechnung</div>
          <div style={{fontSize: 19, color: '#596259', marginTop: 8}}>Beispielhafte Darstellung</div>
          <div style={{marginTop: 56}}>
            {rows.map(([name, value], i) => {
              const y = 230 + i * 130;
              const active = Math.abs(scanY - y) < 90;
              const net = i === 3;
              return (
                <div
                  key={name}
                  style={{
                    height: 94,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0,0,0,0.12)',
                    fontSize: 29,
                    fontWeight: net ? 950 : 750,
                    background: active ? 'rgba(0,210,106,0.13)' : 'transparent',
                    padding: '0 20px',
                  }}
                >
                  <span>{name}</span>
                  <span style={{color: i === 1 || i === 2 ? '#b01030' : net ? '#00803f' : '#101410'}}>{value}</span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 38,
              right: 38,
              top: scanY,
              height: 4,
              background: '#00b95f',
              opacity: 0.7,
              boxShadow: '0 0 22px rgba(0,185,95,0.42)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 52,
              bottom: 44,
              border: '5px solid #00803f',
              borderRadius: 14,
              padding: '14px 24px',
              fontSize: 25,
              fontWeight: 950,
              color: '#00803f',
              opacity: reveal,
              rotate: `${interpolate(reveal, [0, 1], [-8, -3], clamp)}deg`,
              scale: interpolate(reveal, [0, 1], [1.4, 1], clamp),
            }}
          >
            NETTO ENTSCHEIDET
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const DiversificationMosaic: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 8, 94);
  const sectors = [
    {name: 'Tech', c: '#6EE7B7'},
    {name: 'Industrie', c: '#8FBEFF'},
    {name: 'Gesundheit', c: '#D9C4FF'},
    {name: 'Konsum', c: '#FFE49A'},
    {name: 'Finanzen', c: '#7BFFC0'},
    {name: 'Energie', c: '#FF9B8F'},
    {name: 'Versorger', c: '#A9D6FF'},
    {name: 'Immobilien', c: '#E0C5FF'},
    {name: 'Rohstoffe', c: '#F5D47A'},
  ];

  return (
    <SceneShell index="04" title="Diversifikation statt Einzelwette" technique="Sector mosaic assembly + concentration collapse">
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 820, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18}}>
          {sectors.map((sector, i) => {
            const local = interpolate(p, [i * 0.045, Math.min(1, i * 0.045 + 0.24)], [0, 1], clamp);
            const concentrated = p < 0.42;
            const opacity = concentrated && i > 0 ? interpolate(p, [0, 0.32, 0.42], [0, 0, 0.25], clamp) : local;
            return (
              <div
                key={sector.name}
                style={{
                  height: 178,
                  borderRadius: 28,
                  background: `linear-gradient(145deg, ${sector.c}22, ${sector.c}08)`,
                  border: `2px solid ${sector.c}`,
                  opacity,
                  scale: i === 0 && p < 0.42 ? interpolate(p, [0, 0.36], [1.55, 1.1], clamp) : interpolate(local, [0, 1], [0.78, 1], clamp),
                  translate: `${interpolate(local, [0, 1], [(i % 3 - 1) * 80, 0], clamp)}px ${interpolate(local, [0, 1], [(Math.floor(i / 3) - 1) * 60, 0], clamp)}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 25,
                  fontWeight: 900,
                  color: sector.c,
                }}
              >
                {sector.name}
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 42, fontSize: 27, fontWeight: 850, color: p < 0.42 ? C.negativeLt : C.accentLt}}>
          {p < 0.42 ? 'Eine Branche dominiert das Risiko' : 'Risiko verteilt sich auf viele Bereiche'}
        </div>
      </div>
    </SceneShell>
  );
};

const CrashSimulation: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 4, 108);
  const revealX = interpolate(p, [0, 1], [70, 860], clamp);
  const paths = [
    'M70 670 C170 620 250 580 330 540 C430 490 500 455 570 430 C650 400 740 360 860 310',
    'M70 710 C160 650 245 620 330 575 C410 525 490 470 570 455 C665 430 740 390 860 345',
    'M70 650 C170 610 245 560 330 520 C430 470 480 430 570 420 C650 390 760 350 860 290',
    'M70 690 C175 630 250 590 330 560 C420 525 500 500 570 470 C660 435 760 410 860 370',
    'M70 730 C150 680 250 625 330 600 C430 540 500 520 570 500 C675 465 755 430 860 395',
  ];
  const crashP = interpolate(p, [0.35, 0.5, 0.72, 1], [0, 1, 1, 0], clamp);

  return (
    <SceneShell index="05" title="Crash ist nicht das Ende" technique="Scenario ribbon + masked time reveal + recovery shock">
      <div style={{position: 'absolute', inset: 0}}>
        <svg viewBox="0 0 920 980" style={{width: '100%', height: '100%'}}>
          {[180, 360, 540, 720].map((y) => (
            <line key={y} x1="70" x2="860" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          ))}
          <defs>
            <clipPath id="timelineReveal"><rect x="0" y="0" width={revealX} height="980" /></clipPath>
          </defs>
          <g clipPath="url(#timelineReveal)">
            {paths.map((d, i) => (
              <path key={d} d={d} fill="none" stroke={i === 2 ? C.accentLt : 'rgba(143,190,255,0.42)'} strokeWidth={i === 2 ? 10 : 5} strokeLinecap="round" />
            ))}
            <path d="M430 470 C470 510 505 680 545 735 C575 765 605 545 650 465" fill="none" stroke={C.negativeLt} strokeWidth="18" strokeLinecap="round" opacity={crashP} />
          </g>
          <line x1={revealX} y1="90" x2={revealX} y2="820" stroke={C.white} strokeWidth="3" opacity="0.55" />
          <text x="95" y="875" fill={C.gray} fontSize="25" fontWeight="800">START</text>
          <text x="730" y="875" fill={C.gray} fontSize="25" fontWeight="800">LANGFRISTIG</text>
        </svg>
      </div>
    </SceneShell>
  );
};

const LottieCostCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 4, 100);
  const warn = interpolate(p, [0, 0.3, 0.42], [0, 1, 0.25], clamp);
  const search = interpolate(p, [0.28, 0.58], [0, 1], clamp);
  const cart = interpolate(p, [0.56, 0.86], [0, 1], clamp);

  return (
    <SceneShell index="06" title="Kostencheck vor dem Kauf" technique="Lottie orchestration + staged semantic handoff">
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{opacity: warn, scale: interpolate(warn, [0, 1], [0.72, 1], clamp)}}>
            <LottieBox file="lottie/warnung.json" size={250} />
          </div>
          <div style={{fontSize: 58, fontWeight: 950, color: C.grayDk}}>→</div>
          <div style={{opacity: search, scale: interpolate(search, [0, 1], [0.72, 1], clamp)}}>
            <LottieBox file="lottie/lupe.json" size={250} />
          </div>
          <div style={{fontSize: 58, fontWeight: 950, color: C.grayDk}}>→</div>
          <div style={{opacity: cart, scale: interpolate(cart, [0, 1], [0.72, 1], clamp)}}>
            <LottieBox file="lottie/warenkorb.json" size={250} />
          </div>
        </div>
        <div style={{marginTop: 64, width: 820, display: 'flex', justifyContent: 'space-between', fontSize: 23, fontWeight: 900}}>
          <span style={{color: C.negativeLt}}>1. Problem erkennen</span>
          <span style={{color: C.blueLt}}>2. Prüfen</span>
          <span style={{color: C.accentLt}}>3. Bewusst kaufen</span>
        </div>
      </div>
    </SceneShell>
  );
};

const KineticDecision: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 4, 110);
  const stages = [
    {from: 0, to: 0.28, text: '1 % KOSTEN', color: C.negativeLt},
    {from: 0.24, to: 0.56, text: '30 JAHRE', color: C.white},
    {from: 0.52, to: 0.8, text: '≈ TAUSENDE €', color: C.gold},
    {from: 0.76, to: 1, text: 'KOSTEN PRÜFEN', color: C.accentLt},
  ];

  return (
    <SceneShell index="07" title="Eine kleine Zahl wird groß" technique="Kinetic typography + scale-space replacement">
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {stages.map((stage, i) => {
          const inP = interpolate(p, [stage.from, Math.min(stage.to, stage.from + 0.12)], [0, 1], clamp);
          const outP = interpolate(p, [Math.max(stage.from, stage.to - 0.1), stage.to], [1, 0], clamp);
          const visible = Math.min(inP, outP);
          const direction = i % 2 === 0 ? -1 : 1;
          return (
            <div
              key={stage.text}
              style={{
                position: 'absolute',
                fontSize: i === 2 ? 86 : 96,
                fontWeight: 950,
                letterSpacing: -4,
                color: stage.color,
                opacity: visible,
                scale: interpolate(visible, [0, 1], [1.55, 1], clamp),
                translate: `${direction * interpolate(visible, [0, 1], [120, 0], clamp)}px 0`,
                textAlign: 'center',
                width: 900,
              }}
            >
              {stage.text}
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const scenes = [
  InflationCurtain,
  FeeErosionGrid,
  TaxDocumentFocus,
  DiversificationMosaic,
  CrashSimulation,
  LottieCostCheck,
  KineticDecision,
];

export const FinanceMotionLabComplex: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000'}}>
    {scenes.map((Scene, index) => (
      <Sequence
        key={index}
        from={index * FINANCE_MOTION_LAB_COMPLEX_SCENE_FRAMES}
        durationInFrames={FINANCE_MOTION_LAB_COMPLEX_SCENE_FRAMES}
      >
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
