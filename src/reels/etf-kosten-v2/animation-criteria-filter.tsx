import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {C,FONT,a} from '../../brand';
import {ETF_COST_COPY} from './config';
import {LabelPill,SceneShell} from './layout';

const CLAMP={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const phase=(f:number,d:number,s:number,e:number)=>interpolate(f,[d*s,d*e],[0,1],CLAMP);

export const SelectionFilterAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
 const frame=useCurrentFrame();
 const progress=phase(frame,durationInFrames,.04,.90);
 const labels=['INDEX','STREUUNG','KOSTEN','FONDSGRÖSSE','ZIEL'];
 const objectY=75+790*progress;
 return <SceneShell copy={ETF_COST_COPY[8]}>
  <div style={{position:'absolute',left:465,top:objectY,width:150,height:110,borderRadius:55,border:`3px solid ${a(C.goldLt,.75)}`,background:`radial-gradient(circle at 35% 30%,${a(C.goldLt,.35)},${a(C.accent,.12)})`,display:'grid',placeItems:'center',zIndex:20,boxShadow:`0 0 32px ${a(C.gold,.2)}`}}><div style={{fontFamily:FONT.title,fontSize:30,color:C.white}}>FONDS</div></div>
  {labels.map((label,i)=>{const cy=175+i*165;const local=phase(frame,durationInFrames,.09+i*.14,.22+i*.14);const passed=progress>(i+1)/6;const color=passed?C.accentLt:C.gray;return <React.Fragment key={label}><div style={{position:'absolute',left:235,top:cy-7,width:610,height:14,borderRadius:10,background:a(color,.18)}}/><div style={{position:'absolute',left:205,top:cy-54,width:670,height:108,borderRadius:54,border:`3px solid ${a(color,.42+.38*local)}`,opacity:.35+.65*local,boxShadow:passed?`0 0 24px ${a(C.accent,.16)}`:'none'}}/><div style={{position:'absolute',left:52,top:cy-22,width:140,textAlign:'right',fontFamily:FONT.body,fontWeight:900,fontSize:22,color}}>{label}</div><div style={{position:'absolute',right:50,top:cy-22,fontFamily:FONT.body,fontWeight:900,fontSize:22,color:passed?C.accentLt:C.gray}}>{passed?'GEPRÜFT':'…'}</div></React.Fragment>})}
  <div style={{position:'absolute',left:295,top:920,width:490,textAlign:'center',opacity:phase(frame,durationInFrames,.82,.98)}}><LabelPill kind="green">GESAMTBILD STATT EINER EINZELNEN ZAHL</LabelPill></div>
 </SceneShell>;
};
