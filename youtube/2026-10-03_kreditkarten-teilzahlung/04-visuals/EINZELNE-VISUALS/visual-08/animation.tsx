import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'payment-setting-switch';
export const VISUAL_TECHNIQUE_ID = 'native-setting-selection-shift';
export const COMPOSITION_FAMILY_ID = 'settings-action';
export const ANIMATION_NARRATIVE = {
  START: 'Teilzahlung ist ausgewählt',
  MECHANISM: 'Die Auswahl wandert sichtbar zu Vollzahlung 100 %',
  RESULT: 'Vollzahlung ist grün bestätigt',
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [18, 54], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const confirm = interpolate(frame, [56, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const selectedY = interpolate(move, [0, 1], [0, 148]);
  const selectedColor = move < 0.5 ? '#A94A37' : '#137B5A';

  return (
    <AbsoluteFill style={{backgroundColor: '#070A09', color: '#F2EEE4', fontFamily: 'Arial, sans-serif', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top: 120, fontSize: 34, color: '#B9B8B2', letterSpacing: 1.2}}>ABRECHNUNG EINSTELLEN</div>
      <div style={{width: 1060, borderRadius: 46, background: 'linear-gradient(145deg, #15231F, #0B100F)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 34px 90px rgba(0,0,0,0.5)', padding: 44, position: 'relative'}}>
        <div style={{fontSize: 24, color: '#AFAEA8', marginBottom: 26}}>ZAHLUNGSART</div>
        <div style={{position: 'relative', height: 280}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: selectedY, height: 116, borderRadius: 28, border: `4px solid ${selectedColor}`, boxShadow: `0 0 34px ${selectedColor}33`}} />
          <div style={{height: 116, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
            <span style={{fontSize: 42}}>Teilzahlung</span>
            <span style={{fontSize: 24, color: '#D38A79'}}>monatliche Teilrate</span>
          </div>
          <div style={{height: 116, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', marginTop: 32}}>
            <span style={{fontSize: 42, fontWeight: 700}}>Vollzahlung 100 %</span>
            <span style={{fontSize: 24, color: '#78C6A6', opacity: confirm}}>ausgewählt ✓</span>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 135, fontSize: 38, color: '#78C6A6', opacity: confirm, transform: `translateY(${16 * (1 - confirm)}px)`}}>Einstellung geprüft</div>
    </AbsoluteFill>
  );
};
