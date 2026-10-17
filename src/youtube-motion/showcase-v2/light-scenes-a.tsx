import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {FONT} from '../../brand';
import {CircleIcon, L, SceneFade, SoftPanel, Txt, CLAMP, pr, sp, useLightScene} from './light-primitives';

export const LightCompare:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const a=sp(frame,4,fps);
  const b=sp(frame,12,fps);
  const delta=pr(frame,34,62);
  const right=Math.round(interpolate(delta,[0,1],[2200,2950],CLAMP));
  return <SceneFade background="#F6F1E9">
    <SoftPanel x={180} y={210} w={640} h={630} bg="#FFFFFF" border={L.blueSoft} opacity={a} scale={0.95+0.05*a}>
      <Txt x={46} y={46} size={26} color={L.muted}>Variante A</Txt>
      <Txt x={46} y={160} size={105} color={L.blue} title>2.200 €</Txt>
      <div style={{position:'absolute',left:46,right:46,top:315,height:18,borderRadius:99,background:L.blueSoft}}>
        <div style={{width:'64%',height:'100%',borderRadius:99,background:L.blue}}/>
      </div>
      <Txt x={46} y={390} size={24} color={L.muted}>Monatliche Belastung</Txt>
    </SoftPanel>
    <SoftPanel x={1100} y={210} w={640} h={630} bg="#FFFDFC" border={L.orangeSoft} opacity={b} scale={0.95+0.05*b}>
      <Txt x={46} y={46} size={26} color={L.muted}>Variante B</Txt>
      <Txt x={46} y={160} size={105} color={L.orange} title>{right.toLocaleString('de-DE')} €</Txt>
      <div style={{position:'absolute',left:46,right:46,top:315,height:18,borderRadius:99,background:L.orangeSoft}}>
        <div style={{width:`${64+25*delta}%`,height:'100%',borderRadius:99,background:L.orange}}/>
      </div>
      <Txt x={46} y={390} size={24} color={L.muted}>Monatliche Belastung</Txt>
      <div style={{position:'absolute',left:46,bottom:48,padding:'12px 18px',borderRadius:16,background:L.orangeSoft,color:L.orange,fontSize:25,fontWeight:900,opacity:delta}}>+750 €</div>
    </SoftPanel>
  </SceneFade>;
};

export const LightRankingTable:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const rows=[
    ['Welt ETF','8,4 %','0,20 %',L.green],
    ['Tech ETF','11,7 %','0,35 %',L.blue],
    ['Tagesgeld','2,8 %','0,00 %',L.gold],
    ['Gold','5,1 %','0,15 %',L.orange],
  ];
  return <SceneFade background="#F4F6F3">
    <div style={{position:'absolute',left:250,right:250,top:170,bottom:150,borderRadius:34,background:L.paper,border:'2px solid '+L.line,overflow:'hidden',boxShadow:'0 18px 38px rgba(32,39,36,.05)'}}>
      <div style={{display:'grid',gridTemplateColumns:'1.7fr 1fr 1fr',alignItems:'center',height:96,padding:'0 46px',background:'#EEF1ED',fontSize:23,fontWeight:900,color:L.muted}}>
        <div>Produkt</div><div>Rendite</div><div>Kosten</div>
      </div>
      {rows.map((r,i)=>{
        const show=sp(frame,5+i*7,fps);
        const highlight=pr(frame,36+i*2,56+i*2);
        return <div key={r[0]} style={{
          display:'grid',gridTemplateColumns:'1.7fr 1fr 1fr',alignItems:'center',height:142,padding:'0 46px',
          borderTop:'1px solid '+L.line,background:i===1?`rgba(108,142,170,${0.04+0.09*highlight})`:'#FFFFFF',
          opacity:show,transform:`translateX(${(1-show)*28}px)`
        }}>
          <div style={{display:'flex',alignItems:'center',gap:22,fontSize:27,fontWeight:900,color:L.ink}}>
            <div style={{width:18,height:18,borderRadius:6,background:r[3]}}/>{r[0]}
          </div>
          <div style={{fontFamily:FONT.title,fontSize:44,fontWeight:900,color:i===1?L.blue:L.ink}}>{r[1]}</div>
          <div style={{fontSize:25,fontWeight:800,color:L.muted}}>{r[2]}</div>
        </div>;
      })}
    </div>
  </SceneFade>;
};

export const LightBarRace:React.FC=()=>{
  const {frame}=useLightScene();
  const vals=[
    {label:'Wohnen',v:780,c:L.green},
    {label:'Lebensmittel',v:320,c:L.orange},
    {label:'Mobilität',v:210,c:L.blue},
    {label:'Freizeit',v:160,c:L.purple},
    {label:'Sonstiges',v:95,c:L.gold},
  ];
  return <SceneFade background="#FBF8F2">
    <div style={{position:'absolute',left:270,right:210,top:190,bottom:150}}>
      {vals.map((x,i)=>{
        const grow=pr(frame,7+i*5,48+i*5,Easing.out(Easing.cubic));
        return <div key={x.label} style={{position:'absolute',left:0,right:0,top:i*155,height:116}}>
          <Txt x={0} y={8} size={25} width={200}>{x.label}</Txt>
          <div style={{position:'absolute',left:220,right:120,top:8,height:56,borderRadius:18,background:L.graySoft}}>
            <div style={{height:'100%',width:`${(x.v/800)*100*grow}%`,borderRadius:18,background:x.c}}/>
          </div>
          <Txt x={1510} y={0} size={40} color={x.c} title width={150} align="right">{Math.round(x.v*grow)} €</Txt>
        </div>;
      })}
    </div>
  </SceneFade>;
};

export const LightLineArea:React.FC=()=>{
  const {frame}=useLightScene();
  const pts=[[180,720],[400,675],[620,640],[840,580],[1060,520],[1280,430],[1500,350],[1710,250]];
  const draw=pr(frame,6,62,Easing.inOut(Easing.cubic));
  const exact=draw*(pts.length-1);
  const idx=Math.floor(exact);
  const frac=exact-idx;
  const visible=pts.slice(0,Math.min(pts.length,idx+1));
  if(idx<pts.length-1){
    const a=pts[idx],b=pts[idx+1];
    visible.push([interpolate(frac,[0,1],[a[0],b[0]],CLAMP),interpolate(frac,[0,1],[a[1],b[1]],CLAMP)]);
  }
  const line=visible.map((pt,i)=>`${i===0?'M':'L'} ${pt[0]} ${pt[1]}`).join(' ');
  const area=line+` L ${visible[visible.length-1][0]} 820 L ${visible[0][0]} 820 Z`;
  return <SceneFade background="#F7FAF8">
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      {[300,480,660,820].map(y=><line key={y} x1="170" x2="1740" y1={y} y2={y} stroke="#E2E8E4" strokeWidth="2"/>)}
      <path d={area} fill="#DDEADF" opacity="0.72"/>
      <path d={line} fill="none" stroke={L.green} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <Txt x={170} y={140} size={25} color={L.muted}>Vermögen</Txt>
    <Txt x={170} y={184} size={72} color={L.green} title>{Math.round(10+draw*54)}.000 €</Txt>
    <Txt x={170} y={860} size={22} color={L.muted}>Start</Txt>
    <Txt x={1580} y={860} size={22} color={L.muted}>8 Jahre</Txt>
  </SceneFade>;
};

export const LightDonut:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const show=sp(frame,4,fps);
  const labels=[
    ['Aktien','55%',L.green],
    ['Anleihen','25%',L.blue],
    ['Gold','12%',L.gold],
    ['Cash','8%',L.orange],
  ];
  return <SceneFade background="#F7F3FA">
    <div style={{position:'absolute',left:280,top:235,width:580,height:580,borderRadius:'50%',background:`conic-gradient(${L.green} 0 55%, ${L.blue} 55% 80%, ${L.gold} 80% 92%, ${L.orange} 92% 100%)`,transform:`scale(${0.78+0.22*show})`}}>
      <div style={{position:'absolute',inset:128,borderRadius:'50%',background:'#F7F3FA',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <Txt x={0} y={108} width={324} align="center" size={26} color={L.muted}>Portfolio</Txt>
        <Txt x={0} y={154} width={324} align="center" size={84} title>100%</Txt>
      </div>
    </div>
    {labels.map((r,i)=>{
      const ent=sp(frame,20+i*7,fps);
      return <div key={r[0]} style={{position:'absolute',left:1040,top:270+i*145,width:610,height:100,opacity:ent,transform:`translateX(${(1-ent)*30}px)`}}>
        <div style={{position:'absolute',left:0,top:33,width:24,height:24,borderRadius:8,background:r[2]}}/>
        <Txt x={55} y={20} size={29}>{r[0]}</Txt>
        <Txt x={400} y={8} size={50} title color={r[2]} width={150} align="right">{r[1]}</Txt>
      </div>;
    })}
  </SceneFade>;
};

export const LightStackedBars:React.FC=()=>{
  const {frame}=useLightScene();
  const years=[
    [42,28,18,12],
    [48,25,17,10],
    [55,24,13,8],
    [62,21,11,6],
  ];
  const colors=[L.green,L.blue,L.gold,L.orange];
  return <SceneFade background="#F3F7F6">
    <div style={{position:'absolute',left:280,right:280,top:180,bottom:160,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
      {years.map((parts,i)=>{
        const show=pr(frame,7+i*7,48+i*7);
        let bottom=0;
        return <div key={i} style={{position:'relative',width:230,height:650}}>
          {parts.map((v,j)=>{
            const h=v*5.2*show;
            const currentBottom=bottom; bottom+=h;
            return <div key={j} style={{position:'absolute',left:0,bottom:currentBottom,width:'100%',height:h,background:colors[j],borderTopLeftRadius:j===parts.length-1?18:0,borderTopRightRadius:j===parts.length-1?18:0}}/>;
          })}
          <Txt x={0} y={668} width={230} align="center" size={23} color={L.muted}>Jahr {i+1}</Txt>
        </div>;
      })}
    </div>
    <div style={{position:'absolute',right:110,top:230,display:'grid',gap:18}}>
      {['Aktien','Anleihen','Gold','Cash'].map((x,i)=><div key={x} style={{display:'flex',alignItems:'center',gap:12,fontSize:21,fontWeight:800,color:L.muted}}><span style={{width:16,height:16,borderRadius:5,background:colors[i]}}/>{x}</div>)}
    </div>
  </SceneFade>;
};

export const LightHeatmap:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const data=[
    [1,2,2,3,4,3,2],
    [2,3,4,5,5,4,3],
    [1,2,3,4,4,3,2],
    [2,3,5,5,4,4,3],
    [1,2,3,3,4,5,4],
  ];
  const palette=['#EDF4EF','#D7E9DC','#B6D5C0','#8DBB9C','#5E946F'];
  return <SceneFade background="#F9FAF7">
    <div style={{position:'absolute',left:330,top:190,display:'grid',gridTemplateColumns:'repeat(7,150px)',gap:16}}>
      {data.flatMap((row,r)=>row.map((v,c)=>{
        const show=sp(frame,4+(r*7+c)*1.2,fps);
        return <div key={r+'-'+c} style={{width:150,height:120,borderRadius:22,background:palette[v-1],opacity:show,transform:`scale(${0.8+0.2*show})`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,color:L.ink}}>{v*20}%</div>;
      }))}
    </div>
    <Txt x={165} y={240} size={22} color={L.muted}>Mo</Txt>
    <Txt x={165} y={376} size={22} color={L.muted}>Di</Txt>
    <Txt x={165} y={512} size={22} color={L.muted}>Mi</Txt>
    <Txt x={165} y={648} size={22} color={L.muted}>Do</Txt>
    <Txt x={165} y={784} size={22} color={L.muted}>Fr</Txt>
  </SceneFade>;
};

export const LightIconBudget:React.FC=()=>{
  const {frame,fps}=useLightScene();
  const items=[
    {type:'home' as const,label:'Wohnen',v:780,c:L.green},
    {type:'cart' as const,label:'Einkauf',v:320,c:L.orange},
    {type:'phone' as const,label:'Mobilfunk',v:49,c:L.blue},
    {type:'chart' as const,label:'Investieren',v:300,c:L.purple},
  ];
  const merge=pr(frame,38,68,Easing.inOut(Easing.cubic));
  return <SceneFade background="#FFFDF8">
    {items.map((it,i)=>{
      const show=sp(frame,4+i*6,fps);
      const sx=170+i*420;
      const x=interpolate(merge,[0,1],[sx,760+i*38],CLAMP);
      const y=interpolate(merge,[0,1],[250,470],CLAMP);
      return <div key={it.label} style={{position:'absolute',left:x,top:y,width:300,height:270,borderRadius:32,background:L.paper,border:'2px solid '+it.c+'55',opacity:show*(1-merge*.55),transform:`scale(${0.9+0.1*show-0.12*merge})`}}>
        <CircleIcon x={28} y={30} color={it.c} type={it.type} show={show}/>
        <Txt x={132} y={48} size={24}>{it.label}</Txt>
        <Txt x={30} y={155} size={58} title color={it.c}>{it.v} €</Txt>
      </div>;
    })}
    <SoftPanel x={700} y={390} w={520} h={300} bg="#F2F6F3" border={L.greenSoft} opacity={merge} scale={0.86+0.14*merge}>
      <Txt x={0} y={62} width={520} align="center" size={24} color={L.muted}>Monatsbudget</Txt>
      <Txt x={0} y={120} width={520} align="center" size={90} title color={L.green}>1.449 €</Txt>
    </SoftPanel>
  </SceneFade>;
};
