import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {LAYOUT} from './shared';
import {NOTGROSCHEN_WORD_TIMINGS} from './word-timings';

type IndexedWord={word:string;index:number};
const balance=(words:string[]):IndexedWord[][]=>{
  const indexed=words.map((word,index)=>({word,index}));
  const total=words.join(' ').length;
  if(total<=46||words.length<6)return[indexed];
  let best=Math.ceil(words.length/2);let score=Infinity;
  for(let split=2;split<=words.length-2;split+=1){const left=words.slice(0,split).join(' ').length;const right=words.slice(split).join(' ').length;const next=Math.max(left,right)*2+Math.abs(left-right);if(next<score){score=next;best=split;}}
  return[indexed.slice(0,best),indexed.slice(best)];
};

export const NotgroschenKaraokeCaptions:React.FC=()=>{
  const frame=useCurrentFrame();let sentenceIndex=0;
  for(let index=1;index<NOTGROSCHEN_WORD_TIMINGS.length;index+=1){if(frame>=NOTGROSCHEN_WORD_TIMINGS[index].frames[0])sentenceIndex=index;else break;}
  const sentence=NOTGROSCHEN_WORD_TIMINGS[sentenceIndex];const words=sentence.text.split(/\s+/);const lines=balance(words);let active=-1;
  for(let index=0;index<words.length;index+=1){if(frame>=sentence.frames[index]&&frame<sentence.frames[index+1]){active=index;break;}}
  const longest=Math.max(...lines.map(line=>line.map(item=>item.word).join(' ').length));const fontSize=longest>62?25:longest>56?27:longest>50?29:longest>44?32:36;
  return <div style={{position:'absolute',left:LAYOUT.subtitleLeft,right:LAYOUT.subtitleRight,bottom:LAYOUT.subtitleBottom,zIndex:100}}><div style={{minHeight:lines.length===2?124:92,borderRadius:26,padding:lines.length===2?'17px 22px 19px':'18px 22px 20px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,textAlign:'center',background:'rgba(3,12,7,.93)',border:'1px solid rgba(255,255,255,.13)',boxShadow:'0 22px 70px rgba(0,0,0,.4)',fontFamily:FONT.body,fontWeight:800,fontSize,lineHeight:1.14}}>{lines.map((line,lineIndex)=><div key={`${sentence.id}-${lineIndex}`} style={{whiteSpace:'nowrap'}}>{line.map(({word,index},position)=><React.Fragment key={`${sentence.id}-${index}`}>{position>0?' ':null}<span style={{color:index===active?C.accentLt:C.white,textShadow:index===active?`0 0 18px ${C.accent},0 2px 14px rgba(0,0,0,.8)`:'0 2px 14px rgba(0,0,0,.8)'}}>{word}</span></React.Fragment>)}</div>)}</div></div>;
};
