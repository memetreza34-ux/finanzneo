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

export const MECHANIC_ID = 'twelve-fixed-installments';
export const VISUAL_TECHNIQUE_ID = 'installment-tile-reveal';
export const COMPOSITION_FAMILY_ID = 'arithmetic-grid';
export const ANIMATION_NARRATIVE = {
  START: 'Initial real-world finance amounts or unchecked document state.',
  MECHANISM: 'Visible semantic changes frame by frame reveal payments, comparative prices or contract criteria.',
  RESULT: 'The exact educational consequence is legible and stable for the final hold.',
};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = Math.min(12, Math.floor(norm(frame, 10, 148) * 12));
  const total = visible * 50;
  const resolved = norm(frame, 145, 168);
  return <AbsoluteFill style={{background: COLORS.bg, color: COLORS.white, fontFamily: font, padding: 106}}>
    <div style={{fontSize: 32, letterSpacing: 5, fontWeight: 700, color: COLORS.green}}>FIKTIVES BEISPIEL · ECHTE 0-%-FINANZIERUNG</div>
    <div style={{fontSize: 78, fontWeight: 900, marginTop: 36}}>12 Raten × 50 €</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 19, marginTop: 65}}>
      {Array.from({length: 12}, (_, i) => {
        const active = i < visible;
        return <div key={i} style={{height: 116, borderRadius: 14, background: active ? '#173D2F' : COLORS.panel, border: '2px solid ' + (active ? COLORS.green : COLORS.panelEdge), ...center, opacity: active ? 1 : 0.55}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 20, color: COLORS.muted, marginBottom: 10}}>Monat {i + 1}</div>
            <div style={{fontSize: 38, fontWeight: 850, color: active ? COLORS.white : '#53615B'}}>50 €</div>
          </div>
        </div>;
      })}
    </div>
    <div style={{marginTop: 64, paddingTop: 38, borderTop: '2px solid '+COLORS.panelEdge, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
      <span style={{fontSize: 43}}>Zusammen bezahlt</span>
      <span style={{fontSize: 91, fontWeight: 900, color: COLORS.green}}>{total.toLocaleString('de-DE')} €</span>
    </div>
    <div style={{fontSize: 32, color: COLORS.muted, opacity: resolved}}>Bei 0 € Nebenkosten sind es exakt 600 €.</div>
  </AbsoluteFill>;
};
