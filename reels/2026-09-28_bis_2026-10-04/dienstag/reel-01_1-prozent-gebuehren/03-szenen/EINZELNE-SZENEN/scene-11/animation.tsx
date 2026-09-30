import React from 'react';
import {spring,useCurrentFrame,useVideoConfig} from 'remotion';
import {ANIMATION_COLORS,C,FONT,SceneShell,pct} from '../../../05-projektdateien/animation-shared';

/**
 * PHASE-1 CANONICAL CUSTOM ANIMATION
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: thirty-year-final-comparison
 * FOCAL_PATH: The eye follows two equal bases growing into clearly different final wealth towers, then reads the delayed result values.
 * PRIMARY_ACTION: Two wealth bodies build from the same baseline; the faster path ends visibly higher before either final number appears.
 * CAMERA_ROLE: still; both towers remain comparable in one stable frame.
 * PAYOFF: Only after the growth finishes do 447.000 € and 362.000 € appear, making the 30-year consequence immediately legible.
 * START: Two equal starting bases with no result numbers.
 * MECHANISM: Both bodies grow upward, with the 7-percent path reaching a visibly larger final volume.
 * RESULT: Final values appear after the build and remain stable.
 * HERO: Two large stylized 3D wealth towers.
 * SUPPORT: Small 7 % and 6 % labels plus delayed euro values.
 * MATERIAL: Emerald for the faster path, gold for the slower path, deep black background.
 * DEPTH: Bottom-anchored blocks use layered highlights and contact shadows.
 * RESULT_HOLD_FRAMES = 35
 */
export const FeesScene11Animation:React.FC=()=>{
  const frame=useCurrentFrame();
  const{fps}=useVideoConfig();
  const build=spring({frame:Math.max(0,frame-18),fps,config:{damping:24,stiffness:92,mass:1}});
  const reveal=pct(frame,125,155);
  return <SceneShell title="Nach 30 Jahren wird es groß" caption="Im Rechenbeispiel landen wir bei ungefähr 447.000 Euro gegenüber 362.000 Euro.">
    <div style={{position:'absolute',left:120,top:130,width:370,height:720}}>
      <div style={{position:'absolute',left:70,bottom:100,width:230,height:545*build,borderRadius:'42px 42px 20px 20px',background:`linear-gradient(180deg,${ANIMATION_COLORS.positive},rgba(20,80,52,.34))`,border:'3px solid rgba(95,255,165,.5)',boxShadow:'0 35px 60px rgba(0,0,0,.48)'}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:42,textAlign:'center',fontFamily:FONT.body,fontSize:30,fontWeight:900,color:C.white}}>7 %</div>
      <div style={{position:'absolute',left:-20,right:-20,bottom:0,textAlign:'center',fontFamily:FONT.title,fontSize:42,fontWeight:950,color:ANIMATION_COLORS.positive,opacity:reveal}}>≈ 447.000 €</div>
    </div>
    <div style={{position:'absolute',right:120,top:130,width:370,height:720}}>
      <div style={{position:'absolute',left:70,bottom:100,width:230,height:440*build,borderRadius:'42px 42px 20px 20px',background:`linear-gradient(180deg,${C.gold},rgba(108,76,15,.34))`,border:'3px solid rgba(255,205,75,.5)',boxShadow:'0 35px 60px rgba(0,0,0,.48)'}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:42,textAlign:'center',fontFamily:FONT.body,fontSize:30,fontWeight:900,color:C.white}}>6 %</div>
      <div style={{position:'absolute',left:-20,right:-20,bottom:0,textAlign:'center',fontFamily:FONT.title,fontSize:42,fontWeight:950,color:C.gold,opacity:reveal}}>≈ 362.000 €</div>
    </div>
  </SceneShell>;
};
