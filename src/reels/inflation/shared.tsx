import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from '../../brand';

export const INFLATION_LAYOUT = {
  headerTop: 56,
  headerBottom: 250,
  visualTop: 300,
  visualBottom: 1320,
  captionBottom: 320,
  captionLeft: 72,
  captionRight: 180,
} as const;

export const InflationBackground: React.FC = () => (
  <AbsoluteFill style={{background:'radial-gradient(circle at 50% 44%, #113421 0%, #07160d 50%, #020805 100%)'}} />
);

export const InflationHeader: React.FC<{headline:string; subheadline:string}> = ({headline,subheadline}) => (
  <div style={{position:'absolute',left:66,right:90,top:INFLATION_LAYOUT.headerTop,height:INFLATION_LAYOUT.headerBottom-INFLATION_LAYOUT.headerTop,zIndex:30,display:'flex',flexDirection:'column',justifyContent:'center'}}>
    <div style={{fontFamily:FONT.heading,fontSize:62,lineHeight:0.94,fontWeight:900,letterSpacing:-1.2,color:C.white,textTransform:'uppercase',textShadow:'0 4px 18px rgba(0,0,0,.55)'}}>{headline}</div>
    <div style={{fontFamily:FONT.body,fontSize:30,lineHeight:1.15,fontWeight:700,color:C.graySoft,marginTop:14,maxWidth:900}}>{subheadline}</div>
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
    <div style={{width:850,height:650,position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 70px'}}>
      <div style={{width:300,height:300,borderRadius:70,background:'linear-gradient(145deg,#ffe39a,#c98c12)',boxShadow:'0 30px 70px rgba(255,200,61,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.heading,fontSize:50,fontWeight:900,color:'#1b1405',textAlign:'center'}}>{cfg.left}</div>
      <div style={{width:340,height:270,borderRadius:'40px 40px 100px 100px',border:`12px solid ${kind==='nominal'?C.negativeLt:C.accentLt}`,background:'linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.02))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.body,fontSize:34,fontWeight:900,color:C.white,textAlign:'center',padding:26}}>{cfg.right}</div>
    </div>
    <div style={{position:'absolute',bottom:28,fontFamily:FONT.body,fontSize:22,color:C.grayDk}}>STORYBOARD-MOCK · finales Google-Flow-Bild erforderlich</div>
  </AbsoluteFill>;
};

export const InflationFlowImage: React.FC<{scene:number; storyboard?:boolean; mockKind:keyof typeof mockConfigs}> = ({scene,storyboard=false,mockKind}) => {
  if(storyboard) return <StoryboardImageMock kind={mockKind}/>;
  const file=String(scene).padStart(2,'0');
  return <Img src={staticFile(`reels/inflation-kaufkraft/scene-${file}.png`)} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'center center'}}/>;
};

export const InflationSceneShell: React.FC<{headline:string;subheadline:string;children:React.ReactNode}> = ({headline,subheadline,children}) => (
  <AbsoluteFill>
    <InflationBackground/>
    <InflationHeader headline={headline} subheadline={subheadline}/>
    <InflationVisualViewport>{children}</InflationVisualViewport>
  </AbsoluteFill>
);
