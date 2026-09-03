import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: new-purchase-adds-to-card-balance
 * VISUAL_TECHNIQUE_ID: purchase-drop-vessel
 * PRIMARY_ACTION: Ein konkretes Einkaufspaket fällt von oben in einen transparenten Schuldenbehälter und drückt dessen sichtbaren Füllstand von 500 Euro auf 620 Euro nach oben.
 * ANIMATION_NARRATIVE
 * START: Ein transparenter Kartensaldo-Behälter steht bereits sichtbar bei 500 Euro Füllstand.
 * MECHANISM: Ein neues 120-Euro-Einkaufspaket fällt physisch in den Behälter; beim Aufprall steigt der rote Füllkörper deutlich an.
 * RESULT: Der Behälter hält stabil bei 620 Euro und zeigt, dass der offene Saldo durch neue Käufe weiter wachsen kann.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der transparente 3D-Behälter und der reale Fall des Einkaufspakets machen das Anwachsen körperlich sichtbar.
 * SUPPORT: 500- und 620-Euro-Markierungen erklären nur Start und Ergebnis; das fallende Paket trägt die Ursache.
 * MATERIAL: Glasartige helle Kontur, warmes Rot für offenen Saldo, Gold für das neue Einkaufspaket.
 * DEPTH: Behälter zentral vorne, Paket fällt aus oberer Tiefe hinein; Füllkörper wächst von unten und erzeugt klare Vertikalbewegung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=84}) => {
  const frame = useCurrentFrame();
  const vesselIn = interpolate(frame,[2,14],[0,1],clamp);
  const drop = interpolate(frame,[18,50],[0,1],clamp);
  const fill = interpolate(frame,[44,66],[0,1],clamp);
  const result = interpolate(frame,[62,Math.max(66,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const fillHeight = 260 + fill*115;
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:245,top:480,width:590,height:700,perspective:1200,opacity:vesselIn}}>
      <div style={{position:'absolute',left:95,top:145,width:400,height:455,border:'7px solid rgba(238,232,219,.8)',borderRadius:'36px 36px 70px 70px',boxShadow:'0 38px 70px rgba(0,0,0,.55), inset 0 0 24px rgba(255,255,255,.08)',overflow:'hidden',transform:'rotateX(3deg)'}}>
        <div style={{position:'absolute',left:0,right:0,bottom:0,height:fillHeight,background:ANIMATION_COLORS.warning,opacity:.88,transition:'none'}} />
        <div style={{position:'absolute',left:28,top:210-fill*85,fontSize:42,fontWeight:950,color:'white'}}>{fill>.55?'620 €':'500 €'}</div>
      </div>
      <div style={{position:'absolute',left:215,top:-30+drop*325,width:165,height:135,borderRadius:28,background:ANIMATION_COLORS.money,boxShadow:'0 26px 50px rgba(0,0,0,.48)',transform:'rotate(' + (-8+drop*13) + 'deg) scale(' + (1-drop*.08) + ')'}}><div style={{padding:'29px 22px',fontSize:27,fontWeight:950,textAlign:'center'}}>NEUER KAUF<br/>120 €</div></div>
      <div style={{position:'absolute',left:178,top:615,fontSize:30,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:result}}>SALDO WÄCHST</div>
    </div>
  </AnimationStage>;
};
