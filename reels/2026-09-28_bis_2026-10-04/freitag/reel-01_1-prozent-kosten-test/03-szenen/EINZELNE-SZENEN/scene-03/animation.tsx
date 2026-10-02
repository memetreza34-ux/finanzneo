import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: startkapital-plus-monatliche-sparrate
 * FOCAL_PATH: 10.000-Euro-Startstapel -> monatliche 300-Euro-Umschläge -> wachsendes Investmentkonto
 * PRIMARY_ACTION: Vier Monatsumschläge gleiten nacheinander in dasselbe Investmentkonto und erhöhen sichtbar den Wertstapel.
 * CAMERA_ROLE: still — ruhige 3/4-Bühne, damit Einzahlungen und wachsender Stapel sofort lesbar bleiben.
 * PAYOFF: Das Konto steht stabil mit Startkapital plus wiederkehrender Sparrate; 300 €/Monat ist als Mechanik verstanden.
 *
 * ANIMATION_NARRATIVE
 * START: Ein physischer Investmentordner zeigt 10.000 € Startkapital und einen goldenen Anfangsstapel.
 * MECHANISM: Mehrere echte Monatsumschläge mit 300 € kommen nacheinander hinein; mit jedem Umschlag wächst der Goldstapel.
 * RESULT: Der Ordner enthält sichtbar Startkapital plus wiederkehrende Einzahlungen und bleibt im Endzustand stabil.
 *
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Großer stilisierter Investmentordner mit sichtbarem Goldwertstapel.
 * SUPPORT: Vier Monatsumschläge und ein kleiner Kalenderstreifen erklären die Wiederholung.
 * MATERIAL: Warmes Ivory-Papier, Emerald-Akzent, Gold nur für Wert, Red-Orange nicht benötigt.
 * DEPTH: Umschläge starten vorne links, wandern in die mittlere Kontobühne und stapeln Wert nach hinten oben.
 */
export const RESULT_HOLD_FRAMES = 18;

const clamp = {extrapolateLeft:'clamp', extrapolateRight:'clamp'} as const;

export const Scene03Animation: React.FC<{durationFrames?: number}> = ({durationFrames=156}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({frame, fps, config:{damping:16, stiffness:120}});
  const deposits = [28,50,72,94];
  const completed = deposits.reduce((sum,start)=>sum + (frame >= start + 14 ? 1 : 0),0);
  const stackHeight = 170 + completed * 42;

  return <div style={{width:'100%',height:'100%',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter, Arial, sans-serif',color:ANIMATION_COLORS.neutralText,overflow:'hidden'}}>
    <div style={{position:'relative',width:860,height:760,transform:'perspective(1100px) rotateX(3deg) rotateY(-4deg) scale('+ (0.9+intro*0.1) +')',transformOrigin:'center'}}>
      <div data-finanzneo-object="investment-folder" style={{position:'absolute',left:260,top:155,width:420,height:470,borderRadius:38,background:'linear-gradient(145deg,#F6F1E7,#D8D1C5)',boxShadow:'0 28px 60px rgba(0,0,0,.38), inset 0 2px 0 rgba(255,255,255,.75)',border:'1px solid rgba(255,255,255,.28)'}}>
        <div style={{position:'absolute',left:34,top:30,fontSize:28,fontWeight:800,color:'#18231D'}}>INVESTMENT</div>
        <div style={{position:'absolute',right:34,top:32,fontSize:24,fontWeight:800,color:ANIMATION_COLORS.focus}}>10.000 €</div>
        <div style={{position:'absolute',left:72,bottom:58,width:276,height:Math.min(300,stackHeight),borderRadius:22,background:'linear-gradient(180deg,#FFD86A,#C8951D)',boxShadow:'0 18px 34px rgba(255,200,61,.16)',transition:'none'}} />
        {Array.from({length:completed+4}).map((_,i)=><div key={i} style={{position:'absolute',left:88,bottom:66+i*28,width:244,height:13,borderRadius:8,background:i%2===0?'#FFE49A':'#FFC83D',boxShadow:'0 4px 8px rgba(0,0,0,.18)'}} />)}
        <div style={{position:'absolute',left:92,bottom:22,fontSize:23,fontWeight:800,color:'#273129'}}>Start + Sparrate</div>
      </div>

      {deposits.map((start,i)=>{
        const p = interpolate(frame,[start,start+16],[0,1],clamp);
        const x = interpolate(p,[0,1],[-30,315]);
        const y = 238 + i*70 - p*i*18;
        const opacity = interpolate(frame,[start-4,start,start+15,start+22],[0,1,1,0],clamp);
        return <div key={start} style={{position:'absolute',left:x,top:y,width:210,height:92,borderRadius:18,background:'linear-gradient(145deg,#FFF9EE,#E6DDCF)',border:'2px solid rgba(0,210,106,.45)',boxShadow:'0 14px 28px rgba(0,0,0,.35)',opacity,transform:'rotate(-4deg) scale('+(0.96+p*0.04)+')',display:'flex',alignItems:'center',justifyContent:'center',color:'#15221A',fontSize:26,fontWeight:900}}>
          300 € <span style={{fontSize:17,marginLeft:8,color:'#5A6B61'}}>Monat {i+1}</span>
        </div>;
      })}

      <div style={{position:'absolute',left:315,top:646,width:310,height:62,borderRadius:20,border:'1px solid rgba(255,255,255,.16)',background:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,opacity:interpolate(frame,[100,118],[0,1],clamp)}}>
        300 € / Monat
      </div>
    </div>
  </div>;
};
