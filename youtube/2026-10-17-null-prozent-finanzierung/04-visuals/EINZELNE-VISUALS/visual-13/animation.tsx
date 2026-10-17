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

export const MECHANIC_ID = 'overlapping-obligations-sum';
export const VISUAL_TECHNIQUE_ID = 'three-payments-converge-into-monthly-total';
export const COMPOSITION_FAMILY_ID = 'converging-expense-streams';
export const ANIMATION_NARRATIVE = {
  START: 'Initial real-world finance amounts or unchecked document state.',
  MECHANISM: 'Visible semantic changes frame by frame reveal payments, comparative prices or contract criteria.',
  RESULT: 'The exact educational consequence is legible and stable for the final hold.',
};

export const YouTubeVisual13Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const amounts = [50,35,25];
  const labels = ['Smartphone','Staubsauger','Möbel'];
  const speeds = amounts.map((_,i)=>norm(frame, 20+i*33, 83+i*33));
  const shown = amounts.reduce((sum,x,i)=>sum + x * speeds[i],0);
  return <AbsoluteFill style={{background: COLORS.bg, color: COLORS.white, fontFamily: font, padding: '90px 100px'}}>
    <div style={{fontSize: 34, color: COLORS.green, letterSpacing: 5, fontWeight: 800}}>MEHRERE KLEINE RATEN</div>
    <div style={{fontSize: 76, fontWeight: 900, marginTop: 22}}>Was bleibt am Monatsende?</div>
    <div style={{display: 'flex', justifyContent: 'space-between', gap: 38, marginTop: 108}}>
      {amounts.map((amount,i)=>{
        const p = speeds[i];
        return <div key={i} style={{flex:1, height: 245, border:'2px solid '+COLORS.panelEdge, borderRadius: 20, background:COLORS.panel, display:'flex', flexDirection:'column', ...center, transform:'translateY('+Math.round((1-p)*34)+'px)', opacity:0.47+0.53*p}}>
          <div style={{fontSize:31,color:COLORS.muted}}>{labels[i]}</div><div style={{fontSize:81,fontWeight:900,marginTop:20}}>{amount} €</div><div style={{fontSize:25,color:COLORS.muted}}>pro Monat</div>
        </div>;
      })}
    </div>
    <div style={{height: 114, margin: '28px auto 16px', width: 3, background: COLORS.green, opacity: norm(frame, 102, 160)}}/>
    <div style={{background:'#14352A', border:'3px solid '+COLORS.green, borderRadius:26, width: 1040, minHeight: 180, margin:'0 auto', ...center, gap:50}}>
      <div style={{fontSize:41}}>Zusammen pro Monat</div>
      <div style={{fontSize:94, fontWeight:900, color:COLORS.green}}>{Math.round(shown)} €</div>
    </div>
    <div style={{fontSize:28,color:COLORS.muted,textAlign:'center',marginTop:32}}>Alle drei Zahlungen fallen im Beispiel gleichzeitig an.</div>
  </AbsoluteFill>;
};
