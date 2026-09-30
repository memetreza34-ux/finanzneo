import React from 'react';
import {AbsoluteFill,Series} from 'remotion';
import {ANIMATION_COLORS,C,FONT} from '../brand';
import {FeesScene03Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-03/animation';
import {FeesScene07Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-07/animation';
import {FeesScene11Animation} from '../../reels/2026-09-28_bis_2026-10-04/dienstag/reel-01_1-prozent-gebuehren/03-szenen/EINZELNE-SZENEN/scene-11/animation';

export const FEES_30_YEARS_FORMAT_B_1MIN_FRAMES=1800;
const IMAGE_FRAMES=111;
const ANIMATION_FRAMES=193;

type Tone='green'|'gold'|'red'|'neutral';
type StillScene={title:string;caption:string;value:string;tone?:Tone};
const COLORS={green:ANIMATION_COLORS.positive,gold:C.gold,red:ANIMATION_COLORS.warning,neutral:'#b8bec8'};

const ImageScene:React.FC<StillScene>=({title,caption,value,tone='green'})=><AbsoluteFill style={{background:'#000'}}>
  <div style={{position:'absolute',left:72,right:72,top:154,textAlign:'center',fontFamily:FONT.title,fontSize:54,fontWeight:950,color:C.white,lineHeight:1.05}}>{title}</div>
  <div style={{position:'absolute',left:72,right:72,top:320,height:1080,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
    <div style={{width:620,height:620,borderRadius:90,background:`linear-gradient(145deg,${COLORS[tone]},rgba(0,0,0,.72))`,border:'4px solid rgba(255,255,255,.18)',boxShadow:'0 45px 90px rgba(0,0,0,.55)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:value.length>18?48:68,fontWeight:950,color:C.white,textAlign:'center',padding:48}}>{value}</div>
  </div>
  <div style={{position:'absolute',left:92,right:92,bottom:340,textAlign:'center',fontFamily:FONT.body,fontSize:46,fontWeight:850,color:C.white,lineHeight:1.16}}>{caption}</div>
</AbsoluteFill>;

const I=(title:string,caption:string,value:string,tone?:Tone):StillScene=>({title,caption,value,tone});

export const Fees30YearsFormatB1MinV1:React.FC=()=><AbsoluteFill style={{background:'#000'}}><Series>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('1 % klingt harmlos','Ein Prozent Kosten klingt klein. Über Jahrzehnte kann genau das richtig teuer werden.','1 %','gold')}/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Die Kosten verschwinden nicht','Sie werden direkt aus deinem investierten Vermögen bezahlt.','KOSTEN','red')}/></Series.Sequence>
  <Series.Sequence durationInFrames={ANIMATION_FRAMES}><FeesScene03Animation/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Ein einfaches Beispiel','Du startest mit 10.000 Euro und investierst jeden Monat 300 Euro.','10.000 € + 300 €/Monat','green')}/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('30 Jahre lang','Beide Wege bekommen exakt dieselben Einzahlungen.','GLEICHE EINZAHLUNGEN','neutral')}/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Nur 1 Prozentpunkt Unterschied','Wir vergleichen sieben Prozent mit sechs Prozent Rendite pro Jahr.','7 % vs. 6 %','gold')}/></Series.Sequence>
  <Series.Sequence durationInFrames={ANIMATION_FRAMES}><FeesScene07Animation/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Nach 5 Jahren kaum sichtbar','Rund 35.700 Euro stehen ungefähr 34.400 Euro gegenüber.','35.700 € / 34.400 €','neutral')}/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Nach 20 Jahren deutlich','Ungefähr 196.700 Euro stehen 171.700 Euro gegenüber.','196.700 € / 171.700 €','red')}/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Kosten haben viele Namen','Fondskosten, Depot-, Service- oder Transaktionsgebühren können Rendite kosten.','FONDS · DEPOT · SERVICE · TRANSAKTION','red')}/></Series.Sequence>
  <Series.Sequence durationInFrames={ANIMATION_FRAMES}><FeesScene11Animation/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Rund 85.600 € Unterschied','Obwohl auf beiden Wegen gleich viel eingezahlt wurde.','≈ 85.600 €','red')}/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Deshalb Kosten prüfen','Schau in Produktunterlagen sowie Preis- und Leistungsverzeichnisse.','KOSTEN PRÜFEN','neutral')}/></Series.Sequence>
  <Series.Sequence durationInFrames={IMAGE_FRAMES}><ImageScene {...I('Aber nicht nur auf Kosten schauen','Risiko, Diversifikation und Produktqualität bleiben genauso wichtig.','RISIKO · STREUUNG · QUALITÄT','green')}/></Series.Sequence>
</Series></AbsoluteFill>;
