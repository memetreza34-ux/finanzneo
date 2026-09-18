import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FinanceEyebrow, Icon, MotionStage, clamp01, frameAt, progressBetween} from '../../motion-kit';

export const MECHANIC_ID = 'security-gate-to-investment';
export const VISUAL_TECHNIQUE_ID = 'gate-then-growth-path';
export const COMPOSITION_FAMILY_ID = 'camera-journey';
export const ANIMATION_NARRATIVE = {START:'Sicherheitszone ist noch offen', MECHANISM:'Reserve füllt sich und verriegelt', RESULT:'Danach öffnet sich getrennt der langfristige Investmentpfad'};

export const YouTubeVisual28Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps,durationInFrames}=useVideoConfig();
  const fill=progressBetween(frame,durationInFrames,0.04,0.42);
  const secured=progressBetween(frame,durationInFrames,0.38,0.53);
  const gateOpen=clamp01(spring({frame:Math.max(0,frame-frameAt(durationInFrames,0.50)),fps,config:{damping:18,stiffness:105,mass:0.95}}));
  const path=progressBetween(frame,durationInFrames,0.55,0.93);
  const camera=progressBetween(frame,durationInFrames,0.51,0.96);
  const cameraX=interpolate(camera,[0,1],[0,-760]);
  const worldScale=interpolate(camera,[0,1],[1,1.045]);

  // Diese Szene stammt aus der Zeit vor dem Layout V1 und war fuer den vollen
  // 1080er Frame komponiert. YouTubeAnimationFrame zeigt nur y 180–900; ohne
  // diese Einpassung werden Kopf- und Fusszeile der Szene abgeschnitten.
  return <MotionStage>
    <div style={{position: 'absolute', inset: 0, transform: 'translateY(96px) scale(0.78)', transformOrigin: '50% 50%'}}>
    <div style={{position:'absolute',left:0,top:0,width:2800,height:1080,transform:`translateX(${cameraX}px) scale(${worldScale})`,transformOrigin:'center left'}}>  {/* zone-ok: relativ zum Container in der Zone */}
      {/* Keine szeneneigene Ueberschrift: die Zwischenueberschrift kommt aus dem
          Layout ueber YouTubeHeader. Zwei Ueberschriften uebereinander waren der
          Fehler im ersten fertigen Video. */}

      <div style={{position:'absolute',left:150,top:300,width:650,height:500,borderRadius:64,border:`6px solid ${COLORS.green}`,overflow:'hidden',background:'#0A0D0F',boxShadow:'0 30px 70px rgba(0,0,0,0.42)'}}>
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:`${fill*100}%`,background:'linear-gradient(180deg, rgba(45,216,129,0.32), rgba(45,216,129,0.68))'}}/>
        {[0.25,0.5,0.75].map(mark=><div key={mark} style={{position:'absolute',left:25,right:25,bottom:`${mark*100}%`,height:2,background:'rgba(255,255,255,0.14)'}}/>)}
        <div style={{position:'absolute',left:0,right:0,top:150,textAlign:'center',fontSize:31,color:'#DDF8EA',fontWeight:800}}>NOTGROSCHEN</div>  {/* zone-ok: relativ zum Container in der Zone */}
        <div style={{position:'absolute',left:0,right:0,top:205,textAlign:'center',fontSize:76,fontWeight:900}}>Sicherheit</div>
        <div style={{position:'absolute',left:0,right:0,bottom:48,display:'flex',alignItems:'center',justifyContent:'center',gap:12,fontSize:28,fontWeight:900,color:COLORS.green,opacity:secured}}><Icon name="check" size={32} color={COLORS.green} stroke={2.2} />Ziel erreicht</div>
      </div>

      <div style={{position:'absolute',left:900,top:250,width:170,height:610}}>
        {[0,1,2,3].map(index=><div key={index} style={{position:'absolute',left:20+index*35,top:0,width:20,height:430,borderRadius:10,background:'#2B3135',transform:`translateY(${-470*gateOpen}px)`,boxShadow:'0 8px 20px rgba(0,0,0,0.3)'}}/>)} // zone-ok: relativ zum Container in der Zone
        <div style={{position:'absolute',left:0,top:420,width:170,height:34,borderRadius:17,background:COLORS.green}}/>
        <div style={{position:'absolute',left:38,top:474,width:94,height:72,borderRadius:22,border:`5px solid ${COLORS.green}`,opacity:secured}}>
          <div style={{position:'absolute',left:27,top:-49,width:40,height:48,border:`5px solid ${COLORS.green}`,borderBottom:'none',borderRadius:'24px 24px 0 0'}}/>  {/* zone-ok: relativ zum Container in der Zone */}
          <div style={{position:'absolute',left:38,top:25,width:18,height:18,borderRadius:9,background:COLORS.green}}/>  {/* zone-ok: relativ zum Container in der Zone */}
        </div>
        <div style={{position:'absolute',left:-30,top:570,width:230,textAlign:'center',fontSize:25,fontWeight:900,color:COLORS.green,opacity:secured}}>Sicherheitsziel zuerst</div>
      </div>

      <svg width="2800" height="1080" viewBox="0 0 2800 1080" style={{position:'absolute',inset:0}}>
        <path d="M 1080 575 C 1340 575, 1430 510, 1620 505 S 1990 470, 2290 335 S 2500 270, 2670 235" fill="none" stroke="#352E1C" strokeWidth="38" strokeLinecap="round" opacity={path}/>
        <path d="M 1080 575 C 1340 575, 1430 510, 1620 505 S 1990 470, 2290 335 S 2500 270, 2670 235" fill="none" stroke={COLORS.gold} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${1800*path} 2100`}/>
      </svg>

      <div style={{position:'absolute',left:1380,top:220,width:760,opacity:path,transform:`translateY(${(1-path)*45}px)`}}>
        <FinanceEyebrow>Danach öffnet sich ein anderer Zeithorizont</FinanceEyebrow>
        <div style={{fontSize:64,fontWeight:900,color:COLORS.gold,marginTop:18}}>Langfristig investieren</div>
        <div style={{fontSize:31,lineHeight:1.42,color:COLORS.gray,marginTop:25,width:650}}>Mit Geld, das du für kurzfristige Notfälle nicht mehr bereithalten musst.</div>
      </div>

      {[{x:1570,y:565,label:'Zeit'},{x:2050,y:425,label:'Geduld'},{x:2490,y:255,label:'Vermögensaufbau'}].map((item,index)=>{
        const itemP=interpolate(path,[index*0.18,Math.min(1,index*0.18+0.55)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
        return <div key={item.label} style={{position:'absolute',left:item.x,top:item.y,width:220,opacity:itemP,transform:`translateY(${(1-itemP)*35}px)`}}>
          <div style={{width:58,height:58,borderRadius:29,background:COLORS.gold,boxShadow:'0 0 28px rgba(216,177,90,0.25)'}}/>
          <div style={{fontSize:29,fontWeight:900,marginTop:14,color:COLORS.gold}}>{item.label}</div>
        </div>;
      })}
    </div>
    </div>
  </MotionStage>;
};
