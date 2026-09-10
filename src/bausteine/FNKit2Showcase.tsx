import {C} from './fn_core';
import * as T from './fn_text';
import * as CH from './fn_charts';
import * as DG from './fn_diagrams';
import {FNShowcaseCatalog, showcaseFrames} from './showcase-utils';

const BEAT = 130;
const items = [
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
export const FNKIT2_FRAMES = showcaseFrames(items.length, BEAT);

export const FNKit2Showcase: React.FC = () => (
  <FNShowcaseCatalog
    items={items}
    beat={BEAT}
    background="aurora"
    contentPadding="90px 100px 120px"
    eyebrow="FINANZNEO · BAUSTEIN"
    eyebrowColor={C.green}
    footerFont="title"
    footerSize={56}
    footerLetterSpacing={0}
    footerColor={C.ink}
    footerBottom={56}
    footerTextShadow="0 2px 24px rgba(0,0,0,0.7)"
  />
);
