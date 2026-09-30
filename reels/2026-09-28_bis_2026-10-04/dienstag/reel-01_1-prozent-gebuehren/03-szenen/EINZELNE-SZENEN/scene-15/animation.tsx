import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS,C,FONT,SceneShell,pct} from '../../../05-projektdateien/animation-shared';

// MECHANIC_ID: widening-return-gap
// PRIMARY_ACTION: two trajectories separate until the gap itself becomes the focal object.
// START -> MECHANISM -> RESULT | HERO: two return paths | SUPPORT: widening gap marker | MATERIAL: thick luminous paths | DEPTH: layered path separation
export const FeesScene15Animation:React.FC=()=>{const frame=useCurrentFrame();const p=pct(frame,20,130);const gap=70+p*320;return <SceneShell title="Der Abstand beschleunigt" caption="Je länger die Laufzeit, desto stärker können beide Vermögenspfade auseinanderlaufen."><svg style={{position:'absolute',left:80,top:90,width:920,height:780,overflow:'visible'}} viewBox="0 0 920 780"><path d="M 90 650 C 260 620, 440 500, 820 110" fill="none" stroke={ANIMATION_COLORS.positive} strokeWidth="22" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/><path d={`M 90 650 C 260 635, 440 ${545+gap*.08}, 820 ${250+gap*.26}`} fill="none" stroke={C.gold} strokeWidth="22" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/><line x1="805" y1="135" x2="805" y2={250+gap*.26} stroke={ANIMATION_COLORS.warning} strokeWidth="6" strokeDasharray="14 12" opacity={pct(frame,100,130)}/></svg><div style={{position:'absolute',right:120,top:560,fontFamily:FONT.title,fontSize:50,fontWeight:950,color:ANIMATION_COLORS.warning,opacity:pct(frame,100,130)}}>Abstand wächst</div></SceneShell>};
