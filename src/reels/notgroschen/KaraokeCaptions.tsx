import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../../design-system';
import {LAYOUT} from './shared';
import {NOTGROSCHEN_WORD_TIMINGS} from './word-timings';

type IndexedWord={word:string;index:number};

const balance=(words:string[]):IndexedWord[][]=>{
  const indexed=words.map((word,index)=>({word,index}));
  if(words.length<5)return[indexed];

  let best=Math.ceil(words.length/2);
  let score=Infinity;
  for(let split=2;split<=words.length-2;split+=1){
    const left=words.slice(0,split).join(' ').length;
    const right=words.slice(split).join(' ').length;
    const next=Math.max(left,right)*2+Math.abs(left-right);
    if(next<score){score=next;best=split;}
  }
  return[indexed.slice(0,best),indexed.slice(best)];
};

/** Exactly one spoken sentence, max two lines, no opaque caption box. */
export const NotgroschenKaraokeCaptions:React.FC=()=>{
  const frame=useCurrentFrame();
  if(NOTGROSCHEN_WORD_TIMINGS.length===0)return null;
  if(frame<NOTGROSCHEN_WORD_TIMINGS[0].frames[0])return null;

  let sentenceIndex=0;
  for(let index=1;index<NOTGROSCHEN_WORD_TIMINGS.length;index+=1){
    if(frame>=NOTGROSCHEN_WORD_TIMINGS[index].frames[0])sentenceIndex=index;
    else break;
  }

  const sentence=NOTGROSCHEN_WORD_TIMINGS[sentenceIndex];
  const words=sentence.text.split(/\s+/);
  const lines=balance(words);

  let active=-1;
  for(let index=0;index<words.length;index+=1){
    if(frame>=sentence.frames[index]&&frame<sentence.frames[index+1]){
      active=index;
      break;
    }
  }

  const longest=Math.max(...lines.map((line)=>line.map((item)=>item.word).join(' ').length));
  const fontSize=longest>64?35:longest>56?39:longest>48?42:longest>40?46:50;

  return (
    <div style={{
      position:'absolute',
      left:LAYOUT.subtitleLeft,
      right:LAYOUT.subtitleRight,
      bottom:LAYOUT.subtitleBottom,
      zIndex:100,
      textAlign:'center',
      fontFamily:FONT.body,
      fontWeight:900,
      fontSize,
      lineHeight:1.12,
      letterSpacing:-.45,
      color:C.white,
      textShadow:'0 3px 6px rgba(0,0,0,.98),0 0 20px rgba(0,0,0,.88)',
    }}>
      {lines.map((line,lineIndex)=>(
        <div key={`${sentence.id}-${lineIndex}`} style={{whiteSpace:'nowrap',marginTop:lineIndex?6:0}}>
          {line.map(({word,index},position)=>(
            <React.Fragment key={`${sentence.id}-${index}`}>
              {position>0?' ':null}
              <span style={{
                color:index===active?C.accentLt:C.white,
                textShadow:index===active
                  ?`0 0 18px ${C.accent},0 3px 6px rgba(0,0,0,.98)`
                  :'0 3px 6px rgba(0,0,0,.98),0 0 20px rgba(0,0,0,.88)',
              }}>{word}</span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};
