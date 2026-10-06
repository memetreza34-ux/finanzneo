import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {YouTubeSectionFrame} from '../../../../../src/design-system/youtube-stage';
export const MECHANIC_ID='true-cost-takeaway';
export const VISUAL_TECHNIQUE_ID='purchase-price-expands';
export const COMPOSITION_FAMILY_ID='summary';
export const ANIMATION_NARRATIVE={"START":"Kaufpreis","MECHANISM":"Faktoren hinzu","RESULT":"Gesamtkosten"};

export const YouTubeVisual08Animation:React.FC=()=>{const f=useCurrentFrame();const p=interpolate(f,[12,30],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const xs=['Nutzung','Haltbarkeit','Reparierbarkeit'];return <YouTubeSectionFrame title="Was wirklich zählt" icon="target"><AbsoluteFill style={{padding:'72px 90px',boxSizing:'border-box',fontFamily:'Arial',color:'#F4F0E8',justifyContent:'center',alignItems:'center'}}><div style={{fontSize:58,fontWeight:800,transform:`scale(${1-.12*p}) translateY(${-70*p}px)`}}>Kaufpreis</div><div style={{display:'flex',gap:24,marginTop:30}}>{xs.map((x,i)=>{const q=interpolate(f,[36+i*14,48+i*14],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div key={x} style={{fontSize:31,padding:'22px 26px',border:'2px solid #333',borderRadius:20,opacity:q}}>{x}</div>})}</div><div style={{fontSize:46,fontWeight:800,color:'#2FCB8B',marginTop:56,opacity:interpolate(f,[82,100],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>Nicht nur heute billig. Insgesamt günstig.</div></AbsoluteFill></YouTubeSectionFrame>};
