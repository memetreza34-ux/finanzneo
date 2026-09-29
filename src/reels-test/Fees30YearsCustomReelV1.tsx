import React from 'react';
import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, C, CLAMP, FONT} from '../brand';

export const FEES_30_YEARS_CUSTOM_REEL_FRAMES = 1800;
const SCENE_FRAMES = 300;

const pct = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], CLAMP);

const Header: React.FC<{title: string}> = ({title}) => (
  <div style={{position:'absolute',left:72,right:72,top:145,textAlign:'center',fontFamily:FONT.title,fontSize:56,fontWeight:950,color:C.white,lineHeight:1.05}}>{title}</div>
);

const Caption: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position:'absolute',left:92,right:92,bottom:285,textAlign:'center',fontFamily:FONT.body,fontSize:43,fontWeight:850,color:C.white,lineHeight:1.18}}>{children}</div>
);

const GoldCoin: React.FC<{x:number;y:number;size?:number;opacity?:number;scale?:number;text?:string}> = ({x,y,size=120,opacity=1,scale=1,text}) => (
  <div style={{position:'absolute',left:x,top:y,width:size,height:size,borderRadius:'50%',border:`4px solid ${C.goldLt}`,background:`radial-gradient(circle at 34% 28%,${C.white},${C.gold} 30%,#6f4c00 76%)`,boxShadow:'0 28px 44px rgba(0,0,0,.44),0 0 24px rgba(255,202,74,.16)',opacity,scale,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:size*.22,fontWeight:950,color:'#211600'}}>{text}</div>
);

const SceneShell: React.FC<{title:string;caption:string;children:React.ReactNode}> = ({title,caption,children}) => (
  <AbsoluteFill style={{backgroundColor:'#000'}}>
    <Header title={title}/>
    <div style={{position:'absolute',left:0,right:0,top:320,height:1080,overflow:'hidden'}}>{children}</div>
    <Caption>{caption}</Caption>
  </AbsoluteFill>
);

// PHASE 1 CUSTOM SCENE 01
// Mechanic: an initially tiny 1% fee wedge repeatedly chips real value out of the same capital body.
const Scene01FeeWedge: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const hit=spring({frame:Math.max(0,frame-70),fps,config:{damping:17,stiffness:180,mass:.8}});
  const shardOrigins=[
    {x:640,y:280},{x:705,y:335},{x:730,y:425},{x:710,y:515},{x:650,y:585},{x:565,y:615},
  ];
  return <SceneShell title="1 % klingt fast nach nichts" caption="Ein Prozent Gebühren wirkt klein. Aber es greift nicht nur einmal an.">
    <div style={{position:'absolute',left:260,top:195,width:560,height:560,borderRadius:'50%',background:`radial-gradient(circle at 36% 28%,${ANIMATION_COLORS.positive},${C.accentDk} 68%,rgba(0,0,0,.72))`,border:'4px solid rgba(95,255,165,.5)',boxShadow:'0 45px 75px rgba(0,0,0,.5)',scale:.94+hit*.06}}/>
    {shardOrigins.map((origin,i)=>{
      const p=pct(frame,74+i*34,102+i*34);
      return <div key={i} style={{position:'absolute',left:origin.x+p*170,top:origin.y+p*120,width:72,height:72,borderRadius:18,background:ANIMATION_COLORS.warning,border:'2px solid rgba(255,255,255,.28)',opacity:p,rotate:`${12+i*8}deg`,boxShadow:'0 18px 32px rgba(0,0,0,.4)'}}/>;
    })}
    <div style={{position:'absolute',left:390,top:405,width:300,textAlign:'center',fontFamily:FONT.title,fontSize:74,fontWeight:950,color:C.white}}>1 %</div>
    <div style={{position:'absolute',left:350,top:760,width:380,textAlign:'center',fontFamily:FONT.body,fontSize:28,fontWeight:850,color:ANIMATION_COLORS.warning,opacity:pct(frame,110,150)}}>jedes Jahr erneut</div>
  </SceneShell>;
};

// PHASE 1 CUSTOM SCENE 02
// Mechanic: two identical capital towers launch together; the fee path gets a small yearly shave and visibly falls behind.
const Scene02TwinPaths: React.FC = () => {
  const frame=useCurrentFrame();
  const run=pct(frame,45,235);
  const leftH=230+run*470;
  const rightH=230+run*360;
  return <SceneShell title="Der Abstand wächst langsam" caption="Beide starten gleich. Nur ein Weg verliert jedes Jahr ein kleines Stück an Kosten.">
    <div style={{position:'absolute',left:170,top:130,width:300,height:760}}>
      <div style={{position:'absolute',left:55,bottom:80,width:190,height:leftH,borderRadius:'32px 32px 18px 18px',background:`linear-gradient(180deg,${ANIMATION_COLORS.positive},rgba(26,120,74,.32))`,border:'3px solid rgba(95,255,165,.52)',boxShadow:'0 30px 55px rgba(0,0,0,.45)'}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:18,textAlign:'center',fontFamily:FONT.body,fontSize:30,fontWeight:900,color:C.white}}>ohne 1 %-Kosten</div>
    </div>
    <div style={{position:'absolute',right:170,top:130,width:300,height:760}}>
      <div style={{position:'absolute',left:55,bottom:80,width:190,height:rightH,borderRadius:'32px 32px 18px 18px',background:`linear-gradient(180deg,${C.gold},rgba(129,92,13,.3))`,border:'3px solid rgba(255,205,75,.52)',boxShadow:'0 30px 55px rgba(0,0,0,.45)'}}/>
      {Array.from({length:5},(_,i)=>{const p=pct(frame,95+i*29,112+i*29);return <div key={i} style={{position:'absolute',left:245+p*72,bottom:230+i*76,width:48,height:18,borderRadius:9,background:ANIMATION_COLORS.warning,opacity:p}}/>})}
      <div style={{position:'absolute',left:0,right:0,bottom:18,textAlign:'center',fontFamily:FONT.body,fontSize:30,fontWeight:900,color:C.white}}>mit 1 %-Kosten</div>
    </div>
  </SceneShell>;
};

// PHASE 1 CUSTOM SCENE 03
// Mechanic: returns loop back into the capital engine, while a fee siphon diverts part of each new return before it can compound.
const Scene03CompoundingSiphon: React.FC = () => {
  const frame=useCurrentFrame();
  const cycle=pct(frame,55,220);
  return <SceneShell title="Gebühren nehmen auch künftige Rendite" caption="Das Problem ist nicht nur die Gebühr selbst: Das fehlende Geld kann später keine Rendite mehr erzeugen.">
    <div style={{position:'absolute',left:340,top:245,width:400,height:300,borderRadius:90,border:'3px solid rgba(95,255,165,.48)',background:'radial-gradient(ellipse at 50% 30%,rgba(95,255,165,.28),rgba(0,0,0,.72) 72%)',boxShadow:'0 35px 65px rgba(0,0,0,.5)'}}>
      <div style={{position:'absolute',left:0,right:0,top:102,textAlign:'center',fontFamily:FONT.title,fontSize:44,fontWeight:950,color:C.white}}>DEIN KAPITAL</div>
    </div>
    {Array.from({length:6},(_,i)=>{const p=pct(frame,62+i*27,88+i*27);const x=470+(i%3)*72;const y=620-(i%2)*55;return <GoldCoin key={i} x={x} y={y-p*245} size={62} opacity={p}/>})}
    <div style={{position:'absolute',left:770,top:315,width:210,height:150,borderRadius:30,border:'3px solid rgba(255,80,80,.5)',background:'linear-gradient(145deg,rgba(255,70,70,.26),rgba(0,0,0,.55))',opacity:pct(frame,90,130)}}>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:34,fontWeight:950,color:ANIMATION_COLORS.warning}}>GEBÜHR</div>
    </div>
    <div style={{position:'absolute',left:735,top:405,width:46,height:14,borderRadius:8,background:ANIMATION_COLORS.warning,translate:`${cycle*85}px ${cycle*20}px`,opacity:pct(frame,105,145)}}/>
  </SceneShell>;
};

// PHASE 1 CUSTOM SCENE 04
// Mechanic: the cumulative gap is represented as a widening physical chasm between two trajectories.
const Scene04GapWidens: React.FC = () => {
  const frame=useCurrentFrame();
  const p=pct(frame,35,235);
  const gap=70+p*320;
  return <SceneShell title="Der kleine Unterschied wird groß" caption="Je länger du investierst, desto stärker arbeitet der Zinseszins auch gegen unnötige Kosten.">
    <svg style={{position:'absolute',left:80,top:90,width:920,height:780,overflow:'visible'}} viewBox="0 0 920 780">
      <path d="M 90 650 C 260 620, 440 500, 820 110" fill="none" stroke={ANIMATION_COLORS.positive} strokeWidth="22" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/>
      <path d={`M 90 650 C 260 635, 440 ${545+gap*.08}, 820 ${250+gap*.26}`} fill="none" stroke={C.gold} strokeWidth="22" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/>
      <line x1="805" y1="135" x2="805" y2={250+gap*.26} stroke={ANIMATION_COLORS.warning} strokeWidth="6" strokeDasharray="14 12" opacity={pct(frame,185,225)}/>
    </svg>
    <div style={{position:'absolute',right:120,top:560,fontFamily:FONT.title,fontSize:50,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:pct(frame,190,235)}}>Abstand wächst</div>
  </SceneShell>;
};

// PHASE 1 CUSTOM SCENE 05
// Mechanic: final vaults physically settle at their true 30-year heights; values are revealed only after the build.
const Scene05ThirtyYearResult: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const build=spring({frame:Math.max(0,frame-35),fps,config:{damping:24,stiffness:95,mass:1}});
  const reveal=pct(frame,205,240);
  return <SceneShell title="Nach 30 Jahren: rund 77.000 € Unterschied" caption="Beispiel: 10.000 € Start, 300 € monatlich, 7 % statt 6 % Rendite nach Kosten.">
    <div style={{position:'absolute',left:125,top:150,width:360,height:700}}>
      <div style={{position:'absolute',left:65,bottom:85,width:230,height:520*build,borderRadius:'38px 38px 18px 18px',background:`linear-gradient(180deg,${ANIMATION_COLORS.positive},rgba(18,90,58,.3))`,border:'3px solid rgba(95,255,165,.5)'}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:8,textAlign:'center',fontFamily:FONT.title,fontSize:42,fontWeight:950,color:ANIMATION_COLORS.positive,opacity:reveal}}>426.958 €</div>
    </div>
    <div style={{position:'absolute',right:125,top:150,width:360,height:700}}>
      <div style={{position:'absolute',left:65,bottom:85,width:230,height:425*build,borderRadius:'38px 38px 18px 18px',background:`linear-gradient(180deg,${C.gold},rgba(105,74,12,.3))`,border:'3px solid rgba(255,205,75,.5)'}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:8,textAlign:'center',fontFamily:FONT.title,fontSize:42,fontWeight:950,color:C.gold,opacity:reveal}}>349.789 €</div>
    </div>
  </SceneShell>;
};

// PHASE 1 CUSTOM SCENE 06
// Mechanic: all previously removed fee fragments aggregate into one final lost-value pile; payoff appears after aggregation.
const Scene06Payoff: React.FC = () => {
  const frame=useCurrentFrame();
  const gather=pct(frame,35,190);
  const payoff=pct(frame,195,235);
  return <SceneShell title="1 % ist klein. 30 Jahre sind es nicht." caption="Darum lohnt es sich, laufende Kosten zu prüfen – bevor sie jahrelang mitwachsen.">
    {Array.from({length:14},(_,i)=>{
      const sx=80+(i%7)*145; const sy=90+Math.floor(i/7)*150;
      const tx=390+(i%5)*62; const ty=520-Math.floor(i/5)*48;
      return <div key={i} style={{position:'absolute',left:interpolate(gather,[0,1],[sx,tx],CLAMP),top:interpolate(gather,[0,1],[sy,ty],CLAMP),width:56,height:34,borderRadius:10,background:ANIMATION_COLORS.warning,border:'2px solid rgba(255,255,255,.2)',rotate:`${(i%4)*9-12}deg`,boxShadow:'0 16px 26px rgba(0,0,0,.4)'}}/>;
    })}
    <div style={{position:'absolute',left:210,right:210,top:690,textAlign:'center',fontFamily:FONT.title,fontSize:80,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:payoff,scale:.82+payoff*.18}}>≈ 77.000 €</div>
    <div style={{position:'absolute',left:210,right:210,top:795,textAlign:'center',fontFamily:FONT.body,fontSize:32,fontWeight:900,color:C.whiteSoft,opacity:payoff}}>möglicher Unterschied im Beispiel</div>
  </SceneShell>;
};

export const Fees30YearsCustomReelV1: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:'#000'}}>
    <Sequence from={0} durationInFrames={SCENE_FRAMES}><Scene01FeeWedge/></Sequence>
    <Sequence from={SCENE_FRAMES} durationInFrames={SCENE_FRAMES}><Scene02TwinPaths/></Sequence>
    <Sequence from={SCENE_FRAMES*2} durationInFrames={SCENE_FRAMES}><Scene03CompoundingSiphon/></Sequence>
    <Sequence from={SCENE_FRAMES*3} durationInFrames={SCENE_FRAMES}><Scene04GapWidens/></Sequence>
    <Sequence from={SCENE_FRAMES*4} durationInFrames={SCENE_FRAMES}><Scene05ThirtyYearResult/></Sequence>
    <Sequence from={SCENE_FRAMES*5} durationInFrames={SCENE_FRAMES}><Scene06Payoff/></Sequence>
  </AbsoluteFill>
);
