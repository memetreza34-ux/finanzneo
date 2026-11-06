import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'emergency-fund-versus-market-risk';
export const VISUAL_TECHNIQUE_ID = 'split-reserve-market-response';
export const COMPOSITION_FAMILY_ID = 'comparison';
export const ANIMATION_NARRATIVE = {
  START: '3.000 € stehen als Notgroschen bereit',
  MECHANISM: 'Ein unerwarteter 800-€-Notfall trifft zwei unterschiedliche Geldtöpfe',
  RESULT: 'Liquide Reserve zahlt direkt; das Depot muss im falschen Moment verkauft werden',
};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const emergency = interpolate(frame, [10, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const payment = interpolate(frame, [32, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const marketDrop = interpolate(frame, [22, 54], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reserveWidth = 430 - 110 * payment;
  const depotWidth = 430 - 95 * marketDrop;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', color: '#F4F0E8', fontFamily: 'Arial', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 1220}}>
        <div style={{fontSize: 66, fontWeight: 800, marginBottom: 48}}>Notfall: 800 €</div>
        <div style={{display: 'flex', gap: 90}}>
          <div style={{width: 565}}>
            <div style={{fontSize: 34, color: '#2FCB8B', marginBottom: 18}}>NOTGROSCHEN</div>
            <div style={{height: 118, width: reserveWidth, borderRadius: 26, background: '#173B31', border: '3px solid #2FCB8B'}} />
            <div style={{fontSize: 38, marginTop: 22, opacity: payment}}>direkt verfügbar</div>
          </div>
          <div style={{width: 565}}>
            <div style={{fontSize: 34, color: '#E65B42', marginBottom: 18}}>DEPOT</div>
            <div style={{height: 118, width: depotWidth, borderRadius: 26, background: '#33201E', border: '3px solid #E65B42'}} />
            <div style={{fontSize: 38, marginTop: 22, opacity: marketDrop}}>Verkauf kann ungünstig sein</div>
          </div>
        </div>
        <div style={{marginTop: 56, height: 4, width: 1100 * emergency, background: '#F4F0E8', opacity: emergency}} />
      </div>
    </AbsoluteFill>
  );
};
