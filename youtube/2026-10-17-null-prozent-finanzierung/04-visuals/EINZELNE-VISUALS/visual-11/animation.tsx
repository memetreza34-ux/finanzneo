import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const COLORS = {
  bg: '#000000', panel: '#111716', panelEdge: '#2B3833', white: '#F8F7F0',
  muted: '#A3ACA8', green: '#55E2A3', warn: '#FF886B', gold: '#DBBB75',
};
const norm = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const font = '"Arial", "Helvetica", sans-serif';
const center: React.CSSProperties = {display: 'flex', alignItems: 'center', justifyContent: 'center'};

export const MECHANIC_ID = 'balloon-payment-shift';
export const VISUAL_TECHNIQUE_ID = 'eleven-small-ones-large-timeline';
export const COMPOSITION_FAMILY_ID = 'payment-schedule-timeline';
export const ANIMATION_NARRATIVE = {
  START: 'Initial real-world finance amounts or unchecked document state.',
  MECHANISM: 'Visible semantic changes frame by frame reveal payments, comparative prices or contract criteria.',
  RESULT: 'The exact educational consequence is legible and stable for the final hold.',
};

export const YouTubeVisual11Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const shown = Math.floor(norm(frame, 9, 132)*12);
  const last = norm(frame, 131, 169);
  const months = Array.from({length: 12}, (_, i) => i);
  return <AbsoluteFill style={{background: COLORS.bg, fontFamily: font, color: COLORS.white, padding: '85px 100px'}}>
    <div style={{fontSize: 34, color: COLORS.gold, letterSpacing: 5, fontWeight: 800}}>BEISPIEL: GROSSE SCHLUSSRATE</div>
    <div style={{fontSize: 82, fontWeight: 900, marginTop: 27}}>11 kleine Raten. Eine große.</div>
    <div style={{display: 'flex', gap: 14, alignItems: 'end', marginTop: 105, height: 375, padding: '0 12px 30px', borderBottom: '3px solid '+COLORS.panelEdge}}>
      {months.map(i => {
        const active = i < shown, final = i === 11;
        const progress = final ? last : norm(frame, 13+i*10, 29+i*10);
        const barH = (final ? 335 : 69)*progress;
        return <div key={i} style={{flex: 1, height: '100%', display: 'flex', alignItems: 'end', justifyContent: 'center', position: 'relative'}}>
          <div style={{width: '88%', height: Math.max(6,barH), borderRadius: '10px 10px 2px 2px', background: final ? COLORS.warn : COLORS.green, opacity: active || final ? 1 : 0.22}}/>
          <div style={{position: 'absolute', bottom: -70, fontSize: 25, color: COLORS.muted}}>{i+1}</div>
          <div style={{position: 'absolute', bottom: Math.max(6,barH)+17, fontSize: final?38:25, color: final?COLORS.warn:COLORS.white, fontWeight: 800, opacity: active||final?1:0}}>
            {final?'270 €':'30 €'}
          </div>
        </div>;
      })}
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 104, fontSize: 44}}>
      <div>Monat 1 bis 11: <strong>11 × 30 €</strong></div><div style={{color: COLORS.warn}}>Monat 12: <strong>270 €</strong></div>
    </div>
    <div style={{fontSize: 44, color: COLORS.green, fontWeight: 850, marginTop: 38, opacity: last}}>Gesamtsumme bleibt 600 €. Das Risiko: die hohe letzte Rate.</div>
  </AbsoluteFill>;
};
