import {C} from './fn_core';
import * as P from './fn_premium2';
import {FNShowcaseCatalog, showcaseFrames} from './showcase-utils';

const BEAT = 140;
const items = [
  {name: 'Shine-Card', node: <P.FNShineCard />},
  {name: 'Candlestick-Chart', node: <P.FNCandles />},
  {name: 'Gold-Barren', node: <P.FNGoldBars />},
  {name: 'Neon-Zahl', node: <P.FNNeonNumber />},
  {name: 'Wealth-Mountain', node: <P.FNWealthMountain />},
  {name: 'Portfolio-Ringe', node: <P.FNPortfolioRings />},
  {name: 'Beam-Stat', node: <P.FNBeamStat />},
  {name: 'Market-Heatmap', node: <P.FNMarketHeat />},
];
export const FNPREM2_FRAMES = showcaseFrames(items.length, BEAT);

export const FNPremium2Showcase: React.FC = () => (
  <FNShowcaseCatalog
    items={items}
    beat={BEAT}
    background="static"
    contentPadding="90px 100px 120px"
    eyebrow="FINANZNEO · PREMIUM"
    eyebrowColor={C.gold}
    footerFont="title"
    footerSize={56}
    footerLetterSpacing={0}
    footerColor={C.ink}
    footerBottom={56}
  />
);
