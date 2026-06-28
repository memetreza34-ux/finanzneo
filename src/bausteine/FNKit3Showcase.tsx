import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {C, bebas, inter, StaticBG} from './fn_core';
import * as FX from './fn_effects';
import * as HK from './fn_hooks';
import * as CX from './fn_complex';

const items: {name: string; node: React.ReactNode}[] = [
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
export const FNKIT3_FRAMES = items.length * 130;

const Demo: React.FC<{name: string; node: React.ReactNode}> = ({name, node}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticBG />
      <AbsoluteFill style={{padding: '90px 100px 120px', display: 'flex', flexDirection: 'column'}}>
        <div style={{fontFamily: inter, fontSize: 30, fontWeight: 700, letterSpacing: 6, color: C.green, opacity: Math.min(1, f / 12)}}>FINANZNEO · BAUSTEIN</div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{node}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 56, width: '100%', textAlign: 'center', opacity: Math.min(1, (f - 4) / 12),
        fontFamily: bebas, fontSize: 56, color: C.ink}}>{name}</div>
    </AbsoluteFill>
  );
};

export const FNKit3Showcase: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Series>
      {items.map((it, i) => <Series.Sequence key={i} durationInFrames={130}><Demo {...it} /></Series.Sequence>)}
    </Series>
  </AbsoluteFill>
);
