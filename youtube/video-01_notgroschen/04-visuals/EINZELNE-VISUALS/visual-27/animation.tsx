import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'stress-absorption-shield';
export const VISUAL_TECHNIQUE_ID = 'shock-buffer-sequence';
export const COMPOSITION_FAMILY_ID = 'simulation';
export const ANIMATION_NARRATIVE = {START:'Reserve schützt vor roten Notlösungen', MECHANISM:'Reparatur und Einkommenslücke treffen nacheinander ein', RESULT:'Beide werden abgefangen, Dispo/Kredit/Depot bleiben inaktiv'};

export const YouTubeVisual27Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const events=[{label:'Reparatur',start:12,y:300},{label:'Weniger Einkommen',start:60,y:650}];
  return <MotionStage>
    <div style={{position:'absolute',left:920,top:170,width:150,height:740,borderRadius:75,backgroundColor:COLORS.green,boxShadow:'0 0 60px rgba(45,216,129,0.24)'}}><div style={{position:'absolute',top:300,left:-135,width:420,transform:'rotate(-90deg)',fontSize:38,fontWeight:900,textAlign:'center'}}>RESERVE</div></div>
    {events.map((e)=>{const p=spring({frame:frame-e.start,fps,config:{damping:17,stiffness:125}});const x=160+650*Math.min(1,p);return <Panel key={e.label} style={{position:'absolute',left:x,top:e.y,width:430,height:140,padding:'42px',borderColor:COLORS.red,fontSize:38,fontWeight:900}}>{e.label}</Panel>;})}
    <div style={{position:'absolute',right:130,top:260,width:570,display:'grid',gap:28}}>{['Dispo','Kredit','Depotverkauf'].map((n)=><Panel key={n} style={{height:130,padding:'40px',opacity:0.24,borderColor:COLORS.red,fontSize:36,fontWeight:900}}>{n}</Panel>)}</div>
    <div style={{position:'absolute',left:1120,bottom:100,fontSize:34,color:COLORS.green,opacity:interpolate(frame,[88,112],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>Notlösungen bleiben unangetastet</div>
  </MotionStage>;
};
