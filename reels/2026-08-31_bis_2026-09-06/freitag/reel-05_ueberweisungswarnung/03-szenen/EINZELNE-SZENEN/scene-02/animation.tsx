import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: bank-transfer-verification-scan
 * VISUAL_TECHNIQUE_ID: verification-scanner-portal
 * PRIMARY_ACTION: Ein goldener Überweisungstoken fährt durch ein transparentes Prüfportal; Name und IBAN werden getrennt gescannt und die Zahlung stoppt sichtbar vor der Freigabe.
 * ANIMATION_NARRATIVE
 * START: Ein goldener Überweisungstoken wartet links vor einem transparenten Prüfportal; zwei Datenträger für Name und IBAN sind noch ungeprüft.
 * MECHANISM: Das Portal fährt einen hellen Prüfbalken über beide Datenträger, zieht sie in zwei Prüfkanäle und stoppt den Zahlungstoken mechanisch vor dem Ausgang.
 * RESULT: Der Zahlungstoken bleibt vor der Freigabe stehen und eine klare Warnmarke erscheint direkt am Prüfportal.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Das große Prüfportal mit dem gestoppten Goldtoken ist die dominante Hauptmechanik.
 * SUPPORT: Name- und IBAN-Datenträger erklären, was geprüft wird, ohne wie App-Karten zu wirken.
 * MATERIAL: Dunkles Metall und Glas, Gold für die Zahlung, Ivory für neutrale Daten, warmes Rot für die Warnung.
 * DEPTH: Token vorne links, Scanner zentral, Ausgang tiefer rechts; die Prüfung wirkt räumlich wie eine echte Schleuse.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene02Animation: React.FC<{durationFrames?:number}> = ({durationFrames=138}) => {
  const frame = useCurrentFrame();
  const tokenIn = interpolate(frame,[2,24],[0,1],clamp);
  const dataIn = interpolate(frame,[18,48],[0,1],clamp);
  const sweep = interpolate(frame,[42,86],[0,1],clamp);
  const stop = interpolate(frame,[72,104],[0,1],clamp);
  const warn = interpolate(frame,[96,Math.max(110,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:80,top:500,width:920,height:700,perspective:1400,transformStyle:'preserve-3d'}}>
      <div style={{position:'absolute',left:40+tokenIn*180,top:340,width:150,height:96,borderRadius:48,background:ANIMATION_COLORS.money,boxShadow:'0 24px 50px rgba(0,0,0,.45)',transform:'translateZ(80px) scale('+(0.9+tokenIn*0.1)+')'}}>
        <div style={{fontSize:46,fontWeight:950,textAlign:'center',paddingTop:20}}>€</div>
      </div>
      <div style={{position:'absolute',left:365,top:60,width:310,height:500,border:'5px solid rgba(255,255,255,.28)',borderRadius:52,boxShadow:'inset 0 0 0 2px rgba(255,255,255,.08), 0 36px 75px rgba(0,0,0,.5)',transform:'rotateY(-8deg)'}}>
        <div style={{position:'absolute',left:45,top:95-dataIn*45,width:220,height:82,borderRadius:20,background:'#d8d1c2',opacity:dataIn,boxShadow:'0 15px 30px rgba(0,0,0,.35)'}}><div style={{padding:20,fontSize:29,fontWeight:900}}>NAME</div></div>
        <div style={{position:'absolute',left:45,top:280+dataIn*25,width:220,height:82,borderRadius:20,background:'#b8b4aa',opacity:dataIn,boxShadow:'0 15px 30px rgba(0,0,0,.35)'}}><div style={{padding:20,fontSize:29,fontWeight:900}}>IBAN</div></div>
        <div style={{position:'absolute',left:24,top:70+sweep*340,width:262,height:12,borderRadius:8,background:ANIMATION_COLORS.focus,boxShadow:'0 0 28px rgba(44,208,149,.55)',opacity:dataIn}} />
      </div>
      <div style={{position:'absolute',left:720,top:325,width:160,height:150,borderRadius:30,border:'4px solid '+ANIMATION_COLORS.warning,transform:'translateX('+((1-stop)*70)+'px) rotateY(10deg)',opacity:stop}}>
        <div style={{position:'absolute',left:60,top:5,width:28,height:140,borderRadius:14,background:ANIMATION_COLORS.warning}} />
      </div>
      <div style={{position:'absolute',left:682,top:500,fontSize:31,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:warn,transform:'translateY('+((1-warn)*24)+'px)'}}>WARNUNG PRÜFEN</div>
    </div>
  </AnimationStage>;
};
