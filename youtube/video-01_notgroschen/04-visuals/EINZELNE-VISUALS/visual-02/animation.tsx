import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FinanceEyebrow, MotionStage, clamp01, frameAt, progressBetween} from '../../motion-kit';

export const MECHANIC_ID = 'accumulating-cost-pressure';
export const VISUAL_TECHNIQUE_ID = 'sequential-cost-impact-stage';
export const COMPOSITION_FAMILY_ID = 'physical-process';
export const ANIMATION_NARRATIVE = {START:'Freies Monatsbudget', MECHANISM:'Drei Kostenereignisse treffen nacheinander ein', RESULT:'Budgetraum wird sichtbar klein'};

const CostGlyph: React.FC<{kind: 'washer' | 'brake' | 'bill'}> = ({kind}) => {
  if (kind === 'washer') {
    return <svg width="116" height="116" viewBox="0 0 116 116"><rect x="13" y="9" width="90" height="98" rx="16" fill="#15181B" stroke={COLORS.white} strokeWidth="5"/><circle cx="58" cy="62" r="29" fill="#0A0C0E" stroke={COLORS.red} strokeWidth="6"/><circle cx="58" cy="62" r="17" fill="#1F2529"/><circle cx="28" cy="25" r="5" fill={COLORS.red}/><line x1="42" y1="25" x2="84" y2="25" stroke={COLORS.gray} strokeWidth="5" strokeLinecap="round"/></svg>;
  }
  if (kind === 'brake') {
    return <svg width="116" height="116" viewBox="0 0 116 116"><circle cx="55" cy="58" r="39" fill="#171A1D" stroke={COLORS.white} strokeWidth="6"/><circle cx="55" cy="58" r="20" fill="#050505" stroke={COLORS.gray} strokeWidth="5"/><circle cx="55" cy="58" r="7" fill={COLORS.white}/><path d="M78 30 Q104 40 99 70 Q95 92 75 94 L72 74 Q82 68 82 55 Q82 43 72 39 Z" fill={COLORS.red}/></svg>;
  }
  return <svg width="116" height="116" viewBox="0 0 116 116"><path d="M28 10 H75 L96 31 V106 H28 Z" fill="#F7F7F2"/><path d="M75 10 V31 H96" fill="none" stroke="#A7ADB4" strokeWidth="5"/><line x1="42" y1="48" x2="82" y2="48" stroke={COLORS.red} strokeWidth="6" strokeLinecap="round"/><line x1="42" y1="65" x2="82" y2="65" stroke="#50565C" strokeWidth="5" strokeLinecap="round"/><line x1="42" y1="82" x2="70" y2="82" stroke="#50565C" strokeWidth="5" strokeLinecap="round"/></svg>;
};

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const items = [
    {label:'Waschmaschine', sub:'480 €', kind:'washer' as const, start:0.06, targetX:1180, y:260},
    {label:'Bremsen', sub:'dringend', kind:'brake' as const, start:0.33, targetX:930, y:245},
    {label:'Nachzahlung', sub:'Monatsende', kind:'bill' as const, start:0.60, targetX:680, y:265},
  ];

  const arrivals = items.map((item) => clamp01(spring({
    frame: Math.max(0, frame - frameAt(durationInFrames, item.start)),
    fps,
    config: {damping: 18, stiffness: 118, mass: 0.9},
  })));
  const impacts = items.map((item) => progressBetween(frame, durationInFrames, item.start + 0.11, item.start + 0.21));
  const pressure = impacts.reduce((sum, value) => sum + value, 0);
  const budgetWidth = interpolate(pressure, [0, 3], [1120, 470]);
  const budgetGlow = interpolate(pressure, [0, 3], [18, 42]);

  return (
    <MotionStage>
      <FinanceEyebrow style={{position:'absolute', left:130, top:105}}>Drei Kosten. Ein Monatsbudget.</FinanceEyebrow>
      <div style={{position:'absolute', left:130, top:165, fontSize:58, lineHeight:1.04, fontWeight:900, maxWidth:860}}>Wenn mehrere Notfälle direkt hintereinander kommen</div>

      <div style={{position:'absolute', left:130, bottom:146, width:1120, height:138}}>
        <div style={{position:'absolute', inset:0, borderRadius:34, border:`3px solid ${COLORS.line}`, background:'#0B0D0F'}}/>
        <div style={{position:'absolute', left:0, top:0, width:budgetWidth, height:138, borderRadius:34, background:`linear-gradient(90deg, ${COLORS.green}, #1B8758)`, boxShadow:`0 0 ${budgetGlow}px rgba(45,216,129,0.22)`, display:'flex', alignItems:'center', paddingLeft:40, boxSizing:'border-box'}}>
          <div><div style={{fontSize:25, color:'#DDF8EA', fontWeight:700}}>verfügbar</div><div style={{fontSize:42, fontWeight:900}}>freies Monatsbudget</div></div>
        </div>
        <div style={{position:'absolute', right:24, top:44, fontSize:30, fontWeight:800, color:pressure > 2.4 ? COLORS.red : COLORS.gray}}>Puffer wird kleiner</div>
      </div>

      <div style={{position:'absolute', left:1270, top:210, width:3, height:650, background:COLORS.line}}/>
      <div style={{position:'absolute', left:1315, top:700, fontSize:28, lineHeight:1.35, color:COLORS.gray, width:430}}>Jeder Einschlag nimmt sofort finanzielle Bewegungsfreiheit.</div>

      {items.map((item, index) => {
        const p = arrivals[index];
        const x = interpolate(p, [0, 1], [1780, item.targetX]);
        const impactPhase = progressBetween(frame, durationInFrames, item.start + 0.12, item.start + 0.25);
        const pulse = 1 - Math.abs(impactPhase * 2 - 1);
        return <React.Fragment key={item.label}>
          <div style={{position:'absolute', left:x - 12, top:item.y - 12, width:140, height:140, borderRadius:70, border:`5px solid ${COLORS.red}`, opacity:pulse * 0.65, transform:`scale(${0.85 + pulse * 0.5})`}}/>
          <div style={{position:'absolute', left:x, top:item.y, width:116, transform:`translateY(${(1-p)*-35}px) scale(${0.88 + p*0.12})`, filter:`drop-shadow(0 18px 24px rgba(0,0,0,0.42))`}}>
            <CostGlyph kind={item.kind}/>
            <div style={{marginTop:10, fontSize:27, fontWeight:900, whiteSpace:'nowrap'}}>{item.label}</div>
            <div style={{marginTop:3, fontSize:24, fontWeight:800, color:COLORS.red}}>{item.sub}</div>
          </div>
        </React.Fragment>;
      })}
    </MotionStage>
  );
};
