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

export const MECHANIC_ID = 'cross-store-equal-product-comparison';
export const VISUAL_TECHNIQUE_ID = 'two-offer-horizontal-bar-difference';
export const COMPOSITION_FAMILY_ID = 'comparative-price-analysis';
export const ANIMATION_NARRATIVE = {
  START: 'Initial real-world finance amounts or unchecked document state.',
  MECHANISM: 'Visible semantic changes frame by frame reveal payments, comparative prices or contract criteria.',
  RESULT: 'The exact educational consequence is legible and stable for the final hold.',
};

export const YouTubeVisual08Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const a = norm(frame, 12, 90);
  const b = norm(frame, 32, 116);
  const diff = norm(frame, 118, 162);
  const width = 1210;
  return <AbsoluteFill style={{background: COLORS.bg, color: COLORS.white, fontFamily: font, padding: '105px 150px'}}>
    <div style={{fontSize: 34, letterSpacing: 5, color: COLORS.green, fontWeight: 800}}>GLEICHES PRODUKT · FIKTIVER PREISVERGLEICH</div>
    <div style={{fontWeight: 900, fontSize: 76, marginTop: 25}}>0 % Zinsen ≠ bester Kaufpreis</div>
    {[
      {label: 'Händler mit 0 %-Angebot', amount: 600, progress: a, color: COLORS.warn},
      {label: 'Anderer Händler', amount: 550, progress: b, color: COLORS.green},
    ].map((x,i) => <div key={x.label} style={{marginTop: i === 0 ? 99 : 81}}>
      <div style={{fontSize: 37, marginBottom: 18, display: 'flex', justifyContent: 'space-between', maxWidth: width}}>
        <span>{x.label}</span><strong style={{color: x.color}}>{x.amount} €</strong>
      </div>
      <div style={{width, height: 75, background: COLORS.panel, borderRadius: 10, overflow: 'hidden', border: '1px solid ' + COLORS.panelEdge}}>
        <div style={{height: '100%', width: Math.round(width * x.amount/600 * x.progress), background: x.color, borderRadius: 8}} />
      </div>
    </div>)}
    <div style={{marginTop: 83, fontSize: 61, fontWeight: 900, opacity: diff, transform: 'translateY('+((1-diff)*25)+'px)'}}>
      <span style={{color: COLORS.green}}>50 € Unterschied</span> – trotz 0 % beim ersten Händler
    </div>
  </AbsoluteFill>;
};
