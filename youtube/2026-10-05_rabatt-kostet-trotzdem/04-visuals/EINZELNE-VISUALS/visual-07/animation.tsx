import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';

export const MECHANIC_ID = 'three-question-sale-check';
export const VISUAL_TECHNIQUE_ID = 'sequential-decision-check';
export const COMPOSITION_FAMILY_ID = 'checklist-motion';
export const ANIMATION_NARRATIVE = {
  START: 'Eine leere Prüfliste ist sichtbar.',
  MECHANISM: 'Drei Kauf-Fragen erscheinen nacheinander.',
  RESULT: 'Der Zuschauer hat einen kurzen Test vor jedem Sale-Kauf.',
};

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const questions = [
    'Würde ich es auch ohne Rabatt kaufen?',
    'Passt der Endpreis in mein Budget?',
    'Bin ich morgen noch froh über diese Ausgabe?',
  ];
  return (
    <YouTubeSectionFrame title="Der 10-Sekunden-Rabatt-Test" icon="list">
      <div style={{height:'100%', padding:'54px 70px', boxSizing:'border-box', fontFamily:'Arial', color:'#F4F0E8', display:'flex', flexDirection:'column', justifyContent:'center', gap:22}}>
        {questions.map((q,i)=>{
          const p=interpolate(frame,[10+i*22,24+i*22],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
          return <div key={q} style={{display:'flex', alignItems:'center', gap:24, padding:'26px 30px', border:'1px solid #292929', borderRadius:24, opacity:p, transform:`translateX(${(1-p)*24}px)`, background:'#0B0B0B'}}>
            <div style={{width:48,height:48,borderRadius:16,border:'2px solid #2FCB8B',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,color:'#2FCB8B'}}>✓</div>
            <div style={{fontSize:34,fontWeight:700}}>{q}</div>
          </div>;
        })}
      </div>
    </YouTubeSectionFrame>
  );
};
