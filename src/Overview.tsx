import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import {
  C, FONT, Background, Vignette,
  Counter, Bars, NumberedSteps, CheckCards, Timeline, Icon,
} from './brand';

// Statisches Übersichts-POSTER — zeigt alle Bausteine fertig (settled) mit Labels.
// Zum Anschauen als Still gedacht (alle appear-Zeiten = 0, hoher Frame).
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT.body, fontWeight: 800, fontSize: 26, color: C.accent,
    letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>{children}</div>
);
const Section: React.FC<{ title: string; children: React.ReactNode; h?: number }> = ({ title, children, h }) => (
  <div style={{ width: '100%', minHeight: h, padding: '20px 50px', boxSizing: 'border-box' }}>
    <Label>{title}</Label>
    {children}
  </div>
);

export const Overview: React.FC = () => {
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background grid glow />

      <div style={{ position: 'absolute', top: 60, width: '100%', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT.title, fontSize: 130, color: C.white, letterSpacing: 2 }}>FINANZNEO</div>
        <div style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 40, color: C.accent, letterSpacing: 6 }}>BAUKASTEN · ALLE BAUSTEINE</div>
      </div>

      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Fonts + Counter */}
        <Section title="Titel · Bebas Neue + Counter">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
            <div style={{ fontFamily: FONT.title, fontSize: 96, color: C.white }}>TITEL</div>
            <Counter to={120000} start={0} end={1} size={96} />
          </div>
        </Section>

        {/* Icons */}
        <Section title="20 Flat-Vector Icons (erweiterbar)">
          <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
            {(['euro','chart-up','chart-bar','clock','shield','check','coins','bank','rocket','wallet','percent','target','bulb','lock','trending','calendar','phone'] as const).map(n => (
              <Icon key={n} name={n} size={62} />
            ))}
          </div>
        </Section>

        {/* Chart + Bars side by side */}
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ width: '52%', position: 'relative', height: 360 }}>
            <Label>{''}</Label>
            <div style={{ position: 'absolute', left: 50, top: -6 }}><Label>Wachstumskurve</Label></div>
            <svg width={width * 0.52} height={340} style={{ position: 'absolute', top: 30, left: 0 }} viewBox={`0 0 ${width*0.52} 340`}>
              <defs><linearGradient id="ovA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.4"/><stop offset="100%" stopColor={C.accent} stopOpacity="0.02"/></linearGradient></defs>
              {(() => { const L=70,R=width*0.52-30,B=300,T=40,CW=R-L,CH=B-T; const g=(x:number)=>Math.pow(x/30,2.1); const tx=(x:number)=>L+(x/30)*CW; const ty=(v:number)=>B-v*CH; const pts:string[]=[]; for(let i=0;i<=60;i++){const x=i/60*30;pts.push(`${tx(x)},${ty(g(x))}`);} return (<>
                <line x1={L} y1={B} x2={R} y2={B} stroke={C.gray} strokeWidth={2} opacity={0.4}/>
                <path d={`M ${L},${B} L ${pts.join(' L ')} L ${tx(30)},${B} Z`} fill="url(#ovA)"/>
                <path d={`M ${pts.join(' L ')}`} fill="none" stroke={C.accent} strokeWidth={7} style={{filter:`drop-shadow(0 0 10px ${C.accent})`}}/>
                <circle cx={tx(30)} cy={ty(g(30))} r={11} fill={C.accent}/>
              </>); })()}
            </svg>
          </div>
          <div style={{ width: '48%', position: 'relative', height: 360 }}>
            <div style={{ position: 'absolute', left: 30, top: -6 }}><Label>Balken</Label></div>
            <Bars width={width * 0.48} baseY={300} maxBarH={230} barW={130}
              items={[
                { x: 60, valuePct: 1.0, color: C.accent, label: 'Sparplan', topText: '120k', appear: 0 },
                { x: 260, valuePct: 0.35, color: C.negative, label: 'Sparbuch', topText: '20k', appear: 0 },
              ]} />
          </div>
        </div>

        {/* Steps + Cards */}
        <div style={{ display: 'flex', width: '100%', marginTop: 10 }}>
          <div style={{ width: '50%', padding: '0 50px' }}>
            <Label>Nummerierte Schritte</Label>
            <NumberedSteps steps={[
              { label: 'ETF verstehen', appear: 0, icon: 'bulb' },
              { label: 'Depot eröffnen', appear: 0, icon: 'bank' },
            ]} gap={24} />
          </div>
          <div style={{ width: '50%', padding: '0 50px' }}>
            <Label>Check-Cards</Label>
            <CheckCards cards={[
              { text: 'Nie von ETFs gehört?', appear: 0, solve: 0 },
              { text: 'Wo anfangen?', appear: 0 },
            ]} gap={22} />
          </div>
        </div>

        {/* Timeline */}
        <Section title="Timeline">
          <div style={{ position: 'relative', height: 150 }}>
            <Timeline width={width - 100} y={70} left={60} right={width - 160}
              points={[
                { label: '2026', sub: 'Start', appear: 0 },
                { label: '2036', sub: '60k €', appear: 0 },
                { label: '2056', sub: '120k €', appear: 0 },
              ]} />
          </div>
        </Section>
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
