import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FinanceEyebrow, MotionStage, clamp01, frameAt, progressBetween} from '../../motion-kit';

export const MECHANIC_ID = 'stress-absorption-shield';
export const VISUAL_TECHNIQUE_ID = 'shock-buffer-sequence';
export const COMPOSITION_FAMILY_ID = 'simulation';
export const ANIMATION_NARRATIVE = {START:'Reserve schützt vor roten Notlösungen', MECHANISM:'Reparatur und Einkommenslücke treffen nacheinander ein', RESULT:'Beide werden abgefangen, Dispo/Kredit/Depot bleiben inaktiv'};

const EventGlyph: React.FC<{kind:'repair'|'income'}> = ({kind}) => kind === 'repair' ? (
  <svg width="82" height="82" viewBox="0 0 82 82"><path d="M50 11 Q61 11 68 18 L54 32 L43 28 L39 17 Q44 12 50 11 Z" fill={COLORS.red}/><path d="M42 29 L16 55 Q11 60 16 66 Q22 72 27 66 L53 40" fill="none" stroke={COLORS.white} strokeWidth="9" strokeLinecap="round"/><circle cx="21" cy="61" r="5" fill={COLORS.red}/></svg>
) : (
  <svg width="82" height="82" viewBox="0 0 82 82"><path d="M41 9 V57" stroke={COLORS.white} strokeWidth="9" strokeLinecap="round"/><path d="M22 40 L41 61 L60 40" fill="none" stroke={COLORS.red} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/><rect x="13" y="67" width="56" height="7" rx="3.5" fill={COLORS.gray}/></svg>
);

const ShockEvent: React.FC<{label:string;kind:'repair'|'income';x:number;y:number;opacity:number}> = ({label,kind,x,y,opacity}) => (
  <div style={{position:'absolute',left:x,top:y,width:330,height:118,display:'flex',alignItems:'center',gap:22,opacity,filter:'drop-shadow(0 16px 24px rgba(0,0,0,0.34))'}}>
    <div style={{width:106,height:106,borderRadius:53,border:`4px solid ${COLORS.red}`,background:'#101315',display:'flex',alignItems:'center',justifyContent:'center'}}><EventGlyph kind={kind}/></div>
    <div style={{fontSize:32,fontWeight:900,lineHeight:1.08}}>{label}</div>
  </div>
);

export const YouTubeVisual27Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps,durationInFrames}=useVideoConfig();
  const event1=clamp01(spring({frame:Math.max(0,frame-frameAt(durationInFrames,0.08)),fps,config:{damping:18,stiffness:112}}));
  const event2=clamp01(spring({frame:Math.max(0,frame-frameAt(durationInFrames,0.46)),fps,config:{damping:18,stiffness:112}}));
  const hit1=progressBetween(frame,durationInFrames,0.25,0.39);
  const hit2=progressBetween(frame,durationInFrames,0.63,0.77);
  const pulse1=1-Math.abs(hit1*2-1);
  const pulse2=1-Math.abs(hit2*2-1);
  const bend=Math.max(pulse1,pulse2);
  const result=progressBetween(frame,durationInFrames,0.75,0.97);
  const reserveLevel=interpolate(Math.max(hit1,hit2),[0,1],[1,0.73]);
  const x1=interpolate(event1,[0,1],[100,720]);
  const x2=interpolate(event2,[0,1],[100,720]);

  return <MotionStage>
    <FinanceEyebrow style={{position:'absolute',left:120,top:88}}>Was eine Reserve im Ernstfall wirklich macht</FinanceEyebrow>
    <div style={{position:'absolute',left:120,top:145,fontSize:56,fontWeight:900}}>Sie absorbiert den finanziellen Schlag.</div>

    <ShockEvent label="Reparatur" kind="repair" x={x1} y={300} opacity={event1}/>
    <ShockEvent label="Weniger Einkommen" kind="income" x={x2} y={650} opacity={event2}/>

    <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
      <path d={`M 970 235 C ${930+bend*95} 390, ${930+ bend*95} 690, 970 860`} fill="none" stroke="#173F2E" strokeWidth="112" strokeLinecap="round"/>
      <path d={`M 970 235 C ${930+ bend*95} 390, ${930+ bend*95} 690, 970 860`} fill="none" stroke={COLORS.green} strokeWidth="20" strokeLinecap="round"/>
      <circle cx="930" cy="355" r={38+80*pulse1} fill="none" stroke={COLORS.green} strokeWidth="7" opacity={pulse1}/>
      <circle cx="930" cy="705" r={38+80*pulse2} fill="none" stroke={COLORS.green} strokeWidth="7" opacity={pulse2}/>
    </svg>

    <div style={{position:'absolute',left:855,top:420,width:220,textAlign:'center',fontSize:31,fontWeight:900,transform:'rotate(-90deg)',color:COLORS.black}}>RESERVE</div>
    <div style={{position:'absolute',left:1035,top:330,width:28,height:410,borderRadius:14,background:'#23282C',overflow:'hidden'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:`${reserveLevel*100}%`,background:COLORS.green}}/></div>

    <div style={{position:'absolute',right:135,top:280,width:610}}>
      <div style={{fontSize:28,color:COLORS.gray,fontWeight:800,marginBottom:25}}>DADURCH BLEIBEN DIE NOTLÖSUNGEN AUS</div>
      {['Dispo','Kredit','Depotverkauf'].map((name,index)=>{
        const itemP=interpolate(result,[index*0.18,Math.min(1,index*0.18+0.55)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
        return <div key={name} style={{height:122,display:'flex',alignItems:'center',gap:26,opacity:0.25+itemP*0.5,borderBottom:`2px solid ${COLORS.line}`}}>
          <div style={{width:58,height:58,borderRadius:29,border:`4px solid ${COLORS.red}`,position:'relative'}}><div style={{position:'absolute',left:5,top:24,width:40,height:5,background:COLORS.red,transform:'rotate(-38deg)',borderRadius:3}}/></div>
          <div style={{fontSize:40,fontWeight:900,color:COLORS.gray}}>{name}</div>
          <div style={{marginLeft:'auto',fontSize:27,fontWeight:900,color:COLORS.green,opacity:itemP}}>nicht nötig</div>
        </div>;
      })}
    </div>

    <div style={{position:'absolute',left:1085,bottom:74,fontSize:35,fontWeight:900,color:COLORS.green,opacity:result}}>Der Puffer nimmt den Treffer – nicht dein restliches Finanzsystem.</div>
  </MotionStage>;
};
