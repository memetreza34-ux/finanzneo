import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: verification-shield-cutaway-scope
 * VISUAL_TECHNIQUE_ID: shield-cutaway-limitation
 * PRIMARY_ACTION: Ein grüner Prüfrahmen bestätigt nur Name und IBAN; danach öffnet sich ein Cutaway und zeigt außerhalb des geprüften Bereichs eine manipulierte Rechnung mit Warnsignal.
 * ANIMATION_NARRATIVE
 * START: Ein großer grüner Prüfrahmen umfasst nur zwei sauber passende Elemente: Name und IBAN.
 * MECHANISM: Der Prüfrahmen schließt sich erfolgreich, während eine seitliche Cutaway-Maske aufgleitet und den bisher unsichtbaren Rechnungsbereich freilegt.
 * RESULT: Innerhalb des Rahmens bleibt das grüne Match korrekt, außerhalb erscheint gleichzeitig eine rote Warnung an der Rechnung – Match ist nicht gleich Seriosität.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der aufschneidende Prüfrahmen zeigt räumlich die Grenze des Checks.
 * SUPPORT: Name und IBAN bleiben im grünen Bereich; eine physische Rechnung liegt bewusst außerhalb.
 * MATERIAL: Emerald für den gültigen Datenabgleich, Ivory für Dokumente, warmes Rot nur für den ungeprüften Betrugsbereich.
 * DEPTH: Prüfrahmen vorne, Daten mittig, Rechnung wird aus einer tieferen verdeckten Ebene seitlich freigelegt.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=150}) => {
  const frame = useCurrentFrame();
  const frameIn = interpolate(frame,[4,32],[0,1],clamp);
  const match = interpolate(frame,[28,60],[0,1],clamp);
  const cut = interpolate(frame,[58,104],[0,1],clamp);
  const invoice = interpolate(frame,[82,118],[0,1],clamp);
  const warning = interpolate(frame,[108,Math.max(124,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:80,top:510,width:920,height:690,perspective:1400}}>
      <div style={{position:'absolute',left:80,top:110,width:470,height:370,border:'7px solid '+ANIMATION_COLORS.positive,borderRadius:54,opacity:frameIn,boxShadow:'0 0 42px rgba(44,208,149,.22)'}}>
        <div style={{position:'absolute',left:70,top:76,width:330,height:86,borderRadius:24,background:'#ddd6c8'}}><div style={{padding:25,fontSize:30,fontWeight:950}}>NAME</div></div>
        <div style={{position:'absolute',left:70,top:205,width:330,height:86,borderRadius:24,background:'#bab5aa'}}><div style={{padding:25,fontSize:30,fontWeight:950}}>IBAN</div></div>
        <div style={{position:'absolute',left:166,top:300,fontSize:31,fontWeight:950,color:ANIMATION_COLORS.positive,opacity:match}}>MATCH</div>
      </div>
      <div style={{position:'absolute',left:520,top:75,width:330,height:450,overflow:'hidden',clipPath:'inset(0 '+((1-cut)*100)+'% 0 0)',transform:'rotateY(-6deg)'}}>
        <div style={{position:'absolute',left:20,top:35,width:290,height:390,borderRadius:34,background:'#d9d1c1',boxShadow:'0 30px 62px rgba(0,0,0,.48)',opacity:invoice}}>
          <div style={{position:'absolute',left:40,top:45,width:210,height:22,borderRadius:10,background:'rgba(20,20,20,.18)'}} />
          <div style={{position:'absolute',left:40,top:100,width:190,height:18,borderRadius:9,background:'rgba(20,20,20,.14)'}} />
          <div style={{position:'absolute',left:40,top:150,width:220,height:18,borderRadius:9,background:'rgba(20,20,20,.14)'}} />
          <div style={{position:'absolute',left:96,top:235,width:98,height:98,borderRadius:'50%',background:ANIMATION_COLORS.warning,opacity:warning}}><div style={{fontSize:54,fontWeight:950,color:'white',textAlign:'center',paddingTop:17}}>!</div></div>
        </div>
      </div>
      <div style={{position:'absolute',left:520,top:535,fontSize:29,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:warning}}>MATCH ≠ SERIÖS</div>
    </div>
  </AnimationStage>;
};
