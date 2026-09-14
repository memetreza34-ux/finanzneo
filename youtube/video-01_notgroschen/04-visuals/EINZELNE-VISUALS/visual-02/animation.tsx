import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage, Panel} from '../../motion-kit';

export const MECHANIC_ID = 'accumulating-cost-pressure';
export const VISUAL_TECHNIQUE_ID = 'sequential-cost-impact-stage';
export const COMPOSITION_FAMILY_ID = 'physical-process';
export const ANIMATION_NARRATIVE = {START:'Freies Monatsbudget', MECHANISM:'Drei Kostenereignisse treffen nacheinander ein', RESULT:'Budgetraum wird sichtbar klein'};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [
    {label:'Waschmaschine', sub:'480 €', start:8},
    {label:'Bremsen', sub:'dringend', start:38},
    {label:'Nachzahlung', sub:'Monatsende', start:68},
  ];
  const entered = items.reduce((sum, item) => sum + Math.min(1, spring({frame: frame - item.start, fps, config:{damping:16, stiffness:120}})), 0);
  const budgetWidth = interpolate(entered, [0,3], [980,430]);
  return (
    <MotionStage>
      <div style={{position:'absolute', left:120, top:120, fontSize:40, color:COLORS.gray}}>Unerwartete Kosten</div>
      <div style={{position:'absolute', left:120, bottom:130, height:120, width:budgetWidth, borderRadius:28, backgroundColor:COLORS.green, display:'flex', alignItems:'center', paddingLeft:36, fontSize:42, fontWeight:800}}>freies Monatsbudget</div>
      {items.map((item, index) => {
        const p = spring({frame: frame - item.start, fps, config:{damping:16, stiffness:120}});
        const x = interpolate(p, [0,1], [1750, 180 + index * 500]);
        const y = 300 + index * 150;
        return <Panel key={item.label} style={{position:'absolute', left:x, top:y, width:430, height:120, padding:'24px 30px', borderColor:COLORS.red}}><div style={{fontSize:34,fontWeight:800}}>{item.label}</div><div style={{fontSize:25,color:COLORS.red}}>{item.sub}</div></Panel>;
      })}
    </MotionStage>
  );
};
