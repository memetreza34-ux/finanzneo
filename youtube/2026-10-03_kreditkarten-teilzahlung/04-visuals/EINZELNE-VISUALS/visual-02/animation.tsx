import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'interest-before-principal';
export const VISUAL_TECHNIQUE_ID = 'layered-balance-deduction';
export const COMPOSITION_FAMILY_ID = 'financial-process-flow';
export const ANIMATION_NARRATIVE = {
  START: '2.000 € offener Saldo',
  MECHANISM: 'Zins wird zuerst hinzugefügt, danach reduziert die 100-€-Rate den Saldo',
  RESULT: '1.928,33 € Restschuld nach Monat 1',
};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const interest = interpolate(frame, [8, 32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const payment = interpolate(frame, [36, 68], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const width = 720 + 80 * interest - 165 * payment;
  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 1100}}>
        <div style={{fontSize: 44, marginBottom: 24}}>Offener Saldo</div>
        <div style={{height: 150, width, background: '#222', borderRadius: 28, position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 80 * interest, background: '#E65B42'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24, fontSize: 34}}>
          <span>2.000 €</span>
          <span style={{color: '#E65B42', opacity: interest}}>+28,33 € ZINSEN</span>
          <span style={{color: '#2FCB8B', opacity: payment}}>−100 € ZAHLUNG</span>
        </div>
        <div style={{fontSize: 62, marginTop: 48, opacity: payment}}>Rest: 1.928,33 €</div>
      </div>
    </AbsoluteFill>
  );
};
