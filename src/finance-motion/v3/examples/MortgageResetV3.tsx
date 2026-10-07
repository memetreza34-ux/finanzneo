import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../../brand';
import {
  CalendarV3,
  ContractV3,
  HouseV3,
  MOTION_V3,
  EditorialSceneV3,
  BigValueV3,
  FollowPathV3,
  progress,
  editorialSpring,
  CLAMP,
} from '..';

export const MORTGAGE_RESET_V3_FRAMES=210;

export const MortgageResetV3:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();

  const houseIn=editorialSpring(frame,6,fps,'soft');
  const contractIn=editorialSpring(frame,18,fps,'soft');
  const time=progress(frame,42,102,Easing.inOut(Easing.cubic));
  const calendarX=interpolate(time,[0,1],[120,770],CLAMP);
  const oldRateOut=progress(frame,106,126,Easing.in(Easing.cubic));
  const newRateIn=editorialSpring(frame,120,fps,'snappy');
  const paymentShift=progress(frame,132,164,Easing.inOut(Easing.cubic));
  const link=progress(frame,126,158,Easing.out(Easing.cubic));
  const finalHold=progress(frame,158,176);

  return <EditorialSceneV3 surface="cream">
    <HouseV3 x={70} y={650} scale={0.72+0.28*houseIn} opacity={houseIn}/>

    <div style={{
      position:'absolute',left:405,top:535,width:310,height:390,
      opacity:contractIn,transform:`translateY(${(1-contractIn)*28}px)`
    }}>
      <ContractV3
        x={0}
        y={0}
        title="Zinsbindung"
        rate="1,8 %"
        opacity={1-oldRateOut}
        scale={1}
        accent={MOTION_V3.blue}
      />
      <ContractV3
        x={0}
        y={0}
        title="Neuer Zins"
        rate="4,2 %"
        opacity={Math.min(1,newRateIn)}
        scale={0.9+0.1*Math.min(1,newRateIn)}
        accent={MOTION_V3.orange}
      />
    </div>

    <div style={{position:'absolute',left:60,right:60,top:1060,height:210}}>
      <div style={{position:'absolute',left:35,right:35,top:82,height:6,borderRadius:999,background:MOTION_V3.line}}/>
      {[
        {x:35,label:'2016'},
        {x:360,label:'2021'},
        {x:685,label:'2026'},
      ].map((m)=>(
        <React.Fragment key={m.label}>
          <div style={{position:'absolute',left:m.x,top:66,width:36,height:36,borderRadius:'50%',background:MOTION_V3.white,border:`5px solid ${MOTION_V3.blue}`}}/>
          <div style={{position:'absolute',left:m.x-30,top:120,width:96,textAlign:'center',fontFamily:FONT.body,fontSize:22,fontWeight:800,color:MOTION_V3.inkSoft}}>{m.label}</div>
        </React.Fragment>
      ))}
      <CalendarV3 x={calendarX} y={0} year={frame<102?'10 Jahre':'2026'} scale={0.72} accent={frame<102?MOTION_V3.blue:MOTION_V3.orange}/>
    </div>

    <FollowPathV3
      d="M 650 935 C 690 1020 760 1080 840 1170"
      progress={link}
      stroke={MOTION_V3.orange}
      width={8}
      followerColor={MOTION_V3.orange}
      followerSize={40}
      followerText="€"
    />

    <div style={{
      position:'absolute',left:625,top:1315,width:300,height:180,borderRadius:30,
      background:MOTION_V3.white,border:`2px solid ${MOTION_V3.line}`,
      boxShadow:'0 12px 30px rgba(36,48,42,0.07)',
      opacity:finalHold,
    }}>
      <div style={{position:'absolute',left:0,right:0,top:24,textAlign:'center',fontSize:22,fontWeight:800,color:MOTION_V3.inkSoft}}>Monatsrate</div>
      <div style={{
        position:'absolute',left:0,right:0,top:74,textAlign:'center',
        fontFamily:FONT.title,fontSize:52,fontWeight:900,color:MOTION_V3.ink,
      }}>
        {Math.round(interpolate(paymentShift,[0,1],[980,1240],CLAMP)).toLocaleString('de-DE')} €
      </div>
    </div>

    <BigValueV3
      value="+260 €"
      x={115}
      y={1355}
      tone="orange"
      opacity={finalHold}
      scale={0.9+0.1*finalHold}
    />
  </EditorialSceneV3>;
};

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: mortgage-fixed-rate-reset
 * FOCAL_PATH: Haus → Vertrag → Zeitachse → neuer Zinssatz → neue Monatsrate.
 * PRIMARY_ACTION: Nach Ablauf der Zinsbindung wird der alte Zinssatz durch einen höheren ersetzt und die Monatsrate steigt sichtbar.
 * CAMERA_ROLE: still — die Veränderung soll durch Objektzustände erklärt werden.
 * PAYOFF: 4,2 % und 1.240 € stehen stabil als neuer Zustand.
 *
 * ANIMATION_NARRATIVE
 * START: Haus, Vertrag mit 1,8 % und Beginn der zehnjährigen Zinsbindung.
 * MECHANISM: Kalender bewegt sich bis 2026, der Vertrag wechselt auf 4,2 % und verbindet sich mit der Monatsrate.
 * RESULT: Monatsrate steigt von 980 € auf 1.240 €; +260 € bleibt sichtbar.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Haus plus echter Vertragsgegenstand.
 * SUPPORT: Kalender, Zeitachse, Verbindungspfad und Monatsrate.
 * SURFACE: warmes Creme.
 * SHAPE_LANGUAGE: flat editorial illustration with subtle layering.
 *
 * RESULT_HOLD_FRAMES = 34
 */
