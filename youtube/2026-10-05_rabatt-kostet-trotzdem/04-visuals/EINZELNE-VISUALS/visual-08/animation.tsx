import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'end-price-over-discount-label';
export const VISUAL_TECHNIQUE_ID = 'old-price-demotion-end-price-focus';
export const COMPOSITION_FAMILY_ID = 'kinetic-rule';
export const ANIMATION_NARRATIVE = {
  START: 'Der durchgestrichene alte Preis dominiert kurz.',
  MECHANISM: 'Der alte Preis schrumpft und der echte Endpreis rückt ins Zentrum.',
  RESULT: 'Der Merksatz endet auf dem Betrag, der das Konto verlässt.',
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame,[12,44],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const rule = interpolate(frame,[48,76],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return (
    <YouTubeSectionFrame title="Nicht der Rabatt. Der Endpreis zählt." icon="target">
      <div style={{height:'100%', padding:'58px 70px', boxSizing:'border-box', color:'#F4F0E8', fontFamily:'Arial', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div style={{fontSize:52, color:'#777', textDecoration:'line-through', transform:`scale(${1-0.35*focus})`, opacity:1-0.45*focus}}>500 €</div>
        <div style={{fontSize:124, fontWeight:900, color:'#2FCB8B', marginTop:18, transform:`scale(${0.82+0.18*focus})`}}>400 €</div>
        <div style={{fontSize:34, textAlign:'center', maxWidth:1080, lineHeight:1.35, marginTop:42, opacity:rule}}>Ein Rabatt spart nur dann Geld, wenn er einen geplanten Kauf billiger macht.</div>
      </div>
    </YouTubeSectionFrame>
  );
};
