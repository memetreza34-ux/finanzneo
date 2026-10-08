import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../brand';
import {P, SCENE_FRAMES, clamp} from './showcase-primitives';
import {
  BarChartScene,
  BeforeAfterScene,
  CompareScene,
  DonutScene,
  LineChartScene,
  StatsScene,
  TableScene,
  WaterfallScene,
} from './showcase-scenes-a';
import {
  DarkBlocksScene,
  FunnelScene,
  GaugeScene,
  IconFlowScene,
  InvoiceScene,
  MapJourneyScene,
  NetworkScene,
  TimelineScene,
} from './showcase-scenes-b';

export const OPEN_MOTION_SHOWCASE_FRAMES = 90 + SCENE_FRAMES * 16 + 90;

const Intro:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=spring({frame,fps,config:{damping:18,stiffness:140,mass:0.85}});
  const sub=interpolate(frame,[22,54],[0,1],clamp);
  const words=['VERGLEICHE','TABELLEN','STATS','DIAGRAMME','ICONS','3D','DOKUMENTE','NETZWERKE'];
  return <AbsoluteFill style={{background:'linear-gradient(135deg,#080B10,#111A25 55%,#0B1811)',fontFamily:FONT.body,overflow:'hidden'}}>
    <div style={{position:'absolute',left:110,top:190,fontFamily:FONT.title,fontSize:112,lineHeight:.96,fontWeight:900,color:P.white,transform:`translateY(${(1-p)*50}px)`,opacity:p}}>
      REMOTION<br/><span style={{color:P.neon}}>OPEN MOTION</span> SAMPLER
    </div>
    <div style={{position:'absolute',left:118,top:455,fontSize:31,fontWeight:750,color:'#A9B6AF',opacity:sub}}>
      Viele verschiedene Animationstypen in einem einzigen 16:9-Video.
    </div>
    <div style={{position:'absolute',left:115,right:115,top:620,display:'flex',flexWrap:'wrap',gap:18,opacity:sub}}>
      {words.map((w,i)=><div key={w} style={{
        padding:'16px 24px',borderRadius:999,
        border:'1px solid '+(i%3===0?'rgba(96,229,154,.45)':'rgba(255,255,255,.16)'),
        background:i%3===0?'rgba(96,229,154,.08)':'rgba(255,255,255,.04)',
        color:i%3===0?P.neon:'#DDE4E0',fontWeight:850,fontSize:23
      }}>{w}</div>)}
    </div>
  </AbsoluteFill>;
};

const Outro:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=spring({frame,fps,config:{damping:18,stiffness:145,mass:.78}});
  const chips=['hell','dunkel','2D','3D','Charts','Icons','Vergleich','Custom'];
  return <AbsoluteFill style={{background:P.cream,fontFamily:FONT.body}}>
    <div style={{position:'absolute',left:180,right:180,top:190,textAlign:'center',fontFamily:FONT.title,fontSize:100,lineHeight:.98,fontWeight:900,color:P.ink,opacity:enter,transform:`scale(${.92+.08*enter})`}}>
      KEINE FESTE WELT.<br/><span style={{color:P.greenDark}}>NUR DIE BESTE IDEE.</span>
    </div>
    <div style={{position:'absolute',left:260,right:260,top:520,textAlign:'center',fontSize:31,lineHeight:1.5,fontWeight:750,color:P.muted,opacity:enter}}>
      Jede Szene darf genau die Animation bekommen, die den Inhalt am besten erklärt.
    </div>
    <div style={{position:'absolute',left:330,right:330,top:720,display:'flex',justifyContent:'center',flexWrap:'wrap',gap:16,opacity:enter}}>
      {chips.map((x,i)=><div key={x} style={{padding:'14px 24px',borderRadius:18,background:i%2===0?P.ink:P.white,color:i%2===0?P.white:P.ink,border:'2px solid '+P.line,fontSize:22,fontWeight:850}}>{x}</div>)}
    </div>
  </AbsoluteFill>;
};

const scenes=[
  CompareScene,
  BeforeAfterScene,
  StatsScene,
  TableScene,
  BarChartScene,
  LineChartScene,
  DonutScene,
  WaterfallScene,
  TimelineScene,
  IconFlowScene,
  NetworkScene,
  FunnelScene,
  InvoiceScene,
  GaugeScene,
  DarkBlocksScene,
  MapJourneyScene,
] as const;

export const OpenMotionShowcase:React.FC=()=>(
  <AbsoluteFill style={{background:'#000'}}>
    <Sequence from={0} durationInFrames={90} premountFor={30}>
      <Intro/>
    </Sequence>
    {scenes.map((Scene,i)=>(
      <Sequence key={i} from={90+i*SCENE_FRAMES} durationInFrames={SCENE_FRAMES} premountFor={30}>
        <Scene/>
      </Sequence>
    ))}
    <Sequence from={90+scenes.length*SCENE_FRAMES} durationInFrames={90} premountFor={30}>
      <Outro/>
    </Sequence>
  </AbsoluteFill>
);
