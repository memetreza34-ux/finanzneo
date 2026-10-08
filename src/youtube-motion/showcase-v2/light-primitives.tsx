import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../brand';

export const LIGHT_SCENE_FRAMES=78;

export const L={
  bg:'#F7F5EF',
  paper:'#FFFFFF',
  ink:'#202724',
  muted:'#6D756F',
  line:'#D9DDD8',
  green:'#4F8A67',
  greenSoft:'#DDEADF',
  blue:'#6C8EAA',
  blueSoft:'#E5EEF4',
  orange:'#D77A59',
  orangeSoft:'#F6E5DD',
  gold:'#C5A050',
  goldSoft:'#F4ECD4',
  purple:'#8573A8',
  purpleSoft:'#ECE7F3',
  teal:'#5E9B98',
  tealSoft:'#E0EFED',
  red:'#C8625C',
  redSoft:'#F4DFDD',
  graySoft:'#EEF0ED',
} as const;

export const CLAMP={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};

export const pr=(f:number,a:number,b:number,e=Easing.out(Easing.cubic))=>
  interpolate(f,[a,b],[0,1],{...CLAMP,easing:e});

export const sp=(f:number,a:number,fps:number)=>
  spring({frame:Math.max(0,f-a),fps,config:{damping:20,stiffness:155,mass:0.74}});

export const useLightScene=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  return {frame,fps};
};

export const SceneFade:React.FC<{children:React.ReactNode;background?:string}> = ({children,background=L.bg})=>{
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[0,5,LIGHT_SCENE_FRAMES-6,LIGHT_SCENE_FRAMES-1],[0,1,1,0],CLAMP);
  return <div style={{position:'absolute',inset:0,background,opacity,fontFamily:FONT.body,overflow:'hidden'}}>{children}</div>;
};

export const SoftPanel:React.FC<{
  children:React.ReactNode;x:number;y:number;w:number;h:number;
  bg?:string;border?:string;opacity?:number;scale?:number;
}> = ({children,x,y,w,h,bg=L.paper,border=L.line,opacity=1,scale=1})=>(
  <div style={{
    position:'absolute',left:x,top:y,width:w,height:h,borderRadius:30,background:bg,
    border:'2px solid '+border,boxShadow:'0 14px 32px rgba(32,39,36,.055)',
    opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%',boxSizing:'border-box'
  }}>{children}</div>
);

export const Txt:React.FC<{
  children:React.ReactNode;x:number;y:number;size?:number;color?:string;weight?:number;
  width?:number;align?:'left'|'center'|'right';title?:boolean;opacity?:number;
}> = ({children,x,y,size=28,color=L.ink,weight=800,width,align='left',title=false,opacity=1})=>(
  <div style={{
    position:'absolute',left:x,top:y,width,textAlign:align,fontFamily:title?FONT.title:FONT.body,
    fontSize:size,fontWeight:weight,color,lineHeight:1.08,opacity
  }}>{children}</div>
);

export const CircleIcon:React.FC<{x:number;y:number;color:string;type:'wallet'|'home'|'cart'|'chart'|'shield'|'doc'|'bank'|'phone';show?:number}> =
({x,y,color,type,show=1})=>(
  <div style={{
    position:'absolute',left:x,top:y,width:86,height:86,borderRadius:'50%',
    background:color+'20',display:'flex',alignItems:'center',justifyContent:'center',
    opacity:show,transform:`scale(${0.8+0.2*show})`
  }}>
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      {type==='wallet' && <><rect x="8" y="16" width="48" height="34" rx="8"/><path d="M42 27h14v13H42a6 6 0 0 1 0-13Z"/></>}
      {type==='home' && <><path d="M8 30 32 10l24 20v24H8Z"/><path d="M25 54V36h14v18"/></>}
      {type==='cart' && <><path d="M8 13h8l5 27h28l7-20H20"/><circle cx="26" cy="50" r="4"/><circle cx="47" cy="50" r="4"/></>}
      {type==='chart' && <><path d="M10 53V12M10 53h46"/><path d="m16 43 12-12 9 7 17-20"/></>}
      {type==='shield' && <><path d="M32 7 52 15v15c0 14-8 22-20 28C20 52 12 44 12 30V15Z"/><path d="m22 31 7 7 14-16"/></>}
      {type==='doc' && <><path d="M17 7h22l9 9v41H17Z"/><path d="M39 7v12h12M24 30h17M24 39h17M24 48h12"/></>}
      {type==='bank' && <><path d="M7 23 32 9l25 14"/><path d="M10 53h44M15 27v22M27 27v22M39 27v22M51 27v22"/></>}
      {type==='phone' && <><rect x="18" y="6" width="28" height="52" rx="8"/><path d="M27 13h10M29 50h6"/></>}
    </svg>
  </div>
);
