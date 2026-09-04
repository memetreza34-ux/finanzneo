import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: warning-inspection-turnstile
 * VISUAL_TECHNIQUE_ID: inspection-turnstile-release
 * PRIMARY_ACTION: Ein goldener Zahlungstoken stoppt an einem roten Drehkreuz; Name, IBAN und die eigene Plausibilitätsprüfung rasten nacheinander ein, erst dann öffnet sich der sichere Weg.
 * ANIMATION_NARRATIVE
 * START: Ein Goldtoken wartet direkt vor einem roten Drehkreuz; drei große Prüfringe sind noch offen.
 * MECHANISM: Die Prüfringe für NAME, IBAN und PLAUSIBILITÄT schließen nacheinander sichtbar um den Zahlungsweg und drehen den Sperrmechanismus aus der Warnstellung.
 * RESULT: Das Drehkreuz wechselt auf Emerald, öffnet vollständig und lässt den Token erst nach der Prüfung passieren.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das große mechanische Drehkreuz mit drei nacheinander einrastenden Prüfringen ist die Hauptaktion.
 * SUPPORT: Die drei kurzen Prüflabels bilden eine klare Abschlussroutine ohne Dashboard-Optik.
 * MATERIAL: Dunkles Metall, Gold für Zahlung, Ivory für Prüfringe, Rot im Stoppzustand und Emerald erst nach vollständiger Prüfung.
 * DEPTH: Token vorne, Drehkreuz zentral, sicherer Weg öffnet in die Tiefe; die drei Ringe bewegen sich aus unterschiedlichen Ebenen.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene14Animation: React.FC<{durationFrames?:number}> = ({durationFrames=144}) => {
  const frame = useCurrentFrame();
  const token = interpolate(frame,[2,30],[0,1],clamp);
  const ring1 = interpolate(frame,[24,58],[0,1],clamp);
  const ring2 = interpolate(frame,[46,80],[0,1],clamp);
  const ring3 = interpolate(frame,[68,102],[0,1],clamp);
  const release = interpolate(frame,[96,Math.max(116,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:80,top:520,width:920,height:670,perspective:1400}}>
      <div style={{position:'absolute',left:100+token*120,top:330,width:110,height:110,borderRadius:'50%',background:ANIMATION_COLORS.money,boxShadow:'0 22px 44px rgba(0,0,0,.45)'}}><div style={{fontSize:48,fontWeight:950,textAlign:'center',paddingTop:25}}>€</div></div>
      <div style={{position:'absolute',left:470,top:120,width:230,height:410,borderRadius:50,border:'6px solid '+(release>0.6?ANIMATION_COLORS.positive:ANIMATION_COLORS.warning),transform:'rotateY(-8deg)',boxShadow:'0 30px 65px rgba(0,0,0,.5)'}}>
        <div style={{position:'absolute',left:105,top:25,width:18,height:360,borderRadius:9,background:release>0.6?ANIMATION_COLORS.positive:ANIMATION_COLORS.warning,transform:'rotate('+(release*90)+'deg)',transformOrigin:'50% 55%'}} />
      </div>
      <div style={{position:'absolute',left:300,top:95,width:480,height:480,borderRadius:'50%',border:'6px solid #d9d2c4',transform:'scale('+(0.66+ring1*0.18)+') rotate('+(ring1*24)+'deg)',opacity:ring1*.7}}><div style={{position:'absolute',left:185,top:-48,fontSize:27,fontWeight:950}}>NAME</div></div>
      <div style={{position:'absolute',left:320,top:115,width:440,height:440,borderRadius:'50%',border:'6px solid #b9b4a9',transform:'scale('+(0.62+ring2*0.22)+') rotate('+(ring2*-28)+'deg)',opacity:ring2*.72}}><div style={{position:'absolute',right:-12,top:195,fontSize:27,fontWeight:950}}>IBAN</div></div>
      <div style={{position:'absolute',left:345,top:140,width:390,height:390,borderRadius:'50%',border:'6px solid '+ANIMATION_COLORS.focus,transform:'scale('+(0.58+ring3*0.25)+') rotate('+(ring3*34)+'deg)',opacity:ring3*.76}}><div style={{position:'absolute',left:105,bottom:-50,fontSize:27,fontWeight:950}}>PLAUSIBILITÄT</div></div>
      <div style={{position:'absolute',left:710,top:455,width:150+release*110,height:30,borderRadius:15,background:ANIMATION_COLORS.positive,opacity:release}} />
      <div style={{position:'absolute',left:690,top:520,fontSize:31,fontWeight:950,color:ANIMATION_COLORS.positive,opacity:release}}>JETZT SENDEN</div>
    </div>
  </AnimationStage>;
};
