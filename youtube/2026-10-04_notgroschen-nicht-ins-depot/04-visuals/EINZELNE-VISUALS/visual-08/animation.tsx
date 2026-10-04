import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'three-step-emergency-fund-plan';
export const VISUAL_TECHNIQUE_ID = 'sequential-action-rail';
export const COMPOSITION_FAMILY_ID = 'kinetic-type';
export const ANIMATION_NARRATIVE = {
  START: 'Drei leere Handlungsschritte',
  MECHANISM: 'Die Schritte werden nacheinander im Sprechrhythmus aktiviert',
  RESULT: 'Reserve aufbauen, liquide parken, Überschuss langfristig investieren',
};

const Row: React.FC<{index:number; frame:number; label:string; detail:string}> = ({index, frame, label, detail}) => {
  const start = 10 + index * 20;
  const p = interpolate(frame, [start, start + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{display:'flex', alignItems:'center', gap:28, marginBottom:30, opacity:p, transform:`translateX(${40*(1-p)}px)`}}>
      <div style={{width:76, height:76, borderRadius:38, border:'3px solid #2FCB8B', color:'#2FCB8B', display:'grid', placeItems:'center', fontSize:34, fontWeight:800}}>{index+1}</div>
      <div>
        <div style={{fontSize:48, fontWeight:800}}>{label}</div>
        <div style={{fontSize:30, color:'#B9B5AE', marginTop:4}}>{detail}</div>
      </div>
    </div>
  );
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const final = interpolate(frame, [68, 88], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor:'#000', color:'#F4F0E8', fontFamily:'Arial', justifyContent:'center', alignItems:'center'}}>
      <div style={{width:1180}}>
        <Row index={0} frame={frame} label="Reserve aufbauen" detail="Ziel passend zur eigenen Situation wählen" />
        <Row index={1} frame={frame} label="Liquide parken" detail="zum Beispiel auf einem Tagesgeldkonto" />
        <Row index={2} frame={frame} label="Überschuss investieren" detail="langfristiges Geld bekommt Zeit im Depot" />
        <div style={{marginTop:46, fontSize:42, color:'#2FCB8B', opacity:final}}>Der Notgroschen schützt deinen langfristigen Plan.</div>
      </div>
    </AbsoluteFill>
  );
};
