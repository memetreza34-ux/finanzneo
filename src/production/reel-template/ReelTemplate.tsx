import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Series,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  ANIMATION_COLORS,
  C,
  FONT,
  FORMAT,
  REEL_STYLE,
  SAFE_AREA,
  a,
  Body,
  Captions,
  DramaticNumber,
  FinanceBackground,
  SceneHeader,
  Title,
  VerticalSafeAreaGuide,
  prog,
} from '../../design-system';
import type {
  CompareBeat,
  NumberBeat,
  ReelBeat,
  ReelConfig,
} from './types';
import {validateReelConfig} from './types';

const CONTENT_HORIZONTAL_PADDING = 72;
const CONTENT_TOP = REEL_STYLE.visual.top;
const CONTENT_BOTTOM = FORMAT.vertical.height - REEL_STYLE.visual.bottom;
const CONTINUITY_FRAMES = REEL_STYLE.transition.continuityFrames;
const REEL_CANVAS_BLACK = '#000000';

/**
 * Phase-1-Animationskomponenten werden ausschließlich über diesen Mapping-Key
 * eingebunden. Fehlende Bindings sind ein harter Renderfehler und dürfen nie
 * still auf CTA, Text oder einen anderen Fallback fallen.
 */
export type ReelAnimationMap = Record<string, React.ReactNode>;

const formatTemplateNumber = (
  value: number,
  format: NumberBeat['format'],
): string => {
  if (format === 'euro') return `${Math.round(value).toLocaleString('de-DE')} €`;
  if (format === 'percent') return `${value.toLocaleString('de-DE', {maximumFractionDigits: 2})} %`;
  return value.toLocaleString('de-DE', {maximumFractionDigits: 2});
};

const toneColor = (tone: CompareBeat['left']['tone']): string => {
  if (tone === 'positive') return ANIMATION_COLORS.positive;
  if (tone === 'negative') return ANIMATION_COLORS.warning;
  return ANIMATION_COLORS.neutralText;
};

const SceneContinuityFrame: React.FC<{durationInFrames: number; children: React.ReactNode}> = ({durationInFrames, children}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, 0, CONTINUITY_FRAMES);
  const leave = prog(
    frame,
    Math.max(0, durationInFrames - CONTINUITY_FRAMES),
    Math.max(1, durationInFrames - 1),
  );
  const opacity = Math.min(1, 0.92 + enter * 0.08 - leave * 0.04);
  const translateY = (1 - enter) * 4 - leave * 2;

  return (
    <AbsoluteFill style={{opacity, transform: `translateY(${translateY}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

const SourceNote: React.FC<{children?: string}> = ({children}) => {
  if (!children) return null;
  return (
    <div style={{
      position: 'absolute', left: 72, right: 140, bottom: SAFE_AREA.bottomPx + 8,
      color: a(C.whiteSoft, 0.74), fontFamily: FONT.body, fontSize: 21, fontWeight: 650,
      lineHeight: 1.22, textAlign: 'center', textShadow: '0 2px 7px rgba(0,0,0,0.55)',
    }}>
      {children}
    </div>
  );
};

const CenterArea: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{
    position: 'absolute', top: CONTENT_TOP, bottom: CONTENT_BOTTOM,
    left: CONTENT_HORIZONTAL_PADDING, right: CONTENT_HORIZONTAL_PADDING,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {children}
  </div>
);

const CompareCard: React.FC<{
  label: string; value: string; detail?: string; tone?: CompareBeat['left']['tone']; delay: number;
}> = ({label, value, detail, tone, delay}) => {
  const frame = useCurrentFrame();
  const appear = prog(frame, delay, delay + 10);
  const color = toneColor(tone);
  return (
    <div style={{
      width: 420, minHeight: 470, borderRadius: 34, border: `2px solid ${a(color, 0.45)}`,
      background: 'rgba(255,255,255,0.055)', boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
      padding: '52px 38px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', opacity: appear, transform: `translateY(${(1 - appear) * 20}px)`,
    }}>
      <div style={{fontFamily: FONT.body, fontSize: 30, fontWeight: 800, color: C.whiteSoft, letterSpacing: 2}}>{label.toUpperCase()}</div>
      <div style={{fontFamily: FONT.title, fontSize: 100, lineHeight: 1, color, marginTop: 30}}>{value}</div>
      {detail && <div style={{fontFamily: FONT.body, fontSize: 30, lineHeight: 1.3, color: C.white, marginTop: 34}}>{detail}</div>}
    </div>
  );
};

const ReelBeatView: React.FC<{
  beat: ReelBeat;
  customAnimations?: ReelAnimationMap;
}> = ({beat, customAnimations}) => {
  const frame = useCurrentFrame();

  if (beat.type === 'hook') {
    return <AbsoluteFill><FinanceBackground variant={beat.background ?? 'premium'} /><SceneHeader title={beat.kicker ?? beat.headline} icon={beat.icon} tone={beat.headerTone} at={0} /><CenterArea><div style={{textAlign:'center',width:'100%',marginTop:72}}><Title at={4} size={122}>{beat.headline}</Title>{beat.accent && <div style={{marginTop:24,fontFamily:FONT.title,fontSize:108,color:ANIMATION_COLORS.focus,opacity:prog(frame,14,25)}}>{beat.accent}</div>}{beat.subline && <Body at={22} size={42} color={C.whiteSoft} style={{marginTop:30}}>{beat.subline}</Body>}</div></CenterArea><SourceNote>{beat.sourceNote}</SourceNote></AbsoluteFill>;
  }

  if (beat.type === 'explain') {
    return <AbsoluteFill><FinanceBackground variant={beat.background ?? 'standard'} /><SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={0} /><CenterArea><div style={{width:'100%',textAlign:'center'}}><Body at={4} size={46} style={{maxWidth:880,margin:'0 auto'}}>{beat.body}</Body>{beat.bullets && <div style={{marginTop:50,display:'grid',gap:22}}>{beat.bullets.map((item,index)=>{const appear=prog(frame,16+index*8,27+index*8);return <div key={item} style={{display:'flex',alignItems:'center',gap:22,padding:'22px 30px',borderRadius:22,background:'rgba(255,255,255,0.055)',border:`1px solid ${a(C.accent,0.22)}`,color:C.white,fontFamily:FONT.body,fontSize:35,fontWeight:700,textAlign:'left',opacity:appear,transform:`translateX(${(1-appear)*22}px)`}}><span style={{color:ANIMATION_COLORS.focus,fontSize:32}}>✓</span><span>{item}</span></div>})}</div>}</div></CenterArea><SourceNote>{beat.sourceNote}</SourceNote></AbsoluteFill>;
  }

  if (beat.type === 'number') {
    return <AbsoluteFill><FinanceBackground variant={beat.background ?? 'data'} /><SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={0} /><CenterArea><div style={{textAlign:'center',width:'100%'}}><div style={{fontFamily:FONT.body,fontSize:32,fontWeight:800,letterSpacing:4,color:C.whiteSoft}}>{beat.label.toUpperCase()}</div><div style={{marginTop:24}}><DramaticNumber to={beat.value} format={(value)=>formatTemplateNumber(value,beat.format)} fontSize={174} color={ANIMATION_COLORS.money} startAt={10} durationFrames={72}/></div>{beat.detail && <Body at={62} size={39} color={C.white} style={{marginTop:36}}>{beat.detail}</Body>}{beat.assumptions && <div style={{marginTop:26,color:C.whiteSoft,fontFamily:FONT.body,fontSize:25,fontWeight:600,lineHeight:1.3}}>{beat.assumptions}</div>}</div></CenterArea><SourceNote>{beat.sourceNote}</SourceNote></AbsoluteFill>;
  }

  if (beat.type === 'compare') {
    return <AbsoluteFill><FinanceBackground variant={beat.background ?? 'data'} /><SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={0} /><CenterArea><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:32,width:'100%'}}><CompareCard {...beat.left} delay={6}/><div style={{fontFamily:FONT.title,fontSize:64,color:C.whiteSoft}}>VS</div><CompareCard {...beat.right} delay={16}/></div></CenterArea><SourceNote>{beat.sourceNote}</SourceNote></AbsoluteFill>;
  }

  if (beat.type === 'checklist') {
    return <AbsoluteFill><FinanceBackground variant={beat.background ?? 'standard'} /><SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={0} /><CenterArea><div style={{display:'grid',gap:20,width:'100%'}}>{beat.items.map((item,index)=>{const appear=prog(frame,6+index*9,18+index*9);return <div key={item} style={{minHeight:98,display:'flex',alignItems:'center',gap:26,padding:'20px 30px',borderRadius:24,background:'rgba(255,255,255,0.06)',border:`1px solid ${a(C.accent,0.26)}`,fontFamily:FONT.body,fontSize:37,fontWeight:700,color:C.white,opacity:appear,transform:`translateY(${(1-appear)*18}px)`}}><span style={{width:50,height:50,borderRadius:16,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,background:a(C.accent,0.16),color:ANIMATION_COLORS.focus,fontSize:30}}>✓</span><span>{item}</span></div>})}</div></CenterArea><SourceNote>{beat.sourceNote}</SourceNote></AbsoluteFill>;
  }

  if (beat.type === 'image') {
    return <AbsoluteFill><FinanceBackground variant={beat.background ?? 'standard'} /><SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={0} /><CenterArea><div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',borderRadius:30}}><Img src={staticFile(beat.imageSrc)} alt={beat.alt} style={{width:'100%',height:'100%',objectFit:beat.objectFit ?? 'contain',transform:'scale(1.03)'}} /></div></CenterArea><SourceNote>{beat.sourceNote}</SourceNote></AbsoluteFill>;
  }

  if (beat.type === 'animation') {
    const animation = customAnimations?.[beat.animationId];
    if (animation === undefined || animation === null) {
      throw new Error(`MISSING ANIMATION BINDING: ${beat.id} erwartet customAnimations["${beat.animationId}"]. Render wird abgebrochen.`);
    }
    return (
      <AbsoluteFill>
        <FinanceBackground variant={beat.background ?? 'standard'} />
        {animation}
        <SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={0} />
        <SourceNote>{beat.sourceNote}</SourceNote>
      </AbsoluteFill>
    );
  }

  return <AbsoluteFill><FinanceBackground variant={beat.background ?? 'premium'} /><SceneHeader title={beat.kicker ?? 'Dein nächster Schritt'} icon={beat.icon} tone={beat.headerTone} at={0} /><CenterArea><div style={{textAlign:'center',width:'100%',marginTop:66}}><Title at={4} size={108}>{beat.headline}</Title><Body at={18} size={42} color={C.whiteSoft} style={{marginTop:30}}>{beat.body}</Body>{beat.keyword && beat.offer && <div style={{marginTop:48,borderRadius:28,padding:'28px 34px',background:a(C.accent,0.12),border:`2px solid ${a(C.accent,0.48)}`,fontFamily:FONT.body,fontSize:34,fontWeight:800,color:C.white}}>Kommentiere <span style={{color:ANIMATION_COLORS.focus}}>„{beat.keyword}“</span><br/><span style={{fontSize:29,color:C.whiteSoft}}>{beat.offer}</span></div>}</div></CenterArea><SourceNote>{beat.sourceNote}</SourceNote></AbsoluteFill>;
};

export const ReelTemplate: React.FC<{
  config: ReelConfig;
  customAnimations?: ReelAnimationMap;
}> = ({config, customAnimations}) => {
  const errors = validateReelConfig(config);

  // Harte Vollständigkeitsprüfung: Jede Animation im Config muss vor dem Render
  // tatsächlich gebunden sein. Ein fehlendes Mapping darf NIE still in CTA,
  // Caption-only oder einen technischen Platzhalter fallen.
  for (const beat of config.beats) {
    if (beat.type !== 'animation') continue;
    const animation = customAnimations?.[beat.animationId];
    if (animation === undefined || animation === null) {
      errors.push(`Animation-Binding fehlt: ${beat.id} -> customAnimations["${beat.animationId}"].`);
    }
  }

  if (errors.length > 0) throw new Error(`Ungültige FinanzNeo-Reel-Konfiguration:\n${errors.map((error)=>`- ${error}`).join('\n')}`);

  return (
    <AbsoluteFill data-finanzneo-canvas="pure-black-v1" style={{backgroundColor: REEL_CANVAS_BLACK}}>
      {config.audioSrc && <Audio src={staticFile(config.audioSrc)} />}
      <Series>
        {config.beats.map((beat)=>(
          <Series.Sequence key={beat.id} durationInFrames={beat.durationInFrames}>
            <SceneContinuityFrame durationInFrames={beat.durationInFrames}>
              <ReelBeatView beat={beat} customAnimations={customAnimations}/>
            </SceneContinuityFrame>
          </Series.Sequence>
        ))}
      </Series>
      <div style={{position:'absolute',top:22,right:30,color:a(C.whiteSoft,0.52),fontFamily:FONT.body,fontSize:18,fontWeight:700,letterSpacing:1.4}}>{config.disclaimer ?? 'KEINE ANLAGEBERATUNG'}</div>
      {config.captions && config.captions.length > 0 && <Captions words={config.captions} />}
      <VerticalSafeAreaGuide enabled={config.showSafeAreaGuide ?? false} />
    </AbsoluteFill>
  );
};
