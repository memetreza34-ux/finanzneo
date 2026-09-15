import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FinanceEyebrow, FinanceValue, MotionStage, progressBetween} from '../../motion-kit';

export const MECHANIC_ID = 'essential-budget-assembly';
export const VISUAL_TECHNIQUE_ID = 'category-to-total-ledger';
export const COMPOSITION_FAMILY_ID = 'document-motion';
export const ANIMATION_NARRATIVE = {START:'Leeres notwendiges Monatsbudget', MECHANISM:'Kostenkategorien setzen sich zusammen', RESULT:'Beispiel-Gesamtwert 1.500 €'};

const CategoryGlyph: React.FC<{kind:string}> = ({kind}) => {
  if (kind === 'Miete') return <svg width="74" height="74" viewBox="0 0 74 74"><path d="M10 35 L37 12 L64 35 V63 H18 V35" fill="none" stroke={COLORS.white} strokeWidth="6" strokeLinejoin="round"/><rect x="31" y="44" width="13" height="19" fill={COLORS.green}/></svg>;
  if (kind === 'Lebensmittel') return <svg width="74" height="74" viewBox="0 0 74 74"><path d="M18 24 H58 L53 62 H23 Z" fill="none" stroke={COLORS.white} strokeWidth="6"/><path d="M27 24 Q30 10 38 10 Q49 10 50 24" fill="none" stroke={COLORS.green} strokeWidth="6"/><circle cx="31" cy="67" r="4" fill={COLORS.white}/><circle cx="49" cy="67" r="4" fill={COLORS.white}/></svg>;
  if (kind === 'Strom') return <svg width="74" height="74" viewBox="0 0 74 74"><path d="M43 7 L19 41 H35 L29 68 L56 31 H40 Z" fill={COLORS.gold}/></svg>;
  if (kind === 'Versicherungen') return <svg width="74" height="74" viewBox="0 0 74 74"><path d="M37 7 L61 16 V35 Q61 57 37 68 Q13 57 13 35 V16 Z" fill="none" stroke={COLORS.white} strokeWidth="6"/><path d="M25 36 L33 44 L50 26" fill="none" stroke={COLORS.green} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg width="74" height="74" viewBox="0 0 74 74"><path d="M16 42 L24 24 H52 L60 42 V57 H14 V42 Z" fill="none" stroke={COLORS.white} strokeWidth="6" strokeLinejoin="round"/><circle cx="25" cy="58" r="7" fill={COLORS.green}/><circle cx="50" cy="58" r="7" fill={COLORS.green}/><line x1="24" y1="34" x2="52" y2="34" stroke={COLORS.gray} strokeWidth="5"/></svg>;
};

export const YouTubeVisual09Animation: React.FC = () => {
  const frame=useCurrentFrame();
  const {durationInFrames}=useVideoConfig();
  const categories=['Miete','Lebensmittel','Strom','Versicherungen','Mobilität'];
  const angles=[-145,-78,-10,58,128];
  const progresses=categories.map((_,i)=>progressBetween(frame,durationInFrames,0.06+i*0.12,0.30+i*0.12));
  const assembled=progresses.reduce((sum,p)=>sum+p,0);
  const total=Math.round(1500*Math.min(1,assembled/categories.length));
  const finish=progressBetween(frame,durationInFrames,0.72,0.96);

  return <MotionStage>
    <FinanceEyebrow style={{position:'absolute',left:120,top:86}}>Dein echter Bedarf beginnt bei notwendigen Ausgaben</FinanceEyebrow>
    <div style={{position:'absolute',left:120,top:145,fontSize:54,fontWeight:900}}>Was muss jeden Monat wirklich bezahlt werden?</div>

    <div style={{position:'absolute',left:180,top:215,width:1080,height:760}}>
      <svg width="1080" height="760" viewBox="0 0 1080 760" style={{position:'absolute',inset:0}}>
        <circle cx="540" cy="385" r="258" fill="none" stroke="#1D2226" strokeWidth="3" strokeDasharray="9 15"/>
        <circle cx="540" cy="385" r="185" fill="#0D1113" stroke={COLORS.green} strokeWidth="4" opacity={0.9}/>
      </svg>

      {categories.map((name,i)=>{
        const p=progresses[i];
        const angle=(angles[i]-36*(1-p))*Math.PI/180;
        const radius=interpolate(p,[0,1],[425,270]);
        const x=540+Math.cos(angle)*radius-72;
        const y=385+Math.sin(angle)*radius-72;
        return <div key={name} style={{position:'absolute',left:x,top:y,width:144,height:144,borderRadius:72,background:'#111518',border:`3px solid ${p>0.92?COLORS.green:COLORS.line}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:`scale(${0.84+p*0.16})`,boxShadow:p>0.92?'0 0 32px rgba(45,216,129,0.16)':'none'}}>
          <CategoryGlyph kind={name}/>
          <div style={{fontSize:20,fontWeight:900,marginTop:2}}>{name}</div>
        </div>;
      })}

      <div style={{position:'absolute',left:355,top:280,width:370,height:220,textAlign:'center',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{fontSize:27,color:COLORS.gray,fontWeight:800}}>Beispiel pro Monat</div>
        <FinanceValue color={COLORS.green} style={{fontSize:86,marginTop:16}}>{total.toLocaleString('de-DE')} €</FinanceValue>
        <div style={{fontSize:24,color:COLORS.gray,marginTop:12}}>notwendige Ausgaben</div>
      </div>
    </div>

    <div style={{position:'absolute',right:115,top:330,width:500,opacity:finish,transform:`translateY(${(1-finish)*45}px)`}}>
      <div style={{fontSize:31,color:COLORS.gray,lineHeight:1.4}}>Nicht dein Einkommen entscheidet allein, sondern was dein Alltag im Notfall weiter kostet.</div>
      <div style={{height:4,width:180,background:COLORS.green,marginTop:34}}/>
      <div style={{fontSize:46,fontWeight:900,marginTop:28}}>Hier im Beispiel:</div>
      <FinanceValue color={COLORS.white} style={{marginTop:10}}>1.500 €</FinanceValue>
    </div>
  </MotionStage>;
};
