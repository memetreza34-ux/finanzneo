import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {FONT} from '../../brand';
import {BigTitle, Card, FadeEdges, MiniIcon, P, SceneLabel, SCENE_FRAMES, Value, clamp, pop, prog, useScene} from './showcase-primitives';

export const CompareScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const enter=pop(frame,6,fps);
  const change=prog(frame,30,68,Easing.inOut(Easing.cubic));
  const left=Math.round(interpolate(change,[0,1],[2200,2200],clamp));
  const right=Math.round(interpolate(change,[0,1],[2200,2950],clamp));
  return <FadeEdges><AbsoluteFill style={{background:P.cream,fontFamily:FONT.body}}>
    <SceneLabel n="01" title="Einfacher Vergleich"/>
    <BigTitle center>ZWEI WERTE. EIN KLARER UNTERSCHIED.</BigTitle>
    <Card x={190} y={330} w={650} h={430} accent={P.blue} opacity={enter} scale={0.94+0.06*enter}>
      <div style={{position:'absolute',left:42,top:38,fontSize:28,fontWeight:800,color:P.muted}}>VARIANTE A</div>
      <div style={{position:'absolute',left:42,top:140}}><Value color={P.blue} size={112}>{left.toLocaleString('de-DE')} €</Value></div>
      <div style={{position:'absolute',left:42,bottom:46,fontSize:26,fontWeight:750,color:P.muted}}>heute</div>
    </Card>
    <Card x={1080} y={330} w={650} h={430} accent={P.orange} opacity={enter} scale={0.94+0.06*enter}>
      <div style={{position:'absolute',left:42,top:38,fontSize:28,fontWeight:800,color:P.muted}}>VARIANTE B</div>
      <div style={{position:'absolute',left:42,top:140}}><Value color={P.orange} size={112}>{right.toLocaleString('de-DE')} €</Value></div>
      <div style={{position:'absolute',left:42,bottom:46,fontSize:26,fontWeight:750,color:P.muted}}>nach Veränderung</div>
    </Card>
    <div style={{position:'absolute',left:870,top:475,width:180,textAlign:'center',fontFamily:FONT.title,fontSize:78,fontWeight:900,color:P.ink,opacity:change}}>VS</div>
  </AbsoluteFill></FadeEdges>;
};

export const BeforeAfterScene:React.FC=()=>{
  const {frame}=useScene();
  const split=prog(frame,16,54,Easing.inOut(Easing.cubic));
  const reveal=prog(frame,48,78);
  return <FadeEdges><AbsoluteFill style={{background:P.paper,fontFamily:FONT.body}}>
    <SceneLabel n="02" title="Before / After"/>
    <div style={{position:'absolute',inset:0,clipPath:`inset(0 ${50+split*2}% 0 0)`,background:'#E8EEF3'}}/>
    <div style={{position:'absolute',inset:0,clipPath:`inset(0 0 0 ${50-split*2}%)`,background:'#F8E8E1'}}/>
    <div style={{position:'absolute',left:0,right:0,top:126,textAlign:'center',fontFamily:FONT.title,fontSize:68,fontWeight:900,color:P.ink}}>VORHER → NACHHER</div>
    <div style={{position:'absolute',left:210,top:330,width:620,height:470,borderRadius:44,background:P.white,boxShadow:'0 22px 55px rgba(30,40,35,.08)'}}>
      <div style={{position:'absolute',left:45,top:40,fontSize:28,fontWeight:850,color:P.blue}}>VORHER</div>
      <div style={{position:'absolute',left:45,top:150}}><MiniIcon type="home" color={P.blue} size={105}/></div>
      <div style={{position:'absolute',left:190,top:145}}><Value color={P.blue} size={88}>980 €</Value></div>
      <div style={{position:'absolute',left:45,bottom:54,fontSize:29,fontWeight:800,color:P.muted}}>Monatsrate</div>
    </div>
    <div style={{position:'absolute',right:210,top:330,width:620,height:470,borderRadius:44,background:P.white,boxShadow:'0 22px 55px rgba(30,40,35,.08)',opacity:reveal,transform:`translateX(${(1-reveal)*60}px)`}}>
      <div style={{position:'absolute',left:45,top:40,fontSize:28,fontWeight:850,color:P.orange}}>NACHHER</div>
      <div style={{position:'absolute',left:45,top:150}}><MiniIcon type="home" color={P.orange} size={105}/></div>
      <div style={{position:'absolute',left:190,top:145}}><Value color={P.orange} size={88}>1.240 €</Value></div>
      <div style={{position:'absolute',left:45,bottom:54,fontSize:29,fontWeight:800,color:P.muted}}>+260 € / Monat</div>
    </div>
  </AbsoluteFill></FadeEdges>;
};

export const StatsScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const stats=[
    {label:'Umsatz',value:'€ 2,4 Mio.',delta:'+18%',color:P.neon},
    {label:'Kunden',value:'12.480',delta:'+9%',color:'#79B7FF'},
    {label:'Kosten',value:'€ 840k',delta:'−4%',color:'#FF8C77'},
    {label:'Marge',value:'31,6%',delta:'+3,2%',color:'#FFD86B'},
  ];
  return <FadeEdges><AbsoluteFill style={{background:P.dark,fontFamily:FONT.body}}>
    <SceneLabel n="03" title="KPI / Stats" dark/>
    <BigTitle dark>STATS KÖNNEN AUCH KOMPLETT DUNKEL SEIN.</BigTitle>
    {stats.map((st,i)=>{
      const show=pop(frame,10+i*8,fps);
      return <Card key={st.label} x={120+i*435} y={385} w={365} h={335} dark accent={st.color} opacity={show} scale={0.9+0.1*show}>
        <div style={{position:'absolute',left:32,top:30,fontSize:25,fontWeight:800,color:'#9FACB4'}}>{st.label}</div>
        <div style={{position:'absolute',left:32,top:112,fontFamily:FONT.title,fontSize:64,fontWeight:900,color:P.white}}>{st.value}</div>
        <div style={{position:'absolute',left:32,bottom:34,padding:'12px 18px',borderRadius:16,background:st.color+'22',color:st.color,fontWeight:900,fontSize:24}}>{st.delta}</div>
        <div style={{position:'absolute',right:34,bottom:34,width:105,height:54}}>
          <svg width="105" height="54" viewBox="0 0 105 54">
            <path d="M3 46 C 20 38, 25 42, 38 30 S 58 20, 67 26 S 84 14, 102 6" fill="none" stroke={st.color} strokeWidth="5" strokeLinecap="round"/>
          </svg>
        </div>
      </Card>;
    })}
  </AbsoluteFill></FadeEdges>;
};

export const TableScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const rows=[
    ['1','Welt ETF','8,4%','0,20%','Niedrig'],
    ['2','Tech ETF','11,7%','0,35%','Mittel'],
    ['3','Tagesgeld','2,8%','0,00%','Sehr niedrig'],
    ['4','Gold','5,1%','0,15%','Mittel'],
    ['5','Einzelaktie','14,3%','—','Hoch'],
  ];
  return <FadeEdges><AbsoluteFill style={{background:'#F3F5F7',fontFamily:FONT.body}}>
    <SceneLabel n="04" title="Animierte Tabelle"/>
    <BigTitle>TABELLE, SORTIERUNG & HIGHLIGHT.</BigTitle>
    <div style={{position:'absolute',left:150,right:150,top:310,borderRadius:34,background:P.white,boxShadow:'0 20px 50px rgba(30,40,35,.08)',overflow:'hidden'}}>
      <div style={{display:'grid',gridTemplateColumns:'90px 1.5fr 1fr 1fr 1fr',height:82,alignItems:'center',padding:'0 34px',background:'#E9EDF0',fontSize:23,fontWeight:900,color:P.muted}}>
        <div>#</div><div>Produkt</div><div>Rendite</div><div>Kosten</div><div>Risiko</div>
      </div>
      {rows.map((r,i)=>{
        const show=pop(frame,8+i*7,fps);
        const hi=prog(frame,48+i*2,64+i*2);
        const bg=i===1?`rgba(79,138,103,${0.06+0.12*hi})`:'transparent';
        return <div key={r[1]} style={{
          display:'grid',gridTemplateColumns:'90px 1.5fr 1fr 1fr 1fr',height:112,alignItems:'center',
          padding:'0 34px',borderTop:'1px solid '+P.line,background:bg,
          opacity:show,transform:`translateX(${(1-show)*35}px)`,fontSize:25,color:P.ink,fontWeight:700
        }}>
          {r.map((cell,j)=><div key={j} style={{fontWeight:j===1?900:700,color:i===1&&j===2?P.greenDark:P.ink}}>{cell}</div>)}
        </div>;
      })}
    </div>
  </AbsoluteFill></FadeEdges>;
};

export const BarChartScene:React.FC=()=>{
  const {frame}=useScene();
  const vals=[42,63,55,78,92,81,108];
  return <FadeEdges><AbsoluteFill style={{background:P.cream,fontFamily:FONT.body}}>
    <SceneLabel n="05" title="Balkendiagramm"/>
    <BigTitle>DATEN KÖNNEN DIREKT DIE HAUPTANIMATION SEIN.</BigTitle>
    <div style={{position:'absolute',left:190,right:190,top:330,bottom:150}}>
      <div style={{position:'absolute',left:0,bottom:55,width:'100%',height:3,background:P.line}}/>
      {vals.map((v,i)=>{
        const grow=prog(frame,10+i*5,52+i*5,Easing.out(Easing.cubic));
        const h=v*5.1*grow;
        return <div key={i} style={{position:'absolute',left:80+i*205,bottom:58,width:112,height:h,borderRadius:'18px 18px 6px 6px',background:i===6?P.green:P.blue}}>
          <div style={{position:'absolute',left:-35,right:-35,top:-48,textAlign:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,color:P.ink,opacity:grow}}>{Math.round(v*grow)}k</div>
          <div style={{position:'absolute',left:-30,right:-30,bottom:-45,textAlign:'center',fontSize:22,fontWeight:800,color:P.muted}}>Q{i+1}</div>
        </div>;
      })}
    </div>
  </AbsoluteFill></FadeEdges>;
};

export const LineChartScene:React.FC=()=>{
  const {frame}=useScene();
  const pts=[[180,740],[390,690],[600,715],[810,590],[1020,550],[1230,420],[1440,360],[1650,250]];
  const draw=prog(frame,10,72,Easing.inOut(Easing.cubic));
  const count=Math.max(1,Math.floor(draw*(pts.length-1))+1);
  const active=pts.slice(0,count);
  const d=active.map((p,i)=>`${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ');
  const marker=pts[Math.min(pts.length-1,count-1)];
  return <FadeEdges><AbsoluteFill style={{background:'#FCFCFA',fontFamily:FONT.body}}>
    <SceneLabel n="06" title="Liniendiagramm"/>
    <BigTitle>EINE LINIE KANN DIE GANZE STORY TRAGEN.</BigTitle>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      {[300,450,600,750].map(y=><line key={y} x1="150" x2="1750" y1={y} y2={y} stroke="#E3E6E2" strokeWidth="2"/>)}
      <path d={d} fill="none" stroke={P.green} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      {active.map((pt,i)=><circle key={i} cx={pt[0]} cy={pt[1]} r="10" fill={P.white} stroke={P.greenDark} strokeWidth="6"/>)}
    </svg>
    <div style={{position:'absolute',left:marker[0]-70,top:marker[1]-95,width:140,textAlign:'center',fontFamily:FONT.title,fontSize:38,fontWeight:900,color:P.greenDark}}>{Math.round(10+draw*54)}k</div>
    <div style={{position:'absolute',left:145,bottom:120,fontSize:24,fontWeight:800,color:P.muted}}>START</div>
    <div style={{position:'absolute',right:150,bottom:120,fontSize:24,fontWeight:800,color:P.muted}}>8 JAHRE</div>
  </AbsoluteFill></FadeEdges>;
};

export const DonutScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const show=pop(frame,7,fps);
  const rotate=interpolate(prog(frame,10,58),[0,1],[-45,0],clamp);
  return <FadeEdges><AbsoluteFill style={{background:'#EEE9F3',fontFamily:FONT.body}}>
    <SceneLabel n="07" title="Donut / Aufteilung"/>
    <BigTitle>AUFTEILUNG: VISUELL STATT TEXTLASTIG.</BigTitle>
    <div style={{
      position:'absolute',left:240,top:310,width:560,height:560,borderRadius:'50%',
      background:'conic-gradient('+P.green+' 0 52%, '+P.blue+' 52% 77%, '+P.gold+' 77% 92%, '+P.orange+' 92% 100%)',
      transform:`scale(${0.78+0.22*show}) rotate(${rotate}deg)`,boxShadow:'0 22px 55px rgba(50,40,60,.12)'
    }}>
      <div style={{position:'absolute',inset:118,borderRadius:'50%',background:'#EEE9F3',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <Value size={88}>100%</Value><div style={{fontSize:24,fontWeight:850,color:P.muted}}>Portfolio</div>
      </div>
    </div>
    {[
      ['Aktien','52%',P.green],['Anleihen','25%',P.blue],['Gold','15%',P.gold],['Cash','8%',P.orange]
    ].map((r,i)=>{
      const ent=pop(frame,28+i*7,fps);
      return <div key={r[0]} style={{position:'absolute',left:1000,top:335+i*125,width:600,height:90,display:'grid',gridTemplateColumns:'34px 1fr 120px',alignItems:'center',gap:20,opacity:ent,transform:`translateX(${(1-ent)*35}px)`}}>
        <div style={{width:24,height:24,borderRadius:8,background:r[2]}}/><div style={{fontSize:31,fontWeight:850,color:P.ink}}>{r[0]}</div><div style={{fontFamily:FONT.title,fontSize:48,fontWeight:900,color:r[2]}}>{r[1]}</div>
      </div>;
    })}
  </AbsoluteFill></FadeEdges>;
};

export const WaterfallScene:React.FC=()=>{
  const {frame}=useScene();
  const bars=[
    {label:'Start',delta:100,color:P.blue},
    {label:'Gewinn',delta:38,color:P.green},
    {label:'Gebühr',delta:-8,color:P.orange},
    {label:'Steuer',delta:-12,color:P.red},
    {label:'Ende',delta:118,color:P.ink},
  ];
  let running=0;
  const computed=bars.map((b,i)=>{
    if(i===0){running=100;return {...b,start:0,end:100};}
    if(i===bars.length-1)return {...b,start:0,end:118};
    const start=running; running+=b.delta; return {...b,start:Math.min(start,running),end:Math.max(start,running)};
  });
  return <FadeEdges><AbsoluteFill style={{background:'#F8F5EE',fontFamily:FONT.body}}>
    <SceneLabel n="08" title="Waterfall"/>
    <BigTitle>WATERFALL: WO GEHT DER WERT VERLOREN?</BigTitle>
    <div style={{position:'absolute',left:180,right:180,top:320,bottom:160}}>
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:3,background:P.line}}/>
      {computed.map((b,i)=>{
        const show=prog(frame,8+i*9,44+i*9);
        const base=70; const scale=4.3;
        const y=(b.start*scale); const h=Math.max(14,(b.end-b.start)*scale)*show;
        return <div key={b.label} style={{position:'absolute',left:90+i*300,bottom:y,width:180,height:h,borderRadius:14,background:b.color,opacity:show}}>
          <div style={{position:'absolute',left:-40,right:-40,top:-44,textAlign:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,color:b.color}}>{i===0||i===4?b.delta:(b.delta>0?'+':'')+b.delta}</div>
          <div style={{position:'absolute',left:-45,right:-45,bottom:-47,textAlign:'center',fontSize:22,fontWeight:850,color:P.muted}}>{b.label}</div>
        </div>;
      })}
    </div>
  </AbsoluteFill></FadeEdges>;
};
