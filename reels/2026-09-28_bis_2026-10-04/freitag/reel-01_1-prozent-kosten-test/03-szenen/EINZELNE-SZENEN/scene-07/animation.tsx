import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: zwei-depots-zinseszins-abstand
 * FOCAL_PATH: zwei gleich startende Depots -> identische Einzahlungen -> zunehmend unterschiedliche Goldstapel
 * PRIMARY_ACTION: Beide Depots erhalten dieselben Einzahlungen, aber der 7-%-Stapel wächst pro Zeitstufe sichtbar stärker als der 6-%-Stapel.
 * CAMERA_ROLE: push — sehr leichter visueller Push auf den wachsenden Abstand, ohne die Bühnenposition zu verändern.
 * PAYOFF: Zwei klar beschriftete Depots enden mit deutlich sichtbarem Abstand trotz gleicher Einzahlungen.
 *
 * ANIMATION_NARRATIVE
 * START: Zwei identische Depots stehen mit gleichem Startwert nebeneinander.
 * MECHANISM: Gleiche Goldmünzen fallen in beide Depots; zusätzliche Wachstumsstufen entstehen links schneller und der Abstand öffnet sich.
 * RESULT: Das 7-%-Depot endet sichtbar höher als das 6-%-Depot, während die identische Einzahlung erkennbar bleibt.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zwei große transparente Depotbehälter mit echten Goldmünzstapeln.
 * SUPPORT: Monatsmünzen und ein kleiner 30-Jahre-Zeitmarker erklären gleiche Einzahlung und Zeit.
 * MATERIAL: Glasartig stilisierte Behälter, Emerald links, Ivory rechts, Gold nur für Geld/Wert.
 * DEPTH: Beide Behälter liegen auf einer gemeinsamen Basis; ein räumlicher Gap-Marker entsteht zwischen ihren Endhöhen.
 */
export const RESULT_HOLD_FRAMES = 20;
const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;

export const Scene07Animation: React.FC<{durationFrames?: number}> = ({durationFrames=168}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config:{damping:17, stiffness:110}});
  const t = interpolate(frame,[22,132],[0,1],clamp);
  const leftH = 150 + t*300;
  const rightH = 150 + t*232;
  const gap = Math.max(0,leftH-rightH);
  const coinFrames = [30,52,74,96,118];

  const Jar = ({left,label,height,accent}:{left:number;label:string;height:number;accent:string}) => <div data-finanzneo-object="depot-vessel" style={{position:'absolute',left,top:150,width:300,height:500,borderRadius:42,border:'3px solid rgba(255,255,255,.26)',background:'linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.035))',boxShadow:'inset 0 0 55px rgba(255,255,255,.04), 0 26px 48px rgba(0,0,0,.34)',overflow:'hidden',transform:'scale('+ (0.92+enter*0.08) +')'}}>
    <div style={{position:'absolute',top:24,left:0,right:0,textAlign:'center',fontSize:34,fontWeight:900,color:accent}}>{label}</div>
    <div style={{position:'absolute',left:42,bottom:42,width:216,height,borderRadius:28,background:'linear-gradient(180deg,#FFE49A,#D4A11C)',boxShadow:'0 -8px 28px rgba(255,200,61,.22)'}} />
    {Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:58,bottom:52+i*Math.max(16,height/14),width:184,height:12,borderRadius:7,background:i%2===0?'#FFC83D':'#FFE49A',opacity:i*18 < height ? 1 : 0}} />)}
  </div>;

  return <div style={{width:'100%',height:'100%',position:'relative',fontFamily:'Inter, Arial, sans-serif',color:ANIMATION_COLORS.neutralText,overflow:'hidden'}}>
    <div style={{position:'absolute',left:70,top:50,width:940,height:780,transform:'perspective(1200px) rotateX(2deg) scale('+(1+interpolate(t,[0,1],[0,.025]))+')'}}>
      <Jar left={90} label='7 %' height={leftH} accent={ANIMATION_COLORS.focus} />
      <Jar left={550} label='6 %' height={rightH} accent='#F4FAF6' />

      {coinFrames.map((start,i)=>{
        const p=interpolate(frame,[start,start+16],[0,1],clamp);
        const opacity=interpolate(frame,[start-3,start,start+13,start+20],[0,1,1,0],clamp);
        return <React.Fragment key={start}>
          {[250,710].map((x,j)=><div key={x} style={{position:'absolute',left:x-24,top:80+p*150,width:50,height:50,borderRadius:'50%',background:'#E4B43A',boxShadow:'0 8px 16px rgba(0,0,0,.28)',opacity,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#6A4A00'}}>€</div>)}
        </React.Fragment>;
      })}

      <div style={{position:'absolute',left:438,top:266,right:438,height:Math.max(8,gap),borderLeft:'3px solid '+ANIMATION_COLORS.warning,opacity:interpolate(frame,[85,118],[0,1],clamp)}} />
      <div style={{position:'absolute',left:390,top:245-gap/2,width:130,textAlign:'center',fontSize:20,fontWeight:900,color:ANIMATION_COLORS.warning,opacity:interpolate(frame,[96,126],[0,1],clamp)}}>Abstand wächst</div>
      <div style={{position:'absolute',left:374,top:688,width:210,height:58,borderRadius:18,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800}}>gleiche Einzahlung</div>
    </div>
  </div>;
};
