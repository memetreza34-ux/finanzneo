import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: name-iban-dual-key-lock
 * VISUAL_TECHNIQUE_ID: dual-key-lock-alignment
 * PRIMARY_ACTION: Zwei unterschiedlich geformte Schlüssel für Empfängername und IBAN fahren in ein gemeinsames Bankschloss; nur bei korrekter Passung kann sich der Freigabezylinder drehen.
 * ANIMATION_NARRATIVE
 * START: Ein großes Bankschloss steht geschlossen; links schweben zwei eindeutig unterschiedliche Schlüssel mit den kurzen Labels NAME und IBAN.
 * MECHANISM: Beide Schlüssel fahren aus unterschiedlichen Winkeln in zwei getrennte Schlitze und richten die inneren Schlosssegmente sichtbar aus.
 * RESULT: Der Zylinder dreht sich nur nach der gemeinsamen Passung und öffnet eine grüne Freigabeöffnung.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das große zweistufige Bankschloss ist die visuelle Hauptidee.
 * SUPPORT: Die zwei Schlüssel zeigen klar die beiden verglichenen Angaben.
 * MATERIAL: Gebürstetes dunkles Metall, Ivory-Schlüssel, Emerald im geöffneten Zustand und Gold am Zahlungsweg.
 * DEPTH: Schlüssel kommen aus dem Vordergrund, greifen zentral ins Schloss und öffnen einen tieferen Tunnel nach rechts.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene04Animation: React.FC<{durationFrames?:number}> = ({durationFrames=132}) => {
  const frame = useCurrentFrame();
  const nameKey = interpolate(frame,[4,38],[0,1],clamp);
  const ibanKey = interpolate(frame,[20,58],[0,1],clamp);
  const align = interpolate(frame,[54,90],[0,1],clamp);
  const turn = interpolate(frame,[78,108],[0,1],clamp);
  const open = interpolate(frame,[98,Math.max(110,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:90,top:515,width:900,height:660,perspective:1300}}>
      <div style={{position:'absolute',left:520,top:120,width:300,height:360,borderRadius:60,background:'linear-gradient(145deg,#262b29,#111513)',border:'3px solid rgba(255,255,255,.2)',boxShadow:'0 35px 70px rgba(0,0,0,.5)',transform:'rotateY(-8deg)'}}>
        <div style={{position:'absolute',left:66,top:76,width:168,height:54,borderRadius:18,border:'4px solid #d7d1c4'}} />
        <div style={{position:'absolute',left:66,top:188,width:168,height:54,borderRadius:18,border:'4px solid #b9b4aa'}} />
        <div style={{position:'absolute',left:103,top:272,width:94,height:94,borderRadius:'50%',background:open>0.55?ANIMATION_COLORS.positive:'#353b38',border:'5px solid rgba(255,255,255,.3)',transform:'rotate('+(turn*90)+'deg) scale('+(0.86+open*0.18)+')'}} />
      </div>
      <div style={{position:'absolute',left:40+nameKey*360,top:180,width:300,height:74,borderRadius:22,background:'#ddd5c5',boxShadow:'0 18px 36px rgba(0,0,0,.4)',transform:'rotate(' + (-5+nameKey*5) + 'deg)'}}><div style={{padding:18,fontSize:30,fontWeight:950}}>NAME</div></div>
      <div style={{position:'absolute',left:70+ibanKey*330,top:335,width:300,height:74,borderRadius:22,background:'#bbb6ab',boxShadow:'0 18px 36px rgba(0,0,0,.4)',transform:'rotate(' + (5-ibanKey*5) + 'deg)'}}><div style={{padding:18,fontSize:30,fontWeight:950}}>IBAN</div></div>
      <div style={{position:'absolute',left:655,top:515,width:180+open*120,height:34,borderRadius:17,background:ANIMATION_COLORS.positive,opacity:align,boxShadow:'0 0 28px rgba(44,208,149,.4)'}} />
      <div style={{position:'absolute',left:530,top:535,fontSize:30,fontWeight:950,color:ANIMATION_COLORS.positive,opacity:open}}>FREIGABE</div>
    </div>
  </AnimationStage>;
};
