import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'matched-income-risk-divergence';
export const VISUAL_TECHNIQUE_ID = 'mirrored-risk-split';
export const COMPOSITION_FAMILY_ID = 'comparison';
export const ANIMATION_NARRATIVE = {START:'Gleiches Einkommen', MECHANISM:'Zwei Lebenssituationen bauen unterschiedliche Verpflichtungen auf', RESULT:'Reservebedarf fällt unterschiedlich aus'};

export const YouTubeVisual13Animation: React.FC = () => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const split=spring({frame:frame-16,fps,config:{damping:18,stiffness:110}});
  const aLoad=interpolate(frame,[42,88],[0,0.38],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const bLoad=interpolate(frame,[42,88],[0,0.78],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const lane=(label:string,left:number,load:number,color:string)=><Panel style={{position:'absolute',left,top:330,width:650,height:420,padding:44,opacity:split,borderColor:color}}><div style={{fontSize:44,fontWeight:900}}>{label}</div><div style={{marginTop:54,height:70,borderRadius:22,backgroundColor:COLORS.line,overflow:'hidden'}}><div style={{height:'100%',width:`${load*100}%`,backgroundColor:COLORS.red}}/></div><div style={{marginTop:18,fontSize:28,color:COLORS.gray}}>notwendige Verpflichtungen</div><div style={{marginTop:50,height:40,borderRadius:20,backgroundColor:color,width:`${30+load*70}%`}}/><div style={{fontSize:26,marginTop:14}}>passende Reserve</div></Panel>;
  return <MotionStage><div style={{position:'absolute',top:130,width:'100%',textAlign:'center',fontSize:58,fontWeight:900}}>Gleiches Einkommen</div>{lane('Person A',170,aLoad,COLORS.green)}{lane('Person B',1100,bLoad,COLORS.gold)}</MotionStage>;
};
