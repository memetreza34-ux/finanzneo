import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const MECHANIC_ID = 'twelve-payments-vs-balance';
export const VISUAL_TECHNIQUE_ID = 'monthly-grid-balance-contrast';
export const COMPOSITION_FAMILY_ID = 'editorial-data-comparison';
export const ANIMATION_NARRATIVE = {
  START: 'Monatszahlungen erscheinen nacheinander',
  MECHANISM: 'Zwölf Zahlungen summieren sich zu 1.200 €',
  RESULT: 'Daneben bleibt 1.069,72 € Restschuld sichtbar',
};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const paidProgress = interpolate(frame, [6, 56], [0, 12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const balanceReveal = interpolate(frame, [46, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const months = ['JAN','FEB','MÄR','APR','MAI','JUN','JUL','AUG','SEP','OKT','NOV','DEZ'];

  return (
    <AbsoluteFill style={{backgroundColor: '#070A09', color: '#F2EEE4', fontFamily: 'Arial, sans-serif', padding: '120px 150px'}}>
      <div style={{fontSize: 34, color: '#B9B8B2', letterSpacing: 1.2}}>NACH 12 MONATEN</div>
      <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: 90}}>
        <div style={{width: 870}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18}}>
            {months.map((month, index) => {
              const visible = interpolate(paidProgress, [index, index + 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={month} style={{height: 105, borderRadius: 22, background: '#E9E3D8', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: visible, transform: `translateY(${12 * (1 - visible)}px)`, boxShadow: '0 14px 30px rgba(0,0,0,0.28)'}}>
                  <span style={{fontSize: 20, color: '#555'}}>{month}</span>
                  <strong style={{fontSize: 30}}>100 €</strong>
                </div>
              );
            })}
          </div>
          <div style={{fontSize: 54, marginTop: 34, fontWeight: 700}}>1.200 € GEZAHLT</div>
        </div>
        <div style={{width: 520, height: 330, borderRadius: 42, background: '#A94A37', padding: 44, opacity: balanceReveal, transform: `scale(${0.9 + 0.1 * balanceReveal})`, boxShadow: '0 28px 70px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontSize: 28, opacity: 0.85}}>TROTZDEM NOCH OFFEN</div>
          <div style={{fontSize: 72, fontWeight: 800, marginTop: 18}}>1.069,72 €</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
