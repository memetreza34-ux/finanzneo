import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: interest-accrues-on-open-balance
 * VISUAL_TECHNIQUE_ID: debt-layer-extrusion
 * PRIMARY_ACTION: Ein massiver 500-Euro-Restblock bleibt über einen Monatswechsel stehen, während eine neue rot-orange Kostenschicht sichtbar auf seiner Oberseite anwächst.
 * ANIMATION_NARRATIVE
 * START: Ein dicker 500-Euro-Restkörper steht allein vor dem ersten Monatsmarker.
 * MECHANISM: Der Monatsmarker klappt räumlich zu Monat zwei um; der Restkörper bleibt exakt bestehen und eine zusätzliche Schicht extrudiert nach oben.
 * RESULT: Der ursprüngliche Rest plus zusätzliche Kostenschicht bleiben gemeinsam als höhere Belastung sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Ein großer extrudierter Schuldenkörper zeigt die verbleibende Hauptschuld körperlich und ohne Dashboard-Sprache.
 * SUPPORT: Ein einzelner 3D-Monatsflip erklärt nur den Zeitablauf; die wachsende Schicht trägt die Kostenfolge.
 * MATERIAL: Warme Ivory-Kanten am Restkörper, Rot-Orange für offene Schuld, Gold für mögliche Zusatzkosten.
 * DEPTH: Der Schuldenblock liegt tief im Raum; Monatsplatte klappt dahinter, Kostenschicht wächst sichtbar in Z-Richtung nach oben.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene05Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const blockIn = interpolate(frame,[2,20],[0,1],clamp);
  const monthFlip = interpolate(frame,[28,68],[0,1],clamp);
  const layerGrow = interpolate(frame,[58,98],[0,1],clamp);
  const result = interpolate(frame,[94,Math.max(100,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:120,top:505,width:840,height:650,perspective:1200,transformStyle:'preserve-3d'}}>
      <div style={{position:'absolute',left:75,top:105,width:220,height:260,transformStyle:'preserve-3d',transform:'rotateY(' + (monthFlip*90) + 'deg)'}}>
        <div style={{position:'absolute',inset:0,borderRadius:26,background:'#eee8db',color:'#182019',backfaceVisibility:'hidden',boxShadow:'0 28px 55px rgba(0,0,0,.45)'}}><div style={{paddingTop:72,textAlign:'center',fontSize:34,fontWeight:950}}>MONAT 1</div></div>
        <div style={{position:'absolute',inset:0,borderRadius:26,background:'#d8d1c3',color:'#182019',transform:'rotateY(180deg)',backfaceVisibility:'hidden',boxShadow:'0 28px 55px rgba(0,0,0,.45)'}}><div style={{paddingTop:72,textAlign:'center',fontSize:34,fontWeight:950}}>MONAT 2</div></div>
      </div>
      <div style={{position:'absolute',left:315,top:175,width:445,height:270,borderRadius:34,background:ANIMATION_COLORS.warning,boxShadow:'0 38px 70px rgba(0,0,0,.55)',transform:'translateY(' + ((1-blockIn)*55) + 'px) rotateX(7deg) rotateY(-5deg) scale(' + (0.9+blockIn*0.1) + ')',opacity:blockIn}}>
        <div style={{padding:'70px 58px',fontSize:66,fontWeight:950,color:'white'}}>500 € REST</div>
        <div style={{position:'absolute',left:18,right:18,bottom:-18,height:18,borderRadius:'0 0 18px 18px',background:'#671b14'}} />
        <div style={{position:'absolute',left:0,right:0,top:-90*layerGrow,height:90*layerGrow,borderRadius:'26px 26px 8px 8px',background:ANIMATION_COLORS.money,boxShadow:'0 -18px 36px rgba(213,167,42,.20)',overflow:'hidden'}}><div style={{padding:20,textAlign:'center',fontSize:27,fontWeight:950,opacity:result}}>+ ZINSEN MÖGLICH</div></div>
      </div>
    </div>
  </AnimationStage>;
};
