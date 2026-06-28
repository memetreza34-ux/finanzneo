// FinanzNeo Zeit + Maps + Personen — Pro-Palette (Grün/Gold/Neutral).
import {useCurrentFrame, interpolate} from 'remotion';
import {C, bebas, inter} from './fn_core';
import {P} from './fn_pro';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const eo = (t: number) => 1 - Math.pow(1 - t, 3);
const rev = (f: number, s: number, d = 16) => c01((f - s) / d);
const rand = (i: number) => {const x = Math.sin(i * 127.1 + 311.7) * 43758.5; return x - Math.floor(x);};

// ---- Zeit ----
export const FNCountdown: React.FC<{seconds?: number}> = ({seconds = 30}) => {
  const f = useCurrentFrame(); const left = Math.max(0, seconds - Math.floor(f / 30)); const R = 180, CIRC = 2 * Math.PI * R; const prog = 1 - (f / 30) / seconds;
  return <div style={{position: 'relative', width: 440, height: 440, fontFamily: bebas}}>
    <svg width={440} height={440}><circle cx={220} cy={220} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={22} />
      <circle cx={220} cy={220} r={R} fill="none" stroke={left <= 5 ? P.loss : P.green} strokeWidth={22} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - Math.max(0, prog))} transform="rotate(-90 220 220)" /></svg>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 150, color: left <= 5 ? P.loss : P.ink}}>{left}</div></div>;
};
export const FNClock: React.FC = () => {const f = useCurrentFrame(); const a = f * 6;
  return <svg width={380} height={380} style={{fontFamily: bebas}}><circle cx={190} cy={190} r={160} fill="rgba(255,255,255,0.03)" stroke={P.green} strokeWidth={5} />
    {new Array(12).fill(0).map((_, i) => {const t = (i / 12) * Math.PI * 2; return <circle key={i} cx={190 + Math.sin(t) * 135} cy={190 - Math.cos(t) * 135} r={5} fill={P.muted} />;})}
    <line x1={190} y1={190} x2={190 + Math.sin(a / 12 * Math.PI / 180) * 90} y2={190 - Math.cos(a / 12 * Math.PI / 180) * 90} stroke={P.ink} strokeWidth={9} strokeLinecap="round" />
    <line x1={190} y1={190} x2={190 + Math.sin(a * Math.PI / 180) * 130} y2={190 - Math.cos(a * Math.PI / 180) * 130} stroke={P.gold} strokeWidth={5} strokeLinecap="round" /></svg>;};
export const FNCalendar: React.FC<{highlight?: number}> = ({highlight = 1}) => {const f = useCurrentFrame();
  return <div style={{width: 620, padding: 30, borderRadius: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)'}}>
    <div style={{fontFamily: bebas, fontSize: 50, color: P.green, marginBottom: 20}}>Sparplan-Tag</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10}}>{new Array(28).fill(0).map((_, i) => {const d = i + 1; const hl = d === highlight;
      return <div key={i} style={{height: 64, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: bebas, fontSize: 32, color: hl ? C.bgDeep : P.muted, background: hl ? P.gold : 'rgba(255,255,255,0.04)', opacity: f > i * 1.5 ? 1 : 0, transform: hl ? `scale(${1 + Math.sin(f / 8) * 0.06})` : 'none'}}>{d}</div>;})}</div></div>;};
export const FNProgressDays: React.FC<{done?: number}> = ({done = 5}) => {const f = useCurrentFrame(); const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  return <div style={{display: 'flex', gap: 20}}>{days.map((d, i) => {const on = i < done && f > i * 8;
    return <div key={i} style={{textAlign: 'center'}}><div style={{width: 96, height: 96, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: bebas, fontSize: 44, color: on ? C.bgDeep : P.muted, background: on ? P.green : 'rgba(255,255,255,0.05)', border: `2px solid ${on ? P.green : 'rgba(255,255,255,0.12)'}`}}>{on ? '✓' : ''}</div>
      <div style={{fontFamily: inter, fontSize: 26, color: P.muted, marginTop: 10}}>{d}</div></div>;})}</div>;};
export const FNHourglass: React.FC = () => {const f = useCurrentFrame(); const p = c01((f % 90) / 90);
  return <div style={{textAlign: 'center'}}><div style={{fontSize: 220}}>⏳</div>
    <div style={{width: 360, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.1)', margin: '0 auto'}}><div style={{width: `${p * 100}%`, height: '100%', borderRadius: 7, background: P.gold}} /></div></div>;};
export const FNSchedule: React.FC<{items?: [string, string][]}> = ({items = [['Tag 1', 'Notgroschen'], ['Monat 1', 'Sparplan starten'], ['Jahr 1', 'Aufstocken'], ['Jahr 10', 'Wachstum genießen']]}) => {const f = useCurrentFrame();
  return <div style={{width: 800}}>{items.map(([t, l], i) => {const g = rev(f, i * 12, 14);
    return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 24, opacity: g, transform: `translateX(${(1 - g) * -24}px)`}}>
      <div style={{fontFamily: bebas, fontSize: 44, color: P.gold, width: 160}}>{t}</div><div style={{width: 16, height: 16, borderRadius: '50%', background: P.green}} />
      <div style={{fontFamily: inter, fontSize: 40, color: P.ink}}>{l}</div></div>;})}</div>;};

// ---- Maps ----
export const FNWorldDots: React.FC<{active?: number}> = ({active = 5}) => {const f = useCurrentFrame();
  const DOTS: [number, number][] = []; for (let i = 0; i < 240; i++) {const x = rand(i) * 900, y = rand(i + 50) * 440; if (rand(i + 7) > 0.45) DOTS.push([x, y]);}
  return <svg width={900} height={460}>{DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={P.muted} opacity={f > i * 0.4 ? 0.4 : 0} />)}
    {new Array(active).fill(0).map((_, i) => {const x = 100 + rand(i + 3) * 700, y = 70 + rand(i + 11) * 320; const pu = (Math.sin(f / 8 + i) + 1) / 2;
      return <circle key={'a' + i} cx={x} cy={y} r={7 + pu * 7} fill={P.green} opacity={0.5 + pu * 0.5} style={{filter: `drop-shadow(0 0 8px ${P.green})`}} />;})}</svg>;};
export const FNLocationPin: React.FC<{label?: string}> = ({label = 'Weltmarkt'}) => {const f = useCurrentFrame(); const bob = Math.sin(f / 8) * 8;
  return <div style={{textAlign: 'center'}}><div style={{fontSize: 160, transform: `translateY(${bob}px)`, filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.5))', opacity: rev(f, 2)}}>📍</div>
    <div style={{fontFamily: bebas, fontSize: 56, color: P.ink, opacity: rev(f, 16)}}>{label}</div></div>;};
export const FNConnectionArc: React.FC = () => {const f = useCurrentFrame(); const draw = c01((f - 4) / 40);
  const nodes: [number, number, string][] = [[150, 360, 'EU'], [480, 160, 'USA'], [810, 380, 'Asien']];
  return <svg width={960} height={480} style={{fontFamily: bebas}}>{nodes.slice(0, -1).map((a, i) => {const b = nodes[i + 1]; const mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - 100;
    return <path key={i} d={`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} fill="none" stroke={P.green} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: `drop-shadow(0 0 6px ${P.green})`}} />;})}
    {nodes.map((n, i) => <g key={i} opacity={rev(f, i * 6)}><circle cx={n[0]} cy={n[1]} r={16} fill={P.gold} /><text x={n[0]} y={n[1] + 56} fontSize={32} fill={P.ink} textAnchor="middle">{n[2]}</text></g>)}</svg>;};
export const FNRegionHighlight: React.FC<{label?: string}> = ({label = 'Wachstumsmarkt'}) => {const f = useCurrentFrame(); const g = c01((f - 4) / 24);
  return <svg width={460} height={460} style={{fontFamily: bebas}}><circle cx={230} cy={230} r={170 * g} fill={`${P.green}1a`} stroke={P.green} strokeWidth={4} />
    {new Array(3).fill(0).map((_, i) => {const p = ((f + i * 18) % 54) / 54; return <circle key={i} cx={230} cy={230} r={170 * g + p * 90} fill="none" stroke={P.green} strokeWidth={2} opacity={(1 - p) * 0.6} />;})}
    <text x={230} y={240} fontSize={36} fill={P.ink} textAnchor="middle">{label}</text></svg>;};

// ---- Personen ----
const Av: React.FC<{c1: string; c2: string; size: number}> = ({c1, c2, size}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg,${c1},${c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5}}>🧑</div>
);
export const FNAvatar: React.FC<{name?: string; role?: string}> = ({name = 'Anna', role = 'spart clever'}) => {const f = useCurrentFrame();
  return <div style={{textAlign: 'center', opacity: rev(f, 2)}}><div style={{margin: '0 auto', borderRadius: '50%', boxShadow: `0 0 40px ${P.green}30`, width: 200}}><Av c1={P.green} c2={P.greenLt} size={200} /></div>
    <div style={{fontFamily: bebas, fontSize: 56, color: P.ink, marginTop: 18}}>{name}</div><div style={{fontFamily: inter, fontSize: 32, color: P.muted}}>{role}</div></div>;};
export const FNPersonaCard: React.FC<{name?: string; tags?: string[]}> = ({name = 'Tom, 28', tags = ['Sparquote 20%', 'ETF-Fan', 'langfristig']}) => {const f = useCurrentFrame();
  return <div style={{width: 720, padding: 40, borderRadius: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 30, alignItems: 'center', opacity: rev(f, 2)}}>
    <Av c1={P.green} c2={P.gold} size={140} /><div><div style={{fontFamily: bebas, fontSize: 60, color: P.ink}}>{name}</div>
      <div style={{display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap'}}>{tags.map((t, i) => <span key={i} style={{fontFamily: inter, fontSize: 26, padding: '8px 18px', borderRadius: 20, background: `${P.green}1a`, color: P.ink, opacity: rev(f, 12 + i * 8)}}>{t}</span>)}</div></div></div>;};
export const FNTeamGrid: React.FC = () => {const f = useCurrentFrame(); const team: [string, string, string][] = [['Anna', P.green, P.greenLt], ['Tom', P.green, P.gold], ['Mia', P.gold, P.greenLt], ['Ben', P.greenLt, P.green]];
  return <div style={{display: 'flex', gap: 40}}>{team.map(([n, a, b], i) => {const g = eo(c01((f - i * 8) / 26));
    return <div key={i} style={{textAlign: 'center', opacity: g, transform: `scale(${g})`}}><Av c1={a} c2={b} size={150} /><div style={{fontFamily: bebas, fontSize: 40, color: P.ink, marginTop: 12}}>{n}</div></div>;})}</div>;};
export const FNCrowdGrow: React.FC<{label?: string}> = ({label = '+10.000 Sparer'}) => {const f = useCurrentFrame();
  return <div style={{textAlign: 'center'}}><div style={{display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 10, width: 760}}>
    {new Array(72).fill(0).map((_, i) => <div key={i} style={{fontSize: 34, opacity: f > i * 1.4 ? 1 : 0, transform: `scale(${f > i * 1.4 ? 1 : 0})`}}>🧑</div>)}</div>
    <div style={{fontFamily: bebas, fontSize: 64, color: P.green, marginTop: 26, opacity: rev(f, 70)}}>{label}</div></div>;};
