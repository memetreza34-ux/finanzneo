import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../../brand';
import type {AccentTone, ZinseszinsIcon, SceneCopy} from './config';
import {LAYOUT, clamp01, clampInput, SceneBackground, VisualStage, WorldStage} from '../notgroschen/shared';

const iconPaths: Record<ZinseszinsIcon, React.ReactNode> = {
  compare: <><path d="M12 24v20M52 24v20M22 34h20M12 24l-4 4M12 24l4 4M52 24l-4 4M52 24l4 4" /></>,
  equals: <><path d="M16 26h32M16 38h32" /></>,
  growth: <><path d="M12 52V12M12 52h40M20 40l10-14 10 6 12-16" /></>,
  calculator: <><rect x="14" y="7" width="36" height="50" rx="6"/><path d="M21 15h22v10H21zM22 34h4M32 34h4M42 34h1M22 44h4M32 44h4M42 44h1"/></>,
  clock: <><circle cx="32" cy="32" r="24"/><path d="M32 16v16l10 10"/></>,
  calendar: <><rect x="8" y="13" width="48" height="43" rx="7"/><path d="M18 7v12M46 7v12M8 25h48M18 35h7M30 35h7M42 35h5M18 46h7M30 46h7"/></>,
  bars: <><path d="M16 52V30M32 52V16M48 52V24" /></>,
  time: <><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12.2 12.2l5.6 5.6M46.2 46.2l5.6 5.6M12.2 51.8l5.6-5.6M46.2 12.2l5.6 5.6M32 32l10-10" /></>,
  warning: <><path d="M32 8 57 54H7L32 8Z"/><path d="M32 23v15M32 46h.1"/></>,
  hourglass: <><path d="M16 8h32M16 56h32M20 8l12 20-12 20v8h24v-8L32 28l12-20V8H20z" /></>,
};

const toneColor=(tone:AccentTone|undefined)=>tone==='gold'?C.goldLt:tone==='red'?'#FF3333':C.accentLt;

export const Headline:React.FC<{copy:SceneCopy}> = ({copy}) => (
  <div style={{position:'absolute',top:LAYOUT.headlineTop,left:58,right:58,zIndex:30,textAlign:'center',textShadow:'0 3px 10px rgba(0,0,0,.82),0 0 26px rgba(0,0,0,.5)'}}>
    <div style={{fontFamily:FONT.title,fontSize:54,lineHeight:1.02,letterSpacing:1.4,color:C.white}}>{copy.headline}</div>
    <div style={{marginTop:8,display:'flex',alignItems:'center',justifyContent:'center',gap:14,color:toneColor(copy.accentTone)}}>
      <svg width="50" height="50" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{iconPaths[copy.icon]}</svg>
      <div style={{fontFamily:FONT.title,fontSize:54,lineHeight:1.02,letterSpacing:1.3}}>{copy.accent}</div>
    </div>
  </div>
);
