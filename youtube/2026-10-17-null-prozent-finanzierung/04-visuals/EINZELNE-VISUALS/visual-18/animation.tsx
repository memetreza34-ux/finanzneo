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

export const MECHANIC_ID = 'four-point-credit-preflight';
export const VISUAL_TECHNIQUE_ID = 'contract-checklist-progressive-reveal';
export const COMPOSITION_FAMILY_ID = 'document-decision-walkthrough';
export const ANIMATION_NARRATIVE = {
  START: 'Initial real-world finance amounts or unchecked document state.',
  MECHANISM: 'Visible semantic changes frame by frame reveal payments, comparative prices or contract criteria.',
  RESULT: 'The exact educational consequence is legible and stable for the final hold.',
};

export const YouTubeVisual18Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const checks = [
    '1. Was bezahle ich insgesamt?',
    '2. Effektiver Jahreszins und Extras?',
    '3. Ratenkredit oder weiterer Kreditrahmen?',
    '4. Bleibt nach den Raten genug Reserve?',
  ];
  const revealed = Math.min(4,Math.floor(norm(frame,12,163)*4));
  const final = norm(frame,162,197);
  return <AbsoluteFill style={{background:COLORS.bg,color:COLORS.white,fontFamily:font,padding:'71px 158px'}}>
    <div style={{fontSize:32,letterSpacing:5,color:COLORS.green,fontWeight:800}}>VOR DER UNTERSCHRIFT</div>
    <div style={{fontSize:85,fontWeight:900,marginTop:30}}>Der 4-Punkte-Check</div>
    <div style={{marginTop:75,display:'flex',flexDirection:'column',gap:23}}>
      {checks.map((label,i)=>{
        const p = norm(frame,18+i*35,38+i*35);
        const checked = i < revealed;
        return <div key={label} style={{height:114,padding:'0 35px',background:checked?'#153B2D':COLORS.panel, border:'2px solid '+(checked?COLORS.green:COLORS.panelEdge),borderRadius:15,display:'flex',alignItems:'center',gap:32,opacity:0.55+0.45*p, transform:'translateX('+Math.round((1-p)*50)+'px)'}}>
          <div style={{width:56,height:56,borderRadius:10,border:'3px solid '+(checked?COLORS.green:COLORS.muted),fontSize:45,fontWeight:900,color:COLORS.green,...center}}>{checked?'✓':''}</div>
          <span style={{fontSize:41,fontWeight:750}}>{label}</span>
        </div>;
      })}
    </div>
    <div style={{textAlign:'center',marginTop:63,opacity:final,fontSize:62,fontWeight:900,color:COLORS.green}}>Nicht die Rate entscheidet. Der Gesamtpreis.</div>
  </AbsoluteFill>;
};
