import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT} from '../../brand';

export const CREDIT_LAYOUT={headerTop:48,headerBottom:232,visualTop:242,visualBottom:1390,captionBottom:430,captionLeft:72,captionRight:170} as const;

export const CreditBackground:React.FC=()=> <AbsoluteFill style={{background:'radial-gradient(circle at 50% 43%,#173221 0%,#07170e 50%,#020805 100%)'}}/>;

export const CreditHeader:React.FC<{headline:string;subheadline:string}>=({headline,subheadline})=><div style={{position:'absolute',left:62,right:82,top:CREDIT_LAYOUT.headerTop,height:CREDIT_LAYOUT.headerBottom-CREDIT_LAYOUT.headerTop,zIndex:30,display:'flex',flexDirection:'column',justifyContent:'center'}}><div style={{fontFamily:FONT.heading,fontSize:64,lineHeight:.93,fontWeight:900,letterSpacing:-1.2,color:C.white,textTransform:'uppercase',textShadow:'0 4px 20px rgba(0,0,0,.58)'}}>{headline}</div><div style={{fontFamily:FONT.body,fontSize:31,lineHeight:1.13,fontWeight:700,color:C.graySoft,marginTop:13,maxWidth:900,textShadow:'0 3px 14px rgba(0,0,0,.48)'}}>{subheadline}</div></div>;

export const CreditVisualViewport:React.FC<{children:React.ReactNode}>=({children})=><div style={{position:'absolute',left:0,right:0,top:CREDIT_LAYOUT.visualTop,height:CREDIT_LAYOUT.visualBottom-CREDIT_LAYOUT.visualTop,overflow:'hidden',zIndex:10}}>{children}</div>;

const mockData={hook:['1.500 €','50 €'],split:['50 €','22,50 € + 27,50 €'],cost:['1.500 €','+ 508 €'],check:['EFFEKTIVZINS','RATE · VOLLZAHLUNG']} as const;
export const StoryboardImageMock:React.FC<{kind:keyof typeof mockData}>=({kind})=>{const d=mockData[kind];return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}><div style={{width:980,height:1020,display:'flex',alignItems:'center',justifyContent:'space-around'}}><div style={{width:400,height:400,borderRadius:100,background:'linear-gradient(145deg,#ffe79a,#bf7d00)',boxShadow:'0 38px 90px rgba(255,200,61,.26)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.heading,fontSize:64,fontWeight:900,color:'#1b1100',textAlign:'center',padding:28}}>{d[0]}</div><div style={{width:420,height:360,borderRadius:90,background:'linear-gradient(145deg,rgba(255,100,80,.92),rgba(130,15,40,.96))',boxShadow:'0 38px 90px rgba(176,16,48,.28)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.heading,fontSize:46,fontWeight:900,color:C.white,textAlign:'center',padding:30}}>{d[1]}</div></div><div style={{position:'absolute',bottom:470,fontFamily:FONT.body,fontSize:22,color:C.grayDk}}>STORYBOARD-MOCK · finales Google-Flow-Bild erforderlich</div></AbsoluteFill>};

export const CreditFlowImage:React.FC<{scene:number;storyboard?:boolean;mockKind:keyof typeof mockData}>=({scene,storyboard=false,mockKind})=>{if(storyboard)return <StoryboardImageMock kind={mockKind}/>;const file=String(scene).padStart(2,'0');return <Img src={staticFile(`reels/kreditkarte-teilzahlung/scene-${file}.png`)} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'center'}}/>};

export const CreditSceneShell:React.FC<{headline:string;subheadline:string;children:React.ReactNode;fullFrameVisual?:boolean}>=({headline,subheadline,children,fullFrameVisual=false})=><AbsoluteFill><CreditBackground/>{fullFrameVisual?<AbsoluteFill style={{zIndex:10,overflow:'hidden'}}>{children}</AbsoluteFill>:<CreditVisualViewport>{children}</CreditVisualViewport>}<CreditHeader headline={headline} subheadline={subheadline}/></AbsoluteFill>;
