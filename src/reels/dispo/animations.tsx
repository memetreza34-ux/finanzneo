import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneBackground, VisualStage, WorldStage, clamp01, clampInput} from '../notgroschen/shared';
import {C, FONT, a} from '../../brand';

const Header: React.FC<{title:string; accent:string; tone?:'gold'|'red'|'green'}> = ({title,accent,tone='green'}) => {
  const color=tone==='gold'?C.goldLt:tone==='red'?'#FF7777':C.accentLt;
  return <div style={{position:'absolute',top:72,left:60,right:60,zIndex:20,textAlign:'center'}}>
    <div style={{fontFamily:FONT.title,fontSize:54,lineHeight:1.02,color:C.white,textShadow:'0 3px 12px #000'}}>{title}</div>
    <div style={{fontFamily:FONT.title,fontSize:54,lineHeight:1.02,color,marginTop:8,textShadow:'0 3px 12px #000'}}>{accent}</div>
  </div>;
};
const Card:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=><div style={{borderRadius:30,background:a(C.accent,.12),border:`2px solid ${a(C.accentLt,.42)}`,boxShadow:'0 20px 70px rgba(0,0,0,.35)',...style}}>{children}</div>;
const money=(n:number)=>`${n.toLocaleString('de-DE',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})} €`;

export const DispoMechanismAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const enter=clamp01(spring({frame,fps,durationInFrames:Math.max(12,Math.round(durationInFrames*.22)),config:{damping:18,stiffness:150}}));
  const drop=interpolate(frame,[durationInFrames*.2,durationInFrames*.7],[0,1],clampInput);
  return <SceneBackground><WorldStage/><Header title="DISPO = KREDITLINIE" accent="DIREKT AM GIROKONTO"/>
    <VisualStage><div style={{position:'absolute',left:130,right:130,top:120,bottom:140}}>
      <div style={{position:'absolute',left:'50%',top:20,bottom:20,width:10,transform:'translateX(-50%)',background:a(C.white,.16),borderRadius:10}}/>
      <div style={{position:'absolute',left:70,right:70,top:'46%',height:4,background:C.white,boxShadow:`0 0 18px ${a(C.white,.5)}`}}/>
      <div style={{position:'absolute',left:90,top:'42%',fontFamily:FONT.body,fontSize:28,fontWeight:900,color:C.white}}>0 €</div>
      <div style={{position:'absolute',left:'50%',top:`${18+drop*58}%`,transform:`translate(-50%,-50%) scale(${.82+.18*enter})`,width:270,height:150,borderRadius:38,display:'grid',placeItems:'center',background:drop>.5?a('#ff604d',.25):a(C.gold,.2),border:`3px solid ${drop>.5?'#ff7868':C.goldLt}`}}>
        <div style={{fontFamily:FONT.title,fontSize:64,color:drop>.5?'#ff8b7e':C.goldLt}}>{drop>.5?'- 600 €':'350 €'}</div>
      </div>
      <div style={{position:'absolute',left:130,right:130,bottom:40,textAlign:'center',fontFamily:FONT.body,fontSize:30,fontWeight:800,color:C.gray}}>Unter 0 € nutzt du geliehenes Geld im vereinbarten Rahmen.</div>
    </div></VisualStage>
  </SceneBackground>;
};

export const DailyInterestAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame(); const p=frame/Math.max(1,durationInFrames-1);
  const days=Math.round(interpolate(p,[.08,.88],[0,365],clampInput));
  const interest=1500*.12*days/365;
  return <SceneBackground><WorldStage/><Header title="SOLANGE DU IM MINUS BIST" accent="LÄUFT DIE ZEIT" tone="red"/>
    <VisualStage><div style={{position:'absolute',top:150,left:90,right:90,textAlign:'center'}}>
      <div style={{fontFamily:FONT.title,fontSize:122,color:'#ff8174'}}>-1.500 €</div>
      <div style={{margin:'70px auto 24px',width:820,height:28,borderRadius:20,background:a(C.white,.12),overflow:'hidden'}}><div style={{height:'100%',width:`${p*100}%`,background:'linear-gradient(90deg,#ff6d5e,#ffb05e)'}}/></div>
      <div style={{display:'flex',justifyContent:'space-between',fontFamily:FONT.body,fontSize:30,fontWeight:900,color:C.gray}}><span>{days} Tage</span><span>Beispiel: 12 % p.a.</span></div>
      <Card style={{margin:'80px auto 0',padding:'34px 42px',width:620}}><div style={{fontFamily:FONT.body,fontSize:28,color:C.gray,fontWeight:800}}>vereinfachte Zinskosten</div><div style={{fontFamily:FONT.title,fontSize:94,color:C.goldLt,marginTop:8}}>{money(interest)}</div></Card>
    </div></VisualStage>
  </SceneBackground>;
};

export const InterestExampleAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame(); const p=frame/Math.max(1,durationInFrames-1);
  const rows=[{d:'30 TAGE',v:14.79},{d:'90 TAGE',v:44.38},{d:'365 TAGE',v:180}];
  return <SceneBackground><WorldStage/><Header title="1.500 € BEI 12 %" accent="SO WÄCHST DAS BEISPIEL" tone="gold"/>
    <VisualStage><div style={{position:'absolute',top:120,left:90,right:90,display:'flex',flexDirection:'column',gap:30}}>{rows.map((r,i)=>{const x=interpolate(p,[.08+i*.18,.28+i*.18],[0,1],clampInput);return <Card key={r.d} style={{padding:'34px 42px',display:'flex',alignItems:'center',justifyContent:'space-between',opacity:x,transform:`translateX(${(1-x)*80}px)`}}><span style={{fontFamily:FONT.body,fontSize:34,fontWeight:900,color:C.white}}>{r.d}</span><span style={{fontFamily:FONT.title,fontSize:76,color:i===2?'#ff8174':C.goldLt}}>{money(r.v)}</span></Card>})}<div style={{fontFamily:FONT.body,fontSize:26,color:C.gray,textAlign:'center',marginTop:20}}>Vereinfachtes Rechenbeispiel bei konstantem Saldo.</div></div></VisualStage>
  </SceneBackground>;
};

export const SalaryHoleAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame(); const p=frame/Math.max(1,durationInFrames-1);
  const salary=interpolate(p,[.08,.34],[0,2000],clampInput); const fill=interpolate(p,[.38,.72],[0,1500],clampInput); const left=Math.max(0,salary-fill);
  return <SceneBackground><WorldStage/><Header title="GEHALT KOMMT REIN" accent="UND FÜLLT ERST DAS ALTE LOCH" tone="red"/>
    <VisualStage><div style={{position:'absolute',top:130,left:90,right:90}}>
      <Card style={{padding:32,textAlign:'center'}}><div style={{fontFamily:FONT.body,fontSize:28,fontWeight:900,color:C.gray}}>GEHALT</div><div style={{fontFamily:FONT.title,fontSize:90,color:C.accentLt}}>+ {money(salary)}</div></Card>
      <div style={{height:90,width:18,background:`linear-gradient(${C.accentLt},#ff7868)`,margin:'0 auto'}}/>
      <Card style={{padding:32,textAlign:'center',borderColor:a('#ff7868',.55),background:a('#ff604d',.14)}}><div style={{fontFamily:FONT.body,fontSize:28,fontWeight:900,color:'#ffaaa1'}}>ALTES MINUS</div><div style={{fontFamily:FONT.title,fontSize:84,color:'#ff8174'}}>- {money(fill)}</div></Card>
      <div style={{marginTop:70,textAlign:'center'}}><div style={{fontFamily:FONT.body,fontSize:28,fontWeight:900,color:C.gray}}>FÜR DEN NEUEN MONAT ÜBRIG</div><div style={{fontFamily:FONT.title,fontSize:100,color:C.goldLt}}>{money(left)}</div></div>
    </div></VisualStage>
  </SceneBackground>;
};

export const RepaymentStepsAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame(); const p=frame/Math.max(1,durationInFrames-1);
  const steps=[['1','ECHTEN SALDO SEHEN'],['2','MINUS PLANMÄSSIG SENKEN'],['3','0 € ERREICHEN']];
  return <SceneBackground><WorldStage/><Header title="RAUS AUS DEM DISPO" accent="IN DREI KLAREN SCHRITTEN"/>
    <VisualStage><div style={{position:'absolute',top:130,left:100,right:100,display:'flex',flexDirection:'column',gap:34}}>{steps.map((s,i)=>{const r=interpolate(p,[.08+i*.2,.28+i*.2],[0,1],clampInput);return <div key={s[0]} style={{display:'grid',gridTemplateColumns:'110px 1fr',gap:28,alignItems:'center',opacity:r,transform:`translateY(${(1-r)*55}px)`}}><div style={{width:100,height:100,borderRadius:50,display:'grid',placeItems:'center',background:a(C.accent,.25),border:`3px solid ${C.accentLt}`,fontFamily:FONT.title,fontSize:56,color:C.accentLt}}>{s[0]}</div><Card style={{padding:'30px 34px'}}><div style={{fontFamily:FONT.title,fontSize:46,color:C.white}}>{s[1]}</div></Card></div>})}</div></VisualStage>
  </SceneBackground>;
};

export const TermsCheckAnimation:React.FC<{durationInFrames:number}>=({durationInFrames})=>{
  const frame=useCurrentFrame(); const p=frame/Math.max(1,durationInFrames-1);
  const left=interpolate(p,[.08,.34],[0,1],clampInput); const right=interpolate(p,[.3,.58],[0,1],clampInput);
  return <SceneBackground><WorldStage/><Header title="PRÜFE DEINE KONDITIONEN" accent="NICHT NUR DIE KONTOKOSTEN" tone="gold"/>
    <VisualStage><div style={{position:'absolute',top:160,left:70,right:70,display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
      <Card style={{padding:'44px 28px',minHeight:430,textAlign:'center',opacity:left,transform:`scale(${.86+.14*left})`}}><div style={{fontFamily:FONT.title,fontSize:58,color:C.goldLt}}>DISPOZINS</div><div style={{fontFamily:FONT.body,fontSize:30,color:C.gray,fontWeight:800,marginTop:35}}>Zins für die vereinbarte Kontoüberziehung</div><div style={{fontFamily:FONT.title,fontSize:90,color:C.white,marginTop:55}}>% p.a.</div></Card>
      <Card style={{padding:'44px 28px',minHeight:430,textAlign:'center',opacity:right,transform:`scale(${.86+.14*right})`,borderColor:a('#ff7868',.5)}}><div style={{fontFamily:FONT.title,fontSize:48,color:'#ff8174'}}>GEDULDETE ÜBERZIEHUNG</div><div style={{fontFamily:FONT.body,fontSize:30,color:C.gray,fontWeight:800,marginTop:35}}>Kann teurer sein, wenn du den vereinbarten Rahmen überschreitest</div><div style={{fontFamily:FONT.title,fontSize:90,color:C.white,marginTop:30}}>% p.a.</div></Card>
    </div></VisualStage>
  </SceneBackground>;
};
