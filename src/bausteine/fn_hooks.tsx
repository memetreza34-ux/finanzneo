// FinanzNeo Hook-Bausteine — aus KI-Kit portiert, FinanzNeo-Marke.
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {C, bebas, inter} from './fn_core';

const c01 = (t: number) => Math.max(0, Math.min(1, t));
const rev = (f: number, s: number, d = 14) => c01((f - s) / d);

export const FNStopScroll: React.FC<{text?: string}> = ({text = 'NICHT weiterscrollen'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 9}});
  const shake = f < 22 ? Math.sin(f * 1.5) * (22 - f) * 0.6 : 0;
  return <div style={{textAlign: 'center', fontFamily: bebas, transform: `translateX(${shake}px)`}}>
    <div style={{fontSize: 200, transform: `scale(${s})`}}>✋</div>
    <div style={{fontSize: 110, color: C.red, marginTop: 10, filter: `drop-shadow(0 0 30px ${C.red}66)`}}>{text}</div>
  </div>;
};

export const FNFactHook: React.FC<{fact?: string}> = ({fact = 'Dein Geld halbiert sich in 35 Jahren.'}) => {
  const f = useCurrentFrame();
  return <div style={{textAlign: 'center', maxWidth: 1400, fontFamily: bebas}}>
    <div style={{fontFamily: inter, fontSize: 46, fontWeight: 800, color: C.gold, letterSpacing: 6, opacity: rev(f, 2)}}>WUSSTEST DU?</div>
    <div style={{fontSize: 140, color: C.ink, marginTop: 24, lineHeight: 1.1, opacity: rev(f, 16)}}>{fact}</div>
  </div>;
};

export const FNWarning: React.FC<{text?: string}> = ({text = 'Mach NICHT diesen Geld-Fehler'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 10}});
  return <div style={{textAlign: 'center', fontFamily: bebas}}>
    <div style={{fontSize: 200, transform: `scale(${s})`}}>⚠️</div>
    <div style={{fontSize: 110, color: C.gold, marginTop: 10, opacity: rev(f, 16)}}>{text}</div>
  </div>;
};

export const FNQuestion: React.FC<{q?: string}> = ({q = 'Wie wirst du mit 67 reich?'}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const s = spring({frame: f - 2, fps, config: {damping: 11}});
  return <div style={{textAlign: 'center', fontFamily: bebas}}>
    <div style={{fontSize: 280, color: C.green, transform: `scale(${s})`, filter: `drop-shadow(0 0 50px ${C.green}66)`, lineHeight: 0.9}}>?</div>
    <div style={{fontSize: 96, color: C.ink, marginTop: 10, opacity: rev(f, 18)}}>{q}</div>
  </div>;
};

export const FNHotTake: React.FC<{text?: string}> = ({text = 'Sparbuch ist Geldverbrennung.'}) => {
  const f = useCurrentFrame();
  return <div style={{textAlign: 'center', maxWidth: 1400, fontFamily: bebas}}>
    <div style={{fontFamily: inter, fontSize: 42, fontWeight: 800, color: C.red, letterSpacing: 4, opacity: rev(f, 2)}}>🔥 UNBEQUEME WAHRHEIT</div>
    <div style={{fontSize: 130, color: C.ink, marginTop: 22, lineHeight: 1.1, opacity: rev(f, 16)}}>{text}</div>
  </div>;
};
