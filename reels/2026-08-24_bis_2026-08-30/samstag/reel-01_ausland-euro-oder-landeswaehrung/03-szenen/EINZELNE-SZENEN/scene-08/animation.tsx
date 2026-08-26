import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AnimationStage, ANIMATION_COLORS, C, FONT, a, prog} from '../../../../../../../src/design-system';

/**
 * PHASE-1 CANONICAL ANIMATION SOURCE
 * ANIMATION_NARRATIVE
 * START: Ein Bestätigen-Knopf ist gesperrt und die Kostenprüfung ist noch leer.
 * MECHANISM: Wechselkurs, DCC-Aufschlag, Automatengebühr und Kartengebühr werden nacheinander sichtbar geprüft und abgehakt.
 * RESULT: Erst nach allen vier Prüfungen erscheinen GESAMTKOSTEN und ein freigegebener Bestätigen-Knopf.
 */
export const RESULT_HOLD_FRAMES = 18;

export const Scene08Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 195}) => {
  const frame = useCurrentFrame();
  const end = Math.max(120, durationFrames - RESULT_HOLD_FRAMES);
  const labels = Array.of('WECHSELKURS','DCC-AUFSCHLAG','AUTOMATENGEBÜHR','KARTENGEBÜHR');
  const result = prog(frame, 112, end);

  return (
    <AnimationStage>
      <AbsoluteFill>
        <div style={{position:'absolute',left:70,top:690,width:250,height:220,borderRadius:46,background:a(result?C.accent:C.grayDk,0.14),border:`3px solid ${result?ANIMATION_COLORS.focus:a(C.whiteSoft,0.24)}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
          <div style={{fontFamily:FONT.title,fontSize:35,fontWeight:900,color:result?ANIMATION_COLORS.focus:ANIMATION_COLORS.secondaryText}}>BESTÄTIGEN</div>
          <div style={{fontFamily:FONT.body,fontSize:28,fontWeight:850,color:result?ANIMATION_COLORS.focus:ANIMATION_COLORS.secondaryText}}>{result?'FREI':'GESPERRT'}</div>
        </div>

        <div style={{position:'absolute',left:360,right:90,top:520,display:'grid',gap:22}}>
          {labels.map((label,i)=>{
            const p=prog(frame,12+i*28,Math.min(34+i*28,end-24));
            return <div key={label} style={{height:112,borderRadius:26,background:a(C.whiteSoft,0.065),border:`2px solid ${a(p>0.95?C.accent:C.whiteSoft,p>0.95?0.48:0.16)}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 30px',opacity:0.45+p*0.55,transform:`translateX(${(1-p)*22}px)`}}><span style={{fontFamily:FONT.body,fontSize:29,fontWeight:820,color:ANIMATION_COLORS.neutralText}}>{label}</span><span style={{width:46,height:46,borderRadius:'50%',background:a(C.accent,0.14),display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:28,color:ANIMATION_COLORS.focus,opacity:p}}>✓</span></div>;
          })}
        </div>

        <div style={{position:'absolute',left:360,right:90,top:1040,height:105,borderRadius:28,background:a(C.accent,0.10),border:`3px solid ${a(C.accent,0.50)}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:38,fontWeight:900,color:ANIMATION_COLORS.focus,opacity:result,transform:`translateY(${(1-result)*20}px)`}}>GESAMTKOSTEN</div>
      </AbsoluteFill>
    </AnimationStage>
  );
};
