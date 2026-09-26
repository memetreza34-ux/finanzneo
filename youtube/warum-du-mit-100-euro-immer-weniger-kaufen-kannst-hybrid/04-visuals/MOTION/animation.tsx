import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {
  black: '#000000',
  ivory: '#F4F0E6',
  gray: '#A8A8A8',
  green: '#35C67A',
  red: '#E76A4A',
  panel: 'rgba(18,18,18,0.92)',
  line: 'rgba(255,255,255,0.16)',
};

const SAFE = 96;

const enter = (frame: number, fps: number, delay = 0) => interpolate(
  frame,
  [delay, delay + Math.round(fps * 0.45)],
  [0, 1],
  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
);

const Frame: React.FC<React.PropsWithChildren<{overlay?: boolean}>> = ({overlay = false, children}) => (
  <AbsoluteFill
    style={{
      backgroundColor: overlay ? 'transparent' : C.black,
      color: C.ivory,
      fontFamily: 'Arial, Helvetica, sans-serif',
      padding: SAFE,
      boxSizing: 'border-box',
      justifyContent: 'center',
    }}
  >
    {children}
  </AbsoluteFill>
);

const Title: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <div style={{fontSize: 54, fontWeight: 800, lineHeight: 1.05, opacity, maxWidth: 1500}}>{children}</div>
);

const Big: React.FC<{children: React.ReactNode; accent?: 'green' | 'red' | 'ivory'; opacity?: number}> = ({children, accent = 'ivory', opacity = 1}) => (
  <div style={{fontSize: 118, fontWeight: 900, lineHeight: 1, color: C[accent], opacity}}>{children}</div>
);

const Bar: React.FC<{label: string; value: number; max?: number; color: string; opacity: number}> = ({label, value, max = 100, color, opacity}) => (
  <div style={{display: 'grid', gridTemplateColumns: '240px 1fr', alignItems: 'center', gap: 28, opacity}}>
    <div style={{fontSize: 34, fontWeight: 700}}>{label}</div>
    <div style={{height: 62, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
      <div style={{width: `${Math.max(2, Math.min(100, (value / max) * 100))}%`, height: '100%', borderRadius: 18, backgroundColor: color}} />
    </div>
  </div>
);

const Divider: React.FC = () => <div style={{height: 2, backgroundColor: C.line, width: '100%'}} />;

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = enter(frame, fps, 4);
  const shrink = interpolate(frame, [8, 46], [1, 0.72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Frame overlay>
    <div style={{marginLeft: '46%', width: '48%', display: 'grid', gap: 24, opacity: a}}>
      <Title>Betrag ≠ Kaufkraft</Title>
      <Divider />
      <div style={{display: 'flex', gap: 28, alignItems: 'center'}}>
        <Big>100 €</Big>
        <div style={{fontSize: 48, color: C.gray}}>bleibt nominal gleich</div>
      </div>
      <div style={{fontSize: 52, fontWeight: 800, color: C.red, scale: shrink}}>Kaufkraft wird kleiner</div>
    </div>
  </Frame>;
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 2);
  const value = interpolate(frame, [10, 70], [100, 82.03], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Frame>
    <div style={{display: 'grid', gap: 34}}>
      <Title opacity={p}>Rechenbeispiel: 2 % pro Jahr · 10 Jahre</Title>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 42, opacity: p}}>
        <Big>100 €</Big>
        <div style={{fontSize: 64, color: C.gray}}>→</div>
        <Big accent="red">{value.toFixed(0)} €</Big>
      </div>
      <div style={{fontSize: 36, color: C.gray, opacity: p}}>heutige Kaufkraft, vereinfacht gerechnet</div>
    </div>
  </Frame>;
};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 8);
  const cost = interpolate(frame, [8, 58], [48, 72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const free = 100 - cost;
  return <Frame overlay>
    <div style={{marginLeft: '47%', width: '46%', display: 'grid', gap: 26, opacity: p}}>
      <Title>Mehr Fixkosten = weniger frei</Title>
      <Bar label="Kosten" value={cost} color={C.red} opacity={1} />
      <Bar label="Frei" value={free} color={C.green} opacity={1} />
    </div>
  </Frame>;
};

export const YouTubeVisual06Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 0);
  const points = [100, 102, 104.04, 106.12, 108.24, 110.41];
  const visible = Math.floor(interpolate(frame, [8, 70], [1, points.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <Frame>
    <div style={{display: 'grid', gap: 34, opacity: p}}>
      <Title>Kleine Schritte summieren sich</Title>
      <div style={{display: 'flex', alignItems: 'end', gap: 26, height: 430, borderBottom: `2px solid ${C.line}`}}>
        {points.map((v, i) => <div key={i} style={{width: 180, height: `${(v - 90) * 18}px`, minHeight: 90, borderRadius: '20px 20px 0 0', backgroundColor: i < visible ? C.red : 'rgba(255,255,255,0.08)', opacity: i < visible ? 1 : 0.25, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 18, fontSize: 26, fontWeight: 700}}>{i === 0 ? 'Heute' : `J${i}`}</div>)}
      </div>
    </div>
  </Frame>;
};

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 4);
  const real = interpolate(frame, [12, 58], [100, 78], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Frame overlay>
    <div style={{marginLeft: '48%', width: '44%', display: 'grid', gap: 28, opacity: p}}>
      <Bar label="Nominal" value={100} color={C.ivory} opacity={1} />
      <Bar label="Kaufkraft" value={real} color={C.red} opacity={1} />
      <div style={{fontSize: 34, color: C.gray}}>gleiche Zahl · weniger reale Wirkung</div>
    </div>
  </Frame>;
};

export const YouTubeVisual09Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 2);
  const salary = interpolate(frame, [10, 55], [60, 92], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const prices = interpolate(frame, [18, 63], [60, 88], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Frame>
    <div style={{display: 'grid', gap: 36, opacity: p}}>
      <Title>Wenn beide fast gleich schnell steigen …</Title>
      <Bar label="Gehalt" value={salary} color={C.green} opacity={1} />
      <Bar label="Preise" value={prices} color={C.red} opacity={1} />
      <div style={{fontSize: 44, fontWeight: 800}}>… bleibt real nur ein kleiner Abstand.</div>
    </div>
  </Frame>;
};

export const YouTubeVisual10Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p1 = enter(frame, fps, 2);
  const p2 = enter(frame, fps, 18);
  const p3 = enter(frame, fps, 36);
  return <Frame overlay>
    <div style={{marginLeft: '45%', width: '50%', display: 'grid', gap: 24}}>
      <div style={{display: 'flex', gap: 24, opacity: p1}}><Big accent="green">+5 %</Big><div style={{fontSize: 48, alignSelf: 'center'}}>Gehalt</div></div>
      <div style={{display: 'flex', gap: 24, opacity: p2}}><Big accent="red">+4 %</Big><div style={{fontSize: 48, alignSelf: 'center'}}>Preise</div></div>
      <Divider />
      <div style={{display: 'flex', gap: 24, opacity: p3}}><Big>≈ +1 %</Big><div style={{fontSize: 48, alignSelf: 'center'}}>real</div></div>
    </div>
  </Frame>;
};

export const YouTubeVisual11Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = enter(frame, fps, 4);
  const b = enter(frame, fps, 18);
  const c = enter(frame, fps, 32);
  return <Frame>
    <div style={{display: 'grid', gap: 34}}>
      <Title>Notgroschen = Sicherheitsaufgabe</Title>
      <div style={{fontSize: 70, fontWeight: 900, color: C.green, opacity: a}}>schnell verfügbar</div>
      <div style={{fontSize: 70, fontWeight: 900, color: C.ivory, opacity: b}}>unerwartete Kosten</div>
      <div style={{fontSize: 48, color: C.gray, opacity: c}}>nicht dasselbe Ziel wie maximale Rendite</div>
    </div>
  </Frame>;
};

export const YouTubeVisual13Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const labels = ['Kurzfristig', 'Mittelfristig', 'Langfristig'];
  return <Frame overlay>
    <div style={{position: 'absolute', left: 86, right: 86, bottom: 92, display: 'flex', gap: 24}}>
      {labels.map((label, i) => <div key={label} style={{flex: 1, padding: '28px 24px', borderRadius: 22, backgroundColor: C.panel, border: `1px solid ${C.line}`, fontSize: 34, fontWeight: 800, opacity: enter(frame, fps, 8 + i * 12), translate: `0 ${interpolate(frame, [8 + i * 12, 24 + i * 12], [28, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px`}}>{label}</div>)}
    </div>
  </Frame>;
};

export const YouTubeVisual14Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 0);
  const line = interpolate(frame, [8, 68], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Frame>
    <div style={{display: 'grid', gap: 42, opacity: p}}>
      <Title>Je näher das Ziel, desto wichtiger die Verfügbarkeit</Title>
      <div style={{position: 'relative', height: 220}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 104, height: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.10)'}} />
        <div style={{position: 'absolute', left: 0, top: 104, height: 8, width: `${line}%`, borderRadius: 8, backgroundColor: C.green}} />
        <div style={{position: 'absolute', left: 0, top: 0, fontSize: 38, fontWeight: 800}}>heute</div>
        <div style={{position: 'absolute', right: 0, top: 0, fontSize: 38, fontWeight: 800}}>später</div>
        <div style={{position: 'absolute', left: 0, bottom: 0, fontSize: 32, color: C.ivory}}>Stabilität / verfügbar</div>
        <div style={{position: 'absolute', right: 0, bottom: 0, fontSize: 32, color: C.gray}}>Kaufkraft mitdenken</div>
      </div>
    </div>
  </Frame>;
};

export const YouTubeVisual15Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 8);
  return <Frame overlay>
    <div style={{position: 'absolute', left: '44%', right: SAFE, top: 190, bottom: 120, display: 'grid', alignContent: 'center', gap: 24, opacity: p}}>
      <Title>Jeder Euro bekommt eine Aufgabe</Title>
      {['Reserve', 'Ziel', 'Langfristig'].map((x, i) => <div key={x} style={{padding: '22px 28px', borderRadius: 18, backgroundColor: i === 0 ? 'rgba(53,198,122,0.18)' : C.panel, border: `1px solid ${C.line}`, fontSize: 38, fontWeight: 800, opacity: enter(frame, fps, 18 + i * 12)}}>{x}</div>)}
    </div>
  </Frame>;
};

export const YouTubeVisual16Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = ['Nominaler Betrag', 'Reale Kaufkraft', 'Zeithorizont'];
  return <Frame>
    <div style={{display: 'grid', gap: 28}}>
      <Title>Die drei Fragen hinter deinem Geld</Title>
      {items.map((x, i) => <div key={x} style={{fontSize: 64, fontWeight: 900, padding: '24px 30px', borderRadius: 22, backgroundColor: C.panel, borderLeft: `8px solid ${i === 1 ? C.red : i === 2 ? C.green : C.ivory}`, opacity: enter(frame, fps, 8 + i * 14)}}>{i + 1}. {x}</div>)}
    </div>
  </Frame>;
};

export const YouTubeVisual17Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, 10);
  return <Frame overlay>
    <div style={{position: 'absolute', left: 92, right: 92, bottom: 96, padding: '30px 36px', borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.78)', border: `1px solid ${C.line}`, opacity: p}}>
      <div style={{fontSize: 60, fontWeight: 900}}>Was kannst du damit wirklich kaufen?</div>
    </div>
  </Frame>;
};
