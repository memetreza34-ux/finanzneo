import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const p=(frame:number,duration:number,a:number,b:number)=>interpolate(frame,[duration*a,duration*b],[0,1],clamp);
const card:React.CSSProperties={border:'1px solid rgba(255,255,255,.12)',background:'linear-gradient(180deg,rgba(20,58,37,.94),rgba(4,17,10,.96))',boxShadow:'0 30px 80px rgba(0,0,0,.36)'};

const GroceryBasket:React.FC<{scale?:number;opacity?:number}> = ({scale=1,opacity=1}) => <div style={{width:320,height:230,transform:`scale(${scale})`,opacity,position:'relative'}}>
  <div style={{position:'absolute',left:20,right:20,bottom:0,height:145,border:`10px solid ${C.accentLt}`,borderRadius:'30px 30px 90px 90px',background:'rgba(92,255,173,.08)'}}/>
  {[0,1,2,3,4].map((i)=><div key={i} style={{position:'absolute',width:58,height:80,borderRadius:18,left:42+i*53,top:20+(i%2)*18,background:i%2?C.gold:C.whiteSoft,boxShadow:'0 10px 25px rgba(0,0,0,.25)'}}/>)}
</div>;

export const PriceLevelMechanismAnimation:React.FC<{durationFrames:number}> = ({durationFrames})=>{
  const f=useCurrentFrame(); const progress=p(f,durationFrames,.10,.82); const wave=p(f,durationFrames,.22,.72);
  const basketScale=1-progress*.28; const prices=[1.99,2.49,3.29];
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:900,height:720,position:'relative'}}>
      <div style={{position:'absolute',left:40,top:210,width:250,height:250,borderRadius:70,background:'linear-gradient(145deg,#ffe49a,#c88a0d)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.heading,fontSize:72,fontWeight:900,color:'#201600',boxShadow:'0 35px 80px rgba(255,200,61,.22)'}}>100 €</div>
      <div style={{position:'absolute',right:40,top:220,transform:`scale(${basketScale})`,transformOrigin:'center'}}><GroceryBasket/></div>
      <div style={{position:'absolute',left:335,right:335,top:315,height:18,borderRadius:9,background:`linear-gradient(90deg,${C.gold},${C.negativeLt})`,transform:`scaleX(${.25+.75*wave})`,transformOrigin:'left'}}/>
      <div style={{position:'absolute',left:355,top:120,fontFamily:FONT.body,fontSize:25,color:C.graySoft}}>PREISNIVEAU</div>
      <div style={{position:'absolute',left:356,top:165,width:180,height:320,borderRadius:40,border:'2px solid rgba(255,255,255,.08)',overflow:'hidden'}}><div style={{position:'absolute',left:0,right:0,bottom:0,height:`${20+75*progress}%`,background:'linear-gradient(180deg,rgba(255,107,107,.85),rgba(176,16,48,.45))'}}/></div>
      {prices.map((price,i)=><div key={price} style={{position:'absolute',right:85+i*76,top:120-i*20,transform:`translateY(${-90*progress}px)`,opacity:.35+.65*progress,fontFamily:FONT.body,fontWeight:900,fontSize:24,color:C.negativeLt}}>{(price*(1+.35*progress)).toFixed(2)} €</div>)}
      <div style={{position:'absolute',left:60,right:60,bottom:35,fontFamily:FONT.body,fontSize:33,fontWeight:850,color:C.white,textAlign:'center'}}>Gleicher Euro → weniger Reichweite</div>
    </div>
  </AbsoluteFill>;
};

export const BasketPriceOverTimeAnimation:React.FC<{durationFrames:number}> = ({durationFrames})=>{
  const f=useCurrentFrame(); const t=p(f,durationFrames,.08,.90)*20; const price=100*Math.pow(1.03,t); const x=80+(740*t/20);
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:900,height:720,position:'relative'}}>
      <div style={{position:'absolute',left:250,top:45}}><GroceryBasket scale={1.25}/></div>
      <div style={{position:'absolute',top:305,left:0,right:0,textAlign:'center',fontFamily:FONT.heading,fontSize:92,fontWeight:900,color:C.gold}}>{Math.round(price)} €</div>
      <div style={{position:'absolute',left:80,right:80,bottom:150,height:10,borderRadius:5,background:'rgba(255,255,255,.12)'}}><div style={{height:'100%',width:`${(t/20)*100}%`,borderRadius:5,background:`linear-gradient(90deg,${C.accent},${C.gold},${C.negativeLt})`}}/></div>
      <div style={{position:'absolute',left:x-18,bottom:132,width:36,height:36,borderRadius:'50%',background:C.white,boxShadow:'0 0 30px rgba(92,255,173,.9)'}}/>
      {[0,5,10,20].map(y=><div key={y} style={{position:'absolute',left:70+740*y/20,bottom:84,fontFamily:FONT.body,fontSize:26,fontWeight:800,color:y<=t?C.white:C.grayDk}}>{y} J.</div>)}
      <div style={{position:'absolute',left:0,right:0,bottom:20,textAlign:'center',fontFamily:FONT.body,fontSize:24,color:C.graySoft}}>Modell: 3 % Preissteigerung pro Jahr</div>
    </div>
  </AbsoluteFill>;
};

export const PurchasingPowerTimelineAnimation:React.FC<{durationFrames:number}> = ({durationFrames})=>{
  const f=useCurrentFrame(); const t=p(f,durationFrames,.05,.92)*20; const real=10000/Math.pow(1.03,t); const milestones=[{y:0,v:10000},{y:5,v:8626},{y:10,v:7441},{y:20,v:5537}];
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:900,height:720,position:'relative'}}>
      <div style={{position:'absolute',left:0,right:0,top:45,textAlign:'center',fontFamily:FONT.heading,fontSize:94,fontWeight:900,color:C.white}}>{Math.round(real).toLocaleString('de-DE')} €</div>
      <div style={{position:'absolute',left:0,right:0,top:148,textAlign:'center',fontFamily:FONT.body,fontSize:25,color:C.graySoft}}>HEUTIGE KAUFKRAFT</div>
      <div style={{position:'absolute',left:80,right:80,bottom:130,height:440,display:'flex',alignItems:'end',justifyContent:'space-between'}}>
        {milestones.map((m,i)=>{const active=t>=m.y; const h=120+300*(m.v/10000); return <div key={m.y} style={{width:145,textAlign:'center'}}><div style={{height:h,borderRadius:'38px 38px 12px 12px',background:active?`linear-gradient(180deg,${i===0?C.gold:C.accentLt},${i===0?'#9b6b00':C.accentDk})`:'rgba(255,255,255,.08)',boxShadow:active?'0 25px 60px rgba(0,210,106,.16)':'none',transition:'none'}}/><div style={{marginTop:12,fontFamily:FONT.body,fontSize:25,fontWeight:900,color:active?C.white:C.grayDk}}>{m.y} J.</div><div style={{fontFamily:FONT.body,fontSize:24,color:active?C.goldLt:C.grayDk}}>{m.v.toLocaleString('de-DE')} €</div></div>})}
      </div>
    </div>
  </AbsoluteFill>;
};

export const BuyingPowerLossAnimation:React.FC<{durationFrames:number}> = ({durationFrames})=>{
  const f=useCurrentFrame(); const sweep=p(f,durationFrames,.18,.78); const gone=Math.floor(sweep*9);
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:900,height:720,display:'grid',gridTemplateColumns:'340px 1fr',gap:70,alignItems:'center'}}>
      <div style={{...card,borderRadius:70,height:360,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><div style={{fontFamily:FONT.body,fontSize:28,color:C.graySoft}}>NOMINAL</div><div style={{fontFamily:FONT.heading,fontSize:92,fontWeight:900,color:C.gold}}>10.000 €</div><div style={{fontFamily:FONT.body,fontSize:24,color:C.graySoft}}>bleibt stehen</div></div>
      <div><div style={{fontFamily:FONT.body,fontSize:26,color:C.graySoft,marginBottom:22}}>KAUFKRAFT-TILES</div><div style={{display:'grid',gridTemplateColumns:'repeat(5,76px)',gap:14}}>{Array.from({length:20}).map((_,i)=>{const lost=i<gone; return <div key={i} style={{width:76,height:76,borderRadius:20,background:lost?'rgba(255,51,51,.12)':C.accentLt,border:`2px solid ${lost?C.negative:C.accent}`,opacity:lost?.22:1,transform:`scale(${lost?.82:1})`,boxShadow:lost?'none':'0 8px 22px rgba(0,210,106,.15)'}}/>})}</div><div style={{fontFamily:FONT.heading,fontSize:64,fontWeight:900,color:C.negativeLt,marginTop:28}}>{Math.round(44.63*sweep)} % weniger</div></div>
    </div>
  </AbsoluteFill>;
};

export const NominalVsRealAnimation:React.FC<{durationFrames:number}> = ({durationFrames})=>{
  const f=useCurrentFrame(); const t=p(f,durationFrames,.08,.90); const real=10000/Math.pow(1.03,20*t); const realY=170+330*(1-real/10000);
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:900,height:720,position:'relative',...card,borderRadius:60,padding:50}}>
      <div style={{position:'absolute',left:80,right:80,bottom:130,height:420,borderLeft:'3px solid rgba(255,255,255,.2)',borderBottom:'3px solid rgba(255,255,255,.2)'}}>
        <div style={{position:'absolute',left:0,right:0,top:80,height:8,borderRadius:4,background:C.gold}}/><div style={{position:'absolute',left:0,top:52,fontFamily:FONT.body,fontSize:25,fontWeight:900,color:C.gold}}>NOMINAL 10.000 €</div>
        <svg width="100%" height="100%" viewBox="0 0 720 420" style={{position:'absolute',inset:0}}><path d={`M 0 80 C 220 100, 430 ${120+120*t}, 720 ${realY}`} fill="none" stroke={C.negativeLt} strokeWidth="12" strokeLinecap="round"/><circle cx={720*t} cy={80+(realY-80)*t} r="14" fill={C.white}/></svg>
        <div style={{position:'absolute',right:10,top:realY-15,fontFamily:FONT.body,fontSize:25,fontWeight:900,color:C.negativeLt}}>REAL {Math.round(real).toLocaleString('de-DE')} €</div>
      </div>
      <div style={{position:'absolute',left:80,bottom:60,fontFamily:FONT.body,fontSize:22,color:C.graySoft}}>HEUTE</div><div style={{position:'absolute',right:80,bottom:60,fontFamily:FONT.body,fontSize:22,color:C.graySoft}}>20 JAHRE</div>
    </div>
  </AbsoluteFill>;
};

export const SamePurchasingPowerTargetAnimation:React.FC<{durationFrames:number}> = ({durationFrames})=>{
  const f=useCurrentFrame(); const t=p(f,durationFrames,.08,.88)*20; const needed=10000*Math.pow(1.03,t); const enter=spring({frame:f,fps:30,config:{damping:18,stiffness:120}});
  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:920,height:720,position:'relative'}}>
      <div style={{position:'absolute',left:40,top:190,transform:`translateX(${(1-enter)*-120}px)`}}><GroceryBasket scale={1.12}/><div style={{textAlign:'center',fontFamily:FONT.body,fontSize:25,color:C.graySoft}}>GLEICHER WARENKORB</div></div>
      <div style={{position:'absolute',right:30,top:145,width:390,height:360,borderRadius:80,background:'linear-gradient(145deg,#ffe49a,#b97700)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 30px 90px rgba(255,200,61,.22)'}}><div style={{fontFamily:FONT.body,fontSize:25,fontWeight:900,color:'#3d2a00'}}>BENÖTIGT IM MODELL</div><div style={{fontFamily:FONT.heading,fontSize:78,fontWeight:900,color:'#181000'}}>{Math.round(needed).toLocaleString('de-DE')} €</div></div>
      <div style={{position:'absolute',left:90,right:90,bottom:105,height:12,borderRadius:6,background:'rgba(255,255,255,.12)'}}><div style={{width:`${t/20*100}%`,height:'100%',background:`linear-gradient(90deg,${C.accent},${C.gold})`,borderRadius:6}}/></div>
      <div style={{position:'absolute',left:88,bottom:50,fontFamily:FONT.body,fontSize:25,color:C.white}}>HEUTE · 10.000 €</div><div style={{position:'absolute',right:72,bottom:50,fontFamily:FONT.body,fontSize:25,color:C.white}}>{Math.round(t)} JAHRE</div>
    </div>
  </AbsoluteFill>;
};
