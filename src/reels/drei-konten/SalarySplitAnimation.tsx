import React from 'react';
import {spring, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../design-system';
import {SCENE_COPY} from './config';
import {Headline, SceneBackground, VisualStage, clamp, clamp01} from './shared';

const AccountCard: React.FC<{
  label: string;
  icon: string;
  delay: number;
  revealDuration: number;
  active?: boolean;
}> = ({label, icon, delay, revealDuration, active = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = clamp01(
    spring({
      frame: frame - delay,
      fps,
      config: {damping: 17, stiffness: 170, mass: 0.75},
      durationInFrames: revealDuration,
    }),
  );

  return (
    <div
      style={{
        width: 270,
        minHeight: 238,
        borderRadius: 32,
        padding: '24px 20px',
        background: active ? a(C.accent, 0.17) : 'rgba(255,255,255,0.055)',
        border: `2px solid ${active ? a(C.accentLt, 0.62) : 'rgba(255,255,255,0.12)'}`,
        boxShadow: active ? `0 22px 70px ${a(C.accent, 0.2)}` : '0 22px 70px rgba(0,0,0,.22)',
        transform: `translateY(${(1 - reveal) * 70}px) scale(${0.84 + reveal * 0.16})`,
        opacity: reveal,
        textAlign: 'center',
      }}
    >
      <div style={{fontFamily: FONT.title, fontSize: 58, lineHeight: 1, color: C.gold}}>{icon}</div>
      <div
        style={{
          fontFamily: FONT.title,
          fontSize: 50,
          color: active ? C.accentLt : C.white,
          marginTop: 20,
          letterSpacing: 1.2,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SalarySplitAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const copy = SCENE_COPY[3];
  const dropDuration = Math.max(24, Math.round(durationInFrames * 0.24));
  const splitStart = Math.round(durationInFrames * 0.18);
  const splitDuration = Math.max(24, Math.round(durationInFrames * 0.22));
  const firstCard = Math.round(durationInFrames * 0.31);
  const cardStep = Math.max(6, Math.round(durationInFrames * 0.055));
  const cardRevealDuration = Math.max(22, Math.round(durationInFrames * 0.18));

  const drop = clamp01(
    spring({
      frame,
      fps,
      config: {damping: 18, stiffness: 140, mass: 0.8},
      durationInFrames: dropDuration,
    }),
  );
  const split = clamp01(
    spring({
      frame: frame - splitStart,
      fps,
      config: {damping: 20, stiffness: 155, mass: 0.75},
      durationInFrames: splitDuration,
    }),
  );
  const coinY = interpolate(drop, [0, 1], [-170, 150], clamp);

  return (
    <SceneBackground>
      <Headline headline={copy.headline} accent={copy.accent} accentTone={copy.accentTone} icon={copy.icon} />
      <VisualStage>
        <div
          style={{
            position: 'absolute',
            top: coinY,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 156,
            height: 156,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: `radial-gradient(circle at 35% 28%, ${C.goldLt}, ${C.gold} 55%, #A96F00 100%)`,
            border: '9px solid rgba(255,255,255,.25)',
            boxShadow: `0 22px 80px ${a(C.gold, 0.34)}`,
            color: '#382400',
            fontFamily: FONT.title,
            fontSize: 70,
            zIndex: 4,
          }}
        >
          €
        </div>
        <div
          style={{
            position: 'absolute',
            top: 400,
            left: '50%',
            transform: `translateX(-50%) scale(${0.7 + split * 0.3})`,
            width: 210,
            height: 118,
            borderRadius: 28,
            display: 'grid',
            placeItems: 'center',
            background: C.accent,
            color: C.bg,
            fontFamily: FONT.body,
            fontWeight: 900,
            fontSize: 33,
            boxShadow: `0 20px 80px ${a(C.accent, 0.35)}`,
            opacity: split,
            zIndex: 5,
          }}
        >
          ZAHLTAG
        </div>
        {[-1, 0, 1].map((direction) => (
          <div
            key={direction}
            style={{
              position: 'absolute',
              top: 508,
              left: '50%',
              width: Math.abs(direction) === 1 ? 300 : 8,
              height: Math.abs(direction) === 1 ? 8 : 138,
              background: C.accent,
              transformOrigin: direction < 0 ? 'right center' : 'left center',
              transform:
                direction === 0
                  ? `translateX(-4px) scaleY(${split})`
                  : `translateX(${direction < 0 ? -300 : 0}px) rotate(${direction * 16}deg) scaleX(${split})`,
              boxShadow: `0 0 20px ${a(C.accent, 0.5)}`,
              borderRadius: 999,
              opacity: split,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            top: 650,
            left: 66,
            right: 66,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <AccountCard label="FIXKOSTEN" icon="01" delay={firstCard} revealDuration={cardRevealDuration} />
          <AccountCard label="RÜCKLAGE" icon="02" delay={firstCard + cardStep} revealDuration={cardRevealDuration} active />
          <AccountCard label="WOCHE" icon="03" delay={firstCard + cardStep * 2} revealDuration={cardRevealDuration} />
        </div>
      </VisualStage>
    </SceneBackground>
  );
};
