import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, FONT, prog} from '../brand';
import {
  EDITORIAL_MOTION_COLORS as E,
  EditorialDocument,
  EditorialLabel,
  EditorialMotionStage,
  EditorialMountain,
} from '../brand/components/EditorialMotion';

export type MotionBaseProps = {durationFrames?: number};
export type EditorialTone = 'green' | 'orange' | 'blue' | 'gold' | 'neutral';

const color = (tone: EditorialTone = 'neutral') => ({
  green: E.green,
  orange: E.orange,
  blue: E.blue,
  gold: E.gold,
  neutral: E.neutral,
}[tone]);

const windowFor = (durationFrames: number) => {
  const start = Math.max(6, Math.round(durationFrames * 0.14));
  const end = Math.max(start + 18, Math.round(durationFrames * 0.68));
  return {start, end};
};

const FlatBox: React.FC<{
  x:number;y:number;w:number;h:number;children?:React.ReactNode;
  fill?:string;opacity?:number;scale?:number;border?:string;
}> = ({x,y,w,h,children,fill=E.white,opacity=1,scale=1,border='#D8DCD7'}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:w,height:h,borderRadius:24,
    background:fill,border:'2px solid '+border,display:'flex',alignItems:'center',
    justifyContent:'center',textAlign:'center',color:E.ink,fontFamily:FONT.body,
    opacity,transform:'scale('+scale+')',transformOrigin:'50% 50%'
  }}>{children}</div>
);

export const MoneyTransfer: React.FC<MotionBaseProps & {
  fromLabel?:string;toLabel?:string;amount?:string;
}> = ({durationFrames=120,fromLabel='Girokonto',toLabel='Depot',amount='300 €'}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const move=prog(frame,start,end);
  const x=interpolate(move,[0,1],[345,735],CLAMP);
  return <EditorialMotionStage surface="cream">
    <FlatBox x={120} y={730} w={260} h={150}>
      <div><div style={{fontSize:26,fontWeight:800}}>{fromLabel}</div><div style={{fontSize:42,fontWeight:900,marginTop:8}}>{amount}</div></div>
    </FlatBox>
    <FlatBox x={700} y={730} w={260} h={150} fill="#E7EEE8" border={E.green}>
      <div><div style={{fontSize:26,fontWeight:800}}>{toLabel}</div><div style={{fontSize:34,fontWeight:900,marginTop:8,color:E.greenDark}}>+ {amount}</div></div>
    </FlatBox>
    <div style={{position:'absolute',left:380,top:802,width:320,height:6,borderRadius:999,background:'#D4D8D3'}} />
    <div style={{position:'absolute',left:x,top:765,width:78,height:78,borderRadius:'50%',background:E.gold,
      display:'flex',alignItems:'center',justifyContent:'center',color:E.ink,fontWeight:900,fontSize:20,
      transform:'translateX(-50%)'}}>€</div>
  </EditorialMotionStage>;
};

type SplitPart={label:string;share:number;tone?:EditorialTone};
const DEFAULT_SPLIT:SplitPart[]=[
  {label:'Fixkosten',share:50,tone:'neutral'},
  {label:'Freizeit',share:30,tone:'blue'},
  {label:'Sparen',share:20,tone:'green'},
];

export const MoneySplit:React.FC<MotionBaseProps & {
  sourceLabel?:string;amount?:string;parts?:SplitPart[];
}> = ({durationFrames=135,sourceLabel='Nettoeinkommen',amount='2.500 €',parts=DEFAULT_SPLIT}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const build=prog(frame,start,end);
  const visible=parts.slice(0,4);
  let offset=0;
  return <EditorialMotionStage surface="off-white">
    <div style={{position:'absolute',left:150,right:150,top:625,textAlign:'center',fontSize:28,fontWeight:800,color:E.inkSoft}}>{sourceLabel}</div>
    <div style={{position:'absolute',left:150,right:150,top:668,textAlign:'center',fontFamily:FONT.title,fontSize:48,fontWeight:900,color:E.ink}}>{amount}</div>
    <div style={{position:'absolute',left:135,top:790,width:810,height:150,borderRadius:28,overflow:'hidden',background:'#E3E5E1'}}>
      {visible.map((part) => {
        const left=offset*8.1;
        offset+=part.share;
        return <div key={part.label} style={{position:'absolute',left,top:0,width:part.share*8.1*build,height:'100%',
          background:color(part.tone),display:'flex',alignItems:'center',justifyContent:'center',
          overflow:'hidden',color:E.ink,fontWeight:900,fontSize:28}}>
          {build>0.68 ? part.share+'%' : ''}
        </div>;
      })}
    </div>
    <div style={{position:'absolute',left:135,right:135,top:975,display:'flex',justifyContent:'space-between',gap:18}}>
      {visible.map((part)=><div key={part.label} style={{padding:'10px 18px',borderRadius:14,background:E.white,
        border:'2px solid '+color(part.tone),fontSize:23,fontWeight:800,color:E.ink}}>{part.label}</div>)}
    </div>
  </EditorialMotionStage>;
};

export const ValueGrowth:React.FC<MotionBaseProps & {
  label?:string;startValue?:string;endValue?:string;tone?:EditorialTone;steps?:number;
}> = ({durationFrames=135,label='Vermögen',startValue='10.000 €',endValue='18.400 €',tone='green',steps=6}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const count=Math.max(4,Math.min(8,steps));
  return <EditorialMotionStage surface="cream">
    <div style={{position:'absolute',left:140,top:600,fontSize:28,fontWeight:800,color:E.inkSoft}}>{label}</div>
    <div style={{position:'absolute',left:140,right:140,top:700,height:430,display:'flex',alignItems:'flex-end',gap:24,borderBottom:'3px solid #C9CDC8'}}>
      {Array.from({length:count},(_,i)=>{
        const reveal=prog(frame,start+i*5,start+18+i*5);
        const ratio=(i+1)/count;
        return <div key={i} style={{flex:1,height:(95+285*ratio*ratio)*reveal,borderRadius:'18px 18px 6px 6px',background:color(tone)}} />;
      })}
    </div>
    <div style={{position:'absolute',left:140,top:1160,fontSize:26,fontWeight:800,color:E.inkSoft}}>{startValue}</div>
    <div style={{position:'absolute',right:140,top:1140,fontFamily:FONT.title,fontSize:48,fontWeight:900,color:color(tone),opacity:prog(frame,end-10,end)}}>{endValue}</div>
  </EditorialMotionStage>;
};

export const ValueDrain:React.FC<MotionBaseProps & {
  label?:string;startValue?:string;endValue?:string;drainLabel?:string;
}> = ({durationFrames=135,label='Rendite',startValue='100 %',endValue='82 %',drainLabel='Kosten'}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const p=prog(frame,start,end);
  const width=interpolate(p,[0,1],[760,610],CLAMP);
  return <EditorialMotionStage surface="off-white">
    <EditorialLabel x={420} y={620} width={240} tone="orange">{drainLabel}</EditorialLabel>
    <div style={{position:'absolute',left:160,top:790,width:760,height:140,borderRadius:24,background:'#DDE7DF'}} />
    <div style={{position:'absolute',left:160,top:790,width,height:140,borderRadius:24,background:E.green}} />
    {[0,1,2].map((i)=>{
      const cut=prog(frame,start+12+i*10,start+28+i*10);
      return <div key={i} style={{position:'absolute',left:790+i*46,top:820+i*6,width:30,height:70,borderRadius:8,
        background:E.orange,opacity:cut,transform:'translateY('+(cut*78)+'px)'}} />;
    })}
    <div style={{position:'absolute',left:160,top:965,fontSize:27,fontWeight:800,color:E.inkSoft}}>{label}: {startValue}</div>
    <div style={{position:'absolute',right:160,top:950,fontFamily:FONT.title,fontSize:52,fontWeight:900,color:E.orange,opacity:prog(frame,end-10,end)}}>{endValue}</div>
  </EditorialMotionStage>;
};

type AllocationPart={label:string;value:number;tone?:EditorialTone};
const DEFAULT_ALLOCATION:AllocationPart[]=[
  {label:'Aktien',value:70,tone:'green'},
  {label:'Anleihen',value:30,tone:'blue'},
];

export const AllocationSplit:React.FC<MotionBaseProps & {title?:string;parts?:AllocationPart[]}> = ({durationFrames=120,title='Aufteilung',parts=DEFAULT_ALLOCATION}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const p=prog(frame,start,end);
  let offset=0;
  return <EditorialMotionStage surface="cream">
    <div style={{position:'absolute',left:0,right:0,top:650,textAlign:'center',fontSize:30,fontWeight:850,color:E.ink}}>{title}</div>
    <div style={{position:'absolute',left:130,top:790,width:820,height:170,borderRadius:28,overflow:'hidden',background:'#E0E3DE'}}>
      {parts.map((part)=>{
        const left=offset*8.2;
        offset+=part.value;
        return <div key={part.label} style={{position:'absolute',left,top:0,width:part.value*8.2*p,height:'100%',
          background:color(part.tone),display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:34,fontWeight:900,color:E.ink,overflow:'hidden'}}>
          {p>0.72 ? part.value+'%' : ''}
        </div>;
      })}
    </div>
    <div style={{position:'absolute',left:150,right:150,top:1000,display:'flex',justifyContent:'space-between',fontSize:26,fontWeight:800,color:E.inkSoft}}>
      {parts.map((part)=><span key={part.label}>{part.label}</span>)}
    </div>
  </EditorialMotionStage>;
};

export const Rebalancing:React.FC<MotionBaseProps & {
  leftLabel?:string;rightLabel?:string;from?:[number,number];to?:[number,number];
}> = ({durationFrames=135,leftLabel='Aktien',rightLabel='Anleihen',from=[82,18],to=[70,30]}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const p=prog(frame,start,end);
  const left=interpolate(p,[0,1],[from[0],to[0]],CLAMP);
  const right=interpolate(p,[0,1],[from[1],to[1]],CLAMP);
  return <EditorialMotionStage surface="off-white">
    <div style={{position:'absolute',left:185,top:705,width:250,height:420,display:'flex',alignItems:'flex-end'}}>
      <div style={{width:'100%',height:left*4.2,borderRadius:'24px 24px 8px 8px',background:E.green,
        display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:24,fontFamily:FONT.title,fontSize:42,fontWeight:900,color:E.ink}}>{Math.round(left)}%</div>
    </div>
    <div style={{position:'absolute',right:185,top:705,width:250,height:420,display:'flex',alignItems:'flex-end'}}>
      <div style={{width:'100%',height:right*4.2,borderRadius:'24px 24px 8px 8px',background:E.blue,
        display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:24,fontFamily:FONT.title,fontSize:42,fontWeight:900,color:E.ink}}>{Math.round(right)}%</div>
    </div>
    <div style={{position:'absolute',left:185,top:1150,width:250,textAlign:'center',fontSize:27,fontWeight:850,color:E.inkSoft}}>{leftLabel}</div>
    <div style={{position:'absolute',right:185,top:1150,width:250,textAlign:'center',fontSize:27,fontWeight:850,color:E.inkSoft}}>{rightLabel}</div>
  </EditorialMotionStage>;
};

type Destination={label:string;tone?:EditorialTone};
const DEFAULT_DESTINATIONS:Destination[]=[
  {label:'Technologie',tone:'blue'},
  {label:'Gesundheit',tone:'green'},
  {label:'Industrie',tone:'neutral'},
  {label:'Konsum',tone:'gold'},
];
const DESTINATIONS=[{x:170,y:700},{x:670,y:700},{x:170,y:1010},{x:670,y:1010}];

export const Diversification:React.FC<MotionBaseProps & {sourceLabel?:string;destinations?:Destination[]}> = ({durationFrames=135,sourceLabel='ETF',destinations=DEFAULT_DESTINATIONS}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  return <EditorialMotionStage surface="muted-green">
    <div style={{position:'absolute',left:430,top:820,width:220,height:110,borderRadius:55,background:E.green,color:E.ink,
      display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:42,fontWeight:900}}>{sourceLabel}</div>
    {destinations.slice(0,4).map((d,i)=>{
      const local=prog(frame,start+i*7,end-10+i*4);
      const t=DESTINATIONS[i];
      const cx=540,cy=875,tx=t.x+120,ty=t.y+55;
      return <React.Fragment key={d.label}>
        <svg style={{position:'absolute',inset:0}} width="1080" height="1920">
          <line x1={cx} y1={cy} x2={interpolate(local,[0,1],[cx,tx],CLAMP)} y2={interpolate(local,[0,1],[cy,ty],CLAMP)}
            stroke={color(d.tone)} strokeWidth="6" strokeLinecap="round" />
        </svg>
        <div style={{position:'absolute',left:t.x,top:t.y,width:240,height:110,borderRadius:24,background:E.white,
          border:'3px solid '+color(d.tone),display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:24,fontWeight:850,color:E.ink,opacity:local}}>{d.label}</div>
      </React.Fragment>;
    })}
  </EditorialMotionStage>;
};

export const LoanPaydown:React.FC<MotionBaseProps & {label?:string;startDebt?:string;endDebt?:string;payments?:number}> = ({durationFrames=150,label='Restschuld',startDebt='20.000 €',endDebt='12.000 €',payments=4}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const p=prog(frame,start,end);
  const width=interpolate(p,[0,1],[780,470],CLAMP);
  return <EditorialMotionStage surface="cream">
    <div style={{position:'absolute',left:150,top:650,fontSize:29,fontWeight:850,color:E.ink}}>{label}</div>
    <div style={{position:'absolute',left:150,top:760,width:780,height:165,borderRadius:28,background:'#E6E3DD'}} />
    <div style={{position:'absolute',left:150,top:760,width,height:165,borderRadius:28,background:E.orange}} />
    {Array.from({length:Math.max(3,Math.min(6,payments))},(_,i)=>{
      const appear=prog(frame,start+10+i*10,start+20+i*10);
      return <div key={i} style={{position:'absolute',left:190+i*120,top:970,width:82,height:52,borderRadius:14,
        background:E.white,border:'2px solid #D4D7D2',display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:18,fontWeight:850,color:E.inkSoft,opacity:appear}}>Rate</div>;
    })}
    <div style={{position:'absolute',left:150,top:1080,fontSize:27,fontWeight:800,color:E.inkSoft}}>{startDebt}</div>
    <div style={{position:'absolute',right:150,top:1060,fontFamily:FONT.title,fontSize:50,fontWeight:900,color:E.greenDark,opacity:prog(frame,end-10,end)}}>{endDebt}</div>
  </EditorialMotionStage>;
};

export const ProtectionLimit:React.FC<MotionBaseProps & {entityLabel?:string;items?:string[];limit?:string}> = ({durationFrames=135,entityLabel='Bank',items=['Giro','Tagesgeld','Festgeld'],limit='100.000 €'}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const p=prog(frame,start,end);
  return <EditorialMotionStage surface="off-white">
    <div style={{position:'absolute',left:625,top:655,width:300,height:500,borderRadius:34,border:'4px solid '+E.green,background:'#EEF3EF',opacity:p}}>
      <div style={{position:'absolute',left:0,right:0,top:34,textAlign:'center',fontSize:32,fontWeight:900,color:E.ink}}>{entityLabel}</div>
    </div>
    {items.slice(0,4).map((item,i)=>{
      const local=prog(frame,start+i*8,end-10);
      const x=interpolate(local,[0,1],[120+i*35,660],CLAMP);
      return <EditorialLabel key={item} x={x} y={755+i*105} width={220} tone="neutral" opacity={local}>{item}</EditorialLabel>;
    })}
    <div style={{position:'absolute',left:0,right:0,top:1190,textAlign:'center',fontFamily:FONT.title,fontSize:56,fontWeight:900,color:E.greenDark,opacity:prog(frame,end-10,end)}}>{limit}</div>
  </EditorialMotionStage>;
};

type Scenario={label:string;value:string;tone?:EditorialTone};
const DEFAULT_LEFT:Scenario={label:'Variante A',value:'91.000 €',tone:'green'};
const DEFAULT_RIGHT:Scenario={label:'Variante B',value:'69.000 €',tone:'orange'};

export const ScenarioComparison:React.FC<MotionBaseProps & {left?:Scenario;right?:Scenario}> = ({durationFrames=135,left=DEFAULT_LEFT,right=DEFAULT_RIGHT}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const p=prog(frame,start,end);
  const leftH=interpolate(p,[0,1],[100,390],CLAMP);
  const rightH=interpolate(p,[0,1],[100,270],CLAMP);
  return <EditorialMotionStage surface="cream">
    <div style={{position:'absolute',left:190,top:720,width:260,height:430,display:'flex',alignItems:'flex-end'}}>
      <div style={{width:'100%',height:leftH,borderRadius:'24px 24px 8px 8px',background:color(left.tone),
        display:'flex',justifyContent:'center',paddingTop:26,fontFamily:FONT.title,fontSize:36,fontWeight:900,color:E.ink}}>{left.value}</div>
    </div>
    <div style={{position:'absolute',right:190,top:720,width:260,height:430,display:'flex',alignItems:'flex-end'}}>
      <div style={{width:'100%',height:rightH,borderRadius:'24px 24px 8px 8px',background:color(right.tone),
        display:'flex',justifyContent:'center',paddingTop:26,fontFamily:FONT.title,fontSize:36,fontWeight:900,color:E.ink}}>{right.value}</div>
    </div>
    <div style={{position:'absolute',left:190,top:1170,width:260,textAlign:'center',fontSize:27,fontWeight:850,color:E.inkSoft}}>{left.label}</div>
    <div style={{position:'absolute',right:190,top:1170,width:260,textAlign:'center',fontSize:27,fontWeight:850,color:E.inkSoft}}>{right.label}</div>
  </EditorialMotionStage>;
};

type Milestone={label:string;value?:string;tone?:EditorialTone};
const DEFAULT_MILESTONES:Milestone[]=[
  {label:'Heute',value:'10.000 €',tone:'neutral'},
  {label:'10 Jahre',value:'16.000 €',tone:'blue'},
  {label:'20 Jahre',value:'26.000 €',tone:'green'},
  {label:'30 Jahre',value:'42.000 €',tone:'gold'},
];

export const FinanceTimeline:React.FC<MotionBaseProps & {milestones?:Milestone[]}> = ({durationFrames=150,milestones=DEFAULT_MILESTONES}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const visible=milestones.slice(0,5);
  const p=prog(frame,start,end);
  return <EditorialMotionStage surface="off-white">
    <div style={{position:'absolute',left:130,top:885,width:820,height:8,borderRadius:999,background:'#D9DCD7'}}>
      <div style={{height:'100%',width:(p*100)+'%',borderRadius:999,background:E.green}} />
    </div>
    {visible.map((m,i)=>{
      const x=130+i*(820/Math.max(1,visible.length-1));
      const reveal=prog(frame,start+i*12,start+18+i*12);
      return <div key={m.label} style={{position:'absolute',left:x-90,top:825,width:180,textAlign:'center',
        opacity:reveal,transform:'translateY('+((1-reveal)*14)+'px)'}}>
        <div style={{width:30,height:30,borderRadius:'50%',background:color(m.tone),margin:'46px auto 20px'}} />
        <div style={{fontSize:23,fontWeight:850,color:E.ink}}>{m.label}</div>
        {m.value?<div style={{marginTop:8,fontFamily:FONT.title,fontSize:27,fontWeight:900,color:color(m.tone)}}>{m.value}</div>:null}
      </div>;
    })}
  </EditorialMotionStage>;
};

export const CompoundGrowth:React.FC<MotionBaseProps & {periods?:string[];values?:string[]}> = ({durationFrames=150,periods=['Start','10 J.','20 J.','30 J.'],values=['10k','16k','26k','42k']}) => {
  const frame=useCurrentFrame();
  const {start}=windowFor(durationFrames);
  const count=Math.min(5,Math.min(periods.length,values.length));
  return <EditorialMotionStage surface="muted-green">
    <div style={{position:'absolute',left:150,right:150,top:720,height:430,display:'flex',alignItems:'flex-end',gap:34,borderBottom:'3px solid #BFCBC2'}}>
      {Array.from({length:count},(_,i)=>{
        const reveal=prog(frame,start+i*12,start+24+i*12);
        const height=(105+i*i*42+i*42)*reveal;
        return <div key={i} style={{flex:1,height,borderRadius:'20px 20px 6px 6px',background:E.green,position:'relative'}}>
          <div style={{position:'absolute',left:-10,right:-10,top:-46,textAlign:'center',fontFamily:FONT.title,fontSize:28,fontWeight:900,color:E.greenDark,opacity:reveal}}>{values[i]}</div>
          <div style={{position:'absolute',left:-15,right:-15,bottom:-44,textAlign:'center',fontSize:21,fontWeight:800,color:E.inkSoft}}>{periods[i]}</div>
        </div>;
      })}
    </div>
  </EditorialMotionStage>;
};

export const MountainProgress:React.FC<MotionBaseProps & {flagLabel?:string}> = ({durationFrames=135,flagLabel='Ziel'}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  return <EditorialMotionStage surface="cream">
    <EditorialMountain x={210} y={650} width={660} height={470} progress={prog(frame,start,end)} flagLabel={flagLabel} />
  </EditorialMotionStage>;
};

export const DocumentCostIncrease:React.FC<MotionBaseProps & {startAmount?:string;fee?:string;endAmount?:string}> = ({durationFrames=135,startAmount='100 €',fee='+ 5 €',endAmount='105 €'}) => {
  const frame=useCurrentFrame();
  const {start,end}=windowFor(durationFrames);
  const add=prog(frame,start,end-12);
  return <EditorialMotionStage surface="off-white">
    <EditorialDocument x={180} y={650} title="Rechnung" amount={startAmount} accent="blue" />
    <EditorialDocument x={600} y={650} title="Mahnung" amount={endAmount} accent="orange" opacity={0.25+add*0.75} scale={0.92+add*0.08} />
    <div style={{position:'absolute',left:690,top:860,width:180,textAlign:'center',fontFamily:FONT.title,fontSize:36,fontWeight:900,color:E.orange,opacity:add}}>{fee}</div>
  </EditorialMotionStage>;
};

export const EDITORIAL_FINANCE_MOTION_REGISTRY = [
  {id:'money-transfer',category:'money',reusable:true},
  {id:'money-split',category:'money',reusable:true},
  {id:'value-growth',category:'growth',reusable:true},
  {id:'value-drain',category:'costs',reusable:true},
  {id:'allocation-split',category:'portfolio',reusable:true},
  {id:'rebalancing',category:'portfolio',reusable:true},
  {id:'diversification',category:'portfolio',reusable:true},
  {id:'loan-paydown',category:'credit',reusable:true},
  {id:'protection-limit',category:'banking',reusable:true},
  {id:'scenario-comparison',category:'comparison',reusable:true},
  {id:'finance-timeline',category:'time',reusable:true},
  {id:'compound-growth',category:'growth',reusable:true},
  {id:'mountain-progress',category:'time',reusable:true},
  {id:'document-cost-increase',category:'costs',reusable:true},
] as const;

export const EDITORIAL_FINANCE_MOTION_COMPONENTS = {
  'money-transfer':MoneyTransfer,
  'money-split':MoneySplit,
  'value-growth':ValueGrowth,
  'value-drain':ValueDrain,
  'allocation-split':AllocationSplit,
  rebalancing:Rebalancing,
  diversification:Diversification,
  'loan-paydown':LoanPaydown,
  'protection-limit':ProtectionLimit,
  'scenario-comparison':ScenarioComparison,
  'finance-timeline':FinanceTimeline,
  'compound-growth':CompoundGrowth,
  'mountain-progress':MountainProgress,
  'document-cost-increase':DocumentCostIncrease,
} as const;

export type EditorialFinanceMotionId = keyof typeof EDITORIAL_FINANCE_MOTION_COMPONENTS;
