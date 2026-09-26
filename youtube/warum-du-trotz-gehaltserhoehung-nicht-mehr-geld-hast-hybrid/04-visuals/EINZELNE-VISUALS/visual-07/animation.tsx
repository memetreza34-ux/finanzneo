import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const BG = '#000000';
const IVORY = '#F0E7D5';
const MUTED = '#8B8B86';
const GREEN = '#38B77A';
const RED = '#D66748';

const base: React.CSSProperties = {fontFamily: 'Arial, sans-serif', color: IVORY};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Stage: React.FC<React.PropsWithChildren> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: BG, justifyContent: 'center', alignItems: 'center', ...base}}>{children}</AbsoluteFill>
);

const Bar: React.FC<{label:string; value:number; max?:number; accent?:string}> = ({label,value,max=100,accent=GREEN}) => (
  <div style={{width: 760, margin: '20px 0'}}>
    <div style={{fontSize: 30, marginBottom: 10}}>{label}</div>
    <div style={{height: 54, borderRadius: 18, backgroundColor:'#202020', overflow:'hidden'}}>
      <div style={{width:`${Math.max(0, Math.min(100, value / max * 100))}%`, height:'100%', backgroundColor:accent, borderRadius:18}} />
    </div>
  </div>
);

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const income = interpolate(frame,[0,24],[0,1],clamp);
  const branch1 = interpolate(frame,[20,42],[0,1],clamp);
  const branch2 = interpolate(frame,[34,56],[0,1],clamp);
  const branch3 = interpolate(frame,[48,70],[0,1],clamp);
  return <Stage><div style={{width:1100}}>
    <div style={{fontSize:42, marginBottom:34}}>Mehr Einkommen kommt an</div>
    <div style={{height:44,width:820*income,backgroundColor:GREEN,borderRadius:22}} />
    {[['Bequemlichkeit',branch1],['Kleine Extras',branch2],['Neue Gewohnheiten',branch3]].map(([label,p],i)=><div key={String(label)} style={{display:'flex',alignItems:'center',gap:20,marginTop:22,marginLeft:120+i*90,opacity:Number(p)}}><div style={{width:180*Number(p),height:16,backgroundColor:RED,borderRadius:8}}/><span style={{fontSize:28}}>{label}</span></div>)}
  </div></Stage>;
};

export const YouTubeVisual03Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame,[0,45],[0,1],clamp);
  return <Stage><div><div style={{fontSize:46,marginBottom:28}}>Freier Spielraum</div><Bar label="vorher" value={35} max={100} accent={MUTED}/><Bar label="nach Gehaltserhöhung" value={35+45*p} max={100} accent={GREEN}/></div></Stage>;
};

export const YouTubeVisual04Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const salary = interpolate(frame,[0,35],[55,90],clamp);
  const spending = interpolate(frame,[22,62],[50,82],clamp);
  return <Stage><div><div style={{fontSize:46,marginBottom:34}}>Gehalt ↑ — Ausgaben folgen</div><Bar label="Gehalt" value={salary} accent={GREEN}/><Bar label="Ausgaben" value={spending} accent={RED}/></div></Stage>;
};

export const YouTubeVisual06Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [12,18,9,16,14,11];
  const visible = items.map((_,i)=>interpolate(frame,[i*8, i*8+18],[0,1],clamp));
  const total = visible.reduce((s,p,i)=>s+items[i]*p,0);
  return <Stage><div style={{width:1050}}><div style={{fontSize:44,marginBottom:28}}>Kleine Extras werden zur neuen Basis</div><div style={{display:'flex',gap:14,alignItems:'flex-end',height:180}}>{visible.map((p,i)=><div key={i} style={{width:120,height:90*p,backgroundColor:RED,borderRadius:16,opacity:.45+.55*p}}/> )}</div><div style={{marginTop:36,fontSize:34}}>Monatsniveau: <b>{Math.round(total)}</b> zusätzliche Einheiten</div></div></Stage>;
};

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame,[0,24],[0,1],clamp);
  const p2 = interpolate(frame,[22,46],[0,1],clamp);
  const p3 = interpolate(frame,[44,68],[0,1],clamp);
  const y = 430 - (p1+p2+p3)*70;
  return <Stage><div style={{width:1100,height:520,position:'relative'}}><div style={{fontSize:48}}>Lifestyle Creep</div><div style={{position:'absolute',left:80,right:80,top:y,height:16,backgroundColor:RED,borderRadius:8}}/><div style={{position:'absolute',left:85,top:y-52,fontSize:30}}>normaler Lebensstandard</div><div style={{position:'absolute',left:80,bottom:30,fontSize:28,color:MUTED}}>steigt schrittweise — und bleibt dann oben</div></div></Stage>;
};

export const YouTubeVisual09Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const months = ['Monat 1','Monat 2','Monat 3'];
  return <Stage><div style={{display:'flex',gap:30}}>{months.map((m,i)=>{const p=interpolate(frame,[i*18,i*18+22],[0,1],clamp);return <div key={m} style={{width:300,height:360,border:'2px solid #333',borderRadius:24,padding:26,opacity:p,transform:`translateX(${(1-p)*80}px)`}}><div style={{fontSize:30,marginBottom:80}}>{m}</div><div style={{height:150,backgroundColor:RED,borderRadius:18}}/><div style={{fontSize:25,marginTop:16}}>Fixkosten bleiben</div></div>})}</div></Stage>;
};

export const YouTubeVisual10Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame,[0,50],[0,1],clamp);
  return <Stage><div style={{display:'flex',gap:90}}><div><div style={{fontSize:38,marginBottom:20}}>Vorher</div><Bar label="Gehalt" value={65*p} max={100} accent={IVORY}/><Bar label="Ausgaben" value={52*p} max={100} accent={RED}/><Bar label="frei" value={13*p} max={100} accent={GREEN}/></div><div><div style={{fontSize:38,marginBottom:20}}>Nachher</div><Bar label="Gehalt" value={90*p} max={100} accent={IVORY}/><Bar label="Ausgaben" value={75*p} max={100} accent={RED}/><Bar label="frei" value={15*p} max={100} accent={GREEN}/></div></div></Stage>;
};

export const YouTubeVisual13Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const weeks = [0,1,2,3];
  return <Stage><div style={{width:1100}}><div style={{fontSize:46,marginBottom:42}}>Der Monat wird wieder eng</div><div style={{display:'flex',gap:20}}>{weeks.map((w)=>{const p=interpolate(frame,[w*18,w*18+28],[0,1],clamp);const remaining=100-(w+1)*20*p;return <div key={w} style={{width:250}}><div style={{fontSize:28,marginBottom:14}}>Woche {w+1}</div><div style={{height:260,backgroundColor:'#202020',borderRadius:22,display:'flex',alignItems:'flex-end',overflow:'hidden'}}><div style={{width:'100%',height:`${remaining}%`,backgroundColor:GREEN}}/></div></div>})}</div></div></Stage>;
};

export const YouTubeVisual14Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const p = spring({frame,fps:30,config:{damping:18,stiffness:90}});
  return <Stage><div style={{width:1100}}><div style={{fontSize:46,marginBottom:44}}>Erhöhung bewusst aufteilen</div><div style={{display:'flex',alignItems:'center',gap:34}}><div style={{fontSize:44,padding:'24px 34px',borderRadius:22,backgroundColor:IVORY,color:'#111'}}>+ Einkommen</div><div style={{fontSize:46}}>→</div>{[['Rücklage',GREEN],['langfristig',GREEN],['mehr leben',IVORY]].map(([t,c],i)=><div key={String(t)} style={{opacity:interpolate(p,[0,1],[0.25,1]),transform:`translateY(${(1-p)*(30+i*10)}px)`,padding:'22px 28px',borderRadius:20,border:`3px solid ${c}`,fontSize:29}}>{t}</div>)}</div></div></Stage>;
};

export const YouTubeVisual15Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame,[0,55],[0,1],clamp);
  const total = Math.round(300*p);
  return <Stage><div style={{width:1100,textAlign:'center'}}><div style={{fontSize:64,fontWeight:700,marginBottom:40}}>+{total} €</div><div style={{display:'flex',justifyContent:'center',gap:26}}>{[['150 €','Rücklage',GREEN],['100 €','langfristig',GREEN],['50 €','mehr leben',IVORY]].map(([v,l,c],i)=>{const q=interpolate(frame,[18+i*10,38+i*10],[0,1],clamp);return <div key={String(l)} style={{opacity:q,transform:`translateY(${(1-q)*35}px)`,width:280,padding:28,borderRadius:22,border:`3px solid ${c}`}}><div style={{fontSize:46,fontWeight:700}}>{v}</div><div style={{fontSize:26,marginTop:8}}>{l}</div></div>})}</div><div style={{marginTop:32,fontSize:24,color:MUTED}}>Beispiel — keine starre Quote</div></div></Stage>;
};

export const YouTubeVisual16Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame,[0,32],[0,1],clamp);
  const p2 = interpolate(frame,[28,60],[0,1],clamp);
  return <Stage><div style={{width:1100}}><div style={{fontSize:46,marginBottom:50}}>Zuerst sichern, dann ausgeben</div><div style={{display:'grid',gridTemplateColumns:'260px 1fr 260px',alignItems:'center',gap:24}}><div style={{padding:26,borderRadius:22,backgroundColor:IVORY,color:'#111',fontSize:34,textAlign:'center'}}>Gehalt</div><div><div style={{height:18,width:`${100*p1}%`,backgroundColor:GREEN,borderRadius:9,marginBottom:36}}/><div style={{height:18,width:`${100*p2}%`,backgroundColor:IVORY,borderRadius:9}}/></div><div><div style={{padding:20,border:`3px solid ${GREEN}`,borderRadius:18,fontSize:28,marginBottom:24}}>Rücklage / langfristig</div><div style={{padding:20,border:'3px solid #555',borderRadius:18,fontSize:28}}>Alltag bekommt den Rest</div></div></div></div></Stage>;
};

export const YouTubeVisual17Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Stage><div style={{width:1100}}><div style={{fontSize:46,marginBottom:42}}>Was bleibt, kann wachsen</div><div style={{height:420,display:'flex',alignItems:'flex-end',gap:28}}>{[1,2,3,4,5,6].map((m,i)=>{const p=spring({frame:frame-i*6,fps,config:{damping:16,stiffness:80}});return <div key={m} style={{flex:1}}><div style={{height:Math.max(8,p*(90+i*45)),backgroundColor:GREEN,borderRadius:'18px 18px 0 0'}}/><div style={{textAlign:'center',fontSize:24,marginTop:12}}>M{m}</div></div>})}</div></div></Stage>;
};
