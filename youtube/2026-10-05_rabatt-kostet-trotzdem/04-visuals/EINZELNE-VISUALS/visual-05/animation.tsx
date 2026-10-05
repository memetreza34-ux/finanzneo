import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'planned-purchase-versus-sale-trigger';
export const VISUAL_TECHNIQUE_ID = 'origin-of-desire-split';
export const COMPOSITION_FAMILY_ID = 'cause-path';
export const ANIMATION_NARRATIVE = {
  START: 'Links existiert der Kaufwunsch schon vor dem Sale, rechts noch nicht.',
  MECHANISM: 'Der Rabatt erscheint auf beiden Wegen.',
  RESULT: 'Links wird ein geplanter Kauf billiger, rechts erzeugt der Sale erst den Kauf.',
};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const sale = interpolate(frame, [25,45], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const payoff = interpolate(frame, [52,78], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <YouTubeSectionFrame title="Wann ein Rabatt wirklich spart" icon="check">
      <div style={{height:'100%', padding:'54px 64px', boxSizing:'border-box', fontFamily:'Arial', color:'#F4F0E8', display:'flex', gap:28}}>
        <div style={{flex:1, border:'1px solid #2B2B2B', borderRadius:28, padding:38}}>
          <div style={{fontSize:28, color:'#A7A7A7'}}>Geplant</div>
          <div style={{fontSize:44, fontWeight:800, marginTop:22}}>„Ich wollte es ohnehin.“</div>
          <div style={{marginTop:36, fontSize:34, color:'#2FCB8B', opacity:sale}}>500 € → 400 €</div>
          <div style={{marginTop:30, fontSize:28, opacity:payoff}}>Der geplante Kauf wird günstiger.</div>
        </div>
        <div style={{flex:1, border:'1px solid #2B2B2B', borderRadius:28, padding:38}}>
          <div style={{fontSize:28, color:'#A7A7A7'}}>Impuls</div>
          <div style={{fontSize:44, fontWeight:800, marginTop:22}}>Vorher kein Kaufplan.</div>
          <div style={{marginTop:36, fontSize:34, color:'#FF7A5A', opacity:sale}}>SALE → plötzlich Wunsch</div>
          <div style={{marginTop:30, fontSize:28, opacity:payoff}}>Der Rabatt erzeugt erst die Ausgabe.</div>
        </div>
      </div>
    </YouTubeSectionFrame>
  );
};
