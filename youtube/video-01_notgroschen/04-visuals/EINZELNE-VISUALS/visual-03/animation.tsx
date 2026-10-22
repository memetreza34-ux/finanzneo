import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FinanceEyebrow, MotionStage, progressBetween} from '../../motion-kit';

export const MECHANIC_ID = 'consequence-routing';
export const VISUAL_TECHNIQUE_ID = 'branching-finance-path';
export const COMPOSITION_FAMILY_ID = 'network-simulation';
export const ANIMATION_NARRATIVE = {START:'Offene Rechnung ohne Reserve', MECHANISM:'Drei mögliche Auswege werden geprüft', RESULT:'Dispo, Kredit und Depotverkauf werden als belastende Notlösungen sichtbar'};

const Bill: React.FC<{pulse:number}> = ({pulse}) => (
  <div style={{position:'relative', width:330, height:420, transform:`rotate(${-2 + pulse*2}deg)`, filter:'drop-shadow(0 28px 40px rgba(0,0,0,0.45))'}}>
    <svg width="330" height="420" viewBox="0 0 330 420">
      <path d="M35 18 H225 L296 89 V400 H35 Z" fill="#F4F2EA"/>
      <path d="M225 18 V89 H296" fill="none" stroke="#B8B8B0" strokeWidth="8"/>
      <line x1="78" y1="145" x2="250" y2="145" stroke="#555A5F" strokeWidth="9" strokeLinecap="round"/>
      <line x1="78" y1="183" x2="218" y2="183" stroke="#9A9C9E" strokeWidth="7" strokeLinecap="round"/>
      <line x1="78" y1="221" x2="240" y2="221" stroke="#9A9C9E" strokeWidth="7" strokeLinecap="round"/>
      <rect x="73" y="278" width="178" height="68" rx="14" fill={COLORS.red}/>
      <text x="162" y="323" textAnchor="middle" fill="#050505" fontSize="29" fontWeight="900">JETZT FÄLLIG</text>
    </svg>
  </div>
);

const AccountConsequence: React.FC<{p:number}> = ({p}) => (
  <div style={{position:'absolute', left:1110, top:120, width:610, height:220, opacity:p, transform:`translateX(${(1-p)*90}px)`}}>
    <div style={{fontSize:27, color:COLORS.gray, fontWeight:800}}>KONTO</div>
    <div style={{display:'flex', alignItems:'baseline', gap:24, marginTop:12}}><div style={{fontSize:48, fontWeight:900}}>Dispo</div><div style={{fontSize:76, fontWeight:900, color:COLORS.red}}>- {Math.round(950*p)} €</div></div>
    <div style={{marginTop:24, width:540, height:20, borderRadius:10, background:'#22272B', overflow:'hidden'}}><div style={{height:'100%', width:`${p*86}%`, background:COLORS.red}}/></div>
  </div>
);

const CreditConsequence: React.FC<{p:number}> = ({p}) => (
  <div style={{position:'absolute', left:1110, top:415, width:610, height:220, opacity:p, transform:`translateX(${(1-p)*105}px)`}}>
    <div style={{fontSize:27, color:COLORS.gray, fontWeight:800}}>NEUE VERPFLICHTUNG</div>
    <div style={{display:'flex', alignItems:'center', gap:28, marginTop:18}}>
      {[0,1,2].map((index)=><div key={index} style={{width:96, height:96, borderRadius:20, border:`4px solid ${COLORS.red}`, transform:`translateY(${(2-index)*(1-p)*28}px)`, background:'#111315'}}><div style={{height:12, margin:'22px 15px 0', borderRadius:6, background:COLORS.red}}/><div style={{height:10, margin:'14px 15px 0', borderRadius:5, background:COLORS.gray}}/></div>)}
      <div><div style={{fontSize:46, fontWeight:900}}>Kredit</div><div style={{fontSize:28, color:COLORS.red, marginTop:6}}>Schuld verschiebt das Problem</div></div>
    </div>
  </div>
);

const DepotConsequence: React.FC<{p:number}> = ({p}) => {
  const line = 540*p;
  return <div style={{position:'absolute', left:1110, top:710, width:650, height:235, opacity:p, transform:`translateX(${(1-p)*120}px)`}}>
    <div style={{fontSize:27, color:COLORS.gray, fontWeight:800}}>DEPOT</div>
    <svg width="610" height="140" viewBox="0 0 610 140" style={{marginTop:8}}>
      <path d="M20 30 C100 20 125 58 190 50 S290 62 340 78 S455 102 570 124" fill="none" stroke={COLORS.red} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${line} 700`}/>
      <line x1="500" y1="24" x2="500" y2="130" stroke={COLORS.white} strokeWidth="4" opacity={Math.max(0,(p-0.55)/0.45)}/>
      <circle cx="500" cy="108" r="12" fill={COLORS.white} opacity={Math.max(0,(p-0.55)/0.45)}/>
    </svg>
    <div style={{position:'absolute', left:345, top:42, fontSize:30, fontWeight:900, color:COLORS.red}}>Verkauf im Minus</div>
  </div>;
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const route1 = progressBetween(frame, durationInFrames, 0.10, 0.32);
  const route2 = progressBetween(frame, durationInFrames, 0.30, 0.55);
  const route3 = progressBetween(frame, durationInFrames, 0.52, 0.80);
  const resolve = progressBetween(frame, durationInFrames, 0.80, 0.98);
  const camera = progressBetween(frame, durationInFrames, 0.06, 0.92);
  const cameraX = interpolate(camera, [0,1], [36,-54]);

  return <MotionStage>
    <div style={{position:'absolute', inset:0, transform:`translateX(${cameraX}px) scale(1.015)`, transformOrigin:'center'}}>
      <FinanceEyebrow style={{position:'absolute', left:115, top:80}}>Ohne Reserve sucht die Rechnung einen anderen Ausgang</FinanceEyebrow>
      <div style={{position:'absolute', left:120, top:255}}><Bill pulse={resolve}/></div>
      <div style={{position:'absolute', left:150, top:700, width:360, fontSize:34, lineHeight:1.28, fontWeight:800}}>Eine fällige Rechnung verschwindet nicht.</div>

      <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
        <path d="M 470 480 C 690 480, 760 225, 1080 225" fill="none" stroke={COLORS.red} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${850*route1} 900`}/>
        <path d="M 470 500 C 730 500, 770 520, 1080 520" fill="none" stroke={COLORS.red} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${760*route2} 900`}/>
        <path d="M 470 520 C 690 540, 780 815, 1080 815" fill="none" stroke={COLORS.red} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${900*route3} 1000`}/>
        {[{x:1080,y:225,p:route1},{x:1080,y:520,p:route2},{x:1080,y:815,p:route3}].map((dot,index)=><circle key={index} cx={dot.x} cy={dot.y} r={10+10*dot.p} fill={COLORS.red} opacity={dot.p}/>) }
      </svg>

      <AccountConsequence p={route1}/>
      <CreditConsequence p={route2}/>
      <DepotConsequence p={route3}/>

      <div style={{position:'absolute', right:120, bottom:62, fontSize:31, fontWeight:900, color:COLORS.red, opacity:resolve}}>Drei Notlösungen – weil der Puffer fehlt.</div>
    </div>
  </MotionStage>;
};
