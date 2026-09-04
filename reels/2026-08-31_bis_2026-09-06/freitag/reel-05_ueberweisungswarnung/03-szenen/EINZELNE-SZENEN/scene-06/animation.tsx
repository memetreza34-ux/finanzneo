import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: close-match-magnetic-name-correction
 * VISUAL_TECHNIQUE_ID: magnetic-close-match-correction
 * PRIMARY_ACTION: Ein leicht abweichender Empfängername wird auf einer magnetischen Schiene neben den hinterlegten Namen gezogen; die kleine Differenz bleibt gelb markiert und muss bewusst geprüft werden.
 * ANIMATION_NARRATIVE
 * START: Zwei Namensleisten liegen leicht versetzt auf parallelen Schienen; eine endet sichtbar einen Buchstaben früher.
 * MECHANISM: Ein Magnetkern zieht beide Leisten nebeneinander, hebt genau die kleine Abweichung gelb hervor und richtet den gespeicherten Namen daneben aus.
 * RESULT: Beide Namen stehen vergleichbar nebeneinander, die kleine Abweichung bleibt bewusst sichtbar statt automatisch zu verschwinden.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die magnetische Vergleichsschiene mit der hervorgehobenen Buchstabendifferenz trägt die Erklärung.
 * SUPPORT: Kurze Namenslabels verankern den konkreten Tippfehlerfall.
 * MATERIAL: Ivory-Namensleisten, dunkle Metallschiene, gelb-goldene Nahbereichsmarkierung und dezentes Emerald für den gespeicherten Referenznamen.
 * DEPTH: Die Leisten gleiten aus zwei Tiefenebenen zusammen und rasten zentral auf der Prüfposition ein.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene06Animation: React.FC<{durationFrames?:number}> = ({durationFrames=135}) => {
  const frame = useCurrentFrame();
  const topIn = interpolate(frame,[4,34],[0,1],clamp);
  const bottomIn = interpolate(frame,[18,52],[0,1],clamp);
  const magnet = interpolate(frame,[46,82],[0,1],clamp);
  const highlight = interpolate(frame,[72,104],[0,1],clamp);
  const settle = interpolate(frame,[96,Math.max(110,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:90,top:535,width:900,height:620,perspective:1200}}>
      <div style={{position:'absolute',left:120,top:150,width:660,height:26,borderRadius:13,background:'rgba(255,255,255,.16)'}} />
      <div style={{position:'absolute',left:120,top:340,width:660,height:26,borderRadius:13,background:'rgba(255,255,255,.16)'}} />
      <div style={{position:'absolute',left:120+(1-topIn)*-180+magnet*60,top:82,width:470,height:112,borderRadius:28,background:'#ded7c9',boxShadow:'0 24px 45px rgba(0,0,0,.45)',transform:'rotateX(8deg)'}}><div style={{padding:30,fontSize:33,fontWeight:950}}>MUSTER GMBH</div></div>
      <div style={{position:'absolute',left:150+(1-bottomIn)*-210+magnet*30,top:272,width:435,height:112,borderRadius:28,background:'#bbb6ab',boxShadow:'0 24px 45px rgba(0,0,0,.45)',transform:'rotateX(-6deg)'}}><div style={{padding:30,fontSize:33,fontWeight:950}}>MUSTER GMB</div></div>
      <div style={{position:'absolute',left:650-magnet*120,top:188,width:120,height:120,borderRadius:'50%',background:ANIMATION_COLORS.money,boxShadow:'0 0 38px rgba(212,177,89,.45)',transform:'scale('+(0.85+magnet*0.15)+')'}}><div style={{fontSize:26,fontWeight:950,textAlign:'center',paddingTop:44}}>MAGNET</div></div>
      <div style={{position:'absolute',left:470,top:286,width:78+highlight*70,height:84,borderRadius:22,border:'5px solid '+ANIMATION_COLORS.money,opacity:highlight}} />
      <div style={{position:'absolute',left:520,top:445,fontSize:30,fontWeight:950,color:ANIMATION_COLORS.money,opacity:settle}}>KLEINE ABWEICHUNG</div>
    </div>
  </AnimationStage>;
};
