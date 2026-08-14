import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C,FONT,a} from '../../design-system';
import type {AccentTone,SceneCopy} from './config';

export const ETF_LAYOUT={width:1080,height:1920,headerTop:56,headerBottom:250,visualTop:300,visualBottom:1320,captionTop:1440,captionBottom:1665,captionLeft:72,captionRight:180} as const;
const tone=(v:AccentTone|undefined)=>v==='red'?C.negativeLt:v==='gold'?C.goldLt:C.accentLt;

export const SeamlessBackground:React.FC=()=> <AbsoluteFill style={{background:'radial-gradient(90% 58% at 50% 40%,rgba(22,91,55,.33) 0%,rgba(8,31,19,.54) 42%,rgba(3,10,6,.99) 100%)'}}/>;

export const Header:React.FC<{copy:SceneCopy}>=({copy})=><div style={{position:'absolute',top:ETF_LAYOUT.headerTop,left:62,right:62,height:ETF_LAYOUT.headerBottom-ETF_LAYOUT.headerTop,zIndex:30,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',overflow:'hidden'}}><div style={{fontFamily:FONT.title,fontWeight:900,fontSize:56,lineHeight:1.02,color:C.white,textShadow:'0 4px 18px rgba(0,0,0,.72)'}}>{copy.title}</div><div style={{marginTop:12,maxWidth:920,fontFamily:FONT.body,fontWeight:850,fontSize:31,lineHeight:1.08,color:tone(copy.tone),textShadow:'0 3px 14px rgba(0,0,0,.72)'}}>{copy.subtitle}</div></div>;

export const VisualViewport:React.FC<React.PropsWithChildren>=({children})=><div style={{position:'absolute',top:ETF_LAYOUT.visualTop,left:0,width:ETF_LAYOUT.width,height:ETF_LAYOUT.visualBottom-ETF_LAYOUT.visualTop,overflow:'hidden',zIndex:10}}>{children}</div>;

export const SafeFlowImage:React.FC<{src:string}>=({src})=><VisualViewport><img src={src} style={{position:'absolute',left:0,top:-ETF_LAYOUT.visualTop,width:ETF_LAYOUT.width,height:ETF_LAYOUT.height,objectFit:'fill'}}/><div style={{position:'absolute',left:0,right:0,top:0,height:28,background:'linear-gradient(180deg,rgba(3,10,6,.7),transparent)'}}/><div style={{position:'absolute',left:0,right:0,bottom:0,height:28,background:'linear-gradient(0deg,rgba(3,10,6,.7),transparent)'}}/></VisualViewport>;

export const SceneShell:React.FC<React.PropsWithChildren<{copy:SceneCopy}>>=({copy,children})=><AbsoluteFill style={{background:C.bg,overflow:'hidden'}}><SeamlessBackground/><Header copy={copy}/><VisualViewport>{children}</VisualViewport></AbsoluteFill>;

export const CaptionViewport:React.FC<React.PropsWithChildren>=({children})=><div style={{position:'absolute',top:ETF_LAYOUT.captionTop,left:ETF_LAYOUT.captionLeft,right:ETF_LAYOUT.captionRight,height:ETF_LAYOUT.captionBottom-ETF_LAYOUT.captionTop,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>{children}</div>;

export const LabelPill:React.FC<{children:React.ReactNode;kind?:'green'|'gold'|'red'}>=({children,kind='green'})=>{const color=kind==='red'?C.negativeLt:kind==='gold'?C.goldLt:C.accentLt;return <div style={{padding:'12px 18px',borderRadius:18,border:`2px solid ${a(color,.55)}`,background:a(color,.12),fontFamily:FONT.body,fontWeight:900,fontSize:28,color}}>{children}</div>};

export const GoldCoin:React.FC<{size?:number;opacity?:number}>=({size=34,opacity=1})=><div style={{width:size,height:size,borderRadius:'50%',opacity,background:`radial-gradient(circle at 34% 30%,${C.goldLt},${C.gold} 55%,#9A6A00 100%)`,boxShadow:`0 0 ${Math.round(size*.5)}px ${a(C.gold,.22)}`,border:`2px solid ${a(C.goldLt,.7)}`}}/>;
