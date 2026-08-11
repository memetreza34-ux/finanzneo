import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, a} from '../../brand';
import type {AccentTone, NotgroschenIcon, SceneCopy} from './config';

/**
 * 1080x1920 cross-platform layout.
 * Image scenes themselves are full-frame. visualTop/visualBottom only define
 * the useful content area for native Remotion animation scenes.
 */
export const LAYOUT = {
  headlineTop: 72,
  visualTop: 220,
  visualBottom: 1490,
  subtitleBottom: 300,
  subtitleLeft: 64,
  subtitleRight: 156,
  platformUiSafeBottom: 260,
} as const;

export const clampInput={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const clamp01=(value:number)=>Math.max(0,Math.min(1,value));

const iconPaths: Record<NotgroschenIcon, React.ReactNode> = {
  warning:<><path d="M32 8 57 54H7L32 8Z"/><path d="M32 23v15M32 46h.1"/></>,
  shield:<><path d="M32 7 53 15v15c0 14-8 23-21 28C19 53 11 44 11 30V15l21-8Z"/><path d="m22 32 7 7 14-16"/></>,
  range:<><path d="M9 18h46M14 18v28M50 18v28M18 46h28"/><circle cx="24" cy="33" r="5"/><circle cx="40" cy="33" r="5"/></>,
  coins:<><ellipse cx="26" cy="18" rx="15" ry="7"/><path d="M11 18v11c0 4 7 7 15 7s15-3 15-7V18M17 39v7c0 4 7 7 15 7s15-3 15-7V35"/></>,
  steps:<><path d="M8 50h15V37h15V24h18"/><path d="m48 16 8 8-8 8"/></>,
  check:<><circle cx="32" cy="32" r="24"/><path d="m20 32 8 8 17-18"/></>,
  calculator:<><rect x="14" y="7" width="36" height="50" rx="6"/><path d="M21 15h22v10H21zM22 34h4M32 34h4M42 34h1M22 44h4M32 44h4M42 44h1"/></>,
  calendar:<><rect x="8" y="13" width="48" height="43" rx="7"/><path d="M18 7v12M46 7v12M8 25h48M18 35h7M30 35h7M42 35h5M18 46h7M30 46h7"/></>,
  bank:<><path d="m8 24 24-15 24 15H8ZM13 52h38M17 27v21M27 27v21M37 27v21M47 27v21"/></>,
  refresh:<><path d="M50 20a22 22 0 1 0 3 20M50 20V8M50 20H38"/></>,
};

/** One uninterrupted background for native Remotion scenes. */
export const SceneBackground:React.FC<React.PropsWithChildren> = ({children}) => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(92% 62% at 50% 38%, rgba(27,92,57,.36) 0%, rgba(8,30,19,.42) 38%, rgba(2,8,5,.98) 100%)',
      overflow:'hidden',
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * Seamless ambient decoration only. No floor, horizon, wall split or stage.
 */
export const WorldStage:React.FC = () => (
  <AbsoluteFill style={{overflow:'hidden',pointerEvents:'none'}}>
    <div style={{position:'absolute',left:-180,top:100,width:520,height:980,borderRadius:'50%',background:'radial-gradient(circle,rgba(52,255,142,.10),transparent 70%)',filter:'blur(28px)'}}/>
    <div style={{position:'absolute',right:-210,top:340,width:560,height:900,borderRadius:'50%',background:'radial-gradient(circle,rgba(79,255,158,.08),transparent 72%)',filter:'blur(32px)'}}/>
    <div style={{position:'absolute',left:'50%',top:80,width:760,height:980,transform:'translateX(-50%)',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(255,255,255,.025),transparent 70%)'}}/>
    <div style={{position:'absolute',left:100,top:170,width:5,height:760,borderRadius:8,background:'linear-gradient(180deg,transparent,rgba(75,255,153,.23),transparent)',boxShadow:'0 0 34px rgba(75,255,153,.12)'}}/>
    <div style={{position:'absolute',right:100,top:170,width:5,height:760,borderRadius:8,background:'linear-gradient(180deg,transparent,rgba(75,255,153,.23),transparent)',boxShadow:'0 0 34px rgba(75,255,153,.12)'}}/>
  </AbsoluteFill>
);

const toneColor=(tone:AccentTone|undefined)=>tone==='gold'?C.goldLt:tone==='red'?'#FF7777':C.accentLt;

export const Headline:React.FC<{copy:SceneCopy}> = ({copy}) => (
  <div style={{position:'absolute',top:LAYOUT.headlineTop,left:58,right:58,zIndex:30,textAlign:'center',textShadow:'0 3px 10px rgba(0,0,0,.82),0 0 26px rgba(0,0,0,.5)'}}>
    <div style={{fontFamily:FONT.title,fontSize:54,lineHeight:1.02,letterSpacing:1.4,color:C.white}}>{copy.headline}</div>
    <div style={{marginTop:8,display:'flex',alignItems:'center',justifyContent:'center',gap:14,color:toneColor(copy.accentTone)}}>
      <svg width="50" height="50" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{iconPaths[copy.icon]}</svg>
      <div style={{fontFamily:FONT.title,fontSize:54,lineHeight:1.02,letterSpacing:1.3}}>{copy.accent}</div>
    </div>
  </div>
);

/** Native Remotion animation content area only — never wrap user images in this. */
export const VisualStage:React.FC<React.PropsWithChildren> = ({children}) => (
  <div style={{position:'absolute',top:LAYOUT.visualTop,left:0,right:0,height:LAYOUT.visualBottom-LAYOUT.visualTop,overflow:'hidden'}}>
    {children}
  </div>
);
