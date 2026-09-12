import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {C} from '../brand/tokens';

const SCENE_FRAMES = 105;
const TRANSITION_FRAMES = 12;
const SCENE_COUNT = 8;
export const REMOTION_SHOWCASE_FRAMES =
  SCENE_COUNT * SCENE_FRAMES - (SCENE_COUNT - 1) * TRANSITION_FRAMES;

const BROLL_URL =
  'https://upload.wikimedia.org/wikipedia/commons/a/a3/Speed_typing_with_dvorak.webm';
const EURO_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/6/63/Euro_banknotes%2C_Europa_series.png';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const reveal = (frame: number, from = 8, to = 92) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: ease});
const money = (value: number) => `${Math.round(value).toLocaleString('de-DE')} €`;

const Grid: React.FC<{glow?: string}> = ({glow = C.accent}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, SCENE_FRAMES], [0, 40], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#030504', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: -120,
          translate: `${drift}px ${-drift * 0.35}px`,
          opacity: 0.65,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '74px 74px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 820,
          height: 820,
          borderRadius: 999,
          left: 130,
          top: 470,
          scale: 1 + Math.sin(frame / 18) * 0.05,
          background: `radial-gradient(circle, ${glow}33 0%, transparent 68%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Label: React.FC<{n: string; children: React.ReactNode}> = ({n, children}) => {
  const frame = useCurrentFrame();
  const p = spring({frame, fps: 30, config: {damping: 20, stiffness: 150}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 72,
        left: 66,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        opacity: p,
        translate: `${interpolate(p, [0, 1], [-24, 0], clamp)}px 0`,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div style={{padding: '8px 12px', borderRadius: 999, backgroundColor: C.accent, color: '#021108', fontSize: 18, fontWeight: 950}}>{n}</div>
      <div style={{fontSize: 19, fontWeight: 850, color: C.gray, letterSpacing: 2}}>{children}</div>
    </div>
  );
};

const Icon: React.FC<{kind: 'wallet' | 'clock' | 'chart' | 'shield'}> = ({kind}) => {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg width="68" height="68" viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'wallet' ? <><path {...common} d="M3 7h16v10H5a2 2 0 0 1-2-2V7Z" /><path {...common} d="m4 7 12-3a2 2 0 0 1 2.5 2v1" /><path {...common} d="M15 11h6v4h-6a2 2 0 0 1 0-4Z" /></> : null}
      {kind === 'clock' ? <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M12 7v5l3.5 2" /></> : null}
      {kind === 'chart' ? <><path {...common} d="M4 19V5M4 19h16" /><path {...common} d="m7 15 4-4 3 2 5-6M16 7h3v3" /></> : null}
      {kind === 'shield' ? <><path {...common} d="M12 3 19 6v5c0 4.6-2.7 7.7-7 10-4.3-2.3-7-5.4-7-10V6l7-3Z" /><path {...common} d="m8.5 12 2.2 2.2 4.8-5" /></> : null}
    </svg>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 13, stiffness: 125, mass: 0.8}});
  const value = Math.round(interpolate(frame, [8, 62], [0, 100], clamp));
  return (
    <AbsoluteFill style={{color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Grid glow={C.gold} />
      <Label n="01">KINETIC HOOK</Label>
      <div style={{position: 'absolute', top: 305, left: 70, right: 70, fontSize: 66, lineHeight: 1.02, fontWeight: 950, letterSpacing: -2.8}}>
        Was können<br /><span style={{color: C.gold}}>100 € im Monat</span><br />wirklich werden?
      </div>
      <div style={{position: 'absolute', top: 735, left: 140, width: 800, height: 800, display: 'grid', placeItems: 'center', opacity: pop, scale: 0.78 + pop * 0.22}}>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', width: 500 + i * 110, height: 500 + i * 110, borderRadius: 999, border: `2px solid rgba(255,200,61,${0.34 - i * 0.08})`, rotate: `${frame * (i % 2 ? -0.7 : 0.55)}deg`}} />)}
        <div style={{width: 405, height: 405, borderRadius: 999, display: 'grid', placeItems: 'center', color: '#1C1200', background: 'radial-gradient(circle at 35% 25%, #FFE49A, #FFC83D 46%, #A56B00 100%)', boxShadow: '0 0 100px rgba(255,200,61,0.35)'}}>
          <div style={{textAlign: 'center'}}><div style={{fontSize: 126, fontWeight: 1000, letterSpacing: -7}}>{value}</div><div style={{fontSize: 34, fontWeight: 900}}>€ / Monat</div></div>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, color: C.gray, fontSize: 23, fontWeight: 760}}>B-Roll · Bilder · Icons · 3D · Charts · Motion</div>
    </AbsoluteFill>
  );
};

const Broll: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 19, stiffness: 120}});
  const scan = interpolate(frame, [0, SCENE_FRAMES], [-80, 900], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#020403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Grid glow={C.blue} />
      <Label n="02">REAL B-ROLL + MASKING</Label>
      <div style={{position: 'absolute', top: 220, left: 66, right: 66, fontSize: 62, fontWeight: 950, lineHeight: 1.02, letterSpacing: -2.5}}>Finanzen passieren<br />heute <span style={{color: C.blueLt}}>digital.</span></div>
      <div style={{position: 'absolute', left: 58, right: 58, top: 510, height: 905, borderRadius: 48, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 34px 100px rgba(0,0,0,0.5)', opacity: enter, scale: 0.94 + enter * 0.06}}>
        <OffthreadVideo src={BROLL_URL} muted style={{width: '100%', height: '100%', objectFit: 'cover', scale: interpolate(frame, [0, SCENE_FRAMES], [1.04, 1.18], clamp), filter: 'saturate(0.78) contrast(1.12) brightness(0.82)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.68))'}} />
        <div style={{position: 'absolute', top: scan, left: 0, right: 0, height: 4, backgroundColor: C.accentLt, boxShadow: '0 0 34px rgba(92,255,173,0.75)'}} />
        <div style={{position: 'absolute', left: 32, right: 32, bottom: 34, display: 'flex', gap: 12}}>
          {['Research', 'Vergleichen', 'Entscheiden'].map((text, i) => <div key={text} style={{padding: '13px 16px', borderRadius: 999, backgroundColor: i === 2 ? C.accent : 'rgba(4,12,8,0.72)', color: i === 2 ? '#021108' : C.white, border: '1px solid rgba(255,255,255,0.16)', fontSize: 22, fontWeight: 900}}>{text}</div>)}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 88, left: 66, right: 66, fontSize: 17, color: C.grayDk}}>B-Roll: Speed typing with dvorak · Wikimedia Commons · CC0</div>
    </AbsoluteFill>
  );
};

const RealImage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const amount = interpolate(frame, [14, 82], [0, 36000], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#050706', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Grid glow={C.gold} />
      <Label n="03">REAL IMAGE + PARALLAX</Label>
      <div style={{position: 'absolute', left: 70, top: 240, width: 940, height: 930, borderRadius: 52, overflow: 'hidden', backgroundColor: C.white, opacity: enter, scale: 0.9 + enter * 0.1, rotate: `${interpolate(enter, [0, 1], [-4, 0], clamp)}deg`, boxShadow: '0 38px 120px rgba(0,0,0,0.58)'}}>
        <Img src={EURO_IMAGE_URL} style={{width: '100%', height: '112%', objectFit: 'contain', translate: `0 ${interpolate(frame, [0, SCENE_FRAMES], [36, -48], clamp)}px`}} />
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 -160px 120px rgba(0,0,0,0.2)'}} />
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 1190, padding: '34px 38px', borderRadius: 34, backgroundColor: 'rgba(5,12,8,0.9)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(18px)'}}>
        <div style={{fontSize: 28, color: C.gray, fontWeight: 800}}>Nur eingezahlt nach 30 Jahren</div>
        <div style={{fontSize: 86, color: C.gold, fontWeight: 1000, letterSpacing: -4, marginTop: 6}}>{money(amount)}</div>
      </div>
      <div style={{position: 'absolute', bottom: 88, left: 66, right: 66, fontSize: 17, color: C.grayDk}}>Bild: Euro banknotes, Europa series · Wikimedia Commons · CC0</div>
    </AbsoluteFill>
  );
};

const DataStory: React.FC = () => {
  const frame = useCurrentFrame();
  const p = reveal(frame);
  const value = interpolate(p, [0, 1], [36000, 100452], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#030604', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Grid />
      <Label n="04">SVG DATA STORY</Label>
      <div style={{position: 'absolute', top: 235, left: 66, right: 66}}><div style={{fontSize: 60, fontWeight: 950, letterSpacing: -2.2}}>Zeit verändert die Kurve.</div><div style={{fontSize: 24, color: C.gray, marginTop: 18, fontWeight: 760}}>100 €/Monat · 30 Jahre · Beispiel 6 % p.a.</div></div>
      <div style={{position: 'absolute', top: 530, left: 70, right: 70, height: 690}}>
        <svg width="940" height="690" viewBox="0 0 940 690">
          {[0, 1, 2, 3, 4].map((line) => <line key={line} x1="40" x2="900" y1={90 + line * 125} y2={90 + line * 125} stroke="rgba(255,255,255,0.09)" strokeWidth="2" />)}
          <defs><linearGradient id="showcaseGrowth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.48" /><stop offset="100%" stopColor={C.accent} stopOpacity="0" /></linearGradient></defs>
          <path d="M40 586 C180 565 270 535 365 482 C490 412 570 335 660 244 C750 153 825 102 900 72 L900 630 L40 630 Z" fill="url(#showcaseGrowth)" opacity={p * 0.62} />
          <path d="M40 586 C180 565 270 535 365 482 C490 412 570 335 660 244 C750 153 825 102 900 72" fill="none" stroke={C.accentLt} strokeWidth="13" strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - p)} />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1280, padding: '30px 34px', borderRadius: 32, backgroundColor: 'rgba(17,38,26,0.9)', border: '1px solid rgba(92,255,173,0.28)'}}><div style={{fontSize: 24, color: C.gray, fontWeight: 800}}>Illustrativer Endwert</div><div style={{fontSize: 92, fontWeight: 1000, color: C.accentLt, letterSpacing: -5}}>{money(value)}</div><div style={{fontSize: 18, color: C.grayDk}}>Keine Renditezusage · vor Steuern und individuellen Kosten</div></div>
    </AbsoluteFill>
  );
};

const CompoundObject: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 22;
  return <><ambientLight intensity={1.55} /><directionalLight position={[5, 7, 6]} intensity={2.5} /><pointLight position={[-5, -2, 3]} intensity={1.7} color="#5CFFAD" />{[0, 1, 2, 3, 4].map((i) => {const a = t * (0.28 + i * 0.02) + i * 1.2; const r = 2.7 + (i % 2) * 0.55; return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r * 0.55, (i - 2) * 0.36]} rotation={[1.2, a, 0.2]}><torusGeometry args={[0.62 + i * 0.03, 0.18, 24, 72]} /><meshStandardMaterial color={i === 4 ? '#FFC83D' : '#00D26A'} roughness={0.28} metalness={0.35} /></mesh>;})}<mesh rotation={[t * 0.22, t * 0.3, t * 0.12]}><icosahedronGeometry args={[1.25, 2]} /><meshStandardMaterial color="#5CFFAD" roughness={0.25} metalness={0.22} /></mesh></>;
};

const ThreeD: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 20, stiffness: 120}});
  return (
    <AbsoluteFill style={{backgroundColor: '#020403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Label n="05">THREE.JS / R3F</Label>
      <ThreeCanvas width={1080} height={1920} camera={{position: [0, 0, 8.6], fov: 44}}><CompoundObject /></ThreeCanvas>
      <div style={{position: 'absolute', left: 70, right: 70, top: 250, opacity: p, translate: `0 ${interpolate(p, [0, 1], [30, 0], clamp)}px`}}><div style={{fontSize: 65, fontWeight: 950, letterSpacing: -2.5}}>Zins auf Zins.</div><div style={{fontSize: 31, fontWeight: 850, color: C.accentLt, marginTop: 14}}>Mehr Basis für den nächsten Zyklus.</div></div>
      <div style={{position: 'absolute', bottom: 160, left: 70, right: 70, display: 'flex', gap: 14}}>{['Einzahlung', '+ Rendite', '+ Zeit'].map((x, i) => <div key={x} style={{flex: 1, padding: '18px 10px', textAlign: 'center', borderRadius: 999, backgroundColor: i === 2 ? C.accent : 'rgba(255,255,255,0.08)', color: i === 2 ? '#021108' : C.white, fontSize: 22, fontWeight: 900}}>{x}</div>)}</div>
    </AbsoluteFill>
  );
};

const Fees: React.FC = () => {
  const frame = useCurrentFrame();
  const p = reveal(frame);
  const rows = [{label: '0,20 % Kosten', end: 94, color: C.accentLt}, {label: '1,50 % Kosten', end: 68, color: C.negativeLt}];
  return (
    <AbsoluteFill style={{backgroundColor: '#030403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Grid glow={C.negative} />
      <Label n="06">MOTION COMPARISON</Label>
      <div style={{position: 'absolute', top: 230, left: 66, right: 66, fontSize: 62, fontWeight: 950, lineHeight: 1.02}}>Kleine Kosten.<br /><span style={{color: C.negativeLt}}>Große Strecke.</span></div>
      <div style={{position: 'absolute', top: 590, left: 66, right: 66, display: 'flex', flexDirection: 'column', gap: 54}}>{rows.map((row, i) => <div key={row.label} style={{translate: `${interpolate(p, [0, 1], [i ? 70 : -70, 0], clamp)}px 0`, opacity: p}}><div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 29, fontWeight: 900}}><span>{row.label}</span><span style={{color: row.color}}>{i ? 'mehr Reibung' : 'weniger Reibung'}</span></div><div style={{height: 160, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}><div style={{height: '100%', width: `${row.end * p}%`, borderRadius: 30, background: `linear-gradient(90deg, ${row.color}, ${row.color}99)`, boxShadow: `0 0 40px ${row.color}33`}} /></div></div>)}</div>
      <div style={{position: 'absolute', left: 66, right: 66, top: 1250, padding: 34, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.06)', fontSize: 30, fontWeight: 850}}>Motion macht einen Unterschied <span style={{color: C.gold}}>sichtbar</span>, bevor Text ihn erklärt.</div>
    </AbsoluteFill>
  );
};

const IconSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items: Array<{icon: 'wallet' | 'clock' | 'chart' | 'shield'; title: string; sub: string}> = [
    {icon: 'wallet', title: 'Einzahlung', sub: 'klein starten'},
    {icon: 'clock', title: 'Zeit', sub: 'langfristig denken'},
    {icon: 'chart', title: 'Wachstum', sub: 'Schwankungen aushalten'},
    {icon: 'shield', title: 'Risiko', sub: 'bewusst steuern'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#040705', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Grid glow={C.purple} />
      <Label n="07">SVG ICONS + STAGGER</Label>
      <div style={{position: 'absolute', top: 225, left: 66, right: 66, fontSize: 61, fontWeight: 950}}>Vier Dinge.<br />Ein System.</div>
      <div style={{position: 'absolute', top: 540, left: 66, right: 66, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>{items.map((item, i) => {const p = spring({frame: Math.max(0, frame - i * 10), fps, config: {damping: 18, stiffness: 145}}); return <div key={item.title} style={{height: 310, borderRadius: 34, padding: 30, backgroundColor: i === 3 ? 'rgba(185,140,255,0.14)' : 'rgba(255,255,255,0.055)', border: `1px solid ${i === 3 ? 'rgba(185,140,255,0.4)' : 'rgba(255,255,255,0.1)'}`, opacity: p, scale: 0.82 + p * 0.18, translate: `0 ${interpolate(p, [0, 1], [42, 0], clamp)}px`}}><div style={{color: i === 3 ? C.purpleLt : C.accentLt}}><Icon kind={item.icon} /></div><div style={{fontSize: 34, fontWeight: 950, marginTop: 22}}>{item.title}</div><div style={{fontSize: 21, color: C.gray, marginTop: 8}}>{item.sub}</div></div>;})}</div>
    </AbsoluteFill>
  );
};

const Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hero = spring({frame, fps, config: {damping: 16, stiffness: 105}});
  const p = reveal(frame, 14, 86);
  const end = interpolate(p, [0, 1], [36000, 100452], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: '#020403', color: C.white, fontFamily: 'Arial, Helvetica, sans-serif'}}>
      <Grid />
      <Label n="08">PAYOFF</Label>
      {Array.from({length: 18}).map((_, i) => {const a = (Math.PI * 2 * i) / 18 + frame / 70; const r = 390 + (i % 3) * 70; return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r, top: 1000 + Math.sin(a) * r, width: 8 + (i % 3) * 5, height: 8 + (i % 3) * 5, borderRadius: 99, backgroundColor: i % 4 === 0 ? C.gold : C.accent, opacity: 0.25 + p * 0.65}} />;})}
      <div style={{position: 'absolute', top: 305, left: 62, right: 62, textAlign: 'center', opacity: hero, scale: 0.88 + hero * 0.12}}><div style={{fontSize: 27, fontWeight: 900, color: C.gray, letterSpacing: 2}}>100 € / MONAT · 30 JAHRE · BEISPIEL 6 % P.A.</div><div style={{fontSize: 145, fontWeight: 1000, letterSpacing: -9, lineHeight: 0.95, color: C.accentLt, marginTop: 38}}>{money(end)}</div><div style={{fontSize: 34, fontWeight: 850, marginTop: 34}}>Aus 36.000 € Einzahlungen wird eine andere Größenordnung.</div></div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 1030, height: 450, borderRadius: 999, border: `3px solid rgba(92,255,173,${0.18 + p * 0.42})`, scale: 0.72 + p * 0.28, boxShadow: '0 0 120px rgba(0,210,106,0.14)'}} />
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 110, textAlign: 'center', color: C.gray, fontSize: 19}}>Technischer Showcase · keine Anlageberatung · keine Renditezusage</div>
    </AbsoluteFill>
  );
};

export const RemotionShowcase: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><Hook /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><Broll /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><RealImage /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><DataStory /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><ThreeD /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><Fees /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><IconSystem /></TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION_FRAMES})} />
    <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}><Payoff /></TransitionSeries.Sequence>
  </TransitionSeries>
);
