import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: single-purchase-spans-multiple-months
 * VISUAL_TECHNIQUE_ID: perspective-month-tunnel
 * PRIMARY_ACTION: Ein einzelner offener Einkauf fährt durch einen räumlichen Tunnel aus drei großen Monatsportalen, bleibt dabei angekettet und erreicht Monat drei noch immer unbezahlt.
 * ANIMATION_NARRATIVE
 * START: Ein einzelner Einkauf steht im Vordergrund vor einem dunklen perspektivischen Zeittunnel.
 * MECHANISM: Drei Monatsportale bewegen sich nacheinander aus der Tiefe an der Kamera vorbei; der Einkauf bleibt über eine sichtbare Kette mit dem offenen Rest verbunden.
 * RESULT: Monat drei rastet groß im Vordergrund ein und derselbe Einkauf steht weiterhin mit dem Hinweis MEHRERE MONATE OFFEN da.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die Kamerafahrt durch den Monatskorridor erzeugt erstmals echte räumliche Zeitdramaturgie statt weiterer Karten-/Münzbewegungen.
 * SUPPORT: Der einzelne Einkauf und eine gespannte Verbindungslinie halten die Ursache über alle Monatsportale hinweg sichtbar.
 * MATERIAL: Ivory-Portale, goldener Einkauf, rot-orange offene Verbindung und Emerald nur für neutrale Monatsmarkierungen.
 * DEPTH: Portale starten stark verkleinert am Fluchtpunkt und wachsen beim Vorbeiziehen; Einkauf bleibt als Anker vorne und erzeugt Parallaxe.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene14Animation: React.FC<{durationFrames?:number}> = ({durationFrames=126}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame,[8,88],[0,1],clamp);
  const purchaseIn = interpolate(frame,[2,18],[0,1],clamp);
  const chainTight = interpolate(frame,[28,92],[0,1],clamp);
  const finalLock = interpolate(frame,[88,Math.max(98,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const portal = (label, offset) => {
    const local = Math.max(0,Math.min(1,(travel-offset)/0.34));
    const scale = 0.22 + local*1.18;
    const y = 560 - local*170;
    return <div key={label} style={{position:'absolute',left:270,top:y,width:540,height:370,border:'10px solid #e9e1cf',borderRadius:48,transform:'perspective(900px) translateZ(' + (local*220) + 'px) scale(' + scale + ')',opacity:Math.min(1,local*2),boxShadow:'0 36px 76px rgba(0,0,0,.6)'}}><div style={{position:'absolute',top:28,left:0,right:0,textAlign:'center',fontSize:34,fontWeight:950,color:'white'}}>{label}</div></div>;
  };
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',inset:0,perspective:1200,overflow:'hidden'}}>
      {portal('MONAT 1',0.00)}{portal('MONAT 2',0.28)}{portal('MONAT 3',0.56)}
      <svg width="1080" height="1080" style={{position:'absolute',left:0,top:320,pointerEvents:'none'}}><line x1="540" y1="600" x2={540+chainTight*220} y2={600-chainTight*185} stroke={ANIMATION_COLORS.warning} strokeWidth="12" strokeDasharray="20 16" opacity={chainTight}/></svg>
      <div style={{position:'absolute',left:350,top:760-purchaseIn*40,width:380,height:210,borderRadius:38,background:ANIMATION_COLORS.money,boxShadow:'0 36px 70px rgba(0,0,0,.55)',opacity:purchaseIn,transform:'rotateX(7deg) scale(' + (0.9+purchaseIn*.1) + ')'}}><div style={{padding:'55px 42px',fontSize:39,fontWeight:950,textAlign:'center'}}>EIN EINKAUF<br/>WEITER OFFEN</div></div>
      <div style={{position:'absolute',left:325,top:1030,fontSize:34,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:finalLock}}>MEHRERE MONATE OFFEN</div>
    </div>
  </AnimationStage>;
};
