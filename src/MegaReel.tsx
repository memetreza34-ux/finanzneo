import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  C, FONT, sec, prog, lerpF, life, a, E, num,
  Background, AuroraBG, Vignette, Particles,
  RollingNumber, Counter, BigStat, GrowthChart, Bars, Donut, PercentRing, Gauge, StatBar,
  AreaPremium, BarsPremium, PiePremium, RadarPremium,
  Mindmap, Flowchart, Pyramid, Cycle, Balance, GoalTracker, Ranking,
  CompareSplit, Checklist, FeatureGrid, Quote, Badge, NumberedSteps, Timeline,
  Typewriter, MaskReveal, WordStagger, Underline, Title, Kicker,
  MoneyRain, Confetti, Sparkles, Shine, Emphasis,
  PhoneMockup, AppScreenDemo,
} from './brand';

const SD = sec(6); // Sekunden pro Segment

// kleines Label oben mit Segment-Nummer
const Tag: React.FC<{ n: number; total: number; name: string; s: number }> = ({ n, total, name, s }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center',
      opacity: life(f, s, s + SD, 10), zIndex: 50 }}>
      <span style={{ fontFamily: FONT.body, fontSize: 26, color: a(C.white, 0.5), letterSpacing: 3 }}>
        {n}/{total} · {name}
      </span>
    </div>
  );
};

export const MegaReel: React.FC = () => {
  const f = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();

  // jedes Segment: Name + Render-Funktion (s = Start-Frame)
  const segs: { name: string; bg: 'dark' | 'aurora' | 'light'; node: (s: number) => React.ReactNode }[] = [
    { name: 'Blur-Rise Text', bg: 'aurora', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ paddingInline: 50, textAlign: 'center' }}>
          <MaskReveal at={s + 8} dur={18} size={120} color={C.white}>DEIN GELD</MaskReveal>
          <div style={{ marginTop: 10 }}><MaskReveal at={s + 22} dur={18} size={120} color={C.accent}>WÄCHST</MaskReveal></div>
        </div></AbsoluteFill>) },

    { name: 'Wort-Stagger', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingInline: 60 }}>
        <WordStagger text="Jeder Euro zählt ab heute" start={s + 8} perWord={6} size={78} highlight={['heute']} highlightColor={C.gold} /></AbsoluteFill>) },

    { name: 'Typewriter', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Typewriter text="Investieren ist einfach." start={s + 6} cps={22} size={70} color={C.accentLt} /></AbsoluteFill>) },

    { name: 'Odometer-Zahl', bg: 'aurora', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <RollingNumber to={250000} start={s + 10} end={s + 80} size={170} color={C.gold} /></AbsoluteFill>) },

    { name: 'Riesen-Stat', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <BigStat value="73%" label="sparen falsch" at={s + 8} color={C.negative} size={300} /></AbsoluteFill>) },

    { name: 'Premium Area-Chart', bg: 'dark', node: (s) => (
      <AbsoluteFill>
        <div style={{ position: 'absolute', top: 560, left: 20, right: 20 }}>
          <AreaPremium width={W - 40} height={760} drawStart={s + 8} drawEnd={s + 70} color={C.accent}
            data={[{x:'0',y:0},{x:'10',y:30000},{x:'20',y:95000},{x:'30',y:250000}]} /></div></AbsoluteFill>) },

    { name: 'Balken (Premium)', bg: 'dark', node: (s) => (
      <AbsoluteFill><div style={{ position: 'absolute', top: 600, left: 40, right: 40 }}>
        <BarsPremium width={W - 80} height={780} growStart={s + 8} growEnd={s + 50}
          data={[{name:'Sparbuch',value:20000,color:C.negative},{name:'ETF',value:120000,color:C.accent},{name:'Aktien',value:90000,color:C.blue}]} /></div></AbsoluteFill>) },

    { name: 'Donut', bg: 'aurora', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 600, height: 600, position: 'relative' }}>
          <PiePremium width={600} height={600} drawStart={s + 8} drawEnd={s + 45} centerLabel="100%"
            data={[{name:'A',value:60,color:C.accent},{name:'B',value:25,color:C.blue},{name:'C',value:15,color:C.gold}]} /></div></AbsoluteFill>) },

    { name: 'Radar', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <RadarPremium width={760} height={760} drawStart={s + 8} drawEnd={s + 45} color={C.accent}
          data={[{axis:'Rendite',value:90},{axis:'Sicher',value:60},{axis:'Liquide',value:80},{axis:'Einfach',value:95},{axis:'Kosten',value:85}]} /></AbsoluteFill>) },

    { name: 'Prozent-Ring', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 460, height: 460, position: 'relative' }}>
          <PercentRing cx={230} cy={230} radius={180} percent={7.5} color={C.accent} start={s + 8} end={s + 55} label="Rendite p.a." /></div></AbsoluteFill>) },

    { name: 'Risiko-Tacho', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 640, height: 460, position: 'relative' }}>
          <Gauge cx={320} cy={300} radius={240} value={35} start={s + 8} end={s + 50} label="Risiko" /></div></AbsoluteFill>) },

    { name: 'Vergleich VS', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ justifyContent: 'center' }}><div style={{ paddingInline: 50 }}>
        <CompareSplit height={680}
          left={{title:'Sparbuch',value:'20k',icon:'bank',color:C.negative,appear:s+10}}
          right={{title:'ETF',value:'120k',icon:'chart-up',color:C.accent,appear:s+18}} /></div></AbsoluteFill>) },

    { name: 'Mindmap', bg: 'dark', node: (s) => (
      <Mindmap width={W} height={H} center="ETF" centerAt={s + 8}
        nodes={[{label:'Aktien',appear:s+18,color:C.accent},{label:'Anleihen',appear:s+24,color:C.blue},{label:'Gold',appear:s+30,color:C.gold},{label:'Immo',appear:s+36,color:C.purple}]} />) },

    { name: 'Pyramide', bg: 'dark', node: (s) => (
      <Pyramid cx={W/2} topY={500} baseW={760} levelH={150}
        levels={[{label:'Notgroschen',appear:s+8},{label:'ETF',appear:s+16},{label:'Aktien',appear:s+24},{label:'Krypto',appear:s+32}]} />) },

    { name: 'Kreislauf', bg: 'aurora', node: (s) => (
      <Cycle width={W} height={H} centerLabel="📈" radius={300}
        nodes={[{label:'Einzahlen',appear:s+8},{label:'Zinsen',appear:s+16},{label:'Reinvest',appear:s+24},{label:'Mehr',appear:s+32}]} />) },

    { name: 'Ranking', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ justifyContent: 'center' }}><div style={{ paddingInline: 80 }}>
        <Ranking items={[{name:'Trade Republic',value:'1€',appear:s+8},{name:'Scalable',value:'0,99€',appear:s+16},{name:'ING',value:'4,90€',appear:s+24}]} /></div></AbsoluteFill>) },

    { name: 'Checkliste', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ justifyContent: 'center' }}><div style={{ paddingInline: 120 }}>
        <Checklist items={[{text:'Depot',appear:s+8},{text:'100€/Monat',appear:s+16},{text:'Geduld',appear:s+24}]} /></div></AbsoluteFill>) },

    { name: 'Ziel-Tracker', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 600, height: 800, position: 'relative' }}>
          <GoalTracker x={120} topY={40} height={680} percent={75} goalLabel="Sparziel 10k€" start={s+8} end={s+55} /></div></AbsoluteFill>) },

    { name: 'Handy-Mockup', bg: 'aurora', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <PhoneMockup at={s + 8} width={440}><AppScreenDemo title="Dein Depot" value="12.480 €" /></PhoneMockup></AbsoluteFill>) },

    { name: 'Geld-Regen + CTA', bg: 'dark', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MoneyRain width={W} height={H} n={20} />
        <Emphasis at={s + 10} color={C.gold} size={150}>100€</Emphasis>
        <div style={{ fontFamily: FONT.body, fontSize: 48, color: C.white, marginTop: 20, opacity: prog(f, s+20, s+30) }}>jeden Monat</div></AbsoluteFill>) },

    { name: 'Konfetti-Finale', bg: 'aurora', node: (s) => (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Confetti width={W} height={H} at={s + 8} n={70} />
        <div style={{ transform: `scale(${prog(f, s+6, s+14, E.spring)})` }}>
          <Title at={s + 6} size={130} color={C.accent}>GESCHAFFT</Title></div>
        <div style={{ fontSize: 90, marginTop: 10 }}>🚀</div></AbsoluteFill>) },
  ];

  const total = segs.length;
  const active = Math.floor(f / SD);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {segs.map((seg, i) => {
        const s = i * SD;
        if (f < s - 18 || f > s + SD + 18) return null; // nur aktive rendern
        const op = life(f, s, s + SD, 14);
        return (
          <AbsoluteFill key={i} style={{ opacity: op }}>
            {seg.bg === 'aurora' ? <AuroraBG /> : seg.bg === 'light'
              ? <AbsoluteFill style={{ background: '#ECEDEF' }} />
              : <Background grid glow />}
            {seg.node(s)}
            <Tag n={i + 1} total={total} name={seg.name} s={s} />
          </AbsoluteFill>
        );
      })}
      <Vignette />
      {/* Fortschritt */}
      <div style={{ position: 'absolute', top: 0, left: 0, height: 6,
        width: (f / (total * SD)) * W, background: `linear-gradient(90deg, ${C.gold}, ${C.accent})`, zIndex: 100 }} />
    </AbsoluteFill>
  );
};
