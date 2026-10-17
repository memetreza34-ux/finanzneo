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

export const MECHANIC_ID = 'optional-premium-total-increase';
export const VISUAL_TECHNIQUE_ID = 'receipt-line-extra-cost-reveal';
export const COMPOSITION_FAMILY_ID = 'receipt-document-annotation';
export const ANIMATION_NARRATIVE = {
  START: 'Initial real-world finance amounts or unchecked document state.',
  MECHANISM: 'Visible semantic changes frame by frame reveal payments, comparative prices or contract criteria.',
  RESULT: 'The exact educational consequence is legible and stable for the final hold.',
};

export const YouTubeVisual06Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const extra = norm(frame, 86, 155);
  const row = norm(frame, 60, 99);
  const fullPrice = 600 + Math.round(96 * extra);
  return <AbsoluteFill style={{background: COLORS.bg, fontFamily: font, ...center}}>
    <div style={{width: 1130, minHeight: 835, background: '#F4F0E6', color: '#14201B', borderRadius: 14, padding: '68px 92px', transform: 'scale('+ (0.94 + 0.06 * norm(frame, 0, 80))+')', boxShadow: '0 18px 70px #10251C77'}}>
      <div style={{letterSpacing: 6, fontSize: 30, color: '#607069', fontWeight: 800}}>KASSENBON · FIKTIVES BEISPIEL</div>
      <div style={{fontSize: 67, fontWeight: 900, marginTop: 32}}>Was kostet der Kauf?</div>
      <div style={{borderTop: '3px dashed #ADB6AE', marginTop: 45, paddingTop: 50, display: 'flex', justifyContent: 'space-between', fontSize: 49}}>
        <span>Smartphone</span><strong>600 €</strong>
      </div>
      <div style={{opacity: row, transform: 'translateY(' + ((1-row)*30)+'px)', marginTop: 54, display: 'flex', justifyContent: 'space-between', fontSize: 41, color: '#B2462E'}}>
        <span>Freiwilliger Schutz (12 × 8 €)</span><strong>+ 96 €</strong>
      </div>
      <div style={{marginTop: 58, borderTop: '4px solid #173E2C', paddingTop: 38, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <strong style={{fontSize: 55}}>Gesamtbetrag</strong><strong style={{fontSize: 87, color: '#B2462E'}}>{fullPrice} €</strong>
      </div>
      <div style={{marginTop: 33, color: '#607069', fontSize: 30}}>Eine zusätzliche Versicherung ist nicht automatisch Pflicht.</div>
    </div>
  </AbsoluteFill>;
};
