import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand';

const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};
const progressBetween = (frame:number,duration:number,start:number,end:number) =>
  interpolate(frame,[duration*start,duration*end],[0,1],clamp);
const euro = (value:number) => `${Math.round(value).toLocaleString('de-DE')} €`;

const Basket3D:React.FC<{scale?:number;items?:number;opacity?:number}> = ({scale=1,items=8,opacity=1}) => {
  const colors=[C.gold,C.whiteSoft,C.accentLt,'#ff9f68',C.goldLt,C.white,C.accent,'#ffb28b'];
  return <div style={{width:390,height:300,position:'relative',transform:`scale(${scale})`,opacity,transformOrigin:'center bottom'}}>
    <div style={{position:'absolute',left:64,right:64,top:20,height:145,border:`15px solid ${C.accentLt}`,borderBottomWidth:0,borderRadius:'150px 150px 0 0',filter:'drop-shadow(0 18px 28px rgba(0,210,106,.18))'}}/>
    {Array.from({length:8}).map((_,i)=>{
      const visible=i<items;
      return <div key={i} style={{position:'absolute',left:55+(i%4)*78,top:98+Math.floor(i/4)*54,width:62,height:96-(i%3)*14,borderRadius:18,background:`linear-gradient(145deg,${colors[i]},rgba(255,255,255,.72))`,boxShadow:'0 14px 28px rgba(0,0,0,.28)',opacity:visible?1:.06,transform:`translateY(${visible?0:34}px) scale(${visible?1:.72}) rotate(${(i%2?1:-1)*4}deg)`}}/>;
    })}
    <div style={{position:'absolute',left:20,right:20,bottom:0,height:150,border:`13px solid ${C.accentLt}`,borderRadius:'38px 38px 105px 105px',background:'linear-gradient(180deg,rgba(92,255,173,.17),rgba(0,128,63,.07))',boxShadow:'inset 0 0 40px rgba(92,255,173,.09),0 28px 65px rgba(0,0,0,.34)'}}/>
    {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:105+i*72,bottom:28,width:7,height:90,borderRadius:5,background:'rgba(255,255,255,.22)',transform:'skewX(-12deg)'}}/>)}
  </div>;
};

const EuroDisk:React.FC<{label:string;scale?:number}> = ({label,scale=1}) => <div style={{width:300,height:300,borderRadius:'50%',transform:`scale(${scale})`,background:'radial-gradient(circle at 32% 26%,#fff4c7 0%,#ffd76b 18%,#d89b13 62%,#895b05 100%)',border:'8px solid rgba(255,231,160,.72)',boxShadow:'0 42px 95px rgba(255,200,61,.28), inset -18px -24px 45px rgba(91,54,0,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.heading,fontSize:68,fontWeight:900,color:'#211500',textShadow:'0 2px 0 rgba(255,255,255,.35)'}}>{label}</div>;

const Pill:React.FC<{children:React.ReactNode;color?:string}> = ({children,color=C.white}) => <div style={{padding:'12px 22px',borderRadius:999,background:'rgba(3,13,8,.72)',border:'1px solid rgba(255,255,255,.14)',fontFamily:FONT.body,fontSize:24,fontWeight:900,color,boxShadow:'0 12px 30px rgba(0,0,0,.28)'}}>{children}</div>;

export const PriceLevelMechanismAnimation:React.FC<{durationFrames:number}> = ({durationFrames}) => {
  const frame=useCurrentFrame();
  const progress=progressBetween(frame,durationFrames,.08,.86);
  const pulse=interpolate(Math.sin(frame/8),[-1,1],[.95,1.05]);
  const items=8-Math.floor(progress*3.2);
  const tags=[2.49,3.29,4.19].map(v=>v*(1+.42*progress));

  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:1000,height:980,position:'relative'}}>
      {[0,1,2].map(i=><div key={i} style={{position:'absolute',left:415-i*42,top:160-i*42,width:190+i*84,height:650+i*84,borderRadius:120,border:`${4+i*2}px solid rgba(255,90,70,${.15+.12*progress})`,opacity:.35+.5*progress,transform:`scale(${.82+.18*progress})`}}/>)}
      <div style={{position:'absolute',left:22,top:320}}><EuroDisk label="100 €"/></div>
      <div style={{position:'absolute',left:322,top:390,width:265,height:24,borderRadius:12,background:'rgba(255,255,255,.1)',overflow:'hidden',boxShadow:'0 0 34px rgba(255,200,61,.1)'}}>
        <div style={{height:'100%',width:`${20+80*progress}%`,background:`linear-gradient(90deg,${C.gold},#ff9a64,${C.negativeLt})`}}/>
      </div>
      <div style={{position:'absolute',left:342,top:322}}><Pill color={C.negativeLt}>PREISDRUCK ↑</Pill></div>
      <div style={{position:'absolute',right:0,top:285,transform:`scale(${pulse})`}}><Basket3D scale={1.25} items={items}/></div>
      {tags.map((value,i)=><div key={i} style={{position:'absolute',right:45+i*128,top:170-i*38,transform:`translateY(${-70*progress}px) rotate(${i===1?3:-3}deg)`,padding:'11px 16px',borderRadius:16,background:'linear-gradient(145deg,#ff8a72,#b01030)',fontFamily:FONT.heading,fontSize:29,fontWeight:900,color:C.white,boxShadow:'0 18px 38px rgba(176,16,48,.26)'}}>{value.toFixed(2).replace('.',',')} €</div>)}
      <div style={{position:'absolute',left:55,right:55,bottom:60,textAlign:'center',fontFamily:FONT.heading,fontSize:46,lineHeight:1,fontWeight:900,color:C.white}}>GLEICHES GELD · WENIGER IM KORB</div>
    </div>
  </AbsoluteFill>;
};

export const BasketPriceOverTimeAnimation:React.FC<{durationFrames:number}> = ({durationFrames}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const progress=progressBetween(frame,durationFrames,.06,.92);
  const year=20*progress;
  const price=100*Math.pow(1.03,year);
  const enter=spring({frame,fps,config:{damping:18,stiffness:105}});
  const checkpoints=[{y:0,v:100},{y:5,v:116},{y:10,v:134},{y:20,v:181}];

  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:1000,height:980,position:'relative'}}>
      <div style={{position:'absolute',left:285,top:120,transform:`translateY(${(1-enter)*80}px)`}}><Basket3D scale={1.34}/></div>
      <div style={{position:'absolute',right:65,top:180,width:290,height:190,borderRadius:48,background:'linear-gradient(145deg,#ffe89e,#bf7f00)',boxShadow:'0 34px 90px rgba(255,200,61,.26)',transform:`rotate(${interpolate(progress,[0,1],[-5,4])}deg)`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:FONT.body,fontSize:23,fontWeight:900,color:'#4a3100'}}>WARENKORB</div>
        <div style={{fontFamily:FONT.heading,fontSize:82,fontWeight:900,color:'#171000'}}>{Math.round(price)} €</div>
      </div>
      <div style={{position:'absolute',left:70,right:70,bottom:165,height:34,borderRadius:18,background:'rgba(255,255,255,.08)',boxShadow:'inset 0 0 0 1px rgba(255,255,255,.08)'}}>
        <div style={{height:'100%',width:`${100*progress}%`,borderRadius:18,background:`linear-gradient(90deg,${C.accent},${C.gold},${C.negativeLt})`,boxShadow:'0 0 32px rgba(255,200,61,.2)'}}/>
      </div>
      {checkpoints.map(m=>{
        const active=year>=m.y;
        const x=62+810*m.y/20;
        return <div key={m.y} style={{position:'absolute',left:x,bottom:72,transform:'translateX(-50%)',textAlign:'center',opacity:active?1:.32}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:active?C.white:C.grayDk,margin:'0 auto 8px',boxShadow:active?'0 0 28px rgba(92,255,173,.6)':'none'}}/>
          <div style={{fontFamily:FONT.heading,fontSize:28,fontWeight:900,color:C.white}}>{m.y} J.</div>
          <div style={{fontFamily:FONT.body,fontSize:23,fontWeight:900,color:active?C.goldLt:C.grayDk}}>{m.v} €</div>
        </div>;
      })}
      <div style={{position:'absolute',left:0,right:0,bottom:10,textAlign:'center',fontFamily:FONT.body,fontSize:24,color:C.graySoft}}>MODELLANNAHME · 3 % PRO JAHR</div>
    </div>
  </AbsoluteFill>;
};

export const PurchasingPowerTimelineAnimation:React.FC<{durationFrames:number}> = ({durationFrames}) => {
  const frame=useCurrentFrame();
  const progress=progressBetween(frame,durationFrames,.05,.93);
  const year=20*progress;
  const real=10000/Math.pow(1.03,year);
  const milestones=[{y:0,v:10000,s:1},{y:5,v:8626,s:.86},{y:10,v:7441,s:.74},{y:20,v:5537,s:.55}];

  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:1020,height:980,position:'relative'}}>
      <div style={{position:'absolute',left:0,right:0,top:18,textAlign:'center'}}>
        <div style={{fontFamily:FONT.heading,fontSize:94,fontWeight:900,color:C.goldLt,textShadow:'0 18px 46px rgba(255,200,61,.18)'}}>{euro(real)}</div>
        <div style={{fontFamily:FONT.body,fontSize:25,fontWeight:800,color:C.graySoft}}>HEUTIGE KAUFKRAFT</div>
      </div>
      <div style={{position:'absolute',left:20,right:20,bottom:130,height:560,display:'flex',alignItems:'end',justifyContent:'space-between'}}>
        {milestones.map(m=>{
          const active=year>=m.y;
          return <div key={m.y} style={{width:235,height:520,position:'relative',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'end',opacity:active?1:.2}}>
            <div style={{height:340,display:'flex',alignItems:'end',justifyContent:'center'}}><Basket3D scale={.58*m.s+.16} items={Math.max(4,Math.round(8*m.s))}/></div>
            <div style={{marginTop:8,fontFamily:FONT.heading,fontSize:31,fontWeight:900,color:C.white}}>{m.y} JAHRE</div>
            <div style={{fontFamily:FONT.body,fontSize:25,fontWeight:900,color:C.goldLt}}>{m.v.toLocaleString('de-DE')} €</div>
            <div style={{width:170,height:8,borderRadius:4,background:active?C.accent:'rgba(255,255,255,.12)',marginTop:14}}/>
          </div>;
        })}
      </div>
      <div style={{position:'absolute',left:70,right:70,bottom:82,height:3,background:'rgba(255,255,255,.12)'}}>
        <div style={{height:'100%',width:`${100*progress}%`,background:C.accentLt,boxShadow:'0 0 24px rgba(92,255,173,.55)'}}/>
      </div>
    </div>
  </AbsoluteFill>;
};

export const BuyingPowerLossAnimation:React.FC<{durationFrames:number}> = ({durationFrames}) => {
  const frame=useCurrentFrame();
  const progress=progressBetween(frame,durationFrames,.10,.86);
  const lostCount=Math.floor(progress*9);

  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:1030,height:980,position:'relative'}}>
      <div style={{position:'absolute',left:18,top:285,width:330,height:330,borderRadius:78,background:'linear-gradient(145deg,#ffe899,#bd7c00)',boxShadow:'0 35px 90px rgba(255,200,61,.24)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:FONT.body,fontSize:25,fontWeight:900,color:'#523700'}}>NOMINAL BLEIBT</div>
        <div style={{fontFamily:FONT.heading,fontSize:76,fontWeight:900,color:'#191000'}}>10.000 €</div>
      </div>
      <div style={{position:'absolute',right:-40,top:245,width:340,height:340,borderRadius:'50%',background:'radial-gradient(circle,#ff6b6b 0%,#86112b 35%,rgba(134,17,43,.22) 66%,rgba(0,0,0,0) 72%)',filter:'drop-shadow(0 0 55px rgba(255,51,51,.25))',transform:`rotate(${progress*190}deg)`}}/>
      <div style={{position:'absolute',right:25,top:610}}><Pill color={C.negativeLt}>INFLATION</Pill></div>
      <div style={{position:'absolute',left:385,top:250,width:410,height:410,display:'grid',gridTemplateColumns:'repeat(5,70px)',gap:14}}>
        {Array.from({length:20}).map((_,i)=>{
          const lost=i<lostCount;
          const row=Math.floor(i/5);
          const col=i%5;
          return <div key={i} style={{width:70,height:70,borderRadius:20,background:lost?'linear-gradient(145deg,#ff8b72,#b01030)':`linear-gradient(145deg,${C.accentLt},${C.accentDk})`,border:`2px solid ${lost?C.negativeLt:C.accentLt}`,boxShadow:lost?'0 16px 32px rgba(176,16,48,.24)':'0 14px 30px rgba(0,210,106,.16)',transform:lost?`translate(${245+col*8}px,${(row-1.5)*25}px) scale(${.2+.22*(1-progress)}) rotate(${100+20*i}deg)`:'translate(0,0) scale(1)',opacity:lost?Math.max(.08,1-progress):1}}/>;
        })}
      </div>
      <div style={{position:'absolute',left:330,right:250,bottom:70,textAlign:'center',fontFamily:FONT.heading,fontSize:72,fontWeight:900,color:C.negativeLt}}>{(44.6*progress).toFixed(progress>.92?1:0).replace('.',',')} %</div>
      <div style={{position:'absolute',left:330,right:250,bottom:25,textAlign:'center',fontFamily:FONT.body,fontSize:27,fontWeight:900,color:C.white}}>KAUFKRAFT VERLOREN</div>
    </div>
  </AbsoluteFill>;
};

const ValueTank:React.FC<{label:string;value:number;fill:number;color:string}> = ({label,value,fill,color}) => <div style={{width:350,height:650,position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>
  <div style={{fontFamily:FONT.heading,fontSize:35,fontWeight:900,color,marginBottom:12}}>{label}</div>
  <div style={{width:280,height:470,borderRadius:80,border:'3px solid rgba(255,255,255,.18)',background:'linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.015))',overflow:'hidden',position:'relative',boxShadow:'inset 0 0 50px rgba(0,0,0,.24),0 30px 70px rgba(0,0,0,.28)'}}>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:`${Math.max(4,fill*100)}%`,background:`linear-gradient(180deg,${color},rgba(5,65,34,.92))`,boxShadow:`0 -12px 34px ${color}55`}}/>
    <div style={{position:'absolute',left:25,right:25,top:40,height:10,borderRadius:6,background:'rgba(255,255,255,.18)'}}/>
  </div>
  <div style={{fontFamily:FONT.heading,fontSize:43,fontWeight:900,color:C.white,marginTop:16}}>{euro(value)}</div>
</div>;

export const NominalVsRealAnimation:React.FC<{durationFrames:number}> = ({durationFrames}) => {
  const frame=useCurrentFrame();
  const progress=progressBetween(frame,durationFrames,.08,.90);
  const real=10000/Math.pow(1.03,20*progress);
  const fill=real/10000;

  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:1000,height:980,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',gap:95}}>
      <ValueTank label="NOMINAL" value={10000} fill={1} color={C.gold}/>
      <div style={{fontFamily:FONT.heading,fontSize:74,fontWeight:900,color:C.graySoft,marginTop:-80}}>≠</div>
      <ValueTank label="REAL" value={real} fill={fill} color={C.negativeLt}/>
      {Array.from({length:7}).map((_,i)=>{
        const active=progress>i/8;
        return <div key={i} style={{position:'absolute',right:80+i*22,top:690-i*46,width:22,height:22,borderRadius:'50%',background:C.negativeLt,opacity:active?0.75:0,transform:`translateX(${80*progress}px) scale(${1-.4*progress})`,boxShadow:'0 0 20px rgba(255,51,51,.35)'}}/>;
      })}
      <div style={{position:'absolute',left:0,right:0,bottom:30,textAlign:'center',fontFamily:FONT.body,fontSize:28,fontWeight:900,color:C.white}}>DER KONTOSTAND BLEIBT · DIE KAUFKRAFT SINKT</div>
    </div>
  </AbsoluteFill>;
};

export const SamePurchasingPowerTargetAnimation:React.FC<{durationFrames:number}> = ({durationFrames}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const progress=progressBetween(frame,durationFrames,.06,.90);
  const year=20*progress;
  const needed=10000*Math.pow(1.03,year);
  const enter=spring({frame,fps,config:{damping:18,stiffness:115}});
  const stackCount=Math.round(7+9*progress);

  return <AbsoluteFill style={{alignItems:'center',justifyContent:'center'}}>
    <div style={{width:1030,height:980,position:'relative'}}>
      <div style={{position:'absolute',left:35,top:300,transform:`translateX(${(1-enter)*-120}px)`}}>
        <Basket3D scale={1.32}/>
        <div style={{textAlign:'center',fontFamily:FONT.heading,fontSize:31,fontWeight:900,color:C.white,marginTop:8}}>GLEICHE KAUFKRAFT</div>
      </div>
      <div style={{position:'absolute',right:50,top:175,width:390,height:620}}>
        <div style={{position:'absolute',left:0,right:0,bottom:90,height:455}}>
          {Array.from({length:16}).map((_,i)=>{
            const active=i<stackCount;
            return <div key={i} style={{position:'absolute',left:35+(i%2)*12,bottom:i*26,width:300,height:46,borderRadius:24,background:active?'linear-gradient(180deg,#ffe897,#c98b0e)':'rgba(255,255,255,.05)',border:'2px solid rgba(255,235,170,.34)',boxShadow:active?'0 10px 24px rgba(255,200,61,.16)':'none',opacity:active?1:.08,transform:`translateY(${active?0:25}px)`}}/>;
          })}
        </div>
        <div style={{position:'absolute',left:-10,right:-10,bottom:18,textAlign:'center',fontFamily:FONT.heading,fontSize:64,fontWeight:900,color:C.goldLt,textShadow:'0 18px 40px rgba(255,200,61,.22)'}}>{euro(needed)}</div>
      </div>
      <div style={{position:'absolute',left:80,right:80,bottom:95,height:20,borderRadius:10,background:'rgba(255,255,255,.08)',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${100*progress}%`,borderRadius:10,background:`linear-gradient(90deg,${C.accent},${C.gold})`}}/>
      </div>
      <div style={{position:'absolute',left:82,bottom:42,fontFamily:FONT.body,fontSize:26,fontWeight:900,color:C.white}}>HEUTE · 10.000 €</div>
      <div style={{position:'absolute',right:82,bottom:42,fontFamily:FONT.body,fontSize:26,fontWeight:900,color:C.white}}>{Math.round(year)} JAHRE</div>
    </div>
  </AbsoluteFill>;
};
