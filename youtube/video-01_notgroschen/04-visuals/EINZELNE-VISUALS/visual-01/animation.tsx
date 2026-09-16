import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, MotionStage} from '../../motion-kit';

export const MECHANIC_ID = 'defect-focus-reveal';
export const VISUAL_TECHNIQUE_ID = 'grounded-image-depth-reveal';
export const COMPOSITION_FAMILY_ID = 'image-composite';
export const ANIMATION_NARRATIVE = {START: 'Normale Waschecke', MECHANISM: 'Defekt wird fokussiert und Rechnung erscheint', RESULT: 'Reparatur 480 € ist klarer Hook-Payoff'};

export const YouTubeVisual01Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const defect = spring({frame: frame - 10, fps, config: {damping: 18, stiffness: 120}});
  const invoice = spring({frame: frame - 34, fps, config: {damping: 17, stiffness: 130}});
  const dim = interpolate(frame, [0, 18, 52], [0, 0.15, 0.34], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const invoiceScale = interpolate(invoice, [0, 1], [0.9, 1]);
  return (
    <MotionStage transparent>
      <div style={{position:'absolute', inset:0, background:`rgba(0,0,0,${dim})`}} />
      <div style={{position:'absolute', left:110, top:250, width:760, height:590, borderRadius:48, border:`6px solid rgba(255,107,74,${0.15 + defect * 0.75})`, boxShadow:`0 0 70px rgba(255,107,74,${defect * 0.28})`}} />
      <div style={{position:'absolute', right:120, bottom:150, transform:`scale(${invoiceScale})`, transformOrigin:'center', opacity:invoice, padding:'28px 42px', borderRadius:24, backgroundColor:'rgba(5,5,5,0.86)', border:`3px solid ${COLORS.red}`, fontSize:54, fontWeight:800}}>Reparatur 480 €</div>
    </MotionStage>
  );
};
