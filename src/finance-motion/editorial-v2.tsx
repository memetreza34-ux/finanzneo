import React from 'react';
import {Pie, Circle, Rect} from '@remotion/shapes';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT} from '../brand';
import {EDITORIAL_MOTION_COLORS as E} from '../brand/components/EditorialMotion';

const CLAMP = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

const p = (frame:number, from:number, to:number, easing=(x:number)=>x) =>
  interpolate(frame,[from,to],[0,1],{...CLAMP,easing});

const pop = (frame:number, from:number, fps:number) =>
  spring({frame:Math.max(0,frame-from),fps,config:{damping:18,stiffness:165,mass:0.72}});

const Surface:React.FC<{
  children:React.ReactNode;
  tone?:'cream'|'off-white'|'green'|'gray';
}> = ({children,tone='cream'}) => {
  const bg={
    cream:'#F4EFE4',
    'off-white':'#FBF8F1',
    green:'#E8EFE9',
    gray:'#ECEDEA',
  }[tone];
  return <AbsoluteFill style={{background:bg,color:E.ink,fontFamily:FONT.body,overflow:'hidden'}}>{children}</AbsoluteFill>;
};

const Kicker:React.FC<{children:React.ReactNode}> = ({children}) => (
  <div style={{
    position:'absolute',left:96,top:120,fontSize:24,fontWeight:800,
    letterSpacing:1.2,textTransform:'uppercase',color:E.inkSoft,
  }}>{children}</div>
);

const Title:React.FC<{children:React.ReactNode}> = ({children}) => (
  <div style={{
    position:'absolute',left:96,right:96,top:170,fontFamily:FONT.title,
    fontSize:58,lineHeight:1.05,fontWeight:900,color:E.ink,
  }}>{children}</div>
);

const ValuePill:React.FC<{
  x:number;y:number;text:string;tone?:'green'|'orange'|'blue'|'gold';scale?:number;opacity?:number;
}> = ({x,y,text,tone='green',scale=1,opacity=1}) => {
  const color={green:E.greenDark,orange:E.orange,blue:E.blue,gold:E.gold}[tone];
  return <div style={{
    position:'absolute',left:x,top:y,padding:'14px 22px',borderRadius:18,
    background:'#FFFFFF',border:'2px solid '+color,color,fontFamily:FONT.title,
    fontWeight:900,fontSize:32,transform:'scale('+scale+')',opacity,
    transformOrigin:'50% 50%',boxShadow:'0 10px 28px rgba(36,48,42,0.08)',
  }}>{text}</div>;
};

export const SalaryCurveV2:React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const path='M 150 1160 C 260 1115 330 1090 410 1070 C 520 1040 590 1018 660 995 C 760 960 815 820 900 650';
  const draw=p(frame,20,126,Easing.inOut(Easing.cubic));
  const evo=evolvePath(draw,path);
  const len=getLength(path);
  const point=getPointAtLength(path,len*draw);
  const first=p(frame,8,22);
  const payoff=p(frame,128,148);
  const bounce=pop(frame,132,fps);

  const milestones=[
    {x:150,y:1160,value:'3.000 €',label:'Start',at:14},
    {x:410,y:1070,value:'3.100 €',label:'Jahr 1',at:45},
    {x:660,y:995,value:'3.200 €',label:'Jahr 2',at:78},
    {x:900,y:650,value:'3.800 €',label:'Jobwechsel',at:122},
  ];

  return <Surface tone="cream">
    <Kicker>Gehalt</Kicker>
    <Title>Kleine Erhöhungen.<br/>Dann ein echter Sprung.</Title>

    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      <line x1="130" y1="1220" x2="930" y2="1220" stroke="#D7D8D3" strokeWidth="4"/>
      <path d={path} fill="none" stroke="#D7DDD8" strokeWidth="14" strokeLinecap="round"/>
      <path d={path} fill="none" stroke={E.green} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={evo.strokeDasharray} strokeDashoffset={evo.strokeDashoffset}/>
    </svg>

    {milestones.map((m,i)=>{
      const show=p(frame,m.at,m.at+14,Easing.out(Easing.cubic));
      const isLast=i===milestones.length-1;
      return <React.Fragment key={m.label}>
        <div style={{
          position:'absolute',left:m.x-14,top:m.y-14,width:28,height:28,borderRadius:'50%',
          background:isLast?E.greenDark:E.blue,border:'5px solid #F4EFE4',
          opacity:show,transform:'scale('+(0.7+0.3*show)+')',
        }}/>
        <div style={{
          position:'absolute',left:m.x-105,top:m.y-85,width:210,textAlign:'center',
          fontFamily:FONT.title,fontWeight:900,fontSize:isLast?40:31,
          color:isLast?E.greenDark:E.ink,opacity:show,
          transform:'translateY('+((1-show)*10)+'px)',
        }}>{m.value}</div>
        <div style={{
          position:'absolute',left:m.x-100,top:1240,width:200,textAlign:'center',
          fontSize:22,fontWeight:800,color:isLast?E.greenDark:E.inkSoft,opacity:show,
        }}>{m.label}</div>
      </React.Fragment>;
    })}

    <div style={{
      position:'absolute',left:point.x-18,top:point.y-18,width:36,height:36,borderRadius:'50%',
      background:E.ink,border:'6px solid #F4EFE4',opacity:first,
      boxShadow:'0 5px 16px rgba(36,48,42,0.14)',
    }}/>

    <ValuePill x={730} y={790} text="+600 €" tone="green" opacity={payoff} scale={0.88+bounce*0.12}/>
  </Surface>;
};

export const BudgetDonutV2:React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const enter=pop(frame,10,fps);
  const total=2600;
  const parts=[
    {label:'Fixkosten',share:0.55,color:E.neutral,value:'1.430 €'},
    {label:'Leben',share:0.25,color:E.blue,value:'650 €'},
    {label:'Investieren',share:0.20,color:E.green,value:'520 €'},
  ];
  let rotation=-Math.PI/2;

  return <Surface tone="off-white">
    <Kicker>Budget</Kicker>
    <Title>2.600 € bekommen.<br/>So verteilt es sich.</Title>

    <div style={{position:'absolute',left:190,top:565,width:700,height:700,transform:'scale('+enter+')'}}>
      {parts.map((part,i)=>{
        const before=parts.slice(0,i).reduce((s,x)=>s+x.share,0);
        const reveal=p(frame,28+i*22,58+i*22,Easing.out(Easing.cubic));
        const r=rotation+before*Math.PI*2;
        return <Pie
          key={part.label}
          radius={250}
          progress={part.share*reveal}
          rotation={r}
          fill={part.color}
          style={{position:'absolute',left:100,top:100}}
        />;
      })}
      <Circle radius={150} fill="#FBF8F1" style={{position:'absolute',left:200,top:200}}/>
      <div style={{
        position:'absolute',left:230,top:300,width:240,textAlign:'center',
        fontFamily:FONT.title,fontWeight:900,fontSize:46,color:E.ink,
      }}>{total.toLocaleString('de-DE')} €</div>
      <div style={{
        position:'absolute',left:230,top:358,width:240,textAlign:'center',
        fontSize:23,fontWeight:800,color:E.inkSoft,
      }}>Nettoeinkommen</div>
    </div>

    <div style={{position:'absolute',left:135,right:135,top:1310,display:'grid',gap:18}}>
      {parts.map((part,i)=>{
        const show=p(frame,52+i*18,68+i*18);
        return <div key={part.label} style={{
          display:'grid',gridTemplateColumns:'26px 1fr auto',alignItems:'center',gap:18,
          opacity:show,transform:'translateY('+((1-show)*10)+'px)',
          fontSize:26,fontWeight:800,color:E.ink,
        }}>
          <div style={{width:18,height:18,borderRadius:6,background:part.color}}/>
          <div>{part.label}</div>
          <div style={{fontFamily:FONT.title,fontWeight:900}}>{part.value}</div>
        </div>;
      })}
    </div>
  </Surface>;
};

export const CompoundCurveV2:React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const path='M 145 1180 C 270 1168 360 1140 450 1098 C 565 1045 675 935 770 790 C 835 690 875 585 915 470';
  const draw=p(frame,20,130,Easing.inOut(Easing.cubic));
  const evo=evolvePath(draw,path);
  const len=getLength(path);
  const marker=getPointAtLength(path,len*draw);
  const endPop=pop(frame,128,fps);

  return <Surface tone="green">
    <Kicker>Zinseszins</Kicker>
    <Title>Wachstum wird mit der Zeit<br/>immer schneller.</Title>

    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      {[1180,1000,820,640].map((y)=><line key={y} x1="130" x2="930" y1={y} y2={y} stroke="#D4DDD5" strokeWidth="3"/>)}
      <path d={path} fill="none" stroke="#C6D2C8" strokeWidth="18" strokeLinecap="round"/>
      <path d={path} fill="none" stroke={E.greenDark} strokeWidth="18" strokeLinecap="round"
        strokeDasharray={evo.strokeDasharray} strokeDashoffset={evo.strokeDashoffset}/>
    </svg>

    <div style={{
      position:'absolute',left:marker.x-18,top:marker.y-18,width:36,height:36,
      borderRadius:'50%',background:E.greenDark,border:'6px solid #E8EFE9',
    }}/>

    {[
      {x:145,y:1180,label:'Start',value:'10k',at:20},
      {x:450,y:1098,label:'10 J.',value:'18k',at:58},
      {x:770,y:790,label:'20 J.',value:'34k',at:96},
      {x:915,y:470,label:'30 J.',value:'64k',at:126},
    ].map((m,i)=>{
      const show=p(frame,m.at,m.at+12);
      return <React.Fragment key={m.label}>
        <div style={{position:'absolute',left:m.x-75,top:m.y+34,width:150,textAlign:'center',fontSize:21,fontWeight:800,color:E.inkSoft,opacity:show}}>{m.label}</div>
        <div style={{position:'absolute',left:m.x-75,top:m.y-66,width:150,textAlign:'center',fontFamily:FONT.title,fontSize:30,fontWeight:900,color:E.ink,opacity:show}}>{m.value}</div>
      </React.Fragment>;
    })}

    <ValuePill x={705} y={1280} text="Kurve statt Linie" tone="green" opacity={p(frame,130,150)} scale={0.9+endPop*0.1}/>
  </Surface>;
};

export const DiversificationNetworkV2:React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const nodes=[
    {x:180,y:700,label:'Tech',color:E.blue},
    {x:735,y:690,label:'Gesundheit',color:E.green},
    {x:170,y:1090,label:'Industrie',color:E.neutral},
    {x:740,y:1090,label:'Konsum',color:E.gold},
  ];
  const center={x:540,y:900};

  return <Surface tone="off-white">
    <Kicker>Diversifikation</Kicker>
    <Title>Ein ETF.<br/>Viele verschiedene Bereiche.</Title>

    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
      {nodes.map((n,i)=>{
        const path=`M ${center.x} ${center.y} Q ${(center.x+n.x)/2} ${center.y-80+(i%2)*160} ${n.x} ${n.y}`;
        const draw=p(frame,24+i*12,70+i*12,Easing.out(Easing.cubic));
        const evo=evolvePath(draw,path);
        return <path key={n.label} d={path} fill="none" stroke={n.color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={evo.strokeDasharray} strokeDashoffset={evo.strokeDashoffset}/>;
      })}
    </svg>

    <div style={{
      position:'absolute',left:425,top:785,width:230,height:230,borderRadius:'50%',
      background:E.green,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',
      fontFamily:FONT.title,fontSize:58,fontWeight:900,
      transform:'scale('+pop(frame,10,fps)+')',
      boxShadow:'0 18px 42px rgba(63,109,84,0.18)',
    }}>ETF</div>

    {nodes.map((n,i)=>{
      const show=pop(frame,54+i*12,fps);
      return <div key={n.label} style={{
        position:'absolute',left:n.x-105,top:n.y-55,width:210,height:110,borderRadius:28,
        background:'#fff',border:'3px solid '+n.color,display:'flex',alignItems:'center',
        justifyContent:'center',textAlign:'center',fontSize:25,fontWeight:850,color:E.ink,
        transform:'scale('+(0.82+0.18*show)+')',opacity:show,
        boxShadow:'0 12px 32px rgba(36,48,42,0.08)',
      }}>{n.label}</div>;
    })}

    <div style={{
      position:'absolute',left:180,right:180,top:1340,textAlign:'center',
      fontSize:28,fontWeight:800,color:E.inkSoft,opacity:p(frame,120,145),
    }}>Risiko verteilt sich auf mehrere Bereiche.</div>
  </Surface>;
};

export const LoanPaydownV2:React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const stages=[
    {at:20,label:'24.000 €',width:760},
    {at:55,label:'21.000 €',width:665},
    {at:90,label:'18.000 €',width:570},
    {at:125,label:'15.000 €',width:475},
  ];
  const active=frame<55?0:frame<90?1:frame<125?2:3;
  const localFrom=stages[active].at;
  const prev=active===0?stages[0]:stages[active-1];
  const next=stages[active];
  const shrink=active===0?stages[0].width:interpolate(frame,[localFrom,localFrom+22],[prev.width,next.width],CLAMP);
  const label=active===0?stages[0].label:next.label;

  return <Surface tone="cream">
    <Kicker>Kredit</Kicker>
    <Title>Jede Rate nimmt<br/>ein Stück Restschuld weg.</Title>

    <div style={{position:'absolute',left:160,top:720,width:760,height:190,borderRadius:34,background:'#E3DED4'}}/>
    <div style={{
      position:'absolute',left:160,top:720,width:shrink,height:190,borderRadius:34,
      background:E.orange,display:'flex',alignItems:'center',justifyContent:'center',
      fontFamily:FONT.title,fontSize:50,fontWeight:900,color:'#fff',
      boxShadow:'0 16px 38px rgba(215,124,95,0.16)',
    }}>{label}</div>

    {stages.slice(1).map((s,i)=>{
      const fall=pop(frame,s.at-16,fps);
      const x=235+i*230;
      return <React.Fragment key={s.label}>
        <div style={{
          position:'absolute',left:x,top:1020+(1-fall)*-80,width:150,height:72,borderRadius:20,
          background:'#fff',border:'2px solid '+E.green,color:E.greenDark,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:FONT.title,fontWeight:900,fontSize:25,opacity:fall,
          boxShadow:'0 10px 24px rgba(36,48,42,0.07)',
        }}>Rate</div>
        <div style={{
          position:'absolute',left:x+64,top:940,width:22,height:22,borderRadius:'50%',
          background:E.green,opacity:p(frame,s.at-4,s.at+8),
        }}/>
      </React.Fragment>;
    })}

    <div style={{
      position:'absolute',left:160,right:160,top:1260,textAlign:'center',
      fontSize:27,fontWeight:800,color:E.inkSoft,opacity:p(frame,130,150),
    }}>Restschuld sinkt sichtbar mit jeder Zahlung.</div>
  </Surface>;
};

export const TaxBracketsV2:React.FC<{durationFrames?:number}> = ({durationFrames=180}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const brackets=[
    {label:'0 %',from:'0 €',to:'12k',color:'#D8DDD9',h:120},
    {label:'14–24 %',from:'12k',to:'30k',color:'#B9CBBE',h:165},
    {label:'24–42 %',from:'30k',to:'68k',color:'#8FB09B',h:205},
    {label:'42 %',from:'68k',to:'278k',color:E.green,h:245},
  ];

  return <Surface tone="off-white">
    <Kicker>Steuern</Kicker>
    <Title>Mehr Einkommen heißt nicht:<br/>alles wird höher besteuert.</Title>

    <div style={{position:'absolute',left:150,right:150,top:600,height:620,display:'flex',alignItems:'flex-end',gap:18}}>
      {brackets.map((b,i)=>{
        const show=pop(frame,18+i*18,fps);
        return <div key={b.label} style={{flex:1,height:b.h*show,borderRadius:'20px 20px 8px 8px',background:b.color,
          position:'relative',display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:20,
          fontFamily:FONT.title,fontSize:27,fontWeight:900,color:E.ink}}>
          <span style={{opacity:show}}>{b.label}</span>
          <div style={{position:'absolute',left:0,right:0,bottom:-42,textAlign:'center',fontSize:18,fontFamily:FONT.body,fontWeight:800,color:E.inkSoft,opacity:show}}>{b.to}</div>
        </div>;
      })}
    </div>

    <div style={{
      position:'absolute',left:760,top:540,width:150,height:80,borderRadius:20,background:'#fff',
      border:'2px solid '+E.orange,display:'flex',alignItems:'center',justifyContent:'center',
      fontFamily:FONT.title,fontSize:28,fontWeight:900,color:E.orange,
      opacity:p(frame,105,125),transform:'translateY('+((1-p(frame,105,125))*-25)+'px)',
    }}>80k €</div>

    <div style={{
      position:'absolute',left:150,right:150,top:1320,textAlign:'center',fontSize:27,fontWeight:800,
      color:E.inkSoft,opacity:p(frame,125,148),
    }}>Nur der Teil im höheren Bereich bekommt den höheren Satz.</div>
  </Surface>;
};

export const EDITORIAL_MOTION_V2 = {
  salaryCurve:SalaryCurveV2,
  budgetDonut:BudgetDonutV2,
  compoundCurve:CompoundCurveV2,
  diversificationNetwork:DiversificationNetworkV2,
  loanPaydown:LoanPaydownV2,
  taxBrackets:TaxBracketsV2,
} as const;
