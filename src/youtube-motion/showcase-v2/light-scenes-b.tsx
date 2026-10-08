import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {FONT} from '../../brand';
import {CircleIcon, L, SceneFade, SoftPanel, Txt, CLAMP, pr, sp, useLightScene} from './light-primitives';

export const LightTimeline:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const draw=pr(frame,6,58,Easing.inOut(Easing.cubic));
  const points=[
    {x:260,label:'Start',value:'0 €',c:L.blue},
    {x:600,label:'3 J.',value:'12k',c:L.teal},
    {x:940,label:'6 J.',value:'31k',c:L.green},
    {x:1280,label:'9 J.',value:'58k',c:L.gold},
    {x:1620,label:'12 J.',value:'96k',c:L.orange},
  ];
  const endX=interpolate(draw,[0,1],[points[0].x,points[points.length-1].x],CLAMP);
  return <SceneFade background="#F4F8F6">
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      <line x1="260" x2="1620" y1="540" y2="540" stroke={L.line} strokeWidth="14" strokeLinecap="round"/>
      <line x1="260" x2={endX} y1="540" y2="540" stroke={L.green} strokeWidth="14" strokeLinecap="round"/>
    </svg>
    {points.map((m,i)=>{
      const show=sp(frame,10+i*8,fps);
      return <React.Fragment key={m.label}>
        <div style={{position:'absolute',left:m.x-22,top:518,width:44,height:44,borderRadius:'50%',background:m.c,border:'7px solid #F4F8F6',opacity:show,transform:`scale(${0.7+0.3*show})`}}/>
        <Txt x={m.x-90} y={405} width={180} align="center" size={44} title color={m.c} opacity={show}>{m.value}</Txt>
        <Txt x={m.x-90} y={610} width={180} align="center" size={23} color={L.muted} opacity={show}>{m.label}</Txt>
      </React.Fragment>;
    })}
  </SceneFade>;
};

export const LightProcess:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const steps=[
    {type:'wallet' as const,label:'Einkommen',c:L.blue},
    {type:'cart' as const,label:'Ausgaben',c:L.orange},
    {type:'shield' as const,label:'Reserve',c:L.teal},
    {type:'chart' as const,label:'Investieren',c:L.green},
  ];
  return <SceneFade background="#FFFDF8">
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      {steps.slice(0,-1).map((_,i)=>{
        const x1=380+i*390,x2=675+i*390;
        const d=pr(frame,18+i*9,48+i*9);
        return <line key={i} x1={x1} y1="535" x2={interpolate(d,[0,1],[x1,x2],CLAMP)} y2="535" stroke={L.line} strokeWidth="8" strokeLinecap="round"/>;
      })}
    </svg>
    {steps.map((s,i)=>{
      const show=sp(frame,5+i*10,fps);
      const x=210+i*390;
      return <div key={s.label} style={{position:'absolute',left:x,top:370,width:300,height:330,borderRadius:36,background:L.paper,border:'2px solid '+s.c+'44',opacity:show,transform:`scale(${0.88+0.12*show})`}}>
        <CircleIcon x={107} y={58} color={s.c} type={s.type} show={show}/>
        <Txt x={0} y={175} width={300} align="center" size={29}>{s.label}</Txt>
        <div style={{position:'absolute',left:105,top:250,width:90,height:9,borderRadius:99,background:s.c}}/>
      </div>;
    })}
  </SceneFade>;
};

export const LightFlowDiagram:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const draw=pr(frame,16,60,Easing.inOut(Easing.cubic));
  const sources=[
    {y:245,label:'Gehalt',value:'2.600 €',c:L.blue},
    {y:465,label:'Bonus',value:'300 €',c:L.teal},
    {y:685,label:'Nebenjob',value:'220 €',c:L.gold},
  ];
  const sinks=[
    {y:270,label:'Fixkosten',value:'1.450 €',c:L.orange},
    {y:500,label:'Leben',value:'720 €',c:L.purple},
    {y:730,label:'Sparen',value:'950 €',c:L.green},
  ];
  return <SceneFade background="#F7F6F2">
    {sources.map((s,i)=>{
      const show=sp(frame,4+i*6,fps);
      return <SoftPanel key={s.label} x={150} y={s.y} w={330} h={145} bg={L.paper} border={s.c+'55'} opacity={show} scale={0.94+0.06*show}>
        <Txt x={28} y={25} size={22} color={L.muted}>{s.label}</Txt>
        <Txt x={28} y={64} size={44} title color={s.c}>{s.value}</Txt>
      </SoftPanel>;
    })}
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      {sources.map((s,i)=>sinks.map((t,j)=>{
        const x1=480,y1=s.y+72,x2=1440,y2=t.y+72;
        const ex=interpolate(draw,[0,1],[x1,x2],CLAMP);
        const ey=interpolate(draw,[0,1],[y1,y2],CLAMP);
        const width=3+((i+j)%3)*2;
        return <path key={i+'-'+j} d={`M ${x1} ${y1} C 760 ${y1}, 1120 ${y2}, ${ex} ${ey}`} fill="none" stroke={j===2?L.green:(j===0?L.orange:L.purple)} strokeWidth={width} opacity={0.12+0.45*draw}/>;
      }))}
    </svg>
    {sinks.map((s,i)=>{
      const show=sp(frame,26+i*7,fps);
      return <SoftPanel key={s.label} x={1440} y={s.y} w={330} h={145} bg={L.paper} border={s.c+'55'} opacity={show} scale={0.94+0.06*show}>
        <Txt x={28} y={25} size={22} color={L.muted}>{s.label}</Txt>
        <Txt x={28} y={64} size={44} title color={s.c}>{s.value}</Txt>
      </SoftPanel>;
    })}
  </SceneFade>;
};

export const LightInvoice:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const paper=sp(frame,4,fps);
  const fee=sp(frame,28,fps);
  const total=pr(frame,42,68);
  const amount=Math.round(interpolate(total,[0,1],[100,118],CLAMP));
  return <SceneFade background="#EEF2F4">
    <div style={{position:'absolute',left:360,top:120,width:760,height:830,borderRadius:24,background:L.paper,border:'2px solid '+L.line,boxShadow:'0 22px 50px rgba(35,45,50,.08)',opacity:paper,transform:`scale(${0.94+0.06*paper})`,padding:55,boxSizing:'border-box'}}>
      <div style={{fontFamily:FONT.title,fontSize:54,fontWeight:900,color:L.ink}}>RECHNUNG</div>
      <div style={{marginTop:34,height:2,background:L.line}}/>
      {[
        ['Grundbetrag','100 €',L.ink,paper],
        ['Mahngebühr','5 €',L.orange,fee],
        ['Bearbeitung','13 €',L.orange,fee],
      ].map((r,i)=><div key={r[0] as string} style={{display:'flex',justifyContent:'space-between',marginTop:48,fontSize:28,fontWeight:800,color:r[2] as string,opacity:r[3] as number}}><span>{r[0]}</span><span>{r[1]}</span></div>)}
      <div style={{position:'absolute',left:55,right:55,bottom:150,height:2,background:L.line}}/>
      <Txt x={55} y={690} size={28}>Gesamt</Txt>
      <Txt x={510} y={670} size={58} title color={L.orange} width={150} align="right">{amount} €</Txt>
    </div>
    <SoftPanel x={1240} y={330} w={420} h={300} bg={L.orangeSoft} border={L.orange+'44'} opacity={fee} scale={0.9+0.1*fee}>
      <Txt x={0} y={58} width={420} align="center" size={24} color={L.muted}>Zusatzkosten</Txt>
      <Txt x={0} y={118} width={420} align="center" size={84} title color={L.orange}>+18 €</Txt>
    </SoftPanel>
  </SceneFade>;
};

export const LightScatter:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const pts=[
    [420,720,L.blue,'A'],[610,640,L.teal,'B'],[780,700,L.gold,'C'],[980,520,L.green,'D'],
    [1180,430,L.purple,'E'],[1370,560,L.orange,'F'],[1540,320,L.green,'G'],
  ];
  return <SceneFade background="#FBFAF6">
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      <line x1="300" y1="820" x2="1650" y2="820" stroke={L.line} strokeWidth="4"/>
      <line x1="300" y1="820" x2="300" y2="180" stroke={L.line} strokeWidth="4"/>
      <line x1="300" y1="510" x2="1650" y2="510" stroke="#E7EAE6" strokeWidth="2" strokeDasharray="10 12"/>
      <line x1="980" y1="180" x2="980" y2="820" stroke="#E7EAE6" strokeWidth="2" strokeDasharray="10 12"/>
    </svg>
    <Txt x={160} y={480} size={22} color={L.muted}>Rendite</Txt>
    <Txt x={1500} y={855} size={22} color={L.muted}>Risiko</Txt>
    {pts.map((pt,i)=>{
      const show=sp(frame,5+i*7,fps);
      return <div key={pt[3]} style={{position:'absolute',left:(pt[0] as number)-30,top:(pt[1] as number)-30,width:60,height:60,borderRadius:'50%',background:pt[2] as string,border:'7px solid '+L.paper,boxShadow:'0 8px 22px rgba(30,40,35,.08)',opacity:show,transform:`scale(${0.65+0.35*show})`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900}}>{pt[3]}</div>;
    })}
  </SceneFade>;
};

export const LightProgressRings:React.FC=()=>{
  const {frame}=useLightScene();
  const items=[
    {x:250,label:'Notgroschen',v:72,c:L.green},
    {x:690,label:'Reise',v:46,c:L.blue},
    {x:1130,label:'Auto',v:31,c:L.orange},
    {x:1570,label:'Depot',v:88,c:L.purple},
  ];
  return <SceneFade background="#F5F7F4">
    {items.map((it,i)=>{
      const v=pr(frame,7+i*6,52+i*6);
      const deg=it.v*3.6*v;
      return <div key={it.label} style={{position:'absolute',left:it.x-150,top:310,width:300,height:420}}>
        <div style={{position:'absolute',left:20,top:0,width:260,height:260,borderRadius:'50%',background:`conic-gradient(${it.c} 0 ${deg}deg, #E6EAE6 ${deg}deg 360deg)`}}>
          <div style={{position:'absolute',inset:30,borderRadius:'50%',background:'#F5F7F4',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Txt x={0} y={76} width={200} align="center" size={64} title color={it.c}>{Math.round(it.v*v)}%</Txt>
          </div>
        </div>
        <Txt x={0} y={300} width={300} align="center" size={27}>{it.label}</Txt>
      </div>;
    })}
  </SceneFade>;
};

export const LightSparkStats:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const cards=[
    {x:150,label:'Einnahmen',value:'2.850 €',delta:'+7 %',c:L.green,pts:[52,48,44,39,32,35,24]},
    {x:610,label:'Ausgaben',value:'1.720 €',delta:'−3 %',c:L.orange,pts:[30,34,29,35,33,38,32]},
    {x:1070,label:'Sparrate',value:'39,6 %',delta:'+4,1 %',c:L.blue,pts:[54,50,48,41,38,30,25]},
    {x:1530,label:'Depot',value:'18.420 €',delta:'+11 %',c:L.purple,pts:[55,54,48,45,37,28,18]},
  ];
  return <SceneFade background="#FAF8F3">
    {cards.map((card,i)=>{
      const show=sp(frame,5+i*7,fps);
      const d=card.pts.map((y,j)=>`${j===0?'M':'L'} ${20+j*43} ${y}`).join(' ');
      return <SoftPanel key={card.label} x={card.x-180} y={300} w={360} h={410} bg={L.paper} border={card.c+'44'} opacity={show} scale={0.92+0.08*show}>
        <Txt x={30} y={34} size={22} color={L.muted}>{card.label}</Txt>
        <Txt x={30} y={92} size={52} title color={card.c}>{card.value}</Txt>
        <div style={{position:'absolute',left:30,top:185,padding:'10px 15px',borderRadius:14,background:card.c+'18',color:card.c,fontSize:21,fontWeight:900}}>{card.delta}</div>
        <svg width="300" height="95" viewBox="0 0 300 95" style={{position:'absolute',left:30,bottom:38}}>
          <path d={d} fill="none" stroke={card.c} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </SoftPanel>;
    })}
  </SceneFade>;
};
