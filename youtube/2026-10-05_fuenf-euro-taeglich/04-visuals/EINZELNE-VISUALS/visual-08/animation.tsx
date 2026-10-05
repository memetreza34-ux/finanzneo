import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'weekly-limit-conscious-choice';
export const VISUAL_TECHNIQUE_ID = 'three-step-limit-rail';
export const COMPOSITION_FAMILY_ID = 'kinetic-type';
export const ANIMATION_NARRATIVE = {
  START: 'Schritt 1 fordert sieben Tage Beobachtung.',
  MECHANISM: 'Danach folgen Addieren und ein bewusstes Wochenlimit.',
  RESULT: 'Der Abschluss ersetzt nebenbei durch bewusst.',
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    ['1','7 Tage aufschreiben'],
    ['2','Alles addieren'],
    ['3','Wochenlimit festlegen'],
  ];
  return (
    <AbsoluteFill style={{background:'#000', color:'#F4F0E8', fontFamily:'Arial', justifyContent:'center', padding:'0 180px'}}>
      {steps.map(([n,t],i)=>{
        const p=interpolate(frame,[8+i*24,20+i*24],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
        return <div key={n} style={{display:'flex', alignItems:'center', gap:42, margin:'18px 0', opacity:p, transform:`translateX(${(1-p)*40}px)`}}>
          <div style={{fontSize:78, fontWeight:800, color:'#2FCB8B', width:90}}>{n}</div>
          <div style={{fontSize:62}}>{t}</div>
        </div>;
      })}
      <div style={{marginTop:70, fontSize:48, color:'#E7C56A', opacity:interpolate(frame,[84,102],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>Nicht verbieten. Sichtbar machen.</div>
    </AbsoluteFill>
  );
};
