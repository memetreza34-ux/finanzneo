import React from 'react';
import {interpolate} from 'remotion';
import {ANIMATION_COLORS, C, CLAMP, FONT} from '../../../../../src/brand';

export {ANIMATION_COLORS, C, CLAMP, FONT};

export const pct = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], CLAMP);

export const Header: React.FC<{title: string}> = ({title}) => (
  <div style={{position:'absolute',left:72,right:72,top:145,textAlign:'center',fontFamily:FONT.title,fontSize:56,fontWeight:950,color:C.white,lineHeight:1.05}}>{title}</div>
);

export const Caption: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position:'absolute',left:92,right:92,bottom:285,textAlign:'center',fontFamily:FONT.body,fontSize:43,fontWeight:850,color:C.white,lineHeight:1.18}}>{children}</div>
);

export const SceneShell: React.FC<{title:string;caption:string;children:React.ReactNode}> = ({title,caption,children}) => (
  <div style={{position:'absolute',inset:0,backgroundColor:'#000'}}>
    <Header title={title}/>
    <div style={{position:'absolute',left:0,right:0,top:320,height:1080,overflow:'hidden'}}>{children}</div>
    <Caption>{caption}</Caption>
  </div>
);

export const GoldCoin: React.FC<{x:number;y:number;size?:number;opacity?:number;scale?:number;text?:string}> = ({x,y,size=120,opacity=1,scale=1,text}) => (
  <div style={{position:'absolute',left:x,top:y,width:size,height:size,borderRadius:'50%',border:`4px solid ${C.goldLt}`,background:`radial-gradient(circle at 34% 28%,${C.white},${C.gold} 30%,#6f4c00 76%)`,boxShadow:'0 28px 44px rgba(0,0,0,.44),0 0 24px rgba(255,202,74,.16)',opacity,scale,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:size*.22,fontWeight:950,color:'#211600'}}>{text}</div>
);
