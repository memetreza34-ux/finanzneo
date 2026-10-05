import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'no-buy-versus-sale-buy';
export const VISUAL_TECHNIQUE_ID = 'two-path-budget-split';
export const COMPOSITION_FAMILY_ID = 'decision-comparison';
export const ANIMATION_NARRATIVE = {
  START: 'Zwei Wege beginnen beim selben Ausgangspunkt.',
  MECHANISM: 'Links wird nicht gekauft, rechts wird der rabattierte Kauf abgeschlossen.',
  RESULT: 'Links bleiben 0 € Ausgabe, rechts verlassen 400 € das Budget.',
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const left = interpolate(frame, [8, 30], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const right = interpolate(frame, [28, 56], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const result = interpolate(frame, [58, 82], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const card = (title:string, amount:string, accent:string, p:number) => (
    <div style={{flex:1, border:'1px solid #2B2B2B', borderRadius:28, padding:'42px 44px', opacity:p, transform:`translateY(${(1-p)*20}px)`, background:'#0B0B0B'}}>
      <div style={{fontSize:32, color:'#A7A7A7'}}>{title}</div>
      <div style={{fontSize:92, fontWeight:850, color:accent, marginTop:34}}>{amount}</div>
    </div>
  );
  return (
    <YouTubeSectionFrame title="Gespart oder einfach ausgegeben?" icon="wallet">
      <div style={{height:'100%', padding:'64px', boxSizing:'border-box', color:'#F4F0E8', fontFamily:'Arial', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{display:'flex', gap:28}}>
          {card('Ohne ungeplanten Kauf','0 €','#2FCB8B',left)}
          {card('Mit 100 € Rabatt','−400 €','#FF7A5A',right)}
        </div>
        <div style={{fontSize:36, textAlign:'center', marginTop:42, opacity:result}}>Wenn du es nicht kaufen wolltest, ist der Endpreis die relevante Ausgabe.</div>
      </div>
    </YouTubeSectionFrame>
  );
};
