import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../../brand';
import {
  EditorialSceneV3,
  PhoneV3,
  DumbbellV3,
  PlayTileV3,
  ReceiptV3,
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
  const annual=progress(frame,146,180,Easing.out(Easing.cubic));

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

    <div style={{position:'absolute',left:365,top:760,opacity:receipt}}>
      <ReceiptV3 x={0} y={0} title="Monatlich" amount="71 €" scale={0.9+0.1*receipt}/>
    </div>

    <ShapeMorphV3
      x={485}
      y={1240}
      progress={annual}
      from={{width:250,height:110,radius:28,color:MOTION_V3.green}}
      to={{width:380,height:170,radius:34,color:MOTION_V3.orange}}
    >
      <div style={{textAlign:'center',fontFamily:FONT.title,fontWeight:900,color:'#FFF'}}>
        <div style={{fontSize:annual<0.5?26:24}}>{annual<0.5?'PRO MONAT':'PRO JAHR'}</div>
        <div style={{fontSize:annual<0.5?46:58}}>
          {annual<0.5
            ? `${Math.round(interpolate(month,[0,1],[0,71],CLAMP))} €`
            : `${Math.round(interpolate(annual,[0,1],[71,852],CLAMP))} €`}
        </div>
      </div>
    </ShapeMorphV3>

    <div style={{
      position:'absolute',left:150,right:150,top:1450,textAlign:'center',
      fontSize:28,fontWeight:800,color:MOTION_V3.inkSoft,opacity:annual,
    }}>
      Drei kleine Beträge werden zusammen zu einem großen Jahresbetrag.
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
