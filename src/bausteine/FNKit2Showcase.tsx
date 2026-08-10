import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {C, bebas, inter, AuroraBG} from './fn_core';
import * as T from './fn_text';
import * as CH from './fn_charts';
import * as DG from './fn_diagrams';

const items: {name: string; node: React.ReactNode}[] = [
  {name: 'Shimmer-Titel', node: <T.FNShimmer />},
  {name: 'Typewriter', node: <T.FNType />},
  {name: 'Word Reveal', node: <T.FNWordReveal />},
  {name: 'Highlight', node: <T.FNHighlight />},
  {name: 'Kinetischer Absatz', node: <T.FNKineticParagraph />},
  {name: 'Horizontale Balken', node: <CH.FNHBars />},
  {name: 'Fortschritts-Ring', node: <CH.FNProgressRing />},
  {name: 'Gauge', node: <CH.FNGauge />},
  {name: 'KPI-Grid', node: <CH.FNKPIGrid />},
  {name: 'Sparkline', node: <CH.FNSparkline />},
  {name: 'Stacked Bar', node: <CH.FNStackedBar />},
  {name: 'Ranking', node: <CH.FNRanking />},
  {name: 'Area Chart', node: <CH.FNAreaChart />},
  {name: 'Prozess', node: <DG.FNProcess />},
  {name: 'Timeline', node: <DG.FNTimeline />},
  {name: 'Pipeline (Cashflow)', node: <DG.FNPipeline />},
  {name: 'Checkliste', node: <DG.FNChecklist />},
  {name: 'Callout', node: <DG.FNCallout />},
  {name: 'VS-Vergleich', node: <DG.FNVS />},
];
export const FNKIT2_FRAMES = items.length * 130;

const Demo: React.FC<{name: string; node: React.ReactNode}> = ({name, node}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AuroraBG />
      <AbsoluteFill style={{padding: '90px 100px 120px', display: 'flex', flexDirection: 'column'}}>
        <div style={{fontFamily: inter, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.green,
          opacity: Math.min(1, f / 12)}}>FINANZNEO · BAUSTEIN</div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{node}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 56, width: '100%', textAlign: 'center', opacity: Math.min(1, (f - 4) / 12),
        fontFamily: bebas, fontSize: 56, color: C.ink, textShadow: '0 2px 24px rgba(0,0,0,0.7)'}}>{name}</div>
    </AbsoluteFill>
  );
};

export const FNKit2Showcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Series>
      {items.map((it, i) => <Series.Sequence key={i} durationInFrames={130}><Demo {...it} /></Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
