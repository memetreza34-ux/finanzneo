import * as P from './fn_pro';
import {FNShowcaseCatalog, showcaseFrames} from './showcase-utils';

const BEAT = 140;
const items = [
  {name: 'Hero-Zahl', node: <P.FNHeroNumber />},
  {name: 'Balken (clean)', node: <P.FNBarsClean />},
  {name: 'Linie (clean)', node: <P.FNLineClean />},
  {name: 'Stat-Triptychon', node: <P.FNStatTriptych />},
  {name: 'Donut (tonal)', node: <P.FNDonutClean />},
  {name: 'Vergleich (clean)', node: <P.FNCompareClean />},
  {name: 'Zitat', node: <P.FNQuoteClean />},
];
export const FNPRO_FRAMES = showcaseFrames(items.length, BEAT);

export const FNProShowcase: React.FC = () => (
  <FNShowcaseCatalog items={items} beat={BEAT} background="static" contentPadding="110px 120px" />
);
