import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FORMAT} from '../brand/tokens';

export const FINANCE_MOTION_LAB_SCENE_FRAMES = 90;
export const FINANCE_MOTION_LAB_SCENES = 7;
export const FINANCE_MOTION_LAB_FRAMES =
  FINANCE_MOTION_LAB_SCENE_FRAMES * FINANCE_MOTION_LAB_SCENES;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const sceneProgress = (frame: number, from = 4, to = 70) =>
  interpolate(frame, [from, to], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const SceneShell: React.FC<{
  eyebrow: string;
  title: string;
  technique: string;
  children: React.ReactNode;
}> = ({eyebrow, title, technique, children}) => {
  const frame = useCurrentFrame();
  const header = spring({
    frame,
    fps: FORMAT.fps,
    config: {damping: 18, stiffness: 145, mass: 0.8},
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        color: C.white,
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 116,
          left: 72,
          right: 72,
          textAlign: 'center',
          opacity: interpolate(header, [0, 1], [0, 1], clamp),
          transform: `translateY(${interpolate(header, [0, 1], [26, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            color: C.accentLt,
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 62,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: -2.5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 25,
            color: C.gray,
            fontWeight: 700,
          }}
        >
          {technique}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 390,
          left: 64,
          right: 64,
          bottom: 180,
        }}
      >
        {children}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 22,
          color: C.grayDk,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        FINANZNEO · REMOTION MOTION LAB
      </div>
    </AbsoluteFill>
  );
};

const ZinseszinsLine: React.FC = () => {
  const frame = useCurrentFrame();
  const p = sceneProgress(frame, 8, 68);
  const pathLength = 860;
  const values = ['10k', '14k', '20k', '29k', '43k'];
  const points = [
    {x: 80, y: 740},
    {x: 270, y: 650},
    {x: 460, y: 515},
    {x: 650, y: 330},
    {x: 840, y: 105},
  ];

  return (
    <SceneShell eyebrow="Test 01" title="Zinseszins" technique="SVG Path Draw + Number Reveal">
      <div style={{position: 'absolute', inset: 0, borderRadius: 34, border: `1px solid ${C.line}`}}>
        <svg viewBox="0 0 920 860" style={{width: '100%', height: '100%'}}>
          {[170, 340, 510, 680].map((y) => (
            <line key={y} x1="68" x2="860" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          ))}
          <path
            d="M 80 740 C 180 720, 210 680, 270 650 C 360 610, 400 555, 460 515 C 545 455, 595 385, 650 330 C 740 245, 785 160, 840 105"
            fill="none"
            stroke={C.accentLt}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - p)}
          />
          {points.map((point, index) => {
            const local = interpolate(p, [index / 5, Math.min(1, index / 5 + 0.22)], [0, 1], clamp);
            return (
              <g key={point.x} opacity={local}>
                <circle cx={point.x} cy={point.y} r={11 + local * 7} fill={C.accentLt} />
                <text x={point.x} y={point.y - 34} textAnchor="middle" fill="white" fontSize="30" fontWeight="800">
                  {values[index]} €
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </SceneShell>
  );
};

const SparplanBars: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bars = [0.32, 0.43, 0.57, 0.69, 0.82, 0.96];

  return (
    <SceneShell eyebrow="Test 02" title="Sparplan" technique="Spring + Staggered Bars">
      <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 26, padding: '80px 28px 160px'}}>
        {bars.map((height, index) => {
          const progress = spring({
            frame: frame - index * 7,
            fps,
            config: {damping: 16, stiffness: 135, mass: 0.75},
          });
          const px = 760 * height * progress;
          return (
            <div key={height} style={{width: 104, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'}}>
              <div style={{fontSize: 25, fontWeight: 850, marginBottom: 14, opacity: progress}}>
                {Math.round(1000 + index * 650 * progress).toLocaleString('de-DE')} €
              </div>
              <div
                style={{
                  height: px,
                  width: 104,
                  borderRadius: '24px 24px 12px 12px',
                  background: `linear-gradient(180deg, ${C.accentLt}, ${C.accentDk})`,
                  boxShadow: `0 0 34px rgba(92,255,173,${0.18 * progress})`,
                }}
              />
              <div style={{fontSize: 21, color: C.gray, marginTop: 14}}>J{index + 1}</div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const PortfolioDonut: React.FC = () => {
  const frame = useCurrentFrame();
  const p = sceneProgress(frame, 6, 62);
  const radius = 225;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    {label: 'ETF', value: 0.6, color: C.accentLt},
    {label: 'Cash', value: 0.25, color: C.blueLt},
    {label: 'Gold', value: 0.15, color: C.gold},
  ];
  let offset = 0;

  return (
    <SceneShell eyebrow="Test 03" title="Portfolio" technique="SVG Donut Reveal + Rotation">
      <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg viewBox="0 0 900 900" style={{width: 880, height: 880}}>
          <g transform="rotate(-90 450 450)">
            <circle cx="450" cy="450" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="72" />
            {segments.map((segment, index) => {
              const length = circumference * segment.value;
              const dashOffset = circumference - length * p;
              const rotation = (offset / circumference) * 360;
              offset += length;
              return (
                <circle
                  key={segment.label}
                  cx="450"
                  cy="450"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="72"
                  strokeLinecap="round"
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(${rotation} 450 450)`}
                  opacity={interpolate(p, [index * 0.08, 0.35 + index * 0.08], [0.15, 1], clamp)}
                />
              );
            })}
          </g>
          <text x="450" y="430" textAnchor="middle" fill="white" fontSize="50" fontWeight="900">10.000 €</text>
          <text x="450" y="482" textAnchor="middle" fill={C.gray} fontSize="26" fontWeight="700">Beispiel-Portfolio</text>
        </svg>
        <div style={{position: 'absolute', bottom: 130, display: 'flex', gap: 34}}>
          {segments.map((segment) => (
            <div key={segment.label} style={{fontSize: 25, fontWeight: 800, color: segment.color}}>
              {segment.label} · {Math.round(segment.value * 100)}%
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

const CashflowPath: React.FC = () => {
  const frame = useCurrentFrame();
  const loop = (frame % 54) / 54;
  const nodeY = [250, 570, 850];
  const dotX = interpolate(loop, [0, 1], [130, 790], clamp);
  const activeY = interpolate(loop, [0, 0.48, 0.52, 1], [nodeY[0], nodeY[0], nodeY[1], nodeY[1]], clamp);

  return (
    <SceneShell eyebrow="Test 04" title="Cashflow" technique="Moving Path + Connected Nodes">
      <div style={{position: 'absolute', inset: 0}}>
        <svg viewBox="0 0 920 1100" style={{width: '100%', height: '100%'}}>
          <path d="M130 250 H790 M790 250 V570 H130 M130 570 V850 H790" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="10" strokeLinecap="round" />
          <circle cx={dotX} cy={activeY} r="20" fill={C.accentLt} />
          <circle cx={dotX} cy={activeY} r="38" fill="none" stroke="rgba(92,255,173,0.28)" strokeWidth="5" />
          {[
            {x: 130, y: 250, label: '3.000 €', sub: 'EINKOMMEN', color: C.white},
            {x: 130, y: 570, label: '2.100 €', sub: 'AUSGABEN', color: C.negativeLt},
            {x: 790, y: 850, label: '900 €', sub: 'SPAREN', color: C.accentLt},
          ].map((node) => (
            <g key={node.sub}>
              <circle cx={node.x} cy={node.y} r="72" fill="#07110b" stroke={node.color} strokeWidth="6" />
              <text x={node.x} y={node.y - 4} textAnchor="middle" fill={node.color} fontSize="28" fontWeight="900">{node.label}</text>
              <text x={node.x} y={node.y + 34} textAnchor="middle" fill={C.gray} fontSize="18" fontWeight="800">{node.sub}</text>
            </g>
          ))}
        </svg>
      </div>
    </SceneShell>
  );
};

const KreditPayoff: React.FC = () => {
  const frame = useCurrentFrame();
  const p = sceneProgress(frame, 8, 72);
  const rest = Math.round(interpolate(p, [0, 1], [20000, 12400], clamp));
  const interestShare = interpolate(p, [0, 1], [0.48, 0.18], clamp);

  return (
    <SceneShell eyebrow="Test 05" title="Kredit abbauen" technique="Number Tween + Morphing Split Bar">
      <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 54}}>
        <div style={{fontSize: 118, fontWeight: 950, letterSpacing: -6}}>{rest.toLocaleString('de-DE')} €</div>
        <div style={{fontSize: 28, color: C.gray, fontWeight: 750}}>Restschuld</div>
        <div style={{width: 860, height: 150, borderRadius: 34, overflow: 'hidden', display: 'flex', border: `1px solid ${C.line}`}}>
          <div
            style={{
              width: `${interestShare * 100}%`,
              backgroundColor: C.negativeDk,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 25, fontWeight: 850,
            }}
          >
            Zins
          </div>
          <div
            style={{
              width: `${(1 - interestShare) * 100}%`,
              backgroundColor: C.accentDk,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 25, fontWeight: 850,
            }}
          >
            Tilgung
          </div>
        </div>
        <div style={{fontSize: 25, color: C.accentLt, fontWeight: 850}}>
          Tilgungsanteil wächst sichtbar
        </div>
      </div>
    </SceneShell>
  );
};

const RisikoScatter: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dots = [
    {x: 170, y: 690, label: 'Cash', color: C.blueLt},
    {x: 330, y: 610, label: 'Anleihen', color: C.purpleLt},
    {x: 520, y: 470, label: 'ETF', color: C.accentLt},
    {x: 720, y: 295, label: 'Aktien', color: C.gold},
    {x: 820, y: 170, label: 'Krypto', color: C.negativeLt},
  ];

  return (
    <SceneShell eyebrow="Test 06" title="Risiko & Rendite" technique="Data Viz + Spring Scatterplot">
      <svg viewBox="0 0 920 940" style={{width: '100%', height: '100%'}}>
        <line x1="100" y1="790" x2="850" y2="790" stroke="rgba(255,255,255,0.28)" strokeWidth="5" />
        <line x1="100" y1="790" x2="100" y2="100" stroke="rgba(255,255,255,0.28)" strokeWidth="5" />
        <text x="840" y="850" textAnchor="end" fill={C.gray} fontSize="24" fontWeight="800">RISIKO →</text>
        <text x="60" y="120" textAnchor="start" fill={C.gray} fontSize="24" fontWeight="800" transform="rotate(-90 60 120)">RENDITEC HANCE →</text>
        <path d="M150 720 C 300 670, 440 560, 560 445 C 690 320, 770 215, 830 140" fill="none" stroke="rgba(92,255,173,0.22)" strokeWidth="8" strokeDasharray="18 18" />
        {dots.map((dot, index) => {
          const p = spring({frame: frame - index * 7, fps, config: {damping: 14, stiffness: 150, mass: 0.7}});
          const y = interpolate(p, [0, 1], [790, dot.y], clamp);
          return (
            <g key={dot.label} opacity={p}>
              <circle cx={dot.x} cy={y} r={18 + p * 11} fill={dot.color} />
              <text x={dot.x} y={y - 42} textAnchor="middle" fill="white" fontSize="25" fontWeight="800">{dot.label}</text>
            </g>
          );
        })}
      </svg>
    </SceneShell>
  );
};

const ReserveDepth: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cards = ['1 Monat', '2 Monate', '3 Monate'];
  const camera = spring({frame, fps, config: {damping: 20, stiffness: 110, mass: 0.9}});
  const rotateY = interpolate(camera, [0, 1], [-18, 9], clamp);
  const rotateX = interpolate(camera, [0, 1], [16, -5], clamp);

  return (
    <SceneShell eyebrow="Test 07" title="Notgroschen" technique="CSS 3D Perspective + Depth Assembly">
      <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: 1400}}>
        <div
          style={{
            width: 760,
            height: 780,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          {cards.map((label, index) => {
            const p = spring({frame: frame - index * 10, fps, config: {damping: 16, stiffness: 125, mass: 0.78}});
            const y = interpolate(p, [0, 1], [250 + index * 80, 110 + index * 135], clamp);
            const z = interpolate(p, [0, 1], [-260, index * 85], clamp);
            return (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  left: 70,
                  right: 70,
                  top: y,
                  height: 190,
                  borderRadius: 36,
                  border: `2px solid ${index === 2 ? C.accentLt : 'rgba(255,255,255,0.16)'}`,
                  background: index === 2 ? 'rgba(0,210,106,0.18)' : 'rgba(17,38,26,0.92)',
                  boxShadow: index === 2 ? '0 30px 80px rgba(0,210,106,0.18)' : '0 30px 70px rgba(0,0,0,0.35)',
                  transform: `translateZ(${z}px)`,
                  opacity: p,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 48px',
                }}
              >
                <div style={{fontSize: 33, fontWeight: 900}}>{label}</div>
                <div style={{fontSize: 28, color: index === 2 ? C.accentLt : C.whiteSoft, fontWeight: 850}}>{(1500 * (index + 1)).toLocaleString('de-DE')} €</div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const scenes = [
  ZinseszinsLine,
  SparplanBars,
  PortfolioDonut,
  CashflowPath,
  KreditPayoff,
  RisikoScatter,
  ReserveDepth,
] as const;

export const FinanceMotionLab: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {scenes.map((Scene, index) => (
      <Sequence key={index} from={index * FINANCE_MOTION_LAB_SCENE_FRAMES} durationInFrames={FINANCE_MOTION_LAB_SCENE_FRAMES}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
