import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'payment-setting-switch';
export const VISUAL_TECHNIQUE_ID = 'native-open-row-selection-shift';
export const COMPOSITION_FAMILY_ID = 'settings-action-motion';
export const ANIMATION_NARRATIVE = {
  START: 'Teilzahlung ist als rote Auswahl markiert',
  MECHANISM: 'Der Auswahlindikator bewegt sich sichtbar zur Vollzahlung',
  RESULT: 'Vollzahlung 100 % ist grün bestätigt',
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const move = interpolate(frame, [24, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const confirm = interpolate(frame, [60, 82], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const indicatorY = interpolate(move, [0, 1], [398, 598]);
  const indicatorColor = move < 0.55 ? '#D65A42' : '#2A9B70';

  return (
    <AbsoluteFill style={{backgroundColor: '#070A09', color: '#F2EEE4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{position: 'absolute', left: 180, top: 140, opacity: intro}}>
        <div style={{fontSize: 30, color: '#A9A8A2', letterSpacing: 2}}>ABRECHNUNGSART</div>
        <div style={{fontSize: 72, fontWeight: 800, marginTop: 12}}>Was ist ausgewählt?</div>
      </div>

      <div style={{position: 'absolute', left: 260, right: 260, top: 350, opacity: intro}}>
        <div style={{height: 150, display: 'flex', alignItems: 'center', borderBottom: '2px solid #24312D'}}>
          <div style={{fontSize: 56, fontWeight: 700}}>Teilzahlung</div>
          <div style={{marginLeft: 'auto', fontSize: 30, color: '#D19384'}}>monatliche Teilrate</div>
        </div>
        <div style={{height: 150, display: 'flex', alignItems: 'center', borderBottom: '2px solid #24312D', marginTop: 50}}>
          <div style={{fontSize: 56, fontWeight: 800}}>Vollzahlung 100 %</div>
          <div style={{marginLeft: 'auto', fontSize: 30, color: '#7FCDAA', opacity: confirm}}>ausgewählt ✓</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 205,
          top: indicatorY,
          width: 18,
          height: 92,
          borderRadius: 12,
          backgroundColor: indicatorColor,
          boxShadow: `0 0 34px ${indicatorColor}55`,
        }}
      />

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 100, textAlign: 'center', fontSize: 42, color: '#7FCDAA', opacity: confirm, transform: `translateY(${18 * (1 - confirm)}px)`}}>
        Einstellung geprüft
      </div>
    </AbsoluteFill>
  );
};
