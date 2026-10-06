import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';
export const MECHANIC_ID='cost-per-use-example';
export const VISUAL_TECHNIQUE_ID='fraction-to-unit-cost';
export const COMPOSITION_FAMILY_ID='data-comparison';
export const ANIMATION_NARRATIVE={"START":"zwei Preise","MECHANISM":"durch Nutzungen teilen","RESULT":"0,20 € vs 0,40 €"};

export const YouTubeVisual06Animation:React.FC=()=>{const f=useCurrentFrame();const r=interpolate(f,[38,62],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const rows=[['40 €','200 Nutzungen','0,20 € / Nutzung',true],['20 €','50 Nutzungen','0,40 € / Nutzung',false]] as const;return <YouTubeSectionFrame title="Kosten pro Nutzung" icon="calculator"><AbsoluteFill style={{padding:'72px 80px',boxSizing:'border-box',fontFamily:'Arial',color:'#F4F0E8',justifyContent:'center'}}>{rows.map(x=><div key={x[0]} style={{display:'grid',gridTemplateColumns:'1fr 70px 1.2fr 90px 1.5fr',alignItems:'center',gap:18,padding:'32px 28px',marginBottom:24,border:'2px solid #333',borderRadius:24}}><div style={{fontSize:50,fontWeight:800}}>{x[0]}</div><div style={{fontSize:40,color:'#A7A7A7'}}>÷</div><div style={{fontSize:36}}>{x[1]}</div><div style={{fontSize:40,color:'#A7A7A7'}}>=</div><div style={{fontSize:42,fontWeight:800,opacity:r,color:x[3]?'#2FCB8B':'#E66B4E'}}>{x[2]}</div></div>)}<div style={{fontSize:23,color:'#A7A7A7'}}>Beispielrechnung, keine allgemeine Produktregel.</div></AbsoluteFill></YouTubeSectionFrame>};
