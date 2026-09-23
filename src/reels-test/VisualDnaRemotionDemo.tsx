import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C, FONT, sec} from '../brand';
import {FinanceDataVisual} from '../brand/components/FinanceDataVisual';
import sp500 from '../../public/data/sp500-10y.json';

const COST = '#E85D3F';

export const VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES = sec(4);
export const VISUAL_DNA_REMOTION_DEMO_FRAMES = VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES * 6;

const DemoFrame: React.FC<{
  route: string;
  title: string;
  children: React.ReactNode;
}> = ({route, title, children}) => (
  <AbsoluteFill style={{backgroundColor: C.bg, color: C.white}}>
    <div style={{position: 'absolute', top: 92, left: 72, right: 72}}>
      <div style={{fontFamily: FONT.body, fontSize: 24, fontWeight: 700, color: C.gray, letterSpacing: 2}}>
        ROUTING DEMO · NICHT PRODUKTION
      </div>
      <div style={{marginTop: 18, fontFamily: FONT.title, fontSize: 66, lineHeight: 1.02}}>{title}</div>
      <div style={{marginTop: 12, fontFamily: FONT.body, fontSize: 26, color: C.accentLt}}>{route}</div>
    </div>
    <div style={{position: 'absolute', top: 330, bottom: 280, left: 60, right: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {children}
    </div>
  </AbsoluteFill>
);

const CostTag: React.FC<{label: string; rotate?: number}> = ({label, rotate = 0}) => (
  <div style={{
    padding: '12px 18px',
    borderRadius: 16,
    background: COST,
    color: C.bg,
    fontFamily: FONT.body,
    fontWeight: 800,
    fontSize: 28,
    transform: `rotate(${rotate}deg)`,
  }}>
    {label}
  </div>
);

const PressureMock: React.FC = () => (
  <div style={{width: 850, height: 760, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{
      width: 500,
      height: 320,
      borderRadius: 48,
      background: C.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
      fontFamily: FONT.title,
      fontSize: 84,
      color: C.bg,
    }}>
      BUDGET
    </div>
    <div style={{position: 'absolute', left: 30, top: 95}}><CostTag label="9 €" rotate={-8} /></div>
    <div style={{position: 'absolute', right: 24, top: 140}}><CostTag label="19 €" rotate={7} /></div>
    <div style={{position: 'absolute', left: 70, bottom: 120}}><CostTag label="29 €" rotate={5} /></div>
    <div style={{position: 'absolute', right: 70, bottom: 80}}><CostTag label="39 €" rotate={-6} /></div>
    <div style={{position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', fontFamily: FONT.body, fontSize: 26, color: C.gray}}>
      Google-Flow-Bildslot · Visual DNA: Pressure / Problem
    </div>
  </div>
);

const FlowMock: React.FC = () => (
  <div style={{width: 900, height: 720, position: 'relative'}}>
    <div style={{position: 'absolute', left: 20, top: 250, width: 230, height: 150, borderRadius: 32, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontSize: 44, color: C.bg}}>EINKOMMEN</div>
    <div style={{position: 'absolute', left: 260, right: 220, top: 312, height: 18, background: C.gold, borderRadius: 10}} />
    {['FIXKOSTEN', 'GEBÜHREN'].map((label, i) => (
      <div key={label} style={{position: 'absolute', right: 20, top: 155 + i * 170, width: 210, height: 110, borderRadius: 28, background: COST, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.body, fontWeight: 800, fontSize: 25, color: C.bg}}>{label}</div>
    ))}
    <div style={{position: 'absolute', right: 20, bottom: 70, width: 210, height: 110, borderRadius: 28, border: `5px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.body, fontWeight: 800, fontSize: 25, color: C.accentLt}}>RÜCKLAGE</div>
    <div style={{position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', fontFamily: FONT.body, fontSize: 26, color: C.gray}}>
      Google-Flow-Bildslot · Visual DNA: Money Flow
    </div>
  </div>
);

const HumanMock: React.FC = () => (
  <div style={{width: 820, height: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 50}}>
      <div style={{width: 220, height: 360, borderRadius: 100, border: `6px solid ${C.gray}`, position: 'relative'}}>
        <div style={{position: 'absolute', width: 110, height: 110, borderRadius: 60, border: `6px solid ${C.gray}`, top: 35, left: 49}} />
        <div style={{position: 'absolute', width: 130, height: 150, borderRadius: 40, border: `6px solid ${C.gray}`, bottom: 35, left: 39}} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        <CostTag label="29 € / Monat" />
        <div style={{padding: '18px 24px', borderRadius: 20, border: `4px solid ${C.accent}`, fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.accentLt}}>NEIN</div>
      </div>
    </div>
    <div style={{fontFamily: FONT.body, fontSize: 26, color: C.gray}}>Google-Flow-Bildslot · Mensch nur mit echtem narrativem Mehrwert</div>
  </div>
);

const BufferMock: React.FC = () => (
  <div style={{width: 850, height: 650, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 520, height: 300, borderRadius: 56, border: `8px solid ${C.accent}`, background: 'rgba(46, 204, 113, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontSize: 78, color: C.accentLt}}>RÜCKLAGE</div>
    <div style={{position: 'absolute', top: 70, right: 55}}><CostTag label="BELASTUNG" rotate={7} /></div>
    <div style={{position: 'absolute', bottom: 10, fontFamily: FONT.body, fontSize: 26, color: C.gray}}>Google-Flow-Bildslot · Protection / Buffer bleibt intakt</div>
  </div>
);

const LineDataScene: React.FC = () => (
  <DemoFrame route="data-line-remotion" title="S&P 500 · 10 Jahre">
    <FinanceDataVisual
      kind="line"
      title="Echte Zeitreihe"
      subtitle="Keine erfundene KI-Kurve"
      data={sp500.chart}
      source={`${sp500.source} · ${sp500.symbol}`}
      asOf={sp500.fetchedAt}
      startFrame={10}
      endFrame={85}
      width={900}
    />
  </DemoFrame>
);

const BarDataScene: React.FC = () => {
  const first = sp500.chart[0];
  const last = sp500.chart[sp500.chart.length - 1];
  return (
    <DemoFrame route="data-bar-remotion" title="Start vs. letzter Datenpunkt">
      <FinanceDataVisual
        kind="bar"
        title="Punktestand im Vergleich"
        subtitle={`${first.x} gegenüber ${last.x}`}
        data={[
          {name: first.x, value: first.y, color: C.gray},
          {name: last.x, value: last.y, color: C.accent},
        ]}
        source={`${sp500.source} · ${sp500.symbol}`}
        asOf={sp500.fetchedAt}
        startFrame={10}
        endFrame={75}
        width={900}
      />
    </DemoFrame>
  );
};

export const VisualDnaRemotionDemo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <Sequence from={0} durationInFrames={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES}>
      <DemoFrame route="pressure-problem-image · google-flow" title="Kleine Kosten drücken aufs Budget"><PressureMock /></DemoFrame>
    </Sequence>
    <Sequence from={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES} durationInFrames={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES}>
      <DemoFrame route="money-flow-image · google-flow" title="Wohin das Einkommen fließt"><FlowMock /></DemoFrame>
    </Sequence>
    <Sequence from={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES * 2} durationInFrames={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES}>
      <LineDataScene />
    </Sequence>
    <Sequence from={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES * 3} durationInFrames={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES}>
      <BarDataScene />
    </Sequence>
    <Sequence from={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES * 4} durationInFrames={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES}>
      <DemoFrame route="human-context-image · google-flow" title="Mensch nur wenn die Entscheidung zählt"><HumanMock /></DemoFrame>
    </Sequence>
    <Sequence from={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES * 5} durationInFrames={VISUAL_DNA_REMOTION_DEMO_SCENE_FRAMES}>
      <DemoFrame route="protection-buffer-image · google-flow" title="Die Rücklage bleibt sichtbar"><BufferMock /></DemoFrame>
    </Sequence>
  </AbsoluteFill>
);
