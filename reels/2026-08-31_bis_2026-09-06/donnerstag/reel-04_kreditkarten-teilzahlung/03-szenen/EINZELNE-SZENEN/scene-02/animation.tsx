import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS, AnimationStage} from '../../../../../../../src/design-system';
/**
 * MECHANIC_ID: repayment-mode-lever
 * VISUAL_TECHNIQUE_ID: mechanical-lever-reveal
 * PRIMARY_ACTION: Ein großer mechanischer Rückzahlungshebel kippt sichtbar auf Teilzahlung; eine kleine Rate löst sich ab, während der deutlich größere Restkörper verriegelt stehen bleibt.
 * ANIMATION_NARRATIVE
 * START: Eine stylisierte Kreditkarte steht vor einem großen offenen Restkörper; der Hebel steht noch neutral zwischen Vollzahlung und Teilzahlung.
 * MECHANISM: Der Hebel kippt kräftig zu TEILZAHLUNG, ein kleines 100-Euro-Rateplättchen fährt heraus und der große Restkörper klappt gleichzeitig sichtbar auf.
 * RESULT: Kleine Rate und großer offener Rest stehen gleichzeitig im Bild; TEILZAHLUNG bleibt mechanisch eingerastet.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der mechanische Hebel und der dahinter aufklappende Restkörper tragen die Aussage wie eine physische Maschine statt wie App-UI.
 * SUPPORT: Kreditkartenkörper und kleines Rateplättchen verankern die Finanzsituation; Labels bleiben kurz.
 * MATERIAL: Dunkles Metall, Emerald am Vollzahlungsende, Gold an der kleinen Rate und warmes Rot am offenen Rest.
 * DEPTH: Karte vorne links, Hebel zentral, großer Restkörper klappt aus der Tiefe rechts auf und erzeugt einen klaren Größenkontrast.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
export const Scene02Animation: React.FC<{durationFrames?:number}> = ({durationFrames=168}) => {
  const frame = useCurrentFrame();
  const cardIn = interpolate(frame,[2,24],[0,1],clamp);
  const lever = interpolate(frame,[42,92],[0,1],clamp);
  const restOpen = interpolate(frame,[70,122],[0,1],clamp);
  const rateOut = interpolate(frame,[82,126],[0,1],clamp);
  const result = interpolate(frame,[124,Math.max(132,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);
  return <AnimationStage scale={1}>
    <div style={{position:'absolute',left:95,top:535,width:890,height:650,perspective:1300,transformStyle:'preserve-3d'}}>
      <div style={{position:'absolute',left:15,top:130,width:360,height:220,borderRadius:34,background:'linear-gradient(145deg,#21342c,#0d1713)',border:'2px solid rgba(255,255,255,.22)',boxShadow:'0 35px 70px rgba(0,0,0,.5)',transform:'translateX(' + ((1-cardIn)*-90) + 'px) rotateY(' + ((1-cardIn)*18) + 'deg)',opacity:cardIn}}>
        <div style={{position:'absolute',left:34,top:38,width:72,height:52,borderRadius:12,background:ANIMATION_COLORS.money}} />
        <div style={{position:'absolute',left:34,bottom:34,fontSize:31,fontWeight:900,color:'white'}}>KREDITKARTE</div>
      </div>
      <div style={{position:'absolute',left:390,top:88,width:430,height:390,borderRadius:44,border:'3px solid rgba(255,255,255,.18)',background:'linear-gradient(160deg,#202520,#111411)',boxShadow:'0 40px 80px rgba(0,0,0,.55)',transform:'rotateY(' + (-8+restOpen*4) + 'deg)'}}>
        <div style={{position:'absolute',left:55,right:55,top:70,height:18,borderRadius:10,background:'rgba(255,255,255,.12)'}} />
        <div style={{position:'absolute',left:72,top:126,fontSize:27,fontWeight:850,color:'white'}}>VOLLZAHLUNG</div>
        <div style={{position:'absolute',right:55,top:126,fontSize:27,fontWeight:850,color:ANIMATION_COLORS.warning}}>TEILZAHLUNG</div>
        <div style={{position:'absolute',left:200,top:172,width:34,height:150,borderRadius:17,background:'#d9d1be',transformOrigin:'50% 88%',transform:'rotate(' + (-34+lever*68) + 'deg)',boxShadow:'0 14px 24px rgba(0,0,0,.38)'}}><div style={{position:'absolute',left:-19,top:-32,width:72,height:72,borderRadius:'50%',background:lever>.55?ANIMATION_COLORS.warning:ANIMATION_COLORS.focus,border:'5px solid rgba(255,255,255,.45)'}} /></div>
      </div>
      <div style={{position:'absolute',left:535,top:438,width:330,height:150,borderRadius:30,background:ANIMATION_COLORS.warning,boxShadow:'0 25px 55px rgba(0,0,0,.48)',transform:'translateZ(' + (restOpen*70) + 'px) scaleX(' + (0.25+restOpen*0.75) + ')',transformOrigin:'0 50%',opacity:restOpen}}><div style={{padding:'34px 36px',fontSize:34,fontWeight:950,color:'white'}}>GROSSER REST OFFEN</div></div>
      <div style={{position:'absolute',left:405+rateOut*115,top:505-rateOut*85,width:150,height:92,borderRadius:24,background:ANIMATION_COLORS.money,boxShadow:'0 20px 36px rgba(0,0,0,.42)',opacity:rateOut,transform:'rotate(' + (-8+rateOut*10) + 'deg)'}}><div style={{padding:22,fontSize:31,fontWeight:950}}>100 € RATE</div></div>
      <div style={{position:'absolute',left:560,top:600,fontSize:31,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:result}}>TEILZAHLUNG EINGESTELLT</div>
    </div>
  </AnimationStage>;
};
