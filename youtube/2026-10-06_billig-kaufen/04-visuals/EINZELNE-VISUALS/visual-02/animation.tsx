import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';
export const MECHANIC_ID='repeat-purchase-cost';
export const VISUAL_TECHNIQUE_ID='two-purchases-vs-one';
export const COMPOSITION_FAMILY_ID='comparison-math';
export const ANIMATION_NARRATIVE={"START":"20 € einmal","MECHANISM":"zweiter Kauf","RESULT":"40 € vs 35 €"};

export const YouTubeVisual02Animation:React.FC=()=>{const f=useCurrentFrame();const a=interpolate(f,[28,44],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const b=interpolate(f,[60,76],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <YouTubeSectionFrame title="Wenn du zweimal kaufen musst" icon="repeat"><AbsoluteFill style={{padding:'56px 70px',boxSizing:'border-box',fontFamily:'Arial',color:'#F4F0E8'}}><div style={{display:'flex',gap:28,height:'100%'}}><div style={{flex:1,border:'2px solid #333',borderRadius:28,padding:40}}><div style={{fontSize:30,color:'#A7A7A7'}}>Günstiges Paar</div><div style={{fontSize:62,fontWeight:700,marginTop:60}}>20 €</div><div style={{fontSize:46,opacity:a,marginTop:24}}>+ 20 €</div><div style={{fontSize:72,fontWeight:800,color:'#E66B4E',marginTop:34}}>40 €</div></div><div style={{flex:1,border:'2px solid #333',borderRadius:28,padding:40,opacity:b}}><div style={{fontSize:30,color:'#A7A7A7'}}>Anderes Paar</div><div style={{fontSize:72,fontWeight:800,color:'#2FCB8B',marginTop:130}}>35 €</div><div style={{fontSize:26,color:'#A7A7A7',marginTop:24}}>Beispiel: kein Ersatzkauf</div></div></div></AbsoluteFill></YouTubeSectionFrame>};
