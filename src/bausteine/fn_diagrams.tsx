// FinanzNeo Diagramm-/UI-Bausteine — aus KI-Kit portiert, FinanzNeo-Marke.
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {C, bebas, inter} from './fn_core';

const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 14) => c01((f - s) / d);

export const FNProcess: React.FC<{steps?: [string, string][]}> =
({steps = [['1', 'Notgroschen'], ['2', 'Schulden weg'], ['3', 'Investieren'], ['4', 'Frei sein']]}) => {
  const f = useCurrentFrame(); const cols = [C.blue, C.gold, C.green, C.greenLt];
  return <div style={{fontFamily: bebas, display: 'flex', flexDirection: 'column', width: 900}}>
    {steps.map(([n, label], i) => {const g = eo(c01((f - 10 - i * 16) / 26));
      return <div key={i}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34, opacity: g, transform: `translateX(${(1 - g) * -40}px)`}}>
          <div style={{width: 110, height: 110, borderRadius: '50%', background: cols[i % 4], color: C.bgDeep, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, boxShadow: `0 0 30px ${cols[i % 4]}66`}}>{n}</div>
          <div style={{fontSize: 64, color: C.ink}}>{label}</div></div>
        {i < steps.length - 1 && <div style={{width: 6, height: 50, background: 'rgba(255,255,255,0.2)', marginLeft: 52,
          transformOrigin: 'top', transform: `scaleY(${c01((f - 18 - i * 16) / 16)})`}} />}
      </div>;})}
  </div>;
};

export const FNTimeline: React.FC<{events?: [string, string, string][]}> =
({events = [['20 J.', 'Start', C.blue], ['40 J.', 'Aufbau', C.gold], ['67 J.', 'Frei', C.green]]}) => {
  const f = useCurrentFrame(); const W = 1400; const draw = c01((f - 12) / 50);
  return <div style={{position: 'relative', width: W, height: 220, fontFamily: bebas}}>
    <div style={{position: 'absolute', top: 50, left: 40, width: (W - 80) * draw, height: 8, background: 'rgba(255,255,255,0.25)'}} />
    {events.map((e, i) => {const at = i / (events.length - 1);
      return <div key={i} style={{position: 'absolute', left: `calc(${at * 100}% - 50px)`, top: 0, width: 100, textAlign: 'center', opacity: draw >= at - 0.02 ? rev(f, 12 + at * 50) : 0}}>
        <div style={{width: 90, height: 90, borderRadius: '50%', background: e[2], margin: '0 auto', boxShadow: `0 0 28px ${e[2]}`}} />
        <div style={{fontSize: 44, color: e[2], marginTop: 12}}>{e[0]}</div>
        <div style={{fontFamily: inter, fontSize: 30, color: C.ink}}>{e[1]}</div></div>;})}
  </div>;
};

export const FNPipeline: React.FC<{stages?: string[]}> = ({stages = ['Einkommen', 'Sparen', 'Investieren', 'Vermögen']}) => {
  const f = useCurrentFrame(); const W = 1500, H = 240, cy = 90; const xs = stages.map((_, i) => 140 + (i / (stages.length - 1)) * (W - 280));
  return <svg width={W} height={H} style={{fontFamily: bebas}}>
    {xs.slice(0, -1).map((x, i) => <line key={i} x1={x} y1={cy} x2={xs[i + 1]} y2={cy} stroke="rgba(255,255,255,0.25)" strokeWidth={4} />)}
    {xs.slice(0, -1).map((x, i) => {const p = ((f * 2 + i * 30) % 90) / 90;
      return <circle key={'p' + i} cx={x + (xs[i + 1] - x) * p} cy={cy} r={9} fill={C.gold} style={{filter: `drop-shadow(0 0 10px ${C.gold})`}} />;})}
    {xs.map((x, i) => {const g = eo(c01((f - i * 12) / 24));
      return <g key={i} opacity={g}><circle cx={x} cy={cy} r={56 * g} fill={C.bgDeep} stroke={C.green} strokeWidth={4} style={{filter: `drop-shadow(0 0 14px ${C.green}66)`}} />
        <text x={x} y={cy + 110} fontSize={34} fill={C.ink} textAnchor="middle" fontFamily={inter} fontWeight={700}>{stages[i]}</text></g>;})}
  </svg>;
};

export const FNChecklist: React.FC<{items?: string[]}> =
({items = ['Notgroschen aufbauen', 'Teure Schulden tilgen', 'Breit gestreut investieren', 'Geduldig bleiben']}) => {
  const f = useCurrentFrame();
  return <div style={{fontFamily: inter, display: 'flex', flexDirection: 'column', gap: 30, width: 1200}}>
    {items.map((t, i) => {const g = rev(f, i * 12, 16);
      return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, opacity: g, transform: `translateX(${(1 - g) * -30}px)`}}>
        <div style={{width: 64, height: 64, borderRadius: '50%', background: C.green, color: C.bgDeep, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, boxShadow: `0 0 22px ${C.green}66`}}>✓</div>
        <div style={{fontSize: 48, fontWeight: 600, color: C.ink}}>{t}</div></div>;})}
  </div>;
};

export const FNCallout: React.FC<{text?: string; color?: string}> = ({text = 'Wichtig: Zeit ist dein größter Hebel!', color = C.gold}) => {
  const f = useCurrentFrame();
  return <div style={{fontFamily: inter, display: 'flex', alignItems: 'center', gap: 26, background: `${color}1a`,
    border: `3px solid ${color}`, borderRadius: 24, padding: '36px 50px', maxWidth: 1300, opacity: rev(f, 2),
    boxShadow: `0 0 40px ${color}33`}}>
    <div style={{fontSize: 64}}>💡</div>
    <div style={{fontSize: 52, fontWeight: 700, color: C.ink}}>{text}</div>
  </div>;
};

export const FNVS: React.FC<{left?: string; right?: string}> = ({left = 'Sparen', right = 'Investieren'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const card = (t: string, col: string, delay: number) => {const s = spring({frame: f - delay, fps, config: {damping: 12}});
    return <div style={{flex: 1, padding: '70px 30px', borderRadius: 28, border: `3px solid ${col}`, background: `${col}1a`,
      fontFamily: bebas, fontSize: 90, color: C.ink, textAlign: 'center', transform: `scale(${s})`, boxShadow: `0 0 40px ${col}33`}}>{t}</div>;};
  return <div style={{display: 'flex', alignItems: 'center', gap: 40, width: 1300}}>
    {card(left, C.red, 4)}
    <div style={{fontFamily: bebas, fontSize: 80, color: C.gold, opacity: rev(f, 24)}}>VS</div>
    {card(right, C.green, 14)}
  </div>;
};
