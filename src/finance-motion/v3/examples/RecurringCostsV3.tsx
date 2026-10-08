import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../../brand';
import {
  EditorialSceneV3,
  PhoneV3,
  DumbbellV3,
  PlayTileV3,
  ReceiptV3,
  CalendarV3,
  MOTION_V3,
  progress,
  editorialSpring,
  ShapeMorphV3,
  CLAMP,
} from '..';

export const RECURRING_COSTS_V3_FRAMES=210;

export const RecurringCostsV3:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();

  const phone=editorialSpring(frame,6,fps,'soft');
  const stream=editorialSpring(frame,20,fps,'soft');
  const gym=editorialSpring(frame,34,fps,'soft');

  const merge=progress(frame,68,112,Easing.inOut(Easing.cubic));
  const receipt=editorialSpring(frame,108,fps,'snappy');
  const month=progress(frame,118,146);
  const annual=progress(frame,148,182,Easing.out(Easing.cubic));
  const calendar=editorialSpring(frame,138,fps,'soft');

  const phoneX=interpolate(merge,[0,1],[105,365],CLAMP);
  const phoneY=interpolate(merge,[0,1],[590,820],CLAMP);
  const streamX=interpolate(merge,[0,1],[450,430],CLAMP);
  const streamY=interpolate(merge,[0,1],[610,840],CLAMP);
  const gymX=interpolate(merge,[0,1],[755,465],CLAMP);
  const gymY=interpolate(merge,[0,1],[650,850],CLAMP);

  return <EditorialSceneV3 surface="mist" safePadding={0}>
    <div style={{position:'absolute',left:phoneX,top:phoneY,opacity:phone*(1-merge),transform:`scale(${0.9+0.1*phone})`}}>
      <PhoneV3 x={0} y={0} label="Mobilfunk" amount="19 €"/>
    </div>
    <div style={{position:'absolute',left:streamX,top:streamY,opacity:stream*(1-merge),transform:`scale(${0.9+0.1*stream})`}}>
      <PlayTileV3 x={0} y={0}/>
      <div style={{position:'absolute',left:-10,top:170,width:170,textAlign:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,color:MOTION_V3.orange}}>17 €</div>
    </div>
    <div style={{position:'absolute',left:gymX,top:gymY,opacity:gym*(1-merge),transform:`scale(${0.9+0.1*gym})`}}>
      <DumbbellV3 x={0} y={0}/>
      <div style={{position:'absolute',left:8,top:100,width:180,textAlign:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,color:MOTION_V3.blue}}>35 €</div>
    </div>

    <div style={{position:'absolute',left:420,top:735,opacity:receipt}}>
      <ReceiptV3 x={0} y={0} title="Monatlich" amount="71 €" scale={0.92+0.08*receipt}/>
    </div>

    <div style={{
      position:'absolute',left:250,top:1140,width:250,height:120,borderRadius:28,
      background:MOTION_V3.green,color:'#FFF',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',
      opacity:month,transform:`scale(${0.92+0.08*month})`
    }}>
      <div style={{fontSize:22,fontWeight:850}}>PRO MONAT</div>
      <div style={{fontFamily:FONT.title,fontSize:50,fontWeight:900}}>71 €</div>
    </div>

    <div style={{position:'absolute',left:520,top:1115,opacity:calendar,transform:`scale(${0.78+0.22*calendar})`}}>
      <CalendarV3 x={0} y={0} year="×12" scale={0.72} accent={MOTION_V3.blue}/>
    </div>

    <ShapeMorphV3
      x={850}
      y={1200}
      progress={annual}
      opacity={annual}
      from={{width:210,height:100,radius:26,color:MOTION_V3.green}}
      to={{width:330,height:165,radius:34,color:MOTION_V3.orange}}
    >
      <div style={{textAlign:'center',fontFamily:FONT.title,fontWeight:900,color:'#FFF'}}>
        <div style={{fontSize:22}}>PRO JAHR</div>
        <div style={{fontSize:58}}>
          {`${Math.round(interpolate(annual,[0,1],[71,852],CLAMP))} €`}
        </div>
      </div>
    </ShapeMorphV3>

    <div style={{
      position:'absolute',left:150,right:150,top:1450,textAlign:'center',
      fontSize:28,fontWeight:800,color:MOTION_V3.inkSoft,opacity:annual,
    }}>
      Aus kleinen Monatskosten werden 852 € im Jahr.
    </div>
  </EditorialSceneV3>;
};

/**
 * MOTION_SOURCE: custom-build
 * FINANCE_MOTION_ID: none
 * MECHANIC_ID: recurring-costs-merge
 * FOCAL_PATH: Drei Alltagsobjekte → gemeinsame Monatsrechnung → Jahresbetrag.
 * PRIMARY_ACTION: Einzelkosten bewegen sich zusammen, werden zu 71 € pro Monat und anschließend zu 852 € pro Jahr.
 * CAMERA_ROLE: still — der Zuschauer soll die Addition direkt verfolgen können.
 * PAYOFF: Der Jahresbetrag 852 € steht groß und stabil im Zentrum.
 *
 * ANIMATION_NARRATIVE
 * START: Mobilfunk, Streaming und Fitness erscheinen als getrennte kleine Kosten.
 * MECHANISM: Die drei Kosten verschmelzen zu einer Monatsrechnung und werden hochgerechnet.
 * RESULT: 852 € pro Jahr ersetzt die scheinbar kleinen Einzelbeträge.
 *
 * EDITORIAL_VISUAL_NARRATIVE
 * HERO: Drei einfache Alltagsobjekte, die sichtbar zusammengeführt werden.
 * SUPPORT: Monatsbeleg und morphender Gesamtbetrag.
 * SURFACE: helles neutrales Grau.
 * SHAPE_LANGUAGE: simple illustrated objects plus one controlled morph.
 *
 * RESULT_HOLD_FRAMES = 30
 */
