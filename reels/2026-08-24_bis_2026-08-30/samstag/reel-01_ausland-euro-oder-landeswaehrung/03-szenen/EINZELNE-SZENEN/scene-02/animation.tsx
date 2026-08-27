import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AnimationStage, ANIMATION_COLORS, C, FONT, a, prog} from '../../../../../../../src/design-system';

/**
 * PHASE-1 CANONICAL ANIMATION SOURCE
 * ANIMATION_NARRATIVE
 * START: Ein Kaufbetrag in Landeswährung steht links vor einer physischen Umrechnungsmaschine.
 * MECHANISM: Der Betrag fährt in die Maschine, der Wechselkurs-Ring dreht und ein Euro-Beleg wird rechts ausgegeben.
 * RESULT: Der Euro-Beleg steht sichtbar mit einem roten AUFSCHLAG-Tag; DCC als Anbieter-Umrechnung ist eindeutig.
 */
export const RESULT_HOLD_FRAMES = 18;

export const Scene02Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 180}) => {
  const frame = useCurrentFrame();
  const end = Math.max(105, durationFrames - RESULT_HOLD_FRAMES);
  const travel = prog(frame, 10, Math.min(66, end - 38));
  const convert = prog(frame, 46, Math.min(96, end - 16));
  const result = prog(frame, 78, end);

  return (
    <AnimationStage>
      <AbsoluteFill>
        <div style={{position:'absolute',left:92,top:690,width:250,height:150,borderRadius:28,background:a(C.whiteSoft,0.08),border:`2px solid ${a(ANIMATION_COLORS.neutralText,0.34)}`,display:'flex',alignItems:'center',justifyContent:'center',transform:`translateX(${travel*230}px)`,fontFamily:FONT.title,fontSize:46,fontWeight:800,color:ANIMATION_COLORS.neutralText}}>
          LANDESWÄHRUNG
        </div>

        <div style={{position:'absolute',left:405,top:585,width:270,height:360,borderRadius:48,background:a(C.accent,0.09),border:`3px solid ${a(C.accent,0.45)}`,boxShadow:'0 28px 60px rgba(0,0,0,0.28)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:26}}>
          <div style={{width:132,height:132,borderRadius:'50%',border:`14px solid ${ANIMATION_COLORS.money}`,transform:`rotate(${convert*155}deg)`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:35,color:ANIMATION_COLORS.neutralText}}>DCC</div>
          <div style={{fontFamily:FONT.body,fontSize:28,fontWeight:800,color:ANIMATION_COLORS.secondaryText}}>UMRECHNUNG</div>
        </div>

        <div style={{position:'absolute',right:88,top:650,width:250,height:230,borderRadius:30,background:a(C.whiteSoft,0.10),border:`2px solid ${a(ANIMATION_COLORS.money,0.55)}`,opacity:convert,transform:`translateX(${(1-convert)*80}px)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20}}>
          <div style={{fontFamily:FONT.title,fontSize:52,fontWeight:900,color:ANIMATION_COLORS.money}}>EURO</div>
          <div style={{fontFamily:FONT.body,fontSize:26,fontWeight:750,color:ANIMATION_COLORS.secondaryText}}>BELEG</div>
          <div style={{opacity:result,transform:`translateY(${(1-result)*18}px)`,padding:'10px 18px',borderRadius:16,background:a(ANIMATION_COLORS.warning,0.18),border:`2px solid ${a(ANIMATION_COLORS.warning,0.65)}`,fontFamily:FONT.body,fontSize:24,fontWeight:900,color:ANIMATION_COLORS.warning}}>AUFSCHLAG</div>
        </div>
      </AbsoluteFill>
    </AnimationStage>
  );
};
