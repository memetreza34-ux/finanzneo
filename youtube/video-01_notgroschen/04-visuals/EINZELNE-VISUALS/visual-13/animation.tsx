import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FinanceEyebrow, MotionStage, clamp01, frameAt, progressBetween} from '../../motion-kit';

export const MECHANIC_ID = 'matched-income-risk-divergence';
export const VISUAL_TECHNIQUE_ID = 'mirrored-risk-split';
export const COMPOSITION_FAMILY_ID = 'comparison';
export const ANIMATION_NARRATIVE = {START:'Gleiches Einkommen', MECHANISM:'Zwei Lebenssituationen bauen unterschiedliche Verpflichtungen auf', RESULT:'Reservebedarf fällt unterschiedlich aus'};

type WorldProps = {
  label:string;
  left:number;
  obligationCount:number;
  reserveTarget:number;
  color:string;
  frame:number;
  durationInFrames:number;
  fps:number;
};

const LifeWorld: React.FC<WorldProps> = ({label,left,obligationCount,reserveTarget,color,frame,durationInFrames,fps}) => {
  const reveal=clamp01(spring({frame:Math.max(0,frame-frameAt(durationInFrames,0.12)),fps,config:{damping:18,stiffness:105}}));
  const load=progressBetween(frame,durationInFrames,0.28,0.62);
  const reserve=progressBetween(frame,durationInFrames,0.58,0.88);
  const blocks=Array.from({length:obligationCount},(_,index)=>index);
  return <div style={{position:'absolute',left,top:260,width:650,height:620,opacity:reveal}}>
    <div style={{position:'absolute',left:0,top:0,fontSize:45,fontWeight:900}}>{label}</div>
    <div style={{position:'absolute',left:0,top:65,fontSize:27,color:COLORS.gray,fontWeight:700}}>{obligationCount <= 2 ? 'weniger laufende Verpflichtungen' : 'mehr laufende Verpflichtungen'}</div>

    <div style={{position:'absolute',left:35,top:170,width:340,height:300,perspective:900}}>
      <div style={{position:'absolute',left:0,bottom:0,width:340,height:34,borderRadius:17,background:'#252A2E'}}/>
      {blocks.map((index)=>{
        const blockP=interpolate(load,[Math.max(0,index/obligationCount-0.12),Math.min(1,(index+1)/obligationCount+0.12)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
        const height=58 + index*7;
        return <div key={index} style={{position:'absolute',left:22+index*58,bottom:34,width:52,height:height*blockP,borderRadius:'12px 12px 5px 5px',background:`linear-gradient(180deg, ${COLORS.red}, #9B3B2C)`,boxShadow:'0 12px 20px rgba(0,0,0,0.28)',transform:`skewY(${-2+index}deg)`}}/>;
      })}
      <div style={{position:'absolute',left:22,bottom:-52,fontSize:25,color:COLORS.red,fontWeight:800}}>Verpflichtungen</div>
    </div>

    <div style={{position:'absolute',right:28,top:165,width:150,height:310,borderRadius:46,border:`4px solid ${color}`,overflow:'hidden',background:'#0A0D0F'}}>
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:`${reserve*reserveTarget*100}%`,background:`linear-gradient(180deg, ${color}, rgba(45,216,129,0.28))`}}/>
      <div style={{position:'absolute',left:18,right:18,top:`${(1-reserveTarget)*100}%`,height:3,background:COLORS.white,opacity:0.75}}/>
    </div>
    <div style={{position:'absolute',right:0,top:500,width:210,textAlign:'center',fontSize:25,color,fontWeight:900}}>passende Reserve</div>

    <svg width="650" height="620" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
      <path d="M 180 120 C 275 145, 385 125, 500 180" fill="none" stroke={COLORS.gold} strokeWidth="8" strokeLinecap="round" opacity={reveal}/>
      <circle cx="180" cy="120" r="13" fill={COLORS.gold}/>
      <circle cx="500" cy="180" r="13" fill={COLORS.gold}/>
    </svg>
  </div>;
};

export const YouTubeVisual13Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps,durationInFrames}=useVideoConfig();
  const split=progressBetween(frame,durationInFrames,0.03,0.22);
  const compare=progressBetween(frame,durationInFrames,0.76,0.96);

  return <MotionStage>
    <FinanceEyebrow style={{position:'absolute',left:0,right:0,top:78,textAlign:'center'}}>Gleiches Einkommen bedeutet nicht gleiches Risiko</FinanceEyebrow>
    <div style={{position:'absolute',left:0,right:0,top:132,textAlign:'center',fontSize:60,fontWeight:900}}>Gleiches Einkommen</div>
    <div style={{position:'absolute',left:960,top:245,width:2,height:620,background:COLORS.line,opacity:split}}/>

    <div style={{position:'absolute',left:760,top:205,width:400,height:58,borderRadius:29,background:COLORS.gold,transform:`scaleX(${split})`,boxShadow:'0 0 30px rgba(216,177,90,0.16)'}}/>
    <div style={{position:'absolute',left:0,right:0,top:216,textAlign:'center',fontSize:25,fontWeight:900,color:COLORS.black,opacity:split}}>EINKOMMEN</div>

    <LifeWorld label="Person A" left={160} obligationCount={2} reserveTarget={0.45} color={COLORS.green} frame={frame} durationInFrames={durationInFrames} fps={fps}/>
    <LifeWorld label="Person B" left={1110} obligationCount={5} reserveTarget={0.82} color={COLORS.gold} frame={frame} durationInFrames={durationInFrames} fps={fps}/>

    <div style={{position:'absolute',left:0,right:0,bottom:70,textAlign:'center',fontSize:37,fontWeight:900,opacity:compare,transform:`translateY(${(1-compare)*24}px)`}}>
      Gleicher Startpunkt. <span style={{color:COLORS.red}}>Andere Belastung.</span> <span style={{color:COLORS.green}}>Andere Reserve.</span>
    </div>
  </MotionStage>;
};
