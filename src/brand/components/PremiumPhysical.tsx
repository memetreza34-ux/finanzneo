import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ANIMATION_COLORS, C, REEL_STYLE, a} from '../tokens';
import {AnimationStage} from './ReelStage';

export type PremiumMaterial = 'structure' | 'neutral' | 'money' | 'warning' | 'positive';

const MATERIALS: Record<PremiumMaterial, {
  face: string;
  edge: string;
  rim: string;
  text: string;
  shadow: string;
}> = {
  structure: {
    face: '#123525', edge: '#071A11', rim: '#54F3A2', text: C.white,
    shadow: '0 30px 55px rgba(0,0,0,0.48), 0 8px 20px rgba(0,0,0,0.34)',
  },
  neutral: {
    face: '#E8E0CC', edge: '#8E8878', rim: '#FFF5D8', text: '#122018',
    shadow: '0 28px 52px rgba(0,0,0,0.40), 0 8px 18px rgba(0,0,0,0.28)',
  },
  money: {
    face: '#D5A72A', edge: '#7A5610', rim: '#FFE59B', text: '#251B07',
    shadow: '0 30px 58px rgba(0,0,0,0.44), 0 8px 22px rgba(255,200,61,0.14)',
  },
  warning: {
    face: '#B9422D', edge: '#641B13', rim: '#FF9B72', text: C.white,
    shadow: '0 30px 58px rgba(0,0,0,0.46), 0 8px 22px rgba(255,70,50,0.12)',
  },
  positive: {
    face: '#0C7A47', edge: '#06442A', rim: '#6CFFB5', text: C.white,
    shadow: '0 30px 58px rgba(0,0,0,0.46), 0 8px 22px rgba(0,210,106,0.15)',
  },
};

// Technical compatibility lock. The V3 quality rules are enforced separately
// in the validator; keeping this id stable avoids invalidating already sealed
// animation hashes solely because reusable visual primitives improve.
export const PREMIUM_VISUAL_LOCK = 'finanzneo-premium-physical-animation-v2';

/**
 * Shared transparent animation stage. The central Reel background is the only
 * background and remains pure #000000. Real-world objects belong on this stage;
 * decorative dashboards, generic card rows and progress-bar-as-story do not.
 */
export const PremiumPhysicalStage: React.FC<{
  children: React.ReactNode;
  scale?: number;
}> = ({children, scale}) => (
  <AnimationStage scale={scale}>
    <AbsoluteFill style={{perspective: 1400, overflow: 'hidden', background: 'transparent'}}>
      {children}
    </AbsoluteFill>
  </AnimationStage>
);

export const PhysicalObject: React.FC<{
  children?: React.ReactNode;
  material?: PremiumMaterial;
  width: number;
  height: number;
  x: number;
  y: number;
  depth?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
  radius?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  material = 'structure',
  width,
  height,
  x,
  y,
  depth = 26,
  rotateX = 4,
  rotateY = -8,
  rotateZ = 0,
  scale = 1,
  opacity = 1,
  radius = 38,
  style,
}) => {
  const m = MATERIALS[material];
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      borderRadius: radius,
      background: `linear-gradient(145deg, ${m.rim} 0%, ${m.face} 12%, ${m.face} 72%, ${m.edge} 100%)`,
      border: `1px solid ${a(m.rim, 0.34)}`,
      color: m.text,
      boxShadow: `${m.shadow}, inset 0 1px 0 ${a('#FFFFFF', 0.28)}, inset 0 -${Math.max(6, Math.round(depth * 0.45))}px ${Math.max(10, depth)}px ${a(m.edge, 0.35)}`,
      transform: `translateZ(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
      transformStyle: 'preserve-3d',
      opacity,
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', left: '8%', right: '8%', top: '5%', height: '22%',
        borderRadius: 999, background: 'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0))',
        filter: 'blur(1px)', pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
};

export const PhysicalTag: React.FC<{
  children: React.ReactNode;
  material?: PremiumMaterial;
  style?: React.CSSProperties;
}> = ({children, material = 'neutral', style}) => {
  const m = MATERIALS[material];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px 16px', borderRadius: 12,
      background: `linear-gradient(145deg, ${m.rim}, ${m.face} 22%, ${m.edge})`,
      color: m.text, border: `1px solid ${a(m.rim, 0.42)}`,
      boxShadow: `0 8px 18px rgba(0,0,0,0.28), inset 0 1px 0 ${a('#FFFFFF', 0.24)}`,
      fontWeight: 900, letterSpacing: 0.4,
      ...style,
    }}>
      {children}
    </div>
  );
};

/** Supplemental rail only. Never use this as the primary explanatory motion. */
export const PhysicalRail: React.FC<{
  x: number;
  y: number;
  width: number;
  progress: number;
  material?: 'positive' | 'money' | 'warning';
  thickness?: number;
}> = ({x, y, width, progress, material = 'positive', thickness = 24}) => {
  const color = material === 'money'
    ? ANIMATION_COLORS.money
    : material === 'warning'
      ? ANIMATION_COLORS.warning
      : ANIMATION_COLORS.focus;
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height: thickness,
      borderRadius: thickness / 2,
      background: 'rgba(255,255,255,0.07)',
      boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.32), 0 10px 18px rgba(0,0,0,0.20)',
      overflow: 'hidden', transform: 'translateZ(8px)',
    }}>
      <div style={{
        height: '100%', width: `${clamped * 100}%`, borderRadius: thickness / 2,
        background: `linear-gradient(90deg, ${a(color, 0.64)}, ${color})`,
        boxShadow: `0 0 22px ${a(color, 0.30)}, inset 0 2px 0 ${a('#FFFFFF', 0.26)}`,
      }} />
    </div>
  );
};

/** Real-world bill/invoice. Labels are explanatory, not a generic UI card. */
export const PhysicalBill: React.FC<{
  x: number;
  y: number;
  amount: string;
  label?: string;
  rotate?: number;
  scale?: number;
  opacity?: number;
  paid?: boolean;
}> = ({x, y, amount, label = 'Rechnung', rotate = -4, scale = 1, opacity = 1, paid = false}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: 250, height: 330,
    borderRadius: 18,
    background: 'linear-gradient(155deg,#FFFDF7 0%,#E9E3D7 78%,#BDB5A6 100%)',
    border: '2px solid rgba(255,255,255,0.55)',
    boxShadow: '0 34px 56px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.92)',
    transform: `translateZ(42px) rotateX(5deg) rotateY(-7deg) rotateZ(${rotate}deg) scale(${scale})`,
    opacity,
    color: '#172019',
    padding: '30px 28px',
  }}>
    <div style={{fontSize: 28, fontWeight: 900, letterSpacing: 0.2}}>{label}</div>
    <div style={{height: 13, width: '72%', marginTop: 28, borderRadius: 8, background: '#B9B5AA'}} />
    <div style={{height: 10, width: '88%', marginTop: 13, borderRadius: 8, background: '#D1CCC0'}} />
    <div style={{height: 10, width: '58%', marginTop: 13, borderRadius: 8, background: '#D1CCC0'}} />
    <div style={{marginTop: 42, fontSize: 42, fontWeight: 950, color: paid ? '#0C7A47' : '#B9422D'}}>{amount}</div>
    {paid ? (
      <div style={{
        position: 'absolute', right: 20, bottom: 24, padding: '9px 13px',
        border: '4px solid #0C7A47', borderRadius: 10, color: '#0C7A47',
        fontSize: 24, fontWeight: 950, transform: 'rotate(-8deg)',
      }}>BEZAHLT</div>
    ) : null}
  </div>
);

/** Recognizable current/savings account slab, intentionally not an app UI. */
export const PhysicalAccount: React.FC<{
  x: number;
  y: number;
  label: string;
  balance?: string;
  state?: 'normal' | 'protected' | 'danger';
  scale?: number;
  opacity?: number;
  tilt?: number;
}> = ({x, y, label, balance, state = 'normal', scale = 1, opacity = 1, tilt = 0}) => {
  const palette = state === 'danger'
    ? {face:'#8E281F', edge:'#4B120E', rim:'#FF8A68', text:C.white}
    : state === 'protected'
      ? {face:'#0A6B40', edge:'#043B25', rim:'#68FFB5', text:C.white}
      : {face:'#D6D0C3', edge:'#787267', rim:'#FFF8E8', text:'#142019'};
  return (
    <div style={{
      position: 'absolute', left:x, top:y, width:310, height:190, borderRadius:34,
      background:`linear-gradient(145deg,${palette.rim} 0%,${palette.face} 14%,${palette.face} 74%,${palette.edge} 100%)`,
      border:`1px solid ${a(palette.rim,0.48)}`,
      boxShadow:'0 30px 54px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.30)',
      transform:`translateZ(32px) rotateX(5deg) rotateY(-8deg) rotateZ(${tilt}deg) scale(${scale})`,
      opacity, color:palette.text, padding:'32px 34px', overflow:'hidden',
    }}>
      <div style={{fontSize:28,fontWeight:900}}>{label}</div>
      {balance ? <div style={{marginTop:28,fontSize:40,fontWeight:950}}>{balance}</div> : null}
      <div style={{position:'absolute',right:28,bottom:28,width:58,height:38,borderRadius:10,border:`3px solid ${a(palette.text,0.62)}`}} />
    </div>
  );
};

/** Everyday washing machine used for concrete emergency scenarios. */
export const PhysicalWasher: React.FC<{
  x: number;
  y: number;
  broken?: boolean;
  scale?: number;
  opacity?: number;
}> = ({x, y, broken = false, scale = 1, opacity = 1}) => (
  <div style={{
    position:'absolute', left:x, top:y, width:290, height:360, borderRadius:34,
    background:'linear-gradient(145deg,#FFFFFF 0%,#D9DDE0 52%,#8E969C 100%)',
    border:'2px solid rgba(255,255,255,0.58)',
    boxShadow:'0 34px 58px rgba(0,0,0,0.48), inset 0 2px 0 rgba(255,255,255,0.85)',
    transform:`translateZ(36px) rotateX(4deg) rotateY(-8deg) scale(${scale})`,
    opacity,
  }}>
    <div style={{position:'absolute',left:28,top:28,width:96,height:24,borderRadius:8,background:'#AEB5B9'}} />
    <div style={{position:'absolute',right:31,top:25,width:38,height:38,borderRadius:'50%',background:broken?'#FF6048':'#5CFFAD',boxShadow:broken?'0 0 18px rgba(255,70,50,0.45)':'0 0 14px rgba(0,210,106,0.35)'}} />
    <div style={{
      position:'absolute',left:54,top:105,width:182,height:182,borderRadius:'50%',
      background:'radial-gradient(circle at 42% 38%,#4C5961 0%,#1D262B 42%,#071014 62%,#BFC6C9 64%,#7B8387 73%,#C9CFD1 76%)',
      boxShadow:'inset 0 0 18px rgba(0,0,0,0.62), 0 8px 18px rgba(0,0,0,0.28)',
    }} />
    {broken ? <div style={{position:'absolute',left:92,bottom:-20,width:110,height:34,borderRadius:'50%',background:'rgba(62,158,221,0.52)',boxShadow:'0 0 20px rgba(62,158,221,0.22)'}} /> : null}
  </div>
);

/** Physical emergency-fund container with an actual fill level. */
export const PhysicalReserveTank: React.FC<{
  x: number;
  y: number;
  fill: number;
  label?: string;
  width?: number;
  height?: number;
  scale?: number;
  opacity?: number;
}> = ({x, y, fill, label = 'Notgroschen', width = 250, height = 360, scale = 1, opacity = 1}) => {
  const clamped = Math.max(0, Math.min(1, fill));
  return (
    <div style={{
      position:'absolute',left:x,top:y,width,height,borderRadius:42,
      border:'7px solid #D8E0D8',
      background:'linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025))',
      boxShadow:'0 34px 60px rgba(0,0,0,0.46), inset 0 0 28px rgba(255,255,255,0.10)',
      transform:`translateZ(40px) rotateX(4deg) rotateY(-6deg) scale(${scale})`,
      overflow:'hidden', opacity,
    }}>
      <div style={{
        position:'absolute',left:0,right:0,bottom:0,height:`${clamped*100}%`,
        background:'linear-gradient(180deg,#FFE59B 0%,#D5A72A 48%,#7A5610 100%)',
        boxShadow:'inset 0 8px 16px rgba(255,255,255,0.32)',
      }} />
      <div style={{position:'absolute',left:16,right:16,top:18,textAlign:'center',fontSize:27,fontWeight:950,color:C.white,textShadow:'0 2px 8px rgba(0,0,0,0.75)'}}>{label}</div>
    </div>
  );
};

/** Calendar page for visibly repeated monthly saving actions. */
export const PhysicalCalendarPage: React.FC<{
  x: number;
  y: number;
  month: string;
  amount?: string;
  scale?: number;
  opacity?: number;
  rotate?: number;
}> = ({x, y, month, amount, scale = 1, opacity = 1, rotate = 0}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:210,height:235,borderRadius:24,
    background:'linear-gradient(155deg,#FFFDF7,#DCD8CE)',color:'#172019',
    boxShadow:'0 28px 48px rgba(0,0,0,0.42)',
    transform:`translateZ(30px) rotateZ(${rotate}deg) scale(${scale})`,opacity,
    overflow:'hidden',
  }}>
    <div style={{height:52,background:'#0C7A47',color:C.white,fontWeight:950,fontSize:25,display:'flex',alignItems:'center',justifyContent:'center'}}>{month}</div>
    <div style={{fontSize:66,fontWeight:950,textAlign:'center',marginTop:26}}>01</div>
    {amount ? <div style={{fontSize:30,fontWeight:950,textAlign:'center',color:'#7A5610',marginTop:7}}>{amount}</div> : null}
  </div>
);

/** Compact coin stack; count is visual and does not imply a precise euro value. */
export const PhysicalCoinStack: React.FC<{
  x: number;
  y: number;
  count?: number;
  scale?: number;
  opacity?: number;
}> = ({x, y, count = 5, scale = 1, opacity = 1}) => (
  <div style={{position:'absolute',left:x,top:y,width:150,height:170,transform:`translateZ(46px) scale(${scale})`,opacity}}>
    {Array.from({length: Math.max(1, Math.min(7, count))}, (_, index) => (
      <div key={index} style={{
        position:'absolute',left:12,bottom:index*18,width:126,height:38,borderRadius:'50%',
        background:'linear-gradient(180deg,#FFEAA5 0%,#E2B432 38%,#9A6D13 100%)',
        border:'2px solid #FFE59B',boxShadow:'0 9px 12px rgba(0,0,0,0.24)',
      }} />
    ))}
  </div>
);

export const PremiumDepthGuide = {
  visualTop: REEL_STYLE.visual.top,
  visualBottom: REEL_STYLE.visual.bottom,
  supportingObjectCountFlexible: true,
  supportingObjectsOnlyWhenHelpful: true,
  clarityBeforeObjectCount: true,
  contentFirstComposition: true,
  realWorldMechanismFirst: true,
  genericCardRowsForbidden: true,
  progressBarAsPrimaryStoryForbidden: true,
} as const;
