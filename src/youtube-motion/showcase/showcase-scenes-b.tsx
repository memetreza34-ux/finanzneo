import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {FONT} from '../../brand';
import {BigTitle, Card, FadeEdges, MiniIcon, P, SceneLabel, Value, clamp, pop, prog, useScene} from './showcase-primitives';

export const TimelineScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const draw=prog(frame,8,58,Easing.inOut(Easing.cubic));
  const milestones=[
    {x:260,label:'Start',value:'0 €',color:P.blue},
    {x:610,label:'Jahr 3',value:'12k',color:P.cyan},
    {x:960,label:'Jahr 6',value:'31k',color:P.green},
    {x:1310,label:'Jahr 9',value:'58k',color:P.gold},
    {x:1660,label:'Jahr 12',value:'96k',color:P.orange},
  ];
  const endX=interpolate(draw,[0,1],[milestones[0].x,milestones[milestones.length-1].x],clamp);
  return <FadeEdges><AbsoluteFill style={{background:'#F0F4F2',fontFamily:FONT.body}}>
    <SceneLabel n="09" title="Timeline"/>
    <BigTitle>ZEITLICHE ENTWICKLUNG ALS BEWEGTE STRECKE.</BigTitle>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      <line x1="260" x2="1660" y1="585" y2="585" stroke={P.line} strokeWidth="14" strokeLinecap="round"/>
      <line x1="260" x2={endX} y1="585" y2="585" stroke={P.green} strokeWidth="14" strokeLinecap="round"/>
    </svg>
    {milestones.map((m,i)=>{
      const show=pop(frame,12+i*10,fps);
      return <React.Fragment key={m.label}>
        <div style={{position:'absolute',left:m.x-22,top:563,width:44,height:44,borderRadius:'50%',background:m.color,border:'7px solid #F0F4F2',opacity:show,transform:`scale(${0.65+0.35*show})`}}/>
        <div style={{position:'absolute',left:m.x-95,top:470,width:190,textAlign:'center',fontFamily:FONT.title,fontSize:42,fontWeight:900,color:m.color,opacity:show}}>{m.value}</div>
        <div style={{position:'absolute',left:m.x-95,top:640,width:190,textAlign:'center',fontSize:24,fontWeight:850,color:P.muted,opacity:show}}>{m.label}</div>
      </React.Fragment>;
    })}
  </AbsoluteFill></FadeEdges>;
};

export const IconFlowScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const items=[
    {type:'phone' as const,label:'Mobilfunk',amount:'19 €',color:P.blue},
    {type:'cart' as const,label:'Einkauf',amount:'240 €',color:P.orange},
    {type:'home' as const,label:'Wohnen',amount:'780 €',color:P.green},
    {type:'chart' as const,label:'Investieren',amount:'300 €',color:P.purple},
  ];
  const merge=prog(frame,42,78,Easing.inOut(Easing.cubic));
  return <FadeEdges><AbsoluteFill style={{background:P.paper,fontFamily:FONT.body}}>
    <SceneLabel n="10" title="Icons + Flow"/>
    <BigTitle>ICONS KÖNNEN WERTE DIREKT IN EIN SYSTEM FÜHREN.</BigTitle>
    {items.map((it,i)=>{
      const show=pop(frame,6+i*7,fps);
      const x=160+i*420;
      const tx=interpolate(merge,[0,1],[x,760+i*35],clamp);
      const ty=interpolate(merge,[0,1],[355,590],clamp);
      return <div key={it.label} style={{position:'absolute',left:tx,top:ty,width:300,height:200,borderRadius:32,background:P.white,border:'2px solid '+it.color,boxShadow:'0 18px 45px rgba(30,40,35,.08)',opacity:show*(1-merge*0.6),transform:`scale(${0.88+0.12*show-merge*0.15})`}}>
        <div style={{position:'absolute',left:26,top:24}}><MiniIcon type={it.type} color={it.color} size={64}/></div>
        <div style={{position:'absolute',left:108,top:30,fontSize:24,fontWeight:850,color:P.ink}}>{it.label}</div>
        <div style={{position:'absolute',left:26,bottom:26,fontFamily:FONT.title,fontSize:56,fontWeight:900,color:it.color}}>{it.amount}</div>
      </div>;
    })}
    <div style={{position:'absolute',left:735,top:545,width:450,height:280,borderRadius:42,background:P.ink,color:P.white,opacity:merge,transform:`scale(${0.82+0.18*merge})`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',boxShadow:'0 24px 60px rgba(20,25,22,.18)'}}>
      <div style={{fontSize:25,fontWeight:850,color:'#B8C2BC'}}>MONATSBUDGET</div>
      <div style={{fontFamily:FONT.title,fontSize:94,fontWeight:900}}>1.339 €</div>
    </div>
  </AbsoluteFill></FadeEdges>;
};

export const NetworkScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const nodes=[
    {x:260,y:300,c:P.blue},{x:520,y:210,c:P.purple},{x:1450,y:260,c:P.orange},{x:1620,y:520,c:P.gold},
    {x:1380,y:790,c:P.green},{x:390,y:790,c:P.cyan},{x:970,y:170,c:'#8897A7'},{x:820,y:850,c:P.red},
  ];
  const connect=prog(frame,14,70,Easing.inOut(Easing.cubic));
  const pulse=pop(frame,48,fps);
  return <FadeEdges><AbsoluteFill style={{background:'#101722',fontFamily:FONT.body}}>
    <SceneLabel n="11" title="Netzwerk / Verbindungen" dark/>
    <div style={{position:'absolute',left:0,right:0,top:116,textAlign:'center',fontFamily:FONT.title,fontSize:68,fontWeight:900,color:P.white}}>EIN HUB. VIELE VERBINDUNGEN.</div>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      {nodes.map((n,i)=>{
        const ex=interpolate(connect,[0,1],[960,n.x],clamp);
        const ey=interpolate(connect,[0,1],[540,n.y],clamp);
        return <line key={i} x1="960" y1="540" x2={ex} y2={ey} stroke={n.c} strokeWidth="5" opacity={0.25+0.75*connect}/>;
      })}
    </svg>
    <div style={{position:'absolute',left:835,top:415,width:250,height:250,borderRadius:'50%',background:P.neon,color:P.dark,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontWeight:900,fontSize:58,transform:`scale(${0.88+0.12*pulse})`,boxShadow:'0 0 70px rgba(96,229,154,.20)'}}>HUB</div>
    {nodes.map((n,i)=>{
      const show=pop(frame,30+i*4,fps);
      return <div key={i} style={{position:'absolute',left:n.x-48,top:n.y-48,width:96,height:96,borderRadius:'50%',background:P.dark2,border:'4px solid '+n.c,opacity:show,transform:`scale(${0.7+0.3*show})`,boxShadow:'0 12px 30px rgba(0,0,0,.25)'}}/>;
    })}
  </AbsoluteFill></FadeEdges>;
};

export const FunnelScene:React.FC=()=>{
  const {frame}=useScene();
  const stages=[
    {w:1240,label:'10.000 Besucher',value:'100%',color:P.blue},
    {w:980,label:'3.600 Interessenten',value:'36%',color:P.cyan},
    {w:720,label:'1.250 Leads',value:'12,5%',color:P.gold},
    {w:470,label:'420 Kunden',value:'4,2%',color:P.green},
  ];
  return <FadeEdges><AbsoluteFill style={{background:'#F6F1E8',fontFamily:FONT.body}}>
    <SceneLabel n="12" title="Funnel"/>
    <BigTitle center>VON VIELEN BESUCHERN ZU WENIGEN KUNDEN.</BigTitle>
    {stages.map((st,i)=>{
      const show=prog(frame,8+i*10,42+i*10);
      const y=300+i*165;
      return <div key={st.label} style={{position:'absolute',left:960-st.w/2,top:y,width:st.w*show,height:125,borderRadius:22,background:st.color,color:P.white,overflow:'hidden',boxShadow:'0 14px 35px rgba(30,40,35,.09)'}}>
        <div style={{position:'absolute',left:34,top:27,fontSize:27,fontWeight:900,whiteSpace:'nowrap'}}>{st.label}</div>
        <div style={{position:'absolute',right:34,top:20,fontFamily:FONT.title,fontSize:48,fontWeight:900}}>{st.value}</div>
      </div>;
    })}
  </AbsoluteFill></FadeEdges>;
};

export const InvoiceScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const paper=pop(frame,5,fps);
  const fee=pop(frame,38,fps);
  const total=prog(frame,55,82,Easing.out(Easing.cubic));
  const amount=Math.round(interpolate(total,[0,1],[100,118],clamp));
  return <FadeEdges><AbsoluteFill style={{background:'#DDE5EA',fontFamily:FONT.body}}>
    <SceneLabel n="13" title="Dokument / Rechnung"/>
    <div style={{position:'absolute',left:245,top:145,width:760,height:790,borderRadius:22,background:P.white,boxShadow:'0 25px 70px rgba(30,40,45,.16)',opacity:paper,transform:`rotate(-2deg) scale(${0.92+0.08*paper})`,padding:58,boxSizing:'border-box'}}>
      <div style={{fontFamily:FONT.title,fontSize:62,fontWeight:900,color:P.ink}}>RECHNUNG</div>
      <div style={{marginTop:44,height:2,background:P.line}}/>
      {[
        ['Grundbetrag','100 €'],
        ['Mahngebühr','5 €'],
        ['Bearbeitung','13 €']
      ].map((r,i)=>{
        const show=i===0?paper:pop(frame,32+i*10,fps);
        return <div key={r[0]} style={{display:'flex',justifyContent:'space-between',marginTop:48,fontSize:29,fontWeight:800,color:i===0?P.ink:P.orange,opacity:show}}>
          <span>{r[0]}</span><span>{r[1]}</span>
        </div>;
      })}
      <div style={{position:'absolute',left:58,right:58,bottom:135,height:2,background:P.line}}/>
      <div style={{position:'absolute',left:58,bottom:56,fontSize:30,fontWeight:900,color:P.ink}}>GESAMT</div>
      <div style={{position:'absolute',right:58,bottom:43,fontFamily:FONT.title,fontSize:62,fontWeight:900,color:P.orange}}>{amount} €</div>
    </div>
    <div style={{position:'absolute',right:250,top:330,width:520,height:420,borderRadius:44,background:'#FFF4EF',border:'3px solid '+P.orange,boxShadow:'0 22px 55px rgba(60,45,35,.10)',opacity:fee,transform:`translateX(${(1-fee)*80}px)`}}>
      <div style={{position:'absolute',left:48,top:46,fontSize:27,fontWeight:850,color:P.muted}}>AUS 100 € WERDEN</div>
      <div style={{position:'absolute',left:48,top:135}}><Value color={P.orange} size={124}>{amount} €</Value></div>
      <div style={{position:'absolute',left:48,bottom:48,fontSize:29,fontWeight:900,color:P.orange}}>+18 € Zusatzkosten</div>
    </div>
  </AbsoluteFill></FadeEdges>;
};

export const GaugeScene:React.FC=()=>{
  const {frame}=useScene();
  const v=prog(frame,10,72,Easing.inOut(Easing.cubic));
  const angle=interpolate(v,[0,1],[-120,78],clamp);
  const risk=Math.round(interpolate(v,[0,1],[12,78],clamp));
  return <FadeEdges><AbsoluteFill style={{background:P.paper,fontFamily:FONT.body}}>
    <SceneLabel n="14" title="Gauge / Risiko"/>
    <BigTitle center>AUCH EIN GAUGE KANN SINNVOLL SEIN.</BigTitle>
    <div style={{position:'absolute',left:560,top:300,width:800,height:600}}>
      <svg width="800" height="600" viewBox="0 0 800 600">
        <path d="M140 440 A260 260 0 0 1 660 440" fill="none" stroke="#E2E5E1" strokeWidth="74" strokeLinecap="round"/>
        <path d="M140 440 A260 260 0 0 1 325 197" fill="none" stroke={P.green} strokeWidth="74" strokeLinecap="round"/>
        <path d="M325 197 A260 260 0 0 1 505 210" fill="none" stroke={P.gold} strokeWidth="74" strokeLinecap="round"/>
        <path d="M505 210 A260 260 0 0 1 660 440" fill="none" stroke={P.red} strokeWidth="74" strokeLinecap="round"/>
      </svg>
      <div style={{position:'absolute',left:395,top:398,width:245,height:14,borderRadius:99,background:P.ink,transformOrigin:'0 50%',transform:`rotate(${angle}deg)`}}/>
      <div style={{position:'absolute',left:370,top:375,width:58,height:58,borderRadius:'50%',background:P.ink,border:'10px solid '+P.white}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:60,textAlign:'center'}}><Value size={100} color={risk>65?P.red:P.gold}>{risk}%</Value><div style={{fontSize:28,fontWeight:850,color:P.muted}}>Risiko-Level</div></div>
    </div>
  </AbsoluteFill></FadeEdges>;
};

export const DarkBlocksScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const blocks=[0,1,2,3,4,5,6];
  return <FadeEdges><AbsoluteFill style={{background:'radial-gradient(circle at 50% 15%, #1C2734 0, #0B0F15 55%, #05070A 100%)',fontFamily:FONT.body,perspective:1200}}>
    <SceneLabel n="15" title="Dunkel / räumlich / 3D-artig" dark/>
    <div style={{position:'absolute',left:110,top:128,fontFamily:FONT.title,fontSize:74,fontWeight:900,color:P.white}}>DIE WELT DARF AUCH KOMPLETT WECHSELN.</div>
    <div style={{position:'absolute',left:250,right:250,top:330,bottom:110,transform:'rotateX(58deg) rotateZ(-8deg)',transformStyle:'preserve-3d'}}>
      {blocks.map((b,i)=>{
        const show=pop(frame,8+i*6,fps);
        const h=100+i*55;
        return <div key={i} style={{position:'absolute',left:120+i*190,bottom:90,width:130,height:h*show,background:i===6?'linear-gradient(180deg,#67F0A3,#198E55)':'linear-gradient(180deg,#32475A,#18222D)',border:'2px solid rgba(255,255,255,.10)',boxShadow:'18px 24px 35px rgba(0,0,0,.32)',transform:`translateZ(${i*14}px)`}}>
          <div style={{position:'absolute',left:0,right:0,top:-46,textAlign:'center',fontFamily:FONT.title,fontSize:32,fontWeight:900,color:i===6?P.neon:'#B9C6D0',transform:'rotateZ(8deg) rotateX(-58deg)'}}>{20+i*13}k</div>
        </div>;
      })}
    </div>
    <div style={{position:'absolute',right:140,bottom:90,padding:'18px 28px',borderRadius:20,background:'rgba(96,229,154,.10)',border:'1px solid rgba(96,229,154,.35)',color:P.neon,fontSize:26,fontWeight:900}}>3D-LOOK OHNE STARRE STYLE-REGEL</div>
  </AbsoluteFill></FadeEdges>;
};

export const MapJourneyScene:React.FC=()=>{
  const {frame,fps}=useScene();
  const route=prog(frame,12,74,Easing.inOut(Easing.cubic));
  const pts=[[210,730],[460,590],[720,650],[980,450],[1270,520],[1580,300]];
  const idx=Math.min(pts.length-1,Math.floor(route*(pts.length-1)));
  const point=pts[idx];
  const path=pts.slice(0,idx+1).map((pt,i)=>`${i===0?'M':'L'} ${pt[0]} ${pt[1]}`).join(' ');
  return <FadeEdges><AbsoluteFill style={{background:'#DCE7E2',fontFamily:FONT.body}}>
    <SceneLabel n="16" title="Journey / Route"/>
    <BigTitle>EINE ROUTE FÜR PROZESSE, REISEN ODER SCHRITTE.</BigTitle>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
      <path d="M0 830 C 300 720 420 760 620 690 S 930 590 1110 610 S 1500 490 1920 390 L1920 1080 H0Z" fill="#C6D7CE"/>
      <path d={path} fill="none" stroke={P.orange} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((pt,i)=><circle key={i} cx={pt[0]} cy={pt[1]} r="15" fill={i<=idx?P.orange:P.white} stroke={P.orange} strokeWidth="5"/>)}
    </svg>
    <div style={{position:'absolute',left:point[0]-38,top:point[1]-70,width:76,height:76,borderRadius:'50%',background:P.ink,color:P.white,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,boxShadow:'0 16px 36px rgba(20,25,22,.18)'}}>→</div>
    {pts.map((pt,i)=>{
      const show=pop(frame,16+i*9,fps);
      return <div key={'l'+i} style={{position:'absolute',left:pt[0]-80,top:pt[1]+32,width:160,textAlign:'center',fontSize:20,fontWeight:850,color:P.ink,opacity:show}}>Schritt {i+1}</div>;
    })}
  </AbsoluteFill></FadeEdges>;
};
