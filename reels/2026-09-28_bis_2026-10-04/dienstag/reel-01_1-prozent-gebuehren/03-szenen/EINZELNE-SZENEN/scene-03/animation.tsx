import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, C, FONT, SceneShell, pct} from '../../../05-projektdateien/animation-shared';

/**
 * PHASE-1 CANONICAL CUSTOM ANIMATION
 *
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: fee-chip-repeat
 * FOCAL_PATH: The eye follows the intact capital body first, then each red fee chip as it breaks away, and finally returns to the visibly reduced capital base.
 * PRIMARY_ACTION: Repeated fee chips physically detach from one capital body so the viewer sees recurring costs remove value from the same investment base.
 * CAMERA_ROLE: still; the capital body stays spatially stable so every repeated removal is easy to compare.
 * PAYOFF: The capital remains visibly attacked while the label “jedes Jahr erneut” clarifies that the deduction is recurring rather than one-off.
 * START: One large intact emerald capital body fills the center of the visual stage.
 * MECHANISM: Six red-orange fee fragments detach sequentially from the same edge and travel outward.
 * RESULT: The remaining capital body stays on screen with visibly removed value.
 * HERO: One large rounded emerald capital body represents the invested wealth that is being reduced.
 * SUPPORT: Six substantial red-orange fee fragments and one short recurring-cost label.
 * MATERIAL: Emerald marks invested capital, warm red-orange marks cost, white is reserved for the central percentage label.
 * DEPTH: Contact shadow, border highlights and offset fee fragments create object separation while the animation stage itself stays transparent.
 * RESULT_HOLD_FRAMES = 30
 */
export const FeesScene03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hit = spring({frame: Math.max(0, frame - 24), fps, config: {damping: 17, stiffness: 180, mass: 0.8}});
  const shards = [{x:640,y:280},{x:705,y:335},{x:730,y:425},{x:710,y:515},{x:650,y:585},{x:565,y:615}];
  return (
    <SceneShell title="Jedes Jahr fehlt wieder Kapital" caption="Die Gebühr nimmt regelmäßig einen Teil heraus. Dieses Geld kann danach nicht mehr mitwachsen.">
      <div style={{position:'absolute',left:260,top:195,width:560,height:560,borderRadius:'50%',backgroundColor:C.accentDk,border:'4px solid rgba(95,255,165,.5)',boxShadow:'inset 0 0 90px rgba(95,255,165,.22),0 45px 75px rgba(0,0,0,.5)',scale:0.94+hit*0.06}}/>
      {shards.map((origin,index)=>{const progress=pct(frame,30+index*18,46+index*18);return <div key={index} style={{position:'absolute',left:origin.x+progress*150,top:origin.y+progress*105,width:72,height:72,borderRadius:18,backgroundColor:ANIMATION_COLORS.warning,border:'2px solid rgba(255,255,255,.28)',opacity:progress,rotate:`${12+index*8}deg`,boxShadow:'0 18px 32px rgba(0,0,0,.4)'}}/>})}
      <div style={{position:'absolute',left:390,top:405,width:300,textAlign:'center',fontFamily:FONT.title,fontSize:74,fontWeight:950,color:C.white}}>1 %</div>
      <div style={{position:'absolute',left:350,top:760,width:380,textAlign:'center',fontFamily:FONT.body,fontSize:28,fontWeight:850,color:ANIMATION_COLORS.warning,opacity:pct(frame,105,130)}}>jedes Jahr erneut</div>
    </SceneShell>
  );
};
