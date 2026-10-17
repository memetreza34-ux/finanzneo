import React from 'react';
import {FONT} from '../../brand';
import {MOTION_V3} from './motion-tokens';

export const HouseV3: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  accent?: string;
}> = ({x, y, scale = 1, opacity = 1, accent = MOTION_V3.green}) => (
  <div style={{position:'absolute',left:x,top:y,width:330,height:300,transform:`scale(${scale})`,transformOrigin:'50% 100%',opacity}}>
    <svg width="330" height="300" viewBox="0 0 330 300">
      <path d="M35 135 L165 35 L295 135 V268 H35 Z" fill="#FFF" stroke={MOTION_V3.ink} strokeWidth="6" strokeLinejoin="round"/>
      <path d="M20 140 L165 20 L310 140" fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="128" y="180" width="74" height="88" rx="10" fill={accent}/>
      <rect x="65" y="165" width="58" height="50" rx="8" fill="#DCE7E0"/>
      <rect x="208" y="165" width="58" height="50" rx="8" fill="#DCE7E0"/>
    </svg>
  </div>
);

export const ContractV3: React.FC<{
  x:number;y:number;title?:string;rate?:string;opacity?:number;scale?:number;accent?:string;
}> = ({x,y,title='Zinsbindung',rate='1,8 %',opacity=1,scale=1,accent=MOTION_V3.blue}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:310,height:390,borderRadius:28,
    background:'#FFF',border:'2px solid #D9DDD8',boxShadow:'0 12px 30px rgba(36,48,42,0.07)',
    padding:'28px 26px',boxSizing:'border-box',opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%',
  }}>
    <div style={{fontFamily:FONT.title,fontSize:39,fontWeight:900,color:MOTION_V3.ink}}>{title}</div>
    <div style={{marginTop:18,width:145,height:8,borderRadius:8,background:accent}}/>
    <div style={{marginTop:28,width:'100%',height:8,borderRadius:8,background:'#E1E4E0'}}/>
    <div style={{marginTop:14,width:'76%',height:8,borderRadius:8,background:'#E1E4E0'}}/>
    <div style={{marginTop:14,width:'88%',height:8,borderRadius:8,background:'#E1E4E0'}}/>
    <div style={{position:'absolute',left:26,right:26,bottom:34,fontFamily:FONT.title,fontSize:58,fontWeight:900,color:accent}}>{rate}</div>
  </div>
);

export const CalendarV3: React.FC<{
  x:number;y:number;year:string;opacity?:number;scale?:number;accent?:string;
}> = ({x,y,year,opacity=1,scale=1,accent=MOTION_V3.orange}) => (
  <div style={{
    position:'absolute',left:x,top:y,width:185,height:180,borderRadius:24,background:'#FFF',
    border:'2px solid #D9DDD8',boxShadow:'0 10px 26px rgba(36,48,42,0.06)',
    opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%',
  }}>
    <div style={{height:42,borderRadius:'22px 22px 0 0',background:accent}}/>
    <div style={{position:'absolute',left:0,right:0,top:72,textAlign:'center',fontFamily:FONT.title,fontSize:46,fontWeight:900,color:MOTION_V3.ink}}>{year}</div>
  </div>
);

export const PersonV3: React.FC<{
  x:number;y:number;scale?:number;opacity?:number;shirt?:string;direction?:1|-1;
}> = ({x,y,scale=1,opacity=1,shirt=MOTION_V3.green,direction=1}) => (
  <div style={{position:'absolute',left:x,top:y,width:120,height:220,transform:`scale(${direction*scale},${scale})`,transformOrigin:'50% 100%',opacity}}>
    <svg width="120" height="220" viewBox="0 0 120 220">
      <circle cx="60" cy="33" r="26" fill="#D8AF91"/>
      <path d="M35 70 Q60 55 85 70 L90 145 Q60 160 30 145 Z" fill={shirt}/>
      <path d="M40 145 L35 215" stroke={MOTION_V3.ink} strokeWidth="18" strokeLinecap="round"/>
      <path d="M80 145 L86 215" stroke={MOTION_V3.ink} strokeWidth="18" strokeLinecap="round"/>
      <path d="M35 84 L15 135" stroke="#D8AF91" strokeWidth="13" strokeLinecap="round"/>
      <path d="M85 84 L104 128" stroke="#D8AF91" strokeWidth="13" strokeLinecap="round"/>
    </svg>
  </div>
);

export const PhoneV3: React.FC<{x:number;y:number;label?:string;amount?:string;opacity?:number;scale?:number}> = ({x,y,label='Mobilfunk',amount='19 €',opacity=1,scale=1}) => (
  <div style={{position:'absolute',left:x,top:y,width:150,height:250,borderRadius:28,background:MOTION_V3.ink,padding:10,boxSizing:'border-box',opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%'}}>
    <div style={{width:'100%',height:'100%',borderRadius:20,background:'#FFF',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
      <div style={{fontSize:20,fontWeight:800,color:MOTION_V3.inkSoft}}>{label}</div>
      <div style={{fontFamily:FONT.title,fontSize:40,fontWeight:900,color:MOTION_V3.orange}}>{amount}</div>
    </div>
  </div>
);

export const DumbbellV3:React.FC<{x:number;y:number;opacity?:number;scale?:number}> = ({x,y,opacity=1,scale=1}) => (
  <div style={{position:'absolute',left:x,top:y,width:190,height:90,opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%'}}>
    <svg width="190" height="90" viewBox="0 0 190 90">
      <rect x="45" y="35" width="100" height="20" rx="10" fill={MOTION_V3.ink}/>
      <rect x="15" y="15" width="30" height="60" rx="8" fill={MOTION_V3.blue}/>
      <rect x="145" y="15" width="30" height="60" rx="8" fill={MOTION_V3.blue}/>
      <rect x="0" y="24" width="18" height="42" rx="7" fill={MOTION_V3.blue}/>
      <rect x="172" y="24" width="18" height="42" rx="7" fill={MOTION_V3.blue}/>
    </svg>
  </div>
);

export const PlayTileV3:React.FC<{x:number;y:number;opacity?:number;scale?:number}> = ({x,y,opacity=1,scale=1}) => (
  <div style={{position:'absolute',left:x,top:y,width:150,height:150,borderRadius:32,background:MOTION_V3.orange,display:'flex',alignItems:'center',justifyContent:'center',opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%'}}>
    <div style={{width:0,height:0,borderTop:'28px solid transparent',borderBottom:'28px solid transparent',borderLeft:'44px solid #FFF',marginLeft:10}}/>
  </div>
);

export const ReceiptV3:React.FC<{x:number;y:number;title?:string;amount:string;opacity?:number;scale?:number}> = ({x,y,title='Abo',amount,opacity=1,scale=1}) => (
  <div style={{position:'absolute',left:x,top:y,width:240,height:300,background:'#FFF',border:'2px solid #D9DDD8',padding:24,boxSizing:'border-box',opacity,transform:`scale(${scale})`,transformOrigin:'50% 50%'}}>
    <div style={{fontFamily:FONT.title,fontSize:34,fontWeight:900,color:MOTION_V3.ink}}>{title}</div>
    <div style={{marginTop:26,width:'100%',height:7,borderRadius:7,background:'#E2E5E1'}}/>
    <div style={{marginTop:13,width:'72%',height:7,borderRadius:7,background:'#E2E5E1'}}/>
    <div style={{position:'absolute',left:24,right:24,bottom:30,fontFamily:FONT.title,fontSize:44,fontWeight:900,color:MOTION_V3.orange}}>{amount}</div>
  </div>
);
