import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: full-payment-clears-statement
 * VISUAL_TECHNIQUE_ID: svg-payment-wipe
 * PRIMARY_ACTION: Eine breite Transferwelle wischt die komplette offene Abrechnung physisch von 600 Euro auf 0 Euro frei und hinterlässt einen vollständig bezahlten Endzustand.
 * ANIMATION_NARRATIVE
 * START: Eine große stilisierte Kartenabrechnung zeigt 600 Euro offen; der Abrechnungstermin ist als eingelassene Markierung sichtbar.
 * MECHANISM: Eine Emerald-Transferwelle zieht von links nach rechts über die gesamte Abrechnung und reduziert den offenen Wert entlang derselben Bewegung.
 * RESULT: Der Wipe endet vollständig rechts; 0 Euro und BEZAHLT bleiben stabil sichtbar.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Die große Abrechnung und die einmalige vollflächige SVG-Wipe-Bewegung tragen die komplette Aussage.
 * SUPPORT: Ein kompakter Terminmarker verankert den Zeitpunkt; keine Münz- oder Kartenreihe ist nötig.
 * MATERIAL: Ivory-Papier, Emerald-Transferfläche, weißer Betrag und ein klarer grüner Endstempel.
 * DEPTH: Abrechnung liegt als großes Blatt in leichter Perspektive; die Wipe-Fläche läuft wie eine physische Transferfolie darüber.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene03Animation: React.FC<{durationFrames?:number}> = ({durationFrames=120}) => {
  const frame = useCurrentFrame();
  const sheetIn = interpolate(frame,[2,18],[0,1],clamp);
  const wipe = interpolate(frame,[24,82],[0,1],clamp);
  const amountSettle = interpolate(frame,[55,88],[0,1],clamp);
  const stamp = interpolate(frame,[86,Math.max(94,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  const amount = Math.round(600*(1-amountSettle));
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:135,top:520,width:810,height:610,perspective:1400}}>
      <div style={{position:'absolute',left:70,top:55,width:670,height:450,borderRadius:34,background:'#eee8db',color:'#182019',boxShadow:'0 42px 75px rgba(0,0,0,.55)',transform:'translateY(' + ((1-sheetIn)*55) + 'px) rotateX(5deg) rotateY(-4deg)',opacity:sheetIn,overflow:'hidden'}}>
        <div style={{padding:'48px 52px',fontSize:31,fontWeight:900}}>KARTENABRECHNUNG</div>
        <div style={{position:'absolute',left:52,top:136,fontSize:75,fontWeight:950,color:amount===0?ANIMATION_COLORS.focus:ANIMATION_COLORS.warning}}>{amount} €</div>
        <div style={{position:'absolute',left:52,bottom:54,fontSize:26,fontWeight:850}}>ABRECHNUNGSTERMIN</div>
        <svg width="670" height="450" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
          <rect x={-690+wipe*690} y="0" width="690" height="450" fill={ANIMATION_COLORS.focus} opacity={0.28+wipe*0.18}/>
          <line x1={-15+wipe*690} y1="0" x2={-15+wipe*690} y2="450" stroke={ANIMATION_COLORS.focus} strokeWidth="18" opacity={wipe}/>
        </svg>
        <div style={{position:'absolute',right:45,bottom:42,padding:'14px 22px',border:'5px solid '+ANIMATION_COLORS.focus,borderRadius:14,color:ANIMATION_COLORS.focus,fontSize:31,fontWeight:950,transform:'rotate(-8deg) scale(' + stamp + ')',opacity:stamp}}>BEZAHLT</div>
      </div>
    </div>
  </AnimationStage>;
};
