import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'discount-price-versus-cash-outflow';
export const VISUAL_TECHNIQUE_ID = 'price-cut-account-outflow';
export const COMPOSITION_FAMILY_ID = 'data-comparison';
export const ANIMATION_NARRATIVE = {
  START: 'Der alte Preis von 500 € steht groß im Bild.',
  MECHANISM: '100 € werden sichtbar abgezogen und der Endpreis wird 400 €.',
  RESULT: 'Daneben erscheint klar: Vom Konto gehen 400 € ab.',
};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = interpolate(frame, [18, 42], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = interpolate(frame, [48, 78], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <YouTubeSectionFrame title="Was 100 € Rabatt wirklich heißt" icon="percent">
      <AbsoluteFill style={{padding:'54px 66px', boxSizing:'border-box', color:'#F4F0E8', fontFamily:'Arial'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', height:'100%'}}>
          <div style={{width:'46%'}}>
            <div style={{fontSize:30, color:'#A7A7A7', marginBottom:18}}>Alter Preis</div>
            <div style={{fontSize:92, fontWeight:800, textDecoration:cut>0.7?'line-through':'none', color:cut>0.7?'#8A8A8A':'#F4F0E8'}}>500 €</div>
            <div style={{fontSize:34, marginTop:24, color:'#FF7A5A', opacity:cut}}>− 100 € Rabatt</div>
            <div style={{fontSize:78, fontWeight:800, marginTop:22, color:'#2FCB8B', opacity:cut}}>400 €</div>
          </div>
          <div style={{width:2, height:'72%', background:'#242424'}} />
          <div style={{width:'42%', opacity:out, transform:`translateX(${(1-out)*28}px)`}}>
            <div style={{fontSize:30, color:'#A7A7A7'}}>Was dein Konto sieht</div>
            <div style={{fontSize:100, fontWeight:850, color:'#FF7A5A', marginTop:24}}>−400 €</div>
            <div style={{fontSize:30, marginTop:24, lineHeight:1.35}}>Rabatt und Ausgabe sind nicht dasselbe.</div>
          </div>
        </div>
      </AbsoluteFill>
    </YouTubeSectionFrame>
  );
};
