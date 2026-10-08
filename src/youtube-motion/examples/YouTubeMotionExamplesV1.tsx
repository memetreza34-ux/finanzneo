import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../../brand';

export const YOUTUBE_MOTION_EXAMPLE_FRAMES = 240;

const C = {
  cream:'#F3EFE5',
  paper:'#FBF9F4',
  ink:'#1F2924',
  muted:'#6C756F',
  line:'#D9DDD7',
  green:'#4F8A67',
  greenDark:'#346449',
  blue:'#6687A3',
  orange:'#D97859',
  gold:'#C9A24C',
  red:'#C95F58',
  white:'#FFFFFF',
  sage:'#E2ECE4',
} as const;

const CLAMP={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const p=(f:number,a:number,b:number,e=Easing.out(Easing.cubic))=>interpolate(f,[a,b],[0,1],{...CLAMP,easing:e});
const s=(f:number,a:number,fps:number)=>spring({frame:Math.max(0,f-a),fps,config:{damping:20,stiffness:150,mass:0.75}});

const Shadow:React.CSSProperties={boxShadow:'0 20px 50px rgba(31,41,36,0.10)'};

const MoneyNote:React.FC<{x:number;y:number;scale?:number;opacity?:number}> = ({x,y,scale=1,opacity=1}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:470,height:250,borderRadius:30,
    background:'#E8F1E8',border:'4px solid '+C.green,opacity,
    transform:`scale(${scale}) rotate(-3deg)`,transformOrigin:'50% 50%',...Shadow
  }}>
    <div style={{position:'absolute',left:32,top:28,fontFamily:FONT.title,fontSize:38,fontWeight:900,color:C.greenDark}}>EURO</div>
    <div style={{position:'absolute',right:34,top:28,fontFamily:FONT.title,fontSize:38,fontWeight:900,color:C.greenDark}}>100</div>
    <div style={{position:'absolute',left:0,right:0,top:72,textAlign:'center',fontFamily:FONT.title,fontSize:112,fontWeight:900,color:C.greenDark}}>100 €</div>
    <div style={{position:'absolute',left:34,right:34,bottom:28,height:8,borderRadius:99,background:'#BCD0C0'}}/>
  </div>
);

const Basket:React.FC<{x:number;y:number;scale?:number}> = ({x,y,scale=1}) => (
  <div style={{position:'absolute',left:x,top:y,width:660,height:390,transform:`scale(${scale})`,transformOrigin:'50% 100%'}}>
    <svg width="660" height="390" viewBox="0 0 660 390">
      <path d="M110 120 H555 L505 330 H160 Z" fill="#F7F1E4" stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
      <path d="M175 120 C210 20 455 20 490 120" fill="none" stroke={C.ink} strokeWidth="12" strokeLinecap="round"/>
      {[210,290,370,450].map((x)=><line key={x} x1={x} y1="130" x2={x-18} y2="318" stroke="#C9C7C0" strokeWidth="7"/>)}
      <line x1="130" y1="195" x2="540" y2="195" stroke="#C9C7C0" strokeWidth="7"/>
      <line x1="145" y1="265" x2="520" y2="265" stroke="#C9C7C0" strokeWidth="7"/>
    </svg>
  </div>
);

const Product:React.FC<{x:number;y:number;kind:'milk'|'bread'|'apple'|'pasta'|'cheese'|'soap';show:number;delay:number;frame:number}> = ({x,y,kind,show,delay,frame}) => {
  const exit=p(frame,150+delay,190+delay,Easing.in(Easing.cubic));
  const opacity=show*(1-exit);
  const dy=interpolate(exit,[0,1],[0,-180],CLAMP);
  const rot=interpolate(exit,[0,1],[0,(delay%2===0?1:-1)*15],CLAMP);
  const common:React.CSSProperties={position:'absolute',left:x,top:y,opacity,transform:`translateY(${dy}px) rotate(${rot}deg)`,transformOrigin:'50% 100%'};
  if(kind==='milk') return <div style={{...common,width:80,height:140,borderRadius:15,background:'#EAF0F5',border:'3px solid '+C.blue}}><div style={{height:35,background:C.blue,borderRadius:'12px 12px 0 0'}}/></div>;
  if(kind==='bread') return <div style={{...common,width:130,height:85,borderRadius:'58px 58px 24px 24px',background:'#D9B078',border:'3px solid #B88B52'}}/>;
  if(kind==='apple') return <div style={{...common,width:78,height:78,borderRadius:'50%',background:C.red,border:'3px solid #A64B46'}}><div style={{position:'absolute',left:38,top:-18,width:8,height:22,borderRadius:8,background:C.greenDark}}/></div>;
  if(kind==='pasta') return <div style={{...common,width:90,height:125,borderRadius:16,background:'#E9C96E',border:'3px solid '+C.gold}}><div style={{position:'absolute',left:18,right:18,top:20,bottom:20,border:'3px solid rgba(255,255,255,.65)',borderRadius:12}}/></div>;
  if(kind==='cheese') return <div style={{...common,width:120,height:95,clipPath:'polygon(0 100%, 0 30%, 100% 0, 100% 100%)',background:'#F1CC55',borderRadius:10}}/>;
  return <div style={{...common,width:70,height:120,borderRadius:20,background:'#C5D8CF',border:'3px solid '+C.green}}/>;
};

export const YouTubeMotionInflation:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const intro=s(frame,4,fps);
  const price=p(frame,72,155,Easing.inOut(Easing.cubic));
  const priceValue=interpolate(price,[0,1],[2.49,4.09],CLAMP).toFixed(2).replace('.',',');
  const basketScale=interpolate(price,[0,1],[1,0.93],CLAMP);
  const products=[
    {x:1080,y:520,kind:'milk' as const,delay:22},
    {x:1200,y:550,kind:'bread' as const,delay:32},
    {x:1370,y:500,kind:'apple' as const,delay:42},
    {x:1500,y:525,kind:'pasta' as const,delay:50},
    {x:1160,y:650,kind:'cheese' as const,delay:58},
    {x:1330,y:660,kind:'soap' as const,delay:66},
  ];
  const payoff=p(frame,190,218);
  return <AbsoluteFill style={{background:C.cream,fontFamily:FONT.body,overflow:'hidden'}}>
    <div style={{position:'absolute',left:0,right:0,top:0,height:18,background:C.green}}/>
    <MoneyNote x={170} y={390} scale={0.9+0.1*intro} opacity={intro}/>
    <div style={{position:'absolute',left:190,top:700,width:430,textAlign:'center',fontSize:28,fontWeight:800,color:C.muted,opacity:intro}}>bleibt gleich</div>

    <Basket x={1000} y={500} scale={basketScale}/>
    {products.map((it,i)=><Product key={i} {...it} frame={frame} show={s(frame,20+i*5,fps)}/>)}

    <div style={{
      position:'absolute',left:1060,top:250,width:470,height:160,borderRadius:30,
      background:C.white,border:'2px solid '+C.line,...Shadow,
      transform:`scale(${0.94+0.06*s(frame,55,fps)})`,opacity:s(frame,55,fps)
    }}>
      <div style={{position:'absolute',left:30,top:22,fontSize:24,fontWeight:800,color:C.muted}}>PREISNIVEAU</div>
      <div style={{position:'absolute',left:30,bottom:18,fontFamily:FONT.title,fontSize:72,fontWeight:900,color:C.orange}}>{priceValue} €</div>
      <div style={{position:'absolute',right:34,bottom:33,fontSize:36,fontWeight:900,color:C.orange}}>↑</div>
    </div>

    <div style={{
      position:'absolute',left:740,top:435,width:170,height:170,borderRadius:'50%',
      background:C.white,border:'3px solid '+C.orange,color:C.orange,
      display:'flex',alignItems:'center',justifyContent:'center',
      fontFamily:FONT.title,fontSize:56,fontWeight:900,opacity:price,
      transform:`scale(${0.75+0.25*price})`,...Shadow
    }}>≠</div>

    <div style={{
      position:'absolute',left:1160,top:875,width:470,height:100,borderRadius:26,
      background:C.orange,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',
      fontFamily:FONT.title,fontSize:46,fontWeight:900,opacity:payoff,
      transform:`translateY(${(1-payoff)*25}px)`
    }}>WENIGER IM KORB</div>
  </AbsoluteFill>;
};

const CompanyNode:React.FC<{x:number;y:number;label:string;tone:string;show:number;scale?:number}> = ({x,y,label,tone,show,scale=1}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:210,height:118,borderRadius:26,
    background:C.white,border:'3px solid '+tone,...Shadow,
    display:'flex',alignItems:'center',justifyContent:'center',
    fontSize:26,fontWeight:850,color:C.ink,opacity:show,
    transform:`scale(${(0.78+0.22*show)*scale})`
  }}>{label}</div>
);

export const YouTubeMotionETFNetwork:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const money=s(frame,6,fps);
  const intoHub=p(frame,38,78,Easing.inOut(Easing.cubic));
  const hub=s(frame,62,fps);
  const branch=p(frame,82,142,Easing.inOut(Easing.cubic));
  const payoff=p(frame,155,198);
  const moneyX=interpolate(intoHub,[0,1],[170,790],CLAMP);
  const moneyScale=interpolate(intoHub,[0,1],[1,0.58],CLAMP);
  const nodes=[
    {x:1210,y:170,label:'Technologie',tone:C.blue},
    {x:1490,y:280,label:'Industrie',tone:C.orange},
    {x:1370,y:510,label:'Gesundheit',tone:C.green},
    {x:1510,y:750,label:'Konsum',tone:C.gold},
    {x:1170,y:790,label:'Energie',tone:'#7B8794'},
    {x:980,y:240,label:'Finanzen',tone:'#8A75A8'},
  ];
  const center={x:915,y:530};
  return <AbsoluteFill style={{background:C.paper,fontFamily:FONT.body,overflow:'hidden'}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      {nodes.map((n,i)=>{
        const local=p(frame,88+i*5,130+i*5,Easing.out(Easing.cubic));
        const x2=interpolate(local,[0,1],[center.x,n.x+105],CLAMP);
        const y2=interpolate(local,[0,1],[center.y,n.y+59],CLAMP);
        return <path key={n.label} d={`M ${center.x} ${center.y} Q ${(center.x+n.x+105)/2} ${center.y+(i%2===0?-70:70)} ${x2} ${y2}`} fill="none" stroke={n.tone} strokeWidth="7" strokeLinecap="round" opacity={0.35+0.65*branch}/>;
      })}
    </svg>

    <div style={{
      position:'absolute',left:moneyX,top:430,width:360,height:190,borderRadius:34,
      background:C.sage,border:'4px solid '+C.green,display:'flex',alignItems:'center',justifyContent:'center',
      fontFamily:FONT.title,fontSize:72,fontWeight:900,color:C.greenDark,
      opacity:money,transform:`scale(${moneyScale})`,...Shadow
    }}>1.000 €</div>

    <div style={{
      position:'absolute',left:765,top:380,width:300,height:300,borderRadius:'50%',
      background:C.green,color:C.white,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      opacity:hub,transform:`scale(${0.72+0.28*hub})`,...Shadow
    }}>
      <div style={{fontSize:28,fontWeight:800,letterSpacing:2}}>1 ETF</div>
      <div style={{fontFamily:FONT.title,fontSize:88,fontWeight:900}}>→</div>
    </div>

    {nodes.map((n,i)=><CompanyNode key={n.label} {...n} show={s(frame,115+i*5,fps)} scale={payoff>0?1+0.02*Math.sin((frame+i*7)/8):1}/>)}

    <div style={{
      position:'absolute',left:210,top:745,width:420,fontSize:30,fontWeight:800,color:C.muted,
      opacity:p(frame,165,190)
    }}>ein Betrag</div>
    <div style={{
      position:'absolute',left:1150,top:925,width:520,textAlign:'center',
      fontFamily:FONT.title,fontSize:52,fontWeight:900,color:C.greenDark,
      opacity:payoff,transform:`translateY(${(1-payoff)*20}px)`
    }}>VIELE UNTERNEHMEN</div>
  </AbsoluteFill>;
};

const CostIcon:React.FC<{x:number;y:number;label:string;amount:string;tone:string;show:number;symbol:string}> = ({x,y,label,amount,tone,show,symbol}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:280,height:180,borderRadius:30,
    background:C.white,border:'3px solid '+tone,...Shadow,opacity:show,
    transform:`scale(${0.82+0.18*show})`
  }}>
    <div style={{position:'absolute',left:25,top:22,width:62,height:62,borderRadius:18,background:tone,color:C.white,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900}}>{symbol}</div>
    <div style={{position:'absolute',left:104,top:28,fontSize:24,fontWeight:850,color:C.ink}}>{label}</div>
    <div style={{position:'absolute',left:28,bottom:24,fontFamily:FONT.title,fontSize:54,fontWeight:900,color:tone}}>{amount}</div>
  </div>
);

export const YouTubeMotionSubscriptions:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const icons=[
    {x:120,y:170,label:'Mobilfunk',amount:'19 €',tone:C.blue,symbol:'☎'},
    {x:120,y:450,label:'Streaming',amount:'17 €',tone:C.orange,symbol:'▶'},
    {x:500,y:170,label:'Fitness',amount:'35 €',tone:C.green,symbol:'+'},
    {x:500,y:450,label:'Cloud',amount:'8 €',tone:'#8A75A8',symbol:'☁'},
  ];
  const streams=p(frame,72,132,Easing.inOut(Easing.cubic));
  const monthly=s(frame,120,fps);
  const calendar=p(frame,145,188,Easing.inOut(Easing.cubic));
  const annual=p(frame,183,218,Easing.out(Easing.back(1.1)));
  const monthlyValue=Math.round(interpolate(streams,[0,1],[0,79],CLAMP));
  const annualValue=Math.round(interpolate(annual,[0,1],[79,948],CLAMP));

  return <AbsoluteFill style={{background:'#EEF0ED',fontFamily:FONT.body,overflow:'hidden'}}>
    {icons.map((it,i)=><CostIcon key={it.label} {...it} show={s(frame,8+i*10,fps)}/>)}

    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      {icons.map((it,i)=>{
        const sx=it.x+280, sy=it.y+90;
        const ex=1050, ey=530;
        const local=p(frame,76+i*5,126+i*5,Easing.inOut(Easing.cubic));
        const tx=interpolate(local,[0,1],[sx,ex],CLAMP);
        const ty=interpolate(local,[0,1],[sy,ey],CLAMP);
        return <path key={it.label} d={`M ${sx} ${sy} C ${sx+180} ${sy} ${ex-180} ${ey} ${tx} ${ty}`} fill="none" stroke={it.tone} strokeWidth="8" strokeLinecap="round" opacity={0.3+0.7*local}/>;
      })}
    </svg>

    <div style={{
      position:'absolute',left:930,top:390,width:330,height:280,borderRadius:46,
      background:C.white,border:'3px solid '+C.green,...Shadow,
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      opacity:monthly,transform:`scale(${0.82+0.18*monthly})`
    }}>
      <div style={{fontSize:25,fontWeight:850,color:C.muted}}>PRO MONAT</div>
      <div style={{fontFamily:FONT.title,fontSize:86,fontWeight:900,color:C.greenDark}}>{monthlyValue} €</div>
    </div>

    <div style={{
      position:'absolute',left:1300,top:390,width:190,height:280,borderRadius:36,
      background:'#F8F4EA',border:'3px solid '+C.gold,...Shadow,
      opacity:calendar,transform:`translateX(${(1-calendar)*80}px) scale(${0.88+0.12*calendar})`
    }}>
      <div style={{height:52,borderRadius:'32px 32px 0 0',background:C.gold}}/>
      <div style={{position:'absolute',left:0,right:0,top:92,textAlign:'center',fontFamily:FONT.title,fontSize:46,fontWeight:900,color:C.ink}}>×12</div>
      <div style={{position:'absolute',left:0,right:0,bottom:42,textAlign:'center',fontSize:23,fontWeight:850,color:C.muted}}>MONATE</div>
    </div>

    <div style={{
      position:'absolute',left:1530,top:350,width:330,height:360,borderRadius:48,
      background:C.orange,color:C.white,...Shadow,opacity:annual,
      transform:`scale(${0.7+0.3*annual})`,
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'
    }}>
      <div style={{fontSize:25,fontWeight:850,letterSpacing:1}}>PRO JAHR</div>
      <div style={{fontFamily:FONT.title,fontSize:88,fontWeight:900}}>{annualValue} €</div>
    </div>
  </AbsoluteFill>;
};

export const YOUTUBE_MOTION_EXAMPLES = [
  {id:'YouTubeMotionInflation',component:YouTubeMotionInflation,file:'01-inflation-kaufkraft.mp4'},
  {id:'YouTubeMotionETFNetwork',component:YouTubeMotionETFNetwork,file:'02-etf-netzwerk.mp4'},
  {id:'YouTubeMotionSubscriptions',component:YouTubeMotionSubscriptions,file:'03-abos-jahreskosten.mp4'},
] as const;
