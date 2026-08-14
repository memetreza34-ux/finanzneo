import React from 'react';
import {AbsoluteFill} from 'remotion';

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

/** Native Remotion animation content area only — never wrap user images in this. */
export const VisualStage:React.FC<React.PropsWithChildren> = ({children}) => (
  <div style={{position:'absolute',top:LAYOUT.visualTop,left:0,right:0,height:LAYOUT.visualBottom-LAYOUT.visualTop,overflow:'hidden'}}>
    {children}
  </div>
);
