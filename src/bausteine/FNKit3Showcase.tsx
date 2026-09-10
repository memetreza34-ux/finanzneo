import {C} from './fn_core';
import * as FX from './fn_effects';
import * as HK from './fn_hooks';
import * as CX from './fn_complex';
import {FNShowcaseCatalog, showcaseFrames} from './showcase-utils';

const BEAT = 130;
const items = [
  {name: 'Checkmark', node: <FX.FNCheckmark />},
  {name: 'Confetti', node: <FX.FNConfetti />},
  {name: 'Ring Pulse', node: <FX.FNRingPulse />},
  {name: 'Flash Word', node: <FX.FNFlashWord />},
  {name: 'Money Counter', node: <FX.FNMoneyCounter />},
  {name: 'Coin Burst', node: <FX.FNCoinBurst />},
  {name: 'Stop Scroll', node: <HK.FNStopScroll />},
  {name: 'Fakt-Hook', node: <HK.FNFactHook />},
  {name: 'Warnung', node: <HK.FNWarning />},
  {name: 'Frage-Hook', node: <HK.FNQuestion />},
  {name: 'Hot Take', node: <HK.FNHotTake />},
  {name: 'Concept Morph', node: <CX.FNConceptMorph />},
  {name: 'Data Story', node: <CX.FNDataStory />},
  {name: '3D-Karten', node: <CX.FNCard3DStack />},
  {name: 'Zinseszins-Kurve', node: <CX.FNExponential />},
  {name: 'Partikel-Morph', node: <CX.FNParticleMorph />},
  {name: 'Vergleich-Story', node: <CX.FNCompareStory />},
];
export const FNKIT3_FRAMES = showcaseFrames(items.length, BEAT);

export const FNKit3Showcase: React.FC = () => (
  <FNShowcaseCatalog
    items={items}
    beat={BEAT}
    background="static"
    contentPadding="90px 100px 120px"
    eyebrow="FINANZNEO · BAUSTEIN"
    eyebrowColor={C.green}
    footerFont="title"
    footerSize={56}
    footerLetterSpacing={0}
    footerColor={C.ink}
    footerBottom={56}
  />
);
