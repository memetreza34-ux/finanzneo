import React from 'react';
import {
  AbsoluteFill,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
} from 'remotion';
import {
  AnimationStage,
  C,
  Captions,
  SceneHeader,
  SceneTransition,
  type CaptionWord,
  type IconName,
  type SceneHeaderTone,
} from '../brand';

export const FINANCE_HEADER_CAPTION_MOTION_SCENE_FRAMES = 150;
const SCENE_FRAMES = FINANCE_HEADER_CAPTION_MOTION_SCENE_FRAMES;
export const FINANCE_HEADER_CAPTION_MOTION_FRAMES = SCENE_FRAMES * 6;
const FPS = 30;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const enter = (frame: number, from = 0, to = 24) => interpolate(frame, [from, to], [0, 1], clamp);

const makeCaptionWords = (text: string): CaptionWord[] => {
  const words = text.trim().split(/\s+/);
  const start = 0.28;
  const end = 4.62;
  const step = (end - start) / Math.max(1, words.length);
  return words.map((word, index) => ({
    word,
    start: start + step * index,
    end: start + step * (index + 0.82),
  }));
};

const stage: React.CSSProperties = {
  position: 'absolute',
  left: 92,
  right: 92,
  top: 382,
  height: 930,
};

const label: React.CSSProperties = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontWeight: 700,
  letterSpacing: -0.5,
  color: C.white,
};

const smallLabel: React.CSSProperties = {
  ...label,
  fontSize: 30,
  color: C.whiteSoft,
};

const panel: React.CSSProperties = {
  background: 'rgba(255,255,255,0.035)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 28,
};

const TaxBrackets: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [10, 105], [0, 690], clamp);
  const marker = interpolate(frame, [72, 118], [0, 1], clamp);
  const brackets = [
    {name: 'Freibetrag', h: 210, color: 'rgba(255,255,255,0.10)'},
    {name: 'mittlere Zone', h: 240, color: 'rgba(57,255,167,0.20)'},
    {name: 'obere Zone', h: 240, color: 'rgba(255,138,76,0.23)'},
  ];

  return (
    <div style={{...stage, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 64}}>
      <div style={{position: 'relative', width: 260, height: 720, ...panel, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column-reverse'}}>
          {brackets.map((b) => (
            <div key={b.name} style={{height: b.h, background: b.color, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{...smallLabel, fontSize: 25, textAlign: 'center'}}>{b.name}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 34, right: 34, bottom: 18, height: rise, borderRadius: 20, background: 'linear-gradient(180deg, rgba(57,255,167,0.94), rgba(57,255,167,0.36))', boxShadow: '0 0 42px rgba(57,255,167,0.22)'}} />
      </div>

      <div style={{width: 430}}>
        <div style={{...label, fontSize: 54, lineHeight: 1.03}}>Dein Einkommen läuft durch mehrere Steuerzonen.</div>
        <div style={{height: 30}} />
        <div style={{...panel, padding: '24px 26px', opacity: marker, transform: `translateX(${(1 - marker) * 30}px)`}}>
          <div style={{...label, fontSize: 34, color: C.accentLt}}>Wichtig</div>
          <div style={{...smallLabel, marginTop: 8}}>Nur der Teil in der oberen Zone wird dort höher belastet.</div>
        </div>
      </div>
    </div>
  );
};

const LoanAmortization: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [12, 132], [0, 1], clamp);
  const split = interpolate(p, [0, 1], [0.66, 0.27]);
  const debt = interpolate(p, [0, 1], [1, 0.42]);
  const pop = spring({frame: Math.max(0, frame - 8), fps: FPS, config: {damping: 16, stiffness: 130}});

  return (
    <div style={{...stage, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 52}}>
      <div style={{...label, fontSize: 40, textAlign: 'center', color: C.whiteSoft}}>Eine Monatsrate – zwei Aufgaben</div>
      <div style={{display: 'flex', height: 170, borderRadius: 36, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', transform: `scale(${0.96 + pop * 0.04})`}}>
        <div style={{width: `${split * 100}%`, background: 'rgba(255,128,74,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{textAlign: 'center'}}><div style={{...label, fontSize: 48, color: '#FF9B66'}}>Zins</div><div style={{...smallLabel, marginTop: 6}}>{Math.round(split * 100)} %</div></div>
        </div>
        <div style={{flex: 1, background: 'rgba(57,255,167,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{textAlign: 'center'}}><div style={{...label, fontSize: 48, color: C.accentLt}}>Tilgung</div><div style={{...smallLabel, marginTop: 6}}>{Math.round((1 - split) * 100)} %</div></div>
        </div>
      </div>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', ...smallLabel, marginBottom: 16}}><span>Restschuld</span><span>{Math.round(debt * 100)} %</span></div>
        <div style={{height: 64, borderRadius: 24, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${debt * 100}%`, borderRadius: 24, background: 'linear-gradient(90deg, rgba(255,128,74,0.82), rgba(255,183,106,0.46))'}} />
        </div>
      </div>
    </div>
  );
};

const CostAverage: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [8, 118], [0, 1], clamp);
  const purchases = [
    {x: 150, price: 0.78, units: 5},
    {x: 340, price: 0.46, units: 8},
    {x: 530, price: 0.63, units: 6},
    {x: 720, price: 0.34, units: 10},
  ];
  const points = Array.from({length: 11}, (_, i) => {
    const x = 55 + i * 78;
    const y = 190 + Math.sin(i * 0.95) * 98 + Math.cos(i * 0.45) * 42;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{...stage, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{position: 'relative', height: 570, ...panel, padding: 34}}>
        <svg width="100%" height="390" viewBox="0 0 900 390" style={{overflow: 'visible'}}>
          <polyline points={points} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} />
          {purchases.map((item, index) => {
            const local = enter(frame, 28 + index * 18, 50 + index * 18);
            const y = 60 + item.price * 270;
            return (
              <g key={item.x} opacity={local}>
                <line x1={item.x} y1={y} x2={item.x} y2={352} stroke="rgba(57,255,167,0.28)" strokeWidth="3" strokeDasharray="8 10" />
                <circle cx={item.x} cy={y} r={13} fill={C.accentLt} />
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', left: 35, right: 35, bottom: 32, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end'}}>
          {purchases.map((item, index) => {
            const local = enter(frame, 32 + index * 18, 62 + index * 18);
            return (
              <div key={item.x} style={{width: 130, textAlign: 'center', opacity: local}}>
                <div style={{height: item.units * 18, borderRadius: '16px 16px 6px 6px', background: 'linear-gradient(180deg, rgba(57,255,167,0.92), rgba(57,255,167,0.25))'}} />
                <div style={{...smallLabel, fontSize: 24, marginTop: 10}}>100 €</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{...smallLabel, fontSize: 28, textAlign: 'center', marginTop: 30}}>Gleicher Sparbetrag · bei tieferen Kursen mehr Anteile</div>
    </div>
  );
};

const SpreadMechanic: React.FC = () => {
  const frame = useCurrentFrame();
  const close = interpolate(frame, [12, 88], [0, 1], clamp);
  const trade = interpolate(frame, [88, 110, 132], [0, 1, 0], clamp);
  const gap = Math.round(interpolate(close, [0, 1], [34, 8]));

  return (
    <div style={{...stage, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 42}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{...label, fontSize: 36, color: C.accentLt}}>Käufer</div>
        <div style={{...label, fontSize: 36, color: '#FF9B66'}}>Verkäufer</div>
      </div>
      <div style={{position: 'relative', height: 410, ...panel, overflow: 'hidden'}}>
        {[0,1,2].map((i) => {
          const x = interpolate(close, [0,1], [80 + i * 34, 250 + i * 28]);
          return <div key={`b-${i}`} style={{position: 'absolute', left: x, top: 80 + i * 84, width: 210 - i * 18, height: 58, borderRadius: 16, background: `rgba(57,255,167,${0.28 + i * 0.09})`, border: '1px solid rgba(57,255,167,0.34)'}} />;
        })}
        {[0,1,2].map((i) => {
          const right = interpolate(close, [0,1], [80 + i * 34, 250 + i * 28]);
          return <div key={`s-${i}`} style={{position: 'absolute', right, top: 80 + i * 84, width: 210 - i * 18, height: 58, borderRadius: 16, background: `rgba(255,139,79,${0.28 + i * 0.09})`, border: '1px solid rgba(255,139,79,0.34)'}} />;
        })}
        <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.10)'}} />
        <div style={{position: 'absolute', left: '50%', top: 172, transform: 'translateX(-50%)', padding: '16px 22px', borderRadius: 18, background: `rgba(255,255,255,${0.05 + trade * 0.16})`, boxShadow: `0 0 ${trade * 70}px rgba(57,255,167,0.44)`}}>
          <div style={{...label, fontSize: 31, textAlign: 'center'}}>Spread {gap}</div>
        </div>
      </div>
      <div style={{...smallLabel, textAlign: 'center'}}>Treffen sich Kauf- und Verkaufspreis, entsteht ein Handel.</div>
    </div>
  );
};

const Diversification: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [8, 100], [0, 1], clamp);
  const focus = interpolate(frame, [72, 130], [0, 1], clamp);
  const tracks = [0.2, 1.1, 2.0, 2.7, 3.5];
  const build = (phase: number, damp = 1) => Array.from({length: 14}, (_, i) => {
    const x = 35 + i * 64;
    const noise = (Math.sin(i * 1.25 + phase) * 82 + Math.cos(i * 0.65 + phase * 1.7) * 42) * damp;
    const y = 205 + noise;
    return `${x},${y}`;
  }).join(' ');
  const portfolio = Array.from({length: 14}, (_, i) => {
    const x = 35 + i * 64;
    const ys = tracks.map((phase) => 205 + Math.sin(i * 1.25 + phase) * 82 + Math.cos(i * 0.65 + phase * 1.7) * 42);
    const y = ys.reduce((a,b) => a+b,0) / ys.length;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{...stage, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 30}}>
      <div style={{height: 520, ...panel, padding: 30}}>
        <svg width="100%" height="100%" viewBox="0 0 900 430">
          {tracks.map((phase) => (
            <polyline key={phase} points={build(phase)} fill="none" stroke={`rgba(255,255,255,${0.23 - focus * 0.13})`} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-reveal} />
          ))}
          <polyline points={portfolio} fill="none" stroke={C.accentLt} strokeWidth={8 + focus * 5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-reveal} style={{filter: `drop-shadow(0 0 ${8 + focus * 18}px rgba(57,255,167,0.38))`}} />
        </svg>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap'}}>
        <span style={{...smallLabel, fontSize: 26}}>Einzelwerte schwanken stark</span>
        <span style={{...smallLabel, fontSize: 26, color: C.accentLt}}>→ Mischung kann ruhiger werden</span>
      </div>
    </div>
  );
};

const BondInverse: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [12, 120], [0, 1], clamp);
  const tilt = interpolate(p, [0, 1], [-7, 11]);
  const leftY = interpolate(p, [0, 1], [70, -55]);
  const rightY = interpolate(p, [0, 1], [-45, 82]);

  return (
    <div style={{...stage, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{position: 'relative', height: 600}}>
        <div style={{position: 'absolute', left: '50%', top: 310, width: 780, height: 30, borderRadius: 20, transform: `translateX(-50%) rotate(${tilt}deg)`, transformOrigin: '50% 50%', background: 'linear-gradient(90deg, rgba(57,255,167,0.55), rgba(255,255,255,0.22), rgba(255,139,79,0.58))'}} />
        <div style={{position: 'absolute', left: '50%', top: 328, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '46px solid transparent', borderRight: '46px solid transparent', borderBottom: '100px solid rgba(255,255,255,0.18)'}} />
        <div style={{position: 'absolute', left: 85, top: 165 + leftY, width: 300, padding: '30px 26px', ...panel, textAlign: 'center'}}>
          <div style={{...label, fontSize: 40, color: C.accentLt}}>Marktzins</div>
          <div style={{...label, fontSize: 72, marginTop: 8}}>↑</div>
        </div>
        <div style={{position: 'absolute', right: 85, top: 165 + rightY, width: 300, padding: '30px 26px', ...panel, textAlign: 'center'}}>
          <div style={{...label, fontSize: 40, color: '#FF9B66'}}>alte Anleihe</div>
          <div style={{...label, fontSize: 72, marginTop: 8}}>↓</div>
        </div>
      </div>
      <div style={{...smallLabel, textAlign: 'center', fontSize: 29}}>Neue höhere Zinsen machen ältere niedrig verzinste Anleihen weniger attraktiv.</div>
    </div>
  );
};

type Scene = {
  title: string;
  icon: IconName;
  tone: SceneHeaderTone;
  caption: string;
  component: React.FC;
};

const scenes: Scene[] = [
  {
    title: 'So funktionieren Steuerstufen',
    icon: 'percent',
    tone: 'money',
    caption: 'Nicht dein ganzes Einkommen wird mit dem höchsten Satz besteuert.',
    component: TaxBrackets,
  },
  {
    title: 'Warum Tilgung mit der Zeit wichtiger wird',
    icon: 'receipt',
    tone: 'positive',
    caption: 'Mit sinkender Restschuld fällt der Zinsanteil und mehr von der Rate tilgt die Schuld.',
    component: LoanAmortization,
  },
  {
    title: 'Warum ein Sparplan bei Tiefs mehr kauft',
    icon: 'repeat',
    tone: 'money',
    caption: 'Bei niedrigeren Kursen kaufen dieselben hundert Euro automatisch mehr Anteile.',
    component: CostAverage,
  },
  {
    title: 'So entsteht der Spread',
    icon: 'arrowRight',
    tone: 'neutral',
    caption: 'Zwischen bestem Kaufpreis und bestem Verkaufspreis liegt der Spread.',
    component: SpreadMechanic,
  },
  {
    title: 'Warum Diversifikation Schwankungen dämpfen kann',
    icon: 'chart-up',
    tone: 'positive',
    caption: 'Unterschiedliche Anlagen schwanken anders und können das Gesamtportfolio stabilisieren.',
    component: Diversification,
  },
  {
    title: 'Warum Anleihekurse bei höheren Zinsen fallen',
    icon: 'bank',
    tone: 'warning',
    caption: 'Steigen neue Marktzinsen, verlieren ältere festverzinste Anleihen meist an Attraktivität.',
    component: BondInverse,
  },
];

const TestScene: React.FC<{scene: Scene}> = ({scene}) => {
  const Visual = scene.component;
  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      <SceneTransition durationFrames={SCENE_FRAMES}>
        <SceneHeader title={scene.title} icon={scene.icon} tone={scene.tone} at={2} />
        <AnimationStage>
          <Visual />
        </AnimationStage>
        <Captions words={makeCaptionWords(scene.caption)} />
      </SceneTransition>
    </AbsoluteFill>
  );
};

/**
 * Reiner Visual-Test ohne Audio und ohne Bildassets.
 * Ziel: FinanzNeo-Reel-Hierarchie isoliert prüfen:
 * Header + Icon oben, unterschiedliche Finance-Motion in der Mitte,
 * echte FinanzNeo-Caption-Komponente unten.
 */
export const FinanceHeaderCaptionMotion: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    <Series>
      {scenes.map((scene) => (
        <Series.Sequence key={scene.title} durationInFrames={SCENE_FRAMES}>
          <TestScene scene={scene} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
