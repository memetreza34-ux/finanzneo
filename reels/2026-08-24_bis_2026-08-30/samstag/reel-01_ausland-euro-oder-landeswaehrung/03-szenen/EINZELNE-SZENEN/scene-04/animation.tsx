import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AnimationStage, ANIMATION_COLORS, C, FONT, a, prog} from '../../../../../../../src/design-system';

/**
 * PHASE-1 CANONICAL ANIMATION SOURCE
 * ANIMATION_NARRATIVE
 * START: Eine Zahlung in Landeswährung steht links vor zwei möglichen Umrechnungswegen.
 * MECHANISM: Die Zahlung folgt der grünen Route am roten DCC-Abzweig vorbei bis zur Bank-Station, wo erst umgerechnet wird.
 * RESULT: Rechts liegt ein Euro-Kontoauszug mit grünem Haken, während der DCC-Abzweig unbenutzt bleibt.
 */
export const RESULT_HOLD_FRAMES = 18;

export const Scene04Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 180}) => {
  const frame = useCurrentFrame();
  const end = Math.max(105, durationFrames - RESULT_HOLD_FRAMES);
  const route = prog(frame, 10, Math.min(84, end - 28));
  const bank = prog(frame, 58, Math.min(108, end - 10));
  const result = prog(frame, 86, end);

  return (
    <AnimationStage>
      <AbsoluteFill>
        <div style={{position:'absolute',left:80,top:720,width:210,height:130,borderRadius:26,background:a(C.whiteSoft,0.08),border:`2px solid ${a(ANIMATION_COLORS.neutralText,0.30)}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.body,fontSize:28,fontWeight:850,color:ANIMATION_COLORS.neutralText}}>LOKAL</div>

        <div style={{position:'absolute',left:250,top:765,width:545,height:18,borderRadius:12,background:a(C.accent,0.18)}}>
          <div style={{width:`${route*100}%`,height:'100%',borderRadius:12,background:ANIMATION_COLORS.focus,boxShadow:`0 0 22px ${a(C.accent,0.42)}`}} />
        </div>

        <div style={{position:'absolute',left:335,top:555,width:180,height:110,borderRadius:24,background:a(ANIMATION_COLORS.warning,0.10),border:`2px solid ${a(ANIMATION_COLORS.warning,0.46)}`,fontFamily:FONT.body,fontSize:28,fontWeight:850,color:ANIMATION_COLORS.warning,display:'flex',alignItems:'center',justifyContent:'center',opacity:0.78}}>DCC</div>
        <div style={{position:'absolute',left:422,top:655,width:12,height:108,background:a(ANIMATION_COLORS.warning,0.45)}} />

        <div style={{position:'absolute',left:590,top:630,width:230,height:270,borderRadius:38,background:a(C.accent,0.10),border:`3px solid ${a(C.accent,0.48)}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20,opacity:0.7+bank*0.3}}>
          <div style={{fontFamily:FONT.title,fontSize:52,color:ANIMATION_COLORS.focus}}>BANK</div>
          <div style={{fontFamily:FONT.body,fontSize:25,fontWeight:800,color:ANIMATION_COLORS.secondaryText}}>UMRECHNUNG</div>
        </div>

        <div style={{position:'absolute',right:74,top:670,width:220,height:230,borderRadius:28,background:a(C.whiteSoft,0.10),border:`2px solid ${a(ANIMATION_COLORS.focus,0.55)}`,opacity:result,transform:`translateX(${(1-result)*70}px)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18}}>
          <div style={{fontFamily:FONT.title,fontSize:48,color:ANIMATION_COLORS.money}}>EURO</div>
          <div style={{width:54,height:54,borderRadius:'50%',background:a(C.accent,0.18),border:`2px solid ${ANIMATION_COLORS.focus}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:32,color:ANIMATION_COLORS.focus}}>✓</div>
        </div>
      </AbsoluteFill>
    </AnimationStage>
  );
};
