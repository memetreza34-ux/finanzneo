import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const MECHANIC_ID = "physical-replication-assembly";
export const VISUAL_TECHNIQUE_ID = "threejs-weighted-portfolio-build";
export const COMPOSITION_FAMILY_ID = "spatial-3d";
export const ANIMATION_NARRATIVE = {START:"empty fund tray", MECHANISM:"weighted securities assemble", RESULT:"complete physical portfolio"};
const C={bg:'#000000',green:'#22E08A',mint:'#9AF5CB',gold:'#F2C66D',red:'#FF6B4A',white:'#F7F5EF',muted:'#A9B3AE'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
import {ThreeCanvas} from '@remotion/three';

export const YouTubeVisual07Animation:React.FC=()=>{const f=useCurrentFrame();const {fps}=useVideoConfig();const p=interpolate(f,[0,90],[0,1],clamp);const s=spring({frame:f-8,fps,config:{damping:16}});return <AbsoluteFill style={{background:C.bg}}><ThreeCanvas width={1920} height={1080} camera={{position:[0,0,8],fov:42}}><ambientLight intensity={1.2}/><directionalLight position={[4,6,8]} intensity={2}/><group rotation={[0,p*0.45,0]} scale={0.85+0.15*s}><mesh position={[-2.4,0,0]}><boxGeometry args={[2.2,1.2,0.45]}/><meshStandardMaterial color={C.green}/></mesh><mesh position={[0,0,0.5]}><boxGeometry args={[2.5,1.45,0.5]}/><meshStandardMaterial color={C.gold}/></mesh><mesh position={[2.5,0,0]}><boxGeometry args={[2.2,1.2,0.45]}/><meshStandardMaterial color={C.mint}/></mesh></group></ThreeCanvas><div style={{position:'absolute',bottom:90,width:'100%',textAlign:'center',fontSize:48,fontWeight:800,color:C.white}}>Build a tangible 3D portfolio from weighted securities that represent the index.</div></AbsoluteFill>};
