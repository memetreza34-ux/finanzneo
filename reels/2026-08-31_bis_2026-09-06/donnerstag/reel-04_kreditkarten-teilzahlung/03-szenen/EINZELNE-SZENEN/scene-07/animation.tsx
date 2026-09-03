import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: partial-payment-leaves-principal
 * VISUAL_TECHNIQUE_ID: clip-slice-principal
 * PRIMARY_ACTION: Ein einziger 600-Euro-Schuldenkörper wird sichtbar bei 100 Euro durchschnitten; das kleine bezahlte Stück löst sich ab, der große 500-Euro-Rest bleibt und erhält anschließend eine Zusatzkostenschicht.
 * ANIMATION_NARRATIVE
 * START: Ein zusammenhängender 600-Euro-Körper füllt die Bühne und zeigt den gesamten offenen Betrag.
 * MECHANISM: Eine helle Schnittkante fährt durch den Körper; der 100-Euro-Teil trennt sich nach vorne links, während der 500-Euro-Rest an Ort und Stelle bleibt.
 * RESULT: Der 500-Euro-Rest dominiert stabil das Bild und eine dünne Warnschicht zeigt mögliche weitere Zinsen auf genau diesem Rest.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die echte Slice-Transformation eines einzigen Schuldenkörpers erklärt Teilzahlung und Rest ohne Karten-, Balken- oder Konten-Wiederholung.
 * SUPPORT: Betragslabels sitzen direkt auf den beiden Körperteilen; eine dünne Zusatzschicht ergänzt nur die Zinsfolge.
 * MATERIAL: Gold markiert den entfernten 100-Euro-Teil, warmes Rot den Rest und Ivory die sichtbare Schnittkante.
 * DEPTH: Das kleine Stück fährt deutlich nach vorne links aus der Ebene; der Rest stabilisiert leicht nach hinten rechts und bleibt größer.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene07Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const bodyIn = interpolate(frame,[2,18],[0,1],clamp);
  const cut = interpolate(frame,[22,54],[0,1],clamp);
  const detach = interpolate(frame,[48,82],[0,1],clamp);
  const interestLayer = interpolate(frame,[78,102],[0,1],clamp);
  const result = interpolate(frame,[96,Math.max(102,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:120,top:570,width:840,height:520,perspective:1200,opacity:bodyIn}}>
      <div style={{position:'absolute',left:45-detach*105,top:120+detach*45,width:150,height:270,borderRadius:30,background:ANIMATION_COLORS.money,boxShadow:'0 34px 65px rgba(0,0,0,.52)',transform:'rotateY(' + (-detach*22) + 'deg) rotateZ(' + (-detach*7) + 'deg)'}}><div style={{padding:'82px 26px',fontSize:38,fontWeight:950}}>100 €</div></div>
      <div style={{position:'absolute',left:195+detach*35,top:120,width:600,height:270,borderRadius:30,background:ANIMATION_COLORS.warning,boxShadow:'0 38px 72px rgba(0,0,0,.55)',transform:'scale(' + (0.96+detach*0.04) + ')'}}><div style={{padding:'78px 50px',fontSize:64,fontWeight:950,color:'white'}}>500 € REST</div><div style={{position:'absolute',left:0,right:0,top:-54*interestLayer,height:54*interestLayer,borderRadius:'20px 20px 6px 6px',background:'#d48a25'}} /></div>
      <div style={{position:'absolute',left:188,top:95,width:10,height:320,background:'#fff5d8',boxShadow:'0 0 24px rgba(255,245,216,.7)',opacity:cut,transform:'scaleY(' + cut + ')'}} />
      <div style={{position:'absolute',left:475,top:420,fontSize:29,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:result}}>REST BLEIBT OFFEN</div>
    </div>
  </AnimationStage>;
};
