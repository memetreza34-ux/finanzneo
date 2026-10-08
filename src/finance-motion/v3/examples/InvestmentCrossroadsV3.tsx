import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../../brand';
import {
  EditorialSceneV3,
  PersonV3,
  MOTION_V3,
  DrawnPathV3,
  PathFollowerV3,
  progress,
  editorialSpring,
  CLAMP,
} from '..';

export const INVESTMENT_CROSSROADS_V3_FRAMES=210;

const BankDestination:React.FC<{x:number;y:number;opacity:number}> = ({x,y,opacity}) => (
  <div style={{position:'absolute',left:x,top:y,width:220,height:170,opacity}}>
    <svg width="220" height="170" viewBox="0 0 220 170">
      <path d="M25 60 L110 18 L195 60" fill="none" stroke={MOTION_V3.blue} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      {[48,90,132,174].map((x)=><rect key={x} x={x-12} y="68" width="24" height="62" rx="7" fill="#C9D7DE"/>)}
      <rect x="28" y="130" width="164" height="18" rx="9" fill={MOTION_V3.blue}/>
    </svg>
  </div>
);

const GrowthDestination:React.FC<{x:number;y:number;growth:number;opacity:number}> = ({x,y,growth,opacity}) => (
  <div style={{position:'absolute',left:x,top:y,width:220,height:210,opacity}}>
    <svg width="220" height="210" viewBox="0 0 220 210">
      <path d="M110 184 C 108 145 111 105 112 62" fill="none" stroke={MOTION_V3.greenDark} strokeWidth="12" strokeLinecap="round"/>
      <path d="M108 118 C 72 88 48 94 40 122 C 69 137 91 135 108 118 Z" fill={MOTION_V3.green} opacity={0.4+0.6*growth}/>
      <path d="M113 95 C 145 63 173 70 181 98 C 156 116 135 115 113 95 Z" fill={MOTION_V3.green} opacity={0.4+0.6*growth}/>
      <circle cx="112" cy="45" r={20+growth*20} fill={MOTION_V3.gold}/>
    </svg>
  </div>
);

export const InvestmentCrossroadsV3:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();

  const person=editorialSpring(frame,8,fps,'soft');
  const split=progress(frame,32,76,Easing.inOut(Easing.cubic));
  const leftTravel=progress(frame,72,132,Easing.inOut(Easing.cubic));
  const rightTravel=progress(frame,72,132,Easing.inOut(Easing.cubic));
  const destinations=progress(frame,112,142);
  const result=progress(frame,142,170);
  const growth=progress(frame,130,174,Easing.out(Easing.cubic));

  const leftPath='M 540 960 C 450 860 350 765 250 675';
  const rightPath='M 540 960 C 635 855 735 760 835 675';

  return <EditorialSceneV3 surface="paper" safePadding={0}>
    <PersonV3 x={480} y={840} scale={0.8+0.2*person} opacity={person}/>

    <div style={{
      position:'absolute',left:430,top:780,width:220,textAlign:'center',
      fontFamily:FONT.title,fontSize:40,fontWeight:900,color:MOTION_V3.ink,
      opacity:person,
    }}>10.000 €</div>

    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:-70}}>
      <DrawnPathV3 d={leftPath} progress={split} stroke={MOTION_V3.blue} width={12}/>
      <DrawnPathV3 d={rightPath} progress={split} stroke={MOTION_V3.green} width={12}/>
    </svg>

    <PathFollowerV3 d={leftPath} progress={leftTravel} size={54} color={MOTION_V3.blue}>€</PathFollowerV3>
    <PathFollowerV3 d={rightPath} progress={rightTravel} size={54} color={MOTION_V3.greenDark}>€</PathFollowerV3>

    <BankDestination x={140} y={465} opacity={destinations}/>
    <GrowthDestination x={725} y={445} opacity={destinations} growth={growth}/>

    <div style={{position:'absolute',left:100,top:715,width:300,textAlign:'center',fontSize:27,fontWeight:850,color:MOTION_V3.blue,opacity:destinations}}>Konto</div>
    <div style={{position:'absolute',left:690,top:715,width:300,textAlign:'center',fontSize:27,fontWeight:850,color:MOTION_V3.greenDark,opacity:destinations}}>Investieren</div>

    <div style={{
      position:'absolute',left:120,top:1240,width:330,height:170,borderRadius:30,
      background:'#EEF2F4',border:`2px solid ${MOTION_V3.blue}`,opacity:result,
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
    }}>
      <div style={{fontSize:23,fontWeight:800,color:MOTION_V3.inkSoft}}>ohne Wachstum</div>
      <div style={{fontFamily:FONT.title,fontSize:50,fontWeight:900,color:MOTION_V3.blue}}>10.000 €</div>
    </div>

    <div style={{
      position:'absolute',right:120,top:1240,width:330,height:170,borderRadius:30,
      background:'#E9F0EA',border:`2px solid ${MOTION_V3.green}`,opacity:result,
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      transform:`scale(${0.94+0.06*growth})`
    }}>
      <div style={{fontSize:23,fontWeight:800,color:MOTION_V3.inkSoft}}>mit Wachstum</div>
      <div style={{fontFamily:FONT.title,fontSize:50,fontWeight:900,color:MOTION_V3.greenDark}}>
        {Math.round(interpolate(growth,[0,1],[10000,18200],CLAMP)).toLocaleString('de-DE')} €
      </div>
    </div>
  </EditorialSceneV3>;
};

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: investment-crossroads
 * FOCAL_PATH: Person → Weggabelung → zwei Geldmarker → Bank und Wachstumspflanze → Endwerte.
 * PRIMARY_ACTION: Derselbe Ausgangsbetrag trennt sich sichtbar in zwei langfristig unterschiedliche Pfade.
 * CAMERA_ROLE: still — beide Wege müssen gleichzeitig vergleichbar bleiben.
 * PAYOFF: identischer Start endet bei 10.000 € versus sichtbar höherem Wachstumswert.
 *
 * ANIMATION_NARRATIVE
 * START: Eine Person steht an einer klaren Weggabelung.
 * MECHANISM: Ein Geldbetrag folgt beiden Wegen zu unterschiedlichen Zielbildern.
 * RESULT: Bankpfad bleibt flach; Investitionspfad wächst sichtbar weiter.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Weggabelung als einfache allgemeine Metapher.
 * SUPPORT: Person, Geldmarker, Bank, Wachstumspflanze und zwei Endwerte.
 * SURFACE: warmes Off-White.
 * SHAPE_LANGUAGE: illustrated 2D editorial scene.
 *
 * RESULT_HOLD_FRAMES = 32
 */
