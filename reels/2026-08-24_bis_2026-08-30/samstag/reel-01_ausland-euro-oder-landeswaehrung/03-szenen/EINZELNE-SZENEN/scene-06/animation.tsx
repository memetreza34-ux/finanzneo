import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AnimationStage, ANIMATION_COLORS, C, FONT, a, prog} from '../../../../../../../src/design-system';

/**
 * PHASE-1 CANONICAL ANIMATION SOURCE
 * ANIMATION_NARRATIVE
 * START: Nur der ursprüngliche Kaufbetrag ist in der Mitte sichtbar.
 * MECHANISM: Erst erscheint die DCC-Ebene mit Aufschlag, danach getrennt die Ebene der eigenen Karte mit möglicher Gebühr.
 * RESULT: Beide Kostenebenen stehen gleichzeitig klar getrennt und werden als zwei unabhängige Prüfstellen zusammengefasst.
 */
export const RESULT_HOLD_FRAMES = 18;

export const Scene06Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 180}) => {
  const frame = useCurrentFrame();
  const end = Math.max(105, durationFrames - RESULT_HOLD_FRAMES);
  const dcc = prog(frame, 12, Math.min(62, end - 42));
  const card = prog(frame, 54, Math.min(106, end - 14));
  const brace = prog(frame, 88, end);

  const box = (top:number, color:string, title:string, detail:string, p:number) => (
    <div style={{position:'absolute',left:195,right:195,top,height:220,borderRadius:36,background:a(color,0.10),border:`3px solid ${a(color,0.52)}`,opacity:p,transform:`translateY(${(1-p)*28}px)`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 52px'}}>
      <div><div style={{fontFamily:FONT.title,fontSize:42,fontWeight:900,color:ANIMATION_COLORS.neutralText}}>{title}</div><div style={{marginTop:12,fontFamily:FONT.body,fontSize:27,fontWeight:750,color:ANIMATION_COLORS.secondaryText}}>{detail}</div></div>
      <div style={{width:88,height:88,borderRadius:28,background:a(color,0.17),display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:44,color}}>€</div>
    </div>
  );

  return (
    <AnimationStage>
      <AbsoluteFill>
        <div style={{position:'absolute',left:380,top:505,width:320,height:105,borderRadius:26,background:a(C.whiteSoft,0.07),border:`2px solid ${a(C.whiteSoft,0.20)}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.body,fontSize:31,fontWeight:850,color:ANIMATION_COLORS.neutralText}}>KAUFBETRAG</div>
        {box(655, ANIMATION_COLORS.warning, 'DCC VOR ORT', 'WECHSELKURS + AUFSCHLAG', dcc)}
        {box(930, ANIMATION_COLORS.money, 'EIGENE KARTE', 'MÖGLICHE KARTENGEBÜHR', card)}
        <div style={{position:'absolute',right:110,top:690,width:28,height:410,borderRight:`6px solid ${ANIMATION_COLORS.focus}`,borderTop:`6px solid ${ANIMATION_COLORS.focus}`,borderBottom:`6px solid ${ANIMATION_COLORS.focus}`,borderRadius:'0 22px 22px 0',opacity:brace}} />
        <div style={{position:'absolute',right:40,top:825,width:170,textAlign:'center',fontFamily:FONT.body,fontSize:24,fontWeight:900,color:ANIMATION_COLORS.focus,opacity:brace}}>2 EBENEN</div>
      </AbsoluteFill>
    </AnimationStage>
  );
};
