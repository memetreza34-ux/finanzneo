import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from '../../brand';

export const INFLATION_LAYOUT = {
  headerTop: 48,
  headerBottom: 232,
  visualTop: 242,
  visualBottom: 1390,
  captionBottom: 430,
  captionLeft: 72,
  captionRight: 170,
} as const;

export const InflationBackground: React.FC = () => (
  <AbsoluteFill style={{background:'radial-gradient(circle at 50% 43%, #123a25 0%, #07180f 49%, #020805 100%)'}} />
);

export const InflationHeader: React.FC<{headline:string; subheadline:string}> = ({headline,subheadline}) => (
  <div style={{position:'absolute',left:62,right:82,top:INFLATION_LAYOUT.headerTop,height:INFLATION_LAYOUT.headerBottom-INFLATION_LAYOUT.headerTop,zIndex:30,display:'flex',flexDirection:'column',justifyContent:'center'}}>
    <div style={{fontFamily:FONT.heading,fontSize:64,lineHeight:0.93,fontWeight:900,letterSpacing:-1.25,color:C.white,textTransform:'uppercase',textShadow:'0 4px 20px rgba(0,0,0,.58)'}}>{headline}</div>
    <div style={{fontFamily:FONT.body,fontSize:31,lineHeight:1.13,fontWeight:700,color:C.graySoft,marginTop:13,maxWidth:900,textShadow:'0 3px 14px rgba(0,0,0,.48)'}}>{subheadline}</div>
  </div>
);

export const InflationVisualViewport: React.FC<{children:React.ReactNode}> = ({children}) => (
  <div style={{position:'absolute',left:0,right:0,top:INFLATION_LAYOUT.visualTop,height:INFLATION_LAYOUT.visualBottom-INFLATION_LAYOUT.visualTop,overflow:'hidden',zIndex:10}}>{children}</div>
);

const mockConfigs = {
  hook:{left:'10.000 €',right:'VOLLER WARENKORB'},
  nominal:{left:'10.000 €',right:'PREISE STEIGEN'},
  basket:{left:'100 €',right:'WENIGER WAREN'},
  close:{left:'EURO',right:'KAUFKRAFT'},
} as const;

export const StoryboardImageMock: React.FC<{kind:keyof typeof mockConfigs}> = ({kind}) => {
  const cfg=mockConfigs[kind];
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:950,height:820,position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 46px'}}>
      <div style={{width:390,height:390,borderRadius:92,background:'linear-gradient(145deg,#ffe39a,#c98c12)',boxShadow:'0 38px 90px rgba(255,200,61,.28)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.heading,fontSize:64,fontWeight:900,color:'#1b1405',textAlign:'center'}}>{cfg.left}</div>
      <div style={{width:420,height:340,borderRadius:'50px 50px 120px 120px',border:`14px solid ${kind==='nominal'?C.negativeLt:C.accentLt}`,background:'linear-gradient(180deg,rgba(255,255,255,.11),rgba(255,255,255,.025))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.body,fontSize:42,fontWeight:900,color:C.white,textAlign:'center',padding:28,boxShadow:'0 32px 90px rgba(0,0,0,.3)'}}>{cfg.right}</div>
    </div>
    <div style={{position:'absolute',bottom:470,fontFamily:FONT.body,fontSize:22,color:C.grayDk}}>STORYBOARD-MOCK · finales Google-Flow-Bild erforderlich</div>
  </AbsoluteFill>;
};

export const InflationFlowImage: React.FC<{scene:number; storyboard?:boolean; mockKind:keyof typeof mockConfigs}> = ({scene,storyboard=false,mockKind}) => {
  if(storyboard) return <StoryboardImageMock kind={mockKind}/>;
  const file=String(scene).padStart(2,'0');
  return <Img src={staticFile(`reels/inflation-kaufkraft/scene-${file}.png`)} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'center center'}}/>;
};

export const InflationSceneShell: React.FC<{headline:string;subheadline:string;children:React.ReactNode;fullFrameVisual?:boolean}> = ({headline,subheadline,children,fullFrameVisual=false}) => (
  <AbsoluteFill>
    <InflationBackground/>
    {fullFrameVisual?
      <AbsoluteFill style={{zIndex:10,overflow:'hidden'}}>{children}</AbsoluteFill>:
      <InflationVisualViewport>{children}</InflationVisualViewport>
    }
    <InflationHeader headline={headline} subheadline={subheadline}/>
  </AbsoluteFill>
);
