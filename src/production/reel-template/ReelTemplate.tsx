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

const formatTemplateNumber = (
  value: number,
  format: NumberBeat['format'],
): string => {
  if (format === 'euro') {
    return `${Math.round(value).toLocaleString('de-DE')} €`;
  }

  if (format === 'percent') {
    return `${value.toLocaleString('de-DE', {maximumFractionDigits: 2})} %`;
  }

  return value.toLocaleString('de-DE', {maximumFractionDigits: 2});
};

const toneColor = (tone: CompareBeat['left']['tone']): string => {
  if (tone === 'positive') return ANIMATION_COLORS.positive;
  if (tone === 'negative') return ANIMATION_COLORS.warning;
  return ANIMATION_COLORS.neutralText;
};

const SourceNote: React.FC<{children?: string}> = ({children}) => {
  if (!children) return null;

  return (
    <div style={{
      position: 'absolute',
      left: 64,
      right: 64,
      bottom: SAFE_AREA.bottomPx + 18,
      color: a(C.whiteSoft, 0.72),
      fontFamily: FONT.body,
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.25,
      textAlign: 'center',
    }}>
      {children}
    </div>
  );
};

const CenterArea: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{
    position: 'absolute',
    top: SAFE_AREA.topPx,
    bottom: SAFE_AREA.bottomPx,
    left: CONTENT_HORIZONTAL_PADDING,
    right: CONTENT_HORIZONTAL_PADDING,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {children}
  </div>
);

const CompareCard: React.FC<{
  label: string;
  value: string;
  detail?: string;
  tone?: CompareBeat['left']['tone'];
  delay: number;
}> = ({label, value, detail, tone, delay}) => {
  const frame = useCurrentFrame();
  const appear = prog(frame, delay, delay + 12);
  const color = toneColor(tone);

  return (
    <div style={{
      width: 420,
      minHeight: 470,
      borderRadius: 34,
      border: `2px solid ${a(color, 0.45)}`,
      background: 'rgba(255,255,255,0.055)',
      boxShadow: '0 26px 80px rgba(0,0,0,0.36)',
      padding: '52px 38px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 30}px)`,
    }}>
      <div style={{fontFamily: FONT.body, fontSize: 30, fontWeight: 800, color: C.whiteSoft, letterSpacing: 2}}>
        {label.toUpperCase()}
      </div>
      <div style={{fontFamily: FONT.title, fontSize: 100, lineHeight: 1, color, marginTop: 30}}>
        {value}
      </div>
      {detail && <div style={{fontFamily: FONT.body, fontSize: 30, lineHeight: 1.3, color: C.white, marginTop: 34}}>
        {detail}
      </div>}
    </div>
  );
};

const ReelBeatView: React.FC<{beat: ReelBeat}> = ({beat}) => {
  const frame = useCurrentFrame();

  if (beat.type === 'hook') {
    return (
      <AbsoluteFill>
        <FinanceBackground variant={beat.background ?? 'premium'} />
        <SceneHeader title={beat.kicker ?? beat.headline} icon={beat.icon} tone={beat.headerTone} at={2} />
        <CenterArea>
          <div style={{textAlign: 'center', width: '100%', marginTop: 88}}>
            <Title at={4} size={126}>{beat.headline}</Title>
            {beat.accent && <div style={{
              marginTop: 26,
              fontFamily: FONT.title,
              fontSize: 114,
              color: ANIMATION_COLORS.focus,
              opacity: prog(frame, 14, 26),
              textShadow: '0 0 28px rgba(0,210,106,0.22)',
            }}>{beat.accent}</div>}
            {beat.subline && <Body at={22} size={43} color={C.whiteSoft} style={{marginTop: 34}}>{beat.subline}</Body>}
          </div>
        </CenterArea>
        <SourceNote>{beat.sourceNote}</SourceNote>
      </AbsoluteFill>
    );
  }

  if (beat.type === 'explain') {
    return (
      <AbsoluteFill>
        <FinanceBackground variant={beat.background ?? 'standard'} />
        <SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={2} />
        <CenterArea>
          <div style={{width: '100%', textAlign: 'center'}}>
            <Body at={4} size={46} style={{maxWidth: 880, margin: '0 auto'}}>{beat.body}</Body>
            {beat.bullets && <div style={{marginTop: 54, display: 'grid', gap: 24}}>
              {beat.bullets.map((item, index) => {
                const appear = prog(frame, 16 + index * 8, 28 + index * 8);
                return <div key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  padding: '22px 30px',
                  borderRadius: 22,
                  background: 'rgba(255,255,255,0.055)',
                  border: `1px solid ${a(C.accent, 0.22)}`,
                  color: C.white,
                  fontFamily: FONT.body,
                  fontSize: 35,
                  fontWeight: 700,
                  textAlign: 'left',
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * 28}px)`,
                }}>
                  <span style={{color: ANIMATION_COLORS.focus, fontSize: 32}}>✓</span>
                  <span>{item}</span>
                </div>;
              })}
            </div>}
          </div>
        </CenterArea>
        <SourceNote>{beat.sourceNote}</SourceNote>
      </AbsoluteFill>
    );
  }

  if (beat.type === 'number') {
    return (
      <AbsoluteFill>
        <FinanceBackground variant={beat.background ?? 'data'} />
        <SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={2} />
        <CenterArea>
          <div style={{textAlign: 'center', width: '100%'}}>
            <div style={{fontFamily: FONT.body, fontSize: 32, fontWeight: 800, letterSpacing: 4, color: C.whiteSoft}}>
              {beat.label.toUpperCase()}
            </div>
            <div style={{marginTop: 26}}>
              <DramaticNumber
                to={beat.value}
                format={(value) => formatTemplateNumber(value, beat.format)}
                fontSize={174}
                color={ANIMATION_COLORS.money}
                startAt={10}
                durationFrames={72}
              />
            </div>
            {beat.detail && <Body at={62} size={39} color={C.white} style={{marginTop: 40}}>{beat.detail}</Body>}
            {beat.assumptions && <div style={{
              marginTop: 28,
              color: C.whiteSoft,
              fontFamily: FONT.body,
              fontSize: 25,
              fontWeight: 600,
              lineHeight: 1.3,
            }}>{beat.assumptions}</div>}
          </div>
        </CenterArea>
        <SourceNote>{beat.sourceNote}</SourceNote>
      </AbsoluteFill>
    );
  }

  if (beat.type === 'compare') {
    return (
      <AbsoluteFill>
        <FinanceBackground variant={beat.background ?? 'data'} />
        <SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={2} />
        <CenterArea>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, width: '100%'}}>
            <CompareCard {...beat.left} delay={6} />
            <div style={{fontFamily: FONT.title, fontSize: 70, color: C.whiteSoft}}>VS</div>
            <CompareCard {...beat.right} delay={16} />
          </div>
        </CenterArea>
        <SourceNote>{beat.sourceNote}</SourceNote>
      </AbsoluteFill>
    );
  }

  if (beat.type === 'checklist') {
    return (
      <AbsoluteFill>
        <FinanceBackground variant={beat.background ?? 'standard'} />
        <SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={2} />
        <CenterArea>
          <div style={{display: 'grid', gap: 22, width: '100%'}}>
            {beat.items.map((item, index) => {
              const appear = prog(frame, 6 + index * 9, 18 + index * 9);
              return <div key={item} style={{
                minHeight: 98,
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '20px 30px',
                borderRadius: 24,
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${a(C.accent, 0.26)}`,
                fontFamily: FONT.body,
                fontSize: 37,
                fontWeight: 700,
                color: C.white,
                opacity: appear,
                transform: `translateY(${(1 - appear) * 24}px)`,
              }}>
                <span style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: a(C.accent, 0.16),
                  color: ANIMATION_COLORS.focus,
                  fontSize: 30,
                }}>✓</span>
                <span>{item}</span>
              </div>;
            })}
          </div>
        </CenterArea>
        <SourceNote>{beat.sourceNote}</SourceNote>
      </AbsoluteFill>
    );
  }

  if (beat.type === 'image') {
    return (
      <AbsoluteFill>
        <FinanceBackground variant={beat.background ?? 'standard'} />
        <SceneHeader title={beat.headline} icon={beat.icon} tone={beat.headerTone} at={2} />
        <CenterArea>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 30,
          }}>
            <Img
              src={staticFile(beat.imageSrc)}
              alt={beat.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: beat.objectFit ?? 'contain',
              }}
            />
          </div>
        </CenterArea>
        <SourceNote>{beat.sourceNote}</SourceNote>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <FinanceBackground variant={beat.background ?? 'premium'} />
      <SceneHeader title={beat.kicker ?? 'DEIN NÄCHSTER SCHRITT'} icon={beat.icon} tone={beat.headerTone} at={2} />
      <CenterArea>
        <div style={{textAlign: 'center', width: '100%', marginTop: 80}}>
          <Title at={4} size={112}>{beat.headline}</Title>
          <Body at={18} size={42} color={C.whiteSoft} style={{marginTop: 34}}>{beat.body}</Body>
          {beat.keyword && beat.offer && <div style={{
            marginTop: 54,
            borderRadius: 28,
            padding: '30px 34px',
            background: a(C.accent, 0.12),
            border: `2px solid ${a(C.accent, 0.48)}`,
            fontFamily: FONT.body,
            fontSize: 34,
            fontWeight: 800,
            color: C.white,
          }}>
            Kommentiere <span style={{color: ANIMATION_COLORS.focus}}>„{beat.keyword}“</span><br />
            <span style={{fontSize: 29, color: C.whiteSoft}}>{beat.offer}</span>
          </div>}
        </div>
      </CenterArea>
      <SourceNote>{beat.sourceNote}</SourceNote>
    </AbsoluteFill>
  );
};

export const ReelTemplate: React.FC<{config: ReelConfig}> = ({config}) => {
  const errors = validateReelConfig(config);
  if (errors.length > 0) {
    throw new Error(`Ungültige FinanzNeo-Reel-Konfiguration:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  }

  return (
    <AbsoluteFill style={{background: C.bg}}>
      {config.audioSrc && <Audio src={staticFile(config.audioSrc)} />}

      <Series>
        {config.beats.map((beat) => (
          <Series.Sequence key={beat.id} durationInFrames={beat.durationInFrames}>
            <ReelBeatView beat={beat} />
          </Series.Sequence>
        ))}
      </Series>

      <div style={{
        position: 'absolute',
        top: 22,
        right: 30,
        color: a(C.whiteSoft, 0.52),
        fontFamily: FONT.body,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 1.4,
      }}>
        {config.disclaimer ?? 'KEINE ANLAGEBERATUNG'}
      </div>

      {config.captions && config.captions.length > 0 && (
        <Captions words={config.captions} size={58} bottom={320} left={62} right={150} />
      )}

      <VerticalSafeAreaGuide enabled={config.showSafeAreaGuide ?? false} />
    </AbsoluteFill>
  );
};
