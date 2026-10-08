import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../brand';

export const SW=1920;
export const SH=1080;
export const SCENE_FRAMES=96;

export const P={
  cream:'#F4F0E7', paper:'#FBFAF6', ink:'#202824', muted:'#69736D', line:'#D8DCD7',
  green:'#4F8A67', green2:'#75A98A', blue:'#5C82A3', orange:'#D77858', gold:'#C79C45',
  red:'#C95E58', purple:'#8270A6', cyan:'#5B9DA2', white:'#FFFFFF',
  dark:'#0D1117', dark2:'#151B23', dark3:'#1E2632', neon:'#60E59A', darkText:'#DDE7E1',
} as const;

export const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
export const prog=(f:number,a:number,b:number,e=Easing.out(Easing.cubic))=>interpolate(f,[a,b],[0,1],{...clamp,easing:e});
export const pop=(f:number,a:number,fps:number)=>spring({frame:Math.max(0,f-a),fps,config:{damping:18,stiffness:165,mass:0.72}});

export const SceneLabel:React.FC<{n:string;title:string;dark?:boolean}> = ({n,title,dark=false}) => (
  <div style={{
    position:'absolute',left:56,top:42,display:'flex',alignItems:'center',gap:14,
    fontFamily:FONT.body,fontWeight:800,fontSize:20,letterSpacing:0.4,
    color:dark?P.darkText:P.muted,zIndex:10
  }}>
    <div style={{
      width:42,height:42,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',
      background:dark?P.neon:P.ink,color:dark?P.dark:P.white,fontFamily:FONT.title,fontSize:24,fontWeight:900,
    }}>{n}</div>
    {title}
  </div>
);

export const BigTitle:React.FC<{children:React.ReactNode;dark?:boolean;center?:boolean}> = ({children,dark=false,center=false}) => (
  <div style={{
    position:'absolute',left:center?260:110,right:center?260:110,top:120,
    textAlign:center?'center':'left',fontFamily:FONT.title,fontWeight:900,fontSize:68,
    lineHeight:1.02,color:dark?P.white:P.ink
  }}>{children}</div>
);

export const Value:React.FC<{children:React.ReactNode;color?:string;size?:number}> = ({children,color=P.ink,size=62}) => (
  <div style={{fontFamily:FONT.title,fontWeight:900,fontSize:size,color,lineHeight:1}}>{children}</div>
);

export const Card:React.FC<{children:React.ReactNode;x:number;y:number;w:number;h:number;dark?:boolean;accent?:string;opacity?:number;scale?:number}> =
({children,x,y,w,h,dark=false,accent,opacity=1,scale=1}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:w,height:h,borderRadius:30,
    background:dark?P.dark2:P.white,border:'2px solid '+(accent??(dark?'rgba(255,255,255,.10)':P.line)),
    boxShadow:dark?'0 18px 45px rgba(0,0,0,.26)':'0 18px 45px rgba(32,40,36,.08)',
    opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%',boxSizing:'border-box'
  }}>{children}</div>
);

export const FadeEdges:React.FC<{children:React.ReactNode}> = ({children}) => {
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[0,6,SCENE_FRAMES-7,SCENE_FRAMES-1],[0,1,1,0],clamp);
  return <div style={{position:'absolute',inset:0,opacity}}>{children}</div>;
};

export const useScene=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  return {frame,fps};
};

export const MiniIcon:React.FC<{type:'wallet'|'home'|'cart'|'bank'|'phone'|'chart'|'shield'|'doc';color?:string;size?:number}> = ({type,color=P.green,size=58}) => {
  const common={fill:'none',stroke:color,strokeWidth:5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  return <svg width={size} height={size} viewBox="0 0 64 64">
    {type==='wallet' && <><rect x="8" y="16" width="48" height="34" rx="8" {...common}/><path d="M42 27h14v13H42a6 6 0 0 1 0-13Z" {...common}/></>}
    {type==='home' && <><path d="M8 30 32 10l24 20v24H8Z" {...common}/><path d="M25 54V36h14v18" {...common}/></>}
    {type==='cart' && <><path d="M8 13h8l5 27h28l7-20H20" {...common}/><circle cx="26" cy="50" r="4" {...common}/><circle cx="47" cy="50" r="4" {...common}/></>}
    {type==='bank' && <><path d="M7 23 32 9l25 14" {...common}/><path d="M10 53h44M15 27v22M27 27v22M39 27v22M51 27v22" {...common}/></>}
    {type==='phone' && <><rect x="18" y="6" width="28" height="52" rx="8" {...common}/><path d="M27 13h10M29 50h6" {...common}/></>}
    {type==='chart' && <><path d="M10 53V12M10 53h46" {...common}/><path d="m16 43 12-12 9 7 17-20" {...common}/></>}
    {type==='shield' && <><path d="M32 7 52 15v15c0 14-8 22-20 28C20 52 12 44 12 30V15Z" {...common}/><path d="m22 31 7 7 14-16" {...common}/></>}
    {type==='doc' && <><path d="M17 7h22l9 9v41H17Z" {...common}/><path d="M39 7v12h12M24 30h17M24 39h17M24 48h12" {...common}/></>}
  </svg>;
};
